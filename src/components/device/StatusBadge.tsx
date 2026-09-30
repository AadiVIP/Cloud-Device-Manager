import React from 'react';
import { DeviceStatus } from '../../types';
import { STATUS_CONFIG } from '../../lib/utils';

interface StatusBadgeProps {
  status: DeviceStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Empty'];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg font-medium border shadow-xs transition-colors ${config.badgeBg} ${config.badgeText} ${config.badgeBorder} ${sizeClasses[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotBg}`} />
      <span>{config.label}</span>
    </span>
  );
};
