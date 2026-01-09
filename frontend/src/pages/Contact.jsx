import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-secondary-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-dark-700 mb-4">{t('contactTitle')}</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-dark-500">{t('contactSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-warm-lg p-8 fade-in border border-primary-100">
            <h2 className="text-3xl font-bold text-dark-700 mb-6">{t('send')}</h2>
            
            {submitted ? (
              <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6 shadow-md">
                <p className="font-semibold">✓ Thank you for your message!</p>
                <p className="text-sm">We'll get back to you soon.</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-dark-700 font-semibold mb-2">
                  {t('name')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field border-2 border-primary-100 focus:border-primary-400"
                  placeholder={t('name')}
                />
              </div>

              <div className="mb-6">
                <label className="block text-dark-700 font-semibold mb-2">
                  {t('email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field border-2 border-primary-100 focus:border-primary-400"
                  placeholder={t('email')}
                />
              </div>

              <div className="mb-6">
                <label className="block text-dark-700 font-semibold mb-2">
                  {t('message')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="input-field border-2 border-primary-100 focus:border-primary-400"
                  placeholder={t('message')}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-2">
                <Send size={20} />
                <span>{t('send')}</span>
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8 fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white rounded-2xl shadow-warm-lg p-8 border border-primary-100">
              <h2 className="text-3xl font-bold text-dark-700 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-warm">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-700 mb-1">Phone</h3>
                    <p className="text-dark-600">+123 456 7890</p>
                    <p className="text-dark-600">+123 456 7891</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-warm">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-700 mb-1">Email</h3>
                    <p className="text-dark-600">info@animalrescue.org</p>
                    <p className="text-dark-600">support@animalrescue.org</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-warm">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-700 mb-1">Address</h3>
                    <p className="text-dark-600">123 Rescue Street</p>
                    <p className="text-dark-600">City, State 12345</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white rounded-2xl shadow-warm-lg p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2em0wIDZjLTMuMzE0IDAtNiAyLjY4Ni02IDZzMi42ODYgNiA2IDYgNi0yLjY4NiA2LTYtMi42ODYtNi02LTZ6bTAgMzZjMy4zMTQgMCA2LTIuNjg2IDYtNnMtMi42ODYtNi02LTYtNiAyLjY4Ni02IDYgMi42ODYgNiA2IDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">Visit Us</h2>
                <p className="mb-4 text-secondary-50">Come visit our shelter and meet the animals!</p>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-4">
                  <p className="font-semibold text-lg mb-2">Opening Hours:</p>
                  <p className="text-secondary-100">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-secondary-100">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-secondary-100">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
