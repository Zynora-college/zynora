import React, { useEffect, useState, useRef } from "react";
import CornerStrings from "../components/ui/CornerStrings";
import { useStatistics, useSectionContent, useButtonLabels } from "../hooks/useSupabaseData";
import { useIsMobile } from "../hooks/useIsMobile";

const StatsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { getSectionByKey } = useSectionContent();
  const { getButtonByKey } = useButtonLabels();
  const sectionContent = getSectionByKey('stats');
  const { data: statistics, loading, error } = useStatistics();
  const isMobile = useIsMobile();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section
        ref={sectionRef}
        className="relative py-32 bg-black overflow-hidden group flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-red-600 font-oswald tracking-widest uppercase text-xs">Loading Statistics...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error || !statistics || statistics.length === 0) {
    return null; // Don't show section if there's an error or no data
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-black overflow-hidden group"
    >
      {/* Corner Strings - Desktop only */}
      {!isMobile && (
        <>
          <CornerStrings
            position="bottom-right"
            className="bottom-0 right-0 !opacity-40"
          />
          <CornerStrings position="top-left" className="top-0 left-0 !opacity-40" />
        </>
      )}

      {/* Game of Thrones Reference - Desktop only */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] opacity-[0.06] flex items-end justify-center">
            <svg
              viewBox="0 0 500 500"
              className="w-full max-w-4xl h-full fill-white"
            >
              {/* Silhouette of Iron Throne */}
              <path d="M100,500 L150,400 L120,350 L140,300 L160,350 L180,280 L200,320 L220,250 L250,300 L280,250 L300,320 L320,280 L340,350 L360,300 L380,350 L350,400 L400,500 Z" />
              <path d="M200,500 L220,420 L240,400 L260,420 L300,500 Z" />
              <path d="M180,450 L160,400 L170,380 L190,400 L200,360 L210,400 Z" />
            </svg>
          </div>

          {/* Dragon Fire Embers Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(185,28,28,0.15)_0%,transparent_70%)]" />
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-red-500 rounded-full animate-pulse blur-[1px]"
                style={{
                  left: Math.random() * 100 + "%",
                  bottom: -5 + Math.random() * 50 + "%",
                  animationDelay: Math.random() * 10 + "s",
                  animationDuration: 3 + Math.random() * 5 + "s",
                  opacity: 0.2 + Math.random() * 0.5,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mobile: Simple gradient background */}
      {isMobile && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(185,28,28,0.1)_0%,transparent_60%)]" />
        </div>
      )}

      <div
        className={`relative z-10 max-w-6xl mx-auto px-6 text-center text-white transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p className="font-oswald text-red-600 tracking-[0.6em] text-[10px] uppercase mb-4 block">
          {sectionContent?.label}
        </p>
        <h2 className="font-cinzel font-black text-5xl mb-24 tracking-[0.3em] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
          {sectionContent?.title}
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          {statistics.sort((a, b) => a.order - b.order).map((stat, idx) => (
            <div
              key={stat.id}
              className={`flex flex-col items-center transition-all duration-700 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <span className="font-cinzel text-7xl md:text-8xl font-black mb-2 leading-none text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                {stat.value}
              </span>
              <span className="font-oswald font-bold text-sm tracking-[0.4em] opacity-60 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <button className="relative group/btn px-14 py-5 border-2 border-red-900/40 rounded-sm font-oswald font-bold text-sm uppercase tracking-[0.4em] overflow-hidden transition-all hover:border-red-600">
            <span className="relative z-10">{getButtonByKey('claim-throne') || 'Claim Your Throne'}</span>
            <div className="absolute inset-0 bg-red-600 translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-300" />
          </button>
          <button className="relative group/btn2 px-14 py-5 bg-red-700 text-white rounded-sm font-oswald font-bold text-sm uppercase tracking-[0.4em] overflow-hidden transition-all hover:scale-105 shadow-[0_15px_30px_rgba(185,28,28,0.4)]">
            <span className="relative z-10">{getButtonByKey('join-battle') || 'Join the Battle'}</span>
            <div className="absolute inset-0 bg-black opacity-0 group-hover/btn2:opacity-20 transition-opacity" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
