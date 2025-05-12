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
  
  const [insights, setInsights] = useState<Insight[]>([
    { id: '1', text: 'Frontend tasks take 15% longer' },
    { id: '2', text: 'API integrations 23% faster' },
    { id: '3', text: 'Break down Auth tasks more' },
    { id: '4', text: 'Productivity peaks at 10-12am' }
  ]);
  
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'task_added',
      project: 'Database Migration',
      description: 'New task "Schema Validation" added',
      timestamp: 'Today, 11:23 AM'
    },
    {
      id: '2',
      type: 'task_added',
      project: 'Database Migration',
      description: 'New task "Schema Validation" added',
      timestamp: 'Today, 11:23 AM'
    },
    {
      id: '3',
      type: 'task_added',
      project: 'Database Migration',
      description: 'New task "Schema Validation" added',
      timestamp: 'Today, 11:23 AM'
    }
  ]);
  
  const handleAddProject = () => {
    navigate('/dashboard/projects/new');
  };
  
  return (
    <div className="dashboard-page">
      <h1 className="page-title">Dashboard</h1>
      
      <StatCards 
        activeProjects={stats.activeProjects}
        tasksCompleted={stats.tasksCompleted}
        dueToday={stats.dueToday}
      />
      
      <div className="dashboard-layout">
        <div className="left-column">
          <ActiveProjects 
            projects={projects}
            onAddProject={handleAddProject}
          />
          
          <RecentActivity activities={activities} />
        </div>
        
        <div className="right-column">
          <ProductivityHeatmap />
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;