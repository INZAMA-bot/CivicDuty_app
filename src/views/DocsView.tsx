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
      icon = <AlertCircle className="text-rose-600 dark:text-rose-400" size={24} />;
      visual = (
        <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 space-y-3">
          <div className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert size={13} /> Traditional System vs CivicDuty {countryData.name}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] font-mono">
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-3 rounded-lg space-y-1">
              <span className="text-rose-600 dark:text-rose-400 font-bold block text-[10px]">TRADITIONAL</span>
              <p className="text-slate-600 dark:text-slate-400 text-[10.5px]">Paper petitions, manual queuing, lost files, zero status updates, unmonitored delays.</p>
            </div>
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-3 rounded-lg space-y-1">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block text-[10px]">CIVICDUTY</span>
              <p className="text-slate-700 dark:text-slate-300 text-[10.5px]">Geotagged proof, auto-routed to {countryData.level3Title.split('&')[0]}, live SLA timer.</p>
            </div>
          </div>
        </div>
      );
    } else if (s.id === 'solution') {
      icon = <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={24} />;
      visual = (
        <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1"><Smartphone size={13} /> Multi-Channel Access</span>
            <span className="text-slate-500 dark:text-slate-400">[{countryData.code}] {countryData.name} Rollout</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-2.5 rounded-lg text-slate-800 dark:text-slate-200">
              <span className="font-bold block text-emerald-600 dark:text-emerald-400">Web App</span>
              <span className="text-[9.5px] text-slate-500 dark:text-slate-400">Photos, Voice, GPS</span>
            </div>
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-2.5 rounded-lg text-slate-800 dark:text-slate-200">
              <span className="font-bold block text-emerald-600 dark:text-emerald-400">USSD Layer</span>
              <span className="text-[9.5px] text-slate-500 dark:text-slate-400">Feature Phones</span>
            </div>
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-2.5 rounded-lg text-slate-800 dark:text-slate-200">
              <span className="font-bold block text-amber-600 dark:text-amber-400">Gov Desk</span>
              <span className="text-[9.5px] text-slate-500 dark:text-slate-400">Officer Portal</span>
            </div>
          </div>
        </div>
      );
    } else if (s.id === 'hierarchy') {
      icon = <Building2 className="text-amber-600 dark:text-amber-400" size={24} />;
      visual = (
        <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 space-y-2.5 font-mono text-[10px]">
          <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-semibold border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
            <span>[{countryData.code}] {countryData.name.toUpperCase()} HIERARCHY MAP</span>
            <span className="text-[9.5px] text-amber-600 dark:text-amber-400">ADMIN NODES</span>
          </div>
          <div className="space-y-1.5 text-[10.5px]">
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-2.5 rounded-lg flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">Level 1 · {countryData.level1Title}</span>
              <span className="text-amber-600 dark:text-amber-400 text-[9.5px]">National</span>
            </div>
            <div className="ml-3 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-2.5 rounded-lg flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">Level 2 · {countryData.level2Title}</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-[9.5px]">Regional</span>
            </div>
            <div className="ml-6 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-2.5 rounded-lg flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">Level 3 · {countryData.level3Title}</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-[9.5px]">Grassroots</span>
            </div>
          </div>
        </div>
      );
    } else if (s.id === 'impact') {
      icon = <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={24} />;
      visual = (
        <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-2.5 rounded-lg">
              <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 block">24h–48h</span>
              <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase">Target SLA</span>
            </div>
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-2.5 rounded-lg">
              <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white block">{countryData.statUnits}</span>
              <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase">{countryData.statLabel}</span>
            </div>
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-2.5 rounded-lg">
              <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400 block">100%</span>
              <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase">Audit Proof</span>
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
    color: '',
    borderColor: 'border-[#e3e6ea] dark:border-[#262b36]',
    icon: <BarChart3 className="text-amber-600 dark:text-amber-400" size={24} />,
    visual: (
      <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-800 dark:text-slate-200 font-semibold">
          <span className="flex items-center gap-1.5"><TrendingUp size={13} className="text-emerald-600 dark:text-emerald-400" /> B2G / B2B Revenue &amp; Tax Engine</span>
          <span className="text-amber-600 dark:text-amber-400">Foreign Currency Inflow</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
          <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-2.5 rounded-lg">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums block text-xs sm:text-sm">$50k–$150k/yr</span>
            <span className="text-[8.5px] text-slate-500 dark:text-slate-400">Foreign Country License</span>
          </div>
          <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-2.5 rounded-lg">
            <span className="text-slate-900 dark:text-white font-bold tabular-nums block text-xs sm:text-sm">$15k–$40k/yr</span>
            <span className="text-[8.5px] text-slate-500 dark:text-slate-400">Utility / Corporate Seat</span>
          </div>
          <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-2.5 rounded-lg">
            <span className="text-amber-600 dark:text-amber-400 font-bold tabular-nums block text-xs sm:text-sm">30%+ CIT &amp; VAT</span>
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
    color: '',
    borderColor: 'border-[#e3e6ea] dark:border-[#262b36]',
    icon: <Handshake className="text-emerald-600 dark:text-emerald-400" size={24} />,
    visual: (
      <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-800 dark:text-slate-200 font-semibold">
          <span className="flex items-center gap-1.5"><Handshake size={13} className="text-emerald-600 dark:text-emerald-400" /> Fast-Track Government Onboarding</span>
          <span className="text-emerald-600 dark:text-emerald-400">{countryData.code} Deployment Ready</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[10px] font-mono">
          <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-3 rounded-lg space-y-1">
            <span className="text-slate-900 dark:text-white font-bold block">Ministerial Briefing</span>
            <span className="text-slate-500 dark:text-slate-400 text-[9.5px] block">Custom executive presentation tailored for Cabinet &amp; Local Gov Ministers</span>
          </div>
          <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-3 rounded-lg space-y-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold block">30-Day Sandbox Pilot</span>
            <span className="text-slate-500 dark:text-slate-400 text-[9.5px] block">Zero-cost trial across targeted district or city wards</span>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('partner')}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg py-2.5 text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
    <div className="max-w-5xl mx-auto p-4 sm:p-5 space-y-4 animate-fade-in pb-20 text-slate-900 dark:text-slate-100">
      {/* Studio Top Header Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-4">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#e3e6ea] dark:border-[#262b36] flex-wrap">
          <button
            onClick={() => go('splash')}
            className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] flex items-center gap-1 text-xs font-mono text-slate-700 dark:text-slate-200 transition-colors font-semibold cursor-pointer"
          >
            <ChevronLeft size={14} /> Back to Home
          </button>

          <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-semibold flex-wrap">
            <button
              type="button"
              onClick={() => openLegalCenter('about')}
              className="px-2.5 py-1 rounded-md bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              About CivicDuty
            </button>
            <button
              type="button"
              onClick={() => openLegalCenter('privacy')}
              className="px-2.5 py-1 rounded-md bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Privacy Charter
            </button>
            <button
              type="button"
              onClick={() => openLegalCenter('terms')}
              className="px-2.5 py-1 rounded-md bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Terms of Use
            </button>
            <button
              type="button"
              onClick={() => openLegalCenter('ethics')}
              className="px-2.5 py-1 rounded-md bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Ethics Covenant
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5 font-semibold">
              National Civic Platform Pitch &amp; System Documentation
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              CivicDuty Pitch &amp; Architecture
            </h2>
          </div>

          {/* Target Government Country Selector */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-2 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] py-1.5 px-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-[10.5px] font-mono font-semibold shrink-0">
              <Globe size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Pitching To:</span>
            </div>
            <select
              value={pitchCountry}
              onChange={(e) => {
                setPitchCountry(e.target.value);
                setCurrentSlide(0);
                toast(`Loaded pitch tailored for Government of ${COUNTRIES[e.target.value]?.name || 'Target Nation'}`);
              }}
              className="bg-white dark:bg-[#161a22] text-slate-900 dark:text-slate-100 text-xs font-mono font-semibold py-1 px-2.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {Object.entries(COUNTRIES).map(([code, c]) => (
                <option key={code} value={code}>
                  [{code}] {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Country Context & Fleet Sensitization Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xs font-mono font-bold px-2 py-1 rounded-md bg-white dark:bg-[#161a22] text-slate-800 dark:text-slate-200 border border-[#e3e6ea] dark:border-[#262b36] shrink-0">
                {countryData.code}
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  Government of {countryData.name} Presentation
                </div>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {countryData.motto}
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => go('transit_preview')}
            className="bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] p-3 rounded-xl flex items-center justify-between gap-2.5 cursor-pointer transition-colors group"
            title="Inspect CivicDuty Brand Advertising, Kayoola Bus & Train Fleet Images"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Bus size={15} />
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  Brand Advertising &amp; Fleet Sensitization
                </div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                  Kayoola EVS Buses, Passenger Train &amp; Transit Billboards
                </div>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-emerald-600 group-hover:bg-emerald-700 text-white font-mono font-semibold text-[10px] flex items-center gap-1 shrink-0">
              <span>View Ads</span>
              <ArrowRight size={11} />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Section Switcher Tabs (Studio Segmented Control) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 bg-white dark:bg-[#161a22] p-1.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ScrollText size={14} />
          <span>Official Docs ({OFFICIAL_DOCUMENTS.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('pitch')}
          className={`py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'pitch'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award size={14} />
          <span>Pitch Deck</span>
        </button>
        <button
          onClick={() => setActiveTab('partner')}
          className={`py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'partner'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Handshake size={14} />
          <span>Partnership Hub</span>
        </button>
        <button
          onClick={() => setActiveTab('journeys')}
          className={`py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'journeys'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers size={14} />
          <span>Journeys &amp; 6 Demos</span>
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'architecture'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] hover:text-slate-900 dark:hover:text-white'
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
            <div className="p-4 sm:p-5 space-y-3.5 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
                <div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck size={13} /> Sovereign Documentation Suite · Direct In-App Reader
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight mt-0.5">
                    Official Document Slide Carousel
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Tap any document slide below to display its full text and diagrams directly on your screen without external downloads.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-center">
                  <button
                    onClick={() => {
                      const prevIdx = activeDocIndex > 0 ? activeDocIndex - 1 : OFFICIAL_DOCUMENTS.length - 1;
                      setSelectedDocId(OFFICIAL_DOCUMENTS[prevIdx].id);
                    }}
                    className="px-2.5 py-1.5 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] rounded-lg text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer"
                    title="Previous Document"
                  >
                    <ChevronLeft size={14} />
                    <span className="hidden sm:inline">Prev Doc</span>
                  </button>
                  <span className="text-[10px] font-mono bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 font-semibold px-2.5 py-1.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36]">
                    Doc {activeDocIndex + 1} / {OFFICIAL_DOCUMENTS.length}
                  </span>
                  <button
                    onClick={() => {
                      const nextIdx = activeDocIndex < OFFICIAL_DOCUMENTS.length - 1 ? activeDocIndex + 1 : 0;
                      setSelectedDocId(OFFICIAL_DOCUMENTS[nextIdx].id);
                    }}
                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs font-mono flex items-center gap-1 cursor-pointer"
                    title="Next Document"
                  >
                    <span className="hidden sm:inline">Next Doc</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Responsive Slide Deck of All 7 Documents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 pt-1">
                {OFFICIAL_DOCUMENTS.map((doc) => {
                  const isSelected = doc.id === activeDoc.id;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setSelectedDocId(doc.id);
                        setDocSearch('');
                      }}
                      className={`text-left p-3 rounded-xl border transition-colors flex flex-col justify-between space-y-2 relative cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-slate-900 dark:text-white'
                          : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d]'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[9.5px] font-mono font-semibold ${
                              isSelected
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {doc.category}
                          </span>
                          <span className="text-[9.5px] font-mono text-slate-500 flex items-center gap-1">
                            <Clock size={10} /> {doc.readTime}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                          {doc.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {doc.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#e3e6ea] dark:border-[#262b36] pt-2 text-[10px] font-mono">
                        <span className="text-slate-500 dark:text-slate-400 text-[9.5px] font-semibold">
                          {doc.version}
                        </span>
                        <span
                          className={`font-semibold flex items-center gap-1 text-[10px] ${
                            isSelected
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-500 dark:text-slate-400'
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
            <div className="p-5 space-y-5 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl text-slate-900 dark:text-slate-100">
              {/* Document Letterhead & Metadata Header */}
              <div className="border-b border-[#e3e6ea] dark:border-[#262b36] pb-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <FileText size={12} /> {activeDoc.category}
                    </span>
                    <span>·</span>
                    <span>{activeDoc.version}</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="hidden sm:inline">{activeDoc.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyDocText(activeDoc)}
                      className="px-3 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
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
                      className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 text-xs font-mono font-semibold transition-colors hidden sm:flex items-center gap-1 cursor-pointer"
                      title="Print or Save as PDF via browser"
                    >
                      <Printer size={14} />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {activeDoc.title}
                  </h1>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                    {activeDoc.subtitle}
                  </p>
                </div>

                {/* Author & Document Summary Callout */}
                <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] p-3.5 rounded-xl space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono text-slate-600 dark:text-slate-400 border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Author: {activeDoc.author} ({activeDoc.authorTitle})
                    </span>
                    <span className="text-[10px] text-slate-500">Contact: {activeDoc.authorContact}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                    <strong className="text-slate-900 dark:text-white">Executive Context:</strong> {activeDoc.summary}
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
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    {docSearch && (
                      <button
                        onClick={() => setDocSearch('')}
                        className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold hover:underline self-start sm:self-center cursor-pointer"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>

                  {/* Section Navigator Links */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-mono">
                    <span className="text-slate-500 font-semibold whitespace-nowrap">Sections:</span>
                    {activeDoc.sections.map((s, idx) => (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        className="px-2 py-0.5 rounded-md bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] text-slate-600 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36] whitespace-nowrap transition-colors"
                      >
                        {s.num ? `${s.num}. ` : `${idx + 1}. `}
                        {s.title.split(':')[0].substring(0, 20)}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rendered Document Sections */}
              <div className="space-y-5">
                {filteredSections.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 font-mono text-xs space-y-2">
                    <p>No sections match your search filter &quot;{docSearch}&quot;.</p>
                    <button
                      onClick={() => setDocSearch('')}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                    >
                      Reset Search
                    </button>
                  </div>
                ) : (
                  filteredSections.map((sec, sIdx) => (
                    <div
                      key={sec.id}
                      id={sec.id}
                      className="space-y-3 text-xs leading-relaxed scroll-mt-24 border-b border-[#e3e6ea] dark:border-[#262b36] pb-5 last:border-b-0"
                    >
                      <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2 border-b border-[#e3e6ea] dark:border-[#262b36] pb-1.5">
                        {sec.num ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-mono">{sec.num}.</span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-mono">§{sIdx + 1}</span>
                        )}
                        <span>{sec.title}</span>
                      </h3>

                      <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                        {sec.content}
                      </div>

                      {/* Callout box if present */}
                      {sec.callout && (
                        <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                          <span className="font-bold text-[11px] font-mono uppercase text-emerald-600 dark:text-emerald-400 block">
                            {sec.callout.title}
                          </span>
                          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">{sec.callout.text}</p>
                        </div>
                      )}

                      {/* Highlights if present */}
                      {sec.highlights && sec.highlights.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                            Key Specifications &amp; Takeaways:
                          </span>
                          <ul className="space-y-1">
                            {sec.highlights.map((h, hIdx) => (
                              <li
                                key={hIdx}
                                className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-[11px]"
                              >
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">·</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Structured table if present */}
                      {sec.table && (
                        <div className="overflow-x-auto border border-[#e3e6ea] dark:border-[#262b36] rounded-xl my-2">
                          <table className="w-full text-left font-mono text-[10px]">
                            <thead className="bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-800 dark:text-slate-200 font-semibold border-b border-[#e3e6ea] dark:border-[#262b36]">
                              <tr>
                                {sec.table.headers.map((th, thIdx) => (
                                  <th key={thIdx} className="p-2.5">
                                    {th}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e3e6ea] dark:divide-[#262b36]">
                              {sec.table.rows.map((r, rIdx) => (
                                <tr
                                  key={rIdx}
                                  className={
                                    rIdx % 2 === 0
                                      ? 'bg-white dark:bg-[#161a22]'
                                      : 'bg-[#f8f9fa]/60 dark:bg-[#0e1116]/60'
                                  }
                                >
                                  {r.map((cell, cIdx) => (
                                    <td
                                      key={cIdx}
                                      className={`p-2.5 ${
                                        cIdx === 0
                                          ? 'font-bold text-slate-900 dark:text-white'
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
              <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Lead System Architect: Inzama Robin
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Phone: 0778277900 / 0748338796 · Email: inzamarobin279@gmail.com
                  </span>
                  <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                    CivicDuty Sovereign Nation Management Platform · Kampala, Uganda
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyDocText(activeDoc)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-3 rounded-lg flex items-center gap-1.5 w-fit transition-colors text-xs cursor-pointer"
                  >
                    <Copy size={13} />
                    <span>Copy Full Document</span>
                  </button>
                </div>
              </div>

              {/* Next/Prev Document Quick Switcher Footer */}
              <div className="flex items-center justify-between border-t border-[#e3e6ea] dark:border-[#262b36] pt-4 text-xs font-mono">
                <button
                  onClick={() => {
                    const prevIdx = activeDocIndex > 0 ? activeDocIndex - 1 : OFFICIAL_DOCUMENTS.length - 1;
                    setSelectedDocId(OFFICIAL_DOCUMENTS[prevIdx].id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3 py-2 bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
          <div className="flex items-center justify-between bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-3 rounded-xl">
            <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <span>[{countryData.code}] Slide {currentSlide + 1} of {pitchSlides.length}</span>
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : pitchSlides.length - 1))}
                className="px-2.5 py-1.5 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] rounded-lg text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev < pitchSlides.length - 1 ? prev + 1 : 0))}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Active Pitch Slide */}
          {(() => {
            const slide = pitchSlides[currentSlide];
            return (
              <div className="p-5 space-y-4 border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] rounded-xl transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                      {slide.tag}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                      {slide.title}
                    </h3>
                  </div>
                  <div className="p-2.5 bg-[#f8f9fa] dark:bg-[#0e1116] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] shrink-0">
                    {slide.icon}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* Visual Graphic Element */}
                {slide.visual}

                {/* Key Bullet Points */}
                <div className="space-y-2 pt-1">
                  {slide.points.map((pt, idx) => (
                    <div key={idx} className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] p-3 rounded-xl flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">{pt.label}</span>
                        <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{pt.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* All Slide Thumbnails Quick Nav */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
            {pitchSlides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`p-2 rounded-lg text-[10px] font-mono font-semibold text-center border transition-colors cursor-pointer ${
                  currentSlide === idx
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116]'
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
          <div className="p-4 sm:p-5 space-y-3 border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] rounded-xl">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider inline-flex items-center gap-1.5">
                  <Handshake size={13} /> Ministerial Partnership Hub
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                  Partner With CivicDuty · Government of {countryData.name}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-800 dark:text-slate-200 border border-[#e3e6ea] dark:border-[#262b36]">{countryData.code}</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Empower {countryData.name}’s public administration with a data-sovereign, turnkey civic engagement engine. Aligned directly with {countryData.leadMinistry}.
            </p>

            {/* 4 Core Partnership Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[10px] font-mono pt-1">
              <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] p-3 rounded-xl space-y-1">
                <span className="text-slate-900 dark:text-white font-bold block flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400" /> Data Sovereignty
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Localized node binding &amp; ISO-compliant encrypted audit trails</span>
              </div>
              <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] p-3 rounded-xl space-y-1">
                <span className="text-slate-900 dark:text-white font-bold block flex items-center gap-1.5">
                  <Zap size={13} className="text-emerald-600 dark:text-emerald-400" /> Rapid Onboarding
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Zero-hardware footprint with 48h USSD &amp; Web desk setup</span>
              </div>
              <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] p-3 rounded-xl space-y-1">
                <span className="text-slate-900 dark:text-white font-bold block flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-600 dark:text-amber-400" /> Enforceable SLAs
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block">24h–72h ticket countdown with automatic escalation rules</span>
              </div>
              <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] p-3 rounded-xl space-y-1">
                <span className="text-slate-900 dark:text-white font-bold block flex items-center gap-1.5">
                  <Building2 size={13} className="text-emerald-600 dark:text-emerald-400" /> e-Gov Integration
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block">APIs for National ID validation &amp; utility CRMs ({countryData.agenciesUtility[0] || 'Utilities'})</span>
              </div>
            </div>
          </div>

          {/* Interactive Form or Submitted Certificate */}
          {submittedInquiry ? (
            <div className="p-5 space-y-4 border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] rounded-xl">
              <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    <FileCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Official Partnership Pledge Logged</h3>
                    <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Reference ID: {submittedInquiry.ref}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">Pledged</span>
              </div>

              <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] p-3.5 rounded-xl space-y-2 font-mono text-[11px]">
                <div className="grid grid-cols-2 gap-2 border-b border-[#e3e6ea] dark:border-[#262b36] pb-2 text-[10px]">
                  <div>
                    <span className="text-slate-500 uppercase block text-[9px] font-semibold">Target Nation</span>
                    <span className="text-slate-900 dark:text-slate-200 font-bold">{submittedInquiry.countryName} ({submittedInquiry.country})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase block text-[9px] font-semibold">Pledged Institution</span>
                    <span className="text-slate-900 dark:text-slate-200 font-bold">{submittedInquiry.ministry}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-500 uppercase block text-[9px] font-semibold">Official Representative</span>
                    <span className="text-slate-900 dark:text-slate-200 font-bold">{submittedInquiry.repName}</span>
                    <span className="text-slate-600 dark:text-slate-400 block text-[9px]">{submittedInquiry.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase block text-[9px] font-semibold">Contact Email &amp; Phone</span>
                    <span className="text-emerald-600 dark:text-emerald-400 block font-bold text-[9px]">{submittedInquiry.email}</span>
                    <span className="text-slate-600 dark:text-slate-400 block text-[9px]">{submittedInquiry.phone}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#161a22] p-2.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] text-[10px] space-y-1">
                  <span className="text-slate-900 dark:text-white font-bold block">Scope &amp; Timeline</span>
                  <p className="text-slate-700 dark:text-slate-300">
                    Scope: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{submittedInquiry.scope.toUpperCase()}</span> · Target Coverage: <span className="text-amber-600 dark:text-amber-400 font-bold">{submittedInquiry.population}</span> · Priority: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{submittedInquiry.timeline.toUpperCase()}</span>
                  </p>
                  {submittedInquiry.notes && (
                    <p className="text-slate-600 dark:text-slate-400 text-[9.5px] pt-1 border-t border-[#e3e6ea] dark:border-[#262b36]">
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
                  className="flex-1 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] text-slate-800 dark:text-slate-200 py-2.5 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 size={14} /> Copy Pledge Briefing
                </button>
                <button
                  onClick={() => setSubmittedInquiry(null)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            /* Inquiry Form */
            <form onSubmit={handlePartnershipSubmit} className="p-4 sm:p-5 space-y-3.5 border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] rounded-xl">
              <div className="border-b border-[#e3e6ea] dark:border-[#262b36] pb-2.5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-1.5">
                    <Handshake size={15} className="text-emerald-600 dark:text-emerald-400" /> Direct Government Collaboration Form
                  </h4>
                  <p className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
                    Communicate ministerial requirements to the CivicDuty Secretariat for Government of {countryData.name}.
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded">
                  [{pitchCountry}]
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold block">
                    Ministry / Government Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerMinistry}
                    onChange={(e) => setPartnerMinistry(e.target.value)}
                    placeholder={`e.g. ${countryData.leadMinistry.split('&')[0]}`}
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-white text-xs rounded-lg p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold block">
                    Official Representative Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerRepName}
                    onChange={(e) => setPartnerRepName(e.target.value)}
                    placeholder="e.g. Dr. Brenda Namaganda"
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-white text-xs rounded-lg p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold block">
                    Official Title / Designation
                  </label>
                  <input
                    type="text"
                    value={partnerTitle}
                    onChange={(e) => setPartnerTitle(e.target.value)}
                    placeholder="e.g. Permanent Secretary / Director of ICT / Mayor"
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-white text-xs rounded-lg p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold block">
                    Official Email (.gov / .go or institutional) *
                  </label>
                  <input
                    type="email"
                    required
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    placeholder="e.g. ps@molg.go.ug or secretary@kigali.gov.rw"
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-white text-xs rounded-lg p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold block">
                    Phone / Direct Hotline
                  </label>
                  <input
                    type="tel"
                    value={partnerPhone}
                    onChange={(e) => setPartnerPhone(e.target.value)}
                    placeholder="+256 / +254 / +250 official contact"
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-white text-xs rounded-lg p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold block">
                    Partnership Scope &amp; Objective
                  </label>
                  <select
                    value={partnerScope}
                    onChange={(e) => setPartnerScope(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-white text-xs rounded-lg p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option value="national">Whole-of-Government National Rollout</option>
                    <option value="regional">City / Municipal Council Pilot</option>
                    <option value="utility">Public Utility Integration ({countryData.agenciesUtility.slice(0, 2).join(', ')})</option>
                    <option value="whistleblower">Anti-Corruption &amp; Whistleblower Pipeline (IGG/Ombudsman)</option>
                    <option value="briefing">Request Executive Ministerial Briefing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold block">
                    Estimated Target Citizen Coverage
                  </label>
                  <select
                    value={partnerPopulation}
                    onChange={(e) => setPartnerPopulation(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-white text-xs rounded-lg p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option value="500k-2m">500,000 – 2,000,000 (City / Metro)</option>
                    <option value="2m-10m">2,000,000 – 10,000,000 (Regional State)</option>
                    <option value="10m+">10,000,000+ (Whole Nation Rollout)</option>
                    <option value="pilot">&lt; 500,000 (Targeted Parish/Ward Pilot)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold block">
                    Implementation Timeline / Priority
                  </label>
                  <select
                    value={partnerTimeline}
                    onChange={(e) => setPartnerTimeline(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-white text-xs rounded-lg p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option value="immediate">Immediate Fast-Track (30-Day Sandbox)</option>
                    <option value="3months">Within 3 Months</option>
                    <option value="fy2026">FY2026/2027 Annual Budget Cycle</option>
                    <option value="exploratory">Exploratory Consultation</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold block">
                  Specific Requirements or Notes
                </label>
                <textarea
                  rows={2}
                  value={partnerNotes}
                  onChange={(e) => setPartnerNotes(e.target.value)}
                  placeholder={`Mention specific policy goals, data sovereignty guidelines, or special USSD code requests for ${countryData.name}...`}
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-white text-xs rounded-lg p-2.5 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg py-2.5 text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Handshake size={15} />
                <span>Submit Collaboration Interest &amp; Request MOU Briefing</span>
              </button>
            </form>
          )}

          {/* Direct Liaison & Secretariat Section */}
          <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2 text-[10px] font-mono">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase flex items-center gap-1.5">
                <Mail size={13} /> CivicDuty Government Relations Secretariat
              </span>
              <span className="text-slate-500 dark:text-slate-400">[{countryData.code}] Direct Channel</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[10px] font-mono">
              <div className="bg-[#f8f9fa] dark:bg-[#0e1116] p-3 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                <span className="text-slate-900 dark:text-white font-bold block">Official Liaison Email</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold block">gov-partnerships@civicduty.org</span>
                <p className="text-[9.5px] text-slate-500 dark:text-slate-400">Direct inbox for Permanent Secretaries, Governors &amp; Mayors.</p>
              </div>

              <div className="bg-[#f8f9fa] dark:bg-[#0e1116] p-3 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                <span className="text-slate-900 dark:text-white font-bold block">Senior Delegate Hotline</span>
                <span className="text-slate-900 dark:text-white font-bold block">+256 (0) 414 550 100 / +250 788 123 456</span>
                <p className="text-[9.5px] text-slate-500 dark:text-slate-400">Encrypted WhatsApp &amp; telephone liaison for executive scheduling.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: USER JOURNEY MAPS & 6 LIVE ROLE SIMULATIONS        */}
      {/* ========================================================= */}
      {activeTab === 'journeys' && (
        <div className="space-y-4">
          {/* Embedded Interactive Role Sandbox (6 Live Role Simulations) */}
          <InteractiveRoleSandboxGrid countryCode={pitchCountry as any} />

          {/* User Category Selector */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <button
              onClick={() => setJourneyRole('citizen')}
              className={`p-3 rounded-xl border transition-colors text-left flex flex-col justify-between cursor-pointer ${
                journeyRole === 'citizen'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-900 dark:text-white'
                  : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 hover:border-slate-400'
              }`}
            >
              <Users size={18} className={journeyRole === 'citizen' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
              <div className="mt-2">
                <p className="text-xs font-bold uppercase tracking-wider">1. Citizen / Consumer</p>
                <p className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400">Service Consumer</p>
              </div>
            </button>

            <button
              onClick={() => setJourneyRole('government')}
              className={`p-3 rounded-xl border transition-colors text-left flex flex-col justify-between cursor-pointer ${
                journeyRole === 'government'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-900 dark:text-white'
                  : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 hover:border-slate-400'
              }`}
            >
              <Building size={18} className={journeyRole === 'government' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
              <div className="mt-2">
                <p className="text-xs font-bold uppercase tracking-wider">2. Government</p>
                <p className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400">State &amp; Regulator</p>
              </div>
            </button>

            <button
              onClick={() => setJourneyRole('entity')}
              className={`p-3 rounded-xl border transition-colors text-left flex flex-col justify-between cursor-pointer ${
                journeyRole === 'entity'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-900 dark:text-white'
                  : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 hover:border-slate-400'
              }`}
            >
              <Briefcase size={18} className={journeyRole === 'entity' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
              <div className="mt-2">
                <p className="text-xs font-bold uppercase tracking-wider">3. Entity Desk</p>
                <p className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400">Service Provider</p>
              </div>
            </button>
          </div>

          {/* Detailed Journey Steps Display */}
          {journeyRole === 'citizen' && (
            <div className="p-4 sm:p-5 space-y-4 border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] rounded-xl">
              <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-emerald-600 dark:text-emerald-400 rounded-lg">
                    <Users size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">Citizen &amp; Consumer Journey</h3>
                    <p className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">The Service Consumer &amp; Stakeholder in {countryData.name}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  {countryData.idLabel}
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    num: '01',
                    title: 'Onboard & Pin Monitored Entities',
                    desc: `Citizen registers with ${countryData.idLabel} or phone and pins their local schools, clinics, utilities, banks, and parish desks.`,
                    detail: 'Accessible via Web App or feature phone USSD layer.',
                    icon: <UserCheck size={15} className="text-emerald-600 dark:text-emerald-400" />,
                  },
                  {
                    num: '02',
                    title: 'Submit Service Deficit or Praise Report',
                    desc: 'Report water outages, food hygiene breaches, billing errors, or road faults directly to the responsible entity or department wall.',
                    detail: 'Auto-captures GPS location & timestamp for tamper-proof filing.',
                    icon: <Send size={15} className="text-emerald-600 dark:text-emerald-400" />,
                  },
                  {
                    num: '03',
                    title: 'Track Live Provider SLA Countdown',
                    desc: 'Watch the published SLA response timer count down. See which provider officer or desk is actively handling the ticket.',
                    detail: 'If unattended, auto-escalates to executive regulators and public index.',
                    icon: <Clock size={15} className="text-emerald-600 dark:text-emerald-400" />,
                  },
                  {
                    num: '04',
                    title: 'Inspect Proof & Rate Provider Trust Score',
                    desc: 'Provider uploads timestamped photo proof or official resolution. Citizen verifies satisfaction to close ticket.',
                    detail: 'Ticket CANNOT close until citizen confirms satisfaction.',
                    icon: <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />,
                  },
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] p-3.5 rounded-xl flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {s.num}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                          {s.icon} {s.title}
                        </span>
                        <span className="text-[9.5px] font-mono text-slate-500 uppercase">Step {idx + 1}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{s.desc}</p>
                      <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-0.5">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => go('ob1')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg py-2.5 text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Try Citizen Onboarding Flow</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {journeyRole === 'government' && (
            <div className="p-4 sm:p-5 space-y-4 border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] rounded-xl">
              <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-emerald-600 dark:text-emerald-400 rounded-lg">
                    <Building size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">Government &amp; Regulator Journey</h3>
                    <p className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">Public Service Delivery &amp; Statutory Supervision in {countryData.name}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  Official Mandate
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    num: '01',
                    title: 'Mount Desk via Single-Use Security Code',
                    desc: `Government officer or regulator logs in using official credentials (e.g. ${countryData.code}-DESK-ADMIN).`,
                    detail: 'Loads jurisdictional queues, supervisory dashboards, and audit logs.',
                    icon: <Lock size={15} className="text-emerald-600 dark:text-emerald-400" />,
                  },
                  {
                    num: '02',
                    title: 'Auto-Routed Geotagged Inbox & Supervision',
                    desc: 'Citizen reports land on specific jurisdiction desks with urgency indicators, GPS pins, and regulatory compliance flags.',
                    detail: 'Zero lost paperwork. 100% transparent public audit trail.',
                    icon: <Layers size={15} className="text-emerald-600 dark:text-emerald-400" />,
                  },
                  {
                    num: '03',
                    title: 'Dispatch Field Officers & Enforce Standards',
                    desc: 'Assign field engineers, health inspectors, or parish caseworkers to resolve civic defects or audit non-compliant entities.',
                    detail: 'Monitors resolution percentage against statutory SLA standards.',
                    icon: <Users size={15} className="text-emerald-600 dark:text-emerald-400" />,
                  },
                  {
                    num: '04',
                    title: 'Upload Photo Proof of Work & Close Ticket',
                    desc: 'Field officer completes repair and attaches timestamped photo evidence for citizen verification.',
                    detail: 'Builds officer merit ranking and maintains public institutional accountability.',
                    icon: <Award size={15} className="text-emerald-600 dark:text-emerald-400" />,
                  },
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] p-3.5 rounded-xl flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {s.num}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                          {s.icon} {s.title}
                        </span>
                        <span className="text-[9.5px] font-mono text-slate-500 uppercase">Step {idx + 1}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{s.desc}</p>
                      <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-0.5">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => go('ob2')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg py-2.5 text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Mount Government Desk</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {journeyRole === 'entity' && (
            <div className="p-4 sm:p-5 space-y-4 border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] rounded-xl">
              <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-amber-600 dark:text-amber-400 rounded-lg">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">Registered Entity Journey (Providers &amp; Businesses)</h3>
                    <p className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">Retailers, Chemists, Transit SACCOs, Schools, Healthcare &amp; Utilities in {countryData.name}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                  Provider &amp; Business Desk
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    num: '01',
                    title: 'Declare Professional Identity & Sector Typology',
                    desc: 'Owners, General Managers, Pharmacists, Bar Proprietors, and Engineers register their business sector, typology, and professional title with exact "Other" customization.',
                    detail: 'Captures precise professional credentials, official tax/license ID, and initial seat quota.',
                    icon: <Building2 size={15} className="text-amber-600 dark:text-amber-400" />,
                  },
                  {
                    num: '02',
                    title: 'Create Custom Roles & Mint Staff Access Passes',
                    desc: 'Define custom operational roles with granular permissions (review replies, ticket resolutions, bulletins, billing) and mint single-use staff passes with 1-click WhatsApp/SMS dispatch.',
                    detail: 'Dedicated non-geographic team layout allows assigning staff to specific duty stations, shifts, and custom permissions.',
                    icon: <Users size={15} className="text-amber-600 dark:text-amber-400" />,
                  },
                  {
                    num: '03',
                    title: 'Receive, Triage & Resolve Consumer Reports',
                    desc: 'Citizens submit feedback, service deficits, billing glitches, or food hygiene tickets directly to your verified desk.',
                    detail: 'Investigate, communicate directly with consumers, and attach timestamped resolution proof.',
                    icon: <Layers size={15} className="text-amber-600 dark:text-amber-400" />,
                  },
                  {
                    num: '04',
                    title: 'Broadcast Service Advisories & Build Public Trust Score',
                    desc: 'Post verified operational advisories to patrons and maintain SLA resolution speeds to elevate your public institutional trust score.',
                    detail: 'Complies with statutory supervisory authorities (UNBS, NDA, UCC, BoU, MoES).',
                    icon: <ShieldCheck size={15} className="text-amber-600 dark:text-amber-400" />,
                  },
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] p-3.5 rounded-xl flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-amber-600 dark:text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {s.num}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                          {s.icon} {s.title}
                        </span>
                        <span className="text-[9.5px] font-mono text-slate-500 uppercase">Step {idx + 1}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{s.desc}</p>
                      <p className="text-[10px] font-mono text-amber-600 dark:text-amber-400 pt-0.5">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => go('entity')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg py-2.5 text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Register Provider / Business / Utility</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: DYNAMIC COUNTRY ARCHITECTURE MAP                   */}
      {/* ========================================================= */}
      {activeTab === 'architecture' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 space-y-3.5 border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] rounded-xl">
            <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2.5">
              <div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                  [{countryData.code}] {countryData.name} Administrative Hierarchy
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{countryData.motto}</h3>
              </div>
              <Globe className="text-emerald-600 dark:text-emerald-400" size={20} />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              CivicDuty maps 1:1 to {countryData.name}’s administrative structure, connecting the central government level down to local field officers and USSD users.
            </p>

            <div className="space-y-2.5 font-mono text-[11px]">
              {countryData.hierarchy.map((h, idx) => (
                <div
                  key={idx}
                  className={`bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] p-3 rounded-xl space-y-1 ${
                    idx === 1 ? 'ml-3' : idx === 2 ? 'ml-6' : idx === 3 ? 'ml-9' : ''
                  }`}
                >
                  <div className="flex items-center justify-between text-slate-900 dark:text-white font-bold">
                    <span>{h.level} · {h.title}</span>
                    <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {h.badge}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-600 dark:text-slate-400">
                    {h.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-4 rounded-xl space-y-2.5">
            <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
              [{countryData.code}] Public Utilities &amp; Civil Entities Integrated
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[10.5px] font-mono">
              <div className="bg-[#f8f9fa] dark:bg-[#0e1116] p-3 rounded-lg border border-[#e3e6ea] dark:border-[#262b36]">
                <span className="text-slate-900 dark:text-white font-bold block">Civil Authorities</span>
                <span className="text-slate-600 dark:text-slate-400 text-[10px] mt-0.5 block">{countryData.agenciesCivic.join(', ')}</span>
              </div>
              <div className="bg-[#f8f9fa] dark:bg-[#0e1116] p-3 rounded-lg border border-[#e3e6ea] dark:border-[#262b36]">
                <span className="text-slate-900 dark:text-white font-bold block">Essential Utilities</span>
                <span className="text-slate-600 dark:text-slate-400 text-[10px] mt-0.5 block">{countryData.agenciesUtility.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share / Pitch Action Footer */}
      <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
              Pitch to Government of {countryData.name}
            </h4>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
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
            className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 size={13} /> Copy Proposal
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => setActiveTab('partner')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg py-2.5 text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Handshake size={14} />
            <span>Partner With CivicDuty</span>
          </button>
          <button
            onClick={() => go('ob1')}
            className="bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-white font-semibold rounded-lg py-2.5 text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Citizen Portal</span>
            <ArrowRight size={14} />
          </button>
          <button
            onClick={() => go('ob2')}
            className="bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-white font-semibold rounded-lg py-2.5 text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Government Desk</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
