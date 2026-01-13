import React from "react";
import EventCards from "../components/EventCards";
import GalleryPreview from "../components/GalleryPreview";
import Coordinators from "../components/ui/Coordinators";

const Events: React.FC = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-black animate-[pageFadeIn_1s_ease-out]">
      <EventCards />
      <GalleryPreview />
      <Coordinators />
    </div>
  );
};

export default Events;
