import React, { useState, useEffect, useRef } from 'react';
import { useMousePosition } from '../../hooks/useMousePosition';
import { useAppContext } from '../../context/AppContext';

const TechnicalHUD = () => {
  const { x, y } = useMousePosition();
  const { isAudioEnabled, toggleAudio, scrollProgress } = useAppContext();

  const [timeString, setTimeString] = useState('');
  const [fps, setFps] = useState(60);

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  // Clock updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Real-time FPS monitor
  useEffect(() => {
    let animId;
    const calcFps = (now) => {
      frameCount.current++;
      if (now >= lastTime.current + 1000) {
        setFps(Math.round((frameCount.current * 1000) / (now - lastTime.current)));
        frameCount.current = 0;
        lastTime.current = now;
      }
      animId = requestAnimationFrame(calcFps);
    };
    animId = requestAnimationFrame(calcFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 select-none hidden sm:block">
      {/* 1. Hairline Technical Outer Frame */}
      <div className="absolute inset-4 md:inset-8 border border-white/[0.04] pointer-events-none" />

      {/* 2. Precision Corner Crosshairs */}
      {/* Top Left */}
      <div className="absolute top-4 md:top-8 left-4 md:left-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white/30 text-xs font-mono">
        <span className="text-accent text-sm font-bold">+</span>
        <span className="hidden lg:inline-block ml-2 text-[9px] tracking-[0.25em] text-white/25">
          SYS.FRAME // 01
        </span>
      </div>

      {/* Top Right */}
      <div className="absolute top-4 md:top-8 right-4 md:right-8 translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white/30 text-xs font-mono">
        <span className="hidden lg:inline-block mr-2 text-[9px] tracking-[0.25em] text-white/25">
          SCALE // 1:1
        </span>
        <span className="text-accent text-sm font-bold">+</span>
      </div>

      {/* Bottom Left */}
      <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 -translate-x-1/2 translate-y-1/2 flex items-center justify-center text-white/30 text-xs font-mono">
        <span className="text-accent text-sm font-bold">+</span>
        <span className="hidden lg:inline-block ml-2 text-[9px] tracking-[0.25em] text-white/25">
          ELEV. 000M
        </span>
      </div>

      {/* Bottom Right */}
      <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 translate-x-1/2 translate-y-1/2 flex items-center justify-center text-white/30 text-xs font-mono">
        <span className="hidden lg:inline-block mr-2 text-[9px] tracking-[0.25em] text-white/25">
          STATUS // STABLE
        </span>
        <span className="text-accent text-sm font-bold">+</span>
      </div>

      {/* 3. Bottom Telemetry Status Strip */}
      <div className="absolute bottom-5 md:bottom-9 inset-x-8 md:inset-x-14 flex items-center justify-between text-[10px] font-mono tracking-widest text-white/35">
        {/* Left: System Status & Coordinates */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-white/60 font-semibold tracking-wider">ONLINE</span>
          </div>

          <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-6 text-white/30">
            <span>X: {String(Math.round(x)).padStart(4, '0')}</span>
            <span>Y: {String(Math.round(y)).padStart(4, '0')}</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-6 text-white/30">
            <span>PERF:</span>
            <span className={fps < 45 ? 'text-amber-400' : 'text-emerald-400'}>
              {fps} FPS
            </span>
          </div>
        </div>

        {/* Right: Audio Synthesizer Toggle & Real-time Clock */}
        <div className="flex items-center gap-6 pointer-events-auto">
          {/* Audio Synthesizer Button */}
          <button
            onClick={toggleAudio}
            className="group flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-accent hover:bg-accent/10 transition-all duration-300"
            title="Toggle Web Audio UI Synthesizer"
          >
            {/* Mini Equalizer Bars */}
            <div className="flex items-end gap-[2px] h-3 w-3.5">
              <span
                className={`w-[2px] bg-accent rounded-full transition-all duration-300 ${
                  isAudioEnabled ? 'h-full animate-pulse' : 'h-1 opacity-40'
                }`}
              />
              <span
                className={`w-[2px] bg-accent rounded-full transition-all duration-300 ${
                  isAudioEnabled ? 'h-2/3 animate-bounce' : 'h-1.5 opacity-40'
                }`}
              />
              <span
                className={`w-[2px] bg-accent rounded-full transition-all duration-300 ${
                  isAudioEnabled ? 'h-full animate-pulse' : 'h-1 opacity-40'
                }`}
              />
            </div>
            <span className="text-[9px] font-semibold text-white/70 group-hover:text-white transition-colors">
              AUDIO: {isAudioEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Time & Scroll Meter */}
          <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-6 text-white/40">
            <span className="text-white/60">{timeString || '00:00:00'}</span>
            <span className="text-[9px] text-white/20">UTC+5:30</span>
          </div>

          <div className="hidden xl:flex items-center gap-2 text-accent/80 border-l border-white/10 pl-6">
            <span>DEPTH: {Math.round(scrollProgress * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalHUD;
