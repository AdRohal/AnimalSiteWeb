import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = '/favicon.ico';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Lock Icon */}
        <div className="flex justify-center mb-8">
          <div className="p-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full">
            <Lock size={64} className="text-white" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          404
        </h1>

        {/* Error Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {language === 'ar' ? 'الوصول مرفوض' : 'Access Denied'}
        </h2>

        {/* Error Description */}
        <p className="text-xl text-gray-300 mb-12 max-w-md mx-auto leading-relaxed">
          {language === 'ar'
            ? 'عذراً، يجب عليك تسجيل الدخول للوصول إلى لوحة التحكم. يرجى تسجيل الدخول أولاً.'
            : 'Sorry, you need to be logged in to access the admin dashboard. Please log in first.'}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
          >
            <Home size={20} />
            {language === 'ar' ? 'العودة للصفحة الرئيسية' : 'Return to Home'}
          </button>

          <button
            onClick={() => navigate('/admin/login')}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
          >
            <Lock size={20} />
            {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
          </button>
        </div>

        {/* Additional info */}
        <div className="text-gray-400 text-sm">
          <p>
            {language === 'ar'
              ? 'إذا كنت تعتقد أن هذا خطأ، يرجى التواصل معنا.'
              : 'If you believe this is an error, please contact us.'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
