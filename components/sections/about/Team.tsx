'use client';

import React from 'react';
import Image from 'next/image';
import Container from '../../shared/Container';
import AnimatedSection from '../../shared/AnimatedSection';

export default function Team() {
  const features = [
    {
      id: 'freshly-grilled',
      image: '/chef.png',
      alt: 'Chef grilling fish over open flames',
      title: 'Freshly Grilled Daily',
      description: 'Every meal is prepared fresh to order.',
    },
    {
      id: 'premium-ingredients',
      image: '/fish.png',
      alt: 'Flat vector board filled with raw ingredients',
      title: 'Premium Ingredients',
      description: 'Only quality meats, seafood, herbs and spices.',
    },
    {
      id: 'fast-delivery',
      image: '/Delivery.png',
      alt: 'Delivery courier handing a boxed meal to a customer',
      title: 'Fast Delivery',
      description: 'Fresh meals delivered straight to your doorstep.',
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <Container className="max-w-[1200px]">
        {/* Section Header: Elegant dark serif display */}
        <AnimatedSection direction="up" className="flex flex-col items-center mb-12">
          <h2 className="font-judson font-normal text-3xl sm:text-4xl md:text-[2.5rem] text-[#000000] text-center">
            Why Choose Tylicious Grillz
          </h2>
        </AnimatedSection>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <AnimatedSection
              key={feature.id}
              direction="up"
              delay={index * 0.15}
              className="flex flex-col items-center text-center"
            >
              {/* Top Vector Illustration Container */}
              <div className="relative w-48 h-48 md:w-[200px] md:h-[200px] overflow-hidden mb-6 flex items-center justify-center">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  fill
                  sizes="200px"
                  className="object-contain"
                  loading="lazy"
                />
              </div>

              {/* Feature Title: Instrument Sans Bold in Brand Orange-Red */}
              <h3 className="font-sans font-bold text-xl md:text-[22px] text-[#E63900] mb-2.5 tracking-tight">
                {feature.title}
              </h3>

              {/* Description Paragraph: Instrument Sans regular with max-width constraint */}
              <p className="font-sans font-normal text-[#555555] text-[15px] md:text-base leading-relaxed max-w-[280px]">
                {feature.description}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
