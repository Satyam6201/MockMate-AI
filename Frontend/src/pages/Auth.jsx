import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FcGoogle } from 'react-icons/fc';
import { FaCheckCircle, FaLock, FaShieldAlt } from 'react-icons/fa';
import { BsRobot } from 'react-icons/bs';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { serverUrl } from '../App.jsx';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Auth = ({ isModel = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const name = user.displayName || "Candidate";
      const email = user.email;

      const result = await axios.post(
        `${serverUrl}/api/auth/google`,
        { name, email },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      toast.success(`Welcome back, ${name}!`);

      if (!isModel) {
        navigate("/");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      if (error.code !== "auth/popup-closed-by-user") {
        toast.error(error?.response?.data?.message || error.message || "Authentication failed. Please try again.");
      }
      dispatch(setUserData(null));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative w-full ${isModel ? "py-2" : "min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-800 overflow-hidden font-sans"}`}>
      
      {!isModel && (
        <>
          <div className="absolute top-12 left-12 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
          <div className="absolute bottom-12 right-12 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`relative w-full max-w-md bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-xl p-7 sm:p-9 text-slate-800 space-y-6 z-10 ${
          isModel ? "shadow-none border-0 p-4" : ""
        }`}
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 text-xl font-bold mb-3">
            <BsRobot />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to MockMate AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Sign in to start realistic AI mock interviews, build ATS-optimized resumes, and receive 100 free credits.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-slate-800 font-semibold text-sm shadow-2xs transition active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FcGoogle className="text-xl shrink-0" />
            )}
            <span>{loading ? "Signing in..." : "Continue with Google"}</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600 shrink-0" />
            <span>100 Free Credits granted on registration</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600 shrink-0" />
            <span>Role-tailored AI Mock Interviews & scoring</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600 shrink-0" />
            <span>ATS Resume Builder & Missing Items Audit</span>
          </div>
        </div>

        <div className="pt-2 text-center text-[11px] text-slate-500 leading-relaxed border-t border-slate-100">
          By continuing, you agree to our{" "}
          <Link to="/privacy-policy" className="text-emerald-700 hover:underline font-medium">
            Privacy Policy
          </Link>{" "}
          and terms of service.
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;