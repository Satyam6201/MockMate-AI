import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { BsQuestionCircle, BsSearch } from 'react-icons/bs';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HelpCenter = () => {
  const [openId, setOpenId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      id: 1,
      category: 'ATS Resume Builder',
      question: 'How does the ATS Resume Builder work and what are the credit rules?',
      answer: 'MockMate AI provides 4 recruiter-vetted templates designed to pass automated applicant tracking systems. The Harvard Classic (Executive) and Minimalist Clean templates are 100% Free (0 credits to build, edit, and export). The Modern Tech and Two-Column Compact Pro templates require 50 credits per download. Credits are only deducted after the PDF is successfully saved to your computer.'
    },
    {
      id: 2,
      category: 'ATS Resume Builder',
      question: 'What is the Live Algorithmic ATS Audit and how does it detect missing items?',
      answer: 'Our audit engine analyzes your resume against 5 core screening pillars: Contact & Header completeness, Technical Keyword density (12+ recommended), Quantifiable Metrics (percentage and latency numbers in bullets), Power Action Verb coverage, and Education/Certifications. It provides an immediate 100-point score breakdown, highlights missing items with direct editor jump links, and assigns an ATS compliance grade.'
    },
    {
      id: 3,
      category: 'Mock Interviews',
      question: 'How do the AI Voice Mock Interviews work?',
      answer: 'The mock interview simulator initiates a real-time conversational voice session adapting to your chosen role (Frontend, Backend, Fullstack, DevOps, SDE) and seniority (Fresher, SDE-1, SDE-2, SDE-3). The AI dynamically adjusts difficulty based on your previous answers and generates an instant performance scorecard across communication, technical precision, confidence, and STAR method answering.'
    },
    {
      id: 4,
      category: 'SDE Preparation',
      question: 'What is included in the SDE Preparation Hub?',
      answer: 'The preparation hub contains curated technical problems across Data Structures & Algorithms, High-Level System Design (HLD), Low-Level Design (LLD), DBMS, Operating Systems, Computer Networks, and Behavioral HR. You can filter by seniority level and practice in the multi-language code sandbox.'
    },
    {
      id: 5,
      category: 'Billing & Account',
      question: 'How do payments and credit top-ups work?',
      answer: 'All payments are processed securely through Stripe with 256-bit encryption. Credits are added instantly to your account balance upon payment confirmation and never expire.'
    },
    {
      id: 6,
      category: 'Microphone & Audio',
      question: 'What should I do if my microphone is not detected during an interview?',
      answer: 'Ensure your browser has microphone permissions enabled for this site. In Chrome or Edge, click the lock icon next to the URL, ensure Microphone is set to "Allow", and refresh the page. You can also test your audio input before starting the session in Step 1 setup.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800'>
      <Navbar />

      <div className='flex-1 relative py-12 px-4 sm:px-6'>
        <div className='absolute top-10 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none'></div>
        <div className='absolute bottom-10 right-20 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none'></div>

        <div className='max-w-4xl mx-auto relative z-10'>
          <div className='text-center mb-10'>
            <div className='w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 text-xl shadow-xs'>
              <BsQuestionCircle />
            </div>
            <h1 className='text-3xl sm:text-5xl font-black text-slate-900 tracking-tight'>
              Help Center & Knowledge Base
            </h1>
            <p className='text-slate-500 max-w-xl mx-auto mt-2 text-xs sm:text-sm'>
              Find answers to platform features, ATS scoring criteria, voice interview setup, and billing.
            </p>

            <div className='max-w-md mx-auto mt-6 relative'>
              <BsSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs' />
              <input
                type='text'
                placeholder='Search documentation & FAQs...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 shadow-xs'
              />
            </div>
          </div>

          <div className='space-y-3'>
            {filteredFaqs.length === 0 ? (
              <div className='p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500 text-xs'>
                No articles matching "{searchQuery}". Try searching for keywords like "resume", "interview", or "credits".
              </div>
            ) : (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className='bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs'>
                  <button
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className='w-full text-left p-4 sm:p-5 hover:bg-slate-50 transition flex justify-between items-center gap-4'
                  >
                    <div>
                      <span className='text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md inline-block mb-1.5'>
                        {faq.category}
                      </span>
                      <h3 className='font-bold text-slate-900 text-xs sm:text-sm'>{faq.question}</h3>
                    </div>
                    <motion.span
                      animate={{ rotate: openId === faq.id ? 180 : 0 }}
                      className='text-slate-400 shrink-0 text-xs'
                    >
                      <FaChevronDown />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className='px-5 pb-5 pt-1 text-slate-600 text-xs leading-relaxed border-t border-slate-100 bg-slate-50/50'
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpCenter;