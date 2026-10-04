import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { useLenis } from './hooks/useLenis';
import Loader from './components/layout/Loader';
import Navbar from './components/layout/Navbar';
import CustomCursor from './components/layout/CustomCursor';
import ScrollProgress from './components/ui/ScrollProgress';
import GrainOverlay from './components/ui/GrainOverlay';
import ScrollColorTransition from './components/ui/ScrollColorTransition';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Experience from './components/sections/Experience';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';

function App() {
  const [loading, setLoading] = useState(true);
  useLenis();

  return (
    <AppProvider>
      <GrainOverlay />
      <ScrollColorTransition />

      <AnimatePresence mode="wait">
        {loading && <Loader key="loader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <ScrollProgress />
          <CustomCursor />
          <Navbar />
          <main>
            <Hero />
            <About />
            <Projects />
            <Skills />
            <Experience />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </AppProvider>
  );
}

export default App;
