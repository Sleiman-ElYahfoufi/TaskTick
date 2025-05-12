import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCards from '../../components/DashboardComponents/StatCards/StatCards'; 
import ActiveProjects from '../../components/DashboardComponents/ActiveProjects/ActiveProjects'; 
import ProductivityHeatmap from '../../components/DashboardComponents/ProductivityHeatmap/ProductivityHeatmap'; 
import AIInsights from '../../components/DashboardComponents/AIInsights/AIInsights'; 
import RecentActivity from '../../components/DashboardComponents/RecentActivity/RecentActivity'; 
import './Dashboard.css';

interface Project {
  id: string;
  name: string;
  hours: string;
  status: string;
  progress: number;
}

interface Insight {
  id: string;
  text: string;
}

interface ActivityItem {
  id: string;
  type: string;
  project?: string;
  description: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    activeProjects: 7,
    tasksCompleted: 28,
    dueToday: 2
  });
  
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-commerce Platform Redesign',
      hours: '230-245',
      status: 'In Progress',
      progress: 45
    },
    {
      id: '2',
      name: 'E-commerce Platform Redesign',
      hours: '230-245',
      status: 'In Progress',
      progress: 30
    },
    {
      id: '3',
      name: 'E-commerce Platform Redesign',
      hours: '230-245',
      status: 'In Progress',
      progress: 60
    }
  ]);
  
 
  
  return (
    <div className="dashboard-page">
      
    </div>
  );
};

export default Dashboard;