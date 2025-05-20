import React from "react";
import { AnalyticsOverview } from "../../../services/adminService";

interface DetailsGridProps {
    overview: AnalyticsOverview | null;
}

const DetailsGrid: React.FC<DetailsGridProps> = ({ overview }) => {
    return (
        <div className="analytics-grid">
            <div className="analytics-card">
                <h2>User Statistics</h2>
                <div className="analytics-stat">
                    <span className="stat-value">
                        {overview?.users.total || 0}
                    </span>
                    <span className="stat-label">Total Users</span>
                </div>
                <div className="analytics-stat">
                    <span className="stat-value">
                        {overview?.users.activeLastWeek || 0}
                    </span>
                    <span className="stat-label">
                        Active Users (Last 7 Days)
                    </span>
                </div>
                <div className="analytics-stat">
                    <span className="stat-value">
                        {overview?.users.newLastMonth || 0}
                    </span>
                    <span className="stat-label">New Users (Last 30 Days)</span>
                </div>
            </div>

            <div className="analytics-card">
                <h2>Project Statistics</h2>
                <div className="analytics-stat">
                    <span className="stat-value">
                        {overview?.projects.total || 0}
                    </span>
                    <span className="stat-label">Total Projects</span>
                </div>
                <div className="analytics-stat">
                    <span className="stat-value">
                        {overview?.projects.active || 0}
                    </span>
                    <span className="stat-label">Active Projects</span>
                </div>
                <div className="analytics-stat">
                    <span className="stat-value">
                        {overview?.projects.completed || 0}
                    </span>
                    <span className="stat-label">Completed Projects</span>
                </div>
            </div>

            <div className="analytics-card">
                <h2>Task Overview</h2>
                <div className="analytics-stat">
                    <span className="stat-value">
                        {overview?.tasks.total || 0}
                    </span>
                    <span className="stat-label">Total Tasks</span>
                </div>
                <div className="analytics-stat">
                    <span className="stat-value">
                        {overview?.tasks.completed || 0}
                    </span>
                    <span className="stat-label">Completed Tasks</span>
                </div>
                <div className="analytics-stat">
                    <span className="stat-value">
                        {(overview?.tasks.todo || 0) +
                            (overview?.tasks.inProgress || 0)}
                    </span>
                    <span className="stat-label">Pending Tasks</span>
                </div>
            </div>
        </div>
    );
};

export default DetailsGrid;
