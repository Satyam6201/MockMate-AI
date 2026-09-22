import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col font-sans overflow-hidden'>
      <Navbar />
      
      <div className='flex-1 flex flex-col items-center justify-center relative px-4 text-center'>
        {/* Decorative background blur elements */}
        <div className='absolute top-20 left-20 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse'></div>
        <div className='absolute bottom-20 right-20 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000'></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className='relative z-10'
        >
          <h1 className='text-[150px] sm:text-[200px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700 leading-none drop-shadow-sm'>
            404
          </h1>
          <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mt-4 tracking-tight'>
            Page Not Found
          </h2>
          <p className='text-gray-500 mt-4 text-lg max-w-md mx-auto'>
            Oops! It seems you've wandered into an unknown path. The page you're looking for doesn't exist or has been moved.
          </p>

          <div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link 
              to="/"
              className='flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300'
            >
              <FaHome className="text-xl" /> Back to Home
            </Link>
            
            <Link 
              to="/prepare"
              className='flex items-center gap-2 bg-white text-green-600 border border-green-200 px-8 py-4 rounded-full font-bold shadow-md hover:shadow-lg hover:border-green-300 hover:bg-green-50 hover:-translate-y-1 transition-all duration-300'
            >
              <FaSearch className="text-xl" /> Explore Prep Hub
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;