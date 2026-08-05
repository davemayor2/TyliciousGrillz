'use client';

import React, { useRef, useState } from 'react';
import gsap from '@/libs/gsap';

export default function ContactForm() {
  const iconRef = useRef<HTMLDivElement>(null);
  const buttonHoverTlRef = useRef<gsap.core.Timeline | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! Your message has been sent successfully.`);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleMouseEnter = () => {
    if (!iconRef.current) return;
    
    // Kill any running hover timeline
    if (buttonHoverTlRef.current) {
      buttonHoverTlRef.current.kill();
    }
    
    // Animate paper plane to fly out top-right and come back from bottom-left
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

  return (
    <section className="py-16 bg-[#FFF5F5] flex flex-col items-center px-6">
      {/* Centered vertical layout block (max-width ~650px) */}
      <div className="w-full max-w-[650px] bg-[#FFF5F5] rounded-[32px] p-10 md:p-12 border border-brand-orange/5">
        
        {/* Form Header */}
        <div className="text-center mb-8">
          <h2 className="font-judson font-normal text-3xl md:text-[36px] text-black mb-1.5 leading-tight">
            Your Details
          </h2>
          <p className="font-sans font-normal text-[#666666] text-base">
            Let us know how to get back to you
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          
          {/* First Row (2-Column Grid for Name and Email) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {/* Name field */}
            <div className="flex flex-col items-start">
              <label htmlFor="name" className="font-sans font-bold text-black text-sm block mb-2 select-none">
                Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John"
                className="w-full px-5 py-3.5 bg-white border border-[#FF8A8A] rounded-full shadow-[4px_4px_0px_#FF8A8A] text-black font-sans text-base placeholder:text-[#B0B0B0] placeholder:text-[15px] focus:outline-none focus:border-[#E63900] transition-colors"
              />
            </div>

            {/* Email field */}
            <div className="flex flex-col items-start">
              <label htmlFor="email" className="font-sans font-bold text-black text-sm block mb-2 select-none">
                Email Address*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                className="w-full px-5 py-3.5 bg-white border border-[#FF8A8A] rounded-full shadow-[4px_4px_0px_#FF8A8A] text-black font-sans text-base placeholder:text-[#B0B0B0] placeholder:text-[15px] focus:outline-none focus:border-[#E63900] transition-colors"
              />
            </div>
          </div>

          {/* Second Row (Full Width Input for Subject) */}
          <div className="flex flex-col items-start mt-5 w-full">
            <label htmlFor="subject" className="font-sans font-bold text-black text-sm block mb-2 select-none">
              Subject*
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="John"
              className="w-full px-5 py-3.5 bg-white border border-[#FF8A8A] rounded-full shadow-[4px_4px_0px_#FF8A8A] text-black font-sans text-base placeholder:text-[#B0B0B0] placeholder:text-[15px] focus:outline-none focus:border-[#E63900] transition-colors"
            />
          </div>

          {/* Third Row (Full Width Textarea for Message) */}
          <div className="flex flex-col items-start mt-5 w-full">
            <label htmlFor="message" className="font-sans font-bold text-black text-sm block mb-2 select-none">
              Message*
            </label>
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Message"
              className="w-full h-48 px-5 py-4 bg-white border border-[#FF8A8A] rounded-[24px] shadow-[5px_5px_0px_#FF8A8A] text-black font-sans text-base placeholder:text-[#B0B0B0] placeholder:text-[15px] focus:outline-none focus:border-[#E63900] transition-colors resize-none"
            />
          </div>

          {/* Submit Button ("Contact Us") with fly-away paper plane micro-interaction */}
          <div className="mt-7 flex justify-start">
            <button
              type="submit"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="inline-flex items-center justify-center h-12 bg-[#E63900] hover:bg-[#ff440a] text-white rounded-full pl-6 pr-2 font-sans font-bold text-base transition-colors duration-200 group select-none cursor-pointer border border-transparent shadow-none"
            >
              <span>Contact Us</span>
              <div className="ml-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 overflow-hidden relative">
                <div ref={iconRef} className="flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.38 2.71036C24.5654 2.29619 25.704 3.43486 25.2899 4.62019L18.3774 24.3719C17.9282 25.6529 16.1432 25.7252 15.5925 24.485L12.257 16.981L16.9517 12.2852C17.1063 12.1193 17.1904 11.8999 17.1864 11.6732C17.1824 11.4466 17.0906 11.2303 16.9303 11.07C16.7699 10.9096 16.5537 10.8178 16.327 10.8138C16.1003 10.8098 15.8809 10.894 15.715 11.0485L11.0192 15.7432L3.5152 12.4077C2.27503 11.8559 2.34853 10.072 3.62837 9.62286L23.38 2.71036Z" fill="#ED2C02"/>
                  </svg>
                </div>
              </div>
            </button>
          </div>

        </form>

      </div>
    </section>
  );
}
