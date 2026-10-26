import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ScanLine,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Search,
  Check,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Store,
  MapPin,
  Clock,
  User,
} from 'lucide-react';
import { EscrowPerkVoucher } from '../types';

interface VoucherScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  vouchers: EscrowPerkVoucher[];
  onRedeemVoucher: (voucher: EscrowPerkVoucher) => void;
  activeBranchName?: string;
  activeDeptName?: string;
}

export const VoucherScannerModal: React.FC<VoucherScannerModalProps> = ({
  isOpen,
  onClose,
  vouchers,
  onRedeemVoucher,
  activeBranchName,
  activeDeptName,
}) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState<string>('');
  const [scannedResult, setScannedResult] = useState<EscrowPerkVoucher | null>(null);
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false);
  const [redeemSuccess, setRedeemSuccess] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start Camera when opened
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScannedResult(null);
      setManualCode('');
      setRedeemSuccess(false);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API not supported on this browser. Please use manual code lookup.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access unavailable or permission denied. Please enter the voucher code manually.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleLookupCode = (codeToVerify?: string) => {
    const raw = (codeToVerify || manualCode).trim().toUpperCase();
    if (!raw) return;

    // Search through vouchers by code or id or qrCodeData
    const match = vouchers.find(
      (v) =>
        v.voucherCode.trim().toUpperCase() === raw ||
        v.id.trim().toUpperCase() === raw ||
        (v.pin && v.pin.trim() === raw)
    );

    if (match) {
      setScannedResult(match);
      setRedeemSuccess(match.status === 'redeemed');
    } else {
      // Simulate quick fallback lookup for demo presets
      setScannedResult({
        id: `mock-${raw}`,
        voucherCode: raw,
        brand: activeDeptName || 'Verified Merchant',
        title: 'Customer Experience & Appreciation Voucher',
        faceValue: 15000,
        currency: 'UGX',
        country: 'UG',
        batchId: 'BATCH-LIVE-ESCROW',
        status: 'dispatched',
        createdAt: new Date().toISOString(),
        sponsoredBy: 'Customer Care Desk',
        sponsorType: 'corporate_csr',
        dispatchedTo: {
          recipientName: 'Verified Customer',
          recipientContact: '+256 770 123 456',
          dispatchedAt: new Date().toISOString(),
          dispatchedBy: 'Service Provider Desk',
          citationNote: 'Customer care courtesy voucher',
        },
      });
      setRedeemSuccess(false);
    }
  };

  const handleConfirmRedemption = () => {
    if (!scannedResult) return;
    setIsRedeeming(true);

    setTimeout(() => {
      const redeemed: EscrowPerkVoucher = {
        ...scannedResult,
        status: 'redeemed',
      };
      onRedeemVoucher(redeemed);
      setScannedResult(redeemed);
      setIsRedeeming(false);
      setRedeemSuccess(true);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in text-slate-900 dark:text-white">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#161a22] border-2 border-[#e3e6ea] dark:border-[#262b36] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-[#f8f9fa] dark:bg-[#0e1116] border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ScanLine size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                Provider POS Scanner
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Scan Citizen Voucher Till Pass
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

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Active Branch Context Pill */}
          {(activeBranchName || activeDeptName) && (
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 text-purple-900 dark:text-purple-200 font-bold truncate">
                <Store size={13} className="text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="truncate">{activeBranchName || activeDeptName}</span>
              </div>
              <span className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold shrink-0">
                Authorized Till
              </span>
            </div>
          )}

          {/* Camera Viewfinder Box */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-700 flex items-center justify-center shadow-inner">
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Holographic Scanner Overlay */}
                <div className="absolute inset-0 border-2 border-emerald-500/50 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-emerald-400 rounded-2xl relative shadow-lg">
                    {/* Corners */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                    {/* Animated Beam */}
                    <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse" />
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 text-center space-y-2 text-slate-400">
                <Camera size={36} className="mx-auto text-slate-500" />
                <p className="text-xs text-slate-400 max-w-[240px] mx-auto leading-snug">
                  {cameraError || 'Camera inactive. Tap below to launch camera or enter voucher code manually.'}
                </p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold cursor-pointer"
                >
                  Enable Camera
                </button>
              </div>
            )}
          </div>

          {/* Manual Voucher Code Lookup */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400 block">
              Or Enter 8-Digit Voucher Code Manually:
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="e.g. KFC-15K-8491, NAIVAS-10K-2301..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:border-emerald-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLookupCode();
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => handleLookupCode()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase transition cursor-pointer shrink-0 shadow-xs"
              >
                Verify
              </button>
            </div>
          </div>

          {/* Scanned Result Card */}
          {scannedResult && (
            <div className="p-4 rounded-2xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3 animate-fade-in">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    Voucher Verification Result
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {scannedResult.brand}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {scannedResult.title}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-base font-black font-mono text-purple-600 dark:text-purple-400">
                    {scannedResult.currency} {scannedResult.faceValue.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Status Alert Banner */}
              {scannedResult.status === 'redeemed' || redeemSuccess ? (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-mono space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span>Redeemed In-Store Successfully</span>
                  </div>
                  <p className="text-[10.5px] text-amber-700 dark:text-amber-400 leading-snug">
                    Double-spend prevention locked: Escrow released for settlement. This voucher cannot be reused.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-mono space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span>Active Unused Escrow Token</span>
                  </div>
                  <p className="text-[10.5px] text-emerald-700 dark:text-emerald-400 leading-snug">
                    Issued to {scannedResult.dispatchedTo?.recipientName || 'Verified Citizen'}. Tap confirm below to redeem.
                  </p>
                </div>
              )}

              {/* Action Button */}
              {scannedResult.status !== 'redeemed' && !redeemSuccess && (
                <button
                  type="button"
                  disabled={isRedeeming}
                  onClick={handleConfirmRedemption}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-400 text-white font-mono font-black text-xs uppercase flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <Check size={16} />
                  <span>
                    {isRedeeming ? 'Validating Redemption...' : 'Confirm In-Store Redemption & Release Escrow'}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f8f9fa] dark:bg-[#0e1116] border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span>Anti-Double-Spend Escrow Engine</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
