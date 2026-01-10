import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Heart, Users, Award, Target } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-secondary-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-dark-700 mb-6">{t('aboutTitle')}</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-dark-500 max-w-3xl mx-auto leading-relaxed">
            {t('aboutDescription')}
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-warm-lg p-8 md:p-12 mb-12 fade-in border border-primary-100">
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
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-warm-lg">
              <div className="w-full h-full bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700 flex items-center justify-center">
                <span className="text-9xl filter drop-shadow-lg">🐾</span>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-warm hover:shadow-warm-lg transition-all duration-300 text-center transform hover:-translate-y-2 fade-in border border-primary-50">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-warm">
              <Heart size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-dark-700 mb-2">{t('compassion')}</h3>
            <p className="text-dark-500">{t('compassionDesc')}</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-warm hover:shadow-warm-lg transition-all duration-300 text-center transform hover:-translate-y-2 fade-in border border-primary-50" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-warm">
              <Award size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-dark-700 mb-2">{t('dedication')}</h3>
            <p className="text-dark-500">{t('dedicationDesc')}</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-warm hover:shadow-warm-lg transition-all duration-300 text-center transform hover:-translate-y-2 fade-in border border-primary-50" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-warm">
              <Users size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-dark-700 mb-2">{t('community')}</h3>
            <p className="text-dark-500">{t('communityDesc')}</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-warm hover:shadow-warm-lg transition-all duration-300 text-center transform hover:-translate-y-2 fade-in border border-primary-50" style={{ animationDelay: '0.3s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-warm">
              <Target size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-dark-700 mb-2">{t('impact')}</h3>
            <p className="text-dark-500">{t('impactDesc')}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white rounded-2xl shadow-warm-lg p-8 md:p-12 fade-in relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2em0wIDZjLTMuMzE0IDAtNiAyLjY4Ni02IDZzMi42ODYgNiA2IDYgNi0yLjY4NiA2LTYtMi42ODYtNi02LTZ6bTAgMzZjMy4zMTQgMCA2LTIuNjg2IDYtNnMtMi42ODYtNi02LTYtNiAyLjY4Ni02IDYgMi42ODYgNiA2IDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          <h2 className="text-4xl font-bold text-center mb-12 relative z-10">{t('ourImpact')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-6xl font-bold mb-2">500+</div>
              <div className="text-xl text-secondary-100">{t('animalsRescued')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-6xl font-bold mb-2">350+</div>
              <div className="text-xl text-secondary-100">{t('adopted')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-6xl font-bold mb-2">50+</div>
              <div className="text-xl text-secondary-100">{t('volunteers')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
