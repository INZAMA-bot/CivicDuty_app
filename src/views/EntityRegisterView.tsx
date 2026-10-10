import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode } from '../types';
import { COUNTRIES, TERRITORY } from '../data/countries';
import { primaryNodes, primaryUnit, tiersFor, GOV_CODES, getBusinessTitlePresets } from '../data/tiers';
import { copyToClipboard } from '../utils/helpers';
import {
  ChevronLeft,
  Search,
  Copy,
  CreditCard,
  Smartphone,
  Building2,
  ShieldCheck,
  ArrowRight,
  Zap,
  CheckCircle2,
  Download,
  Briefcase,
  Users,
  Store,
  Beer,
  Pill,
  Wrench,
  Utensils,
  GraduationCap,
  HeartPulse,
  Landmark,
  Bus,
  Layers,
  PlusCircle,
  SlidersHorizontal,
} from 'lucide-react';

export interface EntityTierDef {
  id: string;
  name: string;
  price: string;
  sub: string;
  note: string;
  min: number;
  max: number | null;
}

export const ENTITY_SECTORS = [
  { id: 'retail_shops', label: 'Retail Shops & Supermarkets', icon: Store, desc: 'Corner grocery, boutique, wholesale merchant, hardware' },
  { id: 'nightlife_bars', label: 'Bars, Lounges & Nightclubs', icon: Beer, desc: 'Sports pub, cocktail lounge, nightclub, social garden' },
  { id: 'pharmacy_chemists', label: 'Pharmacies & Chemists', icon: Pill, desc: 'Community pharmacy, drug shop, veterinary dispenser' },
  { id: 'food_dining', label: 'Restaurants, Cafés & Diners', icon: Utensils, desc: 'Fast food, café, bakery, local eatery, fine dining' },
  { id: 'artisans_garages', label: 'Garages & Artisans Hubs', icon: Wrench, desc: 'Auto mechanics, metal fabrication, carpentry, repair' },
  { id: 'health', label: 'Hospitals & Medical Clinics', icon: HeartPulse, desc: 'Specialist clinic, dental, dispensary, maternity home' },
  { id: 'education', label: 'Schools & Educational Hubs', icon: GraduationCap, desc: 'Nursery, primary/secondary school, technical institute' },
  { id: 'banking_finance', label: 'Banks, SACCOs & Microfinance', icon: Landmark, desc: 'Commercial bank, village SACCO, money lender' },
  { id: 'transport_cooperative', label: 'Transport SACCOs & Logistics', icon: Bus, desc: 'Boda boda SACCO, taxi association, haulage fleet' },
  { id: 'private_utility_telecom', label: 'Private Utilities & Solar Grid', icon: Zap, desc: 'Solar minigrid, private borehole, ISP network' },
  { id: 'private_contractor', label: 'Construction & Contractors', icon: Building2, desc: 'Civil engineering, roadworks, site contractors' },
  { id: 'ngo_civil_society', label: 'NGOs & Civil Society', icon: Users, desc: 'Community development, charity, human rights watch' },
  { id: 'other', label: 'Other Commercial / Civic Sector', icon: Layers, desc: 'Specify any unique trade, profession, or craft' },
];

export const TYPOLOGY_PRESETS: Record<string, string[]> = {
  retail_shops: [
    'Corner Grocery & Convenience Store',
    'Supermarket & Minimarket',
    'Wholesale Commodities Depot',
    'Hardware & Building Supplies Depot',
    'Fashion Boutique & Cosmetics',
    'Electronics, Phones & Solar Store',
    'Agro-Input & Veterinary Supplies Shop',
    'Other (Specify Exact Typology)',
  ],
  nightlife_bars: [
    'Sports Bar & Neighborhood Pub',
    'Cocktail Lounge & Wine Bar',
    'Nightclub & Live Music Arena',
    'Outdoor Grill & Entertainment Garden',
    'Beer Parlour & Social Club',
    'Other (Specify Exact Typology)',
  ],
  pharmacy_chemists: [
    'Community Retail Pharmacy',
    'Class C Drug Shop & Dispensary',
    'Wholesale Pharmaceutical Distributor',
    'Veterinary Drug & Animal Care Center',
    'Herbal & Natural Medicine Dispensary',
    'Other (Specify Exact Typology)',
  ],
  food_dining: [
    'Fast Food Diner & Takeaway',
    'Casual Dine-In Restaurant',
    'Bakery, Pastry & Coffee Café',
    'Local Cuisine Eatery / Kafunda',
    'Catering & Event Food Service',
    'Other (Specify Exact Typology)',
  ],
  artisans_garages: [
    'Automotive Repair Garage & Diagnostics',
    'Motorcycle & Boda Repair Workshop',
    'Welding & Metal Fabrication Workshop',
    'Carpentry & Woodwork Artisan Hub',
    'Shoe & Leather Craft Workshop',
    'Other (Specify Exact Typology)',
  ],
  education: [
    'Private Primary / Secondary School',
    'Early Childhood Nursery & Daycare',
    'Vocational & Technical Training Institute',
    'University / Tertiary College Faculty',
    'Special Needs Learning Center',
    'Other (Specify Exact Typology)',
  ],
  health: [
    'Private Outpatient Clinic & Diagnostic Lab',
    'Community Health Center & Maternity',
    'Dental & Eye Specialist Clinic',
    'Rehabilitation & Physiotherapy Center',
    'Other (Specify Exact Typology)',
  ],
  banking_finance: [
    'Community Savings & Credit SACCO',
    'Microfinance Deposit-Taking Institution',
    'Commercial Bank Branch / Agency Desk',
    'Mobile Money & Financial Agency Hub',
    'Other (Specify Exact Typology)',
  ],
  other: [
    'General Commercial Enterprise',
    'Artisanal Craft Workshop',
    'Professional Consultancy Firm',
    'Event Venue & Hospitality Space',
    'Other (Specify Exact Typology)',
  ],
};

