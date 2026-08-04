'use client';

import React from 'react';
import Image from 'next/image';
import Container from '../../shared/Container';
import SectionHeading from '../../shared/SectionHeading';
import AnimatedSection from '../../shared/AnimatedSection';
import { ShieldCheck, Award, Zap } from 'lucide-react';

export default function Quality() {
  const qualityPillars = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-orange" />,
      title: 'Daily Fresh Catch',
      description: 'Our Tilapia and Croaker fish are sourced fresh directly from local fish farms every single morning. We never use frozen leftovers.',
    },
    {
      icon: <Award className="w-6 h-6 text-brand-orange" />,
      title: 'Organic Spice Blends',
      description: 'We grind and mix our signature spice marinades in-house from locally sourced, pure organic herbs with zero chemical preservatives.',
    },
    {
      icon: <Zap className="w-6 h-6 text-brand-orange" />,
      title: 'Hardwood Charcoal Grilling',
      description: 'We grill exclusively over high-density hardwood charcoal, imparting that signature sweet, deep, and clean wood-smoked flavor.',
    },
  ];

  return (
    <section className="py-24 bg-brand-brown text-white relative overflow-hidden">
      <div className="absolute left-[-10%] top-[-10%] w-[35rem] h-[35rem] bg-brand-orange/5 blur-[150px] rounded-full pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Quality Pillars */}
          <div className="lg:col-span-7">
            <AnimatedSection direction="left">
              <SectionHeading
                title="Uncompromising Quality in Every Bite"
                highlightedWord="Quality"
                subtitle="Our Standards"
                align="left"
                dark
                className="mb-8"
              />
              
              <div className="flex flex-col gap-8">
                {qualityPillars.map((pillar, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {pillar.icon}
                    </div>
                    <div>
                      <h3 className="font-judson font-bold text-xl md:text-2xl text-white mb-2">
                        {pillar.title}
                      </h3>
                      <p className="font-sans text-sm md:text-base text-white/70 leading-relaxed max-w-xl">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Right Column: Image */}
          <div className="lg:col-span-5">
            <AnimatedSection direction="right" className="w-full">
              <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-brand-orange/5 border border-white/10 shadow-2xl">
                <Image
                  src="/images/Frame 153.png"
                  alt="Grill Master at Work"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </AnimatedSection>
          </div>

        </div>
      </Container>
    </section>
  );
}
