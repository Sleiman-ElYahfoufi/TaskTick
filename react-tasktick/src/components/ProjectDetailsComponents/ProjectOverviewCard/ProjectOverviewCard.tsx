import React from "react";
import "./ProjectOverviewCard.css";

interface ProjectOverviewCardProps {
    name: string;
    completedTasks: number;
    totalTasks: number;
    timeSpent: number;
    totalEstimatedTime: number;
    compact?: boolean;
}

const ProjectOverviewCard: React.FC<ProjectOverviewCardProps> = ({
    name,
    completedTasks,
    totalTasks,
    timeSpent,
    totalEstimatedTime,
    compact = false,
}) => {
    return (
        <div className={`project-overview-card ${compact ? "compact" : ""}`}>
            <div className="project-overview-content">
                <div className="project-overview-header">
                    <h2 className="project-overview-project-name">{name}</h2>
                </div>

                <div className="project-overview-stats">
                    <div className="project-stat">
                        <span className="project-overview-stat-label">
                            Tasks
                        </span>
                        <span className="project-overview-stat-value">
                            {completedTasks}/{totalTasks} tasks
                        </span>
                    </div>

                    <div className="project-stat">
                        <span className="project-overview-stat-label">
                            Time Taken
                        </span>
                        <span className="project-overview-stat-value">
                            {timeSpent}/{totalEstimatedTime} hr
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectOverviewCard;
