import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Server, Plus, LogOut, User as UserIcon, Radio, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onAddCategory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAddCategory }) => {
  const { user, signOut, isConfigured } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userEmail = user?.email || 'User';
  const initial = userEmail.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-100 tracking-tight">Cloud Device Manager</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Radio className="w-2.5 h-2.5 animate-pulse text-indigo-400" />
                Live
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 leading-none">
              Realtime device inventory & status orchestrator
            </p>
          </div>
        </div>

        {/* Action Buttons & User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Add Category Button */}
          <button
            onClick={onAddCategory}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/25 ring-1 ring-white/10"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Category</span>
            <span className="sm:hidden">Category</span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-700 text-slate-200 transition-all text-sm"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                {initial}
              </div>
              <span className="hidden md:inline max-w-[140px] truncate text-xs text-slate-300 font-medium">
                {userEmail}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 border border-slate-800 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2.5 border-b border-slate-800/80 mb-1">
                  <div className="text-xs text-slate-400">Signed in as</div>
                  <div className="text-sm font-semibold text-slate-200 truncate mt-0.5">{userEmail}</div>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
                    <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
                    <span>{isConfigured ? 'Supabase Connected' : 'Supabase Not Configured'}</span>
                  </div>
                </div>

                <div className="py-1">
                  <div className="px-3 py-2 text-xs text-slate-400 flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>User ID: <code className="text-[10px] text-slate-300">{user?.id?.slice(0, 8)}...</code></span>
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
