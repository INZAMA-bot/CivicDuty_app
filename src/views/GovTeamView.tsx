import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getDept, allDepts, makeCode, copyToClipboard } from '../utils/helpers';
import { COUNTRIES, TERRITORY } from '../data/countries';
import { roleTreeFor, scopeName, getQuickTitlePresets, tiersFor, primaryTier } from '../data/tiers';
import { RoleType } from '../types';
import { NoteBox } from '../components/NoteBox';
import { Copy, Upload } from 'lucide-react';

const STAND_DOWN_REASONS = [
  { id: 'transferred', label: 'Transferred' },
  { id: 'retired', label: 'Retired' },
  { id: 'dismissed', label: 'Dismissed' },
  { id: 'contract_ended', label: 'Contract ended' },
  { id: 'deceased', label: 'Deceased' },
  { id: 'other', label: 'Other' },
];

export const GovTeamView: React.FC = () => {
  const { user, teamMembers, invites, go, addInvite, standDownTeamMember, reinstateTeamMember, logAudit, toast } = useApp();

  const dists = user ? TERRITORY[user.country] || [] : [];
  const [district, setDistrict] = useState(() => {
    if (user?.scope && dists.some((d) => d.id === user.scope)) {
      return user.scope;
    }
    return dists[0]?.id || '';
  });

  const [inviteName, setInviteName] = useState('');
  const [inviteTitle, setInviteTitle] = useState('');
  const [inviteRole, setInviteRole] = useState<RoleType>('spokesperson');
  const [subcounty, setSubcounty] = useState('');
  const [parish, setParish] = useState('');
  const [isUtility, setIsUtility] = useState(false);
  const [issuedCode, setIssuedCode] = useState<string | null>(null);

  const [standDownTarget, setStandDownTarget] = useState<{ id: string; name: string; reason: string; note: string } | null>(null);

  if (!user || (!['node_admin', 'platform_admin'].includes(user.role) && !user.is_admin)) {
    go('gov_inbox');
    return null;
  }

  const d = getDept(user.country, user.dept || 'kcca');
  const myTeam = teamMembers.filter((m) => m.dept === user.dept && (!m.country || m.country === user.country));
  const openInv = invites.filter((i) => !i.used && i.dept === user.dept && (!i.country || i.country === user.country));

  const subs = district ? dists.find((x) => x.id === district)?.children || [] : [];
  const parishes = subcounty ? subs.find((x) => x.id === subcounty)?.children || [] : [];

  const assignableRoles: RoleType[] =
    user.role === 'platform_admin'
      ? ['platform_admin', 'node_admin', 'spokesperson', 'read_only']
      : ['node_admin', 'spokesperson', 'read_only'];

  const roleLabels: Record<RoleType, string> = {
    platform_admin: 'Platform Admin',
    node_admin: 'Node Admin',
    spokesperson: 'Spokesperson',
    read_only: 'Read-Only',
    citizen: 'Citizen',
  };

  const roleColors: Record<RoleType, string> = {
    platform_admin: '#f87171',
    node_admin: '#fbbf24',
    spokesperson: '#34d399',
    read_only: '#71717a',
    citizen: '#10b981',
  };

  const countryTiers = user ? tiersFor(user.country, user.scope) : [];
  const primaryT = user ? primaryTier(user.country, user.scope) : null;
  const quickPresets = user ? getQuickTitlePresets(user.country, user.scope) : [];
  const tierTitlesList = countryTiers.filter((t) => t.depth > 0).map((t) => t.title).join(', ');

  const handleIssueInvite = () => {
    if (!inviteName.trim()) {
      toast("Enter the officer's full name", 'red');
      return;
    }
    if (!inviteTitle.trim()) {
      toast('Enter their official title', 'red');
      return;
    }
    const scope = parish || subcounty || district;
    if (!scope) {
      toast('Select a district, division or parish', 'red');
      return;
    }

    const codePrefix = `${user.country.toUpperCase()}-${d.name.replace(/\s+/g, '').toUpperCase().slice(0, 4)}`;
    const code = makeCode(codePrefix);

    const newInvite = {
      code,
      name: inviteName.trim(),
      title: inviteTitle.trim(),
      role: inviteRole,
      scope,
      dept: user.dept || (allDepts(user.country)[0]?.id || 'kplc'),
      is_utility: isUtility,
      used: false,
      country: user.country,
    };

    addInvite(newInvite);
    logAudit('invite_member', '—', `${inviteName.trim()} — ${inviteTitle.trim()} (${roleLabels[inviteRole]}, ${scopeName(user.country, scope)})`);

    setIssuedCode(code);
    setInviteName('');
    setInviteTitle('');
    toast('Access code issued', 'emerald');
  };

  const handleConfirmStandDown = () => {
    if (!standDownTarget) return;
    standDownTeamMember(standDownTarget.id, standDownTarget.reason, standDownTarget.note);
    setStandDownTarget(null);
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-12">
      <div>
        <div className="tagline mb-1.5 text-amber-700 dark:text-amber-400 font-bold">
          Team Management
        </div>
        <h2 className="text-[21px] font-black text-slate-900 dark:text-amber-300 tracking-tight leading-tight">
          {d.name} · Your Desk
        </h2>
        <p className="text-[11px] mono text-slate-600 dark:text-slate-400 mt-1.5">
          {roleLabels[user.role]} · Manage spokespersons under your node
        </p>
      </div>

      {/* Official Mandate Banner */}
      <div className="card-gov p-4 bg-amber-50 dark:bg-amber-500/5 border border-amber-300 dark:border-amber-500/30 space-y-2 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs mono uppercase tracking-wider">
            <span>Official Node Invitation Authority</span>
          </div>
          <span className="text-[8.5px] mono text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-500/40 font-bold">
            {user.role === 'platform_admin' ? 'L1 National Admin' : 'L2 Node Admin'}
          </span>
        </div>
        <p className="text-[11px] text-slate-700 dark:text-zinc-300 leading-relaxed">
          Logged in as <strong className="text-amber-900 dark:text-amber-300 font-black">{user.real_title_short || 'Node Executive'}</strong> ({d.name}). Under official public service regulations, you hold the authority to issue single-use government access codes to officers accountable under your node hierarchy ({tierTitlesList || 'Local Officers & Department Heads'}).
        </p>
      </div>

      {/* Country Role Tree */}
      <div className="card p-4 space-y-3">
        <p className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-bold">
          {COUNTRIES[user.country]?.name} Role Tree
        </p>
        {roleTreeFor(user.country, user.scope).map((r, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-[8.5px] mono text-slate-400 dark:text-zinc-500 w-6 flex-shrink-0 mt-0.5 font-bold">{r.level}</span>
            <div className="flex-1">
              <div className="text-[10.5px] mono font-bold text-slate-900 dark:text-zinc-200">{r.title}</div>
              <div className="text-[8.5px] mono text-slate-600 dark:text-zinc-400 mt-0.5">
                {r.role} · {r.scope}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Onboarding & Automated Jurisdiction Tree Minting */}
      <div className="card p-4 space-y-3 bg-amber-50/50 dark:bg-gradient-to-br dark:from-amber-500/10 dark:via-zinc-900 dark:to-zinc-950 border border-amber-300 dark:border-amber-500/30">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[8.5px] mono text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-500/40 uppercase font-bold tracking-wider">
              Subscription Auto-Activation
            </span>
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-amber-200 mt-1.5">
              Automated Node Access Code Engine
            </h3>
            <p className="text-[10.5px] text-slate-600 dark:text-zinc-400 mt-0.5">
              1-Click auto-generate access codes for all administrative units in {scopeName(user.country, user.scope || user.country)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              const currentScope = user.scope || district || user.country;
              const targetSubUnits = subs.length > 0 ? subs : dists;
              if (targetSubUnits.length === 0) {
                toast('No sub-units found for current jurisdiction', 'red');
                return;
              }
              const codePrefix = `${user.country.toUpperCase()}-${d.name.replace(/\s+/g, '').toUpperCase().slice(0, 4)}`;
              let count = 0;
              const subTierTitle = countryTiers.find((t) => t.depth === 2)?.title || countryTiers[1]?.title || 'Sub-Unit Executive';
              const primaryTierTitle = primaryT?.title || 'Local Desk Owner';

              targetSubUnits.forEach((sub) => {
                const scCode = makeCode(codePrefix);
                addInvite({
                  code: scCode,
                  name: `Unassigned (${sub.name} Desk)`,
                  title: `${subTierTitle} (${sub.name})`,
                  role: 'node_admin',
                  scope: sub.id,
                  dept: user.dept || (allDepts(user.country)[0]?.id || 'kplc'),
                  is_utility: false,
                  used: false,
                  country: user.country,
                });
                count++;

                if (sub.children && sub.children.length > 0) {
                  sub.children.forEach((p: any) => {
                    const pCode = makeCode(codePrefix);
                    addInvite({
                      code: pCode,
                      name: `Unassigned (${p.name} Desk)`,
                      title: `${primaryTierTitle} (${p.name})`,
                      role: 'spokesperson',
                      scope: p.id,
                      dept: user.dept || (allDepts(user.country)[0]?.id || 'kplc'),
                      is_utility: false,
                      used: false,
                      country: user.country,
                    });
                    count++;
                  });
                }
              });

              logAudit(
                'bulk_invite',
                '—',
                `Automated node tree generation: ${count} official access codes minted for ${scopeName(user.country, currentScope)}`
              );
              toast(`⚡ Auto-minted ${count} access codes for full jurisdiction tree`, 'emerald');
            }}
            className="bg-amber-500 hover:bg-amber-400 text-black font-black py-2.5 px-3 rounded-xl text-[10px] uppercase tracking-wider mono transition-all active:scale-[.98] text-left flex items-center justify-between shadow-sm"
          >
            <span>⚡ Auto-Mint Entire Node</span>
            <span className="text-[12px]">→</span>
          </button>

          <button
            onClick={() => go('gov_bulk')}
            className="bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-300 font-bold py-2.5 px-3 rounded-xl text-[10px] uppercase tracking-wider mono transition-all border border-slate-300 dark:border-zinc-700 flex items-center justify-between shadow-sm"
          >
            <span>📄 Upload CSV List</span>
            <Upload size={13} className="text-slate-500 dark:text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Invite Officer Form */}
      <div className="card-gov p-4 space-y-3" style={{ borderRadius: '16px' }}>
        <div className="flex items-center justify-between">
          <p className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-bold">Invite Officer / Issue Code</p>
          <span className="text-[8.5px] mono text-amber-700 dark:text-amber-400 font-bold">1 Code = 1 Desk</span>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between">
            <p className="text-[8.5px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-bold">
              Quick Title Presets ({COUNTRIES[user.country]?.name || user.country})
            </p>
            <span className="text-[8.5px] mono text-amber-700 dark:text-amber-400 font-bold">
              {COUNTRIES[user.country]?.flag} {COUNTRIES[user.country]?.name} Role Tree
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {quickPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setInviteTitle(preset.title);
                  setInviteRole(preset.role);
                  setIsUtility(preset.isUtility);
                  toast(`Preset loaded: ${preset.title}`, 'emerald');
                }}
                className="py-1.5 px-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-amber-500/60 hover:bg-amber-50/50 dark:hover:bg-zinc-800/80 rounded-lg text-[8.5px] mono font-bold text-slate-800 dark:text-zinc-300 text-left transition-all flex flex-col justify-between group shadow-sm"
              >
                <span className="text-amber-800 dark:text-amber-400 group-hover:text-amber-900 dark:group-hover:text-amber-300 truncate font-bold">
                  {preset.label}
                </span>
                {preset.desc && (
                  <span className="text-[7.5px] text-slate-500 dark:text-zinc-400 group-hover:text-slate-600 dark:group-hover:text-zinc-300 font-normal truncate mt-0.5">
                    {preset.desc}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          value={inviteName}
          onChange={(e) => setInviteName(e.target.value)}
          placeholder="Full name of officer (e.g. John Mukasa)"
          className="text-sm"
        />
        <input
          type="text"
          value={inviteTitle}
          onChange={(e) => setInviteTitle(e.target.value)}
          placeholder={`Official title e.g. ${primaryT?.title || 'Ward Administrator'}, ${scopeName(user.country, user.scope || user.country)}`}
          className="text-sm"
        />

        <div className="space-y-2">
          <label className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest block font-bold">Platform Role</label>
          <div className="grid grid-cols-2 gap-2">
            {assignableRoles.map((r) => (
              <button
                key={r}
                onClick={() => setInviteRole(r)}
                className={`py-2.5 rounded-xl text-[9.5px] mono font-bold border transition-all ${
                  inviteRole === r
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/15 text-amber-900 dark:text-amber-300 shadow-sm'
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                {roleLabels[r]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest block font-bold">Geographic Scope</label>
          <select
            className="mono text-sm"
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setSubcounty('');
              setParish('');
            }}
          >
            <option value="">District…</option>
            {dists.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
          <select
            className="mono text-sm"
            disabled={!district}
            value={subcounty}
            style={{ opacity: district ? 1 : 0.4 }}
            onChange={(e) => {
              setSubcounty(e.target.value);
              setParish('');
            }}
          >
            <option value="">SubCounty / Division…</option>
            {subs.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
          <select
            className="mono text-sm"
            disabled={!subcounty}
            value={parish}
            style={{ opacity: subcounty ? 1 : 0.4 }}
            onChange={(e) => setParish(e.target.value)}
          >
            <option value="">Parish / Ward…</option>
            {parishes.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
          <p className="text-[8.5px] mono text-slate-500 dark:text-zinc-400 leading-relaxed">
            The deepest level you pick becomes their desk. A {primaryT?.title || 'Local Officer'} sees that {primaryT?.unit || 'ward'} only.
          </p>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isUtility}
            onChange={(e) => setIsUtility(e.target.checked)}
            className="rounded"
          />
          <span className="text-[10px] mono text-slate-600 dark:text-zinc-400">
            Utility desk ({user.country === 'KE' ? 'Kenya Power Lead, Nairobi Water Station Mgr' : user.country === 'NG' ? 'LAWMA Lead, DisCo Area Mgr' : user.country === 'RW' ? 'REG Branch Mgr, WASAC Area Eng' : 'Area Engineer, Utility Branch Manager'})
          </span>
        </label>

        {issuedCode && (
          <div className="bg-slate-50 dark:bg-zinc-950/90 border border-amber-300 dark:border-amber-500/30 rounded-xl p-3.5 space-y-2.5 a-fade">
            <div className="flex items-center justify-between border-b border-amber-200 dark:border-amber-500/20 pb-2">
              <span className="text-[9px] mono text-amber-800 dark:text-amber-400 font-bold uppercase tracking-widest">
                Official Access Code Minted
              </span>
              <span className="text-[8.5px] mono text-emerald-700 dark:text-emerald-400 font-bold">Ready for Dispatch</span>
            </div>
            
            <button
              onClick={() => copyToClipboard(issuedCode, 'Access code', (msg) => toast(msg))}
              className="flex items-center justify-between w-full bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/40 rounded-lg px-3.5 py-2.5 hover:bg-amber-200/70 dark:hover:bg-amber-500/20 transition-colors"
            >
              <span className="text-base mono font-black text-amber-900 dark:text-amber-300 tracking-widest">{issuedCode}</span>
              <span className="text-[9px] mono text-amber-800 dark:text-amber-400 flex items-center gap-1 font-bold">
                <Copy size={13} /> Copy Code
              </span>
            </button>

            <button
              onClick={() => {
                const text = `🏛️ CIVICDUTY OFFICIAL ACCESS CODE\n----------------------------------\nDesk: ${d.name}\nScope: ${scopeName(user.country, parish || subcounty || district)}\nAccess Code: ${issuedCode}\n\nInstructions:\n1. Open Government Desk\n2. Enter code: ${issuedCode}\n3. Enter your official email to mount desk.`;
                copyToClipboard(text, 'Official Dispatch Invite', (msg) => toast(msg));
              }}
              className="w-full bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 text-[9.5px] mono font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span>📋 Copy Full Dispatch Message (SMS / WhatsApp)</span>
            </button>

            <p className="text-[8.5px] mono text-slate-600 dark:text-zinc-400 leading-relaxed">
              Send code via official SMS or WhatsApp. The officer enters it on the Government Desk screen to mount their desk.
            </p>
          </div>
        )}

        <button
          onClick={handleIssueInvite}
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl py-3 text-xs uppercase tracking-widest mono transition-all active:scale-[.98] shadow-sm"
        >
          Generate Access Code
        </button>
      </div>

      {/* Pending Invites List */}
      {openInv.length > 0 && (
        <div>
          <p className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest mb-2.5 font-bold">
            Awaiting Redemption ({openInv.length})
          </p>
          <div className="space-y-2">
            {openInv.map((c) => (
              <div key={c.code} className="team-card flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-sm">
                <div className="min-w-0">
                  <div className="text-[12px] mono font-bold text-amber-800 dark:text-amber-300 tracking-wider">{c.code}</div>
                  <div className="text-[9.5px] mono text-slate-700 dark:text-zinc-300 mt-0.5 truncate font-medium">
                    {c.name} · {c.title}
                  </div>
                  <div className="path-crumb mt-0.5 text-slate-500 dark:text-zinc-400">{scopeName(user.country, c.scope)}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(c.code, 'Access code', (msg) => toast(msg))}
                  className="text-slate-500 hover:text-amber-600 dark:text-zinc-500 dark:hover:text-amber-400 flex-shrink-0 transition-colors p-1"
                >
                  <Copy size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stand-down Modal Panel */}
      {standDownTarget && (
        <div className="card p-4 space-y-3 border-l-4 border-l-rose-500">
          <div>
            <p className="text-[9px] mono text-rose-600 dark:text-rose-400 uppercase tracking-widest font-bold">Stand down a desk</p>
            <p className="text-[13px] font-bold text-slate-900 dark:text-zinc-200 mt-1">{standDownTarget.name}</p>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest block font-bold">Reason — required</label>
            <div className="grid grid-cols-2 gap-2">
              {STAND_DOWN_REASONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setStandDownTarget({ ...standDownTarget, reason: r.id })}
                  className={`py-2.5 rounded-xl text-[9.5px] mono font-bold border transition-all ${
                    standDownTarget.reason === r.id
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/15 text-amber-900 dark:text-amber-300 shadow-sm'
                      : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            value={standDownTarget.note}
            onChange={(e) => setStandDownTarget({ ...standDownTarget, note: e.target.value })}
            placeholder={`Note (optional) — e.g. transferred to ${scopeName(user.country, user.scope || user.country)}`}
            className="text-sm"
          />
          <p className="text-[8.5px] mono text-slate-600 dark:text-zinc-400 leading-relaxed">
            Access is withdrawn immediately. Their name stays on every reply and audit entry they wrote. Any open tickets pass to you until a replacement is appointed.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setStandDownTarget(null)}
              className="flex-1 border border-slate-300 dark:border-zinc-800 bg-white dark:bg-transparent text-slate-700 dark:text-zinc-400 rounded-xl py-2.5 text-[10px] uppercase tracking-widest mono hover:border-slate-400 dark:hover:border-zinc-700 transition-all font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmStandDown}
              className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl py-2.5 text-[10px] uppercase tracking-widest mono transition-all shadow-sm"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Active Team Roster */}
      <div>
        <p className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest mb-2.5 font-bold">
          Current Team ({myTeam.length})
        </p>
        <div className="space-y-2.5">
          {myTeam.map((m) => (
            <div key={m.id} className="team-card p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-slate-900 dark:text-zinc-100">{m.name}</div>
                  <div className="text-[10px] mono text-slate-600 dark:text-zinc-400 mt-0.5 font-medium">{m.title}</div>
                  <div className="text-[8.5px] mono text-slate-500 dark:text-zinc-400 mt-1">Scope: {m.scope}</div>
                  <div className="text-[8.5px] mono text-slate-500 dark:text-zinc-400">{m.email}</div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className={`chip ${m.active ? 'ch-resolved' : 'ch-overdue'}`}>
                    {m.active ? 'Active' : 'Stood down'}
                  </span>
                  <span className="text-[8.5px] mono font-bold" style={{ color: roleColors[m.role] }}>
                    {roleLabels[m.role]}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-100 dark:border-zinc-800">
                <span className="text-[8.5px] mono text-slate-500 dark:text-zinc-400">
                  {m.active
                    ? `Joined ${m.joined}`
                    : `${(STAND_DOWN_REASONS.find((r) => r.id === m.reason) || {}).label || 'Stood down'}${
                        m.note ? ` · ${m.note}` : ''
                      }`}
                </span>
                <button
                  onClick={() =>
                    m.active
                      ? setStandDownTarget({ id: m.id, name: m.name, reason: 'transferred', note: '' })
                      : reinstateTeamMember(m.id)
                  }
                  className={`text-[8.5px] mono font-bold transition-colors ${
                    m.active ? 'text-rose-600 hover:text-rose-700 dark:text-rose-400' : 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {m.active ? 'Stand down' : 'Reinstate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NoteBox
        tone="emerald"
        title="Revoke, not delete"
        text="Deactivating cuts access immediately while keeping historical replies and audit logs intact. Deleting the row would orphan that history, which is the opposite of what an audit trail is for."
      />
    </div>
  );
};
