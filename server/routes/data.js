import express from 'express'
import { db } from '../database/init.js'
import { authenticateToken } from './auth.js'

const router = express.Router()

// Receive sensor data
router.post('/sensors/data', (req, res) => {
  const { 
    sensor_id, 
    timestamp, 
    pm25, 
    pm10, 
    ozone, 
    co, 
    no2, 
    so2, 
    temperature, 
    humidity,
    wind_speed,
    wind_direction 
  } = req.body

  db.run(`
    INSERT INTO sensor_data (
      sensor_id, timestamp, pm25, pm10, ozone, co, no2, so2, 
      temperature, humidity, wind_speed, wind_direction
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    sensor_id, timestamp, pm25, pm10, ozone, co, no2, so2,
    temperature, humidity, wind_speed, wind_direction
  ], function(err) {
    if (err) {
      console.error('Error inserting sensor data:', err)
      return res.status(500).json({ message: 'Database error' })
    }
    
    res.status(201).json({ 
      id: this.lastID,
      message: 'Data received successfully' 
    })
  })
})

// Get historical data
router.get('/historical', authenticateToken, (req, res) => {
  const { sensorId, startDate, endDate, pollutant, limit = 1000 } = req.query
  
  let query = 'SELECT * FROM sensor_data WHERE 1=1'
  let params = []
  
  if (sensorId) {
    query += ' AND sensor_id = ?'
    params.push(sensorId)
  }
  
  if (startDate) {
    query += ' AND timestamp >= ?'
    params.push(startDate)
  }
  
  if (endDate) {
    query += ' AND timestamp <= ?'
    params.push(endDate)
  }
  
  query += ' ORDER BY timestamp DESC LIMIT ?'
  params.push(parseInt(limit))
  
  db.all(query, params, (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' })
    }
    res.json(data)
  })
})

// Get latest readings for all sensors
router.get('/latest', authenticateToken, (req, res) => {
  db.all(`
    SELECT sd.* FROM sensor_data sd
    INNER JOIN (
      SELECT sensor_id, MAX(timestamp) as max_timestamp
      FROM sensor_data
      GROUP BY sensor_id
    ) latest ON sd.sensor_id = latest.sensor_id 
    AND sd.timestamp = latest.max_timestamp
    ORDER BY sd.sensor_id
  `, (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' })
    }
    res.json(data)
  })
})

// Get aggregated data
router.get('/aggregate', authenticateToken, (req, res) => {
  const { 
    sensorId, 
    startDate, 
    endDate, 
    interval = 'hour', 
    pollutant = 'pm25' 
  } = req.query
  
  let timeFormat
  switch (interval) {
    case 'hour':
      timeFormat = '%Y-%m-%d %H:00:00'
      break
    case 'day':
      timeFormat = '%Y-%m-%d'
      break
    case 'month':
      timeFormat = '%Y-%m'
      break
    default:
      timeFormat = '%Y-%m-%d %H:00:00'
  }
  
  let query = `
    SELECT 
      strftime('${timeFormat}', timestamp) as time_period,
      AVG(${pollutant}) as avg_value,
      MIN(${pollutant}) as min_value,
      MAX(${pollutant}) as max_value,
      COUNT(*) as data_points
    FROM sensor_data 
    WHERE 1=1
  `
  let params = []
  
  if (sensorId) {
    query += ' AND sensor_id = ?'
    params.push(sensorId)
  }
  
  if (startDate) {
    query += ' AND timestamp >= ?'
    params.push(startDate)
  }
  
  if (endDate) {
    query += ' AND timestamp <= ?'
    params.push(endDate)
  }
  
  query += ' GROUP BY time_period ORDER BY time_period'
  
  db.all(query, params, (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' })
    }
    res.json(data)
  })
})

// Export data
router.post('/export', authenticateToken, (req, res) => {
  const { format, filters } = req.body
  
  // Mock export functionality
  res.json({
    message: 'Export started',
    exportId: Date.now(),
    format,
    estimatedTime: '2-5 minutes'
  })
})

export default router
