import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COUNTRIES } from '../data/countries';
import { getCountryPitch } from '../data/countryPitches';
import { OFFICIAL_DOCUMENTS, OfficialDocument } from '../data/officialDocs';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  Users,
  Building,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  MapPin,
  AlertCircle,
  Award,
  Zap,
  TrendingUp,
  FileText,
  Layers,
  Send,
  Lock,
  Globe,
  Briefcase,
  Share2,
  Check,
  Building2,
  PhoneCall,
  UserCheck,
  BarChart3,
  ShieldAlert,
  Flag,
  Handshake,
  Mail,
  Calendar,
  FileCheck,
  Download,
  BookOpen,
  ExternalLink,
  Copy,
  Search,
  CheckCheck,
  Eye,
  ScrollText,
  Bookmark,
  Printer,
  Bus,
} from 'lucide-react';
import { InteractiveRoleSandboxGrid } from '../components/InteractiveRoleSandboxGrid';

export const DocsView: React.FC = () => {
  const { go, toast, user, logAudit, openLegalCenter } = useApp();
  const [activeTab, setActiveTab] = useState<'pitch' | 'overview' | 'partner' | 'journeys' | 'architecture'>(() => {
    try {
      const saved = localStorage.getItem('cd_docs_initial_tab');
      if (saved === 'journeys' || saved === 'pitch' || saved === 'overview' || saved === 'partner' || saved === 'architecture') {
        localStorage.removeItem('cd_docs_initial_tab');
        return saved;
      }
    } catch {}
    return 'overview';
  });
  const [journeyRole, setJourneyRole] = useState<'citizen' | 'government' | 'entity'>('citizen');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pitchCountry, setPitchCountry] = useState<string>(user?.country || 'UG');
  
  // Document Reader State
  const [selectedDocId, setSelectedDocId] = useState<string>('concept-note');
  const [docSearch, setDocSearch] = useState<string>('');
  const [copiedDoc, setCopiedDoc] = useState<boolean>(false);

  // Government Partnership Form State
  const [partnerMinistry, setPartnerMinistry] = useState('');
  const [partnerRepName, setPartnerRepName] = useState('');
  const [partnerTitle, setPartnerTitle] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerScope, setPartnerScope] = useState('national');
  const [partnerPopulation, setPartnerPopulation] = useState('500k-2m');
  const [partnerTimeline, setPartnerTimeline] = useState('immediate');
  const [partnerNotes, setPartnerNotes] = useState('');
  const [submittedInquiry, setSubmittedInquiry] = useState<{
    ref: string;
    country: string;
    countryName: string;
    ministry: string;
    repName: string;
    title: string;
    email: string;
    phone: string;
    scope: string;
    population: string;
    timeline: string;
    notes: string;
    ts: string;
  } | null>(null);

  const countryData = getCountryPitch(pitchCountry);

  // Map icons and visuals dynamically for slides
  const baseSlides = countryData.slides.map((s) => {
    let icon = <ShieldCheck className="text-teal-400" size={28} />;
    let visual = null;

    if (s.id === 'problem') {
      icon = <AlertCircle className="text-red-500 dark:text-red-400" size={28} />;
      visual = (
        <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm">
          <div className="text-[10px] mono text-red-600 dark:text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert size={14} /> Traditional System vs CivicDuty {countryData.name}
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] mono">
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 p-2.5 rounded-xl space-y-1">
              <span className="text-red-600 dark:text-red-400 font-bold block text-[10px]">TRADITIONAL</span>
              <p className="text-slate-600 dark:text-slate-400 text-[10px]">Paper petitions, manual queuing, lost files, zero status updates, unmonitored delays.</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-2.5 rounded-xl space-y-1">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold block text-[10px]">CIVICDUTY</span>
              <p className="text-slate-700 dark:text-slate-300 text-[10px]">Geotagged proof, auto-routed to {countryData.level3Title.split('&')[0]}, live SLA timer.</p>
            </div>
          </div>
        </div>
      );
    } else if (s.id === 'solution') {
      icon = <ShieldCheck className="text-teal-600 dark:text-teal-400" size={28} />;
      visual = (
        <div className="bg-white dark:bg-slate-950/80 border border-teal-200 dark:border-teal-500/30 rounded-2xl p-4 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between text-[10px] mono">
            <span className="text-teal-700 dark:text-teal-400 font-bold flex items-center gap-1"><Smartphone size={14} /> Multi-Channel Access</span>
            <span className="text-slate-500 dark:text-slate-400">[{countryData.code}] {countryData.name} Rollout</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] mono">
            <div className="bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/60 p-2 rounded-xl text-teal-800 dark:text-teal-200">
              <span className="font-bold block text-teal-700 dark:text-teal-300">Web App</span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400">Photos, Voice, GPS</span>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 p-2 rounded-xl text-indigo-800 dark:text-indigo-200">
              <span className="font-bold block text-indigo-700 dark:text-indigo-300">USSD Layer</span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400">Feature Phones</span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 p-2 rounded-xl text-amber-800 dark:text-amber-200">
              <span className="font-bold block text-amber-700 dark:text-amber-300">Gov Desk</span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400">Officer Portal</span>
            </div>
          </div>
        </div>
      );
    } else if (s.id === 'hierarchy') {
      icon = <Building2 className="text-amber-600 dark:text-amber-400" size={28} />;
      visual = (
        <div className="bg-white dark:bg-slate-950/90 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-3.5 space-y-2 mono text-[10px] shadow-sm">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-400 font-bold border-b border-amber-200 dark:border-amber-500/20 pb-1.5">
            <span>[{countryData.code}] {countryData.name.toUpperCase()} HIERARCHY MAP</span>
            <span className="text-[9px] bg-amber-100 dark:bg-amber-500/20 px-2 py-0.5 rounded text-amber-800 dark:text-amber-300">ADMIN NODES</span>
          </div>
          <div className="space-y-1.5 text-[10px]">
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 p-2 rounded-xl flex items-center justify-between">
              <span className="font-bold text-amber-900 dark:text-amber-200">Level 1 · {countryData.level1Title}</span>
              <span className="text-amber-700 dark:text-amber-400 text-[9px]">National</span>
            </div>
            <div className="ml-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 p-2 rounded-xl flex items-center justify-between">
              <span className="font-bold text-indigo-900 dark:text-indigo-200">Level 2 · {countryData.level2Title}</span>
              <span className="text-indigo-700 dark:text-indigo-400 text-[9px]">Regional</span>
            </div>
            <div className="ml-6 bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 p-2 rounded-xl flex items-center justify-between">
              <span className="font-bold text-teal-900 dark:text-teal-200">Level 3 · {countryData.level3Title}</span>
              <span className="text-teal-700 dark:text-teal-400 text-[9px]">Grassroots</span>
            </div>
          </div>
        </div>
      );
    } else if (s.id === 'impact') {
      icon = <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={28} />;
      visual = (
        <div className="bg-white dark:bg-slate-950/80 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-sm">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 p-2.5 rounded-xl">
              <span className="text-lg font-black text-emerald-700 dark:text-emerald-400 block">24h–48h</span>
              <span className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase">Target SLA</span>
            </div>
            <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 p-2.5 rounded-xl">
              <span className="text-lg font-black text-teal-700 dark:text-teal-400 block">{countryData.statUnits}</span>
              <span className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase">{countryData.statLabel}</span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 p-2.5 rounded-xl">
              <span className="text-lg font-black text-amber-700 dark:text-amber-400 block">100%</span>
              <span className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase">Audit Proof</span>
            </div>
          </div>
        </div>
      );
    }

    return {
      ...s,
      icon,
      visual,
    };
  });

  // Slide 05: Business Model & Tax Revenue Generation Slide
  const businessSlide = {
    id: 'business',
    tag: '05 · GLOBAL BUSINESS MODEL & TAX REVENUE IMPACT',
    title: `Sovereign SaaS Model: Exporting Civic Tech for Foreign Tax Revenues`,
    subtitle: `CivicDuty is 100% free for citizens. B2G & B2B enterprise subscription licensing across foreign nations creates significant foreign currency inflows & domestic tax revenues for the home country.`,
    color: 'from-amber-500/10 to-emerald-500/5 dark:from-amber-500/20 dark:to-emerald-500/10',
    borderColor: 'border-amber-300 dark:border-amber-500/30',
    icon: <BarChart3 className="text-amber-600 dark:text-amber-400" size={28} />,
    visual: (
      <div className="bg-white dark:bg-slate-950/90 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-[10px] mono text-amber-800 dark:text-amber-300 font-bold">
          <span className="flex items-center gap-1.5"><TrendingUp size={14} className="text-emerald-600 dark:text-emerald-400" /> B2G / B2B Revenue & Tax Engine</span>
          <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-500/30">Foreign Currency Inflow</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] mono">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl">
            <span className="text-emerald-700 dark:text-emerald-400 font-black block text-sm">$50k–$150k/yr</span>
            <span className="text-[8.5px] text-slate-500 dark:text-slate-400">Foreign Country License</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl">
            <span className="text-teal-700 dark:text-teal-300 font-black block text-sm">$15k–$40k/yr</span>
            <span className="text-[8.5px] text-slate-500 dark:text-slate-400">Utility / Corporate Seat</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl">
            <span className="text-amber-700 dark:text-amber-400 font-black block text-sm">30%+ CIT & VAT</span>
            <span className="text-[8.5px] text-slate-500 dark:text-slate-400">Tax Revenue to Treasury</span>
          </div>
        </div>
      </div>
    ),
    points: [
      { label: '100% Free Universal Citizen Access', text: 'Free access on Web and USSD *3030# ensures zero financial barrier for citizens, while corporate CSR perks reward active community engagement.' },
      { label: 'Sovereign Tech Export Asset', text: 'When scaled to 10–50+ African & global governments (Kenya, Nigeria, Ghana, Rwanda, South Africa), annual enterprise SaaS fees flow back to headquarters in Uganda.' },
      { label: 'Substantial Tax Inflow for Ministry & Treasury', text: 'Generates direct foreign exchange earnings, Corporate Income Tax (CIT), B2B VAT, and high-tech engineering PAYE taxes remitted to the National Treasury & URA.' },
    ],
  };

  // Slide 06: Government Partnership & Onboarding Deck Slide
  const partnerSlide = {
    id: 'partner',
    tag: '06 · GOVERNMENT PARTNERSHIP & ONBOARDING',
    title: `Partner With CivicDuty for Government of ${countryData.name}`,
    subtitle: `Formalize a National MOU, initiate a 30-day sandbox pilot, or request an executive briefing for ${countryData.leadMinistry}.`,
    color: 'from-indigo-500/10 to-teal-500/5 dark:from-indigo-500/20 dark:to-teal-500/10',
    borderColor: 'border-indigo-300 dark:border-indigo-500/30',
    icon: <Handshake className="text-indigo-600 dark:text-indigo-400" size={28} />,
    visual: (
      <div className="bg-white dark:bg-slate-950/90 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-[10px] mono text-indigo-800 dark:text-indigo-300 font-bold">
          <span className="flex items-center gap-1.5"><Handshake size={14} className="text-indigo-600 dark:text-indigo-400" /> Fast-Track Government Onboarding</span>
          <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-300 dark:border-indigo-500/30">{countryData.code} Deployment Ready</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] mono">
          <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 p-2.5 rounded-xl space-y-1">
            <span className="text-indigo-800 dark:text-indigo-300 font-bold block">Ministerial Briefing</span>
            <span className="text-slate-600 dark:text-slate-400 text-[9px]">Custom executive presentation tailored for Cabinet & Local Gov Ministers</span>
          </div>
          <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 p-2.5 rounded-xl space-y-1">
            <span className="text-teal-800 dark:text-teal-300 font-bold block">30-Day Sandbox Pilot</span>
            <span className="text-slate-600 dark:text-slate-400 text-[9px]">Zero-cost trial across targeted district or city wards</span>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('partner')}
          className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-lg py-2.5 text-xs uppercase tracking-wider mono flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98]"
        >
          <Handshake size={15} />
          <span>Open Government Partnership Hub</span>
        </button>
      </div>
    ),
    points: [
      { label: 'Direct Ministerial Alignment', text: `Tailored integration with ${countryData.leadMinistry}.` },
      { label: 'Zero Infrastructure Footprint', text: 'Turnkey cloud or sovereign on-premise container deployment within 48 hours.' },
      { label: 'Custom Hierarchy Pre-configured', text: `Pre-mapped to ${countryData.name}'s exact administrative tiers down to local field officers.` },
    ],
  };

  const pitchSlides = [...baseSlides, businessSlide, partnerSlide];

  const handlePartnershipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerMinistry.trim() || !partnerRepName.trim() || !partnerEmail.trim()) {
      toast('Please provide Ministry name, Representative name, and Official Email.', 'amber');
      return;
    }

    const ref = `MOU-${pitchCountry}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const record = {
      ref,
      country: pitchCountry,
      countryName: countryData.name,
      ministry: partnerMinistry.trim(),
      repName: partnerRepName.trim(),
      title: partnerTitle.trim() || 'Government Delegate',
      email: partnerEmail.trim(),
      phone: partnerPhone.trim() || 'N/A',
      scope: partnerScope,
      population: partnerPopulation,
      timeline: partnerTimeline,
      notes: partnerNotes.trim(),
      ts: new Date().toISOString(),
    };

    setSubmittedInquiry(record);
    logAudit(
      'partnership_inquiry',
      ref,
      `Government partnership inquiry submitted by ${record.repName} (${record.title}, ${record.ministry}) for Government of ${countryData.name}. Scope: ${record.scope}.`,
      pitchCountry
    );

    toast(`Partnership Inquiry ${ref} logged! CivicDuty Secretariat notified.`, 'emerald');
  };

  return (
    <div className="p-4 space-y-5 animate-fade-in pb-16 text-slate-800 dark:text-slate-100">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <button
            onClick={() => go('splash')}
            className="flex items-center gap-1 text-[10px] mono text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-bold cursor-pointer"
          >
            <ChevronLeft size={14} /> Back to Home
          </button>

          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
            <button
              type="button"
              onClick={() => openLegalCenter('about')}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 cursor-pointer"
            >
              About CivicDuty
            </button>
            <button
              type="button"
              onClick={() => openLegalCenter('privacy')}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 cursor-pointer"
            >
              Privacy Charter
            </button>
            <button
              type="button"
              onClick={() => openLegalCenter('terms')}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 cursor-pointer"
            >
              Terms of Use
            </button>
            <button
              type="button"
              onClick={() => openLegalCenter('ethics')}
              className="px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 cursor-pointer"
            >
              Ethics Covenant
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="tagline text-teal-700 dark:text-teal-400 mb-0.5 font-bold">National Civic Platform Pitch</div>
            <h2 className="text-[22px] font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">
              CivicDuty Pitch & Architecture
            </h2>
          </div>
          
          {/* Target Government Country Selector - Centered & Polished */}
          <div className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-teal-500/40 py-2 px-3 rounded-2xl shadow-sm mx-auto">
            <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 text-[10px] mono font-bold">
              <Globe size={14} />
              <span>Pitching To:</span>
            </div>
            <select
              value={pitchCountry}
              onChange={(e) => {
                setPitchCountry(e.target.value);
                setCurrentSlide(0);
                toast(`Loaded pitch tailored for Government of ${COUNTRIES[e.target.value]?.name || 'Target Nation'}`);
              }}
              className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold py-1.5 px-3 rounded-xl border border-teal-300 dark:border-teal-500/30 focus:outline-none focus:border-teal-500 cursor-pointer w-full sm:w-auto"
            >
              {Object.entries(COUNTRIES).map(([code, c]) => (
                <option key={code} value={code} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                  [{code}] {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Country Context Banner */}
        <div className="mt-3 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-3 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">{countryData.code}</span>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>Government of {countryData.name} Presentation</span>
                <span className="text-[9px] mono bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 font-bold px-2 py-0.5 rounded-full border border-teal-300 dark:border-teal-500/30">
                  {countryData.code} Tailored
                </span>
              </div>
              <p className="text-[10px] mono text-slate-600 dark:text-slate-400 mt-0.5">
                {countryData.motto}
              </p>
            </div>
          </div>
        </div>

        {/* Brand Advertising & Fleet Sensitization Images */}
        <div
          onClick={() => go('transit_preview')}
          className="mt-2.5 bg-slate-900 border border-emerald-500/50 p-2.5 rounded-2xl flex items-center justify-between gap-2.5 cursor-pointer hover:border-emerald-400 transition-all shadow-md group"
          title="Inspect CivicDuty Brand Advertising, Kayoola Bus & Train Fleet Images"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Bus size={15} />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-black uppercase text-white mono flex items-center gap-1.5">
                <span>Brand Advertising &amp; Fleet Sensitization</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[8px] font-bold">
                  Images
                </span>
              </div>
              <div className="text-[9px] text-slate-300">
                Kayoola EVS Buses, Passenger Train &amp; Transit Billboards Sensitization
              </div>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-emerald-600 group-hover:bg-emerald-500 text-white font-bold text-[9px] mono uppercase flex items-center gap-1 shadow-sm shrink-0">
            <span>View Ads</span>
            <ArrowRight size={10} />
          </div>
        </div>
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 bg-slate-100 dark:bg-slate-900/90 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold mono">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-amber-600 dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ScrollText size={14} />
          <span>Official Documents ({OFFICIAL_DOCUMENTS.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('pitch')}
          className={`py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'pitch'
              ? 'bg-teal-600 dark:bg-teal-500 text-white dark:text-slate-950 shadow-sm font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Award size={14} />
          <span>Pitch Deck</span>
        </button>
        <button
          onClick={() => setActiveTab('partner')}
          className={`py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'partner'
              ? 'bg-indigo-600 dark:bg-indigo-500 text-white dark:text-slate-950 shadow-sm font-black'
              : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300'
          }`}
        >
          <Handshake size={14} />
          <span>Partnership Hub</span>
        </button>
        <button
          onClick={() => setActiveTab('journeys')}
          className={`py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'journeys'
              ? 'bg-teal-600 dark:bg-teal-500 text-white dark:text-slate-950 shadow-sm font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Layers size={14} />
          <span>3 Journeys</span>
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'architecture'
              ? 'bg-teal-600 dark:bg-teal-500 text-white dark:text-slate-950 shadow-sm font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Building2 size={14} />
          <span>{countryData.code} Structure</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 0: OFFICIAL IN-SCREEN DOCUMENTATION & SLIDE CAROUSEL  */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (() => {
        const activeDoc = OFFICIAL_DOCUMENTS.find((d) => d.id === selectedDocId) || OFFICIAL_DOCUMENTS[0];
        const activeDocIndex = OFFICIAL_DOCUMENTS.findIndex((d) => d.id === activeDoc.id);

        const handleCopyDocText = (doc: OfficialDocument) => {
          const fullText = [
            `=================================================================`,
            `${doc.title.toUpperCase()}`,
            `${doc.subtitle}`,
            `Category: ${doc.category} | Version: ${doc.version} | Date: ${doc.date}`,
            `Author: ${doc.author} (${doc.authorTitle}) - ${doc.authorContact}`,
            `=================================================================\n`,
            `SUMMARY:\n${doc.summary}\n`,
            ...doc.sections.map((s) => {
              let sectionText = `-----------------------------------------------------------------\n`;
              if (s.num) sectionText += `[${s.num}] `;
              sectionText += `${s.title.toUpperCase()}\n-----------------------------------------------------------------\n`;
              sectionText += `${s.content}\n`;
              if (s.highlights && s.highlights.length > 0) {
                sectionText += `\nKEY HIGHLIGHTS:\n` + s.highlights.map((h) => `• ${h}`).join('\n') + `\n`;
              }
              if (s.callout) {
                sectionText += `\n[NOTE: ${s.callout.title}]\n${s.callout.text}\n`;
              }
              if (s.table) {
                sectionText += `\n${s.table.headers.join(' | ')}\n`;
                sectionText += s.table.headers.map(() => '---').join(' | ') + '\n';
                sectionText += s.table.rows.map((row) => row.join(' | ')).join('\n') + '\n';
              }
              return sectionText;
            }),
            `\n=================================================================`,
            `CivicDuty Sovereign Service Delivery & Nation Management Infrastructure`,
            `Lead System Architect: Inzama Robin • 0778277900 / 0748338796 • inzamarobin279@gmail.com`,
            `=================================================================`,
          ].join('\n\n');

          if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(fullText);
          }
          setCopiedDoc(true);
          toast(`"${doc.title}" copied to clipboard!`, 'success');
          setTimeout(() => setCopiedDoc(false), 3000);
        };

        const filteredSections = activeDoc.sections.filter((s) => {
          if (!docSearch.trim()) return true;
          const q = docSearch.toLowerCase();
          return (
            s.title.toLowerCase().includes(q) ||
            s.content.toLowerCase().includes(q) ||
            (s.num && s.num.toLowerCase().includes(q)) ||
            (s.highlights && s.highlights.some((h) => h.toLowerCase().includes(q))) ||
            (s.callout && (s.callout.title.toLowerCase().includes(q) || s.callout.text.toLowerCase().includes(q)))
          );
        });

        return (
          <div className="space-y-4">
            {/* Document Slide Carousel Header & Controller */}
            <div className="card p-4 space-y-3 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 dark:border-amber-500/20 pb-3">
                <div>
                  <span className="text-[10px] mono text-amber-800 dark:text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <FileCheck size={14} /> Sovereign Documentation Suite • Direct In-App Reader
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                    Official Document Slide Carousel
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Tap any document slide below to display its full text and diagrams directly on your screen without external downloads.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-center">
                  <button
                    onClick={() => {
                      const prevIdx = activeDocIndex > 0 ? activeDocIndex - 1 : OFFICIAL_DOCUMENTS.length - 1;
                      setSelectedDocId(OFFICIAL_DOCUMENTS[prevIdx].id);
                    }}
                    className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-mono font-bold flex items-center gap-1"
                    title="Previous Document"
                  >
                    <ChevronLeft size={14} />
                    <span className="hidden sm:inline">Prev Doc</span>
                  </button>
                  <span className="text-[10px] mono bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 font-bold px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-500/40">
                    Doc {activeDocIndex + 1} / {OFFICIAL_DOCUMENTS.length}
                  </span>
                  <button
                    onClick={() => {
                      const nextIdx = activeDocIndex < OFFICIAL_DOCUMENTS.length - 1 ? activeDocIndex + 1 : 0;
                      setSelectedDocId(OFFICIAL_DOCUMENTS[nextIdx].id);
                    }}
                    className="p-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs font-mono flex items-center gap-1 shadow-sm"
                    title="Next Document"
                  >
                    <span className="hidden sm:inline">Next Doc</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Responsive Slide Deck of All 7 Documents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 pt-1">
                {OFFICIAL_DOCUMENTS.map((doc, idx) => {
                  const isSelected = doc.id === activeDoc.id;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setSelectedDocId(doc.id);
                        setDocSearch('');
                      }}
                      className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between space-y-2 relative ${
                        isSelected
                          ? 'bg-white dark:bg-slate-900 border-amber-500 dark:border-amber-400 shadow-md ring-2 ring-amber-500/30'
                          : 'bg-white/80 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-600/50 hover:bg-white dark:hover:bg-slate-900 shadow-sm'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[9px] mono font-bold px-2 py-0.5 rounded ${
                              isSelected
                                ? 'bg-amber-500 text-white dark:text-slate-950 font-black'
                                : `${doc.color.badgeBg} ${doc.color.badgeText}`
                            }`}
                          >
                            {doc.category}
                          </span>
                          <span className="text-[9px] mono text-slate-500 flex items-center gap-1">
                            <Clock size={10} /> {doc.readTime}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
                          {doc.title}
                        </h4>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {doc.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2 text-[10px] mono">
                        <span className="text-slate-500 dark:text-slate-400 text-[9px] font-bold">
                          {doc.version}
                        </span>
                        <span
                          className={`font-bold flex items-center gap-1 text-[10px] ${
                            isSelected
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Eye size={12} />
                          <span>{isSelected ? 'READING NOW' : 'Tap to Read'}</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* In-Screen Document Viewer for Active Selected Document */}
            <div className="p-5 space-y-6 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl text-slate-800 dark:text-slate-200">
              {/* Document Letterhead & Metadata Header */}
              <div className="border-b border-[#e3e6ea] dark:border-[#262b36] pb-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-800 dark:text-amber-400 text-[10px] mono font-bold border border-amber-500/30 flex items-center gap-1.5">
                      <FileText size={12} /> {activeDoc.category}
                    </span>
                    <span className="text-[10px] mono text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
                      {activeDoc.version}
                    </span>
                    <span className="text-[10px] mono text-slate-500 hidden sm:inline">
                      {activeDoc.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyDocText(activeDoc)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                      title="Copy full document text"
                    >
                      {copiedDoc ? (
                        <>
                          <CheckCheck size={14} className="text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy Document</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono transition-all hidden sm:flex items-center gap-1"
                      title="Print or Save as PDF via browser"
                    >
                      <Printer size={14} />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    {activeDoc.title}
                  </h1>
                  <p className="text-xs text-teal-700 dark:text-teal-400 font-mono font-bold">
                    {activeDoc.subtitle}
                  </p>
                </div>

                {/* Author & Document Summary Callout */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] mono text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      Author: {activeDoc.author} ({activeDoc.authorTitle})
                    </span>
                    <span className="text-[10px] text-slate-500">Contact: {activeDoc.authorContact}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-xs">
                    <strong>Executive Context:</strong> {activeDoc.summary}
                  </p>
                </div>

                {/* In-Document Search & Quick Jump Section Navigator */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="relative flex-1">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        value={docSearch}
                        onChange={(e) => setDocSearch(e.target.value)}
                        placeholder={`Search keywords inside "${activeDoc.title}"...`}
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                      />
                    </div>
                    {docSearch && (
                      <button
                        onClick={() => setDocSearch('')}
                        className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold hover:underline self-start sm:self-center"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>

                  {/* Section Navigator Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] mono">
                    <span className="text-slate-500 font-bold whitespace-nowrap">Sections:</span>
                    {activeDoc.sections.map((s, idx) => (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 hover:bg-amber-100 dark:hover:bg-amber-950/60 hover:text-amber-900 dark:hover:text-amber-300 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 whitespace-nowrap transition-all"
                      >
                        {s.num ? `${s.num}. ` : `${idx + 1}. `}
                        {s.title.split(':')[0].substring(0, 20)}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rendered Document Sections */}
              <div className="space-y-6">
                {filteredSections.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 mono text-xs space-y-2">
                    <p>No sections match your search filter &quot;{docSearch}&quot;.</p>
                    <button
                      onClick={() => setDocSearch('')}
                      className="px-3 py-1 bg-amber-600 text-white rounded-lg text-[11px] font-bold"
                    >
                      Reset Search
                    </button>
                  </div>
                ) : (
                  filteredSections.map((sec, sIdx) => (
                    <div
                      key={sec.id}
                      id={sec.id}
                      className="space-y-3 text-xs leading-relaxed scroll-mt-24 border-b border-slate-100 dark:border-slate-900 pb-5 last:border-b-0"
                    >
                      <h3 className="text-sm font-black uppercase text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-1">
                        {sec.num ? (
                          <span className="text-amber-600 dark:text-amber-400 mono">{sec.num}.</span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 mono">§{sIdx + 1}</span>
                        )}
                        <span>{sec.title}</span>
                      </h3>

                      <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                        {sec.content}
                      </div>

                      {/* Callout box if present */}
                      {sec.callout && (
                        <div
                          className={`p-3.5 rounded-xl border space-y-1 ${
                            sec.callout.type === 'indigo'
                              ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/50 text-indigo-950 dark:text-indigo-200'
                              : sec.callout.type === 'emerald'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-950 dark:text-emerald-200'
                              : sec.callout.type === 'teal'
                              ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-900/50 text-teal-950 dark:text-teal-200'
                              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-200'
                          }`}
                        >
                          <span className="font-bold text-[11px] mono uppercase block">
                            {sec.callout.title}
                          </span>
                          <p className="text-[11px] font-sans leading-relaxed">{sec.callout.text}</p>
                        </div>
                      )}

                      {/* Highlights if present */}
                      {sec.highlights && sec.highlights.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] mono font-bold uppercase tracking-wider text-slate-500">
                            Key Specifications & Takeaways:
                          </span>
                          <ul className="space-y-1">
                            {sec.highlights.map((h, hIdx) => (
                              <li
                                key={hIdx}
                                className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-[11px]"
                              >
                                <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Structured table if present */}
                      {sec.table && (
                        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl my-2">
                          <table className="w-full text-left mono text-[10px]">
                            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold">
                              <tr>
                                {sec.table.headers.map((th, thIdx) => (
                                  <th key={thIdx} className="p-2.5">
                                    {th}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                              {sec.table.rows.map((r, rIdx) => (
                                <tr
                                  key={rIdx}
                                  className={
                                    rIdx % 2 === 0
                                      ? 'bg-white dark:bg-slate-950'
                                      : 'bg-slate-50 dark:bg-slate-900/50'
                                  }
                                >
                                  {r.map((cell, cIdx) => (
                                    <td
                                      key={cIdx}
                                      className={`p-2.5 ${
                                        cIdx === 0
                                          ? 'font-bold text-slate-900 dark:text-slate-100'
                                          : 'text-slate-600 dark:text-slate-400'
                                      }`}
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Author & Institutional Signoff Box */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mono">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">
                    Lead System Architect: Inzama Robin
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Phone: 0778277900 / 0748338796 • Email: inzamarobin279@gmail.com
                  </span>
                  <span className="text-[9px] text-teal-700 dark:text-teal-400 block mt-0.5">
                    CivicDuty Sovereign Nation Management Platform • Kampala, Uganda
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyDocText(activeDoc)}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-1.5 w-fit shadow-sm transition-all text-xs"
                  >
                    <Copy size={13} />
                    <span>Copy Full Document</span>
                  </button>
                </div>
              </div>

              {/* Next/Prev Document Quick Switcher Footer */}
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 text-xs mono">
                <button
                  onClick={() => {
                    const prevIdx = activeDocIndex > 0 ? activeDocIndex - 1 : OFFICIAL_DOCUMENTS.length - 1;
                    setSelectedDocId(OFFICIAL_DOCUMENTS[prevIdx].id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5 transition-all"
                >
                  <ChevronLeft size={14} />
                  <span>Previous: {OFFICIAL_DOCUMENTS[activeDocIndex > 0 ? activeDocIndex - 1 : OFFICIAL_DOCUMENTS.length - 1].category}</span>
                </button>
                <button
                  onClick={() => {
                    const nextIdx = activeDocIndex < OFFICIAL_DOCUMENTS.length - 1 ? activeDocIndex + 1 : 0;
                    setSelectedDocId(OFFICIAL_DOCUMENTS[nextIdx].id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-black flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Next: {OFFICIAL_DOCUMENTS[activeDocIndex < OFFICIAL_DOCUMENTS.length - 1 ? activeDocIndex + 1 : 0].category}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================= */}
      {/* TAB 1: PICTORIAL PITCH SLIDES DECK                        */}
      {/* ========================================================= */}
      {activeTab === 'pitch' && (
        <div className="space-y-4">
          {/* Pitch Slide Controller */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl shadow-sm">
            <span className="text-[10px] mono text-teal-700 dark:text-teal-400 font-bold flex items-center gap-1.5">
              <span>[{countryData.code}] Slide {currentSlide + 1} of {pitchSlides.length}</span>
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : pitchSlides.length - 1))}
                className="p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-mono font-bold flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev < pitchSlides.length - 1 ? prev + 1 : 0))}
                className="p-1.5 bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 rounded-lg text-xs font-mono font-black flex items-center gap-1"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Active Pitch Slide */}
          {(() => {
            const slide = pitchSlides[currentSlide];
            return (
              <div className={`card p-5 space-y-4 border bg-white dark:bg-[#161a22] ${slide.borderColor} rounded-xl shadow-xs transition-all`}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] mono text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest bg-white/80 dark:bg-slate-950/60 px-2.5 py-1 rounded-full border border-teal-300 dark:border-teal-500/30">
                      {slide.tag}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-snug pt-1">
                      {slide.title}
                    </h3>
                  </div>
                  <div className="p-2.5 bg-white/90 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    {slide.icon}
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                  {slide.subtitle}
                </p>

                {/* Visual Graphic Element */}
                {slide.visual}

                {/* Key Bullet Points */}
                <div className="space-y-2 pt-1">
                  {slide.points.map((pt, idx) => (
                    <div key={idx} className="bg-white/80 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 p-3 rounded-xl flex items-start gap-2.5 shadow-sm">
                      <CheckCircle2 size={16} className="text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-teal-900 dark:text-teal-200 block">{pt.label}</span>
                        <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{pt.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* All Slide Thumbnails Quick Nav */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {pitchSlides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`p-2 rounded-xl text-[9px] mono font-bold text-center border transition-all ${
                  currentSlide === idx
                    ? 'bg-teal-100 dark:bg-teal-500/20 border-teal-500 dark:border-teal-400 text-teal-900 dark:text-teal-300 shadow-sm'
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                0{idx + 1}. {s.id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: GOVERNMENT PARTNERSHIP & COLLABORATION HUB        */}
      {/* ========================================================= */}
      {activeTab === 'partner' && (
        <div className="space-y-4 animate-fade-in">
          {/* Executive Value Proposition Header */}
          <div className="card p-4 space-y-3 border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] rounded-xl shadow-xs">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[9px] mono text-indigo-800 dark:text-indigo-300 font-bold uppercase tracking-widest bg-indigo-100 dark:bg-indigo-500/20 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/30 inline-flex items-center gap-1.5">
                  <Handshake size={12} /> Ministerial Partnership Hub
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-snug pt-1">
                  Partner With CivicDuty · Government of {countryData.name}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">{countryData.code}</span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
              Empower {countryData.name}’s public administration with a data-sovereign, turnkey civic engagement engine. Aligned directly with {countryData.leadMinistry}.
            </p>

            {/* 4 Core Partnership Pillars */}
            <div className="grid grid-cols-2 gap-2 text-[10px] mono pt-1">
              <div className="bg-white dark:bg-slate-950/80 border border-indigo-200 dark:border-indigo-500/30 p-2.5 rounded-xl space-y-1 shadow-sm">
                <span className="text-indigo-800 dark:text-indigo-300 font-bold block flex items-center gap-1">
                  <ShieldCheck size={13} className="text-indigo-600 dark:text-indigo-400" /> Data Sovereignty
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[9px]">Localized node binding & ISO-compliant encrypted audit trails</span>
              </div>
              <div className="bg-white dark:bg-slate-950/80 border border-teal-200 dark:border-teal-500/30 p-2.5 rounded-xl space-y-1 shadow-sm">
                <span className="text-teal-800 dark:text-teal-300 font-bold block flex items-center gap-1">
                  <Zap size={13} className="text-teal-600 dark:text-teal-400" /> Rapid Onboarding
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[9px]">Zero-hardware footprint with 48h USSD & Web desk setup</span>
              </div>
              <div className="bg-white dark:bg-slate-950/80 border border-amber-200 dark:border-amber-500/30 p-2.5 rounded-xl space-y-1 shadow-sm">
                <span className="text-amber-800 dark:text-amber-300 font-bold block flex items-center gap-1">
                  <Clock size={13} className="text-amber-600 dark:text-amber-400" /> Enforceable SLAs
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[9px]">24h–72h ticket countdown with automatic escalation rules</span>
              </div>
              <div className="bg-white dark:bg-slate-950/80 border border-emerald-200 dark:border-emerald-500/30 p-2.5 rounded-xl space-y-1 shadow-sm">
                <span className="text-emerald-800 dark:text-emerald-300 font-bold block flex items-center gap-1">
                  <Building2 size={13} className="text-emerald-600 dark:text-emerald-400" /> e-Gov Integration
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[9px]">APIs for National ID validation & utility CRMs ({countryData.agenciesUtility[0] || 'Utilities'})</span>
              </div>
            </div>
          </div>

          {/* Interactive Form or Submitted Certificate */}
          {submittedInquiry ? (
            <div className="card p-5 space-y-4 border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 rounded-xl">
                    <FileCheck size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Official Partnership Pledge Logged</h3>
                    <p className="text-[10px] mono text-emerald-700 dark:text-emerald-400 font-bold">Reference ID: {submittedInquiry.ref}</p>
                  </div>
                </div>
                <span className="chip ch-resolved">Pledged</span>
              </div>

              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl space-y-2 font-mono text-[11px] shadow-sm">
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-[10px]">
                  <div>
                    <span className="text-slate-500 uppercase block text-[9px] font-bold">Target Nation</span>
                    <span className="text-slate-900 dark:text-slate-200 font-bold">{submittedInquiry.countryName} ({submittedInquiry.country})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase block text-[9px] font-bold">Pledged Institution</span>
                    <span className="text-slate-900 dark:text-slate-200 font-bold">{submittedInquiry.ministry}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-500 uppercase block text-[9px] font-bold">Official Representative</span>
                    <span className="text-slate-900 dark:text-slate-200 font-bold">{submittedInquiry.repName}</span>
                    <span className="text-slate-600 dark:text-slate-400 block text-[9px]">{submittedInquiry.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase block text-[9px] font-bold">Contact Email & Phone</span>
                    <span className="text-teal-700 dark:text-teal-300 block font-bold text-[9px]">{submittedInquiry.email}</span>
                    <span className="text-slate-600 dark:text-slate-400 block text-[9px]">{submittedInquiry.phone}</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] space-y-1">
                  <span className="text-indigo-800 dark:text-indigo-300 font-bold block">Scope & Timeline</span>
                  <p className="text-slate-800 dark:text-slate-300">
                    Scope: <span className="text-teal-700 dark:text-teal-300 font-bold">{submittedInquiry.scope.toUpperCase()}</span> · Target Coverage: <span className="text-amber-800 dark:text-amber-300 font-bold">{submittedInquiry.population}</span> · Priority: <span className="text-emerald-700 dark:text-emerald-300 font-bold">{submittedInquiry.timeline.toUpperCase()}</span>
                  </p>
                  {submittedInquiry.notes && (
                    <p className="text-slate-600 dark:text-slate-400 text-[9.5px] pt-1 border-t border-slate-200 dark:border-slate-800/80">
                      Notes: {submittedInquiry.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Download / Copy Briefing Summary */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const text = `CIVICDUTY PARTNERSHIP BRIEFING PLEDGE (${submittedInquiry.ref})\nTarget: Government of ${submittedInquiry.countryName}\nInstitution: ${submittedInquiry.ministry}\nDelegate: ${submittedInquiry.repName} (${submittedInquiry.title})\nEmail: ${submittedInquiry.email}\nScope: ${submittedInquiry.scope}\nPopulation: ${submittedInquiry.population}\nTimeline: ${submittedInquiry.timeline}\nLogged At: ${submittedInquiry.ts}`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(text);
                      toast('Copied Partnership Briefing Pledge summary to clipboard!');
                    }
                  }}
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Share2 size={14} /> Copy Pledge Briefing
                </button>
                <button
                  onClick={() => setSubmittedInquiry(null)}
                  className="bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 py-2.5 px-4 rounded-xl text-xs font-mono font-black transition-all shadow-sm"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            /* Inquiry Form */
            <form onSubmit={handlePartnershipSubmit} className="card p-4 space-y-3.5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/90 rounded-2xl shadow-sm">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2.5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
                    <Handshake size={15} className="text-indigo-600 dark:text-indigo-400" /> Direct Government Collaboration Form
                  </h4>
                  <p className="text-[10px] mono text-slate-500 dark:text-slate-400">
                    Communicate ministerial requirements to the CivicDuty Secretariat for Government of {countryData.name}.
                  </p>
                </div>
                <span className="text-[9px] mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-teal-800 dark:text-teal-300 font-bold px-2 py-0.5 rounded">
                  [{pitchCountry}]
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] mono uppercase text-slate-500 dark:text-slate-400 font-bold block">
                    Ministry / Government Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerMinistry}
                    onChange={(e) => setPartnerMinistry(e.target.value)}
                    placeholder={`e.g. ${countryData.leadMinistry.split('&')[0]}`}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-2.5 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] mono uppercase text-slate-500 dark:text-slate-400 font-bold block">
                    Official Representative Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerRepName}
                    onChange={(e) => setPartnerRepName(e.target.value)}
                    placeholder="e.g. Dr. Brenda Namaganda"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-2.5 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] mono uppercase text-slate-500 dark:text-slate-400 font-bold block">
                    Official Title / Designation
                  </label>
                  <input
                    type="text"
                    value={partnerTitle}
                    onChange={(e) => setPartnerTitle(e.target.value)}
                    placeholder="e.g. Permanent Secretary / Director of ICT / Mayor"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-2.5 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] mono uppercase text-slate-500 dark:text-slate-400 font-bold block">
                    Official Email (.gov / .go or institutional) *
                  </label>
                  <input
                    type="email"
                    required
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    placeholder="e.g. ps@molg.go.ug or secretary@kigali.gov.rw"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-2.5 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] mono uppercase text-slate-500 dark:text-slate-400 font-bold block">
                    Phone / Direct Hotline
                  </label>
                  <input
                    type="tel"
                    value={partnerPhone}
                    onChange={(e) => setPartnerPhone(e.target.value)}
                    placeholder="+256 / +254 / +250 official contact"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-2.5 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] mono uppercase text-slate-500 dark:text-slate-400 font-bold block">
                    Partnership Scope & Objective
                  </label>
                  <select
                    value={partnerScope}
                    onChange={(e) => setPartnerScope(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-2.5 font-mono focus:outline-none focus:border-indigo-500"
                  >
                    <option value="national">Whole-of-Government National Rollout</option>
                    <option value="regional">City / Municipal Council Pilot</option>
                    <option value="utility">Public Utility Integration ({countryData.agenciesUtility.slice(0, 2).join(', ')})</option>
                    <option value="whistleblower">Anti-Corruption & Whistleblower Pipeline (IGG/Ombudsman)</option>
                    <option value="briefing">Request Executive Ministerial Briefing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] mono uppercase text-slate-500 dark:text-slate-400 font-bold block">
                    Estimated Target Citizen Coverage
                  </label>
                  <select
                    value={partnerPopulation}
                    onChange={(e) => setPartnerPopulation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-2.5 font-mono focus:outline-none focus:border-indigo-500"
                  >
                    <option value="500k-2m">500,000 – 2,000,000 (City / Metro)</option>
                    <option value="2m-10m">2,000,000 – 10,000,000 (Regional State)</option>
                    <option value="10m+">10,000,000+ (Whole Nation Rollout)</option>
                    <option value="pilot">&lt; 500,000 (Targeted Parish/Ward Pilot)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] mono uppercase text-slate-500 dark:text-slate-400 font-bold block">
                    Implementation Timeline / Priority
                  </label>
                  <select
                    value={partnerTimeline}
                    onChange={(e) => setPartnerTimeline(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-2.5 font-mono focus:outline-none focus:border-indigo-500"
                  >
                    <option value="immediate">Immediate Fast-Track (30-Day Sandbox)</option>
                    <option value="3months">Within 3 Months</option>
                    <option value="fy2026">FY2026/2027 Annual Budget Cycle</option>
                    <option value="exploratory">Exploratory Consultation</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] mono uppercase text-slate-500 dark:text-slate-400 font-bold block">
                  Specific Requirements or Notes
                </label>
                <textarea
                  rows={2}
                  value={partnerNotes}
                  onChange={(e) => setPartnerNotes(e.target.value)}
                  placeholder={`Mention specific policy goals, data sovereignty guidelines, or special USSD code requests for ${countryData.name}...`}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-2.5 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-lg py-3 text-xs uppercase tracking-wider mono flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98]"
              >
                <Handshake size={16} />
                <span>Submit Collaboration Interest & Request MOU Briefing</span>
              </button>
            </form>
          )}

          {/* Direct Liaison & Secretariat Section */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 text-[10px] mono">
              <span className="text-indigo-800 dark:text-indigo-400 font-bold uppercase flex items-center gap-1.5">
                <Mail size={14} /> CivicDuty Government Relations Secretariat
              </span>
              <span className="text-slate-500 dark:text-slate-400">[{countryData.code}] Direct Channel</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] mono">
              <div className="bg-slate-50 dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-900 dark:text-slate-200 font-bold block">Official Liaison Email</span>
                <span className="text-teal-700 dark:text-teal-300 font-bold block">gov-partnerships@civicduty.org</span>
                <p className="text-[9px] text-slate-500 dark:text-slate-400">Direct inbox for Permanent Secretaries, Governors & Mayors.</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-900 dark:text-slate-200 font-bold block">Senior Delegate Hotline</span>
                <span className="text-indigo-700 dark:text-indigo-300 font-bold block">+256 (0) 414 550 100 / +250 788 123 456</span>
                <p className="text-[9px] text-slate-500 dark:text-slate-400">Encrypted WhatsApp & telephone liaison for executive scheduling.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: USER JOURNEY MAPS & 6 LIVE ROLE SIMULATIONS        */}
      {/* ========================================================= */}
      {activeTab === 'journeys' && (
        <div className="space-y-4">
          {/* Relocated Interactive Role Sandbox (6 Live Role Simulations) */}
          <InteractiveRoleSandboxGrid countryCode={pitchCountry as any} />

          {/* User Category Selector */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <button
              onClick={() => setJourneyRole('citizen')}
              className={`p-3 rounded-xl border transition-colors text-left flex flex-col justify-between cursor-pointer ${
                journeyRole === 'citizen'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                  : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 hover:border-slate-400'
              }`}
            >
              <Users size={18} className={journeyRole === 'citizen' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
              <div className="mt-2">
                <p className="text-xs font-bold uppercase tracking-wider">1. Citizen / Consumer</p>
                <p className="text-[9px] mono text-slate-500 dark:text-slate-400">Service Consumer</p>
              </div>
            </button>

            <button
              onClick={() => setJourneyRole('government')}
              className={`p-3 rounded-xl border transition-colors text-left flex flex-col justify-between cursor-pointer ${
                journeyRole === 'government'
                  ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-900 dark:text-indigo-200'
                  : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 hover:border-slate-400'
              }`}
            >
              <Building size={18} className={journeyRole === 'government' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
              <div className="mt-2">
                <p className="text-xs font-bold uppercase tracking-wider">2. Government</p>
                <p className="text-[9px] mono text-slate-500 dark:text-slate-400">State & Regulator</p>
              </div>
            </button>

            <button
              onClick={() => setJourneyRole('entity')}
              className={`p-3 rounded-xl border transition-colors text-left flex flex-col justify-between cursor-pointer ${
                journeyRole === 'entity'
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200'
                  : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 hover:border-slate-400'
              }`}
            >
              <Briefcase size={18} className={journeyRole === 'entity' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'} />
              <div className="mt-2">
                <p className="text-xs font-bold uppercase tracking-wider">3. Entity Desk</p>
                <p className="text-[9px] mono text-slate-500 dark:text-slate-400">Service Provider</p>
              </div>
            </button>
          </div>

          {/* Detailed Journey Steps Display */}
          {journeyRole === 'citizen' && (
            <div className="card p-4 space-y-4 border-teal-200 dark:border-teal-500/30 bg-teal-50/40 dark:bg-teal-950/10 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between border-b border-teal-200 dark:border-teal-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 rounded-xl">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Citizen & Consumer Journey</h3>
                    <p className="text-[10px] mono text-teal-700 dark:text-teal-400">The Service Consumer & Stakeholder in {countryData.name}</p>
                  </div>
                </div>
                <span className="text-[9px] mono bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 font-bold px-2.5 py-1 rounded-full border border-teal-300 dark:border-teal-500/40">
                  {countryData.idLabel}
                </span>
              </div>

              {/* Steps timeline */}
              <div className="space-y-3.5 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-teal-300 dark:before:bg-teal-500/30">
                {[
                  {
                    num: '01',
                    title: 'Onboard & Pin Monitored Entities',
                    desc: `Citizen registers with ${countryData.idLabel} or phone and pins their local schools, clinics, utilities, banks, and parish desks.`,
                    detail: 'Accessible via Web App or feature phone USSD layer.',
                    icon: <UserCheck size={16} className="text-teal-700 dark:text-teal-300" />,
                  },
                  {
                    num: '02',
                    title: 'Submit Service Deficit or Praise Report',
                    desc: 'Report water outages, food hygiene breaches, billing errors, or road faults directly to the responsible entity or department wall.',
                    detail: 'Auto-captures GPS location & timestamp for tamper-proof filing.',
                    icon: <Send size={16} className="text-teal-700 dark:text-teal-300" />,
                  },
                  {
                    num: '03',
                    title: 'Track Live Provider SLA Countdown',
                    desc: 'Watch the published SLA response timer count down. See which provider officer or desk is actively handling the ticket.',
                    detail: 'If unattended, auto-escalates to executive regulators and public index.',
                    icon: <Clock size={16} className="text-teal-700 dark:text-teal-300" />,
                  },
                  {
                    num: '04',
                    title: 'Inspect Proof & Rate Provider Trust Score',
                    desc: 'Provider uploads timestamped photo proof or official resolution. Citizen verifies satisfaction to close ticket.',
                    detail: 'Ticket CANNOT close until citizen confirms satisfaction.',
                    icon: <CheckCircle2 size={16} className="text-teal-700 dark:text-teal-300" />,
                  },
                ].map((s, idx) => (
                  <div key={idx} className="flex gap-3 relative z-10">
                    <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-950 border border-teal-400 dark:border-teal-500/50 text-teal-800 dark:text-teal-300 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                      {s.num}
                    </div>
                    <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex-1 space-y-1 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
                          {s.icon} {s.title}
                        </span>
                        <span className="text-[8px] mono text-slate-500 uppercase">Step {idx + 1}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{s.desc}</p>
                      <p className="text-[9.5px] mono text-teal-700 dark:text-teal-400/90 pt-0.5">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => go('ob1')}
                className="w-full bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-black rounded-xl py-3 text-xs uppercase tracking-wider mono flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
              >
                <span>Try Citizen Onboarding Flow</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          {journeyRole === 'government' && (
            <div className="card p-4 space-y-4 border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/40 dark:bg-indigo-950/10 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between border-b border-indigo-200 dark:border-indigo-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 rounded-xl">
                    <Building size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Government & Regulator Journey</h3>
                    <p className="text-[10px] mono text-indigo-700 dark:text-indigo-400">Public Service Delivery & Statutory Supervision in {countryData.name}</p>
                  </div>
                </div>
                <span className="text-[9px] mono bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 font-bold px-2.5 py-1 rounded-full border border-indigo-300 dark:border-indigo-500/40">
                  Official Mandate
                </span>
              </div>

              {/* Steps timeline */}
              <div className="space-y-3.5 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-indigo-300 dark:before:bg-indigo-500/30">
                {[
                  {
                    num: '01',
                    title: 'Mount Desk via Single-Use Security Code',
                    desc: `Government officer or regulator logs in using official credentials (e.g. ${countryData.code}-DESK-ADMIN).`,
                    detail: 'Loads jurisdictional queues, supervisory dashboards, and audit logs.',
                    icon: <Lock size={16} className="text-indigo-700 dark:text-indigo-300" />,
                  },
                  {
                    num: '02',
                    title: 'Auto-Routed Geotagged Inbox & Supervision',
                    desc: 'Citizen reports land on specific jurisdiction desks with urgency indicators, GPS pins, and regulatory compliance flags.',
                    detail: 'Zero lost paperwork. 100% transparent public audit trail.',
                    icon: <Layers size={16} className="text-indigo-700 dark:text-indigo-300" />,
                  },
                  {
                    num: '03',
                    title: 'Dispatch Field Officers & Enforce Standards',
                    desc: 'Assign field engineers, health inspectors, or parish caseworkers to resolve civic defects or audit non-compliant entities.',
                    detail: 'Monitors resolution percentage against statutory SLA standards.',
                    icon: <Users size={16} className="text-indigo-700 dark:text-indigo-300" />,
                  },
                  {
                    num: '04',
                    title: 'Upload Photo Proof of Work & Close Ticket',
                    desc: 'Field officer completes repair and attaches timestamped photo evidence for citizen verification.',
                    detail: 'Builds officer merit ranking and maintains public institutional accountability.',
                    icon: <Award size={16} className="text-indigo-700 dark:text-indigo-300" />,
                  },
                ].map((s, idx) => (
                  <div key={idx} className="flex gap-3 relative z-10">
                    <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-950 border border-indigo-400 dark:border-indigo-500/50 text-indigo-800 dark:text-indigo-300 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                      {s.num}
                    </div>
                    <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex-1 space-y-1 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
                          {s.icon} {s.title}
                        </span>
                        <span className="text-[8px] mono text-slate-500 uppercase">Step {idx + 1}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{s.desc}</p>
                      <p className="text-[9.5px] mono text-indigo-700 dark:text-indigo-400/90 pt-0.5">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => go('ob2')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white dark:text-slate-950 font-black rounded-xl py-3 text-xs uppercase tracking-wider mono flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
              >
                <span>Mount Government Desk</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          {journeyRole === 'entity' && (
            <div className="card p-4 space-y-4 border-amber-200 dark:border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/10 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between border-b border-amber-200 dark:border-amber-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 rounded-xl">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Registered Entity Journey (Service Providers & Businesses)</h3>
                    <p className="text-[10px] mono text-amber-800 dark:text-amber-400">Retailers, Bars, Chemists, Transit SACCOs, Schools, Healthcare, Utilities & Enterprises in {countryData.name}</p>
                  </div>
                </div>
                <span className="text-[9px] mono bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-500/40">
                  Provider & Business Desk
                </span>
              </div>

              {/* Steps timeline */}
              <div className="space-y-3.5 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-amber-300 dark:before:bg-amber-500/30">
                {[
                  {
                    num: '01',
                    title: 'Declare Professional Identity & Sector Typology',
                    desc: 'Owners, General Managers, Pharmacists, Bar Proprietors, and Engineers register their business sector, typology, and professional title with exact "Other" customization.',
                    detail: 'Captures precise professional credentials, official tax/license ID, and initial seat quota.',
                    icon: <Building2 size={16} className="text-amber-800 dark:text-amber-300" />,
                  },
                  {
                    num: '02',
                    title: 'Create Custom Roles & Mint Staff Access Passes',
                    desc: 'Define custom operational roles with granular permissions (review replies, ticket resolutions, bulletins, billing) and mint single-use staff passes with 1-click WhatsApp/SMS dispatch.',
                    detail: 'Dedicated non-geographic team layout allows assigning staff to specific duty stations, shifts, and custom permissions.',
                    icon: <Users size={16} className="text-amber-800 dark:text-amber-300" />,
                  },
                  {
                    num: '03',
                    title: 'Receive, Triage & Resolve Consumer Reports',
                    desc: 'Citizens submit feedback, service deficits, billing glitches, or food hygiene tickets directly to your verified desk.',
                    detail: 'Investigate, communicate directly with consumers, and attach timestamped resolution proof.',
                    icon: <Layers size={16} className="text-amber-800 dark:text-amber-300" />,
                  },
                  {
                    num: '04',
                    title: 'Broadcast Service Advisories & Build Public Trust Score',
                    desc: 'Post verified operational advisories to patrons and maintain SLA resolution speeds to elevate your public institutional trust score.',
                    detail: 'Complies with statutory supervisory authorities (UNBS, NDA, UCC, BoU, MoES).',
                    icon: <ShieldCheck size={16} className="text-amber-800 dark:text-amber-300" />,
                  },
                ].map((s, idx) => (
                  <div key={idx} className="flex gap-3 relative z-10">
                    <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-950 border border-amber-400 dark:border-amber-500/50 text-amber-800 dark:text-amber-300 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                      {s.num}
                    </div>
                    <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex-1 space-y-1 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
                          {s.icon} {s.title}
                        </span>
                        <span className="text-[8px] mono text-slate-500 uppercase">Step {idx + 1}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{s.desc}</p>
                      <p className="text-[9.5px] mono text-amber-800 dark:text-amber-400/90 pt-0.5">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => go('entity')}
                className="w-full bg-amber-600 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-black rounded-xl py-3 text-xs uppercase tracking-wider mono flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
              >
                <span>Register Provider / Business / Utility</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: DYNAMIC COUNTRY ARCHITECTURE MAP                   */}
      {/* ========================================================= */}
      {activeTab === 'architecture' && (
        <div className="space-y-4">
          <div className="card p-4 space-y-3.5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div>
                <span className="text-[9px] mono text-teal-700 dark:text-teal-400 font-bold uppercase tracking-widest">
                  [{countryData.code}] {countryData.name} Administrative Hierarchy
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">{countryData.motto}</h3>
              </div>
              <Globe className="text-teal-600 dark:text-teal-400" size={22} />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              CivicDuty maps 1:1 to {countryData.name}’s administrative structure, connecting the central government level down to local field officers and USSD users.
            </p>

            <div className="space-y-2.5 font-mono text-[11px]">
              {countryData.hierarchy.map((h, idx) => (
                <div
                  key={idx}
                  className={`bg-slate-50 dark:bg-slate-900 border ${h.borderColor} p-3 rounded-xl space-y-1 shadow-sm ${
                    idx === 1 ? 'ml-3' : idx === 2 ? 'ml-6' : idx === 3 ? 'ml-9' : ''
                  }`}
                >
                  <div className={`flex items-center justify-between ${h.textColor} font-bold`}>
                    <span>{h.level} · {h.title}</span>
                    <span className={`text-[9px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded ${h.textColor}`}>
                      {h.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">
                    {h.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-2 shadow-sm">
            <p className="text-[10px] mono text-teal-700 dark:text-teal-400 font-bold uppercase tracking-wider">
              [{countryData.code}] Public Utilities & Civil Entities Integrated
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] mono">
              <div className="bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-900 dark:text-slate-200 font-bold block">Civil Authorities</span>
                <span className="text-slate-600 dark:text-slate-400 text-[9px]">{countryData.agenciesCivic.join(', ')}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-900 dark:text-slate-200 font-bold block">Essential Utilities</span>
                <span className="text-slate-600 dark:text-slate-400 text-[9px]">{countryData.agenciesUtility.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share / Pitch Action Footer */}
      <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-4 rounded-xl space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              Pitch to Government of {countryData.name}
            </h4>
            <p className="text-[10px] mono text-slate-600 dark:text-slate-400">
              Share Custom CivicDuty {countryData.name} Proposal
            </p>
          </div>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(countryData.proposalText);
                toast(`Copied ${countryData.name} Government Proposal to clipboard!`);
              }
            }}
            className="bg-teal-100 dark:bg-teal-500/20 border border-teal-300 dark:border-teal-500/40 text-teal-800 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-500/30 p-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
          >
            <Share2 size={14} /> Copy Proposal
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => setActiveTab('partner')}
            className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white dark:text-slate-950 font-black rounded-xl py-3 text-xs uppercase tracking-wider mono flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98]"
          >
            <Handshake size={15} />
            <span>Partner With CivicDuty</span>
          </button>
          <button
            onClick={() => go('ob1')}
            className="bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-black rounded-xl py-3 text-xs uppercase tracking-wider mono flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98]"
          >
            <span>Citizen Portal</span>
            <ArrowRight size={14} />
          </button>
          <button
            onClick={() => go('ob2')}
            className="border border-indigo-300 dark:border-indigo-500/40 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 font-black rounded-xl py-3 text-xs uppercase tracking-wider mono flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
          >
            <span>Government Desk</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
