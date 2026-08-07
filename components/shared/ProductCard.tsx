import React, { useState } from 'react';
import Image from 'next/image';
import { ProductCardProps, MenuItem } from '@/types';
import ProductOptionsModal from './ProductOptionsModal';

export default function ProductCard({
  id,
  name,
  description,
  price,
  image,
  category,
  onAddToCart,
}: ProductCardProps) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const productObj: MenuItem = {
    id,
    name,
    description,
    price,
    image,
    category: category as MenuItem['category']
  };

  const handleButtonClick = () => {
    setIsOptionsOpen(true);
    if (onAddToCart) {
      // Allow optional parent notification
      onAddToCart();
    }
  };

  return (
    <>
      <div className="group flex flex-col items-center text-center w-full max-w-sm mx-auto">
        {/* Top Image Banner with fully rounded corners */}
        <div className="relative w-full aspect-[4/3] rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#FFF5F5] border border-brand-orange/5 shadow-sm">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Title - Bold, black Instrument Sans */}
        <h3 className="font-sans font-bold text-xl md:text-[22px] text-black mt-4 group-hover:text-brand-orange transition-colors duration-200">
          {name}
        </h3>

        {/* Description - Muted dark gray/brown, regular Instrument Sans */}
        <p className="font-sans font-normal text-sm text-[#666666] leading-[1.4] my-3 max-w-[280px]">
          {description}
        </p>
        
        {/* Price - Bold black Instrument Sans */}
        <div className="font-sans font-bold text-xl md:text-2xl text-black mb-4">
          £{price.toLocaleString()}
        </div>

        {/* Add To Cart Pill Button - Neo-Brutalist 3D Offset Shadow Effect */}
        <button
          onClick={handleButtonClick}
          className="w-full py-3 bg-[#E63900] hover:bg-[#ff440a] text-white font-sans font-bold text-base rounded-full border-2 border-[#1A0500] shadow-[4px_4px_0px_#1A0500] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1A0500] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 cursor-pointer select-none"
        >
          Add To Cart
        </button>
      </div>

      {isOptionsOpen && (
        <ProductOptionsModal
          product={productObj}
          onClose={() => setIsOptionsOpen(false)}
        />
      )}
    </>
  );
}
