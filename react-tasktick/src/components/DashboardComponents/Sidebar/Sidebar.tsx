import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import TaskTickLogo from '../../../assets/just_logo.png';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
 

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
     
    </div>
  );
};

export default Sidebar;