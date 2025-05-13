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
      
      
    </div>
  );
};

export default TaskStats;