import React, { useState } from 'react'
import { useNotifications } from '../contexts/NotificationContext'
import { Plus, Edit, Trash2, Bell, Mail, Smartphone, AlertTriangle, CheckCircle } from 'lucide-react'
import LoadingSpinner from '../components/UI/LoadingSpinner'

export default function Alerts() {
  const { alerts, notifications, createAlert, updateAlert, deleteAlert } = useNotifications()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingAlert, setEditingAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    pollutant_type: 'pm25',
    threshold_value: '',
    comparison_operator: 'greater_than',
    location_filter: '',
    notification_channels: ['email'],
    is_active: true
  })

  const pollutantOptions = [
    { value: 'pm25', label: 'PM2.5' },
    { value: 'pm10', label: 'PM10' },
    { value: 'ozone', label: 'Ozone' },
    { value: 'co', label: 'Carbon Monoxide' },
    { value: 'no2', label: 'Nitrogen Dioxide' },
    { value: 'so2', label: 'Sulfur Dioxide' },
  ]

  const operatorOptions = [
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'equal_to', label: 'Equal to' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingAlert) {
        await updateAlert(editingAlert.id, formData)
      } else {
        await createAlert(formData)
      }
      
      setShowCreateForm(false)
      setEditingAlert(null)
      setFormData({
        name: '',
        pollutant_type: 'pm25',
        threshold_value: '',
        comparison_operator: 'greater_than',
        location_filter: '',
        notification_channels: ['email'],
        is_active: true
      })
    } catch (error) {
      console.error('Failed to save alert:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (alert) => {
    setEditingAlert(alert)
    setFormData({
      name: alert.name,
      pollutant_type: alert.pollutant_type,
      threshold_value: alert.threshold_value,
      comparison_operator: alert.comparison_operator,
      location_filter: alert.location_filter || '',
      notification_channels: alert.notification_channels || ['email'],
      is_active: alert.is_active
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      await deleteAlert(alertId)
    }
  }

  const handleChannelChange = (channel) => {
    setFormData(prev => ({
      ...prev,
      notification_channels: prev.notification_channels.includes(channel)
        ? prev.notification_channels.filter(c => c !== channel)
        : [...prev.notification_channels, channel]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alert Management</h1>
          <p className="text-gray-600">Configure and manage air quality alerts</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Alert</span>
        </button>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Alerts</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.is_active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Triggered Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => 
                  new Date(n.timestamp).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Mail className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Notifications Sent</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Alert Form */}
      {showCreateForm && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingAlert ? 'Edit Alert' : 'Create New Alert'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pollutant
                </label>
                <select
                  value={formData.pollutant_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, pollutant_type: e.target.value }))}
                  className="input-field w-full"
                >
                  {pollutantOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={formData.comparison_operator}
                  onChange={(e) => setFormData(prev => ({ ...prev, comparison_operator: e.target.value }))}
                  className="input-field w-full"
                >
                  {operatorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Threshold Value
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.threshold_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, threshold_value: e.target.value }))}
                  className="input-field w-full"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Filter (optional)
                </label>
                <input
                  type="text"
                  value={formData.location_filter}
                  onChange={(e) => setFormData(prev => ({ ...prev, location_filter: e.target.value }))}
                  className="input-field w-full"
                  placeholder="e.g., Downtown, Industrial Zone"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Channels
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.notification_channels.includes('email')}
                    onChange={() => handleChannelChange('email')}
                    className="mr-2"
                  />
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.notification_channels.includes('sms')}
                    onChange={() => handleChannelChange('sms')}
                    className="mr-2"
                  />
                  <Smartphone className="h-4 w-4 mr-1" />
                  SMS
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.notification_channels.includes('in_app')}
                    onChange={() => handleChannelChange('in_app')}
                    className="mr-2"
                  />
                  <Bell className="h-4 w-4 mr-1" />
                  In-App
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">
                Active
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading && <LoadingSpinner size="sm" />}
                <span>{editingAlert ? 'Update Alert' : 'Create Alert'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false)
                  setEditingAlert(null)
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Alerts List */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configured Alerts</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Channels
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
              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{alert.name}</div>
                      <div className="text-sm text-gray-500">{alert.location_filter || 'All locations'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pollutantOptions.find(p => p.value === alert.pollutant_type)?.label} {' '}
                    {operatorOptions.find(o => o.value === alert.comparison_operator)?.label.toLowerCase()} {' '}
                    {alert.threshold_value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {alert.notification_channels?.includes('email') && <Mail className="h-4 w-4 text-gray-400" />}
                      {alert.notification_channels?.includes('sms') && <Smartphone className="h-4 w-4 text-gray-400" />}
                      {alert.notification_channels?.includes('in_app') && <Bell className="h-4 w-4 text-gray-400" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      alert.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {alert.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(alert)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(alert.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Notifications</h3>
        <div className="space-y-3">
          {notifications.slice(0, 10).map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  {notification.channels?.includes('email') && <Mail className="h-4 w-4 text-gray-400" />}
                  {notification.channels?.includes('sms') && <Smartphone className="h-4 w-4 text-gray-400" />}
                  {notification.channels?.includes('in_app') && <Bell className="h-4 w-4 text-gray-400" />}
                </div>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-center text-gray-500 py-8">No notifications yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
