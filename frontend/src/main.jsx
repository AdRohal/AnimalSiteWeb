import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { SocialProvider } from './contexts/SocialContext';
import { ContactProvider } from './contexts/ContactContext';
import { BankingProvider } from './contexts/BankingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Videos from './pages/Videos';
import Contact from './pages/Contact';
import Donations from './pages/Donations';
import NotFound from './pages/NotFound';
import './index.css';

function App() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = '/favicon.ico';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <LanguageProvider>
      <SocialProvider>
        <ContactProvider>
          <BankingProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ScrollToTop />
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/donations" element={<Donations />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </Router>
          </BankingProvider>
        </ContactProvider>
      </SocialProvider>
    </LanguageProvider>
  );
}

const rootEl = document.getElementById('root');
if (!rootEl._root) rootEl._root = ReactDOM.createRoot(rootEl);
rootEl._root.render(<React.StrictMode><App /></React.StrictMode>);
