import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getDept, pathStr, timeAgo } from '../utils/helpers';
import { ChevronLeft, Lock, Upload, FileText } from 'lucide-react';
import { MediaCard } from '../components/MediaCard';
import { NoteBox } from '../components/NoteBox';
import { TicketStatus } from '../types';

export const GovReplyView: React.FC = () => {
  const { user, activePost, go, addCommentToPost, updatePostStatus, logAudit, addPoints, toast } = useApp();

  const [status, setStatus] = useState<TicketStatus>('received');
  const [replyText, setReplyText] = useState('');
  const [stagedProof, setStagedProof] = useState<
    { type: 'image' | 'video' | 'doc'; url: string; name: string; size: string }[]
  >([]);

  if (!activePost || !user) {
    go('gov_inbox');
    return null;
  }

  if (user.role === 'read_only') {
    go('gov_inbox');
    return null;
  }

  const p = activePost;
  const d = getDept(user.country, user.dept || 'kcca');
  const isCorrupt = p.category === 'corruption';
  const canResolve = stagedProof.length > 0;

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

    const comment = {
      id: 'c-' + Date.now(),
      sender: `${user.real_title_short || d.name} · ${user.scope_label || ''}`,
      role: 'gov' as const,
      body: replyText.trim(),
      status_tag: resolve ? ('resolved' as TicketStatus) : status,
      media: proofMedia,
      created_at: new Date().toISOString(),
      helpful: 0,
      not_helpful: 0,
    };

    addCommentToPost(p.id, comment);

    if (resolve) {
      updatePostStatus(p.id, 'resolved');
      logAudit('resolve', p.id, `Resolved with ${proofMedia.length} proof file(s)`);
      if (p.citizen_id) {
        addPoints(p.citizen_id, 250, '+250pts · Issue resolved by GOV');
      }
      toast('Resolved — citizen notified to confirm', 'emerald');
    } else {
      updatePostStatus(p.id, status);
      logAudit('reply', p.id, `Status → ${status}${proofMedia.length ? `, ${proofMedia.length} proof file(s)` : ''}`);
      toast('Response posted', 'amber');
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
    <div className="p-4 space-y-5 animate-fade-in pb-12 text-slate-800 dark:text-slate-100">
      <div>
        <button
          onClick={() => go('gov_inbox')}
          className="flex items-center gap-1 text-[10px] mono text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 mb-3.5 transition-colors font-bold"
        >
          <ChevronLeft size={14} /> Official Inbox
        </button>
        <div className="tagline mb-1.5 font-bold" style={{ color: '#0d9488' }}>
          Official Response
        </div>
        <h2 className="text-[21px] font-black text-teal-700 dark:text-teal-400 tracking-tight leading-tight">
          {user.real_title_short || d.name}
        </h2>
        <p className="text-[11px] mono text-slate-500 dark:text-slate-400 mt-1">
          {user.role_label || ''} · {user.scope_label || ''}
        </p>
      </div>

      <div className="card p-4 space-y-1.5" style={{ borderLeft: `3px solid ${isCorrupt ? '#f43f5e' : '#0d9488'}` }}>
        <p className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Responding to</p>
        <h4 className={`text-[14px] font-bold ${isCorrupt ? 'text-rose-700 dark:text-rose-200' : 'text-slate-900 dark:text-slate-100'}`}>{p.title}</h4>
        <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed pt-1">{p.body}</p>
        <p className="text-[9px] mono text-slate-500 dark:text-slate-400 pt-1">
          {p.citizen_name} · {timeAgo(p.created_at)}
        </p>
        <div className="path-crumb">{pathStr(p.country, p.territory)}</div>
      </div>

      {p.media && p.media.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Citizen Evidence</p>
          <MediaCard media={p.media} postId={p.id + '-ref'} onToast={(msg) => toast(msg)} />
        </div>
      )}

      {isCorrupt && (
        <div className="corrupt-banner space-y-1">
          <p className="text-[10px] mono text-rose-800 dark:text-rose-300 font-bold">Anti-Corruption Response Protocol</p>
          <p className="text-[9px] mono text-slate-700 dark:text-slate-400 leading-relaxed">
            This response is elevated. Upload all supporting documentation. Do not dismiss without written reason.
          </p>
        </div>
      )}

      {/* Status Picker */}
      <div className="space-y-2">
        <label className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-bold">Update Status</label>
        <div className="grid grid-cols-2 gap-2">
          {govStatuses.map((s) => (
            <button
              key={s.id}
              onClick={() => setStatus(s.id)}
              className={`py-2.5 rounded-xl text-[9px] mono font-bold border transition-all ${
                status === s.id
                  ? 'border-teal-600/50 bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="text-[8px] mono text-slate-500 leading-relaxed">
          Resolved is not a status you pick — it is the second button below, and it requires proof.
        </p>
      </div>

      {/* Text Area */}
      <div className="space-y-2">
        <label className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-bold">Official Response</label>
        <textarea
          rows={5}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="State the action taken, current status, and expected resolution timeline."
          className="text-sm leading-relaxed resize-none"
        ></textarea>
      </div>

      {/* Proof Evidence Upload */}
      <div className="space-y-2">
        <label className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-bold">
          Evidence / Proof <span className={isCorrupt ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-500'}>({isCorrupt ? 'Required' : 'Required to Resolve'})</span>
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
            <Upload size={18} /> <span className="text-[13px] mono font-medium">Upload proof, work orders, photos, documents</span>
          </div>
        </label>

        {stagedProof.length > 0 && (
          <div className="space-y-2 mt-2">
            {stagedProof.map((m, idx) => (
              <div key={idx} className="doc-card">
                <div className="doc-icon text-teal-600 dark:text-teal-400">
                  <FileText size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-slate-900 dark:text-slate-100 truncate">{m.name}</div>
                  <div className="text-[8px] mono text-slate-500 dark:text-slate-400">{m.type} · {m.size}</div>
                </div>
                <button onClick={() => removeProof(idx)} className="text-[8px] mono text-rose-600 dark:text-rose-400/80 hover:text-rose-700 dark:hover:text-rose-400 px-2 font-bold">
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {!canResolve && (
          <div className="flex items-center gap-1.5 text-[9px] mono text-teal-600 dark:text-teal-400 pt-1 font-bold">
            <Lock size={12} /> Upload proof to enable Resolve
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => handleSubmit(false)}
          className="w-full border border-teal-600/40 text-teal-700 dark:text-teal-300 font-black rounded-2xl py-3.5 text-xs uppercase tracking-widest mono hover:bg-teal-50 dark:hover:bg-teal-500/10 transition-all active:scale-[.98]"
        >
          Post Response (Status Update)
        </button>
        <button
          onClick={() => handleSubmit(true)}
          disabled={!canResolve}
          className={`w-full bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-black rounded-2xl py-3.5 text-xs uppercase tracking-widest mono transition-all active:scale-[.98] ${
            canResolve ? '' : 'opacity-40 cursor-not-allowed'
          }`}
        >
          Post + Mark Resolved ✓
        </button>
      </div>

      <NoteBox
        tone="red"
        title="Why Proof Gates Resolution"
        text="Proof files reference the comment, so they must exist alongside it. Resolving without proof would leave a ticket marked resolved with no evidence behind it whenever an upload failed — the exact fake closure this rule exists to prevent."
      />
    </div>
  );
};
