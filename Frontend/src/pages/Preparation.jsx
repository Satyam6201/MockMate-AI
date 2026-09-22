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

  const filteredQuestions = questionsData[activeCategory].filter((q) => {
    if (activeRole === 'All') return true;
    return q.roles.includes(activeRole);
  });

  const currentCategoryData = categories.find(c => c.id === activeCategory);

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col font-sans overflow-hidden'>
      <Navbar />

      <div className='flex-1 relative py-12 px-4 sm:px-6'>
        {/* Decorative background blur elements */}
        <div className='absolute top-20 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse'></div>
        <div className='absolute bottom-0 right-10 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000'></div>

        <div className='max-w-7xl mx-auto relative z-10'>
          
          <div className='text-center mb-12 flex flex-col items-center'>
            <h1 className='text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight'>
              SDE <span className='text-green-600'>Preparation</span> Hub
            </h1>
            <p className='text-gray-500 mt-4 text-lg max-w-2xl'>
              Master your SDE-1, SDE-2, and SDE-3 interviews. Browse through the most frequently asked top questions tailored for your specific role.
            </p>
            
            <div className='mt-8 bg-white border border-gray-200 p-2 rounded-full shadow-sm flex flex-wrap items-center justify-center gap-2'>
                {['All', 'SDE-1', 'SDE-2', 'SDE-3'].map(role => (
                    <button 
                        key={role}
                        onClick={() => setActiveRole(role)}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-colors
                            ${activeRole === role ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}
                        `}
                    >
                        {role}
                    </button>
                ))}
            </div>
          </div>

          <div className='flex flex-col lg:flex-row gap-8'>
            
            {/* Sidebar / Category Selector */}
            <div className='w-full lg:w-1/4 space-y-3'>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                      setActiveCategory(cat.id);
                      setExpandedQs({}); // Reset expansions on category change
                  }}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 shadow-sm border
                    ${activeCategory === cat.id 
                      ? 'bg-green-600 text-white border-green-600' 
                      : 'bg-white text-gray-600 border-gray-100 hover:border-green-300 hover:bg-green-50'
                    }
                  `}
                >
                  <span className='text-xl'>{cat.icon}</span>
                  <div className='text-left'>
                    <span className='block text-lg'>{cat.name}</span>
                    <span className={`text-xs font-medium ${activeCategory === cat.id ? 'text-green-100' : 'text-gray-400'}`}>
                      {cat.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Questions Display Area */}
            <div className='w-full lg:w-3/4'>
              <div className='bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 sm:p-12 min-h-[600px] relative'>
                
                <div className='mb-8 pb-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                   <div>
                     <h2 className='text-3xl font-bold text-gray-900 flex items-center gap-3'>
                        {currentCategoryData?.desc}
                     </h2>
                     <p className='text-gray-500 mt-2 font-medium'>
                       Test your knowledge. Try answering these before looking at the solution!
                     </p>
                   </div>
                   
                   <div className='flex flex-col sm:items-end gap-3 self-start sm:self-auto'>
                       <div className='bg-green-50 text-green-600 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap self-start sm:self-end'>
                         {filteredQuestions.length} Questions {activeRole !== 'All' && `for ${activeRole}`}
                       </div>
                       
                       {currentCategoryData?.pdf && (
                           <a 
                               href={currentCategoryData.pdf}
                               target='_blank'
                               rel='noreferrer'
                               className='flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm'
                           >
                               <FaFilePdf /> View {currentCategoryData.name} Notes
                           </a>
                       )}
                   </div>
                </div>

                <div className='space-y-4 mt-6'>
                  <AnimatePresence mode='wait'>
                    <motion.div
                      key={activeCategory + activeRole}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                      }}
                      className='space-y-4'
                    >
                      {filteredQuestions.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 font-medium">
                            No questions found for {activeRole} in this category.
                        </div>
                      ) : (
                          filteredQuestions.map((question, idx) => (
                            <motion.div 
                              key={idx} 
                              variants={{
                                  hidden: { opacity: 0, y: 20 },
                                  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
                              }}
                              className={`group flex flex-col sm:flex-row sm:items-start gap-4 p-5 rounded-2xl border transition-all duration-300
                                ${expandedQs[idx] ? 'bg-white border-green-300 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-green-200 hover:shadow-lg'}`}
                            >
                              <div className='flex items-start gap-4 w-full'>
                                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300
                                      ${expandedQs[idx] ? 'bg-green-600 text-white shadow-md' : 'bg-green-100 text-green-700'}`}>
                                    {idx + 1}
                                  </div>
                                  
                                  <div className='flex-1'>
                                      <div 
                                        className={`font-medium text-lg leading-relaxed mt-0.5 transition-colors duration-300 ${question.a ? 'cursor-pointer hover:text-green-700' : 'text-gray-700 group-hover:text-gray-900'}`}
                                        onClick={() => question.a && toggleQuestion(idx)}
                                      >
                                          {question.q}
                                          {question.a && (
                                              <span className='inline-flex items-center gap-1 text-xs font-bold text-green-600 ml-3 bg-green-50 px-2.5 py-1 rounded-md shadow-sm border border-green-100'>
                                                  See Answer <FaChevronDown className={`transition-transform duration-300 ${expandedQs[idx] ? 'rotate-180' : ''}`} />
                                              </span>
                                          )}
                                      </div>
                                      
                                      <AnimatePresence>
                                          {expandedQs[idx] && question.a && (
                                              <motion.div
                                                  initial={{ opacity: 0, height: 0, scale: 0.98 }}
                                                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                                  exit={{ opacity: 0, height: 0, scale: 0.98 }}
                                                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                  className="overflow-hidden mt-4"
                                              >
                                                  <div className="bg-gray-50/80 backdrop-blur-sm text-gray-700 p-5 rounded-xl border-l-4 border-green-500 text-[15px] leading-relaxed whitespace-pre-wrap font-medium shadow-inner">
                                                      {question.a}
                                                  </div>
                                              </motion.div>
                                          )}
                                      </AnimatePresence>
                                  </div>
                                  
                                  <div className='hidden sm:flex shrink-0 gap-2 mt-1'>
                                      {question.roles.map(role => (
                                          <span key={role} className={`text-[10px] font-bold px-2.5 py-1 rounded shadow-sm border transition-all duration-300
                                              ${role === 'SDE-3' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-400 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                                              : 'bg-white border-gray-200 text-gray-500'}`}>
                                              {role}
                                          </span>
                                      ))}
                                  </div>
                              </div>
                              <div className='flex sm:hidden shrink-0 gap-2 ml-12'>
                                  {question.roles.map(role => (
                                      <span key={role} className={`text-[10px] font-bold px-2.5 py-1 rounded shadow-sm border transition-all duration-300
                                          ${role === 'SDE-3' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-400' 
                                          : 'bg-white border-gray-200 text-gray-500'}`}>
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
