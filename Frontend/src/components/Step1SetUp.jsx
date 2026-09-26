import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { FaUserTie, FaBriefcase, FaFileUpload, FaMicrophoneAlt, FaChartLine, FaCheckCircle, FaLightbulb } from 'react-icons/fa'
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import toast from 'react-hot-toast';

const Step1SetUp = ({onStart}) => {
  const {userData} = useSelector((state) => state.user);
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
      const result = await axios.post(serverUrl + "/api/interview/resume", formData, 
        {withCredentials: true}
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
      const errMsg = error.response?.data?.message || "Failed to analyze resume. Please try again or fill manually.";
      toast.error(errMsg);
      setAnalyzing(false);
    }
  }
  
  const handleStart = async () => {
    setLoading(true);

    try {
      const result = await axios.post(serverUrl + "/api/interview/generate-questions", 
        {role, experience, mode, resumeText, projects, skills}, {withCredentials: true});

        if (userData) {
          dispatch(setUserData({...userData, credits: result.data.creditsLeft}));
        }

        setLoading(false);
        onStart(result.data);

    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
      setLoading(false);
    }
  }

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className='min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6'
    >
      <div className='w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl grid lg:grid-cols-2 overflow-hidden border border-gray-100'>
        
        {/* Left Side: Info & Tips */}
        <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: 'spring' }}
        className='relative bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-10 lg:p-14 flex flex-col justify-center'>

          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <h2 className='text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight relative z-10'>
            Craft Your Perfect <span className='text-green-600'>Interview</span>
          </h2>
          <p className='text-gray-600 text-lg mb-10 leading-relaxed relative z-10'>
            Practice real interview scenarios powered by AI. Improve communication, technical skills, and build unwavering confidence before the actual day.
          </p>

          <div className='space-y-4 mb-10 relative z-10'>
            {
              [
                { icon: <FaUserTie className="text-white text-xl" />, text: "Choose Role & Experience", color: "bg-blue-500" },
                { icon: <FaMicrophoneAlt className="text-white text-xl" />, text: "Smart Voice Interview", color: "bg-purple-500" },
                { icon: <FaChartLine className="text-white text-xl" />, text: "Performance Analytics", color: "bg-emerald-500" },
              ].map((item, index) => (
                <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.02, x: 10 }}
                key={index}
                className='flex items-center space-x-4 bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-sm cursor-pointer border border-white/50'
                >
                  <div className={`p-3 rounded-xl ${item.color} shadow-inner`}>
                    {item.icon}
                  </div>
                  <span className='text-gray-800 font-semibold'>{item.text}</span>
                </motion.div>
              ))
            }
          </div>

          <div className='mt-auto bg-yellow-50 border border-yellow-200 rounded-2xl p-5 relative z-10 shadow-sm'>
             <div className='flex items-center gap-3 mb-2'>
                <FaLightbulb className='text-yellow-500 text-xl' />
                <h4 className='font-bold text-yellow-800'>Pro Tip for Success</h4>
             </div>
             <p className='text-yellow-700 text-sm leading-relaxed'>
               Upload your latest resume to let the AI tailor questions directly to your projects and listed skills. This creates a hyper-realistic mock interview experience!
             </p>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2, type: 'spring' }}
        className='p-10 lg:p-14 bg-white flex flex-col justify-center'
        >
          <div className='mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>Interview Setup</h2>
            <p className='text-gray-500'>Fill in the details below to generate your session.</p>
          </div>

          <div className='space-y-6'>
            <div className='group relative'>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Target Role</label>
              <div className='relative'>
                <FaUserTie className='absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-green-500 transition-colors' />
                <input type="text" placeholder='e.g. Frontend Developer, Data Scientist'
                className='w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-sm'
                onChange={(e) => setRole(e.target.value)} value={role}
                />
              </div>
            </div>

            <div className='group relative'>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Years of Experience</label>
              <div className='relative'>
                <FaBriefcase className='absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-green-500 transition-colors' />
                <input type="text" placeholder='e.g. 2 years, Fresher'
                className='w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-sm'
                onChange={(e) => setExperience(e.target.value)} value={experience}
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Interview Mode</label>
              <select value={mode}
              onChange={(e) =>setMode(e.target.value)}
              className='w-full py-4 px-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-sm font-medium text-gray-700'
              >
                <option value="Technical">💻 Technical Interview</option>
                <option value="HR">🤝 HR & Behavioral Interview</option>
                <option value="Coding Round">⚡ Coding Round (DSA & Web Dev)</option>
              </select>
            </div>

            <AnimatePresence>
              {!analysisDone ? (
                <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                whileHover={{scale: 1.01}}
                onClick={() => document.getElementById("resumeUpload").click()}
                className='border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors bg-gray-50 mt-4'
                >
                  <FaFileUpload className={`text-4xl mx-auto mb-3 ${analyzing ? 'text-gray-400 animate-bounce' : 'text-green-500'}`}/>
                  <input type="file" id='resumeUpload' accept='application/pdf' className='hidden'
                  onChange={(e) => setResumeFile(e.target.files[0])} />

                  <p className='text-gray-600 font-medium'>
                    {resumeFile ? resumeFile.name : "Click to upload your resume (Optional)"}
                  </p>
                  <p className='text-xs text-gray-400 mt-2'>PDF format, max 5MB</p>

                  {resumeFile && (
                    <motion.button 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleUploadResume()
                    }}
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    className='mt-5 bg-gray-900 text-white px-6 py-2.5 rounded-xl hover:bg-black transition-all shadow-lg font-semibold flex items-center gap-2 mx-auto'>
                      {analyzing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {resumeProcessing ? resumeProcessing.message : "Analyzing..."}
                        </>
                      ) : "Analyze Resume"}
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className='bg-green-50 border border-green-200 rounded-2xl p-6 space-y-4 shadow-sm mt-4'>
                  <div className='flex items-center gap-2 mb-2'>
                     <FaCheckCircle className='text-green-600 text-xl' />
                     <h3 className='text-lg font-bold text-green-800'>Resume Analyzed Successfully</h3>
                  </div>

                  {projects.length > 0 && (
                    <div>
                      <p className='font-bold text-green-900 mb-2 text-sm uppercase tracking-wide'>Detected Projects</p>
                      <div className='flex flex-col gap-2'>
                        {projects.slice(0, 3).map((item, index) => 
                          <div key={index} className='bg-white px-4 py-2 rounded-lg text-sm text-gray-700 shadow-sm border border-green-100 flex items-start gap-2'>
                             <span className='text-green-500 mt-0.5'>•</span> {item}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div className='mt-4'>
                      <p className='font-bold text-green-900 mb-2 text-sm uppercase tracking-wide'>Extracted Skills</p>
                      <div className='flex flex-wrap gap-2'>
                        {skills.slice(0, 8).map((item, index) => (
                          <span className='bg-white border border-green-200 text-green-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm' key={index}>
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
            disabled= {!role || !experience || loading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className='w-full disabled:bg-gray-400 disabled:cursor-not-allowed bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-2xl text-xl font-bold transition-all shadow-xl hover:shadow-2xl mt-4 flex justify-center items-center gap-3'>
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {interviewGenState ? interviewGenState.message : "Generating AI Questions..."}
                </>
              ) : "Start Interview"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Step1SetUp