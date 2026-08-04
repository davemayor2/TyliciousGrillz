'use client';

import React from 'react';
import { TESTIMONIALS_DATA } from '@/constants';
import Container from '../../shared/Container';
import SectionHeading from '../../shared/SectionHeading';
import ReviewCard from '../../shared/ReviewCard';
import AnimatedSection from '../../shared/AnimatedSection';

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#FFF5F5] relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute bottom-10 right-1/4 w-[30rem] h-[30rem] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <Container>
        {/* Header */}
        <AnimatedSection direction="up" className="flex flex-col items-center">
          <SectionHeading
            title="What Our Customers Say"
            highlightedWord="Customers"
            subtitle="Testimonials"
            align="center"
          />
          <p className="font-sans text-brand-brown/70 text-sm md:text-base max-w-md text-center leading-relaxed -mt-8 mb-16">
            Hear from our wonderful community of grilled food lovers who keep coming back for more.
          </p>
        </AnimatedSection>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((testimonial, index) => (
            <AnimatedSection
              key={testimonial.id}
              direction="up"
              delay={index * 0.15}
              className="flex"
            >
              <ReviewCard
                name={testimonial.name}
                rating={testimonial.rating}
                comment={testimonial.comment}
                role={testimonial.role}
              />
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
