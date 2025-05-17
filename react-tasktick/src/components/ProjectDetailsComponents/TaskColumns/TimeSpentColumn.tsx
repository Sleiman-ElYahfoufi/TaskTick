import React, { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
    fetchTaskTimeSummary,
    selectTaskSummary,
    selectActiveSession,
} from "../../../store/slices/timeTrackingsSlice";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import timeTrackingService from "../../../services/timeTrackingService";
import "./TaskColumn.css";
import { toast } from "react-hot-toast";

interface TimeSpentColumnProps {
    taskId: number | string;
    onTimeClick: (taskId: number | string) => void;
    onStartTrackingClick: (taskId: number | string) => void;
}

const TimeSpentColumn: React.FC<TimeSpentColumnProps> = ({
    taskId,
    onTimeClick,
    onStartTrackingClick,
}) => {
    const dispatch = useAppDispatch();
    const numberTaskId =
        typeof taskId === "string" ? parseInt(taskId, 10) : taskId;
    const taskSummary = useAppSelector(selectTaskSummary(numberTaskId));
    const activeSession = useAppSelector(selectActiveSession);
    const isSessionActive = !!activeSession;

    useEffect(() => {
        dispatch(fetchTaskTimeSummary(numberTaskId));
    }, [dispatch, numberTaskId]);

    const handleClick = () => {
        if (isSessionActive) {
            toast.error(
                "Time tracking is disabled while a session is active. End the current session first."
            );
            return;
        }
        onTimeClick(taskId);
    };

    const handleStartTracking = (e: React.MouseEvent) => {
        if (isSessionActive) {
            e.stopPropagation();

            toast.error(
                "Cannot start a new timer while another session is active. End the current session first."
            );
            return;
        }
        console.log("handleStartTracking in taskcolumns");
        e.stopPropagation();
        onStartTrackingClick(taskId);
    };

    if (!taskSummary) {
        return (
            <div className="task-column time-spent-column">
                <CircularProgress size={16} />
            </div>
        );
    }

    const formattedTime = timeTrackingService.formatTime(
        taskSummary.total_duration_hours || 0
    );
    const sessionCount = taskSummary.session_count || 0;

    return (
        <div
            className={`task-column time-spent-column ${
                isSessionActive ? "session-active-disabled" : ""
            }`}
            onClick={handleClick}
            title={
                isSessionActive
                    ? "Time tracking actions disabled while a session is active"
                    : "View time tracking details"
            }
        >
            <div className="time-spent-content">
                <div className="time-spent-info">
                    <span className="time-spent-value">{formattedTime}</span>
                    <span className="time-spent-sessions">
                        {sessionCount}{" "}
                        {sessionCount === 1 ? "session" : "sessions"}
                    </span>
                </div>
                <div className="time-spent-actions">
                    <PlayCircleOutlineIcon
                        className={`start-tracking-icon ${
                            isSessionActive ? "disabled" : ""
                        }`}
                        onClick={handleStartTracking}
                        fontSize="small"
                    />
                </div>
            </div>
        </div>
    );
};

export default TimeSpentColumn;
