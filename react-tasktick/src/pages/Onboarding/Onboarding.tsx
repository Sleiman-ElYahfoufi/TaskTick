import React, { useState } from 'react';
import './Onboarding.css';
import TaskTickLogo from '../../assets/Sleiman_ElYahfoufi_TaskTick.png';
import OnboardingImage from '../../assets/OnboardingImage.png';

interface ExperienceLevel {
  label: string;
  years: string;
}

const Onboarding: React.FC = () => {
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);

  

  return (
    <div className="onboarding-container">
      
    </div>
  );
};

export default Onboarding;