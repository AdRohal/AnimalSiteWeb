import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Lock, AlertTriangle } from 'lucide-react';
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
    <div className="min-h-screen py-12 px-4 relative overflow-hidden flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto relative z-10">
        
        <div className="glass-panel rounded-[40px] p-10 md:p-16 text-center animate-float-slow relative overflow-hidden">
          {/* Subtle background decoration inside the card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl z-0 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-300/30 rounded-full blur-3xl z-0 pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Lock Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-3xl bg-white/60 border border-white/80 shadow-sm flex items-center justify-center">
                <AlertTriangle size={48} className="text-primary-600 drop-shadow-sm" />
              </div>
            </div>

            {/* Error Code */}
            <h1 className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary-500 to-primary-800 drop-shadow-sm mb-4">
              404
            </h1>

            {/* Error Title */}
            <h2 className="text-4xl font-bold text-dark-800 mb-6">
              {language === 'ar' ? 'الوصول مرفوض أو الصفحة غير موجودة' : 'Access Denied or Not Found'}
            </h2>

            {/* Error Description */}
            <p className="text-xl text-dark-600 mb-12 max-w-lg mx-auto leading-relaxed font-medium">
              {language === 'ar'
                ? 'عذراً، ربما تكون قد فقدت طريقك أو تحتاج إلى تسجيل الدخول للوصول إلى هذه الصفحة.'
                : 'Sorry, you might have lost your way or need to be logged in to access this page.'}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="glass-button bg-primary-500/90 hover:bg-primary-600 text-white border-primary-400 flex items-center justify-center gap-3 px-8 py-4 text-lg w-full sm:w-auto"
              >
                <Home size={24} />
                {language === 'ar' ? 'العودة للصفحة الرئيسية' : 'Return to Home'}
              </button>

              <button
                onClick={() => navigate('/admin/login')}
                className="glass-button flex items-center justify-center gap-3 px-8 py-4 text-lg w-full sm:w-auto"
              >
                <Lock size={24} className="text-primary-600" />
                {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
