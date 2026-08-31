'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, Loader2, ChevronDown } from 'lucide-react';
import { useCart, CartItem } from '../context/CartContext';
import gsap from '@/libs/gsap';

interface CartDrawerItemProps {
  item: CartItem;
  updateQuantity: (cart_item_id: string, newQuantity: number) => void;
  removeItem: (cart_item_id: string) => void;
}

function CartDrawerItem({ item, updateQuantity, removeItem }: CartDrawerItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasOptions = Boolean(item.options && Object.keys(item.options).length > 0);
  const hasLegacyOptions = Boolean(
    item.spiceLevel || (item.selectedSides && item.selectedSides.length > 0)
  );
  const hasNotes = Boolean(item.specialNotes && item.specialNotes.trim().length > 0);
  const hasDetails = hasOptions || hasLegacyOptions || hasNotes;

  return (
    <div className="cart-inner-item py-3.5 border-b border-[#ED2C02]/10 last:border-b-0 flex flex-col gap-2 transition-colors">
      <div className="flex items-start gap-3 w-full">
        {/* Image Thumbnail */}
        <div className="w-12 h-12 rounded-full overflow-hidden border border-[#ED2C02]/20 shrink-0 relative bg-[#FFE6E0] mt-0.5">
          {item.product_image || item.product?.image ? (
            <Image
              src={item.product_image || item.product!.image}
              alt={item.product_name}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-lg">🍗</span>
          )}
        </div>

        {/* Metadata & Title */}
        <div className="flex-1 text-left min-w-0 pr-1">
          {/* Main Item Title - naturally wrapping with break-words */}
          <span className="font-sans font-bold text-sm text-[#1A0500] block leading-snug break-words">
            {item.product_name}
          </span>

          <span className="font-sans font-extrabold text-sm text-[#ED2C02] block mt-0.5">
            £{item.total.toFixed(2)}
          </span>

          {/* Expandable Accordion Trigger */}
          {hasDetails && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="mt-1 inline-flex items-center gap-1 text-[11px] font-sans font-medium text-[#777777] hover:text-[#ED2C02] transition-colors py-0.5 cursor-pointer select-none group"
              aria-expanded={isExpanded}
            >
              <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180 text-[#ED2C02]' : 'text-[#777777] group-hover:text-[#ED2C02]'
                }`}
              />
            </button>
          )}
        </div>

        {/* Controls: Quantity + Trash */}
        <div className="flex items-center gap-2 shrink-0 ml-auto self-start mt-0.5">
          {/* Circular +/- Controls */}
          <div className="flex items-center gap-1.5 bg-[#FFF5F3] p-1 rounded-full border border-[#ED2C02]/15">
            <button
              type="button"
              disabled={item.quantity <= 1}
              onClick={() => {
                if (item.quantity > 1) {
                  updateQuantity(item.cart_item_id, item.quantity - 1);
                }
              }}
              aria-label="Decrease quantity"
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold transition-all ${
                item.quantity <= 1
                  ? 'bg-gray-100 border border-gray-300 text-gray-300 cursor-not-allowed opacity-50'
                  : 'bg-[#FFE6E0] border border-[#ED2C02] text-[#ED2C02] hover:bg-[#ffdad2] active:scale-95 cursor-pointer'
              }`}
            >
              <Minus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
            <span className="font-sans font-bold text-xs text-[#1A0500] w-4 text-center select-none">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
              aria-label="Increase quantity"
              className="w-7 h-7 rounded-full bg-[#FFE6E0] border border-[#ED2C02] text-[#ED2C02] flex items-center justify-center font-bold hover:bg-[#ffdad2] active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

          {/* Delete Icon */}
          <button
            onClick={() => removeItem(item.cart_item_id)}
            className="text-[#ED2C02] hover:text-red-700 p-1.5 cursor-pointer shrink-0 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Expandable Options Container */}
      {hasDetails && isExpanded && (
        <div className="ml-15 mt-1 p-2.5 bg-[#FFF8F6] border border-[#ED2C02]/15 rounded-xl text-xs font-sans text-[#444444] space-y-1.5 text-left animate-fadeIn">
          {/* Options from options object */}
          {hasOptions &&
            Object.entries(item.options || {}).map(([category, values]) => {
              if (!values || values.length === 0) return null;
              return (
                <div key={category} className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                  <span className="font-bold text-[#1A0500] text-[11px] uppercase tracking-wider shrink-0">
                    {category}:
                  </span>
                  <span className="text-[#555555] break-words">
                    {values
                      .map((v) => (v.price > 0 ? `${v.name} (+£${v.price.toFixed(2)})` : v.name))
                      .join(', ')}
                  </span>
                </div>
              );
            })}

          {/* Fallback for legacy spice level */}
          {!hasOptions && item.spiceLevel && (
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-[#1A0500] text-[11px] uppercase tracking-wider shrink-0">
                Spice Level:
              </span>
              <span className="text-[#555555]">{item.spiceLevel}</span>
            </div>
          )}

          {/* Fallback for legacy sides */}
          {!hasOptions && item.selectedSides && item.selectedSides.length > 0 && (
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-[#1A0500] text-[11px] uppercase tracking-wider shrink-0">
                Extra Sides:
              </span>
              <span className="text-[#555555]">{item.selectedSides.join(', ')}</span>
            </div>
          )}

          {/* Special Instructions */}
          {hasNotes && (
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 pt-1 border-t border-[#ED2C02]/10">
              <span className="font-bold text-[#1A0500] text-[11px] uppercase tracking-wider shrink-0">
                Special Instructions:
              </span>
              <span className="text-[#666666] italic break-words">{item.specialNotes}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CartDrawer() {
  const {
    items,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    handleCheckout,
    isCheckingOut,
    checkoutStatus,
    errorMessage,
    resetCheckout,
    fulfillmentMethod,
    setFulfillmentMethod,
  } = useCart();

  const backdropRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (!backdropRef.current || !containerRef.current || !headerRef.current || !mainCardRef.current) return;

    const closeBtn = headerRef.current.querySelector('.cart-close-btn');
    const innerContents = mainCardRef.current.querySelectorAll('.cart-inner-item');
    const allTargets = [
      backdropRef.current,
      containerRef.current,
      headerRef.current,
      mainCardRef.current,
      closeBtn,
      ...Array.from(innerContents),
    ].filter(Boolean);

    // Initial mount when drawer has never been opened
    if (!isCartOpen && !hasOpenedRef.current) {
      gsap.set(backdropRef.current, { opacity: 0, pointerEvents: 'none' });
      gsap.set(containerRef.current, { pointerEvents: 'none' });
      gsap.set(mainCardRef.current, { x: '100%', opacity: 0 });
      return;
    }

    if (isCartOpen) {
      hasOpenedRef.current = true;
      gsap.killTweensOf(allTargets);
      
      gsap.set(backdropRef.current, { pointerEvents: 'auto' });
      gsap.set(containerRef.current, { pointerEvents: 'auto' });

      const tl = gsap.timeline();

      // 1. Backdrop Fade-in
      tl.to(backdropRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      }, 0);

      // Phase 1: header card styling
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

      // Phase 2: Slide main cart container box in from right
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
        0.1
      );

      // Stagger inner contents
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
          0.15
        );
      }

      return () => {
        tl.kill();
      };
    } else {
      // Exit Animation
      gsap.killTweensOf(allTargets);

      gsap.set(backdropRef.current, { pointerEvents: 'none' });
      gsap.set(containerRef.current, { pointerEvents: 'none' });

      const tl = gsap.timeline();

      tl.to(mainCardRef.current, {
        x: '100%',
        opacity: 0,
        duration: 0.35,
        ease: 'power3.in',
      }, 0);

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

      tl.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      }, 0.1);

      return () => {
        tl.kill();
      };
    }
  }, [isCartOpen]);

  const handlePay = async () => {
    await handleCheckout();
  };

  const handleClose = () => {
    closeCart();
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[90] bg-[#1A0500]/60 backdrop-blur-sm flex justify-center md:justify-end items-center p-4 md:p-6 opacity-0 pointer-events-none will-change-[opacity] transition-opacity duration-300"
    >
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={handleClose} />

      {/* Slide-over Panel */}
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
          className="flex-1 bg-white border border-[#ED2C02] rounded-[28px] flex flex-col shadow-[6px_6px_0px_#1A0500] overflow-hidden will-change-[transform,opacity] min-h-0"
        >
          
          {/* Scrollable items area — grows to fill available space, scrolls independently */}
          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-2 flex flex-col gap-6 scrollbar-thin min-h-0">
            
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
            ) : isCheckingOut ? (
              <div className="cart-inner-item flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-10 h-10 border-4 border-[#ED2C02] border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
                <h3 className="font-judson font-bold text-xl text-[#1A0500] mb-1">Redirecting to Checkout...</h3>
                <p className="font-sans text-sm text-gray-500">Connecting securely to Stripe.</p>
              </div>
            ) : checkoutStatus === 'error' ? (
              <div className="cart-inner-item flex-1 flex flex-col items-center justify-center text-center py-8">
                <span className="text-4xl mb-3">⚠️</span>
                <h3 className="font-judson font-bold text-xl text-[#1A0500] mb-2">Checkout Error</h3>
                <p className="font-sans text-sm text-red-600 max-w-xs mb-5">
                  {errorMessage || 'Unable to connect to Stripe checkout. Please try again.'}
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
                {items.map((item) => (
                  <CartDrawerItem
                    key={item.cart_item_id}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                  />
                ))}
              </div>
            )}

          </div>

          {/* Static pinned footer — shrink-0 keeps it from being squeezed by the items area */}
          {items.length > 0 && !isCheckingOut && checkoutStatus !== 'success' && (
            <div className="cart-inner-item shrink-0 overflow-y-auto border-t border-[#ED2C02]/20 px-6 pt-4 pb-6 flex flex-col gap-4 bg-white" style={{ maxHeight: '60vh' }}>

              {/* Delivery Method Toggle */}
              <div className="w-full">
                <p className="font-sans font-bold text-xs text-[#1A0500] uppercase tracking-wider mb-2 text-center">
                  How would you like your order?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {/* Delivery Option */}
                  <button
                    type="button"
                    onClick={() => setFulfillmentMethod('Delivery')}
                    className={`flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl border-2 font-sans text-xs font-bold transition-all duration-200 cursor-pointer ${
                      fulfillmentMethod === 'Delivery'
                        ? 'bg-[#ED2C02] border-[#1A0500] text-white shadow-[3px_3px_0px_#1A0500]'
                        : 'bg-[#FFF5F3] border-[#ED2C02]/30 text-[#555555] hover:border-[#ED2C02]/60'
                    }`}
                  >
                    <span className="text-lg">🚚</span>
                    <span>Delivery</span>
                    <span className={`text-[10px] font-normal ${
                      fulfillmentMethod === 'Delivery' ? 'text-white/80' : 'text-[#888888]'
                    }`}>
                      +£5.00
                    </span>
                  </button>

                  {/* Pickup Option */}
                  <button
                    type="button"
                    onClick={() => setFulfillmentMethod('Collection')}
                    className={`flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl border-2 font-sans text-xs font-bold transition-all duration-200 cursor-pointer ${
                      fulfillmentMethod === 'Collection'
                        ? 'bg-[#ED2C02] border-[#1A0500] text-white shadow-[3px_3px_0px_#1A0500]'
                        : 'bg-[#FFF5F3] border-[#ED2C02]/30 text-[#555555] hover:border-[#ED2C02]/60'
                    }`}
                  >
                    <span className="text-lg">📍</span>
                    <span>Pickup</span>
                    <span className={`text-[10px] font-normal ${
                      fulfillmentMethod === 'Collection' ? 'text-white/80' : 'text-[#888888]'
                    }`}>
                      Free
                    </span>
                  </button>
                </div>
              </div>

              {/* Pickup Address Info Box */}
              {fulfillmentMethod === 'Collection' && (
                <div className="w-full bg-[#FFF5F3] border-2 border-[#1A0500] rounded-2xl py-3 px-4 shadow-[3px_3px_0px_#1A0500]">
                  <p className="font-sans font-bold text-xs text-[#ED2C02] uppercase tracking-wider mb-1">📍 Pickup Location</p>
                  <p className="font-sans font-semibold text-sm text-[#1A0500] leading-snug">
                    Meadow Road, DA 117LR<br />Gravesend
                  </p>
                  <p className="font-sans text-[11px] text-[#666666] mt-1">
                    Please collect at your scheduled time.
                  </p>
                </div>
              )}

              {/* Billing Subtotals */}
              <div className="flex flex-col gap-2 font-sans text-sm text-[#555555]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1A0500]">£{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className={`font-semibold ${
                    deliveryFee === 0 ? 'text-green-600' : 'text-[#1A0500]'
                  }`}>
                    {deliveryFee === 0 ? 'Free' : `£${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-[#ED2C02]/20 my-1" />
                <div className="flex justify-between font-sans font-bold text-base text-[#1A0500]">
                  <span>Total</span>
                  <span>£{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Primary Action Checkout Button */}
              <button
                onClick={handlePay}
                disabled={isCheckingOut}
                className="w-full h-16 bg-[#ED2C02] text-white rounded-full pl-6 pr-3.5 font-sans font-bold text-base flex items-center justify-between border-2 border-[#1A0500] shadow-[4px_4px_0px_#1A0500] active:translate-y-0.5 active:shadow-[2px_2px_0px_#1A0500] transition-all cursor-pointer hover:bg-[#ff3b10] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}</span>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0">
                  {isCheckingOut ? (
                    <Loader2 className="w-4 h-4 text-[#ED2C02] animate-spin" />
                  ) : (
                    <Image
                      src="/order_now_arrow_orange.svg"
                      alt="Arrow"
                      width={18}
                      height={18}
                      className="w-4.5 h-4.5 object-contain"
                    />
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Empty Cart State CTA */}
          {items.length === 0 && !isCheckingOut && checkoutStatus !== 'success' && (
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
