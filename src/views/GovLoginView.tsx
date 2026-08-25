import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode, GovCodeData } from '../types';
import { GOV_CODES, resolveTitle, tiersFor } from '../data/tiers';
import { COUNTRIES, getDept } from '../data/countries';
import { ChevronLeft } from 'lucide-react';
import { NoteBox } from '../components/NoteBox';

export const GovLoginView: React.FC = () => {
  const { go, execGovLoginByData, projects, setActiveProject, toast } = useApp();

  const [step, setStep] = useState<'code' | 'email' | 'otp'>('code');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [preview, setPreview] = useState<GovCodeData | null>(null);
  const [demoCountry, setDemoCountry] = useState<CountryCode>('UG');

  const stepN = step === 'code' ? 0 : step === 'email' ? 1 : 2;

  const handleNext = () => {
    if (step === 'code') {
      const cleanCode = code.trim().toUpperCase();
      let data = GOV_CODES[cleanCode];

      // Support contractor project codes like PRJ-PERF-KPV89826
      const matchingProj =
        projects.find((p) => p.code.toUpperCase() === cleanCode) ||
        (cleanCode.startsWith('PRJ-') ? projects[0] : null);

      if (!data && matchingProj) {
        data = {
          country: matchingProj.country || 'UG',
          dept: matchingProj.dept || 'kcca',
          scope: matchingProj.units[0] || 'nakawa',
          role: 'spokesperson',
          is_utility: true,
        };
      }

      if (!data) {
        toast('Invalid code. Contact your Node Admin.', 'red');
        return;
      }
      setPreview(data);
      setStep('email');
      return;
    }

    if (step === 'email') {
      if (!email.trim()) {
        toast('Enter your official email', 'red');
        return;
      }
      setStep('otp');
      toast('Verification code sent', 'amber');
      return;
    }

    if (step === 'otp') {
      if (otp.trim().length < 4) {
        toast('Enter the verification code', 'red');
        return;
      }
      if (preview) {
        execGovLoginByData(preview);
        const cleanCode = code.trim().toUpperCase();
        const matchedP = projects.find((p) => p.code.toUpperCase() === cleanCode || cleanCode.startsWith('PRJ-'));
        if (matchedP || cleanCode.startsWith('PRJ-')) {
          const targetProj = matchedP || projects[0];
          setActiveProject(targetProj);
          toast(`Contractor Desk mounted for ${targetProj.code}! Public Contractor Wall active.`, 'emerald');
          go('project');
          return;
        }
      }
    }
  };

  const prevDept = preview ? getDept(preview.country, preview.dept) : null;
  const prevTitle = preview ? resolveTitle(preview.scope, preview.country, preview.is_utility) : null;

  return (
    <div className="p-5 space-y-5 pt-6 animate-fade-in text-slate-800 dark:text-slate-100">
      <div>
        <button
          onClick={() => go('splash')}
          className="flex items-center gap-1 text-[10px] mono text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 mb-4 transition-colors font-bold"
        >
          <ChevronLeft size={14} /> Back
        </button>
        <div className="tagline mb-1.5 font-bold" style={{ color: '#0d9488' }}>
          Government Desk
        </div>
        <h2 className="text-[26px] font-black text-teal-700 dark:text-teal-400 tracking-tight leading-tight">Secure Access</h2>
        <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
          Invite-only. 1 Account = 1 Desk. Every action is audited and permanent.
        </p>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center gap-2">
        {['Code', 'Email', 'Verify'].map((l, i) => (
          <div key={l} className={`flex items-center gap-2 ${i < 2 ? 'flex-1' : ''}`}>
            <div
              className={`step-dot ${
                i < stepN ? 'step-done' : i === stepN ? 'step-on' : 'step-off'
              }`}
            >
              {i < stepN ? '✓' : i + 1}
            </div>
            <span
              className={`text-[8px] mono uppercase tracking-widest ${
                i === stepN ? 'text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-400 dark:text-slate-500 font-medium'
              }`}
            >
              {l}
            </span>
            {i < 2 && <div className={`flex-1 h-px ${i < stepN ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>}
          </div>
        ))}
      </div>

      {/* Code Card */}
      <div className="card-gov p-4 space-y-3" style={{ borderRadius: '16px' }}>
        <label className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-bold">Access Code</label>
        <input
          type="text"
          value={code}
          disabled={step !== 'code'}
          placeholder="XX-DEPT-0000"
          className="mono tracking-widest text-teal-700 dark:text-teal-300 text-sm font-bold"
          style={{ opacity: step !== 'code' ? 0.6 : 1 }}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
        {preview && prevDept && prevTitle && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 a-fade">
            <p className="text-[8px] mono text-slate-500 uppercase tracking-widest font-bold">You are about to mount</p>
            <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100">
              {prevTitle.short} — {prevTitle.role_label}
            </p>
            <p className="text-[10px] mono text-slate-600 dark:text-slate-400">
              {prevDept.name} · {preview.role} · {COUNTRIES[preview.country]?.flag} {COUNTRIES[preview.country]?.name}
            </p>
          </div>
        )}
      </div>

      {/* Email Card */}
      {step !== 'code' && (
        <div className="card-gov p-4 space-y-3 a-fade" style={{ borderRadius: '16px' }}>
          <label className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-bold">Official Email</label>
          <input
            type="email"
            value={email}
            disabled={step !== 'email'}
            placeholder="name@ministry.go.ug"
            className="mono text-sm"
            style={{ opacity: step !== 'email' ? 0.6 : 1 }}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-[8px] mono text-slate-500 leading-relaxed">
            A one-time code is sent to this address. It becomes the permanent login for this desk.
          </p>
        </div>
      )}

      {/* OTP Card */}
      {step === 'otp' && (
        <div className="card-gov p-4 space-y-3 a-fade" style={{ borderRadius: '16px' }}>
          <label className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-bold">Verification Code</label>
          <input
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="000000"
            className="mono tracking-widest text-sm font-bold"
          />
          <p className="text-[8px] mono text-slate-500">Walkthrough: any six digits will do.</p>
        </div>
      )}

      <button
        onClick={handleNext}
        className="w-full bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-black rounded-2xl py-4 text-sm uppercase tracking-widest mono transition-all active:scale-[.98] shadow-sm"
      >
        {step === 'code' ? 'Verify Code →' : step === 'email' ? 'Send Verification Code →' : 'Mount Desk →'}
      </button>

      {/* Interactive Walkthrough Demo Codes */}
      {step === 'code' && (
        <div className="note-amber space-y-2.5">
          {/* Featured Contractor Code Direct Access */}
          <div className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-amber-400/60 dark:border-amber-500/40 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] mono text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                🚧 Contractor Wall Access Link (PRJ-PERF-KPV89826)
              </span>
              <span className="text-[8px] mono bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-300 dark:border-amber-500/30">
                Contractor Desk
              </span>
            </div>
            <p className="text-[9.5px] text-slate-700 dark:text-slate-300 leading-snug">
              Access the created contractor wall using code <strong className="text-amber-800 dark:text-amber-300 font-mono">PRJ-PERF-KPV89826</strong> (KPV Construction & Engineering Ltd).
            </p>
            <button
              onClick={() => {
                setCode('PRJ-PERF-KPV89826');
                const perfProj = projects.find((p) => p.code === 'PRJ-PERF-KPV89826') || projects[0];
                execGovLoginByData({
                  country: perfProj.country || 'UG',
                  dept: perfProj.dept || 'kcca',
                  scope: perfProj.units[0] || 'nakawa',
                  role: 'spokesperson',
                  is_utility: true,
                });
                if (perfProj) setActiveProject(perfProj);
                toast('Mounted Contractor Desk for PRJ-PERF-KPV89826!', 'emerald');
                go('project');
              }}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 dark:from-amber-500 dark:to-amber-600 dark:hover:from-amber-400 dark:hover:to-amber-500 text-white dark:text-slate-950 font-black py-2 rounded-lg text-[10px] mono uppercase tracking-wider transition-all shadow-sm active:scale-[0.98]"
            >
              ⚡ Mount Contractor Desk & Open Public Contractor Wall
            </button>
          </div>

          <p className="text-[9px] mono text-amber-800 dark:text-amber-400 font-bold uppercase tracking-widest pt-1">Government Desk codes — tap to fill</p>
          <div className="grid grid-cols-5 gap-1.5 pb-1">
            {(Object.keys(COUNTRIES) as CountryCode[]).map((c) => (
              <button
                key={c}
                onClick={() => setDemoCountry(c)}
                className={`py-1.5 rounded-lg text-[8px] mono font-bold border transition-all ${
                  demoCountry === c
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-500/10 text-teal-800 dark:text-teal-300'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <p className="text-[8px] mono text-slate-600 dark:text-slate-400 leading-relaxed">
            {COUNTRIES[demoCountry]?.name}: {tiersFor(demoCountry).filter((t) => t.depth > 0).map((t) => t.unit).join(' › ')}
          </p>

          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {Object.entries(GOV_CODES)
              .filter(([, data]) => data.country === demoCountry)
              .map(([cCode, data]) => {
                const t = resolveTitle(data.scope, data.country, data.is_utility);
                return (
                  <div key={cCode} className="flex items-center justify-between gap-2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900">
                    <button
                      onClick={() => setCode(cCode)}
                      className="text-left text-[9.5px] mono text-teal-700 dark:text-teal-300 hover:underline flex-1 truncate font-bold"
                    >
                      {cCode} <span className="text-slate-500 font-normal">— {t.short}, {getDept(data.country, data.dept).name}</span>
                    </button>
                    <button
                      onClick={() => {
                        setCode(cCode);
                        execGovLoginByData(data);
                      }}
                      className="px-2 py-0.5 bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-500/30 border border-teal-300 dark:border-teal-500/40 rounded text-[8px] mono font-bold whitespace-nowrap"
                    >
                      ⚡ Quick Mount
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <NoteBox
        tone="amber"
        title="Invite-Only Protocol"
        text="Access codes are issued by your Node Admin and expire if unused. Every action taken from this desk is permanently audit-logged."
      />
    </div>
  );
};
