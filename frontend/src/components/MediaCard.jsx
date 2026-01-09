import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { toEmbedUrl } from '../utils/media';

const MediaCard = ({ post, onClick }) => {
  const { language } = useLanguage();
  const title = language === 'ar' ? post.title_ar : post.title_en;
  const description = language === 'ar' ? post.description_ar : post.description_en;
  const embedUrl = post.media_type === 'video' ? toEmbedUrl(post.media_url) : null;

  const handleCardClick = () => onClick && onClick(post);

  return (
    <div className="card cursor-pointer group" onClick={handleCardClick}>
      <div className="relative h-64 overflow-hidden bg-secondary-100">
        {post.media_type === 'image' ? (
          <img
            src={post.media_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : embedUrl ? (
          <div className="absolute inset-0">
            <iframe
              title={title}
              src={embedUrl}
              className="w-full h-full"
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture"
              style={{ border: 'none' }}
            />
          </div>
        ) : (
          <video
            src={post.media_url}
            className="w-full h-full object-cover"
            controls
          />
        )}
        {post.media_type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              className="border border-white/80 rounded-full h-16 w-16 flex items-center justify-center text-white bg-black/40 backdrop-blur transition-transform duration-200 hover:scale-110"
              onClick={(event) => {
                event.stopPropagation();
                handleCardClick();
              }}
            >
              <span className="sr-only">Play {title}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-gradient-to-br from-primary-400 to-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-warm">
          {post.media_type === 'image' ? '📷' : '🎥'}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-5 bg-white">
        <h3 className="text-xl font-bold text-dark-700 mb-2 group-hover:text-primary-600 transition-colors">{title}</h3>
        {description && (
          <p className="text-dark-500 line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
};

export default MediaCard;
