import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useBanking } from '../contexts/BankingContext';
import { Heart, Copy, Check, PawPrint, Stethoscope, Home as HomeIcon, CreditCard, Landmark, Info } from 'lucide-react';

const Donations = () => {
  const { t, language } = useLanguage();
  const { banking, loading } = useBanking();
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="py-12 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center space-y-6 mb-16 fade-in">
          <div className="inline-flex items-center justify-center gap-3 glass-panel px-6 py-3 rounded-full border-white/80 animate-float">
            <Heart size={24} className="text-primary-600" />
            <span className="font-semibold text-primary-700">
              {language === 'ar' ? 'ساهم في إنقاذهم' : 'Help Save Them'}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-dark-800 tracking-tight">
            {language === 'ar' ? 'ساعدنا بتبرعك' : 'Support Our Cause'}
          </h1>
          <p className="text-xl text-dark-600 max-w-2xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'تبرعاتك تساعدنا في إنقاذ وإيواء الحيوانات المحتاجة. اختر الطريقة التي تناسبك للتبرع.'
              : 'Your donations help us rescue and shelter animals in need. Choose the donation method that works best for you.'}
          </p>
        </div>

        {/* Donations Section */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
          </div>
        ) : banking?.paypal_email || banking?.bank_rib ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20 relative z-10">
            {/* PayPal Card */}
            {banking?.paypal_email && (
              <div className="glass-panel rounded-[40px] p-8 md:p-10 hover:-translate-y-2 transition-transform duration-500 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-dark-800 mb-1">PayPal</h2>
                    <p className="text-dark-500 font-medium">{language === 'ar' ? 'تبرع عبر الإنترنت' : 'Online Donation'}</p>
                  </div>
                  <div className="w-20 h-20 bg-white/60 border border-white/80 rounded-[24px] flex items-center justify-center shadow-sm">
                    <CreditCard size={40} className="text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-white/50 border border-white/60 rounded-2xl p-5 mb-8 flex-1">
                  <p className="text-xs text-dark-500 uppercase tracking-widest font-bold mb-3">
                    {language === 'ar' ? 'بريد إلكتروني' : 'Email Address'}
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-mono text-dark-800 text-lg font-bold break-all">{banking.paypal_email}</p>
                    <button
                      onClick={() => handleCopy(banking.paypal_email, 'paypal')}
                      className="p-3 bg-white hover:bg-primary-50 rounded-xl transition-colors shadow-sm flex-shrink-0"
                    >
                      {copiedField === 'paypal' ? <Check size={24} className="text-green-600" /> : <Copy size={24} className="text-primary-600" />}
                    </button>
                  </div>
                </div>

                <a
                  href={banking.paypal_email.startsWith('http') ? banking.paypal_email : `https://www.paypal.me/${banking.paypal_email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-button w-full bg-blue-600/90 hover:bg-blue-600 text-white border-blue-400 text-center text-lg py-4"
                >
                  {language === 'ar' ? 'تبرع الآن' : 'Donate Now'}
                </a>
              </div>
            )}

            {/* Bank Transfer Card */}
            {banking?.bank_rib && (
              <div className="glass-panel rounded-[40px] p-8 md:p-10 hover:-translate-y-2 transition-transform duration-500 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-dark-800 mb-1">
                      {language === 'ar' ? 'تحويل بنكي' : 'Bank Transfer'}
                    </h2>
                    <p className="text-dark-500 font-medium">{language === 'ar' ? 'إيداع مباشر' : 'Direct Deposit'}</p>
                  </div>
                  <div className="w-20 h-20 bg-white/60 border border-white/80 rounded-[24px] flex items-center justify-center shadow-sm">
                    <Landmark size={40} className="text-primary-600" />
                  </div>
                </div>

                <div className="bg-white/50 border border-white/60 rounded-2xl p-5 mb-8 flex-1">
                  <p className="text-xs text-dark-500 uppercase tracking-widest font-bold mb-3">
                    {language === 'ar' ? 'رقم الحساب البنكي (RIB)' : 'Bank Account (RIB)'}
                  </p>
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-mono text-dark-800 text-lg font-bold break-all whitespace-pre-wrap">{banking.bank_rib}</p>
                    <button
                      onClick={() => handleCopy(banking.bank_rib, 'rib')}
                      className="p-3 bg-white hover:bg-primary-50 rounded-xl transition-colors shadow-sm flex-shrink-0"
                    >
                      {copiedField === 'rib' ? <Check size={24} className="text-green-600" /> : <Copy size={24} className="text-primary-600" />}
                    </button>
                  </div>
                </div>

                <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl p-5 text-sm text-dark-700 font-medium">
                  <p className="font-bold text-primary-800 mb-2 flex items-center gap-2">
                    <Info size={18} className="text-primary-600" />
                    {language === 'ar' ? 'تعليمات التحويل:' : 'Transfer Instructions:'}
                  </p>
                  <ul className="space-y-2">
                    <li>{language === 'ar' ? '• انسخ رقم الحساب أعلاه' : '• Copy the account number above'}</li>
                    <li>{language === 'ar' ? '• قم بتسجيل الدخول إلى حسابك البنكي' : '• Log in to your bank account'}</li>
                    <li>{language === 'ar' ? '• اختر تحويل أموال وأكمل العملية' : '• Select transfer funds and complete'}</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-panel rounded-[40px] p-20 text-center max-w-3xl mx-auto mb-20 animate-float-slow">
            <div className="w-24 h-24 bg-white/60 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Heart size={48} className="text-primary-300" />
            </div>
            <h3 className="text-3xl font-bold text-dark-800 mb-4">
              {language === 'ar' ? 'لا توجد معلومات تبرع متاحة' : 'No Donation Information Available'}
            </h3>
            <p className="text-dark-600 text-lg">
              {language === 'ar'
                ? 'يرجى العودة لاحقاً أو التواصل معنا مباشرة'
                : 'Please come back later or contact us directly'}
            </p>
          </div>
        )}

        {/* Why Donate Section */}
        <div className="glass-panel rounded-[40px] p-10 md:p-16 mb-8 text-center relative z-10 animate-float-delayed">
          <h2 className="text-4xl font-extrabold text-dark-800 mb-12">
            {language === 'ar' ? 'لماذا تتبرع؟' : 'Why Donate?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="group">
              <div className="w-24 h-24 bg-white/60 border border-white/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 group-hover:bg-primary-100/50 transition-all duration-300">
                <PawPrint size={48} className="text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-dark-800 mb-3">
                {language === 'ar' ? 'إنقاذ الحيوانات' : 'Rescue Animals'}
              </h3>
              <p className="text-dark-600 leading-relaxed font-medium">
                {language === 'ar'
                  ? 'تبرعاتك تساعدنا في إنقاذ الحيوانات المحتاجة من الشارع وتوفير حياة كريمة لها'
                  : 'Your donations help us rescue animals from the streets and give them a decent life'}
              </p>
            </div>
            <div className="group">
              <div className="w-24 h-24 bg-white/60 border border-white/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 group-hover:bg-primary-100/50 transition-all duration-300">
                <Stethoscope size={48} className="text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-dark-800 mb-3">
                {language === 'ar' ? 'الرعاية الطبية' : 'Medical Care'}
              </h3>
              <p className="text-dark-600 leading-relaxed font-medium">
                {language === 'ar'
                  ? 'نوفر العلاج البيطري والرعاية الصحية والأدوية اللازمة للحيوانات المريضة'
                  : 'We provide veterinary care, health checkups, and necessary medicines'}
              </p>
            </div>
            <div className="group">
              <div className="w-24 h-24 bg-white/60 border border-white/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 group-hover:bg-primary-100/50 transition-all duration-300">
                <HomeIcon size={48} className="text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-dark-800 mb-3">
                {language === 'ar' ? 'توفير المأوى' : 'Safe Shelter'}
              </h3>
              <p className="text-dark-600 leading-relaxed font-medium">
                {language === 'ar'
                  ? 'نبني ونحافظ على بيئة آمنة ومريحة للحيوانات في انتظار التبني'
                  : 'We build and maintain a safe, comfortable environment while they wait for adoption'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donations;
