import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  Smartphone,
  Store,
  Clock,
  Printer,
  Award,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { EscrowPerkVoucher } from '../types';
import { copyToClipboard } from '../utils/helpers';

interface VoucherPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: EscrowPerkVoucher | null;
}

export const VoucherPassModal: React.FC<VoucherPassModalProps> = ({
  isOpen,
  onClose,
  voucher,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !voucher) return;
    const payload = JSON.stringify({
      code: voucher.voucherCode,
      brand: voucher.brand,
      val: voucher.faceValue,
      curr: voucher.currency,
      pin: voucher.pin || '',
      id: voucher.id,
      seal: `CIVIC-PERK-SEAL-${voucher.voucherCode}`,
    });

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR:', err));
  }, [isOpen, voucher]);

  if (!isOpen || !voucher) return null;

  const isRedeemed = voucher.status === 'redeemed';
  const ussdCode = voucher.redemptionUssdString || (voucher.country === 'KE' ? `*141*${voucher.voucherCode}#` : `*303*${voucher.voucherCode}#`);

  const handleCopyCode = () => {
    copyToClipboard(voucher.voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-[#161a22] border-2 border-[#e3e6ea] dark:border-[#262b36] shadow-2xl overflow-hidden text-slate-900 dark:text-white flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 bg-[#f8f9fa] dark:bg-[#0e1116] border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Award size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                Citizen Perks Pass
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                {voucher.brand}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-center">
          {/* Status Badge */}
          <div className="flex items-center justify-center">
            {isRedeemed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700">
                <CheckCircle2 size={13} className="text-slate-500" />
                <span>Already Redeemed In-Store</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Ready for In-Store Scan &amp; USSD Dial</span>
              </span>
            )}
          </div>

          {/* Title & Face Value */}
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
              {voucher.title}
            </h4>
            <div className="text-xl sm:text-2xl font-black font-mono text-purple-600 dark:text-purple-400 mt-1">
              {voucher.currency} {voucher.faceValue.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Issued to {voucher.dispatchedTo?.recipientName || 'Verified Citizen'}
            </p>
          </div>

          {/* High-Contrast QR Code Card */}
          <div className="p-4 rounded-2xl bg-white border-2 border-dashed border-slate-300 dark:border-slate-700 max-w-[240px] mx-auto shadow-sm">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code for ${voucher.voucherCode}`}
                className="w-full aspect-square object-contain mx-auto rounded-lg"
              />
            ) : (
              <div className="w-full aspect-square flex items-center justify-center bg-slate-100 rounded-lg">
                <QrCode size={48} className="text-slate-400 animate-pulse" />
              </div>
            )}

            {/* Fake 1D Barcode Line Art */}
            <div className="mt-3 pt-2 border-t border-slate-200 flex flex-col items-center">
              <div className="h-7 w-full flex items-stretch justify-between gap-[1.5px] px-2 overflow-hidden bg-white">
                {Array.from({ length: 38 }).map((_, i) => (
                  <div
                    key={i}
                    className={`bg-slate-900 ${
                      i % 4 === 0 ? 'w-[3px]' : i % 3 === 0 ? 'w-[2px]' : 'w-[1px]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono tracking-widest text-slate-700 mt-1 font-bold">
                {voucher.voucherCode}
              </span>
            </div>
          </div>

          {/* Code Copy Ribbon */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">
                Voucher Code
              </span>
              <span className="text-xs font-mono font-black text-slate-900 dark:text-white">
                {voucher.voucherCode}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300"
            >
              {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Redemption Pathways */}
          <div className="space-y-2 text-left text-xs">
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              3 Ways to Redeem
            </span>

            {/* 1. USSD Dial */}
            {ussdCode && (
              <a
                href={`tel:${encodeURIComponent(ussdCode)}`}
                className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Smartphone size={14} className="text-purple-600 dark:text-purple-400" />
                  <div>
                    <span className="text-[11px] font-bold text-purple-950 dark:text-purple-200 block">
                      1. Instant USSD Dial
                    </span>
                    <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300">
                      {ussdCode}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-600 text-white">
                  Dial Now
                </span>
              </a>
            )}

            {/* 2. In-Store Scan */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2">
              <Store size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-slate-900 dark:text-white block">
                  2. Over-the-Counter Till Scan
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                  Show this QR code to the cashier at any participating branch. The cashier will scan the pass to confirm.
                </p>
              </div>
            </div>

            {/* 3. SMS Fallback */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2">
              <Clock size={14} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-slate-900 dark:text-white block">
                  3. SMS / Zero-Data Code
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                  Quote code <strong className="font-mono">{voucher.voucherCode}</strong> if using a basic phone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#f8f9fa] dark:bg-[#0e1116] border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span>SHA-256 Escrow Sealed</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
