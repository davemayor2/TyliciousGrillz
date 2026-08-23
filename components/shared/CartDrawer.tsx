'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import gsap from '@/libs/gsap';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    checkoutStatus,
    triggerCheckout,
    resetCheckout,
  } = useCart();

  const backdropRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!backdropRef.current || !containerRef.current || !headerRef.current || !mainCardRef.current) return;

    // Select all inner elements to animate staggered
    const innerContents = mainCardRef.current.querySelectorAll('.cart-inner-item');
    const closeBtn = headerRef.current.querySelector('.cart-close-btn');

    if (isCartOpen) {
      // Open sequence: Kill active tweens and start animation timeline
      gsap.killTweensOf([backdropRef.current, containerRef.current, headerRef.current, mainCardRef.current, innerContents, closeBtn]);
      
      // Ensure elements are interactive
      gsap.set(backdropRef.current, { pointerEvents: 'auto' });
      gsap.set(containerRef.current, { pointerEvents: 'auto' });

      const tl = gsap.timeline();

      // 1. Backdrop Fade-in
      tl.to(backdropRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      }, 0);

      // Phase 1 (Navbar Color Transition): header card bg transitions from orange (#ED2C02) to white (#FFFFFF)
      tl.fromTo(headerRef.current,
        {
          backgroundColor: '#ED2C02',
          borderColor: '#ED2C02',
          color: '#FFFFFF',
        },
        {
          backgroundColor: '#FFFFFF',
          borderColor: '#ED2C02',
          color: '#1A0500',
          duration: 0.3,
          ease: 'power2.inOut',
        },
        0
      );

      if (closeBtn) {
        tl.fromTo(closeBtn,
          {
            backgroundColor: '#FFFFFF',
            borderColor: '#FFFFFF',
            color: '#ED2C02',
          },
          {
            backgroundColor: '#FFE6E0',
            borderColor: '#ED2C02',
            color: '#ED2C02',
            duration: 0.3,
            ease: 'power2.inOut',
          },
          0
        );
      }

      // Phase 2 (Content Box & Items Slide-In):
      // Immediately following or slightly overlapping the navbar transition (0.1s stagger delay), slide the main cart container box in from the right (translateX(100%) to 0).
      tl.fromTo(mainCardRef.current,
        {
          x: '100%',
          opacity: 0,
        },
        {
          x: '0%',
          opacity: 1,
          duration: 0.45,
          ease: 'power4.out',
        },
        0.1 // 0.1s overlap/stagger delay
      );

      // Smoothly slide in the inner cart contents with a light offset slide from right (translateX(20px) to 0) and fade-in (opacity 0 to 1) over 0.35s.
      if (innerContents.length > 0) {
        tl.fromTo(innerContents,
          {
            x: 20,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            stagger: 0.04,
            duration: 0.35,
            ease: 'power4.out',
          },
          0.15 // overlapping during slide in of main card
        );
      }

    } else {
      // Exit Animation: reverse slide out & fade out transitions
      gsap.killTweensOf([backdropRef.current, containerRef.current, headerRef.current, mainCardRef.current, innerContents, closeBtn]);

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(backdropRef.current, { pointerEvents: 'none' });
          gsap.set(containerRef.current, { pointerEvents: 'none' });
        }
      });

      // Slide inner contents out
      if (innerContents.length > 0) {
        tl.to(innerContents, {
          x: 20,
          opacity: 0,
          stagger: 0.02,
          duration: 0.2,
          ease: 'power2.in',
        }, 0);
      }

      // Slide main content card out right
      tl.to(mainCardRef.current, {
        x: '100%',
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      }, 0.05);

      // Transition header back to orange bg on exit
      tl.to(headerRef.current, {
        backgroundColor: '#ED2C02',
        borderColor: '#ED2C02',
        color: '#FFFFFF',
        duration: 0.25,
        ease: 'power2.inOut',
      }, 0.05);

      if (closeBtn) {
        tl.to(closeBtn, {
          backgroundColor: '#FFFFFF',
          borderColor: '#FFFFFF',
          color: '#ED2C02',
          duration: 0.25,
          ease: 'power2.inOut',
        }, 0.05);
      }

      // Backdrop fade out
      tl.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      }, 0.1);
    }
  }, [isCartOpen]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = 5; // Flat rate delivery fee
  const total = subtotal + deliveryFee;

  const handlePay = async () => {
    await triggerCheckout('card');
  };

  const handleClose = () => {
    setIsCartOpen(false);
    resetCheckout();
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[90] bg-[#1A0500]/60 backdrop-blur-sm flex justify-center md:justify-end items-center p-4 md:p-6 opacity-0 pointer-events-none will-change-[opacity] transition-opacity duration-300"
    >
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={handleClose} />

      {/* Slide-over Panel: Premium Dual-box Stacked Card Container */}
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-[440px] h-full max-h-[92vh] md:max-h-full flex flex-col gap-4 pointer-events-none will-change-transform"
      >
        
        {/* Box 1: Header Container Card */}
        <div
          ref={headerRef}
          className="bg-[#ED2C02] text-white border border-[#ED2C02] rounded-[20px] px-6 py-4 flex items-center justify-between shadow-[4px_4px_0px_#1A0500] shrink-0 will-change-[background-color,color,border-color]"
        >
          <h2 className="font-judson font-bold text-2xl">
            Your Order
          </h2>
          <button
            onClick={handleClose}
            className="cart-close-btn w-8 h-8 rounded-full bg-white border border-white flex items-center justify-center text-[#ED2C02] transition-colors cursor-pointer will-change-[background-color,color,border-color]"
          >
            <X className="w-4.5 h-4.5 stroke-[3]" />
          </button>
        </div>

        {/* Box 2: Main Content Container Card */}
        <div
          ref={mainCardRef}
          className="flex-1 bg-white border border-[#ED2C02] rounded-[28px] p-6 flex flex-col justify-between shadow-[6px_6px_0px_#1A0500] overflow-hidden will-change-[transform,opacity]"
        >
          
          {/* Scrollable Upper Content Area */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-6 scrollbar-thin">
            
            {checkoutStatus === 'success' ? (
              <div className="cart-inner-item flex-1 flex flex-col items-center justify-center text-center py-12">
                <span className="text-5xl mb-4">🎉</span>
                <h3 className="font-judson font-bold text-2xl text-[#1A0500] mb-2">Order Confirmed!</h3>
                <p className="font-sans text-sm text-[#555555] max-w-xs mb-6">
                  Your receipt and summary have been emailed. We are prepping your sizzling feast!
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-[#ED2C02] text-white font-sans font-bold text-sm rounded-full border-2 border-[#1A0500] shadow-[3px_3px_0px_#1A0500] active:translate-y-0.5 active:shadow-[1px_1px_0px_#1A0500] transition-all cursor-pointer"
                >
                  Back to Menu
                </button>
              </div>
            ) : checkoutStatus === 'processing' ? (
              <div className="cart-inner-item flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-10 h-10 border-4 border-[#ED2C02] border-t-transparent rounded-full animate-spin mb-4" />
                <h3 className="font-judson font-bold text-xl text-[#1A0500] mb-1">Redirecting to Checkout...</h3>
                <p className="font-sans text-sm text-gray-500">Connecting securely to Stripe.</p>
              </div>
            ) : checkoutStatus === 'error' ? (
              <div className="cart-inner-item flex-1 flex flex-col items-center justify-center text-center py-8">
                <span className="text-4xl mb-3">⚠️</span>
                <h3 className="font-judson font-bold text-xl text-[#1A0500] mb-2">Checkout Error</h3>
                <p className="font-sans text-sm text-red-600 max-w-xs mb-5">
                  Unable to connect to Stripe checkout. Please try again.
                </p>
                <button
                  onClick={resetCheckout}
                  className="px-5 py-2 bg-[#ED2C02] text-white font-sans font-bold text-xs rounded-full border border-[#1A0500] shadow-[2px_2px_0px_#1A0500] cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : (
              /* CART OVERVIEW & ITEMS ONLY */
              <div className="flex flex-col gap-1 pr-1">
                {cart.map((item) => (
                  <div
                    key={item.uniqueId}
                    className="cart-inner-item flex items-center gap-4 py-3 border-b border-[#ED2C02]/10 last:border-b-0"
                  >
                    {/* Image Thumbnail */}
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-[#ED2C02]/20 shrink-0 relative">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 text-left min-w-0">
                      <span className="font-sans font-bold text-sm text-[#1A0500] block leading-tight truncate">
                        {item.product.name}
                      </span>
                      <span className="font-sans font-extrabold text-sm text-[#1A0500] block mt-0.5">
                        £{item.product.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Circular +/- Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-[#FFE6E0] border border-[#ED2C02] text-[#ED2C02] flex items-center justify-center font-bold hover:bg-[#ffdad2] transition-colors"
                      >
                        <Minus className="w-4.5 h-4.5 stroke-[3]" />
                      </button>
                      <span className="font-sans font-bold text-sm text-[#1A0500] w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-[#FFE6E0] border border-[#ED2C02] text-[#ED2C02] flex items-center justify-center font-bold hover:bg-[#ffdad2] transition-colors"
                      >
                        <Plus className="w-4.5 h-4.5 stroke-[3]" />
                      </button>
                    </div>

                    {/* Delete Icon */}
                    <button
                      onClick={() => removeFromCart(item.uniqueId)}
                      className="text-[#ED2C02] hover:text-red-700 p-1 cursor-pointer shrink-0 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Fixed Bottom Billing & Action Footer */}
          {cart.length > 0 && checkoutStatus !== 'success' && checkoutStatus !== 'processing' && (
            <div className="cart-inner-item border-t border-[#ED2C02]/20 pt-4 mt-4 flex flex-col gap-4 bg-white shrink-0">
              
              {/* Doorstep Delivery Info Card (styled with border-2 border-[#1A0500] and shadow-[4px_4px_0px_#1A0500]) */}
              <div className="w-full bg-[#FFE6E0] border-2 border-[#1A0500] rounded-full py-3 px-4 flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_#1A0500]">
                <span className="font-sans font-bold text-sm text-[#1A0500] flex items-center gap-1.5 leading-none">
                  🚚 Doorstep Delivery
                </span>
                <span className="font-sans text-[11px] text-[#666666] mt-0.5 leading-none">
                  Delivered to your location
                </span>
              </div>

              {/* Billing Subtotals */}
              <div className="flex flex-col gap-2 font-sans text-sm text-[#555555]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1A0500]">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-semibold text-[#1A0500]">£{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#ED2C02]/20 my-1" />
                <div className="flex justify-between font-sans font-bold text-base text-[#1A0500]">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Primary Action Checkout Button */}
              <button
                onClick={handlePay}
                className="w-full h-14 bg-[#ED2C02] text-white rounded-full pl-6 pr-3 font-sans font-bold text-base flex items-center justify-between border-2 border-[#1A0500] shadow-[4px_4px_0px_#1A0500] active:translate-y-0.5 active:shadow-[2px_2px_0px_#1A0500] transition-all cursor-pointer hover:bg-[#ff3b10]"
              >
                <span>Proceed to Checkout</span>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#ED2C02] shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            </div>
          )}

          {/* Empty Cart State CTA */}
          {cart.length === 0 && checkoutStatus !== 'success' && checkoutStatus !== 'processing' && (
            <div className="cart-inner-item flex-1 flex flex-col items-center justify-center text-center py-12 shrink-0">
              <span className="text-5xl mb-4">🛒</span>
              <h3 className="font-judson font-bold text-xl text-[#1A0500] mb-2">Your Basket is Empty</h3>
              <p className="font-sans text-sm text-[#666666] max-w-xs mb-6">
                Add delicious grilled meals from our menu to start your order.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-[#ED2C02] text-white font-sans font-bold text-sm rounded-full border-2 border-[#1A0500] shadow-[3px_3px_0px_#1A0500] active:translate-y-0.5 active:shadow-[1px_1px_0px_#1A0500] transition-all cursor-pointer hover:bg-[#ff3b10]"
              >
                Browse Menu
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
