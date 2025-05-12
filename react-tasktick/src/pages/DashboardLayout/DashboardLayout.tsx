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
     
    </div>
  );
};

export default DashboardLayout;