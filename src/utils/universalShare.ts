import { CdOpsPromotionalAd } from '../types';
import { getCountryTransitSpecs } from '../data/promotionalAds';

export type CountryTransitSpec = ReturnType<typeof getCountryTransitSpecs>;

export interface UniversalShareMetadata {
  title: string;
  text: string;
  url: string;
  fullShareText: string;
  filename: string;
  imageSrc: string;
  adHeadline: string;
  adDescription: string;
}

export type UniversalShareOutcome = 'shared' | 'shared_with_media' | 'cancelled' | 'fallback';

function clampAdText(input: string, maxLen: number): string {
  const clean = input.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen - 1).trimEnd();
}

export function buildUniversalShareMetadata(params: {
  ad: Pick<CdOpsPromotionalAd, 'title' | 'tagline' | 'summary'>;
  transitSpec: CountryTransitSpec;
  pillarKey: string;
  socialPostText: string;
  imageSrc: string;
}): UniversalShareMetadata {
  const { ad, transitSpec, pillarKey, socialPostText, imageSrc } = params;
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://civicduty.site';

  const url = `${origin}/?country=${encodeURIComponent(transitSpec.countryCode)}&campaign=${encodeURIComponent(pillarKey)}`;
  const title = `${ad.title} · CivicDuty ${transitSpec.countryCode}`;
  const adHeadline = clampAdText(`CivicDuty ${transitSpec.countryCode}: ${transitSpec.scoutTabLabel}`, 30);
  const adDescription = clampAdText(
    `${ad.tagline}. Access via ${transitSpec.ussdCode} or web to ${transitSpec.municipalAuthority}.`,
    90
  );
  const cleanPostText = socialPostText.trim();
  const fullShareText = cleanPostText.includes(url) ? cleanPostText : `${cleanPostText}\n\n${url}`;
  const filename = `civicduty-${pillarKey}-${transitSpec.countryCode.toLowerCase()}-campaign-poster.jpg`;

  return {
    title,
    text: cleanPostText,
    url,
    fullShareText,
    filename,
    imageSrc,
    adHeadline,
    adDescription,
  };
}

async function fetchPosterFileQuickly(imageSrc: string, filename: string, timeoutMs = 450): Promise<File | null> {
  if (!imageSrc || typeof fetch !== 'function' || typeof File === 'undefined') return null;

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const response = await fetch(imageSrc, controller ? { signal: controller.signal } : undefined);
    if (!response.ok) return null;
    const blob = await response.blob();
    if (!blob || blob.size === 0) return null;
    return new File([blob], filename, { type: blob.type || 'image/jpeg' });
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Triggers the native Web Share API (`navigator.share`) for cross-platform sharing
 * across social apps, messaging platforms, and ad network tools.
 * Gracefully falls back to clipboard + in-app Social & Google Ads Share Hub
 * when running in desktop browsers or sandboxed iframes without Web Share API support.
 */
export async function triggerUniversalWebShare(
  metadata: UniversalShareMetadata
): Promise<UniversalShareOutcome> {
  const nav = typeof navigator !== 'undefined' ? (navigator as Navigator & {
    share?: (data: ShareData) => Promise<void>;
    canShare?: (data?: ShareData) => boolean;
  }) : null;

  if (nav && typeof nav.share === 'function') {
    try {
      // Attempt native media + link share if supported and poster resolves within user-gesture window
      if (typeof nav.canShare === 'function' && metadata.imageSrc) {
        const posterFile = await fetchPosterFileQuickly(metadata.imageSrc, metadata.filename);
        if (posterFile) {
          const mediaPayload: ShareData = {
            title: metadata.title,
            text: metadata.text,
            url: metadata.url,
            files: [posterFile],
          };
          if (nav.canShare(mediaPayload)) {
            try {
              await nav.share(mediaPayload);
              return 'shared_with_media';
            } catch (mediaErr: unknown) {
              if ((mediaErr as Error)?.name === 'AbortError') {
                return 'cancelled';
              }
              // Fall through to link + text share below
            }
          }
        }
      }

      await nav.share({
        title: metadata.title,
        text: metadata.text,
        url: metadata.url,
      });
      return 'shared';
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') {
        return 'cancelled';
      }
      // Browser/iframe blocked or unsupported share payload -> fall through to fallback
    }
  }

  try {
    await navigator.clipboard?.writeText(metadata.fullShareText);
  } catch {
    // Clipboard access may be unavailable in non-focused contexts; still open fallback drawer
  }

  return 'fallback';
}
