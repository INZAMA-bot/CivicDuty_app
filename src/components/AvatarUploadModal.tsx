import React, { useState, useRef } from 'react';
import { Camera, Upload, Check, X, Trash2, ShieldCheck } from 'lucide-react';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  userName: string;
  onSave: (avatarDataUrl: string) => void;
}

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  userName,
  onSave,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentAvatar || '');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const initials =
    userName
      .replace(/^@/, '')
      .split(/[\s_.-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() || '')
      .join('') || 'CD';

  // Compress and crop image to square 256x256 JPEG/PNG data URL
  const processImageFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image file is too large (max 8MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.86);
          setPreviewUrl(compressedDataUrl);
        }
      };
      img.onerror = () => {
        setErrorMsg('Could not process image file.');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handleSave = () => {
    onSave(previewUrl);
    onClose();
  };

  const handleRemove = () => {
    setPreviewUrl('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl max-w-sm w-full overflow-hidden shadow-2xl text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Studio Bar */}
        <div className="px-4 py-3 border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between bg-[#f8f9fa] dark:bg-[#0e1116]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Camera size={14} strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                Identity Avatar
              </h3>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                Auto-cropped 256×256px · EXIF metadata stripped
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Live Avatar Preview + Upload Dropzone */}
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
            <div className="relative w-16 h-16 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] overflow-hidden flex items-center justify-center shrink-0">
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {initials}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">{userName}</div>
              <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                {previewUrl ? 'Custom photo active' : 'Default anonymous monogram active'}
              </div>
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  <Trash2 size={11} />
                  <span>Reset to Default Monogram</span>
                </button>
              )}
            </div>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-[#cbd5e1] dark:border-[#262b36] hover:border-emerald-500/60 bg-[#f8f9fa] dark:bg-[#0e1116]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-9 h-9 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <Upload size={16} strokeWidth={1.75} />
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Tap to choose photo or drag &amp; drop
            </p>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              JPG, PNG, or WEBP · Up to 8MB
            </p>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[11px] font-mono text-center">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-[#f8f9fa] dark:bg-[#0e1116] px-3 py-2 rounded-lg border border-[#e3e6ea] dark:border-[#262b36]">
            <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Device GPS &amp; camera EXIF tags are automatically scrubbed before saving.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 border-t border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e232d] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check size={13} />
            <span>Save Avatar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
