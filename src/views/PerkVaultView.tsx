import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  EscrowPerkVoucher,
  CountryCode,
  VaultKind,
  MerchantProductService,
  MerchantVoucherRewardType,
  MARKETPLACE_CATEGORIES,
  MarketplaceCategory,
} from '../types';
import { COUNTRIES, TERRITORY } from '../data/countries';
import { allDepts } from '../utils/helpers';
import { savePerkVoucherBatchToCloud, savePerkVoucherToCloud, saveGatewayTransactionToCloud } from '../services/firestoreSync';
import { MerchantLoyaltyStudio } from '../components/MerchantLoyaltyStudio';
import { FrontlineStageExplorer } from '../components/FrontlineStageExplorer';
import { getStoredMerchantProducts, filterMerchantProductsByLocation, calculateVoucherEconomics } from '../data/merchantLoyaltyData';
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  Plus,
  Gift,
  ShieldCheck,
  CheckCircle2,
  Ticket,
  Search,
  Filter,
  Download,
  Building2,
  HardHat,
  Zap,
  Droplet,
  Smartphone,
  Bike,
  Car,
  Stethoscope,
  GraduationCap,
  Copy,
  ExternalLink,
  RefreshCw,
  CreditCard,
  Wallet,
  Banknote,
  Shield,
  Check,
  Phone,
  Award,
  Scale,
  Printer,
  Lock,
  SlidersHorizontal,
  MapPin,
  Store,
  ShoppingBag,
  Package,
  X,
  Users,
  Send,
  Sparkles,
  Tag,
  Percent,
  ScanLine,
} from 'lucide-react';

export interface RankedJurisdictionCitizen {
  rank: 1 | 2 | 3;
  name: string;
  contact: string;
  roleOrProfession: string;
  score: number;
  reportsCount: number;
  resolvedOrVerifiedCount: number;
  upvotesCount: number;
  citationReason: string;
  samplePostId?: string;
}

export interface ReporterProfessionCategoryConfig {
  id: string;
  name: string;
  shortTitle: string;
  fieldScoutTag: string;
  bountyType: string;
  defaultBrand: string;
  icon: any;
  badgeClass: string;
  professionFilter: string[];
}

export const REPORTER_PROFESSION_CATEGORIES: ReporterProfessionCategoryConfig[] = [
  {
    id: 'boda',
    name: 'Bodaboda Rider / Cyclist',
    shortTitle: 'Bodaboda Road Scouts',
    fieldScoutTag: 'Frontline Road Scout · Fuel & Airtime Eligible',
    bountyType: 'Fuel & Airtime Bounty',
    defaultBrand: 'SafeBoda / TotalEnergies Fuel',
    icon: Bike,
    badgeClass: 'text-amber-700 dark:text-amber-300 bg-amber-500/15 border-amber-500/30',
    professionFilter: ['boda', 'cyclist', 'rider', 'motorcycle', 'okada'],
  },
  {
    id: 'taxi',
    name: 'Taxi / Matatu / Commercial Driver',
    shortTitle: 'Transit & Highway Drivers',
    fieldScoutTag: 'Public Transit & Highway Scout · Fuel & Data Eligible',
    bountyType: 'Highway Transit Fuel Voucher',
    defaultBrand: 'Shell / Rubis Transit Fuel',
    icon: Car,
    badgeClass: 'text-orange-700 dark:text-orange-300 bg-orange-500/15 border-orange-500/30',
    professionFilter: ['taxi', 'matatu', 'driver', 'commercial', 'danfo', 'trotro'],
  },
  {
    id: 'market',
    name: 'Market Vendor / Local Trader',
    shortTitle: 'Market Vendors & Traders',
    fieldScoutTag: 'Public Space & Sanitation Scout · Grocery & Power Eligible',
    bountyType: 'Market Fresh Produce & Utility Pack',
    defaultBrand: 'Fresh Produce & Umeme Utility Pack',
    icon: Store,
    badgeClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
    professionFilter: ['market', 'vendor', 'trader', 'shopkeeper', 'stall'],
  },
  {
    id: 'health',
    name: 'Healthcare Worker / Nurse / Clinical Staff',
    shortTitle: 'Healthcare Monitors',
    fieldScoutTag: 'Health Service Monitor · Clinical Wellness & Data Eligible',
    bountyType: 'Clinical Connectivity & Wellness Voucher',
    defaultBrand: 'Pharmacy Wellness & Clinical Data',
    icon: Stethoscope,
    badgeClass: 'text-sky-700 dark:text-sky-300 bg-sky-500/15 border-sky-500/30',
    professionFilter: ['nurse', 'clinical', 'doctor', 'health', 'hospital', 'medical'],
  },
  {
    id: 'teacher',
    name: 'Teacher / Student / Youth Leader',
    shortTitle: 'Teachers & Youth Leaders',
    fieldScoutTag: 'Education & Community Watch · Educational Data & Book Eligible',
    bountyType: 'Educational Data Bundle & Stationery Voucher',
    defaultBrand: 'MTN / Airtel Education Data & Books',
    icon: GraduationCap,
    badgeClass: 'text-indigo-700 dark:text-indigo-300 bg-indigo-500/15 border-indigo-500/30',
    professionFilter: ['teacher', 'student', 'youth', 'headmaster', 'school', 'guild'],
  },
  {
    id: 'artisan',
    name: 'Artisan / Builder / Field Technician',
    shortTitle: 'Artisans & Builders',
    fieldScoutTag: 'Infrastructure Quality Inspector · Tools & Hardware Eligible',
    bountyType: 'Contractor CSR Hardware & Tool Voucher',
    defaultBrand: 'Contractor CSR Hardware & Tools',
    icon: HardHat,
    badgeClass: 'text-yellow-700 dark:text-yellow-300 bg-yellow-500/15 border-yellow-500/30',
    professionFilter: ['artisan', 'builder', 'technician', 'mason', 'plumber', 'electrician'],
  },
  {
    id: 'civil',
    name: 'Civil Servant / Public Officer',
    shortTitle: 'Civil Servants & Public Officers',
    fieldScoutTag: 'Internal Oversight & Whistleblower · Airtime & Integrity Pack',
    bountyType: 'Public Integrity & Communication Voucher',
    defaultBrand: 'Government Communications & Data Pack',
    icon: ShieldCheck,
    badgeClass: 'text-purple-700 dark:text-purple-300 bg-purple-500/15 border-purple-500/30',
    professionFilter: ['civil servant', 'officer', 'public officer', 'oversight', 'whistleblower'],
  },
  {
    id: 'citizen',
    name: 'General Resident / Commuter',
    shortTitle: 'Community Citizens',
    fieldScoutTag: 'Community Citizen Watch · Utility & Food Pack Eligible',
    bountyType: 'Utility Power & Supermarket Shopping Pack',
    defaultBrand: 'NWSC Water & Supermarket Shopping',
    icon: Users,
    badgeClass: 'text-teal-700 dark:text-teal-300 bg-teal-500/15 border-teal-500/30',
    professionFilter: ['resident', 'commuter', 'citizen', 'neighbourhood'],
  },
];

