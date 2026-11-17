import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, Check, X, Plus } from 'lucide-react';

export interface SearchableSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  keywords?: string;
  disabled?: boolean;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyOptionLabel?: string;
  disabled?: boolean;
  allowCustom?: boolean;
  customLabelPrefix?: string;
  className?: string;
  triggerClassName?: string;
  emptyMessage?: string;
  ariaLabel?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search options...',
  emptyOptionLabel,
  disabled = false,
  allowCustom = false,
  customLabelPrefix = 'Use custom:',
  className = '',
  triggerClassName = '',
  emptyMessage = 'No matching results found.',
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
    isMobile: boolean;
  }>({ top: 0, left: 0, width: 240, maxHeight: 320, isMobile: false });

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = useMemo(() => {
    if (!value) return undefined;
    return (
      options.find((o) => o.value === value) ||
      options.find((o) => o.label.toLowerCase() === value.toLowerCase())
    );
  }, [options, value]);

  const displayLabel = selectedOption
    ? selectedOption.label
    : value
    ? value
    : emptyOptionLabel || placeholder;

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => {
      const hay = `${o.label} ${o.sublabel || ''} ${o.keywords || ''} ${o.value}`.toLowerCase();
      return hay.includes(q);
    });
  }, [options, query]);

  const updatePosition = useCallback(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 640;
    if (isMobile || !triggerRef.current) {
      setCoords({
        top: 56,
        left: 12,
        width: Math.max(260, window.innerWidth - 24),
        maxHeight: Math.round(window.innerHeight * 0.7),
        isMobile: true,
      });
      return;
    }

    const rect = triggerRef.current.getBoundingClientRect();
    const minMenuWidth = Math.max(rect.width, 250);
    const maxAllowedWidth = window.innerWidth - 24;
    const menuWidth = Math.min(minMenuWidth, maxAllowedWidth);
    let left = rect.left;
    if (left + menuWidth > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - menuWidth - 12);
    }

    const spaceBelow = window.innerHeight - rect.bottom - 16;
    const spaceAbove = rect.top - 16;
    const openUpward = spaceBelow < 220 && spaceAbove > spaceBelow;
    const availableSpace = openUpward ? spaceAbove : spaceBelow;
    const maxHeight = Math.max(180, Math.min(340, availableSpace - 64));
    const top = openUpward
      ? Math.max(12, rect.top - Math.min(340, availableSpace))
      : rect.bottom + 6;

    setCoords({
      top,
      left,
      width: menuWidth,
      maxHeight,
      isMobile: false,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    const handleScrollOrResize = () => updatePosition();

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    window.addEventListener('keydown', handleEsc);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 40);
      return () => clearTimeout(timer);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleSelectValue = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setQuery('');
  };

  const trimmedQuery = query.trim();
  const hasExactMatch =
    trimmedQuery.length > 0 &&
    options.some(
      (o) =>
        o.label.toLowerCase() === trimmedQuery.toLowerCase() ||
        o.value.toLowerCase() === trimmedQuery.toLowerCase()
    );

  const dropdownContent = isOpen ? (
    <>
      {coords.isMobile && (
        <div
          className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs z-[99998]"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
        />
      )}
      <div
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
        style={
          coords.isMobile
            ? {
                position: 'fixed',
                top: '56px',
                left: '12px',
                right: '12px',
                zIndex: 99999,
              }
            : {
                position: 'fixed',
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                width: `${coords.width}px`,
                zIndex: 99999,
              }
        }
        className="rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] shadow-2xl overflow-hidden animate-fade-in"
      >
        {/* Sticky Search Input Always First */}
        <div className="p-2.5 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-1.5">
          {coords.isMobile && (
            <div className="flex items-center justify-between px-0.5 pb-1">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">
                {ariaLabel || placeholder}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close selector"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
          )}
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (filteredOptions.length > 0 && !filteredOptions[0].disabled) {
                    handleSelectValue(filteredOptions[0].value);
                  } else if (allowCustom && trimmedQuery) {
                    handleSelectValue(trimmedQuery);
                  }
                }
              }}
              placeholder={searchPlaceholder}
              className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between px-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
            <span>
              {filteredOptions.length} of {options.length} available
            </span>
            {query && <span>Press Enter to select top match</span>}
          </div>
        </div>

        {/* Scrollable Options List */}
        <div
          style={{ maxHeight: coords.isMobile ? '52vh' : `${coords.maxHeight}px` }}
          className="overflow-y-auto divide-y divide-[#e3e6ea]/60 dark:divide-[#262b36]/60"
        >
          {emptyOptionLabel && !query.trim() && (
            <button
              type="button"
              onClick={() => handleSelectValue('')}
              className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                value === ''
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className="truncate">{emptyOptionLabel}</span>
              {value === '' && <Check size={14} className="shrink-0 text-emerald-500" />}
            </button>
          )}

          {filteredOptions.length === 0 ? (
            <div className="p-4 text-center space-y-2">
              <div className="text-xs text-slate-500 dark:text-slate-400">{emptyMessage}</div>
              {allowCustom && trimmedQuery && (
                <button
                  type="button"
                  onClick={() => handleSelectValue(trimmedQuery)}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={13} />
                  <span className="truncate">
                    {customLabelPrefix} &ldquo;{trimmedQuery}&rdquo;
                  </span>
                </button>
              )}
            </div>
          ) : (
            <>
              {filteredOptions.map((opt, idx) => {
                const isSelected =
                  opt.value === value ||
                  Boolean(selectedOption && selectedOption.value === opt.value);
                return (
                  <button
                    key={`${opt.value}-${idx}`}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => {
                      if (!opt.disabled) handleSelectValue(opt.value);
                    }}
                    className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between gap-2.5 transition-colors ${
                      opt.disabled
                        ? 'opacity-40 cursor-not-allowed'
                        : 'cursor-pointer hover:bg-emerald-500/10'
                    } ${
                      isSelected
                        ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate">{opt.label}</div>
                      {opt.sublabel && (
                        <div className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {opt.sublabel}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <Check size={14} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </button>
                );
              })}
              {allowCustom && trimmedQuery && !hasExactMatch && (
                <button
                  type="button"
                  onClick={() => handleSelectValue(trimmedQuery)}
                  className="w-full px-3.5 py-2.5 text-left text-xs bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={13} className="shrink-0" />
                  <span className="truncate">
                    {customLabelPrefix} &ldquo;{trimmedQuery}&rdquo;
                  </span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  ) : null;

  return (
    <div
      ref={containerRef}
      onClick={(e) => e.stopPropagation()}
      className={`relative ${className}`}
    >
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel || placeholder}
        aria-expanded={isOpen}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        className={`w-full flex items-center justify-between gap-2 text-left bg-white dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl px-3 py-2 text-xs transition-colors focus:outline-none focus:border-emerald-500 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-emerald-500/60'
        } ${isOpen ? 'border-emerald-500 ring-1 ring-emerald-500/20' : ''} ${triggerClassName}`}
      >
        <span
          className={`truncate ${
            value || emptyOptionLabel
              ? 'text-slate-900 dark:text-slate-100 font-semibold'
              : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          {displayLabel}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180 text-emerald-500' : ''
          }`}
        />
      </button>

      {typeof document !== 'undefined' && dropdownContent
        ? createPortal(dropdownContent, document.body)
        : dropdownContent}
    </div>
  );
};
