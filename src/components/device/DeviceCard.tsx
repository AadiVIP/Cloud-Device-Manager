import React, { useState } from 'react';
import { Device, DeviceStatus } from '../../types';
import { STATUS_OPTIONS } from '../../lib/utils';
import { StatusBadge } from './StatusBadge';
import { Edit2, Trash2, ChevronDown, FileText, Hash } from 'lucide-react';

interface DeviceCardProps {
  device: Device;
  onEdit: (device: Device) => void;
  onDelete: (device: Device) => void;
  onStatusChange: (deviceId: string, newStatus: DeviceStatus) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div className="group relative rounded-xl bg-slate-900/60 border border-slate-800/90 hover:border-slate-700/80 p-3.5 sm:p-4 transition-all hover:shadow-lg hover:shadow-black/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Device Information */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-sm text-slate-100 group-hover:text-indigo-200 transition-colors truncate">
              {device.name}
            </h4>

            {/* Quick Status Pill/Dropdown for instant status change */}
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className="flex items-center gap-1 group/btn focus:outline-hidden"
                title="Click to change status"
              >
                <StatusBadge status={device.status} size="sm" />
                <ChevronDown className="w-3 h-3 text-slate-500 hover:text-slate-300 transition-colors" />
              </button>

              {statusDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setStatusDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-36 rounded-xl bg-slate-900 border border-slate-700 p-1.5 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-100">
                    <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">
                      Set Status
                    </div>
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          onStatusChange(device.id, opt);
                          setStatusDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                          device.status === opt
                            ? 'bg-indigo-600/30 text-indigo-300 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                        }`}
                      >
                        <span className="truncate">{opt}</span>
                        {device.status === opt && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ID display (optional) */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Hash className="w-3 h-3 text-slate-500" />
              <span>ID:</span>
            </span>
            {device.device_id ? (
              <span className="font-mono text-slate-200 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50 select-all">
                {device.device_id}
              </span>
            ) : (
              <span className="text-slate-500 italic">—</span>
            )}
          </div>
        </div>

        {/* Action Buttons (Edit, Notes, Delete) */}
        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
          {device.notes && (
            <button
              type="button"
              onClick={() => setShowNotes(!showNotes)}
              className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
                showNotes
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-700/60'
              }`}
              title={showNotes ? 'Hide notes' : 'View notes'}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden xs:inline text-[11px]">Notes</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(device)}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-800/50 text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 hover:border-slate-600 transition-colors"
            title="Edit device"
            aria-label="Edit device"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(device)}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-800/50 text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors"
            title="Delete device"
            aria-label="Delete device"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded notes preview */}
      {showNotes && device.notes && (
        <div className="mt-3 p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap animate-in fade-in duration-150">
          <div className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider mb-1 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Device Notes
          </div>
          {device.notes}
        </div>
      )}
    </div>
  );
};
