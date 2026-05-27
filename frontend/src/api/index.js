import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  if (config.data instanceof FormData) delete config.headers['Content-Type'];
  return config;
});

export const login = (email, password) => api.post('/login.php', { email, password });
export const register = (data) => api.post('/register.php', data);
export const logout = () => api.post('/logout.php');
export const getUser = () => api.get('/get_user.php');
export const getDashboard = () => api.get('/dashboard.php');
export const getProjects = (search = '') => api.get(`/projects.php?search=${search}`);
export const getProject = (id) => api.get(`/projects.php?id=${id}`);
export const createProject = (formData) => api.post('/projects.php', formData);
export const updateProject = (id, data) => api.put(`/projects.php?id=${id}`, data);
export const deleteProject = (id) => api.delete(`/projects.php?id=${id}`);
export const submitProject = (id) => api.post('/submit_project.php', { id });
export const getTasks = (status = 'all') => api.get(`/tasks.php?status=${status}`);
export const createTask = (data) => api.post('/tasks.php', data);
export const updateTask = (id, data) => api.put(`/tasks.php?id=${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks.php?id=${id}`);
export const getComments = (projectId) => api.get(`/comments.php?project_id=${projectId}`);
export const addComment = (projectId, comment) => api.post('/comments.php', { project_id: projectId, comment });
export const getSubjects = () => api.get('/subjects.php');
export const addSubject = (name) => api.post('/subjects.php', { name });
export const deleteSubject = (id) => api.delete(`/subjects.php?id=${id}`);
export const getUsers = () => api.get('/users.php');
export const createUser = (type, data) => api.post('/users.php', { type, ...data });
export const getActivities = () => api.get('/activities.php');
export const getNotifications = () => api.get('/notifications.php');
export const getMessages = () => api.get('/messages.php');
export const sendMessage = (receiver_id, message) => api.post('/messages.php', { receiver_id, message });
export const getFiles = () => api.get('/files.php');
export const uploadFile = (formData) => api.post('/files.php', formData);
export const getAnalytics = () => api.get('/analytics.php');
export const getGanttData = () => api.get('/gantt.php');
export const downloadFile = (filename) => `/api/download.php?file=${encodeURIComponent(filename)}`;

// ========== FILE ERRORS ==========
export const markFileError = (file_id, project_id, error_description, line_number = null, original_text = null, suggested_text = null) =>
  api.post('/mark_file_error.php', { file_id, project_id, error_description, line_number, original_text, suggested_text });

export const getFileErrors = (project_id) =>
  api.get(`/get_file_errors.php?project_id=${project_id}`);

export const resolveFileError = (error_id) =>
  api.post('/resolve_file_error.php', { error_id });

// Batch error marking
export const markFileErrorBatch = (file_id, project_id, errorsArray) =>
  api.post('/mark_file_error.php', { file_id, project_id, batch: errorsArray });
export default api;