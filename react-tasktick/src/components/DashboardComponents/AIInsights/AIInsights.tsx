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
      <h2>AI Insights</h2>
      
      <div className="insights-list">
        {insights.map(insight => (
          <div key={insight.id} className="insight-item">
            <div className="insight-icon">
              <CheckCircleIcon fontSize="small" />
            </div>
            <div className="insight-text">
              {insight.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;