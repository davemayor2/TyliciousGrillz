import React from 'react';
import { CardProps } from '@/types';
import { cn } from '@/utils/cn';

export default function Card({ children, className, hoverable = true, dark = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[2.5rem] p-6 md:p-8 transition-all duration-300 border border-brand-orange/10',
        dark ? 'bg-brand-brown text-white' : 'bg-white text-brand-brown shadow-[0_12px_40px_rgba(42,3,0,0.03)]',
        hoverable && 'hover:translate-y-[-6px] hover:shadow-[0_20px_50px_rgba(42,3,0,0.06)]',
        className
      )}
    >
      {children}
    </div>
  );
}
