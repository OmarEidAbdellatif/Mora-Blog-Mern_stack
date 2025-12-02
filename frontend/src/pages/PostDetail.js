import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getRelativeTime, getWordCount, getReadingTime } from '../utils/helpers';
import DOMPurify from 'dompurify';

function PostDetail() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await postsAPI.getById(id);
      setPost(response.data.post);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل المقال');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المقال؟')) return;

    try {
      await postsAPI.delete(id);
      navigate('/');
    } catch (err) {
      alert('حدث خطأ أثناء حذف المقال');
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('يجب تسجيل الدخول أولاً');
      return;
    }

    try {
      await postsAPI.toggleLike(id);
      fetchPost(); // إعادة تحميل المقال لتحديث العدد
    } catch (err) {
      alert('حدث خطأ أثناء الإعجاب');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('يجب تسجيل الدخول أولاً');
      return;
    }

    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      await postsAPI.addComment(id, { text: commentText });
      setCommentText('');
      fetchPost(); // إعادة تحميل المقال لإظهار التعليق الجديد
    } catch (err) {
      alert('حدث خطأ أثناء إضافة التعليق');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التعليق؟')) return;

    try {
      await postsAPI.deleteComment(id, commentId);
      fetchPost();
    } catch (err) {
      alert('حدث خطأ أثناء حذف التعليق');
    }
  };

  const isLikedByUser = post?.likes?.includes(user?.id);

  const styles = {
    container: {
      backgroundColor: colors.background,
      minHeight: 'calc(100vh - 64px)',
      padding: '2rem 0',
      transition: 'background-color 0.3s ease',
    },
    wrapper: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '0 1rem',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: colors.primary,
      textDecoration: 'none',
      marginBottom: '2rem',
      fontSize: '1rem',
      fontWeight: '500',
      transition: 'opacity 0.2s',
    },
    card: {
      backgroundColor: colors.cardBg,
      padding: '3rem',
      borderRadius: '16px',
      boxShadow: colors.darkMode ? '0 8px 20px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease',
      marginBottom: '2rem',
    },
    header: {
      marginBottom: '2rem',
      paddingBottom: '2rem',
      borderBottom: `2px solid ${colors.border}`,
    },
    title: {
      fontSize: '2.5rem',
      color: colors.text,
      marginBottom: '1.5rem',
      lineHeight: '1.3',
      fontWeight: '700',
      transition: 'color 0.3s ease',
    },
    metaInfo: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
      alignItems: 'center',
      fontSize: '0.95rem',
      color: colors.textSecondary,
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    statsBar: {
      display: 'flex',
      gap: '2rem',
      padding: '1.25rem',
      backgroundColor: colors.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      borderRadius: '10px',
      marginBottom: '2rem',
      fontSize: '0.95rem',
      color: colors.textSecondary,
      flexWrap: 'wrap',
    },
    content: {
      fontSize: '1.1rem',
      lineHeight: '1.9',
      color: colors.text,
      marginBottom: '2rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      transition: 'color 0.3s ease',
    },
    likeSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '2rem',
      paddingBottom: '2rem',
      borderBottom: `2px solid ${colors.border}`,
    },
    likeButton: {
      backgroundColor: isLikedByUser ? colors.error : colors.primary,
      color: 'white',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    likesCount: {
      fontSize: '1rem',
      color: colors.text,
      fontWeight: '600',
    },
    actions: {
      display: 'flex',
      gap: '1rem',
      paddingTop: '2rem',
      borderTop: `2px solid ${colors.border}`,
    },
    editButton: {
      backgroundColor: colors.success,
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      textDecoration: 'none',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    deleteButton: {
      backgroundColor: colors.error,
      color: 'white',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    commentsSection: {
      backgroundColor: colors.cardBg,
      padding: '2.5rem',
      borderRadius: '16px',
      boxShadow: colors.darkMode ? '0 8px 20px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease',
    },
    commentsTitle: {
      fontSize: '1.75rem',
      color: colors.text,
      marginBottom: '1.5rem',
      fontWeight: '600',
    },
    commentForm: {
      marginBottom: '2rem',
    },
    commentInput: {
      width: '100%',
      padding: '1rem',
      border: `2px solid ${colors.border}`,
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: colors.inputBg,
      color: colors.text,
      resize: 'vertical',
      minHeight: '100px',
      marginBottom: '1rem',
      fontFamily: 'inherit',
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    commentButton: {
      backgroundColor: colors.primary,
      color: 'white',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    commentsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    commentItem: {
      backgroundColor: colors.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      padding: '1.5rem',
      borderRadius: '10px',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease',
    },
    commentHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.75rem',
    },
    commentAuthor: {
      fontWeight: '600',
      color: colors.text,
      fontSize: '1rem',
    },
    commentTime: {
      fontSize: '0.875rem',
      color: colors.textSecondary,
    },
    commentText: {
      color: colors.text,
      lineHeight: '1.6',
      fontSize: '1rem',
      marginBottom: '0.75rem',
    },
    deleteCommentButton: {
      backgroundColor: 'transparent',
      color: colors.error,
      border: `1px solid ${colors.error}`,
      padding: '0.4rem 0.8rem',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease',
    },
    noComments: {
      textAlign: 'center',
      color: colors.textSecondary,
      padding: '2rem',
      fontSize: '1rem',
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
      fontSize: '1rem',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <div style={styles.loading}>⏳ جاري تحميل المقال...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <Link 
            to="/" 
            style={styles.backLink}
            onMouseEnter={(e) => e.target.style.opacity = '0.7'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            ← العودة للرئيسية
          </Link>
          <div style={styles.error}>{error || 'المقال غير موجود'}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <Link 
          to="/" 
          style={styles.backLink}
          onMouseEnter={(e) => e.target.style.opacity = '0.7'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          ← العودة للرئيسية
        </Link>

        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>{post.title}</h1>
            
            <div style={styles.metaInfo}>
              <span style={styles.metaItem}>
                👤 بواسطة: <strong>{post.author?.username}</strong>
              </span>
              <span style={styles.metaItem}>
                🕐 {getRelativeTime(post.createdAt)}
              </span>
            </div>
          </div>

          <div style={styles.statsBar}>
            <span>📝 {getWordCount(post.content)} كلمة</span>
            <span>⏱️ وقت القراءة: {getReadingTime(post.content)}</span>
            <span>💬 {post.comments?.length || 0} تعليق</span>
            <span>❤️ {post.likes?.length || 0} إعجاب</span>
          </div>

          <div
  style={styles.content}
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(post.content, {
      ALLOWED_TAGS: ['p','i','u','s','ul','ol','li','a','br','em'], // شيلنا b و h3
      ALLOWED_ATTR: ['href','target','rel']
    })
  }}
/>


          <div style={styles.likeSection}>
            <button 
              onClick={handleLike}
              style={styles.likeButton}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              {isLikedByUser ? '❤️' : '🤍'} {isLikedByUser ? 'أعجبك هذا' : 'أعجبني'}
            </button>
            <span style={styles.likesCount}>
              {post.likes?.length || 0} إعجاب
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
                ✏️ تعديل المقال
              </Link>
              <button 
                onClick={handleDelete} 
                style={styles.deleteButton}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                🗑️ حذف المقال
              </button>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div style={styles.commentsSection}>
          <h2 style={styles.commentsTitle}>💬 التعليقات ({post.comments?.length || 0})</h2>

          {isAuthenticated && (
            <form onSubmit={handleAddComment} style={styles.commentForm}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="اكتب تعليقك هنا..."
                style={styles.commentInput}
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = colors.border}
              />
              <button 
                type="submit" 
                disabled={submittingComment || !commentText.trim()}
                style={{
                  ...styles.commentButton,
                  opacity: (submittingComment || !commentText.trim()) ? 0.6 : 1,
                  cursor: (submittingComment || !commentText.trim()) ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => !submittingComment && commentText.trim() && (e.target.style.backgroundColor = colors.primaryHover)}
                onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
              >
                {submittingComment ? '⏳ جاري الإرسال...' : '📤 إضافة تعليق'}
              </button>
            </form>
          )}

          {!isAuthenticated && (
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: colors.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              borderRadius: '8px',
              textAlign: 'center',
              marginBottom: '2rem',
              color: colors.textSecondary
            }}>
              <Link to="/login" style={{ color: colors.primary, fontWeight: '600' }}>سجل الدخول</Link> لإضافة تعليق
            </div>
          )}

          <div style={styles.commentsList}>
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment._id} style={styles.commentItem}>
                  <div style={styles.commentHeader}>
                    <div>
                      <span style={styles.commentAuthor}>👤 {comment.author?.username}</span>
                      <span style={{ margin: '0 0.5rem', color: colors.textSecondary }}>•</span>
                      <span style={styles.commentTime}>{getRelativeTime(comment.createdAt)}</span>
                    </div>
                    {user && (user.id === comment.author?._id || user.id === post.author?._id) && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        style={styles.deleteCommentButton}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = colors.error;
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = colors.error;
                        }}
                      >
                        🗑️ حذف
                      </button>
                    )}
                  </div>
                  <p style={styles.commentText}>{comment.text}</p>
                </div>
              ))
            ) : (
              <div style={styles.noComments}>
                💭 لا توجد تعليقات بعد. كن أول من يعلق!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;