import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Card, Spinner, Form, Button } from 'react-bootstrap';
import { useJsApiLoader } from '@react-google-maps/api';
import Chart from 'react-apexcharts';
import Papa from 'papaparse';
import { BarChart3, TrendingUp, PieChart, MapPin as MapPinIcon } from 'lucide-react';
import { sessionAPI, dataAPI } from '../services/api';
import { GOOGLE_MAPS_API_KEY, MAP_LIBRARIES, API_BASE_URL } from '../config/constants';
import { getUniqueColor } from '../utils/helpers';
import dashboardService from '../services/dashboardService';

// Import Dashboard Components
import KPICards from '../components/dashboard/KPICards';
import AlertStatus from '../components/dashboard/AlertStatus';
import DetectionCharts from '../components/dashboard/DetectionCharts';
import TrendChart from '../components/dashboard/TrendChart';
import TopDetections from '../components/dashboard/TopDetections';
import MapStatistics from '../components/dashboard/MapStatistics';
import PotholeMap from '../components/dashboard/PotholeMap';
import SectionHeader from '../components/dashboard/SectionHeader';

import '../styles/AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('live_session_id') || null);
  
  // KPI State
  const [kpis, setKpis] = useState({
    totalPotholes: 0,
    distanceKm: 0,
    distanceMeters: 0,
    severity: 0,
    severityLevel: 'Low'
  });
  
  // Map State
  const [potholeMarkers, setPotholeMarkers] = useState([]);
  const [potholeDetails, setPotholeDetails] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [sessionCategory, setSessionCategory] = useState(() => localStorage.getItem('selected_category') || "Saferoute AI");
  const [sessionLoading, setSessionLoading] = useState(true);
  
  // Alert State
  const [alertStatus, setAlertStatus] = useState({ lastSent: null, lastSeverity: null });
  const [alertEnabled, setAlertEnabled] = useState(true);
  
  // Chart State
  const [chartData, setChartData] = useState({ categories: [], series: [] });
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState(null);
  
  const [pieChartData, setPieChartData] = useState({ labels: [], series: [], colors: [] });
  const [pieChartLoading, setPieChartLoading] = useState(true);
  const [pieChartError, setPieChartError] = useState(null);
  
  const [lineChartData, setLineChartData] = useState({ categories: [], series: [] });
  const [lineChartLoading, setLineChartLoading] = useState(true);
  
  const [donutChartData, setDonutChartData] = useState({ labels: [], series: [], colors: [] });
  const [donutChartLoading, setDonutChartLoading] = useState(true);
  
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: MAP_LIBRARIES
  });

  // Update KPIs from background service data
  const updateKPIsFromService = (data) => {
    const newKpis = {
      totalPotholes: data.total_pothole || 0,
      distanceKm: parseFloat(data.distance_km || 0).toFixed(3),
      distanceMeters: Math.round(data.distance_meters || 0),
      severity: parseFloat(data.severity || 0).toFixed(2),
      severityLevel: data.severity_level || 'Low'
    };
    setKpis(newKpis);
  };

  // Fetch CSV data for chart
  const fetchChartData = async () => {
    if (!sessionId) {
      setChartLoading(false);
      return;
    }

    try {
      setChartLoading(true);
      setChartError(null);
      
      const response = await fetch(`${API_BASE_URL}/get_csv/${sessionId}`);
      if (!response.ok) throw new Error(`Failed to fetch CSV: ${response.statusText}`);
      
      const csvText = await response.text();
      const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
      const data = parsed.data;

      if (!data || data.length === 0) {
        setChartData({ categories: [], series: [] });
        setChartLoading(false);
        return;
      }

      const classNames = Object.keys(data[0]).filter((key) => key !== "Frame" && key !== "frame");
      const lastRow = data[data.length - 1];
      const chartData = classNames.map((cls) => ({
        name: cls,
        value: parseInt(lastRow[cls]) || 0
      }));

      chartData.sort((a, b) => b.value - a.value);

      setChartData({
        categories: chartData.map(item => item.name),
        series: chartData.map(item => item.value)
      });
      
      const totalCount = chartData.reduce((sum, item) => sum + item.value, 0);
      
      if (totalCount > 0) {
        const nonZeroData = chartData.filter(item => item.value > 0);
        
        setPieChartData({
          labels: nonZeroData.map(item => item.name),
          series: nonZeroData.map(item => item.value),
          colors: nonZeroData.map((item, index) => getUniqueColor(item.name, index))
        });
        setPieChartLoading(false);
        setPieChartError(null);
        
        const top5Data = nonZeroData.slice(0, 5);
        setDonutChartData({
          labels: top5Data.map(item => item.name),
          series: top5Data.map(item => item.value),
          colors: top5Data.map((item, index) => getUniqueColor(item.name, index))
        });
        setDonutChartLoading(false);
      } else {
        setPieChartData({ labels: [], series: [], colors: [] });
        setPieChartLoading(false);
        setDonutChartData({ labels: [], series: [], colors: [] });
        setDonutChartLoading(false);
      }
      
      const sampleRate = Math.max(1, Math.floor(data.length / 50));
      const sampledData = data.filter((_, index) => index % sampleRate === 0 || index === data.length - 1);
      
      const top3Classes = chartData.slice(0, 3).map(item => item.name);
      const lineSeries = top3Classes.map((className) => ({
        name: className,
        data: sampledData.map(row => parseInt(row[className]) || 0)
      }));
      
      setLineChartData({
        categories: sampledData.map(row => row.Frame || row.frame),
        series: lineSeries
      });
      setLineChartLoading(false);
      
      setChartLoading(false);
    } catch (error) {
      console.error("Error fetching or parsing CSV:", error);
      setChartError(error.message);
      setChartLoading(false);
      setPieChartError(error.message);
      setPieChartLoading(false);
      setLineChartLoading(false);
      setDonutChartLoading(false);
    }
  };

  // Fetch pothole details with GPS locations
  const fetchPotholeDetails = async () => {
    if (!sessionId) {
      setMapLoading(false);
      return;
    }

    try {
      const response = await dataAPI.getPotholeDetails(sessionId);
      const data = response.data;
      
      setPotholeDetails(data);
      
      if (data.potholes && data.potholes.length > 0) {
        setPotholeMarkers(data.potholes);
        
        if (!liveLocation && data.potholes[0]) {
          const center = {
            lat: data.potholes[0].latitude,
            lng: data.potholes[0].longitude
          };
          setMapCenter(center);
        }
      } else {
        setPotholeMarkers([]);
      }
      
      setMapLoading(false);
    } catch (error) {
      console.error("Error fetching pothole details:", error);
      setMapLoading(false);
    }
  };

  // Track live user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLiveLocation({ lat: 28.6139, lng: 77.2090 });
      setMapCenter({ lat: 28.6139, lng: 77.2090 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setLiveLocation(userLocation);
        setMapCenter(userLocation);
      },
      (error) => {
        setLiveLocation({ lat: 28.6139, lng: 77.2090 });
        setMapCenter({ lat: 28.6139, lng: 77.2090 });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setLiveLocation(userLocation);
      },
      (error) => console.error('Error watching location:', error.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Fetch session category
  useEffect(() => {
    const fetchSessionInfo = async () => {
      if (!sessionId) {
        setSessionLoading(false);
        return;
      }
      
      try {
        const res = await sessionAPI.getSessionInfo(sessionId);
        if (res.data && res.data.category) {
          setSessionCategory(res.data.category);
          localStorage.setItem('selected_category', res.data.category);
          console.log(`📊 Dashboard category: ${res.data.category}`);
        }
      } catch (err) {
        console.error("Error fetching session info:", err);
      } finally {
        setSessionLoading(false);
      }
    };
    
    fetchSessionInfo();
  }, [sessionId]);

  // Initialize dashboard with background service
  useEffect(() => {
    if (sessionId) {
      dashboardService.startSession(sessionId);

      const unsubscribe = dashboardService.subscribe((type, data, cache) => {
        switch (type) {
          case 'kpis':
            updateKPIsFromService(data);
            break;
          case 'potholes':
            setPotholeMarkers(data);
            break;
        }
      });

      const cachedData = dashboardService.getCachedData();
      if (cachedData.kpis) updateKPIsFromService(cachedData.kpis);
      if (cachedData.potholeLocations) setPotholeMarkers(cachedData.potholeLocations);

      return () => unsubscribe();
    }
  }, [sessionId]);

  // Send alert email every 1 minute
  useEffect(() => {
    if (!sessionId || !alertEnabled) return;

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    const sendAlertEmail = async () => {
      try {
        const response = await dataAPI.sendAlert(sessionId, userEmail);
        
        if (response.data.success) {
          const now = new Date().toLocaleTimeString();
          setAlertStatus({
            lastSent: now,
            lastSeverity: response.data.severity_data?.severity_level
          });
        }
      } catch (error) {
        console.error('Error sending alert:', error.response?.data || error.message);
      }
    };

    sendAlertEmail();
    const alertInterval = setInterval(sendAlertEmail, 60000);

    return () => clearInterval(alertInterval);
  }, [sessionId, alertEnabled]);

  // Listen for session changes
  useEffect(() => {
    const handleStorageChange = () => {
      const currentSessionId = localStorage.getItem('live_session_id');
      if (!currentSessionId && sessionId) {
        setSessionId(null);
      } else if (currentSessionId && currentSessionId !== sessionId) {
        setSessionId(currentSessionId);
      }
    };

    const storageCheckInterval = setInterval(handleStorageChange, 1000);
    return () => clearInterval(storageCheckInterval);
  }, [sessionId]);

  // Fetch chart data periodically
  useEffect(() => {
    if (!sessionId) return;
    fetchChartData();
    const chartInterval = setInterval(fetchChartData, 10000);
    return () => clearInterval(chartInterval);
  }, [sessionId]);

  // Fetch pothole details periodically
  useEffect(() => {
    if (!sessionId) return;
    fetchPotholeDetails();
    const potholeInterval = setInterval(fetchPotholeDetails, 10000);
    return () => clearInterval(potholeInterval);
  }, [sessionId]);

  // Threshold State
  const [thresholds, setThresholds] = useState({});
  const [selectedRegion, setSelectedRegion] = useState(() => localStorage.getItem('selected_region') || 'urban');
  const [thresholdLoading, setThresholdLoading] = useState(true);

  const regionOptions = [
    { value: 'urban', label: 'Urban / City Roads' },
    { value: 'semiUrban', label: 'Semi-Urban / Town Roads' },
    { value: 'rural', label: 'Rural / Village Roads' },
    { value: 'highways', label: 'Highways (NH / SH / Expressways)' },
    { value: 'industrial', label: 'Industrial / Heavy-Load Zones' },
    { value: 'residential', label: 'Residential / Campus / IT Parks' },
    { value: 'hilly', label: 'Hilly / Ghat Roads' }
  ];

  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    setSelectedRegion(newRegion);
    localStorage.setItem('selected_region', newRegion);
  };

  // Fetch thresholds
  const fetchThresholds = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/thresholds/`);
      if (response.ok) {
        const data = await response.json();
        setThresholds(data);
      }
      setThresholdLoading(false);
    } catch (error) {
      console.error("Error fetching thresholds:", error);
      setThresholdLoading(false);
    }
  };

  // Fetch severity data
  const fetchSeverityData = async () => {
    if (!sessionId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/severity_distance_pothole/${sessionId}?region=${selectedRegion}`);
      if (response.ok) {
        const data = await response.json();
        updateKPIsFromService(data);
      }
    } catch (error) {
      console.error("Error fetching severity data:", error);
    }
  };

  useEffect(() => {
    fetchThresholds();
    
    // Get User Geolocation for Map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setMapLoading(false);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setMapLoading(false);
        }
      );
    } else {
      setMapLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      fetchSeverityData();
      const severityInterval = setInterval(fetchSeverityData, 10000);
      return () => clearInterval(severityInterval);
    }
  }, [sessionId, selectedRegion]);

  if (sessionLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (sessionCategory === "Traffic Safety") {
    return (
      <Container fluid className="analytics-dashboard p-3 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <div className="mb-4">
            <TrendingUp size={80} color="#4ECDC4" />
          </div>
          <h1 className="display-4 fw-bold mb-3" style={{ background: 'linear-gradient(135deg, #4ECDC4 0%, #556270 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Traffic Safety Dashboard
          </h1>
          <h2 className="text-white mb-4">Coming Soon</h2>
          <p className="text-muted lead mx-auto" style={{ maxWidth: '600px' }}>
            We're working on advanced traffic flow analytics, accident risk mapping, and real-time congestion monitoring to make our roads safer for everyone.
          </p>
          <div className="mt-5">
            <Button variant="outline-primary" onClick={() => window.location.href = '/live-detection'}>
              Back to Detection
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="analytics-dashboard p-3">
      {/* Header */}
      <div className="dashboard-header mb-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h2 className="dashboard-title">Analytics Dashboard</h2>
            <p className="dashboard-subtitle">Real-time road analytics and tracking</p>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            <Form.Group controlId="regionSelect" className="mb-0">
               <Form.Select 
                value={selectedRegion} 
                onChange={handleRegionChange}
                className="bg-dark text-white border-secondary form-select-sm"
                style={{ minWidth: '180px', fontSize: '0.85rem' }}
              >
                {regionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <AlertStatus alertEnabled={alertEnabled} alertStatus={alertStatus} />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards kpis={kpis} />

      {/* Pothole Thresholds Section */}
      <SectionHeader 
        icon={TrendingUp} 
        title={`${regionOptions.find(r => r.value === selectedRegion)?.label} Thresholds`} 
        subtitle="Status guidelines for the selected region"
        iconColor="#ffd700"
      />
      <Row className="mb-3">
        <Col xs={12}>
          <Card className="chart-card">
            <Card.Body className="p-3">
              {thresholdLoading ? (
                <div className="text-center py-3">
                  <Spinner animation="border" size="sm" variant="primary" />
                </div>
              ) : thresholds[selectedRegion] ? (
                <div className="threshold-container">
                  <Row className="g-2">
                    {thresholds[selectedRegion].map((row, idx) => (
                      <Col key={idx} lg={2} md={4} sm={6}>
                        <div className="threshold-box p-2 rounded text-center" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <div className={`badge mb-1 p-1 w-100 ${
                            row.status === 'Critical' ? 'bg-danger' : 
                            row.status === 'High' ? 'bg-warning text-dark' : 
                            row.status === 'Medium' ? 'bg-info text-dark' : 
                            row.status === 'Low' ? 'bg-primary' : 'bg-success'
                          }`} style={{ fontSize: '0.7rem' }}>
                            {row.status}
                          </div>
                          <div className="small text-muted" style={{ fontSize: '0.65rem' }}>Density: <span className="text-white fw-bold">{row.min}{row.max !== null ? `-${row.max}` : '+'}</span></div>
                        </div>
                      </Col>
                    ))}
                    <Col lg={12}>
                       <div className="mt-2 p-2 rounded bg-dark border border-secondary">
                          <small className="text-muted" style={{ fontSize: '0.75rem' }}><span className="text-primary fw-bold">Current Action:</span> {thresholds[selectedRegion].find(t => t.status === kpis.severityLevel)?.action || 'Monitoring'}</small>
                       </div>
                    </Col>
                  </Row>
                </div>
              ) : (
                <div className="text-center py-2 text-muted small"> No data for this region. </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detection Overview Section */}
      <SectionHeader 
        icon={BarChart3} 
        title="Detection Overview" 
        subtitle="Cumulative object detection counts"
        iconColor="#667eea"
      />
      <Row className="mb-3">
        <Col xs={12}>
          <Card className="chart-card">
            <Card.Body className="p-3">
              {chartLoading && chartData.series.length === 0 && sessionId ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                  <Spinner animation="border" size="sm" variant="primary" />
                </div>
              ) : chartError ? (
                <div className="alert alert-warning py-2 small text-center"> {chartError} </div>
              ) : (
                <div>
                   <Chart
                    options={{
                      chart: {
                        type: "bar",
                        toolbar: { show: false },
                        background: "transparent",
                      },
                      plotOptions: {
                        bar: { horizontal: true, borderRadius: 4, barHeight: "50%" },
                      },
                      colors: ["#3b82f6"],
                      dataLabels: { enabled: true, style: { fontSize: "11px" } },
                      xaxis: {
                        categories: chartData.categories.length > 0 ? chartData.categories : ['pothole', 'crack', 'pumping', 'rutting'],
                        labels: { style: { colors: "#64748b", fontSize: "11px" } },
                      },
                      yaxis: { labels: { style: { colors: "#f8fafc", fontSize: "11px" } } },
                      grid: { borderColor: "#334155", strokeDashArray: 4 },
                      tooltip: { theme: "dark" },
                    }}
                    series={[{ name: "Count", data: chartData.series.length > 0 ? chartData.series : [0, 0, 0, 0] }]}
                    type="bar"
                    height={300}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Trend Analysis Section */}
      <SectionHeader 
        icon={TrendingUp} 
        title="Trend Analysis" 
        subtitle="Detection progression across video frames"
        iconColor="#4ECDC4"
      />
      <TrendChart 
        sessionId={sessionId}
        lineChartData={lineChartData}
        lineChartLoading={lineChartLoading}
      />

      {/* Top Detections Section */}
      <SectionHeader 
        icon={PieChart} 
        title="Detection Distribution" 
        subtitle="Most frequently detected road defects"
        iconColor="#f093fb"
      />
      <Row className="mb-3 g-3">
        <Col xs={12} md={6}>
          <Card className="chart-card">
            <Card.Body className="p-3">
              {pieChartLoading && pieChartData.series.length === 0 && sessionId ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                  <Spinner animation="border" size="sm" variant="primary" />
                </div>
              ) : (
                <Chart
                  options={{
                    chart: { type: "pie", toolbar: { show: false }, background: "transparent" },
                    labels: pieChartData.labels.length > 0 ? pieChartData.labels : ['No Data'],
                    colors: pieChartData.colors.length > 0 ? pieChartData.colors : ['#334155'],
                    legend: { position: 'bottom', labels: { colors: '#94a3b8' }, fontSize: '11px' },
                    dataLabels: { enabled: true, style: { fontSize: '11px' } },
                    tooltip: { theme: "dark" },
                  }}
                  series={pieChartData.series.length > 0 ? pieChartData.series : [1]}
                  type="pie"
                  height={300}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={6}>
          <TopDetections 
            sessionId={sessionId}
            donutChartData={donutChartData}
            donutChartLoading={donutChartLoading}
          />
        </Col>
      </Row>

      {/* Live Pothole Map Section */}
      <SectionHeader 
        icon={MapPinIcon} 
        title="Live Pothole Map" 
        subtitle="Real-time detection location tracking"
        iconColor="#ef4444"
      />
      
      <MapStatistics potholeDetails={potholeDetails} />
      
      <div className="map-card mb-4" style={{ height: '400px' }}>
        <PotholeMap 
          sessionId={sessionId}
          isLoaded={isLoaded}
          mapCenter={mapCenter}
          liveLocation={liveLocation}
          potholeMarkers={potholeMarkers}
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
          setMapCenter={setMapCenter}
          fetchPotholeDetails={fetchPotholeDetails}
        />
      </div>
    </Container>
  );
};

export default AnalyticsDashboard;