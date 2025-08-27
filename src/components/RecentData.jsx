import React from 'react'

const RecentData = ({ data }) => {
  const dataEntries = Object.entries(data).slice(0, 5)

  if (dataEntries.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No recent data available
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {dataEntries.map(([sensorId, sensorData]) => (
        <div key={sensorId} className="p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium text-sm">{sensorId}</div>
            <div className="text-xs text-gray-600">
              {new Date(sensorData.timestamp).toLocaleTimeString()}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-gray-600">PM2.5:</span>
              <span className="ml-1 font-medium">{sensorData.pm25?.toFixed(1)} μg/m³</span>
            </div>
            <div>
              <span className="text-gray-600">Temp:</span>
              <span className="ml-1 font-medium">{sensorData.temperature?.toFixed(1)}°C</span>
            </div>
            <div>
              <span className="text-gray-600">Humidity:</span>
              <span className="ml-1 font-medium">{sensorData.humidity?.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecentData
