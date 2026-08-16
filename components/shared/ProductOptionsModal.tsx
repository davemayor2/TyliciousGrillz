'use client';

import React, { useState } from 'react';
import { MenuItem } from '@/types';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductOptionsModalProps {
  product: MenuItem;
  onClose: () => void;
}

export default function ProductOptionsModal({ product, onClose }: ProductOptionsModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Hot' | 'Extra Spicy'>('Medium');
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');

  const sidesOptions = [
    { id: 'plantain', label: 'Sweet Fried Plantain' },
    { id: 'mac-cheese', label: 'Mac & Cheese' },
    { id: 'vermicelli', label: 'Vermicelli Noodles' },
  ];

  const handleSideToggle = (sideId: string) => {
    setSelectedSides((prev) =>
      prev.includes(sideId) ? prev.filter((id) => id !== sideId) : [...prev, sideId]
    );
  };

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAdd = () => {
    addToCart(product, quantity, spiceLevel, selectedSides, specialNotes);
    alert(`${product.name} added to cart!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[8px] p-4 overflow-y-auto animate-backdrop">
      <style>{`
        @keyframes modalBackdrop {
          from { opacity: 0; backdrop-filter: blur(0px); background-color: rgba(0, 0, 0, 0); }
          to { opacity: 1; backdrop-filter: blur(8px); background-color: rgba(0, 0, 0, 0.4); }
        }
        @keyframes modalPop {
          from { transform: scale(0.9) translateY(15px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-backdrop {
          animation: modalBackdrop 0.22s ease-out forwards;
        }
        .animate-pop {
          animation: modalPop 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {/* Modal Container: 3D Stacked Card with pastel pink shadow backdrop */}
      <div className="relative w-full max-w-[520px] bg-white border border-[#E63900]/10 rounded-[32px] p-8 flex flex-col z-10 shadow-[12px_12px_0px_#FFD8D8] text-left animate-pop">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-judson font-normal text-[28px] text-black leading-tight">
            {product.name}
          </h3>
          
          {/* Close Button (Top-Right): circular with peach background tint and border */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FFF5F5] hover:bg-[#FFD1D1] border border-[#FF8A8A] flex items-center justify-center text-black transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="font-sans text-[13.5px] leading-relaxed text-[#666666] mb-5">
          {product.description || 'Fresh whole fish seasoned with Tylicious Grillz signature spices and flame-grilled to perfection. All fish meals are served with your choice of two delicious sides'}
        </p>

        {/* Form Options Scrollable Wrapper */}
        <div className="flex-1 overflow-y-auto max-h-[40vh] pr-1 flex flex-col gap-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#E63900]/25 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#E63900]/35 transition-colors">
          
          {/* Section 1: Spice Level (Radio Group) */}
          <div className="flex flex-col items-start w-full">
            <span className="font-sans font-bold text-black text-base mb-2.5">
              Spice Level*
            </span>
            <div className="flex flex-wrap gap-2.5 w-full">
              {(['Mild', 'Medium', 'Hot', 'Extra Spicy'] as const).map((level) => {
                const isSelected = spiceLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSpiceLevel(level)}
                    className={`px-4 py-2 rounded-full border-[1.5px] font-sans font-semibold text-xs md:text-sm text-center transition-all duration-150 cursor-pointer select-none ${
                      isSelected
                        ? 'bg-[#E63900] border-transparent text-white'
                        : 'bg-white border-[#E63900] text-[#2A0300] hover:bg-[#FFF5F5]'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Choose Your Sides (Checklist Group) */}
          <div className="flex flex-col items-start w-full">
            <span className="font-sans font-bold text-black text-base mb-2.5">
              Choose Your Sides (Optional)
            </span>
            <div className="flex flex-wrap gap-2.5 w-full">
              {sidesOptions.map((side) => {
                const isChecked = selectedSides.includes(side.id);
                return (
                  <button
                    key={side.id}
                    type="button"
                    onClick={() => handleSideToggle(side.id)}
                    className={`px-4 py-2 rounded-full border-[1.5px] font-sans font-semibold text-xs md:text-sm text-center transition-all duration-150 cursor-pointer select-none ${
                      isChecked
                        ? 'bg-[#E63900] border-transparent text-white'
                        : 'bg-white border-[#E63900] text-[#2A0300] hover:bg-[#FFF5F5]'
                    }`}
                  >
                    {side.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Special Notes (Textarea) */}
          <div className="flex flex-col items-start w-full">
            <label htmlFor="modal-notes" className="font-sans font-bold text-black text-base mb-2.5 select-none">
              Special Notes/Instructions
            </label>
            <textarea
              id="modal-notes"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="No chips Please"
              className="w-full h-24 px-4 py-3 bg-white border-[1.5px] border-[#E63900] rounded-[16px] text-black font-sans text-sm placeholder:text-[#666666] focus:outline-none focus:border-[#E63900] transition-colors resize-none"
            />
          </div>

        </div>

        {/* Footer Action Bar */}
        <div className="flex items-center justify-between mt-6 gap-4 pt-4 border-t border-[#E63900]/10">
          
          {/* Quantity Counter (Left) */}
          <div className="flex items-center gap-3 bg-white border-[1.5px] border-[#E63900] rounded-full py-1.5 px-3.5 select-none">
            <button
              onClick={handleDecrement}
              className="w-6 h-6 rounded-full bg-[#FFF5F5] border border-[#E63900] flex items-center justify-center text-[#E63900] hover:bg-[#FFD1D1] transition-colors cursor-pointer select-none font-bold text-xs"
            >
              -
            </button>
            <span className="w-6 text-center text-black font-sans font-bold text-base select-none">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="w-6 h-6 rounded-full bg-[#FFF5F5] border border-[#E63900] flex items-center justify-center text-[#E63900] hover:bg-[#FFD1D1] transition-colors cursor-pointer select-none font-bold text-xs"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button (Right) */}
          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-between bg-[#E63900] hover:bg-[#ff440a] rounded-full py-2 pr-2 pl-6 transition-colors duration-200 cursor-pointer select-none"
          >
            <span className="text-white font-sans font-bold text-base">
              Add to Cart
            </span>
            
            {/* White Circular Badge with Right Arrow */}
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#E63900] shrink-0 font-bold text-lg">
              →
            </div>
          </button>

        </div>

      </div>
    </div>
  );
}
