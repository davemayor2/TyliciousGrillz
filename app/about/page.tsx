import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Hero from '@/components/sections/about/Hero';
import Story from '@/components/sections/about/Story';
import Mission from '@/components/sections/about/Mission';
import Quality from '@/components/sections/about/Quality';
import Team from '@/components/sections/about/Team';
import CTA from '@/components/sections/home/CTA';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        <Hero />
        <Story />
        <Mission />
        <Quality />
        <Team />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
