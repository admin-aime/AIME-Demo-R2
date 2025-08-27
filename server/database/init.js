import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = join(__dirname, 'airquality.db')

export const db = new sqlite3.Database(dbPath)

export async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'viewer',
          organization TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Sensors table
      db.run(`
        CREATE TABLE IF NOT EXISTS sensors (
          id TEXT PRIMARY KEY,
          name TEXT,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          status TEXT DEFAULT 'active',
          installation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_maintenance DATETIME,
          battery_level INTEGER DEFAULT 100
        )
      `)

      // Sensor data table
      db.run(`
        CREATE TABLE IF NOT EXISTS sensor_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          sensor_id TEXT NOT NULL,
          timestamp DATETIME NOT NULL,
          pm25 REAL,
          pm10 REAL,
          ozone REAL,
          co REAL,
          no2 REAL,
          so2 REAL,
          temperature REAL,
          humidity REAL,
          wind_speed REAL,
          wind_direction REAL,
          FOREIGN KEY (sensor_id) REFERENCES sensors (id)
        )
      `)

      // Alerts table
      db.run(`
        CREATE TABLE IF NOT EXISTS alerts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          pollutant_type TEXT NOT NULL,
          threshold_value REAL NOT NULL,
          comparison_operator TEXT NOT NULL,
          location_filter TEXT,
          notification_channels TEXT,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `)

      // Notifications table
      db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          alert_id INTEGER,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          type TEXT DEFAULT 'alert',
          channels TEXT,
          read BOOLEAN DEFAULT 0,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (alert_id) REFERENCES alerts (id)
        )
      `)

      // Reports table
      db.run(`
        CREATE TABLE IF NOT EXISTS reports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          parameters TEXT,
          file_path TEXT,
          file_size INTEGER,
          format TEXT,
          status TEXT DEFAULT 'pending',
          created_by INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          completed_at DATETIME,
          FOREIGN KEY (created_by) REFERENCES users (id)
        )
      `)

      // Insert default admin user
      db.run(`
        INSERT OR IGNORE INTO users (username, email, password_hash, role, organization)
        VALUES ('admin', 'admin@airquality.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Air Quality Agency')
      `, (err) => {
        if (err) {
          console.error('Error inserting default user:', err)
          reject(err)
        } else {
          console.log('Database initialized successfully')
          resolve()
        }
      })
    })
  })
}
