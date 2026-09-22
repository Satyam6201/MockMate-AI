import { motion } from 'motion/react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { BsRobot, BsMic, BsClock, BsBarChart, BsFileEarmarkText, BsCheckCircleFill, BsStarFill } from 'react-icons/bs'
import { HiSparkles, HiArrowRight } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AuthModel from '../components/AuthModel'
import evalImg from "../assets/ai-ans.png"
import confi from '../assets/confi.png'
import credit from "../assets/credit.png"
import history from '../assets/history.png'
import hr from '../assets/HR.png';
import MM from '../assets/MM.png'
import pdf from '../assets/pdf.png'
import resume from '../assets/resume.png'
import tech from '../assets/tech.png'
import Footer from '../components/Footer'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: 'spring', stiffness: 100 } }
}

const Home = () => {

  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col font-sans overflow-hidden'>
      <Navbar />

      <div className='flex-1 px-6 py-12 md:py-24 relative'>
        {/* Decorative background blur elements */}
        <div className='absolute top-20 left-10 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse'></div>
        <div className='absolute top-40 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000'></div>

        <div className='max-w-7xl mx-auto relative z-10'>

          {/* Hero Section */}
          <div className='flex flex-col items-center text-center mb-32'>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className='bg-white border border-gray-200 text-gray-700 text-sm px-6 py-2 rounded-full flex items-center gap-2 mb-8 shadow-sm hover:shadow-md transition-shadow cursor-pointer'>
              <HiSparkles size={18} className='text-green-500' />
              <span className='font-medium'>Next-Gen AI Interview Platform</span>
            </motion.div>

            <motion.h1 
              initial={{opacity: 0, y: -20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.7, type: 'spring', bounce: 0.4 }}
              className='text-5xl md:text-7xl font-extrabold leading-tight max-w-5xl mx-auto text-gray-900'>
              Master Your Next Interview with
              <span className='inline-block ml-3 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-700'>
                AI Intelligence
              </span>
            </motion.h1>

            <motion.p 
              initial={{opacity: 0 }}
              animate={{opacity: 1 }}
              transition={{duration: 0.8, delay: 0.2 }}
              className='text-gray-600 mt-8 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed'>
              Experience role-based mock interviews with smart follow-ups,
              adaptive difficulty, and comprehensive real-time performance analytics.
            </motion.p>

            <motion.div 
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6, delay: 0.4}}
              className='flex flex-col sm:flex-row justify-center gap-4 mt-10 w-full sm:w-auto'>
              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview");
                }}
                whileHover={{scale: 1.05}} 
                whileTap={{scale: 0.95}}
                className='bg-gray-900 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-2 font-semibold text-lg'>
                Start Interview Now <HiArrowRight />
              </motion.button>

              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/history");
                }}
                whileHover={{scale: 1.05}} 
                whileTap={{scale: 0.95}}
                className='bg-white border-2 border-gray-200 text-gray-800 px-8 py-4 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all font-semibold text-lg shadow-sm'>
                View Past Sessions
              </motion.button>
            </motion.div>
          </div>

          {/* Stats / Trust Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='flex flex-wrap justify-center gap-8 md:gap-24 mb-32 border-y border-gray-200 py-10'>
            {[
              { label: 'Interviews Conducted', value: '10,000+' },
              { label: 'Success Rate', value: '94%' },
              { label: 'AI Models', value: 'Latest Gen' }
            ].map((stat, i) => (
              <div key={i} className='text-center'>
                <h4 className='text-3xl font-bold text-gray-900 mb-2'>{stat.value}</h4>
                <p className='text-gray-500 font-medium'>{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* How It Works Section */}
          <div className='mb-32'>
             <div className='text-center mb-16'>
                <motion.h2 
                  initial={{opacity: 0, y: 20}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{ once: true }}
                  className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                  How It <span className='text-green-600'>Works</span>
                </motion.h2>
                <p className='text-gray-500 max-w-xl mx-auto'>Three simple steps to prepare yourself for any job interview using our advanced AI.</p>
             </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className='flex flex-col md:flex-row justify-center items-stretch gap-8'>
              {
                [
                  {
                    icon: <BsRobot size={28} />,
                    step: "01",
                    title: "Role & Experience",
                    desc: "Select your target job role and experience level. The AI instantly customizes the difficulty."                
                  },
                  {
                    icon: <BsMic size={28} />,
                    step: "02",
                    title: "Smart Voice Interview",
                    desc: "Engage in a dynamic conversation. The AI listens and generates context-aware follow-up questions."
                  },
                  {
                    icon: <BsClock size={28} />,
                    step: "03",
                    title: "Real-time Simulation",
                    desc: "Experience real interview pressure with time tracking and immediate feedback upon completion."
                  }
                ].map((items, index) => (
                  <motion.div key={index}
                    variants={itemVariants}
                    whileHover={{ y: -10, scale: 1.02 }} 
                    className='relative bg-white rounded-3xl p-8 flex-1 shadow-lg hover:shadow-2xl transition-all border border-gray-100 group'
                  >
                    <div className='absolute top-6 right-6 text-5xl font-black text-gray-100 group-hover:text-green-50 transition-colors'>
                      {items.step}
                    </div>
                    <div className='bg-green-50 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform'>
                      {items.icon}
                    </div>
                    <h3 className='font-bold text-xl mb-3 text-gray-900 relative z-10'>{items.title}</h3>
                    <p className='text-gray-600 leading-relaxed relative z-10'>{items.desc}</p>
                  </motion.div>
                ))
              }
            </motion.div>
          </div>

          {/* Advanced Capabilities Section */}
          <div className='mb-32'>
            <motion.div 
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{ once: true }}
              className='text-center mb-16'>
              <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                Advanced AI <span className='text-green-600'>Capabilities</span>
              </h2>
              <p className='text-gray-500 max-w-2xl mx-auto'>Our platform uses cutting-edge artificial intelligence to evaluate your performance across multiple dimensions.</p>
            </motion.div>

            <div className='grid md:grid-cols-2 gap-8'>
              {
                [
                  {
                    image: evalImg,
                    icon: <BsBarChart size={24} />,
                    title: "Comprehensive Evaluation",
                    desc: "Scores your communication skills, technical accuracy, and overall confidence instantly.",
                  },
                  {
                    image: resume,
                    icon: <BsFileEarmarkText size={24} />,
                    title: "Resume-Tailored Questions",
                    desc: "Upload your resume and get project-specific, highly relevant questions just like a real recruiter.",
                  },
                  {
                    image: pdf,
                    icon: <BsCheckCircleFill size={24} />,
                    title: "Actionable PDF Reports",
                    desc: "Download detailed reports outlining your strengths, weaknesses, and concrete steps to improve.",
                  },
                  {
                    image: history,
                    icon: <BsClock size={24} />,
                    title: "Progress Tracking",
                    desc: "Visualize your growth over time with performance graphs and detailed topic-level analysis.",
                  }
                ].map((items, index) => (
                  <motion.div key={index} 
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, type: 'spring' }}
                    whileHover={{ scale: 1.02 }}
                    className='bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col md:flex-row items-center gap-8'>

                    <div className='w-full md:w-2/5 flex justify-center bg-gray-50 rounded-2xl p-4 h-48'>
                      <img className='w-full h-full object-contain' src={items.image} alt={items.title} />
                    </div>

                    <div className='w-full md:w-3/5'>
                      <div className='bg-green-100 text-green-700 w-12 h-12 rounded-xl flex items-center justify-center mb-4'>
                        {items.icon}
                      </div>
                      <h3 className='font-bold text-xl mb-3 text-gray-900'>{items.title}</h3>
                      <p className='text-gray-600 text-sm leading-relaxed'>{items.desc}</p>
                    </div>

                  </motion.div>
                ))
              }
            </div>
          </div>

          {/* Multiple Modes Section */}
          <div className='mb-24 bg-gray-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden'>
            <div className='absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-400 via-gray-900 to-black'></div>
            
            <motion.h2 
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{ once: true }}
              className='text-4xl md:text-5xl font-bold text-center mb-16 relative z-10'>
              Explore Interview <span className='text-green-400'>Modes</span>
            </motion.h2>

            <div className='grid md:grid-cols-2 gap-8 relative z-10'>
              {
                [
                  {
                    image: hr,
                    title: "HR Interview Mode",
                    desc: "Focus on behavioral questions, cultural fit, and communication skills.",
                  },
                  {
                    image: tech,
                    title: "Technical Mode",
                    desc: "Deep technical dive based on your selected role, stack, and experience.",
                  },
                  {
                    image: confi,
                    title: "Confidence Analysis",
                    desc: "Receive insights on your tone, pitch, and speaking pace to sound more confident.",
                  },
                  {
                    image: credit,
                    title: "Flexible Credits",
                    desc: "Pay as you go. Unlock premium interview sessions and detailed insights easily.",
                  }
                ].map((items, index) => (
                  <motion.div key={index} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    className='bg-gray-800 bg-opacity-50 border border-gray-700 rounded-3xl p-6 md:p-8 flex items-center justify-between gap-6 backdrop-blur-sm transition-all'>
                    
                    <div className='w-2/3'>
                      <h3 className='font-bold text-xl mb-2 text-white'>
                        {items.title}
                      </h3>
                      <p className='text-gray-400 text-sm leading-relaxed'>
                        {items.desc}
                      </p>
                    </div>

                    <div className='w-1/3 flex justify-end'>
                      <img src={items.image} alt={items.title} className='w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-2xl' />
                    </div>
                  </motion.div>
                ))
              }
            </div>
          </div>

          {/* Testimonials or Call to Action */}
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className='text-center py-16 px-6 bg-green-50 rounded-[3rem] mb-20'>
             <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>Ready to ace your dream job?</h2>
             <p className='text-gray-600 mb-8 max-w-2xl mx-auto text-lg'>Join thousands of candidates who have successfully passed their interviews with MockMate AI.</p>
             <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview");
                }}
                whileHover={{scale: 1.05}} 
                whileTap={{scale: 0.95}}
                className='bg-green-600 text-white px-10 py-4 rounded-full shadow-xl hover:bg-green-700 transition-colors font-bold text-lg'>
                Get Started for Free
             </motion.button>
          </motion.div>

        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      <Footer />
    </div>
  )
}

export default Home