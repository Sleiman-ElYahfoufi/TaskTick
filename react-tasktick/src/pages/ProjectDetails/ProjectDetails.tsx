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



const ProjectDetails: React.FC = () => {
  
  return (
    <div className="project-details-page">
      
    </div>
  );
};

export default ProjectDetails;