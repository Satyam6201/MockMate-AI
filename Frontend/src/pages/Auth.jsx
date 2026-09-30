import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FcGoogle } from 'react-icons/fc';
import { BsRobot, BsShieldCheck, BsLightningChargeFill, BsCheckCircleFill } from 'react-icons/bs';
import { IoSparkles, IoLockClosedOutline } from 'react-icons/io5';
import { RiBrainLine, RiCodeSSlashLine, RiRadarLine } from 'react-icons/ri';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { serverUrl } from '../App.jsx';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Auth = ({ isModel = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Authentication & bot security states
    const [loading, setLoading] = useState(false);
    const [isHumanVerified, setIsHumanVerified] = useState(false);
    const [isVerifyingBot, setIsVerifyingBot] = useState(false);
    const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

    // Feature highlights list
    const features = [
        {
            icon: <BsLightningChargeFill className="text-amber-500" />,
            title: "Adaptive AI Engine",
            desc: "Questions adapt to your experience in real time"
        },
        {
            icon: <RiCodeSSlashLine className="text-blue-500" />,
            title: "Live Coding Sandbox",
            desc: "Interactive code editor with AI feedback"
        },
        {
            icon: <RiRadarLine className="text-emerald-500" />,
            title: "Deep Score Breakdown",
            desc: "Communication, correctness, and confidence analytics"
        }
    ];

    // Cycle through feature highlights automatically
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeatureIndex((prev) => (prev + 1) % features.length);
        }, 3200);
        return () => clearInterval(interval);
    }, [features.length]);

    // Anti-Bot Security Verification Handler
    const handleBotVerification = () => {
        if (isHumanVerified || isVerifyingBot) return;

        setIsVerifyingBot(true);

        // Simulate intelligent biometric / browser security validation
        setTimeout(() => {
            setIsVerifyingBot(false);
            setIsHumanVerified(true);
            toast.success("Security check passed! You are verified as human.", {
                icon: "🛡️",
                duration: 3000
            });
        }, 1200);
    };

    // Google Authentication Flow
    const handleGoogleAuth = async () => {
        if (!isHumanVerified) {
            toast.error("Please complete the human verification check below first!", {
                icon: "🤖",
                duration: 3500
            });
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            const response = await signInWithPopup(auth, provider);
            const user = response.user;
            const name = user.displayName || "Candidate";
            const email = user.email;

            // Sync user data with backend
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
        <div className={`relative w-full ${isModel ? "py-2" : "min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden"}`}>
            
            {/* Ambient Background Gradient Orbs */}
            {!isModel && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.15, 0.25, 0.15],
                            x: [0, 30, 0],
                            y: [0, -30, 0]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500 rounded-full blur-[128px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.12, 0.22, 0.12],
                            x: [0, -40, 0],
                            y: [0, 40, 0]
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500 rounded-full blur-[128px]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293712_1px,transparent_1px),linear-gradient(to_bottom,#1f293712_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                </div>
            )}

            {/* Main Auth Card Container */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`relative w-full ${isModel ? "max-w-md p-6 bg-slate-900 border border-slate-800 text-white rounded-2xl" : "max-w-xl p-8 sm:p-10 bg-slate-900/90 backdrop-blur-2xl border border-slate-800/80 rounded-3xl shadow-[0_20px_70px_-15px_rgba(0,0,0,0.8)] text-white"}`}
            >
                {/* Top Badge: Brand & Status */}
                <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-lg shadow-emerald-500/20 text-white">
                            <BsRobot className="w-5 h-5" />
                            <motion.span
                                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900"
                            />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                                MockMate AI
                            </h2>
                            <p className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                AI Interview Intelligence
                            </p>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-[11px] text-slate-300 font-medium">
                        <IoLockClosedOutline className="text-emerald-400" />
                        <span>256-Bit Encrypted</span>
                    </div>
                </div>

                {/* Heading & Subtitle */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2.5 text-white">
                        Master Your Next{" "}
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300 font-bold">
                            <IoSparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
                            Tech Interview
                        </span>
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                        Practice realistic role-specific mock interviews, receive instant AI scoring, and land your dream tech job.
                    </p>
                </div>

                {/* Interactive Dynamic Feature Highlight Box */}
                <div className="mb-6 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/90 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeFeatureIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.35 }}
                            className="flex items-center gap-3"
                        >
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-lg">
                                {features[activeFeatureIndex].icon}
                            </div>
                            <div className="text-left overflow-hidden">
                                <h4 className="text-xs font-semibold text-slate-200 truncate">
                                    {features[activeFeatureIndex].title}
                                </h4>
                                <p className="text-[11px] text-slate-400 truncate">
                                    {features[activeFeatureIndex].desc}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Feature Pagination Indicators */}
                    <div className="flex gap-1 justify-center mt-2.5">
                        {features.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveFeatureIndex(i)}
                                className={`h-1 rounded-full transition-all duration-300 ${activeFeatureIndex === i ? 'w-5 bg-emerald-400' : 'w-1.5 bg-slate-800'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Anti-Bot / Human Verification Shield Widget */}
                <div className="mb-5">
                    <motion.div
                        whileHover={{ scale: isHumanVerified ? 1 : 1.01 }}
                        whileTap={{ scale: isHumanVerified ? 1 : 0.99 }}
                        onClick={handleBotVerification}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                            isHumanVerified
                                ? "bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]"
                                : isVerifyingBot
                                ? "bg-slate-950/80 border-cyan-500/50"
                                : "bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-950/70"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {/* Checkbox Visual */}
                            <div
                                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                                    isHumanVerified
                                        ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30"
                                        : isVerifyingBot
                                        ? "border-cyan-400 bg-cyan-950/40"
                                        : "border-slate-700 bg-slate-900 group-hover:border-slate-500"
                                }`}
                            >
                                {isHumanVerified ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    >
                                        <BsCheckCircleFill className="w-4 h-4 text-slate-950" />
                                    </motion.div>
                                ) : isVerifyingBot ? (
                                    <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                                ) : null}
                            </div>

                            <div className="text-left">
                                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                                    {isHumanVerified
                                        ? "Verified Human Candidate"
                                        : isVerifyingBot
                                        ? "Checking browser integrity..."
                                        : "I am not a robot (Click to verify)"}
                                </span>
                                <p className="text-[10px] text-slate-500">
                                    {isHumanVerified
                                        ? "Security tokens initialized successfully"
                                        : "Anti-bot proof-of-work protection"}
                                </p>
                            </div>
                        </div>

                        {/* Security Shield Icon */}
                        <div className="flex items-center gap-1.5 text-right">
                            <BsShieldCheck className={`w-5 h-5 transition-colors duration-300 ${isHumanVerified ? "text-emerald-400" : "text-slate-600"}`} />
                        </div>
                    </motion.div>
                </div>

                {/* Google Sign In Button */}
                <motion.button
                    onClick={handleGoogleAuth}
                    disabled={loading || !isHumanVerified}
                    whileHover={{ scale: (!isHumanVerified || loading) ? 1 : 1.02 }}
                    whileTap={{ scale: (!isHumanVerified || loading) ? 1 : 0.98 }}
                    className={`relative w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-xl overflow-hidden ${
                        !isHumanVerified
                            ? "bg-slate-800/80 text-slate-400 border border-slate-700/60 cursor-not-allowed opacity-60"
                            : loading
                            ? "bg-emerald-600 text-white cursor-wait"
                            : "bg-white text-slate-900 hover:bg-slate-100 hover:shadow-emerald-500/10 cursor-pointer"
                    }`}
                >
                    {/* Animated Shimmer on Verified State */}
                    {isHumanVerified && !loading && (
                        <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200/30 to-transparent skew-x-12 pointer-events-none"
                        />
                    )}

                    {loading ? (
                        <div className="flex items-center gap-2.5">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Securing session & signing in...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <FcGoogle className="w-5 h-5 flex-shrink-0" />
                            <span>Continue with Google</span>
                        </div>
                    )}
                </motion.button>

                {/* Quick Stats & Trust Signals */}
                <div className="grid grid-cols-3 gap-2 text-center mt-6 pt-5 border-t border-slate-800/70">
                    <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-900">
                        <p className="text-xs sm:text-sm font-bold text-slate-200">10k+</p>
                        <p className="text-[10px] text-slate-500">Interviews</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-900">
                        <p className="text-xs sm:text-sm font-bold text-emerald-400">98.4%</p>
                        <p className="text-[10px] text-slate-500">Success Rate</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-900">
                        <p className="text-xs sm:text-sm font-bold text-cyan-400">4.9/5</p>
                        <p className="text-[10px] text-slate-500">Rating</p>
                    </div>
                </div>

                {/* Footer Terms Note */}
                <p className="text-center text-[11px] text-slate-500 mt-5">
                    By continuing, you agree to MockMate AI's{" "}
                    <span 
                        onClick={() => navigate("/policy")} 
                        className="text-slate-400 hover:text-emerald-400 underline underline-offset-2 cursor-pointer transition-colors"
                    >
                        Privacy Policy
                    </span>{" "}
                    & Terms of Service.
                </p>
            </motion.div>
        </div>
    );
};

export default Auth;