import React, { useState } from "react";
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
    onUpdateProject?: (
        id: string,
        updatedData: {
            title: string;
            description: string;
            deadline?: string | null;
        }
    ) => void;
    onDeleteProject?: (id: string) => void;
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
    onUpdateProject,
    onDeleteProject,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedDescription, setEditedDescription] = useState(description);
    const [editedDeadline, setEditedDeadline] = useState(deadline || "");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

    const handleToggleEdit = () => {
        if (isEditing) {
            // Reset form values if canceling
            setEditedTitle(title);
            setEditedDescription(description);
            setEditedDeadline(deadline || "");
        }
        setIsEditing(!isEditing);
        // Hide delete confirmation if it was showing
        setShowDeleteConfirm(false);
    };

    const handleSave = () => {
        if (onUpdateProject) {
            const updatedData = {
                title: editedTitle,
                description: editedDescription,
                deadline: editedDeadline || null,
            };
            onUpdateProject(id, updatedData);
        }
        setIsEditing(false);
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        if (onDeleteProject) {
            onDeleteProject(id);
        }
        setShowDeleteConfirm(false);
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
    };

    const getFormattedDeadlineForInput = () => {
        if (!editedDeadline) return "";
        try {
            const date = new Date(editedDeadline);
            return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
        } catch (e) {
            return "";
        }
    };

    return (
        <div className={`project-card ${status}`}>
            <div className="project-content">
                {isEditing ? (
                    <div className="project-edit-mode">
                        <input
                            type="text"
                            className="edit-title-input"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            placeholder="Project Title"
                        />
                        <textarea
                            className="edit-description-input"
                            value={editedDescription}
                            onChange={(e) =>
                                setEditedDescription(e.target.value)
                            }
                            placeholder="Project Description"
                            rows={3}
                        />
                        <div className="edit-deadline">
                            <label>Deadline:</label>
                            <input
                                type="date"
                                className="edit-deadline-input"
                                value={getFormattedDeadlineForInput()}
                                onChange={(e) =>
                                    setEditedDeadline(e.target.value)
                                }
                            />
                        </div>
                        <div className="edit-buttons">
                            <button
                                className="project-card-save-btn"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={handleToggleEdit}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : showDeleteConfirm ? (
                    <div className="delete-confirmation">
                        <p>Are you sure you want to delete this project?</p>
                        <p className="warning-text">
                            This action cannot be undone.
                        </p>
                        <div className="confirmation-buttons">
                            <button
                                className="confirm-delete-btn"
                                onClick={handleDeleteConfirm}
                            >
                                Yes, Delete
                            </button>
                            <button
                                className="cancel-delete-btn"
                                onClick={handleDeleteCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="project-header">
                            <h3 className="project-title">{title}</h3>
                            <div className="project-actions">
                                <button
                                    className="edit-project-btn"
                                    onClick={handleToggleEdit}
                                >
                                    Edit
                                </button>
                                {onDeleteProject && (
                                    <button
                                        className="delete-project-btn"
                                        onClick={handleDeleteClick}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="project-description">{description}</p>
                    </>
                )}
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

                            {!isEditing && deadline && (
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
