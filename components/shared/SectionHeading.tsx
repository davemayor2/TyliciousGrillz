import React from 'react';
import { SectionHeadingProps } from '@/types';
import { cn } from '@/utils/cn';

export default function SectionHeading({
  title,
  highlightedWord,
  subtitle,
  align = 'center',
  className,
  dark = false,
}: SectionHeadingProps) {
  const isCentered = align === 'center';
  const isRight = align === 'right';

  // Function to split title and highlight the specified word
  const renderTitle = () => {
    if (!highlightedWord) {
      return title;
    }

    const regex = new RegExp(`(${highlightedWord})`, 'gi');
    const parts = title.split(regex);

    return parts.map((part, index) => {
      const isHighlighted = part.toLowerCase() === highlightedWord.toLowerCase();
      return (
        <span
          key={index}
          className={isHighlighted ? 'text-brand-orange' : dark ? 'text-white' : 'text-brand-brown'}
        >
          {part}
        </span>
      );
    });
  };

  return (
    <div
      className={cn(
        'flex flex-col mb-10 md:mb-16 w-full',
        isCentered && 'items-center text-center',
        isRight && 'items-end text-right',
        className
      )}
    >
      {subtitle && (
        <span className="font-sans font-semibold text-xs md:text-sm tracking-[0.15em] uppercase text-brand-orange mb-3">
          {subtitle}
        </span>
      )}
      <h2
        className={cn(
          'font-judson font-bold text-3xl md:text-5xl lg:text-[3.25rem] leading-[1.15] tracking-wide max-w-3xl',
          dark ? 'text-white' : 'text-brand-brown'
        )}
      >
        {renderTitle()}
      </h2>
    </div>
  );
}
