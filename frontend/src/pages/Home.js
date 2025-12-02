import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getRelativeTime, getWordCount, getReadingTime, truncateText } from '../utils/helpers';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [currentPage, search]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postsAPI.getAll({ search, page: currentPage, limit: 10 });
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل المقالات');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المقال؟')) return;

    try {
      await postsAPI.delete(id);
      fetchPosts();
    } catch (err) {
      alert('حدث خطأ أثناء حذف المقال');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
  };

  const styles = {
    container: {
      maxWidth: '100%',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: colors.background,
      minHeight: 'calc(100vh - 64px)',
      transition: 'background-color 0.3s ease',
    },
    header: {
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2.25rem',
      color: colors.text,
      marginBottom: '1.5rem',
      transition: 'color 0.3s ease',
      fontWeight: '700',
    },
    searchForm: {
      display: 'flex',
      gap: '0.75rem',
      maxWidth: '600px',
    },
    searchInput: {
      flex: 1,
      padding: '0.875rem 1rem',
      border: `2px solid ${colors.border}`,
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: colors.inputBg,
      color: colors.text,
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    searchButton: {
      backgroundColor: colors.primary,
      color: 'white',
      padding: '0.875rem 1.75rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: '600',
      fontSize: '1rem',
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      color: colors.textSecondary,
      fontSize: '1.1rem',
    },
    error: {
      backgroundColor: colors.errorBg,
      color: colors.error,
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    noData: {
      textAlign: 'center',
      color: colors.textSecondary,
      fontSize: '1.2rem',
      padding: '3rem',
    },
    postsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '1.75rem',
      marginBottom: '2rem',
    },
    postCard: {
      backgroundColor: colors.cardBg,
      padding: '1.75rem',
      borderRadius: '12px',
      boxShadow: colors.darkMode ? '0 4px 8px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.08)',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    postTitle: {
      fontSize: '1.35rem',
      color: colors.text,
      marginBottom: '0.5rem',
      transition: 'color 0.3s ease',
      fontWeight: '600',
      lineHeight: '1.4',
    },
    postContent: {
      color: colors.textSecondary,
      lineHeight: '1.7',
      marginBottom: '1rem',
      transition: 'color 0.3s ease',
      fontSize: '0.95rem',
    },
    statsBar: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      fontSize: '0.85rem',
      color: colors.textSecondary,
      paddingBottom: '1rem',
      borderBottom: `1px solid ${colors.border}`,
      flexWrap: 'wrap',
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
    },
    postMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.875rem',
      color: colors.textSecondary,
      marginTop: 'auto',
      paddingTop: '0.5rem',
    },
    author: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      fontWeight: '500',
    },
    timeAgo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      fontStyle: 'italic',
    },
    actions: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: `1px solid ${colors.border}`,
    },
    editButton: {
      backgroundColor: colors.success,
      color: 'white',
      padding: '0.6rem 1.2rem',
      borderRadius: '6px',
      textDecoration: 'none',
      fontSize: '0.9rem',
      transition: 'all 0.2s ease',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
    },
    deleteButton: {
      backgroundColor: colors.error,
      color: 'white',
      padding: '0.6rem 1.2rem',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      transition: 'all 0.2s ease',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1.25rem',
      marginTop: '3rem',
      paddingTop: '2rem',
      borderTop: `2px solid ${colors.border}`,
    },
    pageButton: {
      backgroundColor: colors.primary,
      color: 'white',
      padding: '0.7rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: '600',
      fontSize: '0.95rem',
    },
    pageInfo: {
      color: colors.text,
      fontWeight: '600',
      fontSize: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📚 المقالات</h1>
        
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="🔍 ابحث عن مقال..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => e.target.style.borderColor = colors.primary}
            onBlur={(e) => e.target.style.borderColor = colors.border}
          />
          <button 
            type="submit" 
            style={styles.searchButton}
            onMouseEnter={(e) => e.target.style.backgroundColor = colors.primaryHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
          >
            بحث
          </button>
        </form>
      </div>

      {loading && <div style={styles.loading}>⏳ جاري التحميل...</div>}
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.postsGrid}>
        {posts.length === 0 && !loading && (
          <p style={styles.noData}>📭 لا توجد مقالات حالياً</p>
        )}

        {posts.map((post) => (
          <div 
            key={post._id} 
            style={styles.postCard}
            onClick={() => navigate(`/post/${post._id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = colors.darkMode 
                ? '0 12px 24px rgba(0,0,0,0.5)' 
                : '0 8px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = colors.darkMode 
                ? '0 4px 8px rgba(0,0,0,0.3)' 
                : '0 2px 6px rgba(0,0,0,0.08)';
            }}
          >
            <h3 style={styles.postTitle}>{post.title}</h3>
            
            <div style={styles.statsBar}>
              <span style={styles.statItem}>
                📝 {getWordCount(post.content)} كلمة
              </span>
              <span style={styles.statItem}>
                ⏱️ {getReadingTime(post.content)}
              </span>
            </div>

            <p style={styles.postContent}>
              {truncateText(post.content, 150)}
            </p>

            <div style={styles.postMeta}>
              <span style={styles.author}>
                👤 {post.author?.username}
              </span>
              <span style={styles.timeAgo}>
                🕐 {getRelativeTime(post.createdAt)}
              </span>
            </div>

            {user && user.id === post.author?._id && (
              <div style={styles.actions}>
                <Link 
                  to={`/edit/${post._id}`} 
                  style={styles.editButton}
                  onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  ✏️ تعديل
                </Link>
                <button 
                  onClick={() => handleDelete(post._id)} 
                  style={styles.deleteButton}
                  onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  🗑️ حذف
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              ...styles.pageButton,
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => currentPage !== 1 && (e.target.style.backgroundColor = colors.primaryHover)}
            onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
          >
            ← السابق
          </button>
          <span style={styles.pageInfo}>
            صفحة {currentPage} من {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              ...styles.pageButton,
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => currentPage !== totalPages && (e.target.style.backgroundColor = colors.primaryHover)}
            onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
          >
            التالي →
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;