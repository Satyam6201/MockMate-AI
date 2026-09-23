import maleVideo from '../assets/Videos/male-ai.mp4'
import femaleVideo from '../assets/Videos/female-ai.mp4'
import Timer from './Timer'
import { motion, AnimatePresence } from 'motion/react'
import { FaMicrophone, FaMicrophoneSlash, FaLightbulb, FaRobot, FaExclamationTriangle } from 'react-icons/fa'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { BsArrowRight, BsStars } from 'react-icons/bs'
import toast from 'react-hot-toast'
import Editor from '@monaco-editor/react'
import { useSocket } from '../hooks/useSocket'
import { useSelector, useDispatch } from 'react-redux'
import { setEvaluationStatus } from '../redux/socketSlice'

const Step2Interview = ({interviewData, onFinish}) => {

  const {interviewId, questions, userName, totalQuestions} = interviewData;
  const [interviewQuestions, setInterviewQuestions] = useState(questions);
  const expectedTotal = totalQuestions || 5;
  const { joinInterviewRoom } = useSocket();
  const evaluationStatus = useSelector(state => state.socket?.evaluationStatus);
  const dispatch = useDispatch();

  useEffect(() => {
     if (interviewId) {
         joinInterviewRoom(interviewId);
     }
  }, [interviewId, joinInterviewRoom]);

  const [warningsCount, setWarningsCount] = useState(0);
  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(interviewQuestions[0]?.timeLimit || 0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("male");
  const [subtitle, setSubtitle] = useState("");
  const videoRef = useRef(null);
  const currentQuestion = interviewQuestions[currentIndex];

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const femaleVoice = voices.find(v => 
        v.name.toLowerCase().includes("zira") || 
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("female")
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice = voices.find(v => 
        v.name.toLowerCase().includes("david") ||
        v.name.toLowerCase().includes("mark") ||
        v.name.toLowerCase().includes("male")
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;    
  }, []);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;
  
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");
      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);

        if (isMicOn) {
          startMic();
        }

        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300); 
      };

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    })
  }

  useEffect(() => {
    if (!selectedVoice) return;

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText (
          `Hi ${userName || 'there'}, it's great to meet you today. I hope you're feeling confident and ready.`
        );
        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        );
        setIsIntroPhase(false);
      }
      else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800));

        if (currentIndex === expectedTotal - 1) {
          await speakText("Alright, this is the last question. Take your time.");
        }

        await speakText(currentQuestion.question);

        if (isMicOn) {
          startMic();
        }
      }
    }
    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      })
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex]);

  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    }

    recognitionRef.current = recognition;
  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch (error) {}
    }
  }

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  }

  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(serverUrl + "/api/interview/submit-answer", 
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        }, {withCredentials: true});

        setFeedback(result.data.feedback);
        speakText(result.data.feedback);
        
        if (result.data.nextQuestion) {
          setInterviewQuestions(prev => [...prev, result.data.nextQuestion]);
        }
        
        setIsSubmitting(false);

    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  }

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");
    dispatch(setEvaluationStatus(null));

    if (currentIndex + 1 >= expectedTotal) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");

    setCurrentIndex(currentIndex + 1);
    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);
  }

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);

    try {
      const result = await axios.post(serverUrl + "/api/interview/finish", 
        { interviewId }, {withCredentials: true})
        onFinish(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    }
  }, []);

  // Proctoring / Anti-Cheat System
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarningsCount((prev) => prev + 1);
        toast.error("Warning: Please do not switch tabs during the interview!", {
          icon: '⚠️',
          duration: 5000,
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Real-time Answer Quality Analysis (Word Count)
  const wordCount = answer.trim().split(/\s+/).filter(w => w.length > 0).length;
  let answerQualityColor = "bg-red-500";
  let answerQualityText = "Too Short (Need more details)";
  let answerQualityProgress = Math.min((wordCount / 50) * 100, 100);

  if (wordCount >= 50) {
    answerQualityColor = "bg-green-500";
    answerQualityText = "Excellent Depth";
  } else if (wordCount >= 20) {
    answerQualityColor = "bg-yellow-500";
    answerQualityText = "Good, but could add examples";
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans'>

      <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-7xl min-h-[85vh] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col lg:flex-row overflow-hidden relative'>

        {/* Decorative elements */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

        {/* Left Sidebar: Video & Status */}
        <div className='w-full lg:w-[35%] bg-gray-50 flex flex-col items-center p-6 sm:p-8 border-r border-gray-200 z-10'>
          
          <div className='w-full max-w-sm rounded-[2rem] overflow-hidden shadow-lg border-4 border-white bg-black relative mb-6'>
            <video 
            src={videoSource} 
            key={videoSource}
            ref={videoRef}
            muted
            playsInline
            preload='auto'
            className='w-full h-64 sm:h-80 object-cover'/>
            
            {/* AI Status Badge Overlay */}
            <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-colors ${isAIPlaying ? 'bg-green-500/80 text-white' : 'bg-black/50 text-gray-300'}`}>
              <div className={`w-2 h-2 rounded-full ${isAIPlaying ? 'bg-white animate-pulse' : 'bg-gray-400'}`}></div>
              {isAIPlaying ? "AI Speaking" : "AI Listening"}
            </div>
          </div>

          <AnimatePresence>
            {subtitle && (
              <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='w-full max-w-sm bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6'>
                <FaRobot className='text-green-500 mb-2 text-xl'/>
                <p className='text-gray-700 text-sm sm:text-base font-medium leading-relaxed italic'>
                  "{subtitle}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status & Timer Card */}
          <div className='w-full max-w-sm bg-white border border-gray-100 rounded-3xl shadow-sm p-6 space-y-5 mt-auto'>
            <div className='flex justify-between items-center bg-gray-50 p-3 rounded-xl'>
              <span className='text-sm font-semibold text-gray-600 uppercase tracking-wider'>
                Time Remaining
              </span>
            </div>

            <div className='flex justify-center py-2'>
              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit || 60} />
            </div>

            <div className='grid grid-cols-2 gap-4 text-center bg-gray-50 rounded-xl p-3'>
              <div>
                <span className='block text-2xl font-black text-gray-800'>
                  {currentIndex + 1}
                </span>
                <span className='text-[10px] uppercase font-bold text-gray-500'>Current</span>
              </div>
              <div className='border-l border-gray-200'>
                <span className='block text-2xl font-black text-gray-800'>{expectedTotal}</span>
                <span className='text-[10px] uppercase font-bold text-gray-500'>Total</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Content Area */}
        <div className='flex-1 flex flex-col p-6 sm:p-10 z-10'>
          
          <div className='flex items-center justify-between mb-8'>
             <h2 className='text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2'>
               <BsStars className='text-green-500' /> Live Interview
             </h2>
             {isIntroPhase && <span className='bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold animate-pulse'>Introduction</span>}
          </div>

          <AnimatePresence mode="wait">
            {!isIntroPhase && currentQuestion ? (
              <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='mb-8 bg-green-50/50 p-6 sm:p-8 rounded-[2rem] border border-green-100 shadow-sm'>
                <div className='flex items-center gap-3 mb-4'>
                   <span className='bg-green-200 text-green-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider'>Question {currentIndex + 1}</span>
                </div>
                <div className='text-lg sm:text-2xl font-bold text-gray-800 leading-snug'>
                  {currentQuestion?.question}
                </div>          
              </motion.div>
            ) : (
              <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='mb-8 flex-1 flex flex-col items-center justify-center text-center opacity-70'>
                 <FaRobot className='text-6xl text-gray-300 mb-4' />
                 <p className='text-xl text-gray-500 font-medium'>Please listen to the introduction...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pro Tip block */}
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3 text-sm text-gray-500'>
              <FaLightbulb className='text-yellow-500' />
              <span>Speak clearly into the microphone. You can type if preferred.</span>
            </div>
            
            {warningsCount > 0 && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                <FaExclamationTriangle /> {warningsCount} Tab Switch Warning{warningsCount > 1 ? 's' : ''}
              </div>
            )}
          </div>

          <div className="relative flex-1 flex flex-col">
            {currentQuestion?.questionType === 'Coding' ? (
              <div className="flex-1 min-h-[300px] border-2 border-gray-200 rounded-3xl overflow-hidden shadow-inner focus-within:border-green-400 transition-colors">
                 <Editor
                   height="100%"
                   defaultLanguage="javascript"
                   theme="vs-dark"
                   value={answer}
                   onChange={(value) => setAnswer(value || "")}
                   options={{
                     minimap: { enabled: false },
                     fontSize: 14,
                     wordWrap: 'on',
                     padding: { top: 16 }
                   }}
                 />
              </div>
            ) : (
              <textarea placeholder={isMicOn && !isAIPlaying ? 'Listening... Speak now or type here.' : 'Type your answer here...'}
               onChange={(e) => setAnswer(e.target.value)} value={answer}
                className={`flex-1 min-h-[150px] bg-gray-50 p-6 pb-12 rounded-3xl resize-none outline-none border-2 transition-all text-gray-800 text-lg shadow-inner
                ${isMicOn && !isAIPlaying ? 'border-green-200 bg-green-50/30' : 'border-gray-200 focus:border-green-400'}`} 
              /> 
            )}
            
            {/* Real-time Word Count Analyzer */}
            {!feedback && currentQuestion?.questionType !== 'Coding' && (
              <div className="absolute bottom-4 left-6 right-6 flex items-center gap-4">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${answerQualityColor}`} style={{ width: `${answerQualityProgress}%` }}></div>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${answerQualityColor.replace('bg-', 'text-')}`}>
                  {wordCount} Words ({answerQualityText})
                </span>
              </div>
            )}
          </div>

          {!feedback ? (
            <div className='flex items-center gap-4 mt-8'> 
              
              <div className='relative'>
                {isMicOn && !isAIPlaying && (
                  <div className='absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20'></div>
                )}
                <motion.button
                onClick={toggleMic}
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
                className={`w-16 h-16 sm:w-16 sm:h-16 flex items-center justify-center rounded-full shadow-lg relative z-10 transition-colors
                  ${isMicOn ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-800 text-white hover:bg-gray-900'}`}
                >
                  {isMicOn ? <FaMicrophone size={24} /> : <FaMicrophoneSlash size={24} /> }
                </motion.button>
              </div>

              <motion.button onClick={submitAnswer}
              disabled={isSubmitting || isIntroPhase}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='flex-1 bg-gray-900 hover:bg-black text-white py-5 rounded-2xl shadow-xl transition-all font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2'
              >
                {isSubmitting ? (
                  <>
                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     {evaluationStatus?.status === 'started' || evaluationStatus?.status === 'processing' 
                        ? evaluationStatus.message 
                        : "Analyzing Response..."}
                  </>
                ) : "Submit Answer"}
              </motion.button>
            </div>
          ) : (
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='mt-8 bg-green-50 border-2 border-green-200 p-6 sm:p-8 rounded-3xl shadow-sm'
            >
              <h4 className='font-bold text-green-800 mb-2 flex items-center gap-2'>
                <BsStars /> Instant AI Feedback {evaluationStatus?.result?.score !== undefined && `- Score: ${evaluationStatus.result.score}/10`}
              </h4>
              <p className='text-gray-700 font-medium mb-6 leading-relaxed'>{feedback}</p>
              
              <motion.button 
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 font-bold text-lg'>
                {currentIndex + 1 >= expectedTotal ? "Finish Interview" : "Next Question"} <BsArrowRight size={20} />
              </motion.button>
            </motion.div>
          )}
        </div>        
      </motion.div>
    </div>
  )
}

export default Step2Interview