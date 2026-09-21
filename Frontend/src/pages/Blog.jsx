import React from 'react';
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Blog = () => {
    const navigate = useNavigate();
    const articles = [
        { title: "Top 5 Tips for AI Interviews", date: "Oct 15, 2026", snippet: "Learn how to speak clearly and structure your answers for AI evaluators..." },
        { title: "How MockMate AI Helps You Land the Job", date: "Sep 22, 2026", snippet: "Practice makes perfect. Discover how repetitive mock interviews reduce anxiety..." },
        { title: "The Future of Hiring", date: "Aug 10, 2026", snippet: "Companies are increasingly using AI for initial screening. Here is what to expect..." }
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
            <div className='max-w-4xl mx-auto'>
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-4xl font-extrabold text-gray-800 mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500'
                >
                    Latest from Our Blog
                </motion.h1>
                
                <div className='grid gap-6'>
                    {articles.map((article, index) => (
                        <motion.div 
                            key={index} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className='bg-white p-8 rounded-3xl shadow-lg border border-gray-100 cursor-pointer group'
                        >
                            <div className='flex items-center gap-2 text-sm text-emerald-600 font-semibold mb-3'>
                                <FaCalendarAlt />
                                <span>{article.date}</span>
                            </div>
                            <h2 className='text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors'>
                                {article.title}
                            </h2>
                            <p className='text-gray-600 leading-relaxed'>
                                {article.snippet}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Blog;