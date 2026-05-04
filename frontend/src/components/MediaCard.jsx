import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const getYoutubeId = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    return u.searchParams.get('v');
  } catch {
    return null;
  }
};

const MediaCard = ({ post, onClick }) => {
  const { language } = useLanguage();
  const defaultTitle = language === 'ar' ? post.title_ar : post.title_en;
  const description = language === 'ar' ? post.description_ar : post.description_en;
  const [ytTitle, setYtTitle] = useState(null);
  const youtubeId = post.media_type === 'video' ? getYoutubeId(post.media_url) : null;

  useEffect(() => {
    if (!youtubeId) return;
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`)
      .then((res) => res.json())
      .then((data) => setYtTitle(data.title))
      .catch(() => setYtTitle(null));
  }, [youtubeId]);

  const title = ytTitle || defaultTitle || 'YouTube video';
  const thumb = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null;

  const handleCardClick = () => {
    if (onClick) return onClick(post);
    if (post.media_type === 'video') window.open(post.media_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="card cursor-pointer group" onClick={handleCardClick}>
      <div className="relative h-64 overflow-hidden bg-secondary-100">
        {post.media_type === 'image' ? (
          <img src={post.media_url} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : thumb ? (
          <img src={thumb} alt={title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <video src={post.media_url} className="w-full h-full object-cover" controls />
        )}
        {post.media_type === 'video' && <div className="absolute inset-0 bg-black/25" />}
      </div>
      <div className="p-5 bg-white">
        <h3 className="text-xl font-bold text-dark-700 mb-2 group-hover:text-primary-600 transition-colors">{title}</h3>
        {description && <p className="text-dark-500 line-clamp-2">{description}</p>}
      </div>
    </div>
  );
};

export default MediaCard;
