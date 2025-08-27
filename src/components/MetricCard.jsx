import React from 'react'

const MetricCard = ({ title, value, unit, icon: Icon, color, subtitle }) => {
  return (
    <div className="card metric-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {Icon && <Icon size={20} style={{ color }} />}
      </div>
      
      <div className="metric-value" style={{ color }}>
        {value}
        {unit && <span className="text-sm ml-1">{unit}</span>}
      </div>
      
      {subtitle && (
        <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
      )}
    </div>
  )
}

export default MetricCard
