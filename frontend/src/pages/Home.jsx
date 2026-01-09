import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import MediaCard from '../components/MediaCard';
import { Heart, Users, Award, Play, ExternalLink } from 'lucide-react';
import { toEmbedUrl } from '../utils/media';
import { getVideoPoster } from '../utils/media';

const youtubeLink = 'https://www.youtube.com/watch?v=Fq1Aq1_UNgQ';

const Home = () => {
  const { t, language } = useLanguage();
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeIsPortrait, setActiveIsPortrait] = useState(false);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const response = await api.get('/posts?limit=9&published=true');
      setRecentPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaClick = (post) => {
    if (post.media_type === 'video') {
      setActiveVideo(post);
      setActiveIsPortrait(false);
    }
  };

  const closeVideoModal = () => {
    setActiveVideo(null);
    setActiveIsPortrait(false);
  };

  const autoplayEmbedUrl = (url) => {
    if (!url) return null;
    return `${url}${url.includes('?') ? '&' : '?'}autoplay=1`;
  };

  const isFacebookUrl = (url) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return parsed.hostname.includes('facebook.com') || parsed.hostname.includes('fb.watch');
    } catch {
      return false;
    }
  };

  const activeEmbedUrl = activeVideo ? autoplayEmbedUrl(toEmbedUrl(activeVideo.media_url)) : null;
  const isFacebook = activeVideo ? isFacebookUrl(activeVideo.media_url) : false;
  const modalTitle = activeVideo ? (language === 'ar' ? activeVideo.title_ar : activeVideo.title_en) : t('videosTitle');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative min-h-[75vh] flex items-center bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(44, 62, 80, 0.55), rgba(44, 62, 80, 0.55)), url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/30 via-dark-800/15 to-dark-900/30" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-5xl text-left space-y-6 text-white drop-shadow-lg">
            <p className="text-sm uppercase tracking-[0.4em] text-white/80">{language === 'ar' ? 'معاً ننقذ الحيوان' : 'Together we rescue animals'}</p>
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold leading-tight ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'قلوب دافئة، بيوت آمنة' : 'Warm hearts, safe homes'}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl">
              {language === 'ar'
                ? 'نمنح صوتاً لمن لا صوت له. ساعدنا في الإنقاذ والرعاية وتوفير المأوى للحيوانات المحتاجة.'
                : 'We give voice to the voiceless. Help us rescue, care, and shelter animals in need.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/donations" className="bg-primary-500 text-white font-semibold px-6 py-3 rounded-lg shadow-warm-lg hover:shadow-warm transition-transform hover:-translate-y-0.5">
                {language === 'ar' ? 'تبرع لنا' : 'Donate to us'}
              </Link>
              <Link to="/gallery" className="bg-white text-dark-700 border border-primary-100 font-semibold px-6 py-3 rounded-lg shadow-warm hover:bg-secondary-50 transition-transform hover:-translate-y-0.5">
                {language === 'ar' ? 'شاهد المعرض' : 'View gallery'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-700 mb-4">{t('postsTitle')}</h2>
            <p className="text-dark-500 text-lg">{t('postsSubtitle')}</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentPosts.slice(0, 9).map((post) => {
                  if (post.media_type === 'video') {
                    const title = language === 'ar' ? post.title_ar : post.title_en;
                    const poster = getVideoPoster(post.media_url);
                    return (
                      <div
                        key={post.id}
                        className="rounded-[32px] overflow-hidden bg-white shadow-warm-lg border border-primary-100 flex flex-col"
                      >
                        <div className="relative bg-secondary-100 aspect-[16/9]">
                          <video
                            src={post.media_url}
                            poster={poster || undefined}
                            className="absolute inset-0 w-full h-full object-cover"
                            preload="metadata"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 bg-black/35" />
                          <button
                            type="button"
                            onClick={() => handleMediaClick(post)}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full shadow-xl text-dark-700"
                          >
                            <Play size={18} />
                            <span className="text-sm font-semibold uppercase tracking-[0.3em]">{t('watchVideo')}</span>
                          </button>
                        </div>
                        <div className="p-6 space-y-2 text-left">
                          <h3 className="text-xl font-semibold text-dark-700">{title}</h3>
                          <p className="text-sm text-dark-500 uppercase tracking-[0.3em]">{t('watchVideo')}</p>
                        </div>
                      </div>
                    );
                  }

                  return <MediaCard key={post.id} post={post} onClick={handleMediaClick} />;
                })}
              </div>

              {recentPosts.length > 0 && (
                <div className="text-center mt-12">
                  <Link to="/gallery" className="btn-primary">
                    {t('viewAll')}
                  </Link>
                </div>
              )}

              {recentPosts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-xl">No posts available yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Values Section as Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-dark-700">{t('ourValues')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-left bg-white rounded-2xl p-8 shadow-warm-lg border border-primary-100">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mb-6">
                <Heart size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-dark-700">{t('compassion')}</h3>
              <p className="text-dark-500">{t('compassionDesc')}</p>
            </div>
            <div className="text-left bg-white rounded-2xl p-8 shadow-warm-lg border border-primary-100">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mb-6">
                <Award size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-dark-700">{t('dedication')}</h3>
              <p className="text-dark-500">{t('dedicationDesc')}</p>
            </div>
            <div className="text-left bg-white rounded-2xl p-8 shadow-warm-lg border border-primary-100">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mb-6">
                <Users size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-dark-700">{t('community')}</h3>
              <p className="text-dark-500">{t('communityDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 py-6 gap-4"
          role="dialog"
          aria-modal="true"
          aria-label={modalTitle}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeVideoModal} />
          <button
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-dark-700 shadow-lg transition hover:bg-secondary-50 relative z-20"
            onClick={closeVideoModal}
          >
            {t('close')}
          </button>
          <div
            className="relative inline-flex rounded-3xl shadow-2xl overflow-hidden bg-black max-w-[90vw] z-10"
            onClick={(event) => event.stopPropagation()}
          >
            {activeEmbedUrl && !isFacebook ? (
              <div
                className="relative"
                style={{ width: 'min(90vw, 960px)', aspectRatio: '16 / 9' }}
              >
                <iframe
                  title={modalTitle}
                  src={activeEmbedUrl}
                  className="absolute inset-0 w-full h-full rounded-xl"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  style={{ border: 'none' }}
                />
              </div>
            ) : isFacebook ? (
              <div className="relative flex flex-col items-center justify-center bg-black p-6 rounded-xl" style={{ width: 'min(90vw, 960px)', aspectRatio: '16 / 9' }}>
                <div className="text-white text-center">
                  <p className="mb-4 text-lg font-semibold">{modalTitle}</p>
                  <p className="mb-6 text-sm text-gray-300">Facebook video embedding requires opening in a new window</p>
                  <a
                    href={activeVideo.media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                  >
                    <ExternalLink size={18} />
                    {language === 'ar' ? 'شاهد على فيسبوك' : 'Watch on Facebook'}
                  </a>
                </div>
              </div>
            ) : activeIsPortrait ? (
              <div className="relative flex items-center justify-center bg-black p-3">
                <video
                  src={activeVideo.media_url}
                  className="max-h-[85vh] max-w-[90vw] w-auto h-auto object-contain bg-black rounded-xl"
                  autoPlay
                  controls
                  playsInline
                  onLoadedMetadata={(e) => {
                    const v = e.target;
                    setActiveIsPortrait(v.videoHeight > v.videoWidth);
                  }}
                />
              </div>
            ) : (
              <div
                className="relative bg-black"
                style={{ width: 'min(90vw, 960px)', aspectRatio: '16 / 9' }}
              >
                <video
                  src={activeVideo.media_url}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  controls
                  playsInline
                  onLoadedMetadata={(e) => {
                    const v = e.target;
                    setActiveIsPortrait(v.videoHeight > v.videoWidth);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
