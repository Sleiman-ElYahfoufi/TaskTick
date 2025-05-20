import React from "react";
import { useNavigate } from "react-router-dom";
import "./ActiveProjects.css";

interface Project {
    id: string;
    name: string;
    hours: string;
    status: string;
    progress: number;
    completedTasks?: number;
    totalTasks?: number;
}

interface ActiveProjectsProps {
    projects: Project[];
    onAddProject: () => void;
}

const ActiveProjects: React.FC<ActiveProjectsProps> = ({
    projects,
    onAddProject,
}) => {
    const navigate = useNavigate();

    const handleProjectClick = (projectId: string) => {
        navigate(`/dashboard/projects/${projectId}`);
    };

    return (
        <div className="active-projects-section">
            <div className="section-header">
                <h2>Active Projects</h2>
                <button className="add-project-btn" onClick={onAddProject}>
                    Add Project
                </button>
            </div>

            <div className="active-projects-list">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="project-card"
                        onClick={() => handleProjectClick(project.id)}
                    >
                        <div className="active-projects-info">
                            <h3 className="active-projects-name">
                                {project.name}
                            </h3>
                            <div className="project-meta">
                                <span className="project-hours">
                                    {project.hours} hours
                                </span>
                                <span
                                    className={`active-projects-status status-badge ${project.status
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                >
                                    In Progress
                                </span>
                            </div>
                            <div className="project-tasks-count">
                                <span className="tasks-count">
                                    {project.completedTasks || 0}/
                                    {project.totalTasks || 0} tasks completed
                                </span>
                            </div>
                        </div>
                        <div className="progress-track">
                            <div
                                className="progress-bar"
                                style={{ width: `${project.progress}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveProjects;
