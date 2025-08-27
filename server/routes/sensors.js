import express from 'express'
import { db } from '../database/init.js'
import { authenticateToken } from './auth.js'

const router = express.Router()

// Get all sensors
router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT * FROM sensors ORDER BY id', (err, sensors) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' })
    }
    res.json(sensors)
  })
})

// Get sensor by ID
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  
  db.get('SELECT * FROM sensors WHERE id = ?', [id], (err, sensor) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' })
    }
    
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' })
    }
    
    res.json(sensor)
  })
})

// Add new sensor
router.post('/', authenticateToken, (req, res) => {
  const { id, name, latitude, longitude, status } = req.body
  
  db.run(
    'INSERT INTO sensors (id, name, latitude, longitude, status) VALUES (?, ?, ?, ?, ?)',
    [id, name, latitude, longitude, status || 'active'],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' })
      }
      
      res.status(201).json({ 
        id, 
        name, 
        latitude, 
        longitude, 
        status: status || 'active' 
      })
    }
  )
})

// Update sensor
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  const { name, latitude, longitude, status, battery_level } = req.body
  
  db.run(
    'UPDATE sensors SET name = ?, latitude = ?, longitude = ?, status = ?, battery_level = ? WHERE id = ?',
    [name, latitude, longitude, status, battery_level, id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' })
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Sensor not found' })
      }
      
      res.json({ message: 'Sensor updated successfully' })
    }
  )
})

// Delete sensor
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  
  db.run('DELETE FROM sensors WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Database error' })
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Sensor not found' })
    }
    
    res.json({ message: 'Sensor deleted successfully' })
  })
})

// Get sensor status
router.get('/status/all', authenticateToken, (req, res) => {
  db.all(`
    SELECT 
      s.*,
      COUNT(sd.id) as data_points_today
    FROM sensors s
    LEFT JOIN sensor_data sd ON s.id = sd.sensor_id 
      AND DATE(sd.timestamp) = DATE('now')
    GROUP BY s.id
    ORDER BY s.id
  `, (err, sensors) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' })
    }
    res.json(sensors)
  })
})

export default router
