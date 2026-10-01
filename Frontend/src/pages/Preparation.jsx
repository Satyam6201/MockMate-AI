import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaLaptopCode, FaProjectDiagram, FaServer, FaNetworkWired, FaUsers, FaCogs, FaSitemap, FaDatabase, FaFilePdf, FaChevronDown } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { questionsData } from '../data/questionsData';

const categories = [
  { id: 'dsa', name: 'DSA', icon: <FaLaptopCode />, desc: 'Data Structures & Algorithms', pdf: null },
  { id: 'hld', name: 'HLD', icon: <FaSitemap />, desc: 'High-Level Design', pdf: null },
  { id: 'lld', name: 'LLD', icon: <FaProjectDiagram />, desc: 'Low-Level Design', pdf: null },
  { id: 'dbms', name: 'DBMS', icon: <FaDatabase />, desc: 'Database Management', pdf: null },
  { id: 'oop', name: 'OOP', icon: <FaCogs />, desc: 'Object Oriented Programming', pdf: null },
  { id: 'os', name: 'OS', icon: <FaServer />, desc: 'Operating Systems', pdf: null },
  { id: 'cn', name: 'CN', icon: <FaNetworkWired />, desc: 'Computer Networks', pdf: null },
  { id: 'hr', name: 'HR', icon: <FaUsers />, desc: 'Behavioral & HR', pdf: null },
];

const Preparation = () => {
  const [activeCategory, setActiveCategory] = useState('dsa');
  const [activeRole, setActiveRole] = useState('All');
  const [expandedQs, setExpandedQs] = useState({});

  const toggleQuestion = (idx) => {
    setExpandedQs(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const filteredQuestions = (questionsData[activeCategory] || []).filter((q) => {
    if (activeRole === 'All') return true;
    return q.roles.includes(activeRole);
  });

  const currentCategoryData = categories.find(c => c.id === activeCategory);

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800'>
      <Navbar />

      <div className='flex-1 relative py-12 px-4 sm:px-6'>
        <div className='absolute top-20 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none'></div>
        <div className='absolute bottom-0 right-10 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none'></div>

        <div className='max-w-7xl mx-auto relative z-10'>
          <div className='text-center mb-12 flex flex-col items-center'>
            <h1 className='text-3xl sm:text-5xl font-black text-slate-900 tracking-tight'>
              SDE <span className='text-emerald-600'>Preparation</span> Hub
            </h1>
            <p className='text-slate-500 mt-3 text-xs sm:text-sm md:text-base max-w-2xl'>
              Curated questions and reference solutions across Data Structures, System Design, Operating Systems, and Behavioral rounds.
            </p>
            
            <div className='mt-6 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-xs flex flex-wrap items-center justify-center gap-1.5'>
              {['All', 'SDE-1', 'SDE-2', 'SDE-3'].map(role => (
                <button 
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`px-5 py-1.5 rounded-xl font-bold text-xs transition-colors
                    ${activeRole === role ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}
                  `}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className='flex flex-col lg:flex-row gap-6 items-start'>
            <div className='w-full lg:w-1/4 space-y-2'>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setExpandedQs({});
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 shadow-xs border
                    ${activeCategory === cat.id 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                    }
                  `}
                >
                  <span className='text-lg shrink-0'>{cat.icon}</span>
                  <div className='text-left'>
                    <span className='block text-sm font-bold'>{cat.name}</span>
                    <span className={`text-[11px] font-medium block ${activeCategory === cat.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {cat.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className='w-full lg:w-3/4'>
              <div className='bg-white rounded-3xl shadow-xs border border-slate-200 p-6 sm:p-10 min-h-[600px]'>
                <div className='mb-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                  <div>
                    <h2 className='text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5'>
                      {currentCategoryData?.desc}
                    </h2>
                    <p className='text-slate-500 mt-1 text-xs font-normal'>
                      Practice articulating your answers before revealing the solution breakdown.
                    </p>
                  </div>
                  
                  <div className='flex flex-col sm:items-end gap-2 self-start sm:self-auto'>
                    <div className='bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl font-bold text-xs whitespace-nowrap'>
                      {filteredQuestions.length} Questions {activeRole !== 'All' && `(${activeRole})`}
                    </div>
                    
                    {currentCategoryData?.pdf && (
                      <a 
                        href={currentCategoryData.pdf}
                        target='_blank'
                        rel='noreferrer'
                        className='flex items-center gap-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors shadow-2xs'
                      >
                        <FaFilePdf /> View {currentCategoryData.name} Notes
                      </a>
                    )}
                  </div>
                </div>

                <div className='space-y-3.5'>
                  <AnimatePresence mode='wait'>
                    <motion.div
                      key={activeCategory + activeRole}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
                      }}
                      className='space-y-3.5'
                    >
                      {filteredQuestions.length === 0 ? (
                        <div className="text-center py-16 text-slate-400 font-medium text-xs">
                          No questions found for {activeRole} in this category.
                        </div>
                      ) : (
                        filteredQuestions.map((question, idx) => (
                          <motion.div 
                            key={idx} 
                            variants={{
                              hidden: { opacity: 0, y: 15 },
                              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
                            }}
                            className={`flex flex-col p-4 sm:p-5 rounded-2xl border transition-all duration-200
                              ${expandedQs[idx] ? 'bg-white border-emerald-400 shadow-xs' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-emerald-200'}`}
                          >
                            <div className='flex items-start gap-3 w-full'>
                              <div className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs transition-colors
                                ${expandedQs[idx] ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                                {idx + 1}
                              </div>
                              
                              <div className='flex-1'>
                                <div 
                                  className={`font-semibold text-sm sm:text-base leading-snug cursor-pointer flex flex-wrap items-center justify-between gap-2 text-slate-800 hover:text-emerald-800`}
                                  onClick={() => question.a && toggleQuestion(idx)}
                                >
                                  <span>{question.q}</span>
                                  {question.a && (
                                    <span className='inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0'>
                                      Solution <FaChevronDown className={`text-[10px] transition-transform duration-200 ${expandedQs[idx] ? 'rotate-180' : ''}`} />
                                    </span>
                                  )}
                                </div>
                                
                                <AnimatePresence>
                                  {expandedQs[idx] && question.a && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                                      className="overflow-hidden mt-3"
                                    >
                                      <div className="bg-slate-50 text-slate-700 p-4 rounded-xl border-l-4 border-emerald-600 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal">
                                        {question.a}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>

                            <div className='flex gap-1.5 mt-3 ml-10'>
                              {question.roles.map(role => (
                                <span key={role} className='text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600'>
                                  {role}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        ))
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Preparation;