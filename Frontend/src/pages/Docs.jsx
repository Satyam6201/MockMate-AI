import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Docs = () => {
    const navigate = useNavigate();
    return (
        <div className='min-h-screen bg-gray-50 p-6 md:p-12'>
            <button onClick={() => navigate("/")} className='mb-6 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
                <FaArrowLeft className='text-gray-600'/>
            </button>
            <div className='max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm'>
                <h1 className='text-3xl font-bold text-gray-800 mb-6'>Documentation</h1>
                <p className='text-gray-600 mb-6'>Welcome to MockMate AI! Our platform helps you practice for job interviews using advanced AI.</p>
                
                <h2 className='text-xl font-semibold text-gray-800 mt-6 mb-2'>1. Getting Started</h2>
                <p className='text-gray-600'>Sign in using your Google account. New users receive initial credits to try out the platform.</p>
                
                <h2 className='text-xl font-semibold text-gray-800 mt-6 mb-2'>2. Interview Credits</h2>
                <p className='text-gray-600'>Each AI interview costs credits. You can easily refill your balance from the Pricing page securely via Stripe.</p>

                <h2 className='text-xl font-semibold text-gray-800 mt-6 mb-2'>3. Taking an Interview</h2>
                <p className='text-gray-600'>Click 'Start Interview', enable your microphone, and converse naturally with our AI. It works just like a real interview!</p>
                
                <h2 className='text-xl font-semibold text-gray-800 mt-6 mb-2'>4. Reviewing Feedback</h2>
                <p className='text-gray-600'>After finishing, you will get a detailed performance report with scores, strengths, and areas to improve.</p>
            </div>
        </div>
    )
}
export default Docs;