'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Container from '@/components/shared/Container';
import { useCart } from '@/components/context/CartContext';
import { CheckCircle2, ArrowRight, Utensils } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart once payment is confirmed upon landing
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">
      <Navbar />

      <main className="py-20 md:py-28 flex-1 flex items-center">
        <Container>
          <div className="max-w-2xl mx-auto bg-white border-2 border-[#1A0500] rounded-[32px] p-8 md:p-12 shadow-[8px_8px_0px_#1A0500] text-center">
            
            {/* Success Icon */}
            <div className="w-20 h-20 bg-[#FFE6E0] border-2 border-[#1A0500] rounded-full flex items-center justify-center text-[#ED2C02] mx-auto mb-6 shadow-[4px_4px_0px_#1A0500]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            {/* Heading */}
            <h1 className="font-judson font-bold text-3xl md:text-4xl text-[#1A0500] mb-3">
              Payment Successful!
            </h1>
            <p className="font-sans text-base md:text-lg text-[#555555] mb-6">
              Thank you for dining with Tylicious Grillz. Your order has been placed and our grill masters are preparing your feast!
            </p>

            {/* Details Box */}
            {sessionId && (
              <div className="bg-brand-bg border border-[#ED2C02]/20 rounded-2xl p-4 mb-8 text-left">
                <span className="font-sans text-xs uppercase tracking-wider text-[#888888] block font-bold mb-1">
                  Stripe Reference ID
                </span>
                <span className="font-mono text-xs md:text-sm text-[#1A0500] break-all font-semibold select-all">
                  {sessionId}
                </span>
              </div>
            )}

            {/* Next Steps */}
            <div className="border-t border-[#ED2C02]/15 pt-6 mb-8 text-left">
              <h3 className="font-sans font-bold text-sm text-[#1A0500] mb-2 uppercase tracking-wider">
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-[#555555] font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-[#ED2C02] font-bold">✓</span>
                  <span>A payment receipt and order summary have been sent to your email.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ED2C02] font-bold">✓</span>
                  <span>Your food will be freshly grilled over charcoal and dispatched promptly.</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/menu"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#ED2C02] text-white rounded-full font-sans font-bold text-base border-2 border-[#1A0500] shadow-[4px_4px_0px_#1A0500] active:translate-y-0.5 active:shadow-[2px_2px_0px_#1A0500] hover:bg-[#ff3b10] transition-all flex items-center justify-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                <span>Explore Menu</span>
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#1A0500] rounded-full font-sans font-bold text-base border-2 border-[#1A0500] shadow-[4px_4px_0px_#1A0500] active:translate-y-0.5 active:shadow-[2px_2px_0px_#1A0500] hover:bg-[#f9f9f9] transition-all flex items-center justify-center gap-2"
              >
                <span>Back to Home</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg flex items-center justify-center text-sm font-bold">Loading order details...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
