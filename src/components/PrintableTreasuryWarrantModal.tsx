import React from 'react';
import { Printer, X, ShieldCheck, QrCode, CheckCircle2, Landmark, HardHat, FileText, Download } from 'lucide-react';
import { Project } from '../types';

interface PrintableTreasuryWarrantModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: any;
  project: Project;
}

export const PrintableTreasuryWarrantModal: React.FC<PrintableTreasuryWarrantModalProps> = ({
  isOpen,
  onClose,
  voucher,
  project,
}) => {
  if (!isOpen || !voucher) return null;

  const handlePrint = () => {
    window.print();
  };

  const currency = voucher.currency || (project.country === 'KE' ? 'KES' : project.country === 'NG' ? 'NGN' : 'UGX');
  const gross = Number(voucher.grossAmount || 0);
  const whtTax = Number(voucher.whtTaxDeduction || Math.round(gross * 0.06));
  const retention = Number(voucher.retentionEscrowHold || Math.round(gross * 0.05));
  const netPayable = Number(voucher.netPayable || gross - whtTax - retention);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white animate-fade-in">
      <div className="bg-white text-slate-900 border border-slate-300 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl print:border-none print:shadow-none print:w-full print:max-w-none print:rounded-none">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-[10px] mono uppercase font-black px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200">
              Official Electronic Treasury Warrant
            </span>
            <span className="text-xs text-slate-500 mono">Warrant Ref: {voucher.voucherNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold mono flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Printer size={13} />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PRINTABLE SLIP CONTAINER */}
        <div className="border-4 border-double border-slate-900 p-6 sm:p-8 space-y-6 font-mono text-xs bg-amber-50/15">
          {/* Official Republic Header */}
          <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
            <div className="text-[11px] font-black tracking-widest uppercase text-slate-700">
              THE REPUBLIC OF UGANDA
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-slate-950">
              MINISTRY OF FINANCE, PLANNING &amp; ECONOMIC DEVELOPMENT
            </h2>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
              Treasury Operations Directorate · Public Infrastructure Escrow Authority
            </p>
            <div className="inline-block mt-1 px-3 py-0.5 border border-slate-800 text-[10px] font-black uppercase tracking-widest bg-white">
              ELECTRONIC FISCAL DISBURSEMENT WARRANT &amp; AUDIT SLIP
            </div>
          </div>

          {/* Warrant Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-slate-300 pb-4 text-[10px]">
            <div>
              <span className="text-slate-500 uppercase block">Warrant No:</span>
              <span className="font-bold text-slate-950 text-xs">{voucher.voucherNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase block">Issue Date:</span>
              <span className="font-bold text-slate-950">{voucher.issuedAt ? new Date(voucher.issuedAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase block">Project Code:</span>
              <span className="font-bold text-slate-950">{project.code}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase block">Settlement Status:</span>
              <span className="font-black text-emerald-800 uppercase">
                {voucher.disbursementStatus === 'completed_bank_transfer' ? 'RTGS Disbursed' : 'Authorized · Verified'}
              </span>
            </div>
          </div>

          {/* Project & Beneficiary Particulars */}
          <div className="space-y-2 border-b border-slate-300 pb-4 text-[11px]">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-slate-500 uppercase font-bold">Project Name:</span>
              <span className="font-bold text-slate-950 text-right">{project.title}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-slate-500 uppercase font-bold">Procuring Entity:</span>
              <span className="font-bold text-slate-900">{project.dept?.toUpperCase() || 'KCCA'} (Directorate of Engineering &amp; Technical Services)</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-slate-500 uppercase font-bold">Certified Contractor:</span>
              <span className="font-bold text-amber-900">{voucher.contractor || project.contractor} (PPDA Reg: #PPDA-2026-ENG-491)</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-slate-500 uppercase font-bold">Milestone Deliverable:</span>
              <span className="font-bold text-slate-950">{voucher.milestoneTitle}</span>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="space-y-1.5 border-b border-slate-900 pb-4">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-800 pb-1">
              Financial Breakdown &amp; Statutory Deductions
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Gross Interim Payment Certificate (IPC) Value:</span>
              <span className="font-bold text-slate-900">{currency} {gross.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200 text-rose-700">
              <span>Less: 6% Statutory Withholding Tax (URA Tax Remittance):</span>
              <span className="font-bold">- {currency} {whtTax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200 text-amber-800">
              <span>Less: 5% Defects Liability Escrow Hold (Bank of Uganda Project Escrow):</span>
              <span className="font-bold">- {currency} {retention.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 text-sm font-black text-emerald-800 pt-2 border-t-2 border-slate-900 bg-emerald-50/50 px-2 rounded">
              <span className="uppercase">Net Amount Disbursed to Contractor:</span>
              <span>{currency} {netPayable.toLocaleString()}</span>
            </div>
          </div>

          {/* Dual Verification & Authorizing Signatures */}
          <div className="grid grid-cols-2 gap-4 pt-2 text-[10px]">
            <div className="p-3 border border-slate-300 rounded-xl space-y-1 bg-white">
              <span className="text-slate-500 block uppercase font-bold">Procuring Supervising Engineer:</span>
              <div className="font-bold text-slate-950">{voucher.awarderSigner || 'Supervising Engineer (Gov)'}</div>
              <div className="text-emerald-700 flex items-center gap-1 font-bold">
                <CheckCircle2 size={12} /> Technical Sign-off Verified
              </div>
              <div className="text-[9px] text-slate-400">Date: {new Date().toLocaleDateString()}</div>
            </div>

            <div className="p-3 border border-slate-300 rounded-xl space-y-1 bg-white">
              <span className="text-slate-500 block uppercase font-bold">Contractor Lead Engineer:</span>
              <div className="font-bold text-slate-950">{voucher.contractorSigner || 'Contractor Exec Lead'}</div>
              <div className="text-amber-700 flex items-center gap-1 font-bold">
                <CheckCircle2 size={12} /> BOQ Delivery Sworn &amp; Affirmed
              </div>
              <div className="text-[9px] text-slate-400">Date: {new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {/* Blockchain Cryptographic Seal & QR Stamp */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-300 text-[9px] text-slate-600">
            <div className="space-y-1">
              <div>
                <span className="font-bold text-slate-900">SHA-256 Audit Seal: </span>
                <span className="font-mono text-teal-800">{voucher.blockchainSeal || 'SEAL-FIDIC-RED-2026-UG-99812A4F98E2'}</span>
              </div>
              <p className="text-slate-500">
                This warrant was electronically verified and sealed under Public Finance Management Act (PFMA) Section 34.
              </p>
            </div>
            <div className="shrink-0 p-2 border border-slate-400 rounded-lg bg-white flex flex-col items-center">
              <QrCode size={36} className="text-slate-900" />
              <span className="text-[7.5px] uppercase font-bold mt-0.5">Gov Verify</span>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="flex items-center justify-between text-xs text-slate-500 mono print:hidden">
          <span>Printed copies are valid for statutory audit and bank RTGS clearance.</span>
          <button
            onClick={handlePrint}
            className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Printer size={13} /> Print Slip
          </button>
        </div>
      </div>
    </div>
  );
};
