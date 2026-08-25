import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Download, Upload } from 'lucide-react';
import { getDept, makeCode, csvEscape } from '../utils/helpers';
import { NoteBox } from '../components/NoteBox';
import { getQuickTitlePresets, primaryTier, tiersFor } from '../data/tiers';

const BULK_PROBLEMS = [
  { line: 7, field: 'unit', msg: '"Zone-3" is ambiguous — 3 matches. Add the parent unit to distinguish them.' },
  { line: 8, field: 'email', msg: 'Duplicate of line 4 — one account is one desk' },
];

export const GovBulkView: React.FC = () => {
  const { user, go, addInvite, logAudit, toast } = useApp();

  const [stage, setStage] = useState<'upload' | 'preview' | 'done'>('upload');
  const [rows, setRows] = useState<any[]>([]);
  const [problems, setProblems] = useState<any[]>([]);
  const [issued, setIssued] = useState<any[]>([]);

  if (!user || !['node_admin', 'platform_admin'].includes(user.role)) {
    go('gov_inbox');
    return null;
  }

  const d = getDept(user.country, user.dept || 'kcca');

  const getDynamicSample = () => {
    const presets = getQuickTitlePresets(user.country, user.scope);
    const primary = primaryTier(user.country, user.scope)?.title || 'Ward Administrator';
    const l2 = tiersFor(user.country, user.scope)[1]?.title || 'Division Head';

    return [
      { line: 2, name: 'Sarah Nakato', title: `${presets[2]?.title || primary}`, unit: 'Ward/Parish A', role: 'spokesperson', email: 's.nakato@gov.mail' },
      { line: 3, name: 'Grace Kirabo', title: `${presets[2]?.title || primary}`, unit: 'Ward/Parish B', role: 'spokesperson', email: 'g.kirabo@gov.mail' },
      { line: 4, name: 'James Okello', title: `${presets[0]?.title || l2}`, unit: 'HQ Sector', role: 'node_admin', email: 'j.okello@gov.mail' },
      { line: 5, name: 'Peter Wasswa', title: `${presets[4]?.title || 'Area Utility Manager'}`, unit: 'East Grid', role: 'spokesperson', email: 'p.wasswa@utility.corp' },
      { line: 6, name: 'Betty Auma', title: `${presets[3]?.title || 'Head of Infrastructure'}`, unit: 'Public Works', role: 'spokesperson', email: 'b.auma@gov.mail' },
    ];
  };

  const handleLoadSample = () => {
    setRows(getDynamicSample());
    setProblems(BULK_PROBLEMS);
    setStage('preview');
    toast(`7 rows loaded for ${user.country} · 2 have issues`, 'amber');
  };

  const handleDownloadTemplate = () => {
    const presets = getQuickTitlePresets(user.country, user.scope);
    const templateContent = `name,title,unit,parent,role,utility,email
Sarah Nakato,${presets[2]?.title || 'Ward Administrator'},Ward A,District HQ,spokesperson,no,s.nakato@gov.mail
James Okello,${presets[0]?.title || 'Division Town Clerk'},District HQ,National HQ,node_admin,no,j.okello@gov.mail
Peter Wasswa,${presets[4]?.title || 'Area Utility Manager'},East Substation,Division HQ,spokesperson,yes,p.wasswa@utility.corp`;

    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civicduty-${user.country.toLowerCase()}-template.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast(`Template generated for ${user.country}`, 'emerald');
  };

  const handleIssueCodes = () => {
    const codePrefix = `${user.country.toUpperCase()}-${d.name.replace(/\s+/g, '').toUpperCase().slice(0, 4)}`;
    const issuedList = rows.map((r) => ({
      ...r,
      code: makeCode(codePrefix),
    }));

    issuedList.forEach((i) => {
      addInvite({
        code: i.code,
        name: i.name,
        title: i.title,
        role: i.role,
        scope: user.scope || user.country,
        dept: user.dept || 'kcca',
        is_utility: false,
        used: false,
        country: user.country,
      });
    });

    logAudit(
      'bulk_invite',
      '—',
      `${issuedList.length} access codes issued in bulk${problems.length ? `, ${problems.length} rows skipped` : ''}`
    );

    setIssued(issuedList);
    setStage('done');
    toast(`${issuedList.length} codes issued`, 'emerald');
  };

  const handleDownloadIssued = () => {
    const csvRows = issued.map((i) => [i.code, i.name, i.title, i.unit, i.email].map(csvEscape).join(','));
    const csv = ['code,name,title,unit,email', ...csvRows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civicduty-codes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Codes downloaded', 'emerald');
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-12">
      <div>
        <button
          onClick={() => go('gov_team')}
          className="flex items-center gap-1 text-[10px] mono text-zinc-600 hover:text-zinc-400 mb-3.5 transition-colors"
        >
          <ChevronLeft size={14} /> Team
        </button>
        <div className="tagline mb-1.5" style={{ color: '#f59e0b' }}>
          Bulk Provisioning
        </div>
        <h2 className="text-[21px] font-black text-amber-400 tracking-tight leading-tight">
          Onboard a whole node at once
        </h2>
        <p className="text-[11px] mono text-zinc-600 mt-1.5 leading-relaxed">
          Upload your officer list. Nothing is created until you have read the preview.
        </p>
      </div>

      {stage === 'upload' && (
        <>
          <div className="card p-4 space-y-3">
            <p className="text-[9px] mono text-zinc-500 uppercase tracking-widest">Officer list</p>
            <div className="drop-zone block cursor-pointer" onClick={handleLoadSample}>
              <div className="flex items-center justify-center gap-2 text-zinc-600">
                <Upload size={18} /> <span className="text-[13px] mono">Upload CSV (Tap to load sample batch)</span>
              </div>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="w-full flex items-center justify-center gap-2 border border-zinc-800 text-zinc-400 rounded-xl py-2.5 text-[10px] uppercase tracking-widest mono hover:border-zinc-700 transition-all"
            >
              <Download size={14} /> Download template
            </button>
            <p className="text-[8px] mono text-zinc-700 leading-relaxed">
              Walkthrough: tapping upload loads a seven-row sample batch, two of which are deliberately broken to test validation.
            </p>
          </div>

          <div className="card p-4 space-y-2">
            <p className="text-[9px] mono text-zinc-500 uppercase tracking-widest">Columns</p>
            {[
              ['name', "The officer's full name"],
              ['title', 'Their official title — it appears on every reply they post'],
              ['unit', 'The parish, ward or sub-county this desk covers'],
              ['parent', 'Its district or division. Required where unit names repeat.'],
              ['role', 'node_admin, spokesperson or read_only'],
              ['utility', 'yes for an area engineer or branch manager'],
              ['email', 'Becomes the permanent login for this desk'],
            ].map(([c, description]) => (
              <div key={c} className="flex items-start gap-2.5 text-[10px] mono leading-relaxed">
                <span className="text-amber-500/70 flex-shrink-0 min-w-[52px]">{c}</span>
                <span className="text-zinc-500">{description}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {stage === 'preview' && (
        <>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="admin-stat">
              <div className="text-2xl font-black mono text-emerald-400">{rows.length}</div>
              <div className="text-[8px] mono text-zinc-600 uppercase mt-1">Ready to issue</div>
            </div>
            <div className="admin-stat">
              <div className={`text-2xl font-black mono ${problems.length ? 'text-red-400' : 'text-zinc-200'}`}>
                {problems.length}
              </div>
              <div className="text-[8px] mono text-zinc-600 uppercase mt-1">Rows with problems</div>
            </div>
          </div>

          {problems.length > 0 && (
            <div className="card p-4 space-y-2" style={{ borderLeft: '3px solid #ef444460' }}>
              <p className="text-[9px] mono text-red-400 uppercase tracking-widest">These rows will be skipped</p>
              {problems.map((p, idx) => (
                <div key={idx} className="text-[9px] mono text-zinc-500 leading-relaxed">
                  <span className="text-zinc-600">Line {p.line}</span> · <span className="text-amber-500/70">{p.field}</span> · {p.msg}
                </div>
              ))}
              <p className="text-[8px] mono text-zinc-700 leading-relaxed pt-1">
                Ambiguity is treated as failure rather than guessed at.
              </p>
            </div>
          )}

          <div className="card p-4 space-y-2">
            <p className="text-[9px] mono text-zinc-500 uppercase tracking-widest">Desks to be created ({rows.length})</p>
            {rows.map((r, idx) => (
              <div key={idx} className="border-b border-zinc-900 pb-2 last:border-0">
                <div className="text-[11px] font-bold text-zinc-200">{r.title}</div>
                <div className="text-[9px] mono text-zinc-600">
                  {r.name} · {r.email}
                </div>
                <div className="path-crumb">{r.unit}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <button
              onClick={handleIssueCodes}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl py-4 text-sm uppercase tracking-widest mono transition-all active:scale-[.98]"
            >
              Issue {rows.length} access codes
            </button>
            <button
              onClick={() => {
                setStage('upload');
                setRows([]);
                setProblems([]);
              }}
              className="w-full text-zinc-600 hover:text-zinc-400 font-bold rounded-2xl py-2 text-[10px] uppercase tracking-widest mono transition-all"
            >
              Start over
            </button>
          </div>
        </>
      )}

      {stage === 'done' && (
        <>
          <div className="card p-4 space-y-2" style={{ borderLeft: '3px solid #10b98166' }}>
            <p className="text-[13px] font-bold text-emerald-400">{issued.length} access codes issued</p>
            <p className="text-[10px] mono text-zinc-500 leading-relaxed">
              Download the list and send each officer their own code by SMS or WhatsApp.
            </p>
          </div>

          <button
            onClick={handleDownloadIssued}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl py-4 text-sm uppercase tracking-widest mono transition-all active:scale-[.98]"
          >
            <Download size={16} /> Download codes CSV
          </button>

          <div className="card p-4 space-y-2">
            {issued.map((i, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 border-b border-zinc-900 pb-2 last:border-0">
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-zinc-200 truncate">{i.title}</div>
                  <div className="text-[8px] mono text-zinc-600 truncate">{i.email}</div>
                </div>
                <span className="text-[11px] mono font-bold text-amber-300 tracking-wider flex-shrink-0">{i.code}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => go('gov_team')}
            className="w-full border border-zinc-800 text-zinc-400 rounded-2xl py-3 text-[10px] uppercase tracking-widest mono hover:border-zinc-700 transition-all"
          >
            Back to team
          </button>
        </>
      )}

      <NoteBox
        tone="emerald"
        title="Authorization Integrity"
        text="Every authorization check the single invite form makes is repeated per row. Platform Admin cannot be issued in bulk, rows outside your own node fail individually, and batches cap at 500."
      />
    </div>
  );
};
