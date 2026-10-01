import React from 'react';
import { 
  FaEnvelope, FaCode, FaBriefcase, FaGraduationCap, FaCertificate, 
  FaPlus, FaTrash, FaMagic 
} from 'react-icons/fa';
import { BsLightningChargeFill } from 'react-icons/bs';

const ResumeFormEditor = ({
  activeTab,
  setActiveTab,
  resumeData,
  setResumeData,
  onAddExperience,
  onDeleteExperience,
  onAddExpBullet,
  onDeleteExpBullet,
  onAddProject,
  onDeleteProject,
  onAddProjBullet,
  onDeleteProjBullet,
  onAddEducation,
  onDeleteEducation,
  onAddCertification,
  onDeleteCertification,
  onOpenAiEnhancer
}) => {
  const tabs = [
    { id: 'personal', label: 'Contact', icon: <FaEnvelope /> },
    { id: 'skills', label: 'Skills', icon: <FaCode /> },
    { id: 'experience', label: 'Experience', icon: <FaBriefcase /> },
    { id: 'projects', label: 'Projects', icon: <BsLightningChargeFill /> },
    { id: 'education', label: 'Education', icon: <FaGraduationCap /> },
    { id: 'certs', label: 'Certificates', icon: <FaCertificate /> }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
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
                onClick={onAddExperience}
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
                    onClick={() => onDeleteExperience(exp.id)}
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
                      onClick={() => onAddExpBullet(expIdx)}
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
                        onClick={() => onOpenAiEnhancer('experience', expIdx, bulletIdx, bullet)}
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs shrink-0"
                        title="Enhance with AI"
                      >
                        <FaMagic />
                      </button>
                      <button
                        onClick={() => onDeleteExpBullet(expIdx, bulletIdx)}
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
                onClick={onAddProject}
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
                    onClick={() => onDeleteProject(proj.id)}
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
                      onClick={() => onAddProjBullet(projIdx)}
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
                        onClick={() => onOpenAiEnhancer('project', projIdx, bulletIdx, bullet)}
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs shrink-0"
                        title="Enhance with AI"
                      >
                        <FaMagic />
                      </button>
                      <button
                        onClick={() => onDeleteProjBullet(projIdx, bulletIdx)}
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
                onClick={onAddEducation}
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
                    onClick={() => onDeleteEducation(edu.id)}
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
                onClick={onAddCertification}
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
                    onClick={() => onDeleteCertification(cert.id)}
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
  );
};

export default ResumeFormEditor;