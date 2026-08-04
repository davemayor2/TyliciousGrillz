'use client';

import React, { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Hero from '@/components/sections/menu/Hero';
import Categories from '@/components/sections/menu/Categories';
import Products from '@/components/sections/menu/Products';
import Specials from '@/components/sections/menu/Specials';
import Delivery from '@/components/sections/menu/Delivery';
import Contact from '@/components/sections/menu/Contact';
import { FULL_MENU_DATA } from '@/constants';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = activeCategory === 'all'
    ? FULL_MENU_DATA
    : FULL_MENU_DATA.filter((p) => p.category === activeCategory);

  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        <Hero />
        <Categories activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
        <Products products={filteredProducts} />
        <Specials />
        <Delivery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
