import React from 'react';
import { FaFileAlt, FaPrint, FaDownload, FaSearch } from 'react-icons/fa';

const ResumeHeader = ({
  onLoadSample,
  activeView,
  setActiveView,
  onPrint,
  onDownloadPdf,
  onOpenAudit,
  isExporting
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 sm:px-8 py-3.5 sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <FaFileAlt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                ATS Resume Builder
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                ATS Optimized
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Recruiter-vetted templates designed to pass automated applicant screening systems
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs">
            <button
              onClick={() => onLoadSample('sde2')}
              className="px-2.5 py-1 rounded-lg hover:bg-white hover:shadow-xs text-slate-700 font-medium transition"
            >
              Senior SDE
            </button>
            <button
              onClick={() => onLoadSample('fresher')}
              className="px-2.5 py-1 rounded-lg hover:bg-white hover:shadow-xs text-slate-700 font-medium transition"
            >
              Fresher SDE
            </button>
          </div>

          <div className="hidden lg:flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveView('split')}
              className={`px-3 py-1 rounded-lg font-medium transition ${activeView === 'split' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Split View
            </button>
            <button
              onClick={() => setActiveView('editor')}
              className={`px-3 py-1 rounded-lg font-medium transition ${activeView === 'editor' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Editor Only
            </button>
            <button
              onClick={() => setActiveView('preview')}
              className={`px-3 py-1 rounded-lg font-medium transition ${activeView === 'preview' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Preview Only
            </button>
          </div>

          <button
            onClick={onOpenAudit}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition shadow-xs"
          >
            <FaSearch className="text-emerald-700" /> ATS Audit
          </button>

          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition shadow-xs"
          >
            <FaPrint className="text-slate-500" /> Print
          </button>

          <button
            onClick={onDownloadPdf}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <FaDownload className="text-xs" />
            {isExporting ? "Exporting..." : "Download PDF"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default ResumeHeader;
