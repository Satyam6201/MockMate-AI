import { powerActionVerbs } from '../data/resumeData';

export const runAtsAudit = (resumeData) => {
  const missingItems = [];
  const strengths = [];

  const { personalInfo = {}, skills = {}, experience = [], projects = [], education = [], certifications = [] } = resumeData;

  let contactScore = 0;
  const contactMax = 20;

  if (personalInfo.fullName?.trim()) {
    contactScore += 5;
    strengths.push("Candidate name clearly defined");
  } else {
    missingItems.push({
      tab: 'personal',
      field: 'Full Name',
      severity: 'critical',
      message: "Missing full name in header."
    });
  }

  if (personalInfo.jobTitle?.trim()) {
    contactScore += 3;
    strengths.push("Target job title specified");
  } else {
    missingItems.push({
      tab: 'personal',
      field: 'Job Title',
      severity: 'high',
      message: "Missing targeted job title in header."
    });
  }

  if (personalInfo.email && personalInfo.email.includes('@')) {
    contactScore += 4;
  } else {
    missingItems.push({
      tab: 'personal',
      field: 'Email',
      severity: 'critical',
      message: "Valid email address is missing."
    });
  }

  if (personalInfo.phone?.trim()) {
    contactScore += 3;
  } else {
    missingItems.push({
      tab: 'personal',
      field: 'Phone',
      severity: 'high',
      message: "Phone number is missing."
    });
  }

  if (personalInfo.location?.trim()) {
    contactScore += 2;
  } else {
    missingItems.push({
      tab: 'personal',
      field: 'Location',
      severity: 'medium',
      message: "Location (City, State/Country) is missing."
    });
  }

  if (personalInfo.linkedin?.trim() || personalInfo.github?.trim()) {
    contactScore += 3;
    strengths.push("Professional profile URLs included");
  } else {
    missingItems.push({
      tab: 'personal',
      field: 'Social & Code Links',
      severity: 'medium',
      message: "Missing LinkedIn or GitHub profile link."
    });
  }

  if (personalInfo.summary && personalInfo.summary.trim().length >= 60) {
    strengths.push("Comprehensive professional summary provided");
  } else if (!personalInfo.summary || personalInfo.summary.trim().length === 0) {
    missingItems.push({
      tab: 'personal',
      field: 'Summary',
      severity: 'medium',
      message: "Professional summary is completely empty."
    });
  } else {
    missingItems.push({
      tab: 'personal',
      field: 'Summary',
      severity: 'low',
      message: "Professional summary is too short (recommend at least 60 characters)."
    });
  }

  let skillsScore = 0;
  const skillsMax = 20;
  const languagesList = (skills.languages || '').split(',').filter(s => s.trim().length > 0);
  const frameworksList = (skills.frameworks || '').split(',').filter(s => s.trim().length > 0);
  const databasesList = (skills.databases || '').split(',').filter(s => s.trim().length > 0);
  const toolsList = (skills.tools || '').split(',').filter(s => s.trim().length > 0);

  const totalSkillsCount = languagesList.length + frameworksList.length + databasesList.length + toolsList.length;

  if (totalSkillsCount >= 12) {
    skillsScore = 20;
    strengths.push(`Rich technical keyword density (${totalSkillsCount} total skills detected)`);
  } else if (totalSkillsCount >= 6) {
    skillsScore = 14;
    missingItems.push({
      tab: 'skills',
      field: 'Technical Skills',
      severity: 'medium',
      message: `Only ${totalSkillsCount} skills listed. Add 6+ more relevant industry keywords to improve ATS matching.`
    });
  } else {
    skillsScore = 6;
    missingItems.push({
      tab: 'skills',
      field: 'Technical Skills',
      severity: 'critical',
      message: "Skills section has very few keywords. Add core languages, frameworks, and developer tools."
    });
  }

  if (toolsList.length === 0) {
    missingItems.push({
      tab: 'skills',
      field: 'DevOps & Tools',
      severity: 'medium',
      message: "No DevOps or developer tools listed (e.g. Git, Docker, AWS, CI/CD)."
    });
  }

  let expScore = 0;
  const expMax = 35;
  let actionVerbCount = 0;
  let metricCount = 0;
  let totalBullets = 0;

  if (experience.length === 0) {
    missingItems.push({
      tab: 'experience',
      field: 'Work Experience',
      severity: 'critical',
      message: "No work experience or internships listed."
    });
    expScore = 5;
  } else {
    experience.forEach(exp => {
      if (!exp.bullets || exp.bullets.length === 0) {
        missingItems.push({
          tab: 'experience',
          field: `${exp.company || 'Experience'} Bullets`,
          severity: 'high',
          message: `Position at ${exp.company || 'Company'} has no achievement bullet points.`
        });
      } else {
        exp.bullets.forEach(bullet => {
          totalBullets++;
          const lower = bullet.toLowerCase();
          if (powerActionVerbs.some(verb => lower.includes(verb))) actionVerbCount++;
          if (/\d+%|\$\d+|\d+\+|\d+ms|\d+m|\d+k/i.test(bullet)) metricCount++;
        });
      }
    });

    if (totalBullets > 0) {
      const verbRatio = actionVerbCount / totalBullets;
      const metricRatio = metricCount / totalBullets;

      const verbPts = Math.min(20, Math.round(verbRatio * 20));
      const metricPts = Math.min(15, Math.round(metricRatio * 15));
      expScore = Math.max(10, verbPts + metricPts);

      if (metricRatio >= 0.4) {
        strengths.push(`Quantifiable metrics present in ${(metricRatio * 100).toFixed(0)}% of experience bullets`);
      } else {
        missingItems.push({
          tab: 'experience',
          field: 'Quantifiable Metrics',
          severity: 'high',
          message: "Experience bullets lack quantifiable metrics. Add numbers, percentages, or latency figures (e.g. 'boosted performance by 35%')."
        });
      }

      if (verbRatio >= 0.6) {
        strengths.push("Strong action verbs detected across experience accomplishments");
      } else {
        missingItems.push({
          tab: 'experience',
          field: 'Power Action Verbs',
          severity: 'medium',
          message: "Begin every bullet point with a high-impact verb (e.g., 'Architected', 'Engineered', 'Optimized')."
        });
      }
    }
  }

  let projScore = 0;
  const projMax = 15;

  if (projects.length >= 2) {
    projScore = 15;
    strengths.push("Multiple technical projects showcasing hands-on development");
  } else if (projects.length === 1) {
    projScore = 10;
    missingItems.push({
      tab: 'projects',
      field: 'Projects',
      severity: 'low',
      message: "Only 1 project listed. Adding a second technical project demonstrates broader engineering breadth."
    });
  } else {
    projScore = 4;
    missingItems.push({
      tab: 'projects',
      field: 'Projects',
      severity: 'high',
      message: "No technical projects listed. Add at least 1-2 featured projects."
    });
  }

  let eduScore = 0;
  const eduMax = 10;

  if (education.length > 0) {
    eduScore += 7;
    strengths.push("Educational background and degree verified");
  } else {
    missingItems.push({
      tab: 'education',
      field: 'Education',
      severity: 'high',
      message: "No educational institution or degree listed."
    });
  }

  if (certifications.length > 0) {
    eduScore += 3;
    strengths.push("Industry certifications included");
  } else {
    missingItems.push({
      tab: 'certs',
      field: 'Certifications',
      severity: 'low',
      message: "No certifications listed (optional, but recommended to showcase continuous learning)."
    });
  }

  const rawTotal = contactScore + skillsScore + expScore + projScore + eduScore;
  const overallScore = Math.min(100, Math.max(15, rawTotal));

  let grade = 'A';
  let gradeColor = 'text-emerald-700';
  let badgeBg = 'bg-emerald-50 border-emerald-200';
  let verdict = 'ATS Optimized • Highly Likely to Pass Screening';

  if (overallScore < 60) {
    grade = 'D';
    gradeColor = 'text-rose-700';
    badgeBg = 'bg-rose-50 border-rose-200';
    verdict = 'High Risk • Major Information Missing for ATS Parsers';
  } else if (overallScore < 75) {
    grade = 'C';
    gradeColor = 'text-amber-700';
    badgeBg = 'bg-amber-50 border-amber-200';
    verdict = 'Fair • Needs Quantitative Achievements & Keyword Additions';
  } else if (overallScore < 90) {
    grade = 'B+';
    gradeColor = 'text-teal-700';
    badgeBg = 'bg-teal-50 border-teal-200';
    verdict = 'Good • Strong Alignment with Minor Improvements';
  }

  const sections = [
    {
      name: 'Contact & Header',
      score: contactScore,
      max: contactMax,
      percentage: Math.round((contactScore / contactMax) * 100),
      tab: 'personal'
    },
    {
      name: 'Technical Skills',
      score: skillsScore,
      max: skillsMax,
      percentage: Math.round((skillsScore / skillsMax) * 100),
      tab: 'skills'
    },
    {
      name: 'Experience & Metrics',
      score: expScore,
      max: expMax,
      percentage: Math.round((expScore / expMax) * 100),
      tab: 'experience'
    },
    {
      name: 'Technical Projects',
      score: projScore,
      max: projMax,
      percentage: Math.round((projScore / projMax) * 100),
      tab: 'projects'
    },
    {
      name: 'Education & Certs',
      score: eduScore,
      max: eduMax,
      percentage: Math.round((eduScore / eduMax) * 100),
      tab: 'education'
    }
  ];

  return {
    overallScore,
    grade,
    gradeColor,
    badgeBg,
    verdict,
    sections,
    missingItems,
    strengths
  };
};
