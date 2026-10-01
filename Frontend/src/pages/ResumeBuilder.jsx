import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';

import { sampleResumes, PRO_TEMPLATES } from '../data/resumeData';
import { runAtsAudit } from '../utils/atsAudit';
import ResumeHeader from '../components/resume/ResumeHeader';
import ResumeScoreCard from '../components/resume/ResumeScoreCard';
import ResumeStyleControls from '../components/resume/ResumeStyleControls';
import ResumeFormEditor from '../components/resume/ResumeFormEditor';
import ResumePreview from '../components/resume/ResumePreview';
import ResumeAiModal from '../components/resume/ResumeAiModal';
import ResumeCreditModal from '../components/resume/ResumeCreditModal';
import ResumeAuditModal from '../components/resume/ResumeAuditModal';

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
  const [activeView, setActiveView] = useState('split');

  const [showAiModal, setShowAiModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [targetBulletPath, setTargetBulletPath] = useState(null);
  const [rawBulletInput, setRawBulletInput] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const resumePrintRef = useRef(null);

  const auditReport = runAtsAudit(resumeData);
  const atsScoreData = {
    score: auditReport.overallScore,
    feedback: auditReport.missingItems.slice(0, 2).map(item => item.message)
  };

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
    const toastId = toast.loading(isPro ? "Generating ATS Pro PDF (50 Credits)..." : "Generating ATS-Optimized PDF...");

    try {
      const element = resumePrintRef.current;

      const canvas = await html2canvas(element, {
        scale: 2.2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1024,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('resume-print-area');
          if (clonedElement) {
            clonedElement.style.width = '794px';
            clonedElement.style.maxWidth = '794px';
            clonedElement.style.margin = '0 auto';
            clonedElement.style.padding = '32px';
            clonedElement.style.boxShadow = 'none';
            clonedElement.style.border = 'none';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = 210;
      const pdfPageHeight = 297;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfPageHeight;

      while (heightLeft > 5) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfPageHeight;
      }

      const rawName = resumeData.personalInfo?.fullName?.trim() || 'Candidate';
      const cleanName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`${cleanName}_ATS_Resume.pdf`);

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
            toast.success(`PDF downloaded. 50 Credits deducted (Remaining: ${res.data.creditsLeft})`, { id: toastId });
            return;
          }
        } catch (apiErr) {
          console.warn("Could not sync resume build record:", apiErr?.message);
        }
      }

      toast.success("Resume downloaded successfully", { id: toastId });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. You can also use the Print button to save as PDF.", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 relative">
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none no-print"></div>
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none no-print"></div>

      <Navbar />

      <ResumeHeader
        onLoadSample={handleLoadSample}
        activeView={activeView}
        setActiveView={setActiveView}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        onOpenAudit={() => setShowAuditModal(true)}
        isExporting={isExporting}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={`resume-editor-col ${activeView === 'preview' ? 'hidden' : activeView === 'editor' ? 'lg:col-span-12' : 'lg:col-span-5'} space-y-6`}>
          <ResumeScoreCard 
            atsScoreData={atsScoreData} 
            onOpenAudit={() => setShowAuditModal(true)} 
          />

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

        <div className={`resume-preview-container ${activeView === 'editor' ? 'hidden' : activeView === 'preview' ? 'lg:col-span-12' : 'lg:col-span-7'} sticky top-24`}>
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

      <ResumeAuditModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        auditReport={auditReport}
        onJumpToTab={(tab) => setActiveTab(tab)}
      />

      <Footer />
    </div>
  );
};

export default ResumeBuilder;