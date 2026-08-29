'use client';

import React, { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Hero from '@/components/sections/home/Hero';
import CateringHighlight from '@/components/sections/home/CateringHighlight';
import WhyLoveUs from '@/components/sections/home/WhyLoveUs';
import Favorites from '@/components/sections/home/Favorites';
import Ordering from '@/components/sections/home/Ordering';
import Testimonials from '@/components/sections/home/Testimonials';
import Gallery from '@/components/sections/home/Gallery';
import CTA from '@/components/sections/home/CTA';
import SplashScreen from '@/components/SplashScreen';

export default function Home() {
  const [splashFinished, setSplashFinished] = useState(false);

  return (
    <>
      <SplashScreen onComplete={() => setSplashFinished(true)} />
      <Navbar />
      <main className="overflow-hidden">
        <Hero splashFinished={splashFinished} />
        <CateringHighlight />
        <WhyLoveUs />
        {/* <HomeCategories /> */}
        <Favorites />
        <Ordering />
        <Testimonials />
        <Gallery />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
