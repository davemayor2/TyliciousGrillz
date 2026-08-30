'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from '@/libs/gsap';
import Container from '../../shared/Container';
import AnimatedSection from '../../shared/AnimatedSection';

export default function CTA() {
  const arrowRef = useRef<HTMLDivElement>(null);
  const hoverTlRef = useRef<gsap.core.Timeline | null>(null);

  const handleWhatsAppRedirect = () => {
    window.open('https://wa.me/447597934557?text=Hello%20Tylicious%20Grillz,%20I%20would%20like%20to%20place%20an%20order!', '_blank');
  };

  const handleMouseEnter = () => {
    if (!arrowRef.current) return;
    
    // Kill any active hover timeline
    if (hoverTlRef.current) {
      hoverTlRef.current.kill();
    }

    // Play sliding arrow micro-interaction once
    hoverTlRef.current = gsap.timeline();
    hoverTlRef.current
      .to(arrowRef.current, {
        x: '130%',
        opacity: 0,
        duration: 0.15,
        ease: 'power1.in',
      })
      .set(arrowRef.current, {
        x: '-130%',
      })
      .to(arrowRef.current, {
        x: '0%',
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out',
      });
  };

  const handleMouseLeave = () => {
    if (hoverTlRef.current) {
      hoverTlRef.current.kill();
      hoverTlRef.current = null;
    }
    
    // Smoothly reset the arrow position
    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        x: '0%',
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-brand-brown text-white w-full border-none rounded-none">
      {/* Background Image with Dark Gradient Overlay - Edge-to-Edge */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/about us (2).png"
          alt="Cinematic overhead culinary ingredients slate background"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35 scale-102"
        />
        {/* Subtle dark radial/linear overlay to ensure readability */}
        <div className="absolute inset-0 bg-black/60 z-10" />
      </div>

      <Container className="relative z-20 text-center flex flex-col items-center">
        {/* Inner content wrapper constrained to 800px max width */}
        <div className="max-w-[800px] w-full mx-auto flex flex-col items-center">
          <AnimatedSection direction="up" className="flex flex-col items-center">
            
            {/* Main Heading: Elegant white serif display font (Judson) */}
            <h2 className="font-judson font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.15] text-white tracking-wide mb-4 max-w-4xl">
              Ready To Experience The Best <br />
              Grilled Flavours In Town?
            </h2>

            {/* Subheading Paragraph: Instrument Sans */}
            <p className="font-sans text-white/90 text-sm md:text-base leading-relaxed mb-8 max-w-[550px]">
              Place your order today and enjoy premium grilled meals delivered fresh to your doorstep.
            </p>

            {/* Call to Action Dual-Button Row */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full sm:w-auto">
              {/* Primary Order Now Button */}
              <Link
                href="/menu"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="inline-flex items-center justify-center h-12 bg-[#E63900] text-white hover:bg-[#ff440a] rounded-full pl-6 pr-2 font-sans font-semibold text-base transition-all duration-200 group select-none shadow-none border border-transparent w-full sm:w-auto"
              >
                <span>Order Now</span>
                <div className="ml-3.5 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#E63900] shrink-0 overflow-hidden relative">
                  <div ref={arrowRef} className="flex items-center justify-center">
                    <svg
                      className="w-4.5 h-4.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 5C14 5.742 14.733 6.85 15.475 7.78C16.429 8.98 17.569 10.027 18.876 10.826C19.856 11.425 21.044 12 22 12M2 12L22 12C21.044 12 19.855 12.575 18.876 13.174C17.569 13.974 16.429 15.021 15.475 16.219C14.733 17.15 14 18.26 14 19"
                        stroke="currentColor"
                        strokeWidth={3}
                      />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Secondary WhatsApp Order Button */}
              <button
                onClick={handleWhatsAppRedirect}
                className="inline-flex items-center justify-center h-12 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full px-7 font-sans font-semibold text-base transition-colors duration-200 select-none cursor-pointer w-full sm:w-auto"
              >
                WhatsApp Order
              </button>
            </div>

          </AnimatedSection>
        </div>
      </Container>
    </section>
  );
}
