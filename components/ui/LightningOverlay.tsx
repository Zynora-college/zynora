
import React, { useEffect, useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const LightningOverlay: React.FC = () => {
  const [activeBolt, setActiveBolt] = useState<{ d: string; opacity: number } | null>(null);
  const [flash, setFlash] = useState(false);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Skip lightning if user prefers reduced motion
    if (prefersReducedMotion) return;

    const triggerLightning = () => {
      // Create a random lightning path starting from top
      const startX = Math.random() * 100;
      let path = `M ${startX} 0 `;
      let currentX = startX;
      let currentY = 0;
      
      const segments = 12;
      for (let i = 1; i <= segments; i++) {
        currentX += (Math.random() - 0.5) * 25;
        currentY += (100 / segments);
        path += `L ${currentX} ${currentY} `;
      }

      setActiveBolt({ d: path, opacity: 1 });
      setFlash(true);

      // Flash sequence
      setTimeout(() => setFlash(false), 80);
      setTimeout(() => setFlash(true), 150);
      setTimeout(() => setFlash(false), 220);
      
      // Bolt fade
      setTimeout(() => setActiveBolt(prev => prev ? { ...prev, opacity: 0 } : null), 400);
      setTimeout(() => setActiveBolt(null), 800);

      // Next strike - longer delay on mobile (30-60s instead of 7-15s)
      const nextDelay = isMobile 
        ? Math.random() * 30000 + 30000  // 30-60 seconds on mobile
        : Math.random() * 15000 + 7000;   // 7-15 seconds on desktop
      setTimeout(triggerLightning, nextDelay);
    };

    const initialTimeout = setTimeout(triggerLightning, 5000);
    return () => clearTimeout(initialTimeout);
  }, [isMobile, prefersReducedMotion]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {/* Global Red Screen Flash */}
      <div 
        className={`absolute inset-0 bg-red-600/5 transition-opacity duration-75 ${flash ? 'opacity-100' : 'opacity-0'}`} 
      />
      
      {/* SVG Lightning Bolt */}
      {activeBolt && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d={activeBolt.d} 
            stroke="rgba(220, 38, 38, 0.9)" 
            strokeWidth="0.4" 
            fill="none" 
            className="transition-opacity duration-300"
            style={{ 
              opacity: activeBolt.opacity, 
              filter: 'blur(1px) drop-shadow(0 0 15px #dc2626)' 
            }}
          />
          {/* Secondary glowing core for the bolt */}
          <path 
            d={activeBolt.d} 
            stroke="rgba(255, 255, 255, 0.7)" 
            strokeWidth="0.1" 
            fill="none" 
            className="transition-opacity duration-300"
            style={{ opacity: activeBolt.opacity }}
          />
        </svg>
      )}
    </div>
  );
};

export default LightningOverlay;
