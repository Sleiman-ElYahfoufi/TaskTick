import React from 'react';
import './TaskStats.css';

interface TaskStatsProps {
  activeTasks: number;
  completedTasks: number;
  dueToday: number;
  completedThisMonth?: string;
}

const TaskStats: React.FC<TaskStatsProps> = ({
  activeTasks,
  completedTasks,
  dueToday,
  completedThisMonth = 'this month'
}) => {
  return (
    <div className="task-stats">
      <div className="stat-card active">
        <div className="stat-number">{activeTasks}</div>
        <div className="stat-label">Active Tasks</div>
      </div>
      
      <div className="stat-card completed">
        <div className="stat-number">{completedTasks}</div>
        <div className="stat-label">Tasks Completed</div>
        <div className="stat-sublabel">{completedThisMonth}</div>
      </div>
      
      <div className="stat-card due-today">
        <div className="stat-number">{dueToday}</div>
        <div className="stat-label">Due Today</div>
      </div>
    </div>
  );
};

export default TaskStats;