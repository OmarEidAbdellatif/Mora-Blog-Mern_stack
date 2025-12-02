const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// جلب معلومات المستخدم الحالي
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // حساب إحصائيات المستخدم
    const postsCount = await Post.countDocuments({ author: req.userId });
    const posts = await Post.find({ author: req.userId });
    
    // حساب مجموع الإعجابات
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
    
    // حساب مجموع التعليقات
    const totalComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      },
      stats: {
        postsCount,
        totalLikes,
        totalComments
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب البيانات', error: error.message });
  }
});

// جلب مقالات المستخدم
router.get('/me/posts', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find({ author: req.userId })
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Post.countDocuments({ author: req.userId });

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب المقالات', error: error.message });
  }
});

// تحديث معلومات المستخدم
router.put('/me', auth, async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // التحقق من أن اسم المستخدم غير مستخدم
    if (username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'اسم المستخدم مستخدم بالفعل' });
      }
      user.username = username;
    }

    await user.save();

    res.json({
      message: 'تم تحديث البيانات بنجاح',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تحديث البيانات', error: error.message });
  }
});

module.exports = router;