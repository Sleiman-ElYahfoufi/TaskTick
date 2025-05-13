import React from 'react';
import './StepIndicator.css';

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="step-indicator">
     
    </div>
  );
};

export default StepIndicator;