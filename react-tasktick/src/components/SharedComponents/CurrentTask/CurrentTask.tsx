import React, { useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import './CurrentTask.css';

interface CurrentTaskProps {
  taskName: string;
  category: string;
  estimatedTime: string;
  progress: number;
  elapsedTime: string;
  sessions?: number;
  totalTime?: string;
}

const CurrentTask: React.FC<CurrentTaskProps> = ({
  taskName,
  category,
  estimatedTime,
  progress,
  elapsedTime,
  sessions = 4,
  totalTime = '2h 15m total'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleStop = () => {
    setIsPlaying(false);
  };
  
  return (
    <div className="current-task-section">
      <div className="current-task-content">
        <div className="current-task-info">
            <div className="task-header">
              <h3 className="current-task-title">Current Task</h3>
              <span className="task-name">{taskName}</span>
              <div className="control-buttons">
                <button 
                  className="control-button" 
                  onClick={handlePlayPause}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                </button>
                <button 
                  className="control-button stop" 
                  onClick={handleStop}
                  title="Stop"
                >
                  <StopIcon fontSize="small" />
                </button>
              </div>
            </div>
          
          <div className="category-badge">{category}</div>
          
          <div className="task-details">
            <div className="time-info">
              <div className="estimated-time">
                <span className="info-label">Est. Time</span>
                <span className="info-value">{estimatedTime}</span>
              </div>
              
              
            </div>
          </div>
        </div>
        
       
          
         
        </div>
      </div>
    </div>
  );
};

export default CurrentTask;