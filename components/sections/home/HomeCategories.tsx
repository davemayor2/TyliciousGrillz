'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '../../shared/Container';
import SectionHeading from '../../shared/SectionHeading';
import AnimatedSection from '../../shared/AnimatedSection';

export default function HomeCategories() {
  const categories = [
    {
      id: 'grilled-fish',
      icon: '🐟',
      title: 'Grilled Fish',
      image: '/images/rs=w_1160,h_1773.webp',
      description: 'Catfish, Tilapia, and Croaker slow-cooked over red-hot charcoal, seasoned with premium African spices.',
    },
    {
      id: 'chicken-turkey',
      icon: '🍗',
      title: 'Chicken & Turkey',
      image: '/images/Frame 153.png',
      description: 'Succulent Chicken BBQ legs, thighs, spicy wings, and tender virgin turkey grilled fresh daily.',
    },
    {
      id: 'lamb-beef',
      icon: '🍖',
      title: 'Lamb & Beef',
      image: '/images/lamb&beef.webp',
      description: 'Premium Lamb Chops, glazed baby back ribs, and authentic spicy Nigerian beef Suya.',
    },
    {
      id: 'seafood',
      icon: '🦐',
      title: 'Seafood',
      image: '/images/Gemini_Generated_Image_cibfydcibfydcibf.png',
      description: 'Garlic Jumbo Prawns and flame-grilled seafood platters seasoned with aromatic herbs and spicy butter.',
    },
  ];

  return (
    <section className="py-24 bg-brand-bg relative overflow-hidden border-t border-brand-orange/5">
      {/* Soft background glow */}
      <div className="absolute right-[10%] top-[20%] w-[30rem] h-[30rem] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <Container>
        {/* Header & Sub-text */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <SectionHeading
            title="Browse Our Signature Grills"
            highlightedWord="Grills"
            align="left"
            className="mb-0 max-w-xl"
          />
          <p className="font-sans text-brand-brown/70 text-sm md:text-base max-w-sm leading-relaxed mb-2 text-left">
            Savor our premium wood-fired seafood, authentic spices, and house special platters, grilled fresh daily.
          </p>
        </div>

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {categories.map((card, index) => (
            <AnimatedSection
              key={card.id}
              direction="up"
              delay={index * 0.1}
              className="flex"
            >
              <Link href={`/menu?category=${card.id}`} className="relative w-full h-full group block cursor-pointer">
                {/* Background Offset Shadow Layer (curved, soft pink backdrop) */}
                <div className="absolute inset-0 bg-[#FFD7D7] rounded-[2rem] translate-x-2.5 translate-y-2.5 z-0 transition-all duration-300 group-hover:bg-[#FF8787] group-hover:translate-x-3.5 group-hover:translate-y-3.5" />

                {/* Main Card Container */}
                <div className="relative z-10 bg-white border border-brand-orange/5 p-8 rounded-[2rem] flex flex-col items-center text-center shadow-[0_8px_30px_rgba(42,3,0,0.015)] h-full">
                  {/* Header (Emoji + Title) */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xl md:text-2xl">{card.icon}</span>
                    <h3 className="font-sans font-bold text-lg md:text-xl text-black tracking-tight group-hover:text-brand-orange transition-colors duration-200">
                      {card.title}
                    </h3>
                  </div>

                  {/* Image Container (Stadium / Capsule Mask) */}
                  <div className="my-6 w-full max-w-[280px] h-[140px] md:h-[160px] relative rounded-full overflow-hidden bg-brand-bg border border-brand-orange/10 shadow-inner">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 20vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Description Paragraph */}
                  <p className="font-sans font-normal text-[#1F2937] text-xs md:text-sm leading-relaxed max-w-[280px] mb-6">
                    {card.description}
                  </p>

                  {/* Bottom CTA Link */}
                  <div className="mt-auto inline-flex items-center text-xs font-bold font-sans uppercase tracking-wider text-[#E63900] group-hover:text-[#ff440a] transition-colors duration-200 gap-1">
                    <span>Explore Menu</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
