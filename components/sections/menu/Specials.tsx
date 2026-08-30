'use client';

import React from 'react';
import { Star, Flame, Check } from 'lucide-react';
import Container from '../../shared/Container';
import AnimatedSection from '../../shared/AnimatedSection';
import { useCart } from '@/components/context/CartContext';

export default function Specials() {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      product_id: 'special-bbq-chicken-platter',
      product_name: 'Tylicious BBQ Chicken Platter',
      product_image: '/images/Frame 153.png',
      quantity: 1,
      unit_price: 45,
      options: {
        'Included': [
          { name: '4 BBQ Wings, 2 Thighs, 1 Quarter', price: 0 },
          { name: 'Fries or Plantains, Sweetcorn & Dip', price: 0 }
        ]
      }
    });
  };

  return (
    <section className="py-24 bg-brand-brown text-white relative overflow-hidden" id="specials">
      {/* Soft background glow */}
      <div className="absolute left-[5%] top-[10%] w-[35rem] h-[35rem] bg-[#FD9F02]/5 blur-[120px] rounded-full pointer-events-none" />

      <Container>
        {/* Header */}
        <AnimatedSection direction="up" className="flex flex-col items-center">
          <div className="flex flex-col mb-10 md:mb-16 w-full items-center text-center">
            <span className="font-sans font-semibold text-xs md:text-sm tracking-[0.15em] uppercase text-[#FD9F02] mb-3">
              Chef&apos;s Selection
            </span>
            <h2 className="font-judson font-bold text-3xl md:text-5xl lg:text-[3.25rem] leading-[1.15] tracking-wide max-w-3xl text-white">
              Today&apos;s <span className="text-[#FD9F02]">Special</span> Showcase
            </h2>
          </div>
        </AnimatedSection>

        {/* Highlight Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-sm mt-4">
          
          {/* Media / Video Display */}
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-black border border-white/10 shadow-2xl flex items-center justify-center">
            <video
              src="/vids/wings_special 2.mp4"
              controls
              loop
              muted
              autoPlay
              playsInline
              suppressHydrationWarning
              className="w-full h-full object-cover"
            />
            {/* Tag Overlay */}
            <div className="absolute top-6 left-6 z-10 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FD9F02] text-white text-xs font-bold uppercase tracking-wider shadow-lg pointer-events-none">
              <Flame className="w-3.5 h-3.5 fill-white" />
              Best Value
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="flex items-center gap-1 mb-4 text-[#FFA800]">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <span className="text-white/60 text-xs font-sans ml-2">(48 Reviews)</span>
            </div>

            <h3 className="font-judson font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4 leading-tight">
              Tylicious <span className="text-[#FD9F02]">BBQ Chicken Platter</span>
            </h3>
            
            <p className="font-sans text-white/80 text-sm md:text-base leading-relaxed mb-6">
              A hearty, smoky, and flavorful platter loaded with our signature BBQ chicken, juicy grilled wings, and tender BBQ thighs, basted in our house special sauce. Served with crispy fries, grilled sweetcorn, and a tangy BBQ dip.
            </p>

            {/* Included list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 font-sans text-sm text-white/90 mb-8 w-full border-t border-b border-white/10 py-6">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#FD9F02] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
                <span>4 BBQ Chicken Wings</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#FD9F02] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
                <span>2 Grilled Chicken Thighs</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#FD9F02] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
                <span>1 BBQ Chicken Quarter (Leg & Thigh)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#FD9F02] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
                <span>Choice of Fries or Plantains</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#FD9F02] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
                <span>Grilled Sweetcorn</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#FD9F02] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
                <span>Tangy BBQ Dip</span>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex items-center gap-6 w-full">
              <div>
                <span className="font-sans text-xs text-white/50 block uppercase tracking-wider">Special Price</span>
                <span className="font-judson font-bold text-3xl text-[#FD9F02]">£45</span>
              </div>
              <button
                onClick={handleAddToCart}
                className="px-8 py-3 bg-[#FFEFED] hover:bg-[#ffe3df] text-[#1A0500] font-sans font-bold text-base rounded-full border-2 border-[#1A0500] shadow-[4px_4px_0px_#1A0500] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1A0500] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 cursor-pointer select-none"
              >
                Add Special To Cart
              </button>
            </div>

          </div>

        </div>
      </Container>
    </section>
  );
}
