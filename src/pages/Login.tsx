import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SupabaseConfigBanner } from '../components/common/SupabaseConfigBanner';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { signIn, isConfigured } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFormError('Please enter your email address.');
      return;
    }
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await signIn(trimmedEmail, password);

      if (error) {
        let msg = error.message;
        if (msg.includes('Invalid login credentials')) {
          msg = 'Invalid email or password. Please verify your credentials.';
        } else if (msg.includes('Email not confirmed')) {
          msg = 'Please verify your email address before logging in.';
        } else if (msg.includes('Failed to fetch')) {
          msg = 'Network error or invalid Supabase URL. Please check your internet connection.';
        }
        setFormError(msg);
        showToast(msg, 'error', 'Login Failed');
      } else {
        showToast('Welcome back!', 'success', 'Logged In');
        navigate('/dashboard');
      }
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SupabaseConfigBanner />

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-100">Sign in to your account</h2>
        <p className="text-xs text-slate-400 mt-1">
          Access your device fleets, categories, and realtime states
        </p>
      </div>

      {formError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
          <span className="flex-1 leading-relaxed">{formError}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !isConfigured}
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <LogIn className="w-4 h-4" />
          )}
          <span>Sign In</span>
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-6 pt-5 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
          >
            Create an account
            <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </div>
  );
};
