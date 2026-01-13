import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CornerStrings from "../components/ui/CornerStrings";
import { TAGLINES } from "../constants";
import { useHeroContent } from "../hooks/useSupabaseData";
import { useIsMobile } from "../hooks/useIsMobile";
import { useReducedMotion } from "../hooks/useReducedMotion";

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [isGlitching, setIsGlitching] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [fadeStatus, setFadeStatus] = useState(true);
  const { data: heroContent, loading, error } = useHeroContent();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  // Use fallback content to prevent blocking on mobile
  const content = heroContent || {
    title: 'ZYNORA',
    subtitle: 'Enter the Legends',
    description: 'Experience the ultimate cinematic event',
    primaryButtonText: 'Register Now',
    secondaryButtonText: 'Learn More'
  };

  // Skip tagline animation on mobile to reduce CPU usage
  useEffect(() => {
    if (isMobile) return;
    
    const interval = setInterval(() => {
      setFadeStatus(false);
      setTimeout(() => {
        setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
        setFadeStatus(true);
      }, 1000);
    }, 6000);
    return () => clearInterval(interval);
  }, [isMobile]);

  const handleLogoClick = () => {
    if (isGlitching) return;
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 1200);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden pt-20 bg-black">
      {/* Corner Strings - Desktop only */}
      {!isMobile && (
        <>
          <CornerStrings position="top-left" className="top-0 left-0" />
          <CornerStrings position="top-right" className="top-0 right-0" />
        </>
      )}

      {/* Visceral Liquid & Monster Environment */}
      <div className="absolute inset-0 z-0 bg-[#050000]">
        {/* Deep Red Fog Layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          {isMobile ? (
            // Mobile: Simple static gradient - no animations
            <div className="absolute inset-0 bg-gradient-to-b from-red-900/15 via-transparent to-red-950/20" />
          ) : (
            // Desktop: Animated fog
            <>
              <div className="absolute -inset-[50%] opacity-30 mix-blend-screen animate-[fogDrift_40s_linear_infinite]">
                <div className="w-full h-full bg-gradient-to-br from-red-900 via-transparent to-red-950 blur-[100px]" />
              </div>
              <div className="absolute bottom-0 w-full h-[70%] bg-gradient-to-t from-[#200000] to-transparent blur-3xl opacity-60" />
            </>
          )}
        </div>

        {/* Mind Flayer Shadow Monster - Desktop only */}
        {!isMobile && (
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.08] flex items-center justify-center scale-150 animate-[monsterPulse_25s_ease-in-out_infinite]">
            <svg
              viewBox="0 0 1000 1000"
              className="w-full h-full fill-red-800 blur-3xl"
            >
              <path
                d="M500,300 Q200,-100 -200,400"
                stroke="currentColor"
                strokeWidth="60"
                fill="none"
              />
              <path
                d="M500,300 Q100,200 -300,800"
                stroke="currentColor"
                strokeWidth="60"
                fill="none"
              />
              <path
                d="M500,300 Q800,-100 1200,400"
                stroke="currentColor"
                strokeWidth="60"
                fill="none"
              />
              <path
                d="M500,300 Q900,200 1300,800"
                stroke="currentColor"
                strokeWidth="60"
                fill="none"
              />
              <ellipse cx="500" cy="350" rx="100" ry="150" />
              <path
                d="M500,300 Q500,0 300,-200"
                stroke="currentColor"
                strokeWidth="40"
                fill="none"
              />
              <path
                d="M500,300 Q500,0 700,-200"
                stroke="currentColor"
                strokeWidth="40"
                fill="none"
              />
            </svg>
          </div>
        )}

        {/* SVG Liquid Simulation Layer - Desktop only */}
        {!isMobile && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="bloodViscosity">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.015"
                  numOctaves="3"
                  seed="2"
                >
                  <animate
                    attributeName="baseFrequency"
                    values="0.015;0.018;0.015"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" scale="50" />
              </filter>
              <linearGradient id="bloodStream" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4a0000" />
                <stop offset="50%" stopColor="#800000" />
                <stop offset="100%" stopColor="#200000" />
              </linearGradient>
            </defs>
            <g filter="url(#bloodViscosity)">
              {Array.from({ length: 5 }).map((_, i) => (
                <path
                  key={i}
                  d={`M${-10 + i * 25}%,-10% Q${i * 20}%,50% ${
                    -10 + i * 25
                  }%,110% L${20 + i * 25}%,110% Q${40 + i * 20}%,50% ${
                    20 + i * 25
                  }%,-10% Z`}
                  fill="url(#bloodStream)"
                  className="animate-[fluidFlow_35s_linear_infinite]"
                  style={{ animationDelay: `-${i * 6}s`, opacity: 0.35 }}
                />
              ))}
            </g>
          </svg>
        )}

        {/* Depth Fog & Vignette - Simplified on mobile */}
        <div className={`absolute inset-0 pointer-events-none ${isMobile ? 'bg-gradient-to-t from-black via-transparent to-black/60' : 'bg-gradient-to-t from-black via-transparent to-black/80'}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-4xl px-6 flex flex-col items-center">
        {/* Stranger Things Inspired Title */}
        <div
          onClick={handleLogoClick}
          className={`relative mb-6 cursor-pointer select-none transition-transform duration-500 hover:scale-105 ${
            isGlitching && !isMobile ? "animate-[dimensionalRift_1s_ease-out]" : ""
          }`}
        >
          {/* Glow effect - simplified on mobile */}
          {!isMobile && <div className="absolute inset-0 bg-red-600/20 blur-[60px] animate-pulse" />}
          <h1 className={`font-cinzel text-7xl md:text-9xl font-black tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] ${!isMobile ? 'animate-[neonFlicker_4s_infinite]' : ''}`}>
            {content.title}
          </h1>
          <div className={`h-[2px] w-full bg-gradient-to-r from-transparent via-red-600 to-transparent mt-[-10px] ${!isMobile ? 'animate-pulse' : ''}`} />
        </div>

        <div className={`space-y-4 ${!isMobile ? 'animate-[fadeInUp_2s_ease-out]' : ''}`}>
          {/* Dynamic Tagline - Static on mobile */}
          <p
            className={`font-oswald text-red-500 text-xs md:text-sm tracking-[0.8em] uppercase opacity-80 text-glow ${
              isMobile 
                ? '' 
                : `animate-pulse transition-all duration-1000 ${fadeStatus ? "opacity-80 translate-y-0" : "opacity-0 translate-y-2"}`
            }`}
          >
            {TAGLINES[taglineIndex]}
          </p>
          <p className="font-inter text-gray-400 text-sm md:text-lg max-w-xl font-light leading-relaxed tracking-wide">
            {content.subtitle}
          </p>
        </div>

        <div className={`mt-12 flex flex-col sm:flex-row gap-6 ${!isMobile ? 'animate-[fadeInUp_2.5s_ease-out]' : ''}`}>
          <button
            onClick={() => navigate("/gallery")}
            className="group relative px-12 py-4 bg-transparent border border-red-900/50 text-red-500 font-oswald text-xs tracking-[0.4em] uppercase overflow-hidden transition-all duration-500 hover:text-white"
            data-testid="hero-gallery-button"
          >
            <span className="relative z-10">{content.secondaryButtonText}</span>
            <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          <button
            onClick={() => navigate("/events")}
            className="px-12 py-4 bg-red-700 text-white font-oswald text-xs tracking-[0.4em] uppercase hover:bg-white hover:text-black transition-all duration-500 shadow-[0_10px_40px_rgba(185,28,28,0.4)]"
            data-testid="hero-events-button"
          >
            {content.primaryButtonText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fogDrift {
          0% { transform: translate(-10%, -10%) rotate(0deg); }
          50% { transform: translate(10%, 10%) rotate(2deg); }
          100% { transform: translate(-10%, -10%) rotate(0deg); }
        }
        @keyframes monsterPulse {
          0%, 100% { transform: scale(1.5) translateY(0); opacity: 0.08; }
          50% { transform: scale(1.6) translateY(-30px); opacity: 0.12; }
        }
        @keyframes fluidFlow {
          0% { transform: translateY(-20%) scaleX(1); }
          50% { transform: translateY(0%) scaleX(1.1); }
          100% { transform: translateY(20%) scaleX(1); }
        }
        @keyframes neonFlicker {
          0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% { opacity: 1; filter: drop-shadow(0 0 10px rgba(220,38,38,0.8)); }
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% { opacity: 0.4; filter: drop-shadow(0 0 2px rgba(220,38,38,0.2)); }
        }
        @keyframes dimensionalRift {
          0% { transform: scale(1); filter: hue-rotate(0deg); }
          20% { transform: scale(1.1) skewX(10deg); filter: hue-rotate(90deg) blur(2px); }
          40% { transform: scale(0.9) skewX(-10deg); filter: hue-rotate(-90deg) blur(1px); }
          60% { transform: scale(1.05) skewY(5deg); filter: hue-rotate(180deg); }
          100% { transform: scale(1); filter: hue-rotate(0deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .text-glow { text-shadow: 0 0 10px rgba(220,38,38,0.8); }
      `}</style>
    </section>
  );
};

export default Hero;
