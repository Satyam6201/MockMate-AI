import React from 'react';
import { FaArrowLeft, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Contact = () => {
    const navigate = useNavigate();
    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-6 md:p-12'>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")} 
                className='mb-6 p-3 rounded-full bg-white shadow-md hover:shadow-lg transition text-emerald-600'
            >
                <FaArrowLeft />
            </motion.button>
            <div className='max-w-5xl mx-auto'>
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-center mb-12'
                >
                    <h1 className='text-4xl font-extrabold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500'>
                        Get in Touch
                    </h1>
                    <p className='text-gray-600 max-w-xl mx-auto'>
                        We would love to hear from you. Reach out if you have any questions, feedback, or need support with MockMate AI.
                    </p>
                </motion.div>
                
                <div className='flex flex-col lg:flex-row gap-8'>
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='flex-1 space-y-6 bg-white p-8 rounded-3xl shadow-xl'
                    >
                        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Contact Information</h2>
                        
                        <div className='flex items-center gap-5 p-4 rounded-2xl hover:bg-emerald-50 transition'>
                            <div className='w-14 h-14 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full text-2xl shadow-sm'>
                                <FaEnvelope />
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-800 text-lg'>Email Us</h3>
                                <p className='text-gray-500'>support@mockmate.ai</p>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-5 p-4 rounded-2xl hover:bg-emerald-50 transition'>
                            <div className='w-14 h-14 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full text-2xl shadow-sm'>
                                <FaMapMarkerAlt />
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-800 text-lg'>Our Office</h3>
                                <p className='text-gray-500'>123 Tech Street, Silicon Valley</p>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='flex-[1.5] bg-white p-8 rounded-3xl shadow-xl'
                    >
                        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Send a Message</h2>
                        <form className='space-y-5' onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                <input type='text' placeholder='Your Name' className='w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition' required />
                                <input type='email' placeholder='Your Email' className='w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition' required />
                            </div>
                            <textarea placeholder='How can we help you today?' rows='5' className='w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none' required></textarea>
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type='submit' 
                                className='w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2'
                            >
                                <FaPaperPlane />
                                Send Message
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
export default Contact;