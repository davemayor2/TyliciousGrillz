'use client';

import React from 'react';
import { FAVORITES_DATA } from '@/constants';
import Container from '../../shared/Container';
import SectionHeading from '../../shared/SectionHeading';
import ProductCard from '../../shared/ProductCard';
import Button from '../../shared/Button';
import AnimatedSection from '../../shared/AnimatedSection';

export default function Favorites() {
  const handleAddToCart = (name: string) => {
    alert(`${name} added to cart!`);
  };

  return (
    <section className="py-24 bg-[#FFF5F5] relative overflow-hidden">
      {/* Background soft glowing lights */}
      <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <Container>
        {/* Header */}
        <AnimatedSection direction="up" className="flex flex-col items-center">
          <SectionHeading
            title="Customer Favorites"
            highlightedWord="Favorites"
            subtitle="Best Sellers"
            align="center"
          />
          <p className="font-sans text-brand-brown/70 text-sm md:text-base max-w-md text-center leading-relaxed -mt-8 mb-16">
            Indulge in our most ordered grilled seafood and charcoal meats, cooked fresh to order by our master grillers.
          </p>
        </AnimatedSection>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 mb-16">
          {FAVORITES_DATA.map((product, index) => (
            <AnimatedSection
              key={product.id}
              direction="up"
              delay={index * 0.15}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.image}
                category={product.category}
                onAddToCart={() => handleAddToCart(product.name)}
              />
            </AnimatedSection>
          ))}
        </div>

        {/* View Full Menu Button */}
        <AnimatedSection direction="up" className="flex justify-center">
          <Button
            href="/menu"
            variant="secondary"
            className="px-10 py-3.5 hover:bg-brand-orange hover:border-brand-orange hover:text-white"
          >
            View Full Menu
          </Button>
        </AnimatedSection>
      </Container>
    </section>
  );
}
