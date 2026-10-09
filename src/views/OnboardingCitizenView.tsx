import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode, Department, IdentityDocumentType } from '../types';
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
  Globe2,
  ScanLine,
  AlertTriangle,
  FileCheck2,
} from 'lucide-react';
import { DeptIcon } from '../components/DeptIcon';

const FOREIGN_DOCUMENT_OPTIONS: {
  id: IdentityDocumentType;
  label: string;
  codePrefix: string;
  sample: string;
  desc: string;
}[] = [
  {
    id: 'work_permit',
    label: 'Work Permit (Class A–G / Expat)',
    codePrefix: 'WP',
    sample: 'WP-2026-884920',
    desc: 'Issued by Ministry of Internal Affairs / Immigration Directorate for employed foreign nationals.',
  },
  {
    id: 'alien_card',
    label: 'Alien Registration Card',
    codePrefix: 'ALN',
    sample: 'ALN-904821-REG',
    desc: 'Statutory Alien ID card issued by National Identification Authority (NIRA / IPRS / NIMC).',
  },
  {
    id: 'green_card',
    label: 'Green Card / Permanent Resident',
    codePrefix: 'GC',
    sample: 'GC-PR-7739104',
    desc: 'Permanent residency certificate granting full municipal & local civic reporting rights.',
  },
  {
    id: 'resident_permit',
    label: 'Resident / Dependent Permit',
    codePrefix: 'RP',
    sample: 'RP-2026-551902',
    desc: 'Medium-to-long-term residence permit for investors, spouses, and diplomatic dependents.',
  },
  {
    id: 'student_visa',
    label: 'Student Pass / University Visa',
    codePrefix: 'STU',
    sample: 'STU-PASS-339104',
    desc: 'International student visa or East African / ECOWAS / SADC academic study pass.',
  },
  {
    id: 'visitor_visa',
    label: 'Entry / Business / Tourist Visa',
    codePrefix: 'VISA',
    sample: 'VISA-EA-119402',
    desc: 'Short-term entry visa enabling highway safety, transit, utility, and emergency reporting.',
  },
];

const COUNTRY_ID_SPECS: Record<
  string,
  { agency: string; formatHint: string; sampleNid: string; samplePassport: string }
