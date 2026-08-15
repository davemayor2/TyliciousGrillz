'use client';

import React, { useState } from 'react';
import { MenuItem } from '@/types';
import { X, Plus, Minus } from 'lucide-react';
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
    { id: 'chips', label: 'Golden Hand-cut Chips' },
    { id: 'yam', label: 'Crispy Fried Yam' },
    { id: 'jollof', label: 'Smoky Jollof Rice' },
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      {/* 3D Neo-Brutalist Offset Modal Wrapper */}
      <div className="relative w-full max-w-[550px] group mx-auto my-auto z-10 flex flex-col">
        {/* Background Offset Shadow Layer (Soft pink, fully rounded corners, matches first image reference) */}
        <div className="absolute inset-0 bg-[#FFE6E0] rounded-[2rem] translate-x-2.5 translate-y-2.5 z-0" />
        
        {/* Main Card Container */}
        <div className="relative z-10 bg-white border border-[#E63900]/10 p-6 md:p-8 rounded-[2rem] flex flex-col shadow-[0_8px_30px_rgba(42,3,0,0.015)] max-h-[85vh] w-full text-left">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FFF5F5] hover:bg-[#FFD1D1] border border-[#FF8A8A] flex items-center justify-center text-[#1A0500] transition-colors cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Product Details Header */}
          <div className="mb-6 pr-8">
            <h3 className="font-judson font-bold text-2xl md:text-3xl text-[#1A0500] mb-2 leading-tight">
              {product.name}
            </h3>
            <p className="font-sans text-sm text-[#555555] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Customization Options Container with Optimized Scrollbar spacing */}
          <div className="flex-1 overflow-y-auto max-h-[45vh] pr-2.5 flex flex-col gap-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#E63900]/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#E63900]/35 transition-colors">
            
            {/* Option 1: Spice Level (Radio Selection) */}
            <div className="flex flex-col items-start w-full">
              <span className="font-sans font-bold text-black text-sm block mb-3">
                Spice Level*
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                {(['Mild', 'Medium', 'Hot', 'Extra Spicy'] as const).map((level) => {
                  const isSelected = spiceLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSpiceLevel(level)}
                      className={`px-4 py-2.5 rounded-full border font-sans font-semibold text-xs md:text-sm text-center transition-all duration-150 cursor-pointer select-none ${
                        isSelected
                          ? 'bg-[#E63900] border-[#E63900] text-white shadow-[2px_2px_0px_#FFE6E0]'
                          : 'bg-white border-[#FF8A8A] text-[#1A0500] hover:border-[#E63900]'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Option 2: Side Selection (Checkboxes) */}
            <div className="flex flex-col items-start w-full">
              <span className="font-sans font-bold text-black text-sm block mb-3">
                Choose Your Sides (Optional)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {sidesOptions.map((side) => {
                  const isChecked = selectedSides.includes(side.id);
                  return (
                    <button
                      key={side.id}
                      type="button"
                      onClick={() => handleSideToggle(side.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-full border font-sans text-sm text-left transition-all duration-150 cursor-pointer select-none ${
                        isChecked
                          ? 'bg-[#FFF5F5] border-[#E63900] font-semibold text-[#E63900] shadow-[2px_2px_0px_#FFE6E0]'
                          : 'bg-white border-[#FF8A8A] text-[#555555] hover:border-[#E63900]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-[#E63900] border-[#E63900]' : 'border-[#FF8A8A] bg-white'
                      }`}>
                        {isChecked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span>{side.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Option 3: Special Notes (Textarea) */}
            <div className="flex flex-col items-start w-full">
              <label htmlFor="modal-notes" className="font-sans font-bold text-black text-sm block mb-2 select-none">
                Special Notes / Instructions
              </label>
              <textarea
                id="modal-notes"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="E.g. No onions, extra chili dip, etc."
                className="w-full h-24 px-4 py-3 bg-white border border-[#FF8A8A] rounded-[20px] shadow-[3px_3px_0px_#FFE6E0] text-black font-sans text-sm placeholder:text-[#B0B0B0] focus:outline-none focus:border-[#E63900] transition-colors resize-none"
              />
            </div>

          </div>

          {/* Footer Actions Row */}
          <div className="mt-8 pt-5 border-t border-[#E63900]/10 flex items-center justify-between gap-4">
            
            {/* Quantity Selector Counter */}
            <div className="flex items-center gap-3.5 bg-[#FFF5F5] border border-[#FF8A8A] rounded-full px-4 py-1.5 shadow-[2px_2px_0px_#FFE6E0]">
              <button
                onClick={handleDecrement}
                className="w-7 h-7 rounded-full bg-white flex items-center justify-center border border-[#FF8A8A] hover:bg-[#FFD1D1] text-[#E63900] cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-sans font-bold text-lg text-[#1A0500] w-6 text-center select-none">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-7 h-7 rounded-full bg-white flex items-center justify-center border border-[#FF8A8A] hover:bg-[#FFD1D1] text-[#E63900] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Premium Pill Button */}
            <button
              onClick={handleAdd}
              className="flex-1 inline-flex items-center justify-center h-12 bg-[#E63900] text-white hover:bg-[#ff440a] rounded-full pl-6 pr-2 font-sans font-bold text-base transition-colors duration-200 group select-none cursor-pointer border border-transparent shadow-none"
            >
              <span>Add to Cart</span>
              <div className="ml-3.5 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#E63900] shrink-0 overflow-hidden relative">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
