import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useBanking } from '../contexts/BankingContext';
import { Heart, Copy, Check } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      {/* Header Section */}
      <section className="relative py-12 md:py-16 bg-gradient-to-r from-primary-500/10 via-secondary-50 to-primary-500/10 border-b-2 border-primary-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Heart size={32} className="text-primary-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-dark-700">
                {language === 'ar' ? 'ساعدنا بتبرعك' : 'Support Our Cause'}
              </h1>
            </div>
            <p className="text-lg text-dark-500 max-w-2xl mx-auto">
              {language === 'ar'
                ? 'تبرعاتك تساعدنا في إنقاذ وإيواء الحيوانات المحتاجة. اختر الطريقة التي تناسبك للتبرع.'
                : 'Your donations help us rescue and shelter animals in need. Choose the donation method that works best for you.'}
            </p>
          </div>
        </div>
      </section>

      {/* Donations Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : banking?.paypal_email || banking?.bank_rib ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* PayPal Card */}
              {banking?.paypal_email && (
                <div className="bg-white rounded-3xl shadow-warm-lg border-2 border-primary-100 p-8 hover:shadow-2xl transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-dark-700 mb-1">PayPal</h2>
                      <p className="text-sm text-dark-500">{language === 'ar' ? 'تبرع عبر PayPal' : 'Donate via PayPal'}</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.343 5h4.535c2.546 0 4.471 1.799 4.471 4.41 0 1.619-.727 2.946-2.264 3.666.88.572 1.511 1.588 1.511 2.828 0 2.406-1.946 4.096-4.614 4.096H8.343l2.169-14zm2.169 2.076l-.984 6.234h2.497c1.657 0 2.777-.971 2.777-2.351 0-1.278-.828-1.881-2.202-1.881h-2.088zm-.984 8.31l-.878 5.573h2.497c1.763 0 2.92-.914 2.92-2.405 0-1.62-1.16-2.548-2.857-2.548h-1.682z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="bg-secondary-50 rounded-xl p-4 mb-6">
                    <p className="text-xs text-dark-500 uppercase tracking-[0.2em] mb-2">
                      {language === 'ar' ? 'بريد إلكتروني' : 'Email Address'}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-dark-700 break-all">{banking.paypal_email}</p>
                      <button
                        onClick={() => handleCopy(banking.paypal_email, 'paypal')}
                        className="ml-3 p-2 text-primary-600 hover:bg-white rounded-lg transition-colors"
                      >
                        {copiedField === 'paypal' ? (
                          <Check size={20} className="text-green-600" />
                        ) : (
                          <Copy size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <a
                    href={banking.paypal_email.startsWith('http') ? banking.paypal_email : `https://www.paypal.me/${banking.paypal_email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-center block"
                  >
                    {language === 'ar' ? 'تبرع الآن' : 'Donate Now'}
                  </a>
                </div>
              )}

              {/* Bank Transfer Card */}
              {banking?.bank_rib && (
                <div className="bg-white rounded-3xl shadow-warm-lg border-2 border-primary-100 p-8 hover:shadow-2xl transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-dark-700 mb-1">
                        {language === 'ar' ? 'التحويل البنكي' : 'Bank Transfer'}
                      </h2>
                      <p className="text-sm text-dark-500">{language === 'ar' ? 'تبرع عبر البنك' : 'Direct bank transfer'}</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                      </svg>
                    </div>
                  </div>

                  <div className="bg-secondary-50 rounded-xl p-4 mb-6">
                    <p className="text-xs text-dark-500 uppercase tracking-[0.2em] mb-2">
                      {language === 'ar' ? 'رقم الحساب البنكي (RIB)' : 'Bank Account (RIB)'}
                    </p>
                    <div className="flex items-start justify-between">
                      <p className="font-mono text-sm text-dark-700 break-all whitespace-pre-wrap">{banking.bank_rib}</p>
                      <button
                        onClick={() => handleCopy(banking.bank_rib, 'rib')}
                        className="ml-3 p-2 text-primary-600 hover:bg-white rounded-lg transition-colors flex-shrink-0"
                      >
                        {copiedField === 'rib' ? (
                          <Check size={20} className="text-green-600" />
                        ) : (
                          <Copy size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 text-sm text-dark-600">
                    <p className="font-semibold text-dark-700 mb-2">
                      {language === 'ar' ? '📝 تعليمات التحويل:' : '📝 Transfer Instructions:'}
                    </p>
                    <ul className="space-y-1 text-xs">
                      <li>{language === 'ar' ? '• انسخ رقم الحساب أعلاه' : '• Copy the account number above'}</li>
                      <li>{language === 'ar' ? '• قم بتسجيل الدخول إلى حسابك البنكي' : '• Log in to your bank account'}</li>
                      <li>{language === 'ar' ? '• اختر تحويل أموال' : '• Select transfer funds'}</li>
                      <li>{language === 'ar' ? '• الصق الرقم وأكمل التحويل' : '• Paste the account and complete'}</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl shadow-warm-lg border-2 border-primary-100">
              <Heart size={48} className="mx-auto text-primary-200 mb-4" />
              <h3 className="text-2xl font-bold text-dark-700 mb-2">
                {language === 'ar' ? 'لا توجد معلومات تبرع متاحة' : 'No Donation Information Available'}
              </h3>
              <p className="text-dark-500">
                {language === 'ar'
                  ? 'يرجى العودة لاحقاً أو التواصل معنا مباشرة'
                  : 'Please come back later or contact us directly'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-16 bg-white border-t-2 border-primary-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-dark-700 mb-12">
            {language === 'ar' ? 'لماذا تبرع؟' : 'Why Donate?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">🐾</div>
              <h3 className="text-xl font-bold text-dark-700 mb-2">
                {language === 'ar' ? 'إنقاذ الحيوانات' : 'Rescue Animals'}
              </h3>
              <p className="text-dark-500 text-sm">
                {language === 'ar'
                  ? 'تبرعاتك تساعدنا في إنقاذ الحيوانات المحتاجة من الشارع'
                  : 'Your donations help us rescue animals in need'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-bold text-dark-700 mb-2">
                {language === 'ar' ? 'الرعاية الطبية' : 'Medical Care'}
              </h3>
              <p className="text-dark-500 text-sm">
                {language === 'ar'
                  ? 'نوفر العلاج البيطري والرعاية الصحية للحيوانات'
                  : 'We provide veterinary care and medical treatment'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-bold text-dark-700 mb-2">
                {language === 'ar' ? 'توفير المأوى' : 'Safe Shelter'}
              </h3>
              <p className="text-dark-500 text-sm">
                {language === 'ar'
                  ? 'نوفر بيئة آمنة ومريحة للحيوانات'
                  : 'We provide safe and comfortable shelter'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donations;
