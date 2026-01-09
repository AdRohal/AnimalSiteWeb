import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSocial } from '../../contexts/SocialContext';
import { useContact } from '../../contexts/ContactContext';
import { useBanking } from '../../contexts/BankingContext';
import { toEmbedUrl, getVideoPoster } from '../../utils/media';
import api from '../../utils/api';
import { Plus, Edit, Trash2, Video, LogOut, Eye, EyeOff, Play, Settings, Facebook, Instagram, Twitter, Link as LinkIcon, Phone, Mail, MapPin, MessageCircle, ExternalLink, Youtube, Music, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { admin, logout, loading } = useAuth();
  const { t, language } = useLanguage();
  const { links: socialLinks, loading: socialLoading, getLink, saveLink, reload: reloadSocialLinks } = useSocial();
  const { contact, loading: contactLoading, saveContact, reload: reloadContact } = useContact();
  const { banking, loading: bankingLoading, saveBanking, reload: reloadBanking } = useBanking();
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    media_type: 'image',
    media_url: '',
    is_published: true,
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [watchingPost, setWatchingPost] = useState(null);
  const [watchIsPortrait, setWatchIsPortrait] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const [socialForm, setSocialForm] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    tiktok: '',
  });
  const [savingSocial, setSavingSocial] = useState(false);
  const [contactForm, setContactForm] = useState({
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
  });
  const [savingContact, setSavingContact] = useState(false);
  const [bankingForm, setBankingForm] = useState({
    paypal_email: '',
    bank_rib: '',
  });
  const [savingBanking, setSavingBanking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !admin) {
      navigate('/admin/login');
      return;
    }

    if (admin) {
      fetchPosts();
    }
  }, [admin, loading, navigate]);

  useEffect(() => {
    if (socialLoading) return;
    setSocialForm({
      facebook: getLink('facebook') || '',
      instagram: getLink('instagram') || '',
      twitter: getLink('twitter') || '',
      youtube: getLink('youtube') || '',
      tiktok: getLink('tiktok') || '',
    });
  }, [socialLoading, getLink]);

  useEffect(() => {
    if (contactLoading) return;
    setContactForm({
      email: contact?.email || '',
      phone: contact?.phone || '',
      whatsapp: contact?.whatsapp || '',
      address: contact?.address || '',
    });
  }, [contactLoading, contact]);

  useEffect(() => {
    if (bankingLoading) return;
    setBankingForm({
      paypal_email: banking?.paypal_email || '',
      bank_rib: banking?.bank_rib || '',
    });
  }, [bankingLoading, banking]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleSocialSave = async (e) => {
    e.preventDefault();
    setSavingSocial(true);
    try {
      const entries = Object.entries(socialForm);
      const results = await Promise.all(entries.map(([platform, url]) => saveLink(platform, url)));

      const failure = results.find((result) => !result.success);
      if (failure) {
        showToast(failure.message || t('socialSaveError'), 'error');
      } else {
        reloadSocialLinks();
        showToast(t('socialSaved'));
      }
    } catch (error) {
      console.error('Error saving social links:', error);
      showToast(t('socialSaveError'), 'error');
    } finally {
      setSavingSocial(false);
    }
  };

  const handleContactSave = async (e) => {
    e.preventDefault();
    setSavingContact(true);
    try {
      const result = await saveContact(contactForm);
      if (!result.success) {
        showToast(result.message || t('contactSaveError'), 'error');
      } else {
        reloadContact();
        showToast(t('contactSaved'));
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      showToast(t('contactSaveError'), 'error');
    } finally {
      setSavingContact(false);
    }
  };

  const handleBankingSave = async (e) => {
    e.preventDefault();
    setSavingBanking(true);
    try {
      const result = await saveBanking(bankingForm);
      if (!result.success) {
        showToast(result.message || t('bankingSaveError'), 'error');
      } else {
        reloadBanking();
        showToast(t('bankingSaved'));
      }
    } catch (error) {
      console.error('Error saving banking info:', error);
      showToast(t('bankingSaveError'), 'error');
    } finally {
      setSavingBanking(false);
    }
  };

  const openModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title_en: post.title_en,
        title_ar: post.title_ar,
        description_en: post.description_en || '',
        description_ar: post.description_ar || '',
        media_type: post.media_type,
        media_url: post.media_type === 'video' ? post.media_url : '',
        is_published: post.is_published,
      });
    } else {
      setEditingPost(null);
      setFormData({
        title_en: '',
        title_ar: '',
        description_en: '',
        description_ar: '',
        media_type: 'image',
        media_url: '',
        is_published: true,
      });
    }
    setMediaFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPost(null);
    setMediaFile(null);
  };

  const clearToast = () => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
      toastTimer.current = null;
    }
    setToast(null);
  };

  const showToast = (message, type = 'success') => {
    clearToast();
    setToast({ message, type });
    toastTimer.current = setTimeout(() => {
      setToast(null);
      toastTimer.current = null;
    }, 3200);
  };

  const handleMediaTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      media_type: value,
      media_url: value === 'image' ? '' : prev.media_url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title_en', formData.title_en);
      formDataToSend.append('title_ar', formData.title_ar);
      formDataToSend.append('description_en', formData.description_en);
      formDataToSend.append('description_ar', formData.description_ar);
      formDataToSend.append('media_type', formData.media_type);
      formDataToSend.append('is_published', formData.is_published);

      if (mediaFile) {
        formDataToSend.append('media', mediaFile);
      }

      if (formData.media_url) {
        formDataToSend.append('media_url', formData.media_url);
      }

      if (editingPost) {
        await api.put(`/posts/${editingPost.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast(t('postUpdated'));
      } else {
        await api.post('/posts', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast(t('postCreated'));
      }

      await fetchPosts();
      closeModal();
    } catch (error) {
      console.error('Error saving post:', error);
      showToast(t('postSaveError'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteConfirm = (post) => {
    setDeleteTarget(post);
  };

  const closeDeleteConfirm = () => {
    if (deleting) return;
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${deleteTarget.id}`);
      await fetchPosts();
      showToast(t('postDeleted'));
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      showToast(t('postDeleteError'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const togglePublished = async (post) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('is_published', !post.is_published);
      
      await api.put(`/posts/${post.id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const openWatchModal = (post) => {
    if (!post) return;
    setWatchIsPortrait(false);
    setWatchingPost(post);
  };

  const closeWatchModal = () => {
    setWatchingPost(null);
    setWatchIsPortrait(false);
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

  const featuredVideo = posts.find((post) => post.media_type === 'video');
  const watchEmbedUrl = watchingPost ? autoplayEmbedUrl(toEmbedUrl(watchingPost.media_url)) : null;
  const watchIsFacebook = watchingPost ? isFacebookUrl(watchingPost.media_url) : false;
  const watchModalTitle = watchingPost ? (language === 'ar' ? watchingPost.title_ar : watchingPost.title_en) : t('videosTitle');

  if (loading || postsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white py-4">
      <div className="mx-auto w-full max-w-full px-4 lg:px-6">
        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-3xl border border-primary-100 bg-gradient-to-b from-primary-50/60 to-white shadow-warm-lg p-6">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs uppercase tracking-[0.3em] text-primary-500">Menu</span>
              <span className="text-emerald-600 text-xs font-semibold">Live</span>
            </div>
            <nav className="space-y-3">
              <button
                className={`w-full text-left rounded-2xl border px-4 py-3 text-dark-700 font-semibold shadow-sm transition hover:border-primary-300 ${
                  activeTab === 'posts'
                    ? 'bg-primary-50/80 border-primary-300 text-primary-700'
                    : 'bg-white border-primary-100'
                }`}
                onClick={() => setActiveTab('posts')}
              >
                Posts
                <span className="ml-2 text-xs text-primary-500">01</span>
              </button>
              <button
                className={`w-full text-left rounded-2xl border px-4 py-3 text-dark-700 font-semibold shadow-sm transition hover:border-primary-300 flex items-center justify-between ${
                  activeTab === 'social'
                    ? 'bg-primary-50/80 border-primary-300 text-primary-700'
                    : 'bg-white border-primary-100'
                }`}
                onClick={() => setActiveTab('social')}
              >
                <span className="flex items-center space-x-2">
                  <Settings size={18} />
                  <span>{t('socialLinks')}</span>
                </span>
                <span className="text-xs text-primary-500">New</span>
              </button>
              <button
                className={`w-full text-left rounded-2xl border px-4 py-3 text-dark-700 font-semibold shadow-sm transition hover:border-primary-300 flex items-center justify-between ${
                  activeTab === 'contact'
                    ? 'bg-primary-50/80 border-primary-300 text-primary-700'
                    : 'bg-white border-primary-100'
                }`}
                onClick={() => setActiveTab('contact')}
              >
                <span className="flex items-center space-x-2">
                  <Phone size={18} />
                  <span>{t('contactInfo') || 'Contact'}</span>
                </span>
                <span className="text-xs text-primary-500">New</span>
              </button>
              <button
                className={`w-full text-left rounded-2xl border px-4 py-3 text-dark-700 font-semibold shadow-sm transition hover:border-primary-300 flex items-center justify-between ${
                  activeTab === 'banking'
                    ? 'bg-primary-50/80 border-primary-300 text-primary-700'
                    : 'bg-white border-primary-100'
                }`}
                onClick={() => setActiveTab('banking')}
              >
                <span className="flex items-center space-x-2">
                  <DollarSign size={18} />
                  <span>{t('bankingInfo') || 'Banking'}</span>
                </span>
                <span className="text-xs text-primary-500">New</span>
              </button>
            </nav>
            <p className="mt-8 text-sm text-dark-500">
              Access your latest content, publish status, and the spotlighted video from one place.
            </p>
          </aside>
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-warm-lg p-6 border border-primary-100">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-dark-700">{t('dashboard')}</h1>
                  <p className="text-dark-500 mt-1">
                    Welcome, <span className="text-primary-600 font-semibold">{admin?.username}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button onClick={() => navigate('/')} className="btn-secondary">
                    View Site
                  </button>
                  <button onClick={handleLogout} className="btn-primary flex items-center justify-center space-x-2">
                    <LogOut size={20} />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            </div>

            {activeTab === 'posts' && (
              <>
                {featuredVideo && (
                  <div className="mb-6 bg-gradient-to-r from-primary-500/10 via-white to-secondary-50 rounded-3xl border border-primary-100 shadow-warm-lg px-6 py-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-primary-500 mb-1">Spotlight</p>
                        <h2 className="text-3xl font-bold text-dark-700">
                          {t('videosTitle')}
                        </h2>
                        <p className="text-dark-500 mt-1 text-lg">
                          {t('videosSubtitle')}
                        </p>
                        <p className="text-dark-500 mt-1 text-sm">
                          {language === 'ar' ? featuredVideo.title_ar : featuredVideo.title_en}
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <button
                          onClick={() => openWatchModal(featuredVideo)}
                          className="btn-primary flex items-center space-x-2 px-5 py-3"
                        >
                          <Video size={20} />
                          <span>{t('watchVideo')}</span>
                        </button>
                        <p className="text-xs text-dark-500">
                          {language === 'ar' ? 'أحدث فيديو' : 'Latest video'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <button onClick={() => openModal()} className="btn-primary flex items-center space-x-2 shadow-warm-lg">
                    <Plus size={20} />
                    <span>{t('addPost')}</span>
                  </button>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {posts.map((post) => {
                    const isVideo = post.media_type === 'video';
                    const videoPoster = isVideo ? getVideoPoster(post.media_url) : null;

                    return (
                      <div
                        key={post.id}
                        className="bg-white rounded-xl shadow-warm hover:shadow-warm-lg transition-all duration-300 overflow-hidden border border-primary-50 transform hover:-translate-y-1 relative group"
                      >
                        <div className="relative h-48 bg-secondary-100">
                          {!isVideo ? (
                            <img
                              src={post.media_url}
                              alt={post.title_en}
                              className="w-full h-full object-cover"
                            />
                          ) : videoPoster ? (
                            <img
                              src={videoPoster}
                              alt={post.title_en}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={post.media_url}
                              className="w-full h-full object-cover"
                              poster={videoPoster || undefined}
                            />
                          )}
                          <div className="absolute top-2 right-2 bg-gradient-to-br from-primary-400 to-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-warm">
                            {post.media_type === 'image' ? '📷' : '🎥'}
                          </div>
                          {!post.is_published && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                              Unpublished
                            </div>
                          )}
                          {isVideo && (
                            <button
                              type="button"
                              onClick={() => openWatchModal(post)}
                              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition duration-300 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
                            >
                              <div className="flex items-center space-x-2 bg-black/70 px-4 py-2 rounded-full border border-white/30">
                                <Play size={18} className="text-white" />
                                <span className="text-white font-semibold text-sm">{t('watchVideo')}</span>
                              </div>
                            </button>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-dark-700 mb-1 truncate">{post.title_en}</h3>
                          <p className="text-sm text-dark-500 truncate mb-3">{post.title_ar}</p>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => togglePublished(post)}
                              className="flex-1 bg-secondary-200 hover:bg-secondary-300 text-dark-700 px-3 py-2 rounded-lg transition-all font-medium flex items-center justify-center space-x-1 shadow-sm"
                              title={post.is_published ? 'Unpublish' : 'Publish'}
                            >
                              {post.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                            <button
                              onClick={() => openModal(post)}
                              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-lg transition-all font-medium flex items-center justify-center space-x-1 shadow-sm"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(post)}
                              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg transition-all font-medium flex items-center justify-center space-x-1 shadow-sm"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {posts.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-2xl shadow-warm-lg border border-primary-100">
                    <div className="text-8xl mb-4">📝</div>
                    <p className="text-2xl text-dark-600 font-semibold mb-2">No posts yet</p>
                    <p className="text-dark-500">Create your first one to get started!</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'social' && (
              <div className="bg-white rounded-2xl shadow-warm-lg border border-primary-100 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-primary-500 mb-1 flex items-center space-x-2">
                      <Settings size={16} />
                      <span>{t('settings')}</span>
                    </p>
                    <h2 className="text-3xl font-bold text-dark-700">{t('socialLinks')}</h2>
                    <p className="text-dark-500 mt-1">{t('socialLinksSubtitle')}</p>
                  </div>
                </div>

                {socialLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <form onSubmit={handleSocialSave} className="space-y-4">
                    {[
                      { platform: 'facebook', label: 'Facebook', Icon: Facebook, placeholder: 'https://facebook.com/your-page' },
                      { platform: 'instagram', label: 'Instagram', Icon: Instagram, placeholder: 'https://instagram.com/your-profile' },
                      { platform: 'twitter', label: 'Twitter', Icon: Twitter, placeholder: 'https://twitter.com/your-handle' },
                      { platform: 'youtube', label: 'YouTube', Icon: Youtube, placeholder: 'https://youtube.com/@your-channel' },
                      { platform: 'tiktok', label: 'TikTok', Icon: Music, placeholder: 'https://tiktok.com/@your-username' },
                    ].map(({ platform, label, Icon, placeholder }) => (
                      <div key={platform} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="flex items-center space-x-3">
                          <Icon size={22} className="text-primary-600" />
                          <div>
                            <p className="font-semibold text-dark-700">{label}</p>
                            <p className="text-sm text-dark-500">{t('linkPlaceholder')}</p>
                          </div>
                        </div>
                        <div className="md:col-span-2 flex space-x-3">
                          <div className="flex-1 relative">
                            <input
                              type="url"
                              value={socialForm[platform] || ''}
                              onChange={(e) => setSocialForm((prev) => ({ ...prev, [platform]: e.target.value }))}
                              placeholder={placeholder}
                              className="input-field border-2 border-primary-100 focus:border-primary-400 w-full"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setSocialForm((prev) => ({ ...prev, [platform]: '' }))}
                            className="px-4 py-2 text-sm text-dark-600 border border-secondary-200 rounded-lg hover:bg-secondary-100"
                          >
                            {t('clear') || 'Clear'}
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center justify-between bg-secondary-50 border border-primary-100 rounded-xl p-4">
                      <p className="text-dark-600">{t('leaveBlankToHide')}</p>
                      <button
                        type="submit"
                        disabled={savingSocial}
                        className="btn-primary"
                      >
                        {savingSocial ? t('saving') : t('saveLinks')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-white rounded-2xl shadow-warm-lg border border-primary-100 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-primary-500 mb-1 flex items-center space-x-2">
                      <Phone size={16} />
                      <span>{t('contact')}</span>
                    </p>
                    <h2 className="text-3xl font-bold text-dark-700">{t('contactInfo')}</h2>
                    <p className="text-dark-500 mt-1">{t('contactInfoSubtitle')}</p>
                  </div>
                </div>

                {contactLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSave} className="space-y-4">
                    {[{
                      key: 'email',
                      label: t('email'),
                      placeholder: 'contact@rescue.org',
                      Icon: Mail,
                      type: 'email',
                    }, {
                      key: 'phone',
                      label: t('phone'),
                      placeholder: '+1 555 555 5555',
                      Icon: Phone,
                      type: 'text',
                    }, {
                      key: 'whatsapp',
                      label: t('whatsapp'),
                      placeholder: '+1 555 555 5555',
                      Icon: MessageCircle,
                      type: 'text',
                    }, {
                      key: 'address',
                      label: t('address'),
                      placeholder: language === 'ar' ? 'أدخل العنوان' : 'Enter address',
                      Icon: MapPin,
                      type: 'text',
                    }].map(({ key, label, placeholder, Icon, type }) => (
                      <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="flex items-center space-x-3">
                          <Icon size={22} className="text-primary-600" />
                          <div>
                            <p className="font-semibold text-dark-700">{label}</p>
                            <p className="text-sm text-dark-500">{t('linkPlaceholder')}</p>
                          </div>
                        </div>
                        <div className="md:col-span-2 flex space-x-3">
                          <div className="flex-1 relative">
                            <input
                              type={type}
                              value={contactForm[key] || ''}
                              onChange={(e) => setContactForm((prev) => ({ ...prev, [key]: e.target.value }))}
                              placeholder={placeholder}
                              className="input-field border-2 border-primary-100 focus:border-primary-400 w-full"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setContactForm((prev) => ({ ...prev, [key]: '' }))}
                            className="px-4 py-2 text-sm text-dark-600 border border-secondary-200 rounded-lg hover:bg-secondary-100"
                          >
                            {t('clear') || 'Clear'}
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center justify-between bg-secondary-50 border border-primary-100 rounded-xl p-4">
                      <p className="text-dark-600">{t('leaveBlankToHide')}</p>
                      <button
                        type="submit"
                        disabled={savingContact}
                        className="btn-primary"
                      >
                        {savingContact ? t('saving') : t('save')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'banking' && (
              <div className="bg-white rounded-2xl shadow-warm-lg border border-primary-100 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-primary-500 mb-1 flex items-center space-x-2">
                      <DollarSign size={16} />
                      <span>{t('donations')}</span>
                    </p>
                    <h2 className="text-3xl font-bold text-dark-700">{t('bankingInfo')}</h2>
                    <p className="text-dark-500 mt-1">{t('bankingInfoSubtitle')}</p>
                  </div>
                </div>

                {bankingLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <form onSubmit={handleBankingSave} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-dark-700 mb-2">
                          {t('paypal')}
                        </label>
                        <input
                          type="text"
                          value={bankingForm.paypal_email || ''}
                          onChange={(e) => setBankingForm((prev) => ({ ...prev, paypal_email: e.target.value }))}
                          placeholder="https://www.paypal.me/yourname"
                          className="input-field border-2 border-primary-100 focus:border-primary-400 w-full"
                        />
                        <p className="text-xs text-dark-500 mt-1">{t('bankingInfoSubtitle')}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-dark-700 mb-2">
                          {t('bankRib')}
                        </label>
                        <textarea
                          value={bankingForm.bank_rib || ''}
                          onChange={(e) => setBankingForm((prev) => ({ ...prev, bank_rib: e.target.value }))}
                          placeholder={language === 'ar' ? 'أدخل معلومات البنك' : 'Enter bank account information (RIB format)'}
                          rows="4"
                          className="input-field border-2 border-primary-100 focus:border-primary-400 w-full resize-none"
                        />
                        <p className="text-xs text-dark-500 mt-1">
                          {language === 'ar' 
                            ? 'صيغة: 23 حرفًا وأرقام (رقم الحساب البنكي)'
                            : 'Format: 23 alphanumeric characters (IBAN/RIB format)'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-secondary-50 border border-primary-100 rounded-xl p-4">
                      <p className="text-dark-600">{t('leaveBlankToHide')}</p>
                      <button
                        type="submit"
                        disabled={savingBanking}
                        className="btn-primary"
                      >
                        {savingBanking ? t('saving') : t('save')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {watchingPost && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 py-6 gap-4">
          <div className="absolute inset-0 bg-dark-900/50 backdrop-blur-sm" onClick={closeWatchModal} />
          <button
            onClick={closeWatchModal}
            className="text-white hover:text-gray-200 font-semibold border border-primary-100 rounded-full px-4 py-2 bg-white/20 hover:bg-white/30 relative z-20"
          >
            {t('close')}
          </button>
          <div className="relative inline-flex rounded-3xl shadow-2xl overflow-hidden bg-white max-w-[90vw] z-10">
            <div className="relative bg-black p-3 flex items-center justify-center">
              {watchEmbedUrl && !watchIsFacebook ? (
                <div
                  className="relative"
                  style={{ width: 'min(90vw, 960px)', aspectRatio: '16 / 9' }}
                >
                  <iframe
                    title={watchModalTitle}
                    src={watchEmbedUrl}
                    className="absolute inset-0 w-full h-full rounded-xl"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    style={{ border: 'none' }}
                  />
                </div>
              ) : watchIsFacebook ? (
                <div className="relative flex flex-col items-center justify-center bg-black p-6 rounded-xl" style={{ width: 'min(90vw, 960px)', aspectRatio: '16 / 9' }}>
                  <div className="text-white text-center">
                    <p className="mb-4 text-lg font-semibold">{watchModalTitle}</p>
                    <p className="mb-6 text-sm text-gray-300">Facebook video embedding requires opening in a new window</p>
                    <a
                      href={watchingPost.media_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                    >
                      <ExternalLink size={18} />
                      {language === 'ar' ? 'شاهد على فيسبوك' : 'Watch on Facebook'}
                    </a>
                  </div>
                </div>
              ) : watchIsPortrait ? (
                <video
                  src={watchingPost.media_url}
                  className="max-h-[85vh] max-w-[90vw] w-auto h-auto object-contain bg-black rounded-xl"
                  autoPlay
                  controls
                  playsInline
                  onLoadedMetadata={(e) => {
                    const v = e.target;
                    setWatchIsPortrait(v.videoHeight > v.videoWidth);
                  }}
                />
              ) : (
                <div
                  className="relative"
                  style={{ width: 'min(90vw, 960px)', aspectRatio: '16 / 9' }}
                >
                  <video
                    src={watchingPost.media_url}
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                    autoPlay
                    controls
                    playsInline
                    onLoadedMetadata={(e) => {
                      const v = e.target;
                      setWatchIsPortrait(v.videoHeight > v.videoWidth);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-dark-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-warm-lg border border-red-100 p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-dark-700">{t('deletePost')}</h3>
                <p className="text-dark-500 mt-1">{t('confirmDelete')}</p>
                <p className="text-sm text-dark-600 mt-2 font-semibold">
                  {language === 'ar' ? deleteTarget.title_ar : deleteTarget.title_en}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="sm:flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl shadow-warm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {deleting ? t('deleting') : t('delete')}
              </button>
              <button
                onClick={closeDeleteConfirm}
                disabled={deleting}
                className="sm:flex-1 border border-primary-100 text-dark-700 px-4 py-3 rounded-xl hover:bg-secondary-50 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-dark-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-warm-lg border border-primary-100">
            <div className="p-6">
              <h2 className="text-3xl font-bold text-dark-700 mb-6">
                {editingPost ? t('editPost') : t('addPost')}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-dark-700 font-semibold mb-2">
                      {t('title')} (English)
                    </label>
                    <input
                      type="text"
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      required
                      className="input-field border-2 border-primary-100 focus:border-primary-400"
                    />
                  </div>
                  <div>
                    <label className="block text-dark-700 font-semibold mb-2">
                      {t('title')} (العربية)
                    </label>
                    <input
                      type="text"
                      value={formData.title_ar}
                      onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                      required
                      className="input-field border-2 border-primary-100 focus:border-primary-400"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-dark-700 font-semibold mb-2">
                      {t('description')} (English)
                    </label>
                    <textarea
                      value={formData.description_en}
                      onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                      rows="4"
                      className="input-field border-2 border-primary-100 focus:border-primary-400"
                    />
                  </div>
                  <div>
                    <label className="block text-dark-700 font-semibold mb-2">
                      {t('description')} (العربية)
                    </label>
                    <textarea
                      value={formData.description_ar}
                      onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                      rows="4"
                      className="input-field border-2 border-primary-100 focus:border-primary-400"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-dark-700 font-semibold mb-2">
                      {t('mediaType')}
                    </label>
                    <select
                      value={formData.media_type}
                      onChange={(e) => handleMediaTypeChange(e.target.value)}
                      className="input-field border-2 border-primary-100 focus:border-primary-400"
                      disabled={editingPost !== null}
                    >
                      <option value="image">{t('image')}</option>
                      <option value="video">{t('video')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-dark-700 font-semibold mb-2">
                      Media File {!editingPost && '(Required)'}
                    </label>
                    <input
                      type="file"
                      accept={formData.media_type === 'image' ? 'image/*' : 'video/*'}
                      onChange={(e) => setMediaFile(e.target.files[0])}
                      required={!editingPost && formData.media_type === 'image'}
                      className="input-field border-2 border-primary-100 focus:border-primary-400"
                    />
                  </div>
                </div>

                {formData.media_type === 'video' && (
                  <div className="mb-4">
                    <label className="block text-dark-700 font-semibold mb-2">
                      {t('videoUrlLabel')}
                    </label>
                    <input
                      type="url"
                      placeholder={t('videoUrlPlaceholder')}
                      value={formData.media_url}
                      onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                      className="input-field border-2 border-primary-100 focus:border-primary-400"
                    />
                    <p className="text-sm text-dark-500 mt-1">
                      {t('videoUrlHelper')}
                    </p>
                  </div>
                )}

                <div className="mb-6 p-4 bg-secondary-50 rounded-lg border border-primary-100">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="w-5 h-5 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-dark-700 font-semibold">{t('published')}</span>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex-1"
                  >
                    {submitting ? 'Saving...' : t('save')}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary flex-1"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`flex items-center space-x-3 rounded-2xl border px-4 py-3 shadow-warm-lg ${
              toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
              }`}
            />
            <span className="font-semibold">{toast.message}</span>
            <button
              onClick={clearToast}
              className="ml-2 text-xs font-semibold text-dark-500 hover:text-dark-700"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
