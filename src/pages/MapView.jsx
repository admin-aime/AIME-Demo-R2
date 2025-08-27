import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import { useData } from '../contexts/DataContext'
import L from 'leaflet'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const MapView = () => {
  const { sensors, currentData, calculateAQI, getAQICategory } = useData()
  const [selectedPollutant, setSelectedPollutant] = useState('pm25')
  const [mapCenter] = useState([40.7128, -74.0060]) // Default to NYC

  const createCustomIcon = (aqi) => {
    const { color } = getAQICategory(aqi)
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })
  }

  const getSensorData = (sensorId) => {
    return currentData[sensorId] || null
  }

  const pollutantOptions = [
    { value: 'pm25', label: 'PM2.5' },
    { value: 'pm10', label: 'PM10' },
    { value: 'o3', label: 'Ozone' },
    { value: 'co', label: 'Carbon Monoxide' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Air Quality Map</h1>
        
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Pollutant:</label>
          <select
            value={selectedPollutant}
            onChange={(e) => setSelectedPollutant(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md"
          >
            {pollutantOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div className="card p-0 overflow-hidden" style={{ height: '600px' }}>
        <MapContainer
          center={mapCenter}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {sensors.map(sensor => {
            const sensorData = getSensorData(sensor.id)
            if (!sensorData || !sensor.location) return null

            const pollutantValue = sensorData[selectedPollutant]
            if (!pollutantValue) return null

            const aqi = calculateAQI(selectedPollutant, pollutantValue)
            const aqiInfo = getAQICategory(aqi)

            return (
              <React.Fragment key={sensor.id}>
                <Marker
                  position={[sensor.location.lat, sensor.location.lng]}
                  icon={createCustomIcon(aqi)}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{sensor.name || sensor.id}</h3>
                      <div className="mt-2 space-y-1 text-sm">
                        <div>
                          <strong>AQI:</strong> {aqi} ({aqiInfo.category})
                        </div>
                        <div>
                          <strong>{pollutantOptions.find(p => p.value === selectedPollutant)?.label}:</strong> {pollutantValue.toFixed(1)}
                        </div>
                        <div>
                          <strong>Temperature:</strong> {sensorData.temperature?.toFixed(1)}°C
                        </div>
                        <div>
                          <strong>Humidity:</strong> {sensorData.humidity?.toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          Last updated: {new Date(sensorData.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
                
                {/* AQI Circle Overlay */}
                <Circle
                  center={[sensor.location.lat, sensor.location.lng]}
                  radius={500}
                  fillColor={aqiInfo.color}
                  fillOpacity={0.2}
                  color={aqiInfo.color}
                  weight={1}
                />
              </React.Fragment>
            )
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="card">
        <h3 className="font-semibold mb-3">AQI Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
          {[
            { range: '0-50', category: 'Good', color: '#00e400' },
            { range: '51-100', category: 'Moderate', color: '#ffff00' },
            { range: '101-150', category: 'Unhealthy for Sensitive', color: '#ff7e00' },
            { range: '151-200', category: 'Unhealthy', color: '#ff0000' },
            { range: '201-300', category: 'Very Unhealthy', color: '#8f3f97' },
            { range: '301+', category: 'Hazardous', color: '#7e0023' }
          ].map(item => (
            <div key={item.range} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <div className="font-medium">{item.range}</div>
                <div className="text-gray-600">{item.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MapView
