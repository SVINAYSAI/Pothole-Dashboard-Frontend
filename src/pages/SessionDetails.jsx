import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Badge, Button, Alert, Spinner, Tab, Tabs, Table } from 'react-bootstrap';
import { 
  ArrowLeft, Download, MapPin, Video, TrendingUp, Clock, 
  FileText, Activity, Navigation, Trash2, AlertTriangle, Play, Film, HardDrive
} from 'lucide-react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { historyAPI, videoAPI } from '../services/api';
import { downloadBlob } from '../utils/helpers';
import './SessionDetails.css';

const SessionDetails = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [sessionData, setSessionData] = useState(null);
  const [potholes, setPotholes] = useState([]);
  const [gpsTrack, setGpsTrack] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchSessionData();
  }, [sessionId]);

  // Log when video tab is accessed
  useEffect(() => {
    if (activeTab === 'video') {
      const streamUrl = videoAPI.getStreamUrl(sessionId);
      console.log('🎥 [View Video] Switched to video tab for session:', sessionId);
      console.log('🎥 [View Video] Stream URL:', streamUrl);
      console.log('🎥 [View Video] Video info:', videoInfo);
    }
  }, [activeTab, sessionId, videoInfo]);

  const fetchSessionData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [detailsRes, potholesRes, gpsRes, videoRes] = await Promise.allSettled([
        historyAPI.getSessionDetails(sessionId),
        historyAPI.getSessionPotholes(sessionId),
        historyAPI.getGPSTrack(sessionId),
        videoAPI.getVideoInfo(sessionId)
      ]);

      if (detailsRes.status === 'fulfilled') {
        setSessionData(detailsRes.value.data);
      } else {
        throw new Error('Failed to load session details');
      }

      if (potholesRes.status === 'fulfilled') {
        setPotholes(potholesRes.value.data.potholes || []);
      }

      if (gpsRes.status === 'fulfilled') {
        setGpsTrack(gpsRes.value.data);
      }

      if (videoRes.status === 'fulfilled') {
        setVideoInfo(videoRes.value.data);
      }
    } catch (err) {
      console.error('Error fetching session data:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to load session data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVideo = async () => {
    console.log('📥 [Download Video] Initiating direct download for session:', sessionId);
    try {
      // Use direct link instead of Axios blob to handle large files reliably
      const downloadUrl = videoAPI.getDownloadUrl(sessionId);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `processed_${sessionId}.mp4`);
      // Important: don't set target="_blank" if you want reliable download behavior with Content-Disposition
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      console.log('📥 [Download Video] Direct download link triggered for session:', sessionId);
    } catch (err) {
      console.error('📥 [Download Video] Download triggering failed:', err);
      alert('Failed to start download');
    }
  };

  const handleDeleteSession = async () => {
    if (!window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return;
    }

    try {
      await historyAPI.deleteSession(sessionId);
      alert('Session deleted successfully');
      navigate('/history');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete session');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      initialized: 'secondary',
      processing: 'warning',
      completed: 'success',
      error: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'} className="status-badge">{status}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'Low': '#28a745',
      'Medium': '#ffc107',
      'High': '#dc3545'
    };
    return colors[severity] || '#6c757d';
  };

  if (loading) {
    return (
      <div className="session-details-page">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3">Loading session details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="session-details-page">
        <Alert variant="danger">
          <AlertTriangle size={20} className="me-2" />
          {error}
        </Alert>
        <Button variant="primary" onClick={() => navigate('/history')}>
          <ArrowLeft size={18} className="me-2" />
          Back to History
        </Button>
      </div>
    );
  }

  if (!sessionData) return null;

  return (
    <div className="session-details-page">
      {/* Header */}
      <div className="details-header">
        <Button 
          variant="outline-primary" 
          onClick={() => navigate('/history')}
          className="back-btn"
        >
          <ArrowLeft size={18} />
        </Button>
        
        <div className="header-info">
          <div>
            <h2 className="session-title">Session {sessionId.substring(0, 8)}</h2>
            <p className="session-date">{formatDate(sessionData.created_at)}</p>
          </div>
          <div className="header-actions">
            {getStatusBadge(sessionData.status)}
            {sessionData.status === 'completed' && (
              <Button variant="success" onClick={handleDownloadVideo}>
                <Download size={18} className="me-2" />
                Download Video
              </Button>
            )}
            <Button variant="outline-danger" onClick={handleDeleteSession}>
              <Trash2 size={18} className="me-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row className="stats-row g-3 mb-4">
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon-wrapper blue">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Potholes</div>
                <div className="stat-value">{sessionData.statistics?.total_potholes || 0}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon-wrapper green">
                <MapPin size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Distance Covered</div>
                <div className="stat-value">
                  {sessionData.statistics?.distance_km 
                    ? `${sessionData.statistics.distance_km.toFixed(2)} km` 
                    : 'N/A'}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon-wrapper orange">
                <Video size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Frames Processed</div>
                <div className="stat-value">{sessionData.video_metadata?.total_frames || 0}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon-wrapper purple">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Duration</div>
                <div className="stat-value">
                  {sessionData.statistics?.duration_seconds 
                    ? `${Math.round(sessionData.statistics.duration_seconds)}s` 
                    : 'N/A'}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabbed Content */}
      <Card className="content-card">
        <Card.Body>
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="details-tabs">
            
            {/* Overview Tab */}
            <Tab eventKey="overview" title="Overview">
              <Row className="mt-4 g-4">
                <Col lg={6}>
                  <h5 className="section-title">Video Metadata</h5>
                  <Table bordered hover>
                    <tbody>
                      <tr>
                        <td><strong>Total Frames</strong></td>
                        <td>{sessionData.video_metadata?.total_frames || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>FPS</strong></td>
                        <td>{sessionData.video_metadata?.fps || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Resolution</strong></td>
                        <td>
                          {sessionData.video_metadata?.width && sessionData.video_metadata?.height
                            ? `${sessionData.video_metadata.width}x${sessionData.video_metadata.height}`
                            : 'N/A'}
                        </td>
                      </tr>
                    </tbody>
                  </Table>

                  <h5 className="section-title mt-4">Detection Configuration</h5>
                  <Table bordered hover>
                    <tbody>
                      <tr>
                        <td><strong>Model</strong></td>
                        <td>{sessionData.detection_config?.model_name || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Confidence</strong></td>
                        <td>{sessionData.detection_config?.confidence_threshold || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>IOU Threshold</strong></td>
                        <td>{sessionData.detection_config?.iou_threshold || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>

                <Col lg={6}>
                  <h5 className="section-title">Detection Statistics</h5>
                  <Table bordered hover>
                    <tbody>
                      <tr>
                        <td><strong>Total Detections</strong></td>
                        <td>{sessionData.statistics?.total_detections || 0}</td>
                      </tr>
                      {sessionData.statistics?.detection_counts && Object.entries(sessionData.statistics.detection_counts).map(([key, value]) => (
                        <tr key={key}>
                          <td><strong>{key}</strong></td>
                          <td>{value}</td>
                        </tr>
                      ))}
                      <tr>
                        <td><strong>Distance (meters)</strong></td>
                        <td>{sessionData.statistics?.distance_meters?.toFixed(2) || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Avg Detections/Frame</strong></td>
                        <td>{sessionData.statistics?.avg_detections_per_frame?.toFixed(3) || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </Table>

                  <h5 className="section-title mt-4">Session Timeline</h5>
                  <Table bordered hover>
                    <tbody>
                      <tr>
                        <td><strong>Created</strong></td>
                        <td>{formatDate(sessionData.created_at)}</td>
                      </tr>
                      <tr>
                        <td><strong>Started</strong></td>
                        <td>{formatDate(sessionData.started_at)}</td>
                      </tr>
                      <tr>
                        <td><strong>Completed</strong></td>
                        <td>{formatDate(sessionData.completed_at)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Tab>

            {/* Potholes Tab */}
            <Tab eventKey="potholes" title={`Potholes (${potholes.length})`}>
              <div className="mt-4">
                {potholes.length === 0 ? (
                  <Alert variant="info">No potholes detected in this session</Alert>
                ) : (
                  <div className="table-responsive">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Frame</th>
                          <th>Confidence</th>
                          <th>Severity</th>
                          <th>Location</th>
                          <th>Size (px)</th>
                          <th>Detected At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {potholes.map((pothole, idx) => (
                          <tr key={idx}>
                            <td>{pothole.pothole_id}</td>
                            <td>{pothole.detection_info?.frame_number}</td>
                            <td>
                              <Badge bg="primary">
                                {(pothole.detection_info?.confidence * 100).toFixed(1)}%
                              </Badge>
                            </td>
                            <td>
                              <Badge 
                                style={{ 
                                  backgroundColor: getSeverityColor(pothole.severity?.estimated_severity),
                                  color: 'white'
                                }}
                              >
                                {pothole.severity?.estimated_severity || 'N/A'}
                              </Badge>
                            </td>
                            <td>
                              {pothole.location?.coordinates 
                                ? `${pothole.location.coordinates[1].toFixed(6)}, ${pothole.location.coordinates[0].toFixed(6)}`
                                : 'N/A'}
                            </td>
                            <td>{pothole.severity?.size_pixels || 'N/A'}</td>
                            <td>{formatDate(pothole.detection_info?.detected_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </div>
            </Tab>

            {/* GPS Map Tab */}
            <Tab eventKey="gps" title="GPS Track">
              <div className="mt-4">
                {gpsTrack && gpsTrack.track_points && gpsTrack.track_points.length > 0 ? (
                  <>
                    <Row className="mb-3">
                      <Col md={4}>
                        <Card className="info-card">
                          <Card.Body>
                            <Navigation size={20} className="text-primary mb-2" />
                            <div className="info-label">Total Points</div>
                            <div className="info-value">{gpsTrack.summary?.total_points || 0}</div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className="info-card">
                          <Card.Body>
                            <MapPin size={20} className="text-success mb-2" />
                            <div className="info-label">Distance</div>
                            <div className="info-value">
                              {gpsTrack.summary?.total_distance_meters 
                                ? `${(gpsTrack.summary.total_distance_meters / 1000).toFixed(2)} km`
                                : 'N/A'}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className="info-card">
                          <Card.Body>
                            <Clock size={20} className="text-warning mb-2" />
                            <div className="info-label">Duration</div>
                            <div className="info-value">
                              {gpsTrack.summary?.start_time && gpsTrack.summary?.end_time
                                ? `${Math.round((new Date(gpsTrack.summary.end_time) - new Date(gpsTrack.summary.start_time)) / 1000)}s`
                                : 'N/A'}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    
                    {/* Check if Google Maps API key is configured */}
                    {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
                      <Alert variant="warning">
                        <AlertTriangle size={20} className="me-2" />
                        <strong>Google Maps API Key Not Configured</strong>
                        <p className="mb-0 mt-2">
                          To view the GPS map, please add your Google Maps API key to the <code>.env</code> file:
                          <br />
                          <code>VITE_GOOGLE_MAPS_API_KEY=your_api_key_here</code>
                          <br />
                          <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank" rel="noopener noreferrer">
                            Get an API key here
                          </a>
                        </p>
                      </Alert>
                    ) : (
                      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                        <GoogleMap
                          mapContainerStyle={{ width: '100%', height: '500px', borderRadius: '12px' }}
                          center={{
                            lat: gpsTrack.track_points[0]?.latitude || 0,
                            lng: gpsTrack.track_points[0]?.longitude || 0
                          }}
                          zoom={13}
                        >
                          {/* Route polyline - only render if we have valid points */}
                          {gpsTrack.track_points.length > 1 && (
                            <Polyline
                              path={gpsTrack.track_points
                                .filter(point => point.latitude && point.longitude)
                                .map(point => ({
                                  lat: point.latitude,
                                  lng: point.longitude
                                }))}
                              options={{
                                strokeColor: '#0d6efd',
                                strokeWeight: 4,
                                strokeOpacity: 0.8
                              }}
                            />
                          )}
                          
                          {/* Pothole markers */}
                          {potholes
                            .filter(p => p.location?.coordinates && p.location.coordinates.length >= 2)
                            .map((pothole, idx) => (
                              <Marker
                                key={`pothole-${idx}`}
                                position={{
                                  lat: pothole.location.coordinates[1],
                                  lng: pothole.location.coordinates[0]
                                }}
                                icon={{
                                  url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                                }}
                                title={`Pothole #${pothole.pothole_id} - ${pothole.severity?.estimated_severity || 'Unknown'} severity`}
                              />
                            ))
                          }
                          
                          {/* Start marker */}
                          {gpsTrack.track_points[0]?.latitude && gpsTrack.track_points[0]?.longitude && (
                            <Marker
                              position={{
                                lat: gpsTrack.track_points[0].latitude,
                                lng: gpsTrack.track_points[0].longitude
                              }}
                              icon={{
                                url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                              }}
                              title="Start"
                            />
                          )}
                          
                          {/* End marker */}
                          {gpsTrack.track_points.length > 0 && 
                           gpsTrack.track_points[gpsTrack.track_points.length - 1]?.latitude && 
                           gpsTrack.track_points[gpsTrack.track_points.length - 1]?.longitude && (
                            <Marker
                              position={{
                                lat: gpsTrack.track_points[gpsTrack.track_points.length - 1].latitude,
                                lng: gpsTrack.track_points[gpsTrack.track_points.length - 1].longitude
                              }}
                              icon={{
                                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                              }}
                              title="End"
                            />
                          )}
                        </GoogleMap>
                      </LoadScript>
                    )}
                  </>
                ) : (
                  <Alert variant="info">
                    <MapPin size={20} className="me-2" />
                    No GPS tracking data available for this session
                  </Alert>
                )}
              </div>
            </Tab>

            {/* Video Tab */}
            <Tab eventKey="video" title="Processed Video">
              <div className="mt-4">
                {videoInfo?.video_available ? (
                  <div className="video-player-section">
                    {/* Video Info Cards */}
                    <Row className="mb-4 g-3">
                      <Col md={4}>
                        <Card className="info-card">
                          <Card.Body>
                            <Film size={20} className="text-primary mb-2" />
                            <div className="info-label">Video Status</div>
                            <div className="info-value">
                              <Badge bg="success">Ready to Play</Badge>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className="info-card">
                          <Card.Body>
                            <HardDrive size={20} className="text-success mb-2" />
                            <div className="info-label">File Size</div>
                            <div className="info-value">{videoInfo.video_size_mb} MB</div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className="info-card">
                          <Card.Body>
                            <Video size={20} className="text-warning mb-2" />
                            <div className="info-label">Resolution</div>
                            <div className="info-value">
                              {sessionData?.video_metadata?.width && sessionData?.video_metadata?.height
                                ? `${sessionData.video_metadata.width}x${sessionData.video_metadata.height}`
                                : 'N/A'}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    {/* Video Player Container */}
                    <Card className="video-player-card">
                      <Card.Body>
                        <div className="video-container">
                          <video
                            controls
                            className="session-video-player"
                            poster=""
                            crossOrigin="anonymous"
                            onLoadStart={() => console.log('🎥 [View Video] Video loading started for session:', sessionId)}
                            onCanPlay={() => console.log('🎥 [View Video] Video ready to play for session:', sessionId)}
                            onPlay={() => console.log('🎥 [View Video] Video playback started for session:', sessionId)}
                            onPause={() => console.log('🎥 [View Video] Video playback paused for session:', sessionId)}
                            onEnded={() => console.log('🎥 [View Video] Video playback ended for session:', sessionId)}
                            onError={(e) => {
                              console.error('🎥 [View Video] Video error for session:', sessionId, 'Error object:', e);
                              const videoElement = e.target;
                              console.error('🎥 [View Video] Video error code:', videoElement.error?.code);
                              console.error('🎥 [View Video] Video error message:', videoElement.error?.message);
                            }}
                          >
                            <source src={videoAPI.getStreamUrl(sessionId)} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                        
                        {/* Video Actions */}
                        <div className="video-actions mt-3">
                          <Button 
                            variant="success" 
                            size="lg" 
                            onClick={handleDownloadVideo}
                            className="download-video-btn"
                          >
                            <Download size={20} className="me-2" />
                            Download Processed Video
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                ) : (
                  <Alert variant="warning" className="video-unavailable-alert">
                    <div className="d-flex align-items-center">
                      <AlertTriangle size={24} className="me-3" />
                      <div>
                        <h5 className="mb-1">Video Not Available</h5>
                        <p className="mb-0">
                          {sessionData?.status === 'processing' 
                            ? 'Video is still being processed. Please check back later.'
                            : sessionData?.status === 'error'
                            ? 'Video processing failed. The video could not be generated.'
                            : 'The processed video is not available for this session.'}
                        </p>
                      </div>
                    </div>
                  </Alert>
                )}
              </div>
            </Tab>

          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SessionDetails;
