import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  EscrowPerkVoucher,
  CountryCode,
  VaultKind,
  MerchantProductService,
  MARKETPLACE_CATEGORIES,
} from '../types';
import { COUNTRIES, TERRITORY } from '../data/countries';
import { copyToClipboard } from '../utils/helpers';
import {
  savePerkVoucherBatchToCloud,
  savePerkVoucherToCloud,
  saveGatewayTransactionToCloud,
} from '../services/firestoreSync';
import { FrontlineStageExplorer } from '../components/FrontlineStageExplorer';
import {
  FrontlineStage,
  STAGES_UPDATED_EVENT,
  getStoredStages,
  getUserActiveStage,
  exitStageGroup,
} from '../data/stageEstablishment';
import { getStoredMerchantProducts } from '../data/merchantLoyaltyData';
import {
  getCountryPerkProfile,
  convertUsdToLocal,
  getLocalizedMerchantProductsForCountry,
  getLocalizedSandboxVouchersForCountry,
} from '../data/countryCurrency';
import { VoucherPassModal } from '../components/VoucherPassModal';
import { getCountryGovernanceSchema } from '../data/countryGovernance';
import { SearchableSelect } from '../components/SearchableSelect';
import {
  Gift,
  ShieldCheck,
  CheckCircle2,
  Ticket,
  Search,
  Zap,
  Droplet,
  Smartphone,
  Bike,
  Car,
  Stethoscope,
  GraduationCap,
  HardHat,
  Copy,
  CreditCard,
  Wallet,
  Phone,
  Award,
  MapPin,
  Store,
  Users,
  Send,
  QrCode,
  Fuel,
  Utensils,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  Building2,
  ArrowRight,
  Clock,
  RotateCcw,
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
    defaultBrand: 'Fresh Produce & Utility Pack',
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
    defaultBrand: 'Clean Water & Supermarket Shopping',
    icon: Users,
    badgeClass: 'text-teal-700 dark:text-teal-300 bg-teal-500/15 border-teal-500/30',
    professionFilter: ['resident', 'commuter', 'citizen', 'neighbourhood'],
  },
];

export function getLowestUnitVaultMeta(countryCode: string) {
  switch (countryCode) {
    case 'KE':
    case 'NG':
    case 'ZA':
    case 'ZM':
    case 'ZW':
    case 'TZ':
      return {
        unitName: 'Ward',
        unitPlural: 'Wards',
        vaultTitle: 'Ward Champions',
        subtitle: 'Monthly Ward Top-3',
        badge: 'Monthly · Ward Admin',
        officerTitle: 'Ward Administrator',
        desc: 'Open to community sponsors. Evaluates verified residents all month and splits pool evenly across the Top 3 via Ward Administrator.',
      };
    case 'GH':
      return {
        unitName: 'Unit Committee',
        unitPlural: 'Unit Committees',
        vaultTitle: 'Unit Committee Champions',
        subtitle: 'Monthly Electoral Area Top-3',
        badge: 'Monthly · Assembly Member',
        officerTitle: 'Assembly Member',
        desc: 'Open to community sponsors. Evaluates verified residents all month and splits pool evenly across the Top 3 via Assembly Member.',
      };
    case 'RW':
      return {
        unitName: 'Cell (Akagari)',
        unitPlural: 'Cells (Utugari)',
        vaultTitle: 'Cell Champions',
        subtitle: 'Monthly Cell Top-3',
        badge: 'Monthly · Cell Executive',
        officerTitle: 'Cell Executive Secretary',
        desc: 'Open to community sponsors. Evaluates verified residents all month and splits pool evenly across the Top 3 via Cell Executive Secretary.',
      };
    case 'US':
      return {
        unitName: 'Precinct',
        unitPlural: 'Precincts',
        vaultTitle: 'Precinct Champions',
        subtitle: 'Monthly Precinct Top-3',
        badge: 'Monthly · Precinct Commissioner',
        officerTitle: 'Ward / Precinct Commissioner',
        desc: 'Open to community sponsors. Evaluates verified residents all month and splits pool evenly across the Top 3.',
      };
    case 'GB':
      return {
        unitName: 'Ward',
        unitPlural: 'Wards',
        vaultTitle: 'Ward Champions',
        subtitle: 'Monthly Ward Top-3',
        badge: 'Monthly · Ward Councillor',
        officerTitle: 'Ward Councillor',
        desc: 'Open to community sponsors. Evaluates verified residents all month and splits pool evenly across the Top 3 via Ward Councillor.',
      };
    case 'IN':
      return {
        unitName: 'Panchayat',
        unitPlural: 'Panchayats',
        vaultTitle: 'Panchayat Champions',
        subtitle: 'Monthly Panchayat Top-3',
        badge: 'Monthly · Gram Secretary',
        officerTitle: 'Gram Panchayat Secretary',
        desc: 'Open to community sponsors. Evaluates verified residents all month and splits pool evenly across the Top 3 via Gram Panchayat Secretary.',
      };
    case 'FR':
      return {
        unitName: 'Commune',
        unitPlural: 'Communes',
        vaultTitle: 'Champions de Commune',
        subtitle: 'Top-3 Mensuel',
        badge: 'Mensuel · Maire',
        officerTitle: 'Maire de Commune',
        desc: 'Ouvert aux donateurs locaux. Récompense chaque mois les 3 premiers résidents vérifiés.',
      };
    case 'PH':
      return {
        unitName: 'Barangay',
        unitPlural: 'Barangays',
        vaultTitle: 'Barangay Champions',
        subtitle: 'Monthly Barangay Top-3',
        badge: 'Monthly · Barangay Captain',
        officerTitle: 'Barangay Captain',
        desc: 'Open to community sponsors. Evaluates verified residents all month and splits pool evenly across the Top 3 via Barangay Captain.',
      };
    case 'UG':
      return {
        unitName: 'Parish',
        unitPlural: 'Parishes',
        vaultTitle: 'Parish Champions',
        subtitle: 'Monthly Parish Top-3',
        badge: 'Monthly · Parish Chief',
        officerTitle: 'Parish Chief',
        desc: 'Open to community sponsors. Evaluates verified residents all month and splits pool evenly across the Top 3 via Parish Chief.',
      };
    default: {
      const gov = getCountryGovernanceSchema(countryCode || 'UG');
      return {
        unitName: gov.tier1UnitLabel,
        unitPlural: gov.tier1Plural,
        vaultTitle: `${gov.tier1UnitLabel} Champions`,
        subtitle: `Monthly ${gov.tier1UnitLabel} Top-3`,
        badge: `Monthly · ${gov.tier1Short}`,
        officerTitle: gov.tier1Short,
        desc: `Open to community sponsors. Evaluates verified residents all month and splits pool evenly across the Top 3 via ${gov.tier1Short}.`,
      };
    }
  }
}

type UnifiedShopCategoryId =
  | 'all'
  | 'fuel_transport'
  | 'groceries_food'
  | 'telecom_data'
  | 'water_solar'
  | 'health_pharmacy'
  | 'personal_care';

const UNIFIED_SHOP_CATEGORIES: Array<{
  id: UnifiedShopCategoryId;
  label: string;
  icon: any;
}> = [
  { id: 'all', label: 'All Categories', icon: Ticket },
  { id: 'fuel_transport', label: 'Fuel & Transport', icon: Fuel },
  { id: 'groceries_food', label: 'Groceries & Food', icon: Utensils },
  { id: 'telecom_data', label: 'Telecom & 5G Data', icon: Smartphone },
  { id: 'water_solar', label: 'Clean Water & Solar', icon: Droplet },
  { id: 'health_pharmacy', label: 'Health & Pharmacy', icon: Stethoscope },
  { id: 'personal_care', label: 'Personal Care & Craft', icon: Sparkles },
];

function mapMerchantCategoryToUnified(prod: MerchantProductService): UnifiedShopCategoryId {
  const cat = (prod.category || '').toLowerCase();
  const hay = `${prod.title} ${prod.merchantName} ${prod.rewardHeadline}`.toLowerCase();
  if (cat === 'automotive_motorbikes' || hay.includes('fuel') || hay.includes('boda') || hay.includes('transport') || hay.includes('service')) {
    return 'fuel_transport';
  }
  if (cat === 'groceries_consumables' || hay.includes('café') || hay.includes('cafe') || hay.includes('coffee') || hay.includes('dining') || hay.includes('supermarket') || hay.includes('food')) {
    return 'groceries_food';
  }
  if (cat === 'services_digital_products' || hay.includes('data') || hay.includes('mtn') || hay.includes('airtel') || hay.includes('safaricom')) {
    return 'telecom_data';
  }
  if (cat === 'home_living' || cat === 'agriculture_industrial' || hay.includes('solar') || hay.includes('water') || hay.includes('power') || hay.includes('yaka')) {
    return 'water_solar';
  }
  if (cat === 'health_wellness' || hay.includes('pharmacy') || hay.includes('clinic') || hay.includes('health')) {
    return 'health_pharmacy';
  }
  return 'personal_care';
}

