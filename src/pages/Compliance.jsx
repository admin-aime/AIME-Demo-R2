import React, { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, Clock, Download, FileText } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export default function Compliance() {
  const [selectedStandard, setSelectedStandard] = useState('epa')
  const [timeframe, setTimeframe] = useState('monthly')

  // Mock compliance data
  const complianceStatus = [
    { pollutant: 'PM2.5', standard: '35 μg/m³ (24h)', current: '28.5 μg/m³', status: 'compliant', percentage: 87 },
    { pollutant: 'PM10', standard: '150 μg/m³ (24h)', current: '45.2 μg/m³', status: 'compliant', percentage: 92 },
    { pollutant: 'Ozone', standard: '70 ppb (8h)', current: '78.3 ppb', status: 'violation', percentage: 78 },
    { pollutant: 'CO', standard: '9 ppm (8h)', current: '2.1 ppm', status: 'compliant', percentage: 95 },
    { pollutant: 'NO2', standard: '100 ppb (1h)', current: '85.7 ppb', status: 'compliant', percentage: 89 },
    { pollutant: 'SO2', standard: '75 ppb (1h)', current: '12.4 ppb', status: 'compliant', percentage: 98 },
  ]

  const violationTrends = [
    { month: 'Jan', violations: 2, total: 31 },
    { month: 'Feb', violations: 1, total: 28 },
    { month: 'Mar', violations: 4, total: 31 },
    { month: 'Apr', violations: 3, total: 30 },
    { month: 'May', violations: 6, total: 31 },
    { month: 'Jun', violations: 8, total: 30 },
  ]

  const recentViolations = [
    {
      id: 1,
      date: '2024-01-15',
      pollutant: 'Ozone',
      value: '82.5 ppb',
      standard: '70 ppb',
      location: 'Downtown Station',
      duration: '3 hours',
      severity: 'moderate'
    },
    {
      id: 2,
      date: '2024-01-12',
      pollutant: 'PM2.5',
      value: '42.1 μg/m³',
      standard: '35 μg/m³',
      location: 'Industrial Zone',
      duration: '6 hours',
      severity: 'high'
    },
    {
      id: 3,
      date: '2024-01-08',
      pollutant: 'NO2',
      value: '125.3 ppb',
      standard: '100 ppb',
      location: 'Highway Monitor',
      duration: '2 hours',
      severity: 'moderate'
    },
  ]

  const upcomingReports = [
    { name: 'Monthly EPA Report', due: '2024-02-01', status: 'pending' },
    { name: 'Quarterly State Report', due: '2024-02-15', status: 'in_progress' },
    { name: 'Annual Compliance Summary', due: '2024-03-31', status: 'scheduled' },
  ]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'moderate': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100'
      case 'violation': return 'text-red-600 bg-red-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance Monitoring</h1>
        <p className="text-gray-600">Regulatory compliance tracking and reporting</p>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Regulatory Standard
            </label>
            <select
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="input-field w-full"
            >
              <option value="epa">EPA Standards</option>
              <option value="who">WHO Guidelines</option>
              <option value="state">State Regulations</option>
              <option value="local">Local Ordinances</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeframe
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="input-field w-full"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="btn-primary flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overall Compliance</p>
              <p className="text-2xl font-bold text-gray-900">89%</p>
              <p className="text-sm text-green-600">Above target (85%)</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Violations</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-red-600">Requires attention</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Reports</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-yellow-600">Due this month</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Standards Met</p>
              <p className="text-2xl font-bold text-gray-900">5/6</p>
              <p className="text-sm text-blue-600">Pollutant types</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Status Table */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Compliance Status</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pollutant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Standard
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliance Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complianceStatus.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.pollutant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.standard}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.current}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${item.status === 'compliant' ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span>{item.percentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status === 'compliant' ? 'Compliant' : 'Violation'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Violation Trends */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Violation Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={violationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="violations" stroke="#ef4444" name="Violations" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Compliance by Pollutant */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance by Pollutant</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complianceStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="pollutant" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percentage" fill="#3b82f6" name="Compliance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Violations */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Violations</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pollutant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Measured Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Standard
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentViolations.map((violation) => (
                <tr key={violation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(violation.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {violation.pollutant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {violation.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {violation.standard}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {violation.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {violation.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(violation.severity)}`}>
                      {violation.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Reports */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Reports</h3>
        <div className="space-y-4">
          {upcomingReports.map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-500">Due: {new Date(report.due).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  report.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {report.status.replace('_', ' ')}
                </span>
                <button className="btn-secondary text-sm">
                  Generate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
