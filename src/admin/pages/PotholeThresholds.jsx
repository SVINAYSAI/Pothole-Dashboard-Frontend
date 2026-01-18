import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Spinner, Alert } from 'react-bootstrap';
import { Save, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';
import './PotholeThresholds.css';

const PotholeThresholds = () => {
  const [thresholds, setThresholds] = useState({});
  const [selectedRegion, setSelectedRegion] = useState('urban');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const regionOptions = [
    { value: 'urban', label: 'Urban / City Roads' },
    { value: 'semiUrban', label: 'Semi-Urban / Town Roads' },
    { value: 'rural', label: 'Rural / Village Roads' },
    { value: 'highways', label: 'Highways (NH / SH / Expressways)' },
    { value: 'industrial', label: 'Industrial / Heavy-Load Zones' },
    { value: 'residential', label: 'Residential / Campus / IT Parks' },
    { value: 'hilly', label: 'Hilly / Ghat Roads' }
  ];

  const fetchThresholds = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/thresholds/`);
      setThresholds(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching thresholds:', err);
      setError('Failed to load thresholds. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThresholds();
  }, []);

  const handleInputChange = (region, index, field, value) => {
    const updatedThresholds = { ...thresholds };
    const updatedRegionThresholds = [...updatedThresholds[region]];
    
    // Convert numeric fields
    if (field === 'min' || field === 'max') {
      updatedRegionThresholds[index][field] = value === '' ? null : parseFloat(value);
    } else {
      updatedRegionThresholds[index][field] = value;
    }
    
    updatedThresholds[region] = updatedRegionThresholds;
    setThresholds(updatedThresholds);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.put(`${API_BASE_URL}/api/thresholds/${selectedRegion}`, thresholds[selectedRegion]);
      setSuccess(`Thresholds for ${regionOptions.find(r => r.value === selectedRegion)?.label} saved successfully!`);
      setSaving(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving thresholds:', err);
      setError('Failed to save thresholds. Please try again.');
      setSaving(false);
    }
  };

  const renderThresholdTable = (region, regionData) => {
    if (!regionData) return null;

    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Min (potholes/km)</th>
            <th>Max (potholes/km)</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {regionData.map((row, index) => (
            <tr key={index}>
              <td>
                <Form.Control
                  type="number"
                  step="0.1"
                  value={row.min}
                  onChange={(e) => handleInputChange(region, index, 'min', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  step="0.1"
                  placeholder="None"
                  value={row.max === null ? '' : row.max}
                  onChange={(e) => handleInputChange(region, index, 'max', e.target.value)}
                />
              </td>
              <td>
                <Form.Select
                  value={row.status}
                  onChange={(e) => handleInputChange(region, index, 'status', e.target.value)}
                >
                  <option value="Normal">Normal</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </Form.Select>
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.action}
                  onChange={(e) => handleInputChange(region, index, 'action', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Container fluid className="pothole-thresholds-page">
      <div className="page-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="page-title">Pothole Density Thresholds</h2>
            <p className="page-subtitle">Configure pothole detection parameters by region</p>
          </div>
          <Button variant="outline-primary" onClick={fetchThresholds} disabled={loading}>
            <RefreshCw size={18} className={`me-2 ${loading ? 'spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row className="g-4">
        <Col lg={12}>
          <Card className="threshold-card">
            <Card.Header>
              <h5 className="mb-0">Configure Regional Thresholds</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center p-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading thresholds...</p>
                </div>
              ) : (
                <Form>
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group controlId="regionSelect">
                        <Form.Label>Select Region</Form.Label>
                        <Form.Select 
                          value={selectedRegion} 
                          onChange={(e) => setSelectedRegion(e.target.value)}
                        >
                          {regionOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={12}>
                      <h6>{regionOptions.find(r => r.value === selectedRegion)?.label} Thresholds</h6>
                      {renderThresholdTable(selectedRegion, thresholds[selectedRegion])}
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end">
                    <Button 
                      variant="primary" 
                      onClick={handleSave} 
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} className="me-2" />
                          Save Configuration
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={12}>
          <Card className="info-card">
            <Card.Header>
              <h5 className="mb-0">About Pothole Density Thresholds</h5>
            </Card.Header>
            <Card.Body>
              <p>
                Pothole density thresholds help classify road conditions based on the number of potholes per kilometer. 
                Different regions have varying traffic loads and maintenance requirements, so thresholds are customized accordingly.
              </p>
              <ul>
                <li><strong>Normal:</strong> Road condition is acceptable, no immediate action required</li>
                <li><strong>Low:</strong> Minor issues detected, monitoring recommended</li>
                <li><strong>Medium:</strong> Moderate damage, scheduled maintenance advised</li>
                <li><strong>High:</strong> Significant damage, priority repairs needed</li>
                <li><strong>Critical:</strong> Severe damage, immediate action required for safety</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PotholeThresholds;
