import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const activePage = location.pathname.slice(1) || "home";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Events", id: "events" },
    { label: "Gallery", id: "gallery" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <nav className="fixed top-6 left-0 w-full z-[60] flex justify-center pointer-events-none">
      <div
        className={`
        flex items-center gap-4 md:gap-8 px-6 md:px-10 py-3 rounded-full border border-white/10
        transition-all duration-500 pointer-events-auto
        ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
            : "bg-black/40 backdrop-blur-sm"
        }
      `}
      >
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={`/${item.id}`}
            className={`
              font-inter text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all duration-300 relative group
              ${
                activePage === item.id
                  ? "text-red-500 font-bold"
                  : "text-white/60 hover:text-white hover:rotate-180"
              }
            `}
          >
            {item.label}
            <span
              className={`
              absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-600 transition-transform duration-300
              ${
                activePage === item.id
                  ? "scale-100"
                  : "scale-0 group-hover:scale-100"
              }
            `}
            />
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
