'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('tylicious_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('tylicious_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100] max-w-[380px] w-[calc(100%-3rem)] bg-white border-2 border-[#1A0500] p-5 rounded-[24px] shadow-[5px_5px_0px_#1A0500] flex flex-col gap-3 text-left">
      <h4 className="font-sans font-bold text-[#1A0500] text-sm">
        🍪 Cookies & Privacy
      </h4>
      <p className="font-sans text-xs text-[#555555] leading-relaxed">
        We use cookies to optimize your ordering experience. By using our site, you agree to our{' '}
        <Link href="/cookies" className="text-[#E63900] font-bold hover:underline">
          Cookie Policy
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-[#E63900] font-bold hover:underline">
          Privacy Policy
        </Link>.
      </p>
      <div className="flex gap-2.5 mt-1">
        <button
          onClick={handleAccept}
          className="flex-1 py-2 bg-[#E63900] hover:bg-[#ff440a] text-white font-sans font-bold text-xs rounded-full border border-[#1A0500] shadow-[1.5px_1.5px_0px_#1A0500] active:translate-y-0.5 cursor-pointer"
        >
          Accept All
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="px-4 py-2 bg-[#FFF5F5] hover:bg-[#FFD1D1] text-[#1A0500] font-sans font-bold text-xs rounded-full border border-[#FF8A8A]"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
