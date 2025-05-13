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
    console.log({ username, email, password, role, experience, technologies });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      
      <div className="settings-card">
        <div className="profile-settings-header">
          <h2>Profile Settings</h2>
          <p>Manage your account information and preferences</p>
        </div>

        
          
            <h3>Personal Information</h3>
            
            <div className="settings-form-row">
              <div className="settings-left-column">
                <div className="settings-form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="settings-form-input"
                  />
                </div>
                
                <div className="settings-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="settings-form-input"
                  />
                </div>

               
                    

               

              
                      
                  </div>
                </div>
              </div>
            </div>

          
            </div>
          </div>

          <div className="settings-actions">
            <button type="submit" className="settings-save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;