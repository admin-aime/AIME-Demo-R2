import React, { useState, useEffect } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'
import { useData } from '../contexts/DataContext'
import AQIBadge from '../components/UI/AQIBadge'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { MapPin, Thermometer, Droplets, Wind } from 'lucide-react'

// Note: You'll need to get a Mapbox access token from https://mapbox.com
const MAPBOX_TOKEN = 'your-mapbox-access-token-here'

export default function SensorMap() {
  const { sensors, realtimeData, loading, calculateAQI } = useData()
  const [selectedSensor, setSelectedSensor] = useState(null)
  const [viewState, setViewState] = useState({
    longitude: -74.006,
    latitude: 40.7128,
    zoom: 10
  })

  const getMarkerColor = (aqi) => {
    if (aqi <= 50) return '#22c55e' // Green
    if (aqi <= 100) return '#f59e0b' // Yellow
    if (aqi <= 150) return '#f97316' // Orange
    if (aqi <= 200) return '#ef4444' // Red
    if (aqi <= 300) return '#a855f7' // Purple
    return '#7f1d1d' // Dark red
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sensor Map</h1>
        <p className="text-gray-600">Interactive map showing real-time air quality data</p>
      </div>

      {/* Map Container */}
      <div className="card p-0 overflow-hidden" style={{ height: '600px' }}>
        {MAPBOX_TOKEN !== 'your-mapbox-access-token-here' ? (
          <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapboxAccessToken={MAPBOX_TOKEN}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/light-v10"
          >
            {sensors.map((sensor) => {
              const data = realtimeData[sensor.id] || { pm25: 15, pm10: 22, temperature: 22, humidity: 65 }
              const aqi = calculateAQI('pm25', data.pm25)
              
              return (
                <Marker
                  key={sensor.id}
                  longitude={sensor.longitude}
                  latitude={sensor.latitude}
                  anchor="bottom"
                  onClick={() => setSelectedSensor(sensor)}
                >
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform"
                    style={{ backgroundColor: getMarkerColor(aqi.aqi) }}
                  />
                </Marker>
              )
            })}

            {selectedSensor && (
              <Popup
                longitude={selectedSensor.longitude}
                latitude={selectedSensor.latitude}
                anchor="top"
                onClose={() => setSelectedSensor(null)}
                closeButton={true}
                closeOnClick={false}
              >
                <div className="p-4 min-w-64">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Sensor {selectedSensor.id}
                  </h3>
                  
                  {(() => {
                    const data = realtimeData[selectedSensor.id] || { 
                      pm25: 15, pm10: 22, temperature: 22, humidity: 65 
                    }
                    const aqi = calculateAQI('pm25', data.pm25)
                    
                    return (
                      <div className="space-y-3">
                        <AQIBadge aqi={aqi.aqi} category={aqi.category} size="sm" />
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Wind className="h-4 w-4 text-gray-500" />
                            <span>PM2.5: {data.pm25} μg/m³</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Wind className="h-4 w-4 text-gray-500" />
                            <span>PM10: {data.pm10} μg/m³</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Thermometer className="h-4 w-4 text-gray-500" />
                            <span>Temp: {data.temperature}°C</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Droplets className="h-4 w-4 text-gray-500" />
                            <span>Humidity: {data.humidity}%</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Last updated: {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </Popup>
            )}
          </Map>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Map Configuration Required</h3>
              <p className="text-gray-600 mb-4">
                To display the interactive map, please add your Mapbox access token.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-left">
                <p className="text-sm text-yellow-800">
                  <strong>Setup Instructions:</strong><br />
                  1. Get a free token from <a href="https://mapbox.com" className="underline">mapbox.com</a><br />
                  2. Replace 'your-mapbox-access-token-here' in SensorMap.jsx<br />
                  3. Refresh the page
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">AQI Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm">Good (0-50)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Moderate (51-100)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span className="text-sm">Unhealthy for Sensitive (101-150)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm">Unhealthy (151-200)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span className="text-sm">Very Unhealthy (201-300)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-900"></div>
            <span className="text-sm">Hazardous (301+)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
