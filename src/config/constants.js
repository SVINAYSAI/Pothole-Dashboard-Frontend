// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://untransmitted-justice-unsymbolically.ngrok-free.dev/';


// Google Maps API Key
export const GOOGLE_MAPS_API_KEY = 'AIzaSyCmTY4EYBMTYuV3Fr83dZWRB5Kc1C9VD4s';

// Map Libraries
export const MAP_LIBRARIES = ['visualization'];

// Detection Class Names
export const CLASS_NAMES = [
  'Broken_guide_pole',
  'Debris',
  'Faded_lines',
  'Fatigue_crack',
  'Horizontal_crack',
  'Manhole',
  'Patches',
  'Pothole',
  'Road_kills',
  'Vertical_crack',
];

// Class Colors for Charts - Vibrant colors for dark backgrounds
export const CLASS_COLORS = {
  // Original classes
  'Pothole': '#e74c3c',
  'pothole': '#e74c3c',
  'Broken_guide_pole': '#f39c12',
  'broken_pole': '#f39c12',
  'Crack': '#3498db',
  'Manhole': '#9b59b6',
  'manhole': '#9b59b6',
  'Road_damage': '#2ecc71',
  'Traffic_sign': '#f1c40f',
  'Barrier': '#34495e',
  'Cone': '#e67e22',
  'Debris': '#95a5a6',
  'debrish': '#95a5a6',
  'Construction': '#16a085',
  'Warning_sign': '#d35400',
  'Bump': '#8e44ad',
  'Hole': '#c0392b',
  'Obstruction': '#27ae60',
  'Maintenance': '#2980b9',
  'Speed_bump': '#f39c12',
  'Road_block': '#7f8c8d',
  'Construction_zone': '#1abc9c',
  'Utility_work': '#d63031',
  'Surface_issue': '#6c5ce7',
  // New CSV classes with vibrant colors
  'Alligator crack': '#FF6B6B',
  'Longitudinal crack': '#4ECDC4',
  'Transverse crack': '#45B7D1',
  'animal_carcasses': '#FFA07A',
  'patches': '#98D8C8'
};

// Fallback colors for unknown classes
export const FALLBACK_COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', 
  '#34495e', '#e67e22', '#95a5a6', '#f1c40f', '#16a085', '#d35400',
  '#8e44ad', '#c0392b', '#27ae60', '#2980b9', '#7f8c8d', '#d63031',
  '#6c5ce7', '#fd79a8', '#fdcb6e', '#a29bfe', '#6c5ce7', '#fd79a8'
];

// Polling Intervals (in milliseconds)
export const POLLING_INTERVALS = {
  DATA_FETCH: 5000,
  STATUS_CHECK: 10000,
  GPS_UPDATE: 5000,
};

// Map Configuration
export const MAP_STYLES = {
  containerStyle: {
    width: '100%',
    height: '400px',
    borderRadius: '8px',
  },
  defaultCenter: { lat: 28.6139, lng: 77.2090 }, // Delhi
  defaultZoom: 13,
};

// Severity Thresholds
export const SEVERITY_THRESHOLDS = {
  HIGH: 30,
  MEDIUM: 10,
  LOW: 1,
};
