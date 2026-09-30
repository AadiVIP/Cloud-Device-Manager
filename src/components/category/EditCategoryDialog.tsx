import React, { useState, useEffect, useRef } from 'react';
import { Category } from '../../types';
import { X, Edit2 } from 'lucide-react';

interface EditCategoryDialogProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, name: string) => Promise<boolean>;
}

export const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
  category,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (category && isOpen) {
      setName(category.name);
      setError('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [category, isOpen]);

  if (!isOpen || !category) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Category name cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const ok = await onSave(category.id, trimmed);
      if (ok) {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to rename category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Edit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Rename Category</h3>
            <p className="text-xs text-slate-400">Update category title</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category Name <span className="text-rose-400">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
