import React from "react";
import Hero from "../components/Hero";
import StatsSection from "../components/StatsSection";
import EventCards from "../components/EventCards";
import Coordinators from "../components/ui/Coordinators";
import GalleryPreview from "../components/GalleryPreview";
import RegisterSection from "../components/RegisterSection";
import { useSectionContent } from "../hooks/useSupabaseData";

const Home: React.FC = () => {
  const { getSectionByKey } = useSectionContent();
  const homeIntroContent = getSectionByKey('home-intro');
  
  return (
    <div className="animate-[pageFadeIn_1s_ease-out]">
      <Hero />
      <div className="bg-black relative z-10">
        <div className="py-24 px-4 text-center  from-black via-red-950/10 to-black relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,0,0,0.15)_0%,transparent_70%)] animate-pulse" />
          <p className="font-oswald text-red-600 uppercase tracking-[0.6em] mb-4 text-xs">
            {homeIntroContent?.label || 'The Cinematic Converge'}
          </p>
          <h2 className="font-cinzel text-4xl md:text-5xl max-w-4xl mx-auto leading-tight relative z-10">
            {(homeIntroContent?.title || 'Experience where reality dissolves into the silver screen.').split('reality').map((part, i) => 
              i === 0 ? part : (
                <React.Fragment key={i}>
                  <span className="text-red-600 font-black text-glow">reality</span>
                  {part.split('silver screen').map((p, j) =>
                    j === 0 ? p : (
                      <React.Fragment key={j}>
                        <span className="italic text-gray-400">silver screen</span>
                        {p}
                      </React.Fragment>
                    )
                  )}
                </React.Fragment>
              )
            )}
          </h2>
        </div>
        <StatsSection />
        <div className="relative bg-black">
          <EventCards />
        </div>
        <Coordinators />
        <GalleryPreview />
        <RegisterSection />
      </div>
    </div>
  );
};

export default Home;
