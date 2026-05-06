import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContact } from '../contexts/ContactContext';
import { useSocial } from '../contexts/SocialContext';
import { Mail, Phone, MapPin, MessageCircle, Facebook, Instagram, Twitter, Youtube, Music, ExternalLink } from 'lucide-react';

const Contact = () => {
  const { t } = useLanguage();
  const { contact, loading: contactLoading } = useContact();
  const { getLink } = useSocial();

  const socials = [
    { platform: 'facebook', Icon: Facebook, label: 'Facebook', url: getLink('facebook') },
    { platform: 'instagram', Icon: Instagram, label: 'Instagram', url: getLink('instagram') },
    { platform: 'twitter', Icon: Twitter, label: 'Twitter', url: getLink('twitter') },
    { platform: 'youtube', Icon: Youtube, label: 'YouTube', url: getLink('youtube') },
    { platform: 'tiktok', Icon: Music, label: 'TikTok', url: getLink('tiktok') },
  ].filter((item) => !!item.url);

  return (
    <div className="py-12 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 fade-in">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Info */}
            <div className="fade-in animate-float-slow">
              <div className="glass-panel rounded-[40px] p-8 md:p-12 h-full">
                <h2 className="text-3xl font-bold text-dark-700 mb-8">{t('contactTitle')}</h2>

                <div className="space-y-6">
                  {contact?.email && (
                    <div className="flex items-center space-x-6 p-4 rounded-3xl hover:bg-white/40 transition-colors group">
                      <div className="w-16 h-16 rounded-2xl bg-white/60 border border-white/80 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Mail size={28} className="text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-dark-500 mb-1">{t('email')}</h3>
                        <a href={`mailto:${contact.email}`} className="text-dark-800 hover:text-primary-600 font-bold text-lg transition-colors break-all">
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact?.phone && (
                    <div className="flex items-center space-x-6 p-4 rounded-3xl hover:bg-white/40 transition-colors group">
                      <div className="w-16 h-16 rounded-2xl bg-white/60 border border-white/80 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Phone size={28} className="text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-dark-500 mb-1">{t('phone')}</h3>
                        <a href={`tel:${contact.phone}`} dir="ltr" className="inline-block text-dark-800 hover:text-primary-600 font-bold text-lg transition-colors break-words">
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact?.whatsapp && (
                    <div className="flex items-center space-x-6 p-4 rounded-3xl hover:bg-white/40 transition-colors group">
                      <div className="w-16 h-16 rounded-2xl bg-white/60 border border-white/80 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <MessageCircle size={28} className="text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-dark-500 mb-1">{t('whatsapp')}</h3>
                        <a 
                          href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          dir="ltr"
                          className="inline-block text-dark-800 hover:text-primary-600 font-bold text-lg transition-colors break-words"
                        >
                          {contact.whatsapp}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact?.address && (
                    <div className="flex items-center space-x-6 p-4 rounded-3xl hover:bg-white/40 transition-colors group">
                      <div className="w-16 h-16 rounded-2xl bg-white/60 border border-white/80 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <MapPin size={28} className="text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-dark-500 mb-1">{t('address')}</h3>
                        <p className="text-dark-800 font-semibold break-words">
                          {contact.address === 'Morocco' || contact.address === 'Morocco, El Jadida-Azemmour' 
                            ? t('addressValue') 
                            : contact.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="fade-in animate-float-delayed">
              <div className="glass-panel rounded-[40px] p-8 md:p-12 h-full">
                <h2 className="text-3xl font-bold text-dark-700 mb-8">{t('socialLinks')}</h2>

                {socials.length > 0 ? (
                  <div className="space-y-4">
                    {socials.map(({ platform, Icon, label, url }) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-6 p-4 rounded-3xl hover:bg-white/60 transition-all group shadow-sm hover:shadow-md border border-transparent hover:border-white/80"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-white border border-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <Icon size={28} className="text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-dark-800 text-lg group-hover:text-primary-600 transition-colors">{label}</h3>
                        </div>
                        <ExternalLink size={24} className="text-dark-400 group-hover:text-primary-600 transition-colors" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 opacity-60">
                    <Music size={48} className="text-dark-400 mb-4" />
                    <p className="text-dark-600 font-medium">No social links available yet.</p>
                  </div>
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
