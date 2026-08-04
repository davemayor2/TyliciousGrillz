import React from 'react';
import { BadgeProps } from '@/types';
import { cn } from '@/utils/cn';

export default function Badge({ children, className, icon }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-brand-orange/15 text-brand-brown text-xs md:text-sm font-semibold shadow-sm',
        className
      )}
    >
      {icon && <span className="inline-flex items-center text-sm">{icon}</span>}
      <span className="font-sans font-medium">{children}</span>
    </div>
  );
}
