import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useGalleryImages, useSectionContent } from "../hooks/useSupabaseData";
import type { GalleryImage } from "../types";
import { useIsMobile } from "../hooks/useIsMobile";

const GalleryFull: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { getSectionByKey } = useSectionContent();
  const sectionContent = getSectionByKey('gallery-full');
  const { data: galleryImages, loading, error } = useGalleryImages();
  const isMobile = useIsMobile();

  // Extract image URLs for display and filter featured images for carousel
  const GALLERY_IMAGES = galleryImages.map((img: GalleryImage) => img.image_url);
  const featuredImages = galleryImages.filter((img: GalleryImage) => img.is_featured);
  
  // Use featured images for carousel if available, otherwise use all images
  const carouselImages = featuredImages.length > 0 
    ? featuredImages.map((img: GalleryImage) => img.image_url)
    : GALLERY_IMAGES;
  
  // Duplicate for infinite scroll effect
  const highlightImages = [...carouselImages, ...carouselImages];

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev === 0 ? GALLERY_IMAGES.length - 1 : prev! - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev === GALLERY_IMAGES.length - 1 ? 0 : prev! + 1
    );
  };

  // Loading state
  if (loading) {
    return (
      <section className="bg-black pt-32 pb-20 relative min-h-screen overflow-x-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-red-600 font-oswald tracking-widest uppercase text-sm">Loading Gallery...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-black pt-32 pb-20 relative min-h-screen overflow-x-hidden flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 font-oswald tracking-widest uppercase text-sm mb-4">Failed to load gallery</p>
          <p className="text-gray-400 text-xs">{error}</p>
        </div>
      </section>
    );
  }

  // No images state
  if (!GALLERY_IMAGES || GALLERY_IMAGES.length === 0) {
    return (
      <section className="bg-black pt-32 pb-20 relative min-h-screen overflow-x-hidden flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 font-oswald tracking-widest uppercase text-sm">No images available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black pt-32 pb-20 relative min-h-screen overflow-x-hidden">
      <div className="mb-32">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <h2 className="font-cinzel text-3xl md:text-4xl font-black text-white tracking-widest">
            {sectionContent?.title}
          </h2>
          <div className="w-full h-[1px] bg-red-600/30 mt-4" />
        </div>

        {/* Desktop: Animated carousel with 3D flip cards */}
        {/* Mobile: Simple horizontal scroll gallery - no animations */}
        {isMobile ? (
          <div className="relative h-[350px] overflow-x-auto overflow-y-hidden px-4">
            <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
              {carouselImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-56 h-[320px] flex-shrink-0 rounded-xl overflow-hidden border border-red-900/30"
                  onClick={() => setSelectedIndex(idx % carouselImages.length)}
                >
                  <img
                    src={img}
                    alt="Gallery"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative h-[500px] overflow-hidden cursor-pointer perspective-[1500px]">
            <div className="flex gap-10 absolute animate-[carousel_60s_linear_infinite] hover:[animation-play-state:paused] py-12 px-4">
              {highlightImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-64 md:w-80 h-[400px] flex-shrink-0 group/card preserve-3d cursor-pointer"
                  onClick={() => setSelectedIndex(idx % carouselImages.length)}
                >
                  <div className="relative w-full h-full transition-transform duration-[800ms] preserve-3d group-hover/card:[transform:rotateY(180deg)]">
                    <div className="absolute inset-0 backface-hidden bg-[#0a0a0a] rounded-2xl flex flex-col items-center justify-center border border-red-900/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                      <div className="absolute top-4 left-4 border-l-2 border-t-2 border-red-600/40 w-8 h-8" />
                      <div className="absolute bottom-4 right-4 border-r-2 border-b-2 border-red-600/40 w-8 h-8" />
                      <div className="text-center z-10 p-6 border border-red-900/20 rounded-lg bg-black/40 backdrop-blur-sm">
                        <span className="font-cinzel text-6xl text-red-600 opacity-20 block mb-2">
                          Z
                        </span>
                        <p className="font-oswald text-[11px] text-red-700 uppercase tracking-[0.6em] font-bold">
                          Classified
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] rounded-2xl overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,1)]">
                      <img
                        src={img}
                        alt="Highlight"
                        loading="lazy"
                        className="w-full h-full object-cover grayscale group-hover/card:grayscale-0 transition-all duration-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-12 justify-center lg:justify-start">
          <div className="h-[2px] w-12 bg-red-600" />
          <h3 className="font-oswald text-2xl uppercase tracking-[0.4em] text-white">
            {sectionContent?.label}
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 justify-items-center opacity-100">
          {GALLERY_IMAGES.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className="group relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-900 border border-white/5 cursor-pointer opacity-100 transition-all duration-500 hover:border-red-600/50"
            >
              <img
                src={img}
                alt={`Gallery ${idx}`}
                loading="lazy"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 grayscale hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-red-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="p-4 rounded-full border border-white/40 scale-50 group-hover:scale-100 transition-transform duration-500">
                  <span className="text-white text-2xl">+</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedIndex !== null && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-2xl"
          onClick={() => setSelectedIndex(null)}
          data-testid="gallery-preview-modal"
        >
          <button
            className="absolute top-6 right-6 md:top-10 md:right-10 text-white text-4xl font-light hover:text-red-500 transition-all z-[110]"
            onClick={() => setSelectedIndex(null)}
            data-testid="gallery-modal-close"
          >
            ✕
          </button>

          <button
            className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 text-white/40 hover:text-red-600 text-4xl md:text-6xl font-light transition-all z-[110] p-2 md:p-4"
            onClick={handlePrev}
            data-testid="gallery-prev-btn"
          >
            ‹
          </button>

          <button
            className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 text-white/40 hover:text-red-600 text-4xl md:text-6xl font-light transition-all z-[110] p-2 md:p-4"
            onClick={handleNext}
            data-testid="gallery-next-btn"
          >
            ›
          </button>

          <div className="relative flex items-center justify-center w-full h-full p-4 md:p-8">
            <img
              src={GALLERY_IMAGES[selectedIndex]}
              alt="Fullscreen"
              loading="lazy"
              className="max-w-[90vw] max-h-[85vh] md:max-w-[85vw] md:max-h-[80vh] object-contain rounded-lg shadow-[0_0_100px_rgba(220,38,38,0.3)] animate-[scaleIn_0.3s_ease-out]"
              onClick={(e) => e.stopPropagation()}
              data-testid="gallery-modal-image"
            />
          </div>

          <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-white/30 font-oswald tracking-[0.5em] uppercase text-xs md:text-sm">
            FRAME {selectedIndex + 1} / {GALLERY_IMAGES.length}
          </div>
        </div>,
        document.body
      )}

      <style>{`
        .perspective-1500 { perspective: 1500px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        @keyframes carousel {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </section>
  );
};

export default GalleryFull;
