import React from 'react';
import './StatCards.css';

interface StatCardsProps {
  activeProjects: number;
  tasksCompleted: number;
  dueToday: number;
  completedMonth?: string;
}

const StatCards: React.FC<StatCardsProps> = ({ 
  activeProjects, 
  tasksCompleted, 
  dueToday, 
  completedMonth = 'this month' 
}) => {
  return (
    <div className="stat-cards">
      <div className="stat-card active-projects">
        <h3>Active Projects</h3>
        <div className="stat-value">{activeProjects}</div>
      </div>
      
      
    </div>
  );
};

export default StatCards;