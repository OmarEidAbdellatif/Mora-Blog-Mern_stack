# 📝Mora Blog

منصة مدونات احترافية مبنية بـ **MERN Stack** (MongoDB, Express, React, Node.js) مع مميزات متقدمة.


---

## 🌟 المميزات

### 🔐 **المصادقة والأمان**
- ✅ تسجيل الدخول والإنشاء حساب
- ✅ JWT Authentication
- ✅ تشفير كلمات المرور بـ bcrypt
- ✅ حماية المسارات (Protected Routes)

### 📝 **إدارة المقالات**
- ✅ إنشاء، قراءة، تعديل، حذف المقالات (CRUD)
- ✅ محرر نصوص غني (Bold, Italic, Colors, Lists, Links...)
- ✅ رفع صور للمقالات
- ✅ البحث في المقالات
- ✅ Pagination (تصفح الصفحات)

### 💬 **التفاعل الاجتماعي**
- ✅ نظام الإعجابات (Likes)
- ✅ نظام التعليقات (Comments)
- ✅ حذف التعليقات (للكاتب أو صاحب المقال)

### 👤 **الملف الشخصي**
- ✅ صفحة Profile للمستخدم
- ✅ إحصائيات (عدد المقالات، الإعجابات، التعليقات)
- ✅ عرض جميع مقالات المستخدم
- ✅ تعديل اسم المستخدم

### 🎨 **التصميم**
- ✅ Dark Mode / Light Mode
- ✅ تصميم Responsive (موبايل، تابلت، كمبيوتر)
- ✅ Animations سلسة
- ✅ واجهة مستخدم عصرية

### 📊 **مميزات إضافية**
- ✅ عرض تاريخ النشر النسبي (منذ ساعة، منذ يوم...)
- ✅ حساب عدد الكلمات ووقت القراءة
- ✅ عرض الصور في الكروت والمقالات
- ✅ حفظ تفضيلات المستخدم (Dark Mode)

---

## 🛠️ التقنيات المستخدمة

### **Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- dotenv

### **Frontend:**
- React 19
- React Router DOM
- Axios
- Context API
- CSS (Inline Styles)
- ContentEditable API

---

## 📋 المتطلبات الأساسية

قبل البدء، تأكد من تثبيت:

