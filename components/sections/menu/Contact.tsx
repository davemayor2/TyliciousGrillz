'use client';

import React from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';
import Container from '../../shared/Container';
import SectionHeading from '../../shared/SectionHeading';
import Card from '../../shared/Card';
import AnimatedSection from '../../shared/AnimatedSection';

export default function Contact() {
  const handleWhatsAppRedirect = () => {
    window.open('https://wa.me/2348123456789?text=Hello%20Tylicious%20Grillz,%20I%20would%20like%20to%20inquire%20about%20a%20bulk%20order%20for%20an%20event.', '_blank');
  };

  return (
    <section className="py-24 bg-[#FFF5F3] relative overflow-hidden">
      <Container>
        {/* Header */}
        <AnimatedSection direction="up" className="flex flex-col items-center">
          <SectionHeading
            title="Get In Touch With Us"
            highlightedWord="Touch"
            subtitle="Contact Grillz"
            align="center"
          />
          <p className="font-sans text-brand-brown/70 text-sm md:text-base max-w-md text-center leading-relaxed -mt-8 mb-16">
            Have questions about party orders, private catering, or general delivery? Reach out to our customer grill support.
          </p>
        </AnimatedSection>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Card 1: Call */}
          <AnimatedSection direction="up" delay={0.1}>
            <Card className="flex flex-col items-center text-center p-8 h-full bg-white border border-brand-orange/10">
              <div className="w-14 h-14 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-6">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-judson font-bold text-2xl text-brand-brown mb-2">Call to Order</h3>
              <p className="font-sans text-brand-brown/75 text-sm md:text-base mb-4">
                Speak directly with our front desk to place your order.
              </p>
              <span className="font-sans font-bold text-lg text-brand-orange">+234 812 345 6789</span>
            </Card>
          </AnimatedSection>

          {/* Card 2: Visit */}
          <AnimatedSection direction="up" delay={0.2}>
            <Card className="flex flex-col items-center text-center p-8 h-full bg-white border border-brand-orange/10">
              <div className="w-14 h-14 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-judson font-bold text-2xl text-brand-brown mb-2">Our Grill Spot</h3>
              <p className="font-sans text-brand-brown/75 text-sm md:text-base mb-4">
                Come pick up your orders or dine-in.
              </p>
              <span className="font-sans font-bold text-base text-brand-brown">12 Victoria Island, Lagos</span>
            </Card>
          </AnimatedSection>

          {/* Card 3: Hours */}
          <AnimatedSection direction="up" delay={0.3}>
            <Card className="flex flex-col items-center text-center p-8 h-full bg-white border border-brand-orange/10">
              <div className="w-14 h-14 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-judson font-bold text-2xl text-brand-brown mb-2">Opening Hours</h3>
              <p className="font-sans text-brand-brown/75 text-sm md:text-base mb-4">
                We are open every day of the week.
              </p>
              <span className="font-sans font-bold text-base text-brand-brown">Mon - Sun: 11:00 AM - 10:00 PM</span>
            </Card>
          </AnimatedSection>
        </div>

        {/* Catering Banner */}
        <AnimatedSection direction="up" className="w-full">
          <div className="bg-brand-brown text-white rounded-[2.5rem] p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left max-w-xl">
              <span className="font-sans font-semibold text-xs tracking-wider uppercase text-brand-orange block mb-2">Bulk Orders & Events</span>
              <h4 className="font-judson font-bold text-2xl md:text-3xl text-white mb-3">Host Your Event With Tylicious Grillz</h4>
              <p className="font-sans text-sm text-white/70">We provide premium catering services and live grilling setups for private parties, birthdays, corporate events, and wedding afterparties.</p>
            </div>
            <button
              onClick={handleWhatsAppRedirect}
              className="inline-flex items-center justify-center h-12 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full px-7 font-sans font-semibold text-base transition-colors duration-200 select-none cursor-pointer shrink-0"
            >
              Inquire via WhatsApp
            </button>
          </div>
        </AnimatedSection>

      </Container>
    </section>
  );
}
