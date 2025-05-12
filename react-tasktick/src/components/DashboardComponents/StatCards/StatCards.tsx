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
      
      <div className="stat-card tasks-completed">
        <h3>Tasks Completed</h3>
        <div className="stat-value">{tasksCompleted}</div>
        <div className="stat-period">{completedMonth}</div>
      </div>
      
      <div className="stat-card due-today">
        <h3>Due Today</h3>
        <div className="stat-value">{dueToday}</div>
      </div>
    </div>
  );
};

export default StatCards;