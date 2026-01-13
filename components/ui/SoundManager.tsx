import React, { useEffect, useRef, useState } from "react";

const SoundManager: React.FC<{ hasEntered: boolean }> = ({ hasEntered }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const droneNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!hasEntered || isMuted) {
      if (droneNodeRef.current && audioContextRef.current) {
        droneNodeRef.current.gain.setTargetAtTime(
          0,
          audioContextRef.current.currentTime,
          1
        );
      }
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // Create a dark cinematic drone
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.setTargetAtTime(0.12, ctx.currentTime, 3);
    gainNode.connect(ctx.destination);
    droneNodeRef.current = gainNode;

    const osc1 = ctx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(38, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(150, ctx.currentTime);
    filter.Q.setValueAtTime(8, ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.4, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(80, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    osc1.connect(filter);
    filter.connect(gainNode);

    osc1.start();
    lfo.start();

    return () => {
      osc1.stop();
      lfo.stop();
    };
  }, [hasEntered, isMuted]);

  return (
    <button
      onClick={() => setIsMuted(!isMuted)}
      className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-[110] p-2 md:p-4 rounded-full bg-black/60 border border-white/10 text-white/40 hover:text-red-500 hover:border-red-600/50 hover:scale-110 active:scale-95 transition-all duration-500 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.8)] group"
      title={isMuted ? "Unmute Cinematic Experience" : "Mute Sound"}
    >
      <div className="absolute inset-0 rounded-full bg-red-600/5 scale-0 group-hover:scale-100 transition-transform duration-500 -z-10" />
      {isMuted ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
};

export default SoundManager;
