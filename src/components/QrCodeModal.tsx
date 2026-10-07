import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  Building2,
  FileCheck2,
  Smartphone
} from 'lucide-react';
import { Department, Post } from '../types';
import { COUNTRIES } from '../data/countries';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'ticket' | 'desk';
  post?: Post | null;
  dept?: Department | null;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  type,
  post,
  dept,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const printableRef = useRef<HTMLDivElement>(null);

  const countryInfo = COUNTRIES[post?.country || dept?.country || 'UG'];

  const getTargetUrl = () => {
    const origin =
      typeof window !== 'undefined' && !window.location.origin.includes('run.app')
        ? window.location.origin
        : 'https://civicduty.site';
    if (type === 'ticket' && post) {
      return `${origin}/verify?ticket=${encodeURIComponent(post.id)}`;
    }
    if (type === 'desk' && dept) {
      return `${origin}/compose?dept=${encodeURIComponent(dept.id)}`;
    }
    return origin;
  };

  const targetUrl = getTargetUrl();

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(targetUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = type === 'ticket' ? `civicduty-ticket-${post?.id || 'doc'}.png` : `civicduty-placard-${dept?.id || 'desk'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl relative flex flex-col max-h-[88dvh] sm:max-h-[90vh] my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
              <QrCode size={20} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                {type === 'ticket' ? 'Official Docket QR Code Verification' : 'Official Counter QR Placard'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500">
                {type === 'ticket'
                  ? 'Cryptographic seal & smartphone scan verification'
                  : 'Printable counter placard for direct citizen reporting'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Printable Card Preview */}
        <div className="p-4 sm:p-5 overflow-y-auto overscroll-contain flex-1 space-y-4">
          <div
            ref={printableRef}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 text-center space-y-3.5 print:border-black print:m-0 print:p-6 shadow-xs"
          >
            {type === 'desk' && dept && (
              <div className="space-y-1 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <ShieldCheck size={14} />
                  <span>{countryInfo?.name || 'Sovereign'} Civic Accountability Counter</span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {dept.name} ({dept.full})
                </h4>
                <p className="text-[10.5px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Experiencing service delays, extortion, or absenteeism? Scan with any phone camera to report directly to the Town Clerk / Managing Director.
                </p>
              </div>
            )}

            {type === 'ticket' && post && (
              <div className="space-y-1 border-b border-slate-200 dark:border-slate-800 pb-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-amber-600 dark:text-amber-400">
                    TICKET #{post.id}
                  </span>
                  <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {post.status.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white line-clamp-1">
                  {post.title}
                </h4>
                <div className="text-[10.5px] text-slate-500 flex items-center justify-between">
                  <span>Dept: {post.dept.toUpperCase()}</span>
                  {post.author_profession && (
                    <span className="text-amber-500 font-bold">
                      Filed by: {post.author_profession}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* QR Image Display */}
            <div className="flex flex-col items-center justify-center py-1">
              {qrDataUrl ? (
                <div className="p-2.5 bg-white rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
                  <img src={qrDataUrl} alt="QR Code" className="w-40 h-40 sm:w-48 sm:h-48 object-contain" />
                </div>
              ) : (
                <div className="w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse text-xs text-slate-500">
                  Generating Secure QR Code...
                </div>
              )}
              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Smartphone size={13} className="text-emerald-500" />
                <span>Point any phone camera to scan</span>
              </div>
            </div>

            {/* Cryptographic / Link Details */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left font-mono text-[10px] sm:text-[11px] space-y-1">
              <div className="text-slate-400 text-[9.5px] uppercase font-bold">
                {type === 'ticket' ? 'Statutory Verification URL' : 'Direct Desk Intake Deep-Link'}
              </div>
              <div className="text-slate-800 dark:text-slate-200 truncate select-all">
                {targetUrl}
              </div>
              {type === 'ticket' && post?.crypto_seal_hash && (
                <div className="pt-0.5 text-[9.5px] text-slate-400">
                  Seal Hash: <span className="text-emerald-500">{post.crypto_seal_hash.slice(0, 16)}...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-950/95 shrink-0 grid grid-cols-3 gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handleDownloadQr}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition cursor-pointer shadow-sm font-mono"
          >
            <Download size={14} />
            <span>Save PNG</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer shadow-sm font-mono"
          >
            <Printer size={14} />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};
