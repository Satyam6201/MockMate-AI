import React, { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const sections = [
    {
      id: 1,
      title: "Introduction",
      content:
        "Welcome to MockMate AI. We are committed to protecting your personal data and your right to privacy. This policy outlines how we handle information generated during your AI-powered interview simulations."
    },
    {
      id: 2,
      title: "Information We Collect",
      list: [
        "Personal Identifiers: Name, email address, and LinkedIn profile.",
        "Biometric Data: Voice snippets and video frames for analysis.",
        "Technical Metadata: IP, browser, session duration.",
        "Interview Transcripts: AI-generated responses."
      ]
    },
    {
      id: 3,
      title: "How We Use Your Data",
      content:
        "Your data is used to generate your interview reports and improve AI quality using anonymized inputs.",
      note:
        "We never use personal videos or voice data without your explicit permission."
    },
    {
      id: 4,
      title: "Data Retention & Deletion",
      content:
        "Data is stored for 30 days for tracking progress. You can delete it anytime from dashboard."
    },
    {
      id: 5,
      title: "Third-Party Processing",
      content:
        "We use secure APIs like OpenAI and Google Cloud with strict privacy compliance."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-800 relative overflow-hidden">
     
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-green-500 z-50 origin-left"
        style={{ scaleX }}
      />

      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-green-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-emerald-100 rounded-full blur-3xl opacity-40"></div>

      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col lg:flex-row gap-12">
        
        <aside className="lg:w-1/3">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            className="sticky top-24 bg-white backdrop-blur-md p-8 rounded-3xl border border-green-100 shadow-lg"
          >
              <button onClick={() => navigate("/")}
              className='mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
              <FaArrowLeft className='text-gray-600'/>
            </button>
            <h3 className="text-green-700 font-bold text-lg mb-4 flex items-center gap-2">
               Privacy Highlights
            </h3>

            <ul className="space-y-4 text-sm text-slate-600">
              {[
                "No selling of personal data",
                "End-to-end encryption",
                "GDPR & CCPA compliant",
                "One-click account deletion"
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="text-green-500 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <hr className="my-6" />

            <p className="text-xs text-green-600 italic">
              We respect your privacy and keep your data safe.
            </p>
          </motion.div>
        
        </aside>

        <main className="lg:w-2/3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black mb-2 text-slate-900">
              Privacy Policy
            </h1>

            <p className="text-slate-400 text-sm mb-12">
              Effective Date: March 2026 • Version 2.4
            </p>

            <div className="space-y-12">
              {sections.map((section) => (
                <motion.section
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.01 }}
                  className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">
                      0{section.id}
                    </span>

                    <h2 className="text-xl font-bold group-hover:text-green-600 transition">
                      {section.title}
                    </h2>
                  </div>

                  {section.content && (
                    <p className="text-slate-600 leading-relaxed mb-4">
                      {section.content}
                    </p>
                  )}

                  {section.list && (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {section.list.map((item, i) => (
                        <motion.li
                          key={i}
                          whileHover={{ scale: 1.03 }}
                          className="flex items-start gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-xl border"
                        >
                          <span className="text-green-500">•</span>
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  )}

                  {section.note && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-amber-50 border-l-4 border-amber-400 p-4 text-sm text-amber-800 rounded-r-xl"
                    >
                      <strong>Note:</strong> {section.note}
                    </motion.div>
                  )}
                </motion.section>
              ))}
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mt-16 bg-gradient-to-br from-slate-900 to-black rounded-3xl p-10 text-white shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-4">
                Contact Privacy Team
              </h2>

              <p className="text-slate-400 mb-6 leading-relaxed">
                If you have any concerns or requests regarding your data, our team is here to help you anytime.
              </p>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
                    Email
                  </p>
                  <p className="font-mono text-green-400">
                    privacy@mockmate.ai
                  </p>
                </div>

                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
                    Support
                  </p>
                  <p className="text-sm">
                    Available 24/7 via dashboard support
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;