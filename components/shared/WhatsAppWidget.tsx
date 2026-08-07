'use client';

import React, { useState, useEffect } from 'react';

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
        <svg className="w-8 h-8 fill-white text-[#25D366]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.01-5.116-2.858-6.967C16.63 1.922 14.15 .912 11.516.912c-5.44 0-9.866 4.42-9.87 9.865 0 1.685.452 3.33 1.309 4.795l-.997 3.642 3.734-.979a9.78 9.78 0 0 0 4.295 1.019zm10.74-7.234c-.26-.13-1.54-.76-1.78-.85-.24-.09-.41-.13-.58.13-.17.26-.67.85-.82 1.02-.15.17-.3.2-.56.07-.26-.13-1.1-.41-2.1-1.3-.78-.7-1.31-1.56-1.46-1.82-.15-.26-.02-.4.11-.53.12-.11.26-.3.39-.46.13-.17.17-.28.26-.46.09-.17.04-.33-.02-.46-.06-.13-.58-1.39-.79-1.9-.21-.51-.42-.44-.58-.45l-.49-.01c-.17 0-.45.06-.69.32-.24.26-.92.9-1.04 1.13s-.08.45.02.65c.1.2 1.5 2.29 3.64 3.22.5.22.9.36 1.21.46.51.16.98.14 1.35.08.41-.06 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.07-.1-.26-.18-.52-.31z" />
        </svg>
      </button>
    </div>
  );
}
