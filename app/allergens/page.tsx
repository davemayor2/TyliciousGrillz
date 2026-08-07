'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function AllergensPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-[#FFF5F3] pt-[150px] pb-20 px-6 flex flex-col items-center">
        <div className="w-full max-w-[800px] bg-white border-2 border-[#1A0500] rounded-[32px] p-8 md:p-12 shadow-[8px_8px_0px_#FF8A8A]">
          <h1 className="font-judson font-bold text-3xl md:text-4xl text-[#1A0500] mb-6 border-b border-[#1A0500]/10 pb-4">
            Allergen Information
          </h1>
          <div className="font-sans text-sm md:text-base text-[#555555] leading-relaxed flex flex-col gap-5 text-left">
            <p>
              Your safety is our top priority. We prepare all meals in a kitchen where allergens are present. Please review the following information:
            </p>
            <h2 className="font-bold text-lg text-[#1A0500] mt-4">Key Allergen Warnings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="p-4 border border-[#FF8A8A] rounded-[20px] bg-[#FFF5F5]">
                <strong className="text-[#1A0500] block mb-1">🐟 Seafood & Crustaceans</strong>
                <span>Present in our grilled croaker, tilapia, prawns, calamari, and seafood platters.</span>
              </div>
              <div className="p-4 border border-[#FF8A8A] rounded-[20px] bg-[#FFF5F5]">
                <strong className="text-[#1A0500] block mb-1">🥜 Nuts & Peanuts</strong>
                <span>Suya seasoning used on our spicy chicken skewers contains peanuts.</span>
              </div>
              <div className="p-4 border border-[#FF8A8A] rounded-[20px] bg-[#FFF5F5]">
                <strong className="text-[#1A0500] block mb-1">🥛 Dairy & Gluten</strong>
                <span>Spicy butter glazes contain milk. Some shared fryers cook chips and breaded items.</span>
              </div>
              <div className="p-4 border border-[#FF8A8A] rounded-[20px] bg-[#FFF5F5]">
                <strong className="text-[#1A0500] block mb-1">🌶️ Peppers & Spices</strong>
                <span>Bold chili base, ginger, garlic, and local herbs are widely used.</span>
              </div>
            </div>
            <p className="mt-4 text-xs md:text-sm text-gray-500 italic">
              * If you have a severe food allergy, please note it in the special instructions field in your cart drawer or notify our front desk before placing an order.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
