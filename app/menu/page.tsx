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
import { supabase } from '@/libs/supabase/client';
import { MenuItem } from '@/types';

function MenuContent() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('all');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(FULL_MENU_DATA);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadDbProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, slug, price');

        if (!error && data && data.length > 0) {
          const dbMap = new Map<string, string | number>();
          data.forEach((p) => {
            if (p.slug) dbMap.set(String(p.slug).toLowerCase(), p.id);
            if (p.name) dbMap.set(String(p.name).toLowerCase(), p.id);
          });

          setMenuItems((prev) =>
            prev.map((item) => {
              const matchedId =
                dbMap.get(item.id.toLowerCase()) ||
                dbMap.get(item.name.toLowerCase());
              return matchedId ? { ...item, id: String(matchedId) } : item;
            })
          );
        }
      } catch (err) {
        console.warn('Notice loading products from Supabase:', err);
      }
    }

    loadDbProducts();
  }, []);

  const filteredProducts = activeCategory === 'all'
    ? menuItems
    : menuItems.filter((p) => p.category === activeCategory);

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
