import { getDatabase, addSensorData, addAlert } from '../database/init.js'

// Simulate realistic sensor data
export const startDataSimulation = (io) => {
  const db = getDatabase()
  
  // Generate data every 30 seconds
  setInterval(() => {
    db.sensors.forEach(sensor => {
      const sensorData = generateSensorData(sensor.id, sensor.location)
      addSensorData(sensorData)
      
      // Emit real-time data
      io.emit('sensorData', sensorData)
      
      // Check for alerts
      checkForAlerts(sensorData, io)
    })
  }, 30000) // 30 seconds
  
  console.log('Data simulation started')
}

const generateSensorData = (sensorId, location) => {
  const baseTime = new Date()
  
  // Generate realistic air quality data with some randomness
  const pm25 = Math.max(0, 15 + Math.random() * 30 + Math.sin(Date.now() / 3600000) * 10)
  const pm10 = pm25 * (1.5 + Math.random() * 0.5)
  const o3 = Math.max(0, 40 + Math.random() * 60)
  const co = Math.max(0, 0.5 + Math.random() * 2)
  const nox = Math.max(0, 20 + Math.random() * 40)
  const so2 = Math.max(0, 5 + Math.random() * 15)
  
  // Weather data
  const temperature = 20 + Math.random() * 15 + Math.sin(Date.now() / 86400000) * 5
  const humidity = 40 + Math.random() * 40
  
  // Device status
  const battery_level = 80 + Math.random() * 20
  const signal_strength = 70 + Math.random() * 30
  
  return {
    sensor_id: sensorId,
    timestamp: baseTime.toISOString(),
    location,
    pm25: Math.round(pm25 * 10) / 10,
    pm10: Math.round(pm10 * 10) / 10,
    o3: Math.round(o3 * 10) / 10,
    co: Math.round(co * 100) / 100,
    nox: Math.round(nox * 10) / 10,
    so2: Math.round(so2 * 10) / 10,
    temperature: Math.round(temperature * 10) / 10,
    humidity: Math.round(humidity),
    battery_level: Math.round(battery_level),
    signal_strength: Math.round(signal_strength)
  }
}

const checkForAlerts = (data, io) => {
  const alerts = []
  
  // PM2.5 threshold checks
  if (data.pm25 > 35) {
    alerts.push({
      sensor_id: data.sensor_id,
      message: `PM2.5 level exceeded threshold: ${data.pm25} μg/m³`,
      severity: data.pm25 > 55 ? 'high' : 'medium',
      pollutant: 'pm25',
      value: data.pm25,
      threshold: 35,
      timestamp: new Date().toISOString()
    })
  }
  
  // PM10 threshold checks
  if (data.pm10 > 150) {
    alerts.push({
      sensor_id: data.sensor_id,
      message: `PM10 level exceeded threshold: ${data.pm10} μg/m³`,
      severity: data.pm10 > 250 ? 'high' : 'medium',
      pollutant: 'pm10',
      value: data.pm10,
      threshold: 150,
      timestamp: new Date().toISOString()
    })
  }
  
  // Battery level check
  if (data.battery_level < 20) {
    alerts.push({
      sensor_id: data.sensor_id,
      message: `Low battery level: ${data.battery_level}%`,
      severity: 'low',
      type: 'maintenance',
      value: data.battery_level,
      timestamp: new Date().toISOString()
    })
  }
  
  // Add alerts to database and emit
  alerts.forEach(alert => {
    addAlert(alert)
    io.emit('alert', alert)
  })
}
