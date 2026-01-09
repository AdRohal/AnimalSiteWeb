export const toEmbedUrl = (url) => {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const isYouTube = parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be');
    const isVimeo = parsed.hostname.includes('vimeo.com');
    const isFacebook = parsed.hostname.includes('facebook.com') || parsed.hostname.includes('fb.watch');

    if (isYouTube) {
      let videoId = parsed.searchParams.get('v') || parsed.pathname.split('/').pop();
      if (!videoId && parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.replace('/embed/', '');
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (isVimeo) {
      const videoId = parsed.pathname.split('/').filter(Boolean).pop();
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }

    if (isFacebook) {
      // Return the original URL to open in new window or use native player
      // Facebook embed API has CORS restrictions, so we return the URL for direct opening
      return url;
    }
  } catch (error) {
    return null;
  }

  return url;
};

const extractYouTubeId = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('youtube.com') && !parsed.hostname.includes('youtu.be')) {
      return null;
    }

    let videoId = parsed.searchParams.get('v') || parsed.pathname.split('/').pop();
    if (!videoId && parsed.pathname.startsWith('/embed/')) {
      videoId = parsed.pathname.replace('/embed/', '');
    }

    return videoId || null;
  } catch (error) {
    return null;
  }
};

const extractFacebookVideoId = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('facebook.com') && !parsed.hostname.includes('fb.watch')) {
      return null;
    }
    
    // Handle reel format: facebook.com/reel/VIDEO_ID
    if (parsed.pathname.includes('/reel/')) {
      const match = parsed.pathname.match(/\/reel\/(\d+)/);
      return match ? match[1] : null;
    }
    
    // Handle share format: facebook.com/share/v/VIDEO_ID
    if (parsed.pathname.includes('/share/v/')) {
      const match = parsed.pathname.match(/\/share\/v\/([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    }
    
    // Handle watch format: facebook.com/watch/?v=VIDEO_ID
    if (parsed.searchParams.has('v')) {
      return parsed.searchParams.get('v');
    }
    
    // Handle fb.watch short links: fb.watch/VIDEO_ID
    if (parsed.hostname.includes('fb.watch')) {
      return parsed.pathname.split('/').pop();
    }
    
    // Generic path extraction
    return parsed.pathname.split('/').filter(Boolean).pop();
  } catch (error) {
    return null;
  }
};

export const getVideoPoster = (url) => {
  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }

  // Facebook videos use a generic poster
  const facebookId = extractFacebookVideoId(url);
  if (facebookId) {
    // Try to get Facebook video thumbnail from graph API (public endpoint)
    // Falls back to generic icon if API unavailable
    return null;
  }

  return null;
};
