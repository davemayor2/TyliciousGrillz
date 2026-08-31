'use client';

import React from 'react';
import Image from 'next/image';
import Container from '../../shared/Container';
import SectionHeading from '../../shared/SectionHeading';
import AnimatedSection from '../../shared/AnimatedSection';
import Button from '../../shared/Button';

export default function Gallery() {
  return (
    <section className="py-24 bg-[#FFF5F5] relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute bottom-10 right-1/4 w-[30rem] h-[30rem] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <SectionHeading
            title="Fresh From The Grill"
            highlightedWord="Grill"
            align="left"
            className="mb-0 max-w-xl"
          />
          <p className="font-sans text-brand-brown/70 text-sm md:text-base max-w-sm leading-relaxed mb-2 text-left">
            Real photos from our kitchen and active grill stations. What you see is exactly what gets delivered to your doorstep.
          </p>
        </div>

        {/* Asymmetrical Bento-Box Image Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

          {/* ================= TOP ROW ================= */}

          {/* 1. Top-Left Card (Wide Hero Image) - Spans 2 Columns */}
          <AnimatedSection direction="left" className="md:col-span-2 relative group overflow-hidden rounded-[24px] aspect-[16/10] md:aspect-[2.1/1] border border-brand-orange/5 shadow-sm bg-white cursor-pointer">
            <Image
              src="/images/gallery_img.jpg"
              alt="Grilled chicken pieces sizzling on an open grill"
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </AnimatedSection>

          {/* 2. Top-Right Card (Medium Square Image) - Spans 1 Column */}
          <AnimatedSection direction="right" className="md:col-span-1 relative group overflow-hidden rounded-[24px] aspect-square md:aspect-auto border border-brand-orange/5 shadow-sm bg-white cursor-pointer">
            <Image
              src="/images/rs=w_1160,h_1150.webp"
              alt="Seasoned grilled fish served on wooden board"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </AnimatedSection>

          {/* ================= BOTTOM ROW ================= */}

          {/* 3. Bottom-Left Card (2x2 Internal Grid Collage) - Spans 1 Column */}
          <AnimatedSection direction="up" delay={0.1} className="md:col-span-1 relative group overflow-hidden rounded-[24px] aspect-[3/4] border border-brand-orange/5 shadow-sm bg-white cursor-pointer">
            <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full h-full absolute inset-0 bg-white">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src="/images/rs=w_1160,h_1532.webp"
                  alt="Grilled lamb chops"
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src="/images/rs=w_1160,h_1773.webp"
                  alt="Peppered grilled fish"
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src="/images/Rectangle 24.png"
                  alt="Seasoned chicken wings"
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src="/images/rs=w_365,h_365,cg_true.webp"
                  alt="Sliced vegetables"
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>

            {/* Logo Overlay anchored at bottom-center/left intersection of the mini-tiles */}
            <div className="absolute bottom-4 left-4 z-20 bg-brand-orange text-white text-[11px] font-judson font-bold px-3 py-1 rounded-full border border-white/20 shadow-md select-none transition-transform duration-300 group-hover:scale-105">
              Tylicious Grillz
            </div>
          </AnimatedSection>

          {/* 4. Bottom-Center Card (Large Tall Image) - Spans 1 Column */}
          <AnimatedSection direction="up" delay={0.2} className="md:col-span-1 relative group overflow-hidden rounded-[24px] aspect-[3/4] border border-brand-orange/5 shadow-sm bg-white cursor-pointer">
            <Image
              src="/images/rs=w_1160,h_1218.webp"
              alt="Whole fish in wire grilling basket"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

            {/* Flame Logo Overlay at bottom-center edge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-brand-orange text-white flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 shadow-md text-[11px] font-sans font-semibold select-none transition-transform duration-300 group-hover:scale-105">
              <span>🔥</span>
              <span>Tylicious Grillz</span>
            </div>
          </AnimatedSection>

          {/* 5. Bottom-Right Card (Tall Image) - Spans 1 Column */}
          <AnimatedSection direction="up" delay={0.3} className="md:col-span-1 relative group overflow-hidden rounded-[24px] aspect-[3/4] border border-brand-orange/5 shadow-sm bg-white cursor-pointer">
            <Image
              src="/images/rs=w_1160,h_1536.webp"
              alt="Skewered grilled meat and vegetables"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

            {/* Illustrated Mascot/Badge Logo in bottom-left corner */}
            <div className="absolute bottom-4 left-4 z-20 bg-black/85 backdrop-blur-sm text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/10 shadow-md text-[10px] font-sans font-bold uppercase tracking-wider select-none transition-transform duration-300 group-hover:scale-105">
              <div className="relative w-4 h-4 rounded-full overflow-hidden bg-white shrink-0">
                <Image src="/images/logo2.png" alt="Tylicious Mascot" fill className="object-contain p-0.5" />
              </div>
              <span>Mascot Badge</span>
            </div>
          </AnimatedSection>

        </div>

        {/* Action Button */}
        <AnimatedSection direction="up" className="flex justify-center">
          <Button
            href="/menu"
            variant="secondary"
            className="px-10 py-3.5 hover:bg-brand-orange hover:border-brand-orange hover:text-white"
          >
            See Our Menu
          </Button>
        </AnimatedSection>

      </Container>
    </section>
  );
}
