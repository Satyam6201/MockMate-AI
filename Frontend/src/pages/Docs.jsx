import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Docs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Introduction");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const menuItems = [
    { id: "Introduction", icon: "🚀" },
    { id: "Features", icon: "✨" },
    { id: "Workflow", icon: "⚙️" },
    { id: "Architecture", icon: "🏗️" },
    { id: "FAQ", icon: "❓" },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans relative overflow-hidden">
     
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 z-50 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1 }}
      />

      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-indigo-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-purple-100 rounded-full blur-3xl opacity-40"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-6 py-12">
        
        <aside className="md:w-64 flex-shrink-0">
          
          <div className="sticky top-12 space-y-3">
            <button onClick={() => navigate("/")}
              className='mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
              <FaArrowLeft className='text-gray-600'/>
            </button>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 px-4">
              Documentation
            </h3>
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? "bg-white shadow-lg text-indigo-600 border border-slate-100"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium text-sm">{item.id}</span>
              </motion.button>
            ))}
          </div>
        </aside>

        <main className="flex-1 bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === "Introduction" && <IntroductionSection />}
              {activeTab === "Features" && <FeaturesSection />}
              {activeTab === "Workflow" && <WorkflowSection />}
              {activeTab === "Architecture" && <ArchitectureSection />}
              {activeTab === "FAQ" && <FAQSection />}
            </motion.div>
          </AnimatePresence>

          <Footer />
        </main>
      </div>
    </div>
  );
};

const IntroductionSection = () => (
  <section>
    <motion.span 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-indigo-600 font-bold text-sm tracking-widest uppercase"
    >
      Getting Started
    </motion.span>

    <motion.h1 
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="text-4xl font-extrabold mt-2 mb-6"
    >
      MockMate AI Documentation
    </motion.h1>

    <p className="text-lg text-slate-600 leading-relaxed mb-6">
      MockMate AI is an advanced AI-powered interview simulator built to help developers practice realistically and improve confidence.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        {
          title: "Target Audience",
          text: "Developers, engineers, and students preparing for interviews."
        },
        {
          title: "Core Tech",
          text: "React, Node.js, AI APIs, and real-time evaluation engines."
        }
      ].map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.03 }}
          className="p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm"
        >
          <h4 className="font-bold mb-1">{item.title}</h4>
          <p className="text-sm text-slate-500">{item.text}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

const FeaturesSection = () => {
  const features = [
    { title: "Dynamic Questioning", desc: "AI adapts questions in real-time." },
    { title: "Voice Analysis", desc: "Tracks confidence and clarity." },
    { title: "Technical Sandbox", desc: "Practice coding live." },
    { title: "HR Simulation", desc: "Behavioral interview evaluation." }
  ];

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">Platform Capabilities</h2>
      <div className="grid gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ x: 10, scale: 1.02 }}
            className="flex gap-4 p-5 rounded-xl bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 shadow-sm"
          >
            <div className="text-2xl">⚡</div>
            <div>
              <h3 className="font-bold">{f.title}</h3>
              <p className="text-slate-500 text-sm">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const WorkflowSection = () => (
  <section>
    <h2 className="text-3xl font-bold mb-6">User Journey</h2>

    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-300 before:to-transparent">
      {[
        { step: "01", title: "Start Interview", text: "Choose role and experience." },
        { step: "02", title: "Answer Questions", text: "AI conducts real interview." },
        { step: "03", title: "Get Feedback", text: "Detailed analysis and scoring." }
      ].map((item, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.02 }}
          className="relative pl-12"
        >
          <span className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold shadow-md">
            {item.step}
          </span>
          <h3 className="text-xl font-bold">{item.title}</h3>
          <p className="text-slate-500">{item.text}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

const ArchitectureSection = () => (
  <section className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg">
    <h2 className="text-2xl font-bold mb-4">System Architecture</h2>

    <div className="space-y-4 font-mono text-xs">
      {[
        "Frontend: React.js + Framer Motion",
        "Backend: Node.js + Express",
        "Database: MongoDB",
        "AI Engine: OpenRouter / GPT APIs"
      ].map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.03 }}
          className="p-3 border border-slate-700 rounded bg-slate-800/50"
        >
          {item}
        </motion.div>
      ))}
    </div>
  </section>
);

const FAQSection = () => {
  const [open, setOpen] = useState(0);

  const faqs = [
    { q: "Is my data safe?", a: "Yes, your data is secure and private." },
    { q: "Which languages supported?", a: "Currently English supported." },
    { q: "Mobile support?", a: "Fully responsive on mobile devices." }
  ];

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">FAQ</h2>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            layout
            className="border rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full text-left p-4 font-bold flex justify-between bg-slate-50"
            >
              {faq.q}
              <span>{open === i ? "−" : "+"}</span>
            </button>

            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="p-4 text-slate-500 text-sm border-t"
                >
                  {faq.a}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Docs;