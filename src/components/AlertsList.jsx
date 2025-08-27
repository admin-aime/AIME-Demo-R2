import React from 'react'
import { AlertTriangle, Info, AlertCircle } from 'lucide-react'

const AlertsList = ({ alerts }) => {
  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="text-red-500" size={16} />
      case 'medium':
        return <AlertCircle className="text-orange-500" size={16} />
      default:
        return <Info className="text-blue-500" size={16} />
    }
  }

  const getAlertClass = (severity) => {
    switch (severity) {
      case 'high':
        return 'border-l-red-500 bg-red-50'
      case 'medium':
        return 'border-l-orange-500 bg-orange-50'
      default:
        return 'border-l-blue-500 bg-blue-50'
    }
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No recent alerts
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <div 
          key={index}
          className={`p-3 border-l-4 rounded-r ${getAlertClass(alert.severity)}`}
        >
          <div className="flex items-start gap-3">
            {getAlertIcon(alert.severity)}
            <div className="flex-1">
              <div className="font-medium text-sm">{alert.message}</div>
              <div className="text-xs text-gray-600 mt-1">
                {alert.sensor_id} • {new Date(alert.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AlertsList