export const PerkVaultView: React.FC = () => {
  const {
    user,
    posts,
    projects,
    profiles,
    addPoints,
    go,
    toast,
    logAudit,
    selectedCountry: ctxCountry,
    setActiveDept,
    setActiveDeptCountry,
    setWallTab,
  } = useApp();
  const studioSectionRef = React.useRef<HTMLDivElement | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>((user?.country || ctxCountry || 'UG') as CountryCode);

  useEffect(() => {
    const nextC = (user?.country || ctxCountry || 'UG') as CountryCode;
    if (nextC && nextC !== selectedCountry) {
      setSelectedCountry(nextC);
    }
  }, [user?.country, ctxCountry]);

  const userHomeParish = useMemo(() => {
    if (user?.scope_label) return user.scope_label;
    return selectedCountry === 'KE' ? 'Kilimani Ward' : selectedCountry === 'NG' ? 'Lekki Phase 1 Ward' : 'Kitintale Parish';
  }, [user?.scope_label, selectedCountry]);

  const [parishDepositMode, setParishDepositMode] = useState<'home' | 'external'>('home');

  // --- FIVE-VAULT ARCHITECTURE STATE ---
  const [activeVaultKind, setActiveVaultKind] = useState<VaultKind>(() => {
    if (user?.entity_category === 'private_contractor') return 'contractor_vault';
    if (user?.entity_category === 'transport_cooperative') return 'scout_bounty_vault';
    if (user?.entity_type === 'non_government_entity') return 'provider_vault';
    return 'parish_vault';
  });
  const [selectedParish, setSelectedParish] = useState<string>(() => {
    if (user?.scope_label && user.scope_label.toLowerCase().includes('parish')) return user.scope_label;
    return 'Kitintale Parish';
  });

  useEffect(() => {
    if (parishDepositMode === 'home') {
      setSelectedParish(userHomeParish);
    }
  }, [userHomeParish, parishDepositMode]);

  const [selectedProviderDept, setSelectedProviderDept] = useState<string>(
    user?.entity_type === 'non_government_entity' && user?.dept ? user.dept : 'umeme'
  );
  const [selectedContractId, setSelectedContractId] = useState<string>('PRJ-UG-01');
  const [selectedScoutCorridor, setSelectedScoutCorridor] = useState<string>('corridor_northern_bypass');
  const [selectedScoutProfession, setSelectedScoutProfession] = useState<string>('boda');
  const [individualTargetPostId, setIndividualTargetPostId] = useState<string>('');
  const [individualRecipientName, setIndividualRecipientName] = useState<string>('Amina Nabatanzi');
  const [individualRecipientPhone, setIndividualRecipientPhone] = useState<string>('+256 774 819 203');
  const [individualCitationNote, setIndividualCitationNote] = useState<string>(
    'Rewarding your outstanding field post and photo evidence from my Individual Vault!'
  );
  const [selectedAwardMonth, setSelectedAwardMonth] = useState<'2026-10' | '2026-09' | '2026-08'>('2026-10');
  const [isBatchDispatching, setIsBatchDispatching] = useState<boolean>(false);
  const [lastBatchDispatchReceipt, setLastBatchDispatchReceipt] = useState<{
    vaultKind: VaultKind;
    awardMonthLabel: string;
    jurisdictionLabel: string;
    dispatcherLabel: string;
    dispatchedAt: string;
    recipients: Array<{ rank: number; name: string; contact: string; voucherCode: string; brand: string; faceValue: number; currency: string; score: number }>;
  } | null>(null);

  const [vouchers, setVouchers] = useState<EscrowPerkVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pay' | 'packs' | 'csv' | 'manual' | 'redeem_xp' | 'csr_leaderboard'>('packs');
  const [merchantProducts, setMerchantProducts] = useState<MerchantProductService[]>(() => getStoredMerchantProducts());
  const [allocationSource, setAllocationSource] = useState<'utilities_supermarket' | 'merchant_loyalty'>('utilities_supermarket');
  const [merchantLocationFilterParish, setMerchantLocationFilterParish] = useState<string>(() => {
    return user?.scope_label && user.scope_label.toLowerCase().includes('parish') ? user.scope_label : 'Kitintale Parish';
  });
  const [merchantRewardTypeFilter, setMerchantRewardTypeFilter] = useState<'all' | MerchantVoucherRewardType>('all');
  const [merchantCategoryFilter, setMerchantCategoryFilter] = useState<string>('all');
  const [selectedMerchantProduct, setSelectedMerchantProduct] = useState<MerchantProductService | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDemoMode, setFilterDemoMode] = useState<'all' | 'live' | 'demo'>('all');
  const [filterVaultKind, setFilterVaultKind] = useState<'all' | VaultKind>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadAsLive, setUploadAsLive] = useState<boolean>(true);
  const [redeemedVoucherCard, setRedeemedVoucherCard] = useState<EscrowPerkVoucher | null>(null);
  const [activeCsrCertSponsor, setActiveCsrCertSponsor] = useState<{
    sponsorName: string;
    sponsorType: string;
    totalVouchers: number;
    dispatchedCount: number;
    totalFaceValue: number;
    currency: string;
    projects: string[];
    categories: string[];
    certHash: string;
  } | null>(null);
  const [lastXpRedeemIso, setLastXpRedeemIso] = useState<string | null>(() => {
    try {
      return localStorage.getItem(`cd_last_xp_redeem_${user?.id || 'usr-9028-UG'}`);
    } catch {
      return null;
    }
  });

  // Direct Payment & Instant Escrow Buy State
  const [payPackage, setPayPackage] = useState<
    | 'supermarket_1000ksh_single'
    | 'supermarket_1000ksh_5'
    | 'supermarket_mega_hamper_3'
    | 'mtn_5'
    | 'mtn_10'
    | 'nwsc_5'
    | 'yaka_5'
    | 'safeboda_10'
    | 'fuel_shell_5'
    | 'pharmacy_wellness_5'
    | 'school_stationery_5'
    | 'agri_market_5'
    | 'custom'
  >('supermarket_1000ksh_5');
  const [allocationSearchQuery, setAllocationSearchQuery] = useState<string>('');
  const [allocationCategoryFilter, setAllocationCategoryFilter] = useState<
    'all' | 'supermarket' | 'telco_data' | 'water_electricity' | 'transit_fuel'
  >('all');
  const [customPackagedItemsInput, setCustomPackagedItemsInput] = useState<string>(
    '2kg Maize Flour (Unga), 1L Cooking Oil, 1kg Sugar, 2kg Rice, Bar of Soap & Milk'
  );
  const [paySponsorName, setPaySponsorName] = useState(user?.name ? `${user.name} (Civic Patron)` : 'Seyani Brothers Construction Ltd');
  const [paySponsorType, setPaySponsorType] = useState<'contractor' | 'authority' | 'corporate_csr' | 'citizen_patron'>('citizen_patron');
  const [payProjectName, setPayProjectName] = useState('Community Civic Watchdog Incentive Fund');
  const [payMethod, setPayMethod] = useState<'momo' | 'airtel' | 'mpesa' | 'card' | 'bank'>('momo');
  const [payPhone, setPayPhone] = useState('+256778277900');
  const [payEmail, setPayEmail] = useState('csr@seyanibrothers.ug');
  const [payCardName, setPayCardName] = useState('Seyani Brothers Ltd (Corporate)');
  const [payCardNumber, setPayCardNumber] = useState('4242 •••• •••• 4242');
  const [payCardExpiry, setPayCardExpiry] = useState('12/28');
  const [payCardCvc, setPayCardCvc] = useState('892');
  const [customQuantity, setCustomQuantity] = useState(3);
  const [customFaceValue, setCustomFaceValue] = useState(1000);
  const [customBrand, setCustomBrand] = useState('Naivas / Quality Supermarket');
  const [customCategory, setCustomCategory] = useState<'telco_data' | 'water_utility' | 'electricity' | 'transit_credit' | 'supermarket'>('supermarket');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState<any>(null);

  // CSV Upload State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreviewRows, setCsvPreviewRows] = useState<any[]>([]);
  const [csvSponsor, setCsvSponsor] = useState(user?.name ? `${user.name} (Community CSR)` : 'Seyani Brothers Construction Ltd (CSR Allocation)');
  const [csvSponsorType, setCsvSponsorType] = useState<'contractor' | 'authority' | 'corporate_csr' | 'citizen_patron'>('citizen_patron');
  const [csvProjectName, setCsvProjectName] = useState('Kampala Flyover & Southern Bypass');
  const [isUploading, setIsUploading] = useState(false);

  // Manual Deposit Form State
  const [manualBrand, setManualBrand] = useState('MTN Uganda');
  const [manualCategory, setManualCategory] = useState<'telco_data' | 'water_utility' | 'electricity' | 'transit_credit' | 'supermarket'>('telco_data');
  const [manualCode, setManualCode] = useState('');
  const [manualPin, setManualPin] = useState('');
  const [manualFaceValue, setManualFaceValue] = useState('10000');
  const [manualCurrency, setManualCurrency] = useState('UGX');
  const [manualSponsor, setManualSponsor] = useState(user?.name ? `${user.name} (Civic Patron)` : 'Seyani Brothers Construction Ltd');
  const [manualSponsorType, setManualSponsorType] = useState<'contractor' | 'authority' | 'corporate_csr' | 'citizen_patron'>('citizen_patron');
  const [manualExpiry, setManualExpiry] = useState('2026-12-31');

  // --- JURISDICTION OPTIONS PER COUNTRY ---
  const parishOptions = useMemo(() => {
    const fromPosts = Array.from(
      new Set(
        posts
          .filter((p) => p.country === selectedCountry && p.territory?.parish)
          .map((p) => p.territory.parish)
      )
    );
    const rawTerr = TERRITORY[selectedCountry];
    const terrNodes = Array.isArray(rawTerr) ? rawTerr : (rawTerr as any)?.nodes || [];
    const fromTree: string[] = [];
    terrNodes.forEach((d) => {
      (d.children || []).forEach((sc) => {
        (sc.children || []).forEach((par) => {
          if (par.name) fromTree.push(par.name);
        });
      });
    });
    const defaultUgParishes = ['Kitintale Parish', 'Wandegeya Parish', 'Nakasero II Parish', 'Kisenyi II Parish', 'Ntinda Parish', 'Bwaise III Parish'];
    const combined = Array.from(new Set([...(selectedCountry === 'UG' ? ['Kitintale Parish'] : []), ...fromPosts, ...fromTree, ...(selectedCountry === 'UG' ? defaultUgParishes : [])]));
    if (combined.length > 0) return combined.slice(0, 18);
    return selectedCountry === 'KE'
      ? ['Kilimani Ward', 'Westlands Ward', 'Kibera Lindi Ward', 'Embakasi Central Ward']
      : defaultUgParishes;
  }, [posts, selectedCountry]);

  // Strict Role-Based Visibility Checks for Institutional Vault Execution Buttons
  const isParishChiefUser = Boolean(
    user?.role === 'gov' &&
      (user?.level === 'parish' ||
        user?.real_title?.toLowerCase().includes('parish') ||
        user?.real_title?.toLowerCase().includes('ward') ||
        user?.scope_label?.toLowerCase().includes('parish') ||
        user?.scope_label?.toLowerCase().includes('ward'))
  );

  const isPrivateProviderUser = Boolean(
    user?.entity_type === 'non_government_entity' ||
      user?.entity_category === 'utility_telecom' ||
      user?.entity_category === 'commercial_enterprise' ||
      (user?.role === 'gov' && ['umeme', 'nwsc', 'mtn_ug', 'airtel_ug', 'safaricom', 'kplc'].includes(user?.dept || ''))
  );

  const isContractorUser = Boolean(
    user?.entity_category === 'private_contractor' ||
      user?.real_title?.toLowerCase().includes('contractor') ||
      user?.real_title?.toLowerCase().includes('engineer') ||
      user?.organization_name?.toLowerCase().includes('construction') ||
      user?.organization_name?.toLowerCase().includes('contractor')
  );

  const isCitizenOnly = !isPrivateProviderUser && !isContractorUser;
  const [vaultCategoryView, setVaultCategoryView] = useState<'citizen_crowdsource' | 'institutional_desks'>(
    isPrivateProviderUser || isContractorUser ? 'institutional_desks' : 'citizen_crowdsource'
  );

  useEffect(() => {
    if (vaultCategoryView === 'citizen_crowdsource') {
      if (activeVaultKind === 'provider_vault' || activeVaultKind === 'contractor_vault') {
        setActiveVaultKind('parish_vault');
      }
    } else if (vaultCategoryView === 'institutional_desks') {
      if (activeVaultKind !== 'provider_vault' && activeVaultKind !== 'contractor_vault') {
        setActiveVaultKind(isContractorUser ? 'contractor_vault' : 'provider_vault');
      }
    }
  }, [vaultCategoryView, isContractorUser]);

  const providerOptions = useMemo(() => {
    const depts = allDepts(selectedCountry);
    const consumerOrPrivate = depts.filter(
      (d) => d.lane === 'consumer' || d.category !== 'government' || d.isEnterprise
    );
    const base = consumerOrPrivate.length > 0 ? consumerOrPrivate : depts.slice(0, 8);
    return [
      ...base,
      {
        id: 'shop_quality_supermarket',
        name: selectedCountry === 'KE' ? 'Naivas Supermarket Community Desk' : 'Quality Supermarket Community Desk',
        full: 'Retail & Supermarket Patron Service Desk',
        sla: 24,
        lane: 'consumer' as const,
        category: 'retail_shops' as const,
      },
      {
        id: 'shop_javahouse_acacia',
        name: 'Java House & Hospitality Desk',
        full: 'Food, Dining & Patron Experience Desk',
        sla: 24,
        lane: 'consumer' as const,
        category: 'food_dining' as const,
      },
    ];
  }, [selectedCountry]);

  const contractOptions = useMemo(() => {
    const countryProjects = projects.filter((pr) => (pr.country || 'UG') === selectedCountry);
    if (countryProjects.length > 0) return countryProjects;
    return projects.slice(0, 5);
  }, [projects, selectedCountry]);

  const scoutCorridorOptions = useMemo(() => {
    if (selectedCountry === 'KE') {
      return [
        { id: 'corridor_thika_superhighway', label: 'Thika Superhighway & Roysambu Bodaboda / Matatu Stage', authority: 'KeNHA / NTSA Road Safety Desk' },
        { id: 'corridor_mombasa_road', label: 'Mombasa Road & Nyayo Stadium Transit Corridor', authority: 'KURA / Nairobi Transit Watch' },
        { id: 'corridor_waiyaki_way', label: 'Waiyaki Way & Westlands Stage Scout Zone', authority: 'NTSA Frontline Riders Pool' },
      ];
    }
    if (selectedCountry === 'NG') {
      return [
        { id: 'corridor_lekki_epe', label: 'Lekki-Epe Expressway & Marwa/Okada Scout Corridor', authority: 'LASG / FRSC Road Safety Pool' },
        { id: 'corridor_third_mainland', label: 'Third Mainland & Ikeja Along Transit Stage', authority: 'LAMATA / FRSC Corridor Watch' },
      ];
    }
    return [
      { id: 'corridor_northern_bypass', label: 'Kampala Northern Bypass & Bwaise Bodaboda Stage', authority: 'UNRA / MoWT & SafeBoda Stage Safety' },
      { id: 'corridor_jinja_highway', label: 'Jinja Road, Nakawa & Mukono Highway Scout Corridor', authority: 'KCCA / Traffic Police Road Safety Pool' },
      { id: 'corridor_entebbe_express', label: 'Entebbe Road, Kibuye & Kajjansi Stage Scout Zone', authority: 'MoWT / Frontline Bodaboda Union' },
      { id: 'corridor_gulu_highway', label: 'Bombo-Gulu Highway & Kawempe Stage Corridor', authority: 'UNRA Northern Corridor Scout Pool' },
    ];
  }, [selectedCountry]);

  useEffect(() => {
    if (parishOptions.length > 0 && !parishOptions.includes(selectedParish)) {
      setSelectedParish(parishOptions[0]);
    }
  }, [parishOptions, selectedParish]);

  useEffect(() => {
    if (providerOptions.length > 0 && !providerOptions.some((d) => d.id === selectedProviderDept)) {
      setSelectedProviderDept(providerOptions[0].id);
    }
  }, [providerOptions, selectedProviderDept]);

  useEffect(() => {
    if (contractOptions.length > 0 && !contractOptions.some((c) => c.id === selectedContractId)) {
      setSelectedContractId(contractOptions[0].id);
    }
  }, [contractOptions, selectedContractId]);

  useEffect(() => {
    if (scoutCorridorOptions.length > 0 && !scoutCorridorOptions.some((s) => s.id === selectedScoutCorridor)) {
      setSelectedScoutCorridor(scoutCorridorOptions[0].id);
    }
  }, [scoutCorridorOptions, selectedScoutCorridor]);

  const countryFeedPosts = useMemo(
    () => posts.filter((p) => p.country === selectedCountry),
    [posts, selectedCountry]
  );

  useEffect(() => {
    if (countryFeedPosts.length > 0 && !individualTargetPostId) {
      const first = countryFeedPosts[0];
      setIndividualTargetPostId(first.id);
      setIndividualRecipientName(first.anonymous ? 'Verified Citizen Author' : first.citizen_name);
    }
  }, [countryFeedPosts, individualTargetPostId]);

  // --- DETERMINISTIC TOP-3 RANKING ENGINE PER VAULT JURISDICTION ---
  const activeJurisdictionTop3: RankedJurisdictionCitizen[] = useMemo(() => {
    const phonePrefix = selectedCountry === 'KE' ? '+254 7' : selectedCountry === 'NG' ? '+234 80' : '+256 77';

    // Helper to aggregate citizen standing from a filtered subset of posts
    const buildTop3FromPosts = (
      matchingPosts: typeof posts,
      fallbackSeeds: Array<{ name: string; role: string; baseScore: number; reports: number; resolved: number; upvotes: number; reason: string }>
    ): RankedJurisdictionCitizen[] => {
      const map = new Map<
        string,
        {
          name: string;
          role: string;
          reports: number;
          resolved: number;
          upvotes: number;
          score: number;
          reason: string;
          postId?: string;
        }
      >();

      matchingPosts.forEach((p) => {
        const name = p.anonymous ? `Verified Resident (#${p.id.slice(-4).toUpperCase()})` : p.citizen_name || 'Citizen Watchdog';
        const existing = map.get(name) || {
          name,
          role: p.author_profession || p.citizen_rank || 'Verified Parish Citizen',
          reports: 0,
          resolved: 0,
          upvotes: 0,
          score: 0,
          reason: p.title,
          postId: p.id,
        };
        const isResolved = p.status === 'resolved' || p.citizen_satisfied === true || p.category === 'praise';
        const witnessBonus = (p.compiled_count || 1) * 8;
        existing.reports += 1;
        if (isResolved) existing.resolved += 1;
        existing.upvotes += p.upvotes || 0;
        existing.score += 30 + (isResolved ? 45 : 0) + (p.upvotes || 0) * 3 + witnessBonus;
        map.set(name, existing);

        // Also credit corroborating witnesses on this post
        (p.compiled_reports || []).forEach((wr) => {
          const wName = wr.anonymous ? `Witness (#${wr.id.slice(-4).toUpperCase()})` : wr.citizen_name;
          const wEx = map.get(wName) || {
            name: wName,
            role: wr.author_profession || 'Corroborating Witness',
            reports: 0,
            resolved: 0,
            upvotes: 0,
            score: 0,
            reason: `Corroborated: ${p.title}`,
            postId: p.id,
          };
          wEx.reports += 1;
          wEx.score += 25;
          map.set(wName, wEx);
        });
      });

      const sorted = Array.from(map.values()).sort((a, b) => b.score - a.score);
      for (const seed of fallbackSeeds) {
        if (sorted.length >= 3) break;
        if (!sorted.some((s) => s.name.toLowerCase() === seed.name.toLowerCase())) {
          sorted.push({
            name: seed.name,
            role: seed.role,
            reports: seed.reports,
            resolved: seed.resolved,
            upvotes: seed.upvotes,
            score: seed.baseScore,
            reason: seed.reason,
          });
        }
      }

      return sorted.slice(0, 3).map((item, idx) => ({
        rank: (idx + 1) as 1 | 2 | 3,
        name: item.name,
        contact: `${phonePrefix}${200 + idx * 137} ${410 + idx * 119}`,
        roleOrProfession: item.role,
        score: item.score,
        reportsCount: item.reports,
        resolvedOrVerifiedCount: item.resolved,
        upvotesCount: item.upvotes,
        citationReason: item.reason,
        samplePostId: item.postId,
      }));
    };

    if (activeVaultKind === 'parish_vault') {
      const parishPosts = countryFeedPosts.filter(
        (p) =>
          p.territory?.parish?.toLowerCase() === selectedParish.toLowerCase() ||
          p.location?.toLowerCase().includes(selectedParish.toLowerCase().replace(' parish', '').replace(' ward', ''))
      );
      return buildTop3FromPosts(parishPosts, [
        {
          name: selectedCountry === 'KE' ? 'Wanjiku Mwangi' : 'Sarah Namukasa',
          role: `Lead Parish Reputation Citizen · ${selectedParish}`,
          baseScore: 340,
          reports: 6,
          resolved: 4,
          upvotes: 48,
          reason: `Top Parish Reputation Standing in ${selectedParish} (6 verified local reports & 4 community fixes)`,
        },
        {
          name: selectedCountry === 'KE' ? 'Brian Otieno' : 'Ronald Kizza',
          role: `Parish Infrastructure Monitor · ${selectedParish}`,
          baseScore: 285,
          reports: 5,
          resolved: 3,
          upvotes: 36,
          reason: `2nd Highest Parish Standing in ${selectedParish} (drainage & water point audits)`,
        },
        {
          name: selectedCountry === 'KE' ? 'Faith Chepkoech' : 'Grace Akello',
          role: `Community Health & Sanitation Steward · ${selectedParish}`,
          baseScore: 240,
          reports: 4,
          resolved: 3,
          upvotes: 29,
          reason: `3rd Highest Parish Standing in ${selectedParish} (clinic & street lighting verifications)`,
        },
      ]);
    }

    if (activeVaultKind === 'provider_vault') {
      const providerObj = providerOptions.find((d) => d.id === selectedProviderDept);
      const pName = providerObj?.name || selectedProviderDept;
      const shopPosts = countryFeedPosts.filter((p) => p.dept === selectedProviderDept);
      return buildTop3FromPosts(shopPosts, [
        {
          name: selectedCountry === 'KE' ? 'Kevin Kamau' : 'ivan Mugisha',
          role: `Verified Customer & Quality Auditor · ${pName}`,
          baseScore: 310,
          reports: 5,
          resolved: 4,
          upvotes: 42,
          reason: `Highest strict interaction score with ${pName} (service feedback, quality audit & resolution ratification)`,
        },
        {
          name: selectedCountry === 'KE' ? 'Mercy Njoroge' : 'Brenda Nakato',
          role: `Frequent Patron & Service Reviewer · ${pName}`,
          baseScore: 265,
          reports: 4,
          resolved: 3,
          upvotes: 31,
          reason: `2nd highest business interaction rank on ${pName} wall (verified patron commendation & feedback)`,
        },
        {
          name: selectedCountry === 'KE' ? 'Daniel Mutua' : 'Denis Ocen',
          role: `Community Consumer Watchdog · ${pName}`,
          baseScore: 220,
          reports: 3,
          resolved: 2,
          upvotes: 24,
          reason: `3rd highest business interaction rank on ${pName} wall (constructive billing & queue turnaround audit)`,
        },
      ]);
    }

    if (activeVaultKind === 'contractor_vault') {
      const contractObj = contractOptions.find((c) => c.id === selectedContractId);
      const cTitle = contractObj?.title || 'Public Works Contract';
      const contractPosts = countryFeedPosts.filter(
        (p) =>
          p.project === selectedContractId ||
          (contractObj && p.title.toLowerCase().includes(contractObj.title.split(' ')[0].toLowerCase()))
      );
      return buildTop3FromPosts(contractPosts, [
        {
          name: selectedCountry === 'KE' ? 'Eng. Samuel Kariuki (Citizen Inspector)' : 'Moses Byaruhanga',
          role: `Lead Contract Watchdog · ${cTitle}`,
          baseScore: 390,
          reports: 7,
          resolved: 5,
          upvotes: 64,
          reason: `#1 Contract Watchdog on ${cTitle} (geotagged culvert & asphalt thickness verification dossier)`,
        },
        {
          name: selectedCountry === 'KE' ? 'Esther Wambui' : 'Juliet Babirye',
          role: `Corridor Resident Watchdog · ${cTitle}`,
          baseScore: 325,
          reports: 5,
          resolved: 4,
          upvotes: 49,
          reason: `#2 Contract Watchdog on ${cTitle} (milestone progress photo proof & drainage inspection)`,
        },
        {
          name: selectedCountry === 'KE' ? 'Peter Omondi' : 'Patrick Opio',
          role: `Site Safety & Materials Auditor · ${cTitle}`,
          baseScore: 275,
          reports: 4,
          resolved: 3,
          upvotes: 38,
          reason: `#3 Contract Watchdog on ${cTitle} (defects liability verification & community ratification)`,
        },
      ]);
    }

    if (activeVaultKind === 'scout_bounty_vault') {
      const corridorObj = scoutCorridorOptions.find((c) => c.id === selectedScoutCorridor);
      const cLabel = corridorObj?.label || 'Transit Road Safety Corridor';
      const profConfig =
        REPORTER_PROFESSION_CATEGORIES.find((p) => p.id === selectedScoutProfession) ||
        REPORTER_PROFESSION_CATEGORIES[0];

      const matchingCategoryPosts = countryFeedPosts.filter((p) => {
        const profession = (p.author_profession || '').toLowerCase();
        const tagMatch = profConfig.professionFilter.some((filterKey) => profession.includes(filterKey));
        if (tagMatch) return true;
        if (profConfig.id === 'boda') return p.category === 'pothole' || p.category === 'transport';
        if (profConfig.id === 'taxi') return p.category === 'transport' || p.category === 'safety';
        if (profConfig.id === 'market') return p.category === 'sanitation' || p.category === 'water' || p.category === 'power';
        if (profConfig.id === 'health') return p.category === 'health' || p.title.toLowerCase().includes('clinic') || p.title.toLowerCase().includes('drug');
        if (profConfig.id === 'teacher') return p.category === 'education' || p.title.toLowerCase().includes('school');
        if (profConfig.id === 'artisan') return p.category === 'infrastructure' || p.category === 'pothole' || Boolean(p.project);
        if (profConfig.id === 'civil') return p.category === 'corruption' || p.category === 'budget';
        return true;
      });

      let categorySeeds: Array<{
        name: string;
        role: string;
        baseScore: number;
        reports: number;
        resolved: number;
        upvotes: number;
        reason: string;
      }> = [];

      if (profConfig.id === 'boda') {
        categorySeeds = [
          {
            name: selectedCountry === 'KE' ? 'John Macharia (Stage Captain)' : 'Suleiman Wasswa (Bodaboda Scout)',
            role: `Bodaboda Frontline Road Scout · ${cLabel}`,
            baseScore: 415,
            reports: 9,
            resolved: 6,
            upvotes: 78,
            reason: `#1 Frontline Road Scout on ${cLabel} (9 geotagged pothole, open manhole & flood hazard alerts)`,
          },
          {
            name: selectedCountry === 'KE' ? 'Hassan Ali (Matatu Scout)' : 'Robert Ssempijja (Stage Chairman)',
            role: `Bodaboda Stage Safety Lead · ${cLabel}`,
            baseScore: 350,
            reports: 7,
            resolved: 5,
            upvotes: 55,
            reason: `#2 Frontline Road Scout on ${cLabel} (broken traffic signal & washed-out culvert warnings)`,
          },
          {
            name: selectedCountry === 'KE' ? 'Vincent Kiprop (Rider Watch)' : 'Emmanuel Okello (Highway Rider)',
            role: `Transit Corridor Hazard Reporter · ${cLabel}`,
            baseScore: 295,
            reports: 5,
            resolved: 4,
            upvotes: 41,
            reason: `#3 Frontline Road Scout on ${cLabel} (nighttime road obstruction & emergency ambulance clearance)`,
          },
        ];
      } else if (profConfig.id === 'taxi') {
        categorySeeds = [
          {
            name: selectedCountry === 'KE' ? 'Peter Mwangi (Matatu Sacco Rep)' : 'Patrick Kigozi (Taxi Park Lead)',
            role: `Transit & Highway Scout · ${cLabel}`,
            baseScore: 405,
            reports: 8,
            resolved: 6,
            upvotes: 72,
            reason: `#1 Highway Scout (reported dangerous highway shoulder washout & unregulated heavy truck parking)`,
          },
          {
            name: selectedCountry === 'KE' ? 'David Kamau (Route 44 Rep)' : 'Musa Mukasa (Kamunye Driver)',
            role: `Commercial Corridor Watchdog · ${cLabel}`,
            baseScore: 340,
            reports: 6,
            resolved: 5,
            upvotes: 51,
            reason: `#2 Highway Scout (logged illegal extortion toll checkpoint & missing highway cat-eyes)`,
          },
          {
            name: selectedCountry === 'KE' ? 'James Otieno (Express Driver)' : 'Charles Ochieng (Highway Transporter)',
            role: `Inter-State Route Scout · ${cLabel}`,
            baseScore: 290,
            reports: 5,
            resolved: 3,
            upvotes: 39,
            reason: `#3 Highway Scout (documented slippery oil spill & sharp curve visibility hazards)`,
          },
        ];
      } else if (profConfig.id === 'market') {
        categorySeeds = [
          {
            name: selectedCountry === 'KE' ? 'Mary Wanjiku (Market Rep)' : 'Mama Kevin Nalubega (Market Chair)',
            role: `Market Vendor & Sanitation Scout · ${cLabel}`,
            baseScore: 420,
            reports: 10,
            resolved: 7,
            upvotes: 84,
            reason: `#1 Market Scout (reported 48-hour uncollected garbage heap & overflowing drainage canal)`,
          },
          {
            name: selectedCountry === 'KE' ? 'Amina Hassan (Produce Trader)' : 'Sarah Babirye (Produce Stall #14)',
            role: `Market Sanitation & Utility Auditor · ${cLabel}`,
            baseScore: 360,
            reports: 8,
            resolved: 5,
            upvotes: 59,
            reason: `#2 Market Scout (logged broken public water standpipe & illegal market entry dues extortion)`,
          },
          {
            name: selectedCountry === 'KE' ? 'Beatrice Muthoni (Dry Goods Rep)' : 'Grace Akello (Stallholder Watch)',
            role: `Public Trading Space Watchdog · ${cLabel}`,
            baseScore: 305,
            reports: 6,
            resolved: 4,
            upvotes: 43,
            reason: `#3 Market Scout (alerted municipal health desk to broken abattoir cold storage & meat inspection delays)`,
          },
        ];
      } else if (profConfig.id === 'health') {
        categorySeeds = [
          {
            name: selectedCountry === 'KE' ? 'Nurse Faith Chebet (Health Centre IV)' : 'Harriet Namukasa (Senior Nursing Officer)',
            role: `Health Service Monitor · ${cLabel}`,
            baseScore: 435,
            reports: 9,
            resolved: 7,
            upvotes: 89,
            reason: `#1 Health Monitor (tracked essential antimalarial drug stockout & oxygen cylinder delivery delay)`,
          },
          {
            name: selectedCountry === 'KE' ? 'Dr. Evans Ombati (Clinical Officer)' : 'Dr. Brian Ochieng (Clinical Officer)',
            role: `Primary Care Facility Auditor · ${cLabel}`,
            baseScore: 375,
            reports: 7,
            resolved: 6,
            upvotes: 63,
            reason: `#2 Health Monitor (documented outpatient triage power outage & broken autoclave sterilizer)`,
          },
          {
            name: selectedCountry === 'KE' ? 'Sister Lucy Nduta (Maternity Lead)' : 'Sister Rose Nakato (Maternity Ward Quality Rep)',
            role: `Maternal Health Safety Scout · ${cLabel}`,
            baseScore: 315,
            reports: 5,
            resolved: 4,
            upvotes: 47,
            reason: `#3 Health Monitor (verified newborn incubator backup generator fuel supply & ambulance readiness)`,
          },
        ];
      } else if (profConfig.id === 'teacher') {
        categorySeeds = [
          {
            name: selectedCountry === 'KE' ? 'Master Joseph Mwangi (Head Teacher)' : 'Master Dennis Ssekandi (Primary School Lead)',
            role: `Education & Safe School Scout · ${cLabel}`,
            baseScore: 410,
            reports: 8,
            resolved: 6,
            upvotes: 76,
            reason: `#1 Education Scout (reported cracked classroom roof collapse hazard & non-functional school sanitation)`,
          },
          {
            name: selectedCountry === 'KE' ? 'Brian Kiprono (Youth Guild Rep)' : 'Brian Mugisha (University Youth Guild Leader)',
            role: `Youth Community Watchdog · ${cLabel}`,
            baseScore: 345,
            reports: 7,
            resolved: 5,
            upvotes: 54,
            reason: `#2 Education Scout (mobilized student safety patrol for missing zebra crossing paint & speeding minibuses)`,
          },
          {
            name: selectedCountry === 'KE' ? 'Grace Achieng (PTA Secretary)' : 'Patricia Nansubuga (PTA Infrastructure Watch)',
            role: `School Environment Auditor · ${cLabel}`,
            baseScore: 295,
            reports: 5,
            resolved: 4,
            upvotes: 40,
            reason: `#3 Education Scout (logged delayed capitation textbook delivery & flooded school perimeter fence)`,
          },
        ];
      } else if (profConfig.id === 'artisan') {
        categorySeeds = [
          {
            name: selectedCountry === 'KE' ? 'Mason Daniel Kinyua (Civil Artisan)' : 'Patrick Ouma (Lead Mason & Inspector)',
            role: `Infrastructure Quality Inspector · ${cLabel}`,
            baseScore: 425,
            reports: 9,
            resolved: 6,
            upvotes: 81,
            reason: `#1 Artisan Inspector (audited substandard unvibrated concrete on municipal bridge wing wall)`,
          },
          {
            name: selectedCountry === 'KE' ? 'Eng. Stephen Ouma (Road Technician)' : 'Eng. Joseph Byamukama (Civil Technician)',
            role: `Materials & Workmanship Auditor · ${cLabel}`,
            baseScore: 365,
            reports: 7,
            resolved: 5,
            upvotes: 58,
            reason: `#2 Artisan Inspector (measured shallow 30mm asphalt layer against 50mm specification on road contract)`,
          },
          {
            name: selectedCountry === 'KE' ? 'John Wambua (Site Plumber)' : 'Charles Lwanga (Site Plumber & Tech)',
            role: `Drainage & Civil Works Watch · ${cLabel}`,
            baseScore: 300,
            reports: 5,
            resolved: 4,
            upvotes: 42,
            reason: `#3 Artisan Inspector (documented unreinforced precast drainage culverts installed without gravel bedding)`,
          },
        ];
      } else if (profConfig.id === 'civil') {
        categorySeeds = [
          {
            name: selectedCountry === 'KE' ? 'Arthur Maina (Administrative Officer)' : 'Arthur Tumwine (Public Admin Officer)',
            role: `Internal Oversight & Whistleblower · ${cLabel}`,
            baseScore: 430,
            reports: 8,
            resolved: 7,
            upvotes: 85,
            reason: `#1 Oversight Officer (flagged delayed procurement sign-off & unserviced municipal garbage fleet)`,
          },
          {
            name: selectedCountry === 'KE' ? 'David Kipkemboi (Internal Auditor)' : 'David Kigozi (Internal Municipal Auditor)',
            role: `Public Integrity Auditor · ${cLabel}`,
            baseScore: 370,
            reports: 6,
            resolved: 5,
            upvotes: 60,
            reason: `#2 Oversight Officer (verified biometric clock-in uptime & public asset maintenance registers)`,
          },
          {
            name: selectedCountry === 'KE' ? 'Florence Njeri (Records Supervisor)' : 'Florence Namubiru (Public Records Oversight)',
            role: `Civil Service Compliance Scout · ${cLabel}`,
            baseScore: 310,
            reports: 5,
            resolved: 4,
            upvotes: 44,
            reason: `#3 Oversight Officer (logged public noticeboard tender publication delays and citizen charter compliance)`,
          },
        ];
      } else {
        categorySeeds = [
          {
            name: selectedCountry === 'KE' ? 'Joshua Mutiso (Resident Watch)' : 'Joshua Sserwadda (Parish Watchdog)',
            role: `Community Citizen Watch · ${cLabel}`,
            baseScore: 400,
            reports: 8,
            resolved: 6,
            upvotes: 70,
            reason: `#1 Community Citizen (logged dark streetlights on commuter footpaths and missing manhole covers)`,
          },
          {
            name: selectedCountry === 'KE' ? 'Aida Waweru (Commuter Rep)' : 'Aida Nakazibwe (Public Transit Commuter)',
            role: `Neighbourhood Safety Auditor · ${cLabel}`,
            baseScore: 335,
            reports: 6,
            resolved: 5,
            upvotes: 50,
            reason: `#2 Community Citizen (reported burst water main flooding community access lane)`,
          },
          {
            name: selectedCountry === 'KE' ? 'Peter Ochieng (Community Resident)' : 'Peter Wandera (Resident Safety Advocate)',
            role: `Civic Resident Scout · ${cLabel}`,
            baseScore: 285,
            reports: 4,
            resolved: 3,
            upvotes: 36,
            reason: `#3 Community Citizen (alerted community policing desk to illegal waste dumping in public park)`,
          },
        ];
      }

      return buildTop3FromPosts(matchingCategoryPosts, categorySeeds);
    }

    return [];
  }, [
    activeVaultKind,
    selectedCountry,
    selectedParish,
    selectedProviderDept,
    selectedContractId,
    selectedScoutCorridor,
    selectedScoutProfession,
    countryFeedPosts,
    providerOptions,
    contractOptions,
    scoutCorridorOptions,
  ]);

  const awardMonthLabel = useMemo(() => {
    if (selectedAwardMonth === '2026-09') return 'September 2026 Monthly Cycle';
    if (selectedAwardMonth === '2026-08') return 'August 2026 Monthly Cycle';
    return 'October 2026 Monthly Cycle';
  }, [selectedAwardMonth]);

  const currentVaultJurisdictionMeta = useMemo(() => {
    if (activeVaultKind === 'parish_vault') {
      const lowestTitle =
        selectedCountry === 'KE'
          ? 'Ward Administrator'
          : selectedCountry === 'NG'
          ? 'Supervisory Councillor / Ward Head'
          : 'Parish Chief (Lowest Accounting Officer)';
      return {
        vaultTitle: `Parish Vault · ${selectedParish}`,
        jurisdictionId: selectedParish,
        jurisdictionLabel: selectedParish,
        dispatcherTitle: `${lowestTitle} — ${selectedParish}`,
        AuthorizedRoleTag: 'parish_chief' as const,
        cadenceBadge: 'Monthly Top-3 Final Award',
        rankingRule:
          'Monthly Ranking & Awarding Cycle: Open to all sponsors throughout the month. At month-end, the final Top 3 citizens in this Parish by Reputation Standing are locked and awarded an even 1/3 split of the Parish pool, dispatched by the Parish Chief on behalf of Parish citizens.',
      };
    }
    if (activeVaultKind === 'provider_vault') {
      const prov = providerOptions.find((d) => d.id === selectedProviderDept);
      const label = prov?.name || selectedProviderDept;
      return {
        vaultTitle: `Private Provider Vault · ${label}`,
        jurisdictionId: selectedProviderDept,
        jurisdictionLabel: label,
        dispatcherTitle: `${label} — Shop / Business Community Service System`,
        AuthorizedRoleTag: 'provider_owner' as const,
        cadenceBadge: 'Monthly Top-3 Final Award',
        rankingRule:
          'Monthly Ranking & Awarding Cycle: Shop/Business owners deposit into their Vault throughout the month as a gesture of community service. At month-end, the system locks the final Top 3 citizens ranked strictly by verified interactions with this business and splits the monthly pool evenly (1/3 each).',
      };
    }
    if (activeVaultKind === 'contractor_vault') {
      const proj = contractOptions.find((c) => c.id === selectedContractId);
      const label = proj ? `${proj.title} (${proj.contractor})` : selectedContractId;
      return {
        vaultTitle: `Contractor Watchdog Vault · ${proj?.title || selectedContractId}`,
        jurisdictionId: selectedContractId,
        jurisdictionLabel: label,
        dispatcherTitle: `${proj?.contractor || 'Contracting Firm'} & Supervising Engineer Escrow`,
        AuthorizedRoleTag: 'contractor_or_authority' as const,
        cadenceBadge: 'Monthly Top-3 Final Award',
        rankingRule:
          'Monthly Ranking & Awarding Cycle: Contractors and works agencies deposit vouchers during the month. At month-end, final rankings lock and rewards split evenly across the Top 3 Contract Watchdogs based strictly on geotagged site inspections and milestone verifications.',
      };
    }
    if (activeVaultKind === 'scout_bounty_vault') {
      const profConfig =
        REPORTER_PROFESSION_CATEGORIES.find((p) => p.id === selectedScoutProfession) ||
        REPORTER_PROFESSION_CATEGORIES[0];
      const corr = scoutCorridorOptions.find((c) => c.id === selectedScoutCorridor);
      const label = corr?.label || selectedScoutCorridor;
      return {
        vaultTitle: `Frontline Scout & ${profConfig.shortTitle} Vault · ${label}`,
        jurisdictionId: `${selectedScoutCorridor}_${profConfig.id}`,
        jurisdictionLabel: `${profConfig.shortTitle} (${profConfig.fieldScoutTag.split('·')[0].trim()}) · ${label}`,
        dispatcherTitle: `${profConfig.shortTitle} Association & ${corr?.authority || 'Corridor Safety Escrow'}`,
        AuthorizedRoleTag: 'scout_corridor_coordinator' as const,
        cadenceBadge: 'Monthly Top-3 Final Award',
        rankingRule:
          `Monthly Ranking & Awarding Cycle: Community sponsors and agencies fund the ${profConfig.shortTitle} escrow throughout the month. At month-end, final rankings lock and rewards split evenly across the Top 3 ${profConfig.name} reporters in this zone based strictly on verified alerts.`,
      };
    }
    return {
      vaultTitle: `Individual Citizen Vault · ${user?.name || 'Personal Peer Tipping Vault'}`,
      jurisdictionId: user?.id || 'usr-citizen',
      jurisdictionLabel: `${user?.name || 'Citizen'} Personal Vault`,
      dispatcherTitle: `${user?.name || 'Verified Citizen'} (100% Personal Discretion · Instant Dispatch)`,
      AuthorizedRoleTag: 'citizen_peer' as const,
      cadenceBadge: 'Instant On-Demand Peer Tipping',
      rankingRule:
        'Instant Discretionary Peer Vault (Exempt from Monthly Wait): Deposit utility vouchers into your personal vault and immediately reward any citizen of your choice (e.g., an author for a great post or helpful evidence) either right here or via the "Reward" button on any feed post.',
    };
  }, [
    activeVaultKind,
    selectedCountry,
    selectedParish,
    selectedProviderDept,
    selectedContractId,
    selectedScoutCorridor,
    selectedScoutProfession,
    providerOptions,
    contractOptions,
    scoutCorridorOptions,
    user?.id,
    user?.name,
  ]);

  // Execute One-Click Locked Top-3 Institutional Batch Dispatch (or Individual Discretionary Dispatch)
  const handleExecuteVaultDispatch = async () => {
    const unassignedInCountry = vouchers.filter(
      (v) => v.country.toUpperCase() === selectedCountry.toUpperCase() && v.status === 'escrow_unassigned'
    );
    const matchingVaultUnassigned = unassignedInCountry.filter(
      (v) => !v.vaultType || v.vaultType === activeVaultKind
    );
    const poolToUse = matchingVaultUnassigned.length >= 3 ? matchingVaultUnassigned : unassignedInCountry;

    setIsBatchDispatching(true);
    try {
      const isKe = selectedCountry === 'KE';
      const defaultCurrency = isKe ? 'KES' : selectedCountry === 'NG' ? 'NGN' : 'UGX';
      const defaultBrand = isKe ? 'Safaricom' : selectedCountry === 'NG' ? 'MTN Nigeria' : 'MTN Uganda';
      const defaultFaceValue = isKe ? 360 : selectedCountry === 'NG' ? 3500 : 10000;
      const nowIso = new Date().toISOString();

      if (activeVaultKind === 'individual_vault') {
        if (!individualRecipientName.trim()) {
          toast('Please select a post author or enter a citizen recipient name', 'amber');
          setIsBatchDispatching(false);
          return;
        }
        const sourceVoucher = poolToUse[0];
        const code =
          sourceVoucher?.voucherCode ||
          `PEER-${Math.floor(1000 + Math.random() * 9000)}-${selectedCountry}`;
        const pin = sourceVoucher?.pin || `${Math.floor(100000 + Math.random() * 900000)}`;
        const updatedVoucher: EscrowPerkVoucher = sourceVoucher
          ? {
              ...sourceVoucher,
              vaultType: 'individual_vault',
              jurisdictionId: currentVaultJurisdictionMeta.jurisdictionId,
              jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
              authorizedDispatcherRole: 'citizen_peer',
              status: 'dispatched',
              dispatchedTo: {
                recipientName: individualRecipientName.trim(),
                recipientContact: individualRecipientPhone.trim() || '+256 770 000 000',
                dispatchedAt: nowIso,
                dispatchedBy: currentVaultJurisdictionMeta.dispatcherTitle,
                citationNote: individualCitationNote.trim(),
                postOrProjectId: individualTargetPostId || 'PEER-POST-REWARD',
                smsDeliveryStatus: 'delivered',
                ethicalNonInterferenceAck: true,
                vaultType: 'individual_vault',
                jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
              },
            }
          : {
              id: `vch-peer-${Date.now()}`,
              voucherCode: code,
              pin,
              category: 'telco_data',
              brand: defaultBrand,
              title: `${defaultBrand} Peer Appreciation Voucher`,
              faceValue: defaultFaceValue,
              currency: defaultCurrency,
              country: selectedCountry,
              sponsoredBy: `${user?.name || 'Citizen'} (Individual Vault)`,
              sponsorType: 'citizen_patron',
              vaultType: 'individual_vault',
              jurisdictionId: currentVaultJurisdictionMeta.jurisdictionId,
              jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
              authorizedDispatcherRole: 'citizen_peer',
              batchId: `BATCH-PEER-${Date.now().toString(36).toUpperCase()}`,
              status: 'dispatched',
              createdAt: nowIso,
              expiryDate: '2026-12-31',
              redemptionUssdString: `*303*${code}#`,
              dispatchedTo: {
                recipientName: individualRecipientName.trim(),
                recipientContact: individualRecipientPhone.trim() || '+256 770 000 000',
                dispatchedAt: nowIso,
                dispatchedBy: currentVaultJurisdictionMeta.dispatcherTitle,
                citationNote: individualCitationNote.trim(),
                postOrProjectId: individualTargetPostId || 'PEER-POST-REWARD',
                smsDeliveryStatus: 'delivered',
                ethicalNonInterferenceAck: true,
                vaultType: 'individual_vault',
                jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
              },
            };

        savePerkVoucherToCloud(updatedVoucher).catch(() => {});
        setVouchers((prev) =>
          sourceVoucher
            ? prev.map((v) => (v.id === sourceVoucher.id ? updatedVoucher : v))
            : [updatedVoucher, ...prev]
        );
        logAudit(
          'INDIVIDUAL_VAULT_PEER_DISPATCH',
          individualTargetPostId || updatedVoucher.id,
          `${currentVaultJurisdictionMeta.dispatcherTitle} rewarded ${individualRecipientName} with ${updatedVoucher.brand} voucher (${updatedVoucher.voucherCode}) from Individual Vault.`
        );
        setLastBatchDispatchReceipt({
          vaultKind: 'individual_vault',
          awardMonthLabel: 'Instant Peer-to-Peer Dispatch',
          jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
          dispatcherLabel: currentVaultJurisdictionMeta.dispatcherTitle,
          dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recipients: [
            {
              rank: 1,
              name: individualRecipientName,
              contact: individualRecipientPhone,
              voucherCode: updatedVoucher.voucherCode,
              brand: updatedVoucher.brand,
              faceValue: updatedVoucher.faceValue,
              currency: updatedVoucher.currency,
              score: 100,
            },
          ],
        });
        toast(`Dispatched ${updatedVoucher.brand} voucher from your Individual Vault to ${individualRecipientName}!`, 'emerald');
        setIsBatchDispatching(false);
        return;
      }

      // Institutional Vaults (Parish, Private Provider, Contractor, Frontline Scout): Monthly Locked Top-3 Even Split
      const top3 = activeJurisdictionTop3;
      const updatedOrMinted: EscrowPerkVoucher[] = [];
      const receiptRows: Array<{
        rank: number;
        name: string;
        contact: string;
        voucherCode: string;
        brand: string;
        faceValue: number;
        currency: string;
        score: number;
      }> = [];

      top3.forEach((citizen, idx) => {
        const existingVoucher = poolToUse[idx];
        const slot = (idx + 1) as 1 | 2 | 3;
        const fallbackCode = `TOP${slot}-${Math.floor(1000 + Math.random() * 9000)}-${selectedCountry}`;

        // When Provider Vault is active: perks are strictly limited to products/services from this respective private provider!
        let provProduct: any = null;
        if (activeVaultKind === 'provider_vault') {
          const matchingProds = merchantProducts.filter(
            (p) =>
              p.country.toUpperCase() === selectedCountry.toUpperCase() &&
              (p.merchantId === selectedProviderDept ||
                selectedProviderDept.includes(p.merchantId) ||
                p.merchantName.toLowerCase().includes(selectedProviderDept.toLowerCase().replace(/shop_|dept_/g, '')))
          );
          const fallbackProds = merchantProducts.filter((p) => p.country.toUpperCase() === selectedCountry.toUpperCase());
          const candidateList = matchingProds.length > 0 ? matchingProds : fallbackProds;
          if (candidateList.length > 0) {
            provProduct = candidateList[idx % candidateList.length];
          }
        }

        const profConfig =
          REPORTER_PROFESSION_CATEGORIES.find((p) => p.id === selectedScoutProfession) ||
          REPORTER_PROFESSION_CATEGORIES[0];

        const effectiveBrand = provProduct
          ? provProduct.merchantName
          : activeVaultKind === 'scout_bounty_vault'
          ? profConfig.defaultBrand
          : defaultBrand;

        const effectiveTitle = provProduct
          ? `${provProduct.merchantName} - ${provProduct.rewardHeadline} (Rank #${slot} Perk)`
          : activeVaultKind === 'scout_bounty_vault'
          ? `${profConfig.shortTitle} Award · ${profConfig.bountyType} (Rank #${slot})`
          : `${defaultBrand} Top-3 Jurisdiction Split (Rank #${slot})`;

        const effectiveFaceValue = provProduct ? provProduct.voucherCost : defaultFaceValue;
        const provFee = provProduct ? Math.round(effectiveFaceValue * 0.02) : undefined;
        const provPayout = provProduct ? effectiveFaceValue - (provFee || 0) : undefined;

        const vObj: EscrowPerkVoucher = existingVoucher
          ? {
              ...existingVoucher,
              vaultType: activeVaultKind,
              jurisdictionId: currentVaultJurisdictionMeta.jurisdictionId,
              jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
              rankedSlot: slot,
              rankingScoreAtDispatch: citizen.score,
              authorizedDispatcherRole: currentVaultJurisdictionMeta.AuthorizedRoleTag,
              status: 'dispatched',
              ...(provProduct && {
                rewardType: provProduct.rewardType,
                rewardHeadline: provProduct.rewardHeadline,
                rewardDescription: provProduct.rewardDescription,
                merchantId: provProduct.merchantId,
                merchantName: provProduct.merchantName,
                merchantLocation: { parish: provProduct.parish, district: provProduct.district, address: provProduct.address },
                platformCommissionPercent: 2,
                commissionAmount: provFee,
                merchantPayoutAmount: provPayout,
                packagedItems: provProduct.packagedItems,
              }),
              dispatchedTo: {
                recipientName: citizen.name,
                recipientContact: citizen.contact,
                dispatchedAt: nowIso,
                dispatchedBy: currentVaultJurisdictionMeta.dispatcherTitle,
                citationNote: `[Locked Rank #${slot} · ${citizen.score} pts] ${citizen.citationReason}${provProduct ? ` · Perk: ${provProduct.rewardHeadline}` : ''}`,
                postOrProjectId: citizen.samplePostId || currentVaultJurisdictionMeta.jurisdictionId,
                smsDeliveryStatus: 'delivered',
                ethicalNonInterferenceAck: true,
                vaultType: activeVaultKind,
                jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
                rankedSlot: slot,
                rankingScore: citizen.score,
              },
            }
          : {
              id: `vch-${activeVaultKind}-${Date.now()}-${slot}`,
              voucherCode: fallbackCode,
              pin: `${Math.floor(100000 + Math.random() * 900000)}`,
              category: provProduct ? (provProduct.category as any) : activeVaultKind === 'scout_bounty_vault' ? 'transit_credit' : 'telco_data',
              brand: effectiveBrand,
              title: effectiveTitle,
              faceValue: effectiveFaceValue,
              currency: defaultCurrency,
              country: selectedCountry,
              sponsoredBy: currentVaultJurisdictionMeta.jurisdictionLabel,
              sponsorType:
                activeVaultKind === 'contractor_vault'
                  ? 'contractor'
                  : activeVaultKind === 'parish_vault'
                  ? 'authority'
                  : 'corporate_csr',
              vaultType: activeVaultKind,
              jurisdictionId: currentVaultJurisdictionMeta.jurisdictionId,
              jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
              rankedSlot: slot,
              rankingScoreAtDispatch: citizen.score,
              authorizedDispatcherRole: currentVaultJurisdictionMeta.AuthorizedRoleTag,
              batchId: `SPLIT3-${Date.now().toString(36).toUpperCase()}`,
              status: 'dispatched',
              createdAt: nowIso,
              expiryDate: '2026-12-31',
              redemptionUssdString: `*303*${fallbackCode}#`,
              ...(provProduct && {
                rewardType: provProduct.rewardType,
                rewardHeadline: provProduct.rewardHeadline,
                rewardDescription: provProduct.rewardDescription,
                merchantId: provProduct.merchantId,
                merchantName: provProduct.merchantName,
                merchantLocation: { parish: provProduct.parish, district: provProduct.district, address: provProduct.address },
                platformCommissionPercent: 2,
                commissionAmount: provFee,
                merchantPayoutAmount: provPayout,
                packagedItems: provProduct.packagedItems,
              }),
              dispatchedTo: {
                recipientName: citizen.name,
                recipientContact: citizen.contact,
                dispatchedAt: nowIso,
                dispatchedBy: currentVaultJurisdictionMeta.dispatcherTitle,
                citationNote: `[Locked Rank #${slot} · ${citizen.score} pts] ${citizen.citationReason}${provProduct ? ` · Perk: ${provProduct.rewardHeadline}` : ''}`,
                postOrProjectId: citizen.samplePostId || currentVaultJurisdictionMeta.jurisdictionId,
                smsDeliveryStatus: 'delivered',
                ethicalNonInterferenceAck: true,
                vaultType: activeVaultKind,
                jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
                rankedSlot: slot,
                rankingScore: citizen.score,
              },
            };

        updatedOrMinted.push(vObj);
        receiptRows.push({
          rank: slot,
          name: citizen.name,
          contact: citizen.contact,
          voucherCode: vObj.voucherCode,
          brand: vObj.brand,
          faceValue: vObj.faceValue,
          currency: vObj.currency,
          score: citizen.score,
        });
      });

      savePerkVoucherBatchToCloud(updatedOrMinted).catch(() => {});

      const updatedIds = new Set(updatedOrMinted.map((u) => u.id));
      setVouchers((prev) => {
        const replaced = prev.map((v) => {
          const match = updatedOrMinted.find((u) => u.id === v.id);
          return match || v;
        });
        const brandNew = updatedOrMinted.filter((u) => !prev.some((p) => p.id === u.id));
        return [...brandNew, ...replaced];
      });

      logAudit(
        'VAULT_MONTHLY_TOP3_BATCH_DISPATCH',
        currentVaultJurisdictionMeta.jurisdictionId,
        `${currentVaultJurisdictionMeta.dispatcherTitle} executed Monthly Top-3 Final Award (${awardMonthLabel}) from [${currentVaultJurisdictionMeta.vaultTitle}] to #1 ${top3[0]?.name}, #2 ${top3[1]?.name}, #3 ${top3[2]?.name}`
      );

      setLastBatchDispatchReceipt({
        vaultKind: activeVaultKind,
        awardMonthLabel,
        jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
        dispatcherLabel: currentVaultJurisdictionMeta.dispatcherTitle,
        dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recipients: receiptRows,
      });

      toast(
        `Monthly Top-3 Award Dispatched (${awardMonthLabel}: ${receiptRows.map((r) => `#${r.rank} ${r.name}`).join(', ')})!`,
        'emerald'
      );
    } finally {
      setIsBatchDispatching(false);
    }
  };

  // Load vouchers from server and Cloud Firestore
  const loadVaultData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/perks/vault?country=${selectedCountry}`);
      const data = await res.json();
      if (data.success && data.vouchers) {
        setVouchers(data.vouchers);
      }
    } catch {
      // Fallback to local
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVaultData();
  }, [selectedCountry]);

  // Statistics calculation
  const stats = useMemo(() => {
    const countryVouchers = vouchers.filter((v) => v.country.toUpperCase() === selectedCountry.toUpperCase());
    const unassigned = countryVouchers.filter((v) => v.status === 'escrow_unassigned');
    const dispatched = countryVouchers.filter((v) => v.status === 'dispatched');
    const totalEscrowFaceValue = unassigned.reduce((acc, v) => acc + (Number(v.faceValue) || 0), 0);
    const uniqueSponsors = new Set(countryVouchers.map((v) => v.sponsoredBy)).size;

    return {
      total: countryVouchers.length,
      unassignedCount: unassigned.length,
      dispatchedCount: dispatched.length,
      totalEscrowFaceValue,
      uniqueSponsors,
      currency: countryVouchers[0]?.currency || (selectedCountry === 'KE' ? 'KES' : 'UGX'),
    };
  }, [vouchers, selectedCountry]);

  // Filtered list
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      if (v.country.toUpperCase() !== selectedCountry.toUpperCase()) return false;
      if (filterStatus !== 'all' && v.status !== filterStatus) return false;
      if (filterDemoMode === 'live' && v.isDemo) return false;
      if (filterDemoMode === 'demo' && !v.isDemo) return false;
      if (filterVaultKind !== 'all' && v.vaultType && v.vaultType !== filterVaultKind) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = v.voucherCode.toLowerCase().includes(q);
        const matchesBrand = v.brand.toLowerCase().includes(q) || (v.title || '').toLowerCase().includes(q);
        const matchesSponsor = v.sponsoredBy.toLowerCase().includes(q);
        const matchesJurisdiction = (v.jurisdictionLabel || '').toLowerCase().includes(q);
        const matchesItems = (v.packagedItems || []).some((pi) => pi.toLowerCase().includes(q));
        const matchesRecipient = v.dispatchedTo?.recipientName.toLowerCase().includes(q) || v.dispatchedTo?.recipientContact.includes(q);
        if (!matchesCode && !matchesBrand && !matchesSponsor && !matchesJurisdiction && !matchesItems && !matchesRecipient) return false;
      }
      return true;
    });
  }, [vouchers, selectedCountry, filterStatus, filterDemoMode, filterVaultKind, searchQuery]);

  // CSR Sponsor Leaderboard aggregation
  const sponsorLeaderboard = useMemo(() => {
    const countryVouchers = vouchers.filter((v) => v.country.toUpperCase() === selectedCountry.toUpperCase());
    const map = new Map<
      string,
      {
        sponsorName: string;
        sponsorType: string;
        totalVouchers: number;
        dispatchedCount: number;
        totalFaceValue: number;
        currency: string;
        projects: Set<string>;
        categories: Set<string>;
      }
    >();

    countryVouchers.forEach((v) => {
      const key = v.sponsoredBy || 'Community CSR Sponsor';
      const existing = map.get(key) || {
        sponsorName: key,
        sponsorType: v.sponsorType || 'corporate_csr',
        totalVouchers: 0,
        dispatchedCount: 0,
        totalFaceValue: 0,
        currency: v.currency || stats.currency,
        projects: new Set<string>(),
        categories: new Set<string>(),
      };
      existing.totalVouchers += 1;
      if (v.status === 'dispatched' || v.status === 'redeemed') {
        existing.dispatchedCount += 1;
      }
      existing.totalFaceValue += Number(v.faceValue) || 0;
      if (v.projectName) existing.projects.add(v.projectName);
      existing.categories.add(v.category);
      map.set(key, existing);
    });

    return Array.from(map.values())
      .map((item, idx) => ({
        ...item,
        projects: Array.from(item.projects),
        categories: Array.from(item.categories),
        certHash: `CSR-SHA256-${selectedCountry}-${(idx + 101).toString(16).toUpperCase()}-${item.sponsorName.replace(/[^A-Z0-9]/gi, '').slice(0, 8).toUpperCase()}`,
      }))
      .sort((a, b) => b.totalFaceValue - a.totalFaceValue);
  }, [vouchers, selectedCountry, stats.currency]);

  // Citizen Self-Redemption XP Helper
  const currentCitizenProfile = profiles[user?.id || 'usr-9028-UG'] || {
    civic_score: 50,
    rank: 'Observer',
    posts: 2,
    resolved: 1,
  };
  const citizenXp = currentCitizenProfile.civic_score || 0;

  const getXpCostForCategory = (cat: string) => {
    if (cat === 'transit_credit') return 100;
    if (cat === 'telco_data') return 150;
    if (cat === 'supermarket') return 175;
    return 200; // electricity / water_utility
  };

  const cooldownInfo = useMemo(() => {
    if (!lastXpRedeemIso) return { onCooldown: false, daysLeft: 0 };
    const elapsedMs = Date.now() - new Date(lastXpRedeemIso).getTime();
    const sevenDaysMs = 7 * 86400000;
    if (elapsedMs < sevenDaysMs) {
      const daysLeft = Math.ceil((sevenDaysMs - elapsedMs) / 86400000);
      return { onCooldown: true, daysLeft };
    }
    return { onCooldown: false, daysLeft: 0 };
  }, [lastXpRedeemIso]);

  const handleCitizenSelfRedeem = async (voucher: EscrowPerkVoucher) => {
    const xpCost = getXpCostForCategory(voucher.category);
    if (cooldownInfo.onCooldown) {
      toast(`Anti-Farming Guardrail: Max 1 self-redemption every 7 days (${cooldownInfo.daysLeft}d remaining).`, 'amber');
      return;
    }
    if (citizenXp < xpCost) {
      toast(`Insufficient CivicScore XP. You need ${xpCost} XP (current: ${citizenXp} XP).`, 'amber');
      return;
    }

    try {
      const res = await fetch('/api/perks/dispatch-from-vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucherId: voucher.id,
          brand: voucher.brand,
          category: voucher.category,
          recipientName: user?.name || 'Verified Citizen Watchdog',
          recipientContact: user?.phone || '+256 770 000 000',
          dispatchedBy: 'Citizen Self-Redemption Store (CivicScore XP)',
          ticketId: `XP-REDEEM-${xpCost}PTS`,
          selfRedeem: true,
          xpSpent: xpCost,
          note: `Citizen redeemed ${xpCost} CivicScore XP for ${voucher.reimbursementFraming || 'Field Cost Reimbursement'}`,
        }),
      });
      const data = await res.json();
      if (data.success && data.voucher) {
        const uid = user?.id || 'usr-9028-UG';
        addPoints(uid, -xpCost, `−${xpCost} Civic XP · Redeemed ${voucher.brand} Field Cost Voucher`);
        const nowIso = new Date().toISOString();
        setLastXpRedeemIso(nowIso);
        try {
          localStorage.setItem(`cd_last_xp_redeem_${uid}`, nowIso);
        } catch {
          // ignore
        }
        setVouchers((prev) => prev.map((v) => (v.id === data.voucher.id ? data.voucher : v)));
        setRedeemedVoucherCard(data.voucher);
        logAudit(
          'CITIZEN_XP_PERK_REDEEM',
          data.voucher.id,
          `${user?.name || 'Citizen'} redeemed ${xpCost} Civic XP for ${data.voucher.title} (${data.voucher.voucherCode})`
        );
        toast(`Redeemed ${data.voucher.title}! PIN & USSD code unlocked below.`, 'emerald');
      } else {
        toast(data.error || 'Could not redeem voucher', 'rose');
      }
    } catch {
      toast('Network error while redeeming voucher', 'rose');
    }
  };

  // Download Sample CSV
  const handleDownloadSampleCsv = () => {
    const sampleCsv = `voucher_code,brand,category,face_value,currency,pin,expiry_date
