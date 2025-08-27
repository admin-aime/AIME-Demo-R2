import React from 'react'
import { Menu, Bell, User, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth()

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <div className="flex items-center gap-4">
            <button 
              onClick={onMenuClick}
              className="btn btn-secondary md:hidden"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold">Air Quality Platform</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="btn btn-secondary">
              <Bell size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              <User size={20} />
              <span>{user?.username}</span>
            </div>
            
            <button 
              onClick={logout}
              className="btn btn-secondary"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
