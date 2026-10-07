import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getDept } from '../utils/helpers';
import { COUNTRIES } from '../data/countries';
import { 
  ChevronLeft, 
  User, 
  Plus, 
  Gift, 
  Zap, 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  PhoneCall, 
  Radio, 
  Clock, 
  MapPin, 
  Coins, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  FileText, 
  Award,
  ExternalLink,
  MessageSquare,
  Bookmark,
  Globe,
  Landmark,
  Code,
  Copy,
  Check,
  X,
  QrCode,
  Megaphone
} from 'lucide-react';
import { DeptIcon } from '../components/DeptIcon';
import { AccountabilityDocket } from '../components/AccountabilityDocket';
import { PostCardComponent } from '../components/PostCardComponent';
import { RewardModal } from '../components/RewardModal';
import { ProviderClaimModal } from '../components/ProviderClaimModal';
import { CustomerDefectionNotice } from '../components/CustomerDefectionNotice';
import { QrCodeModal } from '../components/QrCodeModal';

export const DeptWallView: React.FC = () => {
  const {
    user,
    setUser,
    ensureCitizenSession,
    activeDept,
    activeDeptCountry,
    posts,
    projects,
    wallTab,
    setWallTab,
    go,
    setActiveProject,
    toast,
    isEntityClaimed,
    getClaimedEntity,
    nudgeCounts,
    nudgeEntity,
    showDemos,
  } = useApp();

  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [showPlacardModal, setShowPlacardModal] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState<{ name: string; postId?: string }>({
    name: 'Inzama Robin',
  });
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'unresolved' | 'resolved' | 'overdue'>('all');
  const [showOfficerRoster, setShowOfficerRoster] = useState(false);

  const country = activeDeptCountry || user?.country || 'UG';
  const did = activeDept || 'kcca';
  const d = getDept(country, did);

  const rawDeptPosts = posts.filter((p) => p.dept === did && p.country === country);
  const deptPosts = (showDemos ? rawDeptPosts : rawDeptPosts.filter((p) => !p.is_demo)).sort((a, b) => {
    const aDemo = a.is_demo ? 1 : 0;
    const bDemo = b.is_demo ? 1 : 0;
    if (aDemo !== bDemo) return aDemo - bDemo;
    return 0;
  });
  const resolved = deptPosts.filter((p) => p.status === 'resolved').length;
  const overdue = deptPosts.filter((p) => p.status === 'overdue' || p.gov_status === 'overdue').length;
  const live = deptPosts.filter((p) => p.status !== 'resolved').length;
  const resPct = deptPosts.length > 0 ? Math.round((resolved / deptPosts.length) * 100) : 88;
  const isConsumer = d.lane === 'consumer';
  const isClaimed = isEntityClaimed(did);
  const claimRecord = getClaimedEntity(did);

  const deptProjects = projects.filter((p) => p.dept === did);

  // Dynamic Official & Service Metadata based on category
  const ussdCode = `*3030*${(did.charCodeAt(0) % 50) + 10}#`;
  const tollFree = isConsumer ? '0800 200 900' : '0800 100 066';
  const whatsappDesk = isConsumer ? '+256 701 889 000' : '+256 772 100 044';

  const isEducation = d.category === 'education';
  const isHealth = d.category === 'health';
  const isHospitality = d.category === 'hospitality';
  const isFinance = d.category === 'finance';
  const isTransport = d.category === 'transport';
  const isHousing = d.category === 'housing';

  const accountingOfficer = isEducation
    ? { name: 'Dr. Jane Nabukenya', role: 'Head of Academic Standards & Parent Liaison', phone: '+256 414 123 456', email: 'academics@institution.ac.ug' }
    : isHealth
    ? { name: 'Dr. Robert Asaba', role: 'Clinical Director & Patient Quality Ombudsman', phone: '+256 414 789 012', email: 'quality@healthcenter.ug' }
    : isHospitality
    ? { name: 'Chef Patrick Mukasa', role: 'Executive Operations & Food Hygiene Director', phone: '+256 700 334 455', email: 'hygiene@dininggroup.com' }
    : isFinance
    ? { name: 'Florence Nambatya', role: 'Head of Consumer Protection & Credit Compliance', phone: '+256 312 998 877', email: 'ombudsman@bank.co.ug' }
    : isTransport
    ? { name: 'Hajj Sulaiman Ssebaggala', role: 'Fleet Safety Director & Stage Ombudsman', phone: '+256 772 556 677', email: 'safety@transitunion.ug' }
    : did.includes('kcca') 
    ? { name: 'Eng. David Luyimbazi', role: 'Accounting Officer & Director Engineering', phone: '+256 414 901 000', email: 'engineering@kcca.go.ug' }
    : did.includes('nwsc')
    ? { name: 'Dr. Eng. Silver Mugisha', role: 'Managing Director & Accounting Officer', phone: '+256 313 315 100', email: 'md@nwsc.co.ug' }
    : did.includes('unra')
    ? { name: 'Eng. Samuel Muhoozi', role: 'Director Roads & Bridges Maintenance', phone: '+256 312 249 000', email: 'roadmaintenance@unra.go.ug' }
    : did.includes('umeme')
    ? { name: 'Selestino Babungi', role: 'Managing Director & Lead Spokesperson', phone: '+256 312 360 000', email: 'customercare@umeme.co.ug' }
    : { name: 'Chief Administrative Officer (CAO)', role: 'Statutory Accounting Officer', phone: '+256 414 000 111', email: 'cao@district.go.ug' };

  const fieldRoster = isEducation
    ? [
        { role: 'Academic Board Liaison', status: 'ON DUTY', parish: 'Senior Campus', lead: 'Mrs. S. Kateregga' },
        { role: 'Student Welfare & Safety', status: 'ACTIVE', parish: 'Boarding Facilities', lead: 'Mr. P. Otim' },
        { role: 'Tuition & Bursary Desk', status: 'OPEN', parish: 'Bursar Wing', lead: 'Accountant M. Auma' },
      ]
    : isHealth
    ? [
        { role: 'Emergency & Triage Unit', status: '24/7 ACTIVE', parish: 'Trauma Wing', lead: 'Dr. E. Kasule' },
        { role: 'Pharmacy & Drug Stocks', status: 'AUDITED', parish: 'Central Dispensary', lead: 'Pharm. K. Namubiru' },
        { role: 'Patient Rights Ombudsman', status: 'ON CALL', parish: 'Main Reception', lead: 'Nurse Supervisor B. Lutaaya' },
      ]
    : isHospitality
    ? [
        { role: 'Kitchen Hygiene Inspection', status: 'PASSED', parish: 'Central Kitchen', lead: 'Officer T. Mugenyi' },
        { role: 'Food Quality & Nutrition', status: 'MONITORED', parish: 'Pantry & Cold Storage', lead: 'QC Lead R. Alinda' },
        { role: 'Guest Services & Feedback', status: 'ACTIVE', parish: 'Front Floor', lead: 'Floor Manager D. Kigozi' },
      ]
    : isFinance
    ? [
        { role: 'ATM & Mobile Banking Desk', status: 'ONLINE 99.8%', parish: 'Metropolitan Network', lead: 'Tech Lead G. Byamukama' },
        { role: 'SME / PDM Micro-Loans Desk', status: 'ACTIVE', parish: 'Branch Hall', lead: 'Officer A. Tumushabe' },
        { role: 'Consumer Fraud Watchdog', status: 'MONITORING', parish: 'Security Center', lead: 'Analyst H. Birungi' },
      ]
    : [
        { role: 'Rapid Emergency Crew A', status: 'ON PATROL', parish: 'Metropolitan Zone', lead: 'Foreman K. Okello' },
        { role: 'Field Inspection Unit B', status: 'DISPATCHED', parish: 'Urban Center', lead: 'Officer H. Namutebi' },
        { role: 'Contractor Oversight Unit', status: 'STANDBY', parish: 'Infrastructure Desk', lead: 'Eng. P. Mukasa' },
      ];

  const countryInfo = COUNTRIES[country] || COUNTRIES.UG;
  const curr = countryInfo.currency || 'USD';
  const cName = countryInfo.name;

  // Localized fiscal grant facility and expenditure adapting per respective country
  let grantSource = '';
  let totalAllocated = 0;
  let disbursed = 0;

  // Multiplier scaled to national currency purchasing power
  let baseScale = 1;
  if (curr === 'UGX' || curr === 'TZS') {
    baseScale = 1000000000;
  } else if (curr === 'KES') {
    baseScale = 30000000;
  } else if (curr === 'NGN') {
    baseScale = 250000000;
  } else if (curr === 'GHS') {
    baseScale = 4000000;
  } else if (curr === 'RWF') {
    baseScale = 400000000;
  } else if (curr === 'EGP') {
    baseScale = 15000000;
  } else if (curr === 'ZAR') {
    baseScale = 8000000;
  } else {
    baseScale = 2500000;
  }

  if (isEducation) {
    if (country === 'KE') grantSource = 'Ministry of Education Free Day Secondary Capitation (FDSE) & Tuition Grant';
    else if (country === 'NG') grantSource = 'Universal Basic Education Commission (UBEC) Matching Capital Grant';
    else if (country === 'GH') grantSource = 'Ghana Education Trust Fund (GETFund) Institutional Facility';
    else if (country === 'RW') grantSource = 'Rwanda Basic Education Board (REB) Infrastructure Capitation';
    else if (country === 'EG') grantSource = 'Ministry of Education & Technical Education Modernization Grant';
    else if (country === 'ZA') grantSource = 'National Treasury Education Equitable Share & Infrastructure Grant';
    else if (country === 'UG') grantSource = 'Universal Primary & Secondary Capitation (MoES) Statutory Standard FY 2026/27';
    else grantSource = `${cName} Universal Capitation & Tuition Regulatory Standard FY 2026/27`;
    totalAllocated = Math.round(baseScale * 6.5);
    disbursed = Math.round(totalAllocated * 0.68);
  } else if (isHealth) {
    if (country === 'KE') grantSource = 'Social Health Authority (SHA) / Primary Healthcare Fund (PHCF)';
    else if (country === 'NG') grantSource = 'Basic Health Care Provision Fund (BHCPF) & NAFDAC Standard';
    else if (country === 'GH') grantSource = 'National Health Insurance Authority (NHIA) Primary Care Allocation';
    else if (country === 'RW') grantSource = 'Rwanda Biomedical Centre (RBC) & Mutuelle Primary Health Grant';
    else if (country === 'EG') grantSource = 'Universal Health Insurance Authority (UHIA) Medical Facility Grant';
    else if (country === 'ZA') grantSource = 'National Health Insurance (NHI) & Provincial Healthcare Allocation';
    else if (country === 'UG') grantSource = 'National Drug Authority (NDA) & Primary Healthcare (PHC) Allocation';
    else grantSource = `${cName} Primary Healthcare Allocation & Drug Quality Regulatory Fund`;
    totalAllocated = Math.round(baseScale * 8.2);
    disbursed = Math.round(totalAllocated * 0.62);
  } else if (isTransport) {
    if (country === 'KE') grantSource = 'Kenya Roads Board (KRB) / NTSA Public Transport Safety Standard';
    else if (country === 'NG') grantSource = 'Federal Road Maintenance Agency (FERMA) Transit Corridors Fund';
    else if (country === 'GH') grantSource = 'Ministry of Transport Road Fund & Safety Compliance Allocation';
    else if (country === 'RW') grantSource = 'Rwanda Transport Development Agency (RTDA) Transit Standard';
    else if (country === 'EG') grantSource = 'General Authority for Roads, Bridges & Land Transport (GARB)';
    else if (country === 'UG') grantSource = 'Uganda Road Fund / MoWT Route Operating Standard FY 2026/27';
    else grantSource = `${cName} Transport Regulation & Road Asset Maintenance Standard`;
    totalAllocated = Math.round(baseScale * 14.5);
    disbursed = Math.round(totalAllocated * 0.58);
  } else if (isFinance) {
    if (country === 'KE') grantSource = 'Central Bank of Kenya (CBK) Depositor Protection & Liquidity Standard';
    else if (country === 'NG') grantSource = 'Nigeria Deposit Insurance Corporation (NDIC) Capital Guarantee';
    else if (country === 'GH') grantSource = 'Bank of Ghana Depositor Protection Scheme (GDPS)';
    else if (country === 'RW') grantSource = 'National Bank of Rwanda (BNR) Prudential Financial Fund';
    else if (country === 'EG') grantSource = 'Central Bank of Egypt (CBE) Financial Stability & Depositor Reserve';
    else if (country === 'UG') grantSource = 'Bank of Uganda Capital Adequacy & Depositor Protection Fund';
    else grantSource = `${cName} Central Reserve Bank Capital Adequacy & Depositor Protection Fund`;
    totalAllocated = Math.round(baseScale * 18.0);
    disbursed = Math.round(totalAllocated * 0.75);
  } else if (d.category === 'utility' || did.includes('water') || did.includes('power') || did.includes('kplc') || did.includes('nwsc') || did.includes('umeme')) {
    if (country === 'KE') grantSource = 'Kenya Power (KPLC) / Water Resources Authority Infrastructure Bond';
    else if (country === 'NG') grantSource = 'Federal Ministry of Water Resources & TCN National Grid Expansion';
    else if (country === 'GH') grantSource = 'Ghana Water Company / PURC Public Utility Modernization Grant';
    else if (country === 'RW') grantSource = 'WASAC / REG Utility Capital Development & Rural Access Grant';
    else if (country === 'EG') grantSource = 'Holding Company for Water & Wastewater (HCWW) Capital Facility';
    else if (country === 'UG') grantSource = 'National Water Capital Dev & Pro-Poor Grid Expansion Grant';
    else grantSource = `${cName} Public Utility Capital Development & Grid Expansion Grant`;
    totalAllocated = Math.round(baseScale * 22.0);
    disbursed = Math.round(totalAllocated * 0.64);
  } else if (isHospitality) {
    if (country === 'KE') grantSource = 'Tourism Regulatory Authority (TRA) & Public Health Quality Standard';
    else if (country === 'NG') grantSource = 'Federal Consumer Protection Commission (FCCPC) Standards';
    else if (country === 'UG') grantSource = 'UNBS Quality Certification & Public Health Standards';
    else grantSource = `${cName} Consumer Protection & Public Health Quality Certification Standard`;
    totalAllocated = Math.round(baseScale * 3.5);
    disbursed = Math.round(totalAllocated * 0.72);
  } else {
    // Government or Municipal
    if (country === 'KE') grantSource = 'National Treasury County Revenue Allocation / NG-CDF Capital Facility';
    else if (country === 'NG') grantSource = 'Federation Account Allocation Committee (FAAC) Capital Development';
    else if (country === 'GH') grantSource = 'District Assemblies Common Fund (DACF) Capital Expenditure';
    else if (country === 'RW') grantSource = 'Ministry of Local Government (MINALOC) LODA Development Fund';
    else if (country === 'EG') grantSource = 'Ministry of Finance National Public Investment & Infrastructure Docket';
    else if (country === 'UG') grantSource = 'MoFPED DDEG / Uganda Road Fund Capital Grant FY 2026/27';
    else grantSource = `${cName} Discretionary Equalisation & Municipal Capital Development Grant`;
    totalAllocated = Math.round(baseScale * 12.0);
    disbursed = Math.round(totalAllocated * 0.60);
  }

  const fiscalGrant = {
    source: grantSource,
    totalAllocated,
    disbursed,
    currency: curr,
    openAuditHash: `0x${((did.charCodeAt(0) * 8912347) ^ 0xabcdef12).toString(16)}6f72a0...9f42`,
  };

  const filteredPosts = deptPosts.filter((p) => {
    if (activeSubTab === 'unresolved') return p.status !== 'resolved';
    if (activeSubTab === 'resolved') return p.status === 'resolved';
    if (activeSubTab === 'overdue') return p.status === 'overdue' || p.gov_status === 'overdue';
    return true;
  });

  return (
    <div className="animate-fade-in pb-24 text-slate-950 dark:text-white">
      {/* Top Navigation & Profile Header */}
      <div className="px-4 pt-4 pb-0 bg-white dark:bg-slate-950 border-b border-slate-300 dark:border-slate-800 shadow-2xs">
        <button
          onClick={() => go('departments')}
          className="flex items-center gap-1 text-xs mono font-black text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 mb-3 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Entities Registry
        </button>

        <div className="flex items-start justify-between gap-3.5 mb-4">
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-slate-700 dark:text-slate-300 flex-shrink-0">
              <DeptIcon dept={d} size={26} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white leading-tight">
                  {d.name}
                </h2>
                {isConsumer ? (
                  <span className="chip ch-private text-[9px]">Verified Private Utility</span>
                ) : (
                  <span className="chip ch-gov text-[9px]">Sovereign Desk</span>
                )}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{d.full}</p>
              {d.ministry && <p className="text-[10px] mono text-slate-600 dark:text-slate-400 mt-0.5 font-bold">{d.ministry}</p>}
            </div>
          </div>

          {/* Wall Aligned Action Buttons */}
          <div className="shrink-0 pt-0.5 flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowPlacardModal(true)}
              className="px-3 py-2 rounded-xl text-xs mono font-black bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer transition active:scale-95"
              title="Download or Print Counter QR Placard for Reception Desk"
            >
              <QrCode size={14} className="text-amber-500" />
              <span>Counter QR Placard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const activeU = user || ensureCitizenSession();
                const followedList = activeU.followed || [];
                const isF = followedList.includes(did);
                const updated = isF ? followedList.filter((x: string) => x !== did) : [...followedList, did];
                setUser({ ...activeU, followed: updated });
                toast(isF ? `Removed ${d.name} from My Stake` : `Added ${d.name} to My Stake`, 'emerald');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs mono font-black border transition-all shadow-2xs active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                (user?.followed || []).includes(did)
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-600 dark:border-amber-400 shadow-amber-500/25 ring-2 ring-amber-400/40'
                  : 'bg-amber-50/90 hover:bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-700/80 hover:border-amber-400'
              }`}
              title={(user?.followed || []).includes(did) ? 'Pinned to your monitored stake watchlist' : 'Pin to your monitored stake watchlist'}
              aria-label={(user?.followed || []).includes(did) ? `Remove ${d.name} from My Stake` : `Add ${d.name} to My Stake`}
            >
              <Bookmark size={13} className={(user?.followed || []).includes(did) ? 'fill-current text-slate-950' : 'text-amber-700 dark:text-amber-400'} />
              <span>{(user?.followed || []).includes(did) ? 'In My Stake' : '+ My Stake'}</span>
            </button>
          </div>
        </div>

        {/* Private-First Provider Claim & Subscription Status Banner */}
        {isConsumer ? (
          isClaimed ? (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl mb-4 flex items-center justify-between flex-wrap gap-2.5 shadow-2xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="chip ch-resolved text-[9px] font-black flex items-center gap-1">
                  <CheckCircle2 size={11} /> Verified Founding Partner · {claimRecord?.plan?.toUpperCase()} Plan (30-Day Free Trial)
                </span>
                <span className="text-xs text-emerald-950 dark:text-emerald-200 font-semibold">
                  Desk: {claimRecord?.representativeName} · Guaranteed {d.sla || 24}h SLA Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEmbedModal(true)}
                  className="px-2.5 py-1 rounded-xl text-[10.5px] mono font-black bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  <Code size={12} />
                  <span>Embed Trust Badge</span>
                </button>
                <button
                  onClick={() => go('entity_gateway')}
                  className="px-2.5 py-1 rounded-xl text-[10.5px] mono font-bold bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 flex items-center gap-1 cursor-pointer"
                >
                  <span>Provider Portal</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 mb-4">
              <div className="p-4 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700 rounded-lg space-y-3">
                <div className="flex items-start justify-between flex-wrap gap-2.5">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="chip text-[9.5px] font-black bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-700 flex items-center gap-1">
                        <AlertTriangle size={12} className="text-rose-600" /> Unclaimed Entity Portal · Consumer Neglect Alert
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-400">
                        {deptPosts.length} Public Reports · 0% Response Rate
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                      <strong>{d.name}</strong> has not yet activated their customer care response desk on CivicDuty. All private providers currently qualify for our <strong>100% Free 30-Day Founding Partner Trial ($0 Due Today)</strong>. Reports submitted below remain 100% public, visible, and indexed across all citizen feeds.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        nudgeEntity(did);
                        const tweetText = `Dear @${d.id} leadership, citizens have filed ${deptPosts.length} complaints on CivicDuty. Claim your free 30-Day Founding Partner desk to resume public customer care: ${typeof window !== 'undefined' ? window.location.href : ''}`;
                        if (typeof window !== 'undefined') {
                          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs mono font-black bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-2xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                      title="Nudge Brand Executives on X & Social Media"
                    >
                      <Megaphone size={13} />
                      <span>Nudge Leadership ({nudgeCounts[did] || 0})</span>
                    </button>

                    <button
                      onClick={() => setShowClaimModal(true)}
                      className="px-3.5 py-2 rounded-xl text-xs mono font-black bg-emerald-700 hover:bg-emerald-600 text-white shadow-2xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      <ShieldCheck size={13} />
                      <span>Claim Free 30-Day Trial Desk</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer Care Market Dynamics: Defection and Competitive Churn */}
              <CustomerDefectionNotice
                dept={d}
                complianceRate={deptPosts.length > 0 ? Math.round((resolved / deptPosts.length) * 100) : 85}
                unresolvedCount={live}
                onClaimClick={() => setShowClaimModal(true)}
                variant="banner"
              />
            </div>
          )
        ) : isClaimed ? (
          <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl mb-4 flex items-center justify-between flex-wrap gap-2.5 text-xs shadow-2xs">
            <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
              <span className="chip ch-gov text-[9px] font-black flex items-center gap-1">
                <Landmark size={11} /> Sovereign Public Desk · State-Chartered &amp; Subscribed
              </span>
              <span className="text-xs text-blue-950 dark:text-blue-200 font-medium">
                Provisioned via National Treasury &amp; MoLG Statutory Vote Allocation · Whole-of-Government SLA Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => go('ps_molg_rollout')}
                className="px-2.5 py-1 rounded-xl text-[10.5px] mono font-black bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                <FileText size={12} />
                <span>MoLG National Rollout Docket</span>
              </button>
              <span className="text-[10px] mono font-black text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 border border-blue-300 dark:border-blue-700">
                {d.sla || 48}h Statutory SLA
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700 rounded-lg mb-4 space-y-3">
            <div className="flex items-start justify-between flex-wrap gap-2.5">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="chip text-[9.5px] font-black bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                    <Landmark size={12} className="text-amber-600" /> Unsubscribed Government Desk · Executive Action Required
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-400">
                    {deptPosts.length} Citizen Reports Pending Official Subscription
                  </span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  The official supervisory desk for <strong>{d.name}</strong> has not activated their sovereign annual subscription yet. 
                  <strong> Citizen reports remain active and public to all users</strong>, but official investigation responses, statutory audit sign-offs, and disciplinary desk routing will activate once the Accounting Officer / Mayor subscribes.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    nudgeEntity(did);
                    const tweetText = `Public notice: ${d.name} has ${deptPosts.length} unresolved citizen reports on CivicDuty. We urge the Accounting Officer to activate the statutory desk subscription: ${typeof window !== 'undefined' ? window.location.href : ''}`;
                    if (typeof window !== 'undefined') {
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs mono font-black bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-2xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  title="Nudge Mayor / Town Clerk on Social Media"
                >
                  <Megaphone size={13} />
                  <span>Nudge Official ({nudgeCounts[did] || 0})</span>
                </button>

                <button
                  onClick={() => go('gov_billing')}
                  className="px-3.5 py-2 rounded-xl text-xs mono font-black bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  <Building2 size={13} />
                  <span>Subscribe Government Desk</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Contact & USSD Hotlines Bar */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-4 flex items-center justify-between gap-2 flex-wrap text-[10px] mono">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 font-black flex items-center gap-1.5 shadow-2xs">
              <Radio size={11} className="text-indigo-600 dark:text-indigo-400" />
              <span>USSD: {ussdCode}</span>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold flex items-center gap-1.5 shadow-2xs">
              <PhoneCall size={11} className="text-emerald-600 dark:text-emerald-400" />
              <span>Hotline: {tollFree}</span>
            </span>
          </div>

          <button
            onClick={() => setShowOfficerRoster(!showOfficerRoster)}
            className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl font-black text-[10px] mono flex items-center gap-1 hover:bg-slate-300 transition-colors"
          >
            <UserCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
            <span>{showOfficerRoster ? 'Hide Officers' : 'Designated Officers Roster'}</span>
          </button>
        </div>

        {/* Expandable Officer & Field Roster */}
        {showOfficerRoster && (
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 mb-4 space-y-3 a-fade shadow-md">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-950 dark:text-white flex items-center gap-1.5">
                <UserCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Statutory Accounting Officer & Designated Desks</span>
              </span>
              <span className="text-[9px] mono font-bold text-slate-500">Public Audit Registry</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
              <div className="font-black text-slate-950 dark:text-white">{accountingOfficer.name}</div>
              <div className="text-[10.5px] mono text-slate-600 dark:text-slate-400">{accountingOfficer.role}</div>
              <div className="flex items-center gap-4 text-[10px] mono pt-1 text-slate-700 dark:text-slate-300 font-bold">
                <span>Tel: {accountingOfficer.phone}</span>
                <span>Email: {accountingOfficer.email}</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[9.5px] mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-black block">
                Live On-Duty Field Inspection Teams
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {fieldRoster.map((f, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-[10px] mono">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 dark:text-slate-100">{f.role}</span>
                      <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-400">
                        {f.status}
                      </span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 text-[9px]">{f.parish}</div>
                    <div className="text-slate-800 dark:text-slate-200 font-bold">{f.lead}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Public Expenditure & Fiscal Grant Docket */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 mb-4 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-950 dark:text-white flex items-center gap-1.5">
              <Coins size={13} className="text-amber-600 dark:text-amber-400" />
              <span>Public Capital Grant Ledger & Disbursed Expenditure</span>
            </span>
            <span className="text-[8.5px] mono font-black px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              AUDIT VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[10px] mono">
            <div>
              <span className="text-slate-600 dark:text-slate-400 block font-bold">Grant Facility</span>
              <span className="text-slate-950 dark:text-white font-black text-[11px]">{fiscalGrant.source}</span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400 block font-bold">Approved Budget</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-black text-xs">
                {fiscalGrant.currency} {fiscalGrant.totalAllocated.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block font-bold">Disbursed to Date</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold">
                {fiscalGrant.currency} {fiscalGrant.disbursed.toLocaleString()} ({Math.round((fiscalGrant.disbursed / fiscalGrant.totalAllocated) * 100)}%)
              </span>
            </div>
            <div>
              <span className="text-slate-500 block font-bold">Active Public Tenders</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold">{deptProjects.length || 2} Works in Progress</span>
            </div>
          </div>
        </div>

        {/* Service Performance & Customer SLA Docket */}
        <AccountabilityDocket
          leftLabel={`${deptPosts.length} Total Reports`}
          leftSubLabel={isConsumer ? `${d.sla || 24}HR CUSTOMER CARE SLA` : `${d.sla || 48}HR STATUTORY SLA`}
          centerVal={live}
          centerLabel="ACTIVE"
          rightLabel={`${resPct}% Resolved`}
          rightSubLabel={`${resolved} Confirmed`}
          high={resPct >= 75}
        />
      </div>

      {/* Main Tabs: Posts, Announcements, Public Projects & Tenders */}
      <div className="border-t border-b border-slate-300 dark:border-slate-800 flex mt-3 bg-white dark:bg-slate-950">
        {[
          { id: 'posts', label: `Public Reports (${deptPosts.length})` },
          { id: 'projects', label: `Capital Projects & Tenders (${deptProjects.length})` },
          { id: 'announcements', label: 'Gazette & Bulletins' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setWallTab(t.id as any)}
            className={`feed-tab flex-1 py-3 text-xs font-black mono transition-all ${
              wallTab === t.id
                ? 'border-b-2 border-emerald-600 text-emerald-800 dark:text-emerald-400 bg-emerald-50/50 dark:bg-slate-900'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Posts */}
      {wallTab === 'posts' ? (
        <div>
          {/* Quick Post Button */}
          <div className="p-3.5 border-b border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <button
              onClick={() => go('compose')}
              className="w-full flex items-center gap-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl px-4 py-3 hover:border-emerald-500 transition-all shadow-xs active:scale-[.99]"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-800 dark:text-emerald-400">
                <Plus size={16} />
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex-1 text-left">
                Submit an on-ground incident to {d.name} desk...
              </span>
              <span className="text-[10px] mono text-white bg-emerald-700 px-3 py-1 rounded-xl font-black shadow-xs">
                FILE REPORT
              </span>
            </button>
          </div>

          {/* Sub-Filters: All vs Unresolved vs Resolved vs Overdue */}
          <div className="px-4 py-2 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[10.5px] mono font-bold">
            {[
              { id: 'all', label: `All (${deptPosts.length})` },
              { id: 'unresolved', label: `Active (${live})` },
              { id: 'resolved', label: `Resolved (${resolved})` },
              { id: 'overdue', label: `Overdue (${overdue})` },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id as any)}
                className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all ${
                  activeSubTab === sub.id
                    ? 'bg-emerald-700 text-white shadow-2xs font-black'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Posts Feed */}
          <div className="divide-y divide-slate-300 dark:divide-slate-800">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 text-xs text-slate-500 mono font-bold space-y-1">
                <p>No reports currently matching filter.</p>
                <p className="text-[10px] text-slate-400">All submissions are monitored under statutory 48-hour SLA.</p>
              </div>
            ) : (
              filteredPosts.map((p) => (
                <div key={p.id} className="relative group bg-white dark:bg-slate-950">
                  <PostCardComponent post={p} />
                  <div className="px-4 pb-3 -mt-1 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCitizen({
                          name: p.citizen_name || 'Verified Citizen',
                          postId: p.id,
                        });
                        setRewardModalOpen(true);
                      }}
                      className="text-[9.5px] mono font-black bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all shadow-2xs active:scale-95"
                    >
                      <Gift size={11} className="text-amber-600 dark:text-amber-400" />
                      <span>Reward Citizen</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : wallTab === 'projects' ? (
        /* Capital Projects & Tenders Tab */
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs mono font-black text-slate-950 dark:text-white uppercase tracking-wider">
              Active Public Works & Tenders ({deptProjects.length})
            </p>
            <span className="text-[9px] mono text-slate-500 font-bold">PPDA Registered</span>
          </div>

          {deptProjects.length === 0 ? (
            <div className="p-6 text-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl space-y-1">
              <p className="text-xs font-black text-slate-800 dark:text-slate-200">No capital projects currently registered.</p>
              <p className="text-[10px] text-slate-500">Upcoming works will be automatically synced with national PPDA gazette.</p>
            </div>
          ) : (
            deptProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  setActiveProject(proj);
                  go('project');
                }}
                className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 space-y-3 cursor-pointer hover:border-emerald-500 transition-all shadow-2xs group"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm font-black text-slate-950 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {proj.title}
                  </span>
                  <span className="chip ch-invest text-[9px]">{proj.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] mono text-slate-700 dark:text-slate-300 font-bold">
                  <div>Contractor: <strong className="text-slate-950 dark:text-white">{proj.contractor}</strong></div>
                  <div>Contract Value: <strong className="text-emerald-700 dark:text-emerald-400">{proj.value}</strong></div>
                </div>

                <div className="flex items-center justify-between text-[9px] mono text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-2 font-bold">
                  <span>Target Completion: {proj.completes}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-black">
                    <span>Inspect Full Dossier</span>
                    <ExternalLink size={10} />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Official Bulletins Tab */
        <div className="p-4 space-y-3">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="chip ch-budget text-[9px]">Official Statutory Gazette</span>
              <span className="text-[9px] mono text-slate-500 font-bold">August 2026</span>
            </div>
            <p className="text-sm font-black text-slate-950 dark:text-white">
              {d.name} — Comprehensive Infrastructure & Works Bulletin
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Statutory quarter review complete. Emergency pothole patching and drain culvert repairs active across 14 municipal zones. Field crews dispatched under SLA oversight.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-[9.5px] mono font-bold text-slate-600 dark:text-slate-400">
              <span>Authorized: {accountingOfficer.name}</span>
              <span className="chip ch-gov text-[8px]">Sovereign Signed</span>
            </div>
          </div>
        </div>
      )}

      {/* Reward Citizen Modal */}
      <RewardModal
        isOpen={rewardModalOpen}
        onClose={() => setRewardModalOpen(false)}
        targetCitizenName={selectedCitizen.name}
        postId={selectedCitizen.postId}
        entityName={user?.dept_label || d.name}
        contextTitle={`${d.name} Public Wall`}
      />

      {/* Provider Claim & Subscribe Modal */}
      <ProviderClaimModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        targetDept={d}
      />

      {/* Embed Trust Badge Modal */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="text-emerald-600 dark:text-emerald-400" size={20} />
                <h3 className="text-base font-black">CivicDuty Verified Trust Badge</h3>
              </div>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Showcase your verified citizen satisfaction and resolution integrity. Paste this HTML snippet onto your company or institution website.
            </p>

            {/* Badge Preview */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={22} className="text-emerald-600 dark:text-emerald-400" />
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">{d.name}</div>
                  <div className="text-[10px] text-slate-500">CivicDuty Verified Provider · {d.trustScore || 94}% Trust Index</div>
                </div>
              </div>
              <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Guaranteed SLA
              </span>
            </div>

            {/* Code Snippet Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>Embed Code (HTML)</span>
                <button
                  onClick={() => {
                    const code = `<div class="civicduty-badge" data-entity="${d.id}" data-trust="${d.trustScore || 94}%">\n  <span class="shield">[VERIFIED]</span> Verified by CivicDuty · ${d.trustScore || 94}% Trust Index\n</div>`;
                    navigator.clipboard.writeText(code);
                    setCopiedBadge(true);
                    toast('Badge code copied to clipboard!', 'emerald');
                    setTimeout(() => setCopiedBadge(false), 3000);
                  }}
                  className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-black hover:underline"
                >
                  {copiedBadge ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedBadge ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto border border-slate-800">
{`<div class="civicduty-badge" data-entity="${d.id}" data-trust="${d.trustScore || 94}%">
  <span class="shield">[VERIFIED]</span> Verified by CivicDuty · ${d.trustScore || 94}% Trust Index
</div>`}
              </pre>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowEmbedModal(false)}
                className="btn btn-secondary text-xs px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Counter QR Placard Modal */}
      <QrCodeModal
        isOpen={showPlacardModal}
        onClose={() => setShowPlacardModal(false)}
        type="desk"
        dept={d}
      />
    </div>
  );
};
