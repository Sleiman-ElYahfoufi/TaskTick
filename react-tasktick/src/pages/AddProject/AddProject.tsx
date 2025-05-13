import React, { useState } from 'react';
import StepIndicator from '../../components/AddProjectComponents/StepIndicator/StepIndicator';
import './AddProject.css';

const AddProject: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('High');
  
  const handleGenerateTasks = () => {
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }
    
    setCurrentStep(2);
    
    console.log('Generating tasks for:', {
      projectName,
      projectDescription,
      deadline,
      priority
    });
  };
  
  return (
    <div className="add-project-container">
      <h1 className="add-project-title">Add New Project</h1>
      
      <div className="add-project-content">
        <StepIndicator 
          steps={[
            { number: 1, label: 'Project Details' },
            { number: 2, label: 'Generated Tasks' }
          ]}
          currentStep={currentStep}
        />
        
        {currentStep === 1 ? (
          <div className="project-details-form">
            <h2 className="form-section-title">Project Details</h2>
            
            <div className="form-group">
              <label htmlFor="projectName">Project Name</label>
              <input
                type="text"
                id="projectName"
                className="form-control"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="projectDescription">Project Description</label>
              <textarea
                id="projectDescription"
                className="form-control"
                rows={5}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe your project..."
              />
            </div>
            
            <div className="form-options">
              <div className="form-option">
                <label>Deadline</label>
                <input
                  type="date"
                  className="form-control date-input"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              
              <div className="form-option">
                <label>Details</label>
                <select 
                  className="form-control select-input"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                className="generate-tasks-btn"
                onClick={handleGenerateTasks}
              >
                Generate Tasks
              </button>
            </div>
          </div>
        ) : (
          <div className="generated-tasks">
            
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProject;