import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContact } from '../contexts/ContactContext';
import { useSocial } from '../contexts/SocialContext';
import { Mail, Phone, MapPin, MessageCircle, Facebook, Instagram, Twitter, Youtube, Music, ExternalLink } from 'lucide-react';

const Contact = () => {
  const { t, language } = useLanguage();
  const { contact, loading: contactLoading } = useContact();
  const { getLink } = useSocial();

  // Get social links
  const socials = [
    { platform: 'facebook', Icon: Facebook, label: 'Facebook', url: getLink('facebook') },
    { platform: 'instagram', Icon: Instagram, label: 'Instagram', url: getLink('instagram') },
    { platform: 'twitter', Icon: Twitter, label: 'Twitter', url: getLink('twitter') },
    { platform: 'youtube', Icon: Youtube, label: 'YouTube', url: getLink('youtube') },
    { platform: 'tiktok', Icon: Music, label: 'TikTok', url: getLink('tiktok') },
  ].filter((item) => !!item.url);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-secondary-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-dark-700 mb-4">{t('contactTitle')}</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-dark-500">{t('contactSubtitle')}</p>
        </div>

        {contactLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
            <p className="text-dark-600 mt-4">Loading contact information...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8 fade-in">
              <div className="bg-white rounded-2xl shadow-warm-lg p-8 border border-primary-100">
                <h2 className="text-3xl font-bold text-dark-700 mb-6">{t('contactTitle')}</h2>

                <div className="space-y-6">
                  {/* Email */}
                  {contact?.email && (
                    <div className="flex items-start space-x-4 p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-warm">
                        <Mail size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-dark-700 mb-1">{t('email')}</h3>
                        <a href={`mailto:${contact.email}`} className="text-primary-600 hover:text-primary-700 font-semibold">
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {contact?.phone && (
                    <div className="flex items-start space-x-4 p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-warm">
                        <Phone size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-dark-700 mb-1">{t('phone')}</h3>
                        <a href={`tel:${contact.phone}`} className="text-primary-600 hover:text-primary-700 font-semibold">
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* WhatsApp */}
                  {contact?.whatsapp && (
                    <div className="flex items-start space-x-4 p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-warm">
                        <MessageCircle size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-dark-700 mb-1">{t('whatsapp')}</h3>
                        <a 
                          href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 font-semibold"
                        >
                          {contact.whatsapp}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Address */}
                  {contact?.address && (
                    <div className="flex items-start space-x-4 p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-warm">
                        <MapPin size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-dark-700 mb-1">{t('address')}</h3>
                        <p className="text-dark-600">{contact.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white rounded-2xl shadow-warm-lg p-8 border border-primary-100 h-full">
                <h2 className="text-3xl font-bold text-dark-700 mb-6">{t('socialLinks')}</h2>

                {socials.length > 0 ? (
                  <div className="space-y-4">
                    {socials.map(({ platform, Icon, label, url }) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-4 p-4 bg-secondary-50 rounded-xl hover:bg-primary-50 transition-colors group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-warm group-hover:shadow-lg transition-shadow">
                          <Icon size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-dark-700">{label}</h3>
                        </div>
                        <ExternalLink size={20} className="text-primary-600 group-hover:text-primary-700" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-dark-500 text-center py-8">No social links available yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
