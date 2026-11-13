import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Megaphone,
  FileSpreadsheet,
  Smartphone,
  Globe,
  Mail,
} from 'lucide-react';
import { CdOpsPromotionalAd } from '../types';
import { getCountryTransitSpecs } from '../data/promotionalAds';
import {
  buildUniversalShareMetadata,
  triggerUniversalWebShare,
  CountryTransitSpec,
} from '../utils/universalShare';

interface CampaignSharePanelProps {
  ad: CdOpsPromotionalAd;
  transitSpec: CountryTransitSpec;
  pillarKey: string;
  imageSrc: string;
  socialPostText: string;
  onDownloadPoster: (e?: React.MouseEvent) => void;
  onDownloadSvg?: () => void;
  onNotify?: (msg: string, tone?: 'emerald' | 'amber' | 'teal' | 'rose') => void;
}

function clampText(input: string, maxLen: number): string {
  const clean = input.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen - 1).trimEnd();
}

function escapeCsvCell(value: string): string {
  const safe = value.replace(/"/g, '""');
  return `"${safe}"`;
}

export const CampaignSharePanel: React.FC<CampaignSharePanelProps> = ({
  ad,
  transitSpec,
  pillarKey,
  imageSrc,
  socialPostText,
  onDownloadPoster,
  onDownloadSvg,
  onNotify,
}) => {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedGoogleAds, setCopiedGoogleAds] = useState(false);

  const shareMetadata = buildUniversalShareMetadata({
    ad,
    transitSpec,
    pillarKey,
    socialPostText,
    imageSrc,
  });
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://civicduty.site';
  const campaignUrl = shareMetadata.url;
  const shareTitle = shareMetadata.title;
  const fullShareText = shareMetadata.fullShareText;

  // Google Ads strictly enforces 30-char Headlines and 90-char Long Headlines / Descriptions
  const googleHeadline1 = clampText(`CivicDuty ${transitSpec.countryCode} Watchdog`, 30);
  const googleHeadline2 = clampText(`Dial ${transitSpec.ussdCode} Free Alerts`, 30);
  const googleHeadline3 = clampText(`Verify ${transitSpec.countryName} Works`, 30);
  const googleLongHeadline = clampText(ad.title, 90);
  const googleDescription1 = clampText(
    `${ad.tagline}. Report hazards & public service gaps to ${transitSpec.municipalAuthority}.`,
    90
  );
  const googleDescription2 = clampText(
    `Citizen-verified accountability in ${transitSpec.countryName}. Access via ${transitSpec.ussdCode} or web.`,
    90
  );
  const googleKeywords = [
    `civic accountability ${transitSpec.countryName}`,
    `report road pothole ${transitSpec.countryName}`,
    `${transitSpec.stageTransportName} safety`,
    `${transitSpec.municipalAuthority} service status`,
    `CivicDuty ${transitSpec.countryCode}`,
  ];

  const handleCopyCaption = () => {
    navigator.clipboard?.writeText(socialPostText);
    setCopiedCaption(true);
    onNotify?.('Copied ready-to-publish social media caption!', 'emerald');
    setTimeout(() => setCopiedCaption(false), 2200);
  };

  const buildGoogleAdsBriefText = () =>
    [
      `=== GOOGLE ADS CAMPAIGN PACK (${transitSpec.countryName} · ${pillarKey.toUpperCase()}) ===`,
      `Campaign Name: CivicDuty_${transitSpec.countryCode}_${pillarKey}_Frontline_Scouts`,
      `Target Location: ${transitSpec.countryName} (${transitSpec.countryCode})`,
      `Final URL: ${campaignUrl}`,
      ``,
      `Headline 1 (<=30 chars): ${googleHeadline1}`,
      `Headline 2 (<=30 chars): ${googleHeadline2}`,
      `Headline 3 (<=30 chars): ${googleHeadline3}`,
      `Long Headline (<=90 chars): ${googleLongHeadline}`,
      `Description 1 (<=90 chars): ${googleDescription1}`,
      `Description 2 (<=90 chars): ${googleDescription2}`,
      ``,
      `Suggested Search Keywords: ${googleKeywords.join(', ')}`,
      `Display Creative Image: Download 1200x600 poster image from this drawer`,
    ].join('\n');

  const handleCopyGoogleAdsPack = () => {
    navigator.clipboard?.writeText(buildGoogleAdsBriefText());
    setCopiedGoogleAds(true);
    onNotify?.('Copied Google Ads headlines, descriptions & Final URL!', 'emerald');
    setTimeout(() => setCopiedGoogleAds(false), 2400);
  };

  const handleDownloadGoogleAdsCsv = () => {
    const headers = [
      'Campaign',
      'Ad Group',
      'Country Code',
      'Location Target',
      'Headline 1',
      'Headline 2',
      'Headline 3',
      'Long Headline',
      'Description 1',
      'Description 2',
      'Final URL',
      'Keywords',
      'Poster Asset',
    ];
    const row = [
      `CivicDuty_${transitSpec.countryCode}_Frontline_Scouts`,
      `${pillarKey.toUpperCase()}_${transitSpec.countryCode}`,
      transitSpec.countryCode,
      transitSpec.countryName,
      googleHeadline1,
      googleHeadline2,
      googleHeadline3,
      googleLongHeadline,
      googleDescription1,
      googleDescription2,
      campaignUrl,
      googleKeywords.join('; '),
      `${origin}${imageSrc.startsWith('/') ? '' : '/'}${imageSrc}`,
    ];
    const csvContent = `${headers.map(escapeCsvCell).join(',')}\n${row.map(escapeCsvCell).join(',')}\n`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `civicduty-google-ads-${transitSpec.countryCode.toLowerCase()}-${pillarKey}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onNotify?.('Downloaded Google Ads Editor CSV bulk sheet!', 'emerald');
  };

  const handleNativeDeviceShare = async () => {
    const outcome = await triggerUniversalWebShare(shareMetadata);
    if (outcome === 'shared_with_media' || outcome === 'shared') {
      onNotify?.(
        outcome === 'shared_with_media'
          ? 'Shared poster image & campaign link via native Web Share API!'
          : 'Shared campaign via native Web Share API!',
        'emerald'
      );
      return;
    }
    if (outcome === 'fallback') {
      onDownloadPoster();
      onNotify?.(
        'Caption copied & poster downloaded — ready to post on Instagram, TikTok, or Ad Managers!',
        'emerald'
      );
    }
  };

  const socialPlatforms = [
    {
      name: 'X / Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(socialPostText.slice(0, 240))}&url=${encodeURIComponent(campaignUrl)}`,
      badge: 'Post',
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(fullShareText)}`,
      badge: 'Send',
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}&quote=${encodeURIComponent(socialPostText)}`,
      badge: 'Share',
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(campaignUrl)}`,
      badge: 'Post',
    },
    {
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodeURIComponent(campaignUrl)}&text=${encodeURIComponent(socialPostText)}`,
      badge: 'Channel',
    },
    {
      name: 'Threads',
      href: `https://www.threads.net/intent/post?text=${encodeURIComponent(fullShareText.slice(0, 450))}`,
      badge: 'Post',
    },
    {
      name: 'Reddit',
      href: `https://www.reddit.com/submit?url=${encodeURIComponent(campaignUrl)}&title=${encodeURIComponent(shareTitle)}`,
      badge: 'Submit',
    },
    {
      name: 'Email',
      href: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(fullShareText)}`,
      badge: 'Mail',
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Direct Cross-Platform Social Distribution */}
      <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="text-xs font-bold font-mono text-slate-900 dark:text-white flex items-center gap-1.5">
              <Globe size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Share to All Social Media Platforms ({transitSpec.countryName})</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Publish directly with localized copy, {transitSpec.ussdCode}, and campaign link, or use Native Share for Instagram, TikTok, and YouTube.
            </p>
          </div>

          <button
            type="button"
            onClick={handleNativeDeviceShare}
            className="min-h-[40px] px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Smartphone size={13} />
            <span>Universal Web Share (Native)</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {socialPlatforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                navigator.clipboard?.writeText(fullShareText);
                onNotify?.(`Opening ${platform.name} share (caption also copied).`, 'emerald');
              }}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center justify-between gap-2 transition-colors"
            >
              <span className="truncate flex items-center gap-1.5">
                {platform.name === 'Email' ? <Mail size={12} className="text-slate-500 shrink-0" /> : <Share2 size={12} className="text-emerald-600 dark:text-emerald-400 shrink-0" />}
                <span>{platform.name}</span>
              </span>
              <ExternalLink size={12} className="text-slate-400 shrink-0" />
            </a>
          ))}
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300">
              Localized Campaign Copy
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCaption}
                className="min-h-[36px] px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedCaption ? <Check size={12} className="text-emerald-400 dark:text-emerald-600" /> : <Copy size={12} />}
                <span>{copiedCaption ? 'Copied!' : 'Copy Post Text'}</span>
              </button>
              <button
                type="button"
                onClick={() => onDownloadPoster()}
                className="min-h-[36px] px-3 py-1.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download size={12} />
                <span>Poster (.jpg)</span>
              </button>
              {onDownloadSvg && (
                <button
                  type="button"
                  onClick={onDownloadSvg}
                  className="min-h-[36px] px-3 py-1.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download size={12} />
                  <span>Vector (.svg)</span>
                </button>
              )}
            </div>
          </div>

          <pre className="p-3.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] font-sans text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
            {socialPostText}
          </pre>
        </div>
      </div>

      {/* 2. Google Ads Campaign Export & Launch Pack */}
      <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="text-xs font-bold font-mono text-slate-900 dark:text-white flex items-center gap-1.5">
              <Megaphone size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Google Ads Campaign Pack ({transitSpec.countryCode})</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Pre-formatted 30-char Headlines, 90-char Descriptions, Display Poster &amp; CSV import for Google Search, Display, or Performance Max Ads.
            </p>
          </div>

          <a
            href="https://ads.google.com/aw/campaigns/new"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              navigator.clipboard?.writeText(buildGoogleAdsBriefText());
              onNotify?.('Google Ads Asset Pack copied! Opening Google Ads Campaign Studio.', 'emerald');
            }}
            className="min-h-[40px] px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-xs"
          >
            <span>Open Google Ads</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
            <div className="text-[10px] font-mono uppercase text-slate-500">Headlines (max 30 chars)</div>
            <div className="font-semibold text-slate-900 dark:text-white">1. {googleHeadline1}</div>
            <div className="font-semibold text-slate-900 dark:text-white">2. {googleHeadline2}</div>
            <div className="font-semibold text-slate-900 dark:text-white">3. {googleHeadline3}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
            <div className="text-[10px] font-mono uppercase text-slate-500">Descriptions (max 90 chars)</div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">{googleDescription1}</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">{googleDescription2}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={handleDownloadGoogleAdsCsv}
            className="min-h-[40px] px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileSpreadsheet size={13} />
            <span>Download Google Ads CSV</span>
          </button>

          <button
            type="button"
            onClick={handleCopyGoogleAdsPack}
            className="min-h-[40px] px-3.5 py-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            {copiedGoogleAds ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            <span>{copiedGoogleAds ? 'Google Ads Pack Copied!' : 'Copy Google Ads Asset Pack'}</span>
          </button>

          <button
            type="button"
            onClick={() => onDownloadPoster()}
            className="min-h-[40px] px-3.5 py-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download size={13} />
            <span>Download 1200×600 Display Ad</span>
          </button>
        </div>
      </div>
    </div>
  );
};