export function getEntityTiersForCountry(country: CountryCode): EntityTierDef[] {
  const countryName = COUNTRIES[country]?.name || country;
  const primary = primaryUnit(country).toLowerCase();
  const tiers = tiersFor(country);
  const l1Unit = tiers[1]?.unit || 'District';

  return [
    {
      id: 'free',
      name: `Single-Unit (${primary})`,
      price: 'Free',
      sub: `1 ${primary} desk · Multi-Seat Admin`,
      note: 'Free forever for single-branch shops, clinics & schools.',
      min: 1,
      max: 1,
    },
    {
      id: 'community',
      name: `Multi-${primary} Cluster`,
      price: '$100',
      sub: `per ${primary} / yr (2 to 50 ${primary}s)`,
      note: 'Self-serve. Mobile Money (MTN / Airtel / M-Pesa) & Cards.',
      min: 2,
      max: 50,
    },
    {
      id: 'branch',
      name: `Branch Network`,
      price: '$7,200',
      sub: `51 to 150 ${primary}s`,
      note: 'Multi-branch SLA routing & regional supervisor desk.',
      min: 51,
      max: 150,
    },
    {
      id: 'district',
      name: `${l1Unit} Coverage`,
      price: '$18,000',
      sub: `151 to 500 ${primary}s`,
      note: `Full ${l1Unit} executive dashboard & priority SLA.`,
      min: 151,
      max: 500,
    },
    {
      id: 'regional',
      name: `Regional (${countryName})`,
      price: '$34,000',
      sub: `501 to 2,000 ${primary}s`,
      note: `Multi-node central oversight & analytics ledger.`,
      min: 501,
      max: 2000,
    },
    {
      id: 'national',
      name: `National (${countryName})`,
      price: '$58,000',
      sub: `2,001+ ${primary}s`,
      note: `Full countrywide enterprise integration & API.`,
      min: 2001,
      max: null,
    },
  ];
}

function tierForParishes(n: number, country: CountryCode) {
  const tiers = getEntityTiersForCountry(country);
  return tiers.find((t) => n >= t.min && (t.max === null || n <= t.max)) || tiers[0];
}

const CONSUMER_BANDS: Record<number, number> = { 51: 10800, 151: 26000, 501: 46000, 2001: 74000, 6001: 98000 };
const MONTHLY_UPLIFT = 1.12;

function annualUsd(n: number, kind: string, country: CountryCode): number {
  if (n <= 1) return 0;
  if (n <= 50) return n * 100;
  if (kind === 'consumer') {
    const k =
      Object.keys(CONSUMER_BANDS)
        .map(Number)
        .filter((x) => n >= x)
        .pop() || 51;
    return CONSUMER_BANDS[k];
  }
  const tier = tierForParishes(n, country);
  return parseInt(tier.price.replace(/[^0-9]/g, ''), 10);
}

function intervalUsd(n: number, kind: string, iv: 'annual' | 'monthly', country: CountryCode): number {
  const a = annualUsd(n, kind, country);
  return iv === 'monthly' ? Math.round((a * MONTHLY_UPLIFT) / 12) : a;
}

function fmtUsd(v: number): string {
  return v === 0 ? 'Free' : '$' + v.toLocaleString();
}

function entityPrice(n: number, kind: string, iv: 'annual' | 'monthly', country: CountryCode): string {
  const v = intervalUsd(n, kind || 'utility', iv || 'annual', country);
  if (v === 0) return 'Free Forever';
  return fmtUsd(v) + ((iv || 'annual') === 'annual' ? '/yr' : '/mo');
}

