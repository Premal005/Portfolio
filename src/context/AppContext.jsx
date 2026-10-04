import { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [cursorLabel, setCursorLabel] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

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

  // Alias for backward compatibility
  const setHoverState = setCursorVariant;

  return (
    <AppContext.Provider value={{
      cursorVariant, setCursorVariant,
      cursorLabel, setCursorLabel,
      scrollProgress,
      setHoverState,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
