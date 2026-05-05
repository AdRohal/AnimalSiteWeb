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
  const [isPlaying, setIsPlaying] = useState(false);
  const youtubeId = post.media_type === 'video' ? getYoutubeId(post.media_url) : null;

  useEffect(() => {
    if (!youtubeId) return;
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`)
      .then((res) => res.json())
      .then((data) => setYtTitle(data.title))
      .catch(() => setYtTitle(null));
  }, [youtubeId]);

  const title = ytTitle || defaultTitle || (language === 'ar' ? 'فيديو يوتيوب' : language === 'fr' ? 'Vidéo YouTube' : 'YouTube video');
  const thumb = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null;
  const fallbackThumb = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null;

  const handleCardClick = () => {
    if (onClick) return onClick(post);
    if (post.media_type === 'video' && !isPlaying) {
      setIsPlaying(true);
    }
  };

  return (
    <div className={`glass-panel rounded-[32px] overflow-hidden group ${!isPlaying ? 'cursor-pointer hover:-translate-y-2' : ''} transition-all duration-300`} onClick={handleCardClick}>
      <div className="relative h-64 overflow-hidden bg-dark-900">
        {post.media_type === 'image' ? (
          <img src={post.media_url} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : isPlaying && youtubeId ? (
          <iframe className="w-full h-full border-0" src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`} title={title} allowFullScreen allow="autoplay; encrypted-media" />
        ) : thumb ? (
          <>
            <img src={thumb} onError={(e) => { e.target.src = fallbackThumb; }} alt={title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 flex items-center justify-center">
               <div className="w-16 h-16 rounded-full bg-primary-600/90 backdrop-blur-md flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
               </div>
            </div>
          </>
        ) : (
          <video src={post.media_url} className="w-full h-full object-cover" controls />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-extrabold text-dark-800 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">{title}</h3>
        {description && <p className="text-dark-600 font-medium line-clamp-2">{description}</p>}
      </div>
    </div>
  );
};

export default MediaCard;
