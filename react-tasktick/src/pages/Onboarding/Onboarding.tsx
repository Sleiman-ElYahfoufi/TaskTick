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
      <div className="onboarding-content">
        <div className="onboarding-left">
          <div className="onboarding-header">
            <img src={TaskTickLogo} alt="TaskTick" className="logo" />
            <h2>Tell us about yourself</h2>
            <p>Help us personalize your time estimates</p>
          </div>

          <form onSubmit={handleSubmit} className="onboarding-form">
            <div className="form-group">
              <label>I am a...</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-select"
              >
                <option value="">Select your role</option>
                <option value="Web Developer">Web Developer</option>
                <option value="Mobile Developer">Mobile Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
              </select>
            </div>

                   </form>
        
        </div>

       
      </div>
    </div>
  );
};

export default Onboarding;