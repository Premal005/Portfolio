import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { sound } from '../utils/sound';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [cursorLabel, setCursorLabel] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled((prev) => {
      const next = !prev;
      sound.setMuted(!next);
      if (next) sound.playClick();
      return next;
    });
  }, []);

  const setHoverState = (variant) => {
    setCursorVariant(variant);
    if (variant === 'hover') {
      sound.playHover();
    }
  };

  return (
    <AppContext.Provider
      value={{
        cursorVariant,
        setCursorVariant,
        cursorLabel,
        setCursorLabel,
        scrollProgress,
        setHoverState,
        isAudioEnabled,
        toggleAudio,
        sound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
