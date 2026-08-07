'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-[#FFF5F3] pt-[150px] pb-20 px-6 flex flex-col items-center">
        <div className="w-full max-w-[800px] bg-white border-2 border-[#1A0500] rounded-[32px] p-8 md:p-12 shadow-[8px_8px_0px_#FF8A8A]">
          <h1 className="font-judson font-bold text-3xl md:text-4xl text-[#1A0500] mb-6 border-b border-[#1A0500]/10 pb-4">
            Cookie Policy
          </h1>
          <div className="font-sans text-sm md:text-base text-[#555555] leading-relaxed flex flex-col gap-5 text-left">
            <p><strong>Effective Date: August 7, 2026</strong></p>
            <p>
              This is the Cookie Policy for Tylicious Grillz, accessible from tyliciousgrillz.com.
            </p>
            <h2 className="font-bold text-lg text-[#1A0500] mt-4">What Are Cookies</h2>
            <p>
              As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience.
            </p>
            <h2 className="font-bold text-lg text-[#1A0500] mt-4">How We Use Cookies</h2>
            <p>
              We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.
            </p>
            <h2 className="font-bold text-lg text-[#1A0500] mt-4">Essential Cookies</h2>
            <p>
              We use essential cookies to remember your shopping cart items, selected options (spice level, sides), fulfillment choice (delivery/collection), and scheduling preferences.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
