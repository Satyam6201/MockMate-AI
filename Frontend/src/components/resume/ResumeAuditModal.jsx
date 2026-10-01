import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FaTimes, FaExclamationTriangle, FaCheckCircle, 
  FaArrowRight, FaChartPie 
} from 'react-icons/fa';
import { BsShieldCheck } from 'react-icons/bs';

const ResumeAuditModal = ({
  isOpen,
  onClose,
  auditReport,
  onJumpToTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState('missing');
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      const timer = setTimeout(() => {
        setIsScanning(false);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !auditReport) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-800 space-y-4 my-8"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shadow-xs">
                <BsShieldCheck />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  ATS Resume Audit & Missing Items Report
                </h3>
                <p className="text-xs text-slate-500">
                  Comprehensive algorithmic audit for screening parser compliance
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              <FaTimes />
            </button>
          </div>

          {isScanning ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="w-12 h-12 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-bold text-slate-800 text-sm">Auditing Resume Structure & Content...</p>
              <p className="text-xs text-slate-500 max-w-sm">Checking contact completeness, action verb density, metrics, and technical keywords.</p>
            </div>
          ) : (
            <>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center">
                    <span className={`text-2xl font-black ${auditReport.gradeColor}`}>
                      {auditReport.overallScore}%
                    </span>
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      Score
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${auditReport.badgeBg} ${auditReport.gradeColor}`}>
                        Grade {auditReport.grade}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {auditReport.overallScore >= 85 ? "ATS Compliant" : auditReport.overallScore >= 70 ? "Fair Compatibility" : "Action Required"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {auditReport.verdict}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:border-l sm:border-slate-200 sm:pl-4 text-xs">
                  <div className="text-center px-2">
                    <p className="font-extrabold text-amber-700 text-base">{auditReport.missingItems.length}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Missing</p>
                  </div>
                  <div className="text-center px-2">
                    <p className="font-extrabold text-emerald-700 text-base">{auditReport.strengths.length}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Passed</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <button
                  onClick={() => setActiveSubTab('missing')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeSubTab === 'missing'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  <FaExclamationTriangle className="text-amber-600 text-xs" /> Missing Items ({auditReport.missingItems.length})
                </button>

                <button
                  onClick={() => setActiveSubTab('sections')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeSubTab === 'sections'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  <FaChartPie className="text-emerald-600 text-xs" /> Section Scores
                </button>

                <button
                  onClick={() => setActiveSubTab('strengths')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeSubTab === 'strengths'
                      ? 'bg-teal-100 text-teal-900 border border-teal-300'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  <FaCheckCircle className="text-teal-600 text-xs" /> Verified Strengths ({auditReport.strengths.length})
                </button>
              </div>

              <div className="max-h-[340px] overflow-y-auto space-y-2.5 pr-1">
                {activeSubTab === 'missing' && (
                  <>
                    {auditReport.missingItems.length === 0 ? (
                      <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-xl border border-emerald-200">
                        <FaCheckCircle className="text-emerald-600 text-2xl mx-auto" />
                        <p className="font-bold text-emerald-900 text-sm">No Missing Items Detected!</p>
                        <p className="text-xs text-emerald-700">Your resume contains all standard ATS sections, contact links, metrics, and technical keywords.</p>
                      </div>
                    ) : (
                      auditReport.missingItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                item.severity === 'critical'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : item.severity === 'high'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-slate-200 text-slate-700'
                              }`}>
                                {item.severity}
                              </span>
                              <strong className="text-slate-900 font-semibold">{item.field}</strong>
                            </div>
                            <p className="text-slate-600 leading-relaxed">{item.message}</p>
                          </div>

                          <button
                            onClick={() => {
                              onJumpToTab(item.tab);
                              onClose();
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-300 hover:border-emerald-300 rounded-lg font-bold text-xs shrink-0 transition"
                          >
                            Fix in Editor <FaArrowRight className="text-[10px]" />
                          </button>
                        </div>
                      ))
                    )}
                  </>
                )}

                {activeSubTab === 'sections' && (
                  <div className="space-y-3">
                    {auditReport.sections.map((sec, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">{sec.name}</span>
                          <span className="font-extrabold text-slate-700">
                            {sec.score} / {sec.max} pts ({sec.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${sec.percentage >= 80 ? 'bg-emerald-600' : sec.percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${sec.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSubTab === 'strengths' && (
                  <div className="space-y-2">
                    {auditReport.strengths.map((str, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900"
                      >
                        <FaCheckCircle className="text-emerald-600 shrink-0 text-sm" />
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
                >
                  Close & Continue Optimizing
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ResumeAuditModal;
