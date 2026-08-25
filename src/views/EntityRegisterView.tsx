import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode } from '../types';
import { COUNTRIES, TERRITORY } from '../data/countries';
import { primaryNodes, primaryTier, primaryUnit, tiersFor, GOV_CODES } from '../data/tiers';
import { copyToClipboard } from '../utils/helpers';
import { ChevronLeft, Search, Check, Copy, CreditCard, Smartphone, Building2, ShieldCheck, ArrowRight, Zap, CheckCircle2, Printer, Download, FileText } from 'lucide-react';
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
      sub: `1 ${primary} desk`,
      note: 'Unlimited desks. Official registration required.',
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
  const [kind, setKind] = useState<'utility' | 'consumer'>('utility');
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

  const priceVal = intervalUsd(Math.max(covered, 1), kind, interval, country);

  const handleStartSubmit = () => {
    if (!name.trim()) {
      toast('Please enter your organisation name', 'amber');
      return;
    }
    if (priceVal === 0) {
      // Free registration directly
      completeRegistration('FREE-PROMO');
    } else {
      // Direct to payment screen
      setStep('payment');
    }
  };

  const completeRegistration = (paymentRef: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const activeName = name.trim() || 'SolarGrid Water & Power Ltd';
      const activeReg = reg.trim() || 'REG-2026-9088';
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
      });

      (window as any)._lastEntityResult = {
        name: activeName,
        code: result.code,
        covered: activeCovered,
        kind,
        interval,
        invoiceNo: result.invoiceNo || `INV-2026-${country}-${Math.floor(1000 + Math.random() * 9000)}`,
        price: priceVal,
        country,
        paymentRef,
        paymentMethod: payMethod,
      };

      setIsProcessing(false);
      toast('Subscription payment confirmed & desk mounted!', 'emerald');
      go('entity_done');
    }, 1200);
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
          <ChevronLeft size={14} /> {step === 'payment' ? 'Back to Details' : 'Back'}
        </button>
        <div className="tagline mb-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
          {step === 'payment' ? 'Checkout Gateway' : 'Organisation Onboarding'}
        </div>
        <h2 className="text-[26px] font-black text-slate-900 dark:text-emerald-400 tracking-tight leading-tight">
          {step === 'payment' ? 'Complete Subscription Payment' : 'Add your organisation'}
        </h2>
        <p className="text-[13px] text-slate-600 dark:text-zinc-400 mt-1.5 leading-relaxed font-medium">
          {step === 'payment'
            ? `Secure checkout powered by Flutterwave & Paystack gateway for ${countryName}.`
            : `Price follows the ${countryName} geography you serve. One ${primaryUnitName} is free, permanently.`}
        </p>
      </div>

      {step === 'details' && (
        <>
          {/* Country Selection */}
          <div className="card p-4 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest block font-bold">
                Country Role Tree
              </label>
              <span className="text-[8.5px] mono text-emerald-700 dark:text-emerald-400 font-bold">
                {COUNTRIES[country]?.flag} {countryName}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {(Object.entries(COUNTRIES) as [CountryCode, any][]).map(([c, d]) => (
                <button
                  key={c}
                  onClick={() => {
                    setCountry(c);
                    setDistrict('');
                    setSubcounty('');
                    setParish('');
                  }}
                  className={`py-2 rounded-lg text-[9.5px] mono font-bold border transition-all ${
                    country === c
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 shadow-sm'
                      : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-zinc-900/80 border border-amber-200 dark:border-zinc-800/80 space-y-1 mt-1">
              <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-amber-900 dark:text-amber-300 mono">
                <span>{COUNTRIES[country]?.flag}</span>
                <span>{countryName} Governance Tree:</span>
              </div>
              <p className="text-[9.5px] mono text-slate-700 dark:text-zinc-400 leading-relaxed font-medium">
                {cTiers.filter((t) => t.depth > 0).map((t) => t.unit).join(' › ')}. Tickets land directly with the {primaryUnitName} desk — {primaryTier(country, district || undefined)?.title}.
              </p>
            </div>
          </div>

          {/* Organisation Info */}
          <div className="card p-4 space-y-3">
            <label className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest block font-bold">Organisation Information</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. SolarGrid Water & Energy Ltd"
              className="text-sm"
            />
            <input
              type="text"
              value={reg}
              onChange={(e) => setReg(e.target.value)}
              placeholder="Company registration number (e.g. URSB / URA 8002910)"
              className="mono text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              {[
                ['utility', 'Utility or Essential Service'],
                ['consumer', 'Private Consumer Enterprise'],
              ].map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setKind(k as any)}
                  className={`py-2.5 px-2 rounded-xl text-[9.5px] mono font-bold border transition-all ${
                    kind === k
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 shadow-sm'
                      : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Coverage Picker */}
          <div className="card p-4 space-y-2">
            <label className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest block font-bold">
              Where do you operate in {countryName}?
            </label>

            <div className="sw">
              <Search size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search for your local ${primaryUnitName}…`}
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
                          : 'bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className="text-[12px] font-bold text-slate-900 dark:text-zinc-200">{n.name}</div>
                      <div className="path-crumb text-slate-500 dark:text-zinc-400">{n.path}</div>
                    </button>
                  ))
                )}
              </div>
            )}

            <select
              className="mono text-sm"
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setSubcounty('');
                setParish('');
                setSearchQuery('');
              }}
            >
              <option value="">Select {l1Name} ({countryName})…</option>
              {dists.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>

            <select
              className="mono text-sm"
              disabled={!district}
              value={subcounty}
              style={{ opacity: district ? 1 : 0.4 }}
              onChange={(e) => {
                setSubcounty(e.target.value);
                setParish('');
              }}
            >
              <option value="">Select {l2Name}… (leave blank for all in {l1Name})</option>
              {subs.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>

            <select
              className="mono text-sm"
              disabled={!subcounty}
              value={parish}
              style={{ opacity: subcounty ? 1 : 0.4 }}
              onChange={(e) => setParish(e.target.value)}
            >
              <option value="">Select {primaryUnitName}… (leave blank for all in {l2Name})</option>
              {parishes.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>

            <p className="text-[9.5px] mono text-slate-500 dark:text-zinc-400 pt-1 font-bold">
              {covered > 0 ? `${covered} ${primaryUnitName}${covered > 1 ? 's' : ''} covered` : 'Nothing selected yet'}
            </p>
          </div>

          {/* Plan Price Summary */}
          {covered > 0 && (
            <div className="card-civic p-4 space-y-2 a-fade bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-bold">Matched Plan ({countryName})</p>
                  <p className="text-[16px] font-black text-slate-900 dark:text-zinc-100 mt-1">{tier.name}{covered <= 1 ? ' · free' : ''}</p>
                  <p className="text-[10px] mono text-slate-600 dark:text-zinc-400 mt-0.5 font-medium">
                    {covered} {primaryUnitName}{covered > 1 ? 's' : ''} · unlimited desks
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black mono ${covered <= 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-zinc-100'}`}>
                    {entityPrice(covered, kind, interval, country)}
                  </p>
                </div>
              </div>

              {covered > 1 ? (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {(['annual', 'monthly'] as const).map((iv) => (
                    <button
                      key={iv}
                      onClick={() => setInterval(iv)}
                      className={`py-2 rounded-xl text-[9.5px] mono font-bold border transition-all ${
                        interval === iv
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 shadow-sm'
                          : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      {iv === 'annual'
                        ? 'Annual — ' + fmtUsd(annualUsd(covered, kind, country))
                        : 'Monthly — ' + fmtUsd(intervalUsd(covered, kind, 'monthly', country))}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[9.5px] mono text-slate-600 dark:text-zinc-400 font-medium">
                  Free, permanently. Official registration number verification is required.
                </p>
              )}
            </div>
          )}

          {/* Tiers Grid mapped to Country Role Tree */}
          <div className="space-y-1.5">
            <p className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest block font-bold">
              {countryName} Subscription Tiers
            </p>
            <div className="grid grid-cols-2 gap-2">
              {currentTiers.slice(1, 5).map((t) => (
                <div key={t.id} className="card p-3 flex flex-col justify-between border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-sm rounded-xl">
                  <div>
                    <p className="text-[11px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">{t.name}</p>
                    <p className="text-[16px] font-black mono text-slate-900 dark:text-zinc-100 mt-1">{t.price}</p>
                    <p className="text-[8.5px] mono text-slate-600 dark:text-zinc-400 mt-0.5 font-bold">{t.sub}</p>
                  </div>
                  <p className="text-[8px] text-slate-500 dark:text-zinc-400 mt-2 leading-tight font-medium">{t.note}</p>
                </div>
              ))}
            </div>
          </div>

          <NoteBox
            tone="amber"
            title="Registered vs Verified Badge"
            text="Free and community plans require a registration number and display as 'Registered local entity'. The 'Verified' badge is issued upon verification with regulator database."
          />

          <button
            onClick={handleStartSubmit}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl py-4 text-sm uppercase tracking-widest mono transition-all active:scale-[.98] flex items-center justify-center gap-2 shadow-sm"
          >
            {priceVal === 0 ? (
              'Register — Free'
            ) : (
              <>
                <span>Proceed to Payment ({entityPrice(covered, kind, interval, country)})</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className="text-center text-[8.5px] mono text-slate-500 dark:text-zinc-500 leading-relaxed pb-6">
            Citizens can already submit reports regarding your organisation. Registering activates your official desk to publish replies.
          </p>
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
                  {tier.name} · {covered} {primaryUnitName}s covered ({countryName})
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
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700'
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
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700'
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
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                <Building2 size={16} />
                <span>Bank / Invoice</span>
              </button>
            </div>

            {/* Mobile Money Details */}
            {payMethod === 'momo' && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-3 animate-fade-in shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold text-amber-900 dark:text-amber-300 mono">MTN MoMo & Airtel Money Gateway</span>
                  <span className="chip text-[8px] bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30 font-bold">
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

                <div className="p-2.5 bg-white dark:bg-zinc-950/60 rounded-lg border border-slate-200 dark:border-zinc-800/80 text-[8.5px] mono text-slate-600 dark:text-zinc-400 space-y-1">
                  <p className="text-slate-900 dark:text-zinc-300 font-bold">Or pay directly via USSD / Paybill Merchant Code:</p>
                  <p>• MTN MoMo Merchant Code: <span className="text-amber-700 dark:text-amber-300 font-bold">612904</span> (CivicDuty Tech Ltd)</p>
                  <p>• Airtel Money Paybill ID: <span className="text-rose-700 dark:text-red-300 font-bold">CIVICDUTY</span></p>
                </div>
              </div>
            )}

            {/* Gateway Card Details */}
            {payMethod === 'gateway' && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-3 animate-fade-in shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold text-emerald-800 dark:text-emerald-300 mono">Flutterwave / Paystack Integrated Gateway</span>
                  <div className="flex gap-1">
                    <span className="text-[8px] mono bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/30 font-bold">Flutterwave</span>
                    <span className="text-[8px] mono bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400 px-1.5 py-0.5 rounded border border-blue-300 dark:border-blue-500/30 font-bold">Paystack</span>
                  </div>
                </div>

                <div>
                  <label className="text-[8.5px] mono text-slate-500 dark:text-zinc-400 block mb-1 font-bold">Card Number (Visa / Mastercard)</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 •••• •••• 4242"
                    className="mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[8.5px] mono text-slate-500 dark:text-zinc-400 block mb-1 font-bold">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[8.5px] mono text-slate-500 dark:text-zinc-400 block mb-1 font-bold">CVV / CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      className="mono text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bank Wire Details */}
            {payMethod === 'bank' && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-3 animate-fade-in shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold text-amber-900 dark:text-amber-300 mono">Direct Corporate Bank Transfer (EFT / RTGS)</span>
                  <span className="chip text-[8px] bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30 font-bold">
                    Proforma Tax Invoice
                  </span>
                </div>

                <div className="p-2.5 bg-white dark:bg-zinc-950/80 rounded-lg border border-slate-200 dark:border-zinc-800 text-[8.5px] mono text-slate-700 dark:text-zinc-300 space-y-1">
                  <p className="text-amber-800 dark:text-amber-300 font-bold">Bank Deposit Account Details:</p>
                  <p>Bank: <strong className="text-slate-900 dark:text-zinc-100">Stanbic Bank Uganda Ltd (Main Branch, Kampala)</strong></p>
                  <p>Account Name: <strong className="text-slate-900 dark:text-zinc-100">CivicDuty Technologies Uganda Ltd</strong></p>
                  <p>Account Number: <strong className="text-amber-800 dark:text-amber-300 font-bold">9030018492011</strong></p>
                  <p>SWIFT Code: <strong className="text-slate-900 dark:text-zinc-100">SBICUGKX</strong></p>
                </div>

                <div>
                  <label className="text-[8.5px] mono text-slate-500 dark:text-zinc-400 block mb-1 font-bold">Bank Reference / Deposit Voucher Number</label>
                  <input
                    type="text"
                    value={bankRef}
                    onChange={(e) => setBankRef(e.target.value)}
                    placeholder="e.g. STANBIC-EFT-9910"
                    className="mono text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => completeRegistration(payMethod === 'momo' ? `MOMO-${momoPhone}` : payMethod === 'gateway' ? 'CARD-FLUTTERWAVE' : bankRef)}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black rounded-2xl py-4 text-sm uppercase tracking-widest mono transition-all active:scale-[.98] flex items-center justify-center gap-2 shadow-sm"
          >
            {isProcessing ? (
              <span>Connecting Gateway…</span>
            ) : (
              <>
                <Zap size={16} />
                <span>
                  Confirm & Pay {entityPrice(covered, kind, interval, country)}
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export const EntityDoneView: React.FC = () => {
  const { go, execGovLoginByData, toast } = useApp();
  const res = (window as any)._lastEntityResult || {
    name: 'Organisation',
    code: 'ENT-UG-9912',
    covered: 1,
    kind: 'utility',
    interval: 'annual',
    price: 0,
    invoiceNo: 'INV-2026-UG-9011',
    country: 'UG',
    paymentRef: 'MOMO-CONFIRMED',
    paymentMethod: 'momo',
  };

  const countryName = COUNTRIES[res.country as CountryCode]?.name || res.country;

  const handleOpenDesk = () => {
    const data = GOV_CODES[res.code];
    if (data) {
      execGovLoginByData(data);
    } else {
      toast('Organisation desk activated!', 'emerald');
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
          {entityPrice(res.covered, res.kind, res.interval, res.country as CountryCode)} · {res.covered} unit{res.covered > 1 ? 's' : ''} ({countryName}) · unlimited desks
        </p>
      </div>

      <div className="card-gov p-4 space-y-2 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
        <p className="text-[8.5px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-bold">Your access code — tap to copy</p>
        <button
          onClick={() => copyToClipboard(res.code, 'Access code', (msg) => toast(msg))}
          className="flex items-center justify-between w-full bg-slate-50 dark:bg-zinc-900/80 rounded-lg px-3.5 py-3 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 transition-colors"
        >
          <span className="text-sm mono font-black text-amber-800 dark:text-amber-300 tracking-widest">{res.code}</span>
          <Copy size={14} className="text-slate-500 dark:text-zinc-500" />
        </button>
        <p className="text-[8.5px] mono text-slate-500 dark:text-zinc-400 leading-relaxed">
          Anyone in your organisation can use this code to mount an executive desk. Every desk action is audit-logged.
        </p>
      </div>

      <div className="card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-bold">Subscription & Tax Invoice</p>
          <span className="text-[8.5px] mono text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20 font-bold">
            {res.price === 0 ? 'Active · Free' : 'Paid & Active ✓'}
          </span>
        </div>

        <div className="space-y-1.5 text-[10px] mono border-t border-b border-slate-200 dark:border-zinc-800/80 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-zinc-400">Plan Amount</span>
            <span className="text-slate-900 dark:text-zinc-200 font-bold">{entityPrice(res.covered, res.kind, res.interval, res.country as CountryCode)}</span>
          </div>
          {res.invoiceNo && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-zinc-400">Tax Invoice / Receipt No.</span>
              <span className="text-amber-800 dark:text-amber-300 font-bold">{res.invoiceNo}</span>
            </div>
          )}
          {res.paymentRef && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-zinc-400">Payment Reference</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">{res.paymentRef}</span>
            </div>
          )}
        </div>

        {/* Export & Download Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              const textContent = `
================================================================================
          CIVICDUTY PLATFORM - OFFICIAL TAX INVOICE & PAYMENT RECEIPT
================================================================================
Invoice No:      ${res.invoiceNo || 'INV-2026-9011'}
Date Issued:     ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
Issuer:          CivicDuty Technologies Ltd / Sovereign Infrastructure Services
TIN / Reg No:    1002938192-UG

--------------------------------------------------------------------------------
SUBSCRIBER ENTITY & PLAN SPECIFICATIONS
--------------------------------------------------------------------------------
Organisation:    ${res.name}
Country:         ${countryName} (${res.country})
Scope / Units:   ${res.covered} ${res.covered > 1 ? 'Primary Units' : 'Primary Unit'} Covered
Plan Category:   ${res.kind === 'utility' ? 'Utility & Essential Services Infrastructure' : 'Corporate / Entity Desk'}
Billing Term:    ${res.interval === 'annual' ? 'Annual Full License' : 'Monthly License'}
--------------------------------------------------------------------------------
PAYMENT AUDIT TRAIL
--------------------------------------------------------------------------------
Payment Status:  ${res.price === 0 ? 'ACTIVE (PROMO / DIRECT)' : 'PAID & CONFIRMED'}
Gateway Ref:     ${res.paymentRef || 'MOMO-DIRECT'}
Amount Total:    ${entityPrice(res.covered, res.kind, res.interval, res.country as CountryCode)}

--------------------------------------------------------------------------------
MOUNTED DESK CREDENTIAL VOUCHER
--------------------------------------------------------------------------------
Access Key Code: ${res.code}
Instructions:    Issue this authorization code to your department heads, area engineers,
                 or branch managers to mount executive oversight desks.
================================================================================
      CivicDuty Official Record · Verified Cloud Invoicing System
================================================================================
`;
              const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `CivicDuty_Tax_Invoice_${res.invoiceNo || 'Receipt'}.txt`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              toast('Downloaded Tax Invoice & Receipt Voucher!', 'emerald');
            }}
            className="flex items-center justify-center gap-1.5 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 rounded-xl py-2.5 text-[10px] font-bold mono transition-all active:scale-[.98] shadow-sm"
          >
            <Download size={13} /> Export Invoice (.txt)
          </button>

          <button
            onClick={() => {
              const win = window.open('', '_blank');
              if (win) {
                win.document.write(`
                  <html>
                    <head>
                      <title>CivicDuty Tax Invoice - ${res.invoiceNo || 'Receipt'}</title>
                      <style>
                        body { font-family: monospace; padding: 40px; background: #fff; color: #000; line-height: 1.6; }
                        h1 { font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                        .row { display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px dashed #ccc; padding-bottom: 4px; }
                        .bold { font-weight: bold; }
                        .box { border: 2px solid #000; padding: 16px; margin: 20px 0; background: #f9f9f9; }
                        .code { font-size: 18px; font-weight: bold; letter-spacing: 2px; }
                      </style>
                    </head>
                    <body>
                      <h1>CIVICDUTY PLATFORM · OFFICIAL TAX INVOICE & RECEIPT</h1>
                      <div class="row"><span>Invoice Number:</span><span class="bold">${res.invoiceNo || 'INV-2026-9011'}</span></div>
                      <div class="row"><span>Date:</span><span class="bold">${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                      <div class="row"><span>Organisation Name:</span><span class="bold">${res.name}</span></div>
                      <div class="row"><span>Country Jurisdiction:</span><span class="bold">${countryName} (${res.country})</span></div>
                      <div class="row"><span>Coverage Scope:</span><span class="bold">${res.covered} Unit(s) Covered</span></div>
                      <div class="row"><span>Payment Status:</span><span class="bold">${res.price === 0 ? 'FREE / PROMO' : 'PAID & ACTIVE'}</span></div>
                      <div class="row"><span>Total Paid:</span><span class="bold">${entityPrice(res.covered, res.kind, res.interval, res.country as CountryCode)}</span></div>
                      <div class="row"><span>Gateway Reference:</span><span class="bold">${res.paymentRef || 'CONFIRMED'}</span></div>

                      <div class="box">
                        <div style="font-size: 11px; text-transform: uppercase;">Executive Access Credential Code:</div>
                        <div class="code">${res.code}</div>
                        <p style="font-size: 10px; margin-top: 8px;">Use this single code to mount officer and engineer desks across all covered units.</p>
                      </div>

                      <p style="font-size: 11px; color: #555;">CivicDuty Technologies Ltd · Autonomous Governance Systems · Stamp Verified</p>
                      <script>window.onload = function() { window.print(); }</script>
                    </body>
                  </html>
                `);
                win.document.close();
              }
            }}
            className="flex items-center justify-center gap-1.5 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 rounded-xl py-2.5 text-[10px] font-bold mono transition-all active:scale-[.98] shadow-sm"
          >
            <Printer size={13} /> Print Invoice (PDF)
          </button>
        </div>
      </div>

      <div className="card p-3.5 flex items-center gap-2.5">
        <span className="chip ch-ro">Registered Entity</span>
        <p className="text-[9px] mono text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
          Your company registration was verified. The <span className="text-emerald-700 dark:text-emerald-300 font-bold">verified</span> badge is issued upon regulator database synchronization.
        </p>
      </div>

      <button
        onClick={handleOpenDesk}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl py-4 text-sm uppercase tracking-widest mono transition-all active:scale-[.98] shadow-sm"
      >
        Open my desk →
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

