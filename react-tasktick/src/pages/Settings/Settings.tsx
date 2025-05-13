import React, { useState } from 'react';
import './Settings.css';

interface ExperienceLevel {
  label: string;
  years: string;
}

const Settings: React.FC = () => {
  const [username, setUsername] = useState('johndadev');
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState('Web Developer');
  const [experience, setExperience] = useState('Beginner');
  const [technologies, setTechnologies] = useState<string[]>(['JavaScript', 'Java', 'Python']);
  const [showPassword, setShowPassword] = useState(false);

  const experienceLevels: ExperienceLevel[] = [
    { label: 'Beginner', years: 'Less than 1 year of experience' },
    { label: 'Intermediate', years: '1-3 years of experience' },
    { label: 'Expert', years: '3+ years of experience' }
  ];





  return (
    <div className="settings-container">
    </div>
  );
};

export default Settings;