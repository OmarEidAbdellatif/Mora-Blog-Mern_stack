import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const postsAPI = {
  getAll: (params) => api.get('/posts', { params }),
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  
  // Likes
  toggleLike: (id) => api.post(`/posts/${id}/like`),
  
  // Comments
  addComment: (id, data) => api.post(`/posts/${id}/comments`, data),
  deleteComment: (postId, commentId) => api.delete(`/posts/${postId}/comments/${commentId}`),
};

export const usersAPI = {
  getProfile: () => api.get('/users/me'),
  getMyPosts: (params) => api.get('/users/me/posts', { params }),
  updateProfile: (data) => api.put('/users/me', data),
};

export default api;