import React from "react";
import Coordinators from "../components/ui/Coordinators";
import RegisterSection from "../components/RegisterSection";

const Contact: React.FC = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-black animate-[pageFadeIn_1s_ease-out]">
      <Coordinators />
      <RegisterSection />
    </div>
  );
};

export default Contact;
