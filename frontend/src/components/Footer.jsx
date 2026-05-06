import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSocial } from '../contexts/SocialContext';
import { useContact } from '../contexts/ContactContext';
import { Facebook, Instagram, Twitter, Mail, Phone, Youtube, Music } from 'lucide-react';

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

  return (
    <footer className="px-3 pb-4 pt-10">
      <div className="max-w-7xl mx-auto rounded-3xl bg-dark-900 text-white p-8 md:p-10 border border-dark-700">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <img src="/logo.png" className="w-12 h-12 rounded-xl mb-3" />
            <h3 className="text-xl font-semibold">{t('heroTitle')}</h3>
            <p className="text-dark-200 text-sm mt-2">{t('footerMission')}</p>
          </div>
          <div>
            <p className="font-semibold mb-3">{t('support')}</p>
            <a href="/donations" className="block text-dark-200 mb-2">{t('donateByPaypal')}</a>
            <a href={`tel:${contact?.phone || '+212684332442'}`} className="block text-dark-200 inline-flex items-center gap-2"><Phone size={15}/> <span dir="ltr">{contact?.phone || '+212 684332442'}</span></a>
            <a href={`mailto:${contact?.email || 'associationanimalsrescue@gmail.com'}`} className="block text-dark-200 mt-2 inline-flex items-center gap-2"><Mail size={15}/> {contact?.email || 'associationanimalsrescue@gmail.com'}</a>
          </div>
          <div>
            <p className="font-semibold mb-3">{t('followUs')}</p>
            <div className="flex gap-3">{socials.map(({ platform, Icon, url }) => <a key={platform} href={url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary-500"><Icon size={18} /></a>)}</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
