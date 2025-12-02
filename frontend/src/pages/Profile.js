import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usersAPI, postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getRelativeTime, getWordCount, getReadingTime, truncateText } from '../utils/helpers';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [updating, setUpdating] = useState(false);
  const { user, login, logout } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchMyPosts();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await usersAPI.getProfile();
      setProfile(response.data);
      setNewUsername(response.data.user.username);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPosts = async () => {
    try {
      const response = await usersAPI.getMyPosts({ page: 1, limit: 50 });
      setPosts(response.data.posts);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await usersAPI.updateProfile({ username: newUsername });
      
      // تحديث البيانات في localStorage و Context
      const updatedUser = { ...user, username: newUsername };
      const token = localStorage.getItem('token');
      login(token, updatedUser);
      
      setProfile({ ...profile, user: response.data.user });
      setEditMode(false);
      alert('تم تحديث البيانات بنجاح ✅');
    } catch (err) {
      alert(err.response?.data?.message || 'حدث خطأ أثناء التحديث');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المقال؟')) return;

    try {
      await postsAPI.delete(id);
      fetchMyPosts();
      fetchProfile(); // لتحديث الإحصائيات
    } catch (err) {
      alert('حدث خطأ أثناء حذف المقال');
    }
  };

  const styles = {
    container: {
      backgroundColor: colors.background,
      minHeight: 'calc(100vh - 64px)',
      padding: '2rem 0',
      transition: 'background-color 0.3s ease',
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
    },
    profileCard: {
      backgroundColor: colors.cardBg,
      padding: '2.5rem',
      borderRadius: '16px',
      boxShadow: colors.darkMode ? '0 8px 20px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
      border: `1px solid ${colors.border}`,
      marginBottom: '2rem',
      transition: 'all 0.3s ease',
    },
    profileHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
    },
    avatar: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: colors.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '3rem',
      color: 'white',
      fontWeight: 'bold',
    },
    profileInfo: {
      flex: 1,
    },
    username: {
      fontSize: '2rem',
      color: colors.text,
      marginBottom: '0.5rem',
      fontWeight: '700',
      transition: 'color 0.3s ease',
    },
    email: {
      fontSize: '1rem',
      color: colors.textSecondary,
      marginBottom: '0.5rem',
    },
    memberSince: {
      fontSize: '0.9rem',
      color: colors.textSecondary,
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    statCard: {
      backgroundColor: colors.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      padding: '1.5rem',
      borderRadius: '12px',
      textAlign: 'center',
      border: `1px solid ${colors.border}`,
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: '700',
      color: colors.primary,
      marginBottom: '0.5rem',
    },
    statLabel: {
      fontSize: '0.9rem',
      color: colors.textSecondary,
    },
    editButton: {
      backgroundColor: colors.primary,
      color: 'white',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    editForm: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      marginTop: '1rem',
      flexWrap: 'wrap',
    },
    input: {
      padding: '0.75rem',
      border: `2px solid ${colors.border}`,
      borderRadius: '6px',
      fontSize: '1rem',
      backgroundColor: colors.inputBg,
      color: colors.text,
      flex: 1,
      minWidth: '200px',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    saveButton: {
      backgroundColor: colors.success,
      color: 'white',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    cancelButton: {
      backgroundColor: colors.buttonSecondary,
      color: 'white',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    sectionTitle: {
      fontSize: '1.75rem',
      color: colors.text,
      marginBottom: '1.5rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    postsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '1.75rem',
    },
    postCard: {
      backgroundColor: colors.cardBg,
      padding: '1.75rem',
      borderRadius: '12px',
      boxShadow: colors.darkMode ? '0 4px 8px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.08)',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    postTitle: {
      fontSize: '1.35rem',
      color: colors.text,
      marginBottom: '0.75rem',
      fontWeight: '600',
      lineHeight: '1.4',
    },
    postContent: {
      color: colors.textSecondary,
      lineHeight: '1.7',
      marginBottom: '1rem',
      fontSize: '0.95rem',
    },
    postStats: {
      display: 'flex',
      gap: '1rem',
      fontSize: '0.85rem',
      color: colors.textSecondary,
      marginBottom: '1rem',
      paddingBottom: '1rem',
      borderBottom: `1px solid ${colors.border}`,
    },
    postActions: {
      display: 'flex',
      gap: '0.75rem',
    },
    viewButton: {
      backgroundColor: colors.primary,
      color: 'white',
      padding: '0.6rem 1.2rem',
      borderRadius: '6px',
      textDecoration: 'none',
      fontSize: '0.9rem',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      transition: 'all 0.2s ease',
    },
    editPostButton: {
      backgroundColor: colors.success,
      color: 'white',
      padding: '0.6rem 1.2rem',
      borderRadius: '6px',
      textDecoration: 'none',
      fontSize: '0.9rem',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      transition: 'all 0.2s ease',
    },
    deletePostButton: {
      backgroundColor: colors.error,
      color: 'white',
      padding: '0.6rem 1.2rem',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      transition: 'all 0.2s ease',
    },
    noPosts: {
      textAlign: 'center',
      color: colors.textSecondary,
      padding: '3rem',
      fontSize: '1.1rem',
      backgroundColor: colors.cardBg,
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
    },
    loading: {
      textAlign: 'center',
      padding: '4rem',
      color: colors.textSecondary,
      fontSize: '1.2rem',
    },
    error: {
      backgroundColor: colors.errorBg,
      color: colors.error,
      padding: '1.5rem',
      borderRadius: '8px',
      textAlign: 'center',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <div style={styles.loading}>⏳ جاري تحميل الملف الشخصي...</div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <div style={styles.error}>{error || 'حدث خطأ'}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.avatar}>
              {profile.user.username.charAt(0).toUpperCase()}
            </div>
            <div style={styles.profileInfo}>
              <h1 style={styles.username}>{profile.user.username}</h1>
              <p style={styles.email}>📧 {profile.user.email}</p>
              <p style={styles.memberSince}>
                📅 عضو منذ {new Date(profile.user.createdAt).toLocaleDateString('ar-EG', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{profile.stats.postsCount}</div>
              <div style={styles.statLabel}>📝 مقال</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{profile.stats.totalLikes}</div>
              <div style={styles.statLabel}>❤️ إعجاب</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{profile.stats.totalComments}</div>
              <div style={styles.statLabel}>💬 تعليق</div>
            </div>
          </div>

          {!editMode ? (
            <button 
              onClick={() => setEditMode(true)}
              style={styles.editButton}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              ✏️ تعديل الملف الشخصي
            </button>
          ) : (
            <form onSubmit={handleUpdateProfile} style={styles.editForm}>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="اسم المستخدم"
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = colors.border}
              />
              <button 
                type="submit" 
                disabled={updating}
                style={{
                  ...styles.saveButton,
                  opacity: updating ? 0.7 : 1,
                  cursor: updating ? 'not-allowed' : 'pointer',
                }}
              >
                {updating ? '⏳ جاري الحفظ...' : '✅ حفظ'}
              </button>
              <button 
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setNewUsername(profile.user.username);
                }}
                style={styles.cancelButton}
              >
                ❌ إلغاء
              </button>
            </form>
          )}
        </div>

        <h2 style={styles.sectionTitle}>📚 مقالاتي</h2>

        {posts.length > 0 ? (
          <div style={styles.postsGrid}>
            {posts.map((post) => (
              <div 
                key={post._id} 
                style={styles.postCard}
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
                <p style={styles.postContent}>{truncateText(post.content, 120)}</p>
                
                <div style={styles.postStats}>
                  <span>📝 {getWordCount(post.content)} كلمة</span>
                  <span>❤️ {post.likes?.length || 0}</span>
                  <span>💬 {post.comments?.length || 0}</span>
                  <span>🕐 {getRelativeTime(post.createdAt)}</span>
                </div>

                <div style={styles.postActions}>
                  <Link 
                    to={`/post/${post._id}`} 
                    style={styles.viewButton}
                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    👁️ عرض
                  </Link>
                  <Link 
                    to={`/edit/${post._id}`} 
                    style={styles.editPostButton}
                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    ✏️ تعديل
                  </Link>
                  <button 
                    onClick={() => handleDeletePost(post._id)}
                    style={styles.deletePostButton}
                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    🗑️ حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noPosts}>
            📭 لم تكتب أي مقالات بعد.
            <br />
            <Link 
              to="/create" 
              style={{ 
                color: colors.primary, 
                fontWeight: '600', 
                marginTop: '1rem', 
                display: 'inline-block' 
              }}
            >
              اكتب مقالك الأول الآن!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;