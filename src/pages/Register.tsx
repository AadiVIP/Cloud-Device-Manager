import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SupabaseConfigBanner } from '../components/common/SupabaseConfigBanner';
import { Mail, Lock, UserPlus, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { signUp, isConfigured } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFormError('Please enter an email address.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await signUp(trimmedEmail, password);

      if (error) {
        let msg = error.message;
        if (msg.includes('already registered')) {
          msg = 'An account with this email address already exists. Please sign in instead.';
        } else if (msg.includes('Password should be at least')) {
          msg = 'Password is too weak. Please use at least 6 characters.';
        }
        setFormError(msg);
        showToast(msg, 'error', 'Registration Failed');
      } else {
        // If Supabase has email confirmation disabled, user session is automatically created
        if (data?.session) {
          showToast('Account created successfully!', 'success', 'Welcome');
          navigate('/dashboard');
        } else {
          // If email confirmation is enabled in Supabase project settings
          setIsSuccess(true);
          showToast('Verification email sent!', 'info');
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred during signup.');
      showToast(err.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Check your email</h2>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          We sent a confirmation link to <span className="text-slate-200 font-semibold">{email}</span>. Click the link in the email to activate your account, then sign in.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <SupabaseConfigBanner />

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-100">Create your account</h2>
        <p className="text-xs text-slate-400 mt-1">
          Start organizing categories and managing cloud devices
        </p>
      </div>

      {formError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
          <span className="flex-1 leading-relaxed">{formError}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
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
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Password (min. 6 characters)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            <UserPlus className="w-4 h-4" />
          )}
          <span>Create Account</span>
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-6 pt-5 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
