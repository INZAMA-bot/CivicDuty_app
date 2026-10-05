import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getDept } from '../utils/helpers';
import { NoteBox } from '../components/NoteBox';
import {
  CreditCard,
  CheckCircle,
  Smartphone,
  Globe,
  DollarSign,
  FileText,
  ShieldCheck,
  Terminal,
  ExternalLink,
  Zap,
  ArrowRight,
  Code,
  Download,
  Copy,
  Check,
  Building2,
  RefreshCw,
  Award,
  Target,
  TrendingUp,
  Sparkles,
  Briefcase,
  Landmark,
  Lightbulb,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react';
import { saveGatewayTransactionToCloud } from '../services/firestoreSync';

export const GovBillingView: React.FC = () => {
  const { user, invoices, recordInvoicePayment, go, toast } = useApp();

  const [activeTab, setActiveTab] = useState<'status' | 'invoices' | 'pay' | 'integrations' | 'uganda_wealth'>('status');
  const [payMethod, setPayMethod] = useState<'momo' | 'airtel' | 'flutterwave' | 'stripe'>('momo');
  const [currency, setCurrency] = useState<'USD' | 'UGX' | 'KES' | 'NGN' | 'GHS' | 'RWF' | 'ZAR'>('UGX');
  const [customAmount, setCustomAmount] = useState<string>('1500000');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [momoPhone, setMomoPhone] = useState('+256778277900');
  const [payerEmail, setPayerEmail] = useState('treasury@gov.ug');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('890');
  const [txRef, setTxRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifiedTx, setVerifiedTx] = useState<any | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !['node_admin', 'platform_admin'].includes(user.role)) {
      go('gov_inbox');
    }
  }, [user, go]);

  if (!user || !['node_admin', 'platform_admin'].includes(user.role)) {
    return null;
  }

  const d = getDept(user.country, user.dept || 'kcca');
  const myInvoices = invoices.filter(
    (inv) =>
      (!inv.country || inv.country === user.country) &&
      (!user.dept || inv.dept === user.dept || user.role === 'platform_admin')
  );

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(label);
    toast(`Copied ${label} to clipboard`, 'emerald');
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  const handleInitiateAndVerifyPayment = async (invId?: string) => {
    const inv = myInvoices.find((i) => i.id === invId) || myInvoices[0];
    const amountVal = inv ? inv.amount : Number(customAmount) || 1500000;
    setIsProcessing(true);
    setVerifiedTx(null);

    try {
      // Step 1: Initialize Payment with Gateway API
      const initRes = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId: user.dept || 'kcca',
          entityName: d.name,
          invoiceId: inv ? inv.id : 'INV-ADHOC-' + Math.floor(1000 + Math.random() * 9000),
          amount: amountVal,
          currency: currency,
          provider: payMethod,
          paymentMethod: payMethod,
          payerPhoneOrEmail: payMethod.includes('momo') || payMethod.includes('airtel') ? momoPhone : payerEmail,
          payerPhone: momoPhone,
          payerEmail: payerEmail,
          channel: payMethod === 'momo' || payMethod === 'airtel' ? 'mobile_money' : 'card',
        }),
      });

      const initData = await initRes.json();

      if (!initData.success) {
        throw new Error(initData.error || 'Failed to initialize payment gateway');
      }

      toast(`STK Push dispatched via ${payMethod.toUpperCase()}! Verifying authorization...`, 'amber');

      // Step 2: Auto-verify gateway transaction simulation
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionReference: initData.transactionReference }),
      });
      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        if (inv) {
          recordInvoicePayment(inv.id, initData.transactionReference, payMethod as any);
        }
        setVerifiedTx(verifyData.transaction);
        // Persist transaction record to Cloud Firestore
        saveGatewayTransactionToCloud(verifyData.transaction).catch(() => {});
        toast(
          `Payment of ${currency} ${amountVal.toLocaleString()} settled successfully via ${payMethod.toUpperCase()}!`,
          'emerald'
        );
      }
    } catch (err: any) {
      toast(err.message || 'Payment gateway connection error', 'amber');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 space-y-5 animate-fade-in pb-20 text-slate-800 dark:text-slate-100 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-black uppercase tracking-wider mb-2">
          <DollarSign size={13} />
          Sovereign Billing &amp; Payment Rails Gateway
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {d.name} · Treasury Billing &amp; Production Integrations
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Real-time mobile money settlement (MTN MoMo, Airtel Money), Pan-African cards (Flutterwave), Stripe wires, and developer integration specs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {[
          ['status', 'Subscription'],
          ['invoices', `Invoices (${myInvoices.length})`],
          ['pay', 'Payment Rails & Terminal'],
          ['integrations', '🔌 GitHub & API Guide'],
          ['uganda_wealth', '🇺🇬 Uganda Registration & Wealth Engine'],
        ].map(([t, l]) => (
          <button
            key={t}
            onClick={() => setActiveTab(t as any)}
            className={`py-3 px-3 sm:px-4 text-xs font-black uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              activeTab === t
                ? 'text-amber-500 border-amber-500'
                : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* TAB 1: SUBSCRIPTION STATUS */}
      {activeTab === 'status' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Plan Status</p>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                  Government Sovereign Regional Authority Tier
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Assigned Mandate: {d.name}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                Active Tier ✓
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Annual License</span>
                <span className="text-slate-900 dark:text-white font-black">$18,000 / year</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Renewal Date</span>
                <span className="text-slate-900 dark:text-white font-black">15 Dec 2026</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Active Desks</span>
                <span className="text-emerald-600 font-black">135+ Supervised Desks</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Settlement Channel</span>
                <span className="text-amber-600 font-black">Treasury MoMo / Card</span>
              </div>
            </div>
          </div>

          <NoteBox
            tone="emerald"
            title="Public Service Delivery Guarantee"
            text="Citizen reporting, disciplinary dockets, and supervisory telemetry are never throttled during reconciliation cycles under national Public Finance Management regulations."
          />
        </div>
      )}

      {/* TAB 2: INVOICES */}
      {activeTab === 'invoices' && (
        <div className="space-y-3">
          {myInvoices.length === 0 ? (
            <div className="p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-xs text-slate-500">
              No pending invoices generated for this jurisdiction.
            </div>
          ) : (
            myInvoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-2xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono font-black text-amber-500">{inv.id}</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{inv.period}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      inv.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {inv.status === 'paid' ? 'Paid & Settled ✓' : 'Unpaid · Due in 30d'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500">Issued Date: {inv.date}</span>
                  <span className="text-slate-900 dark:text-white font-black text-base">
                    ${inv.amount.toLocaleString()}
                  </span>
                </div>

                {inv.status !== 'paid' && (
                  <button
                    onClick={() => {
                      setSelectedInvoiceId(inv.id);
                      setActiveTab('pay');
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <DollarSign size={14} />
                    <span>Pay Invoice Now via Mobile Money or Card →</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: PAYMENT RAILS & TERMINAL */}
      {activeTab === 'pay' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Live Sovereign Checkout &amp; Mobile Money Terminal
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Execute live or sandbox payments across Pan-African mobile money and international cards.
              </p>
            </div>

            {/* Provider Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPayMethod('momo')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  payMethod === 'momo'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <Smartphone size={18} className="mb-1 text-amber-500" />
                <div className="text-xs font-black">MTN MoMo</div>
                <div className="text-[10px] text-slate-400">UG, RW, GH, NG</div>
              </button>

              <button
                type="button"
                onClick={() => setPayMethod('airtel')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  payMethod === 'airtel'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-2 ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <Smartphone size={18} className="mb-1 text-rose-500" />
                <div className="text-xs font-black">Airtel Money</div>
                <div className="text-[10px] text-slate-400">Pan-Africa USSD</div>
              </button>

              <button
                type="button"
                onClick={() => setPayMethod('flutterwave')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  payMethod === 'flutterwave'
                    ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <Globe size={18} className="mb-1 text-orange-500" />
                <div className="text-xs font-black">Flutterwave v3</div>
                <div className="text-[10px] text-slate-400">Cards &amp; Bank Wire</div>
              </button>

              <button
                type="button"
                onClick={() => setPayMethod('stripe')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  payMethod === 'stripe'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <CreditCard size={18} className="mb-1 text-indigo-500" />
                <div className="text-xs font-black">Stripe Checkout</div>
                <div className="text-[10px] text-slate-400">Global USD / EUR</div>
              </button>
            </div>

            {/* Currency & Amount Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Settlement Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="UGX">UGX — Uganda Shilling</option>
                  <option value="KES">KES — Kenya Shilling</option>
                  <option value="NGN">NGN — Nigeria Naira</option>
                  <option value="GHS">GHS — Ghana Cedi</option>
                  <option value="RWF">RWF — Rwanda Franc</option>
                  <option value="ZAR">ZAR — South Africa Rand</option>
                  <option value="USD">USD — US Dollar</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Amount ({currency})
                </label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            {/* Payer Details */}
            {(payMethod === 'momo' || payMethod === 'airtel') ? (
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Authorized Signer Mobile Number (for USSD Prompt)
                </label>
                <input
                  type="text"
                  value={momoPhone}
                  onChange={(e) => setMomoPhone(e.target.value)}
                  placeholder="+256778277900"
                  className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Treasury Billing Email
                  </label>
                  <input
                    type="email"
                    value={payerEmail}
                    onChange={(e) => setPayerEmail(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Card Number (Simulation)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Submit Action */}
            <button
              onClick={() => handleInitiateAndVerifyPayment(selectedInvoiceId)}
              disabled={isProcessing}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Processing Gateway Handshake &amp; Authorization...</span>
                </>
              ) : (
                <>
                  <Zap size={15} />
                  <span>
                    Authorize &amp; Settle {currency} {Number(customAmount || 0).toLocaleString()} via {payMethod.toUpperCase()}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Verified Transaction Card */}
          {verifiedTx && (
            <div className="bg-emerald-950/40 border-2 border-emerald-500/50 rounded-3xl p-5 space-y-3 animate-fade-in text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-emerald-400" />
                  <span className="font-black text-sm uppercase tracking-wider text-emerald-300">
                    Payment Settled &amp; Cryptographically Sealed
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md">
                  {verifiedTx.status?.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-2 border-t border-emerald-500/30">
                <div>
                  <span className="text-slate-400 block text-[10px]">Reference</span>
                  <span className="font-bold text-white">{verifiedTx.reference}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Settled Amount</span>
                  <span className="font-bold text-white">
                    {verifiedTx.currency} {verifiedTx.amount?.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Provider</span>
                  <span className="font-bold text-white">{verifiedTx.provider?.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Channel</span>
                  <span className="font-bold text-white">{verifiedTx.channel}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <a
                  href={`/api/payments/receipt/${verifiedTx.reference}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs inline-flex items-center gap-1.5 transition-all"
                >
                  <Download size={14} />
                  <span>View &amp; Print Official Sovereign Receipt</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: GITHUB & INTEGRATION BLUEPRINT GUIDE */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          {/* Section 1: GitHub Repository & CI/CD */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm uppercase tracking-wider">
              <Terminal size={18} className="text-amber-500" />
              <span>1. GitHub Repository &amp; Google Cloud Run CI/CD Pipeline</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We have generated the complete production <code>.github/workflows/ci-cd.yml</code> and multi-stage <code>Dockerfile</code>. Every commit pushed to <code>main</code> runs type checking, compiles the client/server bundle, and deploys zero-downtime containers to Google Cloud Run.
            </p>

            <div className="bg-slate-950 text-slate-200 rounded-2xl p-4 font-mono text-xs space-y-2 relative">
              <button
                onClick={() =>
                  handleCopy(
                    `git init\ngit add .\ngit commit -m "feat: civicduty production release"\ngit remote add origin https://github.com/YOUR_ORG/civicduty.git\ngit push -u origin main`,
                    'Git Commands'
                  )
                }
                className="absolute right-3 top-3 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                {copiedSnippet === 'Git Commands' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>Copy</span>
              </button>
              <div className="text-slate-500"># Push code to your new GitHub repository:</div>
              <div>git init</div>
              <div>git add .</div>
              <div>git commit -m &quot;feat: civicduty sovereign release&quot;</div>
              <div>git remote add origin https://github.com/YOUR_ORG/civicduty.git</div>
              <div>git push -u origin main</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white">Required GitHub Repository Secrets:</div>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 font-mono text-[11px]">
                <li><code>GCP_PROJECT_ID</code> — Your Google Cloud Project ID (e.g. <code>tokyo-scene-67c1c</code>)</li>
                <li><code>GCP_SA_KEY</code> — Service Account JSON key with Cloud Run Admin &amp; Artifact Registry permissions</li>
              </ul>
            </div>
          </div>

          {/* Section 2: Payment Rails (MoMo, Flutterwave, Stripe) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm uppercase tracking-wider">
              <DollarSign size={18} className="text-amber-500" />
              <span>2. Production Payment Gateways Configuration</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              CivicDuty uses a unified server-side proxy route <code>/api/payments/initialize</code> and <code>/api/payments/verify</code>. Sensitive API secrets never touch the frontend browser:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="font-black text-amber-500 mb-1">MTN MoMo API (OpenAPI)</div>
                <div className="text-[11px] text-slate-500">
                  Direct C2B Request-To-Pay STK pushes. Requires <code>MOMO_SUBSCRIPTION_KEY</code> and <code>MOMO_API_USER</code>.
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="font-black text-orange-500 mb-1">Flutterwave v3 API</div>
                <div className="text-[11px] text-slate-500">
                  Aggregates M-Pesa, Airtel, MTN, and card payments across 34 countries. Requires <code>FLW_SECRET_KEY</code>.
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Africa's Talking Telecom (USSD & SMS) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm uppercase tracking-wider">
              <Smartphone size={18} className="text-teal-500" />
              <span>3. Africa&apos;s Talking Telecom USSD &amp; 2-Way SMS</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Feature phones access CivicDuty through USSD shortcode <code>*3030#</code>. The endpoint <code>/api/ussd/session</code> returns standard GSM <code>CON</code> and <code>END</code> response strings:
            </p>

            <div className="bg-slate-950 text-slate-200 rounded-2xl p-4 font-mono text-xs space-y-1">
              <div className="text-slate-500">// Africa&apos;s Talking USSD Callback URL:</div>
              <div className="text-teal-400">https://your-domain.run.app/api/ussd/session</div>
              <div className="text-slate-500 pt-2">// Africa&apos;s Talking SMS Callback URL:</div>
              <div className="text-teal-400">https://your-domain.run.app/api/sms/incoming</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: UGANDA REGISTRATION, LAUNCH & WEALTH ENGINE */}
      {activeTab === 'uganda_wealth' && (
        <div className="space-y-6">
          {/* Executive Banner */}
          <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-slate-900 border border-amber-500/30 rounded-3xl p-6 relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>Uganda Corporate Registration &amp; Wealth Architecture</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  From Local Startup to Sovereign Tech Monopoly
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  The definitive playbook to incorporate <strong>CivicDuty Technologies Uganda Ltd</strong> at URSB, activate enterprise mobile money rails (MTN MoMo, Airtel, Flutterwave), execute a zero-budget grassroots launch, and construct an enduring multi-million-dollar wealth engine.
                </p>
              </div>
              <div className="hidden sm:flex p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Landmark size={32} />
              </div>
            </div>
          </div>

          {/* 1. URSB Registration Roadmap */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-base uppercase tracking-wider">
              <Building2 size={20} className="text-amber-500" />
              <span>1. URSB &amp; Legal Incorporation Checklist (Kampala, Uganda)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Registering CivicDuty as a <strong>Private Limited Liability Company (Ltd by Shares)</strong> gives you the legal mandate to enter government SaaS contracts, partner with telecom giants, and open corporate merchant lines without any fintech deposit licenses.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider">Step 1: Name Reservation</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">Fee: UGX 25,000</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Visit the <strong>URSB Business Registration System (brs.ursb.go.ug)</strong>. Reserve <code>CivicDuty Technologies Limited</code> or <code>CivicDuty Digital Governance Ltd</code>. Approval takes 2 to 4 hours.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider">Step 2: Articles &amp; Memorandum</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">Standard Model Articles</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Select core business objects: <em>Software publishing, civic data processing, digital governance platforms, IT communications, and software escrow intermediary services</em>. Total registration &amp; stamp duty: approx UGX 260,000.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider">Step 3: URA Corporate TIN</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400">Zero Cost (Instant)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Upon URSB Certificate generation, the company is automatically assigned an enterprise Tax Identification Number (TIN) on <strong>ura.go.ug</strong>. This qualifies you for public procurement bidding (PPDA).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider">Step 4: NDPO Data Protection</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400">NITA-U / NDPO Registered</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Register with the <strong>National Data Protection Office (dataprotection.go.ug)</strong> under the Data Protection &amp; Privacy Act 2019. This gives municipal leaders 100% confidence to store citizen records in CivicDuty.
                </p>
              </div>
            </div>

            {/* Bank and MoMo setup */}
            <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 space-y-3 mt-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-black uppercase tracking-wider text-amber-400">Step 5: Corporate Banking &amp; MoMo Corporate Lines</div>
                <span className="text-[11px] text-slate-400">Stanbic / Centenary / Absa</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Take your URSB Certificate of Incorporation, Memorandum, URA TIN, and National IDs to open a corporate UGX + USD account. With the bank account active, immediately register on <strong>Flutterwave Uganda (flutterwave.com)</strong> and <strong>MTN MoMo Developer Portal (momodeveloper.mtn.com)</strong> for instant C2B mobile money settlement straight to your account.
              </p>
            </div>
          </div>

          {/* 2. Marketing & User Attraction Engine */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-base uppercase tracking-wider">
              <Target size={20} className="text-emerald-500" />
              <span>2. Grassroots Marketing &amp; Viral User Attraction Engine</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              How do we get 100,000+ Ugandan citizens actively using CivicDuty without spending millions on billboards? By hooking into existing everyday frustrations and grassroots networks:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
                <div className="font-black text-xs text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  Campaign 1: The &quot;Fix My Pothole&quot; Viral Challenge
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Launch on Twitter/X, TikTok, and WhatsApp: <em>&quot;Snap the pothole, tag your division mayor, watch the 72-hour SLA clock tick live on CivicDuty.&quot;</em> Citizens love seeing public officials held accountable with real-time countdown clocks.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 space-y-2">
                <div className="font-black text-xs text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  Campaign 2: Morning Radio Talkshow Blitz
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Call into morning talk shows (CBS Kiriza Oba Gana, Capital FM The Capital Gang, KFM D&apos;Mighty Breakfast, Radio Simba). Whenever a citizen laments water shortages or broken streetlights, announce: <em>&quot;Log it on CivicDuty right now; your MP and Town Clerk get notified on their desk in 3 seconds.&quot;</em>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-800/60 space-y-2">
                <div className="font-black text-xs text-teal-800 dark:text-teal-300 uppercase tracking-wider">
                  Campaign 3: The Bodaboda Scout Network
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Partner with Boda stage chairpersons across Kampala, Entebbe, and Jinja. Boda riders traverse every alley daily. Reward verified road hazards with UGX 1,000 airtime vouchers via the CivicDuty <strong>Perk Vault</strong>. You gain the most accurate road condition map in Uganda for pennies.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/60 space-y-2">
                <div className="font-black text-xs text-purple-800 dark:text-purple-300 uppercase tracking-wider">
                  Campaign 4: The Municipal Leaderboard of Fame &amp; Shame
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Publish a monthly <strong>Uganda Municipal Service Delivery Index</strong> in national press (New Vision, Daily Monitor). Rank Kampala Central, Nakawa, Kira, and Makindye on ticket resolution speeds. Mayors and Town Clerks will compete publicly to look competent.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Wealth Creation Blueprint */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-base uppercase tracking-wider">
              <TrendingUp size={20} className="text-amber-500" />
              <span>3. The Wealth Creation Masterclass: Building a Multimillion-Dollar Tech Enterprise</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Charities beg for grants; category-defining tech companies build sovereign monopolies with recurring subscription cashflow. Here is how CivicDuty creates lasting, generational wealth for you as the founder:
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                  <Landmark size={20} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      Revenue Stream A: Municipal &amp; Government B2G SaaS
                    </span>
                    <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400">UGX 4.38 Billion / Year</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Uganda has 146 districts, 10 city authorities, and 31 municipalities. Licensing CivicDuty at an average annual fee of <strong>UGX 30,000,000 (~$8,100)</strong> per authority for the supervisory intelligence dashboard yields over <strong>$1.18 Million USD (UGX 4.38B)</strong> in annual recurring revenue (ARR) in Uganda alone.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                  <Briefcase size={20} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      Revenue Stream B: Corporate ESG &amp; CSR Escrow Clearing Fee
                    </span>
                    <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">8% to 15% Platform Take-Rate</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Multinationals (MTN, Airtel, Stanbic, Nile Breweries, TotalEnergies) spend billions annually on CSR clean-ups and environmental campaigns with zero verification. Through CivicDuty&apos;s <strong>Perk Vault Escrow</strong>, they deposit CSR funds; when citizens verify clean-up actions with GPS photos, CivicDuty clears the payout and collects a 10% escrow fee.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-500 shrink-0">
                  <Layers size={20} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      Revenue Stream C: Geospatial Infrastructure &amp; Mobility Intelligence
                    </span>
                    <span className="text-xs font-mono font-black text-teal-600 dark:text-teal-400">High-Margin Enterprise API</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Logistics giants (SafeBoda, Jumia, DHL), insurance companies, and real estate developers desperately need real-time data on flooded roads, road quality, and municipal utilities. Licensing CivicDuty&apos;s real-time anonymized hazard API provides hands-off, 90%+ gross margin software income.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                  <Globe size={20} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      Revenue Stream D: Pan-African Sovereign Scaling
                    </span>
                    <span className="text-xs font-mono font-black text-purple-600 dark:text-purple-400">10 African Nations = $12M+ ARR</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Once proven in Uganda, duplicate the exact same desk framework to Kenya (47 County Governments), Rwanda (30 Districts), Ghana (261 MMDAs), and Nigeria (774 LGAs). The software architecture is already multi-currency and multi-jurisdiction.
                  </p>
                </div>
              </div>
            </div>

            {/* Founder Wealth Mentorship Principles */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-amber-950 text-slate-200 space-y-3 mt-4 border border-amber-500/30">
              <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
                <Lightbulb size={16} />
                <span>Founder Wealth Mentorship Principles</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                <li><strong>Protect Your Equity:</strong> Never give away equity to &quot;advisors&quot; or early investors before you have cash-paying customers. CivicDuty is already built and live—your leverage is at an all-time high.</li>
                <li><strong>Cashflow Over Vanity:</strong> Do not burn money on fancy offices in Kololo or Nakasero. Keep your burn rate near zero while locking in your first 3 local government pilots.</li>
                <li><strong>The Enterprise Flywheel:</strong> Free for citizens to build an irresistible public userbase; premium enterprise subscriptions for government and corporate sponsors to harvest cashflow.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
