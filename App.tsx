import React, { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import Onboarding from "./components/Onboarding";
import LightningOverlay from "./components/ui/LightningOverlay";
import SoundManager from "./components/ui/SoundManager";
import FloatingRegisterButton from "./components/ui/FloatingRegisterButton";
import { useHeroContent, useFooterContent } from "./hooks/useSupabaseData";
import { useIsMobile } from "./hooks/useIsMobile";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Events = lazy(() => import("./pages/Events"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));

type Page = "home" | "about" | "events" | "gallery" | "contact";

const App: React.FC = () => {
  const isMobile = useIsMobile();
  // Skip loading state entirely on mobile for instant display
  const [isLoading, setIsLoading] = useState(!isMobile);
  const [hasEntered, setHasEntered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const { data: heroContent } = useHeroContent();
  const { data: footerContent } = useFooterContent();

  // Check if current route is admin page
  const isAdminPage = location.pathname === '/admin';

  useEffect(() => {
    // Skip loading animation on mobile for instant display
    if (isMobile) {
      setIsLoading(false);
      return;
    }
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [isMobile]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Skip onboarding for admin page
  useEffect(() => {
    if (isAdminPage) {
      setHasEntered(true);
    }
  }, [isAdminPage]);

  const handleEnterVoid = () => {
    // On mobile, skip all transition effects - go directly to content
    if (isMobile) {
      setHasEntered(true);
      return;
    }
    
    setIsTransitioning(true);
    const transitionDelay = 1500;
    const transitionEnd = 3500;
    
    setTimeout(() => {
      setHasEntered(true);
    }, transitionDelay);
    setTimeout(() => {
      setIsTransitioning(false);
    }, transitionEnd);
  };

  if (isLoading && !isAdminPage) {
    return (
      <div className="fixed inset-0 bg-black z-[300] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-cinzel text-5xl animate-[pulse_2s_infinite] tracking-[0.5em] text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            ZYNORA
          </h2>
          <div className="w-64 h-[2px] bg-red-900/30 mt-6 mx-auto overflow-hidden rounded-full">
            <div className="w-full h-full bg-red-600 animate-[loading_2s_infinite]" />
          </div>
          <p className="font-oswald text-gray-500 text-xs tracking-[0.5em] uppercase mt-8 animate-[fadeIn_1s_ease-out]">
            LOADING THE EXPERIENCE
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative selection:bg-red-600 selection:text-white min-h-screen overflow-hidden ${
        hasEntered ? (isAdminPage ? "bg-gray-50" : "bg-black") : "bg-[#f5f5f5]"
      }`}
    >
      {!hasEntered && !isAdminPage && (
        <div
          className={`${
            isTransitioning
              ? "animate-[singularityCollapse_2s_ease-in_forwards]"
              : ""
          }`}
        >
          <Onboarding onEnter={handleEnterVoid} />
        </div>
      )}

      {/* Desktop-only transition effects - completely skipped on mobile */}
      {isTransitioning && !isMobile && (
        <div className="fixed inset-0 z-[250] pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute w-[150vw] h-[150vw] animate-[accretionSpin_4s_linear_infinite]">
            <div className="absolute inset-0 rounded-full border-[100px] border-white/5 blur-3xl" />
            <div className="absolute inset-0 rounded-full border-[20px] border-red-600/20 blur-xl scale-95" />
            <div className="absolute inset-0 rounded-full border-[2px] border-white/40 blur-[2px] scale-90" />
          </div>
          <div className="absolute w-2 h-2 bg-white rounded-full animate-[singularityPulse_2s_ease-out_forwards]" />
          <div className="absolute w-20 h-20 border border-white/10 rounded-full animate-[lensingRipple_1.5s_linear_infinite]" />
          <div className="absolute w-40 h-40 border border-white/5 rounded-full animate-[lensingRipple_2s_linear_infinite]" />
          <div className="absolute w-0 h-0 bg-black rounded-full shadow-[0_0_100px_white] animate-[singularityExpand_3s_ease-in_forwards]" />
          <div className="absolute inset-0 bg-white opacity-0 animate-[finalBurst_3.5s_ease-out_forwards]" />
        </div>
      )}

      {hasEntered && (
        <div
          className={`relative ${
            isTransitioning && !isMobile
              ? "transition-all duration-[3000ms] animate-[emergeFromSingularity_3s_cubic-bezier(0.15,0.85,0.35,1)_forwards]"
              : "opacity-100 scale-100"
          }`}
        >
          {/* Background effects - hidden on admin page and simplified on mobile */}
          {!isAdminPage && (
            <>
              {/* Desktop only: Background gradient blobs */}
              {!isMobile && (
                <div className="fixed inset-0 pointer-events-none z-[-1]">
                  <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/10 rounded-full blur-[150px]" />
                  <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/5 rounded-full blur-[150px]" />
                </div>
              )}

              {/* Grain texture - desktop only */}
              {!isMobile && <div className="grain" />}
              {/* Lightning overlay - desktop only */}
              {!isMobile && <LightningOverlay />}
              <Navbar />
            </>
          )}

          <main className={`overflow-hidden ${!isAdminPage ? 'bg-black' : 'bg-gray-50'}`}>
            <Suspense fallback={
              <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
                  <p className="font-oswald text-gray-500 text-xs tracking-[0.5em] uppercase">
                    LOADING THE EXPERIENCE
                  </p>
                </div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/events" element={<Events />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Suspense>
          </main>

          {/* Footer - hidden on admin page */}
          {!isAdminPage && (
            <footer className="py-16 px-6 border-t border-white/5 text-center text-gray-600 text-[10px] uppercase tracking-[0.5em] font-oswald bg-black relative z-10">
              <p className="mb-8">
                &copy; {new Date().getFullYear()} {footerContent?.copyrightText || 'ZYNORA CINEMATIC FEST. ALL RIGHTS RESERVED.'}
              </p>
              <div className="flex justify-center gap-10">
                <a
                  href="https://www.instagram.com/zynora_26/"
                  className="hover:text-red-600 transition-all transform hover:scale-110"
                >
                  Instagram
                </a>
              </div>
              <div className="mt-12 opacity-30 flex items-center justify-center gap-4">
                <div className="h-[1px] w-20 bg-white" />
                <span className="font-cinzel text-white text-xl">{heroContent?.title?.charAt(0) || 'Z'}</span>
                <div className="h-[1px] w-20 bg-white" />
              </div>
            </footer>
          )}
        </div>
      )}

      {/* Sound Manager and Register Button - hidden on admin page */}
      {!isAdminPage && (
        <>
          <SoundManager hasEntered={hasEntered} />
          <FloatingRegisterButton />
        </>
      )} 

      <style>{`
        @keyframes accretionSpin {
          from { transform: rotate(0deg) scale(0.5); opacity: 0; }
          20% { opacity: 1; }
          to { transform: rotate(1080deg) scale(1.5); opacity: 0; }
        }
        @keyframes singularityCollapse {
          0% { transform: scale(1) rotate(0deg); filter: blur(0); }
          100% { transform: scale(0) rotate(-180deg); filter: blur(50px); opacity: 0; }
        }
        @keyframes singularityExpand {
          0% { width: 0; height: 0; opacity: 1; }
          50% { width: 100px; height: 100px; opacity: 1; }
          100% { width: 300vmax; height: 300vmax; opacity: 1; }
        }
        @keyframes singularityPulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(500); opacity: 0; }
        }
        @keyframes lensingRipple {
          from { transform: scale(0.5); opacity: 1; border-width: 1px; }
          to { transform: scale(4); opacity: 0; border-width: 0px; }
        }
        @keyframes finalBurst {
          0%, 60% { opacity: 0; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes emergeFromSingularity {
          0% { transform: scale(1.5) rotate(10deg); filter: brightness(20) blur(100px); opacity: 0; }
          50% { transform: scale(0.95) rotate(-2deg); filter: brightness(2) blur(10px); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); filter: brightness(1) blur(0); opacity: 1; }
        }
        @keyframes pageFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .text-glow { text-shadow: 0 0 10px rgba(220,38,38,0.5); }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
};

export default App;
