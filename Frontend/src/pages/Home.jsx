import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { 
  BsRobot, BsMic, BsClock, BsBarChart, BsFileEarmarkText, 
  BsCheckCircleFill, BsStarFill, BsLightningChargeFill, 
  BsBriefcaseFill, BsCodeSquare, BsShieldCheck, BsDownload,
  BsSliders
} from 'react-icons/bs';
import { HiSparkles, HiArrowRight } from 'react-icons/hi';
import { FaFileAlt, FaCode, FaMicrophoneAlt, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthModel from '../components/AuthModel';
import evalImg from "../assets/ai-ans.png";
import confi from '../assets/confi.png';
import history from '../assets/history.png';
import resume from '../assets/resume.png';
import tech from '../assets/tech.png';
import pdf from '../assets/pdf.png';
import Footer from '../components/Footer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, type: 'spring', stiffness: 90 } 
  }
};

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const handleProtectedNavigation = (path) => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    navigate(path);
  };

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col font-sans overflow-hidden text-slate-800'>
      <Navbar />

      <div className='flex-1 px-4 sm:px-6 py-10 md:py-20 relative'>
        <div className='absolute top-10 left-0 w-[450px] h-[450px] bg-emerald-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-35 pointer-events-none'></div>
        <div className='absolute top-40 right-0 w-[450px] h-[450px] bg-teal-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-35 pointer-events-none'></div>
        <div className='absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[140px] opacity-30 pointer-events-none'></div>

        <div className='max-w-7xl mx-auto relative z-10'>
          <div className='flex flex-col items-center text-center mb-20 relative'>
            <motion.div 
              initial={{ opacity: 0, scale: 0.85, y: -15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm px-5 py-2 rounded-full flex items-center gap-2 mb-8 shadow-xs hover:border-emerald-300 transition-all'>
              <HiSparkles size={16} className='text-emerald-600' />
              <span className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700'>
                All-in-One Career Platform: ATS Resume Builder, Live Audit & SDE Coding Sandbox
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, type: 'spring', bounce: 0.4 }}
              className='text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight max-w-5xl mx-auto text-slate-900 tracking-tight'>
              Master Tech Interviews & Build
              <span className='block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 pb-2'>
                ATS-Ready Resumes
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className='text-slate-600 mt-6 max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl leading-relaxed font-normal'>
              Simulate hyper-realistic AI technical and behavioral interviews, solve coding challenges in an interactive multi-language sandbox, and construct recruiter-vetted resumes that pass screening parsers.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className='flex flex-wrap justify-center gap-4 mt-10 w-full sm:w-auto relative z-20'>
              <button
                onClick={() => handleProtectedNavigation('/interview')}
                className='bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl shadow-xl shadow-slate-900/15 transition-all flex items-center justify-center gap-3 font-bold text-base sm:text-lg group'>
                <FaMicrophoneAlt className="text-emerald-400" />
                Start AI Interview 
                <HiArrowRight className="group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>

              <button
                onClick={() => handleProtectedNavigation('/resume-builder')}
                className='bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-800 px-8 py-4 rounded-2xl transition-all font-bold text-base sm:text-lg shadow-sm flex items-center justify-center gap-3 group'>
                <FaFileAlt className="text-emerald-600 group-hover:scale-110 transition-transform" />
                Build ATS Resume
              </button>

              <button
                onClick={() => handleProtectedNavigation('/prepare')}
                className='bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-slate-800 px-7 py-4 rounded-2xl transition-all font-bold text-base sm:text-lg shadow-sm flex items-center justify-center gap-2.5 group'>
                <FaCode className="text-teal-600 group-hover:scale-110 transition-transform" />
                SDE Sandbox
              </button>
            </motion.div>
          </div>

          <div className='mb-24 text-center overflow-hidden'>
            <p className='text-slate-400 font-bold tracking-widest uppercase text-xs sm:text-sm mb-6'>
              Engineers & Candidates Hired At Leading Tech Companies
            </p>
            <div className='flex justify-center items-center flex-wrap gap-8 sm:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500'>
              <span className='text-xl sm:text-2xl font-black font-serif text-slate-800'>Google</span>
              <span className='text-xl sm:text-2xl font-black font-sans tracking-tighter text-slate-800'>Microsoft</span>
              <span className='text-xl sm:text-2xl font-black font-sans text-slate-800'>amazon</span>
              <span className='text-xl sm:text-2xl font-black font-sans italic text-slate-800'>Spotify</span>
              <span className='text-xl sm:text-2xl font-black font-sans text-slate-800'>META</span>
              <span className='text-xl sm:text-2xl font-black font-sans text-slate-800'>Uber</span>
            </div>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-24'>
            {[
              { label: 'Mock Interviews Conducted', value: '25,000+' },
              { label: 'ATS Screening Pass Rate', value: '94%' },
              { label: 'Coding Sandbox Problems', value: '150+' },
              { label: 'Candidate Rating', value: '4.9 / 5' }
            ].map((stat, i) => (
              <div key={i} className='bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-xs'>
                <h4 className='text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700 mb-1'>
                  {stat.value}
                </h4>
                <p className='text-slate-600 font-semibold text-xs sm:text-sm'>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className='mb-28'>
            <div className='text-center mb-16'>
              <span className='text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-3'>
                Core Capabilities
              </span>
              <h2 className='text-3xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight'>
                Complete Interview & Resume Preparation Suite
              </h2>
              <p className='text-slate-500 max-w-2xl mx-auto text-base sm:text-lg'>
                Everything you need to qualify applicant screening filters, solve technical problems, and outperform human recruiters.
              </p>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'
            >
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -6 }}
                onClick={() => handleProtectedNavigation('/resume-builder')}
                className='bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group'
              >
                <div>
                  <div className='w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors'>
                    <FaFileAlt />
                  </div>
                  <h3 className='font-bold text-xl text-slate-900 mb-2'>ATS Resume Builder</h3>
                  <p className='text-slate-600 text-sm leading-relaxed mb-4'>
                    Choose between Harvard Classic, Modern Tech, Two-Column Compact, and Minimalist Clean layouts engineered for maximum ATS parser readability.
                  </p>
                </div>
                <div className='pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700'>
                  <span>Explore Templates</span>
                  <HiArrowRight className='group-hover:translate-x-1 transition-transform' />
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -6 }}
                onClick={() => handleProtectedNavigation('/resume-builder')}
                className='bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group'
              >
                <div>
                  <div className='w-14 h-14 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl mb-5 group-hover:bg-teal-600 group-hover:text-white transition-colors'>
                    <BsShieldCheck />
                  </div>
                  <h3 className='font-bold text-xl text-slate-900 mb-2'>Algorithmic ATS Audit</h3>
                  <p className='text-slate-600 text-sm leading-relaxed mb-4'>
                    Get an instant 100-point diagnostic audit detecting missing contact information, power action verb frequency, and quantified metric ratios.
                  </p>
                </div>
                <div className='pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700'>
                  <span>Run Audit Diagnostic</span>
                  <HiArrowRight className='group-hover:translate-x-1 transition-transform' />
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -6 }}
                onClick={() => handleProtectedNavigation('/interview')}
                className='bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group'
              >
                <div>
                  <div className='w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors'>
                    <BsMic />
                  </div>
                  <h3 className='font-bold text-xl text-slate-900 mb-2'>AI Voice Mock Interviews</h3>
                  <p className='text-slate-600 text-sm leading-relaxed mb-4'>
                    Engage in live speech-to-speech mock interviews with dynamic follow-up questions customized to your specific role, level, and tech stack.
                  </p>
                </div>
                <div className='pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700'>
                  <span>Launch Simulation</span>
                  <HiArrowRight className='group-hover:translate-x-1 transition-transform' />
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -6 }}
                onClick={() => handleProtectedNavigation('/preparation')}
                className='bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group'
              >
                <div>
                  <div className='w-14 h-14 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl mb-5 group-hover:bg-purple-600 group-hover:text-white transition-colors'>
                    <BsCodeSquare />
                  </div>
                  <h3 className='font-bold text-xl text-slate-900 mb-2'>SDE Code Sandbox</h3>
                  <p className='text-slate-600 text-sm leading-relaxed mb-4'>
                    Solve technical DSA and system design questions in an interactive Monaco editor supporting JavaScript, Python, C++, and Java with test execution.
                  </p>
                </div>
                <div className='pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700'>
                  <span>Open Coding Sandbox</span>
                  <HiArrowRight className='group-hover:translate-x-1 transition-transform' />
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -6 }}
                onClick={() => handleProtectedNavigation('/resume-builder')}
                className='bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group'
              >
                <div>
                  <div className='w-14 h-14 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mb-5 group-hover:bg-amber-600 group-hover:text-white transition-colors'>
                    <HiSparkles />
                  </div>
                  <h3 className='font-bold text-xl text-slate-900 mb-2'>AI Bullet Point Enhancer</h3>
                  <p className='text-slate-600 text-sm leading-relaxed mb-4'>
                    Turn basic job duties into quantifiable achievement bullets using the Google XYZ formula and power action verbs with a single click.
                  </p>
                </div>
                <div className='pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700'>
                  <span>Enhance Bullet Points</span>
                  <HiArrowRight className='group-hover:translate-x-1 transition-transform' />
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -6 }}
                onClick={() => handleProtectedNavigation('/history')}
                className='bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group'
              >
                <div>
                  <div className='w-14 h-14 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl mb-5 group-hover:bg-rose-600 group-hover:text-white transition-colors'>
                    <BsBarChart />
                  </div>
                  <h3 className='font-bold text-xl text-slate-900 mb-2'>Granular Scorecards</h3>
                  <p className='text-slate-600 text-sm leading-relaxed mb-4'>
                    Receive in-depth feedback on technical accuracy, communication fluency, and behavioral answers, with exportable PDF evaluation summaries.
                  </p>
                </div>
                <div className='pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-700'>
                  <span>View History & Analytics</span>
                  <HiArrowRight className='group-hover:translate-x-1 transition-transform' />
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className='mb-28 bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm'>
            <div className='text-center mb-14'>
              <h2 className='text-3xl sm:text-4xl font-black text-slate-900 mb-3'>
                How MockMate Prepares You For Offers
              </h2>
              <p className='text-slate-500 text-base max-w-xl mx-auto'>
                A structured three-step process built to guide candidates from blank page to signed job offer.
              </p>
            </div>

            <div className='grid md:grid-cols-3 gap-8'>
              <div className='p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative'>
                <span className='w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-sm flex items-center justify-center'>
                  01
                </span>
                <h3 className='font-bold text-lg text-slate-900'>Build & Audit Resume</h3>
                <p className='text-slate-600 text-xs sm:text-sm leading-relaxed'>
                  Format your technical achievements into ATS-proven templates and run the algorithmic audit to resolve any missing items before applying.
                </p>
              </div>

              <div className='p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative'>
                <span className='w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-sm flex items-center justify-center'>
                  02
                </span>
                <h3 className='font-bold text-lg text-slate-900'>Live AI Mock Sessions</h3>
                <p className='text-slate-600 text-xs sm:text-sm leading-relaxed'>
                  Practice real-time technical questions and behavioral STAR responses with our conversational voice recruiter adapting to your answers.
                </p>
              </div>

              <div className='p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative'>
                <span className='w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-sm flex items-center justify-center'>
                  03
                </span>
                <h3 className='font-bold text-lg text-slate-900'>Review & Iterate</h3>
                <p className='text-slate-600 text-xs sm:text-sm leading-relaxed'>
                  Analyze question-by-question scoring breakdowns, study model answers, download reports, and iterate until you reach peak confidence.
                </p>
              </div>
            </div>
          </div>

          <div className='mb-24'>
            <div className='text-center mb-14'>
              <h2 className='text-3xl sm:text-4xl font-black text-slate-900 mb-3'>
                Candidate Feedback
              </h2>
              <p className='text-slate-500 text-base max-w-xl mx-auto'>
                Real feedback from developers and professionals who prepared with MockMate AI.
              </p>
            </div>

            <div className='grid md:grid-cols-3 gap-6'>
              {[
                { 
                  name: "Sarah J.", 
                  role: "Frontend Engineer @ Google", 
                  text: "The ATS resume builder and live audit helped me fix missing metric statements in my work history. The voice mock interview followed up on my React projects with pinpoint accuracy." 
                },
                { 
                  name: "David M.", 
                  role: "Backend Engineer @ Amazon", 
                  text: "Practicing system design and behavioral STAR questions with the AI gave me structured answers that impressed my hiring panel. The PDF report highlighted areas I needed to clarify." 
                },
                { 
                  name: "Elena R.", 
                  role: "Software Developer @ Spotify", 
                  text: "The combination of coding sandbox and real-time conversational interviews eliminated my interview anxiety. I went into my final rounds confident and prepared." 
                }
              ].map((testi, i) => (
                <div key={i} className='bg-white p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between'>
                  <div>
                    <div className='flex gap-1 text-amber-400 mb-4 text-sm'>
                      <BsStarFill/><BsStarFill/><BsStarFill/><BsStarFill/><BsStarFill/>
                    </div>
                    <p className='text-slate-700 text-sm leading-relaxed mb-6 font-normal'>
                      "{testi.text}"
                    </p>
                  </div>
                  <div className='flex items-center gap-3 pt-4 border-t border-slate-100'>
                    <div className='w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm'>
                      {testi.name[0]}
                    </div>
                    <div>
                      <h4 className='font-bold text-slate-900 text-sm'>{testi.name}</h4>
                      <p className='text-xs text-emerald-700 font-semibold'>{testi.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='text-center py-16 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl mb-16 text-white shadow-xl relative overflow-hidden'>
            <div className='absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl'></div>
            <div className='absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl'></div>
            
            <h2 className='text-3xl sm:text-5xl font-black mb-4 tracking-tight relative z-10'>
              Ready to Accelerate Your Job Search?
            </h2>
            <p className='text-slate-300 mb-8 max-w-2xl mx-auto text-base sm:text-lg relative z-10'>
              Create an ATS-compliant resume and simulate your target role interviews with MockMate AI today.
            </p>

            <div className='flex flex-wrap items-center justify-center gap-4 relative z-10'>
              <button
                onClick={() => handleProtectedNavigation('/interview')}
                className='bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-lg flex items-center gap-2 text-sm sm:text-base'>
                Start Free Interview <HiArrowRight />
              </button>

              <button
                onClick={() => handleProtectedNavigation('/resume-builder')}
                className='bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3.5 rounded-xl transition border border-white/20 text-sm sm:text-base'>
                Build Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      <Footer />
    </div>
  );
};

export default Home;