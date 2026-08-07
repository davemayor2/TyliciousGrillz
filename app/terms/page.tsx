'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Container from '@/components/shared/Container';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-[#FFF5F3] pt-[150px] pb-20 px-6 flex flex-col items-center">
        <div className="w-full max-w-[800px] bg-white border-2 border-[#1A0500] rounded-[32px] p-8 md:p-12 shadow-[8px_8px_0px_#FF8A8A]">
          <h1 className="font-judson font-bold text-3xl md:text-4xl text-[#1A0500] mb-6 border-b border-[#1A0500]/10 pb-4">
            Terms & Conditions
          </h1>
          <div className="font-sans text-sm md:text-base text-[#555555] leading-relaxed flex flex-col gap-5 text-left">
            <p><strong>Effective Date: August 7, 2026</strong></p>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            <h2 className="font-bold text-lg text-[#1A0500] mt-4">Ordering & Fulfillment</h2>
            <p>
              Under renovation: Tylicious Grillz is operating exclusively for online pre-orders and event catering in London, Kent, and surrounding areas.
            </p>
            <h2 className="font-bold text-lg text-[#1A0500] mt-4">Pricing & Payments</h2>
            <p>
              All prices listed on the site are in British Pounds (£). We process secure debit/credit card, Apple Pay, and Google Pay payments via Stripe/Paystack.
            </p>
            <h2 className="font-bold text-lg text-[#1A0500] mt-4">Catering Services</h2>
            <p>
              Catering and live grill bookings require formal confirmation and a deposit to secure staffing and ingredients.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
