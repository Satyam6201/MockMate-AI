import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaHome, FaSearch, FaArrowLeft, FaCompass, FaBookOpen, FaCrown, FaFileAlt } from 'react-icons/fa';
import { BsRobot, BsShieldExclamation } from 'react-icons/bs';
import { IoSparklesOutline } from 'react-icons/io5';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Helpful navigation links
  const quickLinks = [
    {
      title: "AI Mock Interview",
      desc: "Practice realistic technical & HR rounds",
      icon: <BsRobot className="text-emerald-500 text-xl" />,
      path: "/interview",
      badge: "Popular"
    },
    {
      title: "ATS Resume Builder",
      desc: "Architect recruiter-approved ATS resumes",
      icon: <FaFileAlt className="text-emerald-400 text-xl" />,
      path: "/resume-builder",
      badge: "New AI"
    },
    {
      title: "Preparation Hub",
      desc: "Curated questions across 15+ tech stacks",
      icon: <FaCompass className="text-blue-500 text-xl" />,
      path: "/prepare"
    },
    {
      title: "Pricing & Plans",
      desc: "Unlock unlimited AI mock sessions",
      icon: <FaCrown className="text-amber-500 text-xl" />,
      path: "/payment"
    }
  ];

  // Filter links based on user search
  const filteredLinks = quickLinks.filter(link => 
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Smart route match based on query keywords
    const query = searchQuery.toLowerCase();
    if (query.includes('prep') || query.includes('question') || query.includes('dsa') || query.includes('react')) {
      navigate('/prepare');
    } else if (query.includes('price') || query.includes('plan') || query.includes('cost') || query.includes('credit')) {
      navigate('/payment');
    } else if (query.includes('interview') || query.includes('start') || query.includes('mock')) {
      navigate('/interview');
    } else if (query.includes('doc') || query.includes('guide') || query.includes('help')) {
      navigate('/docs');
    } else {
      navigate('/prepare');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans overflow-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center relative px-4 py-16 sm:py-24 text-center">
        {/* Ambient Glowing Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.15, 0.25, 0.15],
              x: [0, 40, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-600/30 rounded-full blur-[140px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.12, 0.22, 0.12],
              x: [0, -30, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-[140px]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        {/* 404 Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl mx-auto"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-emerald-400 font-semibold mb-6 shadow-inner">
            <BsShieldExclamation className="text-amber-400 text-sm" />
            <span>HTTP Error 404 &bull; Resource Missing</span>
          </div>

          {/* Animated 404 Headline */}
          <div className="relative mb-2">
            <h1 className="text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-white via-slate-200 to-slate-600 bg-clip-text text-transparent drop-shadow-2xl select-none">
              404
            </h1>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-2 right-1/4 sm:right-1/3 hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20"
            >
              <BsRobot className="text-2xl" />
            </motion.div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            Lost in Cyberspace?
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-4">
            The page at <code className="text-emerald-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 text-xs font-mono">{location.pathname}</code> does not exist or has been restructured.
          </p>

          {/* Smart Route Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto mb-8">
            <div className="relative flex items-center">
              <FaSearch className="absolute left-4 text-slate-400 text-sm pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search platform (e.g. DSA, React, Pricing, Mock)..."
                className="w-full pl-11 pr-24 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow"
              >
                Go
              </button>
            </div>
          </form>

          {/* Quick Action Navigation Grid */}
          <div className="text-left mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
              Popular Destinations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AnimatePresence>
                {filteredLinks.map((link) => (
                  <motion.div
                    key={link.title}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={link.path}
                      className="group flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        {link.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-emerald-300 transition-colors truncate">
                            {link.title}
                          </h4>
                          {link.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {link.desc}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-800/70">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
            >
              <FaArrowLeft className="text-xs" /> Go Back
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-950 shadow-lg shadow-white/5 transition-all"
            >
              <FaHome className="text-base" /> Back to Home Dashboard
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;