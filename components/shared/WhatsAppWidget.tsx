'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function WhatsAppWidget() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip after 4 seconds to catch user's eye
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/2348123456789?text=Hello%20Tylicious%20Grillz,%20I%20would%20like%20to%20inquire%20about%20ordering.', '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-end gap-2">
      {/* Tooltip */}
      {showTooltip && (
        <div className="relative bg-[#1A0500] text-white border border-brand-orange/20 text-[11px] md:text-xs font-sans font-semibold px-4 py-2 rounded-2xl shadow-xl animate-fade-in max-w-[200px] text-right">
          <span>Need help? Chat with us!</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-1 -right-1 w-4 h-4 bg-white text-[#1A0500] text-[9px] font-bold rounded-full flex items-center justify-center border border-[#FF8A8A]"
          >
            ×
          </button>
        </div>
      )}

      {/* Floating Button: 3D Neo-Brutalist green WhatsApp trigger */}
      <button
        onClick={handleWhatsAppClick}
        aria-label="Chat on WhatsApp"
        className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center border-[4px] border-[#2A0300] shadow-[6px_6px_0px_#2A0300] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#2A0300] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all duration-150 cursor-pointer select-none"
      >
        <div className="relative w-8 h-8">
          <Image
            src="/whatsapp_icon.svg"
            alt="WhatsApp Chat"
            fill
            className="object-contain"
          />
        </div>
      </button>
    </div>
  );
}
