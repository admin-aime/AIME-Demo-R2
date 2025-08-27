import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../database/init.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body

  db.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' })
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      // For demo purposes, accept 'password' as the password
      const isValidPassword = password === 'password' || await bcrypt.compare(password, user.password_hash)

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      )

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          organization: user.organization
        }
      })
    }
  )
})

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  db.get(
    'SELECT id, username, email, role, organization FROM users WHERE id = ?',
    [req.user.userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' })
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.json({ user })
    }
  )
})

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' })
    }
    req.user = user
    next()
  })
}

export { authenticateToken }
export default router
