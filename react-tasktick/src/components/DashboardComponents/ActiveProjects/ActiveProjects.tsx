import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ActiveProjects.css';




const ActiveProjects: React.FC = ({  }) => {
  const navigate = useNavigate();

 

  return (
    <div className="active-projects-section">
      <div className="section-header">
        <h2>Active Projects</h2>
       
    </div>
  );
};

export default ActiveProjects;