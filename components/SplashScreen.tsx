'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete?: () => void;
  minDuration?: number; // duration in ms, default 2000 (2s)
}

// In-memory runtime state that stays true across client-side router navigations
// but resets to false on full browser refresh (F5 / reload) or initial URL entry.
let hasShownSplashInAppLifetime = false;

export function hasSeenSplash(): boolean {
  return hasShownSplashInAppLifetime;
}

export default function SplashScreen({
  onComplete,
  minDuration = 2000,
}: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(!hasShownSplashInAppLifetime);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(!hasShownSplashInAppLifetime);

  useEffect(() => {
    // If splash has already been shown during this SPA session, skip immediately
    if (hasShownSplashInAppLifetime) {
      setIsVisible(false);
      setShouldRender(false);
      onComplete?.();
      return;
    }

    // Lock scrolling while splash screen is active
    document.body.style.overflow = 'hidden';

    const startTime = performance.now();
    let animationFrameId: number;

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / minDuration, 1);

      // Smooth custom ease-in-out curve for a natural 2-second progression
      const easedProgress =
        rawProgress < 0.5
          ? 2 * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

      const percentage = Math.min(100, Math.round(easedProgress * 100));
      setProgress(percentage);

      if (rawProgress < 1) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);

        // Settle buffer after reaching 100%
        setTimeout(() => {
          setIsFadingOut(true);
          hasShownSplashInAppLifetime = true;

          // Seamless trigger to allow hero section to start animating as splash fades out
          setTimeout(() => {
            onComplete?.();
          }, 150);

          // After fade transition (500ms), unlock scroll and unmount
          setTimeout(() => {
            setIsVisible(false);
            setShouldRender(false);
            document.body.style.overflow = '';
          }, 500);
        }, 200);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.style.overflow = '';
    };
  }, [minDuration, onComplete]);

  if (!shouldRender || !isVisible) return null;

  return (
    <div
      aria-hidden={!isVisible}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      <div className="flex flex-col items-center justify-center px-6">
        {/* Brand Mascot & Logo Artwork in WebP */}
        <div className="relative w-[260px] sm:w-[320px] md:w-[380px] lg:w-[420px] max-w-[85vw] aspect-square flex items-center justify-center select-none animate-splash-pop">
          <Image
            src="/images/logo2.webp"
            alt="Tylicious Grillz Logo"
            width={420}
            height={420}
            priority
            className="object-contain w-full h-full drop-shadow-sm"
          />
        </div>

        {/* Horizontal Progress Bar Container */}
        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col items-center">
          {/* Progress Bar Track */}
          <div className="w-[240px] sm:w-[280px] md:w-[320px] h-[4px] bg-gray-200 rounded-full overflow-hidden relative shadow-inner">
            {/* Animated Bar Fill */}
            <div
              className="h-full bg-[#E63900] rounded-full transition-all duration-75 ease-out shadow-[0_0_10px_rgba(230,57,0,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes splashPop {
          0% {
            transform: scale(0.92);
            opacity: 0;
          }
          60% {
            transform: scale(1.02);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-splash-pop {
          animation: splashPop 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
