import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Save, User, Bell, Shield, Database, Mail, Smartphone } from 'lucide-react'

export default function Settings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState({
    profile: {
      username: user?.username || '',
      email: user?.email || '',
      organization: user?.organization || '',
      role: user?.role || ''
    },
    notifications: {
      email_alerts: true,
      sms_alerts: false,
      in_app_notifications: true,
      daily_summary: true,
      weekly_report: false,
      compliance_alerts: true
    },
    system: {
      data_retention_days: 1825, // 5 years
      auto_backup: true,
      backup_frequency: 'daily',
      api_rate_limit: 1000,
      max_concurrent_users: 50
    },
    integrations: {
      weather_api_key: '',
      email_smtp_server: '',
      sms_gateway_key: '',
      mapbox_token: ''
    }
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'system', name: 'System', icon: Shield },
    { id: 'integrations', name: 'Integrations', icon: Database },
  ]

  const handleSave = (section) => {
    // Mock save functionality
    alert(`${section} settings saved successfully!`)
  }

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={settings.profile.username}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, username: e.target.value }
              }))}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, email: e.target.value }
              }))}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization
            </label>
            <input
              type="text"
              value={settings.profile.organization}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, organization: e.target.value }
              }))}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={settings.profile.role}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, role: e.target.value }
              }))}
              className="input-field w-full"
            >
              <option value="admin">Administrator</option>
              <option value="analyst">Analyst</option>
              <option value="viewer">Viewer</option>
              <option value="public">Public User</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              className="input-field w-full"
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => handleSave('Profile')}
        className="btn-primary flex items-center space-x-2"
      >
        <Save className="h-4 w-4" />
        <span>Save Profile</span>
      </button>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email Alerts</p>
                <p className="text-sm text-gray-500">Receive alerts via email</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.email_alerts}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, email_alerts: e.target.checked }
              }))}
              className="h-4 w-4 text-primary-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">SMS Alerts</p>
                <p className="text-sm text-gray-500">Receive alerts via SMS</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.sms_alerts}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, sms_alerts: e.target.checked }
              }))}
              className="h-4 w-4 text-primary-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">In-App Notifications</p>
                <p className="text-sm text-gray-500">Show notifications in the application</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.in_app_notifications}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, in_app_notifications: e.target.checked }
              }))}
              className="h-4 w-4 text-primary-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Daily Summary</p>
              <p className="text-sm text-gray-500">Receive daily air quality summary</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.daily_summary}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, daily_summary: e.target.checked }
              }))}
              className="h-4 w-4 text-primary-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Weekly Report</p>
              <p className="text-sm text-gray-500">Receive weekly compliance report</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.weekly_report}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, weekly_report: e.target.checked }
              }))}
              className="h-4 w-4 text-primary-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Compliance Alerts</p>
              <p className="text-sm text-gray-500">Receive alerts for compliance violations</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.compliance_alerts}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, compliance_alerts: e.target.checked }
              }))}
              className="h-4 w-4 text-primary-600"
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => handleSave('Notification')}
        className="btn-primary flex items-center space-x-2"
      >
        <Save className="h-4 w-4" />
        <span>Save Notifications</span>
      </button>
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Retention (days)
            </label>
            <input
              type="number"
              value={settings.system.data_retention_days}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                system: { ...prev.system, data_retention_days: parseInt(e.target.value) }
              }))}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup Frequency
            </label>
            <select
              value={settings.system.backup_frequency}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                system: { ...prev.system, backup_frequency: e.target.value }
              }))}
              className="input-field w-full"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Rate Limit (requests/hour)
            </label>
            <input
              type="number"
              value={settings.system.api_rate_limit}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                system: { ...prev.system, api_rate_limit: parseInt(e.target.value) }
              }))}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Concurrent Users
            </label>
            <input
              type="number"
              value={settings.system.max_concurrent_users}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                system: { ...prev.system, max_concurrent_users: parseInt(e.target.value) }
              }))}
              className="input-field w-full"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Backup Settings</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Automatic Backup</p>
            <p className="text-sm text-gray-500">Enable automatic data backups</p>
          </div>
          <input
            type="checkbox"
            checked={settings.system.auto_backup}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              system: { ...prev.system, auto_backup: e.target.checked }
            }))}
            className="h-4 w-4 text-primary-600"
          />
        </div>
      </div>

      <button
        onClick={() => handleSave('System')}
        className="btn-primary flex items-center space-x-2"
      >
        <Save className="h-4 w-4" />
        <span>Save System Settings</span>
      </button>
    </div>
  )

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">API Integrations</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weather API Key
            </label>
            <input
              type="password"
              value={settings.integrations.weather_api_key}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                integrations: { ...prev.integrations, weather_api_key: e.target.value }
              }))}
              className="input-field w-full"
              placeholder="Enter weather service API key"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mapbox Access Token
            </label>
            <input
              type="password"
              value={settings.integrations.mapbox_token}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                integrations: { ...prev.integrations, mapbox_token: e.target.value }
              }))}
              className="input-field w-full"
              placeholder="Enter Mapbox access token"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Services</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Server
            </label>
            <input
              type="text"
              value={settings.integrations.email_smtp_server}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                integrations: { ...prev.integrations, email_smtp_server: e.target.value }
              }))}
              className="input-field w-full"
              placeholder="smtp.example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMS Gateway Key
            </label>
            <input
              type="password"
              value={settings.integrations.sms_gateway_key}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                integrations: { ...prev.integrations, sms_gateway_key: e.target.value }
              }))}
              className="input-field w-full"
              placeholder="Enter SMS gateway API key"
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => handleSave('Integration')}
        className="btn-primary flex items-center space-x-2"
      >
        <Save className="h-4 w-4" />
        <span>Save Integrations</span>
      </button>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'system':
        return renderSystemSettings()
      case 'integrations':
        return renderIntegrationSettings()
      default:
        return renderProfileSettings()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="flex-shrink-0 h-5 w-5 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
