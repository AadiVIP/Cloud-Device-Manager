import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DeviceStatus } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface StatusStyle {
  label: DeviceStatus;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotBg: string;
  accentBg: string;
  cardBorder: string;
}

export const STATUS_CONFIG: Record<DeviceStatus, StatusStyle> = {
  'Empty': {
    label: 'Empty',
    badgeBg: 'bg-slate-800/80',
    badgeText: 'text-slate-400',
    badgeBorder: 'border-slate-700/60',
    dotBg: 'bg-slate-400',
    accentBg: 'bg-slate-500/10',
    cardBorder: 'hover:border-slate-700',
  },
  'In Progress': {
    label: 'In Progress',
    badgeBg: 'bg-amber-950/60',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-700/50',
    dotBg: 'bg-amber-400 animate-pulse',
    accentBg: 'bg-amber-500/10',
    cardBorder: 'hover:border-amber-700/50',
  },
  'Active': {
    label: 'Active',
    badgeBg: 'bg-emerald-950/60',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-700/50',
    dotBg: 'bg-emerald-400',
    accentBg: 'bg-emerald-500/10',
    cardBorder: 'hover:border-emerald-700/50',
  },
  'Completed': {
    label: 'Completed',
    badgeBg: 'bg-cyan-950/60',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-700/50',
    dotBg: 'bg-cyan-400',
    accentBg: 'bg-cyan-500/10',
    cardBorder: 'hover:border-cyan-700/50',
  },
  'Error': {
    label: 'Error',
    badgeBg: 'bg-rose-950/60',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-700/50',
    dotBg: 'bg-rose-400',
    accentBg: 'bg-rose-500/10',
    cardBorder: 'hover:border-rose-700/50',
  },
};

export const STATUS_OPTIONS: DeviceStatus[] = [
  'Empty',
  'In Progress',
  'Active',
  'Completed',
  'Error',
];

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}
