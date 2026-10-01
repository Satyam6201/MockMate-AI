import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { FaUserTie, FaBriefcase, FaFileUpload, FaMicrophoneAlt, FaChartLine, FaCheckCircle, FaLightbulb } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import toast from 'react-hot-toast';

const Step1SetUp = ({ onStart }) => {
  const { userData } = useSelector((state) => state.user);
  const { resumeProcessing, interviewState } = useSelector((state) => state.socket || {});
  const interviewGenState = interviewState?.generation;
  const dispatch = useDispatch();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const result = await axios.post(
        `${serverUrl}/api/interview/resume`, 
        formData, 
        { withCredentials: true }
      );

      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
      setAnalyzing(false);
      toast.success("Resume analyzed successfully!");

    } catch (error) {
      console.error("[Step1SetUp] Resume upload failed:", error);
      const errMsg = error.response?.data?.message || "Failed to analyze resume. Please enter details manually.";
      toast.error(errMsg);
      setAnalyzing(false);
    }
  };
  
  const handleStart = async () => {
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/interview/generate-questions`, 
        { role, experience, mode, resumeText, projects, skills }, 
        { withCredentials: true }
      );

      if (userData) {
        dispatch(setUserData({ ...userData, credits: result.data.creditsLeft }));
      }

      setLoading(false);
      onStart(result.data);

    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className='min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 sm:py-12 px-3 sm:px-6'
    >
      <div className='w-full max-w-6xl bg-white rounded-3xl sm:rounded-[2.5rem] shadow-xl sm:shadow-2xl grid lg:grid-cols-2 overflow-hidden border border-gray-100'>
        
        {/* Left Side: Info & Tips */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, type: 'spring' }}
          className='relative bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-6 sm:p-10 lg:p-14 flex flex-col justify-center'
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight relative z-10'>
            Craft Your Perfect <span className='text-green-600'>Interview</span>
          </h2>
          <p className='text-gray-600 text-sm sm:text-base lg:text-lg mb-6 sm:mb-10 leading-relaxed relative z-10'>
            Practice real interview scenarios powered by AI. Improve communication, technical skills, and build unwavering confidence before the actual day.
          </p>

          <div className='space-y-3 sm:space-y-4 mb-6 sm:mb-10 relative z-10'>
            {[
              { icon: <FaUserTie className="text-white text-base sm:text-xl" />, text: "Choose Role & Experience", color: "bg-blue-500" },
              { icon: <FaMicrophoneAlt className="text-white text-base sm:text-xl" />, text: "Smart Voice Interview", color: "bg-purple-500" },
              { icon: <FaChartLine className="text-white text-base sm:text-xl" />, text: "Performance Analytics", color: "bg-emerald-500" },
            ].map((item, index) => (
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.02, x: 6 }}
                key={index}
                className='flex items-center space-x-3 sm:space-x-4 bg-white/70 backdrop-blur-sm p-3 sm:p-4 rounded-2xl shadow-xs cursor-pointer border border-white/50'
              >
                <div className={`p-2.5 sm:p-3 rounded-xl ${item.color} shadow-inner shrink-0`}>
                  {item.icon}
                </div>
                <span className='text-gray-800 font-semibold text-xs sm:text-sm'>{item.text}</span>
              </motion.div>
            ))}
          </div>

          <div className='mt-auto bg-yellow-50 border border-yellow-200 rounded-2xl p-4 sm:p-5 relative z-10 shadow-xs'>
             <div className='flex items-center gap-2.5 mb-2'>
                <FaLightbulb className='text-yellow-500 text-lg sm:text-xl shrink-0' />
                <h4 className='font-bold text-yellow-800 text-sm sm:text-base'>Pro Tip for Success</h4>
             </div>
             <p className='text-yellow-700 text-xs sm:text-sm leading-relaxed'>
               Upload your latest resume to let the AI tailor questions directly to your projects and listed skills. This creates a hyper-realistic mock interview experience!
             </p>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, type: 'spring' }}
          className='p-6 sm:p-10 lg:p-14 bg-white flex flex-col justify-center'
        >
          <div className='mb-6 sm:mb-8'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-2'>Interview Setup</h2>
            <p className='text-gray-500 text-xs sm:text-sm'>Fill in the details below to generate your session.</p>
          </div>

          <div className='space-y-5 sm:space-y-6'>
            <div className='group relative'>
              <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-2'>Target Role</label>
              <div className='relative'>
                <FaUserTie className='absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-green-500 transition-colors' />
                <input 
                  type="text" 
                  placeholder='e.g. Frontend Developer, Data Scientist'
                  className='w-full pl-11 sm:pl-12 pr-4 py-3.5 sm:py-4 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-xs'
                  onChange={(e) => setRole(e.target.value)} 
                  value={role}
                />
              </div>
            </div>

            <div className='group relative'>
              <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-2'>Years of Experience</label>
              <div className='relative'>
                <FaBriefcase className='absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-green-500 transition-colors' />
                <input 
                  type="text" 
                  placeholder='e.g. 2 years, Fresher'
                  className='w-full pl-11 sm:pl-12 pr-4 py-3.5 sm:py-4 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-xs'
                  onChange={(e) => setExperience(e.target.value)} 
                  value={experience}
                />
              </div>
            </div>

            <div>
              <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-2'>Interview Mode</label>
              <select 
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className='w-full py-3.5 sm:py-4 px-4 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-xs font-medium text-gray-700'
              >
                <option value="Technical">Technical Interview</option>
                <option value="HR">HR & Behavioral Interview</option>
                <option value="Coding Round">Coding Round (DSA & Web Dev)</option>
              </select>
            </div>

            <AnimatePresence>
              {!analysisDone ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => document.getElementById("resumeUpload").click()}
                  className='border-2 border-dashed border-gray-300 rounded-2xl p-6 sm:p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors bg-gray-50 mt-4'
                >
                  <FaFileUpload className={`text-3xl sm:text-4xl mx-auto mb-3 ${analyzing ? 'text-gray-400 animate-bounce' : 'text-green-500'}`}/>
                  <input 
                    type="file" 
                    id='resumeUpload' 
                    accept='application/pdf' 
                    className='hidden'
                    onChange={(e) => setResumeFile(e.target.files[0])} 
                  />

                  <p className='text-gray-600 font-medium text-xs sm:text-sm'>
                    {resumeFile ? resumeFile.name : "Click to upload your resume (Optional)"}
                  </p>
                  <p className='text-[10px] sm:text-xs text-gray-400 mt-1.5'>PDF format, max 5MB</p>

                  {resumeFile && (
                    <motion.button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleUploadResume();
                      }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className='mt-4 bg-gray-900 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl hover:bg-black transition-all shadow-md font-semibold text-xs sm:text-sm flex items-center gap-2 mx-auto'
                    >
                      {analyzing ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>{resumeProcessing ? resumeProcessing.message : "Analyzing..."}</span>
                        </>
                      ) : "Analyze Resume"}
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='bg-green-50 border border-green-200 rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-xs mt-4'
                >
                  <div className='flex items-center gap-2 mb-2'>
                     <FaCheckCircle className='text-green-600 text-lg sm:text-xl shrink-0' />
                     <h3 className='text-sm sm:text-base font-bold text-green-800'>Resume Analyzed Successfully</h3>
                  </div>

                  {projects.length > 0 && (
                    <div>
                      <p className='font-bold text-green-900 mb-1.5 text-xs uppercase tracking-wide'>Detected Projects</p>
                      <div className='flex flex-col gap-1.5'>
                        {projects.slice(0, 3).map((item, index) => 
                          <div key={index} className='bg-white px-3 py-1.5 sm:py-2 rounded-lg text-xs text-gray-700 shadow-xs border border-green-100 flex items-start gap-1.5'>
                             <span className='text-green-500 mt-0.5'>•</span> {item}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div className='mt-3'>
                      <p className='font-bold text-green-900 mb-1.5 text-xs uppercase tracking-wide'>Extracted Skills</p>
                      <div className='flex flex-wrap gap-1.5'>
                        {skills.slice(0, 8).map((item, index) => (
                          <span className='bg-white border border-green-200 text-green-700 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-xs' key={index}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              disabled={!role || !experience || loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              className='w-full disabled:bg-gray-400 disabled:cursor-not-allowed bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3.5 sm:py-4 rounded-2xl text-base sm:text-xl font-bold transition-all shadow-lg hover:shadow-xl mt-4 flex justify-center items-center gap-2 sm:gap-3'
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className='text-sm sm:text-base'>{interviewGenState ? interviewGenState.message : "Generating AI Questions..."}</span>
                </>
              ) : "Start Interview"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Step1SetUp;