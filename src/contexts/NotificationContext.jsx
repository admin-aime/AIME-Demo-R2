import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const NotificationContext = createContext()

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    fetchAlerts()
    fetchNotifications()
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('/api/alerts')
      setAlerts(response.data)
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications/history')
      setNotifications(response.data)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const createAlert = async (alertData) => {
    try {
      const response = await axios.post('/api/alerts/create', alertData)
      setAlerts(prev => [...prev, response.data])
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create alert' }
    }
  }

  const updateAlert = async (alertId, updates) => {
    try {
      const response = await axios.put(`/api/alerts/${alertId}`, updates)
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? response.data : alert
      ))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update alert' }
    }
  }

  const deleteAlert = async (alertId) => {
    try {
      await axios.delete(`/api/alerts/${alertId}`)
      setAlerts(prev => prev.filter(alert => alert.id !== alertId))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete alert' }
    }
  }

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ))
  }

  const value = {
    notifications,
    alerts,
    createAlert,
    updateAlert,
    deleteAlert,
    addNotification,
    markAsRead,
    refreshAlerts: fetchAlerts,
    refreshNotifications: fetchNotifications
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
