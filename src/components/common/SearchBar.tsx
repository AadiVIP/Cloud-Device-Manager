import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search categories, devices, IDs, or notes...',
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick keyboard shortcut: press '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="absolute left-3.5 text-slate-400 pointer-events-none">
        <Search className="w-4 h-4" />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-slate-900/70 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/80 transition-all shadow-inner"
      />

      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 p-1 text-slate-400 hover:text-slate-200 rounded-md transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      ) : (
        <span className="hidden sm:inline absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-800/80 border border-slate-700/60 rounded-md pointer-events-none">
          /
        </span>
      )}
    </div>
  );
};
