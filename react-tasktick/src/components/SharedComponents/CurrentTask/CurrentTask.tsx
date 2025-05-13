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
     
    </div>
  );
};

export default CurrentTask;