import React from 'react';
import { 
  FaArrowLeft, FaBookOpen, FaCoins, FaMicrophoneAlt, FaChartBar, 
  FaRocket, FaFileAlt, FaMagic, FaShieldAlt, FaCode, FaCheckCircle
} from 'react-icons/fa';
import { BsShieldCheck, BsLightningChargeFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Docs = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const docSections = [
    {
      icon: <FaRocket />,
      title: "1. Getting Started & Credits",
      desc: "Sign in using your Google account to get started instantly. Every new user receives 100 free credits to test mock interviews and explore all features immediately without any upfront commitment."
    },
    {
      icon: <FaMicrophoneAlt />,
      title: "2. AI Mock Interviews",
      desc: "Practice realistic technical, behavioral, and system design interviews. Upload your resume or specify your target role. Our AI conducts a real-time conversational interview with speech recognition and dynamic question branching."
    },
    {
      icon: <FaChartBar />,
      title: "3. Comprehensive Performance Reports",
      desc: "After finishing an interview session, receive an instant, deep report evaluating Technical Accuracy, Communication Clarity, and Confidence metrics, with actionable improvement roadmaps."
    },
    {
      icon: <FaFileAlt />,
      title: "4. ATS Resume Builder & Templates",
      desc: "Build recruiter-approved resumes designed to score high on Applicant Tracking Systems. Choose from Harvard Classic and Minimalist (100% Free - 0 credits) or Modern Tech and Two-Column layouts (Pro - 50 credits)."
    },
    {
      icon: <BsShieldCheck />,
      title: "5. ATS Audit & Missing Items Detector",
      desc: "Use the built-in diagnostic tool to scan your resume in real time. It calculates your ATS compliance percentage, assigns a letter grade, and itemizes missing contact fields, keywords, or quantifiable metrics with one-click editor fixes."
    },
    {
      icon: <FaMagic />,
      title: "6. AI Bullet Point Enhancer",
      desc: "Transform basic duty descriptions into high-impact accomplishment bullets packed with action verbs (e.g., 'Architected', 'Spearheaded') and quantified performance metrics."
    },
    {
      icon: <FaCode />,
      title: "7. SDE Preparation Hub",
      desc: "Explore curated topic tracks for SDE-1, SDE-2, and SDE-3 roles covering High-Level Design (HLD), Low-Level Design (LLD), Data Structures & Algorithms, OS, DBMS, and Networks."
    },
    {
      icon: <FaCoins />,
      title: "8. Credit System & Secure Payments",
      desc: "Manage your credits transparently. Top up credits securely via Stripe with 256-bit encryption. Credits never expire and apply seamlessly to mock interviews and Pro resume exports."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 relative">
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>

      <Navbar />

      <div className="flex-1 relative py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto relative z-10">
          
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-3 rounded-full bg-white shadow-xs hover:shadow-sm border border-slate-200 transition text-slate-600 hover:text-slate-900"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                <FaBookOpen className="text-emerald-600" /> Platform Documentation
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Complete guide to MockMate AI features, interview tools, and resume intelligence
              </p>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 space-y-8"
          >
            <motion.p variants={itemVariants} className="text-sm sm:text-base text-slate-600 leading-relaxed border-b border-slate-100 pb-6">
              Welcome to the official <strong>MockMate AI</strong> knowledge base. MockMate AI is built to give engineering candidates an unfair advantage in tech hiring through realistic conversational AI mock interviews and recruiter-tested ATS resume intelligence.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {docSections.map((section, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-slate-50 hover:bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 transition shadow-2xs hover:shadow-xs space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg font-bold shadow-xs">
                      {section.icon}
                    </div>
                    <h2 className="text-base font-bold text-slate-900">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {section.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Need personal assistance?</h3>
                <p className="text-xs text-slate-500">Our AI Support Assistant is available 24/7 in the bottom-right corner.</p>
              </div>
              <button
                onClick={() => navigate("/resume")}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
              >
                Launch Resume Builder
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Docs;