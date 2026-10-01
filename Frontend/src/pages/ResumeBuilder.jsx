import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  FaPlus, FaTrash, FaDownload, FaMagic, FaCheckCircle, 
  FaPalette, FaFileAlt, FaPrint, FaBriefcase, FaGraduationCap,
  FaGithub, FaLinkedin, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaLightbulb, FaCrown, FaCoins, FaTimes, FaGift, FaCertificate, FaCode
} from 'react-icons/fa';
import { BsShieldCheck, BsLightningChargeFill, BsSliders } from 'react-icons/bs';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const FREE_TEMPLATES = ['executive', 'clean'];
const PRO_TEMPLATES = ['modern', 'compact'];

const sampleResumes = {
  sde2: {
    personalInfo: {
      fullName: "Alex Rivera",
      jobTitle: "Senior Full Stack Software Engineer",
      email: "alex.rivera@example.com",
      phone: "+1 (555) 234-5678",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/alexrivera-dev",
      github: "github.com/alexrivera-dev",
      portfolio: "alexrivera.tech",
      summary: "Results-driven Senior Software Engineer with 5+ years of experience architecting distributed microservices, real-time WebSocket systems, and scalable full-stack web applications. Proven track record of improving system latency by 40% and leading high-performing agile engineering teams."
    },
    skills: {
      languages: "JavaScript, TypeScript, Python, Go, SQL, HTML5/CSS3",
      frameworks: "React, Node.js, Express, Next.js, FastAPI, TailwindCSS",
      databases: "PostgreSQL, MongoDB, Redis, Elasticsearch",
      tools: "Docker, Kubernetes, AWS (S3, EC2, Lambda), Git, CI/CD, Jest"
    },
    experience: [
      {
        id: "exp-1",
        company: "Apex Cloud Solutions",
        position: "Senior Full Stack Engineer",
        location: "San Francisco, CA",
        startDate: "Mar 2022",
        endDate: "Present",
        current: true,
        bullets: [
          "Architected high-throughput event-driven microservices processing 15M+ daily API requests with 99.98% uptime.",
          "Spearheaded database indexing and Redis multi-tier caching, reducing query latency from 320ms to 45ms.",
          "Led a cross-functional squad of 6 engineers across sprint cycles, establishing PR reviews and automated CI/CD pipelines."
        ]
      },
      {
        id: "exp-2",
        company: "HyperScale Tech",
        position: "Software Engineer",
        location: "Austin, TX",
        startDate: "Jul 2019",
        endDate: "Feb 2022",
        current: false,
        bullets: [
          "Engineered real-time dashboard analytics using React, TypeScript, and WebSockets, boosting engagement by 32%.",
          "Automated cloud infrastructure deployment via Docker and AWS ECS, trimming release cycle lead time by 60%.",
          "Implemented OAuth 2.0 and RBAC access control mechanisms for 500k+ active accounts."
        ]
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "MockMate AI — Enterprise Interview Platform",
        techStack: "React, Node.js, Redis, MongoDB, OpenAI, WebSockets",
        link: "https://mock-mate-ai.vercel.app",
        github: "https://github.com/alexrivera-dev/mockmate-ai",
        bullets: [
          "Engineered an AI-assisted real-time mock interview simulator with speech analysis and evaluation.",
          "Implemented clustering and Redis distributed pub/sub to handle 10,000+ simultaneous candidate sessions."
        ]
      },
      {
        id: "proj-2",
        title: "CloudPulse — Distributed Server Health Monitor",
        techStack: "Go, React, Prometheus, Docker, PostgreSQL",
        link: "https://cloudpulse-demo.com",
        github: "https://github.com/alexrivera-dev/cloudpulse",
        bullets: [
          "Built a lightweight telemetry agent in Go collecting 50+ server metrics every second.",
          "Integrated Grafana alerting webhooks to trigger instant incident escalation protocols via Slack."
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        institution: "University of Texas at Austin",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science",
        location: "Austin, TX",
        startDate: "2015",
        endDate: "2019",
        gpa: "3.85 / 4.0"
      }
    ],
    certifications: [
      {
        id: "cert-1",
        name: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        date: "2023"
      }
    ]
  },
  fresher: {
    personalInfo: {
      fullName: "Priya Sharma",
      jobTitle: "Associate Software Engineer",
      email: "priya.sharma@example.com",
      phone: "+91 98765 43210",
      location: "Bengaluru, India",
      linkedin: "linkedin.com/in/priyasharma-dev",
      github: "github.com/priyasharma-dev",
      portfolio: "priyasharma.me",
      summary: "Enthusiastic Computer Science graduate with strong foundations in Data Structures, Algorithms, and Full Stack Web Development. Passionate about writing clean, modular code and solving complex algorithmic challenges."
    },
    skills: {
      languages: "C++, Java, JavaScript, Python, SQL",
      frameworks: "React, Node.js, Express, TailwindCSS, Bootstrap",
      databases: "MongoDB, MySQL",
      tools: "Git, GitHub, Postman, Linux, VS Code"
    },
    experience: [
      {
        id: "exp-1",
        company: "InnovateTech Labs",
        position: "Software Development Intern",
        location: "Bengaluru, India",
        startDate: "Jan 2024",
        endDate: "Jun 2024",
        current: false,
        bullets: [
          "Developed responsive web components in React and TailwindCSS, improving accessibility scores to 98%.",
          "Built REST API endpoints in Node.js and Express to streamline onboarding for 10,000+ monthly sign-ups.",
          "Collaborated with senior engineers to write unit tests with Jest, achieving 88% test coverage."
        ]
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "CodeCollab — Real-time Pair Programming Workspace",
        techStack: "React, Node.js, Socket.IO, Monaco Editor",
        link: "https://codecollab.dev",
        github: "https://github.com/priyasharma/codecollab",
        bullets: [
          "Developed a browser-based collaborative IDE with real-time cursor tracking for 12+ languages.",
          "Integrated WebRTC audio rooms to enable seamless low-latency remote pair programming."
        ]
      },
      {
        id: "proj-2",
        title: "AlgoVisualizer — Interactive Algorithm Simulator",
        techStack: "JavaScript, HTML5 Canvas, CSS3",
        link: "https://algoviz-priya.web.app",
        github: "https://github.com/priyasharma/algoviz",
        bullets: [
          "Created interactive step-by-step visualizations for 20+ graph, tree, and sorting algorithms."
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        institution: "National Institute of Technology",
        degree: "B.Tech",
        fieldOfStudy: "Computer Science & Engineering",
        location: "Bengaluru, India",
        startDate: "2020",
        endDate: "2024",
        gpa: "8.9 / 10.0"
      }
    ],
    certifications: [
      {
        id: "cert-1",
        name: "Meta Front-End Developer Professional Certificate",
        issuer: "Coursera / Meta",
        date: "2023"
      }
    ]
  }
};

const powerActionVerbs = [
  "architected", "engineered", "spearheaded", "optimized", "built", "implemented",
  "developed", "automated", "designed", "scaled", "delivered", "reduced",
  "accelerated", "led", "enhanced", "streamlined", "deployed", "integrated", "orchestrated"
];

const colorOptions = [
  { name: "Emerald Tech", hex: "#059669" },
  { name: "Deep Slate", hex: "#334155" },
  { name: "Classic Navy", hex: "#1d4ed8" },
  { name: "Cyber Teal", hex: "#0f766e" },
  { name: "Royal Purple", hex: "#7c3aed" },
  { name: "Crimson Red", hex: "#be123c" }
];

const ResumeBuilder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const userCredits = userData?.credits ?? 0;

  const [resumeData, setResumeData] = useState(sampleResumes.sde2);
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [accentColor, setAccentColor] = useState('#059669');
  const [fontFamily, setFontFamily] = useState('sans');
  const [fontSize, setFontSize] = useState('normal');
  const [isExporting, setIsExporting] = useState(false);
  const [atsScoreData, setAtsScoreData] = useState({ score: 95, feedback: [] });
  const [activeView, setActiveView] = useState('split');

  const [showAiModal, setShowAiModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [targetBulletPath, setTargetBulletPath] = useState(null);
  const [rawBulletInput, setRawBulletInput] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const resumePrintRef = useRef(null);

  useEffect(() => {
    let score = 0;
    const feedback = [];

    const { fullName, email, phone, location, linkedin, github, summary } = resumeData.personalInfo;
    let contactPts = 0;
    if (fullName?.trim()) contactPts += 5;
    if (email?.includes('@')) contactPts += 5;
    if (phone?.trim()) contactPts += 5;
    if (location?.trim()) contactPts += 3;
    if (linkedin?.trim() || github?.trim()) contactPts += 4;
    if (summary && summary.length > 50) contactPts += 3;
    score += contactPts;
    if (contactPts < 22) {
      feedback.push("Add complete contact details (phone, email, LinkedIn, and summary) to maximize recruiter visibility.");
    }

    const totalSkills = (resumeData.skills.languages + resumeData.skills.frameworks + resumeData.skills.databases + resumeData.skills.tools).split(',').filter(s => s.trim().length > 0).length;
    if (totalSkills >= 12) {
      score += 20;
    } else if (totalSkills >= 6) {
      score += 14;
      feedback.push("Add 6+ more technical skills aligned with your target role.");
    } else {
      score += 8;
      feedback.push("Your skills section needs more keywords. Include core languages, frameworks, and developer tools.");
    }

    let actionVerbCount = 0;
    let metricCount = 0;
    let totalBullets = 0;

    resumeData.experience.forEach(exp => {
      exp.bullets.forEach(bullet => {
        totalBullets++;
        const lower = bullet.toLowerCase();
        if (powerActionVerbs.some(verb => lower.includes(verb))) actionVerbCount++;
        if (/\d+%|\$\d+|\d+\+|\d+ms|\d+m/i.test(bullet)) metricCount++;
      });
    });

    if (totalBullets > 0) {
      const verbRatio = actionVerbCount / totalBullets;
      const metricRatio = metricCount / totalBullets;

      const verbPts = Math.min(20, Math.round(verbRatio * 20));
      const metricPts = Math.min(15, Math.round(metricRatio * 15));
      score += (verbPts + metricPts);

      if (metricRatio < 0.4) {
        feedback.push("Quantify achievements with measurable metrics (e.g. 'reduced latency by 40%', 'served 10k+ users').");
      }
      if (verbRatio < 0.6) {
        feedback.push("Start bullet points with strong action verbs (e.g., 'Architected', 'Engineered', 'Optimized').");
      }
    } else {
      score += 10;
      feedback.push("Add work experience or internship achievements to strengthen your profile.");
    }

    if (resumeData.projects.length >= 2) score += 10;
    else if (resumeData.projects.length === 1) score += 6;

    if (resumeData.education.length >= 1) score += 10;

    const finalScore = Math.min(100, Math.max(20, score));
    setAtsScoreData({ score: finalScore, feedback });
  }, [resumeData]);

  const handleLoadSample = (type) => {
    setResumeData(sampleResumes[type]);
    toast.success(`Loaded ${type === 'sde2' ? 'Senior Software Engineer' : 'Junior / Fresher'} sample`);
  };

  const handleAddExperience = () => {
    const newExp = {
      id: "exp-" + Date.now(),
      company: "Company Name",
      position: "Software Engineer",
      location: "City, Country",
      startDate: "Jan 2023",
      endDate: "Present",
      current: true,
      bullets: ["Engineered scalable web services improving response times by 30%."]
    };
    setResumeData(prev => ({ ...prev, experience: [newExp, ...prev.experience] }));
  };

  const handleDeleteExperience = (id) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  };

  const handleAddExpBullet = (expIndex) => {
    const updated = [...resumeData.experience];
    updated[expIndex].bullets.push("Implemented core feature resulting in increased performance.");
    setResumeData(prev => ({ ...prev, experience: updated }));
  };

  const handleDeleteExpBullet = (expIndex, bulletIndex) => {
    const updated = [...resumeData.experience];
    updated[expIndex].bullets = updated[expIndex].bullets.filter((_, idx) => idx !== bulletIndex);
    setResumeData(prev => ({ ...prev, experience: updated }));
  };

  const handleAddProject = () => {
    const newProj = {
      id: "proj-" + Date.now(),
      title: "New Project Title",
      techStack: "React, Node.js, MongoDB",
      link: "https://project.com",
      github: "https://github.com/username/project",
      bullets: ["Built responsive web application serving 5,000+ active users."]
    };
    setResumeData(prev => ({ ...prev, projects: [newProj, ...prev.projects] }));
  };

  const handleDeleteProject = (id) => {
    setResumeData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const handleAddProjBullet = (projIndex) => {
    const updated = [...resumeData.projects];
    updated[projIndex].bullets.push("Integrated automated testing suite achieving 90% code coverage.");
    setResumeData(prev => ({ ...prev, projects: updated }));
  };

  const handleDeleteProjBullet = (projIndex, bulletIndex) => {
    const updated = [...resumeData.projects];
    updated[projIndex].bullets = updated[projIndex].bullets.filter((_, idx) => idx !== bulletIndex);
    setResumeData(prev => ({ ...prev, projects: updated }));
  };

  const handleAddEducation = () => {
    const newEdu = {
      id: "edu-" + Date.now(),
      institution: "University Name",
      degree: "B.S. in Computer Science",
      fieldOfStudy: "Software Engineering",
      location: "City, Country",
      startDate: "2019",
      endDate: "2023",
      gpa: "3.8 / 4.0"
    };
    setResumeData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const handleDeleteEducation = (id) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  };

  const handleAddCertification = () => {
    const newCert = {
      id: "cert-" + Date.now(),
      name: "Certification Name",
      issuer: "Issuing Organization",
      date: "2024"
    };
    setResumeData(prev => ({ ...prev, certifications: [...prev.certifications, newCert] }));
  };

  const handleDeleteCertification = (id) => {
    setResumeData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));
  };

  const handleOpenAiEnhancer = (type, index, bulletIndex, currentText) => {
    setTargetBulletPath({ type, index, bulletIndex });
    setRawBulletInput(currentText);
    setAiSuggestions([]);
    setShowAiModal(true);
  };

  const generateAiBulletPoints = async () => {
    if (!rawBulletInput.trim()) {
      toast.error("Please enter a bullet point first");
      return;
    }

    setIsGeneratingAi(true);

    try {
      const res = await axios.post(`${serverUrl}/api/resume/ai-enhance`, {
        bulletText: rawBulletInput,
        role: resumeData.personalInfo.jobTitle || 'Software Engineer'
      }, { withCredentials: true });

      if (res.data && res.data.suggestions && res.data.suggestions.length > 0) {
        setAiSuggestions(res.data.suggestions);
      } else {
        throw new Error("No suggestions returned");
      }
    } catch (err) {
      const base = rawBulletInput.trim();
      const suggestions = [
        `Architected and deployed ${base.toLowerCase()}, improving system throughput by 35% and cutting server load.`,
        `Spearheaded the implementation of ${base.toLowerCase()} with automated CI/CD pipelines, reducing delivery turnaround by 45%.`,
        `Engineered robust ${base.toLowerCase()} handling 10k+ concurrent requests with 99.9% uptime and zero critical incidents.`
      ];
      setAiSuggestions(suggestions);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleApplyAiSuggestion = (suggestion) => {
    if (!targetBulletPath) return;
    const { type, index, bulletIndex } = targetBulletPath;

    if (type === 'experience') {
      const updated = [...resumeData.experience];
      updated[index].bullets[bulletIndex] = suggestion;
      setResumeData(prev => ({ ...prev, experience: updated }));
    } else if (type === 'project') {
      const updated = [...resumeData.projects];
      updated[index].bullets[bulletIndex] = suggestion;
      setResumeData(prev => ({ ...prev, projects: updated }));
    }

    setShowAiModal(false);
    toast.success("Enhanced bullet point applied");
  };

  const handleDownloadPdf = async () => {
    if (!resumePrintRef.current) return;

    const isPro = PRO_TEMPLATES.includes(selectedTemplate);

    if (isPro) {
      if (!userData) {
        toast.error("Please sign in to export Pro ATS templates (50 Credits) or switch to a Free template.");
        setShowCreditModal(true);
        return;
      }
      if (userCredits < 50) {
        setShowCreditModal(true);
        toast.error("Pro templates require 50 credits. Switch to Free templates or top up credits.");
        return;
      }
    }

    setIsExporting(true);
    const toastId = toast.loading(isPro ? "Deducting 50 credits & preparing Pro PDF..." : "Generating ATS-Optimized PDF...");

    try {
      if (userData) {
        try {
          const res = await axios.post(`${serverUrl}/api/resume/build`, {
            resumeData,
            template: selectedTemplate,
            accentColor,
            fontFamily,
            atsScore: atsScoreData.score
          }, { withCredentials: true });

          if (res.data?.creditsDeducted > 0) {
            dispatch(setUserData({ ...userData, credits: res.data.creditsLeft }));
            toast.success(`50 Credits deducted. Remaining: ${res.data.creditsLeft}`);
          }
        } catch (apiErr) {
          if (apiErr?.response?.status === 402 || apiErr?.response?.status === 400) {
            toast.error(apiErr.response?.data?.message || "Insufficient credits for Pro template.", { id: toastId });
            setShowCreditModal(true);
            setIsExporting(false);
            return;
          }
        }
      }

      const element = resumePrintRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const filename = `${(resumeData.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_ATS_Resume.pdf`;
      pdf.save(filename);

      toast.success("Resume downloaded successfully", { id: toastId });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. You can also use the Print button.", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 relative">
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>

      <Navbar />

      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 sm:px-8 py-3.5 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <FaFileAlt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  ATS Resume Builder
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ATS Optimized
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Recruiter-vetted templates designed to pass automated applicant screening systems
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs">
              <button
                onClick={() => handleLoadSample('sde2')}
                className="px-2.5 py-1 rounded-lg hover:bg-white hover:shadow-xs text-slate-700 font-medium transition"
              >
                Senior SDE
              </button>
              <button
                onClick={() => handleLoadSample('fresher')}
                className="px-2.5 py-1 rounded-lg hover:bg-white hover:shadow-xs text-slate-700 font-medium transition"
              >
                Fresher SDE
              </button>
            </div>

            <div className="hidden lg:flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs">
              <button
                onClick={() => setActiveView('split')}
                className={`px-3 py-1 rounded-lg font-medium transition ${activeView === 'split' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Split View
              </button>
              <button
                onClick={() => setActiveView('editor')}
                className={`px-3 py-1 rounded-lg font-medium transition ${activeView === 'editor' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Editor Only
              </button>
              <button
                onClick={() => setActiveView('preview')}
                className={`px-3 py-1 rounded-lg font-medium transition ${activeView === 'preview' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Preview Only
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition shadow-xs"
            >
              <FaPrint className="text-slate-500" /> Print
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <FaDownload className="text-xs" />
              {isExporting ? "Exporting..." : "Download PDF"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className={`${activeView === 'preview' ? 'hidden' : activeView === 'editor' ? 'lg:col-span-12' : 'lg:col-span-5'} space-y-6`}>
          
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <BsShieldCheck className="text-emerald-600 text-lg" />
                <h3 className="font-bold text-sm text-slate-900">ATS Compatibility Score</h3>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                <span className={`text-base font-extrabold ${atsScoreData.score >= 85 ? 'text-emerald-700' : atsScoreData.score >= 70 ? 'text-amber-700' : 'text-rose-700'}`}>
                  {atsScoreData.score}%
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold">Ready</span>
              </div>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${atsScoreData.score}%` }}
                transition={{ duration: 0.6 }}
                className={`h-full rounded-full ${atsScoreData.score >= 85 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : atsScoreData.score >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
              />
            </div>

            {atsScoreData.feedback.length > 0 ? (
              <div className="space-y-1.5">
                {atsScoreData.feedback.slice(0, 2).map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <FaLightbulb className="text-amber-500 text-xs shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <FaCheckCircle className="text-emerald-600 shrink-0" />
                <span>Excellent! Your resume fulfills high ATS compliance criteria.</span>
              </div>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <BsSliders className="text-emerald-600" /> Template & Style Configuration
              </h3>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs">
                <FaCoins className="text-amber-500" />
                <span className="text-slate-600 font-medium">Credits:</span>
                <span className="font-bold text-slate-900">{userCredits}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'modern', name: 'Modern Tech', isPro: true, cost: '50' },
                { id: 'executive', name: 'Harvard Classic', isPro: false, cost: '0' },
                { id: 'compact', name: 'Two-Column', isPro: true, cost: '50' },
                { id: 'clean', name: 'Minimalist', isPro: false, cost: '0' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTemplate(t.id);
                    if (t.isPro && userCredits < 50) {
                      toast(`Pro template selected. 50 credits required to export.`, { icon: <FaCrown className="text-amber-500" /> });
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition text-center flex flex-col items-center justify-center gap-1.5 relative ${
                    selectedTemplate === t.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-semibold text-xs">{t.name}</span>
                  <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                    t.isPro 
                      ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {t.isPro ? <FaCrown className="text-[9px]" /> : <FaCheckCircle className="text-[9px]" />}
                    {t.isPro ? 'Pro (50)' : 'Free (0)'}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-600 font-medium">Accent Color:</span>
              <div className="flex items-center gap-2">
                {colorOptions.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setAccentColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-5 h-5 rounded-full transition-transform ${accentColor === c.hex ? 'ring-2 ring-emerald-600 ring-offset-2 scale-110' : 'hover:scale-105 opacity-80'}`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">Typography:</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="sans">Inter (Modern Sans)</option>
                  <option value="serif">Merriweather (Executive Serif)</option>
                  <option value="mono">JetBrains (Technical Mono)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">Spacing Density:</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="compact">Compact (Fit 1 Page)</option>
                  <option value="normal">Standard (Balanced)</option>
                  <option value="spacious">Spacious (Relaxed)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'personal', label: 'Contact', icon: <FaEnvelope /> },
              { id: 'skills', label: 'Skills', icon: <FaCode /> },
              { id: 'experience', label: 'Experience', icon: <FaBriefcase /> },
              { id: 'projects', label: 'Projects', icon: <BsLightningChargeFill /> },
              { id: 'education', label: 'Education', icon: <FaGraduationCap /> },
              { id: 'certs', label: 'Certificates', icon: <FaCertificate /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  Personal & Contact Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, fullName: e.target.value } }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      placeholder="Alex Rivera"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Target Job Title</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.jobTitle}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, jobTitle: e.target.value } }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      placeholder="Senior Full Stack Software Engineer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, email: e.target.value } }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      placeholder="alex.rivera@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Phone</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, phone: e.target.value } }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      placeholder="+1 (555) 234-5678"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Location</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, location: e.target.value } }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">LinkedIn URL / Username</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, linkedin: e.target.value } }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      placeholder="linkedin.com/in/alexrivera-dev"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">GitHub URL / Username</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.github}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, github: e.target.value } }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      placeholder="github.com/alexrivera-dev"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Portfolio / Website</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.portfolio}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, portfolio: e.target.value } }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      placeholder="alexrivera.tech"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Professional Summary</label>
                  <textarea
                    rows={4}
                    value={resumeData.personalInfo.summary}
                    onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, summary: e.target.value } }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    placeholder="Results-driven Senior Software Engineer with 5+ years of experience architecting distributed systems..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  Technical & Professional Skills
                </h4>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Languages (comma separated)</label>
                  <input
                    type="text"
                    value={resumeData.skills.languages}
                    onChange={(e) => setResumeData(prev => ({ ...prev, skills: { ...prev.skills, languages: e.target.value } }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    placeholder="JavaScript, TypeScript, Python, Go, SQL"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Frameworks & Libraries</label>
                  <input
                    type="text"
                    value={resumeData.skills.frameworks}
                    onChange={(e) => setResumeData(prev => ({ ...prev, skills: { ...prev.skills, frameworks: e.target.value } }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    placeholder="React, Node.js, Express, Next.js, FastAPI, TailwindCSS"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Databases & Storage</label>
                  <input
                    type="text"
                    value={resumeData.skills.databases}
                    onChange={(e) => setResumeData(prev => ({ ...prev, skills: { ...prev.skills, databases: e.target.value } }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    placeholder="PostgreSQL, MongoDB, Redis, Elasticsearch"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Cloud, DevOps & Tools</label>
                  <input
                    type="text"
                    value={resumeData.skills.tools}
                    onChange={(e) => setResumeData(prev => ({ ...prev, skills: { ...prev.skills, tools: e.target.value } }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    placeholder="Docker, Kubernetes, AWS (S3, EC2, Lambda), Git, CI/CD, Jest"
                  />
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-sm text-slate-900">Work Experience</h4>
                  <button
                    onClick={handleAddExperience}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition"
                  >
                    <FaPlus className="text-xs" /> Add Position
                  </button>
                </div>

                {resumeData.experience.map((exp, expIdx) => (
                  <div key={exp.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Position #{expIdx + 1}</span>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-rose-500 hover:text-rose-700 text-xs p-1"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Job Title</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[expIdx].position = e.target.value;
                            setResumeData(prev => ({ ...prev, experience: updated }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[expIdx].company = e.target.value;
                            setResumeData(prev => ({ ...prev, experience: updated }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[expIdx].location = e.target.value;
                            setResumeData(prev => ({ ...prev, experience: updated }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[expIdx].startDate = e.target.value;
                            setResumeData(prev => ({ ...prev, experience: updated }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[expIdx].endDate = e.target.value;
                            setResumeData(prev => ({ ...prev, experience: updated }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-600">Key Achievements (Bullet Points)</label>
                        <button
                          onClick={() => handleAddExpBullet(expIdx)}
                          className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
                        >
                          + Add Bullet
                        </button>
                      </div>

                      {exp.bullets.map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...resumeData.experience];
                              updated[expIdx].bullets[bulletIdx] = e.target.value;
                              setResumeData(prev => ({ ...prev, experience: updated }));
                            }}
                            className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                          />
                          <button
                            onClick={() => handleOpenAiEnhancer('experience', expIdx, bulletIdx, bullet)}
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs shrink-0"
                            title="Enhance with AI"
                          >
                            <FaMagic />
                          </button>
                          <button
                            onClick={() => handleDeleteExpBullet(expIdx, bulletIdx)}
                            className="p-2 text-rose-500 hover:text-rose-700 text-xs shrink-0"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-sm text-slate-900">Technical Projects</h4>
                  <button
                    onClick={handleAddProject}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition"
                  >
                    <FaPlus className="text-xs" /> Add Project
                  </button>
                </div>

                {resumeData.projects.map((proj, projIdx) => (
                  <div key={proj.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Project #{projIdx + 1}</span>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-rose-500 hover:text-rose-700 text-xs p-1"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[projIdx].title = e.target.value;
                            setResumeData(prev => ({ ...prev, projects: updated }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Technologies Used</label>
                        <input
                          type="text"
                          value={proj.techStack}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[projIdx].techStack = e.target.value;
                            setResumeData(prev => ({ ...prev, projects: updated }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Live URL (optional)</label>
                        <input
                          type="text"
                          value={proj.link}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[projIdx].link = e.target.value;
                            setResumeData(prev => ({ ...prev, projects: updated }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">GitHub URL (optional)</label>
                        <input
                          type="text"
                          value={proj.github}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[projIdx].github = e.target.value;
                            setResumeData(prev => ({ ...prev, projects: updated }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-600">Project Highlights</label>
                        <button
                          onClick={() => handleAddProjBullet(projIdx)}
                          className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
                        >
                          + Add Highlight
                        </button>
                      </div>

                      {proj.bullets.map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...resumeData.projects];
                              updated[projIdx].bullets[bulletIdx] = e.target.value;
                              setResumeData(prev => ({ ...prev, projects: updated }));
                            }}
                            className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                          />
                          <button
                            onClick={() => handleOpenAiEnhancer('project', projIdx, bulletIdx, bullet)}
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs shrink-0"
                            title="Enhance with AI"
                          >
                            <FaMagic />
                          </button>
                          <button
                            onClick={() => handleDeleteProjBullet(projIdx, bulletIdx)}
                            className="p-2 text-rose-500 hover:text-rose-700 text-xs shrink-0"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-sm text-slate-900">Education Details</h4>
                  <button
                    onClick={handleAddEducation}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition"
                  >
                    <FaPlus className="text-xs" /> Add Degree
                  </button>
                </div>

                {resumeData.education.map((edu, eduIdx) => (
                  <div key={edu.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Degree #{eduIdx + 1}</span>
                      <button
                        onClick={() => handleDeleteEducation(edu.id)}
                        className="text-rose-500 hover:text-rose-700 text-xs p-1"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[eduIdx].institution = e.target.value;
                            setResumeData(prev => ({ ...prev, education: updated }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Degree & Major</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[eduIdx].degree = e.target.value;
                            setResumeData(prev => ({ ...prev, education: updated }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Location</label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[eduIdx].location = e.target.value;
                            setResumeData(prev => ({ ...prev, education: updated }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Graduation Year</label>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[eduIdx].endDate = e.target.value;
                            setResumeData(prev => ({ ...prev, education: updated }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">GPA / Honors</label>
                        <input
                          type="text"
                          value={edu.gpa}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[eduIdx].gpa = e.target.value;
                            setResumeData(prev => ({ ...prev, education: updated }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'certs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-sm text-slate-900">Certifications & Awards</h4>
                  <button
                    onClick={handleAddCertification}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition"
                  >
                    <FaPlus className="text-xs" /> Add Certificate
                  </button>
                </div>

                {resumeData.certifications.map((cert, certIdx) => (
                  <div key={cert.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Certification #{certIdx + 1}</span>
                      <button
                        onClick={() => handleDeleteCertification(cert.id)}
                        className="text-rose-500 hover:text-rose-700 text-xs p-1"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Certificate Name</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => {
                            const updated = [...resumeData.certifications];
                            updated[certIdx].name = e.target.value;
                            setResumeData(prev => ({ ...prev, certifications: updated }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Issuer</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const updated = [...resumeData.certifications];
                            updated[certIdx].issuer = e.target.value;
                            setResumeData(prev => ({ ...prev, certifications: updated }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Year</label>
                        <input
                          type="text"
                          value={cert.date}
                          onChange={(e) => {
                            const updated = [...resumeData.certifications];
                            updated[certIdx].date = e.target.value;
                            setResumeData(prev => ({ ...prev, certifications: updated }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={`${activeView === 'editor' ? 'hidden' : activeView === 'preview' ? 'lg:col-span-12' : 'lg:col-span-7'} sticky top-24`}>
          <div className="bg-slate-200/80 p-4 sm:p-6 rounded-2xl border border-slate-300 shadow-inner flex justify-center overflow-x-auto">
            <div
              ref={resumePrintRef}
              className={`bg-white text-slate-900 shadow-xl border border-slate-200 rounded-xs w-full max-w-[800px] min-h-[1050px] p-8 sm:p-10 ${
                fontFamily === 'serif' ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : 'font-sans'
              } ${
                fontSize === 'compact' ? 'text-[11px] leading-snug space-y-3' : fontSize === 'spacious' ? 'text-[13px] leading-relaxed space-y-5' : 'text-xs leading-normal space-y-4'
              }`}
            >
              {selectedTemplate === 'modern' && (
                <div className="space-y-4">
                  <div className="border-b-2 pb-3" style={{ borderColor: accentColor }}>
                    <h1 className="text-2xl font-black tracking-tight" style={{ color: accentColor }}>
                      {resumeData.personalInfo.fullName || "Your Full Name"}
                    </h1>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">
                      {resumeData.personalInfo.jobTitle || "Target Job Title"}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 mt-2">
                      {resumeData.personalInfo.email && (
                        <span className="flex items-center gap-1">
                          <FaEnvelope className="text-[10px]" style={{ color: accentColor }} /> {resumeData.personalInfo.email}
                        </span>
                      )}
                      {resumeData.personalInfo.phone && (
                        <span className="flex items-center gap-1">
                          <FaPhone className="text-[10px]" style={{ color: accentColor }} /> {resumeData.personalInfo.phone}
                        </span>
                      )}
                      {resumeData.personalInfo.location && (
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-[10px]" style={{ color: accentColor }} /> {resumeData.personalInfo.location}
                        </span>
                      )}
                      {resumeData.personalInfo.linkedin && (
                        <span className="flex items-center gap-1">
                          <FaLinkedin className="text-[10px]" style={{ color: accentColor }} /> {resumeData.personalInfo.linkedin}
                        </span>
                      )}
                      {resumeData.personalInfo.github && (
                        <span className="flex items-center gap-1">
                          <FaGithub className="text-[10px]" style={{ color: accentColor }} /> {resumeData.personalInfo.github}
                        </span>
                      )}
                    </div>
                  </div>

                  {resumeData.personalInfo.summary && (
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>
                        Professional Summary
                      </h2>
                      <p className="text-slate-700 text-justify">
                        {resumeData.personalInfo.summary}
                      </p>
                    </div>
                  )}

                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: accentColor }}>
                      Technical Skills
                    </h2>
                    <div className="space-y-1 text-slate-800">
                      {resumeData.skills.languages && (
                        <p><strong className="text-slate-900">Languages:</strong> {resumeData.skills.languages}</p>
                      )}
                      {resumeData.skills.frameworks && (
                        <p><strong className="text-slate-900">Frameworks:</strong> {resumeData.skills.frameworks}</p>
                      )}
                      {resumeData.skills.databases && (
                        <p><strong className="text-slate-900">Databases:</strong> {resumeData.skills.databases}</p>
                      )}
                      {resumeData.skills.tools && (
                        <p><strong className="text-slate-900">DevOps & Tools:</strong> {resumeData.skills.tools}</p>
                      )}
                    </div>
                  </div>

                  {resumeData.experience.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
                        Professional Experience
                      </h2>
                      <div className="space-y-3">
                        {resumeData.experience.map(exp => (
                          <div key={exp.id}>
                            <div className="flex items-start justify-between font-bold text-slate-900">
                              <span>{exp.position} <span className="font-normal text-slate-700">| {exp.company}</span></span>
                              <span className="text-[11px] text-slate-600 font-medium">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 italic mb-1">{exp.location}</p>
                            <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700">
                              {exp.bullets.map((b, idx) => (
                                <li key={idx}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {resumeData.projects.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
                        Key Technical Projects
                      </h2>
                      <div className="space-y-2.5">
                        {resumeData.projects.map(proj => (
                          <div key={proj.id}>
                            <div className="flex items-start justify-between font-bold text-slate-900">
                              <span>
                                {proj.title} {proj.techStack && <span className="font-normal text-[11px] text-slate-600">({proj.techStack})</span>}
                              </span>
                              {proj.link && (
                                <span className="text-[10px] text-slate-500 font-mono">{proj.link.replace(/^https?:\/\//, '')}</span>
                              )}
                            </div>
                            <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700 mt-0.5">
                              {proj.bullets.map((b, idx) => (
                                <li key={idx}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {resumeData.education.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: accentColor }}>
                        Education
                      </h2>
                      <div className="space-y-1.5">
                        {resumeData.education.map(edu => (
                          <div key={edu.id} className="flex items-start justify-between">
                            <div>
                              <p className="font-bold text-slate-900">{edu.degree}</p>
                              <p className="text-slate-700 text-[11px]">{edu.institution} &bull; <span className="text-slate-500">{edu.location}</span></p>
                            </div>
                            <div className="text-right text-[11px]">
                              <p className="font-medium text-slate-600">{edu.endDate}</p>
                              {edu.gpa && <p className="text-slate-500">GPA: {edu.gpa}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {resumeData.certifications.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: accentColor }}>
                        Certifications
                      </h2>
                      <div className="space-y-1 text-slate-800 text-[11px]">
                        {resumeData.certifications.map(c => (
                          <div key={c.id} className="flex justify-between">
                            <span><strong>{c.name}</strong> &bull; {c.issuer}</span>
                            <span className="text-slate-500">{c.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedTemplate === 'executive' && (
                <div className="space-y-4 text-slate-900">
                  <div className="text-center border-b border-slate-900 pb-3">
                    <h1 className="text-2xl font-bold uppercase tracking-wider">
                      {resumeData.personalInfo.fullName || "Your Full Name"}
                    </h1>
                    <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] text-slate-700 mt-1.5">
                      {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                      {resumeData.personalInfo.phone && <span>&bull; {resumeData.personalInfo.phone}</span>}
                      {resumeData.personalInfo.email && <span>&bull; {resumeData.personalInfo.email}</span>}
                      {resumeData.personalInfo.linkedin && <span>&bull; {resumeData.personalInfo.linkedin}</span>}
                      {resumeData.personalInfo.github && <span>&bull; {resumeData.personalInfo.github}</span>}
                    </div>
                  </div>

                  {resumeData.personalInfo.summary && (
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">
                        Executive Summary
                      </h2>
                      <p className="text-slate-800 text-justify">
                        {resumeData.personalInfo.summary}
                      </p>
                    </div>
                  )}

                  {resumeData.education.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">
                        Education
                      </h2>
                      <div className="space-y-2">
                        {resumeData.education.map(edu => (
                          <div key={edu.id} className="flex justify-between items-start">
                            <div>
                              <p className="font-bold">{edu.institution}, {edu.location}</p>
                              <p className="italic text-[11px]">{edu.degree} in {edu.fieldOfStudy}</p>
                            </div>
                            <div className="text-right text-[11px]">
                              <p>{edu.endDate}</p>
                              {edu.gpa && <p className="text-slate-600">GPA: {edu.gpa}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {resumeData.experience.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2">
                        Professional Experience
                      </h2>
                      <div className="space-y-3">
                        {resumeData.experience.map(exp => (
                          <div key={exp.id}>
                            <div className="flex justify-between items-start font-bold">
                              <span>{exp.company} &mdash; <span className="font-semibold italic">{exp.position}</span></span>
                              <span className="text-[11px] font-normal">{exp.startDate} &ndash; {exp.endDate}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 italic mb-1">{exp.location}</p>
                            <ul className="list-disc list-outside ml-4 space-y-1 text-slate-800">
                              {exp.bullets.map((b, idx) => (
                                <li key={idx}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {resumeData.projects.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2">
                        Projects
                      </h2>
                      <div className="space-y-2">
                        {resumeData.projects.map(proj => (
                          <div key={proj.id}>
                            <div className="flex justify-between items-start font-bold">
                              <span>{proj.title} {proj.techStack && <span className="font-normal text-[11px] text-slate-600">| {proj.techStack}</span>}</span>
                              {proj.link && <span className="text-[10px] font-normal">{proj.link}</span>}
                            </div>
                            <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800 mt-0.5">
                              {proj.bullets.map((b, idx) => (
                                <li key={idx}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">
                      Technical Skills & Certifications
                    </h2>
                    <div className="space-y-1 text-slate-800 text-[11px]">
                      {resumeData.skills.languages && <p><strong>Languages:</strong> {resumeData.skills.languages}</p>}
                      {resumeData.skills.frameworks && <p><strong>Technologies:</strong> {resumeData.skills.frameworks}</p>}
                      {resumeData.skills.tools && <p><strong>Developer Tools:</strong> {resumeData.skills.tools}</p>}
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === 'compact' && (
                <div className="grid grid-cols-12 gap-5 text-slate-900">
                  <div className="col-span-4 border-r border-slate-200 pr-4 space-y-4">
                    <div className="border-b border-slate-200 pb-3">
                      <h1 className="text-xl font-bold leading-tight" style={{ color: accentColor }}>
                        {resumeData.personalInfo.fullName || "Your Name"}
                      </h1>
                      <p className="text-xs font-medium text-slate-600 mt-0.5">
                        {resumeData.personalInfo.jobTitle || "Software Engineer"}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-slate-700">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-0.5 mb-1">
                        Contact
                      </h3>
                      {resumeData.personalInfo.email && <p className="break-all">{resumeData.personalInfo.email}</p>}
                      {resumeData.personalInfo.phone && <p>{resumeData.personalInfo.phone}</p>}
                      {resumeData.personalInfo.location && <p>{resumeData.personalInfo.location}</p>}
                      {resumeData.personalInfo.linkedin && <p className="break-all">{resumeData.personalInfo.linkedin}</p>}
                      {resumeData.personalInfo.github && <p className="break-all">{resumeData.personalInfo.github}</p>}
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-0.5 mb-1">
                        Skills
                      </h3>
                      {resumeData.skills.languages && (
                        <div>
                          <p className="font-bold text-slate-800">Languages:</p>
                          <p className="text-slate-600">{resumeData.skills.languages}</p>
                        </div>
                      )}
                      {resumeData.skills.frameworks && (
                        <div>
                          <p className="font-bold text-slate-800">Frameworks:</p>
                          <p className="text-slate-600">{resumeData.skills.frameworks}</p>
                        </div>
                      )}
                      {resumeData.skills.tools && (
                        <div>
                          <p className="font-bold text-slate-800">Tools:</p>
                          <p className="text-slate-600">{resumeData.skills.tools}</p>
                        </div>
                      )}
                    </div>

                    {resumeData.education.length > 0 && (
                      <div className="space-y-1.5 text-[11px]">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-0.5 mb-1">
                          Education
                        </h3>
                        {resumeData.education.map(edu => (
                          <div key={edu.id}>
                            <p className="font-bold text-slate-800">{edu.degree}</p>
                            <p className="text-slate-600">{edu.institution}</p>
                            <p className="text-slate-500">{edu.endDate}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="col-span-8 space-y-4">
                    {resumeData.personalInfo.summary && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-0.5 mb-1">
                          Profile
                        </h3>
                        <p className="text-slate-700 text-justify text-[11px]">
                          {resumeData.personalInfo.summary}
                        </p>
                      </div>
                    )}

                    {resumeData.experience.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-0.5 mb-2">
                          Experience
                        </h3>
                        <div className="space-y-3">
                          {resumeData.experience.map(exp => (
                            <div key={exp.id}>
                              <div className="flex justify-between font-bold text-[11px]">
                                <span>{exp.position} &bull; {exp.company}</span>
                                <span className="text-slate-500 font-normal">{exp.startDate} - {exp.endDate}</span>
                              </div>
                              <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-[11px] mt-1">
                                {exp.bullets.map((b, idx) => (
                                  <li key={idx}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {resumeData.projects.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-0.5 mb-2">
                          Projects
                        </h3>
                        <div className="space-y-2">
                          {resumeData.projects.map(proj => (
                            <div key={proj.id}>
                              <p className="font-bold text-[11px]">
                                {proj.title} <span className="font-normal text-slate-500">({proj.techStack})</span>
                              </p>
                              <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700 text-[11px] mt-0.5">
                                {proj.bullets.map((b, idx) => (
                                  <li key={idx}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedTemplate === 'clean' && (
                <div className="space-y-4 text-slate-800">
                  <div className="flex justify-between items-end border-b pb-2" style={{ borderColor: accentColor }}>
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        {resumeData.personalInfo.fullName || "Your Full Name"}
                      </h1>
                      <p className="text-xs font-medium" style={{ color: accentColor }}>
                        {resumeData.personalInfo.jobTitle || "Software Engineer"}
                      </p>
                    </div>
                    <div className="text-right text-[11px] text-slate-600">
                      {resumeData.personalInfo.email && <p>{resumeData.personalInfo.email}</p>}
                      {resumeData.personalInfo.phone && <p>{resumeData.personalInfo.phone}</p>}
                      {resumeData.personalInfo.location && <p>{resumeData.personalInfo.location}</p>}
                    </div>
                  </div>

                  {resumeData.personalInfo.summary && (
                    <p className="text-slate-700 text-justify text-xs">
                      {resumeData.personalInfo.summary}
                    </p>
                  )}

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">Technical Skills</h3>
                    <p className="text-slate-700 text-[11px]">
                      {resumeData.skills.languages} {resumeData.skills.frameworks && `| ${resumeData.skills.frameworks}`} {resumeData.skills.tools && `| ${resumeData.skills.tools}`}
                    </p>
                  </div>

                  {resumeData.experience.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Experience</h3>
                      <div className="space-y-3">
                        {resumeData.experience.map(exp => (
                          <div key={exp.id}>
                            <div className="flex justify-between text-xs font-bold text-slate-900">
                              <span>{exp.position}, {exp.company}</span>
                              <span className="text-slate-500 font-normal text-[11px]">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-[11px] mt-1">
                              {exp.bullets.map((b, idx) => (
                                <li key={idx}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {resumeData.projects.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Projects</h3>
                      <div className="space-y-2">
                        {resumeData.projects.map(proj => (
                          <div key={proj.id}>
                            <p className="text-xs font-bold text-slate-900">{proj.title} <span className="font-normal text-slate-500 text-[11px]">({proj.techStack})</span></p>
                            <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700 text-[11px] mt-0.5">
                              {proj.bullets.map((b, idx) => (
                                <li key={idx}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {resumeData.education.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">Education</h3>
                      {resumeData.education.map(edu => (
                        <div key={edu.id} className="flex justify-between text-slate-800 text-[11px]">
                          <span><strong>{edu.degree}</strong>, {edu.institution}</span>
                          <span>{edu.endDate}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 w-full max-w-xl p-6 rounded-2xl shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <FaMagic />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">AI Bullet Point Enhancer</h3>
                    <p className="text-xs text-slate-500">Transform basic duties into high-impact ATS metric statements</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-sm p-1"
                >
                  <FaTimes />
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your Draft Bullet Point:</label>
                <textarea
                  rows={2}
                  value={rawBulletInput}
                  onChange={(e) => setRawBulletInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  placeholder="e.g. Worked on the backend APIs and helped speed up the database."
                />
              </div>

              <button
                onClick={generateAiBulletPoints}
                disabled={isGeneratingAi}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaMagic />
                )}
                {isGeneratingAi ? "Generating Metric-Driven Bullet Points..." : "Generate 3 High-Impact Alternatives"}
              </button>

              {aiSuggestions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                    Select an optimized ATS version:
                  </label>
                  {aiSuggestions.map((sugg, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleApplyAiSuggestion(sugg)}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 cursor-pointer transition text-xs text-slate-800 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="flex-1 leading-relaxed">{sugg}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreditModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4 text-center relative overflow-hidden"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 text-2xl shadow-sm">
                <FaCrown />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Pro Template Requires 50 Credits
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  You currently have <strong className="text-amber-700 font-bold">{userCredits} Credits</strong>.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 text-left space-y-2">
                <div className="flex items-start gap-2">
                  <FaGift className="text-emerald-600 text-sm shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    You can build and export our ATS-compliant <strong>Harvard Classic</strong> and <strong>Minimalist</strong> templates 100% Free (0 Credits).
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setSelectedTemplate('executive');
                    setShowCreditModal(false);
                    toast.success("Switched to Free Harvard Classic Template (0 Credits)");
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <FaCheckCircle /> Use Free Harvard Classic (0 Credits)
                </button>

                <button
                  onClick={() => {
                    setSelectedTemplate('clean');
                    setShowCreditModal(false);
                    toast.success("Switched to Free Minimalist Template (0 Credits)");
                  }}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 border border-slate-200"
                >
                  <FaCheckCircle /> Use Free Minimalist Clean (0 Credits)
                </button>

                <Link
                  to="/pricing"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm block"
                >
                  <FaCoins /> Get More Credits on Pricing
                </Link>

                <button
                  onClick={() => setShowCreditModal(false)}
                  className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold transition"
                >
                  Close & Continue Editing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ResumeBuilder;
