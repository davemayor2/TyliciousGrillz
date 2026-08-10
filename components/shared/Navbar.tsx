'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { NAVIGATION_LINKS } from '@/constants';
import gsap from '@/libs/gsap';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const arrowRef = useRef<HTMLDivElement>(null);
  const hoverTlRef = useRef<gsap.core.Timeline | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!menuRef.current) return;

    const links = menuRef.current.querySelectorAll('.mobile-nav-link');

    if (isOpen) {
      // Open animation: Slide container in smoothly from left and fade its opacity from 0 to 1 over 0.4s
      gsap.killTweensOf([menuRef.current, links]);
      
      // Ensure element is visible
      gsap.set(menuRef.current, { pointerEvents: 'auto' });

      gsap.fromTo(menuRef.current,
        {
          x: -30,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }
      );

      // Staggered Link Entrance: translateX(-15px) to 0, opacity 0 to 1, delay 0.05s stagger
      gsap.fromTo(links,
        {
          x: -15,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.3,
          ease: 'power2.out',
          delay: 0.1,
        }
      );
    } else {
      // Clean Exit: reverse fade-out/slide-left transition
      gsap.killTweensOf([menuRef.current, links]);

      gsap.to(links, {
        x: -15,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      });

      gsap.to(menuRef.current, {
        x: -30,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(menuRef.current, { pointerEvents: 'none' });
        }
      });
    }
  }, [isOpen]);

  const { cart, setIsCartOpen } = useCart();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleMouseEnter = () => {
    if (!arrowRef.current) return;
    
    // Kill any active timeline
    if (hoverTlRef.current) {
      hoverTlRef.current.kill();
    }

    // Play once: slide out right, reset left, slide in center
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
    
    // Smoothly reset the arrow wrapper to default center state
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
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 transition-all duration-300">
      <CartDrawer />
      {/* Horizontal container card with floating shadow */}
      <div className="w-full bg-brand-orange text-white px-6 md:px-8 py-2 md:py-2.5 rounded-2xl flex items-center justify-between shadow-[0_12px_40px_rgba(42,3,0,0.15)] border border-white/10 relative z-50">
        
        {/* Left Section (Brand Name & Logo) - Judson font and scaled up */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative w-12 h-12 md:w-14 md:h-14 overflow-hidden rounded-full border border-white/20 bg-white shrink-0">
            <Image
              src="/images/logo2.png"
              alt="Tylicious Logo"
              fill
              className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="font-judson font-bold text-xl md:text-2xl text-white tracking-[-0.02em] whitespace-nowrap">
            Tylicious Grillz
          </span>
        </Link>

        {/* Center Section (Navigation Links) - Instrument Sans & regular weight */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          {NAVIGATION_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`font-sans text-base lg:text-lg tracking-[-0.01em] transition-all duration-200 ${
                  isActive
                    ? 'font-bold text-white'
                    : 'font-normal text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section (Actions) */}
        <div className="hidden md:flex items-center gap-6">
          {/* Scaled Shopping Cart Icon */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-white hover:scale-105 transition-transform cursor-pointer"
          >
            <ShoppingCart className="w-7 h-7" />
            {totalQty > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-black text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                {totalQty}
              </span>
            )}
          </button>

          {/* Enlarged, flat Order Now Button with weight 600 and letter-spacing -0.01em */}
          <Link
            href="/menu"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="inline-flex items-center bg-white text-brand-brown hover:bg-white/95 rounded-full pl-6 pr-2 py-2 text-base md:text-lg font-sans font-semibold tracking-[-0.01em] transition-all duration-200 group select-none shadow-none border border-transparent"
          >
            <span>Order Now</span>
            <div className="ml-3.5 w-8 h-8 bg-black rounded-full flex items-center justify-center text-white shrink-0 overflow-hidden relative">
              <div ref={arrowRef} className="flex items-center justify-center">
                <svg
                  className="w-4.5 h-4.5 text-white"
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

        {/* Mobile Action Controls */}
        <div className="flex md:hidden items-center gap-4">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-white"
          >
            <ShoppingCart className="w-7 h-7" />
            {totalQty > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalQty}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white hover:text-white/80 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Floating Dropdown Menu Card */}
      <div
        ref={menuRef}
        className="absolute top-[calc(100%+0.5rem)] left-0 w-full bg-brand-brown text-white rounded-2xl p-6 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.3)] flex flex-col items-center gap-6 z-45 pointer-events-none opacity-0"
      >
        {NAVIGATION_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`mobile-nav-link font-sans text-lg tracking-wide uppercase transition-colors opacity-0 ${
                isActive ? 'font-bold text-brand-orange' : 'font-semibold text-white/80 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        
        <Link
          href="/menu"
          onClick={() => setIsOpen(false)}
          className="inline-flex items-center justify-center w-full bg-brand-orange text-white rounded-full py-4 text-lg font-sans font-bold transition-all duration-200 group select-none shadow-none"
        >
          <span>Order Now</span>
          <svg
            className="w-5 h-5 ml-2 group-hover:translate-x-0.5 transition-transform"
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
        </Link>
      </div>
    </header>
  );
}
