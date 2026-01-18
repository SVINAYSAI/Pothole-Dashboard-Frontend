import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Badge, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { Clock, MapPin, Video, TrendingUp, Calendar, Filter, Trash2 } from 'lucide-react';
import { historyAPI } from '../services/api';
import './SessionHistory.css';

const SessionHistory = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(localStorage.getItem('selected_category') || 'Saferoute AI');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Save category to localStorage whenever it changes
    localStorage.setItem('selected_category', selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    // Get user ID from localStorage
    const userStr = localStorage.getItem('user');
    
    if (!userStr || userStr === '{}') {
      setError('User information not found. Please login again.');
      setLoading(false);
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      const uid = user._id || user.id || user.user_id || user.userId;
      
      if (uid) {
        setUserId(uid);
        fetchSessions(uid, filterStatus, selectedCategory);
      } else {
        setError('User ID not found. Please login again.');
        setLoading(false);
      }
    } catch (parseError) {
      setError('Invalid user data. Please login again.');
      setLoading(false);
    }
  }, []);

  const fetchSessions = async (uid, status = '', category = 'Saferoute AI') => {
    try {
      setLoading(true);
      setError(null);
      const params = { 
        limit: 50,
        category: category 
      };
      if (status) params.status = status;
      
      const response = await historyAPI.getUserSessions(uid, params);
      setSessions(response.data.sessions || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err.response?.data?.detail || 'Failed to load session history');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (userId) {
      fetchSessions(userId, status, selectedCategory);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (userId) {
      fetchSessions(userId, filterStatus, category);
    }
  };

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return;
    }

    try {
      await historyAPI.deleteSession(sessionId);
      // Refresh sessions after deletion
      if (userId) {
        fetchSessions(userId, filterStatus);
      }
      alert('Session deleted successfully');
    } catch (err) {
      console.error('Error deleting session:', err);
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
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
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

  const SessionCard = ({ session }) => (
    <Card 
      className="session-card" 
      onClick={() => navigate(`/history/session/${session.session_id}`)}
    >
      <Card.Body>
        <div className="session-card-header">
          <div>
            <h5 className="session-id">Session {session.session_id.substring(0, 8)}</h5>
            <div className="session-meta">
              <Calendar size={14} />
              <span>{formatDate(session.created_at)}</span>
            </div>
          </div>
          <div className="session-actions">
            {getStatusBadge(session.status)}
            <Button
              variant="outline-danger"
              size="sm"
              onClick={(e) => handleDeleteSession(session.session_id, e)}
              className="delete-btn"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        <Row className="session-stats mt-3">
          <Col xs={6} md={3}>
            <div className="stat-item">
              <Video size={18} className="stat-icon" />
              <div>
                <div className="stat-label">Frames</div>
                <div className="stat-value">
                  {session.video_metadata?.total_frames || 0}
                </div>
              </div>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="stat-item">
              <TrendingUp size={18} className="stat-icon" />
              <div>
                <div className="stat-label">Potholes</div>
                <div className="stat-value">
                  {session.statistics?.total_potholes || 0}
                </div>
              </div>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="stat-item">
              <MapPin size={18} className="stat-icon" />
              <div>
                <div className="stat-label">Distance</div>
                <div className="stat-value">
                  {session.statistics?.distance_km 
                    ? `${session.statistics.distance_km.toFixed(2)} km` 
                    : 'N/A'}
                </div>
              </div>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="stat-item">
              <Clock size={18} className="stat-icon" />
              <div>
                <div className="stat-label">Duration</div>
                <div className="stat-value">
                  {session.statistics?.duration_seconds 
                    ? `${Math.round(session.statistics.duration_seconds)}s` 
                    : 'N/A'}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {session.user_email && (
          <div className="session-footer mt-3">
            <small className="text-muted">
              <i className="bi bi-envelope me-1"></i>
              {session.user_email}
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <div className="session-history-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h2 className="page-title">Session History</h2>
          <p className="page-subtitle">View and manage your detection sessions</p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="filter-card mb-4">
        <Card.Body className="d-flex align-items-center gap-3 flex-wrap">
          <div className="category-toggle-container">
            <div className="category-toggle">
              <button 
                className={`category-btn ${selectedCategory === 'Saferoute AI' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('Saferoute AI')}
              >
                Saferoute AI
              </button>
              <button 
                className={`category-btn ${selectedCategory === 'Traffic Safety' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('Traffic Safety')}
              >
                Traffic Safety
              </button>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 ms-md-4">
            <Filter size={20} className="text-muted" />
            <Form.Select
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              style={{ maxWidth: '200px' }}
              className="status-filter"
            >
              <option value="">All Status</option>
              <option value="initialized">Initialized</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="error">Error</option>
            </Form.Select>
          </div>

          <div className="ms-auto text-muted d-none d-sm-block">
            {sessions.length} session(s) found
          </div>
        </Card.Body>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading sessions...</p>
        </div>
      )}

      {/* Sessions Grid */}
      {!loading && !error && (
        <>
          {sessions.length === 0 ? (
            <Card className="empty-state">
              <Card.Body className="text-center py-5">
                <Video size={64} className="text-muted mb-3" />
                <h4>No Sessions Found</h4>
                <p className="text-muted">
                  {filterStatus 
                    ? `No sessions with status "${filterStatus}"`
                    : "You haven't created any detection sessions yet"}
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/live-detect')}
                  className="mt-3"
                >
                  Start New Session
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-4">
              {sessions.map((session) => (
                <Col key={session.session_id} lg={6} xl={4}>
                  <SessionCard session={session} />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default SessionHistory;
