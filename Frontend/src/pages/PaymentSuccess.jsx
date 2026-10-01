import React, { useEffect, useState, useRef } from 'react';
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
    const [status, setStatus] = useState('verifying');
    const verifiedRef = useRef(false);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
            setStatus('error');
            return;
        }

        if (window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname);
        }

        if (verifiedRef.current) return;
        verifiedRef.current = true;

        const verifyPayment = async () => {
            try {
                const result = await axios.post(
                    `${serverUrl}/api/payment/verify-session`, 
                    { sessionId }, 
                    { withCredentials: true }
                );

                if (result.data.success) {
                    dispatch(setUserData(result.data.user));
                    setStatus('success');
                    setTimeout(() => {
                        navigate("/");
                    }, 2500);
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans">
            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100">
                {status === 'verifying' && (
                    <div className="flex flex-col items-center">
                        <FaSpinner className="animate-spin text-emerald-600 text-5xl mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900">Verifying Payment...</h2>
                        <p className="text-slate-500 text-sm mt-2">Please wait while we confirm your transaction.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600 shadow-inner">
                            <FaCheckCircle className="text-3xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Payment Successful!</h2>
                        <p className="text-slate-600 text-sm mt-2">Your credits have been added to your account.</p>
                        <p className="text-xs text-slate-400 mt-4">Redirecting you to the dashboard...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-600 shadow-inner">
                            <span className="text-3xl font-bold">!</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Verification Failed</h2>
                        <p className="text-slate-600 text-sm mt-2">There was an issue verifying your payment. If you were charged, please contact support.</p>
                        <button 
                            onClick={() => navigate("/")}
                            className="mt-6 px-6 py-2.5 bg-emerald-600 text-white font-semibold text-sm rounded-xl hover:bg-emerald-700 transition shadow-sm"
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