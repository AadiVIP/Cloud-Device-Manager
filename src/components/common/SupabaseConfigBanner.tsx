import React, { useState } from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { AlertTriangle, Database, Check, Copy, ChevronDown, ChevronUp } from 'lucide-react';

export const SupabaseConfigBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isSupabaseConfigured()) {
    return null;
  }

  const envSample = `VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...`;

  const copyEnv = () => {
    navigator.clipboard.writeText(envSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 text-amber-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-sm text-amber-300">
              Supabase Backend Setup Required
            </h4>
            <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
              To connect real cloud database storage, authentication, and live sync, connect your Supabase project in <code className="bg-amber-950/60 px-1 py-0.5 rounded text-amber-300 font-mono">.env</code>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-xs font-medium text-amber-300 hover:text-amber-100 bg-amber-500/20 px-2.5 py-1.5 rounded-lg border border-amber-500/30 shrink-0 transition-colors"
        >
          <span>{isOpen ? 'Hide Instructions' : 'View Setup Steps'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-amber-500/20 space-y-3 text-xs text-amber-100/90 animate-in fade-in duration-200">
          <ol className="list-decimal list-inside space-y-2 leading-relaxed">
            <li>
              Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-white">supabase.com</a> and create a new project.
            </li>
            <li>
              Navigate to <strong>Project Settings &gt; API</strong> to copy your <strong>Project URL</strong> and <strong>anon (public) key</strong>.
            </li>
            <li>
              Paste them into your local <code className="bg-amber-950/60 px-1.5 py-0.5 rounded font-mono text-amber-300">.env</code> file:
              <div className="mt-2 relative">
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto">
                  {envSample}
                </pre>
                <button
                  onClick={copyEnv}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Copy"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </li>
            <li>
              Open Supabase's <strong>SQL Editor</strong> and run the schema script located at:
              <div className="mt-1 flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400 shrink-0" />
                <code className="bg-amber-950/60 px-2 py-1 rounded font-mono text-amber-300">supabase/schema.sql</code>
              </div>
            </li>
            <li>Restart Vite or refresh this page once saved!</li>
          </ol>
        </div>
      )}
    </div>
  );
};
