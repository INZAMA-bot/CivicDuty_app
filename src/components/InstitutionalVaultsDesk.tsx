import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  EscrowPerkVoucher,
  CountryCode,
  VaultKind,
} from '../types';
import { COUNTRIES, TERRITORY } from '../data/countries';
import { allDepts, copyToClipboard } from '../utils/helpers';
import {
  savePerkVoucherBatchToCloud,
  savePerkVoucherToCloud,
  saveGatewayTransactionToCloud,
} from '../services/firestoreSync';
import {
  getCountryPerkProfile,
  convertUsdToLocal,
  getLocalizedSandboxVouchersForCountry,
} from '../data/countryCurrency';
import { getCountryGovernanceSchema } from '../data/countryGovernance';
import { VoucherPassModal } from './VoucherPassModal';
import { VoucherScannerModal } from './VoucherScannerModal';
import { SearchableSelect } from './SearchableSelect';
import {
  Upload,
  FileSpreadsheet,
  Plus,
  Gift,
  ShieldCheck,
  CheckCircle2,
  Ticket,
  Search,
  Download,
  Building2,
  HardHat,
  Zap,
  Droplet,
  Smartphone,
  Bike,
  Copy,
  RefreshCw,
  CreditCard,
  Award,
  Printer,
  Lock,
  SlidersHorizontal,
  MapPin,
  Store,
  ShoppingBag,
  Package,
  Send,
  ScanLine,
  QrCode,
  Check,
} from 'lucide-react';

