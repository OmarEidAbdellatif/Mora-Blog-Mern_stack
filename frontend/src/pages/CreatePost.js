import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import DOMPurify from 'dompurify';


function CreatePost() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const { colors } = useTheme();
  const editorRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getById(id);
      const post = response.data.post;
      setTitle(post.title);
      if (editorRef.current) {
        editorRef.current.innerHTML = post.content;
      }
      if (post.image) {
        setImagePreview(post.image);
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل المقال');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('حجم الصورة يجب أن يكون أقل من 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // دوال التنسيق
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const insertLink = () => {
    const url = prompt('أدخل رابط URL:');
    if (url) {
      formatText('createLink', url);
    }
  };

  const changeFontSize = (size) => {
    formatText('fontSize', size);
  };

  const changeTextColor = () => {
    const color = prompt('أدخل كود اللون (مثال: #FF0000):');
    if (color) {
      formatText('foreColor', color);
    }
  };

  const changeBackgroundColor = () => {
    const color = prompt('أدخل كود اللون للخلفية (مثال: #FFFF00):');
    if (color) {
      formatText('backColor', color);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  // ناخد المحتوى من المحرر
  const rawContent = editorRef.current.innerHTML;

  // ننضف المحتوى من الوسوم الغير مرغوبة
  const content = DOMPurify.sanitize(rawContent, {
    ALLOWED_TAGS: ['p','i','u','s','ul','ol','li','a','br','em','b'], // شيلنا b و strong
    ALLOWED_ATTR: ['href','target','rel','style'],
  });

  try {
    const postData = {
      title,
      content,
      image: image || imagePreview || null,
    };

    if (id) {
      await postsAPI.update(id, postData);
    } else {
      await postsAPI.create(postData);
    }
    navigate('/');
  } catch (err) {
    setError(err.response?.data?.message || 'حدث خطأ أثناء حفظ المقال');
  } finally {
    setLoading(false);
  }
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
    card: {
      backgroundColor: colors.cardBg,
      padding: '2.5rem',
      borderRadius: '12px',
      boxShadow: colors.darkMode ? '0 8px 16px rgba(0,0,0,0.4)' : '0 4px 6px rgba(0,0,0,0.1)',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease',
    },
    title: {
      fontSize: '1.85rem',
      color: colors.text,
      marginBottom: '2rem',
      fontWeight: '600',
      transition: 'color 0.3s ease',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.75rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
    },
    label: {
      fontSize: '1.05rem',
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
    imageUploadArea: {
      border: `2px dashed ${colors.border}`,
      borderRadius: '8px',
      padding: '2rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: colors.darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
    },
    imagePreview: {
      position: 'relative',
      marginTop: '1rem',
    },
    previewImage: {
      maxWidth: '100%',
      maxHeight: '400px',
      borderRadius: '8px',
      objectFit: 'contain',
    },
    removeImageButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: colors.error,
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '35px',
      height: '35px',
      cursor: 'pointer',
      fontSize: '1.2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    },
    toolbar: {
      display: 'flex',
      gap: '0.5rem',
      padding: '0.75rem',
      backgroundColor: colors.darkMode ? '#374151' : '#f9fafb',
      borderBottom: `2px solid ${colors.border}`,
      borderRadius: '8px 8px 0 0',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    toolButton: {
      backgroundColor: colors.inputBg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      padding: '0.5rem 0.75rem',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
    },
    separator: {
      width: '1px',
      height: '30px',
      backgroundColor: colors.border,
      margin: '0 0.25rem',
    },
    select: {
      backgroundColor: colors.inputBg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      padding: '0.5rem',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      outline: 'none',
    },
    editor: {
      minHeight: '350px',
      padding: '1.25rem',
      backgroundColor: colors.inputBg,
      color: colors.text,
      border: 'none',
      borderRadius: '0 0 8px 8px',
      fontSize: '1rem',
      lineHeight: '1.8',
      outline: 'none',
      overflow: 'auto',
    },
    hint: {
      fontSize: '0.9rem',
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    buttons: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1rem',
    },
    submitButton: {
      backgroundColor: colors.primary,
      color: 'white',
      padding: '0.875rem 2rem',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1.05rem',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    cancelButton: {
      backgroundColor: colors.buttonSecondary,
      color: 'white',
      padding: '0.875rem 2rem',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1.05rem',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    error: {
      backgroundColor: colors.errorBg,
      color: colors.error,
      padding: '1rem',
      borderRadius: '6px',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    fileInput: {
      display: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{id ? '✏️ تعديل المقال' : '📝 مقال جديد'}</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* عنوان المقال */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>عنوان المقال</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={styles.input}
              placeholder="اكتب عنوان المقال..."
              onFocus={(e) => (e.target.style.borderColor = colors.primary)}
              onBlur={(e) => (e.target.style.borderColor = colors.border)}
            />
          </div>

          {/* رفع صورة */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>صورة المقال (اختياري)</label>

            {!imagePreview ? (
              <div
                style={styles.imageUploadArea}
                onClick={() => document.getElementById('imageInput').click()}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.border)}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
                <div style={{ color: colors.text, fontSize: '1rem', marginBottom: '0.5rem' }}>
                  اضغط لرفع صورة
                </div>
                <div style={{ color: colors.textSecondary, fontSize: '0.85rem' }}>
                  PNG, JPG, GIF (أقل من 2MB)
                </div>
              </div>
            ) : (
              <div style={styles.imagePreview}>
                <img src={imagePreview} alt="Preview" style={styles.previewImage} />
                <button type="button" onClick={removeImage} style={styles.removeImageButton} title="إزالة الصورة">
                  ×
                </button>
              </div>
            )}

            <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} />
          </div>

          {/* محرر النصوص */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>محتوى المقال</label>

            {/* شريط الأدوات */}
            <div style={styles.toolbar}>
              {/* التنسيق الأساسي */}
              <button
                type="button"
                onClick={() => formatText('bold')}
                style={styles.toolButton}
                title="خط عريض (Ctrl+B)"
                onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.inputBg)}
              >
                <strong>B</strong>
              </button>

              <button
                type="button"
                onClick={() => formatText('italic')}
                style={styles.toolButton}
                title="خط مائل (Ctrl+I)"
                onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.inputBg)}
              >
                <em>I</em>
              </button>

              <button
                type="button"
                onClick={() => formatText('underline')}
                style={styles.toolButton}
                title="خط تحته خط (Ctrl+U)"
                onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.inputBg)}
              >
                <u>U</u>
              </button>

              <button
                type="button"
                onClick={() => formatText('strikeThrough')}
                style={styles.toolButton}
                title="خط مشطوب"
                onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.inputBg)}
              >
                <s>S</s>
              </button>

              <div style={styles.separator} />

              {/* حجم الخط */}
              <select
                onChange={(e) => changeFontSize(e.target.value)}
                style={styles.select}
                defaultValue=""
              >
                <option value="" disabled>حجم الخط</option>
                <option value="1">صغير جداً</option>
                <option value="2">صغير</option>
                <option value="3">عادي</option>
                <option value="4">متوسط</option>
                <option value="5">كبير</option>
                <option value="6">كبير جداً</option>
                <option value="7">ضخم</option>
              </select>

              <div style={styles.separator} />

              {/* العناوين */}
              <button
                type="button"
                onClick={() => formatText('formatBlock', 'H1')}
                style={styles.toolButton}
                title="عنوان كبير"
                onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.inputBg)}
              >
                H1
              </button>

              <button
                type="button"
                onClick={() => formatText('formatBlock', 'H2')}
                style={styles.toolButton}
                title="عنوان متوسط"
                onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.inputBg)}
              >
                H2
              </button>

              <button
                type="button"
                onClick={() => formatText('formatBlock', 'H3')}
                style={styles.toolButton}
                title="عنوان صغير"
                onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.inputBg)}
              >
                H3
              </button>

              <button
                type="button"
                onClick={() => formatText('formatBlock', 'p')}
                style={styles.toolButton}
                title="نص عادي"
                onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.inputBg)}
              >
                P
              </button>

              <div style={styles.separator} />

              {/* الألوان */}
              <button
                type="button"
                onClick={changeTextColor}
                style={styles.toolButton}
                title="لون النص"
                onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.inputBg)}
              >
                🎨 لون
              </button>

              <button
                type="button"
                onClick={changeBackgroundColor}
                style={styles.toolButton}
                title="لون الخلفية"
                onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.inputBg)}
              >
                🖍️ خلفية
              </button>

              <div style={styles.separator} />

              {/* القوائم */}
              <button
                type="button"
                onClick={() => formatText('insertUnorderedList')}
                style={styles.toolButton}
                title="قائمة نقطية"
                onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.inputBg)}
              >
                • قائمة
              </button>

              <button
                type="button"
                onClick={() => formatText('insertOrderedList')}
                style={styles.toolButton}
                title="قائمة مرقمة"
                onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.inputBg)}
              >
                1. قائمة
              </button>

              <div style={styles.separator} />

              {/* المحاذاة */}
              <button
                type="button"
                onClick={() => formatText('justifyLeft')}
                style={styles.toolButton}
                title="محاذاة لليسار"
                onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.inputBg)}
              >
                ⬅️
              </button>

              <button
                type="button"
                onClick={() => formatText('justifyCenter')}
                style={styles.toolButton}
                title="محاذاة للوسط"
                onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.inputBg)}
              >
                ↔️
              </button>

              <button
                type="button"
                onClick={() => formatText('justifyRight')}
                style={styles.toolButton}
                title="محاذاة لليمين"
                onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.inputBg)}
              >
                ➡️
              </button>

              <div style={styles.separator} />

              {/* أخرى */}
              <button
                type="button"
                onClick={insertLink}
                style={styles.toolButton}
                title="إدراج رابط"
                onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.inputBg)}
              >
                🔗 رابط
              </button>

              <button
                type="button"
                onClick={() => formatText('removeFormat')}
                style={styles.toolButton}
                title="مسح التنسيق"
                onMouseEnter={(e) => (e.target.style.backgroundColor = colors.error)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.inputBg)}
              >
                🧹 مسح
              </button>
            </div>

            {/* منطقة الكتابة */}
            <div
              ref={editorRef}
              contentEditable
              style={styles.editor}
              onFocus={(e) => (e.currentTarget.style.border = `2px solid ${colors.primary}`)}
              onBlur={(e) => (e.currentTarget.style.border = 'none')}
              data-placeholder="اكتب محتوى المقال هنا... حدد النص واستخدم الأدوات للتنسيق"
            />

            <div style={styles.hint}>
              💡 حدد النص واستخدم الأزرار للتنسيق: خط عريض، مائل، ألوان، قوائم، وأكثر!
            </div>
          </div>

          {/* الأزرار */}
          <div style={styles.buttons}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = colors.primaryHover)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = colors.primary)}
            >
              {loading ? '⏳ جاري الحفظ...' : id ? '✅ تحديث' : '🚀 نشر'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={styles.cancelButton}
              onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.target.style.opacity = '1')}
            >
              ❌ إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;