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
        
      
              
             
      </div>
    </div>
  );
};

export default AddProject;