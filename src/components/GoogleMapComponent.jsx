import React, { useEffect, useRef, useState } from 'react';

const GoogleMapComponent = ({ 
  sensors, 
  selectedSensor, 
  onSensorSelect, 
  center = { lat: 40.7128, lng: -74.0060 },
  zoom = 10 
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry.fill',
          stylers: [{ color: '#f5f5f5' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
        },
        {
          featureType: 'administrative',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#ffffff' }, { weight: 6 }]
        },
        {
          featureType: 'administrative',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#e85113' }]
        }
      ]
    });

    setMap(mapInstance);
  }, [center, zoom]);

  useEffect(() => {
    if (!map || !sensors) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    // Create new markers
    const newMarkers = sensors.map(sensor => {
      const getMarkerColor = (aqi) => {
        if (aqi <= 50) return '#00e400';
        if (aqi <= 100) return '#ffff00';
        if (aqi <= 150) return '#ff7e00';
        if (aqi <= 200) return '#ff0000';
        if (aqi <= 300) return '#8f3f97';
        return '#7e0023';
      };

      const marker = new window.google.maps.Marker({
        position: { lat: sensor.latitude, lng: sensor.longitude },
        map,
        title: sensor.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: getMarkerColor(sensor.aqi),
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 8
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: #333;">${sensor.name}</h3>
            <div style="margin-bottom: 8px;">
              <strong>AQI:</strong> 
              <span style="color: ${getMarkerColor(sensor.aqi)}; font-weight: bold;">
                ${sensor.aqi}
              </span>
            </div>
            <div style="margin-bottom: 8px;">
              <strong>PM2.5:</strong> ${sensor.pm25} μg/m³
            </div>
            <div style="margin-bottom: 8px;">
              <strong>PM10:</strong> ${sensor.pm10} μg/m³
            </div>
            <div style="margin-bottom: 8px;">
              <strong>Status:</strong> 
              <span style="color: ${sensor.status === 'online' ? '#00e400' : '#ff0000'};">
                ${sensor.status}
              </span>
            </div>
            <div style="font-size: 12px; color: #666;">
              Last updated: ${new Date(sensor.lastUpdate).toLocaleString()}
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        onSensorSelect?.(sensor);
      });

      return marker;
    });

    setMarkers(newMarkers);
  }, [map, sensors, onSensorSelect]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        borderRadius: '8px'
      }} 
    />
  );
};

export default GoogleMapComponent;
