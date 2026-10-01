import React from 'react';
import { motion } from 'motion/react';
import { BsShieldCheck } from 'react-icons/bs';
import { FaLightbulb, FaCheckCircle } from 'react-icons/fa';

const ResumeScoreCard = ({ atsScoreData }) => {
  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <BsShieldCheck className="text-emerald-600 text-lg" />
          <h3 className="font-bold text-sm text-slate-900">ATS Compatibility Score</h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
          <span className={`text-base font-extrabold ${atsScoreData.score >= 85 ? 'text-emerald-700' : atsScoreData.score >= 70 ? 'text-amber-700' : 'text-rose-700'}`}>
            {atsScoreData.score}%
          </span>
          <span className="text-[10px] text-emerald-800 font-semibold">Ready</span>
        </div>
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${atsScoreData.score}%` }}
          transition={{ duration: 0.6 }}
          className={`h-full rounded-full ${atsScoreData.score >= 85 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : atsScoreData.score >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
        />
      </div>

      {atsScoreData.feedback.length > 0 ? (
        <div className="space-y-1.5">
          {atsScoreData.feedback.slice(0, 2).map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <FaLightbulb className="text-amber-500 text-xs shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
          <FaCheckCircle className="text-emerald-600 shrink-0" />
          <span>Excellent! Your resume fulfills high ATS compliance criteria.</span>
        </div>
      )}
    </div>
  );
};

export default ResumeScoreCard;
