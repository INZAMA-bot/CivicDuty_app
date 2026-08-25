import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, PhoneCall, Radio, Send, CheckCircle } from 'lucide-react';

export const UssdView: React.FC = () => {
  const { go, toast } = useApp();
  const [session, setSession] = useState<boolean>(false);
  const [screenText, setScreenText] = useState<string>(
    'CivicDuty Offline Portal (*3030#)\n1. Report Issue\n2. Track Ticket Status\n3. Contact Parish Chief\n4. Utility Outages\n0. Exit'
  );
  const [inputVal, setInputVal] = useState<string>('');
  const [step, setStep] = useState<number>(0);

  const startDial = () => {
    setSession(true);
    setStep(1);
    setScreenText(
      'CivicDuty Offline Portal (*3030#)\n1. Report Issue\n2. Track Ticket Status\n3. Contact Parish Chief\n4. Utility Outages\n0. Exit'
    );
  };

  const handleSend = () => {
    if (!inputVal.trim()) return;

    if (step === 1) {
      if (inputVal === '1') {
        setStep(2);
        setScreenText('Select Issue Category:\n1. Pothole / Road\n2. Water Supply\n3. Power Outage\n4. Corruption');
      } else if (inputVal === '2') {
        setStep(10);
        setScreenText('Enter Ticket ID (e.g. KLA-102):');
      } else if (inputVal === '3') {
        setStep(20);
        setScreenText('Parish Chief - Banda Parish:\nWasswa Michael\nPhone: +256 700 123 456\nStatus: On Duty');
      } else if (inputVal === '4') {
        setStep(30);
        setScreenText('Active Utility Outages:\n- Umeme: Feeder 4 Tripped (Banda)\n- NWSC: Main Pipe Burst (Ntinda)');
      } else if (inputVal === '0') {
        setSession(false);
        setStep(0);
      } else {
        toast('Invalid option', 'amber');
      }
    } else if (step === 2) {
      setStep(3);
      setScreenText('Describe Location:\nEnter Parish or Landmark (e.g. Bukoto Market):');
    } else if (step === 3) {
      setStep(4);
      setScreenText('Thank you! Report filed via USSD.\nTicket ID: USSD-' + Math.floor(1000 + Math.random() * 9000) + '\nResponse Target: 48 Hours.');
      toast('USSD Report Submitted Successfully!', 'emerald');
    } else {
      setSession(false);
      setStep(0);
    }
    setInputVal('');
  };

  return (
    <div className="p-4 space-y-5 animate-fade-in pb-12">
      <div>
        <button
          onClick={() => go('splash')}
          className="flex items-center gap-1 text-[10px] mono text-slate-400 hover:text-teal-400 mb-3.5 transition-colors"
        >
          <ChevronLeft size={14} /> Back to Home
        </button>
        <div className="tagline text-teal-400 mb-1">Offline Infrastructure</div>
        <h2 className="text-[22px] font-black text-slate-100 tracking-tight leading-tight">USSD *3030# Channel</h2>
        <p className="text-[11px] mono text-slate-400 mt-1">
          No smartphone or internet required. Millions of citizens in rural parishes report issues via feature phones using free USSD/SMS protocol.
        </p>
      </div>

      {/* Simulator Terminal */}
      <div className="card p-5 border-slate-800 bg-slate-950/90 shadow-2xl relative">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-teal-400 animate-pulse" />
            <span className="text-[10px] mono text-slate-300 font-bold uppercase tracking-wider">Feature Phone Simulator</span>
          </div>
          <span className="chip ch-gov">Network: GSM Active</span>
        </div>

        {!session ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto">
              <PhoneCall size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-200">Dial *3030#</p>
              <p className="text-[10px] mono text-slate-500 mt-1">Free on MTN, Airtel, Glo, Safaricom</p>
            </div>
            <button
              onClick={startDial}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl px-6 py-3 text-xs uppercase tracking-widest mono transition-all active:scale-[.98]"
            >
              Dial *3030# Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-950/40 border border-teal-500/30 rounded-xl p-4 font-mono text-xs text-teal-300 leading-relaxed whitespace-pre-wrap min-h-[120px]">
              {screenText}
            </div>

            {step !== 4 && step !== 20 && step !== 30 ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Type option number or reply..."
                  className="mono text-xs flex-1"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                  onClick={handleSend}
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 rounded-xl text-xs flex items-center gap-1"
                >
                  Reply <Send size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setSession(false);
                  setStep(0);
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs mono"
              >
                End Session
              </button>
            )}
          </div>
        )}
      </div>

      {/* Highlights */}
      <div className="card p-4 space-y-3 border-slate-800">
        <p className="text-[9px] mono text-slate-400 uppercase tracking-widest">Key Offline Capabilities</p>
        <div className="space-y-2 text-[10px] mono text-slate-300">
          <div className="flex items-start gap-2">
            <CheckCircle size={14} className="text-teal-400 flex-shrink-0 mt-0.5" />
            <span>Cell-tower triangulation automatically captures parish location for USSD reports.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle size={14} className="text-teal-400 flex-shrink-0 mt-0.5" />
            <span>SMS updates send automated response deadline notifications back to the citizen's phone.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle size={14} className="text-teal-400 flex-shrink-0 mt-0.5" />
            <span>Zero internet cost — subsidized via national civic infrastructure agreements.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
