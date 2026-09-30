import React from 'react';
import { StatusFilterOption, DeviceStatus } from '../../types';
import { STATUS_CONFIG } from '../../lib/utils';

interface StatusFilterProps {
  currentFilter: StatusFilterOption;
  onFilterChange: (status: StatusFilterOption) => void;
  counts?: {
    total: number;
    empty: number;
    inProgress: number;
    active: number;
    completed: number;
    error: number;
  };
}

export const StatusFilter: React.FC<StatusFilterProps> = ({
  currentFilter,
  onFilterChange,
  counts,
}) => {
  const options: { label: StatusFilterOption; count?: number; dot?: string }[] = [
    { label: 'All', count: counts?.total },
    { label: 'Empty', count: counts?.empty, dot: STATUS_CONFIG['Empty'].dotBg },
    { label: 'In Progress', count: counts?.inProgress, dot: STATUS_CONFIG['In Progress'].dotBg },
    { label: 'Active', count: counts?.active, dot: STATUS_CONFIG['Active'].dotBg },
    { label: 'Completed', count: counts?.completed, dot: STATUS_CONFIG['Completed'].dotBg },
    { label: 'Error', count: counts?.error, dot: STATUS_CONFIG['Error'].dotBg },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none sm:pb-0">
      {options.map((opt) => {
        const isSelected = currentFilter === opt.label;
        const statusConfig = opt.label !== 'All' ? STATUS_CONFIG[opt.label as DeviceStatus] : null;

        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onFilterChange(opt.label)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
              isSelected
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-xs ring-1 ring-indigo-500/30'
                : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60 hover:border-slate-700'
            }`}
          >
            {opt.dot && <span className={`w-2 h-2 rounded-full ${opt.dot}`} />}
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  isSelected
                    ? 'bg-indigo-500/30 text-indigo-200'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
