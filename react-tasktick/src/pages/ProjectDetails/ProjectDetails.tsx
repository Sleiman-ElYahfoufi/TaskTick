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
  
 
  
 
  
 
  
 
  
 
  
  
  return (
    <div className="project-details-page">
      
    </div>
  );
};

export default ProjectDetails;