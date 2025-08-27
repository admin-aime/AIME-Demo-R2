import { db } from '../database/init.js'

export function generateMockData() {
  // Insert mock sensors
  const sensors = [
    { id: 'sensor_001', name: 'Downtown Station', lat: 40.7128, lng: -74.0060 },
    { id: 'sensor_002', name: 'Industrial Zone', lat: 40.7589, lng: -73.9851 },
    { id: 'sensor_003', name: 'Residential Area', lat: 40.6782, lng: -73.9442 },
    { id: 'sensor_004', name: 'Highway Monitor', lat: 40.7505, lng: -73.9934 },
    { id: 'sensor_005', name: 'Park Station', lat: 40.7829, lng: -73.9654 },
    { id: 'sensor_006', name: 'Airport Monitor', lat: 40.6413, lng: -73.7781 },
    { id: 'sensor_007', name: 'Harbor Station', lat: 40.7074, lng: -74.0113 },
    { id: 'sensor_008', name: 'University Campus', lat: 40.8075, lng: -73.9626 },
    { id: 'sensor_009', name: 'Shopping District', lat: 40.7505, lng: -73.9934 },
    { id: 'sensor_010', name: 'Suburban Monitor', lat: 40.6892, lng: -74.0445 }
  ]

  sensors.forEach(sensor => {
    db.run(`
      INSERT OR IGNORE INTO sensors (id, name, latitude, longitude, status, battery_level)
      VALUES (?, ?, ?, ?, 'active', ?)
    `, [sensor.id, sensor.name, sensor.lat, sensor.lng, Math.floor(Math.random() * 40) + 60])
  })

  // Generate mock sensor data for the last 30 days
  const now = new Date()
  for (let days = 30; days >= 0; days--) {
    for (let hours = 0; hours < 24; hours += 2) { // Every 2 hours
      sensors.forEach(sensor => {
        const timestamp = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000))
        
        // Generate realistic pollution data with some variation
        const baseValues = {
          pm25: 15 + Math.random() * 25,
          pm10: 20 + Math.random() * 40,
          ozone: 30 + Math.random() * 50,
          co: 0.5 + Math.random() * 2,
          no2: 20 + Math.random() * 30,
          so2: 5 + Math.random() * 15,
          temperature: 15 + Math.random() * 20,
          humidity: 40 + Math.random() * 40,
          wind_speed: Math.random() * 15,
          wind_direction: Math.random() * 360
        }

        // Add some pollution spikes for industrial and highway sensors
        if (sensor.id === 'sensor_002' || sensor.id === 'sensor_004') {
          if (Math.random() < 0.1) { // 10% chance of spike
            baseValues.pm25 *= 2
            baseValues.pm10 *= 1.8
            baseValues.no2 *= 1.5
          }
        }

        db.run(`
          INSERT OR IGNORE INTO sensor_data (
            sensor_id, timestamp, pm25, pm10, ozone, co, no2, so2,
            temperature, humidity, wind_speed, wind_direction
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          sensor.id,
          timestamp.toISOString(),
          Math.round(baseValues.pm25 * 10) / 10,
          Math.round(baseValues.pm10 * 10) / 10,
          Math.round(baseValues.ozone * 10) / 10,
          Math.round(baseValues.co * 10) / 10,
          Math.round(baseValues.no2 * 10) / 10,
          Math.round(baseValues.so2 * 10) / 10,
          Math.round(baseValues.temperature * 10) / 10,
          Math.round(baseValues.humidity * 10) / 10,
          Math.round(baseValues.wind_speed * 10) / 10,
          Math.round(baseValues.wind_direction)
        ])
      })
    }
  }

  console.log('Mock data generated successfully')
}
