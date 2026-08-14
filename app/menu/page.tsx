'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Hero from '@/components/sections/menu/Hero';
import Categories from '@/components/sections/menu/Categories';
import Products from '@/components/sections/menu/Products';
import Specials from '@/components/sections/menu/Specials';
import Delivery from '@/components/sections/menu/Delivery';
import Contact from '@/components/sections/menu/Contact';
import { FULL_MENU_DATA } from '@/constants';

function MenuContent() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const filteredProducts = activeCategory === 'all'
    ? FULL_MENU_DATA
    : FULL_MENU_DATA.filter((p) => p.category === activeCategory);

  return (
    <main className="overflow-hidden">
      <Hero />
      <Categories activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
      <Products products={filteredProducts} />
      <Specials />
      <Delivery />
      <Contact />
    </main>
  );
}

export default function MenuPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen bg-brand-bg flex items-center justify-center font-sans font-bold text-[#1A0500]">
          Loading Menu...
        </div>
      }>
        <MenuContent />
      </Suspense>
      <Footer />
    </>
  );
}
