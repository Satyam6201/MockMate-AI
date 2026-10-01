import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { FaArrowLeft, FaSearch, FaFilter, FaCalendarAlt, FaBriefcase, FaStar, FaHistory } from 'react-icons/fa';
import { BsRobot } from 'react-icons/bs';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/interview/get-interview", { withCredentials: true });
        setInterviews(result.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getMyInterviews();
  }, []);

  const filteredInterviews = interviews.filter(item => {
    const matchesSearch = item.role?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col font-sans overflow-hidden text-slate-800'>
      <Navbar />

      <div className='flex-1 relative py-12 px-4 sm:px-6'>
        <div className='absolute top-10 left-10 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse pointer-events-none'></div>
        <div className='absolute bottom-10 right-20 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000 pointer-events-none'></div>

        <div className='max-w-5xl mx-auto relative z-10'>
          <div className='mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-slate-200'>
            <div className='flex items-center gap-4'>
              <motion.button 
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className='p-3.5 rounded-2xl bg-slate-50 shadow-xs hover:shadow-md transition border border-slate-200 text-slate-600 shrink-0'
              >
                <FaArrowLeft />
              </motion.button>
              <div>
                <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5'>
                  <FaHistory className="text-emerald-600"/> Interview History
                </h1>
                <p className='text-slate-500 mt-1 text-xs sm:text-sm font-normal'>
                  Review previous mock interview recordings, scorecards, and AI feedback diagnostics.
                </p>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0'>
              <div className='relative w-full sm:w-64'>
                <FaSearch className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs' />
                <input 
                  type="text" 
                  placeholder='Search by role...' 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none transition-all text-xs text-slate-900'
                />
              </div>
              <div className='relative w-full sm:w-auto'>
                <FaFilter className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs' />
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className='w-full sm:w-auto pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none transition-all text-xs font-semibold text-slate-700 cursor-pointer appearance-none'
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className='text-slate-500 text-xs font-semibold'>Loading interview history...</p>
            </div>
          ) : filteredInterviews.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='bg-white p-10 sm:p-14 rounded-3xl shadow-xs border border-slate-200 text-center flex flex-col items-center'
            >
              <div className='bg-emerald-50 text-emerald-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-xs'>
                <BsRobot size={36} />
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-2'>No Interviews Found</h3>
              <p className='text-slate-500 mb-6 max-w-md text-xs sm:text-sm leading-relaxed'>
                {searchQuery ? "No interview records matched your search keyword." : "You haven't completed any mock interviews yet. Launch your first session to track performance progress."}
              </p>
              {!searchQuery && (
                <motion.button 
                  onClick={() => navigate("/interview")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className='bg-slate-900 text-white px-7 py-3 rounded-xl font-bold shadow-md hover:bg-slate-800 transition-colors text-xs sm:text-sm'
                >
                  Start New Interview
                </motion.button>
              )}
            </motion.div> 
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className='grid gap-4 sm:gap-5'
            >
              <AnimatePresence>
                {filteredInterviews.map((item, index) => {
                  const score = item.finalScore || 0;
                  const scoreColor = score >= 8 ? 'text-emerald-700' : score >= 5 ? 'text-amber-700' : 'text-rose-700';
                  
                  return (
                    <motion.div 
                      key={item._id || index}
                      variants={itemVariants}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => navigate(`/report/${item._id}`)}
                      whileHover={{ y: -3 }}
                      className='bg-white p-5 sm:p-7 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer border border-slate-200 group'
                    >
                      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-5'>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2.5 mb-2'>
                            <h3 className='text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors'>
                              {item.role || "Software Engineer"}
                            </h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border
                              ${item.status === "completed" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}>
                              {item.status}
                            </span>
                          </div>
                          
                          <div className='flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium'>
                            <span className='flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100'>
                              <FaBriefcase className="text-slate-400 text-[11px]"/> {item.experience}
                            </span>
                            <span className='flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100'>
                              <BsRobot className="text-slate-400 text-[11px]"/> {item.mode}
                            </span>
                            <span className='flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100'>
                              <FaCalendarAlt className="text-slate-400 text-[11px]"/> {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <div className='flex items-center gap-4 bg-slate-50 rounded-xl p-3 sm:min-w-[130px] justify-center border border-slate-100'>
                          <div className='text-center'>
                            <div className='flex items-center justify-center gap-1 mb-0.5'>
                              <FaStar className={`${scoreColor} text-xs`} />
                              <span className={`text-xl font-black ${scoreColor}`}>
                                {score}
                              </span>
                              <span className='text-slate-400 text-xs font-bold'>/10</span>
                            </div>
                            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
                              Overall Score
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InterviewHistory;