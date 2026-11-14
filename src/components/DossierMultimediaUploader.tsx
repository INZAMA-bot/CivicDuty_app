import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  Video,
  Mic,
  Square,
  FileText,
  X,
  Paperclip,
  Volume2,
  Film,
} from 'lucide-react';
import { MediaItem } from '../types';

interface DossierMultimediaUploaderProps {
  media: MediaItem[];
  onChange: (nextMedia: MediaItem[]) => void;
  onNotify?: (msg: string, tone?: 'emerald' | 'amber' | 'rose') => void;
  compact?: boolean;
}

const MAX_CLOUD_DATAURL_CHARS = 240_000;

function formatBytes(bytes: number): string {
  if (bytes >= 1048576) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

async function compressImageToDataUrl(file: File): Promise<{ url: string; sizeLabel: string }> {
  const rawUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  if (typeof Image === 'undefined') {
    return { url: rawUrl, sizeLabel: formatBytes(file.size) };
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 1080;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width >= height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ url: rawUrl, sizeLabel: formatBytes(file.size) });
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', 0.78);
      const approxBytes = Math.round((compressed.length * 3) / 4);
      resolve({ url: compressed, sizeLabel: formatBytes(approxBytes) });
    };
    img.onerror = () => resolve({ url: rawUrl, sizeLabel: formatBytes(file.size) });
    img.src = rawUrl;
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getVideoDurationLabel(url: string): Promise<string> {
  return new Promise((resolve) => {
    const vid = document.createElement('video');
    vid.preload = 'metadata';
    const timer = window.setTimeout(() => resolve('0:15'), 1500);
    vid.onloadedmetadata = () => {
      window.clearTimeout(timer);
      const secs = Math.max(1, Math.round(vid.duration || 15));
      const m = Math.floor(secs / 60);
      const s = String(secs % 60).padStart(2, '0');
      resolve(`${m}:${s}`);
    };
    vid.onerror = () => {
      window.clearTimeout(timer);
      resolve('0:15');
    };
    vid.src = url;
  });
}

