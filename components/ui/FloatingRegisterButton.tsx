import React from "react";

import { useNavigate } from "react-router-dom";
import { getButtonLabel } from "../../constants";

const FloatingRegisterButton: React.FC = () => {
    const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/events")}
      className="fixed bottom-4 right-4 z-[110] px-3 md:px-8 py-2 md:py-4 rounded-full bg-red-700 text-white font-oswald text-[10px] md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase hover:bg-white hover:text-black hover:scale-110 active:scale-95 transition-all duration-500 shadow-[0_10px_40px_rgba(185,28,28,0.5)] animate-[pulse_3s_infinite] border border-red-500/50 backdrop-blur-sm group"
    >
      <span className="relative z-10 flex items-center gap-2">
        {getButtonLabel('register-now-short')}
        <span className="hidden md:inline group-hover:translate-x-1 transition-transform">
          →
        </span>
      </span>
      <div className="absolute inset-0 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-500 -z-10" />
    </button>
  );
};

export default FloatingRegisterButton;
