import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { FaCrown, FaGift, FaCheckCircle, FaCoins } from 'react-icons/fa';

const ResumeCreditModal = ({
  showCreditModal,
  setShowCreditModal,
  userCredits,
  onSelectFreeTemplate
}) => {
  return (
    <AnimatePresence>
      {showCreditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white border border-slate-200 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4 text-center relative overflow-hidden"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 text-2xl shadow-xs">
              <FaCrown />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Pro Template Requires 50 Credits
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                You currently have <strong className="text-amber-700 font-bold">{userCredits} Credits</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 text-left space-y-2">
              <div className="flex items-start gap-2">
                <FaGift className="text-emerald-600 text-sm shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  You can build and export our ATS-compliant <strong>Harvard Classic</strong> and <strong>Minimalist</strong> templates 100% Free (0 Credits).
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => onSelectFreeTemplate('executive')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-xs"
              >
                <FaCheckCircle /> Use Free Harvard Classic (0 Credits)
              </button>

              <button
                onClick={() => onSelectFreeTemplate('clean')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 border border-slate-200"
              >
                <FaCheckCircle /> Use Free Minimalist Clean (0 Credits)
              </button>

              <Link
                to="/pricing"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-xs block"
              >
                <FaCoins /> Get More Credits on Pricing
              </Link>

              <button
                onClick={() => setShowCreditModal(false)}
                className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold transition"
              >
                Close & Continue Editing
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResumeCreditModal;