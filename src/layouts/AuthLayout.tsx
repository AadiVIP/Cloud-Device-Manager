import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Server, ShieldCheck, Cpu } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AuthLayout: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Checking session..." />
      </div>
    );
  }

  // If already authenticated, redirect to dashboard
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 ring-1 ring-white/20 mb-4">
            <Server className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Cloud Device Manager
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
            Realtime device inventory & cloud status manager
          </p>
        </div>

        {/* Auth Card Container */}
        <div className="bg-slate-900/80 border border-slate-800/90 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl backdrop-blur-xl">
          <Outlet />
        </div>

        {/* Footer Features */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
            <span>Supabase RLS Protected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-indigo-400/80" />
            <span>Realtime Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
