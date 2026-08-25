import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getDept } from '../utils/helpers';
import { NoteBox } from '../components/NoteBox';
import { CreditCard, CheckCircle } from 'lucide-react';

export const GovBillingView: React.FC = () => {
  const { user, invoices, recordInvoicePayment, go, toast } = useApp();

  const [activeTab, setActiveTab] = useState<'status' | 'invoices' | 'pay'>('status');
  const [payMethod, setPayMethod] = useState<'momo' | 'bank' | 'cheque'>('momo');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [momoPhone, setMomoPhone] = useState('');
  const [txRef, setTxRef] = useState('');

  if (!user || !['node_admin', 'platform_admin'].includes(user.role)) {
    go('gov_inbox');
    return null;
  }

  const d = getDept(user.country, user.dept || 'kcca');
  const myInvoices = invoices.filter((inv) => (!inv.country || inv.country === user.country) && (!user.dept || inv.dept === user.dept || user.role === 'platform_admin'));

  const handleRecordPayment = (invId: string) => {
    if (!txRef.trim()) {
      toast('Transaction reference required', 'red');
      return;
    }

    recordInvoicePayment(invId, txRef.trim(), payMethod);
    setTxRef('');
    setMomoPhone('');
    setSelectedInvoiceId('');
    toast('Payment recorded and receipt generated', 'emerald');
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-12">
      <div>
        <div className="tagline mb-1.5" style={{ color: '#f59e0b' }}>
          Finance
        </div>
        <h2 className="text-[21px] font-black text-amber-400 tracking-tight leading-tight">
          {d.name} · Billing & Invoices
        </h2>
        <p className="text-[11px] mono text-zinc-600 mt-1.5">
          CivicDuty Subscription · Invoices, Receipts & Payments
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-900/80">
        {[
          ['status', 'Subscription'],
          ['invoices', `Invoices (${myInvoices.length})`],
          ['pay', 'Make Payment'],
        ].map(([t, l]) => (
          <button
            key={t}
            onClick={() => setActiveTab(t as any)}
            className={`flex-1 py-3 text-[9px] mono font-bold uppercase tracking-widest transition-colors ${
              activeTab === t
                ? 'text-amber-400 border-b-2 border-amber-500'
                : 'text-zinc-600 hover:text-zinc-500'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {activeTab === 'status' && (
        <div className="space-y-3">
          <div className="card p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[9px] mono text-zinc-500 uppercase tracking-widest">Plan Status</p>
                <h3 className="text-[16px] font-black text-zinc-100 mt-1">Government Regional Tier</h3>
                <p className="text-[10px] mono text-zinc-500 mt-0.5">Coverage: {d.name}</p>
              </div>
              <span className="chip ch-resolved">Active ✓</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-zinc-900 text-[9px] mono">
              <div>
                <span className="text-zinc-600 block">Annual Subscription</span>
                <span className="text-zinc-200 font-bold">$18,000 / year</span>
              </div>
              <div>
                <span className="text-zinc-600 block">Next Renewal</span>
                <span className="text-zinc-200 font-bold">15 Dec 2026</span>
              </div>
              <div>
                <span className="text-zinc-600 block">Desks Mounted</span>
                <span className="text-emerald-400 font-bold">14 Active Desks</span>
              </div>
              <div>
                <span className="text-zinc-600 block">Payment Cycle</span>
                <span className="text-zinc-200 font-bold">Annual Invoice</span>
              </div>
            </div>
          </div>

          <NoteBox
            tone="emerald"
            title="Public Service Guarantee"
            text="Service delivery is never throttled for civic governance desks. Invoices are payable within 60 days of issue."
          />
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="space-y-3">
          {myInvoices.length === 0 ? (
            <div className="card p-8 text-center text-xs mono text-zinc-600">No invoices generated for this desk.</div>
          ) : (
            myInvoices.map((inv) => (
              <div key={inv.id} className="card p-4 space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-amber-300 mono">{inv.id}</span>
                    <p className="text-[11px] font-bold text-zinc-200 mt-0.5">{inv.period}</p>
                  </div>
                  <span className={`chip ${inv.status === 'paid' ? 'ch-resolved' : 'ch-overdue'}`}>
                    {inv.status === 'paid' ? 'Paid ✓' : 'Unpaid · Due in 30d'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-zinc-900 text-[10px] mono">
                  <span className="text-zinc-500">Issued: {inv.date}</span>
                  <span className="text-zinc-100 font-bold text-sm">${inv.amount.toLocaleString()}</span>
                </div>

                {inv.status !== 'paid' && (
                  <button
                    onClick={() => {
                      setSelectedInvoiceId(inv.id);
                      setActiveTab('pay');
                    }}
                    className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 py-2.5 rounded-xl text-[10px] mono font-bold uppercase tracking-widest transition-colors mt-2"
                  >
                    Pay Invoice Now →
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'pay' && (
        <div className="space-y-4">
          <div className="card-gov p-4 space-y-3" style={{ borderRadius: '16px' }}>
            <p className="text-[9px] mono text-zinc-500 uppercase tracking-widest">Select Invoice to Pay</p>
            <select
              value={selectedInvoiceId}
              onChange={(e) => setSelectedInvoiceId(e.target.value)}
              className="mono text-sm"
            >
              <option value="">Choose invoice...</option>
              {myInvoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.id} — ${inv.amount.toLocaleString()} ({inv.period})
                </option>
              ))}
            </select>

            <div className="space-y-2 pt-2">
              <label className="text-[9px] mono text-zinc-500 uppercase tracking-widest block">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['momo', 'Mobile Money'],
                  ['bank', 'Bank Wire'],
                  ['cheque', 'EFT / Cheque'],
                ].map(([m, l]) => (
                  <button
                    key={m}
                    onClick={() => setPayMethod(m as any)}
                    className={`py-2.5 rounded-xl text-[8px] mono font-bold border transition-all ${
                      payMethod === m
                        ? 'border-amber-500/40 bg-amber-500/8 text-amber-400'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-500 hover:border-zinc-700'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {payMethod === 'momo' && (
              <div className="space-y-2 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
                <p className="text-[9px] mono text-amber-400 font-bold">MTN MoMo / Airtel Money PayBill</p>
                <p className="text-[8px] mono text-zinc-500">Merchant Code: 994012 · Name: CivicDuty Governance</p>
                <input
                  type="text"
                  value={momoPhone}
                  onChange={(e) => setMomoPhone(e.target.value)}
                  placeholder="Payer phone number (e.g. +256771000000)"
                  className="mono text-xs"
                />
              </div>
            )}

            {payMethod === 'bank' && (
              <div className="space-y-1.5 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800 text-[9px] mono text-zinc-400">
                <p className="text-amber-400 font-bold">Bank Wire Details</p>
                <p>Bank: Stanbic Bank Uganda</p>
                <p>Account Name: CivicDuty East Africa Ltd</p>
                <p>Account No: 9030018821094</p>
                <p>Swift Code: SBICUGKX</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[9px] mono text-zinc-500 uppercase tracking-widest block">Transaction Reference / Receipt No</label>
              <input
                type="text"
                value={txRef}
                onChange={(e) => setTxRef(e.target.value)}
                placeholder="e.g. TRX-9041284 / MoMo ID / Bank Ref"
                className="mono text-xs"
              />
            </div>

            <button
              onClick={() => handleRecordPayment(selectedInvoiceId || myInvoices[0]?.id)}
              disabled={!selectedInvoiceId && myInvoices.length === 0}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl py-3.5 text-xs uppercase tracking-widest mono transition-all active:scale-[.98] mt-2"
            >
              Submit Payment Confirmation →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
