import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaMagic, FaTimes } from 'react-icons/fa';

const ResumeAiModal = ({
  showAiModal,
  setShowAiModal,
  rawBulletInput,
  setRawBulletInput,
  generateAiBulletPoints,
  isGeneratingAi,
  aiSuggestions,
  onApplyAiSuggestion
}) => {
  return (
    <AnimatePresence>
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-slate-200 w-full max-w-xl p-6 rounded-2xl shadow-2xl space-y-4 text-left"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <FaMagic />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">AI Bullet Point Enhancer</h3>
                  <p className="text-xs text-slate-500">Transform basic duties into high-impact ATS metric statements</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm p-1"
              >
                <FaTimes />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Your Draft Bullet Point:</label>
              <textarea
                rows={2}
                value={rawBulletInput}
                onChange={(e) => setRawBulletInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                placeholder="e.g. Worked on the backend APIs and helped speed up the database."
              />
            </div>

            <button
              onClick={generateAiBulletPoints}
              disabled={isGeneratingAi}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition disabled:opacity-50"
            >
              {isGeneratingAi ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaMagic />
              )}
              {isGeneratingAi ? "Generating Metric-Driven Bullet Points..." : "Generate 3 High-Impact Alternatives"}
            </button>

            {aiSuggestions.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  Select an optimized ATS version:
                </label>
                {aiSuggestions.map((sugg, idx) => (
                  <div
                    key={idx}
                    onClick={() => onApplyAiSuggestion(sugg)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 cursor-pointer transition text-xs text-slate-800 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="flex-1 leading-relaxed">{sugg}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResumeAiModal;
