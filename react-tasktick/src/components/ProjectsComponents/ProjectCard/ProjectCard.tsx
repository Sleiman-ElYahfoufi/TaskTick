import React from "react";
import "./ProjectCard.css";

export type ProjectStatus =
    | "in-progress"
    | "planning"
    | "delayed"
    | "completed";

interface ProjectCardProps {
    id: string;
    title: string;
    description: string;
    status: ProjectStatus;
    estimatedHours: string;
    tasksCompleted: number;
    totalTasks: number;
    lastUpdatedDate: string;
    lastUpdatedTime: string;
    deadline?: string | null;
    onViewDetails?: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    id,
    title,
    description,
    status,
    estimatedHours,
    tasksCompleted,
    totalTasks,
    lastUpdatedDate,
    lastUpdatedTime,
    deadline,
    onViewDetails,
}) => {
    const statusConfig = {
        "in-progress": { text: "In Progress", color: "blue" },
        planning: { text: "Planning", color: "yellow" },
        delayed: { text: "Delayed", color: "red" },
        completed: { text: "Completed", color: "green" },
    };

    const currentStatus = statusConfig[status];

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(id);
        }
    };

    const formatDeadline = (deadlineStr?: string) => {
        if (!deadlineStr) return "";
        const date = new Date(deadlineStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className={`project-card ${status}`}>
            <div className="project-content">
                <h3 className="project-title">{title}</h3>
                <p className="project-description">{description}</p>

                <div className="project-details">
                    <div className="project-status-section">
                        <span className={`status-badge ${status}`}>
                            {currentStatus.text}
                        </span>

                        <div className="project-metrics">
                            <div className="metric">
                                <span className="metric-label">
                                    {status === "completed"
                                        ? "Total Time"
                                        : "Est. Time"}
                                </span>
                                <span className="metric-value">
                                    {estimatedHours}
                                </span>
                            </div>

                            <div className="metric">
                                <span className="metric-label">Tasks</span>
                                <span className="metric-value">
                                    {tasksCompleted}/{totalTasks}
                                </span>
                            </div>

                            {deadline && (
                                <div className="metric">
                                    <span className="metric-label">
                                        Deadline
                                    </span>
                                    <span className="metric-value">
                                        {formatDeadline(deadline)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="project-info-right">
                        <div className="last-updated">
                            <span className="update-label">Last Updated</span>
                            <span className="update-value">
                                {lastUpdatedDate}, {lastUpdatedTime}
                            </span>
                        </div>

                        <button
                            className="view-details-btn"
                            onClick={handleViewDetails}
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
