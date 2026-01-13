import React from "react";
import GalleryPreview from "../components/GalleryPreview";
import Coordinators from "../components/ui/Coordinators";
import { useAboutContent } from "../hooks/useSupabaseData";

const About: React.FC = () => {
  const { data: aboutContent, loading, error } = useAboutContent();

  // Loading state
  if (loading) {
    return (
      <div className="pt-40 pb-20 min-h-screen bg-black animate-[pageFadeIn_1s_ease-out] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-red-600 font-oswald tracking-widest uppercase text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !aboutContent) {
    return (
      <div className="pt-40 pb-20 min-h-screen bg-black animate-[pageFadeIn_1s_ease-out] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-oswald tracking-widest uppercase text-sm">Failed to load content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-20 min-h-screen bg-black animate-[pageFadeIn_1s_ease-out]">
      <div className="max-w-6xl mx-auto px-6 mb-32">
        <div className="flex flex-col items-center text-center">
          <div className="mb-12 relative animate-[logoIn_1.5s_ease-out]">
            <img
              src="/assets/logo.png"
              alt="Zynora Logo"
              className="w-64 md:w-96 drop-shadow-[0_0_30px_rgba(220,38,38,0.4)]"
            />
          </div>
          <div className="w-32 h-1 bg-red-600 mb-12" />
          <p className="font-inter text-xl md:text-3xl text-gray-200 leading-relaxed font-light max-w-4xl">
            {aboutContent.paragraphs[0]?.split('cultural fest').map((part, i) => 
              i === 0 ? part : (
                <React.Fragment key={i}>
                  <span className="text-red-600 font-medium">cultural fest</span>
                  {part}
                </React.Fragment>
              )
            )}
          </p>
          {aboutContent.paragraphs[1] && (
            <p className="font-inter text-lg md:text-xl text-gray-400 leading-relaxed font-light max-w-4xl mt-10">
              {aboutContent.paragraphs[1]}
            </p>
          )}
        </div>
      </div>
      <GalleryPreview />
      <Coordinators />
    </div>
  );
};

export default About;
