
import React, { useEffect, useState, useRef } from 'react';
import { TEAM_LABELS } from '../../constants';
import { useTeamMembers, useSectionContent } from '../../hooks/useSupabaseData';
import { useIsMobile } from '../../hooks/useIsMobile';

const Coordinators: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { getSectionByKey } = useSectionContent();
  const sectionContent = getSectionByKey('coordinators');
  const { staffMembers, studentMembers, loading, error } = useTeamMembers();
  const isMobile = useIsMobile();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section id="contact" ref={sectionRef} className="py-32 px-4 bg-black relative border-t border-white/5 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-red-600 font-oswald tracking-widest uppercase text-xs">Loading Coordinators...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return null; // Don't show section if there's an error
  }

  return (
    <section id="contact" ref={sectionRef} className="py-32 px-4 bg-black relative border-t border-white/5 overflow-hidden">
      
      {/* Pirates of the Caribbean Reference - Desktop only */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-10 right-[5%] w-[600px] h-[450px] opacity-[0.08] animate-[shipSway_18s_ease-in-out_infinite]">
            <svg viewBox="0 0 500 400" className="w-full h-full fill-white">
              {/* Simple Ship Silhouette (Black Pearl style) */}
              <path d="M50,300 L450,300 Q400,350 250,350 Q100,350 50,300 Z" />
              <rect x="150" y="50" width="8" height="250" />
              <rect x="250" y="20" width="10" height="280" />
              <rect x="350" y="80" width="8" height="220" />
              <path d="M160,70 L240,70 Q200,120 160,180 Z" opacity="0.6" />
              <path d="M260,40 L340,40 Q300,100 260,160 Z" opacity="0.6" />
              <path d="M360,100 L430,100 Q400,150 360,200 Z" opacity="0.6" />
              <path d="M100,280 L400,280" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          {/* Oceanic Deep Blue/Mist */}
          <div className="absolute bottom-0 w-full h-[60%] bg-gradient-to-t from-blue-950/20 to-transparent blur-[100px]" />
        </div>
      )}

      <div className={`max-w-6xl mx-auto relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-24">
          <span className="font-oswald text-red-600 tracking-[0.5em] text-xs uppercase mb-2 block animate-pulse">{sectionContent?.label}</span>
          <h2 className="font-cinzel text-4xl md:text-6xl font-black mb-4">{sectionContent?.title}</h2>
          <div className="w-24 h-[2px] bg-red-600 mx-auto shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
        </div>

        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-oswald text-3xl text-white uppercase tracking-widest mb-10 flex items-center gap-4">
               <span className="hidden md:block w-8 h-[2px] bg-red-600" /> {TEAM_LABELS.staffTitle}
            </h3>
            <div className="space-y-12 w-full">
              {staffMembers.map((p) => (
                <div key={p.id} className={`group relative transition-all duration-700`}>
                  <div className="absolute -left-6 top-0 bottom-0 w-[1px] bg-red-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top hidden md:block" />
                  <p className="font-cinzel font-bold text-2xl text-white group-hover:text-red-500 transition-colors">{p.name}</p>
                  <p className="text-gray-500 font-oswald text-[10px] uppercase tracking-[0.4em] mb-3">{p.role}</p>
                  <a href={`tel:${p.phone}`} className="inline-flex items-center gap-2 text-red-600 font-mono text-sm hover:text-white transition-colors border-b border-transparent hover:border-white">
                    <span className="text-xs">☎</span> {p.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-oswald text-3xl text-white uppercase tracking-widest mb-10 flex items-center gap-4">
               <span className="hidden md:block w-8 h-[2px] bg-red-600" /> {TEAM_LABELS.studentTitle}
            </h3>
            <div className="space-y-12 w-full">
              {studentMembers.map((p) => (
                <div key={p.id} className={`group relative transition-all duration-700`}>
                  <div className="absolute -left-6 top-0 bottom-0 w-[1px] bg-red-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top hidden md:block" />
                  <p className="font-cinzel font-bold text-2xl text-white group-hover:text-red-500 transition-colors">{p.name}</p>
                  <p className="text-gray-500 font-oswald text-[10px] uppercase tracking-[0.4em] mb-3">{p.role}</p>
                  <a href={`tel:${p.phone}`} className="inline-flex items-center gap-2 text-red-600 font-mono text-sm hover:text-white transition-colors border-b border-transparent hover:border-white">
                    <span className="text-xs">☎</span> {p.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-32 flex flex-col items-center justify-center">
           <div className="w-full h-[1px] bg-white/5 mb-12" />
           <p className="font-oswald text-gray-500 text-[10px] uppercase tracking-[0.8em] mb-8">{sectionContent?.description}</p>
           
           <a 
            href="https://www.instagram.com/zynora_26/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative p-6 transition-all duration-500"
           >
              <div className="absolute inset-0 border border-red-600/0 group-hover:border-red-600/50 rounded-full scale-50 group-hover:scale-125 transition-all duration-700" />
              <svg 
                className="w-12 h-12 text-white group-hover:text-red-600 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
           </a>
        </div>
      </div>

      <style>{`
        @keyframes shipSway {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-30px, 15px) rotate(-1.5deg); }
        }
      `}</style>
    </section>
  );
};

export default Coordinators;
