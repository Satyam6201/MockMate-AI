<div align="center">

# MockMate AI: The Ultimate Enterprise SDE Interview & ATS Resume Platform

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-%2346E3B7.svg?style=for-the-badge&logo=render&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![OpenRouter](https://img.shields.io/badge/OpenRouter-000000?style=for-the-badge&logo=openai&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

<br />

[![Live Frontend](https://img.shields.io/badge/Frontend-https%3A%2F%2Fmock--mate--ai--flame.vercel.app-emerald?style=for-the-badge&logo=vercel)](https://mock-mate-ai-flame.vercel.app)
[![Live Backend](https://img.shields.io/badge/Backend-https%3A%2F%2Fmockmate--ai--se1m.onrender.com-blue?style=for-the-badge&logo=render)](https://mockmate-ai-se1m.onrender.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Satyam6201/MockMate-AI)

<br />

**A high-performance, distributed, and AI-powered interview preparation & ATS resume architect platform designed to help Software Engineering (SDE) candidates land offers at top-tier tech companies.**

</div>

---

## Table of Contents

1. [Executive Summary & Vision](#1-executive-summary--vision)
2. [How the Whole Website Works (End-to-End Architecture)](#2-how-the-whole-website-works-end-to-end-architecture)
3. [Key Platform Features](#3-key-platform-features)
4. [ATS Resume Builder & Audit Engine](#4-ats-resume-builder--audit-engine)
5. [Complete System Architecture Deep Dive](#5-complete-system-architecture-deep-dive)
6. [Database Schema & Data Modeling](#6-database-schema--data-modeling)
7. [Comprehensive API Documentation](#7-comprehensive-api-documentation)
8. [Folder & File Structure](#8-folder--file-structure)
9. [Step-by-Step Installation & Setup](#9-step-by-step-installation--setup)
10. [Environment Variables](#10-environment-variables)
11. [Author & License](#11-author--license)

---

## 1. Executive Summary & Vision

**MockMate AI** bridges the critical gap between solving algorithmic problems in isolation and succeeding in real-world, high-pressure technical interviews.

Traditional interview prep is either prohibitively expensive, unscalable, or relies on generic questionnaires. MockMate AI solves this with:
1. **Resume-Grounded RAG Mock Interviews**: Ingests candidate resumes, extracts core technologies, and conducts realistic voice-driven interviews with dynamic question branching.
2. **ATS-Optimized Resume Architect**: Builds recruiter-tested resumes with live ATS score calculation (0–100%), automated missing items detection, and AI bullet point enhancement.
3. **Distributed Enterprise Backend**: Architected with Node.js multi-core clustering, Redis distributed rate-limiting, MongoDB connection pooling, and WebSocket room broadcasting.

---

## 2. How the Whole Website Works (End-to-End Architecture)

The MockMate AI platform operates through 6 interconnected workflows:

```
+-----------------------------------------------------------------------------------+
|                                 USER CLIENT (REACT)                               |
+--------+----------------+----------------+----------------+----------------+------+
         |                |                |                |                |
         v                v                v                v                v
 [1. Authentication]  [2. AI Mock]   [3. ATS Resume]  [4. SDE Prep]   [5. AI Chatbot]
  Firebase OAuth     Voice / Proctor   Audit & Export   Study Tracks   Voice & Context
         |                |                |                |                |
+--------+----------------+----------------+----------------+----------------+------+
|                              BACKEND API & SERVICES                               |
|       Node.js Multi-Core Cluster • Redis Rate Limiter • OpenRouter LLM • Stripe    |
+--------+----------------+----------------+----------------+----------------+------+
         |                |                |                |                |
         v                v                v                v                v
   MongoDB Atlas    Vector Embeddings  Atomic Credits  Socket.IO Push   Stripe Webhooks
```

### Workflow 1: Authentication & Onboarding
1. User visits `/auth` and clicks **Continue with Google**.
2. **Firebase SDK** handles OAuth popup authentication securely.
3. Upon success, credentials are exchanged with the backend endpoint `/api/auth/google`.
4. The server creates or fetches the user account, assigns **100 Free Credits**, and returns an **HTTP-Only JWT Cookie**.
5. Redux store synchronizes user profile and live credit balance across all tabs.

### Workflow 2: AI Mock Interview Session
1. **Setup**: Candidate navigates to `/interview-page`, selects target role (e.g., SDE-2 Frontend / Backend / Fullstack), and optionally uploads a PDF resume.
2. **Resume Parsing (RAG)**: Backend parses the PDF using `pdfjs-dist`, chunks the content, and passes technical keywords to the OpenRouter LLM service.
3. **Live Voice Interaction**:
   - The AI delivers interview questions using Web Speech synthesis.
   - The candidate speaks into their microphone; speech is transcribed in real-time using `SpeechRecognition`.
4. **Anti-Cheat Proctoring**: The Page Visibility API monitors browser focus. If the candidate switches tabs, warnings are recorded in session logs.
5. **Instant Feedback Report**: At the end of the session, the system generates multi-dimensional scores for **Technical Correctness**, **Communication Clarity**, and **Confidence Level**, paired with actionable improvement roadmaps.

### Workflow 3: ATS Resume Builder & Diagnostic Audit
1. **Template Selection**: Candidate navigates to `/resume` and chooses a layout:
   - **Free Templates (0 Credits)**: *Harvard Classic* (academic/corporate serif) or *Minimalist Clean*.
   - **Pro Templates (50 Credits)**: *Modern Tech* or *Two-Column Sidebar*.
2. **Live ATS Scoring (0–100%)**: Evaluates contact info completeness, technical skill density, quantifiable metrics (`%`, `$`, `ms`), and action verbs in real-time.
3. **ATS Audit & Missing Items Detector**: Clicking **"Run ATS Audit"** runs an in-depth audit that checks section-by-section scores, letter grades, and itemizes missing fields (e.g., missing LinkedIn, short summary, low metric count) with one-click **"Fix in Editor"** triggers.
4. **AI Bullet Point Enhancer**: Rewrites plain duty descriptions into metric-driven accomplishment statements using `/api/resume/ai-enhance`.
5. **Print & Vector PDF Export**:
   - **Browser Print**: Optimized `@media print` stylesheets isolate `#resume-print-area`, hiding all web UI to produce a clean A4 printout.
   - **Download PDF**: Uses `html2canvas` with `onclone` A4 fixed-width capture (`794px`) and 2.5x high-DPI scaling with multi-page pagination.

### Workflow 4: SDE Preparation Hub
1. Users browse `/prepare` for curated study guides across **System Design (HLD/LLD)**, **DSA**, **Operating Systems**, **DBMS**, and **Computer Networks**.
2. Role-based roadmaps categorize concepts for SDE-1, SDE-2, and SDE-3 tiers.

### Workflow 5: AI Support Assistant & Chatbot
1. Available 24/7 via the floating widget on all pages.
2. Supports multimodal text and voice input (`webkitSpeechRecognition`).
3. Trained on the full MockMate AI platform features, architectural questions, ATS tips, and interview strategies.

### Workflow 6: Credits & Stripe Payments
1. Users top up credits on `/pricing` via Stripe Checkout.
2. Stripe Webhooks (`/api/payment/webhook`) verify transactions and atomically credit the user's MongoDB balance (`$inc: { credits: planCredits }`).
3. Real-time notifications update the balance instantly via Socket.IO.

---

## 3. Key Platform Features

* **RAG-Powered AI Interviews**: Semantic resume chunking + OpenRouter GPT-4o-mini integration.
* **Multimodal Speech Recognition**: Real-time voice answers transcribed directly in browser.
* **Proctoring Engine**: Tab-switch detection and anti-cheating tracking.
* **ATS Resume Architect**: 4 ATS-optimized templates, real-time score bar, and PDF generation.
* **Live ATS Audit Diagnostic**: Letter grades (*A+, A, B, C, D*) and detailed missing item fixes.
* **AI Bullet Enhancer**: High-impact metric phrasing generator for resume achievements.
* **Role-Specific SDE Hub**: 100+ System Design, LLD, DSA, and Core CS study materials.
* **AI Voice Chatbot**: Support assistant with speech-to-text input and markdown rendering.
* **Atomic Credit System**: Stripe checkout integration with instant balance synchronization.

---

## 4. ATS Resume Builder & Audit Engine

| Feature | Details |
| :--- | :--- |
| **Free Templates** | Harvard Classic & Minimalist (0 Credits) |
| **Pro Templates** | Modern Tech & Two-Column Sidebar (50 Credits) |
| **Live ATS Scoring** | 0–100% real-time score bar based on recruiter criteria |
| **Audit Diagnostics** | Categorizes missing fields (Critical, High, Medium, Low) |
| **One-Click Fixes** | Jumps directly to relevant form tab from the audit report |
| **AI Enhancer** | Generates 3 quantifiable alternatives for any draft bullet |
| **PDF Export** | Vector-sharp, unclipped A4 PDF with multi-page support |
| **Browser Print** | Isolated `@media print` styling on pure white A4 paper |

---

## 5. Complete System Architecture Deep Dive

```
+--------------------------------------------------------------------------+
|                             SYSTEM TOPOLOGY                              |
+--------------------------------------------------------------------------+

           Internet Clients (Desktop & Mobile)
                         |
                         v
                [Vercel CDN / Edge]
                 Frontend Application
                         |
                         | (REST APIs & WebSockets)
                         v
             [Render Cloud / Reverse Proxy]
                         |
    +--------------------+--------------------+
    |                    |                    |
    v                    v                    v
Node.js Worker 1    Node.js Worker 2    Node.js Worker 3
(Multi-Core Native Node Clustering Engine)
    |                    |                    |
    +--------------------+--------------------+
                         |
      +------------------+------------------+
      |                  |                  |
      v                  v                  v
 [MongoDB Atlas]    [Redis Cache]     [External APIs]
Connection Pooling  Rate Limiter &     • OpenRouter LLM
 (maxPoolSize: 200) Session Storage    • Stripe Payments
                                       • Firebase Auth
```

---

## 6. Database Schema & Data Modeling

### 1. User Model (`Backend/model/user.model.js`)
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  credits: { type: Number, default: 100 },
  interviewsTaken: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}
```

### 2. Resume Model (`Backend/model/resume.model.js`)
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeData: {
    personalInfo: { fullName, jobTitle, email, phone, location, linkedin, github, portfolio, summary },
    skills: { languages, frameworks, databases, tools },
    experience: [{ id, company, position, location, startDate, endDate, current, bullets: [String] }],
    projects: [{ id, title, techStack, link, github, bullets: [String] }],
    education: [{ id, institution, degree, fieldOfStudy, location, startDate, endDate, gpa }],
    certifications: [{ id, name, issuer, date }]
  },
  template: { type: String, default: 'modern' },
  isProTemplate: { type: Boolean, default: false },
  atsScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}
```

### 3. Interview Model (`Backend/model/interview.model.js`)
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  experienceLevel: { type: String, default: 'Mid-Level' },
  questions: [{
    questionText: String,
    userAnswer: String,
    score: Number,
    feedback: String
  }],
  overallScore: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 7. Comprehensive API Documentation

### Authentication Routes (`/api/auth`)
* `POST /api/auth/google` &mdash; Google OAuth sync and JWT cookie issuance.
* `POST /api/auth/signup` &mdash; Standard email/password registration.
* `POST /api/auth/login` &mdash; Standard credentials login.
* `POST /api/auth/logout` &mdash; Clear HTTP-Only authentication cookie.

### Resume Builder Routes (`/api/resume`)
* `POST /api/resume/build` &mdash; Save resume build and atomically deduct 50 credits if using a Pro template (`modern`, `compact`). Free templates (`executive`, `clean`) cost 0 credits.
* `POST /api/resume/ai-enhance` &mdash; Generates 3 action-verb, metric-driven bullet points using OpenRouter AI.
* `GET /api/resume/my-resumes` &mdash; Fetch all saved resumes for the authenticated user.

### Interview Routes (`/api/interview`)
* `POST /api/interview/create` &mdash; Initialize a new role-based mock interview session.
* `POST /api/interview/submit-answer` &mdash; Evaluate candidate answer in real-time with AI scoring.
* `GET /api/interview/get-interview` &mdash; Fetch user's completed interview history and reports.

### Chatbot Routes (`/api/chatbot`)
* `POST /api/chatbot/ask` &mdash; Ask the context-aware support bot about platform features, resume tips, or system design.

### Payment Routes (`/api/payment`)
* `POST /api/payment/checkout` &mdash; Create a Stripe Checkout session for credit packs.
* `POST /api/payment/webhook` &mdash; Stripe webhook handler for automated credit fulfillment.

---

## 8. Folder & File Structure

```
MockMate-AI/
├── Backend/
│   ├── config/
│   │   └── db.js                    # MongoDB Atlas connection pooling
│   ├── controllers/
│   │   ├── auth.controller.js       # Google OAuth & session management
│   │   ├── chatbot.controller.js    # AI Support Bot controller & prompts
│   │   ├── interview.controller.js  # RAG Interview pipeline & scoring
│   │   ├── payment.controller.js    # Stripe Checkout & webhook handlers
│   │   ├── resume.controller.js     # Resume build, credit checks & AI enhancer
│   │   └── user.controller.js       # User profile & credit retrieval
│   ├── middleware/
│   │   └── auth.middleware.js       # JWT cookie verification middleware
│   ├── model/
│   │   ├── interview.model.js       # Mock interview session schema
│   │   ├── resume.model.js          # ATS resume document schema
│   │   └── user.model.js            # User profile and credits schema
│   ├── router/
│   │   ├── auth.route.js            # /api/auth routes
│   │   ├── chatbot.route.js         # /api/chatbot routes
│   │   ├── interview.router.js      # /api/interview routes
│   │   ├── payment.route.js         # /api/payment routes
│   │   ├── resume.route.js          # /api/resume routes
│   │   └── user.route.js            # /api/user routes
│   ├── services/
│   │   └── openRouter.services.js   # OpenRouter LLM integration
│   ├── app.js                       # Express app configuration & middlewares
│   ├── index.js                     # Node.js multi-core cluster launcher
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── assets/                  # Brand assets, illustrations, icons
│   │   ├── components/
│   │   │   ├── resume/
│   │   │   │   ├── ResumeAiModal.jsx       # AI Bullet Enhancer modal
│   │   │   │   ├── ResumeAuditModal.jsx    # Missing Items & ATS Audit modal
│   │   │   │   ├── ResumeCreditModal.jsx   # Pro credit check & Free switch modal
│   │   │   │   ├── ResumeFormEditor.jsx    # Tabbed resume form editor
│   │   │   │   ├── ResumeHeader.jsx        # Top action bar with sample/export triggers
│   │   │   │   ├── ResumePreview.jsx       # Printable/downloadable A4 resume layout
│   │   │   │   ├── ResumeScoreCard.jsx     # Live ATS score tracker & audit button
│   │   │   │   └── ResumeStyleControls.jsx # Template, typography & color selector
│   │   │   ├── AuthModel.jsx        # Auth modal overlay
│   │   │   ├── Chatbot.jsx          # Floating AI Support Bot (Voice + Text)
│   │   │   ├── Footer.jsx           # Responsive site footer
│   │   │   ├── Navbar.jsx           # Global navigation header
│   │   │   ├── Step1SetUp.jsx       # Interview setup step
│   │   │   ├── Step2Interview.jsx   # Live interview speech recognition
│   │   │   └── Step3Report.jsx      # Performance score report
│   │   ├── data/
│   │   │   └── resumeData.js        # Sample resumes, action verbs, template tiers
│   │   ├── pages/
│   │   │   ├── Auth.jsx             # Clean Google OAuth login/signup page
│   │   │   ├── Blog.jsx             # Tech interview blogs
│   │   │   ├── Contact.jsx          # Support contact form
│   │   │   ├── Docs.jsx             # Comprehensive platform documentation
│   │   │   ├── Home.jsx             # Landing page with interactive hero
│   │   │   ├── InterviewHistory.jsx # Past interview records and analytics
│   │   │   ├── NotFound.jsx         # 404 error page
│   │   │   ├── Preparation.jsx      # SDE preparation hub (HLD, LLD, DSA)
│   │   │   ├── Pricing.jsx          # Credit packs and Stripe checkout
│   │   │   ├── PrivacyPolicy.jsx    # Privacy policy & data protection
│   │   │   └── ResumeBuilder.jsx    # ATS Resume Builder orchestrator page
│   │   ├── redux/
│   │   │   ├── store.js             # Redux toolkit store
│   │   │   └── userSlice.js         # User state & credit store slice
│   │   ├── utils/
│   │   │   ├── atsAudit.js          # Algorithmic ATS score & missing items engine
│   │   │   └── firebase.js          # Firebase Auth configuration
│   │   ├── App.jsx                  # Main router and route definitions
│   │   ├── index.css                # Global Tailwind CSS + @media print styles
│   │   └── main.jsx                 # React root render entry
│   └── package.json
│
├── README.md
└── package.json
```

---

## 9. Step-by-Step Installation & Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **MongoDB**: Local MongoDB instance or MongoDB Atlas connection string
* **Redis**: Local Redis server or cloud Redis instance (Upstash / Redis Labs)
* **OpenRouter API Key**: For LLM intelligence
* **Firebase Project**: For Google OAuth

### 1. Clone the Repository
```bash
git clone https://github.com/Satyam6201/MockMate-AI.git
cd MockMate-AI
```

### 2. Backend Installation & Setup
```bash
cd Backend
npm install
cp .env.example .env
```
Fill in your `.env` variables, then start the backend server:
```bash
# Development mode
npm run dev

# Production cluster mode
npm start
```

### 3. Frontend Installation & Setup
```bash
cd ../Frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 10. Environment Variables

### Backend `.env`
```env
PORT=8080
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mockmate
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
OPENROUTER_API_KEY=your_openrouter_api_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
REDIS_URL=redis://localhost:6379
```

### Frontend `.env`
```env
VITE_SERVER_URL=http://localhost:8080
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 11. Author & License

Developed with passion by **[Satyam](https://github.com/Satyam6201)**.

Distributed under the **MIT License**. See `LICENSE` for more information.
