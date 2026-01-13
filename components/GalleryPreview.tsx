import React from "react";
import { useNavigate } from "react-router-dom";
import { useGalleryImages, useSectionContent, useButtonLabels } from "../hooks/useSupabaseData";
import type { GalleryImage } from "../types";

const GalleryPreview: React.FC = () => {
  const navigate = useNavigate();
  const { getSectionByKey } = useSectionContent();
  const { getButtonByKey } = useButtonLabels();
  const sectionContent = getSectionByKey('gallery-preview');
  const { data: galleryImages, loading, error } = useGalleryImages();
  
  // Extract image URLs and show only the first 8 images in the preview
  const previewImages = galleryImages.slice(0, 8).map((img: GalleryImage) => img.image_url);

  // Loading state
  if (loading) {
    return (
      <section className="py-24 px-4 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-red-600 font-oswald tracking-widest uppercase text-xs">Loading Preview...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error or no images state
  if (error || !galleryImages || galleryImages.length === 0) {
    return null; // Don't show the section if there's an error or no images
  }

  return (
    <section className="py-24 px-4 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="font-oswald text-red-600 tracking-[0.5em] text-xs uppercase mb-2 block">
            {sectionContent?.label}
          </span>
          <h2 className="font-cinzel text-4xl md:text-5xl font-black mb-6">
            {sectionContent?.title}
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 animate-[fadeInUp_1s_ease-out]">
          {previewImages.map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-900 border border-white/5"
            >
              <img
                src={img}
                alt={`Preview ${idx}`}
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate("/gallery")}
            className="px-12 py-4 bg-transparent border-2 border-red-600 text-red-600 font-oswald uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 active:scale-95"
          >
            {getButtonByKey('view-full-gallery') || 'View Full Gallery'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
