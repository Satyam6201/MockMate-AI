import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HelpCenter = () => {
    const navigate = useNavigate();
    return (
        <div className='min-h-screen bg-gray-50 p-6 md:p-12'>
            <button onClick={() => navigate("/")} className='mb-6 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
                <FaArrowLeft className='text-gray-600'/>
            </button>
            <div className='max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm'>
                <h1 className='text-3xl font-bold text-gray-800 mb-6'>Help Center & FAQ</h1>
                
                <div className='space-y-6'>
                    <div>
                        <h3 className='text-lg font-semibold text-gray-800'>What is MockMate AI?</h3>
                        <p className='text-gray-600 mt-1'>MockMate AI is an intelligent platform that simulates real job interviews to help you practice and improve your communication skills.</p>
                    </div>
                    <div>
                        <h3 className='text-lg font-semibold text-gray-800'>My microphone isn't working?</h3>
                        <p className='text-gray-600 mt-1'>Ensure you have granted microphone permissions in your browser. Try refreshing the page and clicking 'Allow' when prompted.</p>
                    </div>
                    <div>
                        <h3 className='text-lg font-semibold text-gray-800'>How do payment and credits work?</h3>
                        <p className='text-gray-600 mt-1'>We use Stripe for secure payments. Once you purchase a plan, interview credits are instantly added to your account.</p>
                    </div>
                    <div>
                        <h3 className='text-lg font-semibold text-gray-800'>Can I see my past interviews?</h3>
                        <p className='text-gray-600 mt-1'>Yes! Head over to the 'History' tab on your dashboard to review all past performance reports.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default HelpCenter;