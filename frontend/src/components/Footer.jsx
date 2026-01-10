import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSocial } from '../contexts/SocialContext';
import { useContact } from '../contexts/ContactContext';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Youtube, Music, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useLanguage();
  const { getLink } = useSocial();
  const { contact } = useContact();

  const socials = [
    { platform: 'facebook', Icon: Facebook, url: getLink('facebook') },
    { platform: 'instagram', Icon: Instagram, url: getLink('instagram') },
    { platform: 'twitter', Icon: Twitter, url: getLink('twitter') },
    { platform: 'youtube', Icon: Youtube, url: getLink('youtube') },
    { platform: 'tiktok', Icon: Music, url: getLink('tiktok') },
  ].filter((item) => !!item.url);

  const contactItems = [
    { key: 'phone', label: t('phone'), Icon: Phone, value: contact?.phone },
    { key: 'email', label: t('email'), Icon: Mail, value: contact?.email },
    { key: 'whatsapp', label: t('whatsapp'), Icon: MessageCircle, value: contact?.whatsapp },
    { key: 'address', label: t('address'), Icon: MapPin, value: contact?.address },
  ].filter((item) => !!item.value);

  const hasContactInfo = contactItems.length > 0;

  return (
    <footer className="bg-gradient-to-br from-dark-800 to-dark-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-primary-400">{t('aboutTitle')}</h3>
            <p className="text-dark-200 mb-4">
              {t('heroSubtitle')}
            </p>
            {socials.length > 0 && (
              <div className="flex space-x-6">
                {socials.map(({ platform, Icon, url }) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-dark-300 hover:text-primary-400 transition-colors transform hover:scale-110 duration-300"
                  >
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-primary-400">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-dark-200 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-dark-200 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-dark-200 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">
                  {t('gallery')}
                </Link>
              </li>
              <li>
                <Link to="/videos" className="text-dark-200 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">
                  {t('videos')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-dark-200 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          {hasContactInfo && (
          <div>
            <h3 className="text-2xl font-bold mb-4 text-primary-400">{t('contact')}</h3>
            <ul className="space-y-3">
              {contactItems.map(({ key, Icon, value }) => (
                <li key={key} className="flex items-center space-x-3">
                  <Icon size={20} className="text-primary-400" />
                  <span className="text-dark-200">{value}</span>
                </li>
              ))}
            </ul>
          </div>
          )}
        </div>

        <div className="border-t border-dark-600 mt-8 pt-8 text-center">
          <p className="text-dark-300">
            © 2025 {t('heroTitle')}. {t('allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
