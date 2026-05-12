import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/backend/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (email, password) => api.post('/auth.php', { email, password });
export const getDashboard = () => api.get('/dashboard.php');
export const getProjects = () => api.get('/projects.php');
export const getTasks = () => api.get('/tasks.php');
export const getGanttData = () => api.get('/gantt.php');
export const getNotifications = () => api.get('/notifications.php');
export default api;