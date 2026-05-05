import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowUpRight, HeartHandshake, Phone, PawPrint, ShieldCheck, Stethoscope, PlayCircle, Sparkles } from 'lucide-react';

const youtubeVideos = [
  'https://youtu.be/AC2QGFbLQyA?si=Nx3jXxsV0B8GDquS',
  'https://youtu.be/Zf84tGTrNig?si=DHS4YERORs0wkBk9',
  'https://youtu.be/e8M5NbadEPU?si=rHCrHmv4Feqdn6H1',
  'https://youtu.be/sGWL20Rb77M?si=sAgk_A47FV7PrqAJ',
  'https://youtu.be/oupdhjfJFaY?si=A6cvnC_JWMXgxcGP',
];

const VideoFacade = ({ url }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const getId = (url) => {
    try {
      const u = new URL(url);
      return u.pathname.includes('/watch') ? u.searchParams.get('v') : u.pathname.split('/').pop();
    } catch {
      return null;
    }
  };

  const id = getId(url);
  const embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
  const thumbUrl = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  const fallbackThumbUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  if (isLoaded) {
    return <iframe className="w-full aspect-video border-0" src={embedUrl} title="association video" allowFullScreen allow="autoplay; encrypted-media" />;
  }

  return (
    <div className="w-full aspect-video relative cursor-pointer group bg-dark-900" onClick={() => setIsLoaded(true)}>
      <img 
        src={thumbUrl} 
        onError={(e) => { e.target.src = fallbackThumbUrl; }} 
        alt="Video thumbnail" 
        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" 
        loading="lazy" 
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-primary-600/90 backdrop-blur-md flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-500">
          <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { t } = useLanguage();
  return (
    <div className="relative w-full overflow-hidden pb-16 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* HERO SECTION */}
        <section className="glass-panel rounded-[40px] p-8 md:p-14 relative overflow-hidden mt-6 animate-float-slow">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent z-0 pointer-events-none"></div>
          
          <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-white/80 text-primary-700 font-semibold mb-6 animate-float">
                <Sparkles size={16} />
                <span>{t('homePortfolioTag')}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-dark-800 leading-[1.1] tracking-tight mb-6 drop-shadow-sm">
                {t('homeHeroTitle')}
              </h1>
              <p className="text-dark-600 text-xl leading-relaxed mb-8 max-w-2xl">
                {t('homeHeroDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/donations" className="glass-button bg-primary-500/90 text-white hover:bg-primary-600 hover:text-white border-primary-400 flex items-center justify-center gap-2 group">
                  {t('supportPaypal')} 
                  <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
                <a href="tel:+212684332442" className="glass-button flex items-center justify-center gap-2">
                  <Phone size={18} className="text-primary-600" /> 
                  {t('callToHelp')}
                </a>
              </div>
            </div>
            
            <div className="lg:col-span-5 relative">
              <div className="relative grid grid-cols-2 gap-4">
                <div className="glass-panel rounded-3xl p-6 flex flex-col justify-center items-center aspect-square shadow-lg">
                  <img src="/logo.png" alt="logo" className="w-32 h-32 object-contain drop-shadow-md" />
                </div>
                <div className="glass-panel rounded-3xl p-6 flex flex-col justify-center items-center aspect-square shadow-lg">
                  <p className="text-sm text-dark-500 font-medium mb-1 text-center">{t('animalsRescued')}</p>
                  <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary-500 to-primary-800 drop-shadow-sm">500+</p>
                </div>
                <div className="col-span-2 glass-panel rounded-3xl p-6 shadow-lg mt-4">
                  <p className="text-dark-600 font-medium mb-4 text-center">{t('supportOptions')}</p>
                  <div className="flex flex-wrap justify-center gap-2 text-sm font-semibold">
                    <span className="px-4 py-2 rounded-xl bg-white/60 text-primary-700 shadow-sm border border-white/50 backdrop-blur-md">PayPal</span>
                    <span className="px-4 py-2 rounded-xl bg-white/60 text-dark-700 shadow-sm border border-white/50 backdrop-blur-md">{t('phoneCall')}</span>
                    <span className="px-4 py-2 rounded-xl bg-white/60 text-dark-700 shadow-sm border border-white/50 backdrop-blur-md">{t('socialSharing')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
          {[
            {icon:PawPrint,title:t('streetRescue'),text:t('streetRescueDesc'), delay: '0s'},
            {icon:Stethoscope,title:t('medicalCare'),text:t('medicalCareDesc'), delay: '0.2s'},
            {icon:ShieldCheck,title:t('safeShelter'),text:t('safeShelterDesc'), delay: '0.4s'},
            {icon:HeartHandshake,title:t('adoption'),text:t('adoptionDesc'), delay: '0.6s'}
          ].map((item, index)=>(
            <article key={item.title} className="glass-panel rounded-[32px] p-8 group hover:-translate-y-4" style={{ animation: `float 6s ease-in-out infinite ${item.delay}` }}>
              <div className="w-14 h-14 rounded-2xl bg-white/60 border border-white/80 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-100/50 transition-all duration-300">
                <item.icon className="text-primary-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-dark-800 mb-3">{item.title}</h3>
              <p className="text-dark-600 leading-relaxed">{item.text}</p>
            </article>
          ))}
        </section>

        {/* VIDEOS SECTION */}
        <section className="glass-panel rounded-[40px] p-8 md:p-12 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center shadow-sm">
                <PlayCircle className="text-primary-600" size={24} />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-dark-800">{t('rescueVideos')}</h2>
            </div>
            <Link to="/gallery" className="glass-button text-sm whitespace-nowrap">{t('viewAllMediaGallery')}</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {youtubeVideos.slice(0, 3).map((video, idx) => (
              <div key={video} className="glass-panel p-2 rounded-[24px] overflow-hidden group" style={{ animation: `float-delayed ${7 + idx}s ease-in-out infinite` }}>
                <div className="rounded-[18px] overflow-hidden shadow-inner relative">
                  <VideoFacade url={video} />
                  <div className="absolute inset-0 border-2 border-white/20 rounded-[18px] pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="relative overflow-hidden rounded-[40px] z-10 animate-float-slow">
          <div className="absolute inset-0 bg-dark-800 z-0"></div>
          
          <div className="relative z-10 p-10 md:p-16 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">{t('impactTodayTitle')}</h2>
              <p className="text-white/80 text-lg">{t('impactTodayDesc')}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Link to="/donations" className="glass-button bg-primary-500/20 text-white hover:bg-primary-500/40 border-primary-400/50 text-center text-lg">{t('donate')}</Link>
              <Link to="/contact" className="glass-button bg-white/10 text-white hover:bg-white/20 border-white/20 text-center text-lg">{t('contactTeam')}</Link>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
};

export default Home;
