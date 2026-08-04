'use client';

import React from 'react';
import { WHY_LOVE_US_DATA } from '@/constants';
import Container from '../../shared/Container';
import SectionHeading from '../../shared/SectionHeading';
import AnimatedSection from '../../shared/AnimatedSection';
import FeatureCard from '../../shared/FeatureCard';

export default function WhyLoveUs() {
  return (
    <section className="py-24 bg-brand-bg relative overflow-hidden">
      <Container>
        {/* Header & Sub-text */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <SectionHeading
            title="Why Customers Love Tylicious Grillz"
            highlightedWord="Tylicious Grillz"
            align="left"
            className="mb-0 max-w-xl"
          />
          <p className="font-sans text-brand-brown/70 text-sm md:text-base max-w-sm leading-relaxed mb-2 text-left">
            From our fresh charcoal-grilled ingredients to our lightning-fast home delivery, we strive to make every single meal a premium experience.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {WHY_LOVE_US_DATA.map((card, index) => (
            <AnimatedSection
              key={card.id}
              direction="up"
              delay={index * 0.15}
              className="flex"
            >
              <FeatureCard
                icon={card.icon}
                title={card.title}
                image={card.image}
                description={card.description}
              />
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
