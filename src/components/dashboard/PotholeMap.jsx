import React from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin as MapPinIcon, Navigation, TrendingUp } from 'lucide-react';
import './PotholeMap.css';

const PotholeMap = ({ 
  sessionId, isLoaded, mapCenter, liveLocation, potholeMarkers, 
  selectedMarker, setSelectedMarker, setMapCenter, fetchPotholeDetails
}) => {
  return (
    <Row className="mb-4">
      <Col xs={12}>
        <Card className="map-card">
          <Card.Body className="p-0">
            {!isLoaded ? (
              <div className="map-loading">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '500px', borderRadius: '20px' }}
                center={mapCenter}
                zoom={13}
                options={{
                  styles: [
                    { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
                    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
                    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] }
                  ],
                  zoomControl: true,
                  mapTypeControl: true,
                  streetViewControl: true,
                  fullscreenControl: true
                }}
              >
                {liveLocation && (
                  <Marker
                    position={liveLocation}
                    icon={{
                      url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                      scaledSize: new window.google.maps.Size(40, 40)
                    }}
                    onClick={() => setSelectedMarker({ type: 'user', location: liveLocation })}
                  />
                )}

                {potholeMarkers.map((pothole) => (
                  <Marker
                    key={pothole.id}
                    position={{ lat: pothole.latitude, lng: pothole.longitude }}
                    icon={{
                      url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                      scaledSize: new window.google.maps.Size(40, 40)
                    }}
                    label={{ text: String(pothole.id), color: 'white', fontSize: '12px', fontWeight: 'bold' }}
                    onClick={() => setSelectedMarker(pothole)}
                  />
                ))}

                {selectedMarker && selectedMarker.type !== 'user' && (
                  <InfoWindow
                    position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="info-window">
                      <h6>🚨 Pothole #{selectedMarker.id}</h6>
                      <p><strong>📍 Location:</strong><br/>
                        Lat: {selectedMarker.latitude.toFixed(6)}<br/>
                        Lng: {selectedMarker.longitude.toFixed(6)}
                      </p>
                      <p><strong>🎬 Frame:</strong> {selectedMarker.frame_number}</p>
                      <p><strong>✅ Confidence:</strong> {(selectedMarker.confidence * 100).toFixed(2)}%</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            )}
            
            {sessionId && isLoaded && (
              <div className="map-actions">
                <button className="map-action-btn center-btn" onClick={() => liveLocation && setMapCenter(liveLocation)}>
                  <Navigation size={24} />
                </button>
                <button className="map-action-btn refresh-btn" onClick={fetchPotholeDetails}>
                  <TrendingUp size={24} />
                </button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default PotholeMap;