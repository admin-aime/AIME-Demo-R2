import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const DataContext = createContext()

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export function DataProvider({ children }) {
  const [sensors, setSensors] = useState([])
  const [realtimeData, setRealtimeData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSensors()
    setupWebSocket()
  }, [])

  const fetchSensors = async () => {
    try {
      const response = await axios.get('/api/sensors')
      setSensors(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch sensors')
      setLoading(false)
    }
  }

  const setupWebSocket = () => {
    const ws = new WebSocket(`ws://localhost:3001/ws`)
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'sensor_data') {
        setRealtimeData(prev => ({
          ...prev,
          [data.sensor_id]: data
        }))
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => ws.close()
  }

  const fetchHistoricalData = async (sensorId, startDate, endDate) => {
    try {
      const response = await axios.get('/api/data/historical', {
        params: { sensorId, startDate, endDate }
      })
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch historical data')
    }
  }

  const calculateAQI = (pollutant, value) => {
    // EPA AQI calculation for PM2.5
    if (pollutant === 'pm25') {
      if (value <= 12) return { aqi: Math.round((50 / 12) * value), category: 'Good' }
      if (value <= 35.4) return { aqi: Math.round(((100 - 51) / (35.4 - 12.1)) * (value - 12.1) + 51), category: 'Moderate' }
      if (value <= 55.4) return { aqi: Math.round(((150 - 101) / (55.4 - 35.5)) * (value - 35.5) + 101), category: 'Unhealthy for Sensitive Groups' }
      if (value <= 150.4) return { aqi: Math.round(((200 - 151) / (150.4 - 55.5)) * (value - 55.5) + 151), category: 'Unhealthy' }
      if (value <= 250.4) return { aqi: Math.round(((300 - 201) / (250.4 - 150.5)) * (value - 150.5) + 201), category: 'Very Unhealthy' }
      return { aqi: Math.round(((500 - 301) / (500.4 - 250.5)) * (value - 250.5) + 301), category: 'Hazardous' }
    }
    
    // Default calculation for other pollutants
    return { aqi: Math.min(Math.round(value * 2), 500), category: 'Unknown' }
  }

  const value = {
    sensors,
    realtimeData,
    loading,
    error,
    fetchHistoricalData,
    calculateAQI,
    refreshSensors: fetchSensors
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}
