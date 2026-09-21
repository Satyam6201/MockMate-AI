import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    const sections = [
        { title: "1. Data Collection", content: "We collect your name, email, and the audio/text data from your mock interviews to provide personalized feedback and performance analytics." },
        { title: "2. Payments", content: "All financial transactions are securely processed by Stripe. We do not store your credit card information on our servers." },
        { title: "3. Data Security", content: "Your interview history is private to your account. We use industry-standard security to protect your data from unauthorized access." },
        { title: "4. Contact Us", content: "If you have questions about your privacy, please visit our Contact page to reach our support team." }
    ];

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
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className='max-w-4xl mx-auto bg-white p-8 md:p-14 rounded-3xl shadow-xl'
            >
                <div className='text-center mb-10 border-b border-gray-100 pb-8'>
                    <h1 className='text-4xl font-extrabold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500'>
                        Privacy Policy
                    </h1>
                    <p className='text-gray-500'>Last updated: October 2026</p>
                </div>
                
                <div className='space-y-8'>
                    {sections.map((section, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <h2 className='text-2xl font-bold text-gray-800 mb-3'>{section.title}</h2>
                            <p className='text-gray-600 leading-relaxed'>{section.content}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
export default PrivacyPolicy;