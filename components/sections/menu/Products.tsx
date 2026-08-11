'use client';

import React from 'react';
import { MenuItem } from '@/types';
import Container from '../../shared/Container';
import ProductCard from '../../shared/ProductCard';
import AnimatedSection from '../../shared/AnimatedSection';

interface ProductsProps {
  products: MenuItem[];
}

export default function Products({ products }: ProductsProps) {
  const handleAddToCart = (name: string) => {
    alert(`${name} added to cart!`);
  };

  return (
    <section className="py-16 bg-brand-bg min-h-[45vh]">
      <Container>
        {products.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="font-judson font-bold text-2xl text-brand-brown mb-2">No items found</h3>
            <p className="font-sans text-brand-brown/60 text-sm">We are adding more items to this category soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
            {products.map((product) => (
              <AnimatedSection key={product.id} direction="up" delay={0.05} triggerOnce={true}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                  video={product.video}
                  onAddToCart={() => handleAddToCart(product.name)}
                />
              </AnimatedSection>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
