import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Docs = () => {
    const navigate = useNavigate();
    
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

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
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className='max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl'
            >
                <motion.h1 variants={itemVariants} className='text-4xl font-extrabold text-gray-800 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500'>
                    Documentation
                </motion.h1>
                <motion.p variants={itemVariants} className='text-lg text-gray-600 mb-8 border-b pb-6'>
                    Welcome to MockMate AI! Our platform helps you practice for job interviews using advanced AI.
                </motion.p>
                
                <motion.div variants={itemVariants} className='mb-8'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2'>
                        <span className='bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center text-sm'>1</span>
                        Getting Started
                    </h2>
                    <p className='text-gray-600 ml-10'>Sign in using your Google account. New users receive initial credits to try out the platform.</p>
                </motion.div>
                
                <motion.div variants={itemVariants} className='mb-8'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2'>
                        <span className='bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center text-sm'>2</span>
                        Interview Credits
                    </h2>
                    <p className='text-gray-600 ml-10'>Each AI interview costs credits. You can easily refill your balance from the Pricing page securely via Stripe.</p>
                </motion.div>

                <motion.div variants={itemVariants} className='mb-8'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2'>
                        <span className='bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center text-sm'>3</span>
                        Taking an Interview
                    </h2>
                    <p className='text-gray-600 ml-10'>Click 'Start Interview', enable your microphone, and converse naturally with our AI. It works just like a real interview!</p>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                    <h2 className='text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2'>
                        <span className='bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center text-sm'>4</span>
                        Reviewing Feedback
                    </h2>
                    <p className='text-gray-600 ml-10'>After finishing, you will get a detailed performance report with scores, strengths, and areas to improve.</p>
                </motion.div>
            </motion.div>
        </div>
    )
}
export default Docs;