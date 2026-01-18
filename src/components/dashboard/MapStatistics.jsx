import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { MapPin as MapPinIcon, TrendingUp, Activity, Navigation } from 'lucide-react';
import './MapStatistics.css';

const MapStatistics = ({ potholeDetails }) => {
  if (!potholeDetails) return null;

  return (
    <Row className="mb-3 g-3">
      <Col xs={12} sm={6} md={3}>
        <Card className="map-stat-card pothole-stat">
          <Card.Body className="p-3">
            <div className="d-flex align-items-center gap-2">
              <div className="map-stat-icon pothole-icon">
                <MapPinIcon size={24} />
              </div>
              <div>
                <div className="map-stat-label">Total Potholes</div>
                <div className="map-stat-value">{potholeDetails.total_potholes_detected}</div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col xs={12} sm={6} md={3}>
        <Card className="map-stat-card confidence-stat">
          <Card.Body className="p-3">
            <div className="d-flex align-items-center gap-2">
              <div className="map-stat-icon confidence-icon">
                <TrendingUp size={24} />
              </div>
              <div>
                <div className="map-stat-label">Avg Confidence</div>
                <div className="map-stat-value">{(potholeDetails.statistics.average_confidence * 100).toFixed(1)}%</div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col xs={12} sm={6} md={3}>
        <Card className="map-stat-card highest-stat">
          <Card.Body className="p-3">
            <div className="d-flex align-items-center gap-2">
              <div className="map-stat-icon highest-icon">
                <Activity size={24} />
              </div>
              <div>
                <div className="map-stat-label">Highest Conf.</div>
                <div className="map-stat-value">{(potholeDetails.statistics.highest_confidence * 100).toFixed(1)}%</div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col xs={12} sm={6} md={3}>
        <Card className="map-stat-card progress-stat">
          <Card.Body className="p-3">
            <div className="d-flex align-items-center gap-2">
              <div className="map-stat-icon progress-icon">
                <Navigation size={24} />
              </div>
              <div>
                <div className="map-stat-label">Progress</div>
                <div className="map-stat-value">{potholeDetails.video_info.progress_percentage}%</div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default MapStatistics;