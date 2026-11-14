import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  searchPlaceholder = 'Type to search...',
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
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Find current selected option by exact value or case-insensitive label match
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

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 40);
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

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel || placeholder}
        aria-expanded={isOpen}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        className={`w-full flex items-center justify-between gap-2 text-left bg-white dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-2.5 py-2 text-xs font-mono transition-colors focus:outline-none focus:border-emerald-500 ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer hover:border-emerald-500/60'
        } ${
          isOpen ? 'border-emerald-500 ring-1 ring-emerald-500/20' : ''
        } ${triggerClassName}`}
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
          size={13}
          className={`shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-500' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 z-50 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] shadow-2xl overflow-hidden animate-fade-in min-w-[210px]">
          {/* Sticky Search Input */}
          <div className="p-2 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-1">
            <div className="relative flex items-center">
              <Search size={13} className="absolute left-2.5 text-slate-400 pointer-events-none" />
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
                className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg pl-8 pr-7 py-1.5 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between px-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
              <span>
                {filteredOptions.length} of {options.length} available
              </span>
              {query && <span>Press Enter to pick top match</span>}
            </div>
          </div>

          {/* Scrollable Options List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-[#e3e6ea]/60 dark:divide-[#262b36]/60">
            {emptyOptionLabel && !query.trim() && (
              <button
                type="button"
                onClick={() => handleSelectValue('')}
                className={`w-full px-3 py-2 text-left text-xs font-mono flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                  value === ''
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="truncate">{emptyOptionLabel}</span>
                {value === '' && <Check size={13} className="shrink-0 text-emerald-500" />}
              </button>
            )}

            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center space-y-2">
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {emptyMessage}
                </div>
                {allowCustom && trimmedQuery && (
                  <button
                    type="button"
                    onClick={() => handleSelectValue(trimmedQuery)}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span className="truncate">
                      {customLabelPrefix} &ldquo;{trimmedQuery}&rdquo;
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <>
                {filteredOptions.map((opt) => {
                  const isSelected =
                    opt.value === value ||
                    (selectedOption && selectedOption.value === opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={opt.disabled}
                      onClick={() => {
                        if (!opt.disabled) handleSelectValue(opt.value);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between gap-2 transition-colors ${
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
                        <div className="truncate font-mono">{opt.label}</div>
                        {opt.sublabel && (
                          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                            {opt.sublabel}
                          </div>
                        )}
                      </div>
                      {isSelected && <Check size={13} className="shrink-0 text-emerald-600 dark:text-emerald-400" />}
                    </button>
                  );
                })}
                {allowCustom && trimmedQuery && !hasExactMatch && (
                  <button
                    type="button"
                    onClick={() => handleSelectValue(trimmedQuery)}
                    className="w-full px-3 py-2 text-left text-xs font-mono bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={12} className="shrink-0" />
                    <span className="truncate">
                      {customLabelPrefix} &ldquo;{trimmedQuery}&rdquo;
                    </span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
