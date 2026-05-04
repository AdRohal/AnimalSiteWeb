import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Heart, PhoneCall, PawPrint } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSocial } from '../contexts/SocialContext';
import api from '../utils/api';
import MediaCard from '../components/MediaCard';
import { fallbackPosts } from '../utils/fallbackData';

const Home = () => {
  const { language } = useLanguage();
  const { links } = useSocial();
  const [posts, setPosts] = useState(fallbackPosts);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/posts?limit=6&published=true');
        setPosts(response.data.posts?.length ? response.data.posts : fallbackPosts);
      } catch {
        setPosts(fallbackPosts);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary-100 via-white to-primary-100 py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-primary-100 text-primary-700 px-4 py-1 text-sm font-semibold">Animal Association Portfolio</span>
            <h1 className="text-4xl md:text-6xl font-bold text-dark-700 leading-tight">
              {language === 'ar' ? 'نُنقذ الأرواح ونبني مستقبلاً أفضل للحيوانات' : 'Rescuing lives and building a safer future for animals'}
            </h1>
            <p className="text-dark-500 text-lg">
              {language === 'ar' ? 'تعرف على قصص الإنقاذ، برامج الرعاية، وكيف يمكن أن تكون جزءًا من الأثر.' : 'Discover rescue stories, daily care, and how your support creates real impact.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/donations" className="btn-primary text-center">Support with PayPal</Link>
              <a href="tel:+15552367788" className="btn-secondary text-center">Call to Support</a>
            </div>
          </div>
          <div className="rounded-[28px] overflow-hidden shadow-warm-lg border border-primary-200">
            <img src="/logo.png" alt="Association logo" className="w-full h-[340px] md:h-[440px] object-cover bg-secondary-50" />
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[{ icon: PawPrint, t: '128+ Animals Rescued' }, { icon: HeartHandshake, t: '24/7 Care Team' }, { icon: Heart, t: 'Community Volunteers' }, { icon: PhoneCall, t: 'Fast Emergency Response' }].map((item) => (
            <div key={item.t} className="card p-6 border border-primary-100">
              <item.icon className="text-primary-600 mb-3" />
              <p className="font-semibold text-dark-700">{item.t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-dark-700">Recent Stories</h2>
            <Link to="/gallery" className="text-primary-700 font-semibold">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {posts.slice(0, 6).map((post) => <MediaCard key={post.id} post={post} />)}
          </div>
        </div>
      </section>

      {links.length > 0 && <section className="py-10 bg-white"><div className="container mx-auto px-4 text-center text-dark-500">Follow our work on social platforms and YouTube updates.</div></section>}
    </div>
  );
};

export default Home;
