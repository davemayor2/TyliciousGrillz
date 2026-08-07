'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Container from '@/components/shared/Container';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-[#FFF5F3] pt-[150px] pb-20 px-6 flex flex-col items-center">
        <div className="w-full max-w-[800px] bg-white border-2 border-[#1A0500] rounded-[32px] p-8 md:p-12 shadow-[8px_8px_0px_#FF8A8A]">
          <h1 className="font-judson font-bold text-3xl md:text-4xl text-[#1A0500] mb-6 border-b border-[#1A0500]/10 pb-4">
            Privacy Policy
          </h1>
          <div className="font-sans text-sm md:text-base text-[#555555] leading-relaxed flex flex-col gap-5 text-left">
            <p><strong>Effective Date: August 7, 2026</strong></p>
            <p>
              At Tylicious Grillz, accessible from tyliciousgrillz.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Tylicious Grillz and how we use it.
            </p>
            <h2 className="font-bold text-lg text-[#1A0500] mt-4">Information We Collect</h2>
            <p>
              We collect personal details that you provide when placing an order or using our catering inquiry form, including your name, email, phone number, physical address, and payment information.
            </p>
            <h2 className="font-bold text-lg text-[#1A0500] mt-4">How We Use Your Information</h2>
            <p>
              We use your personal details to process orders, manage deliveries in London/Kent, send automated checkout confirmations, respond to event enquiries, and optimize our culinary services.
            </p>
            <h2 className="font-bold text-lg text-[#1A0500] mt-4">Data Security</h2>
            <p>
              All payments are processed securely through Stripe/Paystack. We do not store credit or debit card details on our servers.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
