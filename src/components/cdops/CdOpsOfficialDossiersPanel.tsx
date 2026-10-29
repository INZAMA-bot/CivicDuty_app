import React, { useState } from 'react';
import {
  FileCheck,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Copy,
  CheckCheck,
  Printer,
  Search,
  Lock,
  Building2,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { OFFICIAL_DOCUMENTS, OfficialDocument } from '../../data/officialDocs';
import { MoICTReadinessPanel } from '../MoICTReadinessPanel';
import { useApp } from '../../context/AppContext';

export const CdOpsOfficialDossiersPanel: React.FC = () => {
  const { toast } = useApp();
  const [subTab, setSubTab] = useState<'moict' | 'dossiers'>('moict');
  const [selectedDocId, setSelectedDocId] = useState<string>('moict-compliance-dossier');
  const [docSearch, setDocSearch] = useState<string>('');
  const [copiedDoc, setCopiedDoc] = useState<boolean>(false);

  const activeDoc = OFFICIAL_DOCUMENTS.find((d) => d.id === selectedDocId) || OFFICIAL_DOCUMENTS[0];
  const activeDocIndex = OFFICIAL_DOCUMENTS.findIndex((d) => d.id === activeDoc.id);

  const handleCopyDocText = (doc: OfficialDocument) => {
    const fullText = [
      `=================================================================`,
      `${doc.title.toUpperCase()}`,
      `${doc.subtitle}`,
      `Category: ${doc.category} | Version: ${doc.version} | Date: ${doc.date}`,
      `Author: ${doc.author} (${doc.authorTitle}) - ${doc.authorContact}`,
      `=================================================================\n`,
      `SUMMARY:\n${doc.summary}\n`,
      ...doc.sections.map((s) => {
        let sectionText = `-----------------------------------------------------------------\n`;
        if (s.num) sectionText += `[${s.num}] `;
        sectionText += `${s.title.toUpperCase()}\n-----------------------------------------------------------------\n`;
        sectionText += `${s.content}\n`;
        if (s.highlights && s.highlights.length > 0) {
          sectionText += `\nKEY HIGHLIGHTS:\n` + s.highlights.map((h) => `• ${h}`).join('\n') + `\n`;
        }
        if (s.callout) {
          sectionText += `\n[NOTE: ${s.callout.title}]\n${s.callout.text}\n`;
        }
        if (s.table) {
          sectionText += `\n${s.table.headers.join(' | ')}\n`;
          sectionText += s.table.headers.map(() => '---').join(' | ') + '\n';
          sectionText += s.table.rows.map((row) => row.join(' | ')).join('\n') + '\n';
        }
        return sectionText;
      }),
      `\n=================================================================`,
      `CivicDuty Sovereign Service Delivery & Nation Management Infrastructure`,
      `Lead System Architect: Inzama Robin • 0778277900 / 0748338796 • inzamarobin279@gmail.com`,
      `=================================================================`,
    ].join('\n\n');

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(fullText);
    }
    setCopiedDoc(true);
    toast(`"${doc.title}" copied to clipboard!`, 'emerald');
    setTimeout(() => setCopiedDoc(false), 3000);
  };

  const filteredSections = activeDoc.sections.filter((s) => {
    if (!docSearch.trim()) return true;
    const q = docSearch.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.content.toLowerCase().includes(q) ||
      (s.num && s.num.toLowerCase().includes(q)) ||
      (s.highlights && s.highlights.some((h) => h.toLowerCase().includes(q))) ||
      (s.callout && (s.callout.title.toLowerCase().includes(q) || s.callout.text.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Founder Confidential Banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Lock size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">Founder Dossiers &amp; MoICT Statutory Vault</h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                STRICTLY PRIVATE
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono mt-0.5">
              Ref: ADM 209/261/01 · Dr. Aminah Zawedde Response · Pre-Launch MoICT Roadmap
            </p>
          </div>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-lg border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setSubTab('moict')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              subTab === 'moict'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileCheck size={13} />
            <span>MoICT &amp; Launch</span>
          </button>
          <button
            onClick={() => setSubTab('dossiers')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              subTab === 'dossiers'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <ScrollText size={13} />
            <span>Official Dossiers ({OFFICIAL_DOCUMENTS.length})</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: MoICT Readiness & Launch Roadmap */}
      {subTab === 'moict' && (
        <MoICTReadinessPanel
          onOpenDoc={(docId) => {
            setSelectedDocId(docId);
            setSubTab('dossiers');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Sub-Tab 2: Official Document Dossiers Carousel & Reader */}
      {subTab === 'dossiers' && (
        <div className="space-y-4">
          {/* Document Slide Carousel Header & Controller */}
          <div className="p-4 sm:p-5 space-y-3.5 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck size={13} /> Executive Document Archive · Direct In-App Reader
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight mt-0.5">
                  Official Document Slide Carousel
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Tap any document slide below to review technical specifications, submission letters, and sovereign compliance responses.
                </p>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-center">
                <button
                  onClick={() => {
                    const prevIdx = activeDocIndex > 0 ? activeDocIndex - 1 : OFFICIAL_DOCUMENTS.length - 1;
                    setSelectedDocId(OFFICIAL_DOCUMENTS[prevIdx].id);
                  }}
                  className="px-2.5 py-1.5 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] rounded-lg text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer"
                  title="Previous Document"
                >
                  <ChevronLeft size={14} />
                  <span className="hidden sm:inline">Prev Doc</span>
                </button>
                <span className="text-[10px] font-mono bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 font-semibold px-2.5 py-1.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36]">
                  Doc {activeDocIndex + 1} / {OFFICIAL_DOCUMENTS.length}
                </span>
                <button
                  onClick={() => {
                    const nextIdx = activeDocIndex < OFFICIAL_DOCUMENTS.length - 1 ? activeDocIndex + 1 : 0;
                    setSelectedDocId(OFFICIAL_DOCUMENTS[nextIdx].id);
                  }}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs font-mono flex items-center gap-1 cursor-pointer"
                  title="Next Document"
                >
                  <span className="hidden sm:inline">Next Doc</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Slide Deck of All Documents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 pt-1">
              {OFFICIAL_DOCUMENTS.map((doc) => {
                const isSelected = doc.id === activeDoc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      setDocSearch('');
                    }}
                    className={`text-left p-3 rounded-xl border transition-colors flex flex-col justify-between space-y-2 relative cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-slate-900 dark:text-white'
                        : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d]'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[9.5px] font-mono font-semibold ${
                            isSelected
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {doc.category}
                        </span>
                        <span className="text-[9.5px] font-mono text-slate-500 flex items-center gap-1">
                          <Clock size={10} /> {doc.readTime}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                        {doc.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {doc.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#e3e6ea] dark:border-[#262b36] pt-2 text-[10px] font-mono">
                      <span className="text-slate-500 dark:text-slate-400 text-[9.5px] font-semibold">
                        {doc.version}
                      </span>
                      <span
                        className={`font-semibold flex items-center gap-1 text-[10px] ${
                          isSelected
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <Eye size={12} />
                        <span>{isSelected ? 'READING NOW' : 'Tap to Read'}</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* In-Screen Document Viewer for Active Selected Document */}
          <div className="p-5 space-y-5 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl text-slate-900 dark:text-slate-100">
            {/* Header & Copy Button */}
            <div className="border-b border-[#e3e6ea] dark:border-[#262b36] pb-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <FileText size={12} /> {activeDoc.category}
                  </span>
                  <span>·</span>
                  <span>{activeDoc.version}</span>
                  <span className="hidden sm:inline">·</span>
                  <span className="hidden sm:inline">{activeDoc.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyDocText(activeDoc)}
                    className="px-3 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Copy full document text"
                  >
                    {copiedDoc ? (
                      <>
                        <CheckCheck size={14} className="text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy Document</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 text-xs font-mono font-semibold transition-colors hidden sm:flex items-center gap-1 cursor-pointer"
                    title="Print or Save as PDF via browser"
                  >
                    <Printer size={14} />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {activeDoc.title}
                </h1>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                  {activeDoc.subtitle}
                </p>
              </div>

              {/* Author & Document Summary Callout */}
              <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] p-3.5 rounded-xl space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono text-slate-600 dark:text-slate-400 border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Author: {activeDoc.author} ({activeDoc.authorTitle})
                  </span>
                  <span className="text-[10px] text-slate-500">Contact: {activeDoc.authorContact}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                  <strong className="text-slate-900 dark:text-white">Executive Context:</strong> {activeDoc.summary}
                </p>
              </div>

              {/* In-Document Search */}
              <div className="space-y-2 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={docSearch}
                      onChange={(e) => setDocSearch(e.target.value)}
                      placeholder={`Search keywords inside "${activeDoc.title}"...`}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  {docSearch && (
                    <button
                      onClick={() => setDocSearch('')}
                      className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold hover:underline self-start sm:self-center cursor-pointer"
                    >
                      Clear Search
                    </button>
                  )}
                </div>

                {/* Section Quick Jump Navigator */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-mono">
                  <span className="text-slate-500 font-semibold whitespace-nowrap">Sections:</span>
                  {activeDoc.sections.map((s, idx) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="px-2 py-0.5 rounded-md bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] text-slate-600 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36] whitespace-nowrap transition-colors"
                    >
                      {s.num ? `${s.num}. ` : `${idx + 1}. `}
                      {s.title.split(':')[0].substring(0, 20)}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Rendered Document Sections */}
            <div className="space-y-5">
              {filteredSections.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-mono text-xs space-y-2">
                  <p>No sections match your search filter &quot;{docSearch}&quot;.</p>
                  <button
                    onClick={() => setDocSearch('')}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                  >
                    Reset Search
                  </button>
                </div>
              ) : (
                filteredSections.map((sec, sIdx) => (
                  <div
                    key={sec.id}
                    id={sec.id}
                    className="space-y-3 text-xs leading-relaxed scroll-mt-24 border-b border-[#e3e6ea] dark:border-[#262b36] pb-5 last:border-b-0"
                  >
                    <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2 border-b border-[#e3e6ea] dark:border-[#262b36] pb-1.5">
                      {sec.num ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono">{sec.num}.</span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono">§{sIdx + 1}</span>
                      )}
                      <span>{sec.title}</span>
                    </h3>

                    <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {sec.content}
                    </div>

                    {/* Callout box */}
                    {sec.callout && (
                      <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                        <span className="font-bold text-[11px] font-mono uppercase text-emerald-600 dark:text-emerald-400 block">
                          {sec.callout.title}
                        </span>
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">{sec.callout.text}</p>
                      </div>
                    )}

                    {/* Highlights */}
                    {sec.highlights && sec.highlights.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                          Key Specifications &amp; Takeaways:
                        </span>
                        <ul className="space-y-1">
                          {sec.highlights.map((h, hIdx) => (
                            <li
                              key={hIdx}
                              className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-[11px]"
                            >
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">·</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Structured Table */}
                    {sec.table && (
                      <div className="overflow-x-auto border border-[#e3e6ea] dark:border-[#262b36] rounded-xl my-2">
                        <table className="w-full text-left font-mono text-[10px]">
                          <thead className="bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-800 dark:text-slate-200 font-semibold border-b border-[#e3e6ea] dark:border-[#262b36]">
                            <tr>
                              {sec.table.headers.map((th, thIdx) => (
                                <th key={thIdx} className="p-2.5">
                                  {th}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e3e6ea] dark:divide-[#262b36]">
                            {sec.table.rows.map((r, rIdx) => (
                              <tr
                                key={rIdx}
                                className={
                                  rIdx % 2 === 0
                                    ? 'bg-white dark:bg-[#161a22]'
                                    : 'bg-[#f8f9fa]/60 dark:bg-[#0e1116]/60'
                                }
                              >
                                {r.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`p-2.5 ${
                                      cIdx === 0
                                        ? 'font-bold text-slate-900 dark:text-white'
                                        : 'text-slate-600 dark:text-slate-400'
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
