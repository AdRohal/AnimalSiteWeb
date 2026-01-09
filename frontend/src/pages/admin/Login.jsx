import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LogIn, User, Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, admin, loading } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && admin) {
      navigate('/admin/dashboard');
    }
  }, [admin, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await login(formData.username, formData.password);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
    }

    setSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2em0wIDZjLTMuMzE0IDAtNiAyLjY4Ni02IDZzMi42ODYgNiA2IDYgNi0yLjY4NiA2LTYtMi42ODYtNi02LTZ6bTAgMzZjMy4zMTQgMCA2LTIuNjg2IDYtNnMtMi42ODYtNi02LTYtNiAyLjY4Ni02IDYgMi42ODYgNiA2IDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-2xl shadow-warm-lg p-8 border border-primary-200">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-warm">
              <LogIn size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-dark-700">Admin Login</h2>
            <p className="text-dark-500 mt-2">Animal Rescue Association</p>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-md">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-dark-700 font-semibold mb-2">
                <User size={18} className="inline mr-2 text-primary-600" />
                {t('username')}
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="input-field border-2 border-primary-100 focus:border-primary-400"
                placeholder="Enter username"
              />
            </div>

            <div className="mb-6">
              <label className="block text-dark-700 font-semibold mb-2">
                <Lock size={18} className="inline mr-2 text-primary-600" />
                {t('password')}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field border-2 border-primary-100 focus:border-primary-400"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>{t('login')}</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
