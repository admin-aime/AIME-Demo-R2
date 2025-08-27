import React from 'react'
import { useData } from '../contexts/DataContext'
import { Radio, Battery, Signal, MapPin } from 'lucide-react'

const Sensors = () => {
  const { sensors, currentData } = useData()

  const getSensorStatus = (sensorId) => {
    const data = currentData[sensorId]
    if (!data) return 'offline'
    
    const dataAge = Date.now() - new Date(data.timestamp).getTime()
    if (dataAge < 5 * 60 * 1000) return 'online'
    if (dataAge < 30 * 60 * 1000) return 'warning'
    return 'offline'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600'
      case 'warning': return 'text-orange-600'
      case 'offline': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case 'online': return 'bg-green-50 border-green-200'
      case 'warning': return 'bg-orange-50 border-orange-200'
      case 'offline': return 'bg-red-50 border-red-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sensor Management</h1>
        <button className="btn btn-primary">Add Sensor</button>
      </div>

      {/* Sensor Stats */}
      <div className="grid grid-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{sensors.length}</div>
          <div className="text-sm text-gray-600">Total Sensors</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {sensors.filter(s => getSensorStatus(s.id) === 'online').length}
          </div>
          <div className="text-sm text-gray-600">Online</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-600">
            {sensors.filter(s => getSensorStatus(s.id) === 'warning').length}
          </div>
          <div className="text-sm text-gray-600">Warning</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">
            {sensors.filter(s => getSensorStatus(s.id) === 'offline').length}
          </div>
          <div className="text-sm text-gray-600">Offline</div>
        </div>
      </div>

      {/* Sensors List */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Sensor Status</h2>
        
        {sensors.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No sensors configured
          </div>
        ) : (
          <div className="space-y-3">
            {sensors.map(sensor => {
              const status = getSensorStatus(sensor.id)
              const data = currentData[sensor.id]
              
              return (
                <div 
                  key={sensor.id}
                  className={`p-4 border rounded-lg ${getStatusBg(status)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Radio className={getStatusColor(status)} size={20} />
                      <div>
                        <h3 className="font-medium">{sensor.name || sensor.id}</h3>
                        <p className="text-sm text-gray-600">{sensor.id}</p>
                      </div>
                    </div>
                    
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}>
                      {status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span>
                        {sensor.location ? 
                          `${sensor.location.lat.toFixed(4)}, ${sensor.location.lng.toFixed(4)}` : 
                          'No location'
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Battery size={16} className="text-gray-400" />
                      <span>{data?.battery_level || 'N/A'}%</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Signal size={16} className="text-gray-400" />
                      <span>{data?.signal_strength || 'N/A'}%</span>
                    </div>
                    
                    <div className="text-gray-600">
                      Last seen: {data ? new Date(data.timestamp).toLocaleString() : 'Never'}
                    </div>
                  </div>
                  
                  {data && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <div>PM2.5: {data.pm25?.toFixed(1)} μg/m³</div>
                        <div>PM10: {data.pm10?.toFixed(1)} μg/m³</div>
                        <div>Temp: {data.temperature?.toFixed(1)}°C</div>
                        <div>Humidity: {data.humidity?.toFixed(0)}%</div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Sensors
