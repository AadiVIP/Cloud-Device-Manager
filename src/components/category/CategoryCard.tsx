import React, { useState, useRef, useEffect } from 'react';
import { Category, Device, DeviceStatus } from '../../types';
import { DeviceCard } from '../device/DeviceCard';
import {
  MoreVertical,
  Plus,
  ChevronDown,
  Edit2,
  Trash2,
  Layers,
  Inbox,
} from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  devices: Device[];
  totalDeviceCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onRename: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAddDevice: (category: Category) => void;
  onEditDevice: (device: Device) => void;
  onDeleteDevice: (device: Device) => void;
  onStatusChange: (deviceId: string, newStatus: DeviceStatus) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  devices,
  totalDeviceCount,
  isCollapsed,
  onToggleCollapse,
  onRename,
  onDelete,
  onAddDevice,
  onEditDevice,
  onDeleteDevice,
  onStatusChange,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const deviceCountText =
    totalDeviceCount === 1 ? '1 Device' : `${totalDeviceCount} Devices`;

  return (
    <div className="rounded-2xl bg-[#0e1422]/90 border border-slate-800/90 shadow-xl overflow-hidden transition-all duration-200 hover:border-slate-700/80">
      {/* Category Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-slate-800/60 bg-slate-900/30">
        <div
          onClick={onToggleCollapse}
          className="flex items-center gap-3 min-w-0 cursor-pointer select-none group flex-1"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 group-hover:border-indigo-500/40 transition-colors shrink-0">
            <Layers className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-base text-slate-100 group-hover:text-indigo-300 transition-colors truncate">
              {category.name}
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {deviceCountText}
              {devices.length !== totalDeviceCount && (
                <span className="text-indigo-400 ml-1">({devices.length} filtered)</span>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Collapse/Expand Toggle Button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand category' : 'Collapse category'}
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isCollapsed ? '-rotate-90' : 'rotate-0'
              }`}
            />
          </button>

          {/* Options Menu (⋮) */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              aria-label="Category options"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-slate-900 border border-slate-700 p-1.5 shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onRename(category);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Rename Category
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(category);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Category
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Content: Devices & Add Device Button */}
      {!isCollapsed && (
        <div className="p-4 sm:p-5 space-y-3">
          {devices.length === 0 ? (
            <div className="py-6 px-4 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/20">
              <Inbox className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium">
                {totalDeviceCount === 0
                  ? 'No devices inside this category yet.'
                  : 'No devices match the search or status filter.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {devices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onEdit={onEditDevice}
                  onDelete={onDeleteDevice}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          )}

          {/* Add Device Button at bottom of category */}
          <button
            type="button"
            onClick={() => onAddDevice(category)}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/50 text-indigo-300 text-xs font-semibold transition-all active:scale-[0.99]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Device</span>
          </button>
        </div>
      )}
    </div>
  );
};
