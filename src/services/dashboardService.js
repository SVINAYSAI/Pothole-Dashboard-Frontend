/**
 * Dashboard Background Service
 * Runs continuous API updates even when not viewing the dashboard
 */

import { dataAPI, sessionAPI } from './api';

class DashboardService {
  constructor() {
    this.intervals = {
      kpi: null,
      location: null
    };
    this.activeSessionId = null;
    this.isRunning = false;
    
    // Cache for latest data
    this.cache = {
      kpis: null,
      potholeLocations: [],
      lastUpdate: null
    };
    
    // Listeners for data updates
    this.listeners = [];
  }

  /**
   * Start background updates for a session
   */
  startSession(sessionId) {
    if (this.isRunning && this.activeSessionId === sessionId) {
      console.log('📊 Dashboard service already running for session:', sessionId);
      return;
    }

    console.log('🚀 Starting dashboard service for session:', sessionId);
    this.activeSessionId = sessionId;
    this.isRunning = true;
    
    // Store in localStorage so it persists
    localStorage.setItem('active_dashboard_session', sessionId);

    // Initial fetch
    this.fetchAllData();

    this.intervals.kpi = setInterval(() => {
      console.log('⏰ [Background] Fetching KPIs...');
      this.fetchKPIs();
    }, 10000); // 10 seconds

    this.intervals.location = setInterval(() => {
      console.log('⏰ [Background] Updating GPS location...');
      this.updateGPSLocation();
    }, 5000); // 5 seconds
  }

  /**
   * Stop background updates
   */
  stopSession() {
    console.log('🛑 Stopping dashboard service');
    this.isRunning = false;
    this.activeSessionId = null;
    
    localStorage.removeItem('active_dashboard_session');

    // Clear all intervals
    if (this.intervals.kpi) clearInterval(this.intervals.kpi);
    if (this.intervals.location) clearInterval(this.intervals.location);

    this.intervals = { kpi: null, location: null };
  }

  /**
   * Fetch all data at once
   */
  async fetchAllData() {
    await Promise.all([
      this.fetchKPIs(),
      this.fetchPotholeLocations()
    ]);
  }

  /**
   * Fetch KPIs from severity_distance_pothole API
   */
  async fetchKPIs() {
    if (!this.activeSessionId) return;

    try {
      const response = await dataAPI.getSeverityData(this.activeSessionId);
      this.cache.kpis = response.data;
      
      this.notifyListeners('kpis', this.cache.kpis);
      console.log('✅ [Background] KPIs updated:', this.cache.kpis);
    } catch (error) {
      console.error('❌ [Background] Error fetching KPIs:', error);
    }
  }

  /**
   * Fetch pothole locations
   */
  async fetchPotholeLocations() {
    if (!this.activeSessionId) return;

    try {
      const response = await dataAPI.getPotholeLocations(this.activeSessionId);
      this.cache.potholeLocations = response.data.locations || [];
      
      this.notifyListeners('potholes', this.cache.potholeLocations);
      console.log('✅ [Background] Pothole locations updated');
    } catch (error) {
      console.error('❌ [Background] Error fetching pothole locations:', error);
    }
  }

  /**
   * Update GPS location
   */
  async updateGPSLocation() {
    if (!this.activeSessionId || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (isNaN(lat) || isNaN(lng)) {
          console.error('Invalid coordinates:', { lat, lng });
          return;
        }

        try {
          await sessionAPI.updateLocation(this.activeSessionId, lat, lng);
          this.notifyListeners('location', { lat, lng });
          
          // Occasionally refresh pothole locations
          if (Math.random() < 0.2) {
            this.fetchPotholeLocations();
          }
        } catch (error) {
          console.error('❌ [Background] Error updating location:', error);
        }
      },
      (error) => console.error('Geolocation error:', error),
      { enableHighAccuracy: true }
    );
  }

  /**
   * Subscribe to data updates
   */
  subscribe(callback) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners of data updates
   */
  notifyListeners(type, data) {
    this.listeners.forEach(callback => {
      try {
        callback(type, data, this.cache);
      } catch (error) {
        console.error('Error in listener callback:', error);
      }
    });
  }

  /**
   * Get cached data
   */
  getCachedData() {
    return { ...this.cache };
  }

  /**
   * Check if service is running
   */
  isServiceRunning() {
    return this.isRunning;
  }

  /**
   * Get active session ID
   */
  getActiveSession() {
    return this.activeSessionId || localStorage.getItem('active_dashboard_session');
  }

  /**
   * Resume session from localStorage (on app restart)
   * Note: This should only be called explicitly, not automatically
   */
  resumeSessionIfExists() {
    const sessionId = localStorage.getItem('active_dashboard_session');
    const liveSessionId = localStorage.getItem('live_session_id');
    
    // Only resume if both session IDs exist and match
    if (sessionId && liveSessionId && sessionId === liveSessionId) {
      console.log('🔄 Resuming dashboard service for session:', sessionId);
      this.startSession(sessionId);
    } else if (sessionId && !liveSessionId) {
      // Clean up stale dashboard session
      console.log('🧹 Cleaning up stale dashboard session');
      localStorage.removeItem('active_dashboard_session');
    }
  }
}

// Create singleton instance
const dashboardService = new DashboardService();

// Note: Auto-resume removed to prevent stale sessions from restarting
// Sessions are now started explicitly when detection begins

export default dashboardService;