interface RankedCitizen {
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

interface InstitutionalVaultsDeskProps {
  deskMode: 'government' | 'provider';
  defaultDeptId?: string;
  onOpenMerchantPos?: () => void;
}

export const InstitutionalVaultsDesk: React.FC<InstitutionalVaultsDeskProps> = ({
  deskMode,
  defaultDeptId,
  onOpenMerchantPos,
}) => {
  const {
    user,
    posts,
    projects,
    toast,
    logAudit,
    selectedCountry: ctxCountry,
    showDemos,
  } = useApp();

  const studioSectionRef = React.useRef<HTMLDivElement | null>(null);
  const selectedCountry = (user?.country || ctxCountry || 'UG') as CountryCode;
  const perkProfile = useMemo(() => getCountryPerkProfile(selectedCountry), [selectedCountry]);
  const gov = useMemo(() => getCountryGovernanceSchema(selectedCountry), [selectedCountry]);

  const userHomeParish = useMemo(() => {
    if (user?.scope_label && (!user?.country || user.country === selectedCountry)) {
      return user.scope_label;
    }
    return perkProfile.defaultParish;
  }, [user?.scope_label, user?.country, selectedCountry, perkProfile.defaultParish]);

  const isContractorRole = Boolean(
    user?.entity_category === 'private_contractor' ||
      user?.real_title?.toLowerCase().includes('contractor') ||
      user?.real_title?.toLowerCase().includes('engineer') ||
      user?.organization_name?.toLowerCase().includes('construction') ||
      user?.organization_name?.toLowerCase().includes('contractor')
  );

  const [activeVaultKind, setActiveVaultKind] = useState<VaultKind>(() => {
    if (deskMode === 'provider') return 'provider_vault';
    return isContractorRole ? 'contractor_vault' : 'parish_vault';
  });

  useEffect(() => {
    if (deskMode === 'provider') {
      setActiveVaultKind('provider_vault');
    } else if (activeVaultKind === 'provider_vault') {
      setActiveVaultKind(isContractorRole ? 'contractor_vault' : 'parish_vault');
    }
  }, [deskMode, isContractorRole]);

  const [parishDepositMode, setParishDepositMode] = useState<'home' | 'external'>('home');
  const [selectedParish, setSelectedParish] = useState<string>(() => userHomeParish);
  useEffect(() => {
    if (parishDepositMode === 'home') {
      setSelectedParish(userHomeParish);
    }
  }, [userHomeParish, parishDepositMode]);

  const [selectedProviderDept, setSelectedProviderDept] = useState<string>(
    defaultDeptId || user?.dept || 'umeme'
  );
  const [selectedContractId, setSelectedContractId] = useState<string>('');
  const [selectedAwardMonth, setSelectedAwardMonth] = useState<'2026-10' | '2026-09' | '2026-08'>('2026-10');
  const [isBatchDispatching, setIsBatchDispatching] = useState(false);
  const [lastBatchDispatchReceipt, setLastBatchDispatchReceipt] = useState<{
    vaultKind: VaultKind;
    awardMonthLabel: string;
    jurisdictionLabel: string;
    dispatcherLabel: string;
    dispatchedAt: string;
    recipients: Array<{
      rank: number;
      name: string;
      contact: string;
      voucherCode: string;
      brand: string;
      faceValue: number;
      currency: string;
      score: number;
    }>;
  } | null>(null);

  const [vouchers, setVouchers] = useState<EscrowPerkVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pay' | 'csv' | 'manual' | 'packs' | 'csr_leaderboard'>('pay');

  const [passModalVoucher, setPassModalVoucher] = useState<EscrowPerkVoucher | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVaultKind, setFilterVaultKind] = useState<'all' | VaultKind>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadAsLive, setUploadAsLive] = useState(true);

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

  // Payment Checkout State
  const [payPackage, setPayPackage] = useState<
    | 'supermarket_basket_5'
    | 'mtn_5'
    | 'nwsc_5'
    | 'yaka_5'
    | 'fuel_5'
    | 'custom'
  >('supermarket_basket_5');
  const [paySponsorName, setPaySponsorName] = useState(
    user?.organization_name || user?.name || perkProfile.sampleSponsor
  );
  const [paySponsorType, setPaySponsorType] = useState<
    'contractor' | 'authority' | 'corporate_csr' | 'citizen_patron'
  >(deskMode === 'government' ? 'authority' : 'corporate_csr');
  const [payProjectName, setPayProjectName] = useState(perkProfile.sampleProject);
  const [payMethod, setPayMethod] = useState<'momo' | 'airtel' | 'mpesa' | 'card' | 'bank'>('momo');
  const [payPhone, setPayPhone] = useState(perkProfile.samplePhone);
  const [payEmail, setPayEmail] = useState(`desk@${selectedCountry.toLowerCase()}.civicduty.org`);
  const [customQuantity, setCustomQuantity] = useState(3);
  const [customFaceValue, setCustomFaceValue] = useState(() => convertUsdToLocal(8, selectedCountry).amount);
  const [customBrand, setCustomBrand] = useState(perkProfile.supermarketBrand);
  const [customCategory, setCustomCategory] = useState<
    'telco_data' | 'water_utility' | 'electricity' | 'transit_credit' | 'supermarket'
  >('supermarket');
  const [customPackagedItemsInput, setCustomPackagedItemsInput] = useState<string>(
    perkProfile.basketStaples.join(', ')
  );
  const [isPaying, setIsPaying] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState<any>(null);

  // CSV & Manual State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreviewRows, setCsvPreviewRows] = useState<any[]>([]);
  const [csvSponsor, setCsvSponsor] = useState(
    user?.organization_name || `${perkProfile.sampleSponsor} (Desk Allocation)`
  );
  const [csvSponsorType, setCsvSponsorType] = useState<
    'contractor' | 'authority' | 'corporate_csr' | 'citizen_patron'
  >(deskMode === 'government' ? 'authority' : 'corporate_csr');
  const [csvProjectName, setCsvProjectName] = useState(perkProfile.sampleProject);
  const [isUploading, setIsUploading] = useState(false);

  const [manualBrand, setManualBrand] = useState(perkProfile.telcoBrand);
  const [manualCategory, setManualCategory] = useState<
    'telco_data' | 'water_utility' | 'electricity' | 'transit_credit' | 'supermarket'
  >('telco_data');
  const [manualCode, setManualCode] = useState('');
  const [manualPin, setManualPin] = useState('');
  const [manualFaceValue, setManualFaceValue] = useState(() =>
    String(convertUsdToLocal(3, selectedCountry).amount)
  );
  const [manualCurrency, setManualCurrency] = useState(perkProfile.currency);
  const [manualSponsor, setManualSponsor] = useState(
    user?.organization_name || perkProfile.sampleSponsor
  );
  const [manualSponsorType, setManualSponsorType] = useState<
    'contractor' | 'authority' | 'corporate_csr' | 'citizen_patron'
  >(deskMode === 'government' ? 'authority' : 'corporate_csr');
  const [manualExpiry, setManualExpiry] = useState('2026-12-31');

  useEffect(() => {
    setManualCurrency(perkProfile.currency);
    setPayPhone(perkProfile.samplePhone);
    setPayEmail(`desk@${selectedCountry.toLowerCase()}.civicduty.org`);
    setCustomFaceValue(convertUsdToLocal(8, selectedCountry).amount);
    setManualFaceValue(String(convertUsdToLocal(3, selectedCountry).amount));
    setCustomPackagedItemsInput(perkProfile.basketStaples.join(', '));
  }, [selectedCountry, perkProfile]);

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
    const combined = Array.from(new Set([userHomeParish, perkProfile.defaultParish, ...fromPosts, ...fromTree]));
    return combined.length > 0 ? combined : [perkProfile.defaultParish];
  }, [posts, selectedCountry, userHomeParish, perkProfile.defaultParish]);

  useEffect(() => {
    if (parishOptions.length > 0 && !parishOptions.includes(selectedParish)) {
      setSelectedParish(parishOptions[0]);
    }
  }, [parishOptions, selectedParish]);

  const providerOptions = useMemo(() => {
    const depts = allDepts(selectedCountry);
    const consumerOrPrivate = depts.filter(
      (d) => d.lane === 'consumer' || d.category !== 'government' || d.isEnterprise
    );
    return consumerOrPrivate.length > 0 ? consumerOrPrivate : depts.slice(0, 8);
  }, [selectedCountry]);

  useEffect(() => {
    if (defaultDeptId && selectedProviderDept !== defaultDeptId) {
      setSelectedProviderDept(defaultDeptId);
    } else if (providerOptions.length > 0 && !providerOptions.some((d) => d.id === selectedProviderDept)) {
      setSelectedProviderDept(providerOptions[0].id);
    }
  }, [defaultDeptId, providerOptions]);

  const contractOptions = useMemo(() => {
    const countryProjects = projects.filter((pr) => (pr.country || 'UG') === selectedCountry);
    return countryProjects.length > 0 ? countryProjects : projects.slice(0, 5);
  }, [projects, selectedCountry]);

  useEffect(() => {
    if (contractOptions.length > 0 && !contractOptions.some((c) => c.id === selectedContractId)) {
      setSelectedContractId(contractOptions[0].id);
    }
  }, [contractOptions, selectedContractId]);

  // Fixed Role Permissions (no broken user?.role === 'gov' check)
  const isAuthorizedGovOfficer = Boolean(
    user &&
      user.entity_type !== 'non_government_entity' &&
      ['node_admin', 'platform_admin', 'spokesperson'].includes(user.role)
  );
  const isAuthorizedProvider = Boolean(
    user &&
      (deskMode === 'provider' ||
        user.entity_type === 'non_government_entity' ||
        user.role === 'node_admin' ||
        user.role === 'platform_admin')
  );
  const isAuthorizedContractor = Boolean(
    isContractorRole || isAuthorizedGovOfficer
  );

  const loadVaultData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/perks/vault?country=${selectedCountry}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.vouchers) && data.vouchers.length > 0) {
        setVouchers(data.vouchers);
      } else {
        setVouchers(getLocalizedSandboxVouchersForCountry(selectedCountry, parishOptions));
      }
    } catch {
      setVouchers(getLocalizedSandboxVouchersForCountry(selectedCountry, parishOptions));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVaultData();
  }, [selectedCountry]);

  const countryFeedPosts = useMemo(
    () => posts.filter((p) => p.country === selectedCountry),
    [posts, selectedCountry]
  );

  const activeJurisdictionTop3: RankedCitizen[] = useMemo(() => {
    const phonePrefix = `${perkProfile.phonePrefix} `;
    const buildTop3FromPosts = (
      matchingPosts: typeof posts,
      fallbackSeeds: Array<{
        name: string;
        role: string;
        baseScore: number;
        reports: number;
        resolved: number;
        upvotes: number;
        reason: string;
      }>
    ): RankedCitizen[] => {
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
        const name = p.anonymous
          ? `Verified Resident (#${p.id.slice(-4).toUpperCase()})`
          : p.citizen_name || 'Citizen Watchdog';
        const existing = map.get(name) || {
          name,
          role: p.author_profession || p.citizen_rank || `Verified ${gov.tier1UnitLabel} Citizen`,
          reports: 0,
          resolved: 0,
          upvotes: 0,
          score: 0,
          reason: p.title,
          postId: p.id,
        };
        const isResolved =
          p.status === 'resolved' || p.citizen_satisfied === true || p.category === 'praise';
        existing.reports += 1;
        if (isResolved) existing.resolved += 1;
        existing.upvotes += p.upvotes || 0;
        existing.score += 30 + (isResolved ? 45 : 0) + (p.upvotes || 0) * 3 + (p.compiled_count || 1) * 8;
        map.set(name, existing);
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

    if (activeVaultKind === 'provider_vault') {
      const providerObj = providerOptions.find((d) => d.id === selectedProviderDept);
      const pName = providerObj?.name || user?.organization_name || selectedProviderDept;
      const shopPosts = countryFeedPosts.filter((p) => p.dept === selectedProviderDept);
      return buildTop3FromPosts(shopPosts, [
        {
          name: selectedCountry === 'KE' ? 'Kevin Kamau' : 'Ivan Mugisha',
          role: `Verified Customer & Quality Auditor · ${pName}`,
          baseScore: 310,
          reports: 5,
          resolved: 4,
          upvotes: 42,
          reason: `Highest customer care interaction score with ${pName}`,
        },
        {
          name: selectedCountry === 'KE' ? 'Mercy Njoroge' : 'Brenda Nakato',
          role: `Frequent Patron · ${pName}`,
          baseScore: 265,
          reports: 4,
          resolved: 3,
          upvotes: 31,
          reason: `2nd highest business interaction score on ${pName}`,
        },
        {
          name: selectedCountry === 'KE' ? 'Daniel Mutua' : 'Denis Ocen',
          role: `Community Consumer Watchdog · ${pName}`,
          baseScore: 220,
          reports: 3,
          resolved: 2,
          upvotes: 24,
          reason: `3rd highest business interaction score on ${pName}`,
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
          name: selectedCountry === 'KE' ? 'Eng. Samuel Kariuki' : 'Moses Byaruhanga',
          role: `Lead Contract Watchdog · ${cTitle}`,
          baseScore: 390,
          reports: 7,
          resolved: 5,
          upvotes: 64,
          reason: `Top verified geotagged site inspection record on ${cTitle}`,
        },
        {
          name: selectedCountry === 'KE' ? 'Esther Wambui' : 'Juliet Babirye',
          role: `Corridor Resident Monitor · ${cTitle}`,
          baseScore: 325,
          reports: 5,
          resolved: 4,
          upvotes: 49,
          reason: `Milestone photo verification and drainage audit on ${cTitle}`,
        },
        {
          name: selectedCountry === 'KE' ? 'Peter Omondi' : 'Patrick Opio',
          role: `Site Safety Auditor · ${cTitle}`,
          baseScore: 275,
          reports: 4,
          resolved: 3,
          upvotes: 38,
          reason: `Defects liability inspection and community confirmation`,
        },
      ]);
    }

    // Parish / Lowest Jurisdiction Vault
    const parishPosts = countryFeedPosts.filter(
      (p) =>
        p.territory?.parish?.toLowerCase() === selectedParish.toLowerCase() ||
        p.location?.toLowerCase().includes(selectedParish.toLowerCase().replace(/ parish| ward/g, ''))
    );
    return buildTop3FromPosts(parishPosts, [
      {
        name: selectedCountry === 'KE' ? 'Wanjiku Mwangi' : 'Sarah Namukasa',
        role: `Lead ${gov.tier1UnitLabel} Citizen · ${selectedParish}`,
        baseScore: 340,
        reports: 6,
        resolved: 4,
        upvotes: 48,
        reason: `Top standing in ${selectedParish} (6 verified reports & 4 confirmed fixes)`,
      },
      {
        name: selectedCountry === 'KE' ? 'Brian Otieno' : 'Ronald Kizza',
        role: `Infrastructure Monitor · ${selectedParish}`,
        baseScore: 285,
        reports: 5,
        resolved: 3,
        upvotes: 36,
        reason: `Drainage and community water point verification in ${selectedParish}`,
      },
      {
        name: selectedCountry === 'KE' ? 'Faith Chepkoech' : 'Grace Akello',
        role: `Health & Sanitation Steward · ${selectedParish}`,
        baseScore: 240,
        reports: 4,
        resolved: 3,
        upvotes: 29,
        reason: `Clinic and street lighting verifications in ${selectedParish}`,
      },
    ]);
  }, [
    activeVaultKind,
    selectedCountry,
    selectedParish,
    selectedProviderDept,
    selectedContractId,
    countryFeedPosts,
    providerOptions,
    contractOptions,
    perkProfile.phonePrefix,
    gov.tier1UnitLabel,
    user?.organization_name,
  ]);

  const awardMonthLabel = useMemo(() => {
    if (selectedAwardMonth === '2026-09') return 'September 2026 Cycle';
    if (selectedAwardMonth === '2026-08') return 'August 2026 Cycle';
    return 'October 2026 Cycle';
  }, [selectedAwardMonth]);

  const currentVaultJurisdictionMeta = useMemo(() => {
    if (activeVaultKind === 'provider_vault') {
      const prov = providerOptions.find((d) => d.id === selectedProviderDept);
      const label = user?.organization_name || prov?.name || selectedProviderDept;
      return {
        vaultTitle: `Private Provider Vault · ${label}`,
        jurisdictionId: selectedProviderDept,
        jurisdictionLabel: label,
        dispatcherTitle: `${label} — Provider Desk Officer`,
        authorizedRoleTag: 'provider_owner' as const,
        rankingRule:
          'Monthly Ranking Cycle: Deposit courtesy vouchers into your branch vault. At month-end, the system locks the Top 3 citizens ranked strictly by verified customer feedback and splits the pool evenly (1/3 each).',
      };
    }
    if (activeVaultKind === 'contractor_vault') {
      const proj = contractOptions.find((c) => c.id === selectedContractId);
      const label = proj ? `${proj.title} (${proj.contractor})` : 'Public Works Contract';
      return {
        vaultTitle: `Contractor Watchdog Vault · ${proj?.title || selectedContractId}`,
        jurisdictionId: selectedContractId,
        jurisdictionLabel: label,
        dispatcherTitle: `${proj?.contractor || 'Contracting Firm'} & Supervising Engineer`,
        authorizedRoleTag: 'contractor_or_authority' as const,
        rankingRule:
          'Monthly Ranking Cycle: Contractors and supervising agencies fund inspection vouchers. At month-end, awards split evenly across the Top 3 Contract Watchdogs based on geotagged site inspections.',
      };
    }
    return {
      vaultTitle: `${gov.tier1UnitLabel} Vault · ${selectedParish}`,
      jurisdictionId: selectedParish,
      jurisdictionLabel: selectedParish,
      dispatcherTitle: `${gov.tier1Short} — ${selectedParish}`,
      authorizedRoleTag: 'parish_chief' as const,
      rankingRule: `Monthly Ranking Cycle: Open to civic sponsors. At month-end, the Top 3 residents in ${selectedParish} by verified impact are locked and receive an even 1/3 split of the pool.`,
    };
  }, [
    activeVaultKind,
    selectedParish,
    selectedProviderDept,
    selectedContractId,
    providerOptions,
    contractOptions,
    gov.tier1UnitLabel,
    gov.tier1Short,
    user?.organization_name,
  ]);

  const stats = useMemo(() => {
    const deskVouchers = vouchers.filter((v) => {
      if (v.country.toUpperCase() !== selectedCountry.toUpperCase()) return false;
      if (deskMode === 'provider') {
        return !v.vaultType || v.vaultType === 'provider_vault' || v.merchantId === selectedProviderDept;
      }
      return (
        !v.vaultType ||
        v.vaultType === 'parish_vault' ||
        v.vaultType === 'contractor_vault'
      );
    });
    const unassigned = deskVouchers.filter((v) => v.status === 'escrow_unassigned');
    const dispatched = deskVouchers.filter((v) => v.status === 'dispatched' || v.status === 'redeemed');
    const totalEscrowFaceValue = unassigned.reduce((acc, v) => acc + (Number(v.faceValue) || 0), 0);
    const uniqueSponsors = new Set(deskVouchers.map((v) => v.sponsoredBy)).size;

    return {
      total: deskVouchers.length,
      unassignedCount: unassigned.length,
      dispatchedCount: dispatched.length,
      totalEscrowFaceValue,
      uniqueSponsors,
      currency: deskVouchers[0]?.currency || perkProfile.currency,
    };
  }, [vouchers, selectedCountry, deskMode, selectedProviderDept, perkProfile.currency]);

  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      if (v.country.toUpperCase() !== selectedCountry.toUpperCase()) return false;
      if (deskMode === 'provider' && v.vaultType && v.vaultType !== 'provider_vault') return false;
      if (deskMode === 'government' && v.vaultType && !['parish_vault', 'contractor_vault'].includes(v.vaultType)) {
        return false;
      }
      if (filterStatus !== 'all' && v.status !== filterStatus) return false;
      if (filterVaultKind !== 'all' && v.vaultType && v.vaultType !== filterVaultKind) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hit =
          v.voucherCode.toLowerCase().includes(q) ||
          v.brand.toLowerCase().includes(q) ||
          (v.title || '').toLowerCase().includes(q) ||
          v.sponsoredBy.toLowerCase().includes(q) ||
          (v.jurisdictionLabel || '').toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
  }, [vouchers, selectedCountry, deskMode, filterStatus, filterVaultKind, searchQuery]);

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
      if (v.status === 'dispatched' || v.status === 'redeemed') existing.dispatchedCount += 1;
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
        certHash: `CSR-${selectedCountry}-${(idx + 101).toString(16).toUpperCase()}-${item.sponsorName
          .replace(/[^A-Z0-9]/gi, '')
          .slice(0, 8)
          .toUpperCase()}`,
      }))
      .sort((a, b) => b.totalFaceValue - a.totalFaceValue);
  }, [vouchers, selectedCountry, stats.currency]);

  // Execute Monthly Locked Top-3 Award Dispatch
  const handleExecuteVaultDispatch = async () => {
    const unassignedInCountry = vouchers.filter(
      (v) => v.country.toUpperCase() === selectedCountry.toUpperCase() && v.status === 'escrow_unassigned'
    );
    const matchingVault = unassignedInCountry.filter((v) => !v.vaultType || v.vaultType === activeVaultKind);
    const poolToUse = matchingVault.length >= 3 ? matchingVault : unassignedInCountry;

    setIsBatchDispatching(true);
    try {
      const defaultCurrency = perkProfile.currency;
      const defaultBrand = perkProfile.telcoBrand;
      const defaultFaceValue = convertUsdToLocal(3, selectedCountry).amount;
      const nowIso = new Date().toISOString();

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

      activeJurisdictionTop3.forEach((citizen, idx) => {
        const existing = poolToUse[idx];
        const slot = (idx + 1) as 1 | 2 | 3;
        const fallbackCode = `TOP${slot}-${Math.floor(1000 + Math.random() * 9000)}-${selectedCountry}`;

        const vObj: EscrowPerkVoucher = existing
          ? {
              ...existing,
              vaultType: activeVaultKind,
              jurisdictionId: currentVaultJurisdictionMeta.jurisdictionId,
              jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
              rankedSlot: slot,
              rankingScoreAtDispatch: citizen.score,
              authorizedDispatcherRole: currentVaultJurisdictionMeta.authorizedRoleTag,
              status: 'dispatched',
              dispatchedTo: {
                recipientName: citizen.name,
                recipientContact: citizen.contact,
                dispatchedAt: nowIso,
                dispatchedBy: currentVaultJurisdictionMeta.dispatcherTitle,
                citationNote: `[Locked Rank #${slot} · ${citizen.score} pts] ${citizen.citationReason}`,
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
              category: 'telco_data',
              brand: defaultBrand,
              title: `${defaultBrand} Top-3 Award (Rank #${slot})`,
              faceValue: defaultFaceValue,
              currency: defaultCurrency,
              country: selectedCountry,
              sponsoredBy: currentVaultJurisdictionMeta.jurisdictionLabel,
              sponsorType: activeVaultKind === 'contractor_vault' ? 'contractor' : activeVaultKind === 'parish_vault' ? 'authority' : 'corporate_csr',
              vaultType: activeVaultKind,
              jurisdictionId: currentVaultJurisdictionMeta.jurisdictionId,
              jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
              rankedSlot: slot,
              rankingScoreAtDispatch: citizen.score,
              authorizedDispatcherRole: currentVaultJurisdictionMeta.authorizedRoleTag,
              batchId: `SPLIT3-${Date.now().toString(36).toUpperCase()}`,
              status: 'dispatched',
              createdAt: nowIso,
              expiryDate: '2026-12-31',
              redemptionUssdString: `*303*${fallbackCode}#`,
              dispatchedTo: {
                recipientName: citizen.name,
                recipientContact: citizen.contact,
                dispatchedAt: nowIso,
                dispatchedBy: currentVaultJurisdictionMeta.dispatcherTitle,
                citationNote: `[Locked Rank #${slot} · ${citizen.score} pts] ${citizen.citationReason}`,
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
      setVouchers((prev) => {
        const replaced = prev.map((v) => updatedOrMinted.find((u) => u.id === v.id) || v);
        const brandNew = updatedOrMinted.filter((u) => !prev.some((p) => p.id === u.id));
        return [...brandNew, ...replaced];
      });

      logAudit(
        'VAULT_MONTHLY_TOP3_BATCH_DISPATCH',
        currentVaultJurisdictionMeta.jurisdictionId,
        `${currentVaultJurisdictionMeta.dispatcherTitle} executed Monthly Top-3 Final Award (${awardMonthLabel}) to #1 ${activeJurisdictionTop3[0]?.name}, #2 ${activeJurisdictionTop3[1]?.name}, #3 ${activeJurisdictionTop3[2]?.name}`
      );

      setLastBatchDispatchReceipt({
        vaultKind: activeVaultKind,
        awardMonthLabel,
        jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
        dispatcherLabel: currentVaultJurisdictionMeta.dispatcherTitle,
        dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recipients: receiptRows,
      });

      toast(`Monthly Top-3 Award dispatched (${awardMonthLabel})!`, 'emerald');
    } finally {
      setIsBatchDispatching(false);
    }
  };

  // Counter POS Voucher Redemption
  const handleProviderRedeemVoucher = async (vch: EscrowPerkVoucher) => {
    try {
      const res = await fetch('/api/merchant-loyalty/pos-redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucherCode: vch.voucherCode,
          merchantId: user?.id || user?.dept || 'provider-desk',
          merchantName: user?.organization_name || user?.name || 'Authorized Provider Desk',
          verifiedByStaff: `${user?.name || 'Counter Cashier'}${user?.branch_name ? ` · ${user.branch_name}` : ''}`,
          branchId: user?.branch_id,
          branchName: user?.branch_name,
          branchParish: user?.branch_parish,
        }),
      });
      const data = await res.json();
      if (data.success && data.voucher) {
        setVouchers((prev) => prev.map((v) => (v.id === data.voucher.id ? data.voucher : v)));
        savePerkVoucherToCloud(data.voucher).catch(() => {});
        toast(`Voucher #${data.voucher.voucherCode} redeemed & 98% payout released.`, 'emerald');
        return;
      }
    } catch {
      // local fallback
    }
    const updated: EscrowPerkVoucher = {
      ...vch,
      status: 'redeemed',
      merchantPayout: {
        payoutAmount: Math.round(vch.faceValue * 0.98),
        commissionAmount: Math.round(vch.faceValue * 0.02),
        commissionRate: 0.02,
        payoutStatus: 'released',
        releasedAt: new Date().toISOString(),
        branchId: user?.branch_id,
        branchName: user?.branch_name,
      },
    };
    setVouchers((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    savePerkVoucherToCloud(updated).catch(() => {});
    toast(`Voucher #${vch.voucherCode} marked redeemed.`, 'emerald');
  };

  // Packaged Allocation Catalog
  const allocationCatalog = useMemo(() => {
    const currency = perkProfile.currency;
    const basket = convertUsdToLocal(8, selectedCountry);
    const dataAmt = convertUsdToLocal(3, selectedCountry);
    const waterAmt = convertUsdToLocal(3, selectedCountry);
    const powerAmt = convertUsdToLocal(4, selectedCountry);
    const fuelAmt = convertUsdToLocal(8, selectedCountry);

    return [
      {
        id: 'supermarket_basket_5' as const,
        shortTitle: `${basket.compact} Groceries (5x)`,
        title: `5x ${perkProfile.supermarketBrand} ${basket.formatted} Shopping Vouchers`,
        brand: perkProfile.supermarketBrand,
        category: 'supermarket' as const,
        unitFaceValue: basket.amount,
        quantity: 5,
        totalCost: basket.amount * 5,
        currency,
        packagedItems: [...perkProfile.basketStaples],
      },
      {
        id: 'mtn_5' as const,
        shortTitle: `${perkProfile.telcoBrand.split(' ')[0]} 2GB Data (5x)`,
        title: `5x ${perkProfile.telcoBrand} 2GB Field Data Packs`,
        brand: perkProfile.telcoBrand,
        category: 'telco_data' as const,
        unitFaceValue: dataAmt.amount,
        quantity: 5,
        totalCost: dataAmt.amount * 5,
        currency,
        packagedItems: ['2GB 4G/5G Data', '30 Voice Mins', `USSD ${perkProfile.ussdDial}`],
      },
      {
        id: 'nwsc_5' as const,
        shortTitle: `${perkProfile.waterBrand.split(' ')[0]} Clean Water (5x)`,
        title: `5x ${perkProfile.waterBrand} ${waterAmt.formatted} Water Credits`,
        brand: perkProfile.waterBrand,
        category: 'water_utility' as const,
        unitFaceValue: waterAmt.amount,
        quantity: 5,
        totalCost: waterAmt.amount * 5,
        currency,
        packagedItems: [`Prepaid Water Token (${perkProfile.waterBrand})`],
      },
      {
        id: 'yaka_5' as const,
        shortTitle: `${perkProfile.powerBrand.split(' ')[0]} Power (5x)`,
        title: `5x ${perkProfile.powerBrand} ${powerAmt.formatted} Power Tokens`,
        brand: perkProfile.powerBrand,
        category: 'electricity' as const,
        unitFaceValue: powerAmt.amount,
        quantity: 5,
        totalCost: powerAmt.amount * 5,
        currency,
        packagedItems: ['45 kWh Electricity Units', 'Prepaid Meter Token'],
      },
      {
        id: 'fuel_5' as const,
        shortTitle: `${perkProfile.fuelBrand.split('/')[0].trim()} Fuel (5x)`,
        title: `5x ${perkProfile.fuelBrand} ${fuelAmt.formatted} Fuel Vouchers`,
        brand: perkProfile.fuelBrand,
        category: 'transit_credit' as const,
        unitFaceValue: fuelAmt.amount,
        quantity: 5,
        totalCost: fuelAmt.amount * 5,
        currency,
        packagedItems: ['Unleaded Fuel / Diesel Credit', 'Pump QR Checkout'],
      },
    ];
  }, [selectedCountry, perkProfile]);

  const selectedPkg = useMemo(() => {
    if (payPackage === 'custom') {
      const parsed = customPackagedItemsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      return {
        title: `${customQuantity}x ${customBrand} Custom Vouchers`,
        brand: customBrand,
        category: customCategory,
        unitFaceValue: customFaceValue,
        quantity: customQuantity,
        totalCost: customQuantity * customFaceValue,
        currency: perkProfile.currency,
        packagedItems: parsed.length > 0 ? parsed : ['Custom Retail / Utility Basket'],
      };
    }
    return allocationCatalog.find((a) => a.id === payPackage) || allocationCatalog[0];
  }, [payPackage, allocationCatalog, customQuantity, customBrand, customCategory, customFaceValue, perkProfile.currency, customPackagedItemsInput]);

  const handleExecuteDirectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((payMethod === 'momo' || payMethod === 'airtel' || payMethod === 'mpesa') && payPhone.trim().length < 9) {
      toast('Please enter a valid mobile money phone number', 'amber');
      return;
    }
    setIsPaying(true);
    try {
      const initRes = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityName: paySponsorName || perkProfile.sampleSponsor,
          invoiceId: `PERK-ESCROW-${Date.now().toString(36).toUpperCase()}`,
          amount: selectedPkg.totalCost,
          currency: selectedPkg.currency,
          paymentMethod:
            payMethod === 'momo'
              ? 'mtn_momo'
              : payMethod === 'airtel'
              ? 'airtel_money'
              : payMethod === 'mpesa'
              ? 'mpesa'
              : payMethod === 'card'
              ? 'card'
              : 'bank_transfer',
          payerPhone: payPhone,
          payerEmail: payEmail,
        }),
      });
      const initData = await initRes.json();
      if (!initData.success) throw new Error(initData.error || 'Payment initialization failed');

      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionReference: initData.transactionReference }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) throw new Error('Payment verification failed');

      const mintedVouchers: any[] = [];
      const prefix = selectedPkg.brand.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'VCH';
      for (let i = 1; i <= selectedPkg.quantity; i++) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        mintedVouchers.push({
          voucherCode: `${prefix}-${rand}-${selectedCountry}`,
          pin: Math.floor(100000 + Math.random() * 900000).toString(),
          brand: selectedPkg.brand,
          title: selectedPkg.title.replace(/^\d+x\s+/i, ''),
          category: selectedPkg.category,
          faceValue: selectedPkg.unitFaceValue,
          currency: selectedPkg.currency,
          packagedItems: selectedPkg.packagedItems,
          expiryDate: '2026-12-31',
          redemptionUssdString: perkProfile.ussdDial,
        });
      }

      const batchRes = await fetch('/api/perks/upload-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchName: `${selectedPkg.title} [Desk Escrow]`,
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
        const tagged = batchData.vouchers.map((v: EscrowPerkVoucher) => ({
          ...v,
          vaultType: activeVaultKind,
          jurisdictionId: currentVaultJurisdictionMeta.jurisdictionId,
          jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
        }));
        savePerkVoucherBatchToCloud(tagged).catch(() => {});
        if (verifyData.transaction) {
          saveGatewayTransactionToCloud(verifyData.transaction).catch(() => {});
        }
        setVouchers((prev) => [...tagged, ...prev]);
        logAudit(
          'PERK_ESCROW_FUNDED',
          initData.transactionReference,
          `${paySponsorName} funded ${selectedPkg.quantity}x ${selectedPkg.brand} vouchers into ${currentVaultJurisdictionMeta.vaultTitle}`
        );
        setPaymentReceipt({
          reference: initData.transactionReference,
          amount: selectedPkg.totalCost,
          currency: selectedPkg.currency,
          method: payMethod,
          vouchersCount: selectedPkg.quantity,
          pkgTitle: selectedPkg.title,
        });
        toast(`Deposited ${selectedPkg.quantity} vouchers into ${currentVaultJurisdictionMeta.vaultTitle}!`, 'emerald');
      }
    } catch {
      toast('Payment gateway processing error', 'rose');
    } finally {
      setIsPaying(false);
    }
  };

  // CSV Handlers
  const handleDownloadSampleCsv = () => {
    const dataAmt = convertUsdToLocal(3, selectedCountry).amount;
    const curr = perkProfile.currency;
    const sampleCsv = `voucher_code,brand,category,face_value,currency,pin,expiry_date\n${selectedCountry}-DATA-9001,${perkProfile.telcoBrand},telco_data,${dataAmt},${curr},9001,2026-12-31\n${selectedCountry}-WTR-9002,${perkProfile.waterBrand},water_utility,${dataAmt},${curr},9002,2026-12-31`;
    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CivicDuty_Desk_Vouchers_${selectedCountry}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Sample CSV template downloaded.', 'emerald');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        toast('CSV file must include a header row and at least 1 row.', 'amber');
        return;
      }
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const parsed: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim());
        if (cols.length >= 3) {
          const row: any = {};
          headers.forEach((h, idx) => {
            row[h] = cols[idx] || '';
          });
          parsed.push({
            voucherCode: row.voucher_code || row.code || cols[0],
            brand: row.brand || cols[1] || 'Utility',
            category: row.category || cols[2] || 'telco_data',
            faceValue: Number(row.face_value || cols[3] || convertUsdToLocal(3, selectedCountry).amount),
            currency: row.currency || cols[4] || perkProfile.currency,
            pin: row.pin || cols[5] || '',
            expiryDate: row.expiry_date || cols[6] || '2026-12-31',
          });
        }
      }
      setCsvPreviewRows(parsed);
      toast(`Parsed ${parsed.length} vouchers ready for escrow upload.`, 'emerald');
    };
    reader.readAsText(file);
  };

  const handleCommitCsvUpload = async () => {
    if (csvPreviewRows.length === 0) return;
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
        const tagged = data.vouchers.map((v: EscrowPerkVoucher) => ({
          ...v,
          vaultType: activeVaultKind,
          jurisdictionId: currentVaultJurisdictionMeta.jurisdictionId,
          jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
        }));
        savePerkVoucherBatchToCloud(tagged).catch(() => {});
        setVouchers((prev) => [...tagged, ...prev]);
        setCsvFile(null);
        setCsvPreviewRows([]);
        toast(`Deposited ${data.uploadedCount} vouchers into ${currentVaultJurisdictionMeta.vaultTitle}.`, 'emerald');
      } else {
        toast(data.error || 'Failed to upload CSV batch', 'rose');
      }
    } catch {
      toast('Error uploading voucher batch', 'rose');
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    setIsUploading(true);
    try {
      const res = await fetch('/api/perks/upload-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchName: `Single Deposit - ${manualBrand}`,
          sponsorName: manualSponsor,
          sponsorType: manualSponsorType,
          country: selectedCountry,
          vouchers: [
            {
              voucherCode: manualCode.trim(),
              pin: manualPin.trim() || undefined,
              brand: manualBrand,
              category: manualCategory,
              faceValue: Number(manualFaceValue) || 10000,
              currency: manualCurrency,
              expiryDate: manualExpiry,
            },
          ],
          isDemo: !uploadAsLive,
          sourceMethod: 'manual',
        }),
      });
      const data = await res.json();
      if (data.success && data.vouchers) {
        const tagged = data.vouchers.map((v: EscrowPerkVoucher) => ({
          ...v,
          vaultType: activeVaultKind,
          jurisdictionId: currentVaultJurisdictionMeta.jurisdictionId,
          jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
        }));
        savePerkVoucherBatchToCloud(tagged).catch(() => {});
        setVouchers((prev) => [...tagged, ...prev]);
        setManualCode('');
        setManualPin('');
        toast(`Voucher deposited into ${currentVaultJurisdictionMeta.vaultTitle}.`, 'emerald');
      }
    } catch {
      toast('Failed to deposit voucher', 'rose');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSeedPack = async (packType: 'supermarket' | 'mtn' | 'nwsc' | 'yaka') => {
    const currency = perkProfile.currency;
    const amt = convertUsdToLocal(packType === 'supermarket' ? 8 : 3, selectedCountry);
    const brand =
      packType === 'supermarket'
        ? perkProfile.supermarketBrand
        : packType === 'mtn'
        ? perkProfile.telcoBrand
        : packType === 'nwsc'
        ? perkProfile.waterBrand
        : perkProfile.powerBrand;
    const category =
      packType === 'supermarket'
        ? 'supermarket'
        : packType === 'mtn'
        ? 'telco_data'
        : packType === 'nwsc'
        ? 'water_utility'
        : 'electricity';

    const seedRows = Array.from({ length: 3 }).map((_, idx) => {
      const rand = Math.floor(1000 + Math.random() * 9000);
      return {
        voucherCode: `SEED-${packType.toUpperCase()}-${rand}-${idx + 1}`,
        pin: `${rand}`,
        brand,
        category,
        faceValue: amt.amount,
        currency,
        expiryDate: '2026-12-31',
      };
    });

    setIsUploading(true);
    try {
      const res = await fetch('/api/perks/upload-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchName: `${brand} Sandbox Desk Seed`,
          sponsorName: user?.organization_name || `${perkProfile.sampleSponsor} (Sandbox)`,
          sponsorType: deskMode === 'government' ? 'authority' : 'corporate_csr',
          country: selectedCountry,
          vouchers: seedRows,
          isDemo: true,
          sourceMethod: 'seed',
        }),
      });
      const data = await res.json();
      if (data.success && data.vouchers) {
        const tagged = data.vouchers.map((v: EscrowPerkVoucher) => ({
          ...v,
          vaultType: activeVaultKind,
          jurisdictionId: currentVaultJurisdictionMeta.jurisdictionId,
          jurisdictionLabel: currentVaultJurisdictionMeta.jurisdictionLabel,
        }));
        setVouchers((prev) => [...tagged, ...prev]);
        toast(`Seeded ${data.uploadedCount} test vouchers into ${currentVaultJurisdictionMeta.vaultTitle}.`, 'emerald');
      }
    } catch {
      toast('Failed to seed test pack', 'rose');
    } finally {
      setIsUploading(false);
    }
  };

  const canExecuteActiveDispatch =
    activeVaultKind === 'provider_vault'
      ? isAuthorizedProvider
      : activeVaultKind === 'contractor_vault'
      ? isAuthorizedContractor
      : isAuthorizedGovOfficer;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
            <Award size={14} className="shrink-0" />
            <span>
              {deskMode === 'provider'
                ? 'Private Provider Courtesy & Loyalty Vault'
                : 'Institutional Jurisdiction & Contract Vaults'}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
            {user?.organization_name || currentVaultJurisdictionMeta.jurisdictionLabel} · Perks &amp; Vault Escrow
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {deskMode === 'provider'
              ? 'Manage pre-funded customer appreciation vouchers, scan counter passes, and award Monthly Top-3 patrons.'
              : `Fund monthly ${gov.tier1UnitLabel} & Contractor Watchdog pools, verify rankings, and generate auditable CSR certificates.`}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {deskMode === 'provider' && (
            <>
              <button
                type="button"
                onClick={() => setIsScannerModalOpen(true)}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-mono font-bold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs"
              >
                <ScanLine size={14} />
                <span>Counter QR Scanner</span>
              </button>
              {onOpenMerchantPos && (
                <button
                  type="button"
                  onClick={onOpenMerchantPos}
                  className="min-h-[40px] px-3 py-2 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Store size={13} />
                  <span>Merchant Studio</span>
                </button>
              )}
            </>
          )}
          <button
            type="button"
            onClick={loadVaultData}
            title="Refresh Ledger"
            className="min-h-[40px] min-w-[40px] p-2 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-emerald-500' : ''} />
          </button>
        </div>
      </div>

      {/* 4 KPI Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">In Escrow</span>
            <Ticket size={14} className="text-amber-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            {stats.unassignedCount}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">Ready for dispatch</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">Locked Value</span>
            <ShieldCheck size={14} className="text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 truncate tabular-nums">
            {stats.currency} {stats.totalEscrowFaceValue.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">Escrowed liquidity</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">Dispatched</span>
            <Gift size={14} className="text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            {stats.dispatchedCount}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">Issued to citizens</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">Sponsors</span>
            <Building2 size={14} className="text-slate-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            {stats.uniqueSponsors}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">Active CSR partners</div>
        </div>
      </div>

      {/* Desk Vault Selector & Monthly Top-3 Merit Dispatch */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-4">
        {deskMode === 'government' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'parish_vault' as VaultKind,
                title: `${gov.tier1UnitLabel} Monthly Top-3 Vault`,
                subtitle: `Monthly ${gov.tier1UnitLabel} Award · ${gov.tier1Short}`,
                desc: `Evaluates verified residents across ${gov.tier1Plural.toLowerCase()} and awards the Top 3 evenly at month-end.`,
                icon: MapPin,
              },
              {
                id: 'contractor_vault' as VaultKind,
                title: 'Contractor Watchdog Vault',
                subtitle: 'Public Works & Tenders · Site Verification',
                desc: 'Works agencies and contractors lock escrow per project and award Top 3 geotagged site inspectors.',
                icon: HardHat,
              },
            ].map((card) => {
              const Icon = card.icon;
              const isSelected = activeVaultKind === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => {
                    setActiveVaultKind(card.id);
                    setLastBatchDispatchReceipt(null);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 dark:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/25 ring-1 ring-emerald-500/30'
                      : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Icon size={15} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{card.title}</div>
                      <div className="text-[10.5px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                        {card.subtitle}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{card.desc}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Jurisdiction Picker */}
        <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold flex-wrap">
                <span>{currentVaultJurisdictionMeta.vaultTitle}</span>
                <span>·</span>
                <span>{awardMonthLabel}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentVaultJurisdictionMeta.rankingRule}
              </p>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Authorized Officer: <strong className="text-slate-900 dark:text-white">{currentVaultJurisdictionMeta.dispatcherTitle}</strong>
              </div>
            </div>

            <div className="w-full lg:w-80 shrink-0 space-y-2">
              <SearchableSelect
                value={selectedAwardMonth}
                onChange={(val) => setSelectedAwardMonth(val as any)}
                ariaLabel="Award Cycle"
                placeholder="Select cycle..."
                searchPlaceholder="Search cycle..."
                options={[
                  { value: '2026-10', label: 'October 2026 Cycle (Active)' },
                  { value: '2026-09', label: 'September 2026 Cycle' },
                  { value: '2026-08', label: 'August 2026 Cycle' },
                ]}
                triggerClassName="bg-white dark:bg-[#161a22] font-mono font-semibold"
              />

              {activeVaultKind === 'parish_vault' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10.5px] font-mono">
                    <span className="text-slate-500 font-bold uppercase">{gov.tier1UnitLabel} Scope</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setParishDepositMode('home');
                          setSelectedParish(userHomeParish);
                        }}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          parishDepositMode === 'home'
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        My {gov.tier1UnitLabel}
                      </button>
                      <button
                        type="button"
                        onClick={() => setParishDepositMode('external')}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          parishDepositMode === 'external'
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        Browse All
                      </button>
                    </div>
                  </div>

                  {parishDepositMode === 'home' ? (
                    <div className="px-3 py-2 rounded-lg bg-white dark:bg-[#161a22] border border-emerald-500/30 text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <MapPin size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate">{selectedParish}</span>
                    </div>
                  ) : (
                    <SearchableSelect
                      value={selectedParish}
                      placeholder={`Select ${gov.tier1UnitLabel}...`}
                      searchPlaceholder={`Search ${gov.tier1UnitLabel.toLowerCase()}...`}
                      allowCustom
                      customLabelPrefix={`Use ${gov.tier1UnitLabel}:`}
                      options={parishOptions.map((par) => ({
                        value: par,
                        label: par === userHomeParish ? `${par} (Your Desk)` : par,
                      }))}
                      onChange={(val) => setSelectedParish(val)}
                      triggerClassName="bg-white dark:bg-[#161a22] px-3 py-2 font-semibold"
                    />
                  )}
                </div>
              )}

              {activeVaultKind === 'contractor_vault' && (
                <SearchableSelect
                  value={selectedContractId}
                  placeholder="Select Public Works Contract..."
                  searchPlaceholder="Search contract or firm..."
                  options={contractOptions.map((c) => ({
                    value: c.id,
                    label: `[${c.code || c.id}] ${c.title} — ${c.contractor}`,
                  }))}
                  onChange={(val) => setSelectedContractId(val)}
                  triggerClassName="bg-white dark:bg-[#161a22] px-3 py-2 font-semibold"
                />
              )}

              {activeVaultKind === 'provider_vault' && (
                <SearchableSelect
                  value={selectedProviderDept}
                  placeholder="Select Provider Desk..."
                  searchPlaceholder="Search business or utility..."
                  options={providerOptions.map((d) => ({
                    value: d.id,
                    label: d.name,
                  }))}
                  onChange={(val) => setSelectedProviderDept(val)}
                  triggerClassName="bg-white dark:bg-[#161a22] px-3 py-2 font-semibold"
                />
              )}
            </div>
          </div>

          {lastBatchDispatchReceipt && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-bold text-emerald-900 dark:text-emerald-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                  Monthly Top-3 Award Dispatched ({lastBatchDispatchReceipt.awardMonthLabel})
                </span>
                <span className="text-[10.5px] font-mono">
                  Signed: {lastBatchDispatchReceipt.dispatcherLabel} · {lastBatchDispatchReceipt.dispatchedAt}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {lastBatchDispatchReceipt.recipients.map((rec) => (
                  <div
                    key={`${rec.rank}-${rec.voucherCode}`}
                    className="p-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-emerald-500/30 text-[11px] font-mono space-y-0.5"
                  >
                    <div className="font-bold text-slate-900 dark:text-white flex justify-between">
                      <span>#{rec.rank} {rec.name}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">{rec.score} pts</span>
                    </div>
                    <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                      {rec.brand} · {rec.voucherCode}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monthly Top-3 Ranked Citizens */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeJurisdictionTop3.map((cit) => (
              <div
                key={cit.rank}
                className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col justify-between gap-2.5"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      Rank #{cit.rank} · 33.3% Share
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">{cit.score} pts</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{cit.name}</span>
                    <Lock size={11} className="text-slate-400 shrink-0" />
                  </div>
                  <div className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 truncate">
                    {cit.roleOrProfession}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug bg-[#f8f9fa] dark:bg-[#0e1116] p-2 rounded-lg border border-[#e3e6ea] dark:border-[#262b36]">
                    {cit.citationReason}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] grid grid-cols-3 gap-1 text-center text-[10px] font-mono tabular-nums">
                  <div>
                    <span className="text-slate-400 block">Reports</span>
                    <strong className="text-slate-900 dark:text-white">{cit.reportsCount}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Verified</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{cit.resolvedOrVerifiedCount}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Upvotes</span>
                    <strong className="text-slate-900 dark:text-white">{cit.upvotesCount}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Release Dispatch & Deposit Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
            {canExecuteActiveDispatch ? (
              <button
                type="button"
                disabled={isBatchDispatching}
                onClick={handleExecuteVaultDispatch}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                <Send size={13} />
                <span>
                  {isBatchDispatching
                    ? 'Dispatching Top-3 Split...'
                    : 'Execute Monthly Top-3 Award Dispatch'}
                </span>
              </button>
            ) : (
              <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <Lock size={13} className="text-slate-400 shrink-0" />
                <span>Sign in with an authorized officer account to release awards for this pool.</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setActiveTab('pay');
                studioSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-mono font-bold inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Plus size={13} />
              <span>Fund This Vault</span>
            </button>
          </div>
        </div>
      </div>

      {/* Funding, BYOV Upload & CSR Governance Studio */}
      <div
        ref={studioSectionRef}
        className="p-4 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload size={15} className="text-emerald-600 dark:text-emerald-400" />
              <span>Fund Escrow, Upload Vouchers &amp; CSR Governance</span>
            </h4>
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              Mobile Money / Card Auto-Mint · Bulk CSV (0% Fee) · Single PIN · CSR Audit Certificates
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-[#f8f9fa] dark:bg-[#0e1116] p-1 rounded-xl border border-[#e3e6ea] dark:border-[#262b36]">
            {[
              { id: 'pay' as const, label: 'Auto-Mint Checkout', icon: CreditCard },
              { id: 'csv' as const, label: 'BYOV CSV', icon: FileSpreadsheet },
              { id: 'manual' as const, label: 'Single PIN', icon: Plus },
              ...(showDemos ? [{ id: 'packs' as const, label: 'Seed Packs ($0)', icon: Package }] : []),
              { id: 'csr_leaderboard' as const, label: 'CSR Certificates', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'pay') setPaymentReceipt(null);
                  }}
                  className={`min-h-[36px] px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center justify-between gap-2 text-xs bg-[#f8f9fa] dark:bg-[#0e1116] px-3 py-2 rounded-xl border border-[#e3e6ea] dark:border-[#262b36]">
          <span className="font-mono text-slate-600 dark:text-slate-400">
            Batch Mode: <strong>{uploadAsLive ? 'LIVE Escrow Deposit' : 'SANDBOX Demo'}</strong>
          </span>
          <button
            type="button"
            onClick={() => setUploadAsLive((v) => !v)}
            className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Switch to {uploadAsLive ? 'Sandbox Mode' : 'Live Mode'}
          </button>
        </div>

        {/* TAB: AUTO-MINT CHECKOUT */}
        {activeTab === 'pay' && (
          <form onSubmit={handleExecuteDirectPayment} className="space-y-4">
            {paymentReceipt && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span>
                    Escrowed {paymentReceipt.vouchersCount}x vouchers ({paymentReceipt.currency}{' '}
                    {Number(paymentReceipt.amount).toLocaleString()}) · Ref: {paymentReceipt.reference}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentReceipt(null)}
                  className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {allocationCatalog.map((item) => {
                const isSelected = payPackage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPayPackage(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-500/10 ring-1 ring-emerald-500/30'
                        : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 text-xs font-bold text-slate-900 dark:text-white">
                      <span>{item.shortTitle}</span>
                      {isSelected && <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {item.brand} · {item.packagedItems.join(' · ')}
                    </div>
                    <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      {item.currency} {item.totalCost.toLocaleString()}
                    </div>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setPayPackage('custom')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  payPackage === 'custom'
                    ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/30'
                    : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-400">
                  <span className="flex items-center gap-1.5">
                    <SlidersHorizontal size={13} /> Custom Basket
                  </span>
                  {payPackage === 'custom' && <Check size={14} />}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Configure quantity, unit amount &amp; items manually
                </div>
                <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {perkProfile.currency} {(customQuantity * customFaceValue).toLocaleString()}
                </div>
              </button>
            </div>

            {payPackage === 'custom' && (
              <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-indigo-500/30 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={customQuantity}
                    onChange={(e) => setCustomQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                    Unit Value ({perkProfile.currency})
                  </label>
                  <input
                    type="number"
                    min={500}
                    step={500}
                    value={customFaceValue}
                    onChange={(e) => setCustomFaceValue(Math.max(500, parseInt(e.target.value) || 1000))}
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                    Items Included (Comma-Separated)
                  </label>
                  <input
                    type="text"
                    value={customPackagedItemsInput}
                    onChange={(e) => setCustomPackagedItemsInput(e.target.value)}
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                  Sponsor / Desk Name
                </label>
                <input
                  type="text"
                  value={paySponsorName}
                  onChange={(e) => setPaySponsorName(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                  Payment Method
                </label>
                <SearchableSelect
                  value={payMethod}
                  onChange={(val) => setPayMethod(val as any)}
                  ariaLabel="Payment Method"
                  placeholder="Select payment method..."
                  searchPlaceholder="Search payment method..."
                  options={[
                    { value: 'momo', label: 'MTN MoMo' },
                    { value: 'airtel', label: 'Airtel Money' },
                    { value: 'mpesa', label: 'M-Pesa' },
                    { value: 'card', label: 'Corporate / Visa Card' },
                    { value: 'bank', label: 'Bank Escrow Transfer' },
                  ]}
                  triggerClassName="bg-[#f8f9fa] dark:bg-[#0e1116]"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                  Billing Phone / Reference
                </label>
                <input
                  type="text"
                  value={payPhone}
                  onChange={(e) => setPayPhone(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl px-3 py-2 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPaying}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
            >
              {isPaying
                ? 'Processing Settlement...'
                : `Mint & Lock ${selectedPkg.quantity}x Vouchers (${selectedPkg.currency} ${selectedPkg.totalCost.toLocaleString()})`}
            </button>
          </form>
        )}

        {/* TAB: BYOV CSV */}
        {activeTab === 'csv' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                  Sponsoring Desk / Partner
                </label>
                <input
                  type="text"
                  value={csvSponsor}
                  onChange={(e) => setCsvSponsor(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                  Target Project / Ward Label
                </label>
                <input
                  type="text"
                  value={csvProjectName}
                  onChange={(e) => setCsvProjectName(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-3 bg-[#f8f9fa] dark:bg-[#0e1116]">
              <FileSpreadsheet size={28} className="mx-auto text-amber-500" />
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {csvFile ? csvFile.name : 'Upload Pre-Funded Voucher CSV'}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Columns: voucher_code, brand, category, face_value, currency, pin, expiry_date
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <label className="min-h-[40px] cursor-pointer px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5">
                  <Upload size={14} />
                  <span>Choose CSV File</span>
                  <input type="file" accept=".csv,text/csv" onChange={handleFileChange} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="min-h-[40px] px-3.5 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Sample CSV</span>
                </button>
              </div>
            </div>

            {csvPreviewRows.length > 0 && (
              <button
                type="button"
                disabled={isUploading}
                onClick={handleCommitCsvUpload}
                className="w-full min-h-[44px] py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono font-bold uppercase cursor-pointer disabled:opacity-50"
              >
                {isUploading ? 'Depositing...' : `Deposit ${csvPreviewRows.length} Vouchers into Vault`}
              </button>
            )}
          </div>
        )}

        {/* TAB: SINGLE PIN */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualDeposit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                  Brand / Utility
                </label>
                <input
                  type="text"
                  value={manualBrand}
                  onChange={(e) => setManualBrand(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                  Voucher Code *
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder={`e.g. DATA-${selectedCountry}-9901`}
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl px-3 py-2 font-mono font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                  Face Value ({manualCurrency})
                </label>
                <input
                  type="number"
                  value={manualFaceValue}
                  onChange={(e) => setManualFaceValue(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl px-3 py-2 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                  PIN (Optional)
                </label>
                <input
                  type="text"
                  value={manualPin}
                  onChange={(e) => setManualPin(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl px-3 py-2 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                  Sponsor Name
                </label>
                <input
                  type="text"
                  value={manualSponsor}
                  onChange={(e) => setManualSponsor(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={manualExpiry}
                  onChange={(e) => setManualExpiry(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl px-3 py-2 font-mono"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isUploading}
              className="w-full min-h-[44px] py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-mono font-bold uppercase cursor-pointer disabled:opacity-50"
            >
              {isUploading ? 'Depositing...' : 'Deposit Pre-Funded Voucher into Vault'}
            </button>
          </form>
        )}

        {/* TAB: SANDBOX SEED PACKS (ONLY WHEN showDemos IS ENABLED) */}
        {activeTab === 'packs' && showDemos && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'supermarket' as const, label: `${perkProfile.supermarketBrand}`, icon: ShoppingBag },
              { id: 'mtn' as const, label: `${perkProfile.telcoBrand} Data`, icon: Smartphone },
              { id: 'nwsc' as const, label: `${perkProfile.waterBrand} Water`, icon: Droplet },
              { id: 'yaka' as const, label: `${perkProfile.powerBrand} Power`, icon: Zap },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col justify-between gap-2.5"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Icon size={15} className="text-emerald-600 dark:text-emerald-400" />
                    <span>3x {p.label}</span>
                  </div>
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => handleSeedPack(p.id)}
                    className="min-h-[38px] w-full py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-mono font-semibold cursor-pointer disabled:opacity-50"
                  >
                    Seed 3x Test Vouchers
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: CSR CERTIFICATES */}
        {activeTab === 'csr_leaderboard' && (
          <div className="space-y-2.5">
            {sponsorLeaderboard.map((sp, idx) => (
              <div
                key={sp.sponsorName}
                className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="font-mono text-emerald-700 dark:text-emerald-400">#{idx + 1}</span>
                    <span className="truncate">{sp.sponsorName}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {sp.totalVouchers} vouchers ({sp.dispatchedCount} dispatched) · Seal: {sp.certHash}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {sp.currency} {sp.totalFaceValue.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveCsrCertSponsor(sp)}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-mono font-bold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Printer size={13} />
                    <span>CSR Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desk Escrow Inventory Ledger */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Ticket size={16} className="text-amber-500" />
              <span>Desk Escrow Inventory Ledger ({filteredVouchers.length})</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Complete register of funded tokens, recipients, and POS settlement status.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search code, brand..."
                className="pl-8 pr-3 py-1.5 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl text-xs w-44"
              />
            </div>
            <SearchableSelect
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              ariaLabel="Voucher Status Filter"
              placeholder="Filter status..."
              searchPlaceholder="Search status..."
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'escrow_unassigned', label: 'In Escrow' },
                { value: 'dispatched', label: 'Dispatched' },
                { value: 'redeemed', label: 'Redeemed' },
              ]}
              className="w-40"
              triggerClassName="bg-[#f8f9fa] dark:bg-[#0e1116] py-1.5 font-mono font-semibold"
            />
          </div>
        </div>

        {filteredVouchers.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-slate-500">
            No vouchers matching current desk filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#e3e6ea] dark:border-[#262b36] text-[10.5px] font-mono uppercase text-slate-500">
                <tr>
                  <th className="py-2 pr-3">Code</th>
                  <th className="py-2 px-3">Brand &amp; Offer</th>
                  <th className="py-2 px-3">Value</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Recipient</th>
                  <th className="py-2 pl-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e6ea] dark:divide-[#262b36]">
                {filteredVouchers.slice(0, 20).map((v) => (
                  <tr key={v.id} className="hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116]">
                    <td className="py-2.5 pr-3 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {v.voucherCode}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{v.brand}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{v.title}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums whitespace-nowrap">
                      {v.currency} {Number(v.faceValue).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap">
                      {v.status === 'escrow_unassigned' ? (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">In Escrow</span>
                      ) : v.status === 'dispatched' ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Dispatched</span>
                      ) : (
                        <span className="text-slate-500 font-semibold">Redeemed</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[11px]">
                      {v.dispatchedTo ? (
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {v.dispatchedTo.recipientName}
                          </div>
                          <div className="text-slate-500 font-mono">{v.dispatchedTo.recipientContact}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400">Unclaimed</span>
                      )}
                    </td>
                    <td className="py-2.5 pl-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {(v.status === 'dispatched' || v.status === 'redeemed') && (
                          <button
                            type="button"
                            onClick={() => {
                              setPassModalVoucher(v);
                              setIsPassModalOpen(true);
                            }}
                            className="px-2 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10.5px] font-mono font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <QrCode size={11} /> Pass
                          </button>
                        )}
                        {deskMode === 'provider' && v.status === 'dispatched' && (
                          <button
                            type="button"
                            onClick={() => handleProviderRedeemVoucher(v)}
                            className="px-2 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[10.5px] font-mono font-bold cursor-pointer"
                          >
                            Redeem
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            copyToClipboard(v.voucherCode);
                            toast(`Copied ${v.voucherCode}`, 'emerald');
                          }}
                          className="p-1.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                          title="Copy Code"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verifiable CSR Impact Certificate Modal */}
      {activeCsrCertSponsor && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveCsrCertSponsor(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-teal-500/40 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase text-teal-600 dark:text-teal-400">
                  Verifiable CSR Impact Certificate
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeCsrCertSponsor.sponsorName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCsrCertSponsor(null)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Total Funded</span>
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {activeCsrCertSponsor.currency} {activeCsrCertSponsor.totalFaceValue.toLocaleString()}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Vouchers</span>
                <strong>
                  {activeCsrCertSponsor.totalVouchers} ({activeCsrCertSponsor.dispatchedCount} Sent)
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Country</span>
                <strong>{COUNTRIES[selectedCountry]?.name || selectedCountry}</strong>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-mono text-emerald-800 dark:text-emerald-300">
              Registry Seal: {activeCsrCertSponsor.certHash}
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={13} />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <VoucherPassModal
        isOpen={isPassModalOpen}
        onClose={() => {
          setIsPassModalOpen(false);
          setPassModalVoucher(null);
        }}
        voucher={passModalVoucher}
      />

      <VoucherScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        vouchers={vouchers}
        onRedeemVoucher={handleProviderRedeemVoucher}
        activeBranchName={user?.branch_name || 'Central Desk'}
        activeBranchId={user?.branch_id}
        activeBranchParish={user?.branch_parish}
        activeDeptName={currentVaultJurisdictionMeta.jurisdictionLabel}
        activeCountry={selectedCountry}
      />
    </div>
  );
};
