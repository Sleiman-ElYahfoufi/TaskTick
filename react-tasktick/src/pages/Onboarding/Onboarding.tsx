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

  const experienceLevels: ExperienceLevel[] = [
    { label: 'Beginner', years: 'Less than 1 year of experience' },
    { label: 'Intermediate', years: '1-3 years of experience' },
    { label: 'Expert', years: '3+ years of experience' }
  ];

  const techOptions = [
    'JavaScript', 'Java', 'Python', 'Python',
    'Python', 'Python', 'Python', 'Python'
  ];

  const handleTechnologyToggle = (tech: string) => {
    setTechnologies(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ role, experience, technologies });
  };

  return (
    <div className="onboarding-container">
      
    </div>
  );
};

export default Onboarding;