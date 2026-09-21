import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
    const navigate = useNavigate();
    const articles = [
        { title: "Top 5 Tips for AI Interviews", date: "Oct 15, 2026", snippet: "Learn how to speak clearly and structure your answers for AI evaluators..." },
        { title: "How MockMate AI Helps You Land the Job", date: "Sep 22, 2026", snippet: "Practice makes perfect. Discover how repetitive mock interviews reduce anxiety..." },
        { title: "The Future of Hiring", date: "Aug 10, 2026", snippet: "Companies are increasingly using AI for initial screening. Here is what to expect..." }
    ];

    return (
        <div className='min-h-screen bg-gray-50 p-6 md:p-12'>
            <button onClick={() => navigate("/")} className='mb-6 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
                <FaArrowLeft className='text-gray-600'/>
            </button>
            <div className='max-w-4xl mx-auto'>
                <h1 className='text-3xl font-bold text-gray-800 mb-8'>Latest from Our Blog</h1>
                <div className='grid gap-6'>
                    {articles.map((article, index) => (
                        <div key={index} className='bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer'>
                            <p className='text-sm text-emerald-600 font-semibold mb-2'>{article.date}</p>
                            <h2 className='text-xl font-bold text-gray-800 mb-3'>{article.title}</h2>
                            <p className='text-gray-600'>{article.snippet}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Blog;