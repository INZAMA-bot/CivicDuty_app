import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Department, CountryCode } from '../types';
import { COUNTRIES, allDepts } from '../data/countries';
import { primaryUnit, tiersFor } from '../data/tiers';
import { INITIAL_PARTNERSHIPS } from '../data/partnerships';
import { getCountryBranding } from '../data/countryBranding';
import {
  X,
  Building2,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Smartphone,
  FileText,
  Lock,
  ArrowRight,
  Zap,
  Award,
  Globe,
  Headphones,
  Code,
  Copy,
  Check,
  Star,
  TrendingDown,
  MapPin,
  Compass,
  Calendar,
  Landmark,
  Shield,
  Search
} from 'lucide-react';
import { DeptIcon } from './DeptIcon';

interface ProviderClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDept?: Department | null;
  targetCountry?: CountryCode;
  onSuccessClaim?: (dept: Department) => void;
}

export type TerritoryPlanKey = 'community_single' | 'cluster' | 'district' | 'national';

interface TerritoryPlanConfig {
  id: TerritoryPlanKey;
  name: string;
  scopeLabel: string;
  unitRange: string;
  units: number;
  monthlyUsd: number;
  annualUsd: number;
  free?: boolean;
  popular?: boolean;
  features: string[];
}

// Detect if a department is a state statutory/government desk
const isCivicDept = (dept?: Department | null): boolean => {
  if (!dept) return false;
  return (
    dept.lane === 'civic' ||
    dept.category === 'government' ||
    dept.category === 'statutory' ||
    Boolean(dept.ministry)
  );
};

