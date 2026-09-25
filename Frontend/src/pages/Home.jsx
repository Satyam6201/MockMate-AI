import { motion } from 'motion/react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { BsRobot, BsMic, BsClock, BsBarChart, BsFileEarmarkText, BsCheckCircleFill, BsStarFill, BsLightningChargeFill, BsBriefcaseFill, BsPeopleFill, BsTrophy, BsCash, BsShieldCheck } from 'react-icons/bs'
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
    transition: { staggerChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: 'spring', stiffness: 80 } }
}

const floatingAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

const Home = () => {

  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col font-sans overflow-hidden'>
      <Navbar />

      <div className='flex-1 px-6 py-12 md:py-24 relative'>
        {/* Advanced Animated Backgrounds */}
        <div className='absolute top-10 left-0 w-[500px] h-[500px] bg-green-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse'></div>
        <div className='absolute top-40 right-0 w-[500px] h-[500px] bg-teal-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse' style={{ animationDelay: '2s' }}></div>
        <div className='absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[150px] opacity-20 animate-pulse' style={{ animationDelay: '4s' }}></div>

        <div className='max-w-7xl mx-auto relative z-10'>

          {/* Hero Section */}
          <div className='flex flex-col items-center text-center mb-24 relative'>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              className='bg-white border border-gray-200 text-gray-700 text-sm px-6 py-2 rounded-full flex items-center gap-2 mb-8 shadow-sm hover:shadow-lg hover:border-green-300 transition-all cursor-pointer'>
              <HiSparkles size={18} className='text-green-500 animate-spin-slow' />
              <span className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600'>v3.0 Available: Real-time Salary Negotiation & Global Leaderboards!</span>
            </motion.div>

            <motion.h1 
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.8, type: 'spring', bounce: 0.5 }}
              className='text-6xl md:text-8xl font-black leading-tight max-w-5xl mx-auto text-slate-900 tracking-tight'>
              Land Your Dream Job with
              <span className='block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-emerald-600 to-teal-700 drop-shadow-sm pb-2'>
                AI Precision
              </span>
            </motion.h1>

            <motion.p 
              initial={{opacity: 0 }}
              animate={{opacity: 1 }}
              transition={{duration: 0.8, delay: 0.3 }}
              className='text-slate-600 mt-8 max-w-3xl mx-auto text-xl md:text-2xl leading-relaxed font-medium'>
              Stop guessing. Start practicing. Face hyper-realistic AI recruiters, negotiate your salary, and get a granular breakdown of your performance instantly.
            </motion.p>

            <motion.div 
              initial={{opacity: 0, y: 30}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.7, delay: 0.5}}
              className='flex flex-col sm:flex-row justify-center gap-6 mt-12 w-full sm:w-auto relative z-20'>
              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview");
                }}
                whileHover={{scale: 1.05, boxShadow: "0px 15px 40px rgba(16, 185, 129, 0.4)"}} 
                whileTap={{scale: 0.95}}
                className='bg-gradient-to-r from-slate-900 to-black text-white px-10 py-5 rounded-full shadow-2xl transition-all flex items-center justify-center gap-3 font-bold text-xl border border-slate-700 group'>
                Start Free Interview <HiArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
              </motion.button>

              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/history");
                }}
                whileHover={{scale: 1.05, backgroundColor: "#f8fafc", borderColor: "#cbd5e1"}} 
                whileTap={{scale: 0.95}}
                className='bg-white border-2 border-slate-200 text-slate-800 px-10 py-5 rounded-full hover:shadow-lg transition-all font-bold text-xl shadow-sm flex items-center justify-center gap-3'>
                <BsClock className="text-green-600 text-2xl group-hover:-rotate-90 transition-transform duration-500" /> View History
              </motion.button>
            </motion.div>
          </div>

          {/* New Trusted By Marquee */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className='mb-32 text-center overflow-hidden'>
            <p className='text-slate-400 font-bold tracking-widest uppercase text-sm mb-8'>Our Candidates Got Hired At</p>
            <div className='flex justify-center flex-wrap gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700'>
              {/* Using text as placeholder for logos for now */}
              <span className='text-2xl font-black font-serif'>Google</span>
              <span className='text-2xl font-black font-sans tracking-tighter'>Microsoft</span>
              <span className='text-2xl font-black font-sans'>amazon</span>
              <span className='text-2xl font-black font-sans italic'>Spotify</span>
              <span className='text-2xl font-black font-sans'>META</span>
            </div>
          </motion.div>

          {/* Stats / Trust Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='flex flex-wrap justify-center gap-8 md:gap-24 mb-32 border-y border-slate-200 py-12 bg-white/60 backdrop-blur-xl rounded-[3rem] shadow-xl shadow-slate-200/50 relative overflow-hidden'>
            <div className='absolute inset-0 bg-gradient-to-r from-green-50/50 to-teal-50/50'></div>
            {[
              { label: 'Interviews Conducted', value: '15,000+' },
              { label: 'Offer Rate Increase', value: '3x' },
              { label: 'AI Voice Models', value: '10+ Voices' },
              { label: 'Avg User Rating', value: '4.9/5' }
            ].map((stat, i) => (
              <motion.div key={i} className='text-center relative z-10' whileHover={{ scale: 1.15, y: -5 }}>
                <h4 className='text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-800 mb-3'>{stat.value}</h4>
                <p className='text-slate-600 font-bold uppercase tracking-widest text-sm'>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Brand NEW: Supercharged Features Section */}
          <div className='mb-32 relative'>
             <div className='absolute -left-20 top-20 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30'></div>
             <div className='text-center mb-16 relative z-10'>
                <motion.h2 
                  initial={{opacity: 0, scale: 0.9}}
                  whileInView={{opacity: 1, scale: 1}}
                  viewport={{ once: true }}
                  className='text-4xl md:text-5xl font-black text-slate-900 mb-6'>
                  Beyond Just <span className='text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600'>Answering Questions</span>
                </motion.h2>
                <p className='text-slate-500 max-w-2xl mx-auto text-lg'>MockMate AI gives you the complete toolkit to dominate the entire hiring lifecycle.</p>
             </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className='grid md:grid-cols-3 gap-8 relative z-10'>
              {[
                {
                  icon: <BsTrophy size={32} />,
                  title: "Global Leaderboards",
                  desc: "Compete with candidates worldwide. See where you rank in algorithmic problem solving and behavioral metrics.",
                  color: "text-yellow-600",
                  bg: "bg-yellow-100"
                },
                {
                  icon: <BsCash size={32} />,
                  title: "Salary Negotiation Mode",
                  desc: "Practice tough counter-offers with our aggressive HR persona. Learn how to maximize your total compensation safely.",
                  color: "text-emerald-600",
                  bg: "bg-emerald-100"
                },
                {
                  icon: <BsShieldCheck size={32} />,
                  title: "Resume Roasting",
                  desc: "Upload your CV. Our AI will tear it apart, find the red flags, and help you rewrite bullet points for maximum ATS impact.",
                  color: "text-blue-600",
                  bg: "bg-blue-100"
                }
              ].map((feat, index) => (
                <motion.div key={index}
                  variants={itemVariants}
                  whileHover={{ y: -15, scale: 1.02 }}
                  className='bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-2xl border border-slate-100 flex flex-col items-start group transition-all cursor-pointer'
                >
                  <motion.div 
                    animate={floatingAnimation}
                    className={`${feat.bg} ${feat.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform`}>
                    {feat.icon}
                  </motion.div>
                  <h3 className='font-black text-2xl mb-4 text-slate-900'>{feat.title}</h3>
                  <p className='text-slate-600 leading-relaxed font-medium'>{feat.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>


          {/* Core Feature Highlights */}
          <div className='mb-32'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl md:text-5xl font-black text-slate-900 mb-6'>Why Professionals Choose Us</h2>
              <p className='text-slate-500 max-w-xl mx-auto text-lg'>Built for engineers, marketers, and leaders who want to eliminate interview anxiety completely.</p>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className='grid md:grid-cols-3 gap-8'>
              {[
                { icon: <BsLightningChargeFill size={28}/>, title: "Zero Latency AI", desc: "Our streaming voice engine responds to you in under 500ms, making it feel exactly like a real human conversation." },
                { icon: <BsBriefcaseFill size={28}/>, title: "Industry Specific", desc: "From FAANG software engineering to Fortune 500 marketing roles, the AI adapts to your exact industry standards." },
                { icon: <BsPeopleFill size={28}/>, title: "Behavioral Mastery", desc: "Master the STAR method. The AI will push you to elaborate on your past experiences and leadership skills." }
              ].map((feat, idx) => (
                <motion.div key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -10, rotate: idx % 2 === 0 ? 1 : -1 }}
                  className='bg-gradient-to-b from-white to-slate-50 p-10 rounded-3xl shadow-md hover:shadow-2xl hover:border-green-400 border border-slate-200 transition-all group'>
                  <div className='bg-green-100 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm'>
                    {feat.icon}
                  </div>
                  <h3 className='text-2xl font-bold text-slate-900 mb-4'>{feat.title}</h3>
                  <p className='text-slate-600 font-medium leading-relaxed'>{feat.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* How It Works Section */}
          <div className='mb-32 bg-slate-900 rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-white shadow-2xl'>
            <div className='absolute top-0 right-0 w-[800px] h-[800px] bg-green-500 rounded-full mix-blend-screen filter blur-[150px] opacity-20'></div>
            
             <div className='text-center mb-20 relative z-10'>
                <motion.h2 
                  initial={{opacity: 0, y: 20}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{ once: true }}
                  className='text-4xl md:text-5xl font-black mb-6'>
                  How It <span className='text-green-400'>Works</span>
                </motion.h2>
                <p className='text-slate-400 max-w-xl mx-auto text-lg'>Three simple steps to prepare yourself for any job interview using our advanced neural engine.</p>
             </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className='flex flex-col md:flex-row justify-center items-stretch gap-8 relative z-10'>
              {
                [
                  {
                    icon: <BsRobot size={32} />,
                    step: "01",
                    title: "Configure Role",
                    desc: "Select your target job role, tech stack, and experience level. The AI instantly customizes the technical and behavioral difficulty."                
                  },
                  {
                    icon: <BsMic size={32} />,
                    step: "02",
                    title: "Smart Voice Interview",
                    desc: "Turn on your mic and engage in a dynamic conversation. The AI listens, understands context, and generates smart follow-ups."
                  },
                  {
                    icon: <BsClock size={32} />,
                    step: "03",
                    title: "Immediate Feedback",
                    desc: "Finish the session and instantly receive a highly detailed, actionable report with scores across 10 different metrics."
                  }
                ].map((items, index) => (
                  <motion.div key={index}
                    variants={itemVariants}
                    whileHover={{ y: -15, scale: 1.05 }} 
                    className='relative bg-slate-800/50 backdrop-blur-md rounded-[2.5rem] p-10 flex-1 hover:shadow-2xl hover:shadow-green-900/50 hover:ring-2 ring-green-500/50 transition-all border border-slate-700 group overflow-hidden'
                  >
                    <div className='absolute -right-10 -top-10 w-40 h-40 bg-green-500/10 rounded-full group-hover:scale-[2.5] transition-transform duration-700 ease-out -z-10'></div>
                    <div className='absolute top-8 right-8 text-6xl font-black text-slate-700 group-hover:text-green-500/20 transition-colors'>
                      {items.step}
                    </div>
                    <div className='bg-slate-700 text-green-400 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform'>
                      {items.icon}
                    </div>
                    <h3 className='font-bold text-2xl mb-4 text-white relative z-10'>{items.title}</h3>
                    <p className='text-slate-300 leading-relaxed relative z-10 font-medium'>{items.desc}</p>
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
              className='text-center mb-20'>
              <h2 className='text-4xl md:text-5xl font-black text-slate-900 mb-6'>
                Advanced AI <span className='text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600'>Capabilities</span>
              </h2>
              <p className='text-slate-500 max-w-2xl mx-auto text-lg'>Our platform uses cutting-edge artificial intelligence to evaluate your performance across multiple complex dimensions.</p>
            </motion.div>

            <div className='grid md:grid-cols-2 gap-10'>
              {
                [
                  {
                    image: evalImg,
                    icon: <BsBarChart size={28} />,
                    title: "Comprehensive Evaluation",
                    desc: "Scores your communication skills, technical accuracy, and overall confidence instantly.",
                  },
                  {
                    image: resume,
                    icon: <BsFileEarmarkText size={28} />,
                    title: "Resume-Tailored Questions",
                    desc: "Upload your resume and get project-specific, highly relevant questions just like a real recruiter.",
                  },
                  {
                    image: pdf,
                    icon: <BsCheckCircleFill size={28} />,
                    title: "Actionable PDF Reports",
                    desc: "Download detailed reports outlining your strengths, weaknesses, and concrete steps to improve.",
                  },
                  {
                    image: history,
                    icon: <BsClock size={28} />,
                    title: "Progress Tracking",
                    desc: "Visualize your growth over time with performance graphs and detailed topic-level analysis.",
                  }
                ].map((items, index) => (
                  <motion.div key={index} 
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, scale: 0.9 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, type: 'spring' }}
                    whileHover={{ scale: 1.04, rotateX: 3, rotateY: index % 2 === 0 ? -3 : 3, boxShadow: "0px 20px 40px rgba(0,0,0,0.08)" }}
                    className='bg-white rounded-[2.5rem] p-8 md:p-10 shadow-lg transition-all border border-slate-100 flex flex-col xl:flex-row items-center gap-8 perspective-1000 cursor-pointer group'>

                    <div className='w-full xl:w-2/5 flex justify-center bg-slate-50 rounded-3xl p-6 h-56 group-hover:bg-green-50 transition-colors shadow-inner'>
                      <motion.img 
                        whileHover={{ scale: 1.1 }}
                        className='w-full h-full object-contain mix-blend-multiply drop-shadow-md' 
                        src={items.image} alt={items.title} 
                      />
                    </div>

                    <div className='w-full xl:w-3/5'>
                      <div className='bg-green-100 text-green-700 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-all'>
                        {items.icon}
                      </div>
                      <h3 className='font-black text-2xl mb-3 text-slate-900'>{items.title}</h3>
                      <p className='text-slate-600 font-medium leading-relaxed'>{items.desc}</p>
                    </div>

                  </motion.div>
                ))
              }
            </div>
          </div>

          {/* Testimonial Section */}
          <div className='mb-32'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl md:text-5xl font-black text-slate-900 mb-6'>Loved by Candidates</h2>
              <p className='text-slate-500 max-w-xl mx-auto text-lg'>Join thousands of professionals who beat interview anxiety.</p>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className='grid md:grid-cols-3 gap-8'>
              {[
                { name: "Sarah J.", role: "Frontend Developer @ Google", text: "MockMate helped me land my job. The React specific follow-up questions were shockingly accurate!" },
                { name: "David M.", role: "Product Manager @ Amazon", text: "The behavioral interview mode was incredible. It grilled me on my leadership experience using the STAR method." },
                { name: "Elena R.", role: "Data Scientist @ Spotify", text: "I was super anxious about technical interviews. This gave me a safe space to practice and build massive confidence." }
              ].map((testi, i) => (
                <motion.div key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className='bg-white p-8 rounded-[2rem] border border-slate-200 shadow-md hover:shadow-2xl transition-all relative overflow-hidden group'>
                  <div className='absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-bl-[100px] -z-10 group-hover:bg-green-200 transition-colors'></div>
                  <div className='flex gap-1 text-yellow-400 mb-6 text-xl'>
                    <BsStarFill/><BsStarFill/><BsStarFill/><BsStarFill/><BsStarFill/>
                  </div>
                  <p className='text-slate-700 italic mb-8 font-medium text-lg leading-relaxed'>"{testi.text}"</p>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-teal-500 shadow-md'></div>
                    <div>
                      <h4 className='font-black text-slate-900'>{testi.name}</h4>
                      <p className='text-sm text-green-600 font-bold'>{testi.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95, y: 40 }}
             whileInView={{ opacity: 1, scale: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, type: 'spring' }}
             className='text-center py-24 px-6 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-[4rem] mb-20 relative overflow-hidden shadow-2xl border border-white/50'>
             
             {/* Decorative CTA background elements */}
             <div className='absolute top-10 right-10 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-pulse'></div>
             <div className='absolute bottom-10 left-10 w-64 h-64 bg-teal-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-pulse' style={{ animationDelay: '2s'}}></div>
             
             <h2 className='text-5xl md:text-6xl font-black text-slate-900 mb-8 relative z-10 tracking-tight'>Ready to ace your <br/><span className='text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-700'>dream job?</span></h2>
             <p className='text-slate-600 mb-12 max-w-2xl mx-auto text-2xl font-medium relative z-10'>Join over 15,000 candidates who have successfully passed their interviews with MockMate AI.</p>
             <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview");
                }}
                whileHover={{scale: 1.1, boxShadow: "0px 15px 40px rgba(22, 163, 74, 0.4)"}} 
                whileTap={{scale: 0.95}}
                className='bg-green-600 text-white px-14 py-6 rounded-full shadow-2xl hover:bg-green-700 transition-colors font-black text-2xl relative z-10 group flex items-center justify-center gap-3 mx-auto'>
                Start Your Journey <HiArrowRight className="group-hover:translate-x-2 transition-transform" />
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