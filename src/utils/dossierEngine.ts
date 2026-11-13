import { Post, CountryCode, CompiledWitnessReport } from '../types';
import { getPostGrassroots, stripDecorativeEmojis } from './helpers';

export interface DossierSubmissionItem {
  id: string;
  isLead: boolean;
  rankLabel: string;
  title: string;
  body: string;
  citizen_name: string;
  author_profession: string;
  anonymous: boolean;
  source: 'web' | 'sms' | 'ussd';
  created_at: string;
  gps?: { lat: string; lng: string } | null;
  media?: Post['media'];
  likes: number;
}

/**
 * Deterministic fallback baseline likes for seed dossier submissions so
 * ties break cleanly toward Lead initially, while 1 viewer like promotes
 * a close runner-up witness directly into the Featured Main Post slot.
 */
function defaultSubmissionLikes(post: Post, isLead: boolean, witnessIdx: number): number {
  const base = Math.max(8, Math.min(28, Math.round((post.upvotes || 40) / 14)));
  if (isLead) return base;
  if (witnessIdx === 0) return base; // 1 tap overtakes Lead immediately
  return Math.max(3, base - witnessIdx * 3);
}

export function getDossierCompiledCount(post: Post): number {
  return Math.max(
    post.compiled_count || 1,
    (post.compiled_reports?.length || 0) + 1
  );
}

export function isMasterDossierPost(post: Post): boolean {
  return Boolean(
    post.is_master_dossier ||
      (post.compiled_reports && post.compiled_reports.length > 0) ||
      (post.compiled_count && post.compiled_count > 1)
  );
}

/**
 * Builds the normalized list of all submissions inside a Master Dossier
 * (Lead Filing + Corroborating Witness Reports) sorted by viewer likes desc.
 */
export function getRankedDossierSubmissions(post: Post): DossierSubmissionItem[] {
  const grassroots = getPostGrassroots(post.country, post);
  const leadLikes =
    typeof post.lead_likes === 'number'
      ? post.lead_likes
      : defaultSubmissionLikes(post, true, -1);

  const leadItem: DossierSubmissionItem = {
    id: 'lead',
    isLead: true,
    rankLabel: 'Lead Filing',
    title: stripDecorativeEmojis(post.title || 'Primary Incident Filing'),
    body: stripDecorativeEmojis(post.body || ''),
    citizen_name: post.anonymous ? 'Verified Citizen' : post.citizen_name || 'Citizen Reporter',
    author_profession: post.author_profession || post.citizen_rank || `${grassroots.parish} Resident`,
    anonymous: Boolean(post.anonymous),
    source: post.source || 'web',
    created_at: post.created_at,
    gps: post.gps || null,
    media: post.media || [],
    likes: leadLikes,
  };

  const witnessItems: DossierSubmissionItem[] = (post.compiled_reports || []).map((wr: CompiledWitnessReport, idx: number) => {
    const likes =
      typeof wr.likes === 'number'
        ? wr.likes
        : defaultSubmissionLikes(post, false, idx);
    const derivedTitle =
      wr.title?.trim() ||
      `${wr.author_profession || 'Witness'} Field Corroboration (#${idx + 2})`;
    return {
      id: wr.id || `wr-fallback-${idx}`,
      isLead: false,
      rankLabel: `Witness #${idx + 2}`,
      title: stripDecorativeEmojis(derivedTitle),
      body: stripDecorativeEmojis(wr.body || ''),
      citizen_name: wr.anonymous ? 'Verified Citizen' : wr.citizen_name || `Witness #${idx + 2}`,
      author_profession: wr.author_profession || 'Community Witness',
      anonymous: Boolean(wr.anonymous),
      source: wr.source || 'web',
      created_at: wr.created_at || post.created_at,
      gps: wr.gps || null,
      media: wr.media || [],
      likes,
    };
  });

  const combined = [leadItem, ...witnessItems];

  return combined.sort((a, b) => {
    if (b.likes !== a.likes) return b.likes - a.likes;
    // If equal likes and one explicitly matches featured_submission_id, keep stable
    if (post.featured_submission_id) {
      if (a.id === post.featured_submission_id && b.id !== post.featured_submission_id) return -1;
      if (b.id === post.featured_submission_id && a.id !== post.featured_submission_id) return 1;
    }
    if (a.isLead !== b.isLead) return a.isLead ? -1 : 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export function getDossierTotalLikes(post: Post): number {
  return getRankedDossierSubmissions(post).reduce((sum, item) => sum + item.likes, 0);
}

/**
 * Selects and ranks Master Dossiers for the active jurisdiction by total engagement
 * (submission likes + lead corroborations) so the most-engaged story stays in front.
 */
export function selectFrontpageMasterDossiers(posts: Post[], country: CountryCode): Post[] {
  const countryCode = country.toUpperCase();
  const candidates = posts.filter(
    (p) => (p.country || 'UG').toUpperCase() === countryCode && isMasterDossierPost(p)
  );

  return [...candidates].sort((a, b) => {
    const aRanked = getRankedDossierSubmissions(a);
    const bRanked = getRankedDossierSubmissions(b);
    const aTopLikes = aRanked[0]?.likes || 0;
    const bTopLikes = bRanked[0]?.likes || 0;
    const aScore = aTopLikes * 5 + getDossierTotalLikes(a) + (a.upvotes || 0);
    const bScore = bTopLikes * 5 + getDossierTotalLikes(b) + (b.upvotes || 0);
    return bScore - aScore;
  });
}

/**
 * Builds a clean printable / shareable plaintext dossier briefing for journalists,
 * oversight committees, or community noticeboards.
 */
export function buildDossierDigestText(post: Post, authorityLabel: string): string {
  const ranked = getRankedDossierSubmissions(post);
  const featured = ranked[0];
  const count = getDossierCompiledCount(post);
  const lines = [
    `CIVICDUTY MASTER DOSSIER BRIEFING #${post.id.slice(-6).toUpperCase()}`,
    `Jurisdiction: ${post.country} · Escalation Authority: ${authorityLabel}`,
    `Location: ${post.location || 'Verified Field Site'}`,
    `Status: ${(post.gov_status || post.status).toUpperCase()} · Compiled Witnesses: ${count}`,
    post.crypto_seal_hash ? `Cryptographic Seal: ${post.crypto_seal_hash}` : '',
    '',
    `FEATURED MAIN STORY (${featured.likes} likes · ${featured.rankLabel}):`,
    `${featured.title}`,
    `${featured.citizen_name} (${featured.author_profession}) · via ${featured.source.toUpperCase()}`,
    `${featured.body}`,
    '',
    `ALL RANKED SUBMISSIONS (${ranked.length}):`,
    ...ranked.map(
      (item, idx) =>
        `${idx + 1}. [${item.likes} likes] ${item.rankLabel} — ${item.citizen_name} (${item.author_profession}, ${item.source.toUpperCase()}): ${item.body}`
    ),
  ].filter((l) => l !== undefined);

  return lines.join('\n');
}
