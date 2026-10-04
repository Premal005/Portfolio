import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const DEFAULT_HISTORY = [
  { type: 'system', text: 'PREMAL_OS v3.4.1 (arm64-creative-kernel)' },
  { type: 'system', text: "Type 'help' to inspect available system commands." },
];

const InteractiveTerminal = () => {
  const [history, setHistory] = useState(DEFAULT_HISTORY);
  const [inputVal, setInputVal] = useState('');
  const [isMatrixMode, setIsMatrixMode] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { sound, setCursorVariant } = useAppContext();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    const newItems = [{ type: 'input', text: `$ ${cmd}` }];

    switch (trimmed) {
      case 'help':
        newItems.push({
          type: 'output',
          text: `AVAILABLE COMMANDS:
  • bio       - Executive summary & developer philosophy
  • stack     - Production technologies & tools
  • contact   - Direct transmission coordinates
  • repo      - GitHub repository coordinates
  • matrix    - Toggle cyber matrix stream
  • clear     - Purge terminal console memory`,
        });
        break;

      case 'bio':
        newItems.push({
          type: 'output',
          text: `PREMAL GOYAL // SENIOR FULL STACK & 3D CREATIVE DEVELOPER
• Focus: High-performance 3D WebGL, bespoke GLSL shaders, reactive micro-frontends, and distributed backend systems.
• Mission: Eliminating the boundary between cinematic motion graphics and ultra-responsive software.`,
        });
        break;

      case 'stack':
        newItems.push({
          type: 'output',
          text: `CORE PRODUCTION ARCHITECTURE:
  [3D / GRAPHICS]  Three.js, React Three Fiber, GLSL Shaders, Postprocessing
  [FRONTEND CORE]  React 18, Next.js, GSAP ScrollTrigger, Framer Motion, Tailwind
  [DATA & API]     Node.js, Express, MongoDB, PostgreSQL, Python, REST/GraphQL
  [DEV & OPS]      Vite, Docker, Git, CI/CD Pipelines, Figma Architecture`,
        });
        break;

      case 'contact':
        newItems.push({
          type: 'output',
          text: `COORDINATES FOR TRANSMISSION:
  Email:    premal.goyal@gmail.com
  GitHub:   https://github.com/Premal005
  Status:   Open for High-Impact Roles & Advisory`,
        });
        break;

      case 'repo':
        newItems.push({
          type: 'output',
          text: 'REPOSITORY: https://github.com/Premal005/Portfolio',
        });
        break;

      case 'matrix':
        setIsMatrixMode((prev) => !prev);
        newItems.push({
          type: 'output',
          text: isMatrixMode ? '[MATRIX STREAM TERMINATED]' : '[MATRIX CIPHER PROTOCOL INITIATED]',
        });
        break;

      case 'clear':
        setHistory([]);
        return;

      case '':
        break;

      default:
        newItems.push({
          type: 'error',
          text: `Command not found: '${trimmed}'. Type 'help' for directory of commands.`,
        });
        break;
    }

    setHistory((prev) => [...prev, ...newItems]);
  };

  const handleKeyDown = (e) => {
    sound.playKey();
    if (e.key === 'Enter') {
      handleCommand(inputVal);
      setInputVal('');
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      onMouseEnter={() => setCursorVariant('text')}
      onMouseLeave={() => setCursorVariant('default')}
      className={`w-full h-full min-h-[340px] max-h-[420px] rounded-2xl p-5 flex flex-col font-mono text-xs cursor-text transition-colors duration-500 border ${
        isMatrixMode
          ? 'bg-black/90 border-emerald-500/40 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
          : 'bg-white/[0.02] backdrop-blur-xl border-white/10 text-white/80'
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
        </div>
        <div className="text-[10px] tracking-widest text-white/40 uppercase">
          zsh // {isMatrixMode ? 'MATRIX_STREAM' : 'PREMAL@DEV'}
        </div>
        <div className="text-[9px] text-accent font-semibold tracking-wider">
          LIVE
        </div>
      </div>

      {/* Output Console */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
        {history.map((item, index) => (
          <div key={index} className="leading-relaxed">
            {item.type === 'input' && (
              <span className="text-accent font-bold">{item.text}</span>
            )}
            {item.type === 'system' && (
              <span className="text-white/40">{item.text}</span>
            )}
            {item.type === 'output' && (
              <pre className="whitespace-pre-wrap font-mono text-white/90">
                {item.text}
              </pre>
            )}
            {item.type === 'error' && (
              <span className="text-rose-400">{item.text}</span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Interactive Prompt Line */}
      <div className="flex items-center gap-2 pt-3 mt-2 border-t border-white/10">
        <span className="text-accent font-bold">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type 'help' or any command..."
          className="flex-1 bg-transparent text-white focus:outline-none placeholder-white/20 text-xs font-mono"
        />
        <span className="inline-block w-2 h-4 bg-accent animate-pulse" />
      </div>
    </div>
  );
};

export default InteractiveTerminal;
