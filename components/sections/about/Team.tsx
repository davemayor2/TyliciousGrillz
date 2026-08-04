'use client';

import React from 'react';
import Image from 'next/image';
import { TEAM_DATA } from '@/constants';
import Container from '../../shared/Container';
import SectionHeading from '../../shared/SectionHeading';
import AnimatedSection from '../../shared/AnimatedSection';

export default function Team() {
  return (
    <section className="py-24 bg-brand-bg relative overflow-hidden">
      <Container>
        {/* Header */}
        <AnimatedSection direction="up" className="flex flex-col items-center">
          <SectionHeading
            title="Meet Our Grill Masters"
            highlightedWord="Grill Masters"
            subtitle="Our Culinary Team"
            align="center"
          />
          <p className="font-sans text-brand-brown/70 text-sm md:text-base max-w-md text-center leading-relaxed -mt-8 mb-16">
            The skilled hands and passionate minds behind our signature recipes, fire-grill stations, and clean operations.
          </p>
        </AnimatedSection>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM_DATA.map((member, index) => (
            <AnimatedSection
              key={member.id}
              direction="up"
              delay={index * 0.15}
              className="group flex flex-col w-full text-center items-center"
            >
              {/* Image Frame */}
              <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 bg-brand-orange/5 border border-brand-orange/10 shadow-[0_8px_30px_rgba(42,3,0,0.02)]">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* Title & Info */}
              <h3 className="font-judson font-bold text-2xl text-brand-brown mb-1.5 group-hover:text-brand-orange transition-colors">
                {member.name}
              </h3>
              <p className="font-sans text-xs md:text-sm text-brand-orange font-semibold uppercase tracking-wider">
                {member.role}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
