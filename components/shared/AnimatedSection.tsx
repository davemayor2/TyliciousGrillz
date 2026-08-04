'use client';

import React, { useEffect, useRef } from 'react';
import { AnimatedSectionProps } from '@/types';
import gsap from '@/libs/gsap';

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = 'up',
  triggerOnce = true,
}: AnimatedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Define initial transforms
    let startY = 0;
    let startX = 0;
    const startOpacity = 0;

    switch (direction) {
      case 'up':
        startY = 40;
        break;
      case 'down':
        startY = -40;
        break;
      case 'left':
        startX = 40;
        break;
      case 'right':
        startX = -40;
        break;
      case 'fade':
      default:
        break;
    }

    // Set initial state
    gsap.set(container, {
      y: startY,
      x: startX,
      opacity: startOpacity,
    });

    // Create animation
    const anim = gsap.to(container, {
      y: 0,
      x: 0,
      opacity: 1,
      duration: 0.8,
      delay: delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 88%',
        toggleActions: triggerOnce ? 'play none none none' : 'play none none reverse',
      },
    });

    return () => {
      anim.kill();
    };
  }, [delay, direction, triggerOnce]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