function mapEscrowCategoryToUnified(vch: EscrowPerkVoucher): UnifiedShopCategoryId {
  if (vch.category === 'transit_credit') return 'fuel_transport';
  if (vch.category === 'supermarket') return 'groceries_food';
  if (vch.category === 'telco_data') return 'telecom_data';
  if (vch.category === 'water_utility' || vch.category === 'electricity') return 'water_solar';
  return 'personal_care';
}

export const PerkVaultView: React.FC = () => {
  const {
    user,
    posts,
    profiles,
    addPoints,
    go,
    toast,
    logAudit,
    selectedCountry: ctxCountry,
    showDemos,
    perkTab,
    setPerkTab,
    openDeskPerksVaults,
  } = useApp();

  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    (user?.country || ctxCountry || 'UG') as CountryCode
  );

  useEffect(() => {
    const nextC = (user?.country || ctxCountry || 'UG') as CountryCode;
    if (nextC && nextC !== selectedCountry) {
      setSelectedCountry(nextC);
    }
  }, [user?.country, ctxCountry, selectedCountry]);

  const perkProfile = useMemo(() => getCountryPerkProfile(selectedCountry), [selectedCountry]);
  const lowestMeta = useMemo(() => getLowestUnitVaultMeta(selectedCountry), [selectedCountry]);

  const userHomeParish = useMemo(() => {
    if (user?.parish && (!user?.country || user.country === selectedCountry)) {
      return user.parish;
    }
    if (user?.scope_label && (!user?.country || user.country === selectedCountry)) {
      return user.scope_label;
    }
    return perkProfile.defaultParish;
  }, [user?.parish, user?.scope_label, user?.country, selectedCountry, perkProfile.defaultParish]);

  // Role check for subtle institutional redirect banner
  const isPrivateProviderOrContractor = Boolean(
    user &&
      (user.entity_type === 'non_government_entity' ||
        user.entity_category === 'private_contractor' ||
        user.entity_category === 'utility_telecom' ||
        user.entity_category === 'commercial_enterprise' ||
        Boolean(user.dept?.startsWith('ent-')) ||
        Boolean(user.branch_id))
  );
  const isGovDeskUser = Boolean(
    user &&
      ['node_admin', 'platform_admin', 'spokesperson'].includes(user.role) &&
      !isPrivateProviderOrContractor
  );

  // Vouchers & Merchant Offers State
  const [vouchers, setVouchers] = useState<EscrowPerkVoucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [merchantProducts] = useState<MerchantProductService[]>(() => getStoredMerchantProducts());

  // Wallet & Pass Modal
  const [passModalVoucher, setPassModalVoucher] = useState<EscrowPerkVoucher | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState<boolean>(false);

  // Redeem Points & Shops Filters
  const [shopSearch, setShopSearch] = useState<string>('');
  const [shopCategory, setShopCategory] = useState<UnifiedShopCategoryId>('all');
  const [parishOnlyFilter, setParishOnlyFilter] = useState<boolean>(false);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [lastXpRedeemIso, setLastXpRedeemIso] = useState<string | null>(() => {
    try {
      return localStorage.getItem(`cd_last_xp_redeem_${user?.id || 'usr-9028-UG'}`);
    } catch {
      return null;
    }
  });

  // Community Pools & Tipping State (Strictly Citizen/Community Pools: Parish, Frontline Scouts, Tip a Citizen)
  const [communityPoolTab, setCommunityPoolTab] = useState<
    'parish_vault' | 'scout_bounty_vault' | 'individual_vault'
  >(() => {
    try {
      const requested = sessionStorage.getItem('cd_open_community_pool');
      if (requested === 'scout_bounty_vault' || requested === 'parish_vault' || requested === 'individual_vault') {
        sessionStorage.removeItem('cd_open_community_pool');
        return requested;
      }
    } catch {}
    return 'parish_vault';
  });
  const [myActiveStageInfo, setMyActiveStageInfo] = useState(() =>
    getUserActiveStage(user?.id || 'usr-9028-UG', user?.name || 'Citizen Observer')
  );
  const [countryStageCount, setCountryStageCount] = useState(() =>
    getStoredStages().filter((s) => s.country === selectedCountry).length
  );

  useEffect(() => {
    const syncStageState = () => {
      setMyActiveStageInfo(
        getUserActiveStage(user?.id || 'usr-9028-UG', user?.name || 'Citizen Observer')
      );
      setCountryStageCount(getStoredStages().filter((s) => s.country === selectedCountry).length);
    };
    syncStageState();
    window.addEventListener(STAGES_UPDATED_EVENT, syncStageState);
    return () => window.removeEventListener(STAGES_UPDATED_EVENT, syncStageState);
  }, [user?.id, user?.name, selectedCountry]);

  const handleOpenComposeForStage = (stage?: FrontlineStage) => {
    try {
      if (stage) {
        sessionStorage.setItem(
          'cd_prefill_workstation_stage',
          JSON.stringify({
            id: stage.id,
            name: stage.name,
            category: stage.category,
            parish: stage.parish,
          })
        );
      }
    } catch {}
    go('compose');
  };
  const [selectedParish, setSelectedParish] = useState<string>(() => userHomeParish);
  const [selectedAwardMonth, setSelectedAwardMonth] = useState<'2026-10' | '2026-09' | '2026-08'>('2026-10');
  const [selectedScoutCorridor, setSelectedScoutCorridor] = useState<string>(
    perkProfile.corridors[0]?.id || 'corridor_central'
  );
  const [selectedScoutProfession, setSelectedScoutProfession] = useState<string>('boda');

  // Tip a Citizen Form State
  const [tipTargetPostId, setTipTargetPostId] = useState<string>('');
  const [tipRecipientName, setTipRecipientName] = useState<string>(perkProfile.sampleRecipientName);
  const [tipRecipientPhone, setTipRecipientPhone] = useState<string>(perkProfile.samplePhone);
  const [tipCitationNote, setTipCitationNote] = useState<string>(
    'Thank you for documenting and verifying this community issue.'
  );
  const [isTipping, setIsTipping] = useState<boolean>(false);
  const [tipReceipt, setTipReceipt] = useState<{
    name: string;
    code: string;
    brand: string;
    faceValue: number;
    currency: string;
  } | null>(null);

  // Collapsible Patron Pool Support Drawer
  const [showPatronDrawer, setShowPatronDrawer] = useState<boolean>(false);
  const [payPackage, setPayPackage] = useState<'mtn_5' | 'supermarket_1000ksh_5' | 'safeboda_10' | 'nwsc_5' | 'yaka_5'>('mtn_5');
  const [payMethod, setPayMethod] = useState<'momo' | 'airtel' | 'mpesa' | 'card'>('momo');
  const [payPhone, setPayPhone] = useState<string>(perkProfile.samplePhone);
  const [paySponsorName, setPaySponsorName] = useState<string>(
    user?.name ? `${user.name} (Civic Patron)` : perkProfile.sampleSponsor
  );
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [paymentReceipt, setPaymentReceipt] = useState<{
    ref: string;
    amount: number;
    currency: string;
    count: number;
    poolLabel: string;
  } | null>(null);

  // Parish Options
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
    terrNodes.forEach((d: any) => {
      (d.children || []).forEach((sc: any) => {
        (sc.children || []).forEach((par: any) => {
          if (par.name) fromTree.push(par.name);
        });
      });
    });
    const combined = Array.from(new Set([perkProfile.defaultParish, ...fromPosts, ...fromTree]));
    return combined.length > 0 ? combined : [perkProfile.defaultParish];
  }, [posts, selectedCountry, perkProfile.defaultParish]);

  useEffect(() => {
    setSelectedParish(userHomeParish);
    setPayPhone(perkProfile.samplePhone);
    setTipRecipientName(perkProfile.sampleRecipientName);
    setTipRecipientPhone(perkProfile.samplePhone);
    setPaySponsorName(user?.name ? `${user.name} (Civic Patron)` : perkProfile.sampleSponsor);
    setPaymentReceipt(null);
    setTipReceipt(null);
    if (perkProfile.corridors[0]?.id) {
      setSelectedScoutCorridor(perkProfile.corridors[0].id);
    }
  }, [selectedCountry, perkProfile, userHomeParish, user?.name]);

  // Load Vault Vouchers
  useEffect(() => {
    let active = true;
    const loadVaultData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/perks/vault?country=${selectedCountry}`);
        const data = await res.json();
        if (!active) return;
        if (data.success && Array.isArray(data.vouchers) && data.vouchers.length > 0) {
          setVouchers(data.vouchers);
        } else {
          setVouchers(getLocalizedSandboxVouchersForCountry(selectedCountry, parishOptions));
        }
      } catch {
        if (active) {
          setVouchers(getLocalizedSandboxVouchersForCountry(selectedCountry, parishOptions));
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadVaultData();
    return () => {
      active = false;
    };
  }, [selectedCountry]);

  // Points & Cooldown
  const currentCitizenProfile = profiles[user?.id || 'usr-9028-UG'] || {
    civic_score: 50,
    rank: 'Observer',
    posts: 2,
    resolved: 1,
  };
  const citizenXp = currentCitizenProfile.civic_score || 0;

  const cooldownInfo = useMemo(() => {
    if (!lastXpRedeemIso) return { onCooldown: false, daysLeft: 0 };
    const elapsedMs = Date.now() - new Date(lastXpRedeemIso).getTime();
    const sevenDaysMs = 7 * 86400000;
    if (elapsedMs < sevenDaysMs) {
      return { onCooldown: true, daysLeft: Math.ceil((sevenDaysMs - elapsedMs) / 86400000) };
    }
    return { onCooldown: false, daysLeft: 0 };
  }, [lastXpRedeemIso]);

  const getXpCostForCategory = (cat: string) => {
    if (cat === 'transit_credit') return 100;
    if (cat === 'telco_data') return 150;
    if (cat === 'supermarket') return 175;
    return 200;
  };

  const getXpCostForMerchantProduct = (prod: MerchantProductService) => {
    if (prod.rewardType === 'discount') return 120;
    if (prod.rewardType === 'freebie') return 140;
    if (prod.rewardType === 'bogo') return 160;
    return 180;
  };

  // Unified Wallet: Escrow/Self-Redeemed Vouchers + Courtesy Vouchers from Official Replies
  const courtesyWalletVouchers: EscrowPerkVoucher[] = useMemo(() => {
    const out: EscrowPerkVoucher[] = [];
    (posts || []).forEach((p) => {
      if (p.country && p.country !== selectedCountry) return;
      (p.comments || []).forEach((c) => {
        if (c.courtesy_voucher) {
          out.push({
            id: `courtesy-${p.id}-${c.id}`,
            voucherCode: c.courtesy_voucher.voucherCode,
            category: 'other',
            brand: c.courtesy_voucher.brand || p.dept?.toUpperCase() || 'Partner Desk',
            title: c.courtesy_voucher.title,
            faceValue: Number(c.courtesy_voucher.faceValue) || 5000,
            currency: c.courtesy_voucher.currency || perkProfile.currency,
            country: selectedCountry,
            sponsoredBy: `${c.courtesy_voucher.brand || 'Verified Desk'} Courtesy Care`,
            sponsorType: 'corporate_csr',
            batchId: 'COURTESY-REPLY',
            status: 'dispatched',
            createdAt: c.created_at || p.created_at,
            expiryDate: '2026-12-31',
            redemptionUssdString: c.courtesy_voucher.ussdCode || perkProfile.ussdDial,
            qrCodeData: c.courtesy_voucher.qrCodeData || c.courtesy_voucher.voucherCode,
            dispatchedTo: {
              recipientName: user?.name || p.citizen_name || 'Verified Citizen',
              recipientContact: user?.phone || perkProfile.samplePhone,
              dispatchedAt: c.created_at || new Date().toISOString(),
              dispatchedBy: `${c.courtesy_voucher.brand || 'Service Desk'} Customer Care`,
              citationNote: c.courtesy_voucher.note || `Official appreciation token on post "${p.title}"`,
              postOrProjectId: p.id,
              smsDeliveryStatus: 'delivered',
              ethicalNonInterferenceAck: true,
            },
          });
        }
      });
    });
    return out;
  }, [posts, selectedCountry, perkProfile.currency, perkProfile.ussdDial, perkProfile.samplePhone, user?.name, user?.phone]);

  const citizenWalletVouchers = useMemo(() => {
    const countryVouchers = vouchers.filter((v) => v.country.toUpperCase() === selectedCountry.toUpperCase());
    const userName = (user?.name || '').toLowerCase();
    const userPhone = (user?.phone || '').replace(/[^0-9]/g, '');

    const userSpecific = countryVouchers.filter((v) => {
      if (v.status !== 'dispatched' && v.status !== 'redeemed') return false;
      if (v.selfRedeemedByCitizen) return true;
      if (!v.dispatchedTo) return false;
      const recName = (v.dispatchedTo.recipientName || '').toLowerCase();
      const recPhone = (v.dispatchedTo.recipientContact || '').replace(/[^0-9]/g, '');
      if (userName && recName && recName.includes(userName)) return true;
      if (userPhone && recPhone && recPhone.includes(userPhone)) return true;
      return false;
    });

    const baseList =
      userSpecific.length > 0
        ? userSpecific
        : countryVouchers.filter((v) => v.status === 'dispatched' || v.status === 'redeemed').slice(0, 4);

    // Combine with courtesy resolution tokens without duplicating voucherCode
    const seenCodes = new Set(baseList.map((v) => v.voucherCode));
    const combined = [...baseList];
    courtesyWalletVouchers.forEach((cv) => {
      if (!seenCodes.has(cv.voucherCode)) {
        seenCodes.add(cv.voucherCode);
        combined.unshift(cv);
      }
    });
    return combined;
  }, [vouchers, selectedCountry, user?.name, user?.phone, courtesyWalletVouchers]);

  // Available Merchant Shop Offers & Escrow Utility Reimbursements for Tab 2
  const filteredMerchantOffers = useMemo(() => {
    const staticCountryList = merchantProducts.filter(
      (p) => p.country.toUpperCase() === selectedCountry.toUpperCase() && p.active
    );
    let list =
      staticCountryList.length > 0
        ? staticCountryList
        : getLocalizedMerchantProductsForCountry(selectedCountry, parishOptions);

    if (shopCategory !== 'all') {
      list = list.filter((p) => mapMerchantCategoryToUnified(p) === shopCategory);
    }
    if (parishOnlyFilter && userHomeParish) {
      const q = userHomeParish.toLowerCase().replace(/parish|ward/g, '').trim();
      if (q) {
        const localMatch = list.filter(
          (p) =>
            (p.parish || '').toLowerCase().includes(q) ||
            (p.district || '').toLowerCase().includes(q)
        );
        if (localMatch.length > 0) list = localMatch;
      }
    }
    if (shopSearch.trim()) {
      const q = shopSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.merchantName.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.rewardHeadline.toLowerCase().includes(q) ||
          (p.parish || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [merchantProducts, selectedCountry, parishOptions, shopCategory, parishOnlyFilter, userHomeParish, shopSearch]);

  const filteredClaimableUtilityVouchers = useMemo(() => {
    return vouchers
      .filter((v) => v.country.toUpperCase() === selectedCountry.toUpperCase() && v.status === 'escrow_unassigned')
      .filter((v) => {
        if (shopCategory !== 'all' && mapEscrowCategoryToUnified(v) !== shopCategory) return false;
        if (shopSearch.trim()) {
          const q = shopSearch.toLowerCase();
          return (
            v.brand.toLowerCase().includes(q) ||
            v.title.toLowerCase().includes(q) ||
            v.sponsoredBy.toLowerCase().includes(q)
          );
        }
        return true;
      });
  }, [vouchers, selectedCountry, shopCategory, shopSearch]);

  // Self-Redeem Utility Escrow Voucher
  const handleCitizenSelfRedeem = async (voucher: EscrowPerkVoucher) => {
    const xpCost = getXpCostForCategory(voucher.category);
    if (cooldownInfo.onCooldown) {
      toast(`Limit 1 redemption every 7 days (${cooldownInfo.daysLeft}d remaining).`, 'amber');
      return;
    }
    if (citizenXp < xpCost) {
      toast(`You need ${xpCost} Civic Points (current: ${citizenXp} pts).`, 'amber');
      return;
    }

    setRedeemingId(voucher.id);
    try {
      const res = await fetch('/api/perks/dispatch-from-vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucherId: voucher.id,
          brand: voucher.brand,
          category: voucher.category,
          recipientName: user?.name || 'Verified Citizen Watchdog',
          recipientContact: user?.phone || perkProfile.samplePhone,
          dispatchedBy: 'Citizen Points Redemption',
          ticketId: `XP-REDEEM-${xpCost}PTS`,
          selfRedeem: true,
          xpSpent: xpCost,
          note: `Redeemed ${xpCost} pts for ${voucher.title}`,
        }),
      });
      const data = await res.json();
      if (data.success && data.voucher) {
        const uid = user?.id || 'usr-9028-UG';
        addPoints(uid, -xpCost, `−${xpCost} Civic pts · Redeemed ${voucher.brand}`);
        const nowIso = new Date().toISOString();
        setLastXpRedeemIso(nowIso);
        try {
          localStorage.setItem(`cd_last_xp_redeem_${uid}`, nowIso);
        } catch {}
        setVouchers((prev) => prev.map((v) => (v.id === data.voucher.id ? data.voucher : v)));
        setPassModalVoucher(data.voucher);
        setIsPassModalOpen(true);
        logAudit('CITIZEN_XP_PERK_REDEEM', data.voucher.id, `Redeemed ${xpCost} pts for ${data.voucher.title}`);
        toast(`Voucher unlocked and added to My Wallet!`, 'emerald');
      } else {
        toast(data.error || 'Could not redeem voucher right now', 'rose');
      }
    } catch {
      toast('Network error while redeeming voucher', 'rose');
    } finally {
      setRedeemingId(null);
    }
  };

  // Redeem Local Merchant Shop Offer directly with Civic Points
  const handleRedeemMerchantOffer = async (prod: MerchantProductService) => {
    const xpCost = getXpCostForMerchantProduct(prod);
    if (cooldownInfo.onCooldown) {
      toast(`Limit 1 redemption every 7 days (${cooldownInfo.daysLeft}d remaining).`, 'amber');
      return;
    }
    if (citizenXp < xpCost) {
      toast(`You need ${xpCost} Civic Points (current: ${citizenXp} pts).`, 'amber');
      return;
    }

    setRedeemingId(prod.id);
    const uid = user?.id || 'usr-9028-UG';
    const rand = Math.floor(1000 + Math.random() * 9000);
    const prefix = prod.merchantName.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'SHOP';
    const code = `${prefix}-${rand}-${selectedCountry}`;
    const newPass: EscrowPerkVoucher = {
      id: `vch-xp-shop-${Date.now()}`,
      voucherCode: code,
      pin: `${Math.floor(100000 + Math.random() * 900000)}`,
      category: prod.category,
      brand: prod.merchantName,
      title: `${prod.merchantName} — ${prod.rewardHeadline}`,
      faceValue: prod.voucherCost,
      currency: prod.currency,
      country: selectedCountry,
      packagedItems: [prod.rewardHeadline, prod.title, `${prod.parish}${prod.district ? `, ${prod.district}` : ''}`],
      sponsoredBy: 'Citizen Points Exchange',
      sponsorType: 'citizen_patron',
      batchId: `XP-SHOP-${Date.now().toString(36).toUpperCase()}`,
      status: 'dispatched',
      createdAt: new Date().toISOString(),
      expiryDate: '2026-12-31',
      selfRedeemedByCitizen: true,
      xpSpent: xpCost,
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
      redemptionUssdString: prod.ussdCode || perkProfile.ussdDial,
      qrCodeData: prod.qrCodePayload || code,
      dispatchedTo: {
        recipientName: user?.name || 'Verified Citizen',
        recipientContact: user?.phone || perkProfile.samplePhone,
        dispatchedAt: new Date().toISOString(),
        dispatchedBy: `${prod.merchantName} Shop Partner`,
        citationNote: `Redeemed ${xpCost} Civic Points at ${prod.merchantName} (${prod.parish})`,
        postOrProjectId: prod.id,
        smsDeliveryStatus: 'delivered',
        ethicalNonInterferenceAck: true,
      },
    };

    try {
      await fetch('/api/perks/upload-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchName: `XP Shop Exchange - ${prod.merchantName}`,
          sponsorName: user?.name || 'Citizen Points Exchange',
          sponsorType: 'citizen_patron',
          country: selectedCountry,
          vouchers: [newPass],
          isDemo: false,
          sourceMethod: 'xp_exchange',
        }),
      }).catch(() => {});
      savePerkVoucherToCloud(newPass).catch(() => {});
      addPoints(uid, -xpCost, `−${xpCost} Civic pts · ${prod.merchantName} (${prod.rewardHeadline})`);
      const nowIso = new Date().toISOString();
      setLastXpRedeemIso(nowIso);
      try {
        localStorage.setItem(`cd_last_xp_redeem_${uid}`, nowIso);
      } catch {}
      setVouchers((prev) => [newPass, ...prev]);
      setPassModalVoucher(newPass);
      setIsPassModalOpen(true);
      logAudit('CITIZEN_XP_MERCHANT_REDEEM', newPass.id, `Redeemed ${xpCost} pts for ${prod.merchantName} (${code})`);
      toast(`Pass ready for ${prod.merchantName}! Saved in My Wallet.`, 'emerald');
    } finally {
      setRedeemingId(null);
    }
  };

  // Community Pools: Live Top-3 Citizen Ranking (Parish / Scouts)
  const countryFeedPosts = useMemo(
    () => posts.filter((p) => p.country === selectedCountry),
    [posts, selectedCountry]
  );

  useEffect(() => {
    if (countryFeedPosts.length > 0 && !tipTargetPostId) {
      const first = countryFeedPosts[0];
      setTipTargetPostId(first.id);
      setTipRecipientName(first.anonymous ? 'Verified Citizen Author' : first.citizen_name);
    }
  }, [countryFeedPosts, tipTargetPostId]);

  const scoutCorridorOptions = useMemo(() => perkProfile.corridors, [perkProfile.corridors]);

  const communityTop3: RankedJurisdictionCitizen[] = useMemo(() => {
    const phonePrefix = `${perkProfile.phonePrefix} `;
    const buildTop3 = (
      matchingPosts: typeof posts,
      seeds: Array<{ name: string; role: string; baseScore: number; reports: number; resolved: number; upvotes: number; reason: string }>
    ): RankedJurisdictionCitizen[] => {
      const map = new Map<
        string,
        { name: string; role: string; reports: number; resolved: number; upvotes: number; score: number; reason: string; postId?: string }
      >();

      matchingPosts.forEach((p) => {
        const name = p.anonymous ? `Verified Resident (#${p.id.slice(-4).toUpperCase()})` : p.citizen_name || 'Citizen Watchdog';
        const ex = map.get(name) || {
          name,
          role: p.author_profession || p.citizen_rank || 'Verified Community Citizen',
          reports: 0,
          resolved: 0,
          upvotes: 0,
          score: 0,
          reason: p.title,
          postId: p.id,
        };
        const isRes = p.status === 'resolved' || p.citizen_satisfied === true || p.category === 'praise';
        ex.reports += 1;
        if (isRes) ex.resolved += 1;
        ex.upvotes += p.upvotes || 0;
        ex.score += 30 + (isRes ? 45 : 0) + (p.upvotes || 0) * 3 + (p.compiled_count || 1) * 8;
        map.set(name, ex);
      });

      const sorted = Array.from(map.values()).sort((a, b) => b.score - a.score);
      for (const s of seeds) {
        if (sorted.length >= 3) break;
        if (!sorted.some((x) => x.name.toLowerCase() === s.name.toLowerCase())) {
          sorted.push({
            name: s.name,
            role: s.role,
            reports: s.reports,
            resolved: s.resolved,
            upvotes: s.upvotes,
            score: s.baseScore,
            reason: s.reason,
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

    if (communityPoolTab === 'parish_vault') {
      const parishPosts = countryFeedPosts.filter(
        (p) =>
          p.territory?.parish?.toLowerCase() === selectedParish.toLowerCase() ||
          p.location?.toLowerCase().includes(selectedParish.toLowerCase().replace(/parish|ward/gi, '').trim())
      );
      return buildTop3(parishPosts, [
        {
          name: selectedCountry === 'KE' ? 'Wanjiku Mwangi' : 'Sarah Namukasa',
          role: `Lead ${lowestMeta.unitName} Citizen · ${selectedParish}`,
          baseScore: 340,
          reports: 6,
          resolved: 4,
          upvotes: 48,
          reason: `Top standing in ${selectedParish} (6 verified reports & 4 community fixes)`,
        },
        {
          name: selectedCountry === 'KE' ? 'Brian Otieno' : 'Ronald Kizza',
          role: `Infrastructure Monitor · ${selectedParish}`,
          baseScore: 285,
          reports: 5,
          resolved: 3,
          upvotes: 36,
          reason: `2nd highest standing in ${selectedParish} (drainage & water audits)`,
        },
        {
          name: selectedCountry === 'KE' ? 'Faith Chepkoech' : 'Grace Akello',
          role: `Community Health Steward · ${selectedParish}`,
          baseScore: 240,
          reports: 4,
          resolved: 3,
          upvotes: 29,
          reason: `3rd highest standing in ${selectedParish} (clinic & lighting verifications)`,
        },
      ]);
    }

    const corrObj = scoutCorridorOptions.find((c) => c.id === selectedScoutCorridor);
    const cLabel = corrObj?.label || 'Transit Road Safety Corridor';
    const profConfig =
      REPORTER_PROFESSION_CATEGORIES.find((p) => p.id === selectedScoutProfession) ||
      REPORTER_PROFESSION_CATEGORIES[0];

    const matchingProfPosts = countryFeedPosts.filter((p) => {
      const profession = (p.author_profession || '').toLowerCase();
      return profConfig.professionFilter.some((fk) => profession.includes(fk));
    });

    return buildTop3(matchingProfPosts, [
      {
        name: selectedCountry === 'KE' ? 'John Macharia (Scout Lead)' : 'Suleiman Wasswa (Road Scout)',
        role: `${profConfig.shortTitle} · ${cLabel}`,
        baseScore: 410,
        reports: 9,
        resolved: 6,
        upvotes: 74,
        reason: `Top verified ${profConfig.name} contributor along ${cLabel}`,
      },
      {
        name: selectedCountry === 'KE' ? 'Mercy Njoroge' : 'Brenda Nakato',
        role: `${profConfig.shortTitle} · ${cLabel}`,
        baseScore: 345,
        reports: 7,
        resolved: 5,
        upvotes: 52,
        reason: `2nd ranked active ${profConfig.name} reporter in ${cLabel}`,
      },
      {
        name: selectedCountry === 'KE' ? 'David Kamau' : 'Robert Ssempijja',
        role: `${profConfig.shortTitle} · ${cLabel}`,
        baseScore: 290,
        reports: 5,
        resolved: 4,
        upvotes: 39,
        reason: `3rd ranked community safety reporter along ${cLabel}`,
      },
    ]);
  }, [
    communityPoolTab,
    countryFeedPosts,
    selectedParish,
    selectedCountry,
    lowestMeta.unitName,
    perkProfile.phonePrefix,
    scoutCorridorOptions,
    selectedScoutCorridor,
    selectedScoutProfession,
  ]);

  // Tip a Citizen Directly (Individual Vault)
  const handleTipCitizen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipRecipientName.trim()) {
      toast('Enter the citizen name to tip', 'amber');
      return;
    }
    setIsTipping(true);
    try {
      const poolMatch = vouchers.find(
        (v) =>
          v.country.toUpperCase() === selectedCountry.toUpperCase() &&
          v.status === 'escrow_unassigned' &&
          (v.vaultType === 'individual_vault' || !v.vaultType)
      );
      const nowIso = new Date().toISOString();
      const faceVal = poolMatch?.faceValue || convertUsdToLocal(3, selectedCountry).amount;
      const code = poolMatch?.voucherCode || `PEER-${Math.floor(1000 + Math.random() * 9000)}-${selectedCountry}`;
      const brand = poolMatch?.brand || perkProfile.telcoBrand;

      const updated: EscrowPerkVoucher = poolMatch
        ? {
            ...poolMatch,
            vaultType: 'individual_vault',
            status: 'dispatched',
            dispatchedTo: {
              recipientName: tipRecipientName.trim(),
              recipientContact: tipRecipientPhone.trim() || perkProfile.samplePhone,
              dispatchedAt: nowIso,
              dispatchedBy: user?.name || 'Civic Patron',
              citationNote: tipCitationNote.trim(),
              postOrProjectId: tipTargetPostId || 'PEER-TIP',
              smsDeliveryStatus: 'delivered',
              ethicalNonInterferenceAck: true,
              vaultType: 'individual_vault',
            },
          }
        : {
            id: `vch-peer-${Date.now()}`,
            voucherCode: code,
            pin: `${Math.floor(100000 + Math.random() * 900000)}`,
            category: 'telco_data',
            brand,
            title: `${brand} Citizen Appreciation Tip`,
            faceValue: faceVal,
            currency: perkProfile.currency,
            country: selectedCountry,
            sponsoredBy: `${user?.name || 'Civic Patron'} (Peer Tip)`,
            sponsorType: 'citizen_patron',
            vaultType: 'individual_vault',
            batchId: `PEER-${Date.now().toString(36).toUpperCase()}`,
            status: 'dispatched',
            createdAt: nowIso,
            expiryDate: '2026-12-31',
            redemptionUssdString: perkProfile.ussdDial,
            dispatchedTo: {
              recipientName: tipRecipientName.trim(),
              recipientContact: tipRecipientPhone.trim() || perkProfile.samplePhone,
              dispatchedAt: nowIso,
              dispatchedBy: user?.name || 'Civic Patron',
              citationNote: tipCitationNote.trim(),
              postOrProjectId: tipTargetPostId || 'PEER-TIP',
              smsDeliveryStatus: 'delivered',
              ethicalNonInterferenceAck: true,
              vaultType: 'individual_vault',
            },
          };

      savePerkVoucherToCloud(updated).catch(() => {});
      setVouchers((prev) => (poolMatch ? prev.map((v) => (v.id === poolMatch.id ? updated : v)) : [updated, ...prev]));
      setTipReceipt({
        name: tipRecipientName.trim(),
        code: updated.voucherCode,
        brand: updated.brand,
        faceValue: updated.faceValue,
        currency: updated.currency,
      });
      logAudit('INDIVIDUAL_VAULT_PEER_DISPATCH', updated.id, `Tipped ${tipRecipientName} (${updated.voucherCode})`);
      toast(`Sent ${updated.brand} tip to ${tipRecipientName.trim()}!`, 'emerald');
    } finally {
      setIsTipping(false);
    }
  };

  // Community Sponsors Leaderboard (Simple Recognition List)
  const communitySponsors = useMemo(() => {
    const map = new Map<string, { name: string; count: number; total: number; currency: string }>();
    vouchers
      .filter((v) => v.country.toUpperCase() === selectedCountry.toUpperCase())
      .forEach((v) => {
        const key = v.sponsoredBy || 'Community Sponsor';
        const ex = map.get(key) || { name: key, count: 0, total: 0, currency: v.currency || perkProfile.currency };
        ex.count += 1;
        ex.total += Number(v.faceValue) || 0;
        map.set(key, ex);
      });
    return Array.from(map.values()).sort((a, b) => b.total - a.total).slice(0, 6);
  }, [vouchers, selectedCountry, perkProfile.currency]);

  // Patron Pool Support Checkout (Collapsible inside Community Pools)
  const patronPackOptions = useMemo(() => {
    const currency = perkProfile.currency;
    const dataUnit = convertUsdToLocal(3, selectedCountry).amount;
    const basketUnit = convertUsdToLocal(8, selectedCountry).amount;
    const transitUnit = convertUsdToLocal(2, selectedCountry).amount;
    const waterUnit = convertUsdToLocal(3, selectedCountry).amount;
    const powerUnit = convertUsdToLocal(4, selectedCountry).amount;
    return [
      { id: 'mtn_5' as const, label: `5× ${perkProfile.telcoBrand} 2GB Field Data`, brand: perkProfile.telcoBrand, category: 'telco_data', qty: 5, unitVal: dataUnit, total: dataUnit * 5, currency },
      { id: 'supermarket_1000ksh_5' as const, label: `5× ${perkProfile.supermarketBrand} Shopping Baskets`, brand: perkProfile.supermarketBrand, category: 'supermarket', qty: 5, unitVal: basketUnit, total: basketUnit * 5, currency },
      { id: 'safeboda_10' as const, label: `10× ${perkProfile.transitBrand} Scout Credits`, brand: perkProfile.transitBrand, category: 'transit_credit', qty: 10, unitVal: transitUnit, total: transitUnit * 10, currency },
      { id: 'nwsc_5' as const, label: `5× ${perkProfile.waterBrand} Clean Water Credits`, brand: perkProfile.waterBrand, category: 'water_utility', qty: 5, unitVal: waterUnit, total: waterUnit * 5, currency },
      { id: 'yaka_5' as const, label: `5× ${perkProfile.powerBrand} Prepaid Power Tokens`, brand: perkProfile.powerBrand, category: 'electricity', qty: 5, unitVal: powerUnit, total: powerUnit * 5, currency },
    ];
  }, [selectedCountry, perkProfile]);

  const handlePatronPoolCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = patronPackOptions.find((p) => p.id === payPackage) || patronPackOptions[0];
    if (payMethod !== 'card' && (!payPhone.trim() || payPhone.length < 9)) {
      toast('Enter a valid mobile money phone number', 'amber');
      return;
    }

    setIsPaying(true);
    try {
      const initRes = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityName: paySponsorName || perkProfile.sampleSponsor,
          invoiceId: `POOL-SUPPORT-${Date.now().toString(36).toUpperCase()}`,
          amount: pkg.total,
          currency: pkg.currency,
          paymentMethod: payMethod === 'momo' ? 'mtn_momo' : payMethod === 'airtel' ? 'airtel_money' : payMethod === 'mpesa' ? 'mpesa' : 'card',
          payerPhone: payPhone,
          payerEmail: `patron@${selectedCountry.toLowerCase()}.civicduty.org`,
        }),
      });
      const initData = await initRes.json();
      if (!initData.success) throw new Error(initData.error || 'Payment init failed');

      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionReference: initData.transactionReference }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) throw new Error('Payment verification failed');

      const minted = Array.from({ length: pkg.qty }).map(() => {
        const rand = Math.floor(1000 + Math.random() * 9000);
        const prefix = pkg.brand.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'POOL';
        return {
          voucherCode: `${prefix}-${rand}-${selectedCountry}`,
          pin: `${Math.floor(100000 + Math.random() * 900000)}`,
          brand: pkg.brand,
          title: pkg.label.replace(/^\d+×\s+/, ''),
          category: pkg.category,
          faceValue: pkg.unitVal,
          currency: pkg.currency,
          expiryDate: '2026-12-31',
          redemptionUssdString: perkProfile.ussdDial,
        };
      });

      const targetVault: VaultKind = communityPoolTab === 'scout_bounty_vault' ? 'scout_bounty_vault' : 'parish_vault';
      const targetLabel =
        communityPoolTab === 'scout_bounty_vault'
          ? scoutCorridorOptions.find((c) => c.id === selectedScoutCorridor)?.label || 'Scout Corridor Pool'
          : selectedParish;

      const batchRes = await fetch('/api/perks/upload-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchName: `${pkg.label} · ${targetLabel}`,
          sponsorName: paySponsorName,
          sponsorType: 'citizen_patron',
          projectName: targetLabel,
          country: selectedCountry,
          vouchers: minted,
          isDemo: false,
          sourceMethod: 'patron_checkout',
        }),
      });
      const batchData = await batchRes.json();
      if (batchData.success && batchData.vouchers) {
        const tagged = batchData.vouchers.map((v: EscrowPerkVoucher) => ({
          ...v,
          vaultType: targetVault,
          jurisdictionLabel: targetLabel,
        }));
        savePerkVoucherBatchToCloud(tagged).catch(() => {});
        if (verifyData.transaction) saveGatewayTransactionToCloud(verifyData.transaction).catch(() => {});
        setVouchers((prev) => [...tagged, ...prev]);
        setPaymentReceipt({
          ref: initData.transactionReference,
          amount: pkg.total,
          currency: pkg.currency,
          count: pkg.qty,
          poolLabel: targetLabel,
        });
        toast(`Thank you! ${pkg.qty} vouchers added to ${targetLabel}.`, 'emerald');
      }
    } catch {
      toast('Could not complete pool contribution', 'rose');
    } finally {
      setIsPaying(false);
    }
  };

  // Pool Balances for Community Pools
  const parishPoolCount = vouchers.filter(
    (v) => v.country === selectedCountry && v.status === 'escrow_unassigned' && (!v.vaultType || v.vaultType === 'parish_vault')
  ).length;
  const scoutPoolCount = vouchers.filter(
    (v) => v.country === selectedCountry && v.status === 'escrow_unassigned' && v.vaultType === 'scout_bounty_vault'
  ).length;

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-slate-100 pb-24">
      <div className="max-w-4xl mx-auto px-3 sm:px-5 pt-4 space-y-4">
        {/* Role Notice for Gov / Private Desk Managers */}
        {(isGovDeskUser || isPrivateProviderOrContractor) && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-200">
              <Building2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                <strong>Desk Manager Vaults Moved:</strong> Provider, Contractor, &amp; Ward/Parish Admin disbursement consoles live inside your Desk.
              </span>
            </div>
            <button
              type="button"
              onClick={() => openDeskPerksVaults('perks_vaults')}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Open Desk Perks &amp; Vaults</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* Clean Header */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                <Gift size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Citizen Perks &amp; Rewards</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Use your earned Civic Points at participating local shops, claim utility passes, or cheer community champions.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-1.5">
                <Award size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-300">
                  {citizenXp.toLocaleString()} pts
                </span>
              </div>
              <SearchableSelect
                value={selectedCountry}
                onChange={(val) => setSelectedCountry(val as CountryCode)}
                ariaLabel="Country selector"
                placeholder="Select country..."
                searchPlaceholder="Search countries..."
                options={Object.entries(COUNTRIES).map(([code, c]) => ({
                  value: code,
                  label: `${c.flag} ${c.name}`,
                  keywords: `${code} ${c.name}`,
                }))}
                className="w-40 sm:w-44"
                triggerClassName="px-2.5 py-1.5 bg-[#f8f9fa] dark:bg-[#0e1116]"
              />
            </div>
          </div>

          {/* 3 Clean Top Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 border-t border-[#e3e6ea] dark:border-[#262b36] pt-3">
            {[
              {
                id: 'citizen_wallet' as const,
                label: `My Wallet (${citizenWalletVouchers.length})`,
                icon: Wallet,
              },
              {
                id: 'redeem_xp' as const,
                label: 'Redeem Points & Shops',
                icon: Store,
              },
              {
                id: 'community_pools' as const,
                label: 'Community Pools & Tipping',
                icon: Users,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = perkTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPerkTab(tab.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/40'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================================ */}
        {/* TAB 1: MY WALLET                                                 */}
        {/* ================================================================ */}
        {perkTab === 'citizen_wallet' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
                <div className="text-[11px] text-slate-500">Ready to Use</div>
                <div className="text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {citizenWalletVouchers.filter((v) => v.status === 'dispatched').length}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
                <div className="text-[11px] text-slate-500">Courtesy Care</div>
                <div className="text-lg font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400 mt-0.5">
                  {courtesyWalletVouchers.length}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
                <div className="text-[11px] text-slate-500">Used / Claimed</div>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-700 dark:text-slate-300 mt-0.5">
                  {citizenWalletVouchers.filter((v) => v.status === 'redeemed').length}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-center text-xs text-slate-500">
                Loading your passes...
              </div>
            ) : citizenWalletVouchers.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-center space-y-3">
                <Ticket size={28} className="mx-auto text-slate-400" />
                <div className="text-sm font-bold text-slate-900 dark:text-white">No active passes yet</div>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Earn Civic Points by reporting verified community issues or convert your {citizenXp} pts into shop discounts and utility bundles.
                </p>
                <button
                  type="button"
                  onClick={() => setPerkTab('redeem_xp')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Store size={14} />
                  <span>Redeem Points at Shops</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {citizenWalletVouchers.map((v) => {
                  const isUsed = v.status === 'redeemed';
                  return (
                    <div
                      key={v.id}
                      className={`p-4 rounded-2xl bg-white dark:bg-[#161a22] border shadow-xs flex flex-col justify-between gap-3 ${
                        isUsed ? 'border-slate-200 dark:border-slate-800 opacity-75' : 'border-emerald-500/30'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                              {v.brand}
                            </span>
                            <h3 className="text-sm font-bold text-slate-950 dark:text-white leading-snug mt-0.5">
                              {v.title}
                            </h3>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                              {v.currency} {Number(v.faceValue).toLocaleString()}
                            </div>
                            <span
                              className={`inline-block mt-0.5 text-[10px] font-semibold ${
                                isUsed ? 'text-slate-500' : 'text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              {isUsed ? 'Used at counter' : 'Ready to use'}
                            </span>
                          </div>
                        </div>

                        {v.dispatchedTo?.citationNote && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                            {v.dispatchedTo.citationNote}
                          </p>
                        )}

                        <div className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-500">Code</span>
                          <span className="font-bold text-slate-900 dark:text-white select-all">{v.voucherCode}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36]">
                        <button
                          type="button"
                          onClick={() => {
                            setPassModalVoucher(v);
                            setIsPassModalOpen(true);
                          }}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                        >
                          <QrCode size={13} />
                          <span>Show QR Pass</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const dial = v.redemptionUssdString || perkProfile.ussdDial;
                            copyToClipboard(dial);
                            toast(`Dial ${dial} on your phone (copied)`, 'emerald');
                          }}
                          className="py-2 px-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Phone size={12} />
                          <span>USSD</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            copyToClipboard(v.voucherCode);
                            toast(`Copied code ${v.voucherCode}`, 'emerald');
                          }}
                          aria-label="Copy code"
                          className="py-2 px-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Copy size={12} />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: REDEEM POINTS & PARTICIPATING SHOPS                       */}
        {/* ================================================================ */}
        {perkTab === 'redeem_xp' && (
          <div className="space-y-4 animate-fade-in">
            {/* Balance, Search & Filter Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-slate-500">Available Balance</div>
                  <div className="flex items-center gap-2.5 mt-0.5">
                    <span className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                      {citizenXp.toLocaleString()} Civic Points
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={12} />
                      {cooldownInfo.onCooldown ? `${cooldownInfo.daysLeft}d cooldown` : 'Ready to redeem'}
                    </span>
                  </div>
                </div>

                {showDemos && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const uid = user?.id || 'usr-9028-UG';
                        addPoints(uid, 150, '+150 pts · Sandbox boost');
                        toast('+150 Civic Points added (Demo)', 'emerald');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-500 cursor-pointer whitespace-nowrap"
                    >
                      +150 pts Boost
                    </button>
                    {cooldownInfo.onCooldown && (
                      <button
                        type="button"
                        onClick={() => {
                          const uid = user?.id || 'usr-9028-UG';
                          setLastXpRedeemIso(null);
                          try {
                            localStorage.removeItem(`cd_last_xp_redeem_${uid}`);
                          } catch {}
                          toast('7-day cooldown reset (Demo)', 'emerald');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <RotateCcw size={12} />
                        <span>Reset Cooldown</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={shopSearch}
                    onChange={(e) => setShopSearch(e.target.value)}
                    placeholder="Search shops, discounts, fuel, airtime..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setParishOnlyFilter(!parishOnlyFilter)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    parishOnlyFilter
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36]'
                  }`}
                >
                  <MapPin size={13} />
                  <span>{parishOnlyFilter ? `Near ${userHomeParish}` : `All ${lowestMeta.unitPlural}`}</span>
                </button>
              </div>

              {/* 6 Unified Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {UNIFIED_SHOP_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const active = shopCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setShopCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        active
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                          : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/40'
                      }`}
                    >
                      <Icon size={12} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section A: Participating Local Merchant Shops */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
                  <Store size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Participating Local Shops ({filteredMerchantOffers.length})</span>
                </h2>
                <span className="text-[11px] text-slate-500">Show QR Pass at shop counter</span>
              </div>

              {filteredMerchantOffers.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-center text-xs text-slate-500">
                  No matching merchant offers in this filter. Try switching categories or turning off the local filter.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredMerchantOffers.map((prod) => {
                    const xpCost = getXpCostForMerchantProduct(prod);
                    const canAfford = citizenXp >= xpCost && !cooldownInfo.onCooldown;
                    const catLabel = MARKETPLACE_CATEGORIES.find((c) => c.id === prod.category)?.label || 'Local Partner';
                    return (
                      <div
                        key={prod.id}
                        className="p-4 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 truncate">
                                {prod.merchantName} · {prod.parish}
                              </div>
                              <h3 className="text-sm font-bold text-slate-950 dark:text-white leading-snug mt-0.5">
                                {prod.rewardHeadline}
                              </h3>
                            </div>
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-300 whitespace-nowrap shrink-0">
                              {xpCost} pts
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                            {prod.rewardDescription}
                          </p>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>{catLabel}</span>
                            <span>·</span>
                            <span>Value: {prod.currency} {Number(prod.voucherCost).toLocaleString()}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={!canAfford || redeemingId === prod.id}
                          onClick={() => handleRedeemMerchantOffer(prod)}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                            canAfford
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <QrCode size={13} />
                          <span>
                            {redeemingId === prod.id
                              ? 'Creating Pass...'
                              : cooldownInfo.onCooldown
                              ? `Cooldown (${cooldownInfo.daysLeft}d)`
                              : citizenXp < xpCost
                              ? `Need ${xpCost - citizenXp} more pts`
                              : `Redeem for ${xpCost} pts`}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section B: Utility, Transit & Data Reimbursements */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
                  <Zap size={15} className="text-amber-500" />
                  <span>Utility, Fuel &amp; Data Reimbursements ({filteredClaimableUtilityVouchers.length})</span>
                </h2>
                <span className="text-[11px] text-slate-500">Funded by Community Pools</span>
              </div>

              {filteredClaimableUtilityVouchers.length === 0 ? (
                <div className="p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-center text-xs text-slate-500">
                  No unclaimed utility vouchers in this category right now.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredClaimableUtilityVouchers.slice(0, 8).map((v) => {
                    const xpCost = getXpCostForCategory(v.category);
                    const canAfford = citizenXp >= xpCost && !cooldownInfo.onCooldown;
                    return (
                      <div
                        key={v.id}
                        className="p-4 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                                {v.brand}
                              </div>
                              <h3 className="text-sm font-bold text-slate-950 dark:text-white mt-0.5">{v.title}</h3>
                            </div>
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-300 whitespace-nowrap shrink-0">
                              {xpCost} pts
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            Value: <strong className="text-slate-800 dark:text-slate-200">{v.currency} {Number(v.faceValue).toLocaleString()}</strong> · Pool: {v.sponsoredBy}
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={!canAfford || redeemingId === v.id}
                          onClick={() => handleCitizenSelfRedeem(v)}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                            canAfford
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <Ticket size={13} />
                          <span>
                            {redeemingId === v.id
                              ? 'Claiming...'
                              : cooldownInfo.onCooldown
                              ? `Cooldown (${cooldownInfo.daysLeft}d)`
                              : citizenXp < xpCost
                              ? `Need ${xpCost - citizenXp} more pts`
                              : `Claim for ${xpCost} pts`}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 3: COMMUNITY POOLS & PEER TIPPING                            */}
        {/* ================================================================ */}
        {perkTab === 'community_pools' && (
          <div className="space-y-4 animate-fade-in">
            {/* Clean 3-Card Selector (Only Citizen & Community Pools) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'parish_vault' as const,
                  title: lowestMeta.vaultTitle,
                  sub: `${parishPoolCount} vouchers · Monthly Top-3`,
                  icon: MapPin,
                },
                {
                  id: 'scout_bounty_vault' as const,
                  title: 'Frontline Scouts',
                  sub: `${countryStageCount} public stages · Top-3 Rewards`,
                  icon: Bike,
                },
                {
                  id: 'individual_vault' as const,
                  title: 'Tip a Citizen',
                  sub: 'Instant peer appreciation',
                  icon: Send,
                },
              ].map((pool) => {
                const Icon = pool.icon;
                const active = communityPoolTab === pool.id;
                return (
                  <button
                    key={pool.id}
                    type="button"
                    onClick={() => setCommunityPoolTab(pool.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-colors cursor-pointer flex items-start gap-2.5 ${
                      active
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white dark:bg-[#161a22] text-slate-900 dark:text-slate-100 border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/40'
                    }`}
                  >
                    <Icon size={17} className={active ? 'text-white shrink-0 mt-0.5' : 'text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5'} />
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{pool.title}</div>
                      <div className={`text-[11px] mt-0.5 ${active ? 'text-emerald-100' : 'text-slate-500'}`}>
                        {pool.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* POOL 1: PARISH / WARD CHAMPIONS */}
            {communityPoolTab === 'parish_vault' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white">
                      {lowestMeta.unitName} Top-3 Standings · {selectedParish}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">{lowestMeta.desc}</p>
                  </div>
                  <SearchableSelect
                    value={selectedAwardMonth}
                    onChange={(val) => setSelectedAwardMonth(val as any)}
                    ariaLabel="Award Cycle"
                    placeholder="Select cycle..."
                    searchPlaceholder="Search cycle..."
                    options={[
                      { value: '2026-10', label: 'October 2026 Cycle' },
                      { value: '2026-09', label: 'September 2026 Cycle' },
                      { value: '2026-08', label: 'August 2026 Cycle' },
                    ]}
                    className="w-full sm:w-52 shrink-0"
                    triggerClassName="bg-[#f8f9fa] dark:bg-[#0e1116]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Inspect {lowestMeta.unitName} Leaderboard
                  </label>
                  <SearchableSelect
                    options={parishOptions.map((p) => ({ value: p, label: p }))}
                    value={selectedParish}
                    onChange={(val) => setSelectedParish(val)}
                    placeholder={`Search ${lowestMeta.unitName}...`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {communityTop3.map((c) => (
                    <div
                      key={c.rank}
                      className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-emerald-500/25 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          Rank #{c.rank} · 1/3 Split
                        </span>
                        <span className="text-xs font-bold font-mono tabular-nums text-slate-700 dark:text-slate-300">
                          {c.score} pts
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-950 dark:text-white">{c.name}</div>
                      <div className="text-[11px] text-slate-500">{c.roleOrProfession}</div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug line-clamp-2 pt-1">
                        {c.citationReason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* POOL 2: FRONTLINE SCOUTS WORKSTATIONS & CERTIFIED STAGES */}
            {communityPoolTab === 'scout_bounty_vault' && (
              <div className="space-y-4">
                {/* User Active Workstation Standing Bar */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {myActiveStageInfo ? (
                    <>
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          Your Active Workstation · Rank #{myActiveStageInfo.member.rank} ({myActiveStageInfo.member.points} pts)
                        </div>
                        <div className="text-sm font-bold text-slate-950 dark:text-white truncate">
                          {myActiveStageInfo.stage.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {myActiveStageInfo.stage.scoutCount}/{myActiveStageInfo.stage.thresholdRequired} active scouts ·{' '}
                          {myActiveStageInfo.member.rank <= 3
                            ? `In Top 3 (${myActiveStageInfo.member.lionSharePct}% vault share)`
                            : 'Keep reporting to climb into the Top 3 rewards'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenComposeForStage(myActiveStageInfo.stage)}
                          className="min-h-[40px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap"
                        >
                          File Workstation Report
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const res = exitStageGroup(
                              myActiveStageInfo.stage.id,
                              user?.id || 'usr-9028-UG',
                              user?.name || 'Citizen Observer'
                            );
                            if (res.success) {
                              setMyActiveStageInfo(null);
                              toast(res.message, 'emerald');
                            } else {
                              toast(res.message, 'amber');
                            }
                          }}
                          className="min-h-[40px] px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/25 text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap"
                        >
                          Exit Group
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-0.5">
                        <div className="text-sm font-bold text-slate-950 dark:text-white">
                          Join a Public Workstation When Reporting
                        </div>
                        <p className="text-xs text-slate-500">
                          Pick any workstation below or type your own stage name in Speak. 15 active scouts certify a stage; Top 3 by score earn all rewards.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenComposeForStage()}
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors whitespace-nowrap"
                      >
                        Report &amp; Join a Group
                      </button>
                    </>
                  )}
                </div>

                {/* Live Frontline Stage Hubs Explorer */}
                <FrontlineStageExplorer
                  country={selectedCountry}
                  selectedParish={selectedParish}
                  onSelectStageForCompose={handleOpenComposeForStage}
                  compact
                />
              </div>
            )}

            {/* POOL 3: TIP A CITIZEN DIRECTLY */}
            {communityPoolTab === 'individual_vault' && (
              <form
                onSubmit={handleTipCitizen}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3"
              >
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
                    <HeartHandshake size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Tip a Citizen Directly</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Reward a fellow resident or reporter immediately with an instant digital voucher. No monthly wait.
                  </p>
                </div>

                {countryFeedPosts.length > 0 && (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Pick Recent Verified Post Author (Optional)
                    </label>
                    <SearchableSelect
                      value={tipTargetPostId}
                      onChange={(val) => {
                        const post = countryFeedPosts.find((p) => p.id === val);
                        setTipTargetPostId(val);
                        if (post) {
                          setTipRecipientName(post.anonymous ? 'Verified Citizen Author' : post.citizen_name);
                        }
                      }}
                      ariaLabel="Verified Post Author"
                      placeholder="Select verified post author..."
                      searchPlaceholder="Search author or post..."
                      options={countryFeedPosts.slice(0, 20).map((p) => ({
                        value: p.id,
                        label: `${p.anonymous ? 'Anonymous Resident' : p.citizen_name} — ${p.title.slice(0, 55)}`,
                      }))}
                      triggerClassName="bg-[#f8f9fa] dark:bg-[#0e1116]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Recipient Name</label>
                    <input
                      type="text"
                      value={tipRecipientName}
                      onChange={(e) => setTipRecipientName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Phone Number (SMS)</label>
                    <input
                      type="text"
                      value={tipRecipientPhone}
                      onChange={(e) => setTipRecipientPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Appreciation Note</label>
                  <input
                    type="text"
                    value={tipCitationNote}
                    onChange={(e) => setTipCitationNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isTipping}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send size={13} />
                  <span>{isTipping ? 'Sending Voucher...' : 'Send Appreciation Voucher'}</span>
                </button>

                {tipReceipt && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                      <CheckCircle2 size={15} className="shrink-0" />
                      <span>
                        Dispatched <strong>{tipReceipt.brand}</strong> ({tipReceipt.currency} {tipReceipt.faceValue.toLocaleString()}) to <strong>{tipReceipt.name}</strong>
                      </span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{tipReceipt.code}</span>
                  </div>
                )}
              </form>
            )}

            {/* Collapsible Patron Funding Drawer */}
            <div className="rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] overflow-hidden">
              <button
                type="button"
                onClick={() => setShowPatronDrawer(!showPatronDrawer)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-slate-950 dark:text-white">
                      Support &amp; Fund a Community Pool
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Patrons &amp; well-wishers can add utility vouchers to local {lowestMeta.unitName} or Scout pools
                    </div>
                  </div>
                </div>
                {showPatronDrawer ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showPatronDrawer && (
                <form
                  onSubmit={handlePatronPoolCheckout}
                  className="p-4 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-3 bg-[#f8f9fa] dark:bg-[#0e1116]"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">Sponsor Display Name</label>
                      <input
                        type="text"
                        value={paySponsorName}
                        onChange={(e) => setPaySponsorName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">Voucher Bundle</label>
                      <SearchableSelect
                        value={payPackage}
                        onChange={(val) => setPayPackage(val as any)}
                        ariaLabel="Voucher Bundle"
                        placeholder="Select voucher bundle..."
                        searchPlaceholder="Search bundles or brands..."
                        options={patronPackOptions.map((opt) => ({
                          value: opt.id,
                          label: `${opt.label} (${opt.currency} ${opt.total.toLocaleString()})`,
                        }))}
                        triggerClassName="bg-white dark:bg-[#161a22]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'momo' as const, label: 'MTN MoMo' },
                      { id: 'airtel' as const, label: 'Airtel Money' },
                      { id: 'mpesa' as const, label: 'M-Pesa' },
                      { id: 'card' as const, label: 'Visa / Card' },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPayMethod(pm.id)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                          payMethod === pm.id
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>

                  {payMethod !== 'card' && (
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">Mobile Money Number</label>
                      <input
                        type="text"
                        value={payPhone}
                        onChange={(e) => setPayPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPaying}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    {isPaying ? 'Processing Checkout...' : 'Fund Community Pool'}
                  </button>

                  {paymentReceipt && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-200">
                      Funded <strong>{paymentReceipt.count} vouchers</strong> ({paymentReceipt.currency} {paymentReceipt.amount.toLocaleString()}) into <strong>{paymentReceipt.poolLabel}</strong> · Ref: {paymentReceipt.ref}
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Community Sponsors Recognition List */}
            {communitySponsors.length > 0 && (
              <div className="p-4 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Community Sponsors ({perkProfile.countryName})
                </h3>
                <div className="divide-y divide-[#e3e6ea] dark:divide-[#262b36]">
                  {communitySponsors.map((sp, i) => (
                    <div key={sp.name} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-slate-400 w-5">#{i + 1}</span>
                        <span className="font-semibold text-slate-900 dark:text-white truncate">{sp.name}</span>
                      </div>
                      <span className="font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-400 shrink-0">
                        {sp.currency} {sp.total.toLocaleString()} ({sp.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Citizen Voucher QR/USSD Pass Modal */}
      <VoucherPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        voucher={passModalVoucher}
      />
    </div>
  );
};
