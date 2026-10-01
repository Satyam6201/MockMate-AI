export const FREE_TEMPLATES = ['executive', 'clean'];
export const PRO_TEMPLATES = ['modern', 'compact'];

export const colorOptions = [
  { name: "Emerald Tech", hex: "#059669" },
  { name: "Deep Slate", hex: "#334155" },
  { name: "Classic Navy", hex: "#1d4ed8" },
  { name: "Cyber Teal", hex: "#0f766e" },
  { name: "Royal Purple", hex: "#7c3aed" },
  { name: "Crimson Red", hex: "#be123c" }
];

export const powerActionVerbs = [
  "architected", "engineered", "spearheaded", "optimized", "built", "implemented",
  "developed", "automated", "designed", "scaled", "delivered", "reduced",
  "accelerated", "led", "enhanced", "streamlined", "deployed", "integrated", "orchestrated"
];

export const sampleResumes = {
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