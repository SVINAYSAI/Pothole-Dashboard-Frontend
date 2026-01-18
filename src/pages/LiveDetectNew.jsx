import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Form, Button, Badge, Alert } from 'react-bootstrap';
import { Play, Square, Download, RefreshCw, MapPin, Video, Maximize, Minimize } from 'lucide-react';
import { sessionAPI, videoAPI, dataAPI } from '../services/api';
import { CLASS_NAMES, POLLING_INTERVALS } from '../config/constants';
import { downloadBlob } from '../utils/helpers';
import ProcessingStatus from '../components/common/ProcessingStatus';
import dashboardService from '../services/dashboardService';
import './LiveDetectNew.css';

const LiveDetect = () => {
  const [rtspLink, setRtspLink] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('live_session_id') || null);
  const [processingStatus, setProcessingStatus] = useState({ processing_complete: false, video_ready: false });
  const [locationStatus, setLocationStatus] = useState({ enabled: false, lastUpdate: null, coordinates: null });
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const liveFeedRef = useRef(null);
  const [feedSrc, setFeedSrc] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(() => localStorage.getItem('selected_category') || "Saferoute AI");

  // Persist category selection
  useEffect(() => {
    localStorage.setItem('selected_category', selectedCategory);
  }, [selectedCategory]);

  // Video preview for uploaded file
  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setVideoPreview(null);
    }
  }, [videoFile]);

  // Check geolocation status
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationStatus({
            enabled: true,
            lastUpdate: new Date(),
            coordinates: { lat: position.coords.latitude, lng: position.coords.longitude }
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationStatus({ enabled: false, lastUpdate: null, coordinates: null });
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Check processing status
  useEffect(() => {
    if (!sessionId) return;

    const checkStatus = () => {
      sessionAPI.getProcessingStatus(sessionId)
        .then((res) => setProcessingStatus(res.data))
        .catch(console.error);
    };

    checkStatus();
    const interval = setInterval(checkStatus, POLLING_INTERVALS.DATA_FETCH);
    return () => clearInterval(interval);
  }, [sessionId]);

  // Stop dashboard background polling when processing completes
  useEffect(() => {
    if (sessionId && processingStatus?.processing_complete) {
      dashboardService.stopSession();
    }
  }, [sessionId, processingStatus?.processing_complete]);

  const startSession = async (e) => {
    e.preventDefault();
    
    // Prevent starting if already active
    if (sessionId) {
      alert('A session is already active. Please stop it first.');
      return;
    }
    
    setStartLoading(true);
    console.log('🎬 Starting detection session...');
    
    try {
      const formData = new FormData();
      if (videoFile) {
        console.log('📹 Using uploaded video file:', videoFile.name);
        formData.append('file', videoFile);
      } else if (rtspLink) {
        console.log('📡 Using RTSP link:', rtspLink);
        formData.append('source', rtspLink);
      } else {
        alert('Please provide either an RTSP link or upload a video file.');
        setStartLoading(false);
        return;
      }

      // Add user email if available (optional for guest sessions)
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        formData.append('user_email', userEmail);
        console.log('👤 User email added to session:', userEmail);
      } else {
        console.log('👤 Starting guest session (no user email)');
      }

      // Add selected category
      formData.append('category', selectedCategory);
      console.log('📂 Selected category:', selectedCategory);

      console.log('📤 Sending request to start session...');
      const res = await sessionAPI.start(formData);
      console.log('✅ Session started successfully:', res.data);
      
      const id = res.data.session_id;
      setSessionId(id);
      localStorage.setItem('live_session_id', id);
      
      // Start background dashboard service (updates even when not viewing dashboard)
      console.log('🚀 Starting dashboard background service for session:', id);
      dashboardService.startSession(id);
      
      alert('Detection session started successfully!');
    } catch (err) {
      console.error('❌ Failed to start session:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || err.message || 'Unknown error';
      alert(`Failed to start session: ${errorMsg}\n\nPlease check the console for more details.`);
    } finally {
      setStartLoading(false);
    }
  };

  const handleStop = async () => {
    if (!sessionId) return;
    
    try {
      await sessionAPI.stop(sessionId);
      
      // Stop background dashboard service
      console.log('🛑 Stopping dashboard background service');
      dashboardService.stopSession();
      
      setSessionId(null);
      setProcessingStatus({ processing_complete: false, video_ready: false });
      localStorage.removeItem('live_session_id');
      alert('Detection session stopped successfully.');
    } catch (error) {
      console.error('Error stopping session:', error);
      // Still clear local state even if API call fails
      setSessionId(null);
      setProcessingStatus({ processing_complete: false, video_ready: false });
      localStorage.removeItem('live_session_id');
      alert('Session stopped locally. There may have been an error stopping it on the server.');
    }
  };

  const downloadProcessedVideo = async () => {
    if (!sessionId) {
      alert('No active session found.');
      return;
    }

    setDownloadLoading(true);
    try {
      const statusRes = await sessionAPI.getProcessingStatus(sessionId);
      
      if (!statusRes.data.processing_complete || !statusRes.data.video_ready) {
        alert('Video is still being processed. Please wait and try again.');
        setDownloadLoading(false);
        return;
      }

      const response = await videoAPI.downloadProcessed(sessionId);
      downloadBlob(response.data, `processed_potholes_${sessionId}.mp4`);
      alert('Video downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download video. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  };

  // Keep the video feed alive with cache-busting and auto-retry
  useEffect(() => {
    if (!sessionId) {
      setFeedSrc('');
      return;
    }

    // Initial src with cache-busting timestamp
    const makeSrc = () => `${videoAPI.getVideoFeedUrl(sessionId)}&ts=${Date.now()}`;
    
    // Only set if feedSrc is empty or sessionId changed
    if (!feedSrc || !feedSrc.includes(sessionId)) {
      setFeedSrc(makeSrc());
    }

    // Reduce refresh frequency to avoid disconnections (2 minutes instead of 30s)
    const refreshInterval = setInterval(() => {
      // Only refresh if still on the page and session is active
      const currentSessionId = localStorage.getItem('live_session_id');
      if (currentSessionId === sessionId) {
        console.log('🔄 Refreshing video feed...');
        setFeedSrc(makeSrc());
      }
    }, 120000); // refresh every 2 minutes

    return () => clearInterval(refreshInterval);
  }, [sessionId]);

  const handleFeedError = () => {
    console.warn('⚠️ Video feed error, retrying...');
    // Retry after a short delay with a new cache-busting param
    setTimeout(() => {
      const currentSessionId = localStorage.getItem('live_session_id');
      if (currentSessionId) {
        console.log('🔄 Reconnecting video feed...');
        setFeedSrc(`${videoAPI.getVideoFeedUrl(currentSessionId)}&ts=${Date.now()}`);
      }
    }, 3000); // Increased delay to 3 seconds
  };

  const handleFullscreen = () => {
    const el = liveFeedRef.current;
    if (el) {
      if (!document.fullscreenElement) {
        el.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  return (
    <div className="live-detect-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content-left">
          <h2 className="page-title">Live Detection</h2>
          <p className="page-subtitle">Monitor real-time pothole detection with GPS tracking</p>
        </div>
        <div className="header-badges">
          <div className={`gps-badge ${locationStatus.enabled ? 'active' : 'inactive'}`}>
            <MapPin size={16} />
            <span>{locationStatus.enabled ? 'GPS Active' : 'GPS Disabled'}</span>
          </div>
          {sessionId && (
            <ProcessingStatus 
              isComplete={processingStatus.processing_complete}
              isReady={processingStatus.video_ready}
            />
          )}
        </div>
      </div>

      {/* Control Form */}
      <Card className="control-card">
        <Card.Body>
          <Form onSubmit={startSession}>
            <Row className="g-3">
              <Col md={5}>
                <Form.Group>
                  <Form.Label>RTSP Link or Webcam</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter RTSP link or '0' for webcam"
                    value={rtspLink}
                    onChange={(e) => {
                      setRtspLink(e.target.value);
                      setVideoFile(null);
                    }}
                    disabled={!!videoFile}
                    size="lg"
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group>
                  <Form.Label>Upload Video File</Form.Label>
                  <Form.Control
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      setVideoFile(e.target.files[0]);
                      setRtspLink('');
                    }}
                    size="lg"
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                  disabled={startLoading || !!sessionId}
                >
                  {startLoading ? (
                    <>
                      <RefreshCw size={18} className="spinner-border spinner-border-sm" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play size={18} />
                      Start
                    </>
                  )}
                </Button>
              </Col>
            </Row>

            {/* Category Toggle */}
            <div className="category-selection-container mt-4 mb-2">
              <label className="form-label d-block text-muted small text-uppercase fw-bold mb-3">
                Detection Category
              </label>
              <div className="category-toggle-group">
                <button
                  type="button"
                  className={`category-toggle-btn ${selectedCategory === 'Saferoute AI' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('Saferoute AI')}
                  disabled={!!sessionId}
                >
                  <div className="btn-content">
                    <span className="dot"></span>
                    <span className="text">Saferoute AI</span>
                  </div>
                </button>
                <button
                  type="button"
                  className={`category-toggle-btn ${selectedCategory === 'Traffic Safety' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('Traffic Safety')}
                  disabled={!!sessionId}
                >
                  <div className="btn-content">
                    <span className="dot"></span>
                    <span className="text">Traffic Safety</span>
                  </div>
                </button>
              </div>
              {selectedCategory === 'Traffic Safety' && (
                <div className="mt-2">
                  <Badge bg="info" className="p-2">
                    Note: Traffic Safety dashboard is coming soon!
                  </Badge>
                </div>
              )}
            </div>

            {sessionId && (
              <Row className="g-3 mt-2">
                <Col md={6}>
                  <Button
                    variant="danger"
                    onClick={handleStop}
                    size="lg"
                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                  >
                    <Square size={18} />
                    Stop Detection
                  </Button>
                </Col>
                <Col md={6}>
                  <Button
                    variant="success"
                    onClick={downloadProcessedVideo}
                    disabled={downloadLoading || !processingStatus.video_ready}
                    size="lg"
                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                  >
                    {downloadLoading ? <RefreshCw size={18} className="spinner-border spinner-border-sm" /> : <Download size={18} />}
                    {downloadLoading ? 'Downloading...' : 'Download Video'}
                  </Button>
                </Col>
              </Row>
            )}
          </Form>
        </Card.Body>
      </Card>

      {/* GPS Status Card */}
      {sessionId && (
        <div className={`gps-status-alert ${locationStatus.enabled ? 'success' : 'warning'}`}>
          <div className="alert-content">
            <MapPin size={24} className="alert-icon" />
            <div className="alert-text">
              <h6 className="alert-heading">GPS Tracking Status</h6>
              {locationStatus.enabled ? (
                <>
                  <p className="mb-1"><strong>Status:</strong> Active - Tracking potholes with GPS coordinates</p>
                  {locationStatus.coordinates && (
                    <p className="mb-1">
                      <strong>Current Location:</strong> {locationStatus.coordinates.lat.toFixed(6)}, {locationStatus.coordinates.lng.toFixed(6)}
                    </p>
                  )}
                  {locationStatus.lastUpdate && (
                    <p className="mb-0">
                      <strong>Last Update:</strong> {locationStatus.lastUpdate.toLocaleTimeString()}
                    </p>
                  )}
                </>
              ) : (
                <p className="mb-0">
                  <strong>Warning:</strong> GPS is disabled. Pothole locations will not be tracked. Please enable location access.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Feed */}
      <Card className="video-feed-card">
        <Card.Header className="video-header">
          <div className="video-header-left">
            <Video size={20} />
            <h5 className="video-title">Live Video Feed</h5>
          </div>
          {sessionId && (
            <button className="fullscreen-btn" onClick={handleFullscreen}>
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
          )}
        </Card.Header>
        <Card.Body className="video-body">
          {/* Video preview for uploaded file */}
          {videoPreview && !sessionId && (
            <video
              src={videoPreview}
              controls
              className="w-100"
              style={{ maxHeight: '600px' }}
            />
          )}

          {/* Live feed if session started */}
          {sessionId && (
            <div ref={liveFeedRef} className="position-relative">
              <img
                src={feedSrc}
                alt="Live Feed"
                className="w-100"
                style={{ maxHeight: '600px', objectFit: 'contain' }}
                onError={handleFeedError}
              />
            </div>
          )}

          {/* Placeholder if nothing selected */}
          {!videoPreview && !sessionId && (
            <div className="video-placeholder">
              <div className="placeholder-content">
                <Video size={64} />
                <p>No video selected. Upload a file or enter an RTSP link to start detection.</p>
              </div>
            </div>
          )}
        </Card.Body>
        {sessionId && processingStatus && (
          <Card.Footer className="video-footer">
            <div className="footer-content">
              {processingStatus.processing_complete ? (
                <>
                  <Badge bg="success">Complete</Badge>
                  <small className="text-muted">Your processed video with pothole annotations is ready for download.</small>
                </>
              ) : (
                <>
                  <Badge bg="warning">Processing</Badge>
                  <small className="text-muted">The system is creating an annotated video with all detected potholes marked.</small>
                </>
              )}
            </div>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
};

export default LiveDetect;
