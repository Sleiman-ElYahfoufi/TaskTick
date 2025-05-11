import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import TaskTickLogo from '../../../assets/just_logo.png';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
 
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        <div className="sidebar-close-mobile" onClick={closeSidebar}>×</div>
        <div className="sidebar-header">
          <img src={TaskTickLogo} alt="TaskTick" className="logo" />
          <h1>TaskTick</h1>
        </div>
        
        <nav className="sidebar-nav">
          <Link 
            to="/dashboard" 
            className={`nav-item ${isActive('/dashboard') && location.pathname === '/dashboard' ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <span className="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </span>
            <span className="nav-text">Dashboard</span>
          </Link>
          
          </nav>
      </div>
      
     
      </div>
    </div>
  );
};

export default Sidebar;