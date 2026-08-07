'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-[#FFF5F3] pt-[150px] pb-20 px-6 flex flex-col items-center">
        <div className="w-full max-w-[800px] bg-white border-2 border-[#1A0500] rounded-[32px] p-8 md:p-12 shadow-[8px_8px_0px_#FF8A8A]">
          <h1 className="font-judson font-bold text-3xl md:text-4xl text-[#1A0500] mb-6 border-b border-[#1A0500]/10 pb-4">
            Refund Policy
          </h1>
          <div className="font-sans text-sm md:text-base text-[#555555] leading-relaxed flex flex-col gap-5 text-left">
            <p><strong>Effective Date: August 7, 2026</strong></p>
            <p>
              We want you to love your grilled meal. If you have an issue with your order, please let us know immediately so we can make it right.
            </p>
            <h2 className="font-bold text-lg text-[#1A0500] mt-4">Order Cancellations</h2>
            <p>
              Cancellations for standard pre-orders must be made at least 12 hours before the scheduled delivery slot. Event catering cancellation terms are specified in individual service agreements.
            </p>
            <h2 className="font-bold text-lg text-[#1A0500] mt-4">Refund Requests</h2>
            <p>
              If there is an issue with meal quality, completeness, or delivery timing, please contact us within 2 hours of receipt with order details. Eligible refunds will be credited back via Stripe/Paystack.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
