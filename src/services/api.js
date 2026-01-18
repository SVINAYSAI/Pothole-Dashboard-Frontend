import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  // User Registration
  signup: (userData) =>
    apiClient.post('/signup', {
      email: userData.email,
      password: userData.password,
      confirm_password: userData.confirmPassword,
      name: userData.name,
      country_code: userData.countryCode,
      mobile_number: userData.mobileNumber
    }),
  
  // Admin Registration
  adminRegister: (userData) =>
    apiClient.post('/admin/register', {
      email: userData.email,
      password: userData.password,
      confirm_password: userData.confirmPassword,
      name: userData.name,
      country_code: userData.countryCode,
      mobile_number: userData.mobileNumber
    }),
  
  // OTP Verification
  verifyOTP: (email, otp) =>
    apiClient.post('/verify-otp', { email, otp }),
  
  // Resend OTP
  resendOTP: (email) =>
    apiClient.post('/resend-otp', { email }),
  
  // Login
  login: (email, password) =>
    apiClient.post('/login', { email, password }),
  
  // Check Login Status
  checkLoginStatus: (email) =>
    apiClient.get(`/login_status?email=${email}`),
  
  // Logout
  logout: async (email) => {
    try {
      const response = await apiClient.post('/logout', { email });
      return response;
    } catch (error) {
      console.error('Logout API error:', error);
      throw error;
    }
  },

  // Forgot Password
  forgotPassword: (email) =>
    apiClient.post('/forgot-password', { email }),
  
  // Reset Password
  resetPassword: (email, otp, newPassword) =>
    apiClient.post('/reset-password', { email, otp, new_password: newPassword }),
};

// User Management APIs (Admin only)
export const userAPI = {
  // Get all users
  getAllUsers: () =>
    apiClient.get('/users'),
  
  // Get user by ID
  getUserById: (userId) =>
    apiClient.get(`/users/${userId}`),
  
  // Update user
  updateUser: (userId, userData) =>
    apiClient.put(`/users/${userId}`, userData),
  
  // Delete user
  deleteUser: (userId) =>
    apiClient.delete(`/users/${userId}`),
};

// Session APIs
export const sessionAPI = {
  start: (formData) => {
    // Ensure category is present in formData
    if (!formData.has('category')) {
      formData.append('category', 'Saferoute AI');
    }
    return apiClient.post('/start_session', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  stop: (sessionId) =>
    apiClient.post(`/stop_session?session_id=${sessionId}`),
  
  getProcessingStatus: (sessionId) =>
    apiClient.get(`/processing_status/${sessionId}`),
  
  getSessionInfo: (sessionId) =>
    apiClient.get(`/session_info/${sessionId}`),
  
  updateLocation: (sessionId, lat, lng) => {
    const formData = new FormData();
    formData.append('lat', lat.toString());
    formData.append('lng', lng.toString());
    return apiClient.post(`/update_location/${sessionId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  cleanup: (sessionId) =>
    apiClient.delete(`/cleanup_session/${sessionId}`),
};

// Data APIs
export const dataAPI = {
  getFinalCounts: (sessionId) =>
    apiClient.get(`/final_counts/${sessionId}`),
  
  getSeverityData: (sessionId) =>
    apiClient.get(`/severity_distance_pothole/${sessionId}`),
  
  getPotholeLocations: (sessionId) =>
    apiClient.get(`/get_pothole_locations/${sessionId}`),
  
  // Get comprehensive pothole details with GPS, confidence, and statistics
  getPotholeDetails: (sessionId) =>
    apiClient.get(`/pothole_details/${sessionId}`),

  // Send email alert for road defect detection
  sendAlert: (sessionId, recipientEmail) => {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('recipient_email', recipientEmail);
    return apiClient.post('/send_alert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
};

// Video APIs
export const videoAPI = {
  downloadProcessed: (sessionId) =>
    apiClient.get(`/download_processed_video/${sessionId}`, {
      responseType: 'blob',
    }),
  
  getVideoFeedUrl: (sessionId) =>
    `${API_BASE_URL}/video_feed?session_id=${sessionId}`,
  
  // Get video stream URL for in-browser playback
  getStreamUrl: (sessionId) =>
    `${API_BASE_URL}/stream_processed_video/${sessionId}`,
  
  // Get video file info (availability, size, etc.)
  getVideoInfo: (sessionId) =>
    apiClient.get(`/video_info/${sessionId}`),
  
  // Get direct download URL
  getDownloadUrl: (sessionId) =>
    `${API_BASE_URL}/download_processed_video/${sessionId}`,
};

// History APIs
export const historyAPI = {
  // Get all sessions for a user
  getUserSessions: (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    const queryString = queryParams.toString();
    return apiClient.get(`/user/sessions/${userId}${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get detailed session information
  getSessionDetails: (sessionId) =>
    apiClient.get(`/session/details/${sessionId}`),
  
  // Get all potholes for a session
  getSessionPotholes: (sessionId) =>
    apiClient.get(`/session/potholes/${sessionId}`),
  
  // Get all potholes for a user across all sessions
  getUserPotholes: (userId, limit = 100) =>
    apiClient.get(`/user/potholes/${userId}?limit=${limit}`),
  
  // Get GPS tracking data for a session
  getGPSTrack: (sessionId) =>
    apiClient.get(`/session/gps_track/${sessionId}`),
  
  // Get all detection sessions for a user by email
  getUserSessionsByEmail: (email, params = {}) =>
    apiClient.get('/user/sessions_by_email', { params: { email, ...params } }),
  
  // Get all sessions (admin)
  getAllSessions: (params = {}) =>
    apiClient.get('/admin/all_sessions', { params }),
  
  // Get frame-by-frame detection results
  getDetectionResults: (sessionId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.start_frame !== undefined) queryParams.append('start_frame', params.start_frame);
    if (params.end_frame !== undefined) queryParams.append('end_frame', params.end_frame);
    if (params.limit) queryParams.append('limit', params.limit);
    const queryString = queryParams.toString();
    return apiClient.get(`/session/detection_results/${sessionId}${queryString ? `?${queryString}` : ''}`);
  },
  
  // Delete a session
  deleteSession: (sessionId) =>
    apiClient.delete(`/session/${sessionId}`),
};

export default apiClient;
