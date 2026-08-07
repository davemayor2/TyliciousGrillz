'use client';

import React from 'react';
import Link from 'next/link';
import Container from '../../shared/Container';
import AnimatedSection from '../../shared/AnimatedSection';

export default function CateringHighlight() {
  const offerings = [
    {
      id: 'private-events',
      icon: '🎉',
      title: 'Private Events & Parties',
      description: 'Host unforgettable birthdays, anniversaries, and family grill feasts with custom-tailored grill packages.',
    },
    {
      id: 'weddings',
      icon: '🥂',
      title: 'Weddings & Celebrations',
      description: 'Make your wedding day or afterparty memorable with sizzling live grilling stations and premium buffet service.',
    },
    {
      id: 'corporate-catering',
      icon: '💼',
      title: 'Corporate Catering',
      description: 'From office lunches to corporate events, we deliver professional catering packages designed to impress.',
    },
    {
      id: 'group-platters',
      icon: '🍽️',
      title: 'Pre-Order Group Platters',
      description: 'Perfect for group gatherings and family dinners, pre-order our massive custom platters delivered hot.',
    },
  ];

  return (
    <section className="py-20 bg-[#FFF5F5] relative overflow-hidden border-t border-brand-orange/5">
      <Container className="max-w-[1200px]">
        
        {/* Section Heading */}
        <AnimatedSection direction="up" className="flex flex-col items-center mb-12 text-center">
          <span className="font-sans font-semibold text-xs md:text-sm tracking-[0.2em] uppercase text-brand-orange mb-3">
            Premium Services
          </span>
          <h2 className="font-judson font-normal text-3xl sm:text-4xl md:text-[2.5rem] text-[#000000] leading-tight">
            Catering & Private Events
          </h2>
          <p className="font-sans text-brand-brown/70 text-sm md:text-base max-w-lg mt-3 leading-relaxed">
            Professional catering, live grilling setups, and online pre-orders for events across London and Kent.
          </p>
        </AnimatedSection>

        {/* 4-Column Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {offerings.map((offering, index) => (
            <AnimatedSection
              key={offering.id}
              direction="up"
              delay={index * 0.1}
              className="w-full flex"
            >
              {/* Card Container - White Base with rounded-32px, no border, and solid offset pink shadow */}
              <div className="w-full bg-white rounded-[32px] p-8 flex flex-col justify-between items-start text-left shadow-[10px_10px_0px_#FFE4E6] hover:-translate-y-1.5 hover:-translate-x-1.5 hover:shadow-[14px_14px_0px_#FFE4E6] transition-all duration-300 select-none">
                
                {/* Top Content Stack */}
                <div className="w-full">
                  {/* Emoji Visual Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF5F5] border border-[#FF8A8A]/30 flex items-center justify-center text-2xl mb-5">
                    {offering.icon}
                  </div>
                  
                  {/* Title: Instrument Sans Bold */}
                  <h3 className="font-sans font-bold text-lg md:text-xl text-[#000000] mb-3 leading-snug tracking-tight">
                    {offering.title}
                  </h3>
                  
                  {/* Description: Instrument Sans regular */}
                  <p className="font-sans font-normal text-[#555555] text-sm md:text-[14px] leading-relaxed mb-6">
                    {offering.description}
                  </p>
                </div>

                {/* Bottom CTA Link */}
                <Link
                  href="/catering"
                  className="inline-flex items-center text-xs md:text-sm font-bold font-sans uppercase tracking-wider text-[#E63900] hover:text-[#ff440a] transition-colors duration-200 mt-2 gap-1.5 group/link"
                >
                  <span>Inquire / Book Service</span>
                  <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-1">→</span>
                </Link>

              </div>
            </AnimatedSection>
          ))}
        </div>

      </Container>
    </section>
  );
}
