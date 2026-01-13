
import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

interface Props {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

const CornerStrings: React.FC<Props> = ({ position, className = "" }) => {
  const isMobile = useIsMobile();
  const rotationMap = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': 'rotate-270'
  };

  // On mobile, render simpler version or hide completely
  if (isMobile) {
    return null; // Remove corner strings on mobile for better performance
  }

  return (
    <div className={`absolute pointer-events-none z-20 w-48 h-48 md:w-64 md:h-64 opacity-40 ${className} ${rotationMap[position]}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path 
          d="M0,0 Q20,100 0,200 M0,0 Q50,80 20,200 M0,0 Q80,50 40,200 M0,0 Q120,30 80,180" 
          stroke="#1a0000" 
          strokeWidth="3" 
          fill="none" 
          className="animate-[stringSway_8s_ease-in-out_infinite]"
        />
        <path 
          d="M0,0 Q10,120 10,200 M0,0 Q40,60 60,200 M0,0 Q100,20 120,150" 
          stroke="#000" 
          strokeWidth="1.5" 
          fill="none" 
          className="animate-[stringSway_12s_ease-in-out_infinite_reverse]"
        />
        {/* Organic nodes on the strings */}
        <circle cx="20" cy="110" r="2" fill="#300" className="animate-pulse" />
        <circle cx="60" cy="80" r="3" fill="#200" className="animate-pulse" />
      </svg>
      <style>{`
        @keyframes stringSway {
          0%, 100% { transform: skewX(-2deg) scaleY(1); }
          50% { transform: skewX(2deg) scaleY(1.05); }
        }
      `}</style>
    </div>
  );
};

export default CornerStrings;
