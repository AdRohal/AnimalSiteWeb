import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../utils/api';
import MediaCard from '../components/MediaCard';
import { toEmbedUrl } from '../utils/media';

const Videos = () => {
  const { t, language } = useLanguage();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
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
    }
  };

  const closeVideoModal = () => {
    setActiveVideo(null);
  };

  const autoplayEmbedUrl = (url) => {
    if (!url) return null;
    return `${url}${url.includes('?') ? '&' : '?'}autoplay=1`;
  };

  const activeEmbedUrl = activeVideo ? autoplayEmbedUrl(toEmbedUrl(activeVideo.media_url)) : null;
  const modalTitle = activeVideo ? (language === 'ar' ? activeVideo.title_ar : activeVideo.title_en) : t('videosTitle');

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-secondary-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-dark-700 mb-4">{t('videosTitle')}</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-dark-500">{t('videosSubtitle')}</p>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
            <p className="text-dark-600 mt-4 text-lg">Loading videos...</p>
          </div>
        ) : (
          <>
            {videos.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {videos.map((video) => (
                    <MediaCard key={video.id} post={video} onClick={handleMediaClick} />
                  ))}
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
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={modalTitle}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeVideoModal}
          />
          <div
            className="relative w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden bg-black"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-video bg-black">
              {activeEmbedUrl ? (
                <iframe
                  title={modalTitle}
                  src={activeEmbedUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  style={{ border: 'none' }}
                />
              ) : (
                <video
                  src={activeVideo.media_url}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  controls
                  playsInline
                />
              )}
            </div>
            <div className="absolute top-4 right-4">
              <button
                className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
                onClick={closeVideoModal}
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
