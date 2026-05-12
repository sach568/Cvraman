import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// For file uploads, override content-type
api.interceptors.request.use(config => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// ========== AUTH ==========
export const login = (email, password) => api.post('/auth.php', { email, password });
export const register = (userData) => api.post('/register.php', userData);
export const logout = () => api.post('/logout.php');
export const getUser = () => api.get('/get_user.php');

// ========== PROJECTS ==========
export const getProjects = (search = '') => api.get(`/projects.php?search=${search}`);
export const getProject = (id) => api.get(`/projects.php?id=${id}`);
export const createProject = (formData) => api.post('/projects.php', formData);
export const updateProject = (id, data) => api.put(`/projects.php?id=${id}`, data);
export const deleteProject = (id) => api.delete(`/projects.php?id=${id}`);
export const submitProject = (id) => api.post('/submit_project.php', { id });

// ========== TASKS ==========
export const getTasks = (status = 'all') => api.get(`/tasks.php?status=${status}`);
export const createTask = (taskData) => api.post('/tasks.php', taskData);
export const updateTask = (id, data) => api.put(`/tasks.php?id=${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks.php?id=${id}`);

// ========== COMMENTS ==========
export const getComments = (projectId) => api.get(`/comments.php?project_id=${projectId}`);
export const addComment = (projectId, comment) => api.post('/comments.php', { project_id: projectId, comment });

// ========== SUBJECTS (Admin) ==========
export const getSubjects = () => api.get('/subjects.php');
export const addSubject = (name) => api.post('/subjects.php', { name });
export const deleteSubject = (id) => api.delete(`/subjects.php?id=${id}`);

// ========== USERS (Admin) ==========
export const getUsers = () => api.get('/users.php');
export const getAllUsers = () => api.get('/users.php?all=true');
export const createUser = (type, data) => api.post('/users.php', { type, ...data });
export const updateUser = (id, data) => api.put(`/users.php?id=${id}`, data);
export const deleteUser = (id) => api.delete(`/users.php?id=${id}`);
// ========== DASHBOARD & ANALYTICS ==========
export const getDashboard = () => api.get('/dashboard.php');
export const getAnalytics = () => api.get('/analytics.php');
export const getGanttData = () => api.get('/gantt.php');

// ========== MESSAGES ==========
export const getMessages = () => api.get('/messages.php');
export const sendMessage = (receiverId, message) => api.post('/messages.php', { receiver_id: receiverId, message });

// ========== FILES ==========
export const getFiles = () => api.get('/files.php');
export const uploadFile = (formData) => api.post('/files.php', formData);

// ========== ACTIVITIES & NOTIFICATIONS ==========
export const getActivities = () => api.get('/activities.php');
export const getNotifications = () => api.get('/notifications.php');

export default api;