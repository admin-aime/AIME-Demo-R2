import React, { useState, useEffect } from 'react'
import { useData } from '../contexts/DataContext'
import { Wind, Thermometer, Droplets, Eye, AlertTriangle, CheckCircle } from 'lucide-react'
import AQIBadge from '../components/UI/AQIBadge'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function Dashboard() {
  const { sensors, realtimeData, loading, calculateAQI } = useData()
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')

  // Mock data for demonstration
  const mockTrendData = [
    { time: '00:00', pm25: 12, pm10: 18, ozone: 45 },
    { time: '04:00', pm25: 15, pm10: 22, ozone: 52 },
    { time: '08:00', pm25: 28, pm10: 35, ozone: 68 },
    { time: '12:00', pm25: 32, pm10: 42, ozone: 75 },
    { time: '16:00', pm25: 25, pm10: 38, ozone: 62 },
    { time: '20:00', pm25: 18, pm10: 28, ozone: 48 },
  ]

  const mockComplianceData = [
    { name: 'PM2.5', compliant: 85, violations: 15 },
    { name: 'PM10', compliant: 92, violations: 8 },
    { name: 'Ozone', compliant: 78, violations: 22 },
    { name: 'CO', compliant: 95, violations: 5 },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const activeSensors = sensors.filter(sensor => sensor.status === 'active').length
  const totalSensors = sensors.length
  const offlineSensors = totalSensors - activeSensors

  // Calculate overall AQI from all active sensors
  const overallAQI = sensors.length > 0 ? 
    Math.round(sensors.reduce((sum, sensor) => {
      const data = realtimeData[sensor.id]
      if (data) {
        const aqi = calculateAQI('pm25', data.pm25)
        return sum + aqi.aqi
      }
      return sum + 50 // Default AQI if no data
    }, 0) / sensors.length) : 0

  const overallCategory = calculateAQI('pm25', overallAQI / 2).category

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Air Quality Dashboard</h1>
        <p className="text-gray-600">Real-time monitoring and analytics overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Wind className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overall AQI</p>
              <p className="text-2xl font-bold text-gray-900">{overallAQI}</p>
              <AQIBadge aqi={overallAQI} category={overallCategory} size="sm" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Sensors</p>
              <p className="text-2xl font-bold text-gray-900">{activeSensors}</p>
              <p className="text-sm text-gray-600">of {totalSensors} total</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Offline Sensors</p>
              <p className="text-2xl font-bold text-gray-900">{offlineSensors}</p>
              <p className="text-sm text-gray-600">Need attention</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Compliance Rate</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
              <p className="text-sm text-green-600">Within standards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Pollutant Trends</h3>
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="input-field text-sm"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="pm25" stroke="#ef4444" name="PM2.5" />
              <Line type="monotone" dataKey="pm10" stroke="#f59e0b" name="PM10" />
              <Line type="monotone" dataKey="ozone" stroke="#3b82f6" name="Ozone" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Compliance Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockComplianceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="compliant" fill="#22c55e" name="Compliant %" />
              <Bar dataKey="violations" fill="#ef4444" name="Violations %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sensors Data */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Sensor Readings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sensor ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PM2.5
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PM10
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AQI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sensors.slice(0, 5).map((sensor) => {
                const data = realtimeData[sensor.id] || { pm25: 15, pm10: 22, ozone: 45 }
                const aqi = calculateAQI('pm25', data.pm25)
                
                return (
                  <tr key={sensor.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sensor.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sensor.location?.name || `${sensor.latitude}, ${sensor.longitude}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.pm25} μg/m³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.pm10} μg/m³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <AQIBadge aqi={aqi.aqi} category={aqi.category} size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        sensor.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {sensor.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
