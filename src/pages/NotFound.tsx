import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">404</h1>
        <p className="text-sm font-medium text-slate-300 mt-1">Page Not Found</p>
        <p className="text-xs text-slate-400 mt-2">
          The requested page does not exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};
