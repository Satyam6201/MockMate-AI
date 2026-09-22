import React from 'react';
import { FaArrowLeft, FaBookOpen, FaCoins, FaMicrophoneAlt, FaChartBar, FaRocket } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Docs = () => {
    const navigate = useNavigate();
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    const docSections = [
        {
            icon: <FaRocket />,
            title: "Getting Started",
            desc: "Sign in using your Google account. New users receive initial free credits to try out the platform and experience the AI intelligence immediately."
        },
        {
            icon: <FaCoins />,
            title: "Interview Credits",
            desc: "Each AI interview costs credits. You can easily refill your balance from the Pricing page securely via Stripe. Your credits never expire."
        },
        {
            icon: <FaMicrophoneAlt />,
            title: "Taking an Interview",
            desc: "Click 'Start Interview', fill in your target role, optionally upload your resume, and enable your microphone. Converse naturally with our AI just like a real interview!"
        },
        {
            icon: <FaChartBar />,
            title: "Reviewing Feedback",
            desc: "After finishing, you will get a detailed performance report with scores for Confidence, Communication, and Correctness, along with actionable areas to improve."
        }
    ];

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col font-sans overflow-hidden'>
            <Navbar />
            
            <div className='flex-1 relative py-12 px-4 sm:px-6'>
                {/* Decorative background blur elements */}
                <div className='absolute top-20 left-10 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse'></div>
                <div className='absolute bottom-40 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000'></div>

                <div className='max-w-5xl mx-auto relative z-10'>
                    <div className='mb-8 flex items-center gap-4'>
                        <motion.button 
                            whileHover={{ scale: 1.05, x: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/")} 
                            className='p-4 rounded-full bg-white shadow-sm hover:shadow-md border border-gray-100 transition-all text-gray-600'
                        >
                            <FaArrowLeft />
                        </motion.button>
                        <div>
                            <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-3'>
                                <FaBookOpen className='text-green-600' /> Documentation
                            </h1>
                            <p className='text-gray-500 mt-1 font-medium'>Everything you need to know about MockMate AI</p>
                        </div>
                    </div>

                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className='bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl border border-gray-100'
                    >
                        <motion.p variants={itemVariants} className='text-lg sm:text-xl text-gray-600 mb-12 leading-relaxed border-b border-gray-100 pb-10'>
                            Welcome to the <strong className='text-gray-900'>MockMate AI</strong> help center. Our platform is designed to seamlessly prepare you for your dream job using advanced conversational AI and real-time performance analytics. Follow the guide below to master the platform.
                        </motion.p>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                            {docSections.map((section, index) => (
                                <motion.div 
                                    key={index} 
                                    variants={itemVariants} 
                                    whileHover={{ y: -5 }}
                                    className='bg-gray-50 hover:bg-white p-8 rounded-3xl border border-gray-100 hover:border-green-200 transition-all shadow-sm hover:shadow-lg group'
                                >
                                    <div className='flex items-center gap-4 mb-5'>
                                        <div className='w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform'>
                                            {section.icon}
                                        </div>
                                        <h2 className='text-xl font-bold text-gray-900'>
                                            {section.title}
                                        </h2>
                                    </div>
                                    <p className='text-gray-600 leading-relaxed font-medium'>
                                        {section.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div variants={itemVariants} className='mt-12 bg-green-50 border border-green-200 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6'>
                            <div>
                                <h3 className='text-xl font-bold text-green-900 mb-2'>Still need help?</h3>
                                <p className='text-green-700'>If you couldn't find what you were looking for, reach out to our support team.</p>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/contact")}
                                className='bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-colors whitespace-nowrap'
                            >
                                Contact Support
                            </motion.button>
                        </motion.div>

                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Docs;