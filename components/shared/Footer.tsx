'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook } from 'lucide-react';
import Container from './Container';

export default function Footer() {
  return (
    <footer className="bg-[#FFF5F5] pt-12 pb-8 overflow-hidden">
      <Container>
        {/* Main Footer Card - Dark Chocolate Brown with rounded corners */}
        <div className="bg-[#1A0500] rounded-[28px] p-10 md:p-12 text-white shadow-2xl border border-white/5 relative z-10">

          {/* Top Main Grid (3-Column Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 items-stretch">

            {/* Left Column (Contact & Socials) */}
            <div className="flex flex-col items-start gap-4 md:pr-12 md:border-r border-white/15">
              <h3 className="font-sans font-bold text-lg md:text-xl text-white tracking-tight">
                Contact
              </h3>

              <div className="flex flex-col gap-2.5 font-sans text-sm text-white/80 leading-relaxed text-left">
                <p>Phone: +44 7597 934557</p>
                <p>Address: Meadow Road, DA 117LR. Gravesend</p>
                <p>Email: order@tyliciousgrillz.com</p>
              </div>

              {/* Service Focus Highlight */}
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-white mt-4">
                Our Services
              </h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1 font-sans text-xs text-brand-orange uppercase font-semibold">
                <span>Private Events</span>
                <span className="text-white/40">•</span>
                <span>Weddings</span>
                <span className="text-white/40">•</span>
                <span>Birthdays</span>
                <span className="text-white/40">•</span>
                <span>Corporate</span>
                <span className="text-white/40">•</span>
                <span>Pre-Orders</span>
              </div>

              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-white mt-6">
                Follow Us On
              </h3>

              {/* Social Icons Row - Outlined White Icons */}
              <div className="flex items-center gap-4 mt-1">
                {/* Instagram */}
                <Link
                  href="https://www.instagram.com/tyliciousgrillz?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full border border-white/30 hover:border-white hover:bg-white/10 flex items-center justify-center text-white transition-all duration-200"
                >
                  <Instagram className="w-5 h-5" />
                </Link>

                {/* TikTok (Custom SVG Outline) */}
                <Link
                  href="https://www.tiktok.com/@tyliciousgrillz?is_from_webapp=1&sender_device=pc"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-10 h-10 rounded-full border border-white/30 hover:border-white hover:bg-white/10 flex items-center justify-center text-white transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .74.1v-3.5a6.81 6.81 0 0 0-.74-.04c-3.76 0-6.82 3.06-6.82 6.82s3.06 6.82 6.82 6.82 6.82-3.06 6.82-6.82V8.82a8.31 8.31 0 0 0 4.9 1.55V6.92a4.83 4.83 0 0 1-1.62-.23z" />
                  </svg>
                </Link>

                {/* Facebook */}
                <Link
                  href="https://www.facebook.com/Tyliciousgrillz"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full border border-white/30 hover:border-white hover:bg-white/10 flex items-center justify-center text-white transition-all duration-200"
                >
                  <Facebook className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Center Column (Brand Mascot & Logo) */}
            <div className="flex flex-col items-center justify-center gap-4 md:px-12 md:border-r border-white/15">
              {/* Large logo badge featuring the artwork */}
              <div className="relative w-44 h-44 md:w-48 md:h-48 overflow-hidden rounded-full bg-white border border-white/10 p-4 shadow-xl flex items-center justify-center shrink-0">
                <Image
                  src="/images/logo2.png"
                  alt="Tylicious Grillz Logo Mascot Badge"
                  fill
                  sizes="(max-width: 768px) 176px, 192px"
                  className="object-contain p-2.5"
                />
              </div>
              <span className="font-judson font-bold text-2xl tracking-wide text-white mt-2">
                Tylicious <span className="text-brand-orange">Grillz</span>
              </span>
            </div>

            {/* Right Column (Quick Links) */}
            <div className="flex flex-col items-start md:items-end justify-start gap-4 md:pl-12">
              <h3 className="font-sans font-bold text-lg md:text-xl text-white tracking-tight">
                Quick Links
              </h3>

              {/* Links List - Vertical stack */}
              <div className="flex flex-col gap-2.5 mt-1 font-sans text-sm text-white/80 md:items-end w-full">
                <Link href="/menu" className="hover:text-brand-orange transition-colors duration-200">
                  Menu
                </Link>
                <Link href="/#best-sellers" className="hover:text-brand-orange transition-colors duration-200">
                  Best Sellers
                </Link>
                <Link href="/#reviews" className="hover:text-brand-orange transition-colors duration-200">
                  Reviews
                </Link>
                <Link href="/#delivery" className="hover:text-brand-orange transition-colors duration-200">
                  Delivery
                </Link>
                <Link href="/privacy" className="hover:text-brand-orange transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link href="/cookies" className="hover:text-brand-orange transition-colors duration-200">
                  Cookie Policy
                </Link>
                <Link href="/terms" className="hover:text-brand-orange transition-colors duration-200">
                  Terms & Conditions
                </Link>
                <Link href="/delivery-policy" className="hover:text-brand-orange transition-colors duration-200">
                  Delivery Policy
                </Link>
                <Link href="/refund-policy" className="hover:text-brand-orange transition-colors duration-200">
                  Refund Policy
                </Link>
                <Link href="/allergens" className="hover:text-brand-orange transition-colors duration-200">
                  Allergens
                </Link>
              </div>
            </div>

          </div>

          {/* Middle Section (Delivery & Catering Coverage) */}
          <div className="mt-12 pt-10 border-t border-white/10 w-full">
            <h3 className="font-sans font-bold text-lg md:text-xl text-white tracking-tight text-center mb-6">
              Delivery &amp; Catering Coverage
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* London */}
              <div>
                <p className="font-sans font-semibold text-[#FD9F02] text-sm uppercase tracking-wide mb-2">London</p>
                <p className="font-sans text-xs text-white/70 leading-relaxed">
                  Tylicious Grillz provides BBQ catering, grilled food, event catering and selected delivery services across London, including North London, South London, East London, West London, Central London and South-East London.
                </p>
              </div>

              {/* Kent */}
              <div>
                <p className="font-sans font-semibold text-[#FD9F02] text-sm uppercase tracking-wide mb-2">Kent</p>
                <p className="font-sans text-xs text-white/70 leading-relaxed">
                  Serving customers throughout Kent, including Gravesend, Dartford, Northfleet, Ebbsfleet, Greenhithe, Swanscombe, Sevenoaks, Maidstone, Rochester, Strood, Chatham, Gillingham, Rainham, Sittingbourne, Canterbury, Ashford, Tonbridge, Tunbridge Wells, Margate, Ramsgate, Folkestone, Dover and surrounding Kent areas.
                </p>
              </div>

              {/* Essex */}
              <div>
                <p className="font-sans font-semibold text-[#FD9F02] text-sm uppercase tracking-wide mb-2">Essex</p>
                <p className="font-sans text-xs text-white/70 leading-relaxed">
                  Catering and event services available throughout Essex, including Grays, Thurrock, Brentwood, Basildon, Chelmsford, Billericay, Wickford, Southend-on-Sea, Rayleigh, Rochford, Stanford-le-Hope, Tilbury, Harlow, Epping, Loughton, Colchester, Braintree and surrounding Essex areas.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar (Outside Main Card, on light pink bg) */}
        <div className="mt-8 text-center text-[#555555] font-sans text-[13px] md:text-sm">
          <p>Copyright &copy; {new Date().getFullYear()} Tylicious Grillz - All Rights Reserved.</p>
        </div>

      </Container>
    </footer>
  );
}
