import express from 'express'
import cors from 'cors'
import { WebSocketServer } from 'ws'
import http from 'http'
import authRoutes from './routes/auth.js'
import sensorRoutes from './routes/sensors.js'
import dataRoutes from './routes/data.js'
import alertRoutes from './routes/alerts.js'
import reportRoutes from './routes/reports.js'
import complianceRoutes from './routes/compliance.js'
import { initializeDatabase } from './database/init.js'
import { generateMockData } from './utils/mockData.js'

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

// Middleware
app.use(cors())
app.use(express.json())

// Initialize database
await initializeDatabase()

// Generate mock data
generateMockData()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/sensors', sensorRoutes)
app.use('/api/data', dataRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/compliance', complianceRoutes)

// WebSocket connection for real-time data
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket')
  
  // Send mock real-time data every 30 seconds
  const interval = setInterval(() => {
    const mockSensorData = {
      type: 'sensor_data',
      sensor_id: `sensor_${Math.floor(Math.random() * 10) + 1}`,
      timestamp: new Date().toISOString(),
      pm25: Math.random() * 50 + 10,
      pm10: Math.random() * 80 + 15,
      ozone: Math.random() * 100 + 30,
      temperature: Math.random() * 15 + 15,
      humidity: Math.random() * 40 + 40
    }
    
    ws.send(JSON.stringify(mockSensorData))
  }, 30000)

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket')
    clearInterval(interval)
  })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
