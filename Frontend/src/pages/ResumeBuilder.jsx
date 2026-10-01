import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { sampleResumes, powerActionVerbs, PRO_TEMPLATES } from '../data/resumeData';
import ResumeHeader from '../components/resume/ResumeHeader';
import ResumeScoreCard from '../components/resume/ResumeScoreCard';
import ResumeStyleControls from '../components/resume/ResumeStyleControls';
import ResumeFormEditor from '../components/resume/ResumeFormEditor';
import ResumePreview from '../components/resume/ResumePreview';
import ResumeAiModal from '../components/resume/ResumeAiModal';
import ResumeCreditModal from '../components/resume/ResumeCreditModal';

const ResumeBuilder = () => {
  const dispatch = useDispatch();
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

    const totalSkills = (resumeData.skills.languages + resumeData.skills.frameworks + resumeData.skills.databases + resumeData.skills.tools)
      .split(',')
      .filter(s => s.trim().length > 0).length;

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

      <ResumeHeader
        onLoadSample={handleLoadSample}
        activeView={activeView}
        setActiveView={setActiveView}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        isExporting={isExporting}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={`${activeView === 'preview' ? 'hidden' : activeView === 'editor' ? 'lg:col-span-12' : 'lg:col-span-5'} space-y-6`}>
          <ResumeScoreCard atsScoreData={atsScoreData} />

          <ResumeStyleControls
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            fontSize={fontSize}
            setFontSize={setFontSize}
            userCredits={userCredits}
            onProSelect={() => toast("Pro template selected. 50 credits required to export.")}
          />

          <ResumeFormEditor
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            resumeData={resumeData}
            setResumeData={setResumeData}
            onAddExperience={handleAddExperience}
            onDeleteExperience={handleDeleteExperience}
            onAddExpBullet={handleAddExpBullet}
            onDeleteExpBullet={handleDeleteExpBullet}
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
            onAddProjBullet={handleAddProjBullet}
            onDeleteProjBullet={handleDeleteProjBullet}
            onAddEducation={handleAddEducation}
            onDeleteEducation={handleDeleteEducation}
            onAddCertification={handleAddCertification}
            onDeleteCertification={handleDeleteCertification}
            onOpenAiEnhancer={handleOpenAiEnhancer}
          />
        </div>

        <div className={`${activeView === 'editor' ? 'hidden' : activeView === 'preview' ? 'lg:col-span-12' : 'lg:col-span-7'} sticky top-24`}>
          <ResumePreview
            ref={resumePrintRef}
            resumeData={resumeData}
            selectedTemplate={selectedTemplate}
            accentColor={accentColor}
            fontFamily={fontFamily}
            fontSize={fontSize}
          />
        </div>
      </main>

      <ResumeAiModal
        showAiModal={showAiModal}
        setShowAiModal={setShowAiModal}
        rawBulletInput={rawBulletInput}
        setRawBulletInput={setRawBulletInput}
        generateAiBulletPoints={generateAiBulletPoints}
        isGeneratingAi={isGeneratingAi}
        aiSuggestions={aiSuggestions}
        onApplyAiSuggestion={handleApplyAiSuggestion}
      />

      <ResumeCreditModal
        showCreditModal={showCreditModal}
        setShowCreditModal={setShowCreditModal}
        userCredits={userCredits}
        onSelectFreeTemplate={(tpl) => {
          setSelectedTemplate(tpl);
          setShowCreditModal(false);
          toast.success(`Switched to Free ${tpl === 'executive' ? 'Harvard Classic' : 'Minimalist'} Template (0 Credits)`);
        }}
      />

      <Footer />
    </div>
  );
};

export default ResumeBuilder;
