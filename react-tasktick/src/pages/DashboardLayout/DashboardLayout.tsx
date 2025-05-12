import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/DashboardComponents/Sidebar/Sidebar';
import './DashboardLayout.css';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>
      )}
      
    </div>
  );
};

export default DashboardLayout;