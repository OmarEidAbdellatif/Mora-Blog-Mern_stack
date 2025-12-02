import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { colors, darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const styles = {
    nav: {
      backgroundColor: colors.navBg,
      padding: '1rem 0',
      boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      textDecoration: 'none',
      transition: 'transform 0.2s',
    },
    links: {
      display: 'flex',
      gap: '1.5rem',
      alignItems: 'center',
    },
    link: {
      color: 'white',
      textDecoration: 'none',
      fontSize: '1rem',
      transition: 'opacity 0.2s',
    },
    username: {
      color: 'white',
      fontSize: '0.9rem',
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: '0.4rem 0.8rem',
      borderRadius: '20px',
    },
    button: {
      backgroundColor: '#962626ff',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '15px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    themeToggle: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      color: 'white',
      border: 'none',
      padding: '0.5rem 0.8rem',
      borderRadius: '50%',
      cursor: 'pointer',
      fontSize: '1.2rem',
      transition: 'all 0.2s',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>Mora Blog </Link>
        
        <div style={styles.links}>
          <Link to="/" style={styles.link}>الرئيسية</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/create" style={styles.link}>مقال جديد</Link>
              <Link to="/profile" style={styles.link}>حسابي</Link>
              <span style={styles.username}>مرحباً، {user?.username}</span>
              <button onClick={handleLogout} style={styles.button}>تسجيل الخروج</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>تسجيل الدخول</Link>
              <Link to="/register" style={styles.link}>إنشاء حساب</Link>
            </>
          )}
          
          <button 
            onClick={toggleDarkMode} 
            style={styles.themeToggle}
            title={darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;