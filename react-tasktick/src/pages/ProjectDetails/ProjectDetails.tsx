import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GridColDef } from '@mui/x-data-grid';
import ProjectOverviewCard from '../../components/ProjectDetailsComponents/ProjectOverviewCard/ProjectOverviewCard';
import CurrentTask from '../../components/SharedComponents/CurrentTask/CurrentTask'; 
import TasksTable, { 
  renderPriorityCell, 
  renderActionsCell, 
  renderStatusCell,
  renderProgressCell
} from '../../components/SharedComponents/TasksTable/TasksTable'; 
import './ProjectDetails.css';

interface Task {
  id: string;
  name: string;
  estimatedTime: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState({
    id: projectId || '1',
    name: 'E-commerce Site Estimate',
    accuracy: 97,
    totalTasks: 14,
    timeSpent: 23,
    totalEstimatedTime: 43,
    currentTask: {
      id: 'task-1',
      name: 'Initial UI/UX Analysis',
      category: 'E-commerce',
      estimatedTime: '3/4 hrs',
      progress: 65,
      elapsedTime: '00:47:23'
    }
  });
  
 
  
 
  
 
  
 
  
 
  
  
  return (
    <div className="project-details-page">
      
    </div>
  );
};

export default ProjectDetails;