import React, { useState } from 'react'
import { Download, Calendar, FileText, Filter, Eye, Send } from 'lucide-react'

export default function Reports() {
  const [selectedTemplate, setSelectedTemplate] = useState('epa_monthly')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [selectedSensors, setSelectedSensors] = useState([])
  const [reportFormat, setReportFormat] = useState('pdf')

  const reportTemplates = [
    {
      id: 'epa_monthly',
      name: 'EPA Monthly Report',
      description: 'Standard EPA compliance report with monthly aggregations',
      frequency: 'Monthly',
      format: ['PDF', 'Excel']
    },
    {
      id: 'quarterly_summary',
      name: 'Quarterly Summary',
      description: 'Comprehensive quarterly air quality summary',
      frequency: 'Quarterly',
      format: ['PDF', 'Word']
    },
    {
      id: 'annual_compliance',
      name: 'Annual Compliance Report',
      description: 'Complete annual compliance assessment',
      frequency: 'Annual',
      format: ['PDF', 'Excel', 'Word']
    },
    {
      id: 'custom_analysis',
      name: 'Custom Analysis',
      description: 'Customizable report with selected parameters',
      frequency: 'On-demand',
      format: ['PDF', 'Excel', 'CSV']
    },
    {
      id: 'public_summary',
      name: 'Public Summary',
      description: 'Public-facing air quality summary report',
      frequency: 'Monthly',
      format: ['PDF', 'HTML']
    }
  ]

  const recentReports = [
    {
      id: 1,
      name: 'EPA Monthly Report - December 2023',
      type: 'EPA Monthly',
      generated: '2024-01-05',
      status: 'completed',
      size: '2.4 MB',
      format: 'PDF'
    },
    {
      id: 2,
      name: 'Quarterly Summary Q4 2023',
      type: 'Quarterly Summary',
      generated: '2024-01-03',
      status: 'completed',
      size: '5.1 MB',
      format: 'PDF'
    },
    {
      id: 3,
      name: 'Custom Analysis - Industrial Zone',
      type: 'Custom Analysis',
      generated: '2024-01-02',
      status: 'completed',
      size: '1.8 MB',
      format: 'Excel'
    },
    {
      id: 4,
      name: 'Public Summary - December 2023',
      type: 'Public Summary',
      generated: '2024-01-01',
      status: 'processing',
      size: '-',
      format: 'PDF'
    }
  ]

  const scheduledReports = [
    {
      id: 1,
      name: 'EPA Monthly Report',
      schedule: 'Monthly on 1st',
      nextRun: '2024-02-01',
      recipients: ['epa@example.com', 'admin@company.com'],
      status: 'active'
    },
    {
      id: 2,
      name: 'Quarterly Summary',
      schedule: 'Quarterly on 15th',
      nextRun: '2024-04-15',
      recipients: ['management@company.com'],
      status: 'active'
    },
    {
      id: 3,
      name: 'Public Summary',
      schedule: 'Monthly on 5th',
      nextRun: '2024-02-05',
      recipients: ['public@company.com'],
      status: 'paused'
    }
  ]

  const handleGenerateReport = () => {
    // Mock report generation
    alert('Report generation started. You will be notified when it\'s ready.')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'processing': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'active': return 'text-green-600 bg-green-100'
      case 'paused': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">Generate and manage air quality reports</p>
      </div>

      {/* Report Generation */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Generate New Report</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Template
            </label>
            <div className="space-y-2">
              {reportTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate === template.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          Frequency: {template.frequency}
                        </span>
                        <span className="text-xs text-gray-500">
                          Formats: {template.format.join(', ')}
                        </span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      checked={selectedTemplate === template.id}
                      onChange={() => setSelectedTemplate(template.id)}
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="input-field"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Format
              </label>
              <select
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value)}
                className="input-field w-full"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="word">Word</option>
                <option value="csv">CSV</option>
                <option value="html">HTML</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Include Sensors (optional)
              </label>
              <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">All Sensors</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Downtown Station</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Industrial Zone</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Residential Area</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleGenerateReport}
                className="btn-primary flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Generate Report</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Schedule</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Reports</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.name}</div>
                    <div className="text-sm text-gray-500">{report.format}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.generated).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {report.status === 'completed' && (
                        <>
                          <button className="text-blue-600 hover:text-blue-900">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-purple-600 hover:text-purple-900">
                            <Send className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Scheduled Reports</h3>
          <button className="btn-primary text-sm">
            Add Schedule
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Run
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scheduledReports.map((schedule) => (
                <tr key={schedule.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {schedule.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {schedule.schedule}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(schedule.nextRun).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {schedule.recipients.length} recipient(s)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                      {schedule.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Templates */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Report Templates</h3>
          <button className="btn-primary text-sm">
            Create Template
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-gray-500">
                      <strong>Frequency:</strong> {template.frequency}
                    </p>
                    <p className="text-xs text-gray-500">
                      <strong>Formats:</strong> {template.format.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="text-sm text-blue-600 hover:text-blue-900">
                  Edit
                </button>
                <button className="text-sm text-green-600 hover:text-green-900">
                  Use
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
