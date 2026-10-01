import React from 'react';
import { FaCalendarAlt, FaArrowRight, FaBookOpen } from 'react-icons/fa';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Blog = () => {
  const articles = [
    {
      title: "How Automated Applicant Tracking Systems (ATS) Parse Resumes in 2026",
      date: "Oct 01, 2026",
      tag: "Resume Engineering",
      snippet: "Discover how modern recruiters configure parser heuristics to filter resumes. Learn why clean linear single/double-column layouts, power action verbs, and quantified metric statements score higher than complex multi-column graphic designs."
    },
    {
      title: "Mastering the STAR Method for Technical & Behavioral Interviews",
      date: "Sep 28, 2026",
      tag: "Interview Strategy",
      snippet: "Structure your responses into Situation, Task, Action, and Result. Learn how top candidates clearly convey engineering ownership and trade-off considerations when answering difficult behavioral questions."
    },
    {
      title: "How to Answer System Design & Architecture Questions Under Pressure",
      date: "Sep 20, 2026",
      tag: "System Design",
      snippet: "A structured approach to scoping requirements, defining high-level architectures, estimating capacity, choosing database models, and designing for fault tolerance and scalability."
    }
  ];

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800'>
      <Navbar />

      <div className='flex-1 relative py-12 px-4 sm:px-6'>
        <div className='absolute top-10 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none'></div>
        <div className='absolute bottom-10 right-20 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none'></div>

        <div className='max-w-4xl mx-auto relative z-10'>
          <div className='text-center mb-12'>
            <div className='w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 text-xl shadow-xs'>
              <FaBookOpen />
            </div>
            <h1 className='text-3xl sm:text-5xl font-black text-slate-900 tracking-tight'>
              Engineering Career Blog
            </h1>
            <p className='text-slate-500 max-w-xl mx-auto mt-2 text-xs sm:text-sm'>
              In-depth articles and guides on interview preparation, ATS compliance, system design, and career progression.
            </p>
          </div>

          <div className='grid gap-6'>
            {articles.map((article, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className='bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200 group transition-all'
              >
                <div className='flex items-center justify-between gap-4 mb-3'>
                  <span className='text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md'>
                    {article.tag}
                  </span>
                  <div className='flex items-center gap-1.5 text-xs text-slate-400 font-medium'>
                    <FaCalendarAlt className='text-[11px]' />
                    <span>{article.date}</span>
                  </div>
                </div>

                <h2 className='text-lg sm:text-xl font-bold text-slate-900 mb-2.5 group-hover:text-emerald-700 transition-colors'>
                  {article.title}
                </h2>
                <p className='text-slate-600 text-xs sm:text-sm leading-relaxed mb-4'>
                  {article.snippet}
                </p>

                <div className='flex items-center gap-1.5 text-xs font-bold text-emerald-700'>
                  <span>Read full guide</span>
                  <FaArrowRight className='text-[10px] group-hover:translate-x-1 transition-transform' />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;