import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  ShieldCheck,
  Landmark,
  Building2,
  Check,
  Layers,
  HardHat,
  Edit3,
  SlidersHorizontal,
  Users,
  Video,
} from 'lucide-react';
import { COUNTRIES, allDepts } from '../data/countries';
import { getNationalRolloutArrangements } from '../data/tiers';
import { TrafficLightLogo } from '../components/TrafficLightLogo';
import { HeaderSettingsMenu } from '../components/HeaderSettingsMenu';
import { InstallPwaBanner } from '../components/InstallPwaBanner';
import { Footer } from '../components/Footer';

export const SplashView: React.FC = () => {
  const {
    go,
    posts,
    projects,
    selectedCountry,
    ensureCitizenSession,
    setUser,
    setActiveProject,
    setActiveDept,
    setActiveDeptCountry,
    claimEntity,
    isEntityClaimed,
    toast,
    t,
  } = useApp();

  const activeCountry = selectedCountry || 'UG';
  const countryMeta = COUNTRIES[activeCountry] || COUNTRIES.UG;
  const rolloutArrangement = getNationalRolloutArrangements(activeCountry);

  const total = posts.length;
  const resolved = posts.filter((p) => p.status === 'resolved').length;
  const corrupt = posts.filter((p) => p.category === 'corruption').length;
  const countriesCount = Object.keys(COUNTRIES).length;

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-slate-100 transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Simple Top Bar — No Header Logo, Only Status Label & Settings Dropdown */}
      <header className="w-full h-12 px-3.5 sm:px-6 border-b border-[#e3e6ea] dark:border-[#262b36] bg-white/95 dark:bg-[#161a22]/95 backdrop-blur-md flex items-center justify-between gap-2 sticky top-0 z-30">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 truncate">
            Sovereign Civic Accountability
          </span>
        </div>

        {/* Right: Compiled Gear / 3-Dots Dropdown Menu (Country, Language, Theme, Docs) */}
        <div className="flex items-center gap-2 shrink-0">
          <HeaderSettingsMenu isSplash />
        </div>
      </header>

      {/* PWA Mobile Install Banner */}
      <InstallPwaBanner />

      {/* Main Mobile-First Homepage Body — Single Unified Hero Logo & Clean Thumb-Zone Layout */}
      <main className="flex-1 w-full max-w-xl lg:max-w-4xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-7 pb-4 flex flex-col gap-4">
        {/* Single Hero Identity Card (Only ONE Logo on the Homepage) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col items-center text-center space-y-3">
          <div className="px-4 py-2 rounded-2xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] inline-flex items-center justify-center">
            <TrafficLightLogo size="md" />
          </div>

          <div className="space-y-1.5 w-full">
            <h1 className="newspaper-masthead text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 leading-none">
              CIVICDUTY
            </h1>

            {/* Speak · Serve · Be Heard — Strictly on the SAME LINE */}
            <div className="text-[11px] sm:text-xs font-mono uppercase flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap pt-0.5">
              <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shrink-0" />
                <span>Speak</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block shrink-0" />
                <span>Serve</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center shrink-0">
                  <Check size={8} strokeWidth={2.75} />
                </span>
                <span>Be Heard</span>
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
            {t('charterText')}
          </p>
        </div>

        {/* Workspace Portal Selection Card — Mobile-First Uncrowded Layout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
              SELECT WORKSPACE PORTAL
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
              Mobile-First PWA
            </span>
          </div>

          {/* 1. CITIZEN PORTAL (Primary Full-Width Action) */}
          <button
            onClick={() => {
              ensureCitizenSession();
              go('ob1');
            }}
            className="w-full min-h-[58px] group p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white border border-emerald-500/30 flex items-center justify-between gap-3 cursor-pointer transition-all text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-black/15 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} strokeWidth={1.75} className="text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold tracking-tight block text-white leading-tight">
                  {t('citizenPortal')}
                </span>
                <span className="text-[11px] text-emerald-50 block leading-snug mt-0.5">
                  Report issues, track SLAs &amp; verify public proof
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-black/15 group-hover:bg-black/25 px-3 py-2 rounded-lg text-white font-mono font-semibold text-xs transition-colors shrink-0">
              <span>{t('enter')}</span>
              <ArrowRight size={13} strokeWidth={1.75} />
            </div>
          </button>

          {/* 2 & 3. GOVERNMENT DESK & PROVIDER DESK */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => go('ob2')}
              className="min-h-[84px] p-3 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 dark:hover:border-slate-600 active:scale-[0.99] text-left flex flex-col justify-between gap-2 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <Landmark size={15} strokeWidth={1.75} />
                </div>
                <ArrowRight size={13} strokeWidth={1.75} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div>
                <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 leading-tight">
                  {t('govDesk')}
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Ministries &amp; Districts
                </div>
              </div>
            </button>

            <button
              onClick={() => go('entity')}
              className="min-h-[84px] p-3 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 dark:hover:border-slate-600 active:scale-[0.99] text-left flex flex-col justify-between gap-2 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <Building2 size={15} strokeWidth={1.75} />
                </div>
                <ArrowRight size={13} strokeWidth={1.75} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div>
                <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 leading-tight">
                  {t('entityHub')}
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Utilities, Banks &amp; Care
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Interactive Live Demos — Every CivicDuty Activity */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400 block">
                INTERACTIVE SANDBOX · {countryMeta.name.toUpperCase()} ({activeCountry})
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                1-Click Live Demo for Every Activity on CivicDuty
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              6 Live Role Simulations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-left">
            {/* Demo 1: Contractors & Contract Supervision */}
            <button
              type="button"
              onClick={() => {
                const countryProjects = projects.filter((p) => !p.country || p.country === activeCountry);
                const targetProj = countryProjects[0] || projects[0];
                if (targetProj) setActiveProject(targetProj);
                ensureCitizenSession();
                go('project');
                toast('Contract Supervision Demo opened: Test Contractor, Appointed Supervisor & Resident/Traveler roles!', 'emerald');
              }}
              className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-amber-500/60 flex flex-col justify-between gap-2 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <HardHat size={13} /> Contractors &amp; Supervision
                </span>
                <ArrowRight size={12} className="text-slate-400 group-hover:text-amber-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Contractor, Supervisor &amp; Traveler Audit
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Dual-signed BOQ milestones, Appointed Engineer audit &amp; Resident/Traveler on-site inspection.
                </div>
              </div>
            </button>

            {/* Demo 2: Claimed Desk & Wall Profile Editor */}
            <button
              type="button"
              onClick={() => {
                const depts = allDepts(activeCountry);
                const consumerDept = depts.find((d) => d.lane === 'consumer') || depts[0];
                const targetId = consumerDept?.id || 'kcca';
                if (!isEntityClaimed(targetId) && consumerDept) {
                  claimEntity({
                    deptId: targetId,
                    country: activeCountry,
                    businessName: consumerDept.name,
                    representativeName: 'Sarah Namukasa (Managing Director)',
                    officialEmail: `care@${targetId}.org`,
                    phone: '+256 700 112 233',
                    role: 'Head of Customer Care & Operations',
                    plan: 'district',
                    monthlyFee: 89,
                    customLocation: `Plot 18 Central Avenue, ${countryMeta.name} HQ`,
                    customDescription: consumerDept.full,
                  });
                }
                setActiveDept(targetId);
                setActiveDeptCountry(activeCountry);
                ensureCitizenSession();
                go('dept_wall');
                toast('Claimed Desk Wall opened! Click "Edit Wall Details" to update business name, location & profile picture.', 'emerald');
              }}
              className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/60 flex flex-col justify-between gap-2 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Edit3 size={13} /> Claimed Desk Wall Editor
                </span>
                <ArrowRight size={12} className="text-slate-400 group-hover:text-emerald-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Edit Wall Location, Name &amp; Avatar
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Claim a business/entity desk and customize its wall profile picture, GPS location, bio &amp; hotlines.
                </div>
              </div>
            </button>

            {/* Demo 3: Country Adaptive Superadmin (100+ Countries) */}
            <button
              type="button"
              onClick={() => {
                setUser({
                  id: `superadmin-${activeCountry.toLowerCase()}`,
                  name: rolloutArrangement.superadminSubtitle || `${countryMeta.name} National Superadmin`,
                  country: activeCountry,
                  role: 'platform_admin',
                  dept: 'molg',
                  dept_label: rolloutArrangement.superadminMinistry || `${countryMeta.name} Ministry of Local Government`,
                  scope: activeCountry,
                  scope_label: `${countryMeta.name} National Territorial Superadmin`,
                  title: rolloutArrangement.superadminTitle || `Permanent Secretary, Ministry of Local Government (${countryMeta.name})`,
                  hierarchy_level: 'tier5_perm_sec',
                  escalation_rank: 5,
                  is_admin: true,
                });
                go('gov_admin');
                toast(`${countryMeta.name} Adaptive National Superadmin mounted!`, 'emerald');
              }}
              className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/60 flex flex-col justify-between gap-2 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <SlidersHorizontal size={13} /> {countryMeta.name} Superadmin
                </span>
                <ArrowRight size={12} className="text-slate-400 group-hover:text-emerald-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  100+ Country Adaptive Admin Engine
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Auto-adapts to {countryMeta.name}&apos;s unique governance hierarchy, regions, and territorial nodes.
                </div>
              </div>
            </button>

            {/* Demo 4: Line Ministry Permanent Secretary (Strict Jurisdiction + Invite Minister) */}
            <button
              type="button"
              onClick={() => {
                setUser({
                  id: `ps-works-${activeCountry.toLowerCase()}`,
                  name: `Permanent Secretary — Works & Transport (${countryMeta.name})`,
                  country: activeCountry,
                  role: 'node_admin',
                  dept: 'unra',
                  dept_label: `${countryMeta.name} Ministry of Works & Transport`,
                  scope: activeCountry,
                  scope_label: `${countryMeta.name} Ministry of Works & Transport (MoWT)`,
                  title: `Permanent Secretary, Ministry of Works & Transport`,
                  hierarchy_level: 'tier5_perm_sec',
                  escalation_rank: 5,
                  is_admin: true,
                });
                go('gov_admin');
                toast(`Mounted Line Ministry PS (${countryMeta.name} Works & Transport) — strictly scoped Admin, Team & Apex!`, 'emerald');
              }}
              className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-indigo-500/60 flex flex-col justify-between gap-2 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Users size={13} /> Line Ministry PS &amp; Apex
                </span>
                <ArrowRight size={12} className="text-slate-400 group-hover:text-indigo-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Ministry Admin, Team &amp; Invite Minister
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Strictly limited to your Ministry: invite your Cabinet Minister, State Ministers &amp; review Apex.
                </div>
              </div>
            </button>

            {/* Demo 5: National ID / Passport & Foreigner Permit Verification */}
            <button
              type="button"
              onClick={() => {
                go('ob1');
                toast('Citizen & Foreign Resident Onboarding opened: Test National ID, Passport, Alien Card, Visa & Work Permit!', 'emerald');
              }}
              className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/60 flex flex-col justify-between gap-2 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={13} /> ID &amp; Foreign Permit Gate
                </span>
                <ArrowRight size={12} className="text-slate-400 group-hover:text-emerald-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  National ID, Passport &amp; Foreigner Visas
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  3-layer cryptographic ID verification + Alien Card, Work Permit, Green Card &amp; Student Visa extension.
                </div>
              </div>
            </button>

            {/* Demo 6: Live Video Baraza, Multi-Media Speak & Perks */}
            <button
              type="button"
              onClick={() => {
                ensureCitizenSession();
                go('feed');
                toast('Public Feed opened: Explore Live Video Baraza Town Halls, Multi-Media Replies & Citizen Direct Messages!', 'emerald');
              }}
              className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/60 flex flex-col justify-between gap-2 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Video size={13} /> Live Baraza &amp; Multi-Media
                </span>
                <ArrowRight size={12} className="text-slate-400 group-hover:text-emerald-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Live Video Baraza, DMs &amp; Boda Perks
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Join live video town halls, attach photos/video/voice/GPS in comments &amp; DMs, and claim perks.
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Live Telemetry & 5-Stage Pipeline Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-4">
          {/* National Ledger Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-3">
              <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 leading-none">{total}</div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1.5">{t('reports')}</div>
            </div>
            <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-3">
              <div className="text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 leading-none">{resolved}</div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1.5">{t('resolved')}</div>
            </div>
            <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-3">
              <div className="text-lg font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 leading-none">{corrupt}</div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1.5">{t('corruption')}</div>
            </div>
            <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-3">
              <div className="text-lg font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400 leading-none">{countriesCount}</div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1.5">{t('nations')}</div>
            </div>
          </div>

          {/* 5-Stage Sovereign Civic Loop Pipeline */}
          <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold">
                <Layers size={12} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                <span>5-Stage Statutory Pipeline</span>
              </span>
              <span>SHA-256 Ledger</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5 pt-1">
              {[t('loopSpeaks'), t('loopServes'), t('loopProof'), t('loopHeard'), t('loopResolved')].map((s, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg border text-[10px] font-mono leading-snug flex sm:flex-col items-center sm:items-start gap-2 sm:gap-1 ${
                    i === 4
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="w-4 h-4 rounded bg-[#f1f3f4] dark:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-[9px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Clean Footer without Logo Icon */}
      <Footer isSplash />
    </div>
  );
};


