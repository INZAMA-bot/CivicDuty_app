import React from 'react';
import { useApp } from '../context/AppContext';
import { COUNTRIES, allDepts } from '../data/countries';
import { getNationalRolloutArrangements } from '../data/tiers';
import { CountryCode } from '../types';
import {
  HardHat,
  Edit3,
  SlidersHorizontal,
  Users,
  ShieldCheck,
  Video,
  ArrowRight,
  Terminal,
  Lock,
  Eye,
} from 'lucide-react';

interface InteractiveRoleSandboxGridProps {
  countryCode?: CountryCode;
  onAfterSelect?: () => void;
}

export const InteractiveRoleSandboxGrid: React.FC<InteractiveRoleSandboxGridProps> = ({
  countryCode,
  onAfterSelect,
}) => {
  const {
    user,
    selectedCountry,
    projects,
    setActiveProject,
    ensureCitizenSession,
    go,
    toast,
    isEntityClaimed,
    claimEntity,
    setActiveDept,
    setActiveDeptCountry,
    setUser,
    showDemos,
  } = useApp();

  const activeCountry = (countryCode || user?.country || selectedCountry || 'UG') as CountryCode;
  const countryMeta = COUNTRIES[activeCountry] || {
    name: 'Uganda',
    code: 'UG',
    flag: 'UG',
  };
  const rolloutArrangement = getNationalRolloutArrangements(activeCountry);

  const finish = () => {
    if (onAfterSelect) onAfterSelect();
  };

  if (!showDemos) {
    return (
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Lock size={12} />
            <span>PRODUCTION LIVE CUTOVER · SANDBOX DEMOS DISABLED</span>
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            1-Click Role Simulations Turned OFF via CD-Ops Master Switch
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            All 6 live role simulations and demo auto-fillers are currently hidden for production citizen operations. Re-enable anytime from the CD-Ops Studio header.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            finish();
            go('company_management');
          }}
          className="px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 shrink-0 cursor-pointer"
        >
          Open CD-Ops Switch →
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#e3e6ea] dark:border-[#262b36]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Terminal size={12} />
            <span>INTERACTIVE SANDBOX · {countryMeta.name.toUpperCase()} ({activeCountry})</span>
          </span>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            1-Click Live Demo for Every Activity on CivicDuty
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 font-semibold">
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
            finish();
            go('project');
            toast(
              'Contract Supervision Demo opened: Test Contractor, Appointed Supervisor & Resident/Traveler roles!',
              'emerald'
            );
          }}
          className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-amber-500/60 flex flex-col justify-between gap-2 transition-colors cursor-pointer group text-left"
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
            finish();
            go('dept_wall');
            toast(
              'Claimed Desk Wall opened! Click "Edit Wall Details" to update business name, location & profile picture.',
              'emerald'
            );
          }}
          className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/60 flex flex-col justify-between gap-2 transition-colors cursor-pointer group text-left"
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
              dept_label:
                rolloutArrangement.superadminMinistry || `${countryMeta.name} Ministry of Local Government`,
              scope: activeCountry,
              scope_label: `${countryMeta.name} National Territorial Superadmin`,
              title:
                rolloutArrangement.superadminTitle ||
                `Permanent Secretary, Ministry of Local Government (${countryMeta.name})`,
              hierarchy_level: 'tier5_perm_sec',
              escalation_rank: 5,
              is_admin: true,
            });
            finish();
            go('gov_admin');
            toast(`${countryMeta.name} Adaptive National Superadmin mounted!`, 'emerald');
          }}
          className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/60 flex flex-col justify-between gap-2 transition-colors cursor-pointer group text-left"
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

        {/* Demo 4: Line Ministry Permanent Secretary & Cabinet Minister (Read-Only) */}
        <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-indigo-500/60 flex flex-col justify-between gap-2 transition-colors text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <Users size={13} /> Line Ministry PS &amp; Minister
              </span>
              <span className="text-[9.5px] font-mono text-slate-400">PFMA Dual-Mode</span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              PS Write Authority vs Minister Read-Only
            </div>
            <div className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-snug">
              Experience Line PS operational control or Cabinet Minister Read-Only Executive Oversight.
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
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
                  real_title_short: 'PS WORKS',
                  hierarchy_level: 'tier5_perm_sec',
                  escalation_rank: 5,
                  is_admin: true,
                });
                finish();
                go('gov_admin');
                toast(
                  `Mounted Line Ministry PS (${countryMeta.name} Works & Transport) — Full Operational Write & Commissioning!`,
                  'emerald'
                );
              }}
              className="px-2 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-mono font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span>Line PS (Write)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUser({
                  id: `minister-works-${activeCountry.toLowerCase()}`,
                  name: `Cabinet Minister — Works & Transport (${countryMeta.name})`,
                  country: activeCountry,
                  role: 'read_only',
                  role_label: 'Cabinet Minister (Read-Only Oversight)',
                  dept: 'unra',
                  dept_label: `${countryMeta.name} Ministry of Works & Transport`,
                  scope: activeCountry,
                  scope_label: `${countryMeta.name} Ministry of Works & Transport (MoWT)`,
                  title: `Cabinet Minister — ${countryMeta.name} Ministry of Works & Transport (Read-Only Executive Oversight)`,
                  real_title_short: 'MINISTER (RO)',
                  hierarchy_level: 'tier5_perm_sec',
                  escalation_rank: 5,
                  is_admin: false,
                });
                finish();
                go('ps_executive_desk');
                toast(
                  `Mounted Cabinet Minister (Read-Only Executive Oversight) for ${countryMeta.name} Works & Transport!`,
                  'amber'
                );
              }}
              className="px-2 py-1.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <Eye size={11} />
              <span>Minister (RO)</span>
            </button>
          </div>
        </div>

        {/* Demo 5: National ID / Passport & Foreigner Permit Verification */}
        <button
          type="button"
          onClick={() => {
            finish();
            go('ob1');
            toast(
              'Citizen & Foreign Resident Onboarding opened: Test National ID, Passport, Alien Card, Visa & Work Permit!',
              'emerald'
            );
          }}
          className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/60 flex flex-col justify-between gap-2 transition-colors cursor-pointer group text-left"
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
            finish();
            go('feed');
            toast(
              'Public Feed opened: Explore Live Video Baraza Town Halls, Multi-Media Replies & Citizen Direct Messages!',
              'emerald'
            );
          }}
          className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/60 flex flex-col justify-between gap-2 transition-colors cursor-pointer group text-left"
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
  );
};