export const ProviderClaimModal: React.FC<ProviderClaimModalProps> = ({
  isOpen,
  onClose,
  targetDept,
  targetCountry,
  onSuccessClaim,
}) => {
  const { user, claimEntity, isEntityClaimed, getClaimedEntity, go, toast } = useApp();

  const country: CountryCode = targetCountry || (user?.country as CountryCode) || 'UG';
  const countryData = COUNTRIES[country] || COUNTRIES.UG;
  const branding = getCountryBranding(country);
  const currentPartnership = INITIAL_PARTNERSHIPS.find((p) => p.countryCode === country);

  // Available departments strictly filtered for PRIVATE commercial / consumer entities.
  // Government ministries, statutory agencies, and regulatory authorities are provisioned
  // centrally under the Sovereign National Accord by Government-appointed personnel.
  const rawDepts = allDepts(country);
  const privateDepts = rawDepts.filter((d) => !isCivicDept(d));
  const availableDepts = privateDepts.length > 0 ? privateDepts : rawDepts;

  // Track whether viewing sovereign civic statutory explanation notice
  const [viewingCivicNotice, setViewingCivicNotice] = useState<boolean>(() => isCivicDept(targetDept));

  // Billing interval toggle
  const [interval, setInterval] = useState<'monthly' | 'annual'>('monthly');

  // Selected department to claim (ensuring it defaults to a private commercial entity)
  const initialDeptId = targetDept && !isCivicDept(targetDept)
    ? targetDept.id
    : availableDepts[0]?.id || '';
  const [selectedDeptId, setSelectedDeptId] = useState<string>(initialDeptId);
  const [planKey, setPlanKey] = useState<TerritoryPlanKey>('district');

  // Search & category filter state for finding desired desk/department
  const [deptSearchQuery, setDeptSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | string>('all');
  const [allowSwitchEntity, setAllowSwitchEntity] = useState<boolean>(!targetDept);

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    availableDepts.forEach((d) => {
      if (d.category) set.add(d.category);
    });
    return Array.from(set);
  }, [availableDepts]);

  const filteredDepts = useMemo(() => {
    const query = deptSearchQuery.toLowerCase().trim();
    return availableDepts.filter((d) => {
      const matchesCategory = selectedCategoryFilter === 'all' || d.category === selectedCategoryFilter;
      if (!query) return matchesCategory;
      const matchesQuery =
        d.name.toLowerCase().includes(query) ||
        (d.full && d.full.toLowerCase().includes(query)) ||
        (d.location && d.location.toLowerCase().includes(query)) ||
        (d.category && d.category.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [availableDepts, deptSearchQuery, selectedCategoryFilter]);

  useEffect(() => {
    if (targetDept && isCivicDept(targetDept)) {
      setViewingCivicNotice(true);
    } else if (targetDept?.id) {
      setViewingCivicNotice(false);
      setSelectedDeptId(targetDept.id);
    } else if (availableDepts.length > 0 && !availableDepts.some((d) => d.id === selectedDeptId)) {
      setViewingCivicNotice(false);
      setSelectedDeptId(availableDepts[0].id);
    }
  }, [targetDept, country]);

  // Form fields
  const [repName, setRepName] = useState(user?.name || '');
  const [workEmail, setWorkEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Director / Head of Customer Care');
  const [tinOrReg, setTinOrReg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card' | 'invoice'>('momo');
  const [paymentAccount, setPaymentAccount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedDept, setCompletedDept] = useState<Department | null>(null);
  const [copiedBadge, setCopiedBadge] = useState(false);

  if (!isOpen) return null;

  const fallbackDept: Department = {
    id: `${country}_general`,
    country,
    name: `${countryData.name} Service Provider`,
    full: `${countryData.name} Commercial & Customer Care Desk`,
    category: 'private_utility',
    icon: 'building',
    sla: 24,
    trustScore: 92,
  };

  const currentDept = availableDepts.find((d) => d.id === selectedDeptId) || targetDept || availableDepts[0] || fallbackDept;
  const alreadyClaimed = currentDept ? isEntityClaimed(currentDept.id) : false;
  const claimRecord = currentDept ? getClaimedEntity(currentDept.id) : undefined;

  // Local territory naming
  const primary = primaryUnit(country) || 'Ward / Parish';
  const primaryPlural = `${primary}s`;
  const tiers = tiersFor(country);
  const l1Unit = tiers[1]?.unit || 'District / County';

  // Currency rate mapping
  const rateMap: Record<string, { currency: string; rate: number }> = {
    UG: { currency: 'UGX', rate: 3750 },
    KE: { currency: 'KES', rate: 130 },
    NG: { currency: 'NGN', rate: 1500 },
    GH: { currency: 'GHS', rate: 15.5 },
    RW: { currency: 'RWF', rate: 1350 },
    TZ: { currency: 'TZS', rate: 2600 },
    ZA: { currency: 'ZAR', rate: 18.5 },
    EG: { currency: 'EGP', rate: 48.5 },
  };

  const currentRate = rateMap[country] || { currency: countryData.currency || 'USD', rate: 1 };

  const formatPrice = (usdAmount: number, isAnnualSelected: boolean) => {
    if (usdAmount === 0) return 'Free';
    const converted = Math.round(usdAmount * currentRate.rate);
    const curr = currentRate.currency;
    const formatted = curr === 'USD' ? `$${converted.toLocaleString()}` : `${curr} ${converted.toLocaleString()}`;
    return `${formatted}${isAnnualSelected ? '/yr' : '/mo'}`;
  };

  const territoryPlans: Record<TerritoryPlanKey, TerritoryPlanConfig> = {
    community_single: {
      id: 'community_single',
      name: 'Community Desk',
      scopeLabel: `1 ${primary} (Single Neighborhood)`,
      unitRange: `1 local ${primary} footprint`,
      units: 1,
      monthlyUsd: 0,
      annualUsd: 0,
      free: true,
      features: [
        `Official Verified Checkmark on Public Directory`,
        `Direct Citizen Complaint SMS / Email Dispatch`,
        `Official Signed Public Response capability`,
        `Standard 48h Public SLA tracking`,
        `2 Staff responder seats (Self-Serve)`,
      ],
    },
    cluster: {
      id: 'cluster',
      name: 'Sub-County Cluster',
      scopeLabel: `2 – 50 ${primaryPlural} (Multi-Neighborhood)`,
      unitRange: `Up to 50 ${primaryPlural}`,
      units: 25,
      monthlyUsd: 19,
      annualUsd: 190, // Saves $38 (2 months free)
      features: [
        `Everything in Community Desk`,
        `Multi-neighborhood complaint triage & routing`,
        `5 Staff responder & supervisor seats`,
        `Weekly Customer Satisfaction (CSAT) analytics`,
        `Mobile Money (MTN / Airtel / M-Pesa) billing`,
      ],
    },
    district: {
      id: 'district',
      name: `${l1Unit} Jurisdiction`,
      scopeLabel: `51 – 500 ${primaryPlural} (${l1Unit}-Wide)`,
      unitRange: `${l1Unit}-wide operating network`,
      units: 150,
      monthlyUsd: 89,
      annualUsd: 890, // Saves $178 (2 months free)
      popular: true,
      features: [
        `Everything in Cluster Tier`,
        `Fast-Track 12h / 24h Resolution SLA Guarantee badge`,
        `Embeddable "CivicDuty Verified Trust Index" Website Badge`,
        `Official Resolution Certificate & Evidence Vault uploads`,
        `15 Staff responder seats with departmental routing`,
      ],
    },
    national: {
      id: 'national',
      name: 'National Enterprise',
      scopeLabel: `501+ ${primaryPlural} (Whole-of-Country)`,
      unitRange: `Nationwide branch network`,
      units: 501,
      monthlyUsd: 299,
      annualUsd: 2990, // Saves $598 (2 months free)
      features: [
        `Everything in ${l1Unit} Tier`,
        `Unlimited branches & nationwide consumer coverage`,
        `Unlimited responder & executive auditor seats`,
        `CRM Webhook & API integration (Zendesk / Salesforce / ERP)`,
        `Dedicated CivicDuty Dispute Resolution Arbiter`,
      ],
    },
  };

  const selectedPlanData = territoryPlans[planKey];
  const activeFeeUsd = interval === 'annual' ? selectedPlanData.annualUsd : selectedPlanData.monthlyUsd;
  const effectiveMonthlyUsd = interval === 'annual' ? Math.round(selectedPlanData.annualUsd / 12) : selectedPlanData.monthlyUsd;

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDept) return;

    if (!repName.trim() || !workEmail.trim() || !phone.trim()) {
      toast('Please provide your name, official work email, and phone', 'amber');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const trialEndIso = new Date(Date.now() + 30 * 86400000).toISOString();
      claimEntity({
        deptId: currentDept.id,
        country,
        businessName: currentDept.name,
        representativeName: repName.trim(),
        officialEmail: workEmail.trim(),
        phone: phone.trim(),
        role: role.trim(),
        plan: planKey,
        tinOrReg: tinOrReg.trim() || undefined,
        monthlyFee: 0,
        billingInterval: interval,
        territoryScope: selectedPlanData.scopeLabel,
        unitsCovered: selectedPlanData.units,
        feeUsd: 0,
        localCurrencyPrice: '$0 (30-Day Founding Partner Trial)',
        trialStatus: 'founding_partner_trial',
        trialEndsAt: trialEndIso,
      });

      setIsSubmitting(false);
      setCompletedDept(currentDept);
      if (onSuccessClaim) {
        onSuccessClaim(currentDept);
      }
      toast(`Activated ${currentDept.name} on 30-Day Founding Partner Free Trial (${selectedPlanData.name})!`, 'emerald');
    }, 600);
  };

  const badgeCode = `<div class="civicduty-verified-badge" data-entity="${currentDept?.id}" data-trust="${currentDept?.trustScore || 94}%">
  <span class="badge-icon">VERIFIED</span>
  <span class="badge-text">CivicDuty Verified Service Provider · ${currentDept?.trustScore || 94}% Trust Index</span>
</div>`;

  const handleCopyBadge = () => {
    navigator.clipboard.writeText(badgeCode);
    setCopiedBadge(true);
    toast('Website Trust Badge code copied to clipboard!', 'emerald');
    setTimeout(() => setCopiedBadge(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto text-slate-800 dark:text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${viewingCivicNotice && targetDept ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700/60' : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700/60'} flex items-center justify-center border shrink-0`}>
              {viewingCivicNotice && targetDept ? <Landmark size={20} /> : <Building2 size={20} />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {viewingCivicNotice && targetDept ? 'Sovereign Government Desk Status' : 'Private Provider Desk & Territory Subscription'}
                </h3>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  {countryData.name} ({countryData.currency})
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {viewingCivicNotice && targetDept
                  ? 'Centrally provisioned under Sovereign Bilateral Civic Accord for public desks'
                  : `Priced by geographic administrative footprint (${primaryPlural} covered) · Monthly or Annual Billing`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {viewingCivicNotice && targetDept ? (
            /* Sovereign Government Desk Notice Screen */
            <div className="py-2 sm:py-4 px-2 sm:px-4 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 mx-auto flex items-center justify-center border-2 border-blue-400 dark:border-blue-700 shadow-inner">
                <Landmark size={34} />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-300 dark:border-blue-700">
                  <Landmark size={12} />
                  Sovereign Statutory Entity · State-Chartered
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {targetDept.name} ({targetDept.full})
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                  Government ministries, municipal councils, and statutory regulatory authorities are <strong>not commercial entities</strong> and do not pay commercial territory subscriptions. They are centrally provisioned under the <strong>Sovereign National Civic Accord</strong> by Government-appointed personnel on behalf of all government and regulatory desks.
                </p>
              </div>

              {/* Bilateral Accord Information Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-left max-w-lg mx-auto space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Bilateral Sovereign Accord:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{currentPartnership?.mouReference || `MOU-${country}-STATUTORY-2026`}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Subscribing Authority:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentPartnership?.leadMinistry || targetDept.ministry || 'National Treasury & Ministry of Local Government'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Government Appointed Personnel:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentPartnership?.focalOfficer || 'Principal Secretary / Secretary to Treasury'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Citizen Cost:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">100% Free Public Service (Statutory Vote Funded)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-medium">Active Statutory Mandate:</span>
                  <span className="font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                    <CheckCircle2 size={13} /> {targetDept.sla || 48}h Whole-of-Government SLA Active
                  </span>
                </div>
              </div>

              {/* Clarification Callout */}
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-xl text-xs text-amber-900 dark:text-amber-300 max-w-lg mx-auto text-left leading-relaxed">
                <strong>Why Commercial Subscriptions Exist:</strong> Commercial territory fees ($49/mo etc.) apply exclusively to private businesses (private clinics, schools, SACCOs, transport operators, and telecoms) who need to protect their customer retention and prevent defection. Government desks are already subscribed for by State-appointed personnel.
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    go('gov_partnership');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs mono flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Landmark size={14} /> Open Government Personnel Portal
                </button>
                <button
                  onClick={() => {
                    setViewingCivicNotice(false);
                    setSelectedDeptId(availableDepts[0]?.id || '');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-xs mono active:scale-95 transition-all cursor-pointer"
                >
                  Claim a Private Business Instead
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : completedDept ? (
            /* Post-Claim Success Screen */
            <div className="text-center py-6 px-4 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border-2 border-emerald-400 dark:border-emerald-700 shadow-inner">
                <ShieldCheck size={36} />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Official Accreditation Confirmed
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {completedDept.name} is Officially Activated!
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Your business profile is now protected under the{' '}
                  <strong className="text-slate-900 dark:text-white">{selectedPlanData.name}</strong> ({interval} billing) with verified customer care dispatch across {selectedPlanData.scopeLabel}.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Representative:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{repName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Territory Coverage:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedPlanData.scopeLabel}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Billing Term:</span>
                  <span className="font-bold text-slate-900 dark:text-white capitalize">{interval} ({formatPrice(activeFeeUsd, interval === 'annual')})</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={13} /> Active Verified SLA
                  </span>
                </div>
              </div>

              {/* Trust Badge Widget Snippet */}
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 text-left max-w-lg mx-auto space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Code size={14} /> Embed Verified Trust Index on Your Website
                  </div>
                  <button
                    onClick={handleCopyBadge}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-200 flex items-center gap-1 transition-all"
                  >
                    {copiedBadge ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedBadge ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="text-[10px] mono bg-slate-950 p-2.5 rounded-lg overflow-x-auto text-slate-300 border border-slate-800">
                  {badgeCode}
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    go('entity_gateway');
                  }}
                  className="btn btn-primary flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 shadow-md shadow-emerald-600/20"
                >
                  <ShieldCheck size={14} /> Open Provider Console
                </button>
                <button
                  onClick={() => {
                    onClose();
                    go('depts');
                  }}
                  className="btn btn-secondary text-xs font-bold px-4 py-2.5"
                >
                  Return to Directory
                </button>
              </div>
            </div>
          ) : (
            /* Active Claim Form */
            <form onSubmit={handleClaimSubmit} className="space-y-6">
              {/* Sovereign Accord Clarification Banner for Public Officials */}
              <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs text-blue-950 dark:text-blue-200">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Landmark size={15} className="text-blue-700 dark:text-blue-400 shrink-0" />
                  <span className="text-[11.5px] leading-snug">
                    <strong>Government or Regulatory Officer?</strong> Public desks are centrally provisioned under the Sovereign Civic Accord by Government-appointed personnel.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    go('gov_partnership');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-black text-[10px] mono shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all"
                >
                  Gov Accord Portal →
                </button>
              </div>

              {/* Entity Selector or Header Card */}
              <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-3.5 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                      <DeptIcon dept={currentDept} size={18} />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {currentDept.name}
                        </span>
                        {alreadyClaimed ? (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                            Claimed & Verified
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                            Unclaimed Profile
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {currentDept.full} {currentDept.location ? `· ${currentDept.location}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] mono text-slate-500">Public Trust Index</div>
                      <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        {currentDept.trustScore || 85}%
                      </div>
                    </div>
                    {targetDept && !allowSwitchEntity && (
                      <button
                        type="button"
                        onClick={() => setAllowSwitchEntity(true)}
                        className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Search size={12} />
                        <span>Change</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Option to search & switch entity */}
                {(!targetDept || allowSwitchEntity) && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Search size={12} className="text-emerald-600" />
                        <span>Search &amp; Select Private Desk to Claim:</span>
                      </label>
                      <span className="text-[9.5px] mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        {filteredDepts.length} of {availableDepts.length} available
                      </span>
                    </div>

                    {/* Search Input Bar with Clear Button */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <Search size={14} />
                      </div>
                      <input
                        type="text"
                        value={deptSearchQuery}
                        onChange={(e) => setDeptSearchQuery(e.target.value)}
                        placeholder={`Search ${countryData.name} private desks by name, university, SACCO, hospital, school...`}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-8 py-2 text-xs font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                      />
                      {deptSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setDeptSearchQuery('')}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          title="Clear search"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Category Filter Chips */}
                    {availableCategories.length > 1 && (
                      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setSelectedCategoryFilter('all')}
                          className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                            selectedCategoryFilter === 'all'
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          All ({availableDepts.length})
                        </button>
                        {availableCategories.map((cat) => {
                          const count = availableDepts.filter((d) => d.category === cat).length;
                          const isSelected = selectedCategoryFilter === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedCategoryFilter(isSelected ? 'all' : cat)}
                              className={`px-2 py-1 rounded-lg font-bold whitespace-nowrap transition-all uppercase cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-700 text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                              }`}
                            >
                              {cat} ({count})
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Quick Matching Chips when typing */}
                    {deptSearchQuery.trim().length > 0 && filteredDepts.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[9.5px] font-mono text-slate-400 uppercase font-bold">
                          Quick Matches (tap to select):
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-0.5">
                          {filteredDepts.slice(0, 6).map((d) => {
                            const isChosen = d.id === selectedDeptId;
                            return (
                              <button
                                key={d.id}
                                type="button"
                                onClick={() => setSelectedDeptId(d.id)}
                                className={`p-2 rounded-xl text-left border transition-all flex items-center gap-2 cursor-pointer ${
                                  isChosen
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                <span className="w-7 h-7 rounded-md bg-[#f1f3f4] dark:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                                  <DeptIcon dept={d} size={13} />
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-bold truncate">{d.name}</div>
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                    {d.category?.toUpperCase()} {d.location ? `· ${d.location}` : ''}
                                  </div>
                                </div>
                                {isChosen && <Check size={14} className="text-emerald-600 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Filtered Dropdown Selector */}
                    {filteredDepts.length > 0 ? (
                      <div>
                        <select
                          value={selectedDeptId}
                          onChange={(e) => setSelectedDeptId(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 cursor-pointer"
                        >
                          {/* If current selection isn't in filtered list, keep it visible at top */}
                          {!filteredDepts.some((d) => d.id === selectedDeptId) && currentDept && (
                            <option value={currentDept.id}>
                              Currently Selected: {currentDept.name} ({currentDept.category?.toUpperCase() || 'COMMERCIAL'})
                            </option>
                          )}
                          {filteredDepts.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name} ({d.category?.toUpperCase() || 'COMMERCIAL'}) {isEntityClaimed(d.id) ? '[Claimed]' : '· Unclaimed'}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-center space-y-1.5">
                        <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                          No private desks matching &ldquo;{deptSearchQuery}&rdquo;
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Government desks are provisioned separately under the Sovereign National Accord.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setDeptSearchQuery('');
                            setSelectedCategoryFilter('all');
                          }}
                          className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          Clear search &amp; show all desks
                        </button>
                      </div>
                    )}

                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1">
                      Government ministries, municipal councils, and regulatory authorities are provisioned under the Sovereign National Accord by Government-appointed personnel and do not appear in this commercial registry.
                    </p>
                  </div>
                )}
              </div>

              {alreadyClaimed && claimRecord && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-200">
                  <ShieldCheck size={16} className="shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <span className="font-bold">This entity is claimed and active</span> on the{' '}
                    <span className="font-black uppercase">{claimRecord.plan}</span> plan by{' '}
                    <span className="font-semibold">{claimRecord.representativeName}</span> ({claimRecord.officialEmail}).
                    You can renew, update coverage, or switch billing intervals below.
                  </div>
                </div>
              )}

              {/* Customer Care Reality Banner */}
              <div className="p-3 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl flex items-start gap-2.5 text-xs">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                  <TrendingDown size={14} strokeWidth={1.75} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {branding.advertisingCampaign.headline}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                      {branding.currency} Rails
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {branding.advertisingCampaign.body}
                  </p>
                  <div className="flex items-center gap-3 pt-0.5 text-[10px] mono text-slate-500 flex-wrap">
                    <span>Defection risk: <strong>{branding.advertisingCampaign.churnStatistic}</strong></span>
                    <span>Protection: <strong>{branding.advertisingCampaign.retentionBenefit}</strong></span>
                    <span className="italic text-emerald-700 dark:text-emerald-300">&ldquo;{branding.advertisingCampaign.localLanguagePunchline}&rdquo;</span>
                  </div>
                </div>
              </div>

              {/* Billing Interval Toggle (Annual vs Monthly) */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                      1. Choose Billing Interval
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Annual subscriptions include 2 months free (~17% discount)
                    </span>
                  </div>

                  <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                    <button
                      type="button"
                      onClick={() => setInterval('monthly')}
                      className={`py-1.5 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        interval === 'monthly'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setInterval('annual')}
                      className={`py-1.5 px-3.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        interval === 'annual'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <span>Annual</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/30 text-white border border-emerald-400/40">
                        Save 17%
                      </span>
                    </button>
                  </div>
                </div>

                {/* Plan Selection Cards Based on Territory Coverage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      2. Select Territory Coverage Scope
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        go('entity_register');
                      }}
                      className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <Compass size={11} /> Need Custom Parish Geo-Mapping? Open Multi-Tier Portal →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {(Object.keys(territoryPlans) as TerritoryPlanKey[]).map((key) => {
                      const tData = territoryPlans[key];
                      const isSelected = planKey === key;
                      const displayPrice = formatPrice(
                        interval === 'annual' ? tData.annualUsd : tData.monthlyUsd,
                        interval === 'annual'
                      );

                      return (
                        <div
                          key={key}
                          onClick={() => setPlanKey(key)}
                          className={`relative border rounded-xl p-3.5 cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-emerald-500 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20 shadow-xs'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          {tData.popular && (
                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                              Recommended
                            </div>
                          )}

                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">
                                {tData.name}
                              </span>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? 'border-emerald-600 bg-emerald-600 text-white'
                                    : 'border-slate-300 dark:border-slate-700'
                                }`}
                              >
                                {isSelected && <Check size={10} />}
                              </div>
                            </div>

                            <div className="mt-1 flex items-center gap-1">
                              <span className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                {tData.unitRange}
                              </span>
                            </div>

                            <div className="mt-2.5">
                              {tData.free ? (
                                <>
                                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                                    Free Forever
                                  </div>
                                  <div className="text-[9.5px] text-slate-500 font-semibold">
                                    Self-serve community desk
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-baseline gap-1.5 flex-wrap">
                                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                                      $0 Today
                                    </span>
                                    <span className="text-[10.5px] line-through text-slate-400 font-mono">
                                      {displayPrice}
                                    </span>
                                  </div>
                                  <div className="text-[9.5px] text-emerald-700 dark:text-emerald-400 font-bold">
                                    30-Day Founding Partner Trial
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 pb-2 border-b border-slate-200 dark:border-slate-800">
                              {tData.scopeLabel}
                            </div>

                            <ul className="mt-2.5 space-y-1 text-[10px] text-slate-600 dark:text-slate-300">
                              {tData.features.map((feat, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 leading-snug">
                                  <CheckCircle2 size={11} className="shrink-0 text-emerald-600 mt-0.5" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-3 pt-2 text-[9px] mono font-bold text-center text-slate-400">
                            {tData.free ? 'ZERO BILLING' : interval === 'annual' ? 'BILLED ANNUALLY' : 'BILLED MONTHLY'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Official Credentials */}
              <div className="space-y-3.5 pt-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  3. Official Business Verification Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Representative Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Sarah Katusiime"
                      value={repName}
                      onChange={(e) => setRepName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Official Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g., care@yourcompany.com"
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Official Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g., +256 700 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Official Title / Role in Organization
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Tax Identification (TIN) / Business Registration No. (Optional for Free Community Tier)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., URA TIN 1009876543 or Registrar Certificate #"
                    value={tinOrReg}
                    onChange={(e) => setTinOrReg(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Founding Partner Free Trial Banner (No Payment Required During Public Rollout) */}
              <div className="p-4 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck size={13} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>FOUNDING PARTNER PUBLIC LAUNCH TRIAL · $0.00 DUE TODAY</span>
                  </span>
                  <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-200/80 dark:bg-emerald-900/70 text-emerald-950 dark:text-emerald-200">
                    30 Days Full Access · No Card or MoMo Required
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  During CivicDuty&apos;s public launch phase, all private service providers are onboarded onto our <strong>30-Day Founding Partner Trial</strong> with zero upfront payment. You get immediate access to official SLA responses, staff responder seats, Counter QR Placards, and your Embeddable Trust Badge. Standard territory billing ({formatPrice(activeFeeUsd, interval === 'annual')}) only begins if you choose to renew after your 30-day trial.
                </p>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn btn-primary py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Activating Founding Partner Trial Desk...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>
                        Claim &amp; Activate 30-Day Founding Partner Trial · $0 Due Today ({selectedPlanData.name})
                      </span>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 mt-2">
                  <Lock size={10} />
                  <span>Immediate credential issuance · Zero payment required today · Full SLA &amp; Trust Badge unlocked</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
