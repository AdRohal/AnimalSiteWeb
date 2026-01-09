import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../utils/api';
import { Play, ExternalLink } from 'lucide-react';
import { toEmbedUrl, getVideoPoster } from '../utils/media';

const Videos = () => {
  const { t, language } = useLanguage();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeIsPortrait, setActiveIsPortrait] = useState(false);
  const limit = 12;

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async (loadMore = false) => {
    try {
      const currentOffset = loadMore ? offset : 0;
      const response = await api.get(`/posts?media_type=video&published=true&limit=${limit}&offset=${currentOffset}`);

      if (loadMore) {
        setVideos((prev) => [...prev, ...response.data.posts]);
      } else {
        setVideos(response.data.posts);
      }

      setOffset(currentOffset + limit);
      setHasMore(response.data.posts.length === limit);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchVideos(true);
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
    <div className="min-h-screen py-12 bg-gradient-to-b from-secondary-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-dark-700 mb-4">{t('videosTitle')}</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto mb-6 rounded-full" />
          <p className="text-xl text-dark-500">{t('videosSubtitle')}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600" />
            <p className="text-dark-600 mt-4 text-lg">Loading videos...</p>
          </div>
        ) : (
          <>
            {videos.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {videos.map((video) => {
                    const title = language === 'ar' ? video.title_ar : video.title_en;
                    const poster = getVideoPoster(video.media_url);
                    return (
                      <div
                        key={video.id}
                        className="rounded-[32px] overflow-hidden bg-white shadow-warm-lg border border-primary-100 flex flex-col"
                      >
                        <div className="relative bg-secondary-100 aspect-[16/9]">
                          <video
                            src={video.media_url}
                            poster={poster || undefined}
                            className="absolute inset-0 w-full h-full object-cover"
                            preload="metadata"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 bg-black/35" />
                          <button
                            type="button"
                            onClick={() => handleMediaClick(video)}
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
                  })}
                </div>

                {hasMore && (
                  <div className="text-center mt-12">
                    <button onClick={handleLoadMore} className="btn-primary">
                      {t('loadMore')}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-warm-lg">
                <div className="text-8xl mb-4">🎥</div>
                <p className="text-2xl text-dark-600 font-semibold mb-2">No videos available yet.</p>
                <p className="text-dark-500">Check back soon for updates!</p>
              </div>
            )}
          </>
        )}
      </div>

      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 py-6 gap-4"
          role="dialog"
          aria-modal="true"
          aria-label={modalTitle}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeVideoModal} />
          <button
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-dark-700 shadow-lg transition hover:bg-gray-100 relative z-20"
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

export default Videos;
