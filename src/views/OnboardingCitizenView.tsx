import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode, Department } from '../types';
import { COUNTRIES, allDepts } from '../data/countries';
import { primaryNodes } from '../data/tiers';
import {
  ChevronLeft,
  Search,
  Check,
  ShieldCheck,
  Fingerprint,
  BadgeCheck,
  Lock,
  MapPin,
  Layers,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { DeptIcon } from '../components/DeptIcon';

export const OnboardingCitizenView: React.FC = () => {
  const {
    view,
    go,
    user,
    setUser,
    toast,
    profiles,
    setProfiles,
    ensureCitizenSession,
    openLegalCenter,
  } = useApp();

  // Onboarding Mode: New Citizen Sign Up (3-Step) vs Returning Citizen Login (1-Step)
  const [citizenAuthMode, setCitizenAuthMode] = useState<'signup' | 'login'>('signup');
  const [acceptedCharter, setAcceptedCharter] = useState<boolean>(true);
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginCountry, setLoginCountry] = useState<CountryCode>(user?.country || 'UG');

  // Onboarding Step 1 State
  const [idType, setIdType] = useState<'nid' | 'passport'>('nid');
  const [idVal, setIdVal] = useState('');
  const [country, setCountry] = useState<CountryCode | ''>(user?.country || 'UG');
  const [phone, setPhone] = useState('');

  // Onboarding Step 2 (Home) State
  const [homeSearch, setHomeSearch] = useState('');
  const [chosenHome, setChosenHome] = useState<{ id: string; name: string; path: string } | null>(null);

  // Onboarding Step 3 (Walls) State
  const [followedDepts, setFollowedDepts] = useState<string[]>([]);
  const [deptSearch, setDeptSearch] = useState('');

  const detectCountry = (v: string): CountryCode | '' => {
    const val = v.trim().toUpperCase();
    if (/^CM\d/.test(val) || /^UG/.test(val)) return 'UG';
    if (/^GHA/.test(val)) return 'GH';
    if (/^\d{8}$/.test(val)) return 'KE';
    if (/^\d{11}$/.test(val)) return 'NG';
    if (/^1[\s\d]/.test(val)) return 'RW';
    return '';
  };

  const handleIDInput = (val: string) => {
    setIdVal(val);
    const detected = detectCountry(val);
    if (detected) {
      setCountry(detected);
    }
  };

  const handleOb1Next = () => {
    if (!acceptedCharter) {
      toast('Please accept the Sovereign Privacy Charter & Terms of Use to continue.', 'amber');
      return;
    }
    let activeId = idVal.trim();
    let activeCountry = country;
    if (!activeId) {
      activeId = 'CM9028491';
      setIdVal(activeId);
    }
    if (!activeCountry) {
      activeCountry = 'UG';
      setCountry('UG');
    }
    go('ob_home');
  };

  const handleReturningCitizenLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = loginIdentifier.trim().toUpperCase() || 'CM9028491';
    const detected = detectCountry(raw) || loginCountry || 'UG';
    const uid = 'usr-' + raw.replace(/[^A-Z0-9]/g, '').slice(-5) + '-' + detected;
    const existingProfile = profiles[uid];

    const defaultFollowed =
      detected === 'KE'
        ? ['ke-kplc', 'ke-ncwsc', 'ke-kura']
        : detected === 'NG'
        ? ['ng-ikeja', 'ng-lawma', 'ng-ferma']
        : ['ug-unra', 'ug-nwsc', 'ug-umeme', 'ug-kcca'];

    const activeProfile = existingProfile || {
      id: uid,
      country: detected,
      id_frag: raw.slice(-4) || '9028',
      display_name: user?.name || `Citizen #${raw.slice(-4) || '9028'}`,
      phone: raw.startsWith('+') ? raw : undefined,
      civic_score: 50,
      rank: 'Observer',
      followed: defaultFollowed,
      posts: 2,
      resolved: 1,
      corruption_reports: 0,
      upvotes_received: 14,
    };

    if (!existingProfile) {
      setProfiles((prev) => ({ ...prev, [uid]: activeProfile }));
    }

    setUser({
      id: uid,
      role: 'citizen',
      country: detected,
      nodeTag: COUNTRIES[detected]?.node || 'NODE_01',
      followed: activeProfile.followed || defaultFollowed,
      name: activeProfile.display_name,
    });

    toast(`Welcome back, ${activeProfile.display_name} · Mounted ${COUNTRIES[detected]?.name} Feed`, 'emerald');
    go('feed');
  };

  const handleFinishOnboarding = () => {
    let deptsToFollow = [...followedDepts];
    if (deptsToFollow.length < 3) {
      toast('Minimum 3 walls required — auto-added top local authorities', 'amber');
      deptsToFollow = Array.from(new Set([...deptsToFollow, 'ug-unra', 'ug-nwsc', 'ug-umeme']));
      setFollowedDepts(deptsToFollow);
    }

    const activeCountry = country || 'UG';
    const cleanId = idVal.trim() || 'CM9028491';
    const uid = 'usr-' + cleanId.slice(-5) + '-' + activeCountry;

    const newProfile = {
      id: uid,
      country: activeCountry,
      id_frag: cleanId.slice(-4) || '9999',
      display_name: 'Citizen ' + cleanId.slice(0, 4).toUpperCase(),
      phone,
      civic_score: 50,
      rank: 'Observer',
      followed: deptsToFollow,
      posts: 0,
      resolved: 0,
      corruption_reports: 0,
      upvotes_received: 0,
    };

    setProfiles((prev) => ({ ...prev, [uid]: newProfile }));

    setUser({
      id: uid,
      role: 'citizen',
      country: activeCountry,
      nodeTag: COUNTRIES[activeCountry]?.node || 'NODE_01',
      followed: deptsToFollow,
      name: newProfile.display_name,
    });

    toast('Identity verified · Welcome to CivicDuty', 'emerald');
    go('feed');
  };

  const toggleDept = (deptId: string) => {
    if (followedDepts.includes(deptId)) {
      setFollowedDepts(followedDepts.filter((id) => id !== deptId));
    } else {
      setFollowedDepts([...followedDepts, deptId]);
    }
  };

  // STEP 1: Verify Identity
  if (view === 'ob1') {
    return (
      <div className="px-3.5 sm:px-5 pt-4 pb-16 animate-fade-in max-w-lg mx-auto text-slate-900 dark:text-slate-100">
        <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl overflow-hidden">
          {/* Top Studio Header Bar */}
          <div className="px-4 py-3 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex items-center justify-between gap-2">
            <button
              onClick={() => go('splash')}
              className="flex items-center gap-1 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>Portal</span>
            </button>

            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                1 / 3 · Identity
              </span>
              <span>·</span>
              <span>2 · Parish</span>
              <span>·</span>
              <span>3 · Walls</span>
            </div>

            <button
              onClick={() => {
                ensureCitizenSession();
                go('feed');
              }}
              className="text-[10.5px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-lg hover:bg-emerald-500/20 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Skip</span>
              <ArrowRight size={11} strokeWidth={1.75} />
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                <Fingerprint size={12} />
                <span>
                  {citizenAuthMode === 'signup'
                    ? 'New Citizen Onboarding · Step 1 of 3'
                    : 'Returning Citizen Sign In · 1-Step Instant Mount'}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {citizenAuthMode === 'signup' ? 'Verify Citizen Identity' : 'Returning Citizen Sign In'}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {citizenAuthMode === 'signup'
                  ? '1 Verified ID = 1 Authentic Voice. Zero-knowledge SHA-256 validation routes your voice directly to your parish & municipal council.'
                  : 'Resume your saved citizen session in one tap or enter your National ID / Phone to jump straight to your Live Feed.'}
              </p>

              {/* 2-Tab Mode Switcher */}
              <div className="grid grid-cols-2 gap-1.5 p-1 mt-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
                <button
                  type="button"
                  onClick={() => setCitizenAuthMode('signup')}
                  className={`py-2 px-3 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer ${
                    citizenAuthMode === 'signup'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  New Sign Up (3 Steps)
                </button>
                <button
                  type="button"
                  onClick={() => setCitizenAuthMode('login')}
                  className={`py-2 px-3 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer ${
                    citizenAuthMode === 'login'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Returning Login (1-Step)
                </button>
              </div>
            </div>

            {citizenAuthMode === 'login' ? (
              <div className="space-y-3.5 animate-fade-in">
                {/* 1-Click Resume Saved Device Session Card */}
                {user && (
                  <div className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-emerald-500/30 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                          {user.country || 'UG'}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            Saved Session: {user.name || 'Verified Citizen Observer'}
                          </div>
                          <div className="text-[10.5px] font-mono text-emerald-700 dark:text-emerald-400 truncate">
                            {COUNTRIES[user.country]?.name} · {(user.followed || []).length} Monitored Desks
                          </div>
                        </div>
                      </div>
                      <span className="text-[9.5px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shrink-0">
                        Active
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        ensureCitizenSession();
                        toast(`Resumed session as ${user.name || 'Verified Citizen'}`, 'emerald');
                        go('feed');
                      }}
                      className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Resume Saved Session → Live Feed</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}

                {/* 1-Step NIN / Phone Direct Login Form */}
                <form
                  onSubmit={handleReturningCitizenLogin}
                  className="p-3.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-3"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Sign In with National ID or Mobile Number
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold mb-1">
                      National ID (NIN), Passport, or Registered Phone
                    </label>
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => {
                        setLoginIdentifier(e.target.value);
                        const det = detectCountry(e.target.value);
                        if (det) setLoginCountry(det);
                      }}
                      placeholder="e.g. CM90284918841 or +256 778 277 900"
                      className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold mb-1">
                      Jurisdiction Country
                    </label>
                    <select
                      value={loginCountry}
                      onChange={(e) => setLoginCountry(e.target.value as CountryCode)}
                      className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                    >
                      {(Object.entries(COUNTRIES) as [CountryCode, any][]).map(([k, v]) => (
                        <option key={k} value={k}>
                          [{k}] {v.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-mono font-semibold rounded-lg py-2.5 text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Instant Sign In → Live Feed</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* Identity Type Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIdType('nid')}
                    className={`py-2.5 px-3 rounded-lg text-xs font-mono font-semibold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      idType === 'nid'
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                        : 'border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 bg-[#f8f9fa] dark:bg-[#0e1116]'
                    }`}
                  >
                    <BadgeCheck size={14} />
                    <span>National ID</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdType('passport')}
                    className={`py-2.5 px-3 rounded-lg text-xs font-mono font-semibold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      idType === 'passport'
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                        : 'border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 bg-[#f8f9fa] dark:bg-[#0e1116]'
                    }`}
                  >
                    <Lock size={14} />
                    <span>Passport</span>
                  </button>
                </div>

                {/* ID Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
                    {idType === 'nid' ? 'National ID Number (NIN)' : 'Passport Number'}
                  </label>
                  <input
                    type="text"
                    value={idVal}
                    onChange={(e) => handleIDInput(e.target.value)}
                    placeholder={idType === 'nid' ? 'e.g. CM90284918841 (or leave blank for instant demo ID)' : 'e.g. A01849204'}
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                  {country && COUNTRIES[country] && (
                    <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-emerald-700 dark:text-emerald-400 pt-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-[9.5px] font-bold">
                        {country}
                      </span>
                      <span>
                        Jurisdiction: <strong>{COUNTRIES[country].name}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Country Override */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
                    Sovereign Jurisdiction
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value as CountryCode)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select country...</option>
                    {(Object.entries(COUNTRIES) as [CountryCode, any][]).map(([k, v]) => (
                      <option key={k} value={k}>
                        [{k}] {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phone Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
                    Mobile Number <span className="text-slate-400 font-normal">(Optional · 2FA &amp; Perks)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+256 778 277 900"
                      className="flex-1 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => toast('OTP verification code sent via SMS', 'emerald')}
                      className="px-3 py-2 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold rounded-lg whitespace-nowrap cursor-pointer"
                    >
                      Send OTP
                    </button>
                  </div>
                </div>

                {/* Security Note Box & Legal Charter Consent */}
                <div className="p-3 bg-[#f8f9fa] dark:bg-[#0e1116] rounded-lg border border-[#e3e6ea] dark:border-[#262b36] space-y-2 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      Your ID number is cryptographically salted &amp; hashed. Only your verified citizenship status and parish node are broadcast to public walls.
                    </span>
                  </div>

                  <label className="flex items-start gap-2 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={acceptedCharter}
                      onChange={(e) => setAcceptedCharter(e.target.checked)}
                      className="mt-0.5 rounded accent-emerald-600"
                    />
                    <span className="text-[10.5px] text-slate-700 dark:text-slate-300">
                      I agree to the CivicDuty{' '}
                      <button
                        type="button"
                        onClick={() => openLegalCenter('terms')}
                        className="font-semibold text-emerald-700 dark:text-emerald-400 underline cursor-pointer"
                      >
                        Terms of Use
                      </button>
                      ,{' '}
                      <button
                        type="button"
                        onClick={() => openLegalCenter('privacy')}
                        className="font-semibold text-emerald-700 dark:text-emerald-400 underline cursor-pointer"
                      >
                        Zero-Knowledge Privacy Charter
                      </button>
                      , and{' '}
                      <button
                        type="button"
                        onClick={() => openLegalCenter('ethics')}
                        className="font-semibold text-emerald-700 dark:text-emerald-400 underline cursor-pointer"
                      >
                        Ethical Perks Covenant
                      </button>
                      .
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleOb1Next}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-semibold rounded-lg py-2.5 text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Continue to Step 2 (Home Location)</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Home Location
  if (view === 'ob_home') {
    const activeCountry = (country || 'UG') as CountryCode;
    const primaryUnitName = activeCountry === 'KE' ? 'ward' : activeCountry === 'RW' ? 'sector' : 'parish';
    const allNodes = primaryNodes(activeCountry, undefined);
    const hits =
      homeSearch.trim().length >= 1
        ? allNodes
            .filter((n) => n.name.toLowerCase().includes(homeSearch.trim().toLowerCase()))
            .slice(0, 6)
        : allNodes.slice(0, 5);

    return (
      <div className="px-3.5 sm:px-5 pt-4 pb-16 animate-fade-in max-w-lg mx-auto text-slate-900 dark:text-slate-100">
        <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex items-center justify-between gap-2">
            <button
              onClick={() => go('ob1')}
              className="flex items-center gap-1 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>Step 1</span>
            </button>

            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
              <span>1 · ID</span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                2 / 3 · {primaryUnitName.toUpperCase()}
              </span>
              <span>·</span>
              <span>3 · Walls</span>
            </div>

            <button
              onClick={() => {
                setChosenHome(null);
                go('ob3');
              }}
              className="text-[10.5px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Skip →
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                <Compass size={12} />
                <span>Step 2 of 3 · Default Grassroots Node</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Select Your Home {primaryUnitName.charAt(0).toUpperCase() + primaryUnitName.slice(1)}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Sets your default grassroots node so local council reports take one tap. You can still report anywhere across {COUNTRIES[activeCountry]?.name}.
              </p>
            </div>

            <div className="p-3.5 space-y-2.5 border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] rounded-lg">
              {chosenHome ? (
                <div className="flex items-start justify-between gap-3 bg-emerald-500/10 border border-emerald-500/25 rounded-lg p-3">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MapPin size={13} className="text-emerald-600 dark:text-emerald-400" />
                      <span>{chosenHome.name}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      {chosenHome.path}
                    </div>
                  </div>
                  <button
                    onClick={() => setChosenHome(null)}
                    className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 hover:underline shrink-0 font-semibold cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={homeSearch}
                      onChange={(e) => setHomeSearch(e.target.value)}
                      placeholder={`Search your ${primaryUnitName} or tap below…`}
                      className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg pl-8 pr-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">
                      {homeSearch.trim() ? 'Matching Jurisdictions' : `Quick-Select ${COUNTRIES[activeCountry]?.name} Nodes`}
                    </div>
                    {hits.length === 0 ? (
                      <p className="text-[11px] font-mono text-slate-500 py-2">
                        No match found. Try a shorter spelling.
                      </p>
                    ) : (
                      hits.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => {
                            setChosenHome(n);
                            setHomeSearch('');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/50 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                              {n.name}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                              {n.path}
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 shrink-0">
                            Select →
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="p-3 bg-[#f8f9fa] dark:bg-[#0e1116] rounded-lg border border-[#e3e6ea] dark:border-[#262b36] text-[10.5px] font-mono text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mb-0.5">
                <ShieldCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
                <span>Zero-Exposure Location Policy</span>
              </span>
              Your home location pre-fills grassroots routing and local Baraza alerts. It is never displayed publicly on your posts.
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setChosenHome(null);
                  go('ob3');
                }}
                className="px-3.5 py-2.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 text-xs font-mono font-semibold hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] cursor-pointer"
              >
                Skip
              </button>
              <button
                onClick={() => {
                  if (!chosenHome && hits.length > 0) {
                    setChosenHome(hits[0]);
                  }
                  go('ob3');
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-semibold rounded-lg py-2.5 text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Continue to Step 3 (Follow Walls)</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: Pick Walls
  const activeCountry = (country || 'UG') as CountryCode;
  const depts = allDepts(activeCountry);
  const civic = depts.filter((d) => d.lane === 'civic');
  const consumer = depts.filter((d) => d.lane === 'consumer');

  const filterList = (list: Department[]) =>
    list.filter(
      (d) =>
        d.name.toLowerCase().includes(deptSearch.toLowerCase()) ||
        d.full.toLowerCase().includes(deptSearch.toLowerCase())
    );

  return (
    <div className="px-3.5 sm:px-5 pt-4 pb-16 animate-fade-in max-w-lg mx-auto text-slate-900 dark:text-slate-100">
      <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex items-center justify-between gap-2">
          <button
            onClick={() => go('ob_home')}
            className="flex items-center gap-1 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft size={14} />
            <span>Step 2</span>
          </button>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
            <span>1 · ID</span>
            <span>·</span>
            <span>2 · Node</span>
            <span>·</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              3 / 3 · WALLS
            </span>
          </div>

          <button
            onClick={() => {
              const topThree = depts.slice(0, 4).map((d) => d.id);
              setFollowedDepts(topThree);
              toast('Selected top 4 national walls', 'emerald');
            }}
            className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles size={11} />
            <span>Auto-Pick 4</span>
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider mb-1">
              <Layers size={12} />
              <span>Step 3 of 3 · Monitored Service Walls</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Pick Your Monitored Walls
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Follow 3+ public authority or utility walls. Your live feed displays verified citizen tickets and statutory SLA responses from these desks.
            </p>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={deptSearch}
              onChange={(e) => setDeptSearch(e.target.value)}
              placeholder="Search department or utility walls..."
              className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg pl-8 pr-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-3 pr-0.5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                  Lane 1 · Statutory Public Desks
                </span>
                <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  Sovereign SLA
                </span>
              </div>
              <div className="space-y-1.5">
                {filterList(civic).map((d) => {
                  const sel = followedDepts.includes(d.id);
                  return (
                    <div
                      key={d.id}
                      onClick={() => toggleDept(d.id)}
                      className={`p-2.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                        sel
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-md bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                          <DeptIcon dept={d} size={14} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {d.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                            {d.ministry || d.full}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 ${
                          sel
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-700 text-transparent'
                        }`}
                      >
                        <Check size={12} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {consumer.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                    Lane 2 · Utilities &amp; Service Providers
                  </span>
                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400">
                    Consumer Care
                  </span>
                </div>
                <div className="space-y-1.5">
                  {filterList(consumer).map((d) => {
                    const sel = followedDepts.includes(d.id);
                    return (
                      <div
                        key={d.id}
                        onClick={() => toggleDept(d.id)}
                        className={`p-2.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                          sel
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-md bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                            <DeptIcon dept={d} size={14} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                              {d.name}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                              {d.full}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 ${
                            sel
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 dark:border-slate-700 text-transparent'
                          }`}
                        >
                          <Check size={12} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleFinishOnboarding}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-semibold rounded-lg py-2.5 text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>
              {followedDepts.length < 3
                ? `Auto-Complete Top 3 Walls & Enter Live Feed →`
                : `Following ${followedDepts.length} Walls · Enter Live Feed →`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
