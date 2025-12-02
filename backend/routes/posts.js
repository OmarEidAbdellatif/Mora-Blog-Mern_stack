const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const sanitizeHtml = require('sanitize-html');
// ============ POSTS ============        

// جلب مقال واحد بالـ ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('comments.author', 'username');
    
    if (!post) {
      return res.status(404).json({ message: 'المقال غير موجود' });
    }

    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب المقال', error: error.message });
  }
});

// جلب جميع المقالات
router.get('/', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};
    
    const posts = await Post.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب المقالات', error: error.message });
  }
});

// إنشاء مقال جديد
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, image } = req.body;

    // تنظيف المحتوى وإزالة أي data- attributes
    const cleanContent = sanitizeHtml(content, {
      allowedAttributes: {
        p: ['style'],
        span: ['style'],
        strong: ['style'],
        em: ['style']
      },
      allowedTags: false
    });

    const post = new Post({
      title,
      content: cleanContent,
      image: image || null,
      author: req.userId
    });

    await post.save();
    await post.populate('author', 'username');

    res.status(201).json({ message: 'تم إنشاء المقال بنجاح', post });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إنشاء المقال', error: error.message });
  }
});

// تعديل مقال
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'المقال غير موجود' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'غير مصرح لك بتعديل هذا المقال' });
    }

    post.title = req.body.title || post.title;

    // تنظيف المحتوى لو اتبعت محتوى جديد
    if (req.body.content) {
      post.content = sanitizeHtml(req.body.content, {
        allowedAttributes: {
          p: ['style'],
          span: ['style'],
          strong: ['style'],
          em: ['style']
        },
        allowedTags: false
      });
    }

    if (req.body.image !== undefined) {
      post.image = req.body.image;
    }

    await post.save();
    await post.populate('author', 'username');

    res.json({ message: 'تم تحديث المقال بنجاح', post });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تحديث المقال', error: error.message });
  }
});

// حذف مقال
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'المقال غير موجود' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'غير مصرح لك بحذف هذا المقال' });
    }

    await post.deleteOne();

    res.json({ message: 'تم حذف المقال بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في حذف المقال', error: error.message });
  }
});

// ============ LIKES ============

// إضافة/إزالة Like
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'المقال غير موجود' });
    }

    const likeIndex = post.likes.indexOf(req.userId);

    if (likeIndex > -1) {
      // إزالة الـ Like
      post.likes.splice(likeIndex, 1);
    } else {
      // إضافة Like
      post.likes.push(req.userId);
    }

    await post.save();

    res.json({ 
      message: likeIndex > -1 ? 'تم إزالة الإعجاب' : 'تم الإعجاب بالمقال',
      likesCount: post.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في معالجة الإعجاب', error: error.message });
  }
});

// ============ COMMENTS ============

// إضافة تعليق
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'التعليق لا يمكن أن يكون فارغاً' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'المقال غير موجود' });
    }

    post.comments.push({
      text,
      author: req.userId
    });

    await post.save();
    await post.populate('comments.author', 'username');

    res.status(201).json({ 
      message: 'تم إضافة التعليق بنجاح',
      comment: post.comments[post.comments.length - 1]
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إضافة التعليق', error: error.message });
  }
});

// حذف تعليق
router.delete('/:postId/comments/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'المقال غير موجود' });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'التعليق غير موجود' });
    }

    // التحقق من أن المستخدم هو صاحب التعليق أو صاحب المقال
    if (comment.author.toString() !== req.userId && post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'غير مصرح لك بحذف هذا التعليق' });
    }

    comment.deleteOne();
    await post.save();

    res.json({ message: 'تم حذف التعليق بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في حذف التعليق', error: error.message });
  }
});

module.exports = router;