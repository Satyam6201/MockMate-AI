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
  FaPalette, FaFileAlt, FaUndo, FaUpload, FaEye, FaPrint,
  FaGithub, FaLinkedin, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaExternalLinkAlt, FaLightbulb, FaExchangeAlt, FaChevronDown, FaChevronUp,
  FaCrown, FaCoins, FaLock, FaTimes, FaGift
} from 'react-icons/fa';
import { 
  BsRobot, BsShieldCheck, BsLightningChargeFill, BsStars, 
  BsSliders, BsBriefcase, BsMortarboard, BsCodeSquare, BsAward, BsCheckLg
} from 'react-icons/bs';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Template Tier Definitions
const FREE_TEMPLATES = ['executive', 'clean'];
const PRO_TEMPLATES = ['modern', 'compact'];

// Sample pre-filled ATS-friendly resumes
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
          "Spearheaded database indexing and Redis multi-tier caching, reducing 95th percentile query latency from 320ms to 45ms.",
          "Led a cross-functional squad of 6 engineers across sprint cycles, establishing strict code quality, PR reviews, and automated CI/CD pipelines."
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
          "Engineered real-time dashboard analytics utilizing React, TypeScript, and WebSocket connections, boosting user engagement by 32%.",
          "Automated cloud infrastructure deployment via Docker and AWS ECS, trimming release cycle lead time by 60%.",
          "Implemented OAuth 2.0 and RBAC access control mechanisms, mitigating vulnerability risks for 500k+ active accounts."
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
          "Engineered an AI-assisted real-time mock interview simulator featuring dynamic question generation and speech analysis.",
          "Implemented clustering and Redis distributed pub/sub to handle 10,000+ simultaneous WebSocket candidate sessions."
        ]
      },
      {
        id: "proj-2",
        title: "CloudPulse — Distributed Server Health Monitor",
        techStack: "Go, React, Prometheus, Docker, PostgreSQL",
        link: "https://cloudpulse-demo.com",
        github: "https://github.com/alexrivera-dev/cloudpulse",
        bullets: [
          "Built a lightweight telemetry agent in Go with < 15MB memory footprint, collecting 50+ server metrics every second.",
          "Integrated Grafana alerting webhooks to trigger instant incident escalation protocols via Slack and PagerDuty."
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
      summary: "Enthusiastic Computer Science graduate with strong foundations in Data Structures, Algorithms, and Full Stack Web Development. Passionate about writing clean, modular code and solving complex algorithmic challenges. 500+ LeetCode problems solved."
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
          "Developed 8+ responsive web components in React and TailwindCSS, improving cross-device accessibility scores to 98%.",
          "Built REST API endpoints in Node.js and Express to streamline user onboarding workflows for 10,000+ monthly sign-ups.",
          "Collaborated with senior engineers to write comprehensive unit tests with Jest, achieving 88% code coverage."
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
          "Developed a browser-based collaborative IDE with real-time cursor tracking and syntax highlighting for 12+ programming languages.",
          "Integrated WebRTC audio rooms to enable seamless low-latency remote pair programming between engineering candidates."
        ]
      },
      {
        id: "proj-2",
        title: "AlgoVisualizer — Interactive Algorithm Simulator",
        techStack: "JavaScript, HTML5 Canvas, CSS3",
        link: "https://algoviz-priya.web.app",
        github: "https://github.com/priyasharma/algoviz",
        bullets: [
          "Created interactive step-by-step visualizations for 20+ graph, tree, and sorting algorithms with dynamic speed controls."
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

// Power action verbs for ATS scoring
const powerActionVerbs = [
  "architected", "engineered", "spearheaded", "optimized", "built", "implemented",
  "developed", "automated", "designed", "scaled", "delivered", "reduced",
  "accelerated", "led", "enhanced", "streamlined", "deployed", "integrated", "orchestrated"
];

const ResumeBuilder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const userCredits = userData?.credits ?? 0;

  // Resume data state
  const [resumeData, setResumeData] = useState(sampleResumes.sde2);
  const [activeTab, setActiveTab] = useState('personal'); // personal, skills, experience, projects, education, certs
  const [selectedTemplate, setSelectedTemplate] = useState('modern'); // modern, executive, compact, clean
  const [accentColor, setAccentColor] = useState('#059669'); // emerald green default
  const [fontFamily, setFontFamily] = useState('sans'); // sans, serif, mono
  const [fontSize, setFontSize] = useState('normal'); // compact, normal, spacious
  const [isExporting, setIsExporting] = useState(false);
  const [atsScoreData, setAtsScoreData] = useState({ score: 95, feedback: [] });
  const [activeView, setActiveView] = useState('split'); // split, editor, preview

  // AI Assistant Bullet Enhancer state
  const [showAiModal, setShowAiModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [targetBulletPath, setTargetBulletPath] = useState(null); // { type: 'experience', index: 0, bulletIndex: 0 }
  const [rawBulletInput, setRawBulletInput] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const resumePrintRef = useRef(null);

  // Available accent palettes
  const colorOptions = [
    { name: "Emerald Tech", hex: "#059669" },
    { name: "Deep Slate", hex: "#1e293b" },
    { name: "Classic Navy", hex: "#1e40af" },
    { name: "Cyber Teal", hex: "#0d9488" },
    { name: "Royal Purple", hex: "#7e22ce" },
    { name: "Crimson Red", hex: "#be123c" }
  ];

  // Calculate ATS Score in Real Time
  useEffect(() => {
    let score = 0;
    const feedback = [];

    // 1. Contact Completeness (Max 25 pts)
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
      feedback.push("Add complete contact details (phone, email, LinkedIn, and professional summary) to boost visibility.");
    }

    // 2. Skills Density (Max 20 pts)
    const totalSkills = (resumeData.skills.languages + resumeData.skills.frameworks + resumeData.skills.databases + resumeData.skills.tools).split(',').filter(s => s.trim().length > 0).length;
    if (totalSkills >= 12) {
      score += 20;
    } else if (totalSkills >= 6) {
      score += 14;
      feedback.push("Add 6+ more industry-standard technical skills relevant to your target role.");
    } else {
      score += 8;
      feedback.push("Your skills section is sparse. Include core languages, frameworks, and developer tools.");
    }

    // 3. Action Verbs & Metrics in Experience Bullets (Max 35 pts)
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
        feedback.push("Quantify your achievements with metrics (e.g. 'reduced latency by 40%', 'scaled to 10k users').");
      }
      if (verbRatio < 0.6) {
        feedback.push("Start every bullet point with a strong action verb (e.g., 'Architected', 'Engineered', 'Optimized').");
      }
    } else {
      score += 10;
      feedback.push("Add work experience or internship achievements to strengthen your profile.");
    }

    // 4. Projects & Education (Max 20 pts)
    if (resumeData.projects.length >= 2) score += 10;
    else if (resumeData.projects.length === 1) score += 6;

    if (resumeData.education.length >= 1) score += 10;

    // Normalizing max score to 100
    const finalScore = Math.min(100, Math.max(20, score));
    setAtsScoreData({ score: finalScore, feedback });
  }, [resumeData]);

  // Load sample template handler
  const handleLoadSample = (type) => {
    setResumeData(sampleResumes[type]);
    toast.success(`Loaded ${type === 'sde2' ? 'Senior SDE' : 'Fresher / Junior'} sample template!`, { icon: "📄" });
  };

  // Add & Remove handlers for nested arrays
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
      bullets: ["Built responsive application serving 5,000+ active users."]
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

  // AI Bullet Generator Integration
  const handleOpenAiEnhancer = (type, index, bulletIndex, currentText) => {
    setTargetBulletPath({ type, index, bulletIndex });
    setRawBulletInput(currentText);
    setAiSuggestions([]);
    setShowAiModal(true);
  };

  const generateAiBulletPoints = async () => {
    if (!rawBulletInput.trim()) {
      toast.error("Please enter a basic bullet point first!");
      return;
    }

    setIsGeneratingAi(true);

    try {
      // Try calling backend AI enhancement endpoint
      const res = await axios.post(`${serverUrl}/api/resume/ai-enhance`, {
        bulletText: rawBulletInput,
        role: resumeData.personalInfo.jobTitle || 'Software Engineer'
      }, { withCredentials: true });

      if (res.data && res.data.suggestions && res.data.suggestions.length > 0) {
        setAiSuggestions(res.data.suggestions);
      } else {
        throw new Error("No suggestions from server");
      }
    } catch (err) {
      // Algorithmic ATS action-verb generator fallback
      const base = rawBulletInput.trim();
      const suggestions = [
        `Architected and deployed ${base.toLowerCase()}, improving system throughput by 35% and cutting server load.`,
        `Spearheaded the implementation of ${base.toLowerCase()} with automated CI/CD pipelines, reducing delivery latency by 45%.`,
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
    toast.success("Enhanced bullet point applied!", { icon: "✨" });
  };

  // Export as Vector PDF Download with Credit Deduction Logic
  const handleDownloadPdf = async () => {
    if (!resumePrintRef.current) return;

    const isPro = PRO_TEMPLATES.includes(selectedTemplate);

    // If Pro template selected, verify user authentication & credits
    if (isPro) {
      if (!userData) {
        toast.error("Please sign in to use Pro ATS templates (50 Credits), or switch to a Free template (Harvard Classic / Minimalist).");
        setShowCreditModal(true);
        return;
      }
      if (userCredits < 50) {
        setShowCreditModal(true);
        toast.error("Insufficient credits! Pro templates require 50 credits.", { icon: "👑" });
        return;
      }
    }

    setIsExporting(true);
    const toastId = toast.loading(isPro ? "Deducting 50 credits & building Pro ATS PDF..." : "Generating ATS-Optimized PDF...");

    try {
      // Sync build with backend and deduct credits if user is logged in
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
            toast.success(`50 Credits deducted! Remaining balance: ${res.data.creditsLeft}`, { icon: "👑" });
          }
        } catch (apiErr) {
          if (apiErr?.response?.status === 402 || apiErr?.response?.status === 400) {
            toast.error(apiErr.response?.data?.message || "Insufficient credits for Pro template.", { id: toastId });
            setShowCreditModal(true);
            setIsExporting(false);
            return;
          }
          console.warn("Backend sync notice:", apiErr.message);
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

      toast.success("Resume downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. You can also use the Print button.", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  // Browser Print Option
  const handlePrint = () => {
    window.print();
  };

  // Export raw JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `resume_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Resume data JSON exported!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* Top Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl px-4 sm:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg shadow-emerald-500/20">
              <BsRobot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  ATS Resume Architect
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v2.0 &bull; ATS 99%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Recruiter-vetted templates designed to beat candidate screening algorithms
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Sample Preload Buttons */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700/60 rounded-xl p-1 text-xs">
              <button
                onClick={() => handleLoadSample('sde2')}
                className="px-2.5 py-1 rounded-lg hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                title="Load Senior SDE Profile"
              >
                Senior SDE
              </button>
              <button
                onClick={() => handleLoadSample('fresher')}
                className="px-2.5 py-1 rounded-lg hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                title="Load Fresher SDE Profile"
              >
                Fresher SDE
              </button>
            </div>

            {/* Layout Toggle on Mobile / Desktop */}
            <div className="hidden lg:flex items-center bg-slate-800/90 border border-slate-700/60 rounded-xl p-1 text-xs">
              <button
                onClick={() => setActiveView('split')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${activeView === 'split' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                Split View
              </button>
              <button
                onClick={() => setActiveView('editor')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${activeView === 'editor' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                Editor Only
              </button>
              <button
                onClick={() => setActiveView('preview')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${activeView === 'preview' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                Preview Only
              </button>
            </div>

            {/* Export Buttons */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all shadow-sm"
              title="Browser Vector Print"
            >
              <FaPrint className="text-slate-400" /> Print
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <FaDownload className="text-xs" />
              {isExporting ? "Exporting..." : "Download PDF"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT COLUMN: EDITOR & CONTROLS ================= */}
        <div className={`${activeView === 'preview' ? 'hidden' : activeView === 'editor' ? 'lg:col-span-12' : 'lg:col-span-5'} space-y-6`}>
          
          {/* ATS Score & Live Optimizer Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <BsShieldCheck className="text-emerald-400 text-lg" />
                <h3 className="font-bold text-sm text-white">Live ATS Compatibility Score</h3>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800">
                <span className={`text-base font-extrabold ${atsScoreData.score >= 85 ? 'text-emerald-400' : atsScoreData.score >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {atsScoreData.score}%
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Ready</span>
              </div>
            </div>

            {/* Score Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${atsScoreData.score}%` }}
                transition={{ duration: 0.6 }}
                className={`h-full rounded-full ${atsScoreData.score >= 85 ? 'bg-gradient-to-r from-teal-400 to-emerald-500' : atsScoreData.score >= 70 ? 'bg-amber-400' : 'bg-rose-500'}`}
              />
            </div>

            {/* Actionable Feedback Pills */}
            {atsScoreData.feedback.length > 0 ? (
              <div className="space-y-1.5">
                {atsScoreData.feedback.slice(0, 2).map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
                    <FaLightbulb className="text-amber-400 text-xs flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/30 p-2 rounded-xl border border-emerald-800/40">
                <FaCheckCircle className="flex-shrink-0" />
                <span>Perfect! Your resume meets high ATS compliance guidelines.</span>
              </div>
            )}
          </div>

          {/* Template & Styling Control Deck */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <BsSliders className="text-emerald-400" /> Template & Style Configuration
              </h3>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px]">
                <FaCoins className="text-amber-400" />
                <span className="text-slate-400 font-medium">Credits:</span>
                <span className="font-bold text-white">{userCredits}</span>
              </div>
            </div>

            {/* Template Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'modern', name: 'Modern Tech', tier: 'PRO', cost: '50 Cr', isPro: true },
                { id: 'executive', name: 'Harvard Classic', tier: 'FREE', cost: '0 Cr', isPro: false },
                { id: 'compact', name: 'Two-Column', tier: 'PRO', cost: '50 Cr', isPro: true },
                { id: 'clean', name: 'Minimalist', tier: 'FREE', cost: '0 Cr', isPro: false }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTemplate(t.id);
                    if (t.isPro && userCredits < 50) {
                      toast((t_toast) => (
                        <span className="text-xs">
                          👑 <b>{t.name}</b> is a Pro Template (50 credits required to export).
                        </span>
                      ), { icon: 'ℹ️' });
                    }
                  }}
                  className={`p-2.5 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 relative overflow-hidden ${
                    selectedTemplate === t.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="font-semibold text-[11px]">{t.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                    t.isPro 
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                      : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {t.isPro ? '👑 Pro (50)' : '🆓 Free (0)'}
                  </span>
                </button>
              ))}
            </div>

            {/* Accent Color Palette */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Accent Color:</span>
              <div className="flex items-center gap-1.5">
                {colorOptions.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setAccentColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-5 h-5 rounded-full transition-transform ${accentColor === c.hex ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'hover:scale-105 opacity-80'}`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Font & Spacing Control */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Typography:</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="sans">Inter (Modern Sans)</option>
                  <option value="serif">Merriweather (Executive Serif)</option>
                  <option value="mono">JetBrains (Technical Mono)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Spacing Density:</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="compact">Compact (Fit 1 Page)</option>
                  <option value="normal">Standard (Balanced)</option>
                  <option value="spacious">Spacious (Relaxed)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'personal', label: 'Contact', icon: <FaEnvelope /> },
              { id: 'skills', label: 'Skills', icon: <BsCodeSquare /> },
              { id: 'experience', label: 'Experience', icon: <BsBriefcase /> },
              { id: 'projects', label: 'Projects', icon: <BsLightningChargeFill /> },
              { id: 'education', label: 'Education', icon: <BsMortarboard /> },
              { id: 'certs', label: 'Certs', icon: <BsAward /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Section Form Editor */}
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            
            {/* 1. PERSONAL INFORMATION */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-white border-b border-slate-800 pb-2">
                  Personal & Contact Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400">Full Name *</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, fullName: e.target.value }
                      })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. Alex Rivera"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400">Target Role / Title *</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.jobTitle}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, jobTitle: e.target.value }
                      })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. Senior Full Stack Engineer"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400">Email Address *</label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                      })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. alex@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400">Phone Number *</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                      })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. +1 (555) 019-2834"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400">Location (City, State/Country)</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                      })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400">LinkedIn URL / Username</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value }
                      })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. linkedin.com/in/alex"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400">GitHub Profile</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.github}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, github: e.target.value }
                      })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. github.com/alex"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400">Portfolio Website</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.portfolio}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, portfolio: e.target.value }
                      })}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. alexrivera.tech"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400">Professional Summary (2-4 Sentences)</label>
                  <textarea
                    rows={3}
                    value={resumeData.personalInfo.summary}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, summary: e.target.value }
                    })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Provide a concise summary highlighting your years of experience, core tech stack, and key metrics."
                  />
                </div>
              </div>
            )}

            {/* 2. TECHNICAL SKILLS */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-white border-b border-slate-800 pb-2">
                  Categorized Skills (Comma-separated)
                </h4>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400">Languages & Core Runtimes</label>
                  <input
                    type="text"
                    value={resumeData.skills.languages}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      skills: { ...resumeData.skills, languages: e.target.value }
                    })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. JavaScript, TypeScript, Python, C++, SQL"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400">Frameworks & Libraries</label>
                  <input
                    type="text"
                    value={resumeData.skills.frameworks}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      skills: { ...resumeData.skills, frameworks: e.target.value }
                    })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. React, Node.js, Express, Next.js, FastAPI, TailwindCSS"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400">Databases & Caching</label>
                  <input
                    type="text"
                    value={resumeData.skills.databases}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      skills: { ...resumeData.skills, databases: e.target.value }
                    })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. PostgreSQL, MongoDB, Redis, MySQL"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400">Cloud, DevOps & Tools</label>
                  <input
                    type="text"
                    value={resumeData.skills.tools}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      skills: { ...resumeData.skills, tools: e.target.value }
                    })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Docker, AWS, Git, Kubernetes, Linux, Jest"
                  />
                </div>
              </div>
            )}

            {/* 3. WORK EXPERIENCE */}
            {activeTab === 'experience' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-sm text-white">Work Experience</h4>
                  <button
                    onClick={handleAddExperience}
                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all"
                  >
                    <FaPlus className="text-[10px]" /> Add Position
                  </button>
                </div>

                {resumeData.experience.map((exp, expIdx) => (
                  <div key={exp.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3 relative">
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 text-xs p-1"
                      title="Delete Experience"
                    >
                      <FaTrash />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Job Title</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[expIdx].position = e.target.value;
                            setResumeData({ ...resumeData, experience: updated });
                          }}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[expIdx].company = e.target.value;
                            setResumeData({ ...resumeData, experience: updated });
                          }}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Dates (e.g. Mar 2022 - Present)</label>
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => {
                              const updated = [...resumeData.experience];
                              updated[expIdx].startDate = e.target.value;
                              setResumeData({ ...resumeData, experience: updated });
                            }}
                            className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
                            placeholder="Start"
                          />
                          <span className="text-slate-500">-</span>
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => {
                              const updated = [...resumeData.experience];
                              updated[expIdx].endDate = e.target.value;
                              setResumeData({ ...resumeData, experience: updated });
                            }}
                            className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
                            placeholder="End"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[expIdx].location = e.target.value;
                            setResumeData({ ...resumeData, experience: updated });
                          }}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Key Achievements (Bullets)
                        </label>
                        <button
                          onClick={() => handleAddExpBullet(expIdx)}
                          className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                        >
                          <FaPlus className="text-[8px]" /> Add Bullet
                        </button>
                      </div>

                      {exp.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...resumeData.experience];
                              updated[expIdx].bullets[bIdx] = e.target.value;
                              setResumeData({ ...resumeData, experience: updated });
                            }}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                            placeholder="Action verb + metric + tech stack"
                          />
                          <button
                            onClick={() => handleOpenAiEnhancer('experience', expIdx, bIdx, bullet)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs flex-shrink-0"
                            title="Enhance with AI"
                          >
                            <BsStars />
                          </button>
                          {exp.bullets.length > 1 && (
                            <button
                              onClick={() => handleDeleteExpBullet(expIdx, bIdx)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 text-xs flex-shrink-0"
                              title="Delete Bullet"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-sm text-white">Technical Projects</h4>
                  <button
                    onClick={handleAddProject}
                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all"
                  >
                    <FaPlus className="text-[10px]" /> Add Project
                  </button>
                </div>

                {resumeData.projects.map((proj, projIdx) => (
                  <div key={proj.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3 relative">
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 text-xs p-1"
                      title="Delete Project"
                    >
                      <FaTrash />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[projIdx].title = e.target.value;
                            setResumeData({ ...resumeData, projects: updated });
                          }}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Tech Stack Used</label>
                        <input
                          type="text"
                          value={proj.techStack}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[projIdx].techStack = e.target.value;
                            setResumeData({ ...resumeData, projects: updated });
                          }}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          placeholder="e.g. React, Node.js, Redis"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Live URL / Demo Link</label>
                        <input
                          type="text"
                          value={proj.link}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[projIdx].link = e.target.value;
                            setResumeData({ ...resumeData, projects: updated });
                          }}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">GitHub Repository</label>
                        <input
                          type="text"
                          value={proj.github}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[projIdx].github = e.target.value;
                            setResumeData({ ...resumeData, projects: updated });
                          }}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Bullets */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Project Highlights
                        </label>
                        <button
                          onClick={() => handleAddProjBullet(projIdx)}
                          className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                        >
                          <FaPlus className="text-[8px]" /> Add Bullet
                        </button>
                      </div>

                      {proj.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...resumeData.projects];
                              updated[projIdx].bullets[bIdx] = e.target.value;
                              setResumeData({ ...resumeData, projects: updated });
                            }}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                          />
                          <button
                            onClick={() => handleOpenAiEnhancer('project', projIdx, bIdx, bullet)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs flex-shrink-0"
                            title="Enhance with AI"
                          >
                            <BsStars />
                          </button>
                          {proj.bullets.length > 1 && (
                            <button
                              onClick={() => handleDeleteProjBullet(projIdx, bIdx)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 text-xs flex-shrink-0"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. EDUCATION */}
            {activeTab === 'education' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-sm text-white">Education</h4>
                  <button
                    onClick={handleAddEducation}
                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all"
                  >
                    <FaPlus className="text-[10px]" /> Add Degree
                  </button>
                </div>

                {resumeData.education.map((edu, eduIdx) => (
                  <div key={edu.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3 relative">
                    <button
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 text-xs p-1"
                    >
                      <FaTrash />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">University / College</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[eduIdx].institution = e.target.value;
                            setResumeData({ ...resumeData, education: updated });
                          }}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Degree & Major</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[eduIdx].degree = e.target.value;
                            setResumeData({ ...resumeData, education: updated });
                          }}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Graduation Year / Dates</label>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[eduIdx].endDate = e.target.value;
                            setResumeData({ ...resumeData, education: updated });
                          }}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          placeholder="e.g. 2019 - 2023"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">GPA / Percentage</label>
                        <input
                          type="text"
                          value={edu.gpa}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[eduIdx].gpa = e.target.value;
                            setResumeData({ ...resumeData, education: updated });
                          }}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          placeholder="e.g. 3.85 / 4.0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. CERTIFICATIONS */}
            {activeTab === 'certs' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-sm text-white">Certifications & Honors</h4>
                  <button
                    onClick={handleAddCertification}
                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all"
                  >
                    <FaPlus className="text-[10px]" /> Add Certification
                  </button>
                </div>

                {resumeData.certifications.map((cert, certIdx) => (
                  <div key={cert.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2.5 relative">
                    <button
                      onClick={() => handleDeleteCertification(cert.id)}
                      className="absolute top-2.5 right-2.5 text-slate-500 hover:text-rose-400 text-xs p-1"
                    >
                      <FaTrash />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Certification Name</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => {
                            const updated = [...resumeData.certifications];
                            updated[certIdx].name = e.target.value;
                            setResumeData({ ...resumeData, certifications: updated });
                          }}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold">Issuing Organization & Year</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const updated = [...resumeData.certifications];
                            updated[certIdx].issuer = e.target.value;
                            setResumeData({ ...resumeData, certifications: updated });
                          }}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          placeholder="e.g. AWS / 2024"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: LIVE RESUME PREVIEW ================= */}
        <div className={`${activeView === 'editor' ? 'hidden' : activeView === 'preview' ? 'lg:col-span-12' : 'lg:col-span-7'} sticky top-24`}>
          
          {/* Preview Container Wrapper */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Live A4 Document Preview
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Template: <strong className="text-white capitalize">{selectedTemplate}</strong></span>
              </div>
            </div>

            {/* Scrollable Document Container */}
            <div className="overflow-x-auto max-h-[85vh] overflow-y-auto rounded-2xl shadow-inner bg-slate-950 p-2 sm:p-4 flex justify-center">
              
              {/* THE RESUME DOCUMENT (Print Ref) */}
              <div
                ref={resumePrintRef}
                id="resume-print-document"
                style={{
                  fontFamily: fontFamily === 'serif' ? 'Georgia, Merriweather, serif' : fontFamily === 'mono' ? 'Courier New, monospace' : 'Inter, system-ui, sans-serif'
                }}
                className={`w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 sm:p-10 shadow-2xl transition-all duration-300 ${
                  fontSize === 'compact' ? 'text-[11px] leading-snug space-y-3' : fontSize === 'spacious' ? 'text-[13px] leading-normal space-y-5' : 'text-[12px] leading-relaxed space-y-4'
                }`}
              >

                {/* ================= TEMPLATE 1: MODERN TECH (DEFAULT) ================= */}
                {selectedTemplate === 'modern' && (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="border-b-2 pb-3" style={{ borderColor: accentColor }}>
                      <h1 className="text-2xl font-black tracking-tight" style={{ color: accentColor }}>
                        {resumeData.personalInfo.fullName || "Your Full Name"}
                      </h1>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5">
                        {resumeData.personalInfo.jobTitle || "Target Job Title"}
                      </p>

                      {/* Contact Badges */}
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

                    {/* Summary */}
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

                    {/* Technical Skills */}
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

                    {/* Work Experience */}
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

                    {/* Projects */}
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

                    {/* Education */}
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

                    {/* Certifications */}
                    {resumeData.certifications.length > 0 && (
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>
                          Certifications & Honors
                        </h2>
                        <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700">
                          {resumeData.certifications.map(cert => (
                            <li key={cert.id}>
                              <strong className="text-slate-900">{cert.name}</strong> &ndash; {cert.issuer} {cert.date && `(${cert.date})`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* ================= TEMPLATE 2: HARVARD CLASSIC ================= */}
                {selectedTemplate === 'executive' && (
                  <div className="space-y-3.5 text-center">
                    {/* Centered Header */}
                    <div className="border-b pb-2 border-slate-900">
                      <h1 className="text-2xl font-bold tracking-normal uppercase text-slate-950">
                        {resumeData.personalInfo.fullName || "Your Name"}
                      </h1>
                      <div className="flex flex-wrap items-center justify-center gap-x-2 text-[11px] text-slate-700 mt-1">
                        <span>{resumeData.personalInfo.location}</span>
                        <span>&bull;</span>
                        <span>{resumeData.personalInfo.phone}</span>
                        <span>&bull;</span>
                        <span>{resumeData.personalInfo.email}</span>
                        {resumeData.personalInfo.linkedin && (
                          <>
                            <span>&bull;</span>
                            <span>{resumeData.personalInfo.linkedin}</span>
                          </>
                        )}
                        {resumeData.personalInfo.github && (
                          <>
                            <span>&bull;</span>
                            <span>{resumeData.personalInfo.github}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Sections (Left aligned with horizontal bar) */}
                    <div className="text-left space-y-3">
                      {/* Summary */}
                      {resumeData.personalInfo.summary && (
                        <div>
                          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 mb-1 text-slate-950">
                            Professional Summary
                          </h2>
                          <p className="text-slate-800 text-justify">
                            {resumeData.personalInfo.summary}
                          </p>
                        </div>
                      )}

                      {/* Experience */}
                      {resumeData.experience.length > 0 && (
                        <div>
                          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 mb-1.5 text-slate-950">
                            Experience
                          </h2>
                          <div className="space-y-2.5">
                            {resumeData.experience.map(exp => (
                              <div key={exp.id}>
                                <div className="flex justify-between font-bold text-slate-950">
                                  <span>{exp.company}, {exp.location}</span>
                                  <span className="font-normal text-[11px]">{exp.startDate} – {exp.endDate}</span>
                                </div>
                                <p className="italic text-[11px] font-semibold text-slate-800 mb-0.5">{exp.position}</p>
                                <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800">
                                  {exp.bullets.map((b, idx) => (
                                    <li key={idx}>{b}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Projects */}
                      {resumeData.projects.length > 0 && (
                        <div>
                          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 mb-1.5 text-slate-950">
                            Technical Projects
                          </h2>
                          <div className="space-y-2">
                            {resumeData.projects.map(proj => (
                              <div key={proj.id}>
                                <div className="flex justify-between font-bold text-slate-950">
                                  <span>{proj.title}</span>
                                  <span className="text-[10px] font-mono text-slate-600">{proj.techStack}</span>
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

                      {/* Education */}
                      {resumeData.education.length > 0 && (
                        <div>
                          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 mb-1 text-slate-950">
                            Education
                          </h2>
                          {resumeData.education.map(edu => (
                            <div key={edu.id} className="flex justify-between text-slate-900">
                              <div>
                                <span className="font-bold">{edu.institution}</span>, {edu.location} &ndash; <span className="italic">{edu.degree}</span>
                              </div>
                              <span className="text-[11px]">{edu.endDate}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Skills */}
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 mb-1 text-slate-950">
                          Technical Skills
                        </h2>
                        <p className="text-slate-800">
                          <strong>Languages:</strong> {resumeData.skills.languages} | <strong>Frameworks:</strong> {resumeData.skills.frameworks} | <strong>Databases & Tools:</strong> {resumeData.skills.databases}, {resumeData.skills.tools}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= TEMPLATE 3: TWO-COLUMN SIDEBAR ================= */}
                {selectedTemplate === 'compact' && (
                  <div className="grid grid-cols-12 gap-5 text-left">
                    {/* Left Column (4 cols) */}
                    <div className="col-span-4 border-r pr-4 space-y-4" style={{ borderColor: `${accentColor}30` }}>
                      <div>
                        <h1 className="text-xl font-black tracking-tight" style={{ color: accentColor }}>
                          {resumeData.personalInfo.fullName || "Your Name"}
                        </h1>
                        <p className="text-xs font-bold text-slate-700 mt-0.5">
                          {resumeData.personalInfo.jobTitle}
                        </p>
                      </div>

                      {/* Contact */}
                      <div className="space-y-1.5 text-[11px] text-slate-700">
                        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>Contact</h3>
                        <p className="break-all">{resumeData.personalInfo.email}</p>
                        <p>{resumeData.personalInfo.phone}</p>
                        <p>{resumeData.personalInfo.location}</p>
                        {resumeData.personalInfo.linkedin && <p className="break-all font-mono text-[10px]">{resumeData.personalInfo.linkedin}</p>}
                        {resumeData.personalInfo.github && <p className="break-all font-mono text-[10px]">{resumeData.personalInfo.github}</p>}
                      </div>

                      {/* Skills */}
                      <div className="space-y-2 text-[11px]">
                        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>Skills</h3>
                        <div>
                          <p className="font-bold text-slate-900">Languages:</p>
                          <p className="text-slate-700">{resumeData.skills.languages}</p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Frameworks:</p>
                          <p className="text-slate-700">{resumeData.skills.frameworks}</p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Databases & Tools:</p>
                          <p className="text-slate-700">{resumeData.skills.databases}, {resumeData.skills.tools}</p>
                        </div>
                      </div>

                      {/* Education */}
                      {resumeData.education.length > 0 && (
                        <div className="space-y-1.5 text-[11px]">
                          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>Education</h3>
                          {resumeData.education.map(edu => (
                            <div key={edu.id}>
                              <p className="font-bold text-slate-900">{edu.degree}</p>
                              <p className="text-slate-700">{edu.institution}</p>
                              <p className="text-slate-500 text-[10px]">{edu.endDate}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Main Column (8 cols) */}
                    <div className="col-span-8 space-y-4">
                      {/* Summary */}
                      {resumeData.personalInfo.summary && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Profile</h3>
                          <p className="text-slate-700 text-justify">{resumeData.personalInfo.summary}</p>
                        </div>
                      )}

                      {/* Experience */}
                      {resumeData.experience.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Experience</h3>
                          <div className="space-y-3">
                            {resumeData.experience.map(exp => (
                              <div key={exp.id}>
                                <div className="flex justify-between font-bold text-slate-900">
                                  <span>{exp.position} &bull; {exp.company}</span>
                                  <span className="text-[10px] text-slate-500">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 mt-1">
                                  {exp.bullets.map((b, idx) => (
                                    <li key={idx}>{b}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Projects */}
                      {resumeData.projects.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Projects</h3>
                          <div className="space-y-2.5">
                            {resumeData.projects.map(proj => (
                              <div key={proj.id}>
                                <div className="flex justify-between font-bold text-slate-900">
                                  <span>{proj.title}</span>
                                  <span className="text-[10px] text-slate-500 font-mono">{proj.techStack}</span>
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
                    </div>
                  </div>
                )}

                {/* ================= TEMPLATE 4: CLEAN MINIMALIST ================= */}
                {selectedTemplate === 'clean' && (
                  <div className="space-y-4 text-left">
                    <div className="flex items-start justify-between border-b pb-3 border-slate-300">
                      <div>
                        <h1 className="text-2xl font-extrabold text-slate-950">
                          {resumeData.personalInfo.fullName}
                        </h1>
                        <p className="text-sm font-semibold" style={{ color: accentColor }}>
                          {resumeData.personalInfo.jobTitle}
                        </p>
                      </div>
                      <div className="text-right text-[11px] text-slate-600 space-y-0.5">
                        <p>{resumeData.personalInfo.email} &bull; {resumeData.personalInfo.phone}</p>
                        <p>{resumeData.personalInfo.location}</p>
                        <p>{resumeData.personalInfo.linkedin} &bull; {resumeData.personalInfo.github}</p>
                      </div>
                    </div>

                    {/* Summary */}
                    {resumeData.personalInfo.summary && (
                      <p className="text-slate-700 text-justify italic">
                        "{resumeData.personalInfo.summary}"
                      </p>
                    )}

                    {/* Skills */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800 text-[11px] space-y-1">
                      <p><strong>Languages:</strong> {resumeData.skills.languages}</p>
                      <p><strong>Frameworks:</strong> {resumeData.skills.frameworks}</p>
                      <p><strong>Databases & Tools:</strong> {resumeData.skills.databases} &bull; {resumeData.skills.tools}</p>
                    </div>

                    {/* Experience */}
                    {resumeData.experience.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Experience</h3>
                        <div className="space-y-3">
                          {resumeData.experience.map(exp => (
                            <div key={exp.id}>
                              <div className="flex justify-between font-bold text-slate-900">
                                <span>{exp.position} &ndash; <span className="font-normal text-slate-700">{exp.company}</span></span>
                                <span className="text-[11px] text-slate-500">{exp.startDate} &ndash; {exp.endDate}</span>
                              </div>
                              <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 mt-1">
                                {exp.bullets.map((b, idx) => (
                                  <li key={idx}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {resumeData.projects.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Projects</h3>
                        <div className="space-y-2">
                          {resumeData.projects.map(proj => (
                            <div key={proj.id}>
                              <div className="flex justify-between font-bold text-slate-900">
                                <span>{proj.title} <span className="font-normal text-xs text-slate-600">({proj.techStack})</span></span>
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

                    {/* Education */}
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
        </div>
      </main>

      {/* ================= AI BULLET POINT OPTIMIZER MODAL ================= */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-xl p-6 rounded-3xl shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold">
                    <BsStars />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">AI Bullet Point Enhancer</h3>
                    <p className="text-xs text-slate-400">Transform basic duties into high-impact ATS metric statements</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="text-slate-400 hover:text-white text-sm p-1"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your Draft Bullet Point:</label>
                <textarea
                  rows={2}
                  value={rawBulletInput}
                  onChange={(e) => setRawBulletInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Worked on the backend APIs and helped speed up the database."
                />
              </div>

              <button
                onClick={generateAiBulletPoints}
                disabled={isGeneratingAi}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/10 hover:opacity-95 transition-all disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaMagic />
                )}
                {isGeneratingAi ? "Generating Metric-Driven Bullet Points..." : "Generate 3 High-Impact Alternatives"}
              </button>

              {aiSuggestions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Select an optimized ATS version:
                  </label>
                  {aiSuggestions.map((sugg, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleApplyAiSuggestion(sugg)}
                      className="p-3 rounded-xl bg-slate-950 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all text-xs text-slate-200 flex items-start gap-2.5 group"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 transition-colors">
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

      {/* ================= INSUFFICIENT CREDITS / PRO TEMPLATE MODAL ================= */}
      <AnimatePresence>
        {showCreditModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-3xl shadow-2xl space-y-4 text-center relative overflow-hidden"
            >
              {/* Glow Accent */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl shadow-lg shadow-amber-500/10">
                <FaCrown />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  Pro Template Requires 50 Credits
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  You currently have <strong className="text-amber-400">{userCredits} Credits</strong>.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 text-left space-y-2">
                <div className="flex items-start gap-2">
                  <FaGift className="text-emerald-400 text-sm flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Good News!</strong> You can build and export our ATS-compliant <strong>Harvard Classic</strong> and <strong>Minimalist</strong> templates 100% Free (0 Credits)!
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setSelectedTemplate('executive');
                    setShowCreditModal(false);
                    toast.success("Switched to Free Harvard Classic Template! (0 Credits)", { icon: "🆓" });
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15"
                >
                  <BsCheckLg /> Use Free Harvard Classic (0 Credits)
                </button>

                <button
                  onClick={() => {
                    setSelectedTemplate('clean');
                    setShowCreditModal(false);
                    toast.success("Switched to Free Minimalist Template! (0 Credits)", { icon: "🆓" });
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 border border-slate-700"
                >
                  <BsCheckLg /> Use Free Minimalist Clean (0 Credits)
                </button>

                <Link
                  to="/pricing"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 block"
                >
                  <FaCoins /> Get More Credits on Pricing
                </Link>

                <button
                  onClick={() => setShowCreditModal(false)}
                  className="w-full py-2 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
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
