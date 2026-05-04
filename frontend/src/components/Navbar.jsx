import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Menu, X, Languages, HeartHandshake } from 'lucide-react';

const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/about', label: t('about') },
    { path: '/gallery', label: t('gallery') },
    { path: '/contact', label: t('contact') },
    { path: '/donations', label: t('donations') },
  ];

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <nav className="max-w-7xl mx-auto rounded-2xl border border-white/60 bg-white/85 backdrop-blur-xl shadow-warm-lg">
        <div className="px-4 md:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Animal Rescue logo" className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <h1 className="font-bold text-primary-700 text-sm md:text-base">{language === 'ar' ? 'جمعية إنقاذ الحيوانات' : 'Animal Association'}</h1>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={({isActive}) => `px-3 py-2 rounded-xl text-sm font-medium transition ${isActive ? 'bg-primary-100 text-primary-700' : 'text-dark-600 hover:bg-secondary-100'}`}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button onClick={toggleLanguage} className="px-3 py-2 rounded-xl bg-secondary-100 hover:bg-secondary-200 text-sm flex items-center gap-1">
              <Languages size={16} className="text-primary-600" />
              <span>{language === 'en' ? 'AR' : language === 'ar' ? 'FR' : 'EN'}</span>
            </button>
            <Link to="/donations" className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-2"><HeartHandshake size={16}/> Support</Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-dark-700">{isOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-primary-100 px-4 pb-4 pt-2 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="block py-2 px-2 rounded-lg text-dark-700 hover:bg-secondary-100">{link.label}</Link>
            ))}
            <button onClick={() => { toggleLanguage(); setIsOpen(false); }} className="w-full py-2 rounded-lg bg-secondary-100">{language === 'en' ? 'العربية' : language === 'ar' ? 'Français' : 'English'}</button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
