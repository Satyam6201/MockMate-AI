import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'motion/react'
import { BsRobot, BsCoin } from 'react-icons/bs';
import { HiOutlineLogout, HiSparkles } from 'react-icons/hi';
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
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [showAuth, setShowAuth] = useState(false);

    // Track scrolling for sticky navbar effect
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

    // Close popups when clicking outside (simple approach: close on scroll)
    useEffect(() => {
        const closePopups = () => {
            setShowCreditPopup(false);
            setShowUserPopup(false);
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
    <div className={`flex justify-center px-4 pt-4 pb-2 sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <motion.div 
        initial={{opacity: 0, y: -40}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6, type: "spring", stiffness: 100}}
        className={`w-full max-w-7xl rounded-[24px] px-6 sm:px-8 py-3 flex justify-between items-center relative transition-all duration-300
        ${isScrolled ? 'bg-white border-transparent' : 'bg-white shadow-sm border border-gray-200'}`}
      >

        {/* Logo Section */}
        <motion.div 
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='flex items-center gap-3 cursor-pointer group'
        >
            <div className='bg-gradient-to-br from-gray-900 to-black text-white p-2.5 rounded-xl shadow-md group-hover:shadow-lg group-hover:from-green-600 group-hover:to-emerald-700 transition-all'>
                <BsRobot size={22} className='group-hover:rotate-12 transition-transform duration-300'/>
            </div>
            <h1 className='font-bold hidden md:block text-xl tracking-tight text-gray-900'>
                MockMate <span className='text-green-600'>AI</span>
            </h1>
        </motion.div>

        {/* Center Links (Desktop only) */}
        <div className='hidden md:flex items-center gap-8'>
            {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                    <div key={link.name} className="relative group">
                        <button 
                            onClick={() => navigate(link.path)}
                            className={`text-sm font-semibold transition-colors ${isActive ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            {link.name}
                        </button>
                        {isActive && (
                            <motion.div 
                                layoutId="underline"
                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-500 rounded-full"
                            />
                        )}
                        {!isActive && (
                            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-300 rounded-full transition-all group-hover:w-full" />
                        )}
                    </div>
                )
            })}
        </div>

        {/* Right Section Actions */}
        <div className='flex items-center gap-4 sm:gap-6 relative'>

            {/* Credits Info */}
            <div className='relative flex items-center gap-2'>
                {userData && (
                    <div className='hidden sm:flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-100 rounded-full'>
                        <div className={`w-2 h-2 rounded-full ${
                            socketStatus === 'CONNECTED' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
                            socketStatus === 'CONNECTING' ? 'bg-yellow-500 animate-pulse' :
                            socketStatus === 'ERROR' || socketStatus === 'DISCONNECTED' ? 'bg-red-500' : 'bg-gray-300'
                        }`} title={`Socket: ${socketStatus}`}></div>
                        <span className='text-[10px] uppercase font-bold text-gray-400'>{socketStatus === 'CONNECTED' ? 'Live' : socketStatus}</span>
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
                    }}
                    className='flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200
                    px-4 py-2 rounded-full text-sm font-bold text-gray-700 hover:shadow-md transition-all'
                >
                    <BsCoin size={18} className='text-yellow-500 drop-shadow-sm' />
                    {userData?.credits || 0}
                </motion.button>

                {/* Credit Popup Dropdown */}
                <AnimatePresence>
                    {showCreditPopup && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className='absolute right-0 mt-4 w-64 sm:w-72 bg-white shadow-2xl border border-gray-100 rounded-2xl p-5 z-50 origin-top-right'
                        >
                            <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                            
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-yellow-100 p-2 rounded-full">
                                    <HiSparkles className="text-yellow-600 text-lg" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Credits Balance</h4>
                                    <p className="text-xs text-gray-500 font-medium">{userData?.credits || 0} interviews left</p>
                                </div>
                            </div>
                            
                            <p className='text-xs text-gray-600 mb-4 leading-relaxed'>
                                Want to practice more? Upgrade your plan to unlock premium interviews and advanced insights.
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    navigate("/payment");
                                    setShowCreditPopup(false);
                                }}
                                className='w-full bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-800 text-white py-3 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2'
                            >
                                <FaCreditCard /> Buy More Credits
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* User Profile */}
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
                    }}
                    className='w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center
                    justify-center font-bold text-lg shadow-md hover:shadow-lg transition-all border-2 border-white ring-2 ring-transparent hover:ring-green-100'
                >
                    {userData ? userData?.name.slice(0, 1).toUpperCase() : <FaUserAstronaut size={18} className='text-white' />}
                </motion.button>

                {/* User Popup Dropdown */}
                <AnimatePresence>
                    {showUserPopup && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className='absolute right-0 mt-4 w-56 bg-white shadow-2xl border border-gray-100 rounded-2xl p-2 z-50 origin-top-right'
                        >
                            <div className="absolute -top-2 right-3 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                            
                            <div className='px-4 py-3 border-b border-gray-100 mb-2'>
                                <p className='text-sm text-gray-500 font-medium'>Signed in as</p>
                                <p className='text-base text-gray-900 font-bold truncate'>
                                    {userData?.name}
                                </p>
                            </div>
                            
                            <motion.button 
                                whileHover={{ x: 4, backgroundColor: 'rgba(243, 244, 246, 1)' }}
                                onClick={() => {
                                    navigate("/history");
                                    setShowUserPopup(false);
                                }}
                                className='w-full text-left text-sm py-2.5 px-4 rounded-xl font-medium text-gray-700 flex items-center gap-3 transition-colors'
                            >
                                <FaHistory className="text-gray-400" /> Interview History
                            </motion.button>
                            
                            <motion.button 
                                whileHover={{ x: 4, backgroundColor: 'rgba(254, 226, 226, 0.5)' }}
                                onClick={handleLogout} 
                                className='w-full text-left text-sm py-2.5 px-4 rounded-xl font-bold text-red-600 flex items-center gap-3 transition-colors mt-1'
                            >
                                <HiOutlineLogout size={18} /> Logout
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

      </motion.div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </div>
  )
}

export default Navbar