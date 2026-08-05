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
      // Zoom reveal effect for background image
      gsap.fromTo(
        bgRef.current,
        { scale: 1.08 },
        { scale: 1, duration: 1.8, ease: 'power2.out' }
      );
      
      // Staggered reveal for text content
      gsap.fromTo(
        '.animate-contact-hero',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.18, ease: 'power3.out', delay: 0.25 }
      );
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={contentRef} className="relative w-full flex flex-col items-center justify-center overflow-hidden pt-[150px] pb-20 border-none">
      {/* Background Image: Overhead dark culinary flat-lay */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        <Image
          src="/images/about us (2).png"
          alt="Overhead dark culinary flat-lay background with fresh ingredients"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark overlay: 50% opacity mask */}
        <div className="absolute inset-0 bg-black/50 z-10" />
      </div>

      <Container className="relative z-20 text-center flex flex-col items-center">
        {/* Centered Content Block */}
        <div className="max-w-[680px] w-full flex flex-col items-center">
          
          {/* Main Title: Instrument Sans Extra Bold */}
          <h1 className="animate-contact-hero font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] text-white tracking-[-0.02em] leading-tight mb-4">
            Contact Us
          </h1>

          {/* Subheading Paragraph: Instrument Sans */}
          <p className="animate-contact-hero font-sans text-white/85 text-base md:text-[1.125rem] leading-[1.5] font-normal whitespace-pre-line">
            Enjoy expertly grilled fish, prawns, croaker fish, lamb chops, chicken wings and more.{"\n"}
            Freshly prepared and delivered hot across your location.
          </p>

        </div>
      </Container>
    </section>
  );
}
