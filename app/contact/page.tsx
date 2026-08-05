'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Hero from '@/components/sections/contact/Hero';
import Contact from '@/components/sections/menu/Contact';
import ContactForm from '@/components/sections/contact/ContactForm';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-[#FFF5F3]">
        <Hero />
        <Contact />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
