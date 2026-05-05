import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../utils/api';
import MediaCard from '../components/MediaCard';
import { fallbackPosts } from '../utils/fallbackData';
import { Camera } from 'lucide-react';

const getYoutubeId = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    return u.searchParams.get('v');
  } catch {
    return null;
  }
};

const getYoutubePublishedAt = async (videoId) => {
  if (!videoId) return null;
  try {
    const res = await fetch(`https://yt.lemnoslife.com/noKey/videos?part=snippet&id=${videoId}`);
    const data = await res.json();
    return data?.items?.[0]?.snippet?.publishedAt || null;
  } catch {
    return null;
  }
};

const Gallery = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState('latest');
  const limit = 12;

  useEffect(() => {
    fetchPosts();
  }, []);

  const enrichVideoDates = async (items) => {
    const enriched = await Promise.all(
      items.map(async (post) => {
        if (post.media_type !== 'video') return post;
        const id = getYoutubeId(post.media_url);
        const ytPublishedAt = await getYoutubePublishedAt(id);
        return { ...post, ytPublishedAt };
      })
    );
    return enriched;
  };

  const fetchPosts = async (loadMore = false) => {
    try {
      const currentOffset = loadMore ? offset : 0;
      const incoming = fallbackPosts.slice(currentOffset, currentOffset + limit);

      const enrichedIncoming = await enrichVideoDates(incoming);
      
      if (loadMore) {
        setPosts([...posts, ...enrichedIncoming]);
      } else {
        setPosts(enrichedIncoming);
      }

      setOffset(currentOffset + limit);
      setHasMore(currentOffset + limit < fallbackPosts.length);
    } catch (error) {
      console.error('Error processing posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => fetchPosts(true);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const aVal = a.ytPublishedAt ? new Date(a.ytPublishedAt).getTime() : a.created_at ? new Date(a.created_at).getTime() : Number(a.id) || 0;
      const bVal = b.ytPublishedAt ? new Date(b.ytPublishedAt).getTime() : b.created_at ? new Date(b.created_at).getTime() : Number(b.id) || 0;
      return sortOrder === 'latest' ? aVal - bVal : bVal - aVal;
    });
  }, [posts, sortOrder]);

  return (
    <div className="py-12 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold text-dark-800 mb-6">{t('galleryTitle')}</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-dark-600 mb-8">{t('gallerySubtitle')}</p>

          <div className="flex justify-center">
            <div className="glass-panel inline-flex items-center gap-3 px-5 py-3 rounded-2xl">
              <label htmlFor="sort" className="text-sm font-bold text-dark-700">{t('sortBy')}:</label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-white/50 border border-white/60 rounded-xl px-4 py-2 text-sm font-bold text-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer"
              >
                <option value="latest">{t('latestYoutube')}</option>
                <option value="oldest">{t('oldestYoutube')}</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
            <p className="text-dark-600 mt-6 text-xl font-medium">{t('loadingGallery')}</p>
          </div>
        ) : sortedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedPosts.map((post) => (
                <MediaCard key={post.id} post={post} />
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-16">
                <button onClick={handleLoadMore} className="glass-button bg-primary-500/90 hover:bg-primary-600 text-white border-primary-400 px-8 py-4 text-lg">
                  {t('loadMore')}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="glass-panel rounded-[40px] py-24 text-center max-w-2xl mx-auto animate-float-slow">
            <div className="w-32 h-32 bg-white/60 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Camera size={64} className="text-primary-400" />
            </div>
            <p className="text-3xl text-dark-800 font-bold mb-4">{t('noMediaYet')}</p>
            <p className="text-dark-500 text-lg">{t('checkBackSoon')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
