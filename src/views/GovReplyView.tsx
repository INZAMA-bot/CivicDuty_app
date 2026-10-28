import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getDept, pathStr, timeAgo } from '../utils/helpers';
import { ChevronLeft, Lock, Upload, FileText, SlidersHorizontal, Image as ImageIcon, Gift, Ticket, Copy, Check, MapPin, Store, CheckCircle2 } from 'lucide-react';
import { MediaCard } from '../components/MediaCard';
import { NoteBox } from '../components/NoteBox';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { TicketStatus } from '../types';

export const GovReplyView: React.FC = () => {
  const { user, activePost, go, addCommentToPost, updatePostStatus, logAudit, addPoints, toast } = useApp();

  const [status, setStatus] = useState<TicketStatus>('received');
  const [replyText, setReplyText] = useState('');
  const [stagedProof, setStagedProof] = useState<
    { type: 'image' | 'video' | 'doc'; url: string; name: string; size: string }[]
  >([]);
  const [customBeforeUrl, setCustomBeforeUrl] = useState<string>('');
  const [beforeLabel, setBeforeLabel] = useState<string>('Citizen Field Report');
  const [afterLabel, setAfterLabel] = useState<string>('');

  // Optional Courtesy Voucher / Resolution Token (Customer Care Loop)
  const isSchool = Boolean(
    user?.dept?.includes('gayaza') ||
    user?.organization_name?.toLowerCase().includes('school') ||
    user?.organization_name?.toLowerCase().includes('college') ||
    user?.entity_category === 'education'
  );
  const isDining = Boolean(
    user?.dept?.includes('javas') ||
    user?.dept?.includes('kfc') ||
    user?.organization_name?.toLowerCase().includes('kfc') ||
    user?.organization_name?.toLowerCase().includes('cafe') ||
    user?.organization_name?.toLowerCase().includes('restaurant') ||
    user?.entity_category === 'food_dining' ||
    user?.entity_category === 'hospitality'
  );

  const [attachCourtesyVoucher, setAttachCourtesyVoucher] = useState<boolean>(false);
  const [courtesyBrand, setCourtesyBrand] = useState<string>(
    user?.organization_name || user?.real_title_short || 'CivicDuty Provider Desk'
  );
  const [courtesyTitle, setCourtesyTitle] = useState<string>(
    isSchool
      ? '10,000 UGX School Scholastic & Stationery Voucher'
      : isDining
      ? '15,000 UGX Meal & Refreshment Courtesy Voucher'
      : 'MTN 1.5GB Civic Data Bundle'
  );
  const [courtesyValue, setCourtesyValue] = useState<number>(isSchool ? 10000 : isDining ? 15000 : 5000);
  const [courtesyNote, setCourtesyNote] = useState<string>(
    'Thank you for bringing this to our attention. Please accept this courtesy token from our team in appreciation for your constructive feedback.'
  );

  useEffect(() => {
    if (!activePost || !user || user.role === 'read_only') {
      go('gov_inbox');
    }
  }, [activePost, user, go]);

  if (!activePost || !user || user.role === 'read_only') {
    return null;
  }

  const p = activePost;
  const d = getDept(user.country, user.dept || 'kcca');
  const isCorrupt = p.category === 'corruption';
  const canResolve = stagedProof.length > 0;

  const citizenBeforeImg = p.media?.find((m) => m.type === 'image' && m.url)?.url || p.before_after?.before_url || '';
  const stagedImages = stagedProof.filter((m) => m.type === 'image');
  const effectiveBeforeUrl =
    customBeforeUrl ||
    citizenBeforeImg ||
    (stagedImages.length >= 2 ? stagedImages[0].url : '');
  const effectiveAfterUrl =
    stagedImages.length >= 2 && !customBeforeUrl && !citizenBeforeImg
      ? stagedImages[1].url
      : stagedImages[0]?.url || '';

  const hrsElapsed = Math.max(1, (Date.now() - new Date(p.created_at).getTime()) / 3600000);
  const hrs = Math.floor(hrsElapsed);
  const mins = Math.round((hrsElapsed - hrs) * 60);
  const turnaroundStr = `${hrs}h ${mins}m`;

  const handleProofSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files: File[] = Array.from(e.target.files);
    const items = files.map((f: File) => {
      const url = URL.createObjectURL(f);
      const type = f.type.includes('image') ? ('image' as const) : f.type.includes('video') ? ('video' as const) : ('doc' as const);
      return {
        type,
        url,
        name: f.name,
        size: (f.size / 1024).toFixed(0) + 'KB',
      };
    });
    setStagedProof((prev) => [...prev, ...items]);
    e.target.value = '';
  };

  const removeProof = (idx: number) => {
    setStagedProof((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (resolve: boolean) => {
    if (!replyText.trim()) {
      toast('Response text required', 'red');
      return;
    }
    if (resolve && !canResolve) {
      toast('Upload proof to resolve', 'red');
      return;
    }

    const proofMedia = stagedProof.map((m) => {
      if (m.type === 'image') return { type: 'image' as const, url: m.url, caption: '' };
      if (m.type === 'video') return { type: 'video' as const, url: m.url, thumb: m.url, duration: '0:30' };
      return { type: 'doc' as const, name: m.name, size: m.size };
    });

    const isKe = user.country === 'KE';
    const curr = isKe ? 'KES' : user.country === 'NG' ? 'NGN' : 'UGX';
    const codeSuffix = Math.floor(1000 + Math.random() * 9000);
    const cleanPrefix = (courtesyBrand || user.organization_name || d.name).replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'CVIC';
    const vCode = `${cleanPrefix}-${courtesyValue >= 1000 ? Math.round(courtesyValue / 1000) + 'K' : courtesyValue}-${codeSuffix}`;
    const ussdStr = isKe ? `*141*${vCode}#` : `*303*${vCode}#`;

    const courtesyVoucherPayload = attachCourtesyVoucher
      ? {
          voucherCode: vCode,
          brand: courtesyBrand || user.organization_name || d.name,
          title: courtesyTitle || `${courtesyBrand || user.organization_name || d.name} Courtesy Token`,
          faceValue: courtesyValue,
          currency: curr,
          ussdCode: ussdStr,
          qrCodeData: `CIVIC-${vCode}`,
          note: courtesyNote.trim() || 'Issued in appreciation for your verified civic feedback.',
        }
      : undefined;

    if (courtesyVoucherPayload) {
      fetch('/api/perks/courtesy-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: p.citizen_name || 'Citizen Observer',
          recipientContact: p.citizen_id || 'Citizen Account',
          postId: p.id,
          brand: courtesyVoucherPayload.brand,
          title: courtesyVoucherPayload.title,
          faceValue: courtesyVoucherPayload.faceValue,
          currency: courtesyVoucherPayload.currency,
          country: user.country,
          citationNote: courtesyVoucherPayload.note,
          dispatchedBy: user.real_title_short || user.organization_name || d.name,
        }),
      }).catch(() => {});
    }

    const comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sender: `${user.real_title_short || d.name} · ${user.scope_label || ''}`,
      role: 'gov' as const,
      body: replyText.trim(),
      status_tag: resolve ? ('resolved' as TicketStatus) : status,
      media: proofMedia,
      created_at: new Date().toISOString(),
      helpful: 0,
      not_helpful: 0,
      courtesy_voucher: courtesyVoucherPayload,
    };

    addCommentToPost(p.id, comment);

    const beforeAfterPayload =
      effectiveBeforeUrl && effectiveAfterUrl
        ? {
            before_url: effectiveBeforeUrl,
            after_url: effectiveAfterUrl,
            before_label: beforeLabel.trim() || 'Citizen Field Report',
            after_label: afterLabel.trim() || `Verified Fix · ${user.real_title_short || d.name}`,
            turnaround_hrs: turnaroundStr,
            gps_verified: Boolean(p.gps),
            verified_by: `${user.real_title_short || d.name}`,
          }
        : undefined;

    if (resolve) {
      updatePostStatus(p.id, 'resolved', beforeAfterPayload);
      logAudit(
        'resolve',
        p.id,
        `Resolved with ${proofMedia.length} proof file(s)${beforeAfterPayload ? ' + Auto-Paired Before & After Proof' : ''}${courtesyVoucherPayload ? ` + Attached Courtesy Voucher (${courtesyVoucherPayload.currency} ${courtesyVoucherPayload.faceValue} ${courtesyVoucherPayload.voucherCode})` : ''}`
      );
      if (p.citizen_id) {
        addPoints(p.citizen_id, 250, '+250pts · Issue resolved by GOV');
      }
      toast(
        courtesyVoucherPayload
          ? `Resolved with ${courtesyVoucherPayload.currency} ${courtesyVoucherPayload.faceValue.toLocaleString()} courtesy token & proof published!`
          : 'Resolved — Before & After proof published & citizen notified to confirm',
        'emerald'
      );
    } else {
      updatePostStatus(p.id, status, beforeAfterPayload);
      logAudit(
        'reply',
        p.id,
        `Status → ${status}${proofMedia.length ? `, ${proofMedia.length} proof file(s)` : ''}${courtesyVoucherPayload ? ` + Attached Courtesy Voucher (${courtesyVoucherPayload.voucherCode})` : ''}`
      );
      toast(
        courtesyVoucherPayload
          ? `Response posted + ${courtesyVoucherPayload.currency} ${courtesyVoucherPayload.faceValue.toLocaleString()} courtesy token dispatched to citizen!`
          : 'Response posted',
        'amber'
      );
    }

    go('gov_inbox');
  };

  const govStatuses: { id: TicketStatus; label: string }[] = [
    { id: 'received', label: 'Received' },
    { id: 'investigating', label: 'Investigating' },
    { id: 'budget', label: 'Budget Allocated' },
    { id: 'cannot', label: 'Cannot Fix' },
  ];

  return (
    <div className="p-4 sm:p-5 space-y-4 animate-fade-in pb-16 max-w-2xl mx-auto text-slate-900 dark:text-slate-100">
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
        <button
          onClick={() => go('gov_inbox')}
          className="flex items-center gap-1 text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <ChevronLeft size={14} /> Official Inbox
        </button>
        <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-between">
          <span>Official Response Desk</span>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            SERVE Active Mode
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
            {user.organization_name || user.real_title_short || d.name}
          </h2>
          {user.branch_name && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-[10px] font-mono font-bold border border-purple-200 dark:border-purple-800">
              <Store size={10} className="text-purple-600 dark:text-purple-400" />
              Branch: {user.branch_name}
              {user.branch_parish ? ` · ${user.branch_parish}` : ''}
            </span>
          )}
        </div>
        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
          {user.role_label || ''} · {user.duty_station || user.scope_label || ''}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5" style={{ borderLeft: `3px solid ${isCorrupt ? '#f43f5e' : '#10b981'}` }}>
        <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Responding to</p>
        <h4 className={`text-sm font-bold ${isCorrupt ? 'text-rose-700 dark:text-rose-200' : 'text-slate-900 dark:text-slate-100'}`}>{p.title}</h4>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">{p.body}</p>
        <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-1">
          {p.citizen_name} · {timeAgo(p.created_at)}
        </p>
        <div className="path-crumb">{pathStr(p.country, p.territory)}</div>
      </div>

      {p.media && p.media.length > 0 && (
        <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
          <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Citizen Evidence (Auto-Tagged as &ldquo;BEFORE&rdquo; Reference)</p>
          <MediaCard media={p.media} postId={p.id + '-ref'} onToast={(msg) => toast(msg)} />
        </div>
      )}

      {isCorrupt && (
        <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/30 space-y-1">
          <p className="text-[10.5px] font-mono text-rose-700 dark:text-rose-300 font-semibold uppercase">Anti-Corruption Response Protocol</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            This response is elevated. Upload all supporting documentation. Do not dismiss without written reason.
          </p>
        </div>
      )}

      {/* Response & Evidence Studio Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-4">
        {/* SERVE Mobile Rapid Responder Action Bar */}
        <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-300/70 dark:border-emerald-800/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <span>SERVE · Rapid Responder Action Bar</span>
            </span>
            <span className="text-[9px] font-mono text-emerald-700 dark:text-emerald-300">1-Tap Field Presets</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setStatus('investigating');
                setReplyText('Crew dispatched to site. Rapid field inspection and rectification are actively underway.');
                toast('SERVE: Dispatched crew preset applied', 'emerald');
              }}
              className="px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 font-mono font-bold text-[10px] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>🛵 Dispatch Crew</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStatus('received');
                setReplyText('Logged with duty lead. Initial assessment underway within statutory SLA.');
                toast('SERVE: Acknowledged preset applied', 'emerald');
              }}
              className="px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 font-mono font-bold text-[10px] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>🔍 Field Review</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAttachCourtesyVoucher(true);
                toast('SERVE: Courtesy compensation token enabled', 'emerald');
              }}
              className="px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-800 font-mono font-bold text-[10px] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>🎁 Issue Token</span>
            </button>
          </div>
        </div>

        {/* Status Picker */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">Update Status</label>
          <div className="grid grid-cols-2 gap-2">
            {govStatuses.map((s) => (
              <button
                key={s.id}
                onClick={() => setStatus(s.id)}
                className={`py-2 px-3 rounded-lg text-[10.5px] font-mono font-semibold border transition-colors cursor-pointer ${
                  status === s.id
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] font-mono text-slate-500 leading-relaxed">
            Resolved is not a status you pick — it is the second button below, and it requires proof.
          </p>
        </div>

        {/* Text Area */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">Official Response</label>
          <textarea
            rows={5}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="State the action taken, current status, and expected resolution timeline."
            className="w-full px-3 py-2 text-xs leading-relaxed resize-none rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          ></textarea>
        </div>

        {/* Proof Evidence Upload */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">
            Evidence / Proof <span className={isCorrupt ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-500'}>({isCorrupt ? 'Required' : 'Required to Resolve'})</span>
          </label>

          <label className="drop-zone block cursor-pointer">
            <input
              type="file"
              accept="image/*,video/*,.pdf"
              className="hidden"
              multiple
              onChange={handleProofSelect}
            />
            <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
              <Upload size={16} /> <span className="text-xs font-mono font-medium">Upload &ldquo;After&rdquo; repair photo, work orders, or documents</span>
            </div>
          </label>

          {/* Optional Before Photo Upload if Citizen Report Had No Photo */}
          {!citizenBeforeImg && (
            <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2 flex-wrap">
              <div className="text-[10.5px] font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <ImageIcon size={13} className="text-amber-500 shrink-0" />
                <span>Citizen report had no initial photo. Upload a &ldquo;Before&rdquo; inspection photo (or 2 proof photos) to generate a Before &amp; After card:</span>
              </div>
              <label className="px-2.5 py-1 rounded-md bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-semibold cursor-pointer shrink-0">
                <span>{customBeforeUrl ? 'Change Before Photo' : '+ Attach Before Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setCustomBeforeUrl(URL.createObjectURL(f));
                    e.target.value = '';
                  }}
                />
              </label>
            </div>
          )}

          {stagedProof.length > 0 && (
            <div className="space-y-2 mt-2">
              {stagedProof.map((m, idx) => (
                <div key={idx} className="doc-card">
                  <div className="doc-icon text-emerald-600 dark:text-emerald-400">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{m.name}</div>
                    <div className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400">{m.type} · {m.size}</div>
                  </div>
                  <button onClick={() => removeProof(idx)} className="text-[10px] font-mono text-rose-600 dark:text-rose-400 hover:underline px-2 font-semibold cursor-pointer">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Live Auto-Generated Before & After Comparison Preview */}
          {effectiveBeforeUrl && effectiveAfterUrl && (
            <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/40 space-y-2.5 mt-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <SlidersHorizontal size={12} />
                  <span>Auto-Paired Before &amp; After Resolution Proof Preview</span>
                </span>
                <span className="text-[9px] font-mono text-slate-500">
                  Turnaround: {turnaroundStr}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-mono text-slate-500 uppercase block mb-0.5">Before Label</label>
                  <input
                    type="text"
                    value={beforeLabel}
                    onChange={(e) => setBeforeLabel(e.target.value)}
                    placeholder="Citizen Field Report"
                    className="w-full px-2.5 py-1 text-[11px] rounded-md border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#0e1116]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-slate-500 uppercase block mb-0.5">After Label</label>
                  <input
                    type="text"
                    value={afterLabel}
                    onChange={(e) => setAfterLabel(e.target.value)}
                    placeholder={`Verified Fix · ${user.real_title_short || d.name}`}
                    className="w-full px-2.5 py-1 text-[11px] rounded-md border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#0e1116]"
                  />
                </div>
              </div>

              <BeforeAfterSlider
                beforeUrl={effectiveBeforeUrl}
                afterUrl={effectiveAfterUrl}
                beforeLabel={beforeLabel || 'Citizen Field Report'}
                afterLabel={afterLabel || `Verified Fix · ${user.real_title_short || d.name}`}
                turnaroundTime={turnaroundStr}
                gpsCoords={p.gps}
                gpsVerified={Boolean(p.gps)}
                verifiedBy={user.real_title_short || d.name}
                compact={true}
                defaultMode="slider"
              />
            </div>
          )}

          {!canResolve && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1 font-semibold">
              <Lock size={12} /> Upload proof to enable Resolve
            </div>
          )}
        </div>

        {/* OPTIONAL COURTESY VOUCHER / RESOLUTION TOKEN (CUSTOMER CARE LOOP) */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-transparent border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={attachCourtesyVoucher}
                onChange={(e) => setAttachCourtesyVoucher(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-[#e3e6ea] dark:border-[#262b36] cursor-pointer"
              />
              <div className="flex items-center gap-1.5">
                <Gift size={15} className="text-amber-500" />
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                  Attach an Optional Courtesy Voucher / Resolution Token
                </span>
              </div>
            </label>
            <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25 font-bold">
              Optional Care Loop
            </span>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            Attach a digital utility, grocery, dining, or scholastic voucher to this resolution. The citizen receives an instant USSD code &amp; QR token in their response notification.
          </p>

          {attachCourtesyVoucher && (
            <div className="space-y-3 pt-2 border-t border-amber-500/20 animate-fade-in text-xs">
              {/* Presets Grid */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold block">
                  Select Voucher Package
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    ...(isSchool
                      ? [
                          { title: '10,000 UGX School Scholastic & Stationery Voucher', val: 10000, brand: user?.organization_name || 'Gayaza High School', cat: 'books_stationery' },
                          { title: '15,000 UGX School Uniform Subsidy Token', val: 15000, brand: user?.organization_name || 'Gayaza High School', cat: 'fashion_apparel' },
                          { title: '5,000 UGX Canteen Meal / Snack Token', val: 5000, brand: user?.organization_name || 'Gayaza High School', cat: 'groceries_consumables' },
                          { title: 'MTN 1.5GB Student Research Data Pack', val: 8000, brand: 'MTN Uganda', cat: 'telco_data' },
                        ]
                      : isDining
                      ? [
                          { title: '5,000 UGX Café Javas Coffee / Beverage Token', val: 5000, brand: user?.organization_name || 'Café Javas', cat: 'food_dining' },
                          { title: '15,000 UGX Customer Appreciation Dining Voucher', val: 15000, brand: user?.organization_name || 'Café Javas', cat: 'food_dining' },
                          { title: '10,000 UGX Bakery & Dessert Coupon', val: 10000, brand: user?.organization_name || 'Café Javas', cat: 'food_dining' },
                          { title: 'MTN 1.5GB Civic Feedback Data Pack', val: 8000, brand: 'MTN Uganda', cat: 'telco_data' },
                        ]
                      : [
                          { title: '8,000 UGX MTN 1.5GB Civic Data Bundle', val: 8000, brand: 'MTN Uganda', cat: 'telco_data' },
                          { title: '5,000 UGX NWSC 1,000L Household Water Token', val: 5000, brand: 'NWSC Uganda', cat: 'water_utility' },
                          { title: '10,000 UGX Umeme Yaka Power Token', val: 10000, brand: 'Umeme Power', cat: 'electricity' },
                          { title: '5,000 UGX SafeBoda Transit Ride Credit', val: 5000, brand: 'SafeBoda', cat: 'transit_credit' },
                        ]),
                  ].map((pkg, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCourtesyTitle(pkg.title);
                        setCourtesyValue(pkg.val);
                        setCourtesyBrand(pkg.brand);
                      }}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        courtesyTitle === pkg.title
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 shadow-2xs'
                          : 'border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs truncate">{pkg.title}</div>
                      <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between mt-0.5">
                        <span>{pkg.brand}</span>
                        <strong className="text-emerald-700 dark:text-emerald-400">
                          {user.country === 'KE' ? 'KES' : 'UGX'} {pkg.val.toLocaleString()}
                        </strong>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount and Citation Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1 font-bold">
                    Custom Voucher Face Value ({user.country === 'KE' ? 'KES' : 'UGX'})
                  </label>
                  <input
                    type="number"
                    value={courtesyValue}
                    onChange={(e) => setCourtesyValue(Number(e.target.value))}
                    min={1000}
                    step={1000}
                    className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#0e1116] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1 font-bold">
                    Voucher Provider / Brand Label
                  </label>
                  <input
                    type="text"
                    value={courtesyBrand}
                    onChange={(e) => setCourtesyBrand(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#0e1116] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1 font-bold">
                  Personalized Appreciation / Apology Note
                </label>
                <textarea
                  rows={2}
                  value={courtesyNote}
                  onChange={(e) => setCourtesyNote(e.target.value)}
                  placeholder="Thank you for bringing this issue to our attention..."
                  className="w-full p-2.5 text-xs rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#0e1116] text-slate-900 dark:text-white leading-relaxed resize-none"
                />
              </div>

              {/* Live Preview Card */}
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Ticket size={16} className="text-emerald-600" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-xs block">
                      Preview: {courtesyTitle}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                      Dispatched instantly via USSD ({user.country === 'KE' ? '*141#' : '*303#'}) &amp; QR Voucher
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-600 text-white">
                  98% Escrow Settle Guarantee
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => handleSubmit(false)}
            className="w-full border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] text-slate-800 dark:text-slate-200 font-semibold rounded-lg py-2.5 text-xs uppercase tracking-wider font-mono transition-colors cursor-pointer"
          >
            Post Response (Status Update)
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={!canResolve}
            className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg py-2.5 text-xs uppercase tracking-wider font-mono transition-colors ${
              canResolve ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            {effectiveBeforeUrl && effectiveAfterUrl
              ? 'Post + Publish Before & After Resolution →'
              : 'Post + Mark Resolved'}
          </button>
        </div>
      </div>

      <NoteBox
        tone="red"
        title="Why Proof Gates Resolution"
        text="Proof files reference the comment, so they must exist alongside it. Resolving without proof would leave a ticket marked resolved with no evidence behind it whenever an upload failed — the exact fake closure this rule exists to prevent."
      />
    </div>
  );
};
