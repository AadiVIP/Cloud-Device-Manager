import React, { useState, useEffect } from 'react';
import { Device, DeviceStatus, Category } from '../../types';
import { STATUS_OPTIONS } from '../../lib/utils';
import { X, Edit3, Hash } from 'lucide-react';

interface EditDeviceDialogProps {
  device: Device | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    id: string,
    updates: {
      name?: string;
      device_id?: string | null;
      status?: DeviceStatus;
      notes?: string | null;
      category_id?: string;
    }
  ) => Promise<boolean>;
  categories: Category[];
}

export const EditDeviceDialog: React.FC<EditDeviceDialogProps> = ({
  device,
  isOpen,
  onClose,
  onSave,
  categories,
}) => {
  const [name, setName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [status, setStatus] = useState<DeviceStatus>('Empty');
  const [notes, setNotes] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (device && isOpen) {
      setName(device.name);
      setDeviceId(device.device_id || '');
      setStatus(device.status);
      setNotes(device.notes || '');
      setCategoryId(device.category_id);
      setError('');
    }
  }, [device, isOpen]);

  if (!isOpen || !device) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Device name cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const success = await onSave(device.id, {
        name: trimmedName,
        device_id: deviceId.trim() || null,
        status,
        notes: notes.trim() || null,
        category_id: categoryId,
      });

      if (success) {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update device.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative animate-in zoom-in-95 duration-200"
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
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Edit Device</h3>
            <p className="text-xs text-slate-400">Update device parameters and status</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Device Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* ID Field (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                Device ID
              </label>
              <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">optional</span>
            </div>
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="Leave empty if not assigned"
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DeviceStatus)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-900 text-slate-100">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Category selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900 text-slate-100">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Notes
              </label>
              <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">optional</span>
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Actions */}
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
