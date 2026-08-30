'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import Container from '../../shared/Container';

interface CategoriesProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function Categories({ activeCategory, onSelectCategory }: CategoriesProps) {
  const categories = [
    {
      id: 'grilled-fish',
      label: 'Grilled\nFish',
      image: '/images/rs=w_1160,h_1773.webp',
    },
    {
      id: 'chicken-turkey',
      label: 'Chicken &\nTurkey',
      image: '/images/Frame 153.png',
    },
    {
      id: 'lamb-beef',
      label: 'Lamb &\nBeef',
      image: '/images/lamb&beef.webp',
    },
    {
      id: 'seafood',
      label: 'Seafood',
      image: '/images/Gemini_Generated_Image_cibfydcibfydcibf.png',
    },
  ];

  const handleCategoryClick = (catId: string) => {
    if (activeCategory === catId) {
      onSelectCategory('all');
    } else {
      onSelectCategory(catId);
    }
  };

  return (
    <section className="py-12 bg-[#FFF5F5] border-b border-brand-orange/10 relative z-30">
      <Container>
        {/* Section Header: Elegant dark serif display */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="w-full text-center">
            <h2 className="font-judson font-normal text-3xl md:text-[2.5rem] text-[#1A0500] leading-tight">
              Protein Choices
            </h2>
          </div>
        </div>

        {/* Responsive Category Pill Cards Grid (4 columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto items-center">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="relative group w-full text-left focus:outline-none cursor-pointer"
              >
                {/* Offset Pink/Orange Shadow Layer (3D styling) */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-[24px] translate-x-1.5 translate-y-1.5 z-0 transition-all duration-200",
                    isActive ? "bg-[#E63900]" : "bg-[#FFD1D1] group-hover:bg-[#FF8787]"
                  )}
                />

                {/* Base Card Capsule wrapper */}
                <div
                  className={cn(
                    "relative z-10 bg-white border rounded-[24px] p-2.5 pl-3.5 pr-5 flex items-center gap-3.5 transition-all duration-200 select-none",
                    isActive
                      ? "border-[#E63900] translate-x-[0.5px] translate-y-[0.5px]"
                      : "border-brand-orange/5 group-hover:translate-x-[0.5px] group-hover:translate-y-[0.5px]"
                  )}
                >
                  {/* Thumbnail Image: rounded border-radius 12px */}
                  <div className="relative w-[55px] h-[42px] rounded-[12px] overflow-hidden bg-brand-bg border border-brand-orange/10 shrink-0">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      sizes="60px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Category Title Text: Instrument Sans, bold */}
                  <span className="font-sans font-bold text-black text-sm md:text-base leading-tight whitespace-pre-line">
                    {cat.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Clear Filter / View All Items Action */}
        {activeCategory !== 'all' && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => onSelectCategory('all')}
              className="font-sans font-bold text-xs md:text-sm text-[#E63900] hover:text-[#ff440a] cursor-pointer transition-colors duration-200 flex items-center gap-1.5 bg-white border border-brand-orange/10 px-4 py-1.5 rounded-full shadow-sm"
            >
              <span>Show All Items</span>
              <span className="text-[10px] bg-[#E63900] text-white w-4 h-4 rounded-full flex items-center justify-center font-sans">×</span>
            </button>
          </div>
        )}

      </Container>
    </section>
  );
}
