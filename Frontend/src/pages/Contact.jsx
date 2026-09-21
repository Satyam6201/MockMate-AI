import React from 'react';
import { FaArrowLeft, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
    const navigate = useNavigate();
    return (
        <div className='min-h-screen bg-gray-50 p-6 md:p-12'>
            <button onClick={() => navigate("/")} className='mb-6 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
                <FaArrowLeft className='text-gray-600'/>
            </button>
            <div className='max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm'>
                <h1 className='text-3xl font-bold text-gray-800 mb-6'>Contact Us</h1>
                <p className='text-gray-600 mb-8'>We would love to hear from you. Reach out if you have any questions, feedback, or need support with MockMate AI.</p>
                
                <div className='flex flex-col md:flex-row gap-8'>
                    <div className='flex-1 space-y-6'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full text-xl'>
                                <FaEnvelope />
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-800'>Email</h3>
                                <p className='text-gray-600'>support@mockmate.ai</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full text-xl'>
                                <FaMapMarkerAlt />
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-800'>Office</h3>
                                <p className='text-gray-600'>123 Tech Street, Silicon Valley</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='flex-1'>
                        <form className='space-y-4' onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
                            <input type='text' placeholder='Your Name' className='w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500' required />
                            <input type='email' placeholder='Your Email' className='w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500' required />
                            <textarea placeholder='How can we help?' rows='4' className='w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500' required></textarea>
                            <button type='submit' className='w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition'>
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Contact;