'use client';

import React, { useState } from 'react';

const regions = [
  {
    id: 'london',
    heading: 'London Coverage',
    emoji: '🏙️',
    subtext:
      'BBQ catering, grilled food, event catering, and selected delivery services across London.',
    areas: [
      'North London',
      'South London',
      'East London',
      'West London',
      'Central London',
      'South-East London',
    ],
    gradient: 'from-orange-600/20 via-amber-500/10 to-transparent',
    accent: '#FD9F02',
    borderColor: 'border-orange-500/30',
    badgeBg: 'bg-orange-500/15 text-orange-300 border border-orange-500/30',
    iconBg: 'bg-orange-500/20',
  },
  {
    id: 'kent',
    heading: 'Kent Coverage',
    emoji: '🌿',
    subtext:
      'Freshly prepared grilled delicacies and event catering across Kent.',
    areas: [
      'Gravesend',
      'Dartford',
      'Northfleet',
      'Ebbsfleet',
      'Greenhithe',
      'Swanscombe',
      'Sevenoaks',
      'Maidstone',
      'Rochester',
      'Strood',
      'Chatham',
      'Gillingham',
      'Rainham',
      'Sittingbourne',
      'Canterbury',
      'Ashford',
      'Tonbridge',
      'Tunbridge Wells',
      'Faversham',
      'Deal',
      'Folkestone',
      'Dover',
      'Margate',
      'Ramsgate',
      'Broadstairs',
    ],
    gradient: 'from-green-700/20 via-emerald-600/10 to-transparent',
    accent: '#4ade80',
    borderColor: 'border-green-500/30',
    badgeBg: 'bg-green-500/15 text-green-300 border border-green-500/30',
    iconBg: 'bg-green-500/20',
  },
  {
    id: 'essex',
    heading: 'Essex Coverage',
    emoji: '🔥',
    subtext:
      'Sizzling BBQ catering and grilled food for events and gatherings across Essex.',
    areas: [
      'Grays',
      'Thurrock',
      'Tilbury',
      'Basildon',
      'Brentwood',
      'Romford',
      'Hornchurch',
      'Upminster',
      'Rainham',
      'Dagenham',
      'Barking',
      'Chelmsford',
      'Southend-on-Sea',
      'Colchester',
      'Harlow',
      'Braintree',
      'Witham',
    ],
    gradient: 'from-red-700/20 via-rose-600/10 to-transparent',
    accent: '#f87171',
    borderColor: 'border-red-500/30',
    badgeBg: 'bg-red-500/15 text-red-300 border border-red-500/30',
    iconBg: 'bg-red-500/20',
  },
];

export default function DeliveryCoverage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="delivery-coverage"
      aria-label="Delivery and Catering Coverage Areas"
      className="relative py-20 md:py-28 bg-brand-bg overflow-hidden"
    >
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-green-600/8 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border border-[#FD9F02]/40 text-[#FD9F02] bg-[#FD9F02]/10 mb-4">
            We Come to You
          </span>
          <h2 className="font-judson text-4xl md:text-5xl text-brand-brown mb-4">
            Delivery &amp; Catering{' '}
            <span style={{ color: '#FD9F02' }} className="italic">
              Coverage
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-brand-brown/70 text-base md:text-lg leading-relaxed">
            Tylicious Grillz serves{' '}
            <strong className="text-brand-brown">London, Kent &amp; Essex</strong> — bringing
            premium African BBQ catering, grilled seafood, and Ghanaian event catering
            straight to your door or venue.
          </p>
        </div>

        {/* Region Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {regions.map((region) => {
            const isExpanded = expandedId === region.id;
            const visibleAreas = isExpanded ? region.areas : region.areas.slice(0, 6);

            return (
              <article
                key={region.id}
                className={`relative rounded-2xl border ${region.borderColor} bg-white/4 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                aria-label={region.heading}
              >
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${region.gradient} pointer-events-none`}
                />

                <div className="relative z-10 p-6 flex flex-col gap-4 h-full">
                  {/* Icon + heading */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${region.iconBg}`}
                    >
                      {region.emoji}
                    </div>
                    <h3 className="font-judson text-xl text-brand-brown">
                      {region.heading}
                    </h3>
                  </div>

                  {/* Subtext */}
                  <p className="text-brand-brown/65 text-sm leading-relaxed">
                    {region.subtext}
                  </p>

                  {/* Area Badge Chips */}
                  <div className="flex flex-wrap gap-2">
                    {visibleAreas.map((area) => (
                      <span
                        key={area}
                        className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${region.badgeBg}`}
                      >
                        {area}
                      </span>
                    ))}
                  </div>

                  {/* Expand / Collapse toggle */}
                  {region.areas.length > 6 && (
                    <button
                      onClick={() => toggle(region.id)}
                      aria-expanded={isExpanded}
                      className="mt-auto flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200 self-start focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      style={{ color: region.accent }}
                    >
                      <span>
                        {isExpanded ? 'Show Less' : `+${region.areas.length - 6} More Areas`}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="text-brand-brown/60 text-sm mb-4">
            Don&apos;t see your area? Get in touch — we may still be able to cater for you.
          </p>
          <a
            href="https://wa.me/447597934557"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-all duration-300 hover:opacity-90 hover:scale-105 focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: '#FD9F02' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M20.52 3.48A11.93 11.93 0 0012.05 0C5.42 0 .04 5.37.04 12a11.93 11.93 0 001.6 6L0 24l6.2-1.63A11.94 11.94 0 0012.05 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.53-8.52zM12.05 21.9a9.9 9.9 0 01-5.05-1.38l-.36-.22-3.72.97.99-3.62-.24-.37A9.9 9.9 0 012.1 12 9.95 9.95 0 0112.05 2.1 9.95 9.95 0 0122 12a9.95 9.95 0 01-9.95 9.9zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97s-.47-.15-.67.15-.77.97-.94 1.16-.35.22-.64.08a8.1 8.1 0 01-2.39-1.47 8.97 8.97 0 01-1.66-2.05c-.17-.3 0-.46.13-.6.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.57-.49-.5-.67-.5-.17 0-.37-.02-.57-.02s-.52.07-.8.37-.04 3.42 2.9 5.65c.4.3 2.8 1.8 4.5 1.37.7-.18 1.32-.57 1.7-1.07.38-.5.43-1 .3-1.12-.12-.13-.32-.2-.62-.35z" />
            </svg>
            Enquire on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
