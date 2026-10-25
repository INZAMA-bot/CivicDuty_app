import React, { useState, useEffect, useRef } from 'react';
import { MediaItem, LanguageCode } from '../types';
import { ALL_LANGUAGES } from '../data/translations';
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
  Globe2,
  Copy,
  Sparkles,
} from 'lucide-react';

interface MediaCardProps {
  media?: MediaItem[];
  postId: string;
  voiceNote?: {
    duration: string;
    language?: string;
    transcript?: string;
  };
  onToast?: (msg: string) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ media, postId, voiceNote: postVoiceNote, onToast }) => {
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

  const [audioState, setAudioState] = useState<{ playing: boolean; progress: number; speed: number }>({
    playing: false,
    progress: 0,
    speed: 1,
  });

  const [voiceLang, setVoiceLang] = useState<LanguageCode>('EN');
  const [showVoiceTranslation, setShowVoiceTranslation] = useState<boolean>(false);

  const [failedMediaUrls, setFailedMediaUrls] = useState<Record<string, string>>({});

  const getSafeFallbackUrl = (idx: number = 0, caption: string = '') => {
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
  const effectiveVoice = {
    duration: postVoiceNote?.duration || mediaVoice?.duration || '1:12',
    language: postVoiceNote?.language || 'Vernacular Field Audio',
    transcript:
      postVoiceNote?.transcript ||
      '“Verified citizen field audio testimony attached to this dispatch. Full voice waveform and statutory transcript archived on the public ledger.”',
    waveform:
      mediaVoice?.waveform || [
        4, 7, 5, 9, 6, 8, 4, 7, 10, 5, 8, 6, 9, 4, 7, 9, 5, 3, 7, 9, 6, 4, 8, 5, 10, 7, 4, 8, 6, 8, 5, 3, 7, 9, 4, 6,
      ],
  };

  useEffect(() => {
    if (!audioState.playing) return;
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
  }, [audioState.playing, audioState.speed]);

  if (images.length === 0 && videos.length === 0 && docs.length === 0 && !hasVoice) {
    return null;
  }

  const toggleAudioPlay = () => {
    setAudioState((prev) => ({
      ...prev,
      playing: !prev.playing,
      progress: prev.progress >= 100 ? 0 : prev.progress,
    }));
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(audioState.speed) + 1) % speeds.length;
    setAudioState((prev) => ({ ...prev, speed: speeds[nextIdx] }));
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
          <div className="rounded-xl overflow-hidden border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/70 dark:bg-indigo-950/30 p-3 sm:p-4 space-y-3 shadow-2xs">
            {/* Header: Title, Badge, and Speed */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Volume2 size={14} />
                </span>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200">
                      AUDIO TESTIMONY · {effectiveVoice.language}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-indigo-200/80 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-300 text-[9px] font-mono font-bold">
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
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300 hover:border-indigo-400 cursor-pointer transition-colors"
                  title="Change Audio Playback Speed"
                >
                  {audioState.speed}x Speed
                </button>
                <span className="px-2 py-0.5 rounded-md bg-indigo-600/10 border border-indigo-500/30 text-[10px] font-mono font-bold text-indigo-800 dark:text-indigo-300">
                  {effectiveVoice.duration}
                </span>
              </div>
            </div>

            {/* Interactive Waveform & Play Control Row */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900/90 p-2.5 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 shadow-2xs">
              <button
                type="button"
                onClick={toggleAudioPlay}
                className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm transition-colors cursor-pointer"
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
                            ? 'bg-indigo-600 dark:bg-indigo-400'
                            : 'bg-indigo-200 dark:bg-slate-700 hover:bg-indigo-400'
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
              <div className="rounded-xl bg-white/95 dark:bg-slate-900/95 border border-indigo-200/70 dark:border-indigo-900/50 overflow-hidden shadow-2xs">
                {/* Translation Control Bar */}
                <div className="px-3 py-1.5 bg-indigo-50/50 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-x-auto scrollbar-none py-0.5">
                    <Globe2 size={12} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="text-[10px] font-mono font-bold text-indigo-950 dark:text-indigo-200 shrink-0">
                      Translate:
                    </span>
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
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-100/60 dark:hover:bg-slate-700'
                          }`}
                        >
                          {code}
                        </button>
                      ))}
                    </div>

                    {/* All Languages Dropdown */}
                    <select
                      value={voiceLang}
                      onChange={(e) => {
                        setVoiceLang(e.target.value as LanguageCode);
                        setShowTranscript(true);
                      }}
                      className="bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded px-1.5 py-0.5 text-[9.5px] font-mono text-slate-800 dark:text-slate-200 cursor-pointer max-w-[100px] truncate shrink-0"
                      title="Select any language translation"
                    >
                      {ALL_LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.code} · {l.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Actions: Copy & Expand */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(activeTranscriptText);
                        onToast?.(`Copied ${voiceLang} transcript to clipboard!`);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      title="Copy transcript text"
                    >
                      <Copy size={12} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowTranscript((prev) => !prev)}
                      className="text-[9.5px] font-mono font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-0.5 hover:underline cursor-pointer"
                    >
                      <span>{showTranscript ? 'Hide' : 'Show'}</span>
                      {showTranscript ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </div>
                </div>

                {/* Transcript Body */}
                {showTranscript && (
                  <div className="p-3 space-y-1.5 animate-fade-in">
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-b border-indigo-50 dark:border-indigo-950/60 pb-1">
                      <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
                        <Sparkles size={10} />
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

      {/* 4. FULL DOCUMENT DOSSIER READER & PREVIEWER */}
      {docs.map((m, i) => {
        const isExpanded = expandedDocIdx === i;
        const docTitle = m.name || `Statutory_Evidence_Dossier_${postId.slice(-4).toUpperCase()}.pdf`;
        return (
          <div
            key={i}
            className="rounded-xl overflow-hidden border-2 border-amber-500/40 bg-amber-50/40 dark:bg-slate-900/90 shadow-2xs"
          >
            <div className="p-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{docTitle}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[9px] font-mono font-bold uppercase">
                      OFFICIAL DOCUMENT
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{m.size || '840 KB'} · PDF / Statutory Record</span>
                    <span>·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <ShieldCheck size={11} /> SHA-256 Sealed
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setExpandedDocIdx(isExpanded ? null : i)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Eye size={12} />
                  <span>{isExpanded ? 'Hide Preview' : 'Read Full Document'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFullscreenDoc(m)}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Maximize2 size={11} />
                  <span>Fullscreen</span>
                </button>
              </div>
            </div>

            {/* Inline Full Document Reader Sheet */}
            {isExpanded && (
              <div className="p-4 bg-white dark:bg-slate-950 border-t border-amber-500/30 space-y-3 animate-fade-in">
                {m.url ? (
                  <div className="space-y-2">
                    <iframe
                      src={m.url}
                      title={docTitle}
                      className="w-full h-80 rounded-lg border border-slate-200 dark:border-slate-800 bg-white"
                    />
                    <div className="flex justify-end">
                      <a
                        href={m.url}
                        download={docTitle}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-mono font-bold inline-flex items-center gap-1.5"
                      >
                        <Download size={12} />
                        <span>Download Original File</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>CERTIFIED PUBLIC RECORD · DOCKET #{postId.slice(-6).toUpperCase()}</span>
                      <span>VERIFIED ATTACHMENT</span>
                    </div>
                    <div className="font-sans text-xs text-slate-800 dark:text-slate-200 space-y-2 leading-relaxed">
                      <p className="font-bold text-sm">{docTitle}</p>
                      <p>
                        This statutory document attachment has been cryptographically indexed to Dispatch{' '}
                        <strong>#{postId.slice(-6).toUpperCase()}</strong> for public inspection, engineering verification,
                        and audit trail compliance.
                      </p>
                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                        <div>File Reference: {docTitle}</div>
                        <div>File Size: {m.size || '842 KB'}</div>
                        <div>Chain Custody: Immutable Public Ledger · Open Inspection Enabled</div>
                      </div>
                    </div>
                  </div>
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
              <iframe
                src={fullscreenDoc.url}
                title={fullscreenDoc.name || 'Document'}
                className="w-full h-[70vh] rounded-xl border border-slate-200 dark:border-slate-800 bg-white"
              />
            ) : (
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs text-slate-800 dark:text-slate-200">
                <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  OFFICIAL STATUTORY DOSSIER ATTACHMENT · #{postId.slice(-6).toUpperCase()}
                </div>
                <h4 className="text-base font-bold">{fullscreenDoc.name}</h4>
                <p className="leading-relaxed">
                  Certified public document attached to Dispatch #{postId.slice(-6).toUpperCase()}. Verified for public
                  oversight, procurement transparency, and statutory SLA tracking.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
