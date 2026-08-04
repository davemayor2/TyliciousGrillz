'use client';

import React from 'react';
import Image from 'next/image';

interface FeatureCardProps {
  icon: string;
  title: string;
  image: string;
  description: string;
}

export default function FeatureCard({ icon, title, image, description }: FeatureCardProps) {
  return (
    <div className="relative w-full h-full group">
      {/* Background Offset Shadow Layer (curved, soft pink backdrop) */}
      <div className="absolute inset-0 bg-[#FFD7D7] rounded-[2rem] translate-x-2.5 translate-y-2.5 z-0 transition-all duration-300 group-hover:bg-[#FF8787] group-hover:translate-x-3.5 group-hover:translate-y-3.5" />

      {/* Main Card Container */}
      <div className="relative z-10 bg-white border border-brand-orange/5 p-8 rounded-[2rem] flex flex-col items-center text-center shadow-[0_8px_30px_rgba(42,3,0,0.015)] h-full">
        {/* Header (Emoji + Title) */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl md:text-2xl">{icon}</span>
          <h3 className="font-sans font-bold text-xl md:text-2xl text-black tracking-tight">
            {title}
          </h3>
        </div>

        {/* Image Container (Stadium / Capsule Mask) */}
        <div className="my-6 w-full max-w-[280px] h-[140px] md:h-[160px] relative rounded-full overflow-hidden bg-brand-bg border border-brand-orange/10 shadow-inner">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 30vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Description Paragraph */}
        <p className="font-sans font-normal text-[#1F2937] text-sm md:text-base leading-relaxed max-w-[280px] mt-auto">
          {description}
        </p>
      </div>
    </div>
  );
}
