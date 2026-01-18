import React from 'react';
import { Badge } from 'react-bootstrap';
import './AlertStatus.css';

const SEVERITY_COLORS = {
  'Low': '#27ae60',
  'Medium': '#f39c12',
  'High': '#e67e22',
  'Critical': '#e74c3c'
};

const AlertStatus = ({ alertEnabled, alertStatus }) => {
  return (
    <div className="alert-status-card">
      <div className="d-flex align-items-center gap-2">
        <div className={`alert-indicator ${alertEnabled ? 'active' : 'inactive'}`}>
          <i className={`bi bi-bell${alertEnabled ? '-fill' : '-slash-fill'}`}></i>
        </div>
        <div>
          <div className="alert-status-title">
            Alert System: <strong>{alertEnabled ? 'Active' : 'Disabled'}</strong>
          </div>
          {alertStatus.lastSent && (
            <div className="alert-status-info">
              Last: {alertStatus.lastSent} | Severity: 
              <Badge 
                bg="" 
                style={{ 
                  backgroundColor: SEVERITY_COLORS[alertStatus.lastSeverity] || '#6c757d',
                  marginLeft: '4px'
                }}
              >
                {alertStatus.lastSeverity || 'N/A'}
              </Badge>
            </div>
          )}
          {!alertStatus.lastSent && alertEnabled && (
            <div className="alert-status-info text-muted">
              Checking every minute...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertStatus;