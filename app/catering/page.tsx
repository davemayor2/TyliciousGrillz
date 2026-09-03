'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Container from '@/components/shared/Container';
import gsap from '@/libs/gsap';

export default function CateringPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const buttonHoverTlRef = useRef<gsap.core.Timeline | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '',
    address: '',
    staffing: 'Drop-off Buffet',
    specialNotes: '',
  });

  const [selectedMenu, setSelectedMenu] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Zoom reveal effect for background image
      gsap.fromTo(
        bgRef.current,
        { scale: 1.08 },
        { scale: 1, duration: 1.8, ease: 'power2.out' }
      );

      // Staggered reveal for text content
      gsap.fromTo(
        '.animate-catering-hero',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.18, ease: 'power3.out', delay: 0.25 }
      );
    }, contentRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status !== 'idle') setStatus('idle');
  };

  const handleMenuToggle = (item: string) => {
    setSelectedMenu((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
    if (status !== 'idle') setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setStatusMessage('');

    try {
      const res = await fetch('/api/catering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          selectedMenu,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit catering inquiry.');
      }

      setStatus('success');
      setStatusMessage(`Thank you, ${formData.name}! Your catering inquiry for ${formData.date} has been routed to our team at order@tyliciousgrillz.com. We'll be in touch shortly.`);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        guests: '',
        address: '',
        staffing: 'Drop-off Buffet',
        specialNotes: '',
      });
      setSelectedMenu([]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while submitting your inquiry.';
      setStatus('error');
      setStatusMessage(msg);
    }
  };

  const handleMouseEnter = () => {
    if (!iconRef.current) return;
    if (buttonHoverTlRef.current) buttonHoverTlRef.current.kill();

    buttonHoverTlRef.current = gsap.timeline();
    buttonHoverTlRef.current
      .to(iconRef.current, {
        x: 28,
        y: -28,
        opacity: 0,
        duration: 0.22,
        ease: 'power2.in',
      })
      .set(iconRef.current, {
        x: -28,
        y: 28,
      })
      .to(iconRef.current, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.28,
        ease: 'power2.out',
      });
  };

  const handleMouseLeave = () => {
    if (buttonHoverTlRef.current) {
      buttonHoverTlRef.current.kill();
      buttonHoverTlRef.current = null;
    }
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const menuChoices = [
    'Grilled Tilapia Fish',
    'Grilled Croaker Fish',
    'Grilled Lamb Chops',
    'Spicy Chicken Skewers',
    'Sweet Potato Fries',
    'Charcoal Grilled Sweetcorn',
  ];

  return (
    <>
      <Navbar />
      <main ref={contentRef} className="overflow-hidden bg-[#FFF5F3]">

        {/* Catering Hero Section */}
        <section className="relative w-full flex flex-col items-center justify-center overflow-hidden pt-[150px] pb-20 border-none">
          <div ref={bgRef} className="absolute inset-0 z-0">
            <Image
              src="/images/about us (2).png"
              alt="Overhead dark culinary flat-lay background"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 z-10" />
          </div>

          <Container className="relative z-20 text-center flex flex-col items-center">
            <div className="max-w-[700px] w-full flex flex-col items-center">
              <h1 className="animate-catering-hero font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] text-white tracking-[-0.02em] leading-tight mb-4">
                Event Catering
              </h1>
              <p className="animate-catering-hero font-sans text-white/85 text-base md:text-[1.125rem] leading-[1.5] font-normal">
                Sizzling live grilling and premium menus designed for weddings, birthdays, and corporate events across London and Kent.
              </p>
            </div>
          </Container>
        </section>

        {/* Interactive Catering Enquiry Form Section */}
        <section className="py-20 flex flex-col items-center px-6">
          <div className="w-full max-w-[680px] bg-white border-2 border-[#1A0500] rounded-[32px] p-8 md:p-12 shadow-[8px_8px_0px_#FF8A8A]">

            <div className="text-center mb-8">
              <h2 className="font-judson font-normal text-3xl md:text-[36px] text-black mb-1.5 leading-tight">
                Catering Enquiry
              </h2>
              <p className="font-sans font-normal text-[#666666] text-base">
                Tell us about your event and secure a bespoke quote
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                <div className="flex flex-col items-start">
                  <label htmlFor="name" className="font-sans font-bold text-black text-sm block mb-2">
                    Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="E.g. John Doe"
                    className="w-full px-5 py-3.5 bg-white border border-[#FF8A8A] rounded-full shadow-[4px_4px_0px_#FF8A8A] text-black font-sans text-base placeholder:text-[#B0B0B0] placeholder:text-[15px] focus:outline-none focus:border-[#E63900]"
                  />
                </div>

                <div className="flex flex-col items-start">
                  <label htmlFor="email" className="font-sans font-bold text-black text-sm block mb-2">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="E.g. john@example.com"
                    className="w-full px-5 py-3.5 bg-white border border-[#FF8A8A] rounded-full shadow-[4px_4px_0px_#FF8A8A] text-black font-sans text-base placeholder:text-[#B0B0B0] placeholder:text-[15px] focus:outline-none focus:border-[#E63900]"
                  />
                </div>
              </div>

              {/* Row 2: Phone and Event Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                <div className="flex flex-col items-start">
                  <label htmlFor="phone" className="font-sans font-bold text-black text-sm block mb-2">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="E.g. +44 7123 456789"
                    className="w-full px-5 py-3.5 bg-white border border-[#FF8A8A] rounded-full shadow-[4px_4px_0px_#FF8A8A] text-black font-sans text-base placeholder:text-[#B0B0B0] placeholder:text-[15px] focus:outline-none focus:border-[#E63900]"
                  />
                </div>

                <div className="flex flex-col items-start">
                  <label htmlFor="date" className="font-sans font-bold text-black text-sm block mb-2">
                    Event Date*
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3.5 bg-white border border-[#FF8A8A] rounded-full shadow-[4px_4px_0px_#FF8A8A] text-black font-sans text-base focus:outline-none focus:border-[#E63900]"
                  />
                </div>
              </div>

              {/* Row 3: Guest Count and Staffing Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                <div className="flex flex-col items-start">
                  <label htmlFor="guests" className="font-sans font-bold text-black text-sm block mb-2">
                    Estimated Guest Count*
                  </label>
                  <input
                    type="number"
                    id="guests"
                    name="guests"
                    required
                    value={formData.guests}
                    onChange={handleInputChange}
                    placeholder="E.g. 150"
                    className="w-full px-5 py-3.5 bg-white border border-[#FF8A8A] rounded-full shadow-[4px_4px_0px_#FF8A8A] text-black font-sans text-base placeholder:text-[#B0B0B0] placeholder:text-[15px] focus:outline-none focus:border-[#E63900]"
                  />
                </div>

                <div className="flex flex-col items-start">
                  <label htmlFor="staffing" className="font-sans font-bold text-black text-sm block mb-2">
                    Staffing & Service Type*
                  </label>
                  <div className="relative w-full">
                    <select
                      id="staffing"
                      name="staffing"
                      required
                      value={formData.staffing}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-white border border-[#FF8A8A] rounded-full shadow-[4px_4px_0px_#FF8A8A] text-black font-sans text-base focus:outline-none focus:border-[#E63900] appearance-none"
                    >
                      <option value="On-site Chef & Staff">On-site Chef & Staff (Live Grilling)</option>
                      <option value="Drop-off Buffet">Drop-off Buffet Delivery</option>
                      <option value="Full Service">Full Service Catering</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 4: Venue Address */}
              <div className="flex flex-col items-start w-full">
                <label htmlFor="address" className="font-sans font-bold text-black text-sm block mb-2">
                  Venue / Delivery Address*
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="E.g. London / Kent Venue Address"
                  className="w-full px-5 py-3.5 bg-white border border-[#FF8A8A] rounded-full shadow-[4px_4px_0px_#FF8A8A] text-black font-sans text-base placeholder:text-[#B0B0B0] placeholder:text-[15px] focus:outline-none focus:border-[#E63900]"
                />
              </div>

              {/* Row 5: Menu Choice Checklist */}
              <div className="flex flex-col items-start w-full">
                <span className="font-sans font-bold text-black text-sm block mb-3">
                  Select Desired Menu Items (Optional)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {menuChoices.map((choice) => {
                    const isSelected = selectedMenu.includes(choice);
                    return (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => handleMenuToggle(choice)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-full border-2 font-sans text-sm text-left transition-all duration-150 cursor-pointer select-none ${isSelected
                            ? 'bg-[#FFF5F5] border-[#1A0500] font-semibold text-[#1A0500] shadow-[2px_2px_0px_#1A0500]'
                            : 'bg-white border-[#FF8A8A] text-[#555555] hover:border-[#1A0500]'
                          }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#E63900] border-[#1A0500]' : 'border-[#FF8A8A] bg-white'
                          }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span>{choice}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 6: Special Notes (Textarea) */}
              <div className="flex flex-col items-start w-full">
                <label htmlFor="specialNotes" className="font-sans font-bold text-black text-sm block mb-2 select-none">
                  Special Notes & Custom Requests
                </label>
                <textarea
                  id="specialNotes"
                  name="specialNotes"
                  value={formData.specialNotes}
                  onChange={handleInputChange}
                  placeholder="Tell us about dietary restrictions, setup space, timelines, etc."
                  className="w-full h-32 px-5 py-4 bg-white border border-[#FF8A8A] rounded-[24px] shadow-[5px_5px_0px_#FF8A8A] text-black font-sans text-base placeholder:text-[#B0B0B0] placeholder:text-[15px] focus:outline-none focus:border-[#E63900] resize-none"
                />
              </div>

              {/* Status Feedback Messages */}
              {status === 'success' && (
                <div className="p-4 bg-[#E6F9EE] border-2 border-[#12B76A] rounded-2xl text-[#027A48] font-sans text-sm font-medium flex items-center gap-3">
                  <span className="text-xl">✅</span>
                  <span>{statusMessage}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 bg-[#FFF0F0] border-2 border-[#F04438] rounded-2xl text-[#D92D20] font-sans text-sm font-medium flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className={`inline-flex items-center justify-center h-12 ${
                    status === 'loading' ? 'bg-[#999999] cursor-not-allowed' : 'bg-[#E63900] hover:bg-[#ff440a] cursor-pointer'
                  } text-white rounded-full pl-6 pr-2 font-sans font-bold text-base transition-colors duration-200 group select-none border border-transparent shadow-none`}
                >
                  <span>{status === 'loading' ? 'Submitting Inquiry...' : 'Submit Inquiry'}</span>
                  <div className="ml-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 overflow-hidden relative">
                    {status === 'loading' ? (
                      <div className="w-4 h-4 border-2 border-[#E63900] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div ref={iconRef} className="flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23.38 2.71036C24.5654 2.29619 25.704 3.43486 25.2899 4.62019L18.3774 24.3719C17.9282 25.6529 16.1432 25.7252 15.5925 24.485L12.257 16.981L16.9517 12.2852C17.1063 12.1193 17.1904 11.8999 17.1864 11.6732C17.1824 11.4466 17.0906 11.2303 16.9303 11.07C16.7699 10.9096 16.5537 10.8178 16.327 10.8138C16.1003 10.8098 15.8809 10.894 15.715 11.0485L11.0192 15.7432L3.5152 12.4077C2.27503 11.8559 2.34853 10.072 3.62837 9.62286L23.38 2.71036Z" fill="#ED2C02" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              </div>

            </form>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
