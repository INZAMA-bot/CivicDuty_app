import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode } from '../types';
import { COUNTRIES, TERRITORY } from '../data/countries';
import { primaryNodes, primaryTier, primaryUnit, tiersFor, GOV_CODES, getBusinessTitlePresets } from '../data/tiers';
import { copyToClipboard } from '../utils/helpers';
import { ChevronLeft, Search, Check, Copy, CreditCard, Smartphone, Building2, ShieldCheck, ArrowRight, Zap, CheckCircle2, Printer, Download, FileText, User, Briefcase, Users, Store, Beer, Pill, Wrench, Utensils, GraduationCap, HeartPulse, Landmark, Bus, Sparkles, PlusCircle } from 'lucide-react';
import { NoteBox } from '../components/NoteBox';

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
  { id: 'other', label: 'Other Commercial / Civic Sector', icon: Sparkles, desc: 'Specify any unique trade, profession, or craft' },
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
      name: `Community (1 ${primary})`,
      price: 'Free',
      sub: `1 ${primary} desk · Multi-Seat Admin`,
      note: 'Unlimited desks & staff invites. Registration required.',
      min: 1,
      max: 1,
    },
    {
      id: 'community',
      name: `Community (${primary}s)`,
      price: '$100',
      sub: `per ${primary}, 2 to 50 ${primary}s`,
      note: 'Self-serve. Mobile money (MTN / Airtel) & Cards.',
      min: 2,
      max: 50,
    },
    {
      id: 'branch',
      name: `Branch / Multi-${primary}`,
      price: '$7,200',
      sub: `51 to 150 ${primary}s`,
      note: 'Monthly or annual billing available.',
      min: 51,
      max: 150,
    },
    {
      id: 'district',
      name: `${l1Unit} (${countryName})`,
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
      note: `Multi-node central oversight & reporting.`,
      min: 501,
      max: 2000,
    },
    {
      id: 'national',
      name: `National (${countryName})`,
      price: '$58,000',
      sub: `2,001+ ${primary}s`,
      note: `Full countrywide enterprise integration.`,
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
    const k = Object.keys(CONSUMER_BANDS)
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
  if (v === 0) return 'Free';
  return fmtUsd(v) + ((iv || 'annual') === 'annual' ? '/yr' : '/mo');
}