export const EntityRegisterView: React.FC = () => {
  const { go, registerNewEntity, toast, selectedCountry } = useApp();

  const [country, setCountry] = useState<CountryCode>((selectedCountry || 'UG') as CountryCode);

  React.useEffect(() => {
    if (selectedCountry && selectedCountry !== country) {
      setCountry(selectedCountry as CountryCode);
      setDistrict('');
      setSubcounty('');
      setParish('');
    }
  }, [selectedCountry]);

  const [name, setName] = useState('');
  const [reg, setReg] = useState('');
  const [kind, setKind] = useState<'utility' | 'consumer'>('consumer');

  // Categorization & Professional Identity States
  const [selectedSector, setSelectedSector] = useState<string>('retail_shops');
  const [customSectorSpecify, setCustomSectorSpecify] = useState<string>('');

  const [selectedTypology, setSelectedTypology] = useState<string>('Corner Grocery & Convenience Store');
  const [customTypologySpecify, setCustomTypologySpecify] = useState<string>('');

  const [officerName, setOfficerName] = useState<string>('');
  const [selectedTitle, setSelectedTitle] = useState<string>('Proprietor & General Merchant');
  const [customTitleSpecify, setCustomTitleSpecify] = useState<string>('');

  const [staffSeats, setStaffSeats] = useState<number>(5);

  const [district, setDistrict] = useState('');
  const [subcounty, setSubcounty] = useState('');
  const [parish, setParish] = useState('');
  const [manualUnitsOverride, setManualUnitsOverride] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [interval, setInterval] = useState<'annual' | 'monthly'>('annual');

  // Local payment flow state
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [payMethod, setPayMethod] = useState<'momo' | 'gateway' | 'bank'>('momo');
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'airtel'>('mtn');
  const [momoPhone, setMomoPhone] = useState('0772 123 456');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [bankRef, setBankRef] = useState('EFT-2026-9081');
  const [isProcessing, setIsProcessing] = useState(false);

  const dists = TERRITORY[country] || [];
  const subs = district ? dists.find((x) => x.id === district)?.children || [] : [];
  const parishes = subcounty ? subs.find((x) => x.id === subcounty)?.children || [] : [];

  const territoryCovered = parish
    ? 1
    : subcounty
    ? parishes.length
    : district
    ? subs.reduce((a, s) => a + (s.children?.length || 0), 0)
    : 1;

  const covered = manualUnitsOverride !== null ? manualUnitsOverride : Math.max(territoryCovered, 1);

  const currentTiers = getEntityTiersForCountry(country);
  const tier = tierForParishes(Math.max(covered, 1), country);

  const primaryUnitName = primaryUnit(country, district || undefined).toLowerCase();
  const primaryNodesList = primaryNodes(country, district || undefined);
  const countryName = COUNTRIES[country]?.name || country;
  const cTiers = tiersFor(country, district || undefined);
  const l1Name = cTiers[1]?.unit || 'District';
  const l2Name = cTiers[2]?.unit || 'SubCounty';

  const titlePresets = getBusinessTitlePresets(selectedSector);
  const typologyPresets = TYPOLOGY_PRESETS[selectedSector] || TYPOLOGY_PRESETS.other;

  const searchHits =
    searchQuery.trim().length >= 2
      ? primaryNodesList.filter((n) => n.name.toLowerCase().includes(searchQuery.trim().toLowerCase())).slice(0, 5)
      : [];

  const pickPrimaryNode = (id: string) => {
    for (const d of TERRITORY[country] || []) {
      for (const s of d.children || []) {
        for (const p of s.children || []) {
          if (p.id === id) {
            setDistrict(d.id);
            setSubcounty(s.id);
            setParish(p.id);
            setManualUnitsOverride(null);
            setSearchQuery('');
            return;
          }
        }
      }
    }
  };

  const effectiveProfessionalTitle =
    selectedTitle === 'Other (Specify Exact Title)'
      ? customTitleSpecify.trim() || 'Proprietor & Managing Director'
      : selectedTitle;

  const effectiveSectorName =
    selectedSector === 'other'
      ? customSectorSpecify.trim() || 'Commercial Enterprise'
      : ENTITY_SECTORS.find((s) => s.id === selectedSector)?.label || 'Commercial Enterprise';

  const effectiveTypologyName =
    selectedTypology === 'Other (Specify Exact Typology)'
      ? customTypologySpecify.trim() || 'Business Operation'
      : selectedTypology;

  const priceVal = intervalUsd(Math.max(covered, 1), kind, interval, country);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      toast('Please enter your business or organisation name', 'amber');
      return false;
    }
    if (selectedSector === 'other' && !customSectorSpecify.trim()) {
      toast('Please specify your custom sector / trade category', 'amber');
      return false;
    }
    if (selectedTitle === 'Other (Specify Exact Title)' && !customTitleSpecify.trim()) {
      toast('Please specify your exact professional title', 'amber');
      return false;
    }
    return true;
  };

  const handleStartTrialSubmit = () => {
    if (!validateForm()) return;
    completeRegistration('FOUNDING-TRIAL-30D');
  };

  const handleProceedToPaymentGateway = () => {
    if (!validateForm()) return;
    if (priceVal === 0) {
      completeRegistration('FREE-COMMUNITY-TIER');
      return;
    }
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completeRegistration = (paymentRef: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const activeName = name.trim() || 'Kikuubo Retail Traders Hub';
      const activeReg = reg.trim() || `URSB-${Date.now().toString().slice(-6)}`;
      const activeCovered = Math.max(covered, 1);
      const activeScope = parish || subcounty || district || 'd-kla';

      const result = registerNewEntity({
        name: activeName,
        reg: activeReg,
        kind,
        country,
        scope: activeScope,
        coveredUnits: activeCovered,
        interval,
        entity_category: selectedSector,
        custom_category_specify: customSectorSpecify,
        business_typology: effectiveTypologyName,
        custom_typology_specify: customTypologySpecify,
        professional_identity: effectiveProfessionalTitle,
        custom_title_specify: customTitleSpecify,
        staff_seats: staffSeats,
        officer_name: officerName.trim() || effectiveProfessionalTitle,
      });

      (window as any)._lastEntityResult = {
        name: activeName,
        code: (result as any)?.code || `ENT-${country}-${activeReg.slice(-4).toUpperCase()}`,
        covered: activeCovered,
        kind,
        interval,
        invoiceNo: (result as any)?.invoiceNo || `INV-2026-${country}-${Math.floor(1000 + Math.random() * 9000)}`,
        price: priceVal,
        country,
        paymentRef,
        paymentMethod: payMethod,
        professionalTitle: effectiveProfessionalTitle,
        sectorName: effectiveSectorName,
        businessTypology: effectiveTypologyName,
        officerName: officerName || effectiveProfessionalTitle,
        staffSeats,
      };

      setIsProcessing(false);
      toast('Registration confirmed & Entity Admin desk mounted!', 'emerald');
      go('entity_done');
    }, 800);
  };

  const exchangeRateLocal = country === 'KE' ? 129 : country === 'NG' ? 1600 : country === 'GH' ? 15.5 : 3700;
  const localCurrencyCode = country === 'KE' ? 'KES' : country === 'NG' ? 'NGN' : country === 'GH' ? 'GHS' : 'UGX';
  const priceLocal = Math.round(priceVal * exchangeRateLocal);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-slate-100 pb-20 animate-fade-in">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-5 pt-4 space-y-4">
        {/* Studio Header Card — Google AI Studio Aesthetics */}
        <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                if (step === 'payment') {
                  setStep('details');
                } else {
                  go('entity');
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>{step === 'payment' ? 'Back to Onboarding Form' : 'Provider Gateway'}</span>
            </button>

            <div className="flex items-center gap-2 text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {step === 'payment' ? 'Subscription Checkout Gateway' : 'Entity & Business Desk Onboarding'}
              </span>
              <span aria-hidden="true">·</span>
              <span>[{country}] {countryName}</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Entity &amp; Business Desk Onboarding
                </span>
                <span aria-hidden="true">·</span>
                <span>1st {primaryUnitName} Free Forever</span>
                <span aria-hidden="true">·</span>
                <span>30-Day Founding Trial</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {step === 'payment' ? 'Complete Subscription Payment' : 'Register your business or entity'}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                {step === 'payment'
                  ? `Secure B2B checkout powered by Mobile Money (${localCurrencyCode}), Visa/Mastercard & RTGS Wire for ${countryName}.`
                  : `Mount a verified public accountability & customer care wall for any enterprise — from single-branch shops, clinics, and schools to national utilities and banks.`}
              </p>
            </div>

            {step === 'details' && (
              <button
                type="button"
                onClick={() => go('entity_gateway')}
                className="px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 border border-[#e3e6ea] dark:border-[#262b36] text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                <Building2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span>Have a Code? Sign In →</span>
              </button>
            )}
          </div>
        </div>

        {step === 'details' && (
          <>
            {/* Section 1: Business Category & Sector */}
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  01. Select Industry / Sector
                </span>
                <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                  13 Sectors + Custom Specify
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {ENTITY_SECTORS.map((sec) => {
                  const IconComponent = sec.icon;
                  const isSelected = selectedSector === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => {
                        setSelectedSector(sec.id);
                        const presets = TYPOLOGY_PRESETS[sec.id] || TYPOLOGY_PRESETS.other;
                        setSelectedTypology(presets[0]);
                        const tPresets = getBusinessTitlePresets(sec.id);
                        setSelectedTitle(tPresets[0]);
                        if (sec.id === 'private_utility_telecom') {
                          setKind('utility');
                        } else {
                          setKind('consumer');
                        }
                      }}
                      className={`p-3 rounded-lg text-left border transition-colors flex flex-col justify-between gap-1 cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white'
                          : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <IconComponent
                            size={14}
                            className={isSelected ? 'text-emerald-600 dark:text-emerald-400 shrink-0' : 'text-slate-500 shrink-0'}
                          />
                          <span className="text-xs font-semibold leading-tight truncate">{sec.label}</span>
                        </div>
                        {isSelected && <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />}
                      </div>
                      <span className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-1">{sec.desc}</span>
                    </button>
                  );
                })}
              </div>

              {selectedSector === 'other' && (
                <div className="p-3.5 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg space-y-1.5">
                  <label className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <PlusCircle size={12} />
                    <span>Specify Your Exact Industry / Sector</span>
                  </label>
                  <input
                    type="text"
                    value={customSectorSpecify}
                    onChange={(e) => setCustomSectorSpecify(e.target.value)}
                    placeholder="e.g. Artisanal Coffee Roastery, Solar Equipment Importer, Event Production Hub"
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </div>

            {/* Section 2: Specific Business Typology */}
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  02. Business Typology &amp; Operation Model
                </span>
                <span className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
                  {effectiveSectorName}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {typologyPresets.map((typeOption) => {
                  const isSelected = selectedTypology === typeOption;
                  return (
                    <button
                      key={typeOption}
                      type="button"
                      onClick={() => setSelectedTypology(typeOption)}
                      className={`py-2 px-3 rounded-lg text-left text-xs font-mono font-medium border transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white font-semibold'
                          : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span className="truncate">{typeOption}</span>
                      {isSelected && <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {selectedTypology === 'Other (Specify Exact Typology)' && (
                <div className="p-3.5 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg space-y-1.5">
                  <label className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold block">
                    Specify Exact Business Typology
                  </label>
                  <input
                    type="text"
                    value={customTypologySpecify}
                    onChange={(e) => setCustomTypologySpecify(e.target.value)}
                    placeholder="e.g. 24-Hour Express Tyre & Battery Workshop, Rooftop Lounge & Tapas"
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </div>

            {/* Section 3: Entity Details & Identity */}
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  03. Business &amp; Registrant Identity
                </span>
                <span className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
                  Verified Public Response Wall
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="text-[10.5px] font-mono text-slate-600 dark:text-slate-400 block mb-1 font-semibold">
                    Official Business / Entity Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kikuubo Retail Hub / Acacia Clinic"
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-mono text-slate-600 dark:text-slate-400 block mb-1 font-semibold">
                    Tax TIN / Registration License No
                  </label>
                  <input
                    type="text"
                    value={reg}
                    onChange={(e) => setReg(e.target.value)}
                    placeholder="e.g. URSB / KCCA / URA-99201"
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-mono text-slate-600 dark:text-slate-400 block mb-1 font-semibold">
                    Registrant Full Name (Primary Admin)
                  </label>
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    placeholder="e.g. Godfrey Kayongo / Sarah Nakamya"
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[10.5px] font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <Briefcase size={12} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Your Executive / Professional Title in this Entity</span>
                  </label>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                    Displayed on Official Replies
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {titlePresets.map((tOpt) => {
                    const isSel = selectedTitle === tOpt;
                    return (
                      <button
                        key={tOpt}
                        type="button"
                        onClick={() => setSelectedTitle(tOpt)}
                        className={`py-2 px-3 rounded-lg text-left text-xs font-mono border transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                          isSel
                            ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white font-semibold'
                            : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <span className="truncate">{tOpt}</span>
                        {isSel && <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {selectedTitle === 'Other (Specify Exact Title)' && (
                  <div className="p-3 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg space-y-1.5">
                    <label className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold block">
                      Specify Your Exact Professional Title
                    </label>
                    <input
                      type="text"
                      value={customTitleSpecify}
                      onChange={(e) => setCustomTitleSpecify(e.target.value)}
                      placeholder="e.g. Lead Clinical Pharmacist, Master Auto Electrician, Managing Partner"
                      className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Entity Administration & Multi-Seat Team Setup */}
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Users size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span>04. Entity Admin &amp; Team Seat Allocation</span>
                </span>
                <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  Multi-Seat Admin Console Included
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                As <strong className="text-slate-900 dark:text-white">{effectiveProfessionalTitle}</strong>, you hold primary administrative permissions to invite duty managers, customer care leads, and field technicians to your entity desk.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { count: 3, label: '3 Staff Seats', note: 'Single shop, pharmacy or café' },
                  { count: 5, label: '5 Staff Seats (Standard)', note: 'Clinic, school or medium enterprise' },
                  { count: 12, label: '12 Staff Seats', note: 'Multi-branch network & utility care' },
                ].map((seatOpt) => {
                  const isActive = staffSeats === seatOpt.count;
                  return (
                    <button
                      key={seatOpt.count}
                      type="button"
                      onClick={() => setStaffSeats(seatOpt.count)}
                      className={`p-3 rounded-lg text-left border transition-colors cursor-pointer ${
                        isActive
                          ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white'
                          : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-semibold">{seatOpt.label}</span>
                        {isActive && <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />}
                      </div>
                      <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mt-0.5">{seatOpt.note}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 5: Country & Territorial Scope */}
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  05. Jurisdiction &amp; Territorial Footprint
                </span>
                <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  [{country}] {countryName} · {covered} {primaryUnitName}{covered > 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                {(Object.entries(COUNTRIES) as [CountryCode, any][]).map(([c]) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCountry(c);
                      setDistrict('');
                      setSubcounty('');
                      setParish('');
                      setManualUnitsOverride(null);
                    }}
                    className={`py-1.5 rounded-lg text-[10.5px] font-mono font-semibold border transition-colors cursor-pointer ${
                      country === c
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
                        : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="relative flex items-center">
                <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search your primary ${primaryUnitName} in ${countryName} (e.g. Kololo, Kikuubo, Wandegeya)...`}
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg pl-8 pr-3 py-2 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {searchQuery.trim().length >= 2 && (
                <div className="space-y-1">
                  {searchHits.length === 0 ? (
                    <p className="text-[11px] font-mono text-slate-500 py-1.5">No matching {primaryUnitName} found.</p>
                  ) : (
                    searchHits.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => pickPrimaryNode(n.id)}
                        className="w-full text-left px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 transition-colors cursor-pointer"
                      >
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">{n.name}</div>
                        <div className="text-[10.5px] font-mono text-slate-500">{n.path}</div>
                      </button>
                    ))
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setSubcounty('');
                    setParish('');
                    setManualUnitsOverride(null);
                    setSearchQuery('');
                  }}
                >
                  <option value="">Select {l1Name}...</option>
                  {dists.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>

                <select
                  className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                  disabled={!district}
                  value={subcounty}
                  onChange={(e) => {
                    setSubcounty(e.target.value);
                    setParish('');
                    setManualUnitsOverride(null);
                  }}
                >
                  <option value="">Select {l2Name}...</option>
                  {subs.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>

                <select
                  className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                  disabled={!subcounty}
                  value={parish}
                  onChange={(e) => {
                    setParish(e.target.value);
                    setManualUnitsOverride(null);
                  }}
                >
                  <option value="">Select {primaryUnitName}...</option>
                  {parishes.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 6: Interactive Pricing & Subscription Matrix (Google AI Studio Aesthetics) */}
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e3e6ea] dark:border-[#262b36] pb-3.5">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                    <SlidersHorizontal size={12} />
                    <span>06. Sovereign Pricing &amp; Subscription Matrix</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Transparent Per-{primaryUnit(country)} Tier Pricing · 1st Unit Free Forever
                  </h3>
                </div>

                {/* Segmented Controls: Billing Cycle & Entity Rate Class */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 p-1 bg-[#f8f9fa] dark:bg-[#0e1116] rounded-lg border border-[#e3e6ea] dark:border-[#262b36]">
                    <button
                      type="button"
                      onClick={() => setInterval('annual')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                        interval === 'annual'
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Annual (Save 12%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setInterval('monthly')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                        interval === 'monthly'
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>

                  <div className="flex items-center gap-1 p-1 bg-[#f8f9fa] dark:bg-[#0e1116] rounded-lg border border-[#e3e6ea] dark:border-[#262b36]">
                    <button
                      type="button"
                      onClick={() => setKind('consumer')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                        kind === 'consumer'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Commercial Rate
                    </button>
                    <button
                      type="button"
                      onClick={() => setKind('utility')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                        kind === 'utility'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Utility / Public Service
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive 6-Tier Pricing Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {currentTiers.map((tItem) => {
                  const isCurrentTier = tier.id === tItem.id;
                  const sampleUnits = tItem.min;
                  const computedTierPrice = entityPrice(sampleUnits, kind, interval, country);
                  const computedUsdNum = intervalUsd(sampleUnits, kind, interval, country);
                  const computedLocalNum = Math.round(computedUsdNum * exchangeRateLocal);

                  return (
                    <button
                      key={tItem.id}
                      type="button"
                      onClick={() => setManualUnitsOverride(tItem.min)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 cursor-pointer ${
                        isCurrentTier
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{tItem.name}</span>
                          {isCurrentTier && (
                            <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                              Active Tier
                            </span>
                          )}
                        </div>
                        <div className="text-base font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                          {tItem.id === 'community'
                            ? `${fmtUsd(intervalUsd(1, kind, interval, country) || (interval === 'annual' ? 100 : 9))} / ${primaryUnitName}`
                            : computedTierPrice}
                        </div>
                        {computedUsdNum > 0 && (
                          <div className="text-[10px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                            ≈ {localCurrencyCode} {computedLocalNum.toLocaleString()} {interval === 'annual' ? '/yr' : '/mo'}
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-0.5">
                        <div className="text-[10.5px] font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {tItem.sub}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                          {tItem.note}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Coverage Unit Slider / Adjuster */}
              <div className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Active Coverage Footprint:</span>
                    <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                      {covered} {primaryUnitName}{covered > 1 ? 's' : ''} ({tier.name})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Click any tier card above or adjust your exact {primaryUnitName} branch count to calculate post-trial billing.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label className="text-[10.5px] font-mono text-slate-500">Units:</label>
                  <input
                    type="number"
                    min={1}
                    max={5000}
                    value={covered}
                    onChange={(e) => setManualUnitsOverride(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-24 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold tabular-nums text-center text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Founding Partner Trial + Direct Checkout Summary Box */}
              <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-emerald-500/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                      <ShieldCheck size={13} />
                      <span>Founding Partner Launch Program · $0 Due Today</span>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {tier.name} · {Math.max(covered, 1)} {primaryUnitName}{covered > 1 ? 's' : ''} · {staffSeats} Staff Seats
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                      Single-branch community entities (1 {primaryUnitName}) are <strong>Free Forever ($0)</strong>. Multi-branch &amp; enterprise tiers receive a full <strong>30-Day Founding Partner Free Trial</strong> with instant access to SLA tools, multi-seat team management, and Counter QR Placards.
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                      $0 Today
                    </div>
                    <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {priceVal === 0
                        ? 'Free Forever (1 Unit)'
                        : `Post-trial: ${entityPrice(Math.max(covered, 1), kind, interval, country)} (≈ ${localCurrencyCode} ${priceLocal.toLocaleString()})`}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleStartTrialSubmit}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-mono font-semibold rounded-lg py-3 px-4 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>
                      {isProcessing
                        ? 'Commissioning Entity Desk...'
                        : priceVal === 0
                        ? 'Activate Free Community Entity Desk ($0 Forever)'
                        : 'Activate 30-Day Founding Partner Trial ($0 Due Today)'}
                    </span>
                    <ArrowRight size={14} />
                  </button>

                  {priceVal > 0 && (
                    <button
                      type="button"
                      onClick={handleProceedToPaymentGateway}
                      className="px-4 py-3 rounded-lg bg-white dark:bg-[#161a22] hover:border-emerald-500 border border-[#e3e6ea] dark:border-[#262b36] text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <CreditCard size={13} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Direct Checkout ({entityPrice(Math.max(covered, 1), kind, interval, country)})</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {step === 'payment' && (
          <div className="space-y-4 animate-fade-in">
            {/* Order Summary Card */}
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                    Subscription Order Summary
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {name || 'Your Organisation'}
                  </h3>
                  <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-0.5">
                    {effectiveSectorName} · {effectiveProfessionalTitle} · {staffSeats} Staff Seats · {covered} {primaryUnitName}{covered > 1 ? 's' : ''}
                  </p>
                </div>
                <span className="text-[10.5px] font-mono font-semibold text-amber-600 dark:text-amber-400">
                  Pending Settlement
                </span>
              </div>

              <div className="pt-3 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block font-semibold">
                    Total Subscription ({interval === 'annual' ? 'Annual Billing' : 'Monthly Billing'})
                  </span>
                  <span className="text-[11px] font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                    ≈ {localCurrencyCode} {priceLocal.toLocaleString()} (1 USD = {exchangeRateLocal.toLocaleString()} {localCurrencyCode})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {entityPrice(covered, kind, interval, country)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-700 dark:text-slate-200 uppercase tracking-wider font-semibold">
                  Select Payment Channel ({countryName})
                </span>
                <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck size={12} />
                  <span>SHA-256 Gateway Protected</span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPayMethod('momo')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-mono font-semibold border transition-colors flex flex-col items-center gap-1 cursor-pointer ${
                    payMethod === 'momo'
                      ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white'
                      : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Smartphone size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Mobile Money</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayMethod('gateway')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-mono font-semibold border transition-colors flex flex-col items-center gap-1 cursor-pointer ${
                    payMethod === 'gateway'
                      ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white'
                      : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <CreditCard size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Card / Web</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayMethod('bank')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-mono font-semibold border transition-colors flex flex-col items-center gap-1 cursor-pointer ${
                    payMethod === 'bank'
                      ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white'
                      : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Building2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Bank Wire</span>
                </button>
              </div>

              {payMethod === 'momo' && (
                <div className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Mobile Money STK Push ({countryName})
                    </span>
                    <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400">
                      Instant USSD Prompt
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMomoProvider('mtn')}
                      className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold border text-left transition-colors cursor-pointer ${
                        momoProvider === 'mtn'
                          ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white'
                          : 'border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      MTN MoMo / M-Pesa
                    </button>
                    <button
                      type="button"
                      onClick={() => setMomoProvider('airtel')}
                      className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold border text-left transition-colors cursor-pointer ${
                        momoProvider === 'airtel'
                          ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white'
                          : 'border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Airtel Money
                    </button>
                  </div>

                  <div>
                    <label className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 block mb-1 font-semibold">
                      Registered Mobile Money Number ({countryName})
                    </label>
                    <input
                      type="text"
                      value={momoPhone}
                      onChange={(e) => setMomoPhone(e.target.value)}
                      placeholder="e.g. 0772 123 456"
                      className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {payMethod === 'gateway' && (
                <div className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
                  <span className="text-xs font-mono font-semibold text-slate-900 dark:text-white block">
                    3D-Secure Card Checkout (Visa / Mastercard)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number"
                      className="sm:col-span-1 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="CVC"
                      className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {payMethod === 'bank' && (
                <div className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                  <span className="text-xs font-mono font-semibold text-slate-900 dark:text-white block">
                    RTGS / Corporate EFT Bank Voucher Reference
                  </span>
                  <input
                    type="text"
                    value={bankRef}
                    onChange={(e) => setBankRef(e.target.value)}
                    placeholder="Bank Voucher Reference"
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() =>
                completeRegistration(
                  payMethod === 'momo' ? `MOMO-${momoPhone}` : payMethod === 'gateway' ? 'CARD-CONFIRMED' : bankRef
                )
              }
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-mono font-semibold rounded-xl py-3.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>
                {isProcessing
                  ? 'Connecting Settlement Gateway...'
                  : `Confirm & Mount Entity Desk (${entityPrice(covered, kind, interval, country)})`}
              </span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const EntityDoneView: React.FC = () => {
  const { go, execGovLoginByData, toast } = useApp();
  const res = (window as any)._lastEntityResult || {
    name: 'Business Enterprise',
    code: 'ENT-UG-9912',
    covered: 1,
    kind: 'consumer',
    interval: 'annual',
    price: 0,
    invoiceNo: 'INV-2026-UG-9011',
    country: 'UG',
    paymentRef: 'FOUNDING-TRIAL-30D',
    paymentMethod: 'momo',
    professionalTitle: 'Proprietor & General Merchant',
    sectorName: 'Retail Shops & Supermarkets',
    businessTypology: 'Wholesale & Retail Depot',
    officerName: 'Desk Director',
    staffSeats: 5,
  };

  const countryName = COUNTRIES[res.country as CountryCode]?.name || res.country;

  const handleOpenDesk = () => {
    const data = GOV_CODES[res.code];
    if (data) {
      execGovLoginByData(data);
    } else {
      toast('Entity desk activated!', 'emerald');
      go('gov_inbox');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-slate-100 pb-20 animate-fade-in">
      <div className="max-w-2xl mx-auto px-3.5 sm:px-5 pt-6 space-y-4">
        <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-5 sm:p-6 text-center space-y-2.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={24} />
          </div>
          <div className="text-[10.5px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
            Entity Desk Commissioned · [{res.country}] {countryName}
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {res.name} is Registered &amp; Live
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {res.professionalTitle} · {res.staffSeats || 5} Staff Seats Allocated · {res.sectorName}
          </p>
        </div>

        <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 sm:p-5 space-y-2.5">
          <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
            <span>Primary Entity Access Code</span>
            <span className="text-emerald-600 dark:text-emerald-400">Tap to Copy</span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(res.code, 'Access code', (msg) => toast(msg))}
            className="flex items-center justify-between w-full bg-[#f8f9fa] dark:bg-[#0e1116] rounded-lg px-4 py-3 hover:border-emerald-500 border border-[#e3e6ea] dark:border-[#262b36] transition-colors cursor-pointer"
          >
            <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
              {res.code}
            </span>
            <Copy size={14} className="text-slate-500" />
          </button>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Use this cryptographic access code at the Provider Gateway to mount your Executive Administrator Desk and invite team members.
          </p>
        </div>

        <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
              Subscription &amp; Plan Status
            </span>
            <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              {res.paymentRef === 'FOUNDING-TRIAL-30D'
                ? 'Active · 30-Day Founding Partner Trial ($0 Today)'
                : res.price === 0
                ? 'Active · Free Community Tier ($0 Forever)'
                : `Active · Settled (${res.paymentRef})`}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono border-t border-b border-[#e3e6ea] dark:border-[#262b36] py-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Professional Identity</span>
              <span className="text-slate-900 dark:text-white font-semibold">{res.professionalTitle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Industry / Sector</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{res.sectorName || 'Commercial'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Admin Authority</span>
              <span className="text-slate-900 dark:text-white font-semibold">Multi-Seat Team Management ({res.staffSeats || 5} Seats)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => {
                const textContent = `
================================================================================
          CIVICDUTY PLATFORM - ENTITY ONBOARDING & TAX RECEIPT
================================================================================
Invoice No:      ${res.invoiceNo || 'INV-2026-9011'}
Date Issued:     ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
Entity Name:     ${res.name}
Sector:          ${res.sectorName}
Professional:    ${res.professionalTitle}
Admin Lead:      ${res.officerName}
Country:         ${countryName} (${res.country})
Team Seats:      ${res.staffSeats || 5} Allocated Staff Desks
Access Key Code: ${res.code}
================================================================================
`;
                const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `CivicDuty_Entity_Voucher_${res.invoiceNo || 'Receipt'}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast('Downloaded Entity Registration Voucher!', 'emerald');
              }}
              className="flex items-center justify-center gap-1.5 bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 text-slate-800 dark:text-slate-200 border border-[#e3e6ea] dark:border-[#262b36] rounded-lg py-2.5 text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              <Download size={13} />
              <span>Export Voucher (.txt)</span>
            </button>

            <button
              type="button"
              onClick={handleOpenDesk}
              className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2.5 text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              <span>Open Entity Desk &amp; Team →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
