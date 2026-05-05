import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Heart, Users, Award, Target, PawPrint } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="py-12 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-dark-700 mb-6">{t('aboutTitle')}</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-dark-500 max-w-3xl mx-auto leading-relaxed">
            {t('aboutDescription')}
          </p>
        </div>

        {/* Mission Section */}
        <div className="glass-panel rounded-[40px] p-8 md:p-14 mb-16 fade-in animate-float-slow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-dark-700 mb-6">{t('ourMission')}</h2>
              <p className="text-dark-600 text-lg leading-relaxed mb-4">
                {t('missionLine1')}
              </p>
              <p className="text-dark-600 text-lg leading-relaxed">
                {t('missionLine2')}
              </p>
            </div>
            <div className="relative h-80 rounded-[32px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-400/20 to-transparent blur-2xl z-0"></div>
              <div className="w-full h-full bg-white/40 border border-white/60 flex items-center justify-center relative z-10 rounded-[32px]">
                <PawPrint className="text-primary-500 w-32 h-32 drop-shadow-md animate-float" />
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-10">
          {[
            { icon: Heart, title: t('compassion'), desc: t('compassionDesc'), delay: '0s' },
            { icon: Award, title: t('dedication'), desc: t('dedicationDesc'), delay: '0.2s' },
            { icon: Users, title: t('community'), desc: t('communityDesc'), delay: '0.4s' },
            { icon: Target, title: t('impact'), desc: t('impactDesc'), delay: '0.6s' }
          ].map((item) => (
            <div key={item.title} className="glass-panel rounded-[32px] p-8 text-center group hover:-translate-y-4" style={{ animation: `float 6s ease-in-out infinite ${item.delay}` }}>
              <div className="w-16 h-16 rounded-2xl bg-white/60 border border-white/80 shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary-100/50 transition-all duration-300">
                <item.icon size={32} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-dark-800 mb-3">{item.title}</h3>
              <p className="text-dark-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="relative overflow-hidden rounded-[40px] z-10 p-10 md:p-16 text-white text-center">
          <div className="absolute inset-0 bg-dark-800 z-0"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl z-0 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl z-0 pointer-events-none"></div>
          
          <h2 className="text-4xl font-bold mb-12 relative z-10">{t('ourImpact')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="glass-button bg-white/10 hover:bg-white/20 border-white/20 p-8 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold mb-2 text-primary-400 drop-shadow-md">500+</div>
              <div className="text-xl text-white/90 font-medium">{t('animalsRescued')}</div>
            </div>
            <div className="glass-button bg-white/10 hover:bg-white/20 border-white/20 p-8 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold mb-2 text-primary-400 drop-shadow-md">350+</div>
              <div className="text-xl text-white/90 font-medium">{t('adopted')}</div>
            </div>
            <div className="glass-button bg-white/10 hover:bg-white/20 border-white/20 p-8 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold mb-2 text-primary-400 drop-shadow-md">50+</div>
              <div className="text-xl text-white/90 font-medium">{t('volunteers')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
