'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Flame } from 'lucide-react';
import Container from '../../shared/Container';
import SectionHeading from '../../shared/SectionHeading';
import AnimatedSection from '../../shared/AnimatedSection';

export default function Specials() {
  const handleAddToCart = () => {
    alert("Weekend Seafood Platter added to cart!");
  };

  return (
    <section className="py-24 bg-brand-brown text-white relative overflow-hidden" id="specials">
      {/* Soft background glow */}
      <div className="absolute left-[5%] top-[10%] w-[35rem] h-[35rem] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <Container>
        {/* Header */}
        <AnimatedSection direction="up" className="flex flex-col items-center">
          <SectionHeading
            title="Today's Special Showcase"
            highlightedWord="Special"
            subtitle="Chef's Selection"
            align="center"
            dark
          />
        </AnimatedSection>

        {/* Highlight Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-sm mt-4">
          
          {/* Image */}
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-brand-orange/5 border border-white/5 shadow-2xl">
            <Image
              src="/images/Gemini_Generated_Image_cibfydcibfydcibf.png"
              alt="Weekend Special Seafood Platter"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            {/* Tag Overlay */}
            <div className="absolute top-6 left-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-orange text-white text-xs font-bold uppercase tracking-wider shadow-lg">
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
              Tylicious Seafood Platter
            </h3>
            
            <p className="font-sans text-white/70 text-sm md:text-base leading-relaxed mb-6">
              A premium, crowd-pleasing feast containing grilled lobster tails, garlic jumbo prawns, seasoned calamari rings, and a whole grilled croaker fish, served with spicy garlic butter dip, crispy fries, and grilled sweetcorn.
            </p>

            {/* Included list */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 font-sans text-sm text-white/80 mb-8 w-full border-t border-b border-white/10 py-6">
              <div className="flex items-center gap-2">
                <span className="text-brand-orange">✓</span> 1 Whole Croaker Fish
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-orange">✓</span> 4 Garlic Jumbo Prawns
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-orange">✓</span> 2 Grilled Lobster Tails
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-orange">✓</span> Choice of Fries or Plantains
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex items-center gap-6 w-full">
              <div>
                <span className="font-sans text-xs text-white/50 block uppercase tracking-wider">Special Price</span>
                <span className="font-judson font-bold text-3xl text-brand-orange">£150</span>
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
