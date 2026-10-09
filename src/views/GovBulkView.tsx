import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!user || !['node_admin', 'platform_admin'].includes(user.role)) {
      go('gov_inbox');
    }
  }, [user, go]);

  if (!user || !['node_admin', 'platform_admin'].includes(user.role)) {
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
    <div className="p-4 sm:p-5 space-y-4 animate-fade-in pb-16 max-w-2xl mx-auto text-slate-900 dark:text-slate-100">
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
        <button
          onClick={() => go('gov_team')}
          className="flex items-center gap-1 text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <ChevronLeft size={14} /> Back to Team
        </button>
        <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
          Bulk Provisioning Studio
        </div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
          Onboard a whole node at once
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Upload your officer list. Nothing is created until you have read the preview.
        </p>
      </div>

      {stage === 'upload' && (
        <>
          <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Officer list</p>
            <div className="drop-zone block cursor-pointer" onClick={handleLoadSample}>
              <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                <Upload size={18} /> <span className="text-xs font-mono font-medium">Upload CSV (Tap to load sample batch)</span>
              </div>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="w-full flex items-center justify-center gap-2 border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] text-slate-700 dark:text-slate-200 rounded-lg py-2.5 text-[10.5px] uppercase tracking-wider font-mono font-semibold transition-colors cursor-pointer"
            >
              <Download size={14} /> Download template
            </button>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 leading-relaxed">
              Walkthrough: tapping upload loads a seven-row sample batch, two of which are deliberately broken to test validation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Columns</p>
            {[
              ['name', "The officer's full name"],
              ['title', 'Their official title — it appears on every reply they post'],
              ['unit', 'The parish, ward or sub-county this desk covers'],
              ['parent', 'Its district or division. Required where unit names repeat.'],
              ['role', 'node_admin, spokesperson or read_only'],
              ['utility', 'yes for an area engineer or branch manager'],
              ['email', 'Becomes the permanent login for this desk'],
            ].map(([c, description]) => (
              <div key={c} className="flex items-start gap-2.5 text-[10.5px] font-mono leading-relaxed">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex-shrink-0 min-w-[52px]">{c}</span>
                <span className="text-slate-600 dark:text-slate-400">{description}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {stage === 'preview' && (
        <>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-center">
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{rows.length}</div>
              <div className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400 uppercase mt-1 font-semibold">Ready to issue</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-center">
              <div className={`text-2xl font-bold font-mono ${problems.length ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                {problems.length}
              </div>
              <div className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400 uppercase mt-1 font-semibold">Rows with problems</div>
            </div>
          </div>

          {problems.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/30 space-y-2">
              <p className="text-[10px] font-mono text-rose-600 dark:text-rose-400 uppercase tracking-wider font-semibold">These rows will be skipped</p>
              {problems.map((p, idx) => (
                <div key={idx} className="text-[10.5px] font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="text-slate-500 font-semibold">Line {p.line}</span> · <span className="text-amber-600 dark:text-amber-400 font-semibold">{p.field}</span> · {p.msg}
                </div>
              ))}
              <p className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                Ambiguity is treated as failure rather than guessed at.
              </p>
            </div>
          )}

          <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Desks to be created ({rows.length})</p>
            {rows.map((r, idx) => (
              <div key={idx} className="border-b border-[#e3e6ea] dark:border-[#262b36] pb-2.5 last:border-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{r.title}</div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {r.name} · {r.email}
                </div>
                <div className="path-crumb mt-1">{r.unit}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <button
              onClick={handleIssueCodes}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg py-3 text-xs uppercase tracking-wider font-mono transition-colors cursor-pointer"
            >
              Issue {rows.length} access codes
            </button>
            <button
              onClick={() => {
                setStage('upload');
                setRows([]);
                setProblems([]);
              }}
              className="w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold rounded-lg py-2 text-[10.5px] uppercase tracking-wider font-mono transition-colors cursor-pointer"
            >
              Start over
            </button>
          </div>
        </>
      )}

      {stage === 'done' && (
        <>
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30 space-y-1.5">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 font-mono uppercase">{issued.length} access codes issued</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Download the list and send each officer their own code by SMS or WhatsApp.
            </p>
          </div>

          <button
            onClick={handleDownloadIssued}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg py-3 text-xs uppercase tracking-wider font-mono transition-colors cursor-pointer"
          >
            <Download size={15} /> Download codes CSV
          </button>

          <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
            {issued.map((i, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 border-b border-[#e3e6ea] dark:border-[#262b36] pb-2 last:border-0">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{i.title}</div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">{i.email}</div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider flex-shrink-0">{i.code}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => go('gov_team')}
            className="w-full border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-200 rounded-lg py-2.5 text-[10.5px] uppercase tracking-wider font-mono font-semibold hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] transition-colors cursor-pointer"
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
