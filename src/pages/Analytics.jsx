import React, { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'
import { Calendar, Download, Filter, TrendingUp } from 'lucide-react'

export default function Analytics() {
  const [selectedPollutant, setSelectedPollutant] = useState('pm25')
  const [dateRange, setDateRange] = useState('7d')
  const [analysisType, setAnalysisType] = useState('trends')

  // Mock data for demonstration
  const trendData = [
    { date: '2024-01-01', pm25: 12, pm10: 18, ozone: 45, co: 0.8, no2: 25, so2: 5 },
    { date: '2024-01-02', pm25: 15, pm10: 22, ozone: 52, co: 1.2, no2: 28, so2: 7 },
    { date: '2024-01-03', pm25: 28, pm10: 35, ozone: 68, co: 2.1, no2: 35, so2: 12 },
    { date: '2024-01-04', pm25: 32, pm10: 42, ozone: 75, co: 2.8, no2: 42, so2: 15 },
    { date: '2024-01-05', pm25: 25, pm10: 38, ozone: 62, co: 1.9, no2: 38, so2: 10 },
    { date: '2024-01-06', pm25: 18, pm10: 28, ozone: 48, co: 1.4, no2: 30, so2: 8 },
    { date: '2024-01-07', pm25: 14, pm10: 20, ozone: 42, co: 1.0, no2: 26, so2: 6 },
  ]

  const correlationData = [
    { temperature: 15, pm25: 32, humidity: 65 },
    { temperature: 18, pm25: 28, humidity: 58 },
    { temperature: 22, pm25: 25, humidity: 52 },
    { temperature: 25, pm25: 22, humidity: 48 },
    { temperature: 28, pm25: 18, humidity: 45 },
    { temperature: 30, pm25: 15, humidity: 42 },
  ]

  const sourceAnalysis = [
    { source: 'Traffic', contribution: 35, color: '#ef4444' },
    { source: 'Industrial', contribution: 28, color: '#f59e0b' },
    { source: 'Residential', contribution: 20, color: '#3b82f6' },
    { source: 'Natural', contribution: 12, color: '#22c55e' },
    { source: 'Other', contribution: 5, color: '#6b7280' },
  ]

  const pollutantOptions = [
    { value: 'pm25', label: 'PM2.5' },
    { value: 'pm10', label: 'PM10' },
    { value: 'ozone', label: 'Ozone' },
    { value: 'co', label: 'Carbon Monoxide' },
    { value: 'no2', label: 'Nitrogen Dioxide' },
    { value: 'so2', label: 'Sulfur Dioxide' },
  ]

  const analysisTypes = [
    { value: 'trends', label: 'Trend Analysis' },
    { value: 'correlation', label: 'Correlation Analysis' },
    { value: 'sources', label: 'Source Identification' },
    { value: 'forecasting', label: 'Forecasting' },
  ]

  const renderAnalysisContent = () => {
    switch (analysisType) {
      case 'trends':
        return (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pollutant Trends</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey={selectedPollutant} 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name={pollutantOptions.find(p => p.value === selectedPollutant)?.label}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )

      case 'correlation':
        return (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Temperature vs PM2.5 Correlation</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="temperature" name="Temperature (°C)" />
                <YAxis dataKey="pm25" name="PM2.5 (μg/m³)" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter dataKey="pm25" fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )

      case 'sources':
        return (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pollution Source Analysis</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={sourceAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="contribution" fill="#3b82f6" name="Contribution %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )

      case 'forecasting':
        return (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">7-Day Forecast</h3>
            <div className="text-center py-20">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Forecasting model in development</p>
              <p className="text-sm text-gray-500 mt-2">
                Advanced ML models will be integrated for predictive analytics
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Advanced data analysis and insights</p>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Analysis Type
            </label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="input-field w-full"
            >
              {analysisTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pollutant
            </label>
            <select
              value={selectedPollutant}
              onChange={(e) => setSelectedPollutant(e.target.value)}
              className="input-field w-full"
            >
              {pollutantOptions.map(pollutant => (
                <option key={pollutant.value} value={pollutant.value}>
                  {pollutant.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field w-full"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>

          <div className="flex items-end space-x-2">
            <button className="btn-primary flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Apply Filters</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Content */}
      {renderAnalysisContent()}

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Average Level</h4>
          <p className="text-2xl font-bold text-gray-900">
            {selectedPollutant === 'pm25' ? '22.3 μg/m³' : 
             selectedPollutant === 'pm10' ? '28.7 μg/m³' :
             selectedPollutant === 'ozone' ? '56.2 ppb' : '1.8 ppm'}
          </p>
          <p className="text-sm text-green-600 mt-1">↓ 12% from last period</p>
        </div>

        <div className="card">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Peak Level</h4>
          <p className="text-2xl font-bold text-gray-900">
            {selectedPollutant === 'pm25' ? '45.8 μg/m³' : 
             selectedPollutant === 'pm10' ? '62.1 μg/m³' :
             selectedPollutant === 'ozone' ? '89.5 ppb' : '3.2 ppm'}
          </p>
          <p className="text-sm text-red-600 mt-1">↑ 8% from last period</p>
        </div>

        <div className="card">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Exceedances</h4>
          <p className="text-2xl font-bold text-gray-900">3</p>
          <p className="text-sm text-orange-600 mt-1">2 more than last period</p>
        </div>
      </div>

      {/* Insights */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-gray-700">
              PM2.5 levels show strong correlation with traffic patterns, peaking during rush hours.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <p className="text-gray-700">
              Weekend pollution levels are consistently 25% lower than weekdays.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <p className="text-gray-700">
              Industrial emissions contribute significantly to SO2 levels in the eastern district.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
            <p className="text-gray-700">
              Ozone levels exceed EPA standards 15% more frequently during summer months.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
