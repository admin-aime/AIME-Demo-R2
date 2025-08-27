import React from 'react'

export default function AQIBadge({ aqi, category, size = 'md' }) {
  const getAQIClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'good':
        return 'aqi-good'
      case 'moderate':
        return 'aqi-moderate'
      case 'unhealthy for sensitive groups':
        return 'aqi-unhealthy-sensitive'
      case 'unhealthy':
        return 'aqi-unhealthy'
      case 'very unhealthy':
        return 'aqi-very-unhealthy'
      case 'hazardous':
        return 'aqi-hazardous'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${getAQIClass(category)} ${sizeClasses[size]}`}>
      AQI {aqi} - {category}
    </span>
  )
}
