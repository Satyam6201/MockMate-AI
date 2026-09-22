import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { FaArrowLeft, FaSearch, FaFilter, FaCalendarAlt, FaBriefcase, FaStar, FaHistory } from 'react-icons/fa';
import { BsRobot } from 'react-icons/bs';
import Navbar from '../components/Navbar';

const InterviewHistory = () => {

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/interview/get-interview", {withCredentials: true});
                setInterviews(result.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        getMyInterviews();
    }, []);

    // Filter logic
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
    <div className='min-h-screen bg-gray-50 flex flex-col font-sans overflow-hidden'>
      <Navbar />

      <div className='flex-1 relative py-12 px-4 sm:px-6'>
        {/* Decorative background blur elements */}
        <div className='absolute top-10 left-10 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse'></div>
        <div className='absolute bottom-10 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000'></div>

        <div className='max-w-5xl mx-auto relative z-10'>

            {/* Header Section */}
            <div className='mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100'>
                <div className='flex items-center gap-4'>
                    <motion.button 
                        whileHover={{ scale: 1.05, x: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/")}
                        className='p-4 rounded-full bg-gray-50 shadow-sm hover:shadow-md transition border border-gray-100 text-gray-600'>
                        <FaArrowLeft />
                    </motion.button>
                    <div>
                        <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-3'>
                            <FaHistory className="text-green-500"/> Interview History
                        </h1>
                        <p className='text-gray-500 mt-2 font-medium'>
                            Review past sessions, track progress, and analyze reports.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto mt-4 md:mt-0'>
                    <div className='relative w-full sm:w-64'>
                        <FaSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                        <input 
                            type="text" 
                            placeholder='Search by role...' 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-sm'
                        />
                    </div>
                    <div className='relative w-full sm:w-auto'>
                        <FaFilter className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' />
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className='w-full sm:w-auto pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-sm appearance-none font-medium text-gray-700 cursor-pointer'
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
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className='text-gray-500 font-medium'>Loading your history...</p>
                </div>
            ) : filteredInterviews.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center flex flex-col items-center'
                >
                    <div className='bg-green-50 text-green-500 w-24 h-24 rounded-full flex items-center justify-center mb-6'>
                        <BsRobot size={40} />
                    </div>
                    <h3 className='text-2xl font-bold text-gray-900 mb-2'>No Interviews Found</h3>
                    <p className='text-gray-500 mb-8 max-w-md'>
                        {searchQuery ? "We couldn't find any interviews matching your search criteria." : "You haven't taken any interviews yet. Start your first session to see your progress here!"}
                    </p>
                    {!searchQuery && (
                        <motion.button 
                            onClick={() => navigate("/interview")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-black transition-colors'
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
                    className='grid gap-6'
                >
                    <AnimatePresence>
                        {filteredInterviews.map((item, index) => {
                            
                            const score = item.finalScore || 0;
                            const scoreColor = score >= 8 ? 'text-green-600' : score >= 5 ? 'text-yellow-500' : 'text-red-500';
                            
                            return (
                                <motion.div key={item._id || index}
                                    variants={itemVariants}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    onClick={() => navigate(`/report/${item._id}`)}
                                    whileHover={{ y: -4, scale: 1.01 }}
                                    className='bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group'
                                >
                                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
                                        
                                        {/* Left Side: Info */}
                                        <div className='flex-1'>
                                            <div className='flex items-center gap-3 mb-2'>
                                                <h3 className='text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors'>
                                                    {item.role || "Unknown Role"}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider 
                                                ${item.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            
                                            <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium'>
                                                <span className='flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg'>
                                                    <FaBriefcase className="text-gray-400"/> {item.experience} Exp
                                                </span>
                                                <span className='flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg'>
                                                    <BsRobot className="text-gray-400"/> {item.mode} Mode
                                                </span>
                                                <span className='flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg'>
                                                    <FaCalendarAlt className="text-gray-400"/> {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right Side: Score */}
                                        <div className='flex items-center gap-6 bg-gray-50 rounded-2xl p-4 sm:min-w-[150px] justify-center'>
                                            <div className='text-center'>
                                                <div className='flex items-center justify-center gap-1 mb-1'>
                                                    <FaStar className={`${scoreColor} text-lg`} />
                                                    <span className={`text-2xl font-black ${scoreColor}`}>
                                                        {score}
                                                    </span>
                                                    <span className='text-gray-400 font-bold'>/10</span>
                                                </div>
                                                <p className='text-[11px] font-bold text-gray-400 uppercase tracking-widest'>
                                                    Overall Score
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
      </div>
    </div>
  )
}

export default InterviewHistory