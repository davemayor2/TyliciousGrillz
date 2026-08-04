'use client';

import React from 'react';
import Image from 'next/image';
import { Truck, ShieldCheck, Clock } from 'lucide-react';
import Container from '../../shared/Container';
import SectionHeading from '../../shared/SectionHeading';
import AnimatedSection from '../../shared/AnimatedSection';

export default function Delivery() {
  const deliveryPillars = [
    {
      icon: <Clock className="w-6 h-6 text-brand-orange" />,
      title: 'Under 45 Mins Delivery',
      description: 'We prioritize speed. Once your selection is off the grill, it is dispatched instantly to reach you hot.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-orange" />,
      title: 'Insulated Foil Packaging',
      description: 'Our proprietary multi-layer insulated thermal bags trap heat and moisture, maintaining kitchen-fresh temperature.',
    },
    {
      icon: <Truck className="w-6 h-6 text-brand-orange" />,
      title: 'Real-Time Delivery Tracking',
      description: 'Receive SMS updates and live courier tracking links so you know exactly when your meal arrives.',
    },
  ];

  return (
    <section className="py-24 bg-brand-bg relative overflow-hidden" id="delivery">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <AnimatedSection direction="left" className="w-full">
              <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-brand-orange/5 border border-brand-orange/10 shadow-lg">
                <Image
                  src="/images/rs=w_1160,h_1532.webp"
                  alt="Tylicious Delivery Box preparation"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </AnimatedSection>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <AnimatedSection direction="right">
              <SectionHeading
                title="We Deliver Sizzling Hot & Fresh"
                highlightedWord="Deliver"
                subtitle="Delivery Details"
                align="left"
                className="mb-8"
              />
              
              <div className="flex flex-col gap-8">
                {deliveryPillars.map((pillar, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-white border border-brand-orange/10 flex items-center justify-center shrink-0 shadow-sm">
                      {pillar.icon}
                    </div>
                    <div>
                      <h3 className="font-judson font-bold text-xl md:text-2xl text-brand-brown mb-2">
                        {pillar.title}
                      </h3>
                      <p className="font-sans text-sm md:text-base text-brand-brown/70 leading-relaxed max-w-xl text-left">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

        </div>
      </Container>
    </section>
  );
}
