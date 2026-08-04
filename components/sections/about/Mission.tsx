'use client';

import React from 'react';
import Container from '../../shared/Container';
import SectionHeading from '../../shared/SectionHeading';
import Card from '../../shared/Card';
import AnimatedSection from '../../shared/AnimatedSection';
import { Target, Eye, Flame } from 'lucide-react';

export default function Mission() {
  return (
    <section className="py-24 bg-[#FFF5F3] relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute right-0 top-1/4 w-[30rem] h-[30rem] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <Container>
        <AnimatedSection direction="up" className="flex flex-col items-center">
          <SectionHeading
            title="Our Core Mission & Values"
            highlightedWord="Mission"
            subtitle="What Drives Us"
            align="center"
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          {/* Card 1: Mission */}
          <AnimatedSection direction="up" delay={0.1}>
            <Card className="flex flex-col items-center text-center p-8 h-full bg-white border border-brand-orange/10">
              <div className="w-16 h-16 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="font-judson font-bold text-2xl text-brand-brown mb-4">Our Mission</h3>
              <p className="font-sans text-brand-brown/75 text-sm md:text-base leading-relaxed">
                To prepare and deliver the finest charcoal-grilled seafood and meats, using fresh ingredients, local spices, and traditional smoke-grilling techniques that honor authentic African flavors.
              </p>
            </Card>
          </AnimatedSection>

          {/* Card 2: Vision */}
          <AnimatedSection direction="up" delay={0.2}>
            <Card className="flex flex-col items-center text-center p-8 h-full bg-white border border-brand-orange/10">
              <div className="w-16 h-16 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-6">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="font-judson font-bold text-2xl text-brand-brown mb-4">Our Vision</h3>
              <p className="font-sans text-brand-brown/75 text-sm md:text-base leading-relaxed">
                To become Africa&apos;s premier gourmet grill house, bringing communities together over premium smoked delicacies and pioneering clean, rapid delivery systems.
              </p>
            </Card>
          </AnimatedSection>

          {/* Card 3: Brand Promise */}
          <AnimatedSection direction="up" delay={0.3}>
            <Card className="flex flex-col items-center text-center p-8 h-full bg-white border border-brand-orange/10">
              <div className="w-16 h-16 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-6">
                <Flame className="w-8 h-8" />
              </div>
              <h3 className="font-judson font-bold text-2xl text-brand-brown mb-4">Our Promise</h3>
              <p className="font-sans text-brand-brown/75 text-sm md:text-base leading-relaxed">
                No compromise on quality. Sourced fresh daily, seasoned with local organic herbs, and grilled over live wood coals. Delivered hot, clean, and delicious every single time.
              </p>
            </Card>
          </AnimatedSection>
        </div>
      </Container>
    </section>
  );
}
