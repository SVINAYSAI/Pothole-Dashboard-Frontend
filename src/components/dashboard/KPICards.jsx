import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { Activity, Navigation, TrendingUp, AlertTriangle } from 'lucide-react';
import './KPICards.css';

const SEVERITY_COLORS = {
  'Low': '#27ae60',
  'Medium': '#f39c12',
  'High': '#e67e22',
  'Critical': '#e74c3c'
};

const KPICards = ({ kpis }) => {
  return (
    <Row className="kpi-row mb-4 g-3">
      <Col xs={12} sm={4}>
        <Card className="kpi-card">
          <Card.Body>
            <div className="kpi-icon-wrapper" style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)' }}>
              <Activity size={24} className="kpi-icon" style={{ color: '#e74c3c' }} />
            </div>
            <div className="kpi-content">
              <div className="kpi-label">Total Potholes</div>
              <div className="kpi-value">{kpis.totalPotholes}</div>
              <div className="kpi-description">Detected defects</div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} sm={4}>
        <Card className="kpi-card">
          <Card.Body>
            <div className="kpi-icon-wrapper" style={{ backgroundColor: 'rgba(52, 152, 219, 0.1)' }}>
              <Navigation size={24} className="kpi-icon" style={{ color: '#3498db' }} />
            </div>
            <div className="kpi-content">
              <div className="kpi-label">Distance Covered</div>
              <div className="kpi-value">{kpis.distanceKm} km</div>
              <div className="kpi-description">{kpis.distanceMeters} meters</div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} sm={4}>
        <Card className="kpi-card">
          <Card.Body>
            <div className="kpi-icon-wrapper" style={{ backgroundColor: 'rgba(243, 156, 18, 0.1)' }}>
              <TrendingUp size={24} className="kpi-icon" style={{ color: '#f39c12' }} />
            </div>
            <div className="kpi-content">
              <div className="kpi-label">Severity</div>
              <div className="d-flex align-items-center gap-2">
                <span className="kpi-value">{kpis.severity}</span>
                <Badge 
                  className="kpi-badge"
                  style={{ 
                    backgroundColor: SEVERITY_COLORS[kpis.severityLevel] || '#666',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    padding: '0.3rem 0.6rem',
                    fontWeight: 'bold'
                  }}
                >
                  {kpis.severityLevel}
                </Badge>
              </div>
              <div className="kpi-description">Potholes per km</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default KPICards;