import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Menu, X, Languages } from 'lucide-react';

const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/about', label: t('about') },
    { path: '/gallery', label: t('gallery') },
    { path: '/videos', label: t('videos') },
    { path: '/contact', label: t('contact') },
    { path: '/donations', label: t('donations') },
  ];

  return (
    <nav className="bg-white shadow-warm-lg sticky top-0 z-50 border-b-2 border-primary-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/Logo.jpeg" alt="Animal Rescue logo" className="w-10 h-10 object-cover rounded-full shadow-warm" />
            <div className={language === 'ar' ? 'text-right mr-2' : ''}>
              <h1 className="font-bold text-lg text-primary-600">
                {language === 'ar' ? 'جمعية إنقاذ الحيوانات' : 'Animal Rescue'}
              </h1>
              <p className="text-xs text-terracotta font-medium leading-tight">
                {t('heroSubtitle')}
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-dark-600 hover:text-primary-600 font-medium text-sm transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-1.5 bg-secondary-100 hover:bg-secondary-200 rounded-lg transition-all duration-300 border border-primary-200 text-sm"
            >
              <Languages size={16} className="text-primary-600" />
              <span className="font-medium text-dark-700">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>

            <Link
              to="/admin/login"
              className="btn-primary text-sm px-3 py-1.5"
            >
              {t('admin')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-3 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-gray-700 hover:text-primary font-medium text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            <button
              onClick={() => {
                toggleLanguage();
                setIsOpen(false);
              }}
              className="w-full mt-2 px-3 py-2 bg-secondary hover:bg-secondary-dark rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm"
            >
              <Languages size={16} />
              <span className="font-medium">{language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="block mt-2 text-center btn-primary text-sm py-2"
            >
              {t('admin')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
