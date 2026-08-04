import React from 'react';
import { ContainerProps } from '@/types';
import { cn } from '@/utils/cn';

export default function Container({ children, className, clean = false }: ContainerProps) {
  if (clean) {
    return <div className={cn('mx-auto w-full px-4 sm:px-6 md:px-8 max-w-7xl', className)}>{children}</div>;
  }
  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6 md:px-8 max-w-7xl', className)}>
      {children}
    </div>
  );
}
