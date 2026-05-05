import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Menu, X, Languages, HeartHandshake, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/about', label: t('about') },
    { path: '/gallery', label: t('gallery') },
    { path: '/contact', label: t('contact') },
    { path: '/donations', label: t('donations') },
  ];

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <nav className="max-w-7xl mx-auto rounded-[24px] border border-white/60 bg-white/85 backdrop-blur-xl shadow-warm-lg">
        <div className="px-4 md:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Animal Rescue logo" className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <h1 className="font-extrabold text-dark-800 text-sm md:text-base">{language === 'ar' ? 'جمعية إنقاذ الحيوانات' : 'Animal Association'}</h1>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={({isActive}) => `px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-primary-100 text-primary-700' : 'text-dark-600 hover:bg-secondary-100 hover:text-dark-800'}`}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)} 
                className="px-3 py-2.5 rounded-xl bg-white hover:bg-secondary-50 border border-white/80 shadow-sm text-sm flex items-center gap-2 transition-all font-bold text-dark-700"
              >
                <Languages size={18} className="text-primary-600" />
                <span className="uppercase">{language}</span>
                <ChevronDown size={16} className={`text-dark-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 glass-panel border border-white/80 rounded-2xl py-2 flex flex-col z-50 shadow-lg animate-fade-in origin-top-right">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'ar', label: 'العربية' },
                    { code: 'fr', label: 'Français' },
                  ].map((lang) => (
                    <button 
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangDropdownOpen(false); }} 
                      className={`px-4 py-2.5 text-left text-sm font-bold hover:bg-primary-50 transition-colors ${language === lang.code ? 'text-primary-600 bg-primary-50/50' : 'text-dark-600'}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Link to="/donations" className="glass-button bg-primary-500 text-white hover:bg-primary-600 border-primary-400 text-sm py-2.5 px-5 flex items-center gap-2 shadow-md">
              <HeartHandshake size={18}/> Support
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-dark-700 p-2 bg-white/60 rounded-xl border border-white/80">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-white/40 px-4 pb-4 pt-3 space-y-2 bg-white/40 rounded-b-[24px]">
            <div className="space-y-1 mb-4">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="block py-3 px-4 rounded-xl text-dark-700 font-bold hover:bg-white/60">
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="border-t border-white/40 pt-4">
              <p className="px-4 text-xs font-bold text-dark-400 uppercase tracking-wider mb-2">Language</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'ar', label: 'العربية' },
                  { code: 'fr', label: 'Français' },
                ].map((lang) => (
                  <button 
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setIsOpen(false); }} 
                    className={`py-2 px-3 rounded-xl text-sm font-bold text-center transition-colors ${language === lang.code ? 'bg-primary-100 text-primary-700 border border-primary-200' : 'bg-white/60 text-dark-600 border border-white/80 hover:bg-white'}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
