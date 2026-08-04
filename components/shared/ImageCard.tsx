import React from 'react';
import Image from 'next/image';
import { ImageCardProps } from '@/types';
import { cn } from '@/utils/cn';

export default function ImageCard({ src, alt, className, priority = false }: ImageCardProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-[2rem] bg-brand-orange/5 border border-brand-orange/5 group shadow-[0_8px_30px_rgba(42,3,0,0.02)]', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading={priority ? undefined : 'lazy'}
        priority={priority}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end p-6">
        <span className="text-white font-judson font-bold text-lg md:text-xl tracking-wide">
          {alt}
        </span>
      </div>
    </div>
  );
}