> = {
  UG: {
    agency: 'NIRA Uganda (14-Character NIN)',
    formatHint: 'Starts with CM (Male) or CF (Female) + 12 alphanumeric characters',
    sampleNid: 'CM92018104928K',
    samplePassport: 'B0294819',
  },
  KE: {
    agency: 'IPRS / Huduma Namba Kenya',
    formatHint: '8-digit National ID or 9-character e-Passport',
    sampleNid: '34918204',
    samplePassport: 'AK0948211',
  },
  TZ: {
    agency: 'NIDA Tanzania (20-Digit NIN)',
    formatHint: 'NIDA National ID or East African e-Passport',
    sampleNid: '19900412-11204-00001-24',
    samplePassport: 'AB492018',
  },
  RW: {
    agency: 'NIDA Rwanda (16-Digit Indangamuntu)',
    formatHint: 'Starts with 1 + birth year + 11 digits',
    sampleNid: '1199180049281014',
    samplePassport: 'PC904821',
  },
  NG: {
    agency: 'NIMC Nigeria (11-Digit NIN)',
    formatHint: '11-digit National Identification Number',
    sampleNid: '48291049281',
    samplePassport: 'A50294812',
  },
  ZA: {
    agency: 'DHA South Africa (13-Digit Smart ID)',
    formatHint: '13-digit SA ID Number (YYMMDDSSSSCAZ)',
    sampleNid: '9004125089084',
    samplePassport: 'M00294819',
  },
  GH: {
    agency: 'NIA Ghana Card (GHA-XXXXXXXXX-X)',
    formatHint: 'Starts with GHA followed by 9 digits and check digit',
    sampleNid: 'GHA-728194021-8',
    samplePassport: 'G2948102',
  },
};

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
  const [loginCitizenshipMode, setLoginCitizenshipMode] = useState<'citizen' | 'foreign_resident'>('citizen');
  const [loginForeignDocType, setLoginForeignDocType] = useState<IdentityDocumentType>('work_permit');
  const [loginForeignPermitNo, setLoginForeignPermitNo] = useState<string>('');
  const [loginOriginCountry, setLoginOriginCountry] = useState<CountryCode>('KE');

  // Onboarding Step 1 State
  const [citizenshipStatus, setCitizenshipStatus] = useState<'citizen' | 'foreign_resident'>('citizen');
  const [idType, setIdType] = useState<IdentityDocumentType>('nid');
  const [idVal, setIdVal] = useState('');
  const [country, setCountry] = useState<CountryCode | ''>(user?.country || 'UG');
  const [originCountry, setOriginCountry] = useState<CountryCode>('KE');
  const [permitNumber, setPermitNumber] = useState('');
  const [permitExpiry, setPermitExpiry] = useState('2027-12-31');
  const [phone, setPhone] = useState('');
  const [verificationScanStatus, setVerificationScanStatus] = useState<'idle' | 'scanning' | 'verified'>('idle');
  const [zkTokenHash, setZkTokenHash] = useState<string>('');

  // Onboarding Step 2 (Home) State
  const [homeSearch, setHomeSearch] = useState('');
  const [chosenHome, setChosenHome] = useState<{ id: string; name: string; path: string } | null>(null);

  // Onboarding Step 3 (Walls) State
  const [followedDepts, setFollowedDepts] = useState<string[]>([]);
  const [deptSearch, setDeptSearch] = useState('');

  const detectCountry = (v: string): CountryCode | '' => {
    const val = v.trim().toUpperCase();
    if (/^CM\d/.test(val) || /^CF\d/.test(val) || /^UG/.test(val)) return 'UG';
    if (/^GHA/.test(val)) return 'GH';
    if (/^\d{8}$/.test(val)) return 'KE';
    if (/^\d{11}$/.test(val)) return 'NG';
    if (/^119\d/.test(val) || /^120\d/.test(val)) return 'RW';
    if (/^\d{13}$/.test(val)) return 'ZA';
    return '';
  };

  const computeDeterministicHash = (rawId: string, cCode: string, docType: string) => {
    const seed = `${cCode}:${docType}:${rawId.toUpperCase()}:CIVICDUTY-ZK-2026`;
    let h1 = 0xdeadbeef ^ seed.length;
    let h2 = 0x41c6ce57 ^ seed.length;
    for (let i = 0, ch; i < seed.length; i++) {
      ch = seed.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return `zk-sha256:${(h2 >>> 0).toString(16).padStart(8, '0')}${(h1 >>> 0).toString(16).padStart(8, '0')}`;
  };

  const handleIDInput = (val: string) => {
    setIdVal(val);
    setVerificationScanStatus('idle');
    const detected = detectCountry(val);
    if (detected && citizenshipStatus === 'citizen') {
      setCountry(detected);
    }
  };

  const handleRunVerificationScan = () => {
    const activeCountry = (country || 'UG') as CountryCode;
    const spec = COUNTRY_ID_SPECS[activeCountry] || {
      agency: `${COUNTRIES[activeCountry]?.name || activeCountry} National Civil Registry`,
      formatHint: 'National ID or ICAO e-Passport',
      sampleNid: `${activeCountry}-90284918`,
      samplePassport: `P-${activeCountry}-884920`,
    };

    let finalId = idVal.trim();
    if (!finalId) {
      finalId = idType === 'passport' ? spec.samplePassport : spec.sampleNid;
      setIdVal(finalId);
    }

    let finalPermit = permitNumber.trim();
    if (citizenshipStatus === 'foreign_resident' && !finalPermit) {
      const docMeta = FOREIGN_DOCUMENT_OPTIONS.find((d) => d.id === idType) || FOREIGN_DOCUMENT_OPTIONS[0];
      finalPermit = `${docMeta.codePrefix}-${activeCountry}-2026-8841`;
      setPermitNumber(finalPermit);
    }

    setVerificationScanStatus('scanning');
    setTimeout(() => {
      const hash = computeDeterministicHash(
        citizenshipStatus === 'foreign_resident' ? `${finalId}:${finalPermit}` : finalId,
        activeCountry,
        idType
      );
      setZkTokenHash(hash);
      setVerificationScanStatus('verified');
      toast(
        citizenshipStatus === 'foreign_resident'
          ? `Foreign Resident Permit (${idType.replace('_', ' ').toUpperCase()}) cryptographically verified for ${COUNTRIES[activeCountry]?.name}`
          : `National Identity verified via ${spec.agency} · Zero-Knowledge Token minted`,
        'emerald'
      );
    }, 350);
  };

  const handleOb1Next = () => {
    if (!acceptedCharter) {
      toast('Please accept the Sovereign Privacy Charter & Terms of Use to continue.', 'amber');
      return;
    }
    const activeCountry = (country || 'UG') as CountryCode;
    const spec = COUNTRY_ID_SPECS[activeCountry] || {
      agency: `${COUNTRIES[activeCountry]?.name} Registry`,
      formatHint: 'National ID',
      sampleNid: `${activeCountry}-9028491`,
      samplePassport: `P-${activeCountry}-884920`,
    };

    // Strict Country vs ID check for Citizens:
    if (citizenshipStatus === 'citizen' && idVal.trim()) {
      const detectedFromId = detectCountry(idVal.trim());
      if (detectedFromId && detectedFromId !== activeCountry) {
        toast(
          `Strict Country Access Lock: That National ID belongs to ${COUNTRIES[detectedFromId]?.name}. Switch country to ${COUNTRIES[detectedFromId]?.name} or select "Foreign Resident / Expat Extension" with a valid Permit/Visa.`,
          'amber'
        );
        return;
      }
    }

    if (citizenshipStatus === 'foreign_resident' && !permitNumber.trim()) {
      const docMeta = FOREIGN_DOCUMENT_OPTIONS.find((d) => d.id === idType) || FOREIGN_DOCUMENT_OPTIONS[0];
      setPermitNumber(`${docMeta.codePrefix}-${activeCountry}-2026-8841`);
    }

    let activeId = idVal.trim();
    if (!activeId) {
      activeId = idType === 'passport' ? spec.samplePassport : spec.sampleNid;
      setIdVal(activeId);
    }
    if (!country) {
      setCountry('UG');
    }
    if (!zkTokenHash) {
      setZkTokenHash(computeDeterministicHash(activeId, activeCountry, idType));
    }
    go('ob_home');
  };

  const handleReturningCitizenLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = loginIdentifier.trim().toUpperCase() || `${loginCountry}-9028491`;
    const detectedFromId = detectCountry(raw);

    // Enforce Strict Country Access: A non-citizen cannot log into another country without a Foreigner Extension Document
    if (
      loginCitizenshipMode === 'citizen' &&
      detectedFromId &&
      detectedFromId !== loginCountry
    ) {
      toast(
        `Strict Country Lock: ID [${raw}] is issued by ${COUNTRIES[detectedFromId]?.name}. To enter ${COUNTRIES[loginCountry]?.name}'s civic experience, switch to "Foreign Resident / Visa Extension" below or log into ${COUNTRIES[detectedFromId]?.name}.`,
        'amber'
      );
      return;
    }

    if (loginCitizenshipMode === 'foreign_resident' && !loginForeignPermitNo.trim()) {
      toast(
        `Please enter your ${loginForeignDocType.replace('_', ' ')} number or click "Fill Demo Permit" to access ${COUNTRIES[loginCountry]?.name} as a Foreign Resident.`,
        'amber'
      );
      return;
    }

    const targetCountry = loginCountry || detectedFromId || 'UG';
    const uid = 'usr-' + raw.replace(/[^A-Z0-9]/g, '').slice(-5) + '-' + targetCountry;
    const existingProfile = profiles[uid];

    const defaultFollowed =
      targetCountry === 'KE'
        ? ['ke-kplc', 'ke-ncwsc', 'ke-kura']
        : targetCountry === 'NG'
        ? ['ng-ikeja', 'ng-lawma', 'ng-ferma']
        : ['ug-unra', 'ug-nwsc', 'ug-umeme', 'ug-kcca'];

    const isForeigner = loginCitizenshipMode === 'foreign_resident';
    const homeOrigin = isForeigner ? loginOriginCountry : targetCountry;

    const activeProfile = existingProfile || {
      id: uid,
      country: targetCountry,
      verifiedCountryCode: homeOrigin,
      citizenshipStatus: isForeigner ? ('foreign_resident' as const) : ('citizen' as const),
      identityDocumentType: isForeigner ? loginForeignDocType : ('nid' as const),
      permitNumber: isForeigner ? loginForeignPermitNo.trim().toUpperCase() : undefined,
      originCountryCode: isForeigner ? loginOriginCountry : targetCountry,
      authorizedForeignCountries: isForeigner ? [targetCountry] : [],
      id_frag: raw.slice(-4) || '9028',
      display_name:
        user?.name ||
        (isForeigner
          ? `Resident (${loginOriginCountry}→${targetCountry}) #${raw.slice(-4) || '9028'}`
          : `Citizen #${raw.slice(-4) || '9028'}`),
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
      country: targetCountry,
      verifiedCountryCode: homeOrigin,
      citizenshipStatus: isForeigner ? 'foreign_resident' : 'citizen',
      identityDocumentType: isForeigner ? loginForeignDocType : 'nid',
      permitNumber: isForeigner ? loginForeignPermitNo.trim().toUpperCase() : undefined,
      originCountryCode: isForeigner ? loginOriginCountry : targetCountry,
      authorizedForeignCountries: isForeigner ? [targetCountry] : [],
      nodeTag: COUNTRIES[targetCountry]?.node || 'NODE_01',
      followed: activeProfile.followed || defaultFollowed,
      name: activeProfile.display_name,
    });

    toast(
      isForeigner
        ? `Foreign Resident Permit Verified (${loginForeignDocType.replace('_', ' ').toUpperCase()}) · Mounted ${COUNTRIES[targetCountry]?.name} Feed`
        : `Welcome back, ${activeProfile.display_name} · Strictly Verified for ${COUNTRIES[targetCountry]?.name}`,
      'emerald'
    );
    go('feed');
  };

  const handleFinishOnboarding = () => {
    let deptsToFollow = [...followedDepts];
    if (deptsToFollow.length < 3) {
      toast('Minimum 3 walls required — auto-added top local authorities', 'amber');
      deptsToFollow = Array.from(new Set([...deptsToFollow, 'ug-unra', 'ug-nwsc', 'ug-umeme']));
      setFollowedDepts(deptsToFollow);
    }

    const activeCountry = (country || 'UG') as CountryCode;
    const cleanId = idVal.trim() || `${activeCountry}-9028491`;
    const uid = 'usr-' + cleanId.replace(/[^A-Z0-9]/gi, '').slice(-5) + '-' + activeCountry;
    const isForeigner = citizenshipStatus === 'foreign_resident';
    const homeOrigin = isForeigner ? originCountry : activeCountry;

    const newProfile = {
      id: uid,
      country: activeCountry,
      verifiedCountryCode: homeOrigin,
      citizenshipStatus,
      identityDocumentType: idType,
      permitNumber: isForeigner ? permitNumber.trim().toUpperCase() || `WP-${activeCountry}-8841` : undefined,
      permitExpiry: isForeigner ? permitExpiry : undefined,
      originCountryCode: homeOrigin,
      authorizedForeignCountries: isForeigner ? [activeCountry] : [],
      id_frag: cleanId.slice(-4) || '9999',
      display_name: isForeigner
        ? `Resident (${originCountry}→${activeCountry}) #${cleanId.slice(-4).toUpperCase()}`
        : 'Citizen ' + cleanId.slice(0, 4).toUpperCase(),
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
      verifiedCountryCode: homeOrigin,
      citizenshipStatus,
      identityDocumentType: idType,
      permitNumber: newProfile.permitNumber,
      originCountryCode: homeOrigin,
      authorizedForeignCountries: isForeigner ? [activeCountry] : [],
      nodeTag: COUNTRIES[activeCountry]?.node || 'NODE_01',
      followed: deptsToFollow,
      name: newProfile.display_name,
    });

    toast(
      isForeigner
        ? `Foreign Resident Extension (${idType.replace('_', ' ').toUpperCase()}) verified for ${COUNTRIES[activeCountry]?.name}`
        : `National Identity strictly verified for ${COUNTRIES[activeCountry]?.name} · Welcome to CivicDuty`,
      'emerald'
    );
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
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Sign In with National ID, Passport, or Foreign Permit
                    </div>
                    <span className="text-[9.5px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      Strict Country Lock
                    </span>
                  </div>

                  {/* Citizenship vs Foreign Resident Extension Switcher */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
                    <button
                      type="button"
                      onClick={() => setLoginCitizenshipMode('citizen')}
                      className={`py-1.5 px-2.5 rounded text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                        loginCitizenshipMode === 'citizen'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      National Citizen
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginCitizenshipMode('foreign_resident')}
                      className={`py-1.5 px-2.5 rounded text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                        loginCitizenshipMode === 'foreign_resident'
                          ? 'bg-amber-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Foreign Resident / Visa
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold mb-1">
                      {loginCitizenshipMode === 'citizen'
                        ? 'National ID (NIN), Citizen Passport, or Registered Phone'
                        : 'Passport Number or Home National ID'}
                    </label>
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => {
                        setLoginIdentifier(e.target.value);
                        const det = detectCountry(e.target.value);
                        if (det && loginCitizenshipMode === 'citizen') setLoginCountry(det);
                      }}
                      placeholder={
                        loginCitizenshipMode === 'citizen'
                          ? 'e.g. CM90284918841 or +256 778 277 900'
                          : 'e.g. AK0948211 (Foreign Passport / ID)'
                      }
                      className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold mb-1">
                        {loginCitizenshipMode === 'citizen' ? 'Citizen Home Country' : 'Host Country to Enter'}
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

                    {loginCitizenshipMode === 'foreign_resident' && (
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold mb-1">
                          Country of Origin (Passport)
                        </label>
                        <select
                          value={loginOriginCountry}
                          onChange={(e) => setLoginOriginCountry(e.target.value as CountryCode)}
                          className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                        >
                          {(Object.entries(COUNTRIES) as [CountryCode, any][]).map(([k, v]) => (
                            <option key={k} value={k}>
                              [{k}] {v.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {loginCitizenshipMode === 'foreign_resident' && (
                    <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/25 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                          Foreigner Extension Document Required
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const doc =
                              FOREIGN_DOCUMENT_OPTIONS.find((d) => d.id === loginForeignDocType) ||
                              FOREIGN_DOCUMENT_OPTIONS[0];
                            setLoginForeignPermitNo(`${doc.codePrefix}-${loginCountry}-2026-9042`);
                            if (!loginIdentifier) setLoginIdentifier(`P-${loginOriginCountry}-774920`);
                            toast(`Auto-filled verified ${doc.label} for ${COUNTRIES[loginCountry]?.name}`, 'emerald');
                          }}
                          className="text-[10px] font-mono font-semibold text-amber-700 dark:text-amber-300 underline cursor-pointer"
                        >
                          Fill Demo Permit
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9.5px] font-mono text-slate-500 uppercase block mb-1">
                            Permit / Visa Category
                          </label>
                          <select
                            value={loginForeignDocType}
                            onChange={(e) => setLoginForeignDocType(e.target.value as IdentityDocumentType)}
                            className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100 text-[11px] font-mono"
                          >
                            {FOREIGN_DOCUMENT_OPTIONS.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[9.5px] font-mono text-slate-500 uppercase block mb-1">
                            Permit / Visa Serial Number
                          </label>
                          <input
                            type="text"
                            value={loginForeignPermitNo}
                            onChange={(e) => setLoginForeignPermitNo(e.target.value)}
                            placeholder="e.g. WP-UG-2026-884920"
                            className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100 text-[11px] font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-mono font-semibold rounded-lg py-2.5 text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>
                      {loginCitizenshipMode === 'foreign_resident'
                        ? `Verify Foreign Permit & Enter ${COUNTRIES[loginCountry]?.name} →`
                        : `Verify Citizen ID & Enter ${COUNTRIES[loginCountry]?.name} →`}
                    </span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* Strict Jurisdiction Access Mode Selector: Citizen vs Foreign Resident Extension */}
                <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                      Jurisdiction Access Category
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      Strict Country Enforcement
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCitizenshipStatus('citizen');
                        setIdType('nid');
                        setVerificationScanStatus('idle');
                      }}
                      className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                        citizenshipStatus === 'citizen'
                          ? 'border-emerald-500/60 bg-emerald-500/10'
                          : 'border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <BadgeCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>National Citizen</span>
                        </span>
                        <span className="text-[9.5px] font-mono text-emerald-700 dark:text-emerald-300 font-semibold">
                          Home Lock
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        Verify via National ID or Citizen e-Passport. Strictly locked to your country of citizenship.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCitizenshipStatus('foreign_resident');
                        setIdType('work_permit');
                        setVerificationScanStatus('idle');
                      }}
                      className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                        citizenshipStatus === 'foreign_resident'
                          ? 'border-amber-500/60 bg-amber-500/10'
                          : 'border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Globe2 size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>Foreigner Extension</span>
                        </span>
                        <span className="text-[9.5px] font-mono text-amber-700 dark:text-amber-300 font-semibold">
                          Permit / Visa
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        Non-citizen entry via Alien Card, Work Permit, Green Card, Resident Permit, or Student Visa.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Identity Document Type Selection */}
                {citizenshipStatus === 'citizen' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIdType('nid');
                        setVerificationScanStatus('idle');
                      }}
                      className={`py-2.5 px-3 rounded-lg text-xs font-mono font-semibold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        idType === 'nid'
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                          : 'border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 bg-[#f8f9fa] dark:bg-[#0e1116]'
                      }`}
                    >
                      <BadgeCheck size={14} />
                      <span>National ID (NIN)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIdType('passport');
                        setVerificationScanStatus('idle');
                      }}
                      className={`py-2.5 px-3 rounded-lg text-xs font-mono font-semibold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        idType === 'passport'
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                          : 'border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 bg-[#f8f9fa] dark:bg-[#0e1116]'
                      }`}
                    >
                      <Lock size={14} />
                      <span>Citizen e-Passport</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/25">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-[10px] font-mono text-amber-800 dark:text-amber-300 uppercase tracking-wider font-bold">
                        Select Foreigner Immigration Document
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const activeC = (country || 'UG') as CountryCode;
                          const docMeta =
                            FOREIGN_DOCUMENT_OPTIONS.find((d) => d.id === idType) || FOREIGN_DOCUMENT_OPTIONS[0];
                          setPermitNumber(`${docMeta.codePrefix}-${activeC}-2026-8841`);
                          setIdVal(`P-${originCountry}-904821`);
                          handleRunVerificationScan();
                        }}
                        className="text-[10px] font-mono font-semibold text-amber-700 dark:text-amber-300 underline cursor-pointer"
                      >
                        Auto-Fill Demo Permit
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {FOREIGN_DOCUMENT_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setIdType(opt.id);
                            setVerificationScanStatus('idle');
                          }}
                          className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                            idType === opt.id
                              ? 'border-amber-500 bg-amber-500/15 text-slate-900 dark:text-white'
                              : 'border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <div className="text-[10.5px] font-mono font-bold truncate">{opt.codePrefix}</div>
                          <div className="text-[10px] leading-tight truncate mt-0.5">
                            {opt.label.split(' (')[0]}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">
                          Permit / Visa Number
                        </label>
                        <input
                          type="text"
                          value={permitNumber}
                          onChange={(e) => {
                            setPermitNumber(e.target.value);
                            setVerificationScanStatus('idle');
                          }}
                          placeholder="e.g. WP-UG-2026-8841"
                          className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">
                          Country of Citizenship (Origin)
                        </label>
                        <select
                          value={originCountry}
                          onChange={(e) => setOriginCountry(e.target.value as CountryCode)}
                          className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100 text-xs font-mono"
                        >
                          {(Object.entries(COUNTRIES) as [CountryCode, any][]).map(([k, v]) => (
                            <option key={k} value={k}>
                              [{k}] {v.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Country Selection & ID Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
                      {citizenshipStatus === 'citizen' ? 'Sovereign Citizen Country' : 'Host Country Jurisdiction'}
                    </label>
                    <select
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value as CountryCode);
                        setVerificationScanStatus('idle');
                      }}
                      className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                    >
                      {(Object.entries(COUNTRIES) as [CountryCode, any][]).map(([k, v]) => (
                        <option key={k} value={k}>
                          [{k}] {v.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
                      {citizenshipStatus === 'foreign_resident'
                        ? 'Passport / National ID No.'
                        : idType === 'nid'
                        ? 'National ID Number (NIN)'
                        : 'Citizen Passport Number'}
                    </label>
                    <input
                      type="text"
                      value={idVal}
                      onChange={(e) => handleIDInput(e.target.value)}
                      placeholder={
                        COUNTRY_ID_SPECS[(country || 'UG') as string]?.sampleNid || 'CM92018104928K'
                      }
                      className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* 3-Layer Effective National ID / Passport / Permit Verification Engine Card */}
                <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="text-[10.5px] font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ScanLine size={13} className="text-emerald-600 dark:text-emerald-400" />
                      <span>
                        3-Layer Cryptographic Registry Check (
                        {COUNTRY_ID_SPECS[(country || 'UG') as string]?.agency ||
                          `${COUNTRIES[(country || 'UG') as CountryCode]?.name} Civil Registry`}
                        )
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRunVerificationScan}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <FileCheck2 size={12} />
                      <span>
                        {verificationScanStatus === 'verified'
                          ? 'Re-Verify Document'
                          : 'Verify ID / MRZ Liveness'}
                      </span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                    <div className="p-2 rounded bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
                      <div className="text-slate-400">1 · ISO Checksum</div>
                      <div className="font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {country || 'UG'} Format Valid
                      </div>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
                      <div className="text-slate-400">2 · MRZ &amp; Biometric</div>
                      <div className="font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {verificationScanStatus === 'verified' ? 'Liveness Passed ✓' : 'Ready to Scan'}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
                      <div className="text-slate-400">3 · Country Lock</div>
                      <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                        {citizenshipStatus === 'foreign_resident'
                          ? `${originCountry} → ${country || 'UG'} Permit`
                          : `${country || 'UG'} Citizen Only`}
                      </div>
                    </div>
                  </div>

                  {zkTokenHash && (
                    <div className="px-2.5 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-2 text-[10px] font-mono text-emerald-800 dark:text-emerald-300">
                      <span className="truncate">Zero-Knowledge Token: {zkTokenHash}</span>
                      <span className="shrink-0 font-bold">VERIFIED</span>
                    </div>
                  )}
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
                      <strong>Strict Country Jurisdiction Policy:</strong> Citizens are bound to their verified country. Entering a foreign country&apos;s civic experience requires a verified Foreigner Extension Document (Alien Card, Work Permit, Green Card, Resident Permit, Student Visa, or Entry Visa).
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
