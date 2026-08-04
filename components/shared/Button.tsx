import React from 'react';
import Link from 'next/link';
import { ButtonProps } from '@/types';
import { cn } from '@/utils/cn';

export default function Button({
  children,
  onClick,
  className,
  variant = 'primary',
  href,
  type = 'button',
  disabled = false,
  icon,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-semibold rounded-full transition-all duration-300 active:scale-[0.98] cursor-pointer text-sm md:text-base';
  
  const variants = {
    primary: 'bg-brand-orange text-white px-8 py-3.5 shadow-[0_4px_0_0_#FF8787] hover:shadow-[0_2px_0_0_#FF8787] hover:translate-y-[2px] transition-all duration-200',
    secondary: 'bg-transparent text-brand-brown border-2 border-brand-brown hover:bg-brand-brown hover:text-brand-bg px-8 py-3.2 transition-all duration-200',
    outline: 'bg-transparent text-white border-2 border-white/20 hover:border-white px-8 py-3.2 transition-all duration-200',
    whatsapp: 'bg-[#25D366] text-white px-8 py-3.5 shadow-[0_4px_0_0_#15803d] hover:shadow-[0_2px_0_0_#15803d] hover:translate-y-[2px] transition-all duration-200',
  };

  const content = (
    <>
      <span>{children}</span>
      {icon && <span className="ml-2 inline-flex items-center">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(baseStyles, variants[variant], className)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], disabled && 'opacity-50 cursor-not-allowed active:scale-100', className)}
    >
      {content}
    </button>
  );
}
