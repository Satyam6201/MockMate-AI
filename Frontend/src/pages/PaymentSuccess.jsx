import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('verifying'); // verifying, success, error

    useEffect(() => {
        const verifyPayment = async () => {
            const sessionId = searchParams.get('session_id');
            if (!sessionId) {
                setStatus('error');
                return;
            }

            try {
                const result = await axios.post(serverUrl + "/api/payment/verify-session", {
                    sessionId
                }, { withCredentials: true });

                if (result.data.success) {
                    dispatch(setUserData(result.data.user));
                    setStatus('success');
                    setTimeout(() => {
                        navigate("/");
                    }, 3000);
                } else {
                    setStatus('error');
                }
            } catch (error) {
                console.error("Verification failed", error);
                setStatus('error');
            }
        };

        verifyPayment();
    }, [searchParams, dispatch, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                {status === 'verifying' && (
                    <div className="flex flex-col items-center">
                        <FaSpinner className="animate-spin text-emerald-500 text-5xl mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800">Verifying Payment...</h2>
                        <p className="text-gray-500 mt-2">Please wait while we confirm your transaction.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <FaCheckCircle className="text-emerald-500 text-6xl mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
                        <p className="text-gray-500 mt-2">Your credits have been added to your account.</p>
                        <p className="text-sm text-gray-400 mt-4">Redirecting you to the dashboard...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-red-500 text-3xl font-bold">!</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
                        <p className="text-gray-500 mt-2">There was an issue verifying your payment. If you were charged, please contact support.</p>
                        <button 
                            onClick={() => navigate("/")}
                            className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
