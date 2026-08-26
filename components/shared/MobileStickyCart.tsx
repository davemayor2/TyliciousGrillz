'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MobileStickyCart() {
  const { items, itemCount, cartSubtotal, setIsCartOpen } = useCart();
  
  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-45 bg-white border-t-2 border-[#1A0500] px-6 py-4 flex items-center justify-between shadow-2xl md:hidden animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="relative">
          <ShoppingCart className="w-6 h-6 text-[#1A0500]" />
          <span className="absolute -top-1.5 -right-1.5 bg-[#E63900] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider leading-none">Your Basket</span>
          <span className="font-sans font-bold text-sm text-[#1A0500] mt-0.5">£{cartSubtotal.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => setIsCartOpen(true)}
        className="px-6 py-2.5 bg-[#E63900] hover:bg-[#ff440a] text-white font-sans font-bold text-xs rounded-full border border-[#1A0500] shadow-[2px_2px_0px_#1A0500] cursor-pointer"
      >
        View Basket
      </button>
    </div>
  );
}
