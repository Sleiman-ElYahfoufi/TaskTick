import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/DashboardComponents/Sidebar/Sidebar';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
     
    </div>
  );
};

export default Dashboard;