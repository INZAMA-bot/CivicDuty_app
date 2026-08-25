import React, { useState } from 'react';
import { MediaItem } from '../types';
import { Play, Pause, Film, FileText, ChevronRight, X } from 'lucide-react';

interface MediaCardProps {
  media?: MediaItem[];
  postId: string;
  onToast?: (msg: string) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ media, postId, onToast }) => {
  const [selectedImg, setSelectedImg] = useState<{ url: string; caption?: string } | null>(null);
  const [playingVideo, setPlayingVideo] = useState<Record<number, boolean>>({});
  const [audioState, setAudioState] = useState<{ playing: boolean; progress: number }>({
    playing: false,
    progress: 0,
  });

  if (!media || media.length === 0) return null;

  const images = media.filter((m) => m.type === 'image');
  const videos = media.filter((m) => m.type === 'video');
  const docs = media.filter((m) => m.type === 'doc');
  const voiceNote = media.find((m) => m.type === 'voice');

  const toggleAudioPlay = () => {
    if (audioState.playing) {
      setAudioState((prev) => ({ ...prev, playing: false }));
    } else {
      setAudioState({ playing: true, progress: 0 });
      const interval = setInterval(() => {
        setAudioState((prev) => {
          if (prev.progress >= 100) {
            clearInterval(interval);
            return { playing: false, progress: 0 };
          }
          return { ...prev, progress: prev.progress + 2 };
        });
      }, 50);
    }
  };

  return (
    <div className="space-y-2 mt-2" onClick={(e) => e.stopPropagation()}>
      {/* Lightbox Modal */}
      {selectedImg && (
        <div
          className="fixed inset-0 bg-black/90 z-[99999] flex flex-col items-center justify-center p-5 animate-fade-in"
          onClick={() => setSelectedImg(null)}
        >
          <button
            className="absolute top-5 right-5 text-white text-2xl font-mono p-2 hover:text-emerald-400"
            onClick={() => setSelectedImg(null)}
          >
            <X size={28} />
          </button>
          <img
            src={selectedImg.url}
            alt={selectedImg.caption || 'Evidence image'}
            className="max-w-full max-h-[80vh] rounded-lg object-contain shadow-2xl"
          />
          {selectedImg.caption && (
            <p className="text-zinc-400 text-xs font-mono mt-3 text-center max-w-prose">
              {selectedImg.caption}
            </p>
          )}
        </div>
      )}

      {/* Image Grid */}
      {images.length === 1 && (
        <div
          className="media-grid-1 a-media cursor-pointer"
          onClick={() => setSelectedImg({ url: images[0].url!, caption: images[0].caption })}
        >
          <div className="media-cell media-img-1">
            <img src={images[0].url} alt={images[0].caption || ''} loading="lazy" />
          </div>
        </div>
      )}

      {images.length === 2 && (
        <div className="media-grid-2 a-media">
          {images.map((m, i) => (
            <div
              key={i}
              className="media-cell media-img-2 cursor-pointer"
              onClick={() => setSelectedImg({ url: m.url!, caption: m.caption })}
            >
              <img src={m.url} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      )}

      {images.length === 3 && (
        <div className="media-grid-3 a-media">
          <div
            className="media-cell media-img-3-main media-cell-tall cursor-pointer"
            onClick={() => setSelectedImg({ url: images[0].url!, caption: images[0].caption })}
          >
            <img src={images[0].url} alt="" loading="lazy" />
          </div>
          <div
            className="media-cell media-img-3-side cursor-pointer"
            onClick={() => setSelectedImg({ url: images[1].url!, caption: images[1].caption })}
          >
            <img src={images[1].url} alt="" loading="lazy" />
          </div>
          <div
            className="media-cell media-img-3-side cursor-pointer"
            onClick={() => setSelectedImg({ url: images[2].url!, caption: images[2].caption })}
          >
            <img src={images[2].url} alt="" loading="lazy" />
          </div>
        </div>
      )}

      {images.length === 4 && (
        <div className="media-grid-4 a-media">
          {images.map((m, i) => (
            <div
              key={i}
              className="media-cell media-img-4 cursor-pointer"
              onClick={() => setSelectedImg({ url: m.url!, caption: m.caption })}
            >
              <img src={m.url} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      )}

      {images.length >= 5 && (
        <div className="media-grid-5plus a-media">
          {images.slice(0, 5).map((m, i) => {
            const isLast = i === 4 && images.length > 5;
            const extra = images.length - 5;
            return (
              <div
                key={i}
                className="media-cell media-img-more cursor-pointer relative"
                onClick={() => setSelectedImg({ url: m.url!, caption: m.caption })}
              >
                <img src={m.url} alt="" loading="lazy" />
                {isLast && <div className="media-more-overlay">+{extra}</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* Videos */}
      {videos.map((m, i) => (
        <div key={i} className="video-card a-media relative">
          {playingVideo[i] ? (
            <video
              src={m.url}
              controls
              autoPlay
              className="w-full max-h-[280px] object-cover rounded-xl"
            />
          ) : (
            <div
              className="relative cursor-pointer"
              onClick={() => setPlayingVideo((prev) => ({ ...prev, [i]: true }))}
            >
              <img
                src={m.thumb || m.url}
                className="w-full max-h-[280px] object-cover rounded-xl block"
                alt=""
              />
              <div className="video-play-btn">
                <div className="video-play-circle text-white">
                  <Play size={20} className="fill-current ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2.5 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                {m.duration || '0:34'}
              </div>
              <div className="absolute top-2 left-2.5 bg-black/70 text-white text-[8px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                <Film size={10} /> VIDEO
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Voice Note */}
      {voiceNote && (
        <div className="audio-card a-media">
          <button
            className="audio-play-btn"
            onClick={toggleAudioPlay}
          >
            <span style={{ color: '#10b981' }}>
              {audioState.playing ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-0.5" />}
            </span>
          </button>
          <div className="flex-1 min-w-0">
            <div className="audio-waveform">
              {(voiceNote.waveform || Array.from({ length: 32 }, () => Math.floor(Math.random() * 8) + 2)).map(
                (h, i) => {
                  const activeCount = Math.floor((audioState.progress / 100) * 32);
                  return (
                    <div
                      key={i}
                      className={`audio-bar ${i < activeCount ? 'audio-bar-active' : ''}`}
                      style={{ height: `${h * 3.2}px` }}
                    />
                  );
                }
              )}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[8px] mono text-zinc-600">
                0:{String(Math.floor(audioState.progress * 0.4)).padStart(2, '0')}
              </span>
              <span className="text-[8px] mono text-zinc-600">{voiceNote.duration || '1:42'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Documents */}
      {docs.map((m, i) => (
        <div
          key={i}
          className="doc-card a-media cursor-pointer hover:border-zinc-700 transition-colors"
          onClick={() => onToast?.(`Opening ${m.name}`)}
        >
          <div className="doc-icon text-emerald-400">
            <FileText size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-zinc-200 truncate">{m.name}</div>
            <div className="text-[8px] mono text-zinc-600 mt-0.5">{m.size || 'Document'} · PDF</div>
          </div>
          <ChevronRight size={16} className="text-zinc-600" />
        </div>
      ))}
    </div>
  );
};
