'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Container from '../../shared/Container';
import gsap from '@/libs/gsap';

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background Image zoom reveal
      gsap.fromTo(
        bgRef.current,
        { scale: 1.08 },
        { scale: 1, duration: 1.8, ease: 'power2.out' }
      );
      
      // Text items staggered fade-up reveal
      gsap.fromTo(
        '.animate-menu-hero',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.18, ease: 'power3.out', delay: 0.25 }
      );
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={contentRef} className="relative min-h-[45vh] w-full flex flex-col items-center justify-center overflow-hidden pt-[150px] pb-20 border-none">
      {/* Background Image: Overhead culinary flat-lay with ingredients */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        <Image
          src="/images/about us (2).png"
          alt="Overhead dark culinary flat-lay background with ingredients"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark overlay: 50% opacity mask */}
        <div className="absolute inset-0 bg-black/55 z-10" />
      </div>

      <Container className="relative z-20 text-center flex flex-col items-center">
        {/* Constrained width content block */}
        <div className="max-w-[700px] w-full flex flex-col items-center">
          
          {/* Main Title: Instrument Sans Bold display */}
          <h1 className="animate-menu-hero font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] text-white tracking-[-0.02em] leading-tight mb-4">
            Our Menu
          </h1>

          {/* Subheading / Paragraph: Instrument Sans */}
          <p className="animate-menu-hero font-sans text-white/85 text-base md:text-[1.125rem] leading-[1.5] font-normal mb-6 max-w-[660px]">
            From flame-grilled fish and juicy meats to signature platters and delicious sides, every meal is prepared with bold flavours, quality ingredients, and authentic grilling techniques.
          </p>

          {/* Feature Highlights Row */}
          <div className="animate-menu-hero flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans font-bold text-white text-sm md:text-base tracking-wide select-none">
            <span>Premium Grills</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
            <span>Fresh Ingredients</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
            <span>Fast Delivery</span>
          </div>

        </div>
      </Container>
    </section>
  );
}
