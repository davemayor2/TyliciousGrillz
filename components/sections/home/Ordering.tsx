'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from '@/libs/gsap';
import Container from '../../shared/Container';
import AnimatedSection from '../../shared/AnimatedSection';

export default function Ordering() {
  const arrowRef = useRef<HTMLDivElement>(null);
  const hoverTlRef = useRef<gsap.core.Timeline | null>(null);

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
    <section className="py-24 bg-[#601009] text-white relative overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute right-[-10%] top-[-10%] w-[40rem] h-[40rem] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Ordering Content & Badges */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <AnimatedSection direction="left">
              {/* Main Heading: Judson serif font */}
              <h2 className="font-judson font-normal text-4xl sm:text-5xl lg:text-[3rem] text-white leading-tight mb-6">
                Ordering Made Simple
              </h2>

              {/* Subheading Paragraph */}
              <p className="font-sans text-white/85 text-base leading-relaxed mb-6 max-w-[420px]">
                Enjoy your favourite grilled meals in just a few easy steps, from order placement to doorstep delivery.
              </p>

              {/* Primary Order Now Button */}
              <div className="mb-6">
                <Link
                  href="/menu"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="inline-flex items-center bg-[#E63900] text-white hover:bg-[#ff440a] rounded-full pl-6 pr-2 py-2 text-base md:text-lg font-sans font-semibold transition-all duration-200 group select-none shadow-none border border-transparent"
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
              </div>

              {/* Social Proof Card (2K+ Served Customers) with Neo-Brutalist 3D Shadow */}
              <div className="inline-flex items-center bg-[#E63900] border-2 border-[#1A0500] rounded-2xl p-4 pr-6 gap-4 shadow-[6px_6px_0px_#1A0500] backdrop-blur-sm">
                {/* Avatar Stack */}
                <div className="flex pl-2.5">
                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden -ml-2.5 first:ml-0 z-10 shrink-0"
                    >
                      <Image
                        src="/images/rs=w_365,h_365,cg_true.webp"
                        alt="Customer avatar"
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Text Stack */}
                <div className="flex flex-col text-left">
                  <span className="font-sans font-bold text-white text-base md:text-[17px] leading-tight">
                    2K+ Served Customers
                  </span>
                  <span className="font-sans text-xs text-white/80 mt-0.5">
                    Loved by Hundreds of Grill Lovers
                  </span>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Column: Video Placeholder Card (Dual-layered Stacked Design) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <AnimatedSection direction="right" className="relative w-full max-w-[500px]">
              {/* Back Layer (Shadow Base) */}
              <div className="absolute inset-0 bg-[#FFEAE6] rounded-[28px] translate-x-4 translate-y-4 z-0" />
              
              {/* Front Main Layer (Video Frame) */}
              <div suppressHydrationWarning className="relative z-10 w-full aspect-[4/3] bg-black rounded-[24px] overflow-hidden flex items-center justify-center shadow-md">
                <video
                  src="/Home page video 1.mp4"
                  controls
                  loop
                  muted
                  autoPlay
                  playsInline
                  suppressHydrationWarning
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimatedSection>
          </div>

        </div>
      </Container>
    </section>
  );
}
