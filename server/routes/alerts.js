import express from 'express'
import { db } from '../database/init.js'
import { authenticateToken } from './auth.js'

const router = express.Router()

// Get user's alerts
router.get('/', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM alerts WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.userId],
    (err, alerts) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' })
      }
      
      // Parse JSON fields
      const parsedAlerts = alerts.map(alert => ({
        ...alert,
        notification_channels: JSON.parse(alert.notification_channels || '[]')
      }))
      
      res.json(parsedAlerts)
    }
  )
})

// Create new alert
router.post('/create', authenticateToken, (req, res) => {
  const {
    name,
    pollutant_type,
    threshold_value,
    comparison_operator,
    location_filter,
    notification_channels,
    is_active
  } = req.body

  db.run(`
    INSERT INTO alerts (
      user_id, name, pollutant_type, threshold_value, comparison_operator,
      location_filter, notification_channels, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    req.user.userId,
    name,
    pollutant_type,
    threshold_value,
    comparison_operator,
    location_filter,
    JSON.stringify(notification_channels),
    is_active ? 1 : 0
  ], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Database error' })
    }

    res.status(201).json({
      id: this.lastID,
      name,
      pollutant_type,
      threshold_value,
      comparison_operator,
      location_filter,
      notification_channels,
      is_active
    })
  })
})

// Update alert
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  const {
    name,
    pollutant_type,
    threshold_value,
    comparison_operator,
    location_filter,
    notification_channels,
    is_active
  } = req.body

  db.run(`
    UPDATE alerts SET 
      name = ?, pollutant_type = ?, threshold_value = ?, comparison_operator = ?,
      location_filter = ?, notification_channels = ?, is_active = ?
    WHERE id = ? AND user_id = ?
  `, [
    name,
    pollutant_type,
    threshold_value,
    comparison_operator,
    location_filter,
    JSON.stringify(notification_channels),
    is_active ? 1 : 0,
    id,
    req.user.userId
  ], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Database error' })
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Alert not found' })
    }

    res.json({ message: 'Alert updated successfully' })
  })
})

// Delete alert
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params

  db.run(
    'DELETE FROM alerts WHERE id = ? AND user_id = ?',
    [id, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' })
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Alert not found' })
      }

      res.json({ message: 'Alert deleted successfully' })
    }
  )
})

// Toggle alert status
router.put('/:id/toggle', authenticateToken, (req, res) => {
  const { id } = req.params

  db.run(
    'UPDATE alerts SET is_active = NOT is_active WHERE id = ? AND user_id = ?',
    [id, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' })
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Alert not found' })
      }

      res.json({ message: 'Alert status updated' })
    }
  )
})

// Get notifications history
router.get('/notifications/history', authenticateToken, (req, res) => {
  db.all(`
    SELECT n.*, a.name as alert_name 
    FROM notifications n
    LEFT JOIN alerts a ON n.alert_id = a.id
    WHERE n.user_id = ?
    ORDER BY n.timestamp DESC
    LIMIT 50
  `, [req.user.userId], (err, notifications) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' })
    }

    // Parse JSON fields
    const parsedNotifications = notifications.map(notification => ({
      ...notification,
      channels: JSON.parse(notification.channels || '[]')
    }))

    res.json(parsedNotifications)
  })
})

// Send notification (for testing)
router.post('/notifications/send', authenticateToken, (req, res) => {
  const { title, message, type, channels } = req.body

  db.run(`
    INSERT INTO notifications (user_id, title, message, type, channels)
    VALUES (?, ?, ?, ?, ?)
  `, [
    req.user.userId,
    title,
    message,
    type || 'manual',
    JSON.stringify(channels || ['in_app'])
  ], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Database error' })
    }

    res.status(201).json({
      id: this.lastID,
      message: 'Notification sent successfully'
    })
  })
})

export default router
