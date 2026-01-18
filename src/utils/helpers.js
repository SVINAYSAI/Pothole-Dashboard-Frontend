import { CLASS_COLORS, FALLBACK_COLORS, SEVERITY_THRESHOLDS } from '../config/constants';

/**
 * Get unique color for each class
 */
export const getUniqueColor = (className, index) => {
  if (CLASS_COLORS[className]) {
    return CLASS_COLORS[className];
  }
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
};

/**
 * Format Y-axis tick for better readability
 */
export const formatYAxisTick = (value) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }
  return Math.floor(value).toString();
};

/**
 * Calculate Y-axis domain for better visualization
 */
export const calculateYAxisDomain = (data) => {
  if (!data || data.length === 0) return [0, 10];
  
  let maxValue = 0;
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key !== 'distance_m' && key !== 'Frame' && typeof item[key] === 'number') {
        maxValue = Math.max(maxValue, item[key]);
      }
    });
  });
  
  const paddedMax = Math.ceil(maxValue * 1.1);
  
  let tickInterval;
  if (paddedMax <= 10) {
    tickInterval = 2;
  } else if (paddedMax <= 50) {
    tickInterval = 10;
  } else if (paddedMax <= 100) {
    tickInterval = 20;
  } else if (paddedMax <= 500) {
    tickInterval = 50;
  } else if (paddedMax <= 1000) {
    tickInterval = 100;
  } else {
    tickInterval = Math.ceil(paddedMax / 10 / 100) * 100;
  }
  
  const adjustedMax = Math.ceil(paddedMax / tickInterval) * tickInterval;
  return [0, adjustedMax];
};

/**
 * Get severity class based on value
 */
export const getSeverityClass = (value) => {
  if (value > SEVERITY_THRESHOLDS.HIGH) return 'high';
  if (value > SEVERITY_THRESHOLDS.MEDIUM) return 'medium';
  if (value >= SEVERITY_THRESHOLDS.LOW) return 'low';
  return 'very-low';
};

/**
 * Get severity color based on value or level string
 * Handles both numeric severity (potholes/km) and API string levels
 */
export const getSeverityColor = (value) => {
  // If value is a string (severity level from API)
  if (typeof value === 'string') {
    const level = value.toLowerCase();
    if (level === 'critical') return '#dc3545'; // Red
    if (level === 'high') return '#fd7e14';     // Orange
    if (level === 'medium') return '#ffc107';   // Yellow
    if (level === 'low') return '#28a745';      // Green
    return '#28a745'; // Default to green
  }
  
  // If value is numeric (potholes per km)
  if (value > 7) return '#dc3545';   // Critical: > 7 potholes/km
  if (value > 5) return '#fd7e14';   // High: 5-7 potholes/km
  if (value > 2) return '#ffc107';   // Medium: 2-5 potholes/km
  return '#28a745';                  // Low: < 2 potholes/km
};

/**
 * Download blob as file
 */
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Parse CSV text to array of objects
 */
export const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = values[idx];
    });
    return obj;
  });
};

/**
 * Get current geolocation
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true }
    );
  });
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Show success toast notification
 */
export const showSuccessToast = (message) => {
  // Can be replaced with a toast library like react-toastify
  alert(message);
};

/**
 * Show error toast notification
 */
export const showErrorToast = (message) => {
  // Can be replaced with a toast library like react-toastify
  alert(message);
};
