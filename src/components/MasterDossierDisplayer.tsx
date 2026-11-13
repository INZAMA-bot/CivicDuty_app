import React, { useState, useEffect, useMemo } from 'react';
import {
  Heart,
  Layers,
  MapPin,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Copy,
  Check,
  ShieldCheck,
  Radio,
  Smartphone,
  Lock,
  Image as ImageIcon,
  Award,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Post, CountryCode } from '../types';
import { getCountryGovernanceSchema } from '../data/countryGovernance';
import { getCountryTransitSpecs } from '../data/promotionalAds';
import {
  getRankedDossierSubmissions,
  selectFrontpageMasterDossiers,
  getDossierCompiledCount,
  getDossierTotalLikes,
  buildDossierDigestText,
  DossierSubmissionItem,
} from '../utils/dossierEngine';
import { getDept, getPostGrassroots, stripDecorativeEmojis, timeAgo } from '../utils/helpers';
import { RichCivicText } from './RichCivicText';

interface MasterDossierDisplayerProps {
  countryCode: CountryCode;
  posts: Post[];
  onFilterByHashtag?: (tag: string) => void;
}

export const MasterDossierDisplayer: React.FC<MasterDossierDisplayerProps> = ({
  countryCode,
  posts,
  onFilterByHashtag,
}) => {
  const {
    user,
    ensureCitizenSession,
    dossierLikesMap,
    toggleDossierSubmissionLike,
    compileWitnessIntoPost,
    setActivePost,
    go,
    toast,
  } = useApp();

  const rankedDossiers = useMemo(
    () => selectFrontpageMasterDossiers(posts, countryCode),
    [posts, countryCode]
  );

  const [selectedDossierId, setSelectedDossierId] = useState<string>('');
  const [expandedSubmissions, setExpandedSubmissions] = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newBody, setNewBody] = useState<string>('');
  const [newAnon, setNewAnon] = useState<boolean>(false);
  const [copiedDigest, setCopiedDigest] = useState<boolean>(false);
  const [imgFailed, setImgFailed] = useState<boolean>(false);

  const gov = getCountryGovernanceSchema(countryCode);
  const transitSpec = getCountryTransitSpecs(countryCode);
  const isUg = countryCode.toUpperCase() === 'UG';

  const roleOptions = useMemo(
    () => [
      isUg ? 'Bodaboda Rider / Stage Scout' : `${transitSpec.scoutTabLabel} / Road Scout`,
      `${transitSpec.taxiTabLabel} Operator`,
      `${transitSpec.marketTabLabel} / Merchant`,
      isUg ? 'Healthcare Worker / VHT' : 'Clinic Staff / Health Monitor',
      'Teacher / School Administrator',
      `Local ${gov.tier1UnitLabel} Resident`,
    ],
    [isUg, transitSpec, gov.tier1UnitLabel]
  );

  const [newRole, setNewRole] = useState<string>(roleOptions[0]);

  useEffect(() => {
    setNewRole(roleOptions[0]);
  }, [countryCode, roleOptions]);

  useEffect(() => {
    if (rankedDossiers.length === 0) return;
    if (!selectedDossierId || !rankedDossiers.some((d) => d.id === selectedDossierId)) {
      setSelectedDossierId(rankedDossiers[0].id);
    }
  }, [rankedDossiers, selectedDossierId]);

  const activeDossier = useMemo(() => {
    if (rankedDossiers.length === 0) return null;
    return rankedDossiers.find((d) => d.id === selectedDossierId) || rankedDossiers[0];
  }, [rankedDossiers, selectedDossierId]);

  const rankedSubmissions = useMemo(
    () => (activeDossier ? getRankedDossierSubmissions(activeDossier) : []),
    [activeDossier]
  );

  const featuredStory: DossierSubmissionItem | null = rankedSubmissions[0] || null;

  useEffect(() => {
    setImgFailed(false);
  }, [activeDossier?.id, featuredStory?.id]);

  if (!activeDossier || !featuredStory) return null;

  const activeUserId = (user || ensureCitizenSession()).id || 'usr-public-viewer';
  const userLikes = dossierLikesMap[activeUserId] || {};
  const dept = getDept(activeDossier.country, activeDossier.dept);
  const grassroots = getPostGrassroots(activeDossier.country, activeDossier);
  const compiledCount = getDossierCompiledCount(activeDossier);

  const heroImage =
    featuredStory.media?.find((m) => m.type === 'image' && m.url)?.url ||
    activeDossier.media?.find((m) => m.type === 'image' && m.url)?.url ||
    activeDossier.before_after?.after_url ||
    activeDossier.before_after?.before_url ||
    null;

  const handleOpenFullPost = () => {
    setActivePost(activeDossier);
    go('post_detail');
  };

  const handleCopyDigest = () => {
    const digest = buildDossierDigestText(activeDossier, gov.tier3Short);
    navigator.clipboard?.writeText(digest);
    setCopiedDigest(true);
    toast('Copied complete Master Dossier briefing & cryptographic ledger digest!', 'emerald');
    setTimeout(() => setCopiedDigest(false), 2200);
  };

  const handleSubmitWitness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBody.trim()) {
      toast('Describe what you observed on the ground before submitting', 'amber');
      return;
    }
    const actor = user || ensureCitizenSession();
    compileWitnessIntoPost(activeDossier.id, {
      citizen_id: actor.id || 'usr-citizen',
      citizen_name: newAnon ? 'Verified Citizen' : actor.name || 'Citizen Witness',
      author_profession: newRole,
      anonymous: newAnon,
      title: newTitle.trim() || undefined,
      body: newBody.trim(),
      gps: activeDossier.gps || null,
      source: 'web',
    });
    setNewTitle('');
    setNewBody('');
    setShowAddForm(false);
  };

  const channelLabel = (source: DossierSubmissionItem['source']) => {
    if (source === 'ussd') return `USSD ${transitSpec.ussdCode}`;
    if (source === 'sms') return 'SMS Gateway';
    return 'Web Portal';
  };

  return (
    <section
      aria-label="Frontpage Master Dossier Content Displayer"
      className="bg-white dark:bg-[#161a22] rounded-2xl border border-[#e3e6ea] dark:border-[#262b36] overflow-hidden shadow-xs"
    >
      {/* Top Frontpage Dossier Bar (Clean 3-Zone Editorial Strip) */}
      <div className="px-4 py-3.5 sm:px-5 border-b border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f8f9fa] dark:bg-[#11151d]">
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
            <Layers size={17} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <h2 className="truncate">Frontpage Master Dossier</h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap tabular-nums">
            <span>{gov.countryName}</span>
            <span aria-hidden="true">·</span>
            <span>{compiledCount} Compiled Witnesses</span>
            <span aria-hidden="true">·</span>
            <span>Most-liked submission features as Main Story</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {rankedDossiers.length > 1 && (
            <div
              className="flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]"
              role="tablist"
              aria-label="Select Master Dossier"
            >
              {rankedDossiers.slice(0, 3).map((dos, idx) => {
                const isSelected = dos.id === activeDossier.id;
                const dosLikes = getDossierTotalLikes(dos);
                return (
                  <button
                    key={dos.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedDossierId(dos.id)}
                    className={`min-h-[34px] px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer tabular-nums ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title={stripDecorativeEmojis(dos.title)}
                  >
                    #{idx + 1} · {dosLikes} likes
                  </button>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={handleCopyDigest}
            className="min-h-[40px] px-3 py-2 rounded-xl bg-white dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            title="Copy timestamped Master Dossier summary"
          >
            {copiedDigest ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copiedDigest ? 'Copied' : 'Digest'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddForm((v) => !v)}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
          >
            {showAddForm ? <X size={14} /> : <Plus size={14} />}
            <span>{showAddForm ? 'Close Form' : 'Add Testimony'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid: Featured #1 Story Spotlight (Left) + Ranked Engagement Submissions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#e3e6ea] dark:divide-[#262b36]">
        {/* LEFT COLUMN: Dynamic Featured Main Story (Dictated by Highest Viewer Likes) */}
        <div className="lg:col-span-7 p-4 sm:p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            {/* Unboxed Clean Editorial Kicker */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                <Award size={15} className="shrink-0" />
                <span>Featured Main Story</span>
                <span aria-hidden="true">·</span>
                <span>{featuredStory.rankLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{featuredStory.likes} likes</span>
              </div>

              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Desk: {dept.name}
              </span>
            </div>

            {/* Parent Case Context Headline if a Witness Story Overtook Lead */}
            {!featuredStory.isLead && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Dossier Case: <button type="button" onClick={handleOpenFullPost} className="font-semibold text-slate-700 dark:text-slate-200 hover:underline cursor-pointer text-left">{stripDecorativeEmojis(activeDossier.title)}</button>
              </div>
            )}

            {/* Main Featured Headline */}
            <h3
              onClick={handleOpenFullPost}
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug tracking-tight hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              {featuredStory.isLead
                ? featuredStory.title
                : `${featuredStory.title} — ${stripDecorativeEmojis(activeDossier.title)}`}
            </h3>

            {/* Clean Unboxed Author & Locality Metadata Row */}
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
              <span className="font-semibold text-slate-900 dark:text-slate-100 inline-flex items-center gap-1">
                {featuredStory.anonymous && <Lock size={11} className="text-slate-400" />}
                {featuredStory.citizen_name}
              </span>
              <span aria-hidden="true">·</span>
              <span>{featuredStory.author_profession}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={11} className="text-emerald-600 dark:text-emerald-400" />
                {grassroots.parish}, {grassroots.district}
              </span>
              <span aria-hidden="true">·</span>
              <span>{channelLabel(featuredStory.source)}</span>
              <span aria-hidden="true">·</span>
              <span>{timeAgo(featuredStory.created_at)}</span>
            </div>

            {/* Full Untruncated Featured Story Text */}
            <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              <RichCivicText
                text={featuredStory.body}
                onHashtagClick={(tag) => onFilterByHashtag?.(tag)}
              />
            </div>

            {/* Unobstructed Media Evidence Display */}
            {heroImage && !imgFailed && (
              <div className="rounded-xl overflow-hidden border border-[#e3e6ea] dark:border-[#262b36] bg-slate-950">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={heroImage}
                    alt={featuredStory.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setImgFailed(true)}
                  />
                </div>
                <div className="px-3 py-2 bg-[#0e1116] text-xs text-slate-300 flex items-center justify-between gap-2">
                  <span className="truncate">
                    {featuredStory.media?.[0]?.caption ||
                      activeDossier.media?.[0]?.caption ||
                      `Verified field evidence · ${activeDossier.location}`}
                  </span>
                  {featuredStory.gps && (
                    <span className="font-mono text-[11px] text-emerald-400 shrink-0 tabular-nums">
                      {featuredStory.gps.lat}, {featuredStory.gps.lng}
                    </span>
                  )}
                </div>
              </div>
            )}

            {heroImage && imgFailed && (
              <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <ImageIcon size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Verified field evidence sealed on dossier #{activeDossier.id.slice(-6).toUpperCase()}.</span>
              </div>
            )}
          </div>

          {/* Bottom Escalation Status + Primary Engagement Bar */}
          <div className="pt-3 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Witness Threshold ({Math.min(5, compiledCount)} / 5)</span>
                </span>
                <span className={compiledCount >= 5 ? 'font-semibold text-rose-600 dark:text-rose-400' : 'font-semibold text-emerald-700 dark:text-emerald-400'}>
                  {compiledCount >= 5
                    ? `Auto-Escalated to ${gov.tier3Short}`
                    : `${5 - compiledCount} more to auto-escalate`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    compiledCount >= 5 ? 'bg-rose-600' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(100, (compiledCount / 5) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {(() => {
                  const isFeaturedLiked = Boolean(userLikes[`${activeDossier.id}::${featuredStory.id}`]);
                  return (
                    <button
                      type="button"
                      onClick={() => toggleDossierSubmissionLike(activeDossier.id, featuredStory.id)}
                      className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer tabular-nums ${
                        isFeaturedLiked
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200'
                      }`}
                    >
                      <Heart size={15} className={isFeaturedLiked ? 'fill-current' : ''} />
                      <span>{isFeaturedLiked ? 'Liked Main Story' : 'Like Main Story'}</span>
                      <span className="font-mono font-bold">({featuredStory.likes})</span>
                    </button>
                  );
                })()}

                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Co-Sign (+20 pts)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleOpenFullPost}
                className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open Full Case &amp; SLA Audit</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Submission Leaderboard List (Like any submission to promote it to #1!) */}
        <div className="lg:col-span-5 p-4 sm:p-5 bg-[#f8f9fa]/60 dark:bg-[#0e1116]/60 flex flex-col justify-between space-y-3">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Submissions in Dossier ({rankedSubmissions.length})
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Most likes moves to #1
              </span>
            </div>

            {/* Ranked Submission Rows */}
            <div className="divide-y divide-[#e3e6ea] dark:divide-[#262b36] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl bg-white dark:bg-[#161a22] overflow-hidden">
              {rankedSubmissions.map((item, idx) => {
                const isTop = idx === 0;
                const isLiked = Boolean(userLikes[`${activeDossier.id}::${item.id}`]);
                const isExpanded = Boolean(expandedSubmissions[item.id]);
                const isLong = item.body.length > 135;

                return (
                  <div
                    key={item.id}
                    className={`p-3 sm:p-3.5 transition-colors space-y-2 ${
                      isTop ? 'bg-emerald-500/5 dark:bg-emerald-500/10' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs flex-wrap tabular-nums">
                          <span className={`font-mono font-bold ${isTop ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white truncate">
                            {item.citizen_name}
                          </span>
                          {isTop && (
                            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                              · Featured
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                          <span>{item.rankLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.author_profession}</span>
                          <span aria-hidden="true">·</span>
                          <span>{channelLabel(item.source)}</span>
                          <span aria-hidden="true">·</span>
                          <span>{timeAgo(item.created_at)}</span>
                        </div>
                      </div>

                      {/* 44px Touch-Target Like Button */}
                      <button
                        type="button"
                        onClick={() => toggleDossierSubmissionLike(activeDossier.id, item.id)}
                        aria-label={`Like submission by ${item.citizen_name}`}
                        aria-pressed={isLiked}
                        className={`min-h-[44px] min-w-[68px] px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer tabular-nums ${
                          isLiked
                            ? 'bg-rose-600 border-rose-600 text-white'
                            : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 hover:border-rose-500 hover:text-rose-600 dark:hover:text-rose-400'
                        }`}
                        title={
                          isTop
                            ? 'Currently Featured #1 Main Story'
                            : 'Like to help promote this submission to #1 Main Story'
                        }
                      >
                        <Heart size={14} className={isLiked ? 'fill-current' : ''} />
                        <span>{item.likes}</span>
                      </button>
                    </div>

                    <p
                      className={`text-xs text-slate-700 dark:text-slate-300 leading-relaxed ${
                        !isExpanded && isLong ? 'line-clamp-2' : ''
                      }`}
                    >
                      {item.body}
                    </p>

                    {(isLong || item.gps) && (
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        {item.gps ? (
                          <span className="font-mono text-slate-500 dark:text-slate-400 inline-flex items-center gap-1 tabular-nums">
                            <MapPin size={11} className="text-emerald-600 dark:text-emerald-400" />
                            <span>{item.gps.lat}, {item.gps.lng}</span>
                          </span>
                        ) : (
                          <span />
                        )}

                        {isLong && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedSubmissions((prev) => ({
                                ...prev,
                                [item.id]: !prev[item.id],
                              }))
                            }
                            className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>{isExpanded ? 'Show less' : 'Read full report'}</span>
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Collapsible Inline Co-Sign / Add Submission Form */}
          {showAddForm && (
            <form
              onSubmit={handleSubmitWitness}
              className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-emerald-500/40 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Submit Corroborating Testimony (+20 pts)
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={140}
                placeholder="Optional headline for your angle (e.g. Flooding blocking bus stop)"
                className="w-full px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />

              <textarea
                rows={3}
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Describe your firsthand observation at this site..."
                className="w-full px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="min-h-[40px] px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs text-slate-800 dark:text-slate-200"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAnon}
                    onChange={(e) => setNewAnon(e.target.checked)}
                  />
                  <span>Mask identity</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Publish Submission to Master Dossier
              </button>
            </form>
          )}

          {/* Quiet Cross-Channel Attribution Footer */}
          <div className="pt-1 flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Radio size={11} className="text-emerald-600 dark:text-emerald-400" />
              <span>Multi-channel ledger: Web, SMS &amp; {transitSpec.ussdCode}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Smartphone size={11} />
              <span>Real-time rank</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
