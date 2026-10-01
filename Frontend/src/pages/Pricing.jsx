import React, { useState } from 'react';
import { FaArrowLeft, FaCheckCircle, FaStar, FaCoins } from 'react-icons/fa';
import { BsRocketTakeoff, BsBarChart, BsShieldCheck } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "motion/react";
import axios from 'axios';
import { serverUrl } from '../App';
import { useSelector } from 'react-redux';
import AuthModel from '../components/AuthModel';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const { userData } = useSelector((state) => state.user);

  const plans = [
    {
      id: "free",
      name: "Free Tier",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview and ATS resume preparation.",
      features: [
        "100 AI Platform Credits",
        "Harvard Classic & Minimalist Resumes (Free)",
        "Live ATS Screening Diagnostic Audit",
        "Voice Interview Access"
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and multi-template ATS exports.",
      features: [
        "150 AI Platform Credits",
        "Pro ATS Templates (Modern Tech & Compact)",
        "Detailed AI Feedback & Scorecards",
        "Full Interview History & PDF Exports"
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for comprehensive tech interview & career preparation.",
      features: [
        "650 AI Platform Credits",
        "Unlimited Pro ATS Resume Downloads",
        "Advanced AI Bullet Point Enhancer",
        "Priority Voice & Real-time AI Processing"
      ],
      badge: "Most Popular",
    },
  ];

  const handlePayment = async (plan) => {
    if (!userData) {
      setShowAuth(true);
      return;
    }

    try {
      setLoadingPlan(plan.id);
      const amount = plan.id === "basic" ? 100 : plan.id === "pro" ? 500 : 0;

      const result = await axios.post(serverUrl + "/api/payment/create-checkout-session", {
        planId: plan.id,
        amount: amount,
        credits: plan.credits
      }, { withCredentials: true });

      if (result.data.url) {
        window.location.href = result.data.url;
      }

      setLoadingPlan(null);
    } catch (error) {
      console.log(error);
      setLoadingPlan(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col font-sans overflow-hidden text-slate-800'>
      <Navbar />

      <div className='flex-1 relative py-12 px-4 sm:px-6'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse pointer-events-none'></div>
        <div className='absolute bottom-0 right-1/4 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000 pointer-events-none'></div>

        <div className='max-w-6xl mx-auto relative z-10'>
          <div className='mb-16 flex flex-col md:flex-row items-center md:items-start gap-6'>
            <motion.button 
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className='p-4 rounded-full bg-white shadow-xs border border-slate-200 hover:shadow-md transition text-slate-600 shrink-0'
            >
              <FaArrowLeft />
            </motion.button>

            <div className='text-center md:text-left w-full'>
              <h1 className='text-4xl md:text-5xl font-black text-slate-900 tracking-tight'>
                Simple, Transparent <span className='text-emerald-600'>Pricing</span>
              </h1>
              <p className='text-slate-500 mt-4 text-base sm:text-lg max-w-2xl mx-auto md:mx-0 font-normal'>
                Choose the perfect credit package to fuel your interview simulations and ATS resume builder exports. Pay securely via Stripe.
              </p>
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'
          >
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;

              return (
                <motion.div 
                  key={plan.id}
                  variants={itemVariants}
                  whileHover={!plan.default ? { y: -6 } : {}}
                  onClick={() => !plan.default && setSelectedPlan(plan.id)}
                  className={`relative rounded-3xl p-8 transition-all duration-300 border flex flex-col
                    ${isSelected ? "border-emerald-500 shadow-xl bg-white scale-[1.02]" : "border-slate-200 bg-white shadow-xs"}
                    ${plan.default ? "cursor-default opacity-85" : "cursor-pointer"}
                  `}
                >
                  {plan.badge && (
                    <div className='absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-extrabold px-4 py-1 rounded-full shadow-md flex items-center gap-1.5 uppercase tracking-wider'>
                      <FaStar className="text-[10px]" /> {plan.badge}
                    </div>
                  )}

                  {plan.default && (
                    <div className='absolute top-6 right-6 bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase'>
                      Included
                    </div>
                  )}

                  <h3 className={`text-xl font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>

                  <div className='mt-4 flex items-baseline gap-2'>
                    <span className='text-4xl font-extrabold text-slate-900'>
                      {plan.price}
                    </span>
                    <span className='text-slate-500 font-medium text-sm'>
                      / one-time
                    </span>
                  </div>
                  
                  <div className='mt-3 bg-slate-50 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 font-bold text-xs'>
                    <FaCoins className="text-amber-500" />
                    <span>{plan.credits} Credits</span>
                  </div>

                  <p className='text-slate-600 mt-5 text-xs sm:text-sm leading-relaxed border-b border-slate-100 pb-5'>
                    {plan.description}
                  </p>

                  <div className='mt-6 space-y-3.5 text-left flex-1'>
                    {plan.features.map((feature, i) => (
                      <div key={i} className='flex items-start gap-2.5 text-xs sm:text-sm'>
                        <FaCheckCircle className={`mt-0.5 shrink-0 text-sm ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className='text-slate-700 font-medium'>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {!plan.default && (
                    <motion.button 
                      disabled={loadingPlan === plan.id}
                      whileTap={{ scale: 0.96 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isSelected) {
                          setSelectedPlan(plan.id);
                        } else {
                          handlePayment(plan);
                        }
                      }}
                      className={`w-full mt-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md
                        ${isSelected 
                          ? "bg-slate-900 text-white hover:bg-slate-800" 
                          : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                        }
                      `}
                    >
                      {loadingPlan === plan.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Processing with Stripe...
                        </span>
                      ) : isSelected ? "Proceed to Checkout" : "Select Plan"}
                    </motion.button>
                  )}
                  
                  {plan.default && (
                    <button disabled className="w-full mt-8 py-3.5 rounded-xl font-bold bg-slate-100 text-slate-400 cursor-not-allowed text-sm">
                      Default Free Tier
                    </button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='mt-20 bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xs'
          >
            <h3 className='text-2xl font-black text-slate-900 mb-8 text-center'>Why upgrade your credits?</h3>
            <div className='grid md:grid-cols-3 gap-8'>
              <div className='text-center space-y-2'>
                <div className='bg-emerald-50 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-xs'>
                  <BsRocketTakeoff />
                </div>
                <h4 className='font-bold text-slate-900 text-base'>Pro ATS Templates</h4>
                <p className='text-slate-600 text-xs sm:text-sm leading-relaxed'>
                  Export modern two-column and tech ATS resumes formatted for high-volume technical recruiter screening.
                </p>
              </div>

              <div className='text-center space-y-2'>
                <div className='bg-teal-50 text-teal-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-xs'>
                  <BsBarChart />
                </div>
                <h4 className='font-bold text-slate-900 text-base'>Unlimited Voice Mock Rounds</h4>
                <p className='text-slate-600 text-xs sm:text-sm leading-relaxed'>
                  Simulate dynamic technical interviews repeatedly with speech-to-speech AI recruiters until your answers are crisp.
                </p>
              </div>

              <div className='text-center space-y-2'>
                <div className='bg-blue-50 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-xs'>
                  <BsShieldCheck />
                </div>
                <h4 className='font-bold text-slate-900 text-base'>Secure Stripe Checkout</h4>
                <p className='text-slate-600 text-xs sm:text-sm leading-relaxed'>
                  All payments are securely processed via Stripe with 256-bit encryption. Credits are delivered instantly.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />

      <AnimatePresence>
        {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Pricing;