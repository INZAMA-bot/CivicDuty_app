import React, { useState, useMemo, useEffect } from 'react';
import {
  Store,
  Plus,
  QrCode,
  Tag,
  Percent,
  Gift,
  Repeat,
  ShoppingBag,
  Coins,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Smartphone,
  Copy,
  Clock,
  ScanLine,
  Check,
  Receipt,
  FileText,
  BadgeAlert,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  MerchantProductService,
  MerchantVoucherRewardType,
  EscrowPerkVoucher,
  CountryCode,
  MARKETPLACE_CATEGORIES,
} from '../types';
import { COUNTRIES, TERRITORY } from '../data/countries';
import { getDept } from '../utils/helpers';
import {
  getStoredMerchantProducts,
  saveStoredMerchantProduct,
  calculateVoucherEconomics,
} from '../data/merchantLoyaltyData';

interface MerchantLoyaltyStudioProps {
  selectedCountry: CountryCode;
  activeMerchantDept?: string;
  currentVouchers: EscrowPerkVoucher[];
  onVoucherCreated?: (product: MerchantProductService) => void;
  onVoucherRedeemed?: (voucher: EscrowPerkVoucher) => void;
  onSelectForVaultDeposit?: (product: MerchantProductService) => void;
}

export const MerchantLoyaltyStudio: React.FC<MerchantLoyaltyStudioProps> = ({
  selectedCountry,
  activeMerchantDept,
  currentVouchers,
  onVoucherCreated,
  onVoucherRedeemed,
  onSelectForVaultDeposit,
}) => {
  const { user, toast, logAudit } = useApp();

  const [studioSubTab, setStudioSubTab] = useState<'create' | 'pos_scanner' | 'catalog'>('create');

  // Form State for Voucher Creation
  const [merchantName, setMerchantName] = useState(() => {
    if (activeMerchantDept) {
      const d = getDept(selectedCountry, activeMerchantDept);
      if (d) return d.name;
    }
    return user?.organization_name || user?.name ? `${user.organization_name || user.name} Services` : 'Kireka Beauty & Hair Salon';
  });

  useEffect(() => {
    if (activeMerchantDept) {
      const d = getDept(selectedCountry, activeMerchantDept);
      if (d) {
        setMerchantName(d.name);
      }
    }
  }, [activeMerchantDept, selectedCountry]);
  const [category, setCategory] = useState<string>('beauty_personal_care');
  const [parish, setParish] = useState<string>(() => {
    return user?.scope_label && user.scope_label.toLowerCase().includes('parish')
      ? user.scope_label
      : selectedCountry === 'KE' ? 'Kilimani Ward' : 'Kitintale Parish';
  });
  const [subCounty, setSubCounty] = useState<string>(selectedCountry === 'KE' ? 'Dagoretti North' : 'Nakawa Division');
  const [district, setDistrict] = useState<string>(selectedCountry === 'KE' ? 'Nairobi County' : 'Kampala');
  const [address, setAddress] = useState<string>('Plot 14, Main Commercial Street');
  const [productTitle, setProductTitle] = useState<string>('Hair Braiding & Scalp Steaming Treatment');
  const [basePrice, setBasePrice] = useState<number>(selectedCountry === 'KE' ? 1500 : 50000);
  const [rewardType, setRewardType] = useState<MerchantVoucherRewardType>('discount');
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [freebieItem, setFreebieItem] = useState<string>('Free Herbal Hair Wash & Scalp Massage');
  const [bogoQuantity, setBogoQuantity] = useState<string>('Buy 1 Enriched Family Loaf, Get 1 Free');
  const [giftItem, setGiftItem] = useState<string>('High-Performance Spark Plug & Chain Lube Free');
  const [cashbackSpend, setCashbackSpend] = useState<number>(selectedCountry === 'KE' ? 1500 : 50000);
  const [cashbackReturn, setCashbackReturn] = useState<number>(selectedCountry === 'KE' ? 150 : 5000);
  const [rewardDescription, setRewardDescription] = useState<string>(
    'Professional salon service covering box braids, treatment & wash for verified community winners.'
  );

  // POS Scanner State
  const [scannerCodeInput, setScannerCodeInput] = useState<string>('');
  const [isVerifyingPos, setIsVerifyingPos] = useState<boolean>(false);
  const [verifiedVoucher, setVerifiedVoucher] = useState<EscrowPerkVoucher | null>(null);
  const [posReceipt, setPosReceipt] = useState<any>(null);

  // Local products list state
  const [productsList, setProductsList] = useState<MerchantProductService[]>(() => getStoredMerchantProducts());

  const currency = selectedCountry === 'KE' ? 'KES' : selectedCountry === 'NG' ? 'NGN' : 'UGX';

  // Calculate Voucher Face Value / Price based on reward type
  const calculatedVoucherCost = useMemo(() => {
    if (rewardType === 'discount') {
      const discounted = Math.round(basePrice * (1 - discountPercent / 100));
      return Math.max(100, discounted);
    }
    return basePrice;
  }, [rewardType, basePrice, discountPercent]);

  // Economics strictly adhering to the <= 2% commission cap
  const economics = useMemo(() => {
    return calculateVoucherEconomics(calculatedVoucherCost, 0.02);
  }, [calculatedVoucherCost]);

  // Headline generator
  const generatedHeadline = useMemo(() => {
    switch (rewardType) {
      case 'discount':
        return `${discountPercent}% OFF ${productTitle}`;
      case 'freebie':
        return `Buy ${productTitle}, Get ${freebieItem}`;
      case 'bogo':
        return `BOGO: ${bogoQuantity}`;
      case 'gift':
        return `Buy ${productTitle}, Win ${giftItem}`;
      case 'cashback':
        return `Spend ${currency} ${cashbackSpend.toLocaleString()}, Get ${currency} ${cashbackReturn.toLocaleString()} Next Visit`;
    }
  }, [rewardType, discountPercent, productTitle, freebieItem, bogoQuantity, giftItem, cashbackSpend, cashbackReturn, currency]);

  // Create Product Voucher Handler
  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantName.trim() || !productTitle.trim()) {
      toast('Please enter merchant and product title', 'amber');
      return;
    }

    const newProd: MerchantProductService = {
      id: `merch-${Date.now().toString(36)}`,
      merchantId: activeMerchantDept || user?.id || `merch_${Date.now()}`,
      merchantName: merchantName.trim(),
      category,
      parish: parish.trim() || 'Kitintale Parish',
      subCounty: subCounty.trim(),
      district: district.trim(),
      address: address.trim(),
      country: selectedCountry,
      title: productTitle.trim(),
      basePrice,
      currency,
      rewardType,
      rewardHeadline: generatedHeadline,
      rewardDescription: rewardDescription.trim() || `${generatedHeadline} valid at ${merchantName}`,
      discountPercent: rewardType === 'discount' ? discountPercent : undefined,
      voucherCost: calculatedVoucherCost,
      commissionPct: 0.02,
      commissionAmount: economics.commissionAmount,
      merchantPayoutAmount: economics.merchantPayoutAmount,
      payoutStatus: 'escrowed',
      qrCodePayload: `CIVIC-${merchantName.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: `${selectedCountry === 'KE' ? '710' : '890'}${Math.floor(100000000 + Math.random() * 900000000)}`,
      ussdCode: `*303*${Math.floor(1000 + Math.random() * 9000)}#`,
      smsCode: `${merchantName.slice(0, 4).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`,
      active: true,
      createdAt: new Date().toISOString(),
    };

    saveStoredMerchantProduct(newProd);
    setProductsList((prev) => [newProd, ...prev]);

    // Send to backend server
    try {
      await fetch('/api/merchant-loyalty/create-product-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
    } catch {
      // offline fallback
    }

    logAudit(
      'MERCHANT_LOYALTY_VOUCHER_CREATED',
      newProd.id,
      `${merchantName} created ${generatedHeadline} (Cost: ${currency} ${calculatedVoucherCost.toLocaleString()} · 2% Fee: ${currency} ${economics.commissionAmount} · 98% Escrow Payout: ${currency} ${economics.merchantPayoutAmount}) in ${parish}`
    );

    if (onVoucherCreated) {
      onVoucherCreated(newProd);
    }

    toast(`Voucher "${generatedHeadline}" created! Now available in Vault Deposit & Top-3 awards.`, 'emerald');
    setStudioSubTab('catalog');
  };

  // POS Scanner Code Lookup & Redeem
  const handleLookupAndRedeem = async () => {
    if (!scannerCodeInput.trim()) {
      toast('Please enter or scan a voucher code or QR payload', 'amber');
      return;
    }

    setIsVerifyingPos(true);
    const clean = scannerCodeInput.trim().toUpperCase();

    try {
      const res = await fetch('/api/merchant-loyalty/pos-redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucherCode: clean,
          merchantName: merchantName || 'Store Service Desk',
          verifiedByStaff: user?.name || 'Counter Manager',
        }),
      });

      const data = await res.json();
      if (data.success && data.voucher) {
        setVerifiedVoucher(data.voucher);
        setPosReceipt({
          voucherCode: data.voucher.voucherCode,
          customerName: data.voucher.dispatchedTo?.recipientName || 'Verified Citizen Winner',
          customerContact: data.voucher.dispatchedTo?.recipientContact || '+256 770 000 000',
          itemTitle: data.voucher.title,
          faceValue: data.voucher.faceValue,
          currency: data.voucher.currency,
          payoutAmount: data.voucher.merchantPayout?.payoutAmount || Math.round(data.voucher.faceValue * 0.98),
          commissionFee: data.voucher.merchantPayout?.commissionAmount || Math.round(data.voucher.faceValue * 0.02),
          payoutRef: data.payoutReference,
          settledAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        if (onVoucherRedeemed) {
          onVoucherRedeemed(data.voucher);
        }
        toast(`Voucher Validated! 98% Escrow Payout (${data.voucher.currency} ${(data.voucher.faceValue * 0.98).toLocaleString()}) instantly released!`, 'emerald');
      } else {
        // Search local mock pool if server has not seen demo code
        const localFound = currentVouchers.find(
          (v) => (v.voucherCode && v.voucherCode.toUpperCase().includes(clean)) ||
                 (v.pin && v.pin.includes(clean)) ||
                 (v.barcode && v.barcode.includes(clean))
        );
        if (localFound) {
          const payoutVal = Math.round(localFound.faceValue * 0.98);
          const commVal = localFound.faceValue - payoutVal;
          const ref = `PAYOUT-MOMO-${Math.floor(100000 + Math.random() * 900000)}`;
          const updated: EscrowPerkVoucher = {
            ...localFound,
            status: 'redeemed',
            merchantPayout: {
              payoutAmount: payoutVal,
              commissionAmount: commVal,
              commissionRate: 0.02,
              payoutStatus: 'released',
              releasedAt: new Date().toISOString(),
              payoutReference: ref,
              payoutMethod: 'Instant Mobile Money Escrow Settlement (98%)',
            },
          };
          setVerifiedVoucher(updated);
          setPosReceipt({
            voucherCode: updated.voucherCode,
            customerName: updated.dispatchedTo?.recipientName || 'Verified Citizen Winner',
            customerContact: updated.dispatchedTo?.recipientContact || '+256 770 000 000',
            itemTitle: updated.title,
            faceValue: updated.faceValue,
            currency: updated.currency,
            payoutAmount: payoutVal,
            commissionFee: commVal,
            payoutRef: ref,
            settledAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
          if (onVoucherRedeemed) {
            onVoucherRedeemed(updated);
          }
          toast(`Voucher Verified! 98% Payout released to ${merchantName}.`, 'emerald');
        } else {
          toast(data.message || `Voucher "${clean}" not found or already redeemed`, 'rose');
        }
      }
    } catch {
      toast('Verification network error', 'rose');
    } finally {
      setIsVerifyingPos(false);
    }
  };

  const filteredCatalog = useMemo(() => {
    return productsList.filter(
      (p) => p.country.toUpperCase() === selectedCountry.toUpperCase()
    );
  }, [productsList, selectedCountry]);

  return (
    <div className="space-y-4 animate-fade-in text-slate-900 dark:text-slate-100">
      {/* Studio Header Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent border border-amber-500/30 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Store size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Merchant Loyalty &amp; Voucher Marketplace ("Loyalty-as-a-Service")
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  2% Capped Fee · 98% Escrow
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-600 dark:text-slate-300">
                Service providers create vouchers for their products. Vouchers are bought into Vaults, CivicDuty earns a 2% fee, and 98% is paid to the merchant upon customer redemption at the shop.
              </p>
            </div>
          </div>

          {/* Sub-Tabs: Create, Scan, Catalog */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] shrink-0">
            <button
              type="button"
              onClick={() => setStudioSubTab('create')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                studioSubTab === 'create'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Plus size={13} />
              <span>Create Voucher</span>
            </button>
            <button
              type="button"
              onClick={() => setStudioSubTab('pos_scanner')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                studioSubTab === 'pos_scanner'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ScanLine size={13} />
              <span>POS Redeem &amp; Payout</span>
            </button>
            <button
              type="button"
              onClick={() => setStudioSubTab('catalog')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                studioSubTab === 'catalog'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShoppingBag size={13} />
              <span>Catalog ({filteredCatalog.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: CREATE VOUCHER FOR PRODUCT / SERVICE */}
      {studioSubTab === 'create' && (
        <form onSubmit={handleCreateVoucher} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column: Merchant & Product Details */}
            <div className="lg:col-span-7 space-y-4 p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
              <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Store size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>1. Business Identity &amp; Physical Location</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  📍 Parish Matching for Posters
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10.5px] font-mono font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Shop / Service Provider Name
                  </label>
                  <input
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    placeholder="e.g. Kireka Beauty Salon &amp; Spa"
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-mono font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Marketplace Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    {MARKETPLACE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10.5px] font-mono font-bold text-slate-600 dark:text-slate-400 block mb-1 flex items-center justify-between">
                    <span>Parish / Ward Location</span>
                    <span className="text-emerald-600 text-[9.5px]">Crucial for proximity</span>
                  </label>
                  <input
                    type="text"
                    value={parish}
                    onChange={(e) => setParish(e.target.value)}
                    placeholder="e.g. Kitintale Parish or Kireka"
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-mono font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Street Address / Stage Landmark
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Plot 14, Opposite Shell"
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Product & Reward Structure */}
              <div className="flex items-center justify-between border-t border-b border-[#e3e6ea] dark:border-[#262b36] py-2 mt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Tag size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>2. Product / Service &amp; Reward Structure</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">5 Reward Types</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10.5px] font-mono font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Product or Service Title
                  </label>
                  <input
                    type="text"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    placeholder="e.g. Professional Hair Braiding, Men's Haircut, Fresh Bread, Engine Servicing"
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10.5px] font-mono font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Regular Base Price ({currency})
                    </label>
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value) || 0)}
                      className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                      min={100}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10.5px] font-mono font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Select Reward Form Type
                    </label>
                    <select
                      value={rewardType}
                      onChange={(e) => setRewardType(e.target.value as any)}
                      className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="discount">🏷️ Discount (e.g. 20% off braiding)</option>
                      <option value="freebie">🎁 Freebie (e.g. Buy haircut get free wash)</option>
                      <option value="bogo">🔄 BOGO (Buy 1 get 1 free)</option>
                      <option value="gift">🛍️ Gift (Buy product X, get prize/product Y free)</option>
                      <option value="cashback">💰 Cashback (Spend 50k get 5k voucher next time)</option>
                    </select>
                  </div>
                </div>

                {/* Conditional Reward Parameters based on reward type */}
                <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                  {rewardType === 'discount' && (
                    <div>
                      <div className="flex items-center justify-between text-[10.5px] font-mono font-bold mb-1">
                        <span>Discount Percentage: {discountPercent}% OFF</span>
                        <span className="text-emerald-600">
                          Final Voucher Cost: {currency} {calculatedVoucherCost.toLocaleString()}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={70}
                        step={5}
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(Number(e.target.value))}
                        className="w-full accent-emerald-600"
                      />
                    </div>
                  )}

                  {rewardType === 'freebie' && (
                    <div>
                      <label className="text-[10.5px] font-mono font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        Free Complementary Add-on (e.g. Free Scalp Wash)
                      </label>
                      <input
                        type="text"
                        value={freebieItem}
                        onChange={(e) => setFreebieItem(e.target.value)}
                        placeholder="e.g. Free Hair Wash &amp; Scalp Massage"
                        className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded px-2.5 py-1.5 text-xs font-medium focus:outline-none"
                      />
                    </div>
                  )}

                  {rewardType === 'bogo' && (
                    <div>
                      <label className="text-[10.5px] font-mono font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        BOGO Offer Specification
                      </label>
                      <input
                        type="text"
                        value={bogoQuantity}
                        onChange={(e) => setBogoQuantity(e.target.value)}
                        placeholder="e.g. Buy 1 Enriched Family Loaf, Get 1 Free"
                        className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded px-2.5 py-1.5 text-xs font-medium focus:outline-none"
                      />
                    </div>
                  )}

                  {rewardType === 'gift' && (
                    <div>
                      <label className="text-[10.5px] font-mono font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        Free Gift / Prize Given with Product
                      </label>
                      <input
                        type="text"
                        value={giftItem}
                        onChange={(e) => setGiftItem(e.target.value)}
                        placeholder="e.g. Free Spark Plug &amp; Chain Lube, or Free Cotton Socks"
                        className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded px-2.5 py-1.5 text-xs font-medium focus:outline-none"
                      />
                    </div>
                  )}

                  {rewardType === 'cashback' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 block mb-0.5">Spend Amount ({currency})</label>
                        <input
                          type="number"
                          value={cashbackSpend}
                          onChange={(e) => setCashbackSpend(Number(e.target.value) || 0)}
                          className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded px-2.5 py-1 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 block mb-0.5">Cashback Voucher Next Time</label>
                        <input
                          type="number"
                          value={cashbackReturn}
                          onChange={(e) => setCashbackReturn(Number(e.target.value) || 0)}
                          className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded px-2.5 py-1 text-xs font-mono"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[10.5px] font-mono font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Terms / Redemption Note
                    </label>
                    <textarea
                      rows={2}
                      value={rewardDescription}
                      onChange={(e) => setRewardDescription(e.target.value)}
                      placeholder="Redeemable on presentation of QR code at till..."
                      className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg p-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Voucher Card Preview & 2% Economics */}
            <div className="lg:col-span-5 space-y-4">
              {/* Voucher Preview Card */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border-2 border-emerald-500/40 shadow-xs space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
                  <span className="text-[10.5px] font-mono uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Sparkles size={13} />
                    <span>Live Voucher Card Preview</span>
                  </span>
                  <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                    {rewardType.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Store size={12} />
                    <span>{merchantName}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {generatedHeadline}
                  </h4>
                  <div className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <MapPin size={11} />
                    <span>{parish} · {district}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Voucher Face Value:</span>
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      {currency} {calculatedVoucherCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-2">
                    {rewardDescription}
                  </div>
                </div>

                {/* Simulated Barcode & QR Code Section */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#090b10] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded p-1 flex items-center justify-center">
                      <QrCode size={36} />
                    </div>
                    <div className="space-y-0.5 text-[9.5px] font-mono">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        CIVIC-VCH-{merchantName.slice(0, 4).toUpperCase()}
                      </div>
                      <div className="text-slate-500">USSD: *303*CODE#</div>
                      <div className="text-emerald-600 font-semibold">Ready for Mobile Scan</div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-[9px] text-slate-400 space-y-1">
                    <div className="tracking-widest">||| | || |||| |</div>
                    <div>890124458921</div>
                  </div>
                </div>

                {/* Economic Transparency: 2% Cap Breakdown */}
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-200">
                    <span className="flex items-center gap-1">
                      <Coins size={12} />
                      <span>Financial Split (2% Capped Fee)</span>
                    </span>
                    <span className="text-[10px]">Vault Settlement</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-[10.5px]">
                    <span>CivicDuty Platform Fee ({economics.commissionPctDisplay}):</span>
                    <span className="font-bold text-amber-700 dark:text-amber-300">
                      {currency} {economics.commissionAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-900 dark:text-white font-bold text-xs pt-1 border-t border-amber-500/20">
                    <span>Merchant Payout in Escrow ({economics.merchantPayoutPctDisplay}):</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {currency} {economics.merchantPayoutAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-[9.5px] text-slate-500 leading-snug pt-0.5">
                    * Escrow Guarantee: Merchant payout is safely held in escrow and released the instant the customer visits the shop and presents their QR/code.
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Publish Voucher to Vault Marketplace</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* SUB-TAB 2: POINT-OF-SALE (POS) SCANNER & PAYOUT RELEASE */}
      {studioSubTab === 'pos_scanner' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 space-y-4 p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
            <div className="border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ScanLine size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>Point-of-Sale (POS) Voucher Scanner &amp; Payout Release</span>
              </h4>
              <p className="text-[11px] font-mono text-slate-500">
                Customer presents SMS, printed placard, or QR code. Validate here to mark used and trigger instant 98% escrow payout to your Mobile Money/Bank.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10.5px] font-mono font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Enter Voucher Code, QR Payload, or Barcode
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={scannerCodeInput}
                    onChange={(e) => setScannerCodeInput(e.target.value)}
                    placeholder="e.g. SHOP-1000KSH-... or CIVIC-VCH-..."
                    className="flex-1 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleLookupAndRedeem}
                    disabled={isVerifyingPos}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isVerifyingPos ? 'Checking...' : 'Validate & Release'}
                  </button>
                </div>
              </div>

              {/* Quick Test Seed Fillers */}
              <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
                <span className="text-[10px] font-mono text-slate-500 block uppercase">
                  Quick Sandbox Testing Vouchers in Escrow:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentVouchers.slice(0, 4).map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setScannerCodeInput(v.voucherCode)}
                      className="px-2 py-1 rounded bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-emerald-500/10 border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      {v.voucherCode} ({v.currency} {v.faceValue.toLocaleString()})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* POS Settlement Receipt */}
          <div className="md:col-span-6 space-y-4">
            {posReceipt ? (
              <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border-2 border-emerald-500 space-y-3 animate-fade-in shadow-xs">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white uppercase font-mono">
                      Voucher Validated &amp; 98% Payout Released!
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold">
                    PAID TO SHOP
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Voucher Code</span>
                    <strong className="text-slate-900 dark:text-white">{posReceipt.voucherCode}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Customer Name</span>
                    <strong className="text-slate-900 dark:text-white">{posReceipt.customerName}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block text-[10px]">Product / Service Redeemed</span>
                    <span className="text-slate-800 dark:text-slate-200">{posReceipt.itemTitle}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Face Value Settled</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {posReceipt.currency} {posReceipt.faceValue.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">2% Platform Fee</span>
                    <span className="text-amber-600">
                      {posReceipt.currency} {posReceipt.commissionFee.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200">
                    <span>98% Payout Released to Merchant:</span>
                    <span className="text-sm">
                      {posReceipt.currency} {posReceipt.payoutAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Settlement Reference: <strong className="text-slate-700 dark:text-slate-300">{posReceipt.payoutRef}</strong>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Settlement Method: Instant Mobile Money Direct Credit
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPosReceipt(null);
                    setScannerCodeInput('');
                  }}
                  className="w-full py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#e3e6ea] dark:hover:bg-[#262b36] text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold transition-colors cursor-pointer"
                >
                  Scan Next Voucher
                </button>
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-center text-xs text-slate-500 font-mono space-y-2">
                <QrCode size={40} className="mx-auto text-slate-400" />
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  Ready for Point-of-Sale Redemption
                </div>
                <p className="max-w-xs mx-auto text-[11px]">
                  When a winning customer walks into your shop and shows their voucher code or QR pass, enter it on the left to confirm validity and release your 98% funds from escrow.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ACTIVE PRODUCTS CATALOG */}
      {studioSubTab === 'catalog' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Active Service Provider Products &amp; Loyalty Vouchers ({filteredCatalog.length})
            </span>
            <span className="text-[10.5px] font-mono text-emerald-600">
              Filtered for {selectedCountry} ({currency})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCatalog.map((prod) => (
              <div
                key={prod.id}
                className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col justify-between gap-3 text-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      {prod.rewardType.toUpperCase()}
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {prod.currency} {prod.voucherCost.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono text-slate-500">{prod.merchantName}</div>
                    <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{prod.rewardHeadline}</div>
                  </div>

                  <p className="text-[10.5px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-snug">
                    {prod.rewardDescription}
                  </p>

                  <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 pt-1">
                    <MapPin size={11} className="text-emerald-600 shrink-0" />
                    <span className="truncate">{prod.parish} · {prod.district}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>2% Fee: {prod.currency} {prod.commissionAmount}</span>
                    <span className="text-emerald-600 font-bold">98% Payout: {prod.currency} {prod.merchantPayoutAmount.toLocaleString()}</span>
                  </div>

                  {onSelectForVaultDeposit && (
                    <button
                      type="button"
                      onClick={() => onSelectForVaultDeposit(prod)}
                      className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Coins size={12} />
                      <span>Select to Deposit Into Vault</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
