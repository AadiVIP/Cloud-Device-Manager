import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SupabaseConfigBanner } from '../components/common/SupabaseConfigBanner';
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { resetPassword, isConfigured } = useAuth();
  const { showToast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmed = email.trim();
    if (!trimmed) {
      setFormError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await resetPassword(trimmed);

      if (error) {
        setFormError(error.message);
        showToast(error.message, 'error', 'Reset Failed');
      } else {
        setIsSubmitted(true);
        showToast('Password reset instructions sent to your email', 'success');
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to send password reset request.');
      showToast(err.message || 'Error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Check your inbox</h2>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          If an account exists for <span className="text-slate-200 font-semibold">{email}</span>, we have sent a secure password reset link.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Return to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <SupabaseConfigBanner />

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-100">Reset your password</h2>
        <p className="text-xs text-slate-400 mt-1">
          Enter your account email to receive a password recovery link
        </p>
      </div>

      {formError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
          <span className="flex-1 leading-relaxed">{formError}</span>
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Registered Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !isConfigured}
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <KeyRound className="w-4 h-4" />
          )}
          <span>Send Reset Link</span>
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-800 text-center">
        <Link
          to="/login"
          className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Login
        </Link>
      </div>
    </div>
  );
};
