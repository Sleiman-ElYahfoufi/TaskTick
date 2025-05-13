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
    
    
    
  };
  
  return (
    <div className="add-project-container">
      
    </div>
  );
};

export default AddProject;