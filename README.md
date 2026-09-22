<div align="center">

# 🚀 MockMate AI: Enterprise SDE Interview Platform

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

**An highly scalable, AI-powered mock interview platform designed to help Software Engineering (SDE) candidates prepare for high-stakes technical interviews.**

</div>

---

## 📌 Overview

**MockMate AI** simulates a real-world technical interview experience. Users can upload their resumes, and the AI (powered by a Retrieval-Augmented Generation / RAG pipeline) generates highly personalized, hallucination-resistant interview questions. 

Beyond standard mock interviews, this application features a dedicated **SDE Preparation Hub** filled with Senior-level architecture questions, strict **Anti-Cheat Proctoring**, and an **Enterprise-Grade Distributed Backend** designed to handle millions of concurrent users.

---

## ✨ Features

* **🧠 AI-Powered RAG Interviews**: Upload your PDF resume. The system extracts the text, chunks it, stores vector embeddings, and grounds the OpenAI GPT models in your actual experience to generate relevant questions and evaluate your answers.
* **📚 SDE Preparation Hub**: A fully interactive library containing 100+ meticulously categorized technical questions (HLD, LLD, OS, CN, DBMS, DSA) filtered by role level (SDE-1, SDE-2, SDE-3) with animated, drop-down answer reveals.
* **🛡️ Anti-Cheat Proctoring**: Utilizes the Page Visibility API to detect tab-switching and enforce strict exam environments during the mock interview.
* **💳 Secure Payments**: Fully integrated with Stripe Checkout for premium credit purchases.
* **⚡ Blazing Fast UI**: Built with React, Tailwind CSS, and Framer Motion for buttery-smooth stagger animations. Code-split using `React.lazy()` for instant initial load times.

---

## 🏗️ How This Website Works (Enterprise Architecture)

This application is built using advanced **System Design** principles to ensure it is secure, highly available, and horizontally scalable.

### 1. The Gateway Layer (Nginx & Docker)
All incoming web traffic hits an **Nginx Reverse Proxy**. Nginx acts as an API gateway and Load Balancer. Running inside a **Docker Compose** network, Nginx uses a `least_conn` routing algorithm to dynamically distribute traffic across multiple isolated Backend container replicas.

### 2. The Compute Cluster (Node.js & Express)
The backend isn't just a standard Node.js server. It utilizes the native Node.js `cluster` module to fork a worker process for every CPU core available on the host machine. 
* *Why?* Standard Node.js is single-threaded. By clustering, if a machine has 8 CPU cores, we run 8 simultaneous Express servers that share the same port, multiplying our throughput by 8x and providing zero-downtime self-healing if a worker crashes.

### 3. Distributed State & Rate Limiting (Redis)
To protect the server from DDoS attacks and brute-force logins, the backend enforces strict rate limits. Because our backend is clustered across multiple CPU cores (and Docker containers), local memory rate-limiting would fail. Instead, all rate limits are synchronized globally in microseconds using an external **Redis** instance.

### 4. The Data Layer (MongoDB Atlas)
User data, interview history, and vector embeddings are stored in MongoDB. The backend initiates a robust **Connection Pool** (`maxPoolSize: 200`, `minPoolSize: 20`) to safely queue and handle massive traffic spikes without establishing thousands of expensive individual TCP connections and crashing the database daemon.

### 5. Enterprise Security Hardening
The API is strictly fortified using:
* **Helmet.js**: Injects crucial HTTP headers to protect against Cross-Site Scripting (XSS), Sniffing, and Clickjacking.
* **Express Mongo Sanitize**: Actively intercepts incoming JSON payloads and strips out malicious MongoDB operators (like `$` and `.`), preventing dangerous NoSQL Injection attacks.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js (Vite), TailwindCSS, Framer Motion, Redux Toolkit, React Router (Lazy Loaded), Recharts, jsPDF |
| **Backend** | Node.js (Cluster Module), Express.js, MongoDB (Mongoose), JWT, Multer |
| **Caching & Security** | Redis, Express-Rate-Limit, Helmet.js, Express-Mongo-Sanitize |
| **AI / RAG** | OpenAI GPT Models, `text-embedding-3-small`, FAISS (vector store), pdf-parse |
| **DevOps & QA** | Docker, Docker Compose, Nginx, GitHub Actions (CI/CD), Jest & Supertest (Unit Testing), k6 (Load Testing) |

---

## ⚙️ Getting Started (Local Development)

The entire distributed architecture can be run locally using Docker Compose.

### 1. Prerequisites
* **Docker & Docker Compose** installed on your machine.
* A `.env` file inside the `Backend/` directory populated with your credentials:
  ```env
  PORT=8080
  MONGODB_URL=your_mongodb_url
  JWT_SECRET=your_jwt_secret
  OPENAI_API_KEY=your_openai_key
  STRIPE_SECRET_KEY=your_stripe_secret
  ```

### 2. Launching the Cluster
Clone the repository and run the Docker build command. This will spin up Redis, the Nginx Load Balancer, the Frontend, and 3 replicated Backend Node clusters.
```bash
git clone https://github.com/Satyam6201/mockmate-ai.git
cd mockmate-ai
docker-compose up -d --build
```
Navigate to `http://localhost:3000` to view the application!

### 3. Automated Testing
This project embraces Test-Driven Development (TDD) and CI/CD validation. 

**Run Unit Tests (Jest & Supertest):**
```bash
cd Backend
npm run test
```

**Run Automated Load Tests (k6):**
```bash
k6 run load-test.js
```

---

## 🧪 CI/CD Pipeline
Code quality is strictly enforced via **GitHub Actions**. Upon every Pull Request, a cloud Ubuntu runner is provisioned to install dependencies, run security audits, and verify Docker compilation to ensure no broken code is ever merged into the `main` branch.

---

## 👤 Author
**Satyam Kumar Mishra**  
Full Stack MERN Developer  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/satyam-kumar-mishra-dev)

## 📄 License
This project is developed for learning, portfolio purposes, and open-source contributions. Feel free to use and improve it!