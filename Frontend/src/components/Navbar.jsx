import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'motion/react'
import { BsRobot, BsCoin } from 'react-icons/bs';
import { HiOutlineLogout } from 'react-icons/hi';
import { FaUserAstronaut } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';

const Navbar = () => {

    const { userData } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [showCreditPopup, setShowCreditPopup] = useState(false);
    const [showUserPopup, setShowUserPopup] = useState(false);
    const navigate = useNavigate();
    const [showAuth, setShowAuth] = useState(false);

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

  return (
    <div className='bg-[#f3f3f3] flex justify-center px-4 pt-6'>
      <motion.div 
        initial={{opacity: 0, y: -40}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
      
      className='w-full max-w-6xl bg-white rounded-[24px] shadow-sm border 
      border-gray-200 px-8 py-4 flex justify-between items-center relative'>

        <div className='flex items-center gap-3 cursor-pointer'>
            <div className='bg-black text-white p-2 rounded-lg'>
                <BsRobot size={20}/>
            </div>
            <h1 className='font-semibold hidden md:block text-lg'>MockMate AI</h1>
        </div>

        <div className='flex items-center gap-6 relative'>

            <div className='relative'>
                <button onClick={() => {
                    if (!userData) {
                        setShowAuth(true);
                        return;
                    }
                    setShowCreditPopup(!showCreditPopup);
                    setShowUserPopup(false);
                }}

                 className='flex items-center gap-2 bg-gray-100
                px-4 py-2 rounded-full text-md hover:bg-gray-200 transition'>
                    <BsCoin size={20} />
                    {userData?.credits || 0}
                </button>
                {showCreditPopup && (
                    <div
                       className='absolute right-0 sm:right-2 md:right-4 mt-3 w-56 sm:w-64 md:w-72
                    bg-white shadow-xl border border-gray-200 rounded p-4 sm:p-5 z-50'
                    >
                    <p className='text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4'>
                       Need more credits to continue interview
                    </p>

                <button
                onClick={() => navigate("/payment")}
                className='w-full bg-black text-white py-3 sm:py-4 rounded-full text-xs sm:text-sm'
                >
                Buy More credits
                </button>
                </div>
                )}
            </div>

            <div className='relative'>
                <button 
                onClick={() => {
                    if (!userData) {
                        setShowAuth(true);
                        return;
                    }
                    setShowUserPopup(!showUserPopup)
                    setShowCreditPopup(false)
                }}
                className='w-9 h-9 bg-black text-white rounded-full flex items-center
                justify-center font-semibold'>
                    {userData? userData?.name.slice(0, 1).toUpperCase() : 
                    <FaUserAstronaut size={18}/>}
                </button>

                {showUserPopup && (
                    <div className='absolute right-0 mt-3 w-48 bg-white
                    shadow-xl border border-gray-200 rounded-xl p-4 z-50'>
                        <p className='text-md text-blue-500 font-medium mb-1'>
                            {userData?.name.toUpperCase()}
                        </p>
                        <button onClick={() => navigate("/history")}
                         className='w-full text-left text-sm py-2 
                        hover:text-black text-gray-600'>Interview History
                        </button>
                        <button onClick={handleLogout} 
                        className='w-full text-left text-sm py-2 flex items-center
                        gap-2 text-red-500'>
                            <HiOutlineLogout size={16} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>

      </motion.div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </div>
  )
}

export default Navbar