import React, { useEffect, useRef, useState } from "react";
import { EventCard } from "../types";
import CornerStrings from "../components/ui/CornerStrings";
import { useEvents, useSectionContent, useButtonLabels } from "../hooks/useSupabaseData";
import { EventDetailsModal } from "./modals/EventDetailsModal";

const Card: React.FC<{ event: EventCard; index: number; secureEntryText: string; onSecureClick: () => void }> = ({
  event,
  index,
  secureEntryText,
  onSecureClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`
        relative group overflow-hidden rounded-2xl bg-black border border-red-900/20
        transition-all duration-[600ms] cubic-bezier(0.23, 1, 0.32, 1)
        hover:scale-[1.03] hover:z-20 hover:border-red-600/50 hover:shadow-[0_0_40px_rgba(220,38,38,0.3)]
        ${
          isVisible
            ? "animate-[fadeInUp_0.8s_ease-out_forwards]"
            : "opacity-0 translate-y-12"
        }
      `}
      style={{ animationDelay: `${index * 100}ms` }}
      data-testid={`event-card-${event.id}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-all duration-[800ms] grayscale group-hover:grayscale-0 contrast-125 brightness-75 group-hover:brightness-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

        <div className="absolute top-4 left-4 z-10">
          <span className="bg-red-600 text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-sm shadow-xl">
            {event.vibe}
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <span className="bg-black/80 text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-sm border border-red-600/50">
            Day {event.day}
          </span>
        </div>
      </div>

      <div className="p-8 relative text-center md:text-left">
        <h3 className="font-cinzel text-xl md:text-2xl font-black text-white mb-4 group-hover:text-red-500 transition-colors duration-500 leading-tight">
          {event.title}
        </h3>
        <p className="text-gray-400 text-sm mb-8 line-clamp-2 font-light tracking-wide group-hover:text-gray-200 transition-colors duration-500">
          {event.description}
        </p>

        <button 
          onClick={onSecureClick}
          className="relative w-full py-4 group/btn overflow-hidden rounded-md bg-black border border-red-900/40 transition-all duration-500 hover:border-red-600"
          data-testid={`secure-spot-btn-${event.id}`}
        >
          <span className="relative z-10 font-oswald text-[10px] uppercase tracking-[0.5em] text-red-500 group-hover/btn:text-white transition-colors duration-300">
            {secureEntryText}
          </span>
          <div className="absolute inset-0 bg-red-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
        </button>
      </div>
    </div>
  );
};

const EventCards: React.FC = () => {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const [selectedEvent, setSelectedEvent] = useState<EventCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getSectionByKey } = useSectionContent();
  const { getButtonByKey } = useButtonLabels();
  const sectionContent = getSectionByKey('events');
  const { data: EVENTS, loading, error } = useEvents();

  const handleSecureSpot = (event: EventCard) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Loading state
  if (loading) {
    return (
      <section
        id="events"
        className="py-20 px-4 max-w-7xl mx-auto relative overflow-visible bg-black min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-red-600 font-oswald tracking-widest uppercase text-sm">Loading Events...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section
        id="events"
        className="py-20 px-4 max-w-7xl mx-auto relative overflow-visible bg-black min-h-screen flex items-center justify-center"
      >
        <div className="text-center max-w-md">
          <p className="text-red-600 font-oswald tracking-widest uppercase text-sm mb-4">Failed to load events</p>
          <p className="text-gray-400 text-xs">{error}</p>
        </div>
      </section>
    );
  }

  const secureEntryText = getButtonByKey('secure-entry') || 'Secure Entry';
  const phase01Text = getButtonByKey('phase-01') || 'Phase 01';
  const phase02Text = getButtonByKey('phase-02') || 'Phase 02';

  return (
    <>
      <section
        id="events"
        className="py-2 px-4 max-w-7xl mx-auto relative overflow-visible bg-black"
      >
        <CornerStrings position="bottom-left" className="bottom-0 left-0" />

        <div className="mb-24 text-center relative z-10">
          <span className="font-oswald text-red-600 tracking-[0.6em] text-[10px] uppercase mb-4 block animate-pulse">
            {sectionContent?.label}
          </span>
          <h2 className="font-cinzel text-4xl md:text-6xl font-black mb-12 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {sectionContent?.title}
          </h2>

          <div className="flex justify-center items-center gap-4 md:gap-8 mb-16">
            <button
              onClick={() => setActiveDay(1)}
              className={`
                relative px-10 md:px-14 py-4 font-oswald text-sm md:text-base uppercase tracking-[0.5em] transition-all duration-500 overflow-hidden rounded-sm border
                ${
                  activeDay === 1
                    ? "bg-red-600 border-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] scale-105"
                    : "bg-transparent border-red-900/20 text-red-900 hover:border-red-600/50 hover:text-red-600"
                }
              `}
              data-testid="day-1-btn"
            >
              {phase01Text}
            </button>
            <button
              onClick={() => setActiveDay(2)}
              className={`
                relative px-10 md:px-14 py-4 font-oswald text-sm md:text-base uppercase tracking-[0.5em] transition-all duration-500 overflow-hidden rounded-sm border
                ${
                  activeDay === 2
                    ? "bg-red-600 border-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] scale-105"
                    : "bg-transparent border-red-900/20 text-red-900 hover:border-red-600/50 hover:text-red-600"
                }
              `}
              data-testid="day-2-btn"
            >
              {phase02Text}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 justify-items-center">
          {EVENTS.filter((e) => e.day === activeDay).map((event, index) => (
            <Card 
              key={event.id} 
              event={event} 
              index={index} 
              secureEntryText={secureEntryText}
              onSecureClick={() => handleSecureSpot(event)}
            />
          ))}
        </div>

        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
        />
      )}
    </>
  );
};

export default EventCards;
