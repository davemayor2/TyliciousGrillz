'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    fulfillment,
    setFulfillment,
    postcode,
    setPostcode,
    isDeliveryEligible,
    validatePostcode,
    scheduledDate,
    setScheduledDate,
    scheduledTime,
    setScheduledTime,
    checkoutStatus,
    triggerCheckout,
    resetCheckout,
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment'>('cart');
  const [postcodeError, setPostcodeError] = useState('');

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = fulfillment === 'Delivery' ? 5 : 0;
  const total = subtotal + deliveryFee;

  const handlePostcodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) {
      setPostcodeError('Please enter a postcode');
      return;
    }
    setPostcodeError('');
    validatePostcode(postcode);
  };

  const handlePay = async (method: 'card' | 'apple-pay' | 'google-pay') => {
    await triggerCheckout(method);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setCheckoutStep('cart');
    resetCheckout();
  };

  return (
    <div className="fixed inset-0 z-[90] bg-[#1A0500]/60 backdrop-blur-sm flex justify-center md:justify-end items-center p-4 md:p-6 transition-all duration-300">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={handleClose} />

      {/* Slide-over Panel: Premium Dual-box Stacked Card Container */}
      <div className="relative z-10 w-full max-w-[440px] h-full max-h-[92vh] md:max-h-full flex flex-col gap-4 animate-slide-up">
        
        {/* Box 1: Header Container Card */}
        <div className="bg-white border border-[#ED2C02] rounded-[20px] px-6 py-4 flex items-center justify-between shadow-[4px_4px_0px_#1A0500] shrink-0">
          <h2 className="font-judson font-bold text-2xl text-[#1A0500]">
            {checkoutStep === 'payment' ? 'Payment Portal' : 'Your Order'}
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#FFE6E0] border border-[#ED2C02] flex items-center justify-center text-[#ED2C02] hover:bg-[#ffdad2] transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5 stroke-[3]" />
          </button>
        </div>

        {/* Box 2: Main Content Container Card */}
        <div className="flex-1 bg-white border border-[#ED2C02] rounded-[28px] p-6 flex flex-col justify-between shadow-[6px_6px_0px_#1A0500] overflow-hidden">
          
          {/* Scrollable Upper Content Area */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-6 scrollbar-thin">
            
            {checkoutStatus === 'success' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
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
            ) : checkoutStep === 'payment' ? (
              /* PAYMENT STEP */
              <div className="flex flex-col gap-6">
                
                <div className="p-5 bg-[#FFE6E0] border border-[#ED2C02] rounded-[24px] text-left">
                  <span className="font-sans font-bold text-[#1A0500] text-sm block mb-3">Order Summary</span>
                  <div className="flex flex-col gap-2 font-sans text-xs text-[#555555]">
                    {cart.map((item) => (
                      <div key={item.uniqueId} className="flex justify-between">
                        <span>{item.product.name} (x{item.quantity})</span>
                        <span>£{(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-[#ED2C02]/20 pt-2 flex justify-between font-bold text-sm text-[#1A0500]">
                      <span>Total ({fulfillment})</span>
                      <span>£{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="font-sans font-bold text-[#1A0500] text-sm block text-left">
                    Choose Payment Method
                  </span>

                  {checkoutStatus === 'processing' ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center">
                      <div className="w-8 h-8 border-4 border-[#ED2C02] border-t-transparent rounded-full animate-spin mb-3" />
                      <span className="font-sans font-medium text-sm text-[#555555]">Securing payment connection...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handlePay('card')}
                        className="w-full h-12 bg-[#1A0500] hover:bg-[#2A0300] text-white rounded-full flex items-center justify-center gap-3 font-sans font-semibold text-sm border-2 border-[#1A0500] cursor-pointer shadow-[3px_3px_0px_#ED2C02]"
                      >
                        <CreditCard className="w-5 h-5" />
                        <span>Pay with Debit/Credit Card</span>
                      </button>

                      <button
                        onClick={() => handlePay('apple-pay')}
                        className="w-full h-12 bg-black hover:bg-black/90 text-white rounded-full flex items-center justify-center gap-2 font-sans font-semibold text-sm border-2 border-black cursor-pointer shadow-[3px_3px_0px_#ED2C02]"
                      >
                        <span> Pay</span>
                      </button>

                      <button
                        onClick={() => handlePay('google-pay')}
                        className="w-full h-12 bg-white hover:bg-gray-50 text-black border-2 border-gray-300 rounded-full flex items-center justify-center gap-2 font-sans font-semibold text-sm cursor-pointer shadow-[3px_3px_0px_#ED2C02]"
                      >
                        <svg className="h-5 w-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.5 12.25c0-.62-.05-1.22-.16-1.8H12v3.42h4.2c-.18.96-.72 1.77-1.53 2.31v1.92h2.47c1.44-1.33 2.27-3.29 2.27-5.6-.01-.09-.01-.17-.09-.25z" fill="#4285F4"/>
                          <path d="M12 20c2.16 0 3.97-.72 5.3-1.94l-2.47-1.92c-.68.46-1.55.73-2.83.73-2.18 0-4.03-1.47-4.69-3.46H4.84v1.98C6.16 18.02 8.91 20 12 20z" fill="#34A853"/>
                          <path d="M7.31 13.41c-.17-.5-.26-1.04-.26-1.59s.09-1.09.26-1.59V8.25H4.84C4.3 9.35 4 10.59 4 12c0 1.41.3 2.65.84 3.75l2.47-1.98z" fill="#FBBC05"/>
                          <path d="M12 7.42c1.18 0 2.23.41 3.06 1.2l2.29-2.29C15.97 5.01 14.16 4.25 12 4.25 8.91 4.25 6.16 6.23 4.84 8.25l2.47 1.98c.66-1.99 2.51-3.46 4.69-3.46z" fill="#EA4335"/>
                        </svg>
                        <span>Pay with G Pay</span>
                      </button>
                    </div>
                  )}

                  {checkoutStatus === 'error' && (
                    <span className="font-sans text-xs text-[#ED2C02] block text-center mt-2">
                      ❌ Payment transaction failed. Please try again.
                    </span>
                  )}

                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="mt-4 font-sans font-bold text-xs text-[#1A0500] hover:underline"
                  >
                    ← Back to Cart Details
                  </button>
                </div>

              </div>
            ) : (
              /* CART OVERVIEW & OPTIONS STEP */
              <div className="flex flex-col gap-6">
                
                {/* Fulfillment Mode Toggle */}
                <div className="flex flex-col items-start">
                  <span className="font-sans font-bold text-black text-xs uppercase tracking-wider block mb-2 select-none">
                    Fulfillment Mode
                  </span>
                  <div className="flex border-2 border-[#1A0500] rounded-full overflow-hidden w-full bg-[#FFE6E0] p-1 shadow-[2px_2px_0px_#1A0500]">
                    <button
                      onClick={() => setFulfillment('Delivery')}
                      className={`flex-1 py-2 font-sans font-bold text-sm rounded-full transition-all cursor-pointer ${
                        fulfillment === 'Delivery' ? 'bg-[#ED2C02] text-white shadow-sm' : 'text-[#1A0500] hover:bg-[#ED2C02]/5'
                      }`}
                    >
                      Delivery
                    </button>
                    <button
                      onClick={() => setFulfillment('Collection')}
                      className={`flex-1 py-2 font-sans font-bold text-sm rounded-full transition-all cursor-pointer ${
                        fulfillment === 'Collection' ? 'bg-[#ED2C02] text-white shadow-sm' : 'text-[#1A0500] hover:bg-[#ED2C02]/5'
                      }`}
                    >
                      Collection
                    </button>
                  </div>
                </div>

                {/* Postcode check */}
                {fulfillment === 'Delivery' && (
                  <div className="flex flex-col items-start p-4 bg-[#FFE6E0] border border-[#ED2C02] rounded-[24px]">
                    <span className="font-sans font-bold text-[#1A0500] text-sm block mb-1">
                      Delivery Zip/Postcode
                    </span>
                    <p className="font-sans text-xs text-[#666666] mb-3">
                      We deliver exclusively to London and Kent.
                    </p>
                    <form onSubmit={handlePostcodeCheck} className="flex gap-2 w-full">
                      <input
                        type="text"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        placeholder="E.g. ME14 1XX"
                        className="flex-1 px-4 py-2 bg-white border border-[#ED2C02] rounded-full text-sm placeholder:text-gray-300 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#1A0500] hover:bg-black text-white font-sans font-bold text-xs rounded-full border border-[#1A0500] cursor-pointer"
                      >
                        Check
                      </button>
                    </form>
                    {postcodeError && <span className="text-[11px] text-[#ED2C02] font-sans mt-1">{postcodeError}</span>}
                    
                    {isDeliveryEligible !== null && (
                      <div className="mt-3 font-sans text-xs font-semibold">
                        {isDeliveryEligible ? (
                          <span className="text-[#34A853]">✅ Eligible for Delivery in London/Kent!</span>
                        ) : (
                          <span className="text-[#ED2C02]">❌ Outside our London/Kent delivery zone.</span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Pre-order dates scheduling */}
                <div className="flex flex-col items-start p-4 bg-white border border-[#ED2C02] rounded-[24px]">
                  <span className="font-sans font-bold text-[#1A0500] text-sm block mb-1">
                    Schedule Order (Required)
                  </span>
                  <p className="font-sans text-xs text-[#666666] mb-3">
                    Under renovation: Operational for online pre-orders.
                  </p>
                  <div className="grid grid-cols-2 gap-3.5 w-full">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Date</label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-[#ED2C02] rounded-full text-xs text-[#1A0500] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Time Slot</label>
                      <select
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-[#ED2C02] rounded-full text-xs text-[#1A0500] focus:outline-none"
                      >
                        <option value="">Select slot</option>
                        <option value="12:00-14:00">12:00 - 14:00</option>
                        <option value="14:00-16:00">14:00 - 16:00</option>
                        <option value="16:00-18:00">16:00 - 18:00</option>
                        <option value="18:00-20:00">18:00 - 20:00</option>
                        <option value="20:00-22:00">20:00 - 22:00</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Items List inside Main box */}
                <div className="flex flex-col gap-4">
                  <span className="font-sans font-bold text-[#1A0500] text-sm block text-left">
                    Items in Basket ({cart.length})
                  </span>

                  {cart.length === 0 ? (
                    <div className="py-8 text-center flex flex-col items-center justify-center">
                      <span className="text-4xl mb-2 block">🛒</span>
                      <span className="font-sans text-sm text-gray-400">Your basket is empty.</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 pr-1">
                      {cart.map((item) => (
                        <div
                          key={item.uniqueId}
                          className="flex items-center gap-4 py-3 border-b border-[#ED2C02]/10 last:border-b-0"
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
                            <span className="text-[10px] text-[#666666] font-sans block mt-1 truncate">
                              Spice: {item.spiceLevel} 
                              {item.selectedSides.length > 0 && ` • Sides: ${item.selectedSides.join(', ')}`}
                            </span>
                          </div>

                          {/* Circular +/- Controls */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-[#FFE6E0] border border-[#ED2C02] text-[#ED2C02] flex items-center justify-center font-bold hover:bg-[#ffdad2] transition-colors"
                            >
                              <Minus className="w-4 h-4 stroke-[3]" />
                            </button>
                            <span className="font-sans font-bold text-sm text-[#1A0500] w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-[#FFE6E0] border border-[#ED2C02] text-[#ED2C02] flex items-center justify-center font-bold hover:bg-[#ffdad2] transition-colors"
                            >
                              <Plus className="w-4 h-4 stroke-[3]" />
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

              </div>
            )}

          </div>

          {/* Fixed Bottom Billing & Action Footer */}
          {cart.length > 0 && checkoutStatus !== 'success' && (
            <div className="border-t border-[#ED2C02]/20 pt-4 mt-4 flex flex-col gap-4 bg-white shrink-0">
              
              {/* Doorstep Delivery Info Card */}
              <div className="w-full bg-[#FFE6E0] border border-[#ED2C02] rounded-2xl py-3 px-4 flex flex-col items-center justify-center text-center">
                <span className="font-sans font-bold text-sm text-[#1A0500] flex items-center gap-1.5">
                  🚚 Doorstep Delivery
                </span>
                <span className="font-sans text-xs text-[#666666] mt-0.5">
                  {fulfillment === 'Delivery' ? 'Delivered to your location' : 'Pre-ordered for collection'}
                </span>
              </div>

              {/* Billing Subtotals */}
              <div className="flex flex-col gap-2 font-sans text-sm text-[#555555]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1A0500]">£{subtotal.toFixed(2)}</span>
                </div>
                {fulfillment === 'Delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="font-semibold text-[#1A0500]">£{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-[#ED2C02]/20 my-1" />
                <div className="flex justify-between font-sans font-bold text-base text-[#1A0500]">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Primary Action Checkout Button */}
              {checkoutStep === 'cart' ? (
                <button
                  disabled={
                    (fulfillment === 'Delivery' && !isDeliveryEligible) ||
                    !scheduledDate ||
                    !scheduledTime
                  }
                  onClick={() => setCheckoutStep('payment')}
                  className="w-full h-14 bg-[#ED2C02] text-white disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full pl-6 pr-3 font-sans font-bold text-base flex items-center justify-between border-2 border-[#1A0500] shadow-[4px_4px_0px_#1A0500] active:translate-y-0.5 active:shadow-[2px_2px_0px_#1A0500] transition-all cursor-pointer hover:bg-[#ff3b10]"
                >
                  <span>Proceed to Checkout</span>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#ED2C02] shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
              ) : null}
            </div>
          )}

          {/* Empty Cart State CTA */}
          {cart.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 shrink-0">
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
