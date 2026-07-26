import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const faqData = [
  {
    category: "General",
    questions: [
      { q: "How do I start my first interview?", a: "Once logged in, navigate to your Dashboard. Click the 'New Session' button, select your target role (e.g., Frontend Developer), and our AI will begin the calibration process." },
      { q: "Is MockMate AI free to use?", a: "We offer a 'Starter' tier with 3 free mock interviews per month. For unlimited sessions and deep-dive technical feedback, check out our Pro plans." },
    ]
  },
  {
    category: "Technical",
    questions: [
      { q: "Which programming languages are supported?", a: "Our AI currently supports real-time code execution and analysis for JavaScript, Python, Java, C++, and Go." },
      { q: "Can I use a mock interview for System Design?", a: "Yes! Select the 'System Design' track to get a digital whiteboard and architecture-specific questioning." },
    ]
  },
  {
    category: "Account & Privacy",
    questions: [
      { q: "How do I reset my performance data?", a: "Navigate to Settings > Privacy. You can choose to 'Clear History' which wipes all past interview transcripts and scores." },
      { q: "Is my video recording stored?", a: "By default, recordings are deleted after feedback generation. You can toggle 'Save for Review' in your profile if you want to watch yourself back later." },
    ]
  }
];

const Help = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const filteredFaqs = faqData.map(cat => ({
    ...cat,
    questions: cat.questions.filter(f => 
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
         <button onClick={() => navigate("/")}
                className='mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
                <FaArrowLeft className='text-gray-600'/>
              </button>
        <motion.div 
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-green-600 mb-4">
            How can we help?
          </h1>

          <motion.div 
            whileFocus={{ scale: 1.02 }}
            className="relative max-w-xl mx-auto"
          >
            <input 
              type="text"
              placeholder="Search features, questions..."
              className="w-full pl-12 pr-4 py-4 bg-white shadow-xl rounded-2xl 
              focus:ring-2 focus:ring-green-500 outline-none transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-4 top-4 text-gray-400 text-xl">🔍</span>
          </motion.div>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="grid md:grid-cols-3 gap-5 mb-12"
        >
          {[
            { title: "Getting Started", icon: "🚀" },
            { title: "Video Tutorials", icon: "🎬" },
            { title: "Billing & Plans", icon: "💳" }
          ].map((card, i) => (
            <motion.div 
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl bg-white shadow-md hover:shadow-2xl 
              transition-all cursor-pointer border border-gray-100"
            >
              <div className="text-3xl mb-2">{card.icon}</div>
              <h3 className="font-bold text-gray-800">{card.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Explore guides and documentation.
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((category, catIdx) => (
              <div key={catIdx}>
                <div className="bg-gray-50 px-6 py-3 text-xs font-bold uppercase text-gray-400">
                  {category.category}
                </div>

                {category.questions.map((faq, faqIdx) => {
                  const key = `${catIdx}-${faqIdx}`;
                  const isOpen = openIndex === key;

                  return (
                    <div key={faqIdx} className="border-b">
                      <button 
                        onClick={() => setOpenIndex(isOpen ? null : key)}
                        className="w-full flex justify-between px-6 py-5 hover:bg-gray-50"
                      >
                        <span className="font-semibold">{faq.q}</span>

                        <motion.span 
                          animate={{ rotate: isOpen ? 180 : 0 }}
                        >
                          ▼
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="px-6 pb-6 text-gray-500 text-sm">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-gray-400">
              No results found
            </div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 text-center bg-gradient-to-r from-green-600 to-green-500 
          rounded-3xl p-10 text-white shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-2">Still stuck?</h2>
          <p className="mb-6 opacity-90">
            Our support team responds fast 🚀
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="bg-white text-green-600 px-8 py-3 rounded-xl font-bold"
            >
              Live Chat
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="bg-green-500 border border-white px-8 py-3 rounded-xl font-bold"
            >
              Email Support
            </motion.button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Help;