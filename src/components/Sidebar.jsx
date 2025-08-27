import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Map, 
  BarChart3, 
  Radio, 
  AlertTriangle, 
  FileText, 
  Settings,
  X
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/map', icon: Map, label: 'Map View' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/sensors', icon: Radio, label: 'Sensors' },
    { path: '/alerts', icon: AlertTriangle, label: 'Alerts' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''} z-50`}>
        <div className="flex justify-between items-center mb-8 md:hidden">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={onClose} className="btn btn-secondary">
            <X size={20} />
          </button>
        </div>
        
        <nav>
          <ul className="space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon size={20} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
