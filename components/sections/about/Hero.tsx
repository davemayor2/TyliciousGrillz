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
        '.animate-about-hero',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.18, ease: 'power3.out', delay: 0.25 }
      );
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={contentRef} className="relative w-full flex flex-col items-center justify-center overflow-hidden pt-[160px] pb-24 border-none">
      {/* Background Image: Chef grilling fish framed by fresh ingredients */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        <Image
          src="/images/about_page.webp"
          alt="Chef grilling fish over open flames, framed by fresh vegetables"
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
        <div className="max-w-[750px] w-full flex flex-col items-center">

          {/* Main Headline: Instrument Sans Extra Bold */}
          <h1 className="animate-about-hero font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] text-white tracking-[-0.02em] leading-[1.1] mb-5">
            Crafted with Passion. <br />
            Grilled to Perfection.
          </h1>

          {/* Subheading / Narrative Paragraph: Instrument Sans */}
          <p className="animate-about-hero font-sans text-white/90 text-base md:text-[1.125rem] leading-[1.5] font-normal max-w-[720px]">
            At Tylicious Grillz, every meal is prepared with premium ingredients, bold flavours, and authentic grilling techniques to create unforgettable dining experiences.
          </p>

        </div>
      </Container>
    </section>
  );
}
