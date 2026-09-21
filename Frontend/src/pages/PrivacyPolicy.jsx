import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    return (
        <div className='min-h-screen bg-gray-50 p-6 md:p-12'>
            <button onClick={() => navigate("/")} className='mb-6 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
                <FaArrowLeft className='text-gray-600'/>
            </button>
            <div className='max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm'>
                <h1 className='text-3xl font-bold text-gray-800 mb-6'>Privacy Policy</h1>
                
                <h2 className='text-xl font-semibold text-gray-800 mt-6 mb-2'>1. Data Collection</h2>
                <p className='text-gray-600'>We collect your name, email, and the audio/text data from your mock interviews to provide personalized feedback and performance analytics.</p>
                
                <h2 className='text-xl font-semibold text-gray-800 mt-6 mb-2'>2. Payments</h2>
                <p className='text-gray-600'>All financial transactions are securely processed by Stripe. We do not store your credit card information on our servers.</p>

                <h2 className='text-xl font-semibold text-gray-800 mt-6 mb-2'>3. Data Security</h2>
                <p className='text-gray-600'>Your interview history is private to your account. We use industry-standard security to protect your data from unauthorized access.</p>
                
                <h2 className='text-xl font-semibold text-gray-800 mt-6 mb-2'>4. Contact Us</h2>
                <p className='text-gray-600'>If you have questions about your privacy, please visit our Contact page to reach our support team.</p>
            </div>
        </div>
    )
}
export default PrivacyPolicy;