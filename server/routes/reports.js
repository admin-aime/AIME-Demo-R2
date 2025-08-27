import express from 'express'
import { db } from '../database/init.js'
import { authenticateToken } from './auth.js'

const router = express.Router()

// Get user's reports
router.get('/', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM reports WHERE created_by = ? ORDER BY created_at DESC',
    [req.user.userId],
    (err, reports) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' })
      }
      
      const parsedReports = reports.map(report => ({
        ...report,
        parameters: JSON.parse(report.parameters || '{}')
      }))
      
      res.json(parsedReports)
    }
  )
})

// Generate new report
router.post('/generate', authenticateToken, (req, res) => {
  const {
    name,
    type,
    parameters,
    format
  } = req.body

  db.run(`
    INSERT INTO reports (name, type, parameters, format, created_by, status)
    VALUES (?, ?, ?, ?, ?, 'processing')
  `, [
    name,
    type,
    JSON.stringify(parameters),
    format,
    req.user.userId
  ], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Database error' })
    }

    // Simulate report generation
    setTimeout(() => {
      db.run(`
        UPDATE reports SET 
          status = 'completed',
          file_path = '/reports/report_${this.lastID}.${format}',
          file_size = ${Math.floor(Math.random() * 5000000) + 1000000},
          completed_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [this.lastID])
    }, 2000)

    res.status(201).json({
      id: this.lastID,
      message: 'Report generation started',
      estimatedTime: '2-5 minutes'
    })
  })
})

// Get report templates
router.get('/templates', authenticateToken, (req, res) => {
  const templates = [
    {
      id: 'epa_monthly',
      name: 'EPA Monthly Report',
      description: 'Standard EPA compliance report with monthly aggregations',
      parameters: ['date_range', 'sensors', 'pollutants'],
      formats: ['pdf', 'excel']
    },
    {
      id: 'quarterly_summary',
      name: 'Quarterly Summary',
      description: 'Comprehensive quarterly air quality summary',
      parameters: ['quarter', 'year', 'locations'],
      formats: ['pdf', 'word']
    },
    {
      id: 'annual_compliance',
      name: 'Annual Compliance Report',
      description: 'Complete annual compliance assessment',
      parameters: ['year', 'standards', 'all_sensors'],
      formats: ['pdf', 'excel', 'word']
    },
    {
      id: 'custom_analysis',
      name: 'Custom Analysis',
      description: 'Customizable report with selected parameters',
      parameters: ['custom'],
      formats: ['pdf', 'excel', 'csv']
    }
  ]

  res.json(templates)
})

// Download report
router.get('/:id/download', authenticateToken, (req, res) => {
  const { id } = req.params

  db.get(
    'SELECT * FROM reports WHERE id = ? AND created_by = ?',
    [id, req.user.userId],
    (err, report) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' })
      }

      if (!report) {
        return res.status(404).json({ message: 'Report not found' })
      }

      if (report.status !== 'completed') {
        return res.status(400).json({ message: 'Report not ready for download' })
      }

      // Mock file download
      res.json({
        message: 'Download started',
        filename: `${report.name}.${report.format}`,
        size: report.file_size
      })
    }
  )
})

// Schedule report
router.post('/schedule', authenticateToken, (req, res) => {
  const {
    name,
    type,
    parameters,
    format,
    schedule,
    recipients
  } = req.body

  // Mock scheduling functionality
  res.status(201).json({
    id: Date.now(),
    message: 'Report scheduled successfully',
    schedule,
    nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  })
})

// Get scheduled reports
router.get('/scheduled', authenticateToken, (req, res) => {
  // Mock scheduled reports
  const scheduledReports = [
    {
      id: 1,
      name: 'EPA Monthly Report',
      schedule: 'Monthly on 1st',
      nextRun: '2024-02-01',
      recipients: ['epa@example.com'],
      status: 'active'
    },
    {
      id: 2,
      name: 'Quarterly Summary',
      schedule: 'Quarterly on 15th',
      nextRun: '2024-04-15',
      recipients: ['management@company.com'],
      status: 'active'
    }
  ]

  res.json(scheduledReports)
})

export default router