export const EntityRegisterView: React.FC = () => {
  const { go, registerNewEntity, toast } = useApp();

  const [country, setCountry] = useState<CountryCode>('UG');
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

  const covered = parish
    ? 1
    : subcounty
    ? parishes.length
    : district
    ? subs.reduce((a, s) => a + (s.children?.length || 0), 0)
    : 0;

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

  const searchHits = searchQuery.trim().length >= 2
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
            setSearchQuery('');
            return;
          }
        }
      }
    }
  };

  const effectiveProfessionalTitle = selectedTitle === 'Other (Specify Exact Title)'
    ? (customTitleSpecify.trim() || 'Proprietor & Managing Director')
    : selectedTitle;

  const effectiveSectorName = selectedSector === 'other'
    ? (customSectorSpecify.trim() || 'Commercial Enterprise')
    : (ENTITY_SECTORS.find((s) => s.id === selectedSector)?.label || 'Commercial Enterprise');

  const effectiveTypologyName = selectedTypology === 'Other (Specify Exact Typology)'
    ? (customTypologySpecify.trim() || 'Business Operation')
    : selectedTypology;

  const priceVal = intervalUsd(Math.max(covered, 1), kind, interval, country);

  const handleStartSubmit = () => {
    if (!name.trim()) {
      toast('Please enter your business or organisation name', 'amber');
      return;
    }
    if (selectedSector === 'other' && !customSectorSpecify.trim()) {
      toast('Please specify your custom sector / trade category', 'amber');
      return;
    }
    if (selectedTitle === 'Other (Specify Exact Title)' && !customTitleSpecify.trim()) {
      toast('Please specify your exact professional title', 'amber');
      return;
    }
    if (priceVal === 0) {
      completeRegistration('FREE-PROMO');
    } else {
      setStep('payment');
    }
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
    }, 1000);
  };

  const exchangeRateUgx = 3700;
  const priceUgx = priceVal * exchangeRateUgx;

  return (
    <div className="p-5 space-y-5 pt-6 animate-fade-in pb-12">
      <div>
        <button
          onClick={() => {
            if (step === 'payment') {
              setStep('details');
            } else {
              go('splash');
            }
          }}
          className="flex items-center gap-1 text-[10px] mono text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 mb-4 transition-colors font-bold"
        >
          <ChevronLeft size={14} /> {step === 'payment' ? 'Back to Registration Form' : 'Back'}
        </button>
        <div className="tagline mb-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
          {step === 'payment' ? 'Checkout Gateway' : 'Entity & Business Desk Onboarding'}
        </div>
        <h2 className="text-[26px] font-black text-slate-900 dark:text-emerald-400 tracking-tight leading-tight">
          {step === 'payment' ? 'Complete Subscription Payment' : 'Register your business or entity'}
        </h2>
        <p className="text-[13px] text-slate-600 dark:text-zinc-400 mt-1.5 leading-relaxed font-medium">
          {step === 'payment'
            ? `Secure checkout powered by Mobile Money & Card gateway for ${countryName}.`
            : `Empower any enterprise — from retail shops, bars, and pharmacies to garages and schools — to mount a verified public response wall with full admin team management.`}
        </p>
      </div>

      {step === 'details' && (
        <>
          {/* Quick Sign In Banner */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <Building2 size={15} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
              <div className="text-left">
                <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-200 block">Already have an Entity Access Code?</span>
                <span className="text-[9px] text-emerald-700 dark:text-emerald-400">Sign in to your shop, bar, pharmacy, clinic, or utility desk console.</span>
              </div>
            </div>
            <button
              onClick={() => go('entity_gateway')}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-[9.5px] mono font-bold uppercase transition-all shadow-2xs whitespace-nowrap"
            >
              Sign In →
            </button>
          </div>

          {/* Section 1: Business Category & Sector */}
          <div className="card p-4 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest block font-bold">
                1. Select Industry / Sector
              </label>
              <span className="text-[8.5px] mono text-emerald-700 dark:text-emerald-400 font-bold">
                All Categorizations Support "Other"
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ENTITY_SECTORS.map((sec) => {
                const IconComponent = sec.icon;
                const isSelected = selectedSector === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      setSelectedSector(sec.id);
                      // Update defaults based on chosen sector
                      const presets = TYPOLOGY_PRESETS[sec.id] || TYPOLOGY_PRESETS.other;
                      setSelectedTypology(presets[0]);
                      const tPresets = getBusinessTitlePresets(sec.id);
                      setSelectedTitle(tPresets[0]);
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 shadow-xs'
                        : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <IconComponent size={14} className={isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'} />
                      <span className="text-[11px] font-bold leading-tight line-clamp-1">{sec.label}</span>
                    </div>
                    <span className="text-[8px] text-slate-500 dark:text-zinc-500 mt-1 line-clamp-1">{sec.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Sector Specify Input if "Other" is chosen */}
            {selectedSector === 'other' && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/60 rounded-xl space-y-1.5 animate-fade-in">
                <label className="text-[9px] mono text-amber-900 dark:text-amber-300 uppercase tracking-wider font-bold flex items-center gap-1">
                  <Sparkles size={12} /> Specify Your Exact Industry / Sector:
                </label>
                <input
                  type="text"
                  value={customSectorSpecify}
                  onChange={(e) => setCustomSectorSpecify(e.target.value)}
                  placeholder="e.g. Artisanal Coffee Roastery, Solar Equipment Importer, Event Production Hub"
                  className="bg-white dark:bg-zinc-900 border-amber-300 dark:border-amber-700 text-sm font-medium"
                />
              </div>
            )}
          </div>

          {/* Section 2: Specific Business Typology */}
          <div className="card p-4 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest block font-bold">
                2. Business Typology / Operation Model
              </label>
              <span className="text-[8.5px] mono text-slate-500">Tailored to {effectiveSectorName}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {typologyPresets.map((typeOption) => {
                const isSelected = selectedTypology === typeOption;
                return (
                  <button
                    key={typeOption}
                    type="button"
                    onClick={() => setSelectedTypology(typeOption)}
                    className={`py-2 px-3 rounded-lg text-left text-[10.5px] mono font-bold border transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 shadow-xs'
                        : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-400 hover:border-slate-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '• '} {typeOption}
                  </button>
                );
              })}
            </div>

            {selectedTypology === 'Other (Specify Exact Typology)' && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/60 rounded-xl space-y-1.5 animate-fade-in">
                <label className="text-[9px] mono text-amber-900 dark:text-amber-300 uppercase tracking-wider font-bold">
                  Specify Exact Business Typology:
                </label>
                <input
                  type="text"
                  value={customTypologySpecify}
                  onChange={(e) => setCustomTypologySpecify(e.target.value)}
                  placeholder="e.g. 24-Hour Express Tyre & Battery Workshop, Rooftop Lounge & Tapas"
                  className="bg-white dark:bg-zinc-900 border-amber-300 dark:border-amber-700 text-sm font-medium"
                />
              </div>
            )}
          </div>

          {/* Section 3: Entity Details & Identity */}
          <div className="card p-4 space-y-3">
            <label className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest block font-bold">
              3. Business & Registrant Identity
            </label>

            <div>
              <label className="text-[8.5px] mono text-slate-600 dark:text-zinc-400 block mb-1 font-bold">
                Official Business or Organisation Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kikuubo Wholesale & Retail Traders Hub / Havana Bar & Lounge"
                className="text-sm font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[8.5px] mono text-slate-600 dark:text-zinc-400 block mb-1 font-bold">
                  Tax TIN / Registration / Trading License No:
                </label>
                <input
                  type="text"
                  value={reg}
                  onChange={(e) => setReg(e.target.value)}
                  placeholder="e.g. URSB / KCCA / URA-99201"
                  className="mono text-sm"
                />
              </div>
              <div>
                <label className="text-[8.5px] mono text-slate-600 dark:text-zinc-400 block mb-1 font-bold">
                  Registrant Full Name (Primary Admin):
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="e.g. Godfrey Kayongo / Sarah Nakamya"
                  className="text-sm"
                />
              </div>
            </div>

            {/* Professional Identity & Title Selection */}
            <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[8.5px] mono text-slate-600 dark:text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-1">
                  <Briefcase size={12} /> Your Professional Identity & Title in this Entity:
                </label>
                <span className="text-[8px] mono text-emerald-700 dark:text-emerald-400 font-bold">
                  Displayed on Public Response Wall
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {titlePresets.map((tOpt) => {
                  const isSel = selectedTitle === tOpt;
                  return (
                    <button
                      key={tOpt}
                      type="button"
                      onClick={() => setSelectedTitle(tOpt)}
                      className={`py-1.5 px-2.5 rounded-lg text-left text-[10px] mono font-bold border transition-all ${
                        isSel
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-200'
                          : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-slate-700 dark:text-zinc-400'
                      }`}
                    >
                      {isSel ? '✓ ' : '• '} {tOpt}
                    </button>
                  );
                })}
              </div>

              {selectedTitle === 'Other (Specify Exact Title)' && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/60 rounded-xl space-y-1.5 animate-fade-in">
                  <label className="text-[9px] mono text-amber-900 dark:text-amber-300 uppercase tracking-wider font-bold">
                    Specify Your Exact Professional Title:
                  </label>
                  <input
                    type="text"
                    value={customTitleSpecify}
                    onChange={(e) => setCustomTitleSpecify(e.target.value)}
                    placeholder="e.g. Lead Clinical Pharmacist, Master Auto Electrician, Managing Partner"
                    className="bg-white dark:bg-zinc-900 border-amber-300 dark:border-amber-700 text-sm font-medium"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                ['consumer', 'Commercial Enterprise (Shop, Bar, Clinic, etc.)'],
                ['utility', 'Utility / Infrastructure Service (Water, Power, Solar)'],
              ].map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setKind(k as any)}
                  className={`py-2 px-2 rounded-xl text-[9px] mono font-bold border transition-all ${
                    kind === k
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 shadow-xs'
                      : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Entity Administration & Multi-Seat Team Setup */}
          <div className="card p-4 space-y-3 bg-slate-50/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800">
            <div className="flex justify-between items-center">
              <label className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest block font-bold flex items-center gap-1.5">
                <Users size={14} className="text-emerald-600" />
                4. Entity Admin & Team Seat Management
              </label>
              <span className="text-[8.5px] mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                Admin Console Included
              </span>
            </div>

            <p className="text-[10.5px] text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
              As the <span className="font-bold text-slate-900 dark:text-zinc-200">{effectiveProfessionalTitle || 'Entity Admin'}</span>, you have master permissions to invite staff members (e.g. duty managers, cashiers, customer care clerks, field technicians) and manage their active desk access.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { count: 3, label: '3 Staff Seats', note: 'Small shop or bar' },
                { count: 5, label: '5 Staff Seats (Default)', note: 'Medium retail/clinic' },
                { count: 12, label: '12 Staff Seats', note: 'Large team & branches' },
              ].map((seatOpt) => (
                <button
                  key={seatOpt.count}
                  type="button"
                  onClick={() => setStaffSeats(seatOpt.count)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    staffSeats === seatOpt.count
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 shadow-xs'
                      : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  <span className="text-[10px] font-bold block">{seatOpt.label}</span>
                  <span className="text-[8px] text-slate-500">{seatOpt.note}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Country & Coverage Scope */}
          <div className="card p-4 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest block font-bold">
                5. Location & Country Scope
              </label>
              <span className="text-[8.5px] mono text-emerald-700 dark:text-emerald-400 font-bold">
                {COUNTRIES[country]?.flag} {countryName}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {(Object.entries(COUNTRIES) as [CountryCode, any][]).map(([c, d]) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCountry(c);
                    setDistrict('');
                    setSubcounty('');
                    setParish('');
                  }}
                  className={`py-2 rounded-lg text-[9.5px] mono font-bold border transition-all ${
                    country === c
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 shadow-sm'
                      : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="sw">
              <Search size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search for your local ${primaryUnitName} (e.g. Kololo, Kikuubo, Wandegeya)…`}
                className="mono text-sm"
              />
            </div>

            {searchQuery.trim().length >= 2 && (
              <div className="space-y-1">
                {searchHits.length === 0 ? (
                  <p className="text-[9.5px] mono text-slate-500 dark:text-zinc-400 py-2">No {primaryUnitName} matches that.</p>
                ) : (
                  searchHits.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => pickPrimaryNode(n.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        parish === n.id
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30'
                          : 'bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-[12px] font-bold text-slate-900 dark:text-zinc-200">{n.name}</div>
                      <div className="path-crumb text-slate-500 dark:text-zinc-400">{n.path}</div>
                    </button>
                  ))
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                className="mono text-xs"
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setSubcounty('');
                  setParish('');
                  setSearchQuery('');
                }}
              >
                <option value="">Select {l1Name}…</option>
                {dists.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>

              <select
                className="mono text-xs"
                disabled={!district}
                value={subcounty}
                style={{ opacity: district ? 1 : 0.4 }}
                onChange={(e) => {
                  setSubcounty(e.target.value);
                  setParish('');
                }}
              >
                <option value="">Select {l2Name}…</option>
                {subs.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>

              <select
                className="mono text-xs"
                disabled={!subcounty}
                value={parish}
                style={{ opacity: subcounty ? 1 : 0.4 }}
                onChange={(e) => setParish(e.target.value)}
              >
                <option value="">Select {primaryUnitName}…</option>
                {parishes.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-[9.5px] mono text-slate-500 dark:text-zinc-400 pt-1 font-bold">
              {covered > 0 ? `${covered} ${primaryUnitName}${covered > 1 ? 's' : ''} covered` : 'Location not pinpointed yet (will default to primary district node)'}
            </p>
          </div>

          {/* Plan Summary Card */}
          <div className="card-civic p-4 space-y-2 a-fade bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-bold">Verified Registration Plan</p>
                <p className="text-[16px] font-black text-slate-900 dark:text-zinc-100 mt-1">
                  {tier.name} · {Math.max(covered, 1) <= 1 ? 'Free Community Plan' : 'Multi-Branch Plan'}
                </p>
                <p className="text-[10px] mono text-slate-600 dark:text-zinc-400 mt-0.5 font-medium">
                  {Math.max(covered, 1)} {primaryUnitName} · {staffSeats} Staff Seats · Entity Admin Console
                </p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-black mono ${Math.max(covered, 1) <= 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-zinc-100'}`}>
                  {entityPrice(Math.max(covered, 1), kind, interval, country)}
                </p>
              </div>
            </div>

            {covered > 1 && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {(['annual', 'monthly'] as const).map((iv) => (
                  <button
                    key={iv}
                    onClick={() => setInterval(iv)}
                    className={`py-2 rounded-xl text-[9.5px] mono font-bold border transition-all ${
                      interval === iv
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 shadow-sm'
                        : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                    }`}
                  >
                    {iv === 'annual'
                      ? 'Annual — ' + fmtUsd(annualUsd(covered, kind, country))
                      : 'Monthly — ' + fmtUsd(intervalUsd(covered, kind, 'monthly', country))}
                  </button>
                ))}
              </div>
            )}
          </div>

          <NoteBox
            tone="emerald"
            title="Public Verification & Multi-Seat Team"
            text={`Your entity will be indexed with ${effectiveProfessionalTitle} as Primary Administrator. You can delegate dispute resolutions, assign floor staff, and reply to citizen queries with verified badges.`}
          />

          <button
            onClick={handleStartSubmit}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl py-4 text-sm uppercase tracking-widest mono transition-all active:scale-[.98] flex items-center justify-center gap-2 shadow-sm"
          >
            {priceVal === 0 ? (
              'Mount Entity Desk — Free'
            ) : (
              <>
                <span>Proceed to Payment ({entityPrice(covered, kind, interval, country)})</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </>
      )}

      {step === 'payment' && (
        <div className="space-y-4 animate-fade-in">
          {/* Order Summary */}
          <div className="card-gov p-4 space-y-3 bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[8.5px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-bold">Subscription Order Summary</p>
                <h3 className="text-[17px] font-black text-slate-900 dark:text-zinc-100 mt-0.5">{name || 'Your Organisation'}</h3>
                <p className="text-[10.5px] mono text-slate-600 dark:text-zinc-400 mt-0.5 font-medium">
                  {effectiveSectorName} · {effectiveProfessionalTitle} · {staffSeats} Staff Seats
                </p>
              </div>
              <span className="chip ch-ro">Pending Payment</span>
            </div>

            <div className="pt-2.5 border-t border-slate-200 dark:border-zinc-800/80 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] mono text-slate-500 dark:text-zinc-400 block font-bold">Total Amount ({interval})</span>
                {country === 'UG' && (
                  <span className="text-[9.5px] mono text-amber-700 dark:text-amber-400 font-bold">
                    ~ UGX {priceUgx.toLocaleString()} (Rate: 1 USD = 3,700 UGX)
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-2xl font-black mono text-emerald-600 dark:text-emerald-400">
                  {entityPrice(covered, kind, interval, country)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div className="card p-4 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-bold">
                Select Payment Channel ({countryName})
              </label>
              <span className="text-[8.5px] mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-bold">
                <ShieldCheck size={12} /> Gateway Protected
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setPayMethod('momo')}
                className={`py-2.5 px-2 rounded-xl text-[9.5px] mono font-bold border transition-all flex flex-col items-center gap-1 ${
                  payMethod === 'momo'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 shadow-sm'
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                }`}
              >
                <Smartphone size={16} />
                <span>Mobile Money</span>
              </button>

              <button
                type="button"
                onClick={() => setPayMethod('gateway')}
                className={`py-2.5 px-2 rounded-xl text-[9.5px] mono font-bold border transition-all flex flex-col items-center gap-1 ${
                  payMethod === 'gateway'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 shadow-sm'
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                }`}
              >
                <CreditCard size={16} />
                <span>Card / Web</span>
              </button>

              <button
                type="button"
                onClick={() => setPayMethod('bank')}
                className={`py-2.5 px-2 rounded-xl text-[9.5px] mono font-bold border transition-all flex flex-col items-center gap-1 ${
                  payMethod === 'bank'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 shadow-sm'
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                }`}
              >
                <Building2 size={16} />
                <span>Bank Wire</span>
              </button>
            </div>

            {payMethod === 'momo' && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-3 animate-fade-in shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold text-amber-900 dark:text-amber-300 mono">MTN MoMo & Airtel Money Gateway</span>
                  <span className="chip text-[8px] bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 font-bold">
                    Instant USSD Prompt
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMomoProvider('mtn')}
                    className={`py-2 px-3 rounded-lg text-[9.5px] mono font-bold border text-left transition-all ${
                      momoProvider === 'mtn'
                        ? 'border-amber-500 bg-amber-100/70 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300'
                        : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    🟡 MTN Mobile Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setMomoProvider('airtel')}
                    className={`py-2 px-3 rounded-lg text-[9.5px] mono font-bold border text-left transition-all ${
                      momoProvider === 'airtel'
                        ? 'border-rose-500 bg-rose-100/70 dark:bg-red-500/10 text-rose-900 dark:text-red-300'
                        : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    🔴 Airtel Money
                  </button>
                </div>

                <div>
                  <label className="text-[8.5px] mono text-slate-500 dark:text-zinc-400 block mb-1 font-bold">
                    Mobile Money Phone Number ({countryName})
                  </label>
                  <input
                    type="text"
                    value={momoPhone}
                    onChange={(e) => setMomoPhone(e.target.value)}
                    placeholder="e.g. 0772 123 456 / 0701 987 654"
                    className="mono text-sm"
                  />
                </div>
              </div>
            )}

            {payMethod === 'gateway' && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-3 animate-fade-in shadow-sm">
                <span className="text-[10.5px] font-bold text-emerald-800 dark:text-emerald-300 mono">Card & Online Payment</span>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card Number"
                  className="mono text-sm"
                />
              </div>
            )}

            {payMethod === 'bank' && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-3 animate-fade-in shadow-sm">
                <span className="text-[10.5px] font-bold text-amber-900 dark:text-amber-300 mono">EFT / Direct Bank Voucher</span>
                <input
                  type="text"
                  value={bankRef}
                  onChange={(e) => setBankRef(e.target.value)}
                  placeholder="Bank Voucher Ref"
                  className="mono text-sm"
                />
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => completeRegistration(payMethod === 'momo' ? `MOMO-${momoPhone}` : payMethod === 'gateway' ? 'CARD-CONFIRMED' : bankRef)}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black rounded-2xl py-4 text-sm uppercase tracking-widest mono transition-all active:scale-[.98] flex items-center justify-center gap-2 shadow-sm"
          >
            {isProcessing ? 'Connecting Gateway…' : `Confirm & Mount Desk (${entityPrice(covered, kind, interval, country)})`}
          </button>
        </div>
      )}
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
    paymentRef: 'MOMO-CONFIRMED',
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
    <div className="p-5 space-y-5 pt-8 animate-fade-in pb-12">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-sm">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-[22px] font-black text-slate-900 dark:text-zinc-100 tracking-tight">{res.name} is registered</h2>
        <p className="text-[12px] text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
          {res.professionalTitle} · {res.staffSeats || 5} Team Seats Allocated · {countryName}
        </p>
      </div>

      <div className="card-gov p-4 space-y-2 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
        <p className="text-[8.5px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-bold">Your Primary Access Code — tap to copy</p>
        <button
          onClick={() => copyToClipboard(res.code, 'Access code', (msg) => toast(msg))}
          className="flex items-center justify-between w-full bg-slate-50 dark:bg-zinc-900/80 rounded-lg px-3.5 py-3 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 transition-colors"
        >
          <span className="text-sm mono font-black text-amber-800 dark:text-amber-300 tracking-widest">{res.code}</span>
          <Copy size={14} className="text-slate-500 dark:text-zinc-500" />
        </button>
        <p className="text-[8.5px] mono text-slate-500 dark:text-zinc-400 leading-relaxed">
          Use this code to mount the Executive Administrator Desk. From your desk console, you can invite team members and assign custom staff titles.
        </p>
      </div>

      <div className="card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-bold">Registration & Plan Status</p>
          <span className="text-[8.5px] mono text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20 font-bold">
            {res.price === 0 ? 'Active · Free' : 'Paid & Active ✓'}
          </span>
        </div>

        <div className="space-y-1.5 text-[10px] mono border-t border-b border-slate-200 dark:border-zinc-800/80 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-zinc-400">Professional Identity</span>
            <span className="text-slate-900 dark:text-zinc-200 font-bold">{res.professionalTitle}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-zinc-400">Industry / Sector</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">{res.sectorName || 'Commercial'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-zinc-400">Admin Authority</span>
            <span className="text-amber-800 dark:text-amber-300 font-bold">Full Multi-Seat Team Management</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
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
              toast('Downloaded Voucher!', 'emerald');
            }}
            className="flex items-center justify-center gap-1.5 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 rounded-xl py-2.5 text-[10px] font-bold mono transition-all active:scale-[.98] shadow-sm"
          >
            <Download size={13} /> Export Voucher (.txt)
          </button>

          <button
            onClick={handleOpenDesk}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-2.5 text-[10px] font-bold mono transition-all active:scale-[.98] shadow-sm"
          >
            Launch Desk →
          </button>
        </div>
      </div>

      <button
        onClick={handleOpenDesk}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl py-4 text-sm uppercase tracking-widest mono transition-all active:scale-[.98] shadow-sm"
      >
        Open my desk & manage team →
      </button>
      <button
        onClick={() => go('splash')}
        className="w-full text-slate-500 hover:text-slate-800 dark:text-zinc-500 dark:hover:text-zinc-300 font-bold rounded-2xl py-2 text-[10px] uppercase tracking-widest mono transition-all"
      >
        Return Home
      </button>
    </div>
  );
};

