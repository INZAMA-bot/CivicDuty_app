import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode, GovCodeData } from '../types';
import { GOV_CODES, resolveTitle, tiersFor } from '../data/tiers';
import { COUNTRIES, getDept } from '../data/countries';
import { CountrySelector } from '../components/CountrySelector';
import { getCountryDesksProfile } from '../data/countryDesks';
import { getMinistriesForCountry, MinistrySector } from '../data/countryMinistries';
import {
  ChevronLeft,
  Shield,
  Radio,
  Landmark,
  ArrowRight,
  Handshake,
  MessageSquare,
  Sparkles,
  Lock,
} from 'lucide-react';
import { NoteBox } from '../components/NoteBox';

export const GovLoginView: React.FC = () => {
  const {
    go,
    execGovLoginByData,
    projects,
    setActiveProject,
    toast,
    selectedCountry,
    setSelectedCountry,
    setSelectedMinistryId,
    customGovCodes,
  } = useApp();

  const isSuperadminCode = (inputCode: string): boolean => {
    const c = inputCode.trim().toUpperCase();
    return (
      c === 'PS-MOLG-2026' ||
      c === 'PS-MOLG-ROLLOUT' ||
      c.includes('MOLG') ||
      c.includes('SUPERADMIN') ||
      c.includes('MINALOC') ||
      c.includes('TAMISEMI') ||
      c.includes('COGTA') ||
      c.includes('LOCALGOV') ||
      c.includes('DEVOLUTION') ||
      c === 'PS-KE-INTERIOR-2026'
    );
  };

  const resolvePsMinistryId = (inputCode: string, countryCode?: string): string | null => {
    const c = inputCode.trim().toUpperCase();
    if (isSuperadminCode(c)) return null;

    const cCode = (countryCode || activeCountry || 'UG').toUpperCase();
    const countryLineMinistries = getMinistriesForCountry(cCode).filter(
      (m) => !m.isSuperadmin && m.sector !== 'GOVERNANCE'
    );

    // Direct match against known line ministry ID or code
    const directMatch = countryLineMinistries.find(
      (m) => m.id.toUpperCase() === c || m.code.toUpperCase() === c
    );
    if (directMatch) return directMatch.id;

    // Sector keyword mapping
    let matchedSector: MinistrySector | null = null;
    if (c.includes('MOFPED') || c.includes('FINANCE') || c.includes('TREASURY') || c.includes('FISCAL') || c.includes('MINECOFIN')) {
      matchedSector = 'FISCAL';
    } else if (c.includes('MOWT') || c.includes('WORKS') || c.includes('ROADS') || c.includes('TRANSPORT') || c.includes('INFRA')) {
      matchedSector = 'INFRASTRUCTURE';
    } else if (c.includes('MOH') || c.includes('HEALTH') || c.includes('MEDICAL')) {
      matchedSector = 'HEALTH';
    } else if (c.includes('MOES') || c.includes('EDUCATION') || c.includes('EDU') || c.includes('SPORTS')) {
      matchedSector = 'EDUCATION';
    } else if (c.includes('MOWE') || c.includes('WATER') || c.includes('ENVIRONMENT')) {
      matchedSector = 'WATER_ENVIRONMENT';
    } else if (c.includes('MOICT') || c.includes('ICT') || c.includes('DIGITAL') || c.includes('TECH')) {
      matchedSector = 'ICT_DIGITAL';
    } else if (c.includes('OPM') || c.includes('CABINET') || c.includes('PRESIDENCY')) {
      matchedSector = 'CABINET_DELIVERY';
    }

    if (matchedSector) {
      const sectorMin = countryLineMinistries.find((m) => m.sector === matchedSector);
      if (sectorMin) return sectorMin.id;
    }

    if (c.startsWith('PS-') && countryLineMinistries.length > 0) {
      return countryLineMinistries[0].id;
    }

    return null;
  };

  const [step, setStep] = useState<'code' | 'email' | 'otp'>('code');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [preview, setPreview] = useState<GovCodeData | null>(null);

  const activeCountry = selectedCountry || 'UG';
  const profile = getCountryDesksProfile(activeCountry);

  const stepN = step === 'code' ? 0 : step === 'email' ? 1 : 2;

  // Auto-detect and pre-authenticate when ?gov_code=... is passed in URL
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlGovCode = params.get('gov_code');
      if (urlGovCode) {
        const cleanCode = urlGovCode.trim().toUpperCase();
        setCode(cleanCode);
        const data = customGovCodes[cleanCode] || GOV_CODES[cleanCode];
        if (data) {
          execGovLoginByData(data);
          if (isSuperadminCode(cleanCode)) {
            toast(`Territorial Superadmin Desk mounted (${data.officer_name || data.real_title_short || 'Sovereign Administrator'}).`, 'emerald');
            go('ps_molg_rollout');
          } else {
            const psId = resolvePsMinistryId(cleanCode, data.country);
            if (psId) {
              if (data.country) setSelectedCountry(data.country);
              setSelectedMinistryId(psId);
              toast(`Mounted Apex Executive Desk: ${data.real_title_short || data.role_label || cleanCode}`, 'emerald');
              go('ps_executive_desk');
            } else if (cleanCode === 'CD-CORP-9999') {
              go('company_management');
            } else {
              go('gov_admin');
            }
          }
        }
      }
    } catch {}
  }, []);

  const handleNext = () => {
    if (step === 'code') {
      const cleanCode = code.trim().toUpperCase();
      let data = customGovCodes[cleanCode] || GOV_CODES[cleanCode];

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
        if (cleanCode === 'CD-CORP-9999') {
          toast('Company & Tenant Management access granted.', 'amber');
          go('company_management');
          return;
        }
        if (isSuperadminCode(cleanCode)) {
          toast(`Territorial Superadmin Desk mounted (${preview.officer_name || 'Superadmin'}).`, 'emerald');
          go('ps_molg_rollout');
          return;
        }
        const psId = resolvePsMinistryId(cleanCode, preview.country);
        if (psId) {
          if (preview.country) setSelectedCountry(preview.country);
          setSelectedMinistryId(psId);
          toast(`Mounted Apex Executive Desk: ${preview?.real_title_short || preview?.role_label || cleanCode}`, 'emerald');
          go('ps_executive_desk');
          return;
        }

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
        <h2 className="text-[26px] font-black text-teal-700 dark:text-teal-400 tracking-tight leading-tight">
          Government &amp; Regulator Desk
        </h2>
        <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
          Invite-only statutory access for State, Ministries, Accounting Officers, Local Authorities &amp; Regulators. 1 Account = 1 Desk. Every action is audited and permanent.
        </p>
      </div>

      {/* Global Country Jurisdiction Selector */}
      {step === 'code' && (
        <CountrySelector
          value={activeCountry}
          onChange={(c) => {
            setSelectedCountry(c);
            toast(`Jurisdiction switched to ${COUNTRIES[c]?.name || c}. Governance structure & desks updated.`, 'emerald');
          }}
          variant="card"
          label="Active National Jurisdiction"
        />
      )}

      {/* PARTNER WITH CIVICDUTY CALL-TO-PARTNERSHIP & LIVE BILATERAL FEEDBACK BANNER */}
      {step === 'code' && (
        <div
          onClick={() => go('gov_partnership')}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 border border-teal-500/40 hover:border-teal-400 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group shadow-md transition-all"
          title="Open Sovereign Partnership & Bilateral Operations Feedback Loop"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0 group-hover:scale-105 transition-transform shadow-inner">
              <Handshake size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black mono uppercase tracking-wider text-white flex items-center gap-1.5">
                  Partner with CivicDuty
                </span>
                <span className="text-[7.5px] mono px-2 py-0.5 rounded-full font-bold bg-teal-500/30 text-teal-200 border border-teal-400/40 uppercase">
                  Sovereign Accord &amp; Feedback Loop
                </span>
              </div>
              <p className="text-[10px] text-teal-100/80 mt-0.5 leading-snug">
                Sovereign MoUs, *3030# USSD infrastructure, and live bilateral feedback loop between national ministries and CivicDuty Platform Operations (CD-Ops).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-500 group-hover:bg-teal-400 text-slate-950 font-black text-[10px] mono uppercase transition-colors shrink-0 self-start sm:self-auto shadow-xs">
            <span>Explore Accord</span>
            <ArrowRight size={12} />
          </div>
        </div>
      )}

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
          placeholder={profile.samplePlaceholder}
          className="mono tracking-widest text-teal-700 dark:text-teal-300 text-sm font-bold"
          style={{ opacity: step !== 'code' ? 0.6 : 1 }}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
        {preview && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 a-fade">
            <p className="text-[8px] mono text-slate-500 uppercase tracking-widest font-bold">
              {preview.entity_type === 'non_government_entity' ? '🏢 You are mounting an Entity Desk' : '🏛️ You are mounting a Government Desk'}
            </p>
            <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100">
              {preview.organization_name || (prevTitle ? `${prevTitle.short} — ${prevTitle.role_label}` : preview.role_label || code)}
            </p>
            {preview.officer_name && (
              <p className="text-[11px] font-semibold text-teal-700 dark:text-teal-300">
                👤 {preview.officer_name}
              </p>
            )}
            <p className="text-[10px] mono text-slate-600 dark:text-slate-400">
              {prevDept?.name || preview.dept} · {preview.role} · {COUNTRIES[preview.country]?.flag} {COUNTRIES[preview.country]?.name}
              {preview.entity_category && ` · ${preview.entity_category.replace('_', ' ').toUpperCase()}`}
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

          <p className="text-[9px] mono text-amber-800 dark:text-amber-400 font-bold uppercase tracking-widest pt-1">
            Browse All National Codes — {COUNTRIES[activeCountry]?.name || activeCountry}
          </p>
          <div className="flex flex-wrap gap-1 pb-1">
            {(['UG', 'KE', 'NG', 'GH', 'RW', 'TZ', 'ZA', 'ET', 'EG', 'SN', 'ZM', 'ZW', 'US', 'GB', 'IN'] as CountryCode[]).map((c) => (
              <button
                key={c}
                onClick={() => {
                  setSelectedCountry(c);
                  toast(`Switched view to ${COUNTRIES[c]?.name || c}`, 'emerald');
                }}
                className={`px-2 py-1 rounded-lg text-[8.5px] mono font-bold border transition-all ${
                  activeCountry === c
                    ? 'border-teal-500 bg-teal-500 text-white shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {COUNTRIES[c]?.flag} {c}
              </button>
            ))}
          </div>
          <p className="text-[8px] mono text-slate-600 dark:text-slate-400 leading-relaxed">
            {COUNTRIES[activeCountry]?.name}: {tiersFor(activeCountry).filter((t) => t.depth > 0).map((t) => t.unit).join(' › ')}
          </p>

          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {(Object.entries({ ...GOV_CODES, ...customGovCodes }) as [string, GovCodeData][])
              .filter(([, data]) => data.country === activeCountry)
              .map(([cCode, data], idx) => {
                const t = resolveTitle(data.scope, data.country, data.is_utility);
                const titleLabel = data.real_title_short || t.short;
                return (
                  <div key={`${cCode}-${idx}`} className="flex items-center justify-between gap-2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900">
                    <button
                      onClick={() => setCode(cCode)}
                      className="text-left text-[9.5px] mono text-teal-700 dark:text-teal-300 hover:underline flex-1 truncate font-bold"
                    >
                      {cCode} <span className="text-slate-500 font-normal">— {titleLabel}, {getDept(data.country, data.dept).name}</span>
                    </button>
                    <button
                      onClick={() => {
                        setCode(cCode);
                        execGovLoginByData(data);
                        if (isSuperadminCode(cCode)) {
                          toast(`Territorial Superadmin Desk mounted (${data.officer_name || titleLabel}).`, 'emerald');
                          go('ps_molg_rollout');
                          return;
                        }
                        const psId = resolvePsMinistryId(cCode, data.country);
                        if (psId) {
                          if (data.country) setSelectedCountry(data.country);
                          setSelectedMinistryId(psId);
                          toast(`Mounted Apex Executive Desk: ${titleLabel}`, 'emerald');
                          go('ps_executive_desk');
                          return;
                        }
                        if (cCode === 'CD-CORP-9999') {
                          go('company_management');
                          return;
                        }
                        go('gov_admin');
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

      <div className="pt-2 text-center">
        <button
          onClick={() => go('gov_partnership')}
          className="inline-flex items-center gap-1.5 text-[11px] mono text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-bold hover:underline"
        >
          <Handshake size={14} />
          <span>New Sovereign Jurisdiction? Partner with CivicDuty &amp; Open Bilateral Desk →</span>
        </button>
      </div>
    </div>
  );
};
