import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUsers,
    faProjectDiagram,
    faTasks,
    faClock,
    faArrowUp,
    faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import {
    AnalyticsOverview,
    ChartDataPoint,
} from "../../../services/adminService";

interface SummaryCardsProps {
    overview: AnalyticsOverview | null;
    userChange: [number, boolean];
    taskChange: [number, boolean];
    timeTrackingData: ChartDataPoint[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
    overview,
    taskChange,
    timeTrackingData,
}) => {
    return (
        <div className="analytics-summary">
            <div className="analytics-card summary-card">
                <div className="summary-icon users-icon">
                    <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="summary-content">
                    <h3>Total Users</h3>
                    <p className="summary-value">
                        {overview?.users.total || 0}
                    </p>
                </div>
            </div>

            <div className="analytics-card summary-card">
                <div className="summary-icon projects-icon">
                    <FontAwesomeIcon icon={faProjectDiagram} />
                </div>
                <div className="summary-content">
                    <h3>Active Projects</h3>
                    <p className="summary-value">
                        {overview?.projects.active || 0}
                    </p>
                </div>
            </div>

            <div className="analytics-card summary-card">
                <div className="summary-icon tasks-icon">
                    <FontAwesomeIcon icon={faTasks} />
                </div>
                <div className="summary-content">
                    <h3>Completed Tasks</h3>
                    <p className="summary-value">
                        {overview?.tasks.completed || 0}
                    </p>
                    <p
                        className={`summary-trend ${
                            taskChange[1] ? "positive" : "negative"
                        }`}
                    >
                        <FontAwesomeIcon
                            icon={taskChange[1] ? faArrowUp : faArrowDown}
                        />{" "}
                        {taskChange[0]}% this month
                    </p>
                </div>
            </div>

            <div className="analytics-card summary-card">
                <div className="summary-icon time-icon">
                    <FontAwesomeIcon icon={faClock} />
                </div>
                <div className="summary-content">
                    <h3>Hours Tracked</h3>
                    <p className="summary-value">
                        {timeTrackingData.reduce(
                            (sum, item) => sum + item.value,
                            0
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SummaryCards;
