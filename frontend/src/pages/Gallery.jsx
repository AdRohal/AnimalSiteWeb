import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../utils/api';
import MediaCard from '../components/MediaCard';
import { fallbackPosts } from '../utils/fallbackData';

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
      const response = await api.get(`/posts?published=true&limit=${limit}&offset=${currentOffset}`);
      const incoming = response.data.posts || [];

      if (!incoming.length && !loadMore) {
        const enrichedFallback = await enrichVideoDates(fallbackPosts);
        setPosts(enrichedFallback);
        setHasMore(false);
        return;
      }

      const enrichedIncoming = await enrichVideoDates(incoming);
      if (loadMore) {
        setPosts([...posts, ...enrichedIncoming]);
      } else {
        setPosts(enrichedIncoming);
      }

      setOffset(currentOffset + limit);
      setHasMore(incoming.length === limit);
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (!loadMore) {
        const enrichedFallback = await enrichVideoDates(fallbackPosts);
        setPosts(enrichedFallback);
        setHasMore(false);
      }
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
    <div className="min-h-screen py-12 bg-gradient-to-b from-secondary-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-dark-700 mb-4">{t('galleryTitle')}</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-dark-500">{t('gallerySubtitle')}</p>

          <div className="mt-7 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-white border border-primary-200 rounded-2xl px-3 py-2 shadow-warm">
              <label htmlFor="sort" className="text-sm font-semibold text-dark-600">Sort:</label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-secondary-50 border border-primary-100 rounded-xl px-3 py-2 text-sm font-medium text-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                <option value="latest">Latest (YouTube date)</option>
                <option value="oldest">Oldest (YouTube date)</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
            <p className="text-dark-600 mt-4 text-lg">Loading gallery...</p>
          </div>
        ) : sortedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedPosts.map((post) => (
                <MediaCard key={post.id} post={post} />
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-12">
                <button onClick={handleLoadMore} className="btn-primary">{t('loadMore')}</button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-warm-lg">
            <div className="text-8xl mb-4">📸</div>
            <p className="text-2xl text-dark-600 font-semibold mb-2">No images or videos available yet.</p>
            <p className="text-dark-500">Check back soon for updates!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
