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
       
      </div>
    </div>
  );
};

export default Sidebar;