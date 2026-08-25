import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode, Department } from '../types';
import { COUNTRIES, allDepts, TERRITORY } from '../data/countries';
import { primaryNodes } from '../data/tiers';
import { 
  ChevronLeft, 
  Search, 
  Check, 
  ShieldCheck, 
  Fingerprint, 
  BadgeCheck, 
  Lock, 
  Building2, 
  MapPin, 
  Layers, 
  Sparkles, 
  Phone,
  Compass,
  ArrowRight
} from 'lucide-react';

export const OnboardingCitizenView: React.FC = () => {
  const { view, go, setUser, toast, setProfiles, ensureCitizenSession } = useApp();

  // Onboarding Step 1 State
  const [idType, setIdType] = useState<'nid' | 'passport'>('nid');
  const [idVal, setIdVal] = useState('');
  const [country, setCountry] = useState<CountryCode | ''>('');
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
      <div className="p-5 space-y-6 pt-8 animate-fade-in max-w-lg mx-auto text-slate-800 dark:text-slate-100">
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <button
              onClick={() => go('splash')}
              className="flex items-center gap-1 text-[11px] mono text-slate-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors font-medium"
            >
              <ChevronLeft size={14} /> Back
            </button>
            <button
              onClick={() => {
                ensureCitizenSession();
                go('feed');
              }}
              className="text-[10.5px] mono text-teal-700 dark:text-teal-400 font-bold bg-teal-50 dark:bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 rounded-xl hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles size={13} />
              <span>Skip to Live Feed</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] mono text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider mb-1">
            <Fingerprint size={13} />
            <span>Step 1 of 3 · Identity Anchor</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">Verify Citizen Identity</h2>
          <p className="text-[12.5px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
            1 Verified ID = 1 Authentic Voice. Sybil-resistant cryptographic validation routes your voice directly to your municipal council.
          </p>
        </div>

        {/* Identity Type Selection */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setIdType('nid')}
            className={`py-3 px-3.5 rounded-xl text-xs font-bold border transition-all mono flex items-center justify-center gap-2 ${
              idType === 'nid' 
                ? 'border-amber-600/50 bg-amber-600/10 text-amber-800 dark:text-amber-300 shadow-xs' 
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <BadgeCheck size={16} className={idType === 'nid' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'} />
            <span>National ID</span>
          </button>
          <button
            onClick={() => setIdType('passport')}
            className={`py-3 px-3.5 rounded-xl text-xs font-bold border transition-all mono flex items-center justify-center gap-2 ${
              idType === 'passport' 
                ? 'border-amber-600/50 bg-amber-600/10 text-amber-800 dark:text-amber-300 shadow-xs' 
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <Lock size={15} className={idType === 'passport' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'} />
            <span>Passport</span>
          </button>
        </div>

        {/* ID Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest block font-bold">
            {idType === 'nid' ? 'National ID Number (NIN)' : 'Passport Number'}
          </label>
          <input
            type="text"
            value={idVal}
            onChange={(e) => handleIDInput(e.target.value)}
            placeholder={idType === 'nid' ? 'e.g. CM90284918841' : 'e.g. A01849204'}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 text-sm mono focus:outline-none focus:border-amber-600 transition-colors"
          />
          <div className="flex items-center gap-2 h-5 pt-0.5">
            {country && COUNTRIES[country] && (
              <div className="flex items-center gap-1.5 text-[10.5px] mono text-emerald-700 dark:text-emerald-400 font-medium">
                <span className="text-base">{COUNTRIES[country].flag}</span>
                <span>Jurisdiction Detected: <strong>{COUNTRIES[country].name}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Country Override */}
        <div className="space-y-1.5">
          <label className="text-[10px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest block font-bold">
            Country <span className="text-slate-400 dark:text-slate-500 font-normal">(Auto-detected · override if needed)</span>
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as CountryCode)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 text-sm mono focus:outline-none focus:border-amber-600 transition-colors"
          >
            <option value="">Select country...</option>
            {(Object.entries(COUNTRIES) as [CountryCode, any][]).map(([k, v]) => (
              <option key={k} value={k}>
                {v.flag} {v.name}
              </option>
            ))}
          </select>
        </div>

        {/* Phone Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest block font-bold">
            Mobile Number <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional · 2FA & Airtime Perks)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+256 778 277 900"
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:border-amber-600 transition-colors"
            />
            <button
              type="button"
              onClick={() => toast('OTP verification code sent via SMS', 'emerald')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs mono rounded-xl whitespace-nowrap transition-colors font-bold"
            >
              Send OTP
            </button>
          </div>
        </div>

        {/* Security Note Box */}
        <div className="p-3 bg-amber-600/5 dark:bg-amber-500/5 rounded-xl border border-amber-600/20 dark:border-amber-500/20 flex items-start gap-2.5 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <ShieldCheck size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <span>Your ID number is cryptographically salted & hashed. Only your verified citizenship status and parish node are broadcast to public walls.</span>
        </div>

        <button
          onClick={handleOb1Next}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500 font-bold rounded-2xl py-3.5 text-xs uppercase tracking-widest mono transition-all active:scale-[.98] shadow-sm flex items-center justify-center gap-2"
        >
          <span>Continue to Location</span>
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  // STEP 2: Home Location
  if (view === 'ob_home') {
    const activeCountry = country || 'UG';
    const primaryUnitName = activeCountry === 'KE' ? 'ward' : activeCountry === 'RW' ? 'sector' : 'parish';
    const hits =
      homeSearch.trim().length >= 2
        ? primaryNodes(activeCountry, undefined).filter((n) =>
            n.name.toLowerCase().includes(homeSearch.trim().toLowerCase())
          ).slice(0, 6)
        : [];

    return (
      <div className="p-5 space-y-5 pt-8 animate-fade-in max-w-lg mx-auto text-slate-800 dark:text-slate-100">
        <div>
          <button
            onClick={() => go('ob1')}
            className="flex items-center gap-1 text-[11px] mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-4 transition-colors font-medium"
          >
            <ChevronLeft size={14} /> Back
          </button>
          <div className="flex items-center gap-1.5 text-[10px] mono text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider mb-1">
            <Compass size={13} />
            <span>Step 2 of 3 · Jurisdiction</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">Where do you live?</h2>
          <p className="text-[12.5px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
            Sets your default parish so local council reports take one tap. You can report anywhere across the country.
          </p>
        </div>

        <div className="card p-4 space-y-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 rounded-2xl shadow-sm">
          {chosenHome ? (
            <div className="flex items-start justify-between gap-3 bg-amber-600/10 dark:bg-amber-500/10 border border-amber-600/20 dark:border-amber-500/20 rounded-xl p-3">
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <MapPin size={14} className="text-amber-600 dark:text-amber-400" />
                  <span>{chosenHome.name}</span>
                </div>
                <div className="text-[10px] mono text-slate-500 dark:text-slate-400 mt-0.5">{chosenHome.path}</div>
              </div>
              <button
                onClick={() => setChosenHome(null)}
                className="text-[10px] mono text-amber-800 dark:text-amber-300 hover:underline flex-shrink-0 font-bold"
              >
                Change
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={homeSearch}
                  onChange={(e) => setHomeSearch(e.target.value)}
                  placeholder={`Search for your ${primaryUnitName}…`}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-900 dark:text-slate-100 text-sm mono focus:outline-none focus:border-amber-600"
                />
              </div>
              {homeSearch.trim().length >= 2 && (
                <div className="mt-2 space-y-1">
                  {hits.length === 0 ? (
                    <p className="text-[10px] mono text-slate-500 py-2">No match found. Try a shorter spelling.</p>
                  ) : (
                    hits.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          setChosenHome(n);
                          setHomeSearch('');
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:bg-amber-50/30 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="text-[12px] font-bold text-slate-800 dark:text-slate-200">{n.name}</div>
                        <div className="text-[9.5px] mono text-slate-500 dark:text-slate-400">{n.path}</div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-3.5 space-y-1 bg-slate-100/70 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] mono text-slate-600 dark:text-slate-400">
          <p className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck size={12} className="text-teal-600 dark:text-teal-400" /> Privacy Guarantee
          </p>
          <p className="leading-relaxed">
            Your home location speeds up dispatch and tailors local emergency notifications. It is never displayed publicly on your posts.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              if (!chosenHome) {
                toast('Search and pick a location first', 'amber');
                return;
              }
              go('ob3');
            }}
            disabled={!chosenHome}
            className={`w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500 font-bold rounded-2xl py-3.5 text-xs uppercase tracking-widest mono transition-all active:scale-[.98] shadow-sm flex items-center justify-center gap-2 ${
              chosenHome ? '' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <span>Continue to Wall Selection</span>
            <ArrowRight size={15} />
          </button>
          <button
            onClick={() => {
              setChosenHome(null);
              go('ob3');
            }}
            className="w-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl py-2.5 text-[10.5px] uppercase tracking-widest mono hover:bg-slate-100 dark:hover:bg-slate-900 transition-all font-medium"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  // STEP 3: Pick Walls
  const activeCountry = country || 'UG';
  const depts = allDepts(activeCountry);
  const civic = depts.filter((d) => d.lane === 'civic');
  const consumer = depts.filter((d) => d.lane === 'consumer');

  const filterList = (list: Department[]) =>
    list.filter((d) => d.name.toLowerCase().includes(deptSearch.toLowerCase()) || d.full.toLowerCase().includes(deptSearch.toLowerCase()));

  return (
    <div className="p-5 space-y-5 pt-8 animate-fade-in max-w-lg mx-auto text-slate-800 dark:text-slate-100">
      <div>
        <button
          onClick={() => go('ob_home')}
          className="flex items-center gap-1 text-[11px] mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-4 transition-colors font-medium"
        >
          <ChevronLeft size={14} /> Back
        </button>
        <div className="flex items-center gap-1.5 text-[10px] mono text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider mb-1">
          <Layers size={13} />
          <span>Step 3 of 3 · Wall Feeds</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">Pick Your Walls</h2>
        <p className="text-[12.5px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
          Follow 3+ public entity or utility walls. Your live Registry stream displays verified tickets and work orders from these departments.
        </p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={deptSearch}
          onChange={(e) => setDeptSearch(e.target.value)}
          placeholder="Search department or utility walls..."
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-900 dark:text-slate-100 text-sm mono focus:outline-none focus:border-amber-600"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest font-bold">Lane 1 · Public Authorities</span>
          <span className="chip ch-gov text-[9.5px]">Verified Gov</span>
        </div>
        <div className="space-y-2">
          {filterList(civic).map((d) => {
            const sel = followedDepts.includes(d.id);
            return (
              <div
                key={d.id}
                onClick={() => toggleDept(d.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  sel 
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-500/10 text-teal-950 dark:text-teal-100' 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl w-7 text-center">{d.icon || '🏢'}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{d.name}</div>
                    <div className="text-[9.5px] mono text-slate-500 dark:text-slate-400">{d.ministry || d.full}</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                  sel 
                    ? 'bg-teal-600 border-teal-600 text-white' 
                    : 'border-slate-300 dark:border-slate-700 text-transparent'
                }`}>
                  <Check size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {consumer.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest font-bold">Lane 2 · Utilities & Infrastructure</span>
            <span className="chip ch-private text-[9.5px]">Verified Utility</span>
          </div>
          <div className="space-y-2">
            {filterList(consumer).map((d) => {
              const sel = followedDepts.includes(d.id);
              return (
                <div
                  key={d.id}
                  onClick={() => toggleDept(d.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    sel 
                      ? 'border-amber-600/50 bg-amber-600/10 text-amber-950 dark:text-amber-100' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">{d.icon || '🏢'}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{d.name}</div>
                      <div className="text-[9.5px] mono text-slate-500 dark:text-slate-400">{d.full}</div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    sel 
                      ? 'bg-amber-700 dark:bg-amber-600 border-amber-700 dark:border-amber-600 text-white' 
                      : 'border-slate-300 dark:border-slate-700 text-transparent'
                  }`}>
                    <Check size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="pb-6 pt-2">
        <button
          onClick={handleFinishOnboarding}
          className="w-full bg-amber-700 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-500 font-bold rounded-2xl py-3.5 text-xs uppercase tracking-widest mono transition-all active:scale-[.98] shadow-sm flex items-center justify-center gap-2"
        >
          {followedDepts.length < 3
            ? `Select ${3 - followedDepts.length} more (min 3) →`
            : `Following ${followedDepts.length} Walls — Enter Live Feed →`}
        </button>
      </div>
    </div>
  );
};
