import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EscrowPerkVoucher, CountryCode } from '../types';
import { COUNTRIES } from '../data/countries';
import { savePerkVoucherBatchToCloud, fetchPerkVouchersFromCloud, saveGatewayTransactionToCloud } from '../services/firestoreSync';
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
  Copy,
  ExternalLink,
  Sparkles,
  RefreshCw,
  CreditCard,
  Wallet,
  Banknote,
  Shield,
  Check,
  Phone
} from 'lucide-react';

export const PerkVaultView: React.FC = () => {
  const { user, go, toast, logAudit } = useApp();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(user?.country || 'UG');
  const [vouchers, setVouchers] = useState<EscrowPerkVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pay' | 'packs' | 'csv' | 'manual'>('pay');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Direct Payment & Instant Escrow Buy State
  const [payPackage, setPayPackage] = useState<'mtn_5' | 'mtn_10' | 'nwsc_5' | 'yaka_5' | 'safeboda_10' | 'custom'>('mtn_5');
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
  const [customQuantity, setCustomQuantity] = useState(5);
  const [customFaceValue, setCustomFaceValue] = useState(10000);
  const [customBrand, setCustomBrand] = useState('MTN Uganda');
  const [customCategory, setCustomCategory] = useState<'telco_data' | 'water_utility' | 'electricity' | 'transit_credit'>('telco_data');
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
  const [manualCategory, setManualCategory] = useState<'telco_data' | 'water_utility' | 'electricity' | 'transit_credit'>('telco_data');
  const [manualCode, setManualCode] = useState('');
  const [manualPin, setManualPin] = useState('');
  const [manualFaceValue, setManualFaceValue] = useState('10000');
  const [manualCurrency, setManualCurrency] = useState('UGX');
  const [manualSponsor, setManualSponsor] = useState(user?.name ? `${user.name} (Civic Patron)` : 'Seyani Brothers Construction Ltd');
  const [manualSponsorType, setManualSponsorType] = useState<'contractor' | 'authority' | 'corporate_csr' | 'citizen_patron'>('citizen_patron');
  const [manualExpiry, setManualExpiry] = useState('2026-12-31');

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
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = v.voucherCode.toLowerCase().includes(q);
        const matchesBrand = v.brand.toLowerCase().includes(q);
        const matchesSponsor = v.sponsoredBy.toLowerCase().includes(q);
        const matchesRecipient = v.dispatchedTo?.recipientName.toLowerCase().includes(q) || v.dispatchedTo?.recipientContact.includes(q);
        if (!matchesCode && !matchesBrand && !matchesSponsor && !matchesRecipient) return false;
      }
      return true;
    });
  }, [vouchers, selectedCountry, filterStatus, searchQuery]);

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
        }),
      });

      const data = await res.json();
      if (data.success && data.vouchers) {
        // Sync to Cloud Firestore
        savePerkVoucherBatchToCloud(data.vouchers).catch(() => {});

        setVouchers((prev) => [...data.vouchers, ...prev]);
        setCsvFile(null);
        setCsvPreviewRows([]);
        toast(`🎉 Successfully deposited ${data.uploadedCount} pre-funded vouchers into Sovereign Perk Escrow!`, 'emerald');
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
        }),
      });

      const data = await res.json();
      if (data.success && data.vouchers) {
        savePerkVoucherBatchToCloud(data.vouchers).catch(() => {});
        setVouchers((prev) => [...data.vouchers, ...prev]);
        setManualCode('');
        setManualPin('');
        toast(`🎉 Pre-funded voucher deposited to Escrow Vault!`, 'emerald');
      }
    } catch {
      toast('Failed to deposit voucher', 'rose');
    } finally {
      setIsUploading(false);
    }
  };

  // Quick Seed Pack
  const handleSeedPack = async (packType: 'mtn' | 'nwsc' | 'yaka') => {
    let seedRows: any[] = [];
    let sponsorName = 'Seyani Brothers Construction Ltd (CSR Allocation)';
    let batchTitle = 'Corporate CSR Allocation';

    if (packType === 'mtn') {
      sponsorName = 'Seyani Brothers Construction Ltd (CSR Allocation)';
      batchTitle = 'Seyani Bros CSR - MTN 2GB Data Seed';
      for (let i = 1; i <= 5; i++) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        seedRows.push({
          voucherCode: `MTN-2GB-${rand}-CIVIC`,
          pin: `${rand}`,
          brand: 'MTN Uganda',
          category: 'telco_data',
          faceValue: 10000,
          currency: 'UGX',
          expiryDate: '2026-12-31',
        });
      }
    } else if (packType === 'nwsc') {
      sponsorName = 'KCCA Urban Infrastructure Division';
      batchTitle = 'KCCA Leakage Audit Incentives';
      for (let i = 1; i <= 3; i++) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        seedRows.push({
          voucherCode: `NWSC-10K-${rand}-UG`,
          pin: `${rand}`,
          brand: 'NWSC Uganda',
          category: 'water_utility',
          faceValue: 10000,
          currency: 'UGX',
          expiryDate: '2026-12-31',
        });
      }
    } else if (packType === 'yaka') {
      sponsorName = 'Ministry of Energy & Mineral Development';
      batchTitle = 'MEMD Rural Electrification CSR';
      for (let i = 1; i <= 3; i++) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        seedRows.push({
          voucherCode: `YAKA-15K-${rand}-UG`,
          pin: `${rand}`,
          brand: 'Umeme Power',
          category: 'electricity',
          faceValue: 15000,
          currency: 'UGX',
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
          sponsorType: 'contractor',
          country: selectedCountry,
          vouchers: seedRows,
        }),
      });

      const data = await res.json();
      if (data.success && data.vouchers) {
        savePerkVoucherBatchToCloud(data.vouchers).catch(() => {});
        setVouchers((prev) => [...data.vouchers, ...prev]);
        toast(`Deposited ${data.uploadedCount} vouchers into escrow!`, 'emerald');
      }
    } catch {
      toast('Failed to deposit pack', 'rose');
    } finally {
      setIsUploading(false);
    }
  };

  // Details of the selected digital utility package
  const getPackageDetails = () => {
    const isKe = selectedCountry === 'KE';
    const currency = isKe ? 'KES' : 'UGX';

    switch (payPackage) {
      case 'mtn_5':
        return {
          title: isKe ? '5x Safaricom 2GB Data Packs' : '5x MTN 2GB Freedom Data Packs',
          brand: isKe ? 'Safaricom' : 'MTN Uganda',
          category: 'telco_data' as const,
          unitFaceValue: isKe ? 360 : 10000,
          quantity: 5,
          totalCost: isKe ? 1800 : 50000,
          currency,
          description: isKe ? '5 Safaricom high-speed 2GB data vouchers for watchdog upload' : '5 MTN Uganda 2GB vouchers pre-funded for citizen project watchdogs',
        };
      case 'mtn_10':
        return {
          title: isKe ? '10x Safaricom 2GB Data Packs' : '10x MTN 2GB Data Mega Batch',
          brand: isKe ? 'Safaricom' : 'MTN Uganda',
          category: 'telco_data' as const,
          unitFaceValue: isKe ? 360 : 10000,
          quantity: 10,
          totalCost: isKe ? 3600 : 100000,
          currency,
          description: isKe ? '10 Safaricom data vouchers for wide community reporting' : '10 MTN data vouchers for continuous field inspection & photo evidence',
        };
      case 'nwsc_5':
        return {
          title: isKe ? '5x Nairobi Water Clean Water Credits' : '5x NWSC 10,000 UGX Water Tokens',
          brand: isKe ? 'Nairobi Water (NCWSC)' : 'NWSC Uganda',
          category: 'water_utility' as const,
          unitFaceValue: isKe ? 300 : 10000,
          quantity: 5,
          totalCost: isKe ? 1500 : 50000,
          currency,
          description: isKe ? '5 water utility vouchers for public sanitation whistleblowers' : '5 NWSC water tokens rewarding citizens reporting leaks & bursts',
        };
      case 'yaka_5':
        return {
          title: isKe ? '5x Kenya Power KPLC Prepaid Tokens' : '5x Umeme Yaka 15,000 UGX Power Tokens',
          brand: isKe ? 'Kenya Power (KPLC)' : 'Umeme Power',
          category: 'electricity' as const,
          unitFaceValue: isKe ? 500 : 15000,
          quantity: 5,
          totalCost: isKe ? 2500 : 75000,
          currency,
          description: isKe ? '5 prepaid electricity units for public streetlighting audits' : '5 Yaka units sponsored under public infrastructure energy CSR',
        };
      case 'safeboda_10':
        return {
          title: '10x SafeBoda Rapid Field Ride Credits',
          brand: 'SafeBoda',
          category: 'transit_credit' as const,
          unitFaceValue: isKe ? 150 : 5000,
          quantity: 10,
          totalCost: isKe ? 1500 : 50000,
          currency,
          description: '10 transit credits for citizen inspectors visiting project sites',
        };
      case 'custom':
      default:
        return {
          title: `${customQuantity}x ${customBrand} Custom CSR Allocation`,
          brand: customBrand,
          category: customCategory,
          unitFaceValue: customFaceValue,
          quantity: customQuantity,
          totalCost: customQuantity * customFaceValue,
          currency,
          description: `Custom package of ${customQuantity} pre-funded ${customBrand} vouchers`,
        };
    }
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

      // 3. Mint Verified Digital Utility Vouchers
      const mintedVouchers: any[] = [];
      const prefix = pkg.brand.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
      for (let i = 1; i <= pkg.quantity; i++) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        const pin = Math.floor(100000 + Math.random() * 900000).toString();
        const code = `${prefix}-${pkg.unitFaceValue >= 1000 ? `${Math.round(pkg.unitFaceValue / 1000)}K` : pkg.unitFaceValue}-${rand}-${selectedCountry}`;
        mintedVouchers.push({
          voucherCode: code,
          pin,
          brand: pkg.brand,
          category: pkg.category,
          faceValue: pkg.unitFaceValue,
          currency: pkg.currency,
          expiryDate: '2026-12-31',
          redemptionUssdString: (selectedCountry === 'KE' ? '*141*CODE#' : '*303*CODE#').replace('CODE', code),
        });
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
        }),
      });

      const batchData = await batchRes.json();
      if (batchData.success && batchData.vouchers) {
        // Sync to Cloud Firestore
        savePerkVoucherBatchToCloud(batchData.vouchers).catch(() => {});
        if (verifyData.transaction) {
          saveGatewayTransactionToCloud(verifyData.transaction).catch(() => {});
        }

        // Update local state
        setVouchers((prev) => [...batchData.vouchers, ...prev]);

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
          sponsor: paySponsorName,
          project: payProjectName,
          timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        });

        toast(`🎉 Payment confirmed! ${pkg.quantity} vouchers deposited and locked in Escrow!`, 'emerald');
      }
    } catch {
      toast('Payment gateway processing error', 'rose');
    } finally {
      setIsPaying(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
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
    <div className="p-4 space-y-5 animate-fade-in pb-20 text-slate-800 dark:text-slate-100 max-w-5xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => go('feed')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 mono">
                CSR Pre-Funding & Civic Rewards
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
                Phase 6 Sovereign Vault
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              Digital Utility Perk Escrow Vault
            </h1>
          </div>
        </div>

        {/* Country Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value as CountryCode)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 shadow-xs"
          >
            {Object.entries(COUNTRIES).map(([code, info]) => (
              <option key={code} value={code}>
                {info.flag} {info.name} ({code})
              </option>
            ))}
          </select>

          <button
            onClick={loadVaultData}
            title="Refresh Vault Ledger"
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Escrow Health & Inventory Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-3.5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400">
            <span className="text-[10px] mono font-bold uppercase tracking-wider">Unassigned in Escrow</span>
            <Ticket size={16} />
          </div>
          <div className="text-2xl font-black text-amber-950 dark:text-amber-100 mt-1 mono">
            {stats.unassignedCount}
          </div>
          <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">
            Pre-funded vouchers ready for instant dispatch
          </div>
        </div>

        <div className="card p-3.5 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
            <span className="text-[10px] mono font-bold uppercase tracking-wider">Escrow Liquidity Value</span>
            <ShieldCheck size={16} />
          </div>
          <div className="text-2xl font-black text-emerald-950 dark:text-emerald-100 mt-1 mono truncate">
            {stats.currency} {stats.totalEscrowFaceValue.toLocaleString()}
          </div>
          <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">
            Contractor & public CSR face value locked
          </div>
        </div>

        <div className="card p-3.5 bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border-indigo-500/30">
          <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-400">
            <span className="text-[10px] mono font-bold uppercase tracking-wider">Dispatched Perks</span>
            <Gift size={16} />
          </div>
          <div className="text-2xl font-black text-indigo-950 dark:text-indigo-100 mt-1 mono">
            {stats.dispatchedCount}
          </div>
          <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">
            Delivered to active watchdog citizens via SMS
          </div>
        </div>

        <div className="card p-3.5 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="text-[10px] mono font-bold uppercase tracking-wider">Sponsoring Entities</span>
            <Building2 size={16} />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1 mono">
            {stats.uniqueSponsors}
          </div>
          <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">
            Contractors, KCCA, NWSC, and Ministries
          </div>
        </div>
      </div>

      {/* Bodaboda & Frontline Scout Bounty Pool Spotlight Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/15 border-2 border-amber-400 dark:border-amber-600 space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black shadow-xs shrink-0">
              <Bike size={20} />
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                <span>Frontline Scout &amp; Bodaboda Road Safety Bounty Pools</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-200 font-bold">
                  Profession Targeted
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
                Corporate sponsors, logistics operators, and municipal partners deposit targeted MoMo fuel &amp; airtime bounties reserved for verified Bodaboda riders and public transit drivers who report street hazards, uncollected waste, and broken infrastructure.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPayPackage('safeboda_10');
              setActiveTab('pay');
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-2xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <span>Fund Boda Bounty Pool →</span>
          </button>
        </div>
      </div>

      {/* Main Upload / Deposit Box */}
      <div className="card p-4 space-y-4 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Upload size={18} className="text-amber-600 dark:text-amber-400" />
              Pre-Funded Voucher Deposit & Batch Ingestion
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Contractors and public entities upload digital utility codes (MTN, Airtel, NWSC, Yaka) before rewarding citizens.
            </p>
          </div>

          {/* Upload Method Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => { setActiveTab('pay'); setPaymentReceipt(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pay'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-amber-600 dark:text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <CreditCard size={13} />
              <span>Direct Buy (MoMo & Card)</span>
            </button>
            <button
              onClick={() => setActiveTab('packs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'packs'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Quick CSR Packs
            </button>
            <button
              onClick={() => setActiveTab('csv')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'csv'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              CSV Batch File
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'manual'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Manual Single
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

            {/* STEP 1: SELECT UTILITY PACK */}
            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-2">
                1. Select Digital Utility Voucher Allocation to Buy & Escrow
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Option 1: MTN/Safaricom Data 5x */}
                <button
                  type="button"
                  onClick={() => setPayPackage('mtn_5')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    payPackage === 'mtn_5'
                      ? 'border-amber-500 bg-amber-500/10 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <Smartphone size={14} />
                        <span>{selectedCountry === 'KE' ? 'Safaricom 2GB (5x)' : 'MTN 2GB Data (5x)'}</span>
                      </div>
                      {payPackage === 'mtn_5' && <Check size={14} className="text-amber-600 dark:text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      5 Watchdog data vouchers pre-funded for field photo uploads.
                    </p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">Total Price</span>
                    <span className="font-bold font-mono text-amber-600 dark:text-amber-400">
                      {selectedCountry === 'KE' ? 'KES 1,800' : 'UGX 50,000'}
                    </span>
                  </div>
                </button>

                {/* Option 2: MTN/Safaricom Data 10x */}
                <button
                  type="button"
                  onClick={() => setPayPackage('mtn_10')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    payPackage === 'mtn_10'
                      ? 'border-amber-500 bg-amber-500/10 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <Smartphone size={14} />
                        <span>{selectedCountry === 'KE' ? 'Safaricom 2GB (10x)' : 'MTN 2GB Mega (10x)'}</span>
                      </div>
                      {payPackage === 'mtn_10' && <Check size={14} className="text-amber-600 dark:text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      10 Data vouchers for sustained community watchdog tracking.
                    </p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">Total Price</span>
                    <span className="font-bold font-mono text-amber-600 dark:text-amber-400">
                      {selectedCountry === 'KE' ? 'KES 3,600' : 'UGX 100,000'}
                    </span>
                  </div>
                </button>

                {/* Option 3: Clean Water Pool */}
                <button
                  type="button"
                  onClick={() => setPayPackage('nwsc_5')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    payPackage === 'nwsc_5'
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                        <Droplet size={14} />
                        <span>{selectedCountry === 'KE' ? 'Nairobi Water (5x)' : 'NWSC Water (5x)'}</span>
                      </div>
                      {payPackage === 'nwsc_5' && <Check size={14} className="text-cyan-600 dark:text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      5 Pre-paid water tokens for leak & water burst whistleblowers.
                    </p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">Total Price</span>
                    <span className="font-bold font-mono text-cyan-600 dark:text-cyan-400">
                      {selectedCountry === 'KE' ? 'KES 1,500' : 'UGX 50,000'}
                    </span>
                  </div>
                </button>

                {/* Option 4: Electricity / Yaka */}
                <button
                  type="button"
                  onClick={() => setPayPackage('yaka_5')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    payPackage === 'yaka_5'
                      ? 'border-yellow-500 bg-yellow-500/10 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-600 dark:text-yellow-400">
                        <Zap size={14} />
                        <span>{selectedCountry === 'KE' ? 'KPLC Stima (5x)' : 'Umeme Yaka (5x)'}</span>
                      </div>
                      {payPackage === 'yaka_5' && <Check size={14} className="text-yellow-600 dark:text-yellow-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      5 Pre-paid electricity tokens for infrastructure audits.
                    </p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">Total Price</span>
                    <span className="font-bold font-mono text-yellow-600 dark:text-yellow-400">
                      {selectedCountry === 'KE' ? 'KES 2,500' : 'UGX 75,000'}
                    </span>
                  </div>
                </button>

                {/* Option 5: SafeBoda Rapid Field Ride */}
                <button
                  type="button"
                  onClick={() => setPayPackage('safeboda_10')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    payPackage === 'safeboda_10'
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <Bike size={14} />
                        <span>SafeBoda Transit (10x)</span>
                      </div>
                      {payPackage === 'safeboda_10' && <Check size={14} className="text-emerald-600 dark:text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      10 Transit credits for rapid site verification visits.
                    </p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">Total Price</span>
                    <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {selectedCountry === 'KE' ? 'KES 1,500' : 'UGX 50,000'}
                    </span>
                  </div>
                </button>

                {/* Option 6: Custom Allocation */}
                <button
                  type="button"
                  onClick={() => setPayPackage('custom')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    payPackage === 'custom'
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        <Sparkles size={14} />
                        <span>Custom CSR Allocation</span>
                      </div>
                      {payPackage === 'custom' && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Custom voucher count and value tailored to your project budget.
                    </p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">Custom Pool</span>
                    <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
                      {getPackageDetails().currency} {getPackageDetails().totalCost.toLocaleString()}
                    </span>
                  </div>
                </button>
              </div>

              {/* Custom Package Form (If selected) */}
              {payPackage === 'custom' && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-indigo-500/30 grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">Brand</label>
                    <select
                      value={customBrand}
                      onChange={(e) => setCustomBrand(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs font-medium"
                    >
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
                    <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">Voucher Quantity</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={customQuantity}
                      onChange={(e) => setCustomQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">Unit Face Value</label>
                    <input
                      type="number"
                      step={1000}
                      value={customFaceValue}
                      onChange={(e) => setCustomFaceValue(Math.max(100, parseInt(e.target.value) || 1000))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs font-bold text-center"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className="text-[10px] text-slate-400 mb-0.5">Total Settlement</div>
                    <div className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">
                      {getPackageDetails().currency} {(customQuantity * customFaceValue).toLocaleString()}
                    </div>
                  </div>
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

            {/* STEP 5: TOTAL SUMMARY & AUTHORIZATION BUTTON */}
            <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-amber-400" />
                  <span>Sovereign Escrow Guarantee & Direct Citizen Dispatch</span>
                </div>
                <div className="text-lg font-black tracking-tight flex items-baseline gap-2">
                  <span>{getPackageDetails().currency} {getPackageDetails().totalCost.toLocaleString()}</span>
                  <span className="text-xs font-normal text-slate-400">
                    ({getPackageDetails().quantity}x {getPackageDetails().brand} vouchers)
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Funded by <span className="text-slate-200 font-medium">{paySponsorName}</span> for <span className="text-slate-200 font-medium">{payProjectName}</span>
                </div>
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
                    <span>Authorize Payment & Escrow Perks</span>
                  </>
                )}
              </button>
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
              <span>{isUploading ? 'Depositing...' : 'Deposit Pre-Funded Voucher to Vault'}</span>
            </button>
          </form>
        )}

        {/* TAB 3: QUICK SEED CSR PACKS */}
        {activeTab === 'packs' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              One-click pre-load certified batches for sandbox demonstration and live field tests:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                    <Smartphone size={16} />
                    <span>5x MTN 2GB Data Packs</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Sponsored by Seyani Brothers (50,000 UGX CSR Allocation). Pre-funded for project watchdogs.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSeedPack('mtn')}
                  disabled={isUploading}
                  className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  Deposit 5x MTN Pack
                </button>
              </div>

              <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/5 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-bold text-xs">
                    <Droplet size={16} />
                    <span>3x NWSC 10,000 UGX Tokens</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    National Water leak whistleblower pool (30,000 UGX Water Token Pool).
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSeedPack('nwsc')}
                  disabled={isUploading}
                  className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  Deposit 3x NWSC Pack
                </button>
              </div>

              <div className="p-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400 font-bold text-xs">
                    <Zap size={16} />
                    <span>3x Umeme Yaka 15,000 UGX</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Ministry of Energy Prepaid Stima Units (45,000 UGX Power Allocation).
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSeedPack('yaka')}
                  disabled={isUploading}
                  className="w-full py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  Deposit 3x Yaka Pack
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Escrow Inventory Ledger */}
      <div className="card p-4 space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
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
                  <th className="py-2.5 px-3">Sponsoring Entity / Project</th>
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
                        <div className="flex items-center gap-1.5">
                          {getCategoryIcon(v.category)}
                          <span>{v.voucherCode}</span>
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
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {v.currency} {v.faceValue.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                          {v.sponsoredBy}
                        </div>
                        {v.projectName && (
                          <div className="text-[9.5px] text-slate-400 truncate">
                            {v.projectName}
                          </div>
                        )}
                        <span className="text-[8px] mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                          {v.sponsorType}
                        </span>
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
                            <div className="font-bold text-slate-900 dark:text-slate-100 text-[11px]">
                              {v.dispatchedTo.recipientName}
                            </div>
                            <div className="text-[10px] mono text-slate-500">
                              {v.dispatchedTo.recipientContact}
                            </div>
                            <div className="text-[8.5px] text-emerald-600 dark:text-emerald-400 font-bold">
                              SMS Delivered ✓
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
    </div>
  );
};