MTN-2GB-9001-TEST,MTN Uganda,telco_data,10000,UGX,9001,2026-12-31
MTN-2GB-9002-TEST,MTN Uganda,telco_data,10000,UGX,9002,2026-12-31
NWSC-10K-9003-TEST,NWSC Uganda,water_utility,10000,UGX,9003,2026-12-31
YAKA-15K-9004-TEST,Umeme Power,electricity,15000,UGX,9004,2026-12-31
SB-5K-9005-TEST,SafeBoda,transit_credit,5000,UGX,9005,2026-12-31`;

    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CivicDuty_Perk_Vouchers_Sample_${selectedCountry}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Sample CSV template downloaded.', 'emerald');
  };

  // Parse CSV File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        toast('CSV file must have a header row and at least 1 data row.', 'amber');
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const parsedRows: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim());
        if (cols.length >= 3) {
          const rowObj: any = {};
          headers.forEach((h, idx) => {
            rowObj[h] = cols[idx] || '';
          });
          parsedRows.push({
            voucherCode: rowObj.voucher_code || rowObj.code || cols[0],
            brand: rowObj.brand || cols[1] || 'Utility',
            category: rowObj.category || cols[2] || 'telco_data',
            faceValue: Number(rowObj.face_value || cols[3] || 10000),
            currency: rowObj.currency || cols[4] || (selectedCountry === 'KE' ? 'KES' : 'UGX'),
            pin: rowObj.pin || cols[5] || '',
            expiryDate: rowObj.expiry_date || cols[6] || '2026-12-31',
          });
        }
      }

      setCsvPreviewRows(parsedRows);
      toast(`Parsed ${parsedRows.length} vouchers from CSV ready for escrow deposit.`, 'emerald');
    };
    reader.readAsText(file);
  };

  // Commit CSV Batch Upload
  const handleCommitCsvUpload = async () => {
    if (csvPreviewRows.length === 0) {
      toast('Please select a valid CSV file first.', 'amber');
      return;
    }

    setIsUploading(true);
    try {
      const res = await fetch('/api/perks/upload-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchName: csvFile?.name.replace('.csv', '') || 'Bulk CSV Upload',
          sponsorName: csvSponsor,
          sponsorType: csvSponsorType,
          projectName: csvProjectName,
          country: selectedCountry,
          vouchers: csvPreviewRows,
          isDemo: !uploadAsLive,
          sourceMethod: 'csv',
        }),
      });

      const data = await res.json();
      if (data.success && data.vouchers) {
        const taggedVouchers = data.vouchers.map((v: EscrowPerkVoucher) => ({
          ...v,
          vaultType: activeVaultKind,
          jurisdictionId: currentVaultJurisdictionMeta.jurisdictionId,
          jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
        }));
        // Sync to Cloud Firestore
        savePerkVoucherBatchToCloud(taggedVouchers).catch(() => {});

        setVouchers((prev) => [...taggedVouchers, ...prev]);
        setCsvFile(null);
        setCsvPreviewRows([]);
        toast(`Successfully deposited ${data.uploadedCount} pre-funded vouchers into ${currentVaultJurisdictionMeta.vaultTitle}!`, 'emerald');
      } else {
        toast(data.error || 'Failed to deposit batch', 'rose');
      }
    } catch {
      toast('Error uploading voucher batch', 'rose');
    } finally {
      setIsUploading(false);
    }
  };

  // Manual Deposit Submit
  const handleManualDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      toast('Please enter a voucher code', 'amber');
      return;
    }

    setIsUploading(true);
    try {
      const singleRow = {
        voucherCode: manualCode.trim(),
        pin: manualPin.trim() || undefined,
        brand: manualBrand,
        category: manualCategory,
        faceValue: Number(manualFaceValue) || 10000,
        currency: manualCurrency,
        expiryDate: manualExpiry,
      };

      const res = await fetch('/api/perks/upload-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchName: `Single Deposit - ${manualBrand}`,
          sponsorName: manualSponsor,
          sponsorType: manualSponsorType,
          country: selectedCountry,
          vouchers: [singleRow],
          isDemo: !uploadAsLive,
          sourceMethod: 'manual',
        }),
      });

      const data = await res.json();
      if (data.success && data.vouchers) {
        const taggedVouchers = data.vouchers.map((v: EscrowPerkVoucher) => ({
          ...v,
          vaultType: activeVaultKind,
          jurisdictionId: currentVaultJurisdictionMeta.jurisdictionId,
          jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
        }));
        savePerkVoucherBatchToCloud(taggedVouchers).catch(() => {});
        setVouchers((prev) => [...taggedVouchers, ...prev]);
        setManualCode('');
        setManualPin('');
        toast(`Pre-funded voucher deposited into ${currentVaultJurisdictionMeta.vaultTitle}!`, 'emerald');
      }
    } catch {
      toast('Failed to deposit voucher', 'rose');
    } finally {
      setIsUploading(false);
    }
  };

  // Quick Seed Pack (Country-Adaptive + Includes Boda Bounty Pool & 1,000 KSh Supermarket Basket)
  const handleSeedPack = async (packType: 'mtn' | 'nwsc' | 'yaka' | 'boda' | 'supermarket') => {
    const isKe = selectedCountry === 'KE';
    const isNg = selectedCountry === 'NG';
    const currency = isKe ? 'KES' : isNg ? 'NGN' : 'UGX';

    let seedRows: any[] = [];
    let sponsorName = 'Seyani Brothers Construction Ltd (CSR Allocation)';
    let batchTitle = 'Corporate CSR Allocation';

    if (packType === 'supermarket') {
      sponsorName = isKe ? 'Naivas & Carrefour Supermarket Community Desk' : 'Quality Supermarket & Carrefour Patron Pool';
      batchTitle = 'Supermarket 1,000 KSh (30,000 UGX) Packaged Household Shopping Vouchers';
      for (let i = 1; i <= 5; i++) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        seedRows.push({
          voucherCode: `SHOP-1000KSH-${rand}-${selectedCountry}`,
          pin: `${rand}`,
          brand: isKe ? 'Naivas / Carrefour Supermarket' : 'Quality Supermarket / Carrefour',
          category: 'supermarket',
          title: isKe
            ? '1,000 KSh Supermarket Shopping Basket Voucher'
            : '1,000 KSh Equiv. (30,000 UGX) Supermarket Shopping Voucher',
          faceValue: isKe ? 1000 : isNg ? 12000 : 30000,
          currency,
          packagedItems: [
            '2kg Maize Flour (Unga / Posho)',
            '1L Fresh Cooking Oil',
            '1kg Sugar & Tea Leaves',
            '2kg Rice & Bar of Laundry Soap',
            'Milk, Bread & Supermarket Items up to 1,000 KSh',
          ],
          expiryDate: '2026-12-31',
        });
      }
    } else if (packType === 'mtn') {
      sponsorName = 'Seyani Brothers Construction Ltd (CSR Allocation)';
      batchTitle = `Seyani Bros CSR - ${isKe ? 'Safaricom' : 'MTN'} 2GB Data Seed`;
      for (let i = 1; i <= 5; i++) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        seedRows.push({
          voucherCode: `${isKe ? 'SAF' : 'MTN'}-2GB-${rand}-CIVIC`,
          pin: `${rand}`,
          brand: isKe ? 'Safaricom' : isNg ? 'MTN Nigeria' : 'MTN Uganda',
          category: 'telco_data',
          faceValue: isKe ? 360 : isNg ? 3500 : 10000,
          currency,
          packagedItems: ['2GB 4G/5G Data Bundle', '30 On-Net Voice Mins', 'Zero-Rated Evidence Upload'],
          expiryDate: '2026-12-31',
        });
      }
    } else if (packType === 'nwsc') {
      sponsorName = isKe ? 'Nairobi City County Infrastructure Desk' : 'KCCA Urban Infrastructure Division';
      batchTitle = 'Municipal Water Leakage Audit Incentives';
      for (let i = 1; i <= 3; i++) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        seedRows.push({
          voucherCode: `WATER-10K-${rand}-${selectedCountry}`,
          pin: `${rand}`,
          brand: isKe ? 'Nairobi Water (NCWSC)' : 'NWSC Uganda',
          category: 'water_utility',
          faceValue: isKe ? 300 : isNg ? 3000 : 10000,
          currency,
          packagedItems: ['6,500 Litres Prepaid Domestic Water', 'Public Standpipe / Smart Meter Token'],
          expiryDate: '2026-12-31',
        });
      }
    } else if (packType === 'yaka') {
      sponsorName = 'Ministry of Energy & Mineral Development';
      batchTitle = 'MEMD Rural Electrification CSR';
      for (let i = 1; i <= 3; i++) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        seedRows.push({
          voucherCode: `POWER-15K-${rand}-${selectedCountry}`,
          pin: `${rand}`,
          brand: isKe ? 'Kenya Power (KPLC)' : 'Umeme Power',
          category: 'electricity',
          faceValue: isKe ? 500 : isNg ? 5000 : 15000,
          currency,
          packagedItems: ['45 kWh Domestic Power Units', '20-Digit STS Meter Token'],
          expiryDate: '2026-12-31',
        });
      }
    } else if (packType === 'boda') {
      sponsorName = 'SafeBoda & National Stage Scout Mobility Pool';
      batchTitle = 'Frontline Scout & Bodaboda Road Safety Bounty Pool';
      for (let i = 1; i <= 5; i++) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        seedRows.push({
          voucherCode: `BODA-FUEL-${rand}-${selectedCountry}`,
          pin: `${rand}`,
          brand: 'SafeBoda',
          category: 'transit_credit',
          faceValue: isKe ? 250 : isNg ? 2500 : 5000,
          currency,
          packagedItems: ['Cashless SafeBoda Commuter Pass', '2L Stage Petrol Equivalent'],
          expiryDate: '2026-12-31',
        });
      }
    }

    setIsUploading(true);
    try {
      const res = await fetch('/api/perks/upload-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchName: batchTitle,
          sponsorName,
          sponsorType: packType === 'boda' || packType === 'supermarket' ? 'corporate_csr' : 'contractor',
          projectName:
            packType === 'boda'
              ? 'Frontline Scout & Bodaboda Road Safety Bounty Pool'
              : packType === 'supermarket'
              ? 'Supermarket 1,000 KSh Community Shopping Basket Pool'
              : 'Municipal Infrastructure Watchdog Pool',
          country: selectedCountry,
          vouchers: seedRows,
          isDemo: false,
          sourceMethod: 'seed',
        }),
      });

      const data = await res.json();
      if (data.success && data.vouchers) {
        const targetVault: VaultKind =
          packType === 'boda'
            ? 'scout_bounty_vault'
            : packType === 'supermarket'
            ? 'provider_vault'
            : activeVaultKind;
        const taggedVouchers = data.vouchers.map((v: EscrowPerkVoucher) => ({
          ...v,
          vaultType: targetVault,
          jurisdictionId: currentVaultJurisdictionMeta.jurisdictionId,
          jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
        }));
        savePerkVoucherBatchToCloud(taggedVouchers).catch(() => {});
        setVouchers((prev) => [...taggedVouchers, ...prev]);
        logAudit(
          'BODA_BOUNTY_ESCROW_SEEDED',
          data.batchId || 'BATCH-SEED',
          `Deposited ${data.uploadedCount}x ${batchTitle} vouchers into [${selectedCountry}] ${currentVaultJurisdictionMeta.vaultTitle}.`
        );
        toast(`Deposited ${data.uploadedCount} pre-funded vouchers into ${currentVaultJurisdictionMeta.vaultTitle}!`, 'emerald');
      }
    } catch {
      toast('Failed to deposit pack', 'rose');
    } finally {
      setIsUploading(false);
    }
  };

  // Structured Catalog of Packaged Voucher Allocations (Searchable & Filterable)
  const allocationCatalog = useMemo(() => {
    const isKe = selectedCountry === 'KE';
    const currency = isKe ? 'KES' : 'UGX';

    return [
      {
        id: 'supermarket_1000ksh_single' as const,
        shortTitle: isKe ? '1,000 KSh Supermarket Voucher (1x)' : '1,000 KSh / 30K UGX Supermarket (1x)',
        title: isKe
          ? '1x Naivas / Carrefour 1,000 KSh Shopping Basket Voucher'
          : '1x Quality / Carrefour 30,000 UGX (1,000 KSh) Shopping Voucher',
        brand: isKe ? 'Naivas / Carrefour Supermarket' : 'Quality Supermarket / Carrefour',
        category: 'supermarket' as const,
        filterGroup: 'supermarket' as const,
        unitFaceValue: isKe ? 1000 : 30000,
        quantity: 1,
        totalCost: isKe ? 1000 : 30000,
        currency,
        badge: '1,000 KSh Basket',
        accent: 'rose',
        description:
          'Single 1,000 KSh (UGX 30,000) supermarket shopping voucher—redeemable at the till for a variety of packaged household groceries.',
        packagedItems: [
          '2kg Maize Flour (Unga / Posho)',
          '1L Fresh Cooking Oil',
          '1kg Sugar & Tea Leaves',
          '2kg Rice & Bar of Laundry Soap',
          'Milk, Bread & Till Choice up to 1,000 KSh',
        ],
      },
      {
        id: 'supermarket_1000ksh_5' as const,
        shortTitle: isKe ? '1,000 KSh Supermarket Basket (5x)' : '1,000 KSh / 30K UGX Supermarket (5x)',
        title: isKe
          ? '5x Naivas / Carrefour 1,000 KSh Supermarket Shopping Vouchers'
          : '5x Quality / Carrefour 30,000 UGX (1,000 KSh) Supermarket Vouchers',
        brand: isKe ? 'Naivas / Carrefour Supermarket' : 'Quality Supermarket / Carrefour',
        category: 'supermarket' as const,
        filterGroup: 'supermarket' as const,
        unitFaceValue: isKe ? 1000 : 30000,
        quantity: 5,
        totalCost: isKe ? 5000 : 150000,
        currency,
        badge: '5x 1,000 KSh Pack',
        accent: 'rose',
        description:
          '5 supermarket shopping vouchers (each worth 1,000 KSh / UGX 30,000) packaged with essential household groceries for community winners.',
        packagedItems: [
          '2kg Maize Flour (Unga / Posho)',
          '1L Fresh Cooking Oil',
          '1kg Sugar & Tea Leaves',
          '2kg Rice & Bar of Laundry Soap',
          'Milk, Bread & Household Essentials',
        ],
      },
      {
        id: 'supermarket_mega_hamper_3' as const,
        shortTitle: isKe ? 'Supermarket Family Hamper (3x)' : 'Supermarket Family Hamper (3x)',
        title: isKe
          ? '3x Carrefour / Quickmart 2,500 KSh Family Grocery Hampers'
          : '3x Capital Shoppers / Carrefour 75,000 UGX Family Hampers',
        brand: isKe ? 'Carrefour / Quickmart Kenya' : 'Capital Shoppers / Carrefour',
        category: 'supermarket' as const,
        filterGroup: 'supermarket' as const,
        unitFaceValue: isKe ? 2500 : 75000,
        quantity: 3,
        totalCost: isKe ? 7500 : 225000,
        currency,
        badge: 'Top-3 Monthly Split',
        accent: 'rose',
        description:
          '3 full-month family supermarket hampers designed for exact 1/3 Top-3 Monthly Jurisdiction Awarding.',
        packagedItems: [
          '5kg Basmati / Super Rice',
          '3L Vegetable Cooking Oil',
          '2kg Sugar & 4kg Maize Flour',
          'Bathing & Multi-Purpose Soap Pack',
          'Long-Life Milk Carton & Breakfast Oats',
        ],
      },
      {
        id: 'mtn_5' as const,
        shortTitle: isKe ? 'Safaricom 2GB Data (5x)' : 'MTN 2GB Data & Voice (5x)',
        title: isKe ? '5x Safaricom 2GB Data Packs' : '5x MTN 2GB Freedom Data Packs',
        brand: isKe ? 'Safaricom' : 'MTN Uganda',
        category: 'telco_data' as const,
        filterGroup: 'telco_data' as const,
        unitFaceValue: isKe ? 360 : 10000,
        quantity: 5,
        totalCost: isKe ? 1800 : 50000,
        currency,
        badge: 'Field Data + Voice',
        accent: 'amber',
        description:
          '5 high-speed telecom vouchers packaged with data, voice minutes, and SMS for field evidence uploads.',
        packagedItems: [
          '2GB 4G/5G High-Speed Data',
          '30 On-Net Voice Minutes',
          '100 SMS for *284*33# USSD',
          'Zero-Rated Evidence Upload',
        ],
      },
      {
        id: 'mtn_10' as const,
        shortTitle: isKe ? 'Safaricom 2GB Mega (10x)' : 'MTN 2GB Mega (10x)',
        title: isKe ? '10x Safaricom 2GB Data Packs' : '10x MTN 2GB Data Mega Batch',
        brand: isKe ? 'Safaricom' : 'MTN Uganda',
        category: 'telco_data' as const,
        filterGroup: 'telco_data' as const,
        unitFaceValue: isKe ? 360 : 10000,
        quantity: 10,
        totalCost: isKe ? 3600 : 100000,
        currency,
        badge: '10x Parish Pool',
        accent: 'amber',
        description:
          '10 data vouchers for sustained community watchdog reporting and video inspection uploads.',
        packagedItems: [
          '10x 2GB 4G/5G Data Bundles',
          'HD Video & Geotagged Photo Quota',
          '30-Day Rollover Validity',
        ],
      },
      {
        id: 'nwsc_5' as const,
        shortTitle: isKe ? 'Nairobi Water (5x)' : 'NWSC Clean Water (5x)',
        title: isKe ? '5x Nairobi Water Clean Water Credits' : '5x NWSC 10,000 UGX Water Tokens',
        brand: isKe ? 'Nairobi Water (NCWSC)' : 'NWSC Uganda',
        category: 'water_utility' as const,
        filterGroup: 'water_electricity' as const,
        unitFaceValue: isKe ? 300 : 10000,
        quantity: 5,
        totalCost: isKe ? 1500 : 50000,
        currency,
        badge: '6,500L Water',
        accent: 'cyan',
        description:
          '5 pre-paid water utility tokens rewarding citizens who report pipe bursts and sanitation hazards.',
        packagedItems: [
          '6,500 Litres Prepaid Domestic Water',
          'Public Standpipe / Smart Meter Token',
          'Sanitation Levy Credit',
        ],
      },
      {
        id: 'yaka_5' as const,
        shortTitle: isKe ? 'KPLC Stima Power (5x)' : 'Umeme Yaka Power (5x)',
        title: isKe ? '5x Kenya Power KPLC Prepaid Tokens' : '5x Umeme Yaka 15,000 UGX Power Tokens',
        brand: isKe ? 'Kenya Power (KPLC)' : 'Umeme Power',
        category: 'electricity' as const,
        filterGroup: 'water_electricity' as const,
        unitFaceValue: isKe ? 500 : 15000,
        quantity: 5,
        totalCost: isKe ? 2500 : 75000,
        currency,
        badge: '45 kWh Stima/Yaka',
        accent: 'yellow',
        description:
          '5 pre-paid electricity tokens packaged with domestic kWh units for streetlight & grid audits.',
        packagedItems: [
          '45 kWh Domestic Electricity Units',
          'Instant 20-Digit STS Meter Token',
          'Zero Standing Charge Deduction',
        ],
      },
      {
        id: 'safeboda_10' as const,
        shortTitle: 'SafeBoda Transit (10x)',
        title: '10x SafeBoda Rapid Field Ride Credits',
        brand: 'SafeBoda',
        category: 'transit_credit' as const,
        filterGroup: 'transit_fuel' as const,
        unitFaceValue: isKe ? 150 : 5000,
        quantity: 10,
        totalCost: isKe ? 1500 : 50000,
        currency,
        badge: '10x Stage Mobility',
        accent: 'emerald',
        description:
          '10 transit credits for citizen inspectors & Frontline Scouts visiting public works sites.',
        packagedItems: [
          'Cashless SafeBoda Commuter Credit',
          '2L Stage Petrol Equivalent',
          'Reflector & Helmet Safety Care',
        ],
      },
      {
        id: 'fuel_shell_5' as const,
        shortTitle: 'Total / Shell Fuel & Lube (5x)',
        title: isKe
          ? '5x TotalEnergies / Shell 1,000 KSh Rider Fuel & Lube Vouchers'
          : '5x TotalEnergies / Shell 30,000 UGX (1,000 KSh) Fuel Vouchers',
        brand: 'TotalEnergies / Shell Service Station',
        category: 'transit_credit' as const,
        filterGroup: 'transit_fuel' as const,
        unitFaceValue: isKe ? 1000 : 30000,
        quantity: 5,
        totalCost: isKe ? 5000 : 150000,
        currency,
        badge: '1,000 KSh Fuel + Oil',
        accent: 'emerald',
        description:
          '5 service-station fuel & lubricant vouchers (1,000 KSh / UGX 30,000 each) for Bodaboda & Taxi Scouts.',
        packagedItems: [
          '5.5 Litres Unleaded Petrol / Diesel',
          '4T Bodaboda Engine Oil Top-Up',
          'Free Tire Pressure & Safety Inspection',
        ],
      },
      {
        id: 'pharmacy_wellness_5' as const,
        shortTitle: 'Pharmacy & First-Aid Kit (5x)',
        title: isKe
          ? '5x Goodlife Pharmacy 1,000 KSh Family First-Aid & Wellness Vouchers'
          : '5x Vine / Ecopharm 30,000 UGX (1,000 KSh) Pharmacy Vouchers',
        brand: isKe ? 'Goodlife Pharmacy Kenya' : 'Vine Pharmacy / Ecopharm Uganda',
        category: 'supermarket' as const,
        filterGroup: 'supermarket' as const,
        unitFaceValue: isKe ? 1000 : 30000,
        quantity: 5,
        totalCost: isKe ? 5000 : 150000,
        currency,
        badge: '1,000 KSh Health Kit',
        accent: 'rose',
        description:
          '5 pharmacy vouchers packaged with essential family first-aid, ORS, and wellness items for VHTs & citizens.',
        packagedItems: [
          'First-Aid Bandages, Gauze & Antiseptic',
          'Anti-Malarial & Pain Relief Essentials',
          'ORS, Zinc & Family Hygiene Soap Pack',
        ],
      },
      {
        id: 'school_stationery_5' as const,
        shortTitle: 'Back-to-School Scholastic (5x)',
        title: isKe
          ? '5x Text Book Centre / Naivas 1,000 KSh Scholastic Vouchers'
          : '5x Aristoc / Supermarket 30,000 UGX (1,000 KSh) School Vouchers',
        brand: isKe ? 'Text Book Centre / Naivas School' : 'Aristoc / Quality School Desk',
        category: 'supermarket' as const,
        filterGroup: 'supermarket' as const,
        unitFaceValue: isKe ? 1000 : 30000,
        quantity: 5,
        totalCost: isKe ? 5000 : 150000,
        currency,
        badge: '1,000 KSh School Pack',
        accent: 'rose',
        description:
          '5 packaged scholastic supply vouchers redeemable at supermarkets and bookshops for exercise books & solar lamps.',
        packagedItems: [
          '12x A4 Counter & Exercise Books',
          'Mathematical Geometry Set, Pens & Pencils',
          'Rechargeable Solar Reading Lamp Credit',
        ],
      },
      {
        id: 'agri_market_5' as const,
        shortTitle: 'Agro-Seed & Market Stall (5x)',
        title: isKe
          ? '5x Agro-Vet & Market Vendor 1,000 KSh Input Vouchers'
          : '5x Container Village / Agro-Input 30,000 UGX (1,000 KSh) Vouchers',
        brand: isKe ? 'Kenya Seed & Market Coop' : 'Bukoola / Market Vendor Input Desk',
        category: 'supermarket' as const,
        filterGroup: 'supermarket' as const,
        unitFaceValue: isKe ? 1000 : 30000,
        quantity: 5,
        totalCost: isKe ? 5000 : 150000,
        currency,
        badge: '1,000 KSh Agro/Market',
        accent: 'emerald',
        description:
          '5 packaged agricultural seed & market vendor stall vouchers for rural parish farmers and market scouts.',
        packagedItems: [
          '2kg Certified Maize & Bean Seeds',
          'Organic Foliar Fertilizer Pack',
          'Solar Market Stall Bulb & Eco Bags',
        ],
      },
    ];
  }, [selectedCountry]);

  const filteredAllocationCatalog = useMemo(() => {
    return allocationCatalog.filter((item) => {
      if (allocationCategoryFilter !== 'all' && item.filterGroup !== allocationCategoryFilter) {
        return false;
      }
      if (allocationSearchQuery.trim()) {
        const q = allocationSearchQuery.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(q) || item.shortTitle.toLowerCase().includes(q);
        const inBrand = item.brand.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inBadge = item.badge.toLowerCase().includes(q);
        const inPrice =
          String(item.unitFaceValue).includes(q) ||
          String(item.totalCost).includes(q) ||
          (q.includes('1000') && (item.unitFaceValue === 1000 || item.unitFaceValue === 30000)) ||
          (q.includes('ksh') && (item.unitFaceValue === 1000 || item.unitFaceValue === 2500 || item.unitFaceValue === 30000));
        const inItems = item.packagedItems.some((pi) => pi.toLowerCase().includes(q));
        if (!inTitle && !inBrand && !inDesc && !inBadge && !inPrice && !inItems) {
          return false;
        }
      }
      return true;
    });
  }, [allocationCatalog, allocationCategoryFilter, allocationSearchQuery]);

  const filteredMerchantCatalog = useMemo(() => {
    let list = merchantProducts.filter(
      (p) => p.country.toUpperCase() === selectedCountry.toUpperCase() && p.active
    );
    if (merchantRewardTypeFilter !== 'all') {
      list = list.filter((p) => p.rewardType === merchantRewardTypeFilter);
    }
    if (merchantCategoryFilter !== 'all') {
      list = list.filter((p) => p.category === merchantCategoryFilter);
    }
    if (merchantLocationFilterParish && !merchantLocationFilterParish.toLowerCase().includes('all')) {
      const q = merchantLocationFilterParish.toLowerCase().replace(/parish|ward/g, '').trim();
      if (q) {
        list = list.filter((p) =>
          (p.parish || '').toLowerCase().includes(q) ||
          (p.district || '').toLowerCase().includes(q) ||
          (p.subCounty || '').toLowerCase().includes(q)
        );
      }
    }
    if (allocationSearchQuery.trim()) {
      const q = allocationSearchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.merchantName.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.rewardHeadline.toLowerCase().includes(q) ||
          p.rewardDescription.toLowerCase().includes(q) ||
          (p.parish || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [merchantProducts, selectedCountry, merchantRewardTypeFilter, merchantCategoryFilter, merchantLocationFilterParish, allocationSearchQuery]);

  // Details of the selected digital utility, supermarket, or local merchant package
  const getPackageDetails = () => {
    const isKe = selectedCountry === 'KE';
    const currency = isKe ? 'KES' : 'UGX';

    // When Local Merchant & Provider Voucher is selected
    if (allocationSource === 'merchant_loyalty' && selectedMerchantProduct) {
      const prod = selectedMerchantProduct;
      return {
        id: prod.id,
        shortTitle: prod.rewardHeadline,
        title: `1x ${prod.merchantName} - ${prod.rewardHeadline}`,
        brand: prod.merchantName,
        category: prod.category as any,
        unitFaceValue: prod.voucherCost,
        quantity: 1,
        totalCost: prod.voucherCost,
        currency: prod.currency,
        badge: prod.rewardType.toUpperCase(),
        accent: 'amber' as const,
        description: prod.rewardDescription,
        packagedItems: [
          prod.rewardHeadline,
          prod.title,
          `Redeemable at: ${prod.merchantName} (${prod.parish}, ${prod.district || ''})`,
          `CivicDuty 2% Fee: ${prod.currency} ${prod.commissionAmount} | 98% Merchant Escrow Payout: ${prod.currency} ${prod.merchantPayoutAmount.toLocaleString()}`,
        ],
        merchantProduct: prod,
      };
    }

    if (payPackage !== 'custom') {
      const found = allocationCatalog.find((item) => item.id === payPackage);
      if (found) {
        return found;
      }
    }

    const parsedCustomItems = customPackagedItemsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      title: `${customQuantity}x ${customBrand} Custom CSR Allocation`,
      brand: customBrand,
      category: customCategory,
      unitFaceValue: customFaceValue,
      quantity: customQuantity,
      totalCost: customQuantity * customFaceValue,
      currency,
      description: `Custom package of ${customQuantity} pre-funded ${customBrand} vouchers`,
      packagedItems:
        parsedCustomItems.length > 0
          ? parsedCustomItems
          : [`Redeemable for ${customBrand} packaged items up to ${currency} ${customFaceValue.toLocaleString()}`],
      merchantProduct: undefined as MerchantProductService | undefined,
    };
  };

  const handleExecuteDirectPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const pkg = getPackageDetails();

    if (payMethod === 'momo' || payMethod === 'airtel' || payMethod === 'mpesa') {
      if (!payPhone.trim() || payPhone.length < 9) {
        toast('Please enter a valid mobile money phone number', 'amber');
        return;
      }
    }

    setIsPaying(true);
    try {
      // 1. Initialize Payment with African Payment Gateway
      const initRes = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityName: paySponsorName || 'Seyani Brothers Construction Ltd',
          invoiceId: `PERK-ESCROW-${Date.now().toString(36).toUpperCase()}`,
          amount: pkg.totalCost,
          currency: pkg.currency,
          paymentMethod: payMethod === 'momo' ? 'mtn_momo' : payMethod === 'airtel' ? 'airtel_money' : payMethod === 'mpesa' ? 'mpesa' : payMethod === 'card' ? 'card' : 'bank_transfer',
          payerPhone: payPhone,
          payerEmail: payEmail,
        }),
      });
      const initData = await initRes.json();

      if (!initData.success) {
        throw new Error(initData.error || 'Failed to initialize payment gateway');
      }

      // 2. Gateway Settlement Verification
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionReference: initData.transactionReference }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        throw new Error('Payment gateway verification failed');
      }

      // 3. Mint Verified Digital Utility & Merchant Loyalty Vouchers
      const mintedVouchers: any[] = [];
      const prefix = pkg.brand.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'VCH';

      if (pkg.merchantProduct) {
        const prod = pkg.merchantProduct;
        const rand = Math.floor(1000 + Math.random() * 9000);
        const pin = Math.floor(100000 + Math.random() * 900000).toString();
        const code = `VCH-${prefix}-${rand}-${selectedCountry}`;
        mintedVouchers.push({
          voucherCode: code,
          pin,
          brand: prod.merchantName,
          title: prod.rewardHeadline,
          category: prod.category,
          faceValue: prod.voucherCost,
          currency: prod.currency,
          packagedItems: pkg.packagedItems,
          expiryDate: '2026-12-31',
          merchantId: prod.merchantId,
          merchantName: prod.merchantName,
          merchantLocation: {
            parish: prod.parish,
            subCounty: prod.subCounty,
            district: prod.district,
            address: prod.address,
          },
          rewardType: prod.rewardType,
          rewardHeadline: prod.rewardHeadline,
          merchantPayout: {
            payoutAmount: prod.merchantPayoutAmount,
            commissionAmount: prod.commissionAmount,
            commissionRate: 0.02,
            payoutStatus: 'escrowed' as const,
          },
          qrCodeData: prod.qrCodePayload || code,
          barcode: prod.barcode || `${selectedCountry === 'KE' ? '710' : '890'}${Math.floor(100000000 + Math.random() * 900000000)}`,
          redemptionUssdString: prod.ussdCode || (selectedCountry === 'KE' ? `*141*${rand}#` : `*303*${rand}#`),
        });
      } else {
        for (let i = 1; i <= pkg.quantity; i++) {
          const rand = Math.floor(1000 + Math.random() * 9000);
          const pin = Math.floor(100000 + Math.random() * 900000).toString();
          const code = `${prefix}-${pkg.unitFaceValue >= 1000 ? `${Math.round(pkg.unitFaceValue / 1000)}K` : pkg.unitFaceValue}-${rand}-${selectedCountry}`;
          mintedVouchers.push({
            voucherCode: code,
            pin,
            brand: pkg.brand,
            title: pkg.title.replace(/^\d+x\s+/i, ''),
            category: pkg.category,
            faceValue: pkg.unitFaceValue,
            currency: pkg.currency,
            packagedItems: pkg.packagedItems,
            expiryDate: '2026-12-31',
            redemptionUssdString: (selectedCountry === 'KE' ? '*141*CODE#' : '*303*CODE#').replace('CODE', code),
          });
        }
      }

      // 4. Batch Deposit into Sovereign Escrow Vault
      const batchRes = await fetch('/api/perks/upload-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchName: `${pkg.title} [Direct MoMo/Card Escrow]`,
          sponsorName: paySponsorName,
          sponsorType: paySponsorType,
          projectName: payProjectName,
          country: selectedCountry,
          vouchers: mintedVouchers,
          isDemo: !uploadAsLive,
          sourceMethod: 'aggregator_checkout',
        }),
      });

      const batchData = await batchRes.json();
      if (batchData.success && batchData.vouchers) {
        const taggedBatch = batchData.vouchers.map((v: EscrowPerkVoucher) => ({
          ...v,
          packagedItems: v.packagedItems || pkg.packagedItems,
          vaultType: activeVaultKind,
          jurisdictionId: currentVaultJurisdictionMeta.jurisdictionId,
          jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
        }));
        // Sync to Cloud Firestore
        savePerkVoucherBatchToCloud(taggedBatch).catch(() => {});
        if (verifyData.transaction) {
          saveGatewayTransactionToCloud(verifyData.transaction).catch(() => {});
        }

        // Update local state
        setVouchers((prev) => [...taggedBatch, ...prev]);

        // Audit Trail
        logAudit(
          'PERK_ESCROW_FUNDED',
          initData.transactionReference,
          `${paySponsorName} funded ${pkg.quantity}x ${pkg.brand} vouchers (${pkg.currency} ${pkg.totalCost.toLocaleString()}) via ${payMethod.toUpperCase()} for ${payProjectName}`
        );

        setPaymentReceipt({
          reference: initData.transactionReference,
          amount: pkg.totalCost,
          currency: pkg.currency,
          method: payMethod,
          vouchersCount: pkg.quantity,
          pkgTitle: pkg.title,
          packagedItems: pkg.packagedItems,
          sponsor: paySponsorName,
          project: payProjectName,
          timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        });

        toast(`Payment confirmed! ${pkg.quantity} packaged vouchers deposited and locked in Escrow!`, 'emerald');
      }
    } catch {
      toast('Payment gateway processing error', 'rose');
    } finally {
      setIsPaying(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'supermarket':
        return <ShoppingBag size={15} className="text-rose-500" />;
      case 'telco_data':
        return <Smartphone size={15} className="text-amber-500" />;
      case 'water_utility':
        return <Droplet size={15} className="text-cyan-500" />;
      case 'electricity':
        return <Zap size={15} className="text-yellow-500" />;
      case 'transit_credit':
        return <Bike size={15} className="text-emerald-500" />;
      default:
        return <Ticket size={15} className="text-purple-500" />;
    }
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-20 text-slate-900 dark:text-slate-100 max-w-5xl mx-auto">
      {/* Top Studio Header Bar — Google AI Studio Aesthetic */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => go('feed')}
            className="p-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
              <span>CSR Pre-Funding &amp; Civic Field Cost Reimbursements</span>
              <span aria-hidden="true">·</span>
              <span>Sovereign Escrow Vault</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Digital Utility Perk Escrow Vault ({COUNTRIES[selectedCountry]?.name || selectedCountry})
            </h1>
          </div>
        </div>

        {/* Country Selector & Ledger Refresh */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value as CountryCode)}
            className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-1.5 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {Object.entries(COUNTRIES).map(([code, info]) => (
              <option key={code} value={code}>
                [{code}] {info.name}
              </option>
            ))}
          </select>

          <button
            onClick={loadVaultData}
            title="Refresh Vault Ledger"
            className="p-2 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-emerald-500' : ''} />
          </button>
        </div>
      </div>

      {/* Escrow Health & Inventory Overview Cards — AI Studio Matte Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">Unassigned in Escrow</span>
            <Ticket size={14} className="text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            {stats.unassignedCount}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            Ready for instant dispatch
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">Escrow Liquidity</span>
            <ShieldCheck size={14} className="text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 truncate tabular-nums">
            {stats.currency} {stats.totalEscrowFaceValue.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            Locked CSR face value
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">Dispatched Perks</span>
            <Gift size={14} className="text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            {stats.dispatchedCount}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            Delivered via SMS / XP Store
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">Sponsoring Entities</span>
            <Building2 size={14} className="text-slate-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            {stats.uniqueSponsors}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            Contractors, Utilities &amp; Patrons
          </div>
        </div>
      </div>

      {/* FIVE-VAULT CIVIC & COMMUNITY REWARD ARCHITECTURE STUDIO */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider flex-wrap">
              <Sparkles size={12} />
              <span>Five-Vault Jurisdictional &amp; Peer Escrow Architecture</span>
              <span>·</span>
              <span>Monthly Top-3 Final Award (Vaults 1–4) + Instant Peer Tipping (Vault 5)</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Select Vault Type &amp; Jurisdiction Scope
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold self-start sm:self-auto">
            Monthly Top-3 Merit Lock · Zero Cherry-Picking
          </span>
        </div>

        {/* Decongested Vault View Segmented Switch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="inline-flex p-1 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
            <button
              type="button"
              onClick={() => {
                setVaultCategoryView('citizen_crowdsource');
                if (activeVaultKind === 'provider_vault' || activeVaultKind === 'contractor_vault') {
                  setActiveVaultKind('parish_vault');
                  setLastBatchDispatchReceipt(null);
                }
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
                vaultCategoryView === 'citizen_crowdsource'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Crowdsourced Community Vaults (3)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setVaultCategoryView('institutional_desks');
                if (activeVaultKind !== 'provider_vault' && activeVaultKind !== 'contractor_vault') {
                  setActiveVaultKind(isContractorUser ? 'contractor_vault' : 'provider_vault');
                  setLastBatchDispatchReceipt(null);
                }
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                vaultCategoryView === 'institutional_desks'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Institutional &amp; Desk Vaults (2)</span>
              {isCitizenOnly && (
                <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 font-mono font-bold">
                  Desk Only
                </span>
              )}
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {vaultCategoryView === 'citizen_crowdsource'
              ? 'Public crowdsourced prize pools funded by citizens & sponsors'
              : 'Enterprise escrow for registered Contractors & Service Provider Desks'}
          </span>
        </div>

        {/* Decongested Vault Grid: 3 Crowdsourced OR 2 Institutional */}
        {vaultCategoryView === 'citizen_crowdsource' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'parish_vault' as VaultKind,
                title: '1. Parish Vault',
                subtitle: 'Monthly Parish Top-3',
                badge: 'Monthly · Parish Chief',
                desc: 'Open to all community sponsors. Evaluates verified residents all month and disburses to the Top 3 via Parish Chief.',
                icon: MapPin,
                accent: 'emerald',
              },
              {
                id: 'scout_bounty_vault' as VaultKind,
                title: '2. Scout & Profession Vault',
                subtitle: 'Top-3 Across 8 Professions',
                badge: 'Monthly · 8 Reporter Roles',
                desc: 'Covers frontline categories (Bodaboda, Drivers, Market Vendors, Healthcare, Teachers, Artisans, Civil Servants, Citizens).',
                icon: Bike,
                accent: 'amber',
              },
              {
                id: 'individual_vault' as VaultKind,
                title: '3. Individual Vault',
                subtitle: 'Instant Peer Tipping',
                badge: 'Instant · Personal Choice',
                desc: 'Zero monthly wait: citizens deposit vouchers into their personal pool and immediately tip authors for impactful field evidence.',
                icon: Gift,
                accent: 'rose',
              },
            ].map((vCard) => {
              const Icon = vCard.icon;
              const isSelected = activeVaultKind === vCard.id;
              return (
                <button
                  key={vCard.id}
                  type="button"
                  onClick={() => {
                    setActiveVaultKind(vCard.id);
                    setLastBatchDispatchReceipt(null);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 dark:border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30 ring-1 ring-emerald-500/40'
                      : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Icon size={15} />
                      </span>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300">
                        {vCard.badge}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {vCard.title}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                        {vCard.subtitle}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {vCard.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-[10px] font-mono font-bold">
                    <span className={isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500'}>
                      {isSelected ? 'Active Vault' : 'Select Vault →'}
                    </span>
                    {isSelected && <Check size={13} className="text-emerald-600 dark:text-emerald-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'provider_vault' as VaultKind,
                title: 'Private Provider Vault',
                subtitle: 'Monthly Customer Care & Shop Top-3',
                badge: isPrivateProviderUser ? 'Your Registered Desk' : 'Desk-Gated',
                desc: 'Business and store owners deposit escrow all month. Monthly final ranking awards the Top 3 citizens strictly based on customer care and service desk ratings.',
                icon: Store,
                accent: 'teal',
                isOwner: isPrivateProviderUser,
              },
              {
                id: 'contractor_vault' as VaultKind,
                title: 'Contractor Watchdog Vault',
                subtitle: 'Monthly Public Works Top-3',
                badge: isContractorUser ? 'Your Registered Desk' : 'Desk-Gated',
                desc: 'Civil engineering contractors & road agencies fund infrastructure project escrow. Splits awards across the Top 3 verified field watchdogs.',
                icon: HardHat,
                accent: 'indigo',
                isOwner: isContractorUser,
              },
            ].map((vCard) => {
              const Icon = vCard.icon;
              const isSelected = activeVaultKind === vCard.id;
              return (
                <button
                  key={vCard.id}
                  type="button"
                  onClick={() => {
                    setActiveVaultKind(vCard.id);
                    setLastBatchDispatchReceipt(null);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 dark:border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30 ring-1 ring-emerald-500/40'
                      : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Icon size={15} />
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                          vCard.isOwner
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                            : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {vCard.badge}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {vCard.title}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                        {vCard.subtitle}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {vCard.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-[10px] font-mono font-bold">
                    <span className={isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500'}>
                      {isSelected ? 'Active Institutional Desk' : 'Select Desk →'}
                    </span>
                    {isSelected && <Check size={13} className="text-emerald-600 dark:text-emerald-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Vault Jurisdiction Control & Live Ranking / Dispatch Engine */}
        <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-4">
          {/* Top Bar: Jurisdiction Picker + Fiduciary Dispatcher Info */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#e3e6ea] dark:border-[#262b36]">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[9.5px] font-mono font-bold uppercase">
                  {currentVaultJurisdictionMeta.vaultTitle}
                </span>
                {activeVaultKind !== 'individual_vault' ? (
                  <>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[9.5px] font-mono font-bold">
                      <Lock size={10} />
                      <span>Monthly Final Ranking · Top-3 Even Split (33.3% Each)</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[9.5px] font-mono font-bold">
                      <span>{awardMonthLabel}</span>
                    </span>
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[9.5px] font-mono font-bold">
                    <Users size={10} />
                    <span>Instant Citizen Discretionary Peer Tipping (No Monthly Wait)</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentVaultJurisdictionMeta.rankingRule}
              </p>
              <div className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
                Designated Dispatcher:{' '}
                <strong className="text-slate-900 dark:text-white">
                  {currentVaultJurisdictionMeta.dispatcherTitle}
                </strong>
              </div>
            </div>

            {/* Dynamic Jurisdiction & Monthly Cycle Selector per Vault Kind */}
            <div className="w-full lg:w-80 shrink-0 space-y-2">
              {activeVaultKind !== 'individual_vault' && (
                <div>
                  <label className="text-[9.5px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400 block mb-0.5">
                    Monthly Evaluation &amp; Awarding Period
                  </label>
                  <select
                    value={selectedAwardMonth}
                    onChange={(e) => setSelectedAwardMonth(e.target.value as any)}
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-1.5 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="2026-10">October 2026 Cycle (Active Accumulation · Locks 31 Oct)</option>
                    <option value="2026-09">September 2026 Cycle (Final Top-3 Awarded)</option>
                    <option value="2026-08">August 2026 Cycle (Final Top-3 Awarded)</option>
                  </select>
                </div>
              )}

              {activeVaultKind === 'parish_vault' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[9.5px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400 block">
                      Parish / Ward Jurisdiction ({selectedCountry})
                    </label>
                    <div className="flex items-center gap-1 text-[9.5px] font-mono">
                      <button
                        type="button"
                        onClick={() => {
                          setParishDepositMode('home');
                          setSelectedParish(userHomeParish);
                        }}
                        className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                          parishDepositMode === 'home'
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600'
                        }`}
                      >
                        Home Parish
                      </button>
                      <button
                        type="button"
                        onClick={() => setParishDepositMode('external')}
                        className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                          parishDepositMode === 'external'
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600'
                        }`}
                      >
                        Sponsor Other
                      </button>
                    </div>
                  </div>

                  {parishDepositMode === 'home' ? (
                    <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800/50 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <div className="text-xs font-mono font-bold text-emerald-950 dark:text-emerald-200">
                            {userHomeParish}
                          </div>
                          <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                            Registered Home Member · Restricted Top-3 Award Pool
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200">
                        Home Locked
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <select
                        value={selectedParish}
                        onChange={(e) => setSelectedParish(e.target.value)}
                        className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-1.5 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      >
                        {parishOptions.map((par) => (
                          <option key={par} value={par}>
                            {par} {par === userHomeParish ? '(Your Home Parish)' : ''}
                          </option>
                        ))}
                      </select>
                      <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-[10px] font-mono text-amber-900 dark:text-amber-300 leading-relaxed">
                        <strong>External Patron Notice:</strong> Depositing into {selectedParish}. By sovereign bylaws, only verified local residents and ward whistleblowers registered in {selectedParish} can receive this monthly payout.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeVaultKind === 'provider_vault' && (
                <>
                  <label className="text-[9.5px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400 block">
                    Select Private Provider / Shop Jurisdiction
                  </label>
                  <select
                    value={selectedProviderDept}
                    onChange={(e) => setSelectedProviderDept(e.target.value)}
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {providerOptions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.full})
                      </option>
                    ))}
                  </select>
                </>
              )}

              {activeVaultKind === 'contractor_vault' && (
                <>
                  <label className="text-[9.5px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400 block">
                    Select Public Works Contract Jurisdiction
                  </label>
                  <select
                    value={selectedContractId}
                    onChange={(e) => setSelectedContractId(e.target.value)}
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {contractOptions.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.code || c.id}] {c.title} — {c.contractor}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {activeVaultKind === 'scout_bounty_vault' && (
                <>
                  <div>
                    <label className="text-[9.5px] font-mono font-bold uppercase text-amber-700 dark:text-amber-400 block mb-0.5">
                      Reporter Profession Category (Top-3 Award Pool)
                    </label>
                    <select
                      value={selectedScoutProfession}
                      onChange={(e) => setSelectedScoutProfession(e.target.value)}
                      className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      {REPORTER_PROFESSION_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} ({cat.fieldScoutTag.split('·')[0].trim()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9.5px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                      Transit Stage / Road Safety Corridor
                    </label>
                    <select
                      value={selectedScoutCorridor}
                      onChange={(e) => setSelectedScoutCorridor(e.target.value)}
                      className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-1.5 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    >
                      {scoutCorridorOptions.map((corr) => (
                        <option key={corr.id} value={corr.id}>
                          {corr.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {activeVaultKind === 'individual_vault' && (
                <>
                  <label className="text-[9.5px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400 block">
                    Pick Great Feed Post to Reward (Or Enter Citizen Below)
                  </label>
                  <select
                    value={individualTargetPostId}
                    onChange={(e) => {
                      const pid = e.target.value;
                      setIndividualTargetPostId(pid);
                      const found = countryFeedPosts.find((p) => p.id === pid);
                      if (found) {
                        setIndividualRecipientName(found.anonymous ? 'Verified Citizen Author' : found.citizen_name);
                        setIndividualCitationNote(`Rewarding your great post: "${found.title}"`);
                      }
                    }}
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {countryFeedPosts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.anonymous ? 'Verified Citizen' : p.citizen_name}: {p.title.slice(0, 48)}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>

          {/* Batch Dispatch Receipt Confirmation Banner */}
          {lastBatchDispatchReceipt && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    {lastBatchDispatchReceipt.vaultKind === 'individual_vault'
                      ? 'Individual Vault Peer Reward Dispatched Instantly via SMS/USSD!'
                      : `Monthly Final Top-3 Award Dispatched (${lastBatchDispatchReceipt.awardMonthLabel}) for ${lastBatchDispatchReceipt.jurisdictionLabel}!`}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 font-semibold">
                  Signed by: {lastBatchDispatchReceipt.dispatcherLabel} · {lastBatchDispatchReceipt.dispatchedAt}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {lastBatchDispatchReceipt.recipients.map((rec) => (
                  <div
                    key={`${rec.rank}-${rec.voucherCode}`}
                    className="p-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-emerald-500/30 text-[11px] font-mono space-y-0.5"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>
                        Rank #{rec.rank}: {rec.name}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400">{rec.score} pts</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{rec.contact}</div>
                    <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 pt-0.5">
                      {rec.brand} ({rec.currency} {rec.faceValue.toLocaleString()}) · Code: {rec.voucherCode}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Institutional Vaults (1-4): Monthly Locked Top-3 Ranked Citizens Grid */}
          {activeVaultKind !== 'individual_vault' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Award size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span>
                    {awardMonthLabel} · Top 3 Ranked Citizens in {currentVaultJurisdictionMeta.jurisdictionLabel} (Strictly Locked)
                  </span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[9.5px] font-mono font-bold">
                    Quorum Verified: 24 Active Participants (Min 15 Required for Legitimacy)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    1/3 even split across Rank #1, #2 &amp; #3
                  </span>
                </div>
              </div>

              {/* Category Pills Strip for Scout & Profession Vault */}
              {activeVaultKind === 'scout_bounty_vault' && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5">
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase shrink-0 mr-1 flex items-center gap-1">
                    <Filter size={11} />
                    <span>Profession Category:</span>
                  </span>
                  {REPORTER_PROFESSION_CATEGORIES.map((cat) => {
                    const CatIcon = cat.icon;
                    const isSelected = selectedScoutProfession === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedScoutProfession(cat.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 shadow-xs'
                            : 'bg-white dark:bg-[#161a22] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-[#e3e6ea] dark:border-[#262b36]'
                        }`}
                      >
                        <CatIcon
                          size={11}
                          className={isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}
                        />
                        <span>{cat.shortTitle}</span>
                        {isSelected && (
                          <span className="px-1 py-0.2 rounded bg-amber-500/30 text-[8.5px] font-black uppercase">
                            Top 3
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeJurisdictionTop3.map((cit) => (
                  <div
                    key={cit.rank}
                    className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col justify-between gap-2.5"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase ${
                            cit.rank === 1
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                              : cit.rank === 2
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                              : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          Rank #{cit.rank} · 33.3% Monthly Share
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {cit.score} pts
                        </span>
                      </div>

                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{cit.name}</span>
                          <Lock size={11} className="text-slate-400 shrink-0" title="Auto-selected by monthly jurisdiction ranking; cannot be manually altered" />
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          {cit.roleOrProfession} · {cit.contact}
                        </div>
                      </div>

                      <p className="text-[10.5px] text-slate-600 dark:text-slate-300 leading-snug bg-[#f8f9fa] dark:bg-[#0e1116] p-2 rounded-lg border border-[#e3e6ea] dark:border-[#262b36]">
                        {cit.citationReason}
                      </p>

                      {/* For Private Provider Vaults: Show specific provider perk form */}
                      {activeVaultKind === 'provider_vault' && (
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono space-y-1">
                          <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
                            <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 font-black">
                              {cit.rank === 1 ? '🎁 Freebie Perk' : cit.rank === 2 ? '🏷️ 20% Discount' : '🔄 BOGO / Gift Perk'}
                            </span>
                            <span className="text-[9px] text-slate-500 truncate max-w-[130px]">
                              {currentVaultJurisdictionMeta.jurisdictionLabel}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold">
                            {cit.rank === 1
                              ? 'Buy Haircut/Service → Free Wash & Care ($0)'
                              : cit.rank === 2
                              ? '20% OFF Braiding, Styling or Consultation'
                              : 'BOGO (Buy 1 Get 1) or UGX 5,000 Loyalty Cashback'}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] grid grid-cols-3 gap-1 text-center text-[9.5px] font-mono">
                      <div>
                        <span className="text-slate-400 block">Reports</span>
                        <strong className="text-slate-800 dark:text-slate-200">{cit.reportsCount}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Verified</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">{cit.resolvedOrVerifiedCount}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Upvotes</span>
                        <strong className="text-slate-800 dark:text-slate-200">{cit.upvotesCount}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Bar for Institutional Vaults (1-4) with Strict Role-Based Visibility */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  {/* 1. Parish Vault: ONLY Parish Chief sees the release button */}
                  {activeVaultKind === 'parish_vault' &&
                    (isParishChiefUser ? (
                      <button
                        type="button"
                        disabled={isBatchDispatching}
                        onClick={handleExecuteVaultDispatch}
                        className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Send size={13} />
                        <span>
                          {isBatchDispatching
                            ? 'Dispatching Monthly Top-3 Batch...'
                            : `Parish Chief Monthly Award: Release Top-3 ${selectedParish.replace(/ Parish$/i, '')} Pool`}
                        </span>
                      </button>
                    ) : (
                      <div className="px-3.5 py-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <Lock size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>
                          Role-Gated Dispatch: Only the <strong>Parish Chief ({selectedParish})</strong> can execute this monthly Top-3 release.
                        </span>
                      </div>
                    ))}

                  {/* 2. Private Provider Vault: ONLY Private Provider sees the dispatch button */}
                  {activeVaultKind === 'provider_vault' &&
                    (isPrivateProviderUser ? (
                      <button
                        type="button"
                        disabled={isBatchDispatching}
                        onClick={handleExecuteVaultDispatch}
                        className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Send size={13} />
                        <span>
                          {isBatchDispatching
                            ? 'Dispatching Monthly Top-3 Batch...'
                            : `Execute Monthly Top-3 Award Dispatch (${currentVaultJurisdictionMeta.jurisdictionLabel.slice(0, 26)})`}
                        </span>
                      </button>
                    ) : (
                      <div className="px-3.5 py-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <Lock size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
                        <span>
                          Role-Gated Dispatch: Only the <strong>Verified Private Provider ({currentVaultJurisdictionMeta.jurisdictionLabel})</strong> can execute this monthly Top-3 dispatch.
                        </span>
                      </div>
                    ))}

                  {/* 3. Contractor Vault: ONLY Contractor sees the dispatch button */}
                  {activeVaultKind === 'contractor_vault' &&
                    (isContractorUser ? (
                      <button
                        type="button"
                        disabled={isBatchDispatching}
                        onClick={handleExecuteVaultDispatch}
                        className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Send size={13} />
                        <span>
                          {isBatchDispatching
                            ? 'Dispatching Monthly Top-3 Batch...'
                            : `Execute Monthly Top-3 Award Dispatch (${currentVaultJurisdictionMeta.jurisdictionLabel.slice(0, 26)})`}
                        </span>
                      </button>
                    ) : (
                      <div className="px-3.5 py-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <Lock size={13} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span>
                          Role-Gated Dispatch: Only the <strong>Registered Contractor ({currentVaultJurisdictionMeta.jurisdictionLabel.slice(0, 26)})</strong> can view &amp; execute this monthly Top-3 dispatch.
                        </span>
                      </div>
                    ))}

                  {/* 4. Scout & Profession Vault: Visible to everyone & AUTO-DISPATCHES monthly + Instant Award Release */}
                  {activeVaultKind === 'scout_bounty_vault' && (() => {
                    const profConfig =
                      REPORTER_PROFESSION_CATEGORIES.find((p) => p.id === selectedScoutProfession) ||
                      REPORTER_PROFESSION_CATEGORIES[0];
                    const ProfIcon = profConfig.icon;
                    return (
                      <>
                        <button
                          type="button"
                          disabled={isBatchDispatching}
                          onClick={handleExecuteVaultDispatch}
                          className="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                        >
                          <Send size={13} />
                          <span>
                            {isBatchDispatching
                              ? `Dispatching Top-3 ${profConfig.shortTitle}...`
                              : `Release Top-3 ${profConfig.shortTitle} Award`}
                          </span>
                        </button>

                        <div className="px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>
                            Auto-Escrow: Month-End Top-3 Split for {profConfig.shortTitle} ({profConfig.bountyType.split(' ')[0]})
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => handleSeedPack('boda')}
                          className="px-3 py-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-amber-500 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ProfIcon size={13} className="text-amber-500" />
                          <span>{isUploading ? 'Depositing...' : `Instant Seed 5x ${profConfig.shortTitle} Pool ($0)`}</span>
                        </button>
                      </>
                    );
                  })()}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (activeVaultKind === 'scout_bounty_vault') {
                      setPayPackage('safeboda_10');
                      setPaySponsorType('corporate_csr');
                    } else if (activeVaultKind === 'contractor_vault') {
                      setPayPackage('mtn_5');
                      setPaySponsorType('contractor');
                    } else if (activeVaultKind === 'provider_vault') {
                      setPayPackage('mtn_5');
                      setPaySponsorType('corporate_csr');
                    } else {
                      setPayPackage('mtn_5');
                      setPaySponsorType('citizen_patron');
                    }
                    setPayProjectName(currentVaultJurisdictionMeta.vaultTitle);
                    setPaymentReceipt(null);
                    setActiveTab('pay');
                    toast(`Ready to deposit into ${currentVaultJurisdictionMeta.vaultTitle} below!`, 'emerald');
                    setTimeout(() => {
                      studioSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 80);
                  }}
                  className="px-3.5 py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Deposit Into {currentVaultJurisdictionMeta.vaultTitle.split('·')[0].trim()} →</span>
                </button>
              </div>

              {/* Frontline Scout Stages & Workstation Consensus Hub Directory */}
              {activeVaultKind === 'scout_bounty_vault' && (
                <div className="pt-3 border-t border-[#e3e6ea] dark:border-[#262b36]">
                  <FrontlineStageExplorer
                    country={selectedCountry}
                    selectedParish={selectedParish}
                    onSelectStageForCompose={(stg) => {
                      go('compose');
                      toast(`Opening report compose for ${stg.name}...`, 'emerald');
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            /* Individual Citizen Vault (5): Discretionary Peer-to-Peer Tipping Studio */
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-slate-500 block mb-1">
                    Citizen Recipient Name
                  </label>
                  <input
                    type="text"
                    value={individualRecipientName}
                    onChange={(e) => setIndividualRecipientName(e.target.value)}
                    placeholder="e.g. Amina Nabatanzi"
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-slate-500 block mb-1">
                    Recipient Phone / Wallet Contact
                  </label>
                  <input
                    type="text"
                    value={individualRecipientPhone}
                    onChange={(e) => setIndividualRecipientPhone(e.target.value)}
                    placeholder="+256 774 819 203"
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-slate-500 block mb-1">
                    Appreciation Note / Post Citation
                  </label>
                  <input
                    type="text"
                    value={individualCitationNote}
                    onChange={(e) => setIndividualCitationNote(e.target.value)}
                    placeholder="Thank you for this great post!"
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                <button
                  type="button"
                  disabled={isBatchDispatching}
                  onClick={handleExecuteVaultDispatch}
                  className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Gift size={14} />
                  <span>
                    {isBatchDispatching
                      ? 'Sending Peer Reward...'
                      : `Send Individual Vault Reward to ${individualRecipientName || 'Citizen'}`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPayPackage('mtn_5');
                    setPaySponsorType('citizen_patron');
                    setPaySponsorName(`${user?.name || 'Verified Citizen'} (Individual Vault)`);
                    setPayProjectName(`${user?.name || 'Citizen'} Personal Individual Vault`);
                    setPaymentReceipt(null);
                    setActiveTab('pay');
                    toast('Ready to deposit vouchers into your Individual Citizen Vault below!', 'emerald');
                    setTimeout(() => {
                      studioSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 80);
                  }}
                  className="px-3.5 py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Deposit Into My Individual Vault →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ethical Governance & Field Cost Reimbursement Covenant Banner */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Scale size={17} strokeWidth={1.75} />
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                <span>Ethical Civic Stewardship Covenant</span>
                <span aria-hidden="true">·</span>
                <span>Field Cost Reimbursement Standard</span>
                <span aria-hidden="true">·</span>
                <span>ISO 26000 Compliant</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                Every utility token in this vault is governed by three strict ethical rules: <strong>(1) Field Cost Reimbursement Framing</strong>—vouchers compensate citizens for mobile data, transit, and inspection costs incurred during community service, never as cash bribes; <strong>(2) Anti-Hush-Money Covenant</strong>—accepting a voucher <em>never</em> closes, locks, or mutes a ticket, preserving 100% of the citizen&apos;s right to dispute shoddy repairs; and <strong>(3) Dual-Path Transparency</strong>—separating pre-loaded <code>DEMO</code> showcase tokens from <code>LIVE</code> sponsor-funded escrow vouchers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab('redeem_xp');
                studioSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Gift size={13} strokeWidth={1.75} />
              <span>Redeem Civic XP ({citizenXp} XP)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('csr_leaderboard');
                studioSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Award size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>CSR Leaderboard &amp; Certs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Merchant Studio & Cashier POS Relocation Callout */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Store size={18} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Merchant Studio &amp; Cashier POS Desk</span>
              <span className="text-[9.5px] font-mono text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-500/15 px-2 py-0.5 rounded">
                Service Provider Wall
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Manage store loyalty vouchers, inventory catalog, and run the Cashier POS scanner directly on your active Service Provider Desk.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setActiveDept(selectedProviderDept || 'shop_quality_supermarket');
            setActiveDeptCountry(selectedCountry);
            setWallTab('vouchers');
            go('dept');
          }}
          className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
        >
          <Store size={13} />
          <span>Open Provider Desk POS &rarr;</span>
        </button>
      </div>

      {/* Main Upload / Deposit Studio Card */}
      <div
        ref={studioSectionRef}
        className="p-4 rounded-xl space-y-4 border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>Pre-Funded Voucher Deposit, XP Redemption &amp; CSR Governance</span>
            </h2>
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              BYOV 0% Fee (30-Day Founding Trial) · Instant Aggregator Mint · Citizen XP Store · CSR Impact Certificates
            </p>
          </div>

          {/* Upload Method Tabs — AI Studio Segmented Controls */}
          <div className="flex flex-wrap items-center gap-1 bg-[#f8f9fa] dark:bg-[#0e1116] p-1 rounded-lg border border-[#e3e6ea] dark:border-[#262b36]">
            <button
              onClick={() => setActiveTab('packs')}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                activeTab === 'packs'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Seed Packs ($0)
            </button>
            <button
              onClick={() => setActiveTab('csv')}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                activeTab === 'csv'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              BYOV CSV (0% Fee)
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                activeTab === 'manual'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Single PIN
            </button>
            <button
              onClick={() => {
                setActiveTab('pay');
                setPaymentReceipt(null);
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                activeTab === 'pay'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              <CreditCard size={12} />
              <span>Aggregator Auto-Mint</span>
            </button>
            <button
              onClick={() => setActiveTab('redeem_xp')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                activeTab === 'redeem_xp'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Gift size={12} strokeWidth={1.75} />
              <span>Citizen XP Store</span>
            </button>
            <button
              onClick={() => setActiveTab('csr_leaderboard')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                activeTab === 'csr_leaderboard'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award size={12} />
              <span>CSR Leaderboard</span>
            </button>
          </div>
        </div>

        {/* TAB: DIRECT BUY & MOMO / CARD PAYMENT ESCROW */}
        {activeTab === 'pay' && (
          <div className="space-y-5">
            {/* SUCCESS RECEIPT BANNER */}
            {paymentReceipt && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-100 space-y-3 animate-fade-in">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-sm font-bold">Payment Verified & Vouchers Escrowed!</div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        Transaction Ref: <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{paymentReceipt.reference}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setPaymentReceipt(null)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors"
                  >
                    Fund Another Allocation
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-500/20 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Package</span>
                    <span className="font-bold">{paymentReceipt.pkgTitle}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Amount Settled</span>
                    <span className="font-bold">{paymentReceipt.currency} {paymentReceipt.amount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Payment Method</span>
                    <span className="font-bold uppercase">{paymentReceipt.method}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Escrow Status</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Locked in Vault</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: SELECT VOUCHER ALLOCATION TO BUY & ESCROW (DUAL MODE: PRE-PACKAGED VS LOCAL MERCHANT LAAS) */}
            <div className="space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 block">
                    1. Select Voucher Allocation to Buy &amp; Escrow into Vault
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Buy into any Vault: CivicDuty receives a <strong>2% capped commission</strong> while <strong>98%</strong> is safely held in escrow for local merchants and utility providers until customer redemption.
                  </p>
                </div>

                {/* Source Mode Toggle: Standard Packs vs Local Merchant Loyalty Vouchers */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] shrink-0">
                  <button
                    type="button"
                    onClick={() => setAllocationSource('utilities_supermarket')}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      allocationSource === 'utilities_supermarket'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Package size={13} />
                    <span>Utilities &amp; Supermarkets</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAllocationSource('merchant_loyalty');
                      if (!selectedMerchantProduct && filteredMerchantCatalog.length > 0) {
                        setSelectedMerchantProduct(filteredMerchantCatalog[0]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      allocationSource === 'merchant_loyalty'
                        ? 'bg-emerald-600 text-white'
                        : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                  >
                    <Store size={13} />
                    <span>Local Merchant Vouchers (2% Fee)</span>
                  </button>
                </div>
              </div>

              {/* SEARCH BAR & PARISH LOCATION MATCHER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#f8f9fa] dark:bg-[#0e1116] p-2.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36]">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={allocationSearchQuery}
                    onChange={(e) => setAllocationSearchQuery(e.target.value)}
                    placeholder={
                      allocationSource === 'merchant_loyalty'
                        ? 'Search local salon, haircut, bread, garage, grocer, Kireka, Kitintale...'
                        : 'Search 1000 KSh, supermarket, sugar, oil, fuel, data, water...'
                    }
                    className="w-full pl-8 pr-8 py-1.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  {allocationSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setAllocationSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      title="Clear search"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Parish Location Filter (Essential for rewarding posters closer to home) */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300">
                    <MapPin size={13} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Parish:</span>
                  </div>
                  <select
                    value={merchantLocationFilterParish}
                    onChange={(e) => setMerchantLocationFilterParish(e.target.value)}
                    className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">All Parishes in {selectedCountry}</option>
                    {parishOptions.map((par) => (
                      <option key={par} value={par}>
                        {par}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* MODE A: PRE-PACKAGED DIGITAL UTILITY & SUPERMARKET VOUCHERS */}
              {allocationSource === 'utilities_supermarket' && (
                <div className="space-y-3">
                  {/* Category Filter Bar for Packaged Vouchers */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
                      {[
                        { id: 'all' as const, label: `All Packages (${allocationCatalog.length})` },
                        { id: 'supermarket' as const, label: 'Supermarket & 1,000 KSh Baskets (6)' },
                        { id: 'telco_data' as const, label: 'Telco Data & Voice (2)' },
                        { id: 'water_electricity' as const, label: 'Water & Power (2)' },
                        { id: 'transit_fuel' as const, label: 'Scout Fuel & Transit (2)' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setAllocationCategoryFilter(tab.id)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                            allocationCategoryFilter === tab.id
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <span className="text-[10.5px] font-mono text-slate-500">
                      Showing {filteredAllocationCatalog.length} utility packages + Custom Builder
                    </span>
                  </div>

                  {/* Packaged Voucher Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {filteredAllocationCatalog.map((item) => {
                  const isSelected = payPackage === item.id;
                  const accentBorder =
                    item.accent === 'rose'
                      ? isSelected
                        ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500/30'
                        : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-rose-400/60'
                      : item.accent === 'amber'
                      ? isSelected
                        ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30'
                        : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-amber-400/60'
                      : item.accent === 'cyan'
                      ? isSelected
                        ? 'border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/30'
                        : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-cyan-400/60'
                      : item.accent === 'yellow'
                      ? isSelected
                        ? 'border-yellow-500 bg-yellow-500/10 ring-1 ring-yellow-500/30'
                        : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-yellow-400/60'
                      : isSelected
                      ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/30'
                      : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-400/60';

                  const accentText =
                    item.accent === 'rose'
                      ? 'text-rose-600 dark:text-rose-400'
                      : item.accent === 'amber'
                      ? 'text-amber-600 dark:text-amber-400'
                      : item.accent === 'cyan'
                      ? 'text-cyan-600 dark:text-cyan-400'
                      : item.accent === 'yellow'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-emerald-600 dark:text-emerald-400';

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPayPackage(item.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${accentBorder}`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-1.5">
                          <div className={`flex items-center gap-1.5 text-xs font-bold ${accentText}`}>
                            {getCategoryIcon(item.category)}
                            <span className="leading-snug">{item.shortTitle}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[9px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                              {item.badge}
                            </span>
                            {isSelected && <Check size={14} className={accentText} />}
                          </div>
                        </div>

                        <div className="text-[10.5px] font-mono text-slate-600 dark:text-slate-300 font-semibold">
                          {item.brand} · {item.quantity}x @ {item.currency} {item.unitFaceValue.toLocaleString()}
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                          {item.description}
                        </p>

                        {/* Packaged Items Box */}
                        <div className="p-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                          <div className="flex items-center gap-1 text-[9.5px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400">
                            <Package size={11} className={accentText} />
                            <span>Items Packaged in Voucher:</span>
                          </div>
                          <div className="text-[10px] text-slate-700 dark:text-slate-300 leading-relaxed">
                            {item.packagedItems.join(' · ')}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-xs">
                        <span className="text-[10px] font-mono text-slate-400">
                          Total ({item.quantity} {item.quantity === 1 ? 'Voucher' : 'Vouchers'})
                        </span>
                        <span className={`font-bold font-mono ${accentText}`}>
                          {item.currency} {item.totalCost.toLocaleString()}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {/* Custom Allocation Builder Card */}
                <button
                  type="button"
                  onClick={() => setPayPackage('custom')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    payPackage === 'custom'
                      ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/30'
                      : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-indigo-400/60'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        <SlidersHorizontal size={14} strokeWidth={1.75} />
                        <span>Custom Packaged Voucher</span>
                      </div>
                      {payPackage === 'custom' && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Build your own supermarket, utility, or retail shopping voucher with custom face value (e.g. 1,000 KSh) and itemized basket list.
                    </p>
                    <div className="p-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-[10px] text-slate-600 dark:text-slate-300">
                      <span className="font-mono font-bold text-[9.5px] uppercase text-indigo-600 dark:text-indigo-400 block mb-0.5">
                        Custom Basket Preview:
                      </span>
                      {customPackagedItemsInput}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-slate-400">Custom Pool</span>
                    <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
                      {getPackageDetails().currency} {(customQuantity * customFaceValue).toLocaleString()}
                    </span>
                  </div>
                </button>
              </div>

              {/* Custom Package Form (If selected) */}
              {payPackage === 'custom' && (
                <div className="mt-3 p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-indigo-500/30 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">Supermarket / Utility Brand</label>
                      <select
                        value={customBrand}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomBrand(val);
                          if (val.toLowerCase().includes('supermarket') || val.toLowerCase().includes('naivas') || val.toLowerCase().includes('carrefour') || val.toLowerCase().includes('pharmacy')) {
                            setCustomCategory('supermarket');
                          } else if (val.toLowerCase().includes('mtn') || val.toLowerCase().includes('airtel') || val.toLowerCase().includes('safaricom')) {
                            setCustomCategory('telco_data');
                          } else if (val.toLowerCase().includes('water') || val.toLowerCase().includes('nwsc')) {
                            setCustomCategory('water_utility');
                          } else if (val.toLowerCase().includes('power') || val.toLowerCase().includes('umeme')) {
                            setCustomCategory('electricity');
                          } else {
                            setCustomCategory('transit_credit');
                          }
                        }}
                        className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg p-1.5 text-xs font-medium"
                      >
                        <option value="Naivas / Quality Supermarket">Naivas / Quality Supermarket</option>
                        <option value="Carrefour East Africa">Carrefour East Africa</option>
                        <option value="Capital Shoppers / Quickmart">Capital Shoppers / Quickmart</option>
                        <option value="Goodlife / Vine Pharmacy">Goodlife / Vine Pharmacy</option>
                        <option value="TotalEnergies / Shell Fuel">TotalEnergies / Shell Fuel</option>
                        <option value="MTN Uganda">MTN Uganda</option>
                        <option value="Airtel Uganda">Airtel Uganda</option>
                        <option value="NWSC Uganda">NWSC Uganda</option>
                        <option value="Umeme Power">Umeme Power</option>
                        <option value="SafeBoda">SafeBoda</option>
                        <option value="Safaricom">Safaricom</option>
                        <option value="Kenya Power (KPLC)">Kenya Power (KPLC)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">Voucher Quantity</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={customQuantity}
                        onChange={(e) => setCustomQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg p-1.5 text-xs font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">Unit Face Value ({getPackageDetails().currency})</label>
                      <input
                        type="number"
                        step={500}
                        value={customFaceValue}
                        onChange={(e) => setCustomFaceValue(Math.max(100, parseInt(e.target.value) || 1000))}
                        className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg p-1.5 text-xs font-bold text-center"
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <div className="text-[10px] text-slate-400 mb-0.5">Total Settlement</div>
                      <div className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">
                        {getPackageDetails().currency} {(customQuantity * customFaceValue).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                      Items Packaged in Voucher (Comma-Separated Shopping Basket)
                    </label>
                    <input
                      type="text"
                      value={customPackagedItemsInput}
                      onChange={(e) => setCustomPackagedItemsInput(e.target.value)}
                      placeholder="e.g. 2kg Maize Flour (Unga), 1L Cooking Oil, 1kg Sugar, 2kg Rice, Bar of Soap & Milk"
                      className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE B: LOCAL MERCHANT & SERVICE PROVIDER VOUCHERS (LAAS · 2% FEE · PARISH PROXIMITY) */}
            {allocationSource === 'merchant_loyalty' && (
              <div className="space-y-3">
                {/* Reward Type Filter Pills */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
                    {[
                      { id: 'all' as const, label: `All Offers (${filteredMerchantCatalog.length})` },
                      { id: 'discount' as const, label: '🏷️ Discounts (e.g. 20% off)' },
                      { id: 'freebie' as const, label: '🎁 Freebies (e.g. haircut + wash)' },
                      { id: 'bogo' as const, label: '🔄 BOGO (Buy 1 get 1)' },
                      { id: 'gift' as const, label: '🛍️ Gifts (Buy X win Y)' },
                      { id: 'cashback' as const, label: '💰 Cashback (Spend 50k get 5k)' },
                    ].map((chip) => (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => setMerchantRewardTypeFilter(chip.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                          merchantRewardTypeFilter === chip.id
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    <ShieldCheck size={13} />
                    <span>CivicDuty 2% Capped Fee · 98% Merchant Escrow Settlement</span>
                  </div>
                </div>

                {/* 12 Marketplace Categories Filter Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Marketplace Category</span>
                    <span>{filteredMerchantCatalog.length} Offers Available</span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                    <button
                      type="button"
                      onClick={() => setMerchantCategoryFilter('all')}
                      className={`shrink-0 px-2.5 py-1 rounded-md text-[10.5px] font-mono font-semibold transition-colors cursor-pointer ${
                        merchantCategoryFilter === 'all'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      All Categories
                    </button>
                    {MARKETPLACE_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setMerchantCategoryFilter(cat.id)}
                        className={`shrink-0 px-2.5 py-1 rounded-md text-[10.5px] font-mono font-semibold transition-colors cursor-pointer ${
                          merchantCategoryFilter === cat.id
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid of Merchant Vouchers */}
                {filteredMerchantCatalog.length === 0 ? (
                  <div className="p-8 text-center text-xs font-mono text-slate-500 rounded-xl border border-dashed border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                    <Store size={32} className="mx-auto text-slate-400" />
                    <div>No merchant vouchers matching this filter in {merchantLocationFilterParish}.</div>
                    <button
                      type="button"
                      onClick={() => {
                        setMerchantLocationFilterParish('all');
                        setMerchantRewardTypeFilter('all');
                        setMerchantCategoryFilter('all');
                      }}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-xs cursor-pointer"
                    >
                      Reset Parish, Offer &amp; Category Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {filteredMerchantCatalog.map((prod) => {
                      const isSelected = selectedMerchantProduct?.id === prod.id;
                      const catDef = MARKETPLACE_CATEGORIES.find((c) => c.id === prod.category);
                      return (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => setSelectedMerchantProduct(prod)}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                              : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-400/60'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-start justify-between gap-1.5 flex-wrap">
                              <div className="flex items-center gap-1">
                                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                  {prod.rewardType.toUpperCase()}
                                </span>
                                <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                  {catDef?.label || prod.category}
                                </span>
                              </div>
                              {isSelected && <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 font-bold" />}
                            </div>

                            <div>
                              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Store size={11} />
                                <span className="truncate">{prod.merchantName}</span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                {prod.rewardHeadline}
                              </h4>
                            </div>

                            <p className="text-[10.5px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-snug">
                              {prod.rewardDescription}
                            </p>

                            <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 pt-0.5">
                              <MapPin size={11} className="text-emerald-600 shrink-0" />
                              <span className="truncate font-semibold">{prod.parish} · {prod.district || prod.subCounty}</span>
                            </div>

                            {/* 2% Commission vs 98% Merchant Escrow Breakdown */}
                            <div className="p-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-[9.5px] font-mono space-y-0.5">
                              <div className="flex items-center justify-between text-slate-500">
                                <span>Platform Fee (2%):</span>
                                <span className="text-amber-600 font-semibold">{prod.currency} {prod.commissionAmount.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                                <span>Merchant Payout (98%):</span>
                                <span>{prod.currency} {prod.merchantPayoutAmount.toLocaleString()} (In Escrow)</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-xs">
                            <span className="text-[10px] font-mono text-slate-400">Voucher Cost</span>
                            <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                              {prod.currency} {prod.voucherCost.toLocaleString()}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 2: SPONSOR & PROJECT DETAILS */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                2. Sponsoring Entity & Target Project Allocation
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">
                    Sponsoring Entity / Contractor *
                  </label>
                  <input
                    type="text"
                    value={paySponsorName}
                    onChange={(e) => setPaySponsorName(e.target.value)}
                    placeholder="e.g. Seyani Brothers Construction Ltd"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">
                    Sponsor Classification
                  </label>
                  <select
                    value={paySponsorType}
                    onChange={(e) => setPaySponsorType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                  >
                    <option value="citizen_patron">Citizen Patron / Diaspora Community Service (CSR)</option>
                    <option value="corporate_csr">Corporate Telecom & Private Sector CSR</option>
                    <option value="contractor">Contractor CSR Allocation (Works)</option>
                    <option value="authority">Public Authority & Government Defect Budget</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">
                    Target Infrastructure Project
                  </label>
                  <input
                    type="text"
                    value={payProjectName}
                    onChange={(e) => setPayProjectName(e.target.value)}
                    placeholder="e.g. Kampala Flyover & Southern Bypass"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* STEP 3: PAYMENT METHOD SELECTION */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                3. Select Payment Gateway Channel
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {/* MTN MoMo */}
                <button
                  type="button"
                  onClick={() => setPayMethod('momo')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    payMethod === 'momo'
                      ? 'border-amber-500 bg-amber-500/15 font-bold shadow-xs text-amber-700 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Smartphone size={16} className="mx-auto mb-1 text-amber-500" />
                  <div className="text-xs">MTN MoMo</div>
                  <div className="text-[9px] text-slate-400">*165# STK Push</div>
                </button>

                {/* Airtel Money */}
                <button
                  type="button"
                  onClick={() => setPayMethod('airtel')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    payMethod === 'airtel'
                      ? 'border-rose-500 bg-rose-500/15 font-bold shadow-xs text-rose-700 dark:text-rose-300'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Smartphone size={16} className="mx-auto mb-1 text-rose-500" />
                  <div className="text-xs">Airtel Money</div>
                  <div className="text-[9px] text-slate-400">*185# Merchant</div>
                </button>

                {/* Safaricom M-Pesa */}
                <button
                  type="button"
                  onClick={() => setPayMethod('mpesa')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    payMethod === 'mpesa'
                      ? 'border-emerald-500 bg-emerald-500/15 font-bold shadow-xs text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Smartphone size={16} className="mx-auto mb-1 text-emerald-500" />
                  <div className="text-xs">M-Pesa</div>
                  <div className="text-[9px] text-slate-400">Lipa na M-Pesa</div>
                </button>

                {/* Bank Card (Visa / Mastercard) */}
                <button
                  type="button"
                  onClick={() => setPayMethod('card')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    payMethod === 'card'
                      ? 'border-blue-500 bg-blue-500/15 font-bold shadow-xs text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <CreditCard size={16} className="mx-auto mb-1 text-blue-500" />
                  <div className="text-xs">Bank Card</div>
                  <div className="text-[9px] text-slate-400">Visa / Mastercard</div>
                </button>

                {/* Corporate Wire / RTGS */}
                <button
                  type="button"
                  onClick={() => setPayMethod('bank')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    payMethod === 'bank'
                      ? 'border-slate-500 bg-slate-500/15 font-bold shadow-xs text-slate-800 dark:text-slate-200'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Building2 size={16} className="mx-auto mb-1 text-slate-500" />
                  <div className="text-xs">Bank Wire</div>
                  <div className="text-[9px] text-slate-400">EFT / RTGS</div>
                </button>
              </div>
            </div>

            {/* STEP 4: PAYER DETAILS & GATEWAY FORM */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              {/* Mobile Money Form (MTN / Airtel / M-Pesa) */}
              {(payMethod === 'momo' || payMethod === 'airtel' || payMethod === 'mpesa') && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Phone size={14} className="text-amber-500" />
                    <span>Mobile Money STK Push Authorization</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">
                        Payer Registered Mobile Number *
                      </label>
                      <input
                        type="tel"
                        value={payPhone}
                        onChange={(e) => setPayPhone(e.target.value)}
                        placeholder="+256 778 277900"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                        required
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        An instant USSD prompt will trigger on this phone to enter PIN.
                      </span>
                    </div>

                    <div>
                      <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">
                        Billing Notification Email
                      </label>
                      <input
                        type="email"
                        value={payEmail}
                        onChange={(e) => setPayEmail(e.target.value)}
                        placeholder="csr@contractor.ug"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Credit / Debit Card Form */}
              {payMethod === 'card' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <CreditCard size={14} className="text-blue-500" />
                      <span>3D-Secure Encrypted Card Payment</span>
                    </div>
                    <span className="text-[10px] text-slate-400">256-bit TLS Encrypted</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={payCardName}
                        onChange={(e) => setPayCardName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={payCardNumber}
                        onChange={(e) => setPayCardNumber(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">Expiry</label>
                      <input
                        type="text"
                        value={payCardExpiry}
                        onChange={(e) => setPayCardExpiry(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-center focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={payCardCvc}
                        onChange={(e) => setPayCardCvc(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-center focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">Receipt Email</label>
                      <input
                        type="email"
                        value={payEmail}
                        onChange={(e) => setPayEmail(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Wire / Corporate EFT Form */}
              {payMethod === 'bank' && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                    <Building2 size={14} className="text-slate-500" />
                    <span>Corporate Bank Wire (RTGS / Electronic Funds Transfer)</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div>Bank: <span className="font-bold">Stanbic Bank Uganda Ltd (Corporate Escrow Branch)</span></div>
                    <div>Account Name: <span className="font-bold">CivicDuty Sovereign Escrow Pool</span></div>
                    <div>Account No: <span className="font-mono font-bold text-amber-600 dark:text-amber-400">9030018849201</span></div>
                    <div>Swift Code: <span className="font-mono">SBICUGKX</span></div>
                    <div className="text-[11px] text-slate-400 pt-1">
                      Funds are credited automatically upon real-time RTGS webhook notification.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 5: TOTAL SUMMARY, WHOLESALE SPREAD & CSR FEE LEDGER & AUTHORIZATION */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    <span>Dual-Stream Supply Chain &amp; Commission Transparency Ledger</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    During the <strong>30-Day Founding Partner Trial</strong> (pre-incorporation), instant checkout runs in B2B Aggregator Sandbox Mode. Use <strong>BYOV CSV / Single PIN</strong> to upload live prepaid utility tokens at 0% fee.
                  </p>
                </div>
                <label className="flex items-center gap-2 text-[11px] bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={uploadAsLive}
                    onChange={(e) => setUploadAsLive(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span className="font-bold text-emerald-400">Mark as LIVE Escrow Batch</span>
                </label>
              </div>

              {/* 4-Column Supply Chain Financial Breakdown */}
              {(() => {
                const pkg = getPackageDetails();
                const faceVal = pkg.totalCost;
                const wholesaleCost = Math.round(faceVal * 0.94);
                const wholesaleSpread = faceVal - wholesaleCost; // 6% B2B Telco/Utility Aggregator Discount
                const csrEscrowFee = Math.round(faceVal * 0.10); // 10% Corporate CSR Escrow & Audit Fee
                const totalSponsorInvoice = faceVal + csrEscrowFee;
                const civicDutyNet = wholesaleSpread + csrEscrowFee;

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 block mono uppercase">1. Citizen Face Value</span>
                      <span className="font-mono font-black text-sm text-emerald-400">
                        {pkg.currency} {faceVal.toLocaleString()}
                      </span>
                      <span className="text-[9.5px] text-slate-400 block mt-0.5">
                        100% locked for {pkg.quantity}x citizen perks
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 block mono uppercase">2. Telco Wholesale Spread (6%)</span>
                      <span className="font-mono font-black text-sm text-amber-400">
                        {pkg.currency} {wholesaleSpread.toLocaleString()}
                      </span>
                      <span className="text-[9.5px] text-slate-400 block mt-0.5">
                        B2B aggregator discount (Wholesale: {wholesaleCost.toLocaleString()})
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 block mono uppercase">3. CSR Escrow &amp; Audit Fee (10%)</span>
                      <span className="font-mono font-black text-sm text-cyan-400">
                        {pkg.currency} {csrEscrowFee.toLocaleString()}
                      </span>
                      <span className="text-[9.5px] text-slate-400 block mt-0.5">
                        SHA-256 CSR Certificate &amp; SMS gateway
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40">
                      <span className="text-[10px] text-amber-300 block mono uppercase">4. Sponsor Total / CD Net</span>
                      <span className="font-mono font-black text-sm text-white">
                        {pkg.currency} {totalSponsorInvoice.toLocaleString()}
                      </span>
                      <span className="text-[9.5px] text-amber-300/90 block mt-0.5">
                        CivicDuty Net Margin: {pkg.currency} {civicDutyNet.toLocaleString()} (16%)
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div className="text-[11px] text-slate-400">
                  Funded by <span className="text-slate-200 font-bold">{paySponsorName}</span> for <span className="text-slate-200 font-bold">{payProjectName}</span> · Protected by Anti-Hush-Money Covenant
                </div>

                <button
                  type="button"
                  onClick={handleExecuteDirectPayment}
                  disabled={isPaying}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  {isPaying ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Processing Gateway Settlement...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={15} />
                      <span>Authorize &amp; Mint Escrow Vouchers</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: CSV BATCH IMPORT */}
        {activeTab === 'csv' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] mono font-bold uppercase text-slate-600 dark:text-slate-400 block mb-1">
                  Sponsoring Entity / Contractor
                </label>
                <input
                  type="text"
                  value={csvSponsor}
                  onChange={(e) => setCsvSponsor(e.target.value)}
                  placeholder="e.g. Seyani Brothers Construction Ltd"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] mono font-bold uppercase text-slate-600 dark:text-slate-400 block mb-1">
                  Sponsor Type
                </label>
                <select
                  value={csvSponsorType}
                  onChange={(e) => setCsvSponsorType(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="citizen_patron">Citizen Patron / Diaspora Community Service (CSR)</option>
                  <option value="corporate_csr">Corporate Telecom & Private Sector Partner</option>
                  <option value="contractor">Lead Works Contractor (CSR Budget)</option>
                  <option value="authority">Public Authority / Ministry (Defect Budget)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] mono font-bold uppercase text-slate-600 dark:text-slate-400 block mb-1">
                  Associated Project / Division
                </label>
                <input
                  type="text"
                  value={csvProjectName}
                  onChange={(e) => setCsvProjectName(e.target.value)}
                  placeholder="e.g. Kampala Flyover & Bypass"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Drop Zone */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <FileSpreadsheet size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {csvFile ? csvFile.name : 'Upload Digital Voucher CSV Batch'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Drag and drop your spreadsheet or click to browse. Format: Voucher_Code, Brand, Category, Face_Value, PIN, Expiry.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <label className="cursor-pointer px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5">
                  <Upload size={14} />
                  <span>Choose CSV File</span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Download size={14} />
                  <span>Download Sample CSV Template</span>
                </button>
              </div>
            </div>

            {/* Preview of Parsed Rows */}
            {csvPreviewRows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    Verified {csvPreviewRows.length} Vouchers in Batch
                  </span>
                  <span className="mono text-slate-500 text-[11px]">
                    Total Value: {csvPreviewRows[0]?.currency} {csvPreviewRows.reduce((a, b) => a + b.faceValue, 0).toLocaleString()}
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-[11px] mono">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 sticky top-0">
                      <tr>
                        <th className="p-2">Code</th>
                        <th className="p-2">Brand</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Face Value</th>
                        <th className="p-2">PIN</th>
                        <th className="p-2">Expiry</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                      {csvPreviewRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50">
                          <td className="p-2 font-bold text-amber-600 dark:text-amber-400">{row.voucherCode}</td>
                          <td className="p-2">{row.brand}</td>
                          <td className="p-2">{row.category}</td>
                          <td className="p-2">{row.currency} {row.faceValue.toLocaleString()}</td>
                          <td className="p-2">{row.pin || '—'}</td>
                          <td className="p-2">{row.expiryDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  disabled={isUploading}
                  onClick={handleCommitCsvUpload}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider mono transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck size={16} />
                  <span>{isUploading ? 'Locking into Escrow...' : `Deposit ${csvPreviewRows.length} Vouchers into Escrow Vault`}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MANUAL SINGLE DEPOSIT */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualDeposit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] mono font-bold uppercase text-slate-600 dark:text-slate-400 block mb-1">
                  Utility Brand / Provider
                </label>
                <select
                  value={manualBrand}
                  onChange={(e) => setManualBrand(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="Quality Supermarket / Carrefour">Quality / Carrefour Supermarket (1,000 KSh / 30K UGX Basket)</option>
                  <option value="Naivas / Carrefour Supermarket">Naivas / Carrefour Supermarket (1,000 KSh Basket)</option>
                  <option value="MTN Uganda">MTN Uganda (Telco)</option>
                  <option value="Airtel Uganda">Airtel Uganda (Telco)</option>
                  <option value="NWSC Uganda">NWSC Uganda (Water)</option>
                  <option value="Umeme Power">Umeme Power (Electricity)</option>
                  <option value="SafeBoda">SafeBoda (Transit)</option>
                  <option value="Safaricom">Safaricom (Kenya Telco)</option>
                  <option value="Kenya Power (KPLC)">Kenya Power KPLC</option>
                  <option value="Nairobi Water (NCWSC)">Nairobi Water NCWSC</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] mono font-bold uppercase text-slate-600 dark:text-slate-400 block mb-1">
                  Category
                </label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="supermarket">Supermarket Shopping Basket (1,000 KSh / 30K UGX)</option>
                  <option value="telco_data">Mobile Telco Data</option>
                  <option value="water_utility">Clean Water Bill Waiver</option>
                  <option value="electricity">Prepaid Electricity Token</option>
                  <option value="transit_credit">Urban Transit / Ride Credit</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] mono font-bold uppercase text-slate-600 dark:text-slate-400 block mb-1">
                  Face Value & Currency
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={manualFaceValue}
                    onChange={(e) => setManualFaceValue(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                    placeholder="10000"
                  />
                  <input
                    type="text"
                    value={manualCurrency}
                    onChange={(e) => setManualCurrency(e.target.value.toUpperCase())}
                    className="w-20 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-amber-500 text-center"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] mono font-bold uppercase text-slate-600 dark:text-slate-400 block mb-1">
                  Voucher Serial Code *
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="e.g. MTN-2GB-9921-UGX"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] mono font-bold uppercase text-slate-600 dark:text-slate-400 block mb-1">
                  Voucher PIN / Activation Key (Optional)
                </label>
                <input
                  type="text"
                  value={manualPin}
                  onChange={(e) => setManualPin(e.target.value)}
                  placeholder="e.g. 482910"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] mono font-bold uppercase text-slate-600 dark:text-slate-400 block mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={manualExpiry}
                  onChange={(e) => setManualExpiry(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] mono font-bold uppercase text-slate-600 dark:text-slate-400 block mb-1">
                  Sponsoring Entity / Contractor
                </label>
                <input
                  type="text"
                  value={manualSponsor}
                  onChange={(e) => setManualSponsor(e.target.value)}
                  placeholder="e.g. Seyani Brothers Construction Ltd"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] mono font-bold uppercase text-slate-600 dark:text-slate-400 block mb-1">
                  Sponsor Category
                </label>
                <select
                  value={manualSponsorType}
                  onChange={(e) => setManualSponsorType(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="citizen_patron">Citizen Patron / Diaspora Community Service (CSR)</option>
                  <option value="corporate_csr">Corporate Telecom & Private Sector Partner</option>
                  <option value="contractor">Lead Works Contractor (CSR Budget)</option>
                  <option value="authority">Public Authority / Ministry (Defect Budget)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider mono transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Plus size={16} />
              <span>{isUploading ? 'Depositing...' : 'Deposit Pre-Funded BYOV Voucher to Vault (0% Trial Fee)'}</span>
            </button>
          </form>
        )}

        {/* TAB 4: CITIZEN SELF-REDEMPTION STORE (REDEEM CIVICSCORE XP) */}
        {activeTab === 'redeem_xp' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mono">
                    Citizen Self-Redemption Store · Earned Civic Stewardship
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold">
                    Anti-Farming Guardrails Active
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl">
                  Active citizens don&apos;t have to wait for an official to manually reward them. Redeem your earned <strong>CivicScore XP</strong> directly for unassigned utility vouchers in the Sovereign Escrow Vault.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-500 dark:text-slate-400 mono">
                  <span>• Transit Pass: <strong>100 XP</strong></span>
                  <span>• Mobile Data Pack: <strong>150 XP</strong></span>
                  <span>• Supermarket 1,000 KSh Basket: <strong>175 XP</strong></span>
                  <span>• Water / Power Token: <strong>200 XP</strong></span>
                  <span>• Cooldown Limit: <strong>Max 1 Claim / 7 Days</strong></span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-indigo-500/30 text-right shrink-0 space-y-1.5">
                <div className="text-[10px] mono uppercase text-slate-400 font-bold">Your Verified Balance</div>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mono">
                  {citizenXp} <span className="text-xs font-bold">Civic XP</span>
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const uid = user?.id || 'usr-9028-UG';
                      addPoints(uid, 150, '+150 Civic XP · Sandbox Field Evidence Verification Grant');
                    }}
                    className="px-2 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold transition cursor-pointer"
                  >
                    +150 XP Sandbox Boost
                  </button>
                  {cooldownInfo.onCooldown && (
                    <button
                      type="button"
                      onClick={() => {
                        const uid = user?.id || 'usr-9028-UG';
                        setLastXpRedeemIso(null);
                        try {
                          localStorage.removeItem(`cd_last_xp_redeem_${uid}`);
                        } catch {
                          // ignore
                        }
                        toast('7-Day Anti-Farming Cooldown reset for sandbox testing.', 'emerald');
                      }}
                      className="px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 text-[10px] font-bold transition cursor-pointer"
                    >
                      Reset 7d Cooldown
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Revealed Voucher Card after Citizen Self-Redemption */}
            {redeemedVoucherCard && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 space-y-3 animate-fade-in">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        Field Cost Reimbursement Voucher Unlocked
                      </div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
                        {redeemedVoucherCard.reimbursementFraming || 'Field Evidence Cost Reimbursement'} · Sponsored by {redeemedVoucherCard.sponsoredBy}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRedeemedVoucherCard(null)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Dismiss
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-white dark:bg-slate-950 border border-emerald-500/30 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block mono uppercase">Voucher Serial Code</span>
                    <span className="font-mono font-black text-sm text-amber-600 dark:text-amber-400">{redeemedVoucherCard.voucherCode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mono uppercase">Secret Activation PIN</span>
                    <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">{redeemedVoucherCard.pin || 'AUTO-APPLIED'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mono uppercase">1-Click USSD Dialer</span>
                    <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">{redeemedVoucherCard.redemptionUssdString || '*165#'}</span>
                  </div>
                </div>

                <div className="text-[10.5px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
                  <span>
                    <strong>Ethical Non-Interference Guarantee:</strong> Redeeming this utility voucher never alters your vote or right to dispute any unresolved ticket on CivicDuty.
                  </span>
                </div>
              </div>
            )}

            {/* Available Escrow Vouchers for Citizen XP Redemption */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {vouchers
                .filter((v) => v.country.toUpperCase() === selectedCountry.toUpperCase() && v.status === 'escrow_unassigned')
                .map((v) => {
                  const xpCost = getXpCostForCategory(v.category);
                  const canAfford = citizenXp >= xpCost && !cooldownInfo.onCooldown;
                  return (
                    <div
                      key={v.id}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex flex-col justify-between gap-3 hover:border-indigo-500/40 transition-all"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 text-xs font-black text-slate-900 dark:text-white">
                            {getCategoryIcon(v.category)}
                            <span>{v.brand}</span>
                          </span>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-black mono ${
                              v.isDemo
                                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {v.isDemo ? 'DEMO TOKEN' : 'LIVE ESCROW'}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{v.title}</div>
                        {v.packagedItems && v.packagedItems.length > 0 && (
                          <div className="text-[10px] text-slate-600 dark:text-slate-300 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-2 py-1 leading-snug">
                            <span className="font-mono font-bold text-[9px] uppercase text-rose-600 dark:text-rose-400">Packaged Items: </span>
                            {v.packagedItems.join(' · ')}
                          </div>
                        )}
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                          {v.reimbursementFraming || 'Field Evidence Cost Reimbursement'}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          Sponsored by: <strong className="text-slate-700 dark:text-slate-300">{v.sponsoredBy}</strong>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[9px] text-slate-400 block mono uppercase">Face Value / Cost</span>
                          <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
                            {v.currency} {v.faceValue.toLocaleString()} · <span className="text-indigo-600 dark:text-indigo-400">{xpCost} XP</span>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCitizenSelfRedeem(v)}
                          disabled={!canAfford}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition cursor-pointer ${
                            canAfford
                              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xs'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {cooldownInfo.onCooldown
                            ? `Cooldown (${cooldownInfo.daysLeft}d)`
                            : citizenXp < xpCost
                            ? `Need ${xpCost} XP`
                            : `Redeem (${xpCost} XP)`}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 5: CSR LEADERBOARD & VERIFIABLE CERTIFICATES */}
        {activeTab === 'csr_leaderboard' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-teal-600 dark:text-teal-400" />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Community Patrons &amp; Corporate CSR Impact Leaderboard ({selectedCountry})
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl">
                  Public recognition for engineering contractors, telecom sponsors, government ministries, and diaspora patrons funding citizen field cost reimbursements. Sponsors can generate a <strong>SHA-256 Verifiable CSR Impact Certificate</strong> for ESG &amp; public tender compliance.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {sponsorLeaderboard.map((sp, idx) => (
                <div
                  key={sp.sponsorName}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-teal-500/40 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs mono shrink-0 ${
                        idx === 0
                          ? 'bg-amber-500 text-slate-950'
                          : idx === 1
                          ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white'
                          : 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30'
                      }`}
                    >
                      #{idx + 1}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-900 dark:text-white">{sp.sponsorName}</span>
                        <span className="text-[9px] mono uppercase px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                          {sp.sponsorType.replace('_', ' ')}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
                          100% Ethical Non-Interference Sealed
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {sp.projects.length > 0
                          ? `Target Works: ${sp.projects.join(' · ')}`
                          : 'General Municipal Civic Watchdog & Field Reimbursement Pool'}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Audit Seal: {sp.certHash}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-800">
                    <div className="text-right">
                      <div className="text-[10px] mono uppercase text-slate-400">Total Escrow Funded</div>
                      <div className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                        {sp.currency} {sp.totalFaceValue.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {sp.totalVouchers} vouchers ({sp.dispatchedCount} dispatched)
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveCsrCertSponsor(sp)}
                      className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black flex items-center gap-1.5 shadow-2xs transition cursor-pointer shrink-0"
                    >
                      <Printer size={13} />
                      <span>CSR Certificate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: QUICK SEED CSR PACKS */}
        {activeTab === 'packs' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              One-click pre-load certified batches for sandbox demonstration and live field tests in [{selectedCountry}]:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="p-3.5 rounded-xl border border-rose-500/40 bg-[#f8f9fa] dark:bg-[#0e1116] space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                    <ShoppingBag size={15} />
                    <span>5x 1,000 KSh Supermarket</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {selectedCountry === 'KE' ? 'Naivas / Carrefour 1,000 KSh' : 'Quality / Carrefour 30K UGX (1,000 KSh)'} basket: Unga, Oil, Sugar, Rice, Soap &amp; Milk.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSeedPack('supermarket')}
                  disabled={isUploading}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Deposit 5x 1,000 KSh Basket
                </button>
              </div>

              <div className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
                    <Smartphone size={15} className="text-amber-500" />
                    <span>5x Telco 2GB Data Packs</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Sponsored by Seyani Brothers CSR Allocation. Pre-funded for citizen project watchdogs.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSeedPack('mtn')}
                  disabled={isUploading}
                  className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Deposit 5x Data Pack
                </button>
              </div>

              <div className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
                    <Droplet size={15} className="text-cyan-500" />
                    <span>3x Water Utility Tokens</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    National Water leak &amp; pipe-burst whistleblower reimbursement pool.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSeedPack('nwsc')}
                  disabled={isUploading}
                  className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Deposit 3x Water Pack
                </button>
              </div>

              <div className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
                    <Zap size={15} className="text-yellow-500" />
                    <span>3x Prepaid Power Units</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Ministry of Energy prepaid electricity tokens for streetlight &amp; grid audits.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSeedPack('yaka')}
                  disabled={isUploading}
                  className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Deposit 3x Power Pack
                </button>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-[#f8f9fa] dark:bg-[#0e1116] space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                    <Bike size={15} />
                    <span>5x Boda Fuel &amp; Ride Pool</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    SafeBoda &amp; Stage Scout fuel/transit credits for verified road safety reports.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSeedPack('boda')}
                  disabled={isUploading}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Deposit 5x Boda Bounty
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Escrow Inventory Ledger */}
      <div className="p-4 rounded-xl space-y-3 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Ticket size={18} className="text-amber-500" />
              Sovereign Perk Inventory Ledger ({filteredVouchers.length})
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Complete cryptographic register of pre-funded tokens, escrow statuses, and recipient delivery receipts.
            </p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search code, brand, sponsor..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-500 w-48 sm:w-56"
              />
            </div>

            <select
              value={filterVaultKind}
              onChange={(e) => setFilterVaultKind(e.target.value as 'all' | VaultKind)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All 5 Vaults</option>
              <option value="parish_vault">1. Parish Vault</option>
              <option value="provider_vault">2. Private Provider (Shop) Vault</option>
              <option value="contractor_vault">3. Contractor Watchdog Vault</option>
              <option value="scout_bounty_vault">4. Scout &amp; Bodaboda Vault</option>
              <option value="individual_vault">5. Individual Citizen Vault</option>
            </select>

            <select
              value={filterDemoMode}
              onChange={(e) => setFilterDemoMode(e.target.value as 'all' | 'live' | 'demo')}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Modes (LIVE + DEMO)</option>
              <option value="live">LIVE Sponsor Vouchers Only</option>
              <option value="demo">DEMO Showcase Vouchers Only</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="escrow_unassigned">Unassigned (In Escrow)</option>
              <option value="dispatched">Dispatched to Citizen</option>
              <option value="redeemed">Redeemed</option>
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        {filteredVouchers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Ticket size={32} className="mx-auto text-slate-300 dark:text-slate-600" />
            <div className="text-xs">No vouchers matching the current filters.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] mono uppercase text-slate-400 tracking-wider">
                  <th className="py-2.5 px-3">Voucher Serial Code</th>
                  <th className="py-2.5 px-3">Utility Brand</th>
                  <th className="py-2.5 px-3">Face Value</th>
                  <th className="py-2.5 px-3">Vault &amp; Jurisdiction Scope</th>
                  <th className="py-2.5 px-3">Escrow Status</th>
                  <th className="py-2.5 px-3">Recipient / Dispatch</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredVouchers.map((v) => {
                  const isUnassigned = v.status === 'escrow_unassigned';
                  return (
                    <tr key={v.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-950/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {getCategoryIcon(v.category)}
                          <span>{v.voucherCode}</span>
                          <span
                            className={`text-[8.5px] px-1.5 py-0.2 rounded-full font-black uppercase ${
                              v.isDemo
                                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {v.isDemo ? 'DEMO' : 'LIVE'}
                          </span>
                        </div>
                        {v.pin && (
                          <div className="text-[9px] text-slate-400 font-normal">
                            PIN: <span className="font-mono">{v.pin}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{v.brand}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{v.title}</div>
                        {v.packagedItems && v.packagedItems.length > 0 && (
                          <div className="text-[9.5px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                            <span className="font-mono font-bold text-rose-600 dark:text-rose-400">Packaged: </span>
                            {v.packagedItems.join(' · ')}
                          </div>
                        )}
                        <div className="text-[9px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                          {v.reimbursementFraming || 'Field Evidence Cost Reimbursement'}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        <div>{v.currency} {v.faceValue.toLocaleString()}</div>
                        {v.commissionBreakdown && (
                          <div className="text-[8.5px] text-slate-400 font-normal">
                            {(v.commissionBreakdown as any).csrEscrowFee > 0 || v.commissionBreakdown.csrPlatformFee > 0
                              ? `+10% CSR Fee · 6% Spread`
                              : `BYOV 0% Trial Fee`}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 max-w-xs space-y-0.5">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 uppercase">
                            {(v.vaultType || (v.category === 'transit_credit' ? 'scout_bounty_vault' : v.sponsorType === 'contractor' ? 'contractor_vault' : v.sponsorType === 'authority' ? 'parish_vault' : 'provider_vault')).replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                          {v.jurisdictionLabel || v.projectName || v.sponsoredBy}
                        </div>
                        <div className="text-[9.5px] text-slate-400 truncate">
                          Sponsor: {v.sponsoredBy}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {isUnassigned ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            In Escrow Vault
                          </span>
                        ) : v.status === 'dispatched' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 size={10} />
                            Dispatched
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-500/15 text-slate-700 dark:text-slate-300">
                            Redeemed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {v.dispatchedTo ? (
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 text-[11px] flex items-center gap-1 flex-wrap">
                              <span>{v.dispatchedTo.recipientName}</span>
                              {(v.rankedSlot || v.dispatchedTo.rankedSlot) && (
                                <span className="text-[8.5px] font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                  Locked Rank #{v.rankedSlot || v.dispatchedTo.rankedSlot}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] mono text-slate-500">
                              {v.dispatchedTo.recipientContact}
                            </div>
                            <div className="text-[8.5px] text-emerald-600 dark:text-emerald-400 font-bold">
                              SMS Delivered · {v.dispatchedTo.dispatchedBy?.slice(0, 28)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">Unclaimed</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(v.voucherCode);
                              toast(`Copied ${v.voucherCode} to clipboard!`, 'emerald');
                            }}
                            title="Copy Voucher Code"
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                          >
                            <Copy size={13} />
                          </button>

                          {v.redemptionUssdString && (
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(v.redemptionUssdString || '');
                                toast(`Copied USSD string ${v.redemptionUssdString}!`, 'emerald');
                              }}
                              title="Copy USSD String"
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 transition-colors"
                            >
                              <Smartphone size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PRINTABLE VERIFIABLE CSR IMPACT CERTIFICATE MODAL */}
      {activeCsrCertSponsor && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveCsrCertSponsor(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border-2 border-teal-500/50 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl text-slate-900 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase mono bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                    ISO 26000 &amp; Public Procurement ESG Compliance
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase mono bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    Cryptographically Verified
                  </span>
                </div>
                <h3 className="text-lg font-black tracking-tight mt-1">
                  CivicDuty Sovereign CSR &amp; Community Service Impact Certificate
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Official proof of ethical community field-cost reimbursement &amp; civic accountability sponsorship.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveCsrCertSponsor(null)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold"
              >
                Close
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-xs text-slate-500 uppercase mono font-bold">Certifying Sponsoring Entity</div>
              <div className="text-xl font-black text-teal-700 dark:text-teal-300">
                {activeCsrCertSponsor.sponsorName}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block mono uppercase">Total Escrow Funded</span>
                  <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                    {activeCsrCertSponsor.currency} {activeCsrCertSponsor.totalFaceValue.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mono uppercase">Utility Vouchers Pooled</span>
                  <span className="font-mono font-black text-sm">
                    {activeCsrCertSponsor.totalVouchers} Vouchers ({activeCsrCertSponsor.dispatchedCount} Dispatched)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mono uppercase">Jurisdiction</span>
                  <span className="font-bold">
                    [{selectedCountry}] {COUNTRIES[selectedCountry]?.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1.5">
              <div className="font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Scale size={14} />
                <span>Ethical Non-Interference &amp; Anti-Bribery Attestation</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                This certifies that 100% of the utility tokens funded by <strong>{activeCsrCertSponsor.sponsorName}</strong> were held in blind cryptographic escrow and disbursed strictly as <em>Citizen Field Evidence Cost Reimbursements</em>. No voucher was conditioned on closing, muting, or suppressing any public infrastructure defect report.
              </p>
              <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 pt-1">
                SHA-256 Registry Seal: {activeCsrCertSponsor.certHash} · Issued {new Date().toISOString().slice(0, 10)}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `CivicDuty CSR Impact Certificate | Sponsor: ${activeCsrCertSponsor.sponsorName} | Total Escrowed: ${activeCsrCertSponsor.currency} ${activeCsrCertSponsor.totalFaceValue.toLocaleString()} (${activeCsrCertSponsor.totalVouchers} Vouchers) | Seal: ${activeCsrCertSponsor.certHash}`
                  );
                  toast('Copied verifiable CSR certificate digest to clipboard!', 'emerald');
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy size={13} />
                <span>Copy Audit Digest</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer size={14} />
                <span>Print / Save CSR PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
