'use client';

import React from 'react';
import Image from 'next/image';
import Container from '../../shared/Container';
import AnimatedSection from '../../shared/AnimatedSection';

export default function Story() {
  return (
    <section className="py-24 bg-[#FFF5F5] relative overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute right-[-10%] top-[-10%] w-[35rem] h-[35rem] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <Container className="max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column (Stacked Collage Container Card) */}
          <div className="lg:col-span-6 relative w-full">
            <AnimatedSection direction="left" className="relative w-full">
              {/* Outer Base & 3D Shadow Backdrop - Rounded corners & light pastel pink fill */}
              <div className="absolute inset-0 bg-[#FFD8D8] rounded-[32px] translate-x-3.5 translate-y-3.5 z-0" />

              {/* Main White Card Container (Front Layer) */}
              <div className="relative z-10 bg-white border border-black/5 p-5 md:p-6 rounded-[32px] flex flex-col shadow-md">

                {/* Internal Collage Layout */}
                <div className="flex flex-col gap-4 w-full">

                  {/* Top Row (Hero Image) - aspect 16:9 */}
                  <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-brand-bg shadow-sm">
                    <Image
                      src="/images/about_grid.jpeg"
                      alt="Chef grilling fish over open flames with vegetables in the foreground"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Bottom Row (2 Equal Sub-Images) */}
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {/* Sub-Image 1 */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-bg shadow-sm">
                      <Image
                        src="/images/rs=w_1160,h_1773.webp"
                        alt="Fresh whole fish being prepped for grilling"
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Sub-Image 2 */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-bg shadow-sm">
                      <Image
                        src="/images/rs=w_1160,h_1218.webp"
                        alt="Whole fish on a smoking charcoal grill grate"
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                </div>

              </div>
            </AnimatedSection>
          </div>

          {/* Right Column (Typography Content Stack) */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <AnimatedSection direction="right">
              {/* Main Title: Elegant dark serif display */}
              <h2 className="font-judson font-normal text-4xl lg:text-[2.75rem] text-[#000000] leading-tight mb-3">
                Our Story
              </h2>

              {/* Highlight Tagline: Instrument Sans Bold */}
              <h3 className="font-sans font-bold text-[#E63900] text-lg md:text-xl lg:text-[22px] leading-snug mb-5">
                Where Great Flavour Meets Great Passion
              </h3>

              {/* Narrative Paragraphs: Instrument Sans */}
              <div className="font-sans font-normal text-[#555555] text-base leading-relaxed flex flex-col gap-5 max-w-[580px]">
                <p>
                  Tylicious Grillz was founded with one mission—to serve freshly grilled meals that bring people together. Inspired by authentic African grilling traditions and enhanced with modern culinary techniques, we&apos;ve built a reputation for serving delicious, flavour-packed meals made from quality ingredients.
                </p>
                <p>
                  Whether you&apos;re enjoying a quick lunch, dinner with family, or catering for a special event, every order receives the same attention to quality and detail.
                </p>
              </div>
            </AnimatedSection>
          </div>

        </div>
      </Container>
    </section>
  );
}