- [Node.js](https://nodejs.org/) (v16 أو أحدث)
- [MongoDB](https://www.mongodb.com/) (Community Server)
- [MongoDB Compass](https://www.mongodb.com/products/compass) (اختياري - للواجهة الرسومية)
- محرر أكواد مثل [VS Code](https://code.visualstudio.com/)

---

## 🚀 التثبيت والتشغيل

### **1️⃣ تحميل المشروع**
```bash
# نسخ المشروع
https://github.com/OmarEidAbdellatif/Mora-Blog-Mern_stack.git

# الدخول للمجلد
cd blog-platform
```

---

### **2️⃣ إعداد Backend**
```bash
# الدخول لمجلد Backend
cd backend

# تثبيت المكتبات
npm install

# إنشاء ملف .env
# انسخ المحتوى التالي في ملف .env:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your_super_secret_key_12345

# تشغيل Backend
npm run dev
```

**البرنامج سيعمل على:** `http://localhost:5000`

---

### **3️⃣ إعداد Frontend**

افتح Terminal جديد:
```bash
# الدخول لمجلد Frontend
cd frontend

# تثبيت المكتبات
npm install

# تشغيل Frontend
npm start
```

**البرنامج سيفتح تلقائياً على:** `http://localhost:3000`

---

### **4️⃣ تشغيل MongoDB**

#### **Windows:**
```bash
# تشغيل MongoDB كـ Service
net start MongoDB
```

#### **Mac/Linux:**
```bash
# تشغيل MongoDB
brew services start mongodb-community
# أو
sudo systemctl start mongod
```

#### **استخدام MongoDB Compass:**
1. افتح MongoDB Compass
2. اتصل بـ `mongodb://localhost:27017`
3. ستظهر قاعدة البيانات `blog-platform` تلقائياً

---

## 📁 هيكل المشروع
```
blog-platform/
├── backend/
│   ├── models/
│   │   ├── User.js          # نموذج المستخدم
│   │   └── Post.js          # نموذج المقال
│   ├── routes/
│   │   ├── auth.js          # مسارات المصادقة
│   │   ├── posts.js         # مسارات المقالات
│   │   └── users.js         # مسارات المستخدمين
│   ├── middleware/
│   │   └── auth.js          # Middleware للمصادقة
│   ├── .env                 # المتغيرات البيئية
│   ├── server.js            # ملف الخادم الرئيسي
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js    # شريط التنقل
│   │   ├── pages/
│   │   │   ├── Home.js      # الصفحة الرئيسية
│   │   │   ├── Login.js     # تسجيل الدخول
│   │   │   ├── Register.js  # إنشاء حساب
│   │   │   ├── CreatePost.js # إنشاء/تعديل مقال
│   │   │   ├── PostDetail.js # عرض المقال
│   │   │   └── Profile.js   # الملف الشخصي
│   │   ├── context/
│   │   │   ├── AuthContext.js  # إدارة المصادقة
│   │   │   └── ThemeContext.js # إدارة الثيم
│   │   ├── services/
│   │   │   └── api.js       # طلبات API
│   │   ├── utils/
│   │   │   └── helpers.js   # دوال مساعدة
│   │   ├── App.js           # الملف الرئيسي
│   │   ├── index.js
│   │   └── index.css        # التنسيقات
│   └── package.json
│
└── README.md                # هذا الملف
```

---

## 🔧 الإعدادات

### **تغيير Port الخادم:**

في `backend/.env`:
```env
PORT=5000  # غيّر الرقم حسب الحاجة
```

### **تغيير اسم قاعدة البيانات:**

في `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/your-database-name
```

### **تغيير JWT Secret:**

في `backend/.env`:
```env
JWT_SECRET=your_new_secret_key_here
```

⚠️ **مهم:** لا تشارك الـ JWT_SECRET في الإنتاج!

---

## 📱 الاستخدام

### **1. إنشاء حساب:**
1. افتح `http://localhost:3000/register`
2. أدخل اسم المستخدم، البريد، وكلمة المرور
3. اضغط "تسجيل"

### **2. كتابة مقال:**
1. سجل الدخول
2. اضغط "مقال جديد" من القائمة
3. أضف عنوان، صورة (اختياري)، ومحتوى
4. استخدم أدوات التنسيق (Bold, Italic, Colors...)
5. اضغط "نشر"

### **3. التفاعل مع المقالات:**
- اضغط على أي مقال لقراءته
- اضغط ❤️ للإعجاب
- اكتب تعليق 💬
- شارك المقال

### **4. إدارة الملف الشخصي:**
- اضغط "حسابي" من القائمة
- شاهد إحصائياتك
- عدّل اسم المستخدم
- اعرض جميع مقالاتك

---

## 🎨 التخصيص

### **تغيير الألوان:**

في `src/context/ThemeContext.js`، عدّل الألوان:
```javascript
colors: darkMode ? {
  primary: '#3b82f6',      // اللون الأساسي
  background: '#1a1a1a',   // لون الخلفية
  // ... باقي الألوان
}
```

### **تغيير الخطوط:**

في `src/index.css`:
```css
body {
  font-family: 'Arial', sans-serif; /* غيّر الخط هنا */
}
```

---

## 🐛 حل المشاكل الشائعة

### **المشكلة: Backend لا يعمل**

**الحل:**
```bash
# تأكد من تشغيل MongoDB
net start MongoDB  # Windows
brew services start mongodb-community  # Mac

# تأكد من وجود ملف .env
cd backend
cat .env  # أو افتحه يدوياً

# أعد تثبيت المكتبات
npm install
npm run dev
```

---

### **المشكلة: "Cannot connect to MongoDB"**

**الحل:**
1. تأكد أن MongoDB شغال
2. افتح MongoDB Compass واتصل بـ `mongodb://localhost:27017`
3. تأكد من الـ MONGODB_URI في ملف `.env`

---

### **المشكلة: "Port 3000 is already in use"**

**الحل:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [رقم العملية] /F

# Mac/Linux
lsof -i :3000
kill -9 [رقم العملية]
```

---

### **المشكلة: الصور لا تظهر**

**الحل:**
- تأكد أن حجم الصورة أقل من 2MB
- تأكد من تحديد صورة بصيغة PNG/JPG/GIF
- امسح الـ cache في المتصفح (Ctrl + Shift + Delete)

---

### **المشكلة: Dark Mode لا يحفظ الإعدادات**

**الحل:**
- تأكد أن localStorage مفعّل في المتصفح
- افتح Developer Tools (F12) → Application → Local Storage
- تأكد من وجود `darkMode` key

---

## 🧪 الاختبار

### **اختبار Backend:**
```bash
cd backend
npm test
```

### **اختبار API يدوياً:**

استخدم Postman أو Thunder Client:
```
POST http://localhost:5000/api/auth/register
Body: {
  "username": "testuser",
  "email": "test@example.com",
  "password": "123456"
}
```

---

## 📦 Build للإنتاج

### **Frontend:**
```bash
cd frontend
npm run build
```

سينشئ مجلد `build` بملفات الإنتاج.

### **Backend:**
```bash
cd backend
# غيّر .env للإنتاج:
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog
JWT_SECRET=production_secret_key_very_secure

# شغّل بـ PM2 (اختياري)
npm install -g pm2
pm2 start server.js --name blog-backend
```

---

## 🚀 النشر (Deployment)

### **Frontend على Vercel:**
```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

### **Backend على Heroku:**
```bash
cd backend
heroku login
heroku create blog-backend
git push heroku main
heroku config:set JWT_SECRET=your_secret
```

### **قاعدة البيانات على MongoDB Atlas:**

1. سجل على [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. أنشئ Cluster جديد
3. احصل على Connection String
4. عدّل `MONGODB_URI` في `.env`

---

## 🤝 المساهمة

المساهمات مرحب بها! اتبع الخطوات:

1. Fork المشروع
2. أنشئ Branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للـ Branch (`git push origin feature/amazing-feature`)
5. افتح Pull Request

---

## 📝 الرخصة

هذا المشروع مرخص تحت [MIT License](LICENSE).

---

## 👨‍💻 المطور

** عمر عيد عبداللطيف **

- Email: omar.eid.abdellatif@gmali.com

---

## 🙏 شكر وتقدير

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)

---

**   ❤️ صُنع بـ    **
