'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function DeliveryPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-[#FFF5F3] pt-[150px] pb-20 px-6 flex flex-col items-center">
        <div className="w-full max-w-[800px] bg-white border-2 border-[#1A0500] rounded-[32px] p-8 md:p-12 shadow-[8px_8px_0px_#FF8A8A]">
          <h1 className="font-judson font-bold text-3xl md:text-4xl text-[#1A0500] mb-6 border-b border-[#1A0500]/10 pb-4">
            Delivery Policy
          </h1>
          <div className="font-sans text-sm md:text-base text-[#555555] leading-relaxed flex flex-col gap-5 text-left">
            <p><strong>Effective Date: August 7, 2026</strong></p>
            <p>
              We pride ourselves on delivering your hot, sizzling grilled seafood and BBQ fresh to your doorstep.
            </p>
            <h2 className="font-bold text-lg text-[#1A0500] mt-4">Delivery Zones</h2>
            <p>
              We deliver exclusively to London, Kent, and surrounding areas. Input your postcode in the checkout drawer to verify eligibility in real-time.
            </p>
            <h2 className="font-bold text-lg text-[#1A0500] mt-4">Fulfillment Schedule</h2>
            <p>
              Due to our current restaurant renovation, all orders must be scheduled in advance using the slot selector in the cart drawer.
            </p>
            <h2 className="font-bold text-lg text-[#1A0500] mt-4">Delivery Charges</h2>
            <p>
              A standard delivery charge of £5.00 applies to all London/Kent home deliveries. Collection from our spot is free.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
