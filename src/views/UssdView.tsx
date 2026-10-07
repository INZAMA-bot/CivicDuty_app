import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  PhoneCall, 
  Radio, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Smartphone, 
  Signal, 
  Battery, 
  ShieldAlert,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Post, CountryCode } from '../types';
import { COUNTRIES, allDepts } from '../data/countries';

export const UssdView: React.FC = () => {
  const { user, selectedCountry, setSelectedCountry, go, toast, addPost, posts, setActivePost } = useApp();
  const activeCountry = (user?.country || selectedCountry || 'UG') as CountryCode;
  const countryInfo = COUNTRIES[activeCountry] || COUNTRIES.UG;
  const [session, setSession] = useState<boolean>(false);
  const [screenText, setScreenText] = useState<string>('');
  const [inputVal, setInputVal] = useState<string>('');
  const [step, setStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'USSD' | 'SMS_INBOX'>('USSD');

  // Staged USSD Reporting Data
  const [ussdCategory, setUssdCategory] = useState<string>('');
  const [ussdParish, setUssdParish] = useState<string>('');
  const [ussdDesc, setUssdDesc] = useState<string>('');
  const [createdTicketId, setCreatedTicketId] = useState<string>('');

  // Simulated SMS Inbox
  const [smsMessages, setSmsMessages] = useState<Array<{ id: string; sender: string; time: string; text: string; ticketId?: string }>>([
    {
      id: 'sms-1',
      sender: 'CIVICDUTY-GOV',
      time: '10 mins ago',
      text: 'CONFIRMATION: Report #KLA-8821 received by Kampala Central Division Works Desk. 48h SLA response deadline active.',
      ticketId: 'KLA-8821'
    },
    {
      id: 'sms-2',
      sender: 'MOLG-ESC',
      time: 'Yesterday',
      text: 'UPDATE: Road maintenance at Bukoto II Parish has been assigned to Contractor. Track progress free on *3030#.',
      ticketId: 'KLA-102'
    }
  ]);

  const startDial = (code: string = '*3030#') => {
    setSession(true);
    setStep(1);
    setScreenText(
      `${countryInfo.name.toUpperCase()} CIVICDUTY USSD (*3030#)\n1. Report Infrastructure Issue\n2. Track Ticket Status\n3. Community Grant / Ward Grievance\n4. Confirm / Ratify Fix\n5. Anti-Corruption Whistleblower\n0. Exit`
    );
  };

  const handleKeypadPress = (digit: string) => {
    if (!session) {
      if (inputVal.length < 7) {
        setInputVal(prev => prev + digit);
      }
    } else {
      setInputVal(prev => prev + digit);
    }
  };

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const val = inputVal.trim();

    if (step === 1) {
      if (val === '1') {
        setStep(2);
        setScreenText('SELECT CATEGORY:\n1. Road / Pothole\n2. Water / Borehole\n3. Power Outage\n4. Health Clinic\n5. Primary School\n0. Back');
      } else if (val === '2') {
        setStep(10);
        setScreenText('TRACK TICKET:\nEnter your Ticket ID\n(e.g. KLA-102 or UG-902):');
      } else if (val === '3') {
        setStep(20);
        setScreenText('PARISH DEVELOPMENT MODEL (PDM):\nSelect Grievance Type:\n1. SACCO Fund Delayed\n2. Beneficiary Vetting Fraud\n3. Enterprise Inputs Substandard\n0. Back');
      } else if (val === '4') {
        setStep(30);
        setScreenText('COMMUNITY RATIFICATION:\nEnter Ticket ID to confirm work completed on-ground:');
      } else if (val === '5') {
        setStep(40);
        setScreenText('ANTI-CORRUPTION WHISTLEBLOWER:\nProtected under Whistleblower Act.\nDescribe extortion / bribery details:');
      } else if (val === '0') {
        setSession(false);
        setStep(0);
      } else {
        toast('Invalid option number', 'amber');
      }
    } else if (step === 2) {
      // Category selected
      const catMap: Record<string, string> = {
        '1': 'pothole',
        '2': 'water',
        '3': 'power',
        '4': 'health',
        '5': 'education'
      };
      const cat = catMap[val] || 'other';
      setUssdCategory(cat);
      setStep(3);
      setScreenText('ENTER YOUR LOCATION:\nType District & Parish name\n(e.g. Wakiso, Nansana West):');
    } else if (step === 3) {
      // Location entered
      setUssdParish(val);
      setStep(4);
      setScreenText('DESCRIBE THE PROBLEM:\nShort text (e.g. Deep crater near market entrance):');
    } else if (step === 4) {
      // Description entered -> Finalize report and create real post in the app!
      const finalDesc = val;
      setUssdDesc(finalDesc);
      const newId = 'USSD-' + Math.floor(1000 + Math.random() * 9000);
      setCreatedTicketId(newId);

      const countryDepts = allDepts(activeCountry);
      const targetDept =
        countryDepts.find((d) =>
          ussdCategory === 'water'
            ? d.id.includes('water') || d.id.includes('nwsc')
            : ussdCategory === 'power'
            ? d.id.includes('power') || d.id.includes('umeme') || d.id.includes('kplc')
            : d.lane === 'civic'
        )?.id || `${activeCountry.toLowerCase()}_gov`;

      const newPost: Post = {
        id: newId,
        country: activeCountry,
        dept: targetDept,
        lane: 'civic',
        territory: {
          district: `${countryInfo.name} District`,
          subcounty: 'Municipal Desk',
          parish: ussdParish || 'Ward Field Unit'
        },
        citizen_id: 'usr-ussd-anon',
        citizen_name: 'USSD Feature Phone Reporter',
        citizen_rank: 'Observer',
        anonymous: true,
        category: (ussdCategory as any) || 'pothole',
        title: `[USSD *3030#] ${ussdCategory.toUpperCase()} Report in ${ussdParish}`,
        body: finalDesc,
        location: ussdParish,
        source: 'ussd',
        media: [],
        status: 'pending',
        gov_status: 'pending',
        created_at: new Date().toISOString(),
        comments: [],
        upvotes: 1,
      };

      addPost(newPost);

      // Also notify backend telecom session endpoint
      fetch('/api/ussd/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'SES-' + Date.now(),
          phoneNumber: '+256778277900',
          serviceCode: '*3030#',
          text: `1*${ussdCategory}*${ussdParish}*${finalDesc}`,
        }),
      }).catch(() => {});

      // Add SMS Notification
      const newSms = {
        id: 'sms-' + Date.now(),
        sender: 'CIVICDUTY-UG',
        time: 'Just now',
        text: `REPORT CONFIRMED: #${newId} registered. Statutory 48h SLA response deadline is active. Dial *3030# > 2 to track status anytime.`,
        ticketId: newId
      };
      setSmsMessages(prev => [newSms, ...prev]);

      setStep(5);
      setScreenText(
        `[OK] SUCCESS! Report Registered.\nTicket ID: ${newId}\nResponsible: Parish Chief & Works Desk\nTarget SLA: 48 Hours\nConfirmation SMS sent to your phone.`
      );
      toast(`USSD Ticket #${newId} Registered and Published!`, 'emerald');
    } else if (step === 10) {
      // Ticket Tracking lookup
      const found = posts.find(p => p.id.toUpperCase().includes(val.toUpperCase()));
      if (found) {
        setStep(11);
        setScreenText(
          `STATUS FOR #${found.id}:\nTitle: ${found.title.slice(0, 30)}...\nStatus: ${found.status.toUpperCase()}\nResponses: ${(found.comments || []).length} official updates.\nPress 0 to exit.`
        );
      } else {
        setScreenText(`Ticket #${val} not found.\nCheck reference code and retry.\nPress 0 to exit.`);
        setStep(11);
      }
    } else if (step === 20) {
      // PDM Grievance
      const pId = 'PDM-' + Math.floor(1000 + Math.random() * 9000);
      setStep(21);
      setScreenText(`[OK] PDM Grievance #${pId} Logged.\nTransmitted to MoLG PDM Secretariat & District CAO.\nReference SMS sent.`);
      const newSms = {
        id: 'sms-' + Date.now(),
        sender: 'PDM-SECRETARIAT',
        time: 'Just now',
        text: `PDM Grievance #${pId} received. Routed to District Commercial Officer. Tracking active.`,
        ticketId: pId
      };
      setSmsMessages(prev => [newSms, ...prev]);
    } else if (step === 30) {
      // Ratification
      setStep(31);
      setScreenText(`[OK] Ratification Recorded for Ticket #${val}.\nSovereign crypto signature created.\nThank you for verifying your community!`);
    } else if (step === 40) {
      // Anti-corruption
      const cId = 'IGG-SEC-' + Math.floor(1000 + Math.random() * 9000);
      setStep(41);
      setScreenText(`[SEALED] Whistleblower Report #${cId} Sealed.\nEncrypted and transferred directly to Inspectorate of Government.\nIdentity strictly concealed.`);
    } else {
      setSession(false);
      setStep(0);
    }
    setInputVal('');
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-24 text-slate-950 dark:text-white">
      <div>
        <button
          onClick={() => go('feed')}
          className="flex items-center gap-1 text-xs mono font-black text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 mb-2 transition-colors"
        >
          <ChevronLeft size={14} /> Back to Dashboard
        </button>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-950 dark:text-white tracking-tight leading-tight flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono font-bold">
                {activeCountry}
              </span>
              <span>{countryInfo.name} USSD *3030# &amp; Offline SMS Gateway</span>
              <span className="text-[9px] mono font-black px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                ZERO-DATA
              </span>
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
              Inclusive access for citizens across all {Object.keys(COUNTRIES).length} global nations using standard GSM feature phones without internet.
            </p>
          </div>
          <select
            value={activeCountry}
            onChange={(e) => {
              const c = e.target.value as CountryCode;
              setSelectedCountry(c);
              setSession(false);
              setStep(0);
              toast(`Switched USSD Telecom Gateway to ${COUNTRIES[c]?.name || c}`, 'emerald');
            }}
            aria-label="Select Country for USSD Simulator"
            className="px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {Object.entries(COUNTRIES).map(([cCode, cInfo]) => (
              <option key={cCode} value={cCode}>
                [{cCode}] {cInfo.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Simulator Mode Tabs: Phone Handset vs SMS Inbox */}
      <div className="flex items-center gap-2 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveTab('USSD')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'USSD'
              ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-2xs'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          <Smartphone size={14} />
          <span>Interactive Feature Phone</span>
        </button>

        <button
          onClick={() => setActiveTab('SMS_INBOX')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'SMS_INBOX'
              ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-2xs'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          <MessageSquare size={14} />
          <span>SMS Gateway ({smsMessages.length})</span>
        </button>
      </div>

      {activeTab === 'USSD' ? (
        <div className="flex flex-col items-center">
          {/* Realistic Nokia/GSM Feature Phone Chassis */}
          <div className="w-full max-w-[340px] bg-slate-900 border-4 border-slate-700 rounded-[36px] p-4 shadow-2xl space-y-3.5 text-white">
            {/* Top Phone Speaker Grille */}
            <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto" />

            {/* GSM Status Bar */}
            <div className="flex items-center justify-between px-2 text-[9px] mono text-slate-400">
              <div className="flex items-center gap-1 font-bold">
                <Signal size={10} className="text-emerald-400" />
                <span>MTN / AIRTEL UG</span>
              </div>
              <div className="flex items-center gap-1 font-bold">
                <span>100%</span>
                <Battery size={11} className="text-emerald-400" />
              </div>
            </div>

            {/* LCD Screen Display */}
            <div className="bg-[#0f2d1e] border-2 border-emerald-800/80 rounded-2xl p-3 min-h-[160px] flex flex-col justify-between shadow-inner font-mono">
              {!session ? (
                <div className="py-5 text-center space-y-2">
                  <p className="text-[11px] font-bold text-emerald-300">CIVICDUTY UGANDA</p>
                  <p className="text-xs font-black text-emerald-400 tracking-wider">
                    {inputVal || 'Enter *3030#'}
                  </p>
                  <p className="text-[9px] text-emerald-500/80">Press DIAL to connect</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[11px] text-emerald-300 font-bold leading-relaxed whitespace-pre-wrap">
                    {screenText}
                  </div>
                  {step !== 5 && step !== 11 && step !== 21 && step !== 31 && step !== 41 && (
                    <div className="pt-2 border-t border-emerald-800/60 flex items-center gap-1 text-xs">
                      <span className="text-emerald-500 font-black">&gt;</span>
                      <span className="text-white font-black">{inputVal}</span>
                      <span className="w-1.5 h-3.5 bg-emerald-400 inline-block animate-pulse" />
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center text-[8.5px] text-emerald-500 font-bold pt-2 border-t border-emerald-900/60">
                <span>{session ? 'REPLY' : 'MENU'}</span>
                <span>{session ? 'CLEAR' : 'EXIT'}</span>
              </div>
            </div>

            {/* Action Call & End Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => {
                  if (!session) startDial(inputVal || '*3030#');
                  else handleSend();
                }}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs mono flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <PhoneCall size={12} />
                <span>{session ? 'SEND / OK' : 'DIAL *3030#'}</span>
              </button>

              <button
                onClick={() => {
                  setSession(false);
                  setStep(0);
                  setInputVal('');
                  setScreenText('');
                }}
                className="py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-black text-xs mono flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <span>END CALL</span>
              </button>
            </div>

            {/* Hardware Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { k: '1', sub: '' },
                { k: '2', sub: 'ABC' },
                { k: '3', sub: 'DEF' },
                { k: '4', sub: 'GHI' },
                { k: '5', sub: 'JKL' },
                { k: '6', sub: 'MNO' },
                { k: '7', sub: 'PQRS' },
                { k: '8', sub: 'TUV' },
                { k: '9', sub: 'WXYZ' },
                { k: '*', sub: '' },
                { k: '0', sub: '+' },
                { k: '#', sub: '' },
              ].map((key) => (
                <button
                  key={key.k}
                  onClick={() => handleKeypadPress(key.k)}
                  className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 flex flex-col items-center justify-center active:scale-95 transition-all shadow-2xs"
                >
                  <span className="text-sm font-black mono leading-none">{key.k}</span>
                  {key.sub && <span className="text-[7px] text-slate-400 font-bold leading-none mt-0.5">{key.sub}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* SMS Inbox View */
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Simulated SMS Gateway Notifications</span>
            </h4>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              Citizens receive automated SMS alerts for every ticket milestone, SLA deadline reminder, and resolution notice.
            </p>
          </div>

          <div className="space-y-2">
            {smsMessages.map((sms) => (
              <div
                key={sms.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between text-[10px] mono font-bold">
                  <span className="text-emerald-800 dark:text-emerald-400 font-black">{sms.sender}</span>
                  <span className="text-slate-500">{sms.time}</span>
                </div>
                <p className="text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-medium">
                  {sms.text}
                </p>
                {sms.ticketId && (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        const target = posts.find(p => p.id === sms.ticketId);
                        if (target) {
                          setActivePost(target);
                          go('post_detail');
                        } else {
                          toast(`Ticket #${sms.ticketId} located on national registry`, 'emerald');
                        }
                      }}
                      className="text-[10px] font-black mono text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>View Ticket Dossier</span>
                      <ExternalLink size={10} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
