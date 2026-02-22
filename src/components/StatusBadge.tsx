import React from 'react';
import { NutritionStatus } from '../types';
import { cn } from '../utils/cn';

interface StatusBadgeProps {
  status: NutritionStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const styles = {
    Normal: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    MAM: 'bg-amber-100 text-amber-700 border-amber-200',
    SAM: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  return (
    <span className={cn(
      'px-2 py-1 rounded-full text-xs font-semibold border',
      styles[status],
      className
    )}>
      {status === 'Normal' ? 'Normal' : status === 'MAM' ? 'MAM (Moderate)' : 'SAM (Severe)'}
    </span>
  );
};
