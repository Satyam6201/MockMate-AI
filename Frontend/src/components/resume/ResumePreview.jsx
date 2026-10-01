import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';

const ResumePreview = React.forwardRef(({
  resumeData,
  selectedTemplate,
  accentColor,
  fontFamily,
  fontSize
}, ref) => {
  return (
    <div className="resume-preview-wrapper bg-slate-200/80 p-4 sm:p-6 rounded-2xl border border-slate-300 shadow-inner flex justify-center overflow-x-auto">
      <div
        ref={ref}
        id="resume-print-area"
        className={`resume-print-target bg-white text-slate-900 shadow-xl border border-slate-200 rounded-xs w-full max-w-[800px] min-h-[1050px] p-8 sm:p-10 ${
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
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;