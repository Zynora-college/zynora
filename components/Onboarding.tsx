
import React from 'react';
import { useOnboardingContent } from '../hooks/useSupabaseData';
import { useIsMobile } from '../hooks/useIsMobile';

interface Props {
  onEnter: () => void;
}

const Onboarding: React.FC<Props> = ({ onEnter }) => {
  const { data: onboardingContent, loading } = useOnboardingContent();
  const isMobile = useIsMobile();

  // Use fallback content immediately to prevent blocking on mobile
  const content = onboardingContent || {
    title: 'ZYNORA',
    subtitle: 'Enter the Legends',
    buttonText: 'ENTER THE VOID'
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#f5f5f5] flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Light Grain Overlay - Desktop only */}
      {!isMobile && <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />}
      
      {/* Desktop only: Particle animations */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute bg-gray-400 rounded-full blur-[1px] animate-[float_10s_linear_infinite]"
              style={{
                width: Math.random() * 2 + 'px',
                height: Math.random() * 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: `-${Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-4xl px-6 flex flex-col items-center animate-[fadeIn_1.5s_ease-out]">
        <h1 className="font-cinzel text-7xl md:text-9xl font-black tracking-[-0.05em] text-gray-900 mb-4">
          {content.title}
        </h1>
        
        <p className="font-oswald text-gray-500 text-xs md:text-sm tracking-[0.8em] uppercase mb-12">
          {content.subtitle}
        </p>

        <button 
          onClick={onEnter}
          className="group relative px-16 py-5 bg-white border border-gray-300 text-gray-900 font-oswald text-sm tracking-[0.5em] uppercase transition-all duration-500 hover:border-red-600 hover:text-red-600 hover:shadow-[0_0_40px_rgba(0,0,0,0.05)] active:scale-95"
          data-testid="onboarding-enter-button"
        >
          <span className="relative z-10">{content.buttonText}</span>
          <div className="absolute inset-0 bg-gray-50 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </button>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0); }
          100% { transform: translate(20px, -20px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
