import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { colors } = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      padding: '2rem',
      transition: 'background-color 0.3s ease',
    },
    card: {
      backgroundColor: colors.cardBg,
      padding: '2.5rem',
      borderRadius: '12px',
      boxShadow: colors.darkMode ? '0 8px 16px rgba(0,0,0,0.4)' : '0 4px 6px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '420px',
      transition: 'all 0.3s ease',
      border: `1px solid ${colors.border}`,
    },
    title: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: colors.text,
      fontSize: '1.75rem',
      fontWeight: '600',
      transition: 'color 0.3s ease',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      fontSize: '0.95rem',
      color: colors.text,
      fontWeight: '500',
      transition: 'color 0.3s ease',
    },
    input: {
      padding: '0.875rem',
      border: `2px solid ${colors.border}`,
      borderRadius: '6px',
      fontSize: '1rem',
      backgroundColor: colors.inputBg,
      color: colors.text,
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    button: {
      backgroundColor: colors.primary,
      color: 'white',
      padding: '0.875rem',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1.05rem',
      cursor: 'pointer',
      marginTop: '0.5rem',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    error: {
      backgroundColor: colors.errorBg,
      color: colors.error,
      padding: '0.875rem',
      borderRadius: '6px',
      marginBottom: '1rem',
      textAlign: 'center',
      fontSize: '0.9rem',
    },
    link: {
      textAlign: 'center',
      marginTop: '1.5rem',
      color: colors.textSecondary,
      fontSize: '0.95rem',
    },
    linkText: {
      color: colors.primary,
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'opacity 0.2s ease',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 تسجيل الدخول</h2>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>📧 البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>🔒 كلمة المرور</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = colors.primaryHover)}
            onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
          >
            {loading ? '⏳ جاري تسجيل الدخول...' : '✅ دخول'}
          </button>
        </form>

        <p style={styles.link}>
          ليس لديك حساب؟{' '}
          <Link 
            to="/register" 
            style={styles.linkText}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;