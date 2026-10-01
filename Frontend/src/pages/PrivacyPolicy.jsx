import React from 'react';
import { FaArrowLeft, FaShieldAlt, FaLock, FaUserShield, FaDatabase, FaCreditCard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <FaUserShield />,
      title: "1. Information We Collect",
      content: "When you sign in using Google Authentication, we receive basic profile details (your name and verified email address). When taking mock interviews or building resumes, we process your input text, target job preferences, and audio transcriptions solely to provide live evaluation and real-time ATS feedback."
    },
    {
      icon: <FaDatabase />,
      title: "2. Resume & Interview Data Confidentiality",
      content: "Your resumes, uploaded PDFs, and interview responses belong strictly to you. We do not sell, rent, or share candidate data with third-party recruiters or advertising networks. All resume data is stored securely and accessible only through your authenticated account."
    },
    {
      icon: <FaCreditCard />,
      title: "3. Payment & Billing Security",
      content: "All payments and credit purchases are processed directly through Stripe's certified PCI-DSS Level 1 payment gateway. MockMate AI never captures, logs, or stores your credit card numbers or sensitive payment details on our servers."
    },
    {
      icon: <FaLock />,
      title: "4. Data Security & Storage",
      content: "We implement industry-standard encryption protocols (TLS/SSL in transit and AES-256 at rest) alongside MongoDB query sanitization to protect your personal information against unauthorized access, alteration, or disclosure."
    },
    {
      icon: <FaShieldAlt />,
      title: "5. Your Data Rights & Deletion",
      content: "You have full control over your personal data. You may review your interview history, export your resumes, or request permanent deletion of your account and associated session records at any time by contacting our support team."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 relative">
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>

      <Navbar />

      <div className="flex-1 relative py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto relative z-10">
          
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-3 rounded-full bg-white shadow-xs hover:shadow-sm border border-slate-200 transition text-slate-600 hover:text-slate-900"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                <FaShieldAlt className="text-emerald-600" /> Privacy Policy
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Last updated: October 2026 &bull; Clear, transparent data handling
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 space-y-6"
          >
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed border-b border-slate-100 pb-4">
              At <strong>MockMate AI</strong>, we take your privacy and data security seriously. This policy outlines how your information is handled when you use our mock interview tools, ATS resume architect, and preparation platform.
            </p>

            <div className="space-y-6">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold">
                      {section.icon}
                    </div>
                    <h2 className="text-base font-bold text-slate-900">{section.title}</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-10.5">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;