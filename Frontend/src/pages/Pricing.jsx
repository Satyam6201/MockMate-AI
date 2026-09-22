import React, { useState } from 'react'
import { FaArrowLeft, FaCheckCircle, FaStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from "motion/react";
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import AuthModel from '../components/AuthModel';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Pricing = () => {
  const navigate = useNavigate();
  const [ selectedPlan, setSelectedPlan ] = useState("pro");
  const [ loadingPlan, setLoadingPlan ] = useState(null);
  const [ showAuth, setShowAuth ] = useState(false);
  const dispatch = useDispatch();
  
  // Get user data to check if logged in
  const { userData } = useSelector((state) => state.user);

  const plans = [
    {
      id: "free",
      name: "Free Tier",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Reports",
        "Voice Interview Access",
        "Limited History Tracking"
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed AI Feedback",
        "Performance Analytics",
        "Full Interview History"
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Analysis",
        "Skill Trend Tracking",
        "Priority AI Processing"
      ],
      badge: "Most Popular",
    },
  ];

   const handlePayment = async (plan) => {
    // SECURITY CHECK: Ensure user is logged in before paying
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
      }, {withCredentials: true});

      if (result.data.url) {
        window.location.href = result.data.url;
      }

      setLoadingPlan(null);

    } catch (error) {
      console.log(error);
      setLoadingPlan(null);
    }
   }

   const containerVariants = {
       hidden: { opacity: 0 },
       visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
   };

   const itemVariants = {
       hidden: { opacity: 0, y: 30 },
       visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
   };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col font-sans overflow-hidden'>
      <Navbar />

      <div className='flex-1 relative py-12 px-4 sm:px-6'>
        
        {/* Decorative background blur elements */}
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse'></div>
        <div className='absolute bottom-0 right-1/4 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000'></div>

        <div className='max-w-6xl mx-auto relative z-10'>

          {/* Header */}
          <div className='mb-16 flex flex-col md:flex-row items-center md:items-start gap-6'>
            <motion.button 
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className='p-4 rounded-full bg-white shadow-sm border border-gray-100 hover:shadow-md transition text-gray-600 shrink-0'
            >
              <FaArrowLeft />
            </motion.button>

            <div className='text-center md:text-left w-full'>
              <h1 className='text-4xl md:text-5xl font-extrabold text-gray-900'>
                Simple, transparent <span className='text-green-600'>pricing</span>
              </h1>
              <p className='text-gray-500 mt-4 text-lg max-w-2xl mx-auto md:mx-0'>
                Choose the perfect plan to boost your interview skills. No hidden fees. Pay securely via Stripe and unlock credits instantly.
              </p>
            </div>
          </div>

          {/* Pricing Cards */}
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
                  whileHover={!plan.default && { y: -8 }}
                  onClick={() => !plan.default && setSelectedPlan(plan.id)}
                  className={`relative rounded-[2rem] p-8 transition-all duration-300 border flex flex-col
                    ${isSelected ? "border-green-500 shadow-2xl bg-white scale-[1.02]" : "border-gray-100 bg-white shadow-md"}
                    ${plan.default ? "cursor-default opacity-80" : "cursor-pointer"}
                  `}
                >
                  {/* badge */}
                  {plan.badge && (
                    <div className='absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider'>
                      <FaStar /> {plan.badge}
                    </div>
                  )}

                  {/* Default tag */}
                  {plan.default && (
                    <div className='absolute top-6 right-6 bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full uppercase'>
                      Current
                    </div>
                  )}

                  {/* Plan Name */}
                  <h3 className={`text-xl font-bold ${isSelected ? 'text-green-600' : 'text-gray-800'}`}>
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className='mt-4 flex items-baseline gap-2'>
                    <span className='text-4xl font-extrabold text-gray-900'>
                      {plan.price}
                    </span>
                    <span className='text-gray-500 font-medium'>
                      / one-time
                    </span>
                  </div>
                  
                  <div className='mt-3 bg-gray-50 inline-block w-max px-3 py-1 rounded-lg border border-gray-100'>
                    <p className='text-gray-700 font-bold text-sm'>
                      🪙 {plan.credits} Credits
                    </p>
                  </div>

                  {/* Description */}
                  <p className='text-gray-500 mt-5 text-sm leading-relaxed border-b border-gray-100 pb-5'>
                    {plan.description}
                  </p>

                  {/* Feature */}
                  <div className='mt-6 space-y-4 text-left flex-1'>
                    {plan.features.map((feature, i) => (
                      <div key={i} className='flex items-start gap-3'>
                        <FaCheckCircle className={`mt-0.5 shrink-0 ${isSelected ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className='text-gray-700 text-sm font-medium'>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {
                    !plan.default && (
                      <motion.button 
                        disabled={loadingPlan === plan.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isSelected) {
                            setSelectedPlan(plan.id);
                          } else {
                            handlePayment(plan);
                          }
                        }}
                        className={`w-full mt-8 py-4 rounded-xl font-bold transition-all shadow-md
                          ${isSelected 
                            ? "bg-gray-900 text-white hover:bg-black hover:shadow-lg" 
                            : "bg-gray-50 text-gray-700 hover:bg-gray-200"
                          }
                        `}
                      >
                        {loadingPlan === plan.id 
                          ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              Processing...
                            </span>
                          ) 
                          : isSelected ? "Proceed to Checkout" : "Select Plan"
                        }
                      </motion.button>
                    )
                  }
                  
                  {plan.default && (
                     <button disabled className="w-full mt-8 py-4 rounded-xl font-bold bg-gray-100 text-gray-400 cursor-not-allowed">
                        Included Free
                     </button>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
          
          {/* FAQ / Feature section added at the bottom */}
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className='mt-24 bg-white border border-gray-100 rounded-[2.5rem] p-10 sm:p-12 shadow-sm'
          >
             <h3 className='text-2xl font-bold text-gray-900 mb-8 text-center'>Why upgrade your plan?</h3>
             <div className='grid md:grid-cols-3 gap-8'>
                <div className='text-center'>
                   <div className='bg-green-50 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl'>🚀</div>
                   <h4 className='font-bold text-gray-900 mb-2'>Unlimited Practice</h4>
                   <p className='text-gray-500 text-sm'>More credits mean you can practice repeatedly until you perfect your pitch and answers.</p>
                </div>
                <div className='text-center'>
                   <div className='bg-blue-50 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl'>📊</div>
                   <h4 className='font-bold text-gray-900 mb-2'>Deeper Analytics</h4>
                   <p className='text-gray-500 text-sm'>Unlock historical trends and advanced AI insights that point exactly to where you need to improve.</p>
                </div>
                <div className='text-center'>
                   <div className='bg-purple-50 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl'>🔒</div>
                   <h4 className='font-bold text-gray-900 mb-2'>Secure Payments</h4>
                   <p className='text-gray-500 text-sm'>All payments are securely processed by Stripe. You get your credits instantly upon purchase.</p>
                </div>
             </div>
          </motion.div>

        </div>
      </div>

      <Footer />
      {/* Auth Model for Unauthenticated Users */}
      <AnimatePresence>
        {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </div>
  )
}

export default Pricing