export const DossierMultimediaUploader: React.FC<DossierMultimediaUploaderProps> = ({
  media,
  onChange,
  onNotify,
  compact = false,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const handlePhotoFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files: File[] = Array.from(e.target.files) as File[];
    const added: MediaItem[] = [];

    for (const f of files.slice(0, 6)) {
      try {
        const { url, sizeLabel } = await compressImageToDataUrl(f);
        added.push({
          type: 'image',
          url,
          name: f.name,
          size: sizeLabel,
          mimeType: 'image/jpeg',
          caption: f.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' '),
        });
      } catch {
        onNotify?.(`Could not process image ${f.name}`, 'amber');
      }
    }

    if (added.length > 0) {
      onChange([...media, ...added]);
      onNotify?.(`${added.length} field photo(s) attached to testimony`, 'emerald');
    }
    e.target.value = '';
  };

  const handleVideoFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files: File[] = Array.from(e.target.files) as File[];
    const added: MediaItem[] = [];

    for (const f of files.slice(0, 3)) {
      const sizeLabel = formatBytes(f.size);
      let url = URL.createObjectURL(f);
      const duration = await getVideoDurationLabel(url);

      if (f.size <= 350 * 1024) {
        try {
          const dataUrl = await readFileAsDataUrl(f);
          if (dataUrl.length <= MAX_CLOUD_DATAURL_CHARS * 2) {
            url = dataUrl;
          }
        } catch {}
      }

      added.push({
        type: 'video',
        url,
        name: f.name,
        size: sizeLabel,
        duration,
        mimeType: f.type || 'video/mp4',
        caption: f.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' '),
      });
    }

    if (added.length > 0) {
      onChange([...media, ...added]);
      onNotify?.(`${added.length} video clip(s) attached to testimony`, 'emerald');
    }
    e.target.value = '';
  };

  const handleAudioFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files: File[] = Array.from(e.target.files) as File[];
    const added: MediaItem[] = [];

    for (const f of files.slice(0, 3)) {
      const sizeLabel = formatBytes(f.size);
      const url = f.size <= 450 * 1024 ? await readFileAsDataUrl(f) : URL.createObjectURL(f);
      added.push({
        type: 'voice',
        url,
        name: f.name,
        size: sizeLabel,
        duration: '0:28',
        mimeType: f.type || 'audio/mpeg',
        caption: `Field Audio (${f.name})`,
        waveform: [4, 7, 5, 9, 6, 8, 5, 7, 10, 6, 8, 4, 7, 9, 5, 6, 8, 4, 7, 5],
      });
    }

    if (added.length > 0) {
      onChange([...media, ...added]);
      onNotify?.(`${added.length} audio clip(s) attached`, 'emerald');
    }
    e.target.value = '';
  };

  const handleDocFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files: File[] = Array.from(e.target.files) as File[];
    const added: MediaItem[] = [];

    for (const f of files.slice(0, 4)) {
      const sizeLabel = formatBytes(f.size);
      const isImg = f.type.startsWith('image/');
      const url = isImg
        ? (await compressImageToDataUrl(f)).url
        : f.size <= 350 * 1024
        ? await readFileAsDataUrl(f)
        : URL.createObjectURL(f);

      added.push({
        type: 'doc',
        url,
        name: f.name,
        size: sizeLabel,
        mimeType: f.type || 'application/pdf',
        isPhotoScan: isImg,
        caption: f.name,
      });
    }

    if (added.length > 0) {
      onChange([...media, ...added]);
      onNotify?.(`${added.length} supporting document(s) attached`, 'emerald');
    }
    e.target.value = '';
  };

  const toggleVoiceRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsRecording(false);
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      audioInputRef.current?.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      const startedAt = Date.now();

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const elapsed = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
        const durLabel = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`;
        const reader = new FileReader();
        reader.onloadend = () => {
          const url = String(reader.result || '');
          const voiceItem: MediaItem = {
            type: 'voice',
            url,
            name: 'Live Witness Voice Testimony',
            size: formatBytes(blob.size),
            duration: durLabel,
            mimeType: blob.type || 'audio/webm',
            caption: 'Live Witness Mic',
            waveform: [5, 8, 6, 10, 7, 9, 4, 8, 6, 9, 7, 5, 8, 10, 6, 7, 4, 8, 6, 5],
          };
          onChange([...media, voiceItem]);
          onNotify?.(`Voice note recorded (${durLabel}) & attached`, 'emerald');
        };
        reader.readAsDataURL(blob);
      };

      recorder.start(150);
      setIsRecording(true);
      setRecordSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } catch {
      onNotify?.('Microphone blocked — select an audio file instead', 'amber');
      audioInputRef.current?.click();
    }
  };

  const updateCaption = (idx: number, caption: string) => {
    onChange(media.map((m, i) => (i === idx ? { ...m, caption } : m)));
  };

  const removeItem = (idx: number) => {
    onChange(media.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      {/* Hidden File Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handlePhotoFiles}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={handleVideoFiles}
      />
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={handleAudioFiles}
      />
      <input
        ref={docInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.csv,image/*"
        multiple
        className="hidden"
        onChange={handleDocFiles}
      />

      {/* Multimedia Action Strip */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 inline-flex items-center gap-1">
          <Paperclip size={12} className="text-emerald-600 dark:text-emerald-400" />
          <span>Attach Multimedia Evidence:</span>
        </span>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className={`${compact ? 'min-h-[34px] px-2.5 py-1' : 'min-h-[36px] px-2.5 py-1.5'} rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-[11px] font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer transition-colors`}
            title="Upload evidence photos"
          >
            <Camera size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>Photo</span>
          </button>

          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className={`${compact ? 'min-h-[34px] px-2.5 py-1' : 'min-h-[36px] px-2.5 py-1.5'} rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-indigo-500 text-[11px] font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer transition-colors`}
            title="Upload video clip"
          >
            <Video size={13} className="text-indigo-600 dark:text-indigo-400" />
            <span>Video</span>
          </button>

          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`${compact ? 'min-h-[34px] px-2.5 py-1' : 'min-h-[36px] px-2.5 py-1.5'} rounded-lg border text-[11px] font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
              isRecording
                ? 'bg-rose-600 border-rose-600 text-white animate-pulse'
                : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] hover:border-rose-500 text-slate-700 dark:text-slate-200'
            }`}
            title={isRecording ? 'Stop recording audio' : 'Record live voice note'}
          >
            {isRecording ? <Square size={12} className="fill-current" /> : <Mic size={13} className="text-rose-600 dark:text-rose-400" />}
            <span>
              {isRecording
                ? `Stop (${Math.floor(recordSeconds / 60)}:${String(recordSeconds % 60).padStart(2, '0')})`
                : 'Voice'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => audioInputRef.current?.click()}
            className={`${compact ? 'min-h-[34px] px-2.5 py-1' : 'min-h-[36px] px-2.5 py-1.5'} rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400 text-[11px] font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer transition-colors`}
            title="Upload saved audio file"
          >
            <Volume2 size={13} className="text-slate-600 dark:text-slate-300" />
            <span>Audio File</span>
          </button>

          <button
            type="button"
            onClick={() => docInputRef.current?.click()}
            className={`${compact ? 'min-h-[34px] px-2.5 py-1' : 'min-h-[36px] px-2.5 py-1.5'} rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-amber-500 text-[11px] font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer transition-colors`}
            title="Attach PDF, receipt, or scanned official record"
          >
            <FileText size={13} className="text-amber-600 dark:text-amber-400" />
            <span>Doc / PDF</span>
          </button>
        </div>
      </div>

      {/* Attached Multimedia Staged Preview Strip */}
      {media.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {media.map((item, idx) => (
            <div
              key={`${item.type}-${idx}-${item.name || idx}`}
              className="p-2 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center gap-2.5"
            >
              {item.type === 'image' && item.url ? (
                <img
                  src={item.url}
                  alt={item.caption || 'Evidence preview'}
                  className="w-11 h-11 rounded-lg object-cover border border-[#e3e6ea] dark:border-[#262b36] shrink-0"
                />
              ) : item.type === 'video' ? (
                <div className="w-11 h-11 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Film size={17} />
                </div>
              ) : item.type === 'voice' ? (
                <div className="w-11 h-11 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <Volume2 size={17} />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <FileText size={17} />
                </div>
              )}

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {item.name || item.caption || `${item.type.toUpperCase()} attachment`}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 shrink-0 tabular-nums">
                    {item.duration ? `${item.duration} · ` : ''}
                    {item.size || 'Attached'}
                  </span>
                </div>

                {(item.type === 'image' || item.type === 'video') && (
                  <input
                    type="text"
                    value={item.caption || ''}
                    onChange={(e) => updateCaption(idx, e.target.value)}
                    placeholder="Optional caption for this evidence..."
                    maxLength={100}
                    className="w-full px-2 py-1 rounded-md bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-[11px] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                )}
              </div>

              <button
                type="button"
                onClick={() => removeItem(idx)}
                aria-label={`Remove ${item.name || item.type}`}
                className="min-h-[32px] min-w-[32px] rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
