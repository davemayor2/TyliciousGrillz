import React from 'react';
import { ReviewCardProps } from '@/types';
import { Star } from 'lucide-react';

export default function ReviewCard({ name, rating, comment, role }: ReviewCardProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-6 rounded-[24px] bg-white border-2 border-[#FF8A8A] shadow-[4px_4px_0px_#FF8A8A] text-center max-w-md mx-auto w-full transition-transform duration-300 hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_#FF8A8A]">
      {/* Star Rating (Top) - Golden-yellow stars centered */}
      <div className="flex items-center gap-1 mb-4 justify-center">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-[#FBBF24] stroke-[#FBBF24]" />
        ))}
      </div>

      {/* Testimonial Quote (Bottom) - Instrument Sans, dark gray/black */}
      <p className="font-sans font-medium text-[#111827] text-[15px] md:text-base leading-[1.4] mb-4">
        &ldquo;{comment}&rdquo;
      </p>

      {/* Author Name & Role */}
      <div className="mt-2">
        <h4 className="font-sans font-bold text-sm md:text-base text-black">
          {name}
        </h4>
        {role && (
          <span className="font-sans text-[11px] text-[#FF8A8A] font-semibold uppercase tracking-wider block mt-0.5">
            {role}
          </span>
        )}
      </div>
    </div>
  );
}
