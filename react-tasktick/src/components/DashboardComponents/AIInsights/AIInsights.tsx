import React from 'react';
import './AIInsights.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Insight {
  id: string;
  text: string;
}

interface AIInsightsProps {
  insights: Insight[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ insights }) => {
  return (
    <div className="ai-insights">
     
    </div>
  );
};

export default AIInsights;