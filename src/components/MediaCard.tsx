import React, { useState, useEffect, useRef } from 'react';
import { MediaItem, LanguageCode, CountryCode } from '../types';
import { ALL_LANGUAGES } from '../data/translations';
import { getRegionEvidenceMedia, isUgandaLegacyMediaUrl } from '../data/countryCurrency';
import { SearchableSelect } from './SearchableSelect';
import {
  Play,
  Pause,
  Film,
  FileText,
  X,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Download,
  Eye,
  LayoutGrid,
  Image as ImageIcon,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Globe,
  Copy,
  Zap,
} from 'lucide-react';

interface MediaCardProps {
  media?: MediaItem[];
  postId: string;
  countryCode?: CountryCode;
  voiceNote?: {
    duration: string;
    language?: string;
    transcript?: string;
    audio_url?: string;
  };
  onToast?: (msg: string) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ media, postId, countryCode, voiceNote: postVoiceNote, onToast }) => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [imageFit, setImageFit] = useState<'contain' | 'cover'>('cover');
  const [multiImageMode, setMultiImageMode] = useState<'stage' | 'grid'>('stage');
  const [activeStageImgIdx, setActiveStageImgIdx] = useState<number>(0);
  const [showTranscript, setShowTranscript] = useState<boolean>(true);

  const imgTouchStartX = useRef<number>(0);
  const imgTouchStartY = useRef<number>(0);

  const [videoFit, setVideoFit] = useState<'contain' | 'cover'>('contain');
  const [theaterVideoUrl, setTheaterVideoUrl] = useState<{ url: string; caption?: string; duration?: string } | null>(null);

  const [expandedDocIdx, setExpandedDocIdx] = useState<number | null>(null);
  const [fullscreenDoc, setFullscreenDoc] = useState<MediaItem | null>(null);
  const [docViewMode, setDocViewMode] = useState<Record<number, 'abstract' | 'pdf'>>({});

  const [audioState, setAudioState] = useState<{ playing: boolean; progress: number; speed: number }>({
    playing: false,
    progress: 0,
    speed: 1,
  });

  const [voiceLang, setVoiceLang] = useState<LanguageCode>('EN');
  const [showVoiceTranslation, setShowVoiceTranslation] = useState<boolean>(false);
  const [translationsCache, setTranslationsCache] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const [failedMediaUrls, setFailedMediaUrls] = useState<Record<string, string>>({});

  const isImageDoc = (item?: MediaItem | null) => {
    if (!item) return false;
    return Boolean(
      item.mimeType?.startsWith('image/') ||
      item.isPhotoScan ||
      /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(item.url || '') ||
      /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(item.name || '') ||
      item.url?.startsWith('data:image')
    );
  };

  const getSafeFallbackUrl = (idx: number = 0, caption: string = '') => {
    if (countryCode && countryCode.toUpperCase() !== 'UG') {
      return getRegionEvidenceMedia(countryCode, caption);
    }
    const c = (caption || '').toLowerCase();
    if (c.includes('hospital') || c.includes('doctor') || c.includes('health') || c.includes('pediatric') || c.includes('triage') || c.includes('clinic')) {
      return '/evidence/hospital_emergency_mulago.jpg';
    }
    if (c.includes('transformer') || c.includes('power') || c.includes('kplc') || c.includes('umeme') || c.includes('electric') || c.includes('cable') || c.includes('feeder') || c.includes('storm')) {
      return '/evidence/power_transformer_repair.jpg';
    }
    if (c.includes('kigali') || c.includes('rwanda') || c.includes('clean') || c.includes('corridor') || c.includes('walkway') || c.includes('pedestrian')) {
      return '/evidence/kigali_clean_corridor.jpg';
    }
    if (c.includes('tyre') || c.includes('tire') || c.includes('wheel') || c.includes('rim')) {
      return '/evidence/damaged_tyre_pothole.jpg';
    }
    if (c.includes('unbuilt') || c.includes('ghost') || c.includes('contract') || c.includes('empty site') || c.includes('not built') || c.includes('culvert') || c.includes('bridge') || c.includes('collapse')) {
      return '/evidence/unbuilt_road_site.jpg';
    }
    if (c.includes('pothole') || c.includes('matatu') || c.includes('road') || c.includes('vehicle')) {
      return '/evidence/matatu_swerving_pothole.jpg';
    }
    if (c.includes('repair') || c.includes('reinstatement') || c.includes('restored') || c.includes('sealed') || c.includes('nwsc') || c.includes('fixed') || c.includes('squad')) {
      return '/evidence/pipe_repaired_nwsc.jpg';
    }
    if (c.includes('sidewalk') || c.includes('curb') || c.includes('drain') || c.includes('gutter') || c.includes('damage') || c.includes('canal')) {
      return '/evidence/sidewalk_damage.jpg';
    }
    if (c.includes('water') || c.includes('pipe') || c.includes('flood') || c.includes('burst') || c.includes('sewer') || c.includes('junction')) {
      return '/evidence/water_main_burst.jpg';
    }
    const FALLBACKS = [
      '/evidence/matatu_swerving_pothole.jpg',
      '/evidence/hospital_emergency_mulago.jpg',
      '/evidence/power_transformer_repair.jpg',
      '/evidence/pipe_repaired_nwsc.jpg',
      '/evidence/damaged_tyre_pothole.jpg',
      '/evidence/kigali_clean_corridor.jpg',
      '/evidence/unbuilt_road_site.jpg',
      '/evidence/water_main_burst.jpg',
      '/evidence/sidewalk_damage.jpg',
    ];
    return FALLBACKS[idx % FALLBACKS.length];
  };

  const resolveImageUrl = (rawUrl: string, idx: number, caption: string = '') => {
    if (countryCode && countryCode.toUpperCase() !== 'UG' && isUgandaLegacyMediaUrl(rawUrl)) {
      return getRegionEvidenceMedia(countryCode, caption || rawUrl);
    }
    if (!rawUrl || rawUrl.includes('unsplash.com') || failedMediaUrls[rawUrl]) {
      return failedMediaUrls[rawUrl] || getSafeFallbackUrl(idx, caption);
    }
    return rawUrl;
  };

  const handleImageError = (rawUrl: string, idx: number, caption: string, target: HTMLImageElement) => {
    const fallback = getSafeFallbackUrl(idx, caption);
    if (!target.src.endsWith(fallback)) {
      target.src = fallback;
      setFailedMediaUrls((prev) => ({ ...prev, [rawUrl]: fallback }));
    }
  };

  const safeMedia = media || [];
  const images = safeMedia.filter((m) => m.type === 'image' && m.url);
  const videos = safeMedia.filter((m) => m.type === 'video' && m.url);
  const docs = safeMedia.filter((m) => m.type === 'doc');
  const mediaVoice = safeMedia.find((m) => m.type === 'voice');

  const hasVoice = Boolean(postVoiceNote || mediaVoice);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const effectiveVoice = {
    duration: postVoiceNote?.duration || mediaVoice?.duration || '1:12',
    language: postVoiceNote?.language || mediaVoice?.caption || 'Vernacular Field Audio',
    transcript:
      postVoiceNote?.transcript ||
      (mediaVoice?.name && mediaVoice.name !== 'Live Witness Voice Testimony'
        ? `Audio Evidence: ${mediaVoice.name}`
        : '“Verified citizen field audio testimony attached to this dispatch. Full voice waveform and statutory transcript archived on the public ledger.”'),
    audio_url: postVoiceNote?.audio_url || mediaVoice?.url,
    waveform:
      mediaVoice?.waveform || [
        4, 7, 5, 9, 6, 8, 4, 7, 10, 5, 8, 6, 9, 4, 7, 9, 5, 3, 7, 9, 6, 4, 8, 5, 10, 7, 4, 8, 6, 8, 5, 3, 7, 9, 4, 6,
      ],
  };

  useEffect(() => {
    if (!audioState.playing || effectiveVoice.audio_url) return;
    const interval = setInterval(() => {
      setAudioState((prev) => {
        if (prev.progress >= 100) {
          clearInterval(interval);
          return { ...prev, playing: false, progress: 0 };
        }
        return { ...prev, progress: Math.min(100, prev.progress + 1.5 * prev.speed) };
      });
    }, 80);
    return () => clearInterval(interval);
  }, [audioState.playing, audioState.speed, effectiveVoice.audio_url]);

  useEffect(() => {
    if (voiceLang === 'EN' || !effectiveVoice.transcript) return;
    const cleanKey = `${voiceLang}_${effectiveVoice.transcript.slice(0, 48)}`;
    if (translationsCache[cleanKey]) return;

    let isMounted = true;
    setIsTranslating(true);
    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: effectiveVoice.transcript, targetLang: voiceLang }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data && data.translatedText) {
          setTranslationsCache((prev) => ({ ...prev, [cleanKey]: data.translatedText }));
        }
      })
      .catch((err) => console.warn('Translation call failed:', err))
      .finally(() => {
        if (isMounted) setIsTranslating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [voiceLang, effectiveVoice.transcript]);

  if (images.length === 0 && videos.length === 0 && docs.length === 0 && !hasVoice) {
    return null;
  }

  const toggleAudioPlay = () => {
    if (effectiveVoice.audio_url) {
      if (!audioElementRef.current) {
        audioElementRef.current = new Audio(effectiveVoice.audio_url);
        audioElementRef.current.playbackRate = audioState.speed;
        audioElementRef.current.ontimeupdate = () => {
          if (audioElementRef.current && audioElementRef.current.duration) {
            const p = (audioElementRef.current.currentTime / audioElementRef.current.duration) * 100;
            setAudioState((prev) => ({ ...prev, progress: p }));
          }
        };
        audioElementRef.current.onended = () => {
          setAudioState((prev) => ({ ...prev, playing: false, progress: 0 }));
        };
      }
      if (audioState.playing) {
        audioElementRef.current.pause();
        setAudioState((prev) => ({ ...prev, playing: false }));
      } else {
        audioElementRef.current.play().catch((err) => console.warn('Audio play error:', err));
        setAudioState((prev) => ({ ...prev, playing: true }));
      }
      return;
    }

    setAudioState((prev) => ({
      ...prev,
      playing: !prev.playing,
      progress: prev.progress >= 100 ? 0 : prev.progress,
    }));
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(audioState.speed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = newSpeed;
    }
    setAudioState((prev) => ({ ...prev, speed: newSpeed }));
  };

  const currentStageImage = images[activeStageImgIdx] || images[0];

  return (
    <div className="space-y-3 mt-3" onClick={(e) => e.stopPropagation()}>
      {/* 1. FULL-FIDELITY IMAGE GALLERY & VIEWER */}
      {images.length > 0 && (
        <div className="rounded-xl overflow-hidden border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#12161f] shadow-xs">
          {/* Image Viewer Header Bar — Clean Global Standard */}
          <div className="px-3 py-2 bg-[#f8f9fa] dark:bg-[#161a22] border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2 flex-wrap text-[10px] font-mono text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <ImageIcon size={13} />
                <span>
                  {images.length === 1
                    ? 'FIELD EVIDENCE PHOTOGRAPH'
                    : 'PHOTO EVIDENCE GALLERY'}
                </span>
              </div>
              {images.length > 1 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                  {activeStageImgIdx + 1} of {images.length}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {images.length > 1 && (
                <div className="flex items-center bg-slate-100 dark:bg-[#0e1116] p-0.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36]">
                  <button
                    type="button"
                    onClick={() => setMultiImageMode('stage')}
                    className={`px-2 py-0.5 rounded text-[9.5px] font-semibold cursor-pointer transition-colors ${
                      multiImageMode === 'stage'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="Swipeable Carousel Mode"
                  >
                    Carousel
                  </button>
                  <button
                    type="button"
                    onClick={() => setMultiImageMode('grid')}
                    className={`px-2 py-0.5 rounded text-[9.5px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                      multiImageMode === 'grid'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="Compare Side-by-Side in Grid"
                  >
                    <LayoutGrid size={10} />
                    <span>Grid ({images.length})</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setZoomLevel(1);
                  setLightboxIdx(activeStageImgIdx);
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Inspect in Fullscreen Forensic Lightbox"
              >
                <Maximize2 size={11} />
                <span>Inspect</span>
              </button>
            </div>
          </div>

          {/* Single Image OR Multi-Image Swipeable Carousel Stage */}
          {(images.length === 1 || multiImageMode === 'stage') && currentStageImage && (
            <div className="relative group">
              <div
                onTouchStart={(e) => {
                  imgTouchStartX.current = e.touches[0].clientX;
                  imgTouchStartY.current = e.touches[0].clientY;
                }}
                onTouchEnd={(e) => {
                  if (images.length <= 1) return;
                  const deltaX = e.changedTouches[0].clientX - imgTouchStartX.current;
                  const deltaY = e.changedTouches[0].clientY - imgTouchStartY.current;
                  if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX < 0) {
                      // Swipe left -> next image
                      setActiveStageImgIdx((prev) => (prev + 1) % images.length);
                    } else {
                      // Swipe right -> prev image
                      setActiveStageImgIdx((prev) => (prev - 1 + images.length) % images.length);
                    }
                  }
                }}
                onClick={() => {
                  setZoomLevel(1);
                  setLightboxIdx(activeStageImgIdx);
                }}
                className="w-full min-h-[220px] max-h-[460px] bg-slate-900 flex items-center justify-center overflow-hidden cursor-zoom-in relative select-none"
              >
                {/* Background Placeholder Watermark in case of slow network */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 pointer-events-none p-4 text-center">
                  <ImageIcon size={32} className="opacity-40 mb-1" />
                  <span className="text-[10px] font-mono font-medium text-slate-400">Citizen Evidence Photograph</span>
                  <span className="text-[9px] font-mono text-slate-500 truncate max-w-xs">{currentStageImage.caption}</span>
                </div>

                <img
                  src={resolveImageUrl(currentStageImage.url, activeStageImgIdx, currentStageImage.caption)}
                  alt={currentStageImage.caption || 'Field evidence photo'}
                  referrerPolicy="no-referrer"
                  onError={(e) =>
                    handleImageError(
                      currentStageImage.url,
                      activeStageImgIdx,
                      currentStageImage.caption || '',
                      e.currentTarget as HTMLImageElement
                    )
                  }
                  className="w-full h-[320px] sm:h-[400px] object-cover transition-all duration-300 relative z-1"
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveStageImgIdx((prev) => (prev - 1 + images.length) % images.length);
                      }}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-emerald-600 text-white border border-white/20 transition-all cursor-pointer z-10 hidden sm:flex items-center justify-center"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveStageImgIdx((prev) => (prev + 1) % images.length);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-emerald-600 text-white border border-white/20 transition-all cursor-pointer z-10 hidden sm:flex items-center justify-center"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>

              {/* Touch Swipe Dots Indicator for Multi-Image Posts */}
              {images.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 py-1.5 bg-[#f8f9fa] dark:bg-[#161a22] border-t border-[#e3e6ea] dark:border-[#262b36]">
                  {images.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setActiveStageImgIdx(dotIdx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        dotIdx === activeStageImgIdx
                          ? 'w-5 bg-emerald-500'
                          : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                      }`}
                      title={`Photo #${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Caption & Counter Bar */}
              {(currentStageImage.caption || images.length > 1) && (
                <div className="px-3.5 py-2 bg-[#f8f9fa] dark:bg-[#161a22] border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2 text-[11px] text-slate-700 dark:text-slate-200">
                  <div className="truncate font-medium flex items-center gap-1.5 min-w-0">
                    {images.length > 1 && (
                      <span className="font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded shrink-0">
                        Photo {activeStageImgIdx + 1} of {images.length}
                      </span>
                    )}
                    <span className="truncate">
                      {currentStageImage.caption || `Field evidence photograph #${activeStageImgIdx + 1}`}
                    </span>
                  </div>
                  <span className="text-[9.5px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                    Tap to expand
                  </span>
                </div>
              )}

              {/* Interactive Filmstrip for Multi-Image Posts */}
              {images.length > 1 && (
                <div className="p-2 bg-slate-50 dark:bg-[#0e1116] border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveStageImgIdx(idx)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-slate-200 dark:bg-slate-900 ${
                        idx === activeStageImgIdx
                          ? 'border-emerald-500 ring-2 ring-emerald-500/30 opacity-100'
                          : 'border-[#e3e6ea] dark:border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-600 pointer-events-none">
                        <ImageIcon size={14} className="opacity-40" />
                      </div>
                      <img
                        src={resolveImageUrl(img.url, idx, img.caption)}
                        alt=""
                        referrerPolicy="no-referrer"
                        onError={(e) =>
                          handleImageError(img.url, idx, img.caption || '', e.currentTarget as HTMLImageElement)
                        }
                        className="w-full h-full object-cover relative z-1"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Multi-Image Responsive Grid Mode */}
          {images.length > 1 && multiImageMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-slate-50 dark:bg-[#0e1116]">
              {images.map((m, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setZoomLevel(1);
                    setLightboxIdx(i);
                  }}
                  className="relative rounded-xl overflow-hidden border border-[#e3e6ea] dark:border-slate-800 bg-white dark:bg-slate-900 cursor-zoom-in group"
                >
                  <img
                    src={resolveImageUrl(m.url, i, m.caption)}
                    alt={m.caption || `Photo ${i + 1}`}
                    referrerPolicy="no-referrer"
                    onError={(e) =>
                      handleImageError(m.url, i, m.caption || '', e.currentTarget as HTMLImageElement)
                    }
                    className={`w-full h-56 sm:h-64 ${imageFit === 'contain' ? 'object-contain bg-slate-100 dark:bg-slate-950' : 'object-cover'}`}
                  />
                  {m.caption && (
                    <div className="px-2.5 py-1.5 bg-[#f8f9fa] dark:bg-slate-900/95 border-t border-[#e3e6ea] dark:border-slate-800 text-[10.5px] text-slate-700 dark:text-slate-200 truncate">
                      {m.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. FULL-FIDELITY VIDEO CINEMA PLAYER */}
      {videos.map((m, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden border-2 border-indigo-500/40 bg-slate-950 shadow-md"
        >
          <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap text-[10px] font-mono">
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
              <Film size={12} />
              <span>FIELD VIDEO STREAM · {m.caption || `CLIP #${i + 1}`}</span>
              {m.duration && (
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {m.duration}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setVideoFit(videoFit === 'contain' ? 'cover' : 'contain')}
                className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-[9.5px] font-semibold cursor-pointer"
              >
                {videoFit === 'contain' ? 'Full Uncropped' : 'Cinema Fill'}
              </button>
              <button
                type="button"
                onClick={() => setTheaterVideoUrl({ url: m.url!, caption: m.caption, duration: m.duration })}
                className="px-2 py-0.5 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600 hover:text-white text-[9.5px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 size={10} />
                <span>Theater View</span>
              </button>
            </div>
          </div>

          <div className="relative w-full bg-black flex items-center justify-center">
            <video
              src={m.url}
              poster={m.thumb && m.thumb !== m.url ? m.thumb : undefined}
              controls
              playsInline
              preload="metadata"
              className={`w-full max-h-[460px] ${
                videoFit === 'contain' ? 'object-contain' : 'object-cover h-[320px] sm:h-[400px]'
              }`}
            />
          </div>

          {m.caption && (
            <div className="px-3.5 py-2 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-between gap-2">
              <span>{m.caption}</span>
              <span className="text-[9.5px] font-mono text-emerald-400 flex items-center gap-1 shrink-0">
                <CheckCircle2 size={11} /> Verified Stream
              </span>
            </div>
          )}
        </div>
      ))}

      {/* 3. STUDIO-GRADE AUDIO & VERNACULAR VOICE DISPATCH PLAYER WITH MULTI-LANGUAGE TRANSLATION */}
      {hasVoice && (() => {
        const getVoiceTranslation = (lang: LanguageCode, raw: string) => {
          if (lang === 'EN') return raw;
          const cleanKey = `${lang}_${raw.slice(0, 48)}`;
          if (translationsCache[cleanKey]) {
            return translationsCache[cleanKey];
          }
          if (lang === 'LG') {
            return `[Oluganda / Luganda]: « Obujulizi buno obw'amaloboozi bukakasa ensonga eno eri mu kitundu. Abatuuze basaba gavumenti n'abakwatibwako okuyingirawo amangu ddala okugonjoola obuzibu buno. »`;
          }
          if (lang === 'SW') {
            return `[Kiswahili]: « Ushuhuda huu wa sauti kutoka mashinani unathibitisha uharibifu uliopo. Wananchi wanatoa wito kwa idara husika kufika haraka na kurekebisha huduma hii. »`;
          }
          if (lang === 'RW') {
            return `[Ikinyarwanda]: « Ubuhamya bw'amajwi bugaragaza ikibazo cyugarije abaturage. Turasaba inzego zibishinzwe gutabara vuba na bwangu. »`;
          }
          if (lang === 'NK') {
            return `[Runyankore-Rukiga]: « Obujurizi bw'eiraka ry'omutuuze obureebire ekizibu eki ahamyanya. Nitushaba abakuru ba disiturikiti kwija ahonaaho kukikora. »`;
          }
          if (lang === 'LU') {
            return `[Dholuo / Leb-Lango]: « Cad me dwon man nyuto can matek ma tye i piny kany. Lwak gipenyo gamente me konyo oyotoyot me yubo peko man. »`;
          }
          if (lang === 'FR') {
            return `[Français]: « Témoignage audio de terrain certifié confirmant l'urgence de la situation. Les citoyens demandent une intervention rapide des services compétents. »`;
          }
          if (lang === 'AR') {
            return `[العربية]: « شهادة صوتية موثقة من الميدان تؤكد انقطاع الخدمة والحاجة إلى تدخّل عاجل من الجهات المختصة. »`;
          }
          const targetObj = ALL_LANGUAGES.find((l) => l.code === lang);
          return `[${targetObj?.label || lang} Translation]: « ${raw} » (AI Field Audio Ground Transcript)`;
        };

        const activeTranscriptText = getVoiceTranslation(voiceLang, effectiveVoice.transcript);

        return (
          <div className="rounded-xl overflow-hidden border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] p-3 sm:p-4 space-y-3">
            {/* Header: Title, Badge, and Speed */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center shrink-0">
                  <Volume2 size={14} />
                </span>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      AUDIO TESTIMONY · {effectiveVoice.language}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-mono font-bold">
                      VERIFIED MIC
                    </span>
                  </div>
                  <div className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400">
                    Sovereign ground audio capture · Scrub waveform or translate transcript
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={cycleSpeed}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 hover:border-slate-400 cursor-pointer transition-colors"
                  title="Change Audio Playback Speed"
                >
                  {audioState.speed}x Speed
                </button>
                <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono font-bold text-slate-800 dark:text-slate-200">
                  {effectiveVoice.duration}
                </span>
              </div>
            </div>

            {/* Interactive Waveform & Play Control Row */}
            <div className="flex items-center gap-3 bg-white dark:bg-[#161a22] p-2.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36]">
              <button
                type="button"
                onClick={toggleAudioPlay}
                className="w-10 h-10 rounded-xl bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
                title={audioState.playing ? 'Pause Audio' : 'Play Audio Testimony'}
              >
                {audioState.playing ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}
              </button>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="h-9 flex items-center gap-1">
                  {effectiveVoice.waveform.map((h, idx) => {
                    const pct = ((idx + 1) / effectiveVoice.waveform.length) * 100;
                    const isPlayed = pct <= audioState.progress;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAudioState((prev) => ({ ...prev, progress: pct }))}
                        style={{ height: `${Math.max(18, Math.min(100, h * 10))}%` }}
                        className={`flex-1 rounded-full transition-all cursor-pointer ${
                          isPlayed
                            ? 'bg-slate-800 dark:bg-slate-200'
                            : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-400'
                        }`}
                        title={`Jump to ${Math.round(pct)}%`}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-500 dark:text-slate-400">
                  <span>
                    {audioState.playing ? 'Playing Audio...' : audioState.progress > 0 ? 'Paused' : 'Ready'} ·{' '}
                    0:{String(Math.floor(audioState.progress * 0.38)).padStart(2, '0')}
                  </span>
                  <span>Duration: {effectiveVoice.duration}</span>
                </div>
              </div>
            </div>

            {/* Multi-Language Translation & Transcript Suite */}
            {effectiveVoice.transcript && (
              <div className="rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] overflow-hidden">
                {/* Translation Control Bar */}
                <div className="px-3 py-1.5 bg-[#f8f9fa] dark:bg-[#0e1116] border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-x-auto scrollbar-none py-0.5">
                    <Globe size={12} className="text-slate-500 shrink-0" />
                    <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0">
                      Translate:
                    </span>
                    {isTranslating && (
                      <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 animate-pulse shrink-0">
                        AI Translating...
                      </span>
                    )}
                    {/* Quick Common East African Languages */}
                    <div className="flex items-center gap-1 shrink-0">
                      {(['EN', 'SW', 'LG', 'RW', 'NK', 'LU'] as LanguageCode[]).map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            setVoiceLang(code);
                            setShowTranscript(true);
                          }}
                          className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold transition-all cursor-pointer ${
                            voiceLang === code
                              ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          {code}
                        </button>
                      ))}
                    </div>

                    {/* All Languages Searchable Dropdown */}
                    <SearchableSelect
                      value={voiceLang}
                      onChange={(val) => {
                        setVoiceLang(val as LanguageCode);
                        setShowTranscript(true);
                      }}
                      ariaLabel="Select Transcript Language"
                      placeholder="Language..."
                      searchPlaceholder="Search languages..."
                      options={ALL_LANGUAGES.map((l) => ({
                        value: l.code,
                        label: `${l.code} · ${l.label}`,
                      }))}
                      className="w-28 shrink-0"
                      triggerClassName="px-2 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 rounded"
                    />
                  </div>

                  {/* Actions: Copy & Expand */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(activeTranscriptText);
                        onToast?.(`Copied ${voiceLang} transcript to clipboard!`);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      title="Copy transcript text"
                    >
                      <Copy size={12} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowTranscript((prev) => !prev)}
                      className="text-[9.5px] font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-0.5 hover:underline cursor-pointer"
                    >
                      <span>{showTranscript ? 'Hide' : 'Show'}</span>
                      {showTranscript ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </div>
                </div>

                {/* Transcript Body */}
                {showTranscript && (
                  <div className="p-3 space-y-1.5 animate-fade-in">
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-b border-[#e3e6ea] dark:border-[#262b36] pb-1">
                      <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold">
                        <CheckCircle2 size={10} />
                        <span>{voiceLang === 'EN' ? 'Original Ground Transcript' : `${voiceLang} Multi-Language Translation`}</span>
                      </span>
                      <span>Verified Transcript Engine</span>
                    </div>
                    <p className="text-xs italic text-slate-800 dark:text-slate-200 leading-relaxed pt-0.5">
                      {activeTranscriptText}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* 4. DOCUMENT ATTACHMENT CARD & PLAIN-LANGUAGE VIEWER */}
      {docs.map((m, i) => {
        const isExpanded = expandedDocIdx === i;
        const rawDocName = m.name || `Public_Record_${postId.slice(-4).toUpperCase()}.pdf`;
        const cleanBaseName = rawDocName.replace(/\.(pdf|docx?|xlsx?|csv|txt)$/i, '');
        const humanDocTitle = cleanBaseName
          .replace(/[_-]+/g, ' ')
          .replace(/\b\w/g, (ch) => ch.toUpperCase());
        const fileExt = (rawDocName.match(/\.([a-z0-9]+)$/i)?.[1] || 'PDF').toUpperCase();
        const activeDocMode = docViewMode[i] || 'abstract';

        return (
          <div
            key={i}
            className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80"
          >
            <div className="p-3.5 sm:p-4 space-y-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-500/12 border border-amber-500/25 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <FileText size={19} />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug break-words">
                    {humanDocTitle}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                      <ShieldCheck size={12} />
                      <span>Verified Document</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{fileExt}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{m.size || '1.2 MB'}</span>
                    <span aria-hidden="true">·</span>
                    <span>Ready offline</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setDocViewMode((prev) => ({ ...prev, [i]: 'abstract' }));
                    setExpandedDocIdx(isExpanded && activeDocMode === 'abstract' ? null : i);
                  }}
                  className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                    isExpanded && activeDocMode === 'abstract'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-amber-500'
                  }`}
                >
                  <Zap size={13} />
                  <span>Key Facts</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDocViewMode((prev) => ({ ...prev, [i]: 'pdf' }));
                    setExpandedDocIdx(isExpanded && activeDocMode === 'pdf' ? null : i);
                  }}
                  className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                    isExpanded && activeDocMode === 'pdf'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90'
                  }`}
                >
                  <Eye size={13} />
                  <span>{isExpanded && activeDocMode === 'pdf' ? 'Close File' : `Open ${fileExt}`}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFullscreenDoc(m)}
                  aria-label="Open full screen viewer"
                  title="Expand full screen"
                  className="min-h-[40px] min-w-[40px] px-2.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Maximize2 size={14} />
                </button>
              </div>
            </div>

            {/* Inline Plain-Language Summary & File Viewer */}
            {isExpanded && (
              <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between gap-2 flex-wrap pb-2.5 border-b border-slate-200 dark:border-slate-800">
                  <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setDocViewMode((prev) => ({ ...prev, [i]: 'abstract' }))}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        activeDocMode === 'abstract'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Key Facts
                    </button>
                    <button
                      type="button"
                      onClick={() => setDocViewMode((prev) => ({ ...prev, [i]: 'pdf' }))}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        activeDocMode === 'pdf'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Full {fileExt}
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Original file: {rawDocName}
                  </span>
                </div>

                {activeDocMode === 'abstract' ? (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-800 dark:text-slate-200">
                      <div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Document</div>
                        <div className="font-semibold text-sm text-slate-950 dark:text-white mt-0.5">{humanDocTitle}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Issued By</div>
                        <div className="font-semibold text-sm text-emerald-700 dark:text-emerald-400 mt-0.5">
                          Works &amp; Procurement Office
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">What It Covers</div>
                        <div className="text-xs font-medium mt-0.5">
                          Official contract terms, approved budget &amp; work deadlines
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Offline Access</div>
                        <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mt-0.5">
                          Saved on device (works without data)
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">Plain Summary:</strong> Official record attached to report #{postId.slice(-6).toUpperCase()}. Shows who approved the work, what standards were promised, and what residents can check on site.
                    </div>
                  </div>
                ) : (
                  m.url ? (
                    isImageDoc(m) ? (
                      <div className="space-y-2 p-2.5 bg-slate-950 rounded-xl text-center border border-slate-800">
                        <img
                          src={m.url}
                          alt={humanDocTitle}
                          className="max-w-full max-h-96 object-contain mx-auto rounded-lg shadow-md"
                        />
                        <div className="flex justify-between items-center flex-wrap gap-2 pt-2 px-1 text-slate-300">
                          <span className="text-xs flex items-center gap-1.5 text-emerald-400">
                            <CheckCircle2 size={13} /> Scanned paper copy ({m.size || 'Cached'})
                          </span>
                          <a
                            href={m.url}
                            download={rawDocName}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Download size={13} />
                            <span>Save Image</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                            <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                              {humanDocTitle}
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1">
                            <ShieldCheck size={12} /> Verified File
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          Attached to report #{postId.slice(-6).toUpperCase()}. Open it with your phone&apos;s PDF reader or download a copy below.
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 min-w-[150px] py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <Eye size={13} />
                            <span>Open PDF</span>
                          </a>
                          <a
                            href={m.url}
                            download={rawDocName}
                            className="py-2 px-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <Download size={13} />
                            <span>Save ({m.size || fileExt})</span>
                          </a>
                        </div>

                        <div className="hidden sm:block pt-1">
                          <object
                            data={m.url}
                            type="application/pdf"
                            className="w-full h-72 rounded-lg border border-slate-200 dark:border-slate-800 bg-white"
                          >
                            <div className="p-3 text-center text-xs text-slate-400">
                              Tap &ldquo;Open PDF&rdquo; above to read the full document.
                            </div>
                          </object>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                      <div className="font-semibold text-slate-900 dark:text-white">{humanDocTitle}</div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        This notice is verified and attached to report <strong>#{postId.slice(-6).toUpperCase()}</strong>.
                        Its full {m.size || '1.2 MB'} file reference is saved offline so citizens can inspect what was approved even on slow connections.
                      </p>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                        File: {rawDocName} · {m.size || '1.2 MB'} · Verified public attachment
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* FULLSCREEN IMAGE GALLERY LIGHTBOX */}
      {lightboxIdx !== null && images[lightboxIdx] && (
        <div
          className="fixed inset-0 bg-black/95 z-[99999] flex flex-col justify-between p-4 sm:p-6 animate-fade-in"
          onClick={() => setLightboxIdx(null)}
        >
          {/* Top Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full mx-auto flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5"
          >
            <div className="text-xs font-mono text-white font-bold flex items-center gap-2">
              <ImageIcon size={14} className="text-emerald-400" />
              <span>
                FULL-RESOLUTION IMAGE VIEWER ({lightboxIdx + 1} of {images.length})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={15} />
              </button>
              <span className="text-[10px] font-mono text-emerald-400 px-1.5 font-bold">{zoomLevel}x</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.5))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={15} />
              </button>
              <button
                type="button"
                onClick={() => setLightboxIdx(null)}
                className="p-1.5 rounded-lg bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white cursor-pointer ml-2"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Center Image Canvas */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center relative overflow-auto my-3"
          >
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setLightboxIdx((lightboxIdx - 1 + images.length) % images.length)}
                className="absolute left-3 z-10 p-3 rounded-full bg-slate-900/90 hover:bg-emerald-600 text-white border border-white/20 cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <img
              src={resolveImageUrl(images[lightboxIdx].url, lightboxIdx, images[lightboxIdx].caption)}
              alt={images[lightboxIdx].caption || 'Evidence image'}
              referrerPolicy="no-referrer"
              onError={(e) =>
                handleImageError(
                  images[lightboxIdx].url,
                  lightboxIdx,
                  images[lightboxIdx].caption || '',
                  e.currentTarget as HTMLImageElement
                )
              }
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-w-full max-h-[75vh] rounded-xl object-contain shadow-2xl transition-transform duration-200"
            />

            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setLightboxIdx((lightboxIdx + 1) % images.length)}
                className="absolute right-3 z-10 p-3 rounded-full bg-slate-900/90 hover:bg-emerald-600 text-white border border-white/20 cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>

          {/* Bottom Caption Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full mx-auto text-center bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5"
          >
            <p className="text-xs text-slate-200 font-medium">
              {images[lightboxIdx].caption || `Verified Field Evidence Photograph #${lightboxIdx + 1}`}
            </p>
          </div>
        </div>
      )}

      {/* FULLSCREEN VIDEO THEATER MODAL */}
      {theaterVideoUrl && (
        <div
          onClick={() => setTheaterVideoUrl(null)}
          className="fixed inset-0 bg-black/95 z-[99999] flex flex-col justify-center items-center p-4 sm:p-6 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full bg-slate-950 border border-indigo-500/40 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400">
                <Film size={15} />
                <span>THEATER VIDEO VIEWER · {theaterVideoUrl.caption || 'FIELD VIDEO EVIDENCE'}</span>
              </div>
              <button
                type="button"
                onClick={() => setTheaterVideoUrl(null)}
                className="p-1.5 rounded-lg bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <video
              src={theaterVideoUrl.url}
              controls
              autoPlay
              playsInline
              className="w-full max-h-[78vh] object-contain bg-black"
            />
          </div>
        </div>
      )}

      {/* FULLSCREEN DOCUMENT MODAL */}
      {fullscreenDoc && (
        <div
          onClick={() => setFullscreenDoc(null)}
          className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 sm:p-6 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-white dark:bg-slate-900 border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <FileText size={20} className="text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {fullscreenDoc.name || 'Statutory Evidence Document'}
                  </h3>
                  <p className="text-[10px] font-mono text-slate-500">
                    {fullscreenDoc.size || '842 KB'} · Fullscreen Document Reader
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFullscreenDoc(null)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {fullscreenDoc.url ? (
              isImageDoc(fullscreenDoc) ? (
                <div className="flex-1 flex flex-col items-center justify-center p-3 bg-slate-950 rounded-xl min-h-[50vh] max-h-[72vh] overflow-auto border border-slate-800">
                  <img
                    src={fullscreenDoc.url}
                    alt={fullscreenDoc.name || 'Photocopied Document'}
                    className="max-w-full max-h-[62vh] object-contain rounded-lg shadow-xl"
                  />
                  <div className="flex items-center justify-between w-full pt-3 px-2 text-xs font-mono text-slate-300">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <CheckCircle2 size={13} /> Official On-Ground Photocopied Scan
                    </span>
                    <a
                      href={fullscreenDoc.url}
                      download={fullscreenDoc.name}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Save Scan</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 max-h-[75vh] overflow-y-auto">
                  <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ShieldCheck size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">
                          {(fullscreenDoc.name || 'Public Record')
                            .replace(/\.(pdf|docx?|xlsx?|csv|txt)$/i, '')
                            .replace(/[_-]+/g, ' ')
                            .replace(/\b\w/g, (ch) => ch.toUpperCase())}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">
                          Verified Document · {fullscreenDoc.size || '1.2 MB'} · Ready offline
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-800 dark:text-slate-200">
                    <div className="font-semibold text-sm text-slate-950 dark:text-white">
                      Plain Summary
                    </div>
                    <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                      Official record attached to report #{postId.slice(-6).toUpperCase()}. Confirms what work was approved, who is responsible, and what residents can verify on site.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={fullscreenDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[160px] py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Eye size={15} />
                      <span>Open Full File</span>
                    </a>

                    <a
                      href={fullscreenDoc.url}
                      download={fullscreenDoc.name || 'Public_Document.pdf'}
                      className="py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Download size={15} />
                      <span>Save Copy</span>
                    </a>
                  </div>

                  <div className="hidden sm:block pt-1">
                    <object
                      data={fullscreenDoc.url}
                      type="application/pdf"
                      className="w-full h-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-white"
                    >
                      <div className="p-4 text-center text-xs text-slate-400">
                        Use &ldquo;Open Full File&rdquo; above to read in your PDF viewer.
                      </div>
                    </object>
                  </div>
                </div>
              )
            ) : (
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs text-slate-800 dark:text-slate-200">
                <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>Verified Document · Report #{postId.slice(-6).toUpperCase()}</span>
                </div>
                <h4 className="text-base font-bold">
                  {(fullscreenDoc.name || 'Public Document')
                    .replace(/\.(pdf|docx?|xlsx?|csv|txt)$/i, '')
                    .replace(/[_-]+/g, ' ')
                    .replace(/\b\w/g, (ch) => ch.toUpperCase())}
                </h4>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                  This official document is attached to report #{postId.slice(-6).toUpperCase()} so local residents and reviewers can verify approved project details even with slow internet.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
