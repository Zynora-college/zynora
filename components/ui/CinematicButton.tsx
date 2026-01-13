
import React from 'react';

interface Props {
  text: string;
  onClick?: () => void;
  className?: string;
}

const CinematicButton: React.FC<Props> = ({ text, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative group px-10 py-4 bg-red-700/20 border-2 border-red-600 
        text-white font-oswald uppercase tracking-widest text-xl 
        overflow-hidden transition-all duration-500 hover:bg-red-600 hover:scale-105
        active:scale-95 shadow-[0_0_20px_rgba(185,28,28,0.4)]
        animate-[pulse_3s_ease-in-out_infinite] ${className}
      `}
    >
      <div className="absolute inset-0 bg-red-600/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      <span className="relative z-10 flex items-center justify-center gap-3">
        {text}
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </span>
      {/* Glitch Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
        <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay animate-pulse" />
      </div>
    </button>
  );
};

export default CinematicButton;
