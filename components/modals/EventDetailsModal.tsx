import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink } from 'lucide-react';
import type { EventCard } from '../../types';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventCard;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onClose, event }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" 
      onClick={onClose}
      data-testid="event-details-modal"
    >
      <div 
        className="bg-black border border-red-900/50 rounded-2xl shadow-2xl max-w-2xl w-full my-auto max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="sticky top-0 bg-black/95 backdrop-blur-sm p-4 border-b border-red-900/30 z-10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 px-3 py-1 rounded text-xs font-black uppercase tracking-wider text-white">
              Day {event.day}
            </div>
            <div className="bg-red-900/30 px-3 py-1 rounded text-xs font-medium uppercase tracking-wide text-red-400">
              {event.vibe}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-red-500 transition-colors"
            data-testid="event-modal-close"
          >
            <X size={28} />
          </button>
        </div>

        {/* Event Image */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        </div>

        {/* Event Content */}
        <div className="p-8 space-y-6">
          {/* Title */}
          <h2 className="font-cinzel text-3xl md:text-4xl font-black text-white leading-tight" data-testid="event-modal-title">
            {event.title}
          </h2>

          {/* Description */}
          <p className="text-gray-300 text-base leading-relaxed" data-testid="event-modal-description">
            {event.description}
          </p>

          {/* Google Forms Link */}
          {event.google_forms ? (
            <div className="pt-4">
              <a
                href={event.google_forms}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-oswald text-sm uppercase tracking-[0.3em] rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-900/50"
                data-testid="event-register-link"
              >
                <span>Register Now</span>
                <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </a>
            </div>
          ) : (
            <div className="pt-4 bg-red-900/20 border border-red-900/30 rounded-lg p-4 text-center">
              <p className="text-red-400 text-sm font-medium">
                Registration link coming soon
              </p>
            </div>
          )}

          {/* Close Button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-oswald text-xs uppercase tracking-[0.3em] rounded-lg transition-colors duration-300 border border-gray-700"
              data-testid="event-modal-close-btn"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
