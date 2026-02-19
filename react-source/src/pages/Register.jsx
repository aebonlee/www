import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { signUp } from '../utils/auth';
import '../styles/auth.css';

const Register = () => {
  const { t } = useLanguage();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '', displayName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (isLoggedIn) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.passwordConfirm) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    if (form.password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signUp(form.email, form.password, form.displayName);
      setSuccess(true);
    } catch (err) {
      setError(err.message || t('auth.signUpError'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">{t('auth.signUp')}</h1>
          </div>
        </section>
        <section className="auth-section">
          <div className="container">
            <div className="auth-card">
              <div className="auth-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h2>{t('auth.signUpSuccess')}</h2>
                <p>{t('auth.checkEmail')}</p>
                <Link to="/login" className="auth-submit-btn" style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>
                  {t('auth.goToLogin')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('auth.signUp')}</h1>
        </div>
      </section>

      <section className="auth-section">
        <div className="container">
          <div className="auth-card">
            <h2>{t('auth.signUpTitle')}</h2>
            <p className="auth-subtitle">{t('auth.signUpSubtitle')}</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-form-group">
                <label>{t('auth.displayName')}</label>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={e => setForm({ ...form, displayName: e.target.value })}
                  placeholder={t('auth.displayNamePlaceholder')}
                  required
                />
              </div>
              <div className="auth-form-group">
                <label>{t('auth.email')}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder={t('auth.emailPlaceholder')}
                  required
                />
              </div>
              <div className="auth-form-group">
                <label>{t('auth.password')}</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder={t('auth.passwordPlaceholder')}
                  minLength={6}
                  required
                />
              </div>
              <div className="auth-form-group">
                <label>{t('auth.passwordConfirm')}</label>
                <input
                  type="password"
                  value={form.passwordConfirm}
                  onChange={e => setForm({ ...form, passwordConfirm: e.target.value })}
                  placeholder={t('auth.passwordConfirmPlaceholder')}
                  required
                />
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? t('auth.signingUp') : t('auth.signUp')}
              </button>
            </form>

            <p className="auth-switch">
              {t('auth.hasAccount')}{' '}
              <Link to="/login">{t('auth.login')}</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
