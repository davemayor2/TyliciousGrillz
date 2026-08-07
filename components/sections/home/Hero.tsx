'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from '@/libs/gsap';
import Container from '../../shared/Container';

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const hoverTlRef = useRef<gsap.core.Timeline | null>(null);

  // Refs for secondary button GSAP fill/wipe animation
  const secondaryBtnRef = useRef<HTMLAnchorElement>(null);
  const secondaryFillRef = useRef<HTMLDivElement>(null);
  const secondaryTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Zoom effect on background and elegant staggered reveal
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { scale: 1.08 },
        { scale: 1, duration: 2, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.animate-hero-item',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      );

      // Initialize secondary button fill layer as a circle scaled to 0
      if (secondaryFillRef.current) {
        gsap.set(secondaryFillRef.current, {
          scale: 0,
          transformOrigin: '50% 130%',
        });
      }
    }, contentRef);

    return () => ctx.revert();
  }, []);

  // Primary Button Hover Handlers
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

  // Secondary Button Hover Handlers (Wipe/Fill animation)
  const handleSecondaryMouseEnter = () => {
    if (!secondaryFillRef.current || !secondaryTextRef.current) return;

    // Prevent stuttering by killing active animations on these elements
    gsap.killTweensOf([secondaryFillRef.current, secondaryTextRef.current]);

    // Scale up the circular fill layer to cover the button
    gsap.to(secondaryFillRef.current, {
      scale: 1.1,
      duration: 0.4,
      ease: 'power3.out',
    });

    // Color transition from white to brand dark brown
    gsap.to(secondaryTextRef.current, {
      color: '#2A0300',
      duration: 0.4,
      ease: 'power3.out',
    });
  };

  const handleSecondaryMouseLeave = () => {
    if (!secondaryFillRef.current || !secondaryTextRef.current) return;

    // Prevent stuttering
    gsap.killTweensOf([secondaryFillRef.current, secondaryTextRef.current]);

    // Scale the circular fill layer back to 0
    gsap.to(secondaryFillRef.current, {
      scale: 0,
      duration: 0.35,
      ease: 'power2.inOut',
    });

    // Reset text color back to white
    gsap.to(secondaryTextRef.current, {
      color: '#FFFFFF',
      duration: 0.35,
      ease: 'power2.inOut',
    });
  };

  return (
    <section ref={contentRef} className="relative min-h-screen w-full flex items-end justify-start overflow-hidden pt-32 pb-20 md:pb-24">
      {/* Background Image with Dark Cinematic Overlay */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        <Image
          src="/Landing Page.png"
          alt="Premium Grilled Seafood Platter"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-brown/95 via-brand-brown/70 to-transparent md:from-brand-brown/90 md:via-brand-brown/60 md:to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/65 via-transparent to-transparent z-10" />
      </div>

      <Container className="relative z-20 w-full">
        {/* Left-aligned content block with maximum width constraint */}
        <div className="max-w-[700px] text-left flex flex-col items-start">

          {/* Renovation Announcement Banner */}
          <div className="animate-hero-item inline-flex items-center gap-2 bg-[#1A0500] border border-brand-orange/20 px-4 py-2 rounded-full text-white text-xs md:text-sm font-sans font-medium mb-6 tracking-wide max-w-full shadow-md">
            <span>📢 Our restaurant is currently under renovation! We are fully operational for online pre-orders & event catering.</span>
          </div>

          {/* Main Heading using Instrument Sans globally */}
          <h1 className="animate-hero-item font-sans font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] text-white leading-[1.12] mb-6 tracking-tight">
            Premium Grilled <span className="italic font-light">Seafood</span> & BBQ Delivered Fresh To Your <span className="italic font-light">Doorstep</span>
          </h1>

          {/* Subheading / Paragraph */}
          <p className="animate-hero-item font-sans text-white/85 text-base md:text-[1.125rem] leading-[1.5] font-normal mt-6 mb-8 max-w-[620px]">
            Enjoy expertly grilled fish, prawns, croaker fish, lamb chops, chicken wings and more. Freshly prepared and delivered hot across London, Kent, and surrounding areas.
          </p>

          {/* Call to Action Buttons */}
          <div className="animate-hero-item flex items-center gap-4 mt-8">
            {/* Primary Order Online Button */}
            <Link
              href="/menu"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="inline-flex items-center justify-center h-12 bg-[#E63900] text-white hover:bg-[#ff440a] rounded-full pl-6 pr-2 font-sans font-semibold transition-all duration-200 group select-none shadow-none border border-transparent"
            >
              <span>Order Online</span>
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

            {/* Secondary Book Catering Button with bottom-to-top wipe hover fill animation */}
            <Link
              href="/contact"
              ref={secondaryBtnRef}
              onMouseEnter={handleSecondaryMouseEnter}
              onMouseLeave={handleSecondaryMouseLeave}
              className="relative overflow-hidden inline-flex items-center justify-center h-12 border-[1.5px] border-white rounded-full px-8 select-none transition-all duration-200 cursor-pointer"
            >
              {/* Curved/Circular Fill Layer */}
              <div
                ref={secondaryFillRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] aspect-square rounded-full bg-white pointer-events-none"
              />

              {/* Text Layer */}
              <span
                ref={secondaryTextRef}
                className="relative z-10 text-white font-sans font-semibold text-base md:text-lg transition-colors duration-200"
              >
                Book Catering
              </span>
            </Link>
          </div>

        </div>
      </Container>
    </section>
  );
}
