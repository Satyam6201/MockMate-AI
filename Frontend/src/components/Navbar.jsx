import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'motion/react'
import { BsRobot, BsCoin } from 'react-icons/bs';
import { HiOutlineLogout, HiSparkles, HiMenu, HiX } from 'react-icons/hi';
import { FaUserAstronaut, FaHistory, FaCreditCard } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';

const Navbar = () => {

    const { userData } = useSelector((state) => state.user);
    const socketStatus = useSelector((state) => state.socket?.status);
    const dispatch = useDispatch();
    const [showCreditPopup, setShowCreditPopup] = useState(false);
    const [showUserPopup, setShowUserPopup] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [showAuth, setShowAuth] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const closePopups = () => {
            setShowCreditPopup(false);
            setShowUserPopup(false);
            setShowMobileMenu(false);
        };
        window.addEventListener('scroll', closePopups);
        return () => window.removeEventListener('scroll', closePopups);
    }, []);

    const handleLogout = async () => {
        try {
            await axios.get(serverUrl + "/api/auth/logout",
                {withCredentials: true}
            );
            dispatch(setUserData(null));
            setShowCreditPopup(false);
            setShowUserPopup(false);
            setShowMobileMenu(false);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Preparation", path: "/prepare" },
        { name: "Pricing", path: "/payment" },
        { name: "Docs", path: "/docs" }
    ];

  return (
    <div className={`flex justify-center px-4 pt-4 pb-2 sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
      <motion.div 
        initial={{opacity: 0, y: -40}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6, type: "spring", stiffness: 100}}
        className={`w-full max-w-7xl rounded-[24px] px-6 sm:px-8 py-3 flex justify-between items-center relative transition-all duration-300
        ${isScrolled ? 'bg-white border-transparent' : 'bg-white shadow-sm border border-gray-200'}`}
      >

        <div className="md:hidden flex items-center">
            <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setShowMobileMenu(!showMobileMenu);
                    setShowCreditPopup(false);
                    setShowUserPopup(false);
                }}
                className="text-gray-700 hover:text-green-600 p-2"
            >
                {showMobileMenu ? <HiX size={24} /> : <HiMenu size={24} />}
            </motion.button>
        </div>

        <motion.div 
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='flex items-center gap-3 cursor-pointer group'
        >
            <div className='bg-gradient-to-br from-gray-900 to-black text-white p-2.5 rounded-xl shadow-md group-hover:shadow-xl group-hover:from-green-600 group-hover:to-emerald-700 transition-all duration-500'>
                <BsRobot size={22} className='group-hover:rotate-12 transition-transform duration-300'/>
            </div>
            <h1 className='font-bold hidden sm:block text-xl tracking-tight text-gray-900'>
                MockMate <span className='text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-600'>AI</span>
            </h1>
        </motion.div>

        <div className='hidden md:flex items-center gap-8'>
            {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                    <div key={link.name} className="relative group">
                        <button 
                            onClick={() => navigate(link.path)}
                            className={`text-sm font-bold transition-all duration-300 ${isActive ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            {link.name}
                        </button>
                        {isActive && (
                            <motion.div 
                                layoutId="underline"
                                className="absolute -bottom-1.5 left-0 right-0 h-1 bg-green-500 rounded-full"
                            />
                        )}
                        {!isActive && (
                            <div className="absolute -bottom-1.5 left-0 w-0 h-1 bg-gray-300 rounded-full transition-all duration-300 group-hover:w-full" />
                        )}
                    </div>
                )
            })}
        </div>

        <div className='flex items-center gap-2 sm:gap-4 lg:gap-6 relative'>

            <div className='relative flex items-center gap-2 sm:gap-3'>
                {userData && (
                    <div className='hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full shrink-0'>
                        <div className={`w-2.5 h-2.5 rounded-full ${
                            socketStatus === 'CONNECTED' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
                            socketStatus === 'CONNECTING' ? 'bg-yellow-500 animate-pulse' :
                            socketStatus === 'ERROR' || socketStatus === 'DISCONNECTED' ? 'bg-red-500' : 'bg-gray-300'
                        }`} title={`Socket: ${socketStatus}`}></div>
                        <span className='text-[10px] uppercase font-black tracking-wider text-gray-400'>{socketStatus === 'CONNECTED' ? 'Live' : socketStatus}</span>
                    </div>
                )}
                
                <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        if (!userData) {
                            setShowAuth(true);
                            return;
                        }
                        setShowCreditPopup(!showCreditPopup);
                        setShowUserPopup(false);
                        setShowMobileMenu(false);
                    }}
                    className='flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200
                    px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-black text-gray-700 hover:shadow-md transition-all hover:border-yellow-200 shrink-0'
                >
                    <BsCoin size={16} className='text-yellow-500 drop-shadow-sm sm:w-[18px] sm:h-[18px]' />
                    {Math.max(0, userData?.credits || 0)}
                </motion.button>

                <AnimatePresence>
                    {showCreditPopup && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, type: "spring", stiffness: 200 }}
                            className='absolute top-full right-0 mt-3 w-[min(280px,calc(100vw-2rem))] sm:w-80 bg-white shadow-2xl border border-gray-100 rounded-2xl p-4 sm:p-6 z-50 origin-top-right'
                        >
                            <div className="absolute -top-2 right-4 sm:right-6 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                            
                            <div className="flex items-center gap-4 mb-5">
                                <div className="bg-yellow-100 p-3 rounded-full shadow-inner">
                                    <HiSparkles className="text-yellow-600 text-xl" />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900 text-base">Credits Balance</h4>
                                    <p className="text-sm text-gray-500 font-bold">{Math.max(0, userData?.credits || 0)} interviews left</p>
                                </div>
                            </div>
                            
                            <p className='text-sm text-gray-600 mb-5 leading-relaxed font-medium'>
                                Want to practice more? Upgrade your plan to unlock premium interviews and advanced insights.
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                    navigate("/payment");
                                    setShowCreditPopup(false);
                                }}
                                className='w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-colors'
                            >
                                <FaCreditCard /> Upgrade Plan
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className='relative'>
                <motion.button 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        if (!userData) {
                            setShowAuth(true);
                            return;
                        }
                        setShowUserPopup(!showUserPopup)
                        setShowCreditPopup(false)
                        setShowMobileMenu(false)
                    }}
                    className='w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-full flex items-center
                    justify-center font-bold text-lg shadow-md hover:shadow-xl transition-all border-2 border-white ring-2 ring-transparent hover:ring-green-200 shrink-0'
                >
                    {userData ? userData?.name.slice(0, 1).toUpperCase() : <FaUserAstronaut size={18} className='text-white' />}
                </motion.button>

                <AnimatePresence>
                    {showUserPopup && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, type: "spring", stiffness: 200 }}
                            className='absolute top-full right-0 mt-3 w-60 bg-white shadow-2xl border border-gray-100 rounded-[1.25rem] p-2 z-50 origin-top-right'
                        >
                            <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                            
                            <div className='px-5 py-4 border-b border-gray-100 mb-2 bg-gray-50/50 rounded-t-xl'>
                                <p className='text-xs text-gray-500 font-bold uppercase tracking-wider mb-1'>Signed in as</p>
                                <p className='text-base text-gray-900 font-black truncate'>
                                    {userData?.name}
                                </p>
                            </div>
                            
                            <motion.button 
                                whileHover={{ x: 5, backgroundColor: 'rgba(243, 244, 246, 1)' }}
                                onClick={() => {
                                    navigate("/history");
                                    setShowUserPopup(false);
                                }}
                                className='w-full text-left text-sm py-3 px-4 rounded-xl font-bold text-gray-700 flex items-center gap-3 transition-colors'
                            >
                                <FaHistory className="text-gray-400 text-lg" /> Interview History
                            </motion.button>
                            
                            <motion.button 
                                whileHover={{ x: 5, backgroundColor: 'rgba(254, 226, 226, 0.5)' }}
                                onClick={handleLogout} 
                                className='w-full text-left text-sm py-3 px-4 rounded-xl font-bold text-red-600 flex items-center gap-3 transition-colors mt-1'
                            >
                                <HiOutlineLogout size={18} /> Logout
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        <AnimatePresence>
            {showMobileMenu && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden md:hidden z-50"
                >
                    <div className="flex flex-col p-4 space-y-2">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => {
                                    navigate(link.path);
                                    setShowMobileMenu(false);
                                }}
                                className={`text-left px-6 py-4 rounded-2xl font-bold transition-all ${
                                    location.pathname === link.path 
                                    ? 'bg-green-50 text-green-700 border border-green-100' 
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {link.name}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

      </motion.div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </div>
  )
}

export default Navbar