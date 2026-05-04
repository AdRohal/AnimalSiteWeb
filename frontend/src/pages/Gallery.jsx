import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../utils/api';
import MediaCard from '../components/MediaCard';

const Gallery = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (loadMore = false) => {
    try {
      const currentOffset = loadMore ? offset : 0;
      const response = await api.get(`/posts?published=true&limit=${limit}&offset=${currentOffset}`);
      
      if (loadMore) {
        setPosts([...posts, ...response.data.posts]);
      } else {
        setPosts(response.data.posts);
      }
      
      setOffset(currentOffset + limit);
      setHasMore(response.data.posts.length === limit);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchPosts(true);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-secondary-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-dark-700 mb-4">{t('galleryTitle')}</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-dark-500">{t('gallerySubtitle')}</p>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
            <p className="text-dark-600 mt-4 text-lg">Loading gallery...</p>
          </div>
        ) : (
          <>
            {posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {posts.map((post) => (
                    <MediaCard key={post.id} post={post} />
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
                <div className="text-8xl mb-4">📸</div>
                <p className="text-2xl text-dark-600 font-semibold mb-2">No images available yet.</p>
                <p className="text-dark-500">Check back soon for updates!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;
