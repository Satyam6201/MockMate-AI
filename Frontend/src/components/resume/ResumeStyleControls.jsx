import React from 'react';
import { BsSliders } from 'react-icons/bs';
import { FaCoins, FaCrown, FaCheckCircle } from 'react-icons/fa';
import { colorOptions } from '../../data/resumeData';

const ResumeStyleControls = ({
  selectedTemplate,
  setSelectedTemplate,
  accentColor,
  setAccentColor,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  userCredits,
  onProSelect
}) => {
  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
          <BsSliders className="text-emerald-600" /> Template & Style Configuration
        </h3>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs">
          <FaCoins className="text-amber-500" />
          <span className="text-slate-600 font-medium">Credits:</span>
          <span className="font-bold text-slate-900">{userCredits}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'modern', name: 'Modern Tech', isPro: true },
          { id: 'executive', name: 'Harvard Classic', isPro: false },
          { id: 'compact', name: 'Two-Column', isPro: true },
          { id: 'clean', name: 'Minimalist', isPro: false }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedTemplate(t.id);
              if (t.isPro && userCredits < 50 && onProSelect) {
                onProSelect(t.name);
              }
            }}
            className={`p-2.5 rounded-xl border text-xs font-bold transition text-center flex flex-col items-center justify-center gap-1.5 relative ${
              selectedTemplate === t.id
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="font-semibold text-xs">{t.name}</span>
            <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
              t.isPro 
                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              {t.isPro ? <FaCrown className="text-[9px]" /> : <FaCheckCircle className="text-[9px]" />}
              {t.isPro ? 'Pro (50)' : 'Free (0)'}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-600 font-medium">Accent Color:</span>
        <div className="flex items-center gap-2">
          {colorOptions.map(c => (
            <button
              key={c.hex}
              onClick={() => setAccentColor(c.hex)}
              style={{ backgroundColor: c.hex }}
              className={`w-5 h-5 rounded-full transition-transform ${accentColor === c.hex ? 'ring-2 ring-emerald-600 ring-offset-2 scale-110' : 'hover:scale-105 opacity-80'}`}
              title={c.name}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
        <div>
          <label className="text-xs text-slate-600 font-medium block mb-1">Typography:</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
          >
            <option value="sans">Inter (Modern Sans)</option>
            <option value="serif">Merriweather (Executive Serif)</option>
            <option value="mono">JetBrains (Technical Mono)</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-600 font-medium block mb-1">Spacing Density:</label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
          >
            <option value="compact">Compact (Fit 1 Page)</option>
            <option value="normal">Standard (Balanced)</option>
            <option value="spacious">Spacious (Relaxed)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ResumeStyleControls;