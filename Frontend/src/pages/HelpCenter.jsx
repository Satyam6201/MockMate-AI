import React, { useState } from 'react';
import { FaArrowLeft, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const HelpCenter = () => {
    const navigate = useNavigate();
    const [openId, setOpenId] = useState(null);

    const faqs = [
        { id: 1, question: "What is MockMate AI?", answer: "MockMate AI is an intelligent platform that simulates real job interviews to help you practice and improve your communication skills." },
        { id: 2, question: "My microphone isn't working?", answer: "Ensure you have granted microphone permissions in your browser. Try refreshing the page and clicking 'Allow' when prompted." },
        { id: 3, question: "How do payment and credits work?", answer: "We use Stripe for secure payments. Once you purchase a plan, interview credits are instantly added to your account." },
        { id: 4, question: "Can I see my past interviews?", answer: "Yes! Head over to the 'History' tab on your dashboard to review all past performance reports." },
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl'
            >
                <h1 className='text-4xl font-extrabold text-gray-800 mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500'>
                    Help Center & FAQ
                </h1>
                <p className='text-center text-gray-500 mb-10'>Find answers to commonly asked questions.</p>
                
                <div className='space-y-4'>
                    {faqs.map((faq) => (
                        <div key={faq.id} className='border border-gray-100 rounded-2xl overflow-hidden shadow-sm'>
                            <button 
                                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                className='w-full text-left p-5 bg-gray-50 hover:bg-gray-100 transition flex justify-between items-center'
                            >
                                <span className='font-semibold text-gray-800'>{faq.question}</span>
                                <motion.span animate={{ rotate: openId === faq.id ? 180 : 0 }}>
                                    <FaChevronDown className='text-emerald-500' />
                                </motion.span>
                            </button>
                            <AnimatePresence>
                                {openId === faq.id && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className='px-5 pb-5 pt-2 text-gray-600 bg-white'
                                    >
                                        {faq.answer}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
export default HelpCenter;