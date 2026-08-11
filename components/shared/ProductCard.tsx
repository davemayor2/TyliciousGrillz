import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ProductCardProps, MenuItem } from '@/types';
import ProductOptionsModal from './ProductOptionsModal';

export default function ProductCard({
  id,
  name,
  description,
  price,
  image,
  category,
  video,
  onAddToCart,
}: ProductCardProps) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const productObj: MenuItem = {
    id,
    name,
    description,
    price,
    image,
    category: category as MenuItem['category'],
    video,
  };

  useEffect(() => {
    if (!video || !cardRef.current || !videoRef.current) return;

    const videoEl = videoRef.current;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
      // Intersection Observer for mobile focus view
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsPlaying(true);
              videoEl.play().catch(() => {});
            } else {
              setIsPlaying(false);
              videoEl.pause();
              videoEl.currentTime = 0;
            }
          });
        },
        {
          threshold: 0.6, // Plays when 60% of the card is visible in mobile viewport
        }
      );

      observer.observe(cardRef.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [video]);

  const handleMouseEnter = () => {
    if (!video || !videoRef.current) return;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) {
      setIsPlaying(true);
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (!video || !videoRef.current) return;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) {
      setIsPlaying(false);
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleButtonClick = () => {
    setIsOptionsOpen(true);
    if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <>
      <div className="group flex flex-col items-center text-center w-full max-w-sm mx-auto">
        {/* Top Image Banner / Video Wrapper with fully rounded corners */}
        <div
          ref={cardRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative w-full aspect-[4/3] rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#FFF5F5] border border-brand-orange/5 shadow-sm"
        >
          {/* Static Image Base */}
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Autoplay Video Overlay */}
          {video && (
            <video
              ref={videoRef}
              src={video}
              loop
              muted
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 pointer-events-none ${
                isPlaying ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>

        {/* Title */}
        <h3 className="font-sans font-bold text-xl md:text-[22px] text-black mt-4 group-hover:text-brand-orange transition-colors duration-200">
          {name}
        </h3>

        {/* Description */}
        <p className="font-sans font-normal text-sm text-[#666666] leading-[1.4] my-3 max-w-[280px]">
          {description}
        </p>
        
        {/* Price */}
        <div className="font-sans font-bold text-xl md:text-2xl text-black mb-4">
          £{price.toLocaleString()}
        </div>

        {/* Add To Cart Pill Button */}
        <button
          onClick={handleButtonClick}
          className="w-full py-3 bg-[#E63900] hover:bg-[#ff440a] text-white font-sans font-bold text-base rounded-full border-2 border-[#1A0500] shadow-[4px_4px_0px_#1A0500] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1A0500] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 cursor-pointer select-none"
        >
          Add To Cart
        </button>
      </div>

      {isOptionsOpen && (
        <ProductOptionsModal
          product={productObj}
          onClose={() => setIsOptionsOpen(false)}
        />
      )}
    </>
  );
}
