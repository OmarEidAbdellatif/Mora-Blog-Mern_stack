// تحويل التاريخ لصيغة نسبية (منذ ساعة، منذ يوم)
export const getRelativeTime = (date) => {
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now - postDate) / 1000);

  if (diffInSeconds < 60) {
    return 'منذ لحظات';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} ${diffInMinutes === 1 ? 'دقيقة' : diffInMinutes === 2 ? 'دقيقتين' : 'دقائق'}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `منذ ${diffInHours} ${diffInHours === 1 ? 'ساعة' : diffInHours === 2 ? 'ساعتين' : 'ساعات'}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `منذ ${diffInDays} ${diffInDays === 1 ? 'يوم' : diffInDays === 2 ? 'يومين' : 'أيام'}`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `منذ ${diffInWeeks} ${diffInWeeks === 1 ? 'أسبوع' : diffInWeeks === 2 ? 'أسبوعين' : 'أسابيع'}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `منذ ${diffInMonths} ${diffInMonths === 1 ? 'شهر' : diffInMonths === 2 ? 'شهرين' : 'أشهر'}`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `منذ ${diffInYears} ${diffInYears === 1 ? 'سنة' : diffInYears === 2 ? 'سنتين' : 'سنوات'}`;
};

// حساب عدد الكلمات
export const getWordCount = (text) => {
  if (!text) return 0;
  // إزالة HTML tags لو موجودة
  const plainText = text.replace(/<[^>]*>/g, '');
  // حساب الكلمات (مع دعم العربية والإنجليزية)
  const words = plainText.trim().split(/\s+/);
  return words.filter(word => word.length > 0).length;
};

// حساب وقت القراءة (متوسط 200 كلمة/دقيقة)
export const getReadingTime = (text) => {
  const wordCount = getWordCount(text);
  const minutes = Math.ceil(wordCount / 200);
  
  if (minutes < 1) return 'أقل من دقيقة';
  if (minutes === 1) return 'دقيقة واحدة';
  if (minutes === 2) return 'دقيقتان';
  if (minutes <= 10) return `${minutes} دقائق`;
  return `${minutes} دقيقة`;
};

// اختصار النص
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  const plainText = text.replace(/<[^>]*>/g, '');
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
};