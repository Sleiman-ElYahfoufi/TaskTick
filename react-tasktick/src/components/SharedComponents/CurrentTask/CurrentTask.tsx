import React, { useState, useEffect, useRef } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
    pauseSession,
    resumeSession,
    endSession,
    updateElapsedTime,
    selectActiveSession,
    selectTimerRunning,
    selectElapsedTime,
    updateSessionHeartbeat,
    fetchTaskTimeSummary,
    fetchTaskTimeTrackings,
} from "../../../store/slices/timeTrackingsSlice";
import { updateTask, selectAllTasks } from "../../../store/slices/tasksSlice";
import "./CurrentTask.css";

interface CurrentTaskProps {
    taskId?: number | string;
    taskName: string;
    category: string;
    estimatedTime: string;
    progress: number;
    elapsedTime?: string;
    sessions?: number;
    totalTime?: string;
    projectId?: string;
}

const CurrentTask: React.FC<CurrentTaskProps> = ({
    taskId,
    taskName,
    category,
    estimatedTime,
    progress,
    elapsedTime: providedElapsedTime,
    sessions = 0,
    totalTime = "0h 0m",
    projectId,
}) => {
    const dispatch = useAppDispatch();
    const activeSession = useAppSelector(selectActiveSession);
    const timerRunning = useAppSelector(selectTimerRunning);
    const elapsedTimeSeconds = useAppSelector(selectElapsedTime);
    const tasks = useAppSelector(selectAllTasks);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const initialHeartbeatSentRef = useRef<boolean>(false);

    const [displayTime, setDisplayTime] = useState(
        providedElapsedTime || "00:00:00"
    );

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return [hours, minutes, secs]
            .map((v) => v.toString().padStart(2, "0"))
            .join(":");
    };

    useEffect(() => {
        if (activeSession) {
            setDisplayTime(formatTime(elapsedTimeSeconds));
        } else if (providedElapsedTime) {
            setDisplayTime(providedElapsedTime);
        }
    }, [elapsedTimeSeconds, providedElapsedTime, activeSession]);

    useEffect(() => {
        if (timerRunning) {
            timerRef.current = setInterval(() => {
                dispatch(updateElapsedTime());
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [timerRunning, dispatch]);

    useEffect(() => {
        if (activeSession) {
            if (heartbeatRef.current) {
                clearInterval(heartbeatRef.current);
                heartbeatRef.current = null;
            }

            const intervalTime = timerRunning ? 30000 : 120000;
            
                `[CurrentTask] Setting up heartbeat at ${intervalTime}ms interval for ${
                    timerRunning ? "active" : "paused"
                } session`
            );

            heartbeatRef.current = setInterval(() => {
                
                    `[CurrentTask] Sending heartbeat for session ${activeSession.id}`
                );
                dispatch(updateSessionHeartbeat(activeSession.id));
            }, intervalTime);

            if (!initialHeartbeatSentRef.current) {
                
                    `[CurrentTask] Sending initial heartbeat for session ${activeSession.id}`
                );
                dispatch(updateSessionHeartbeat(activeSession.id));
                initialHeartbeatSentRef.current = true;
            }
        } else {
            if (heartbeatRef.current) {
                clearInterval(heartbeatRef.current);
                heartbeatRef.current = null;
            }

            initialHeartbeatSentRef.current = false;
        }

        return () => {
            if (heartbeatRef.current) {
                clearInterval(heartbeatRef.current);
                heartbeatRef.current = null;
            }
        };
    }, [activeSession, timerRunning, dispatch]);

    const handlePlayPause = () => {
        if (!activeSession) {
            
            return;
        }

        
            `[CurrentTask] handlePlayPause - ${
                timerRunning ? "Pausing" : "Resuming"
            } session ${activeSession.id}`
        );
        if (timerRunning) {
            dispatch(pauseSession(activeSession.id));
        } else {
            dispatch(resumeSession(activeSession.id));
        }
    };

    const handleStop = () => {
        if (!activeSession) {
            
            return;
        }

        const stoppedTaskId = activeSession.task_id;
        const currentTask = tasks.find(
            (task) => String(task.id) === String(taskId)
        );

        if (!currentTask && taskId) {
            
            return;
        }

        
            `[CurrentTask] handleStop - Stopping session ${activeSession.id} for task ${stoppedTaskId}`
        );

        dispatch(endSession(activeSession.id)).then(() => {
            
                `[CurrentTask] handleStop - Session stopped, refreshing time data for task ${stoppedTaskId}`
            );

            dispatch(fetchTaskTimeSummary(stoppedTaskId));
            dispatch(fetchTaskTimeTrackings(stoppedTaskId));

            if (taskId && projectId && currentTask) {
                
                    `[CurrentTask] handleStop - Updating task ${taskId} status to Completed while preserving other fields`
                );

                const taskData = {
                    ...currentTask,
                    status: "Completed",
                };

                dispatch(
                    updateTask({
                        projectId,
                        taskId,
                        taskData,
                    })
                );
            }
        });
    };

    return (
        <div className="current-task-section">
            <div className="current-task-content">
                <div className="current-task-info">
                    <div className="task-header">
                        <h3 className="current-task-title">Current Task</h3>
                        <span className="task-name">{taskName}</span>
                        <div className="control-buttons">
                            <button
                                className={`control-button ${
                                    !activeSession ? "disabled" : ""
                                }`}
                                onClick={handlePlayPause}
                                title={timerRunning ? "Pause" : "Play"}
                                disabled={!activeSession}
                            >
                                {timerRunning ? (
                                    <PauseIcon fontSize="small" />
                                ) : (
                                    <PlayArrowIcon fontSize="small" />
                                )}
                            </button>
                            <button
                                className={`control-button stop ${
                                    !activeSession ? "disabled" : ""
                                }`}
                                onClick={handleStop}
                                title="Stop"
                                disabled={!activeSession}
                            >
                                <StopIcon fontSize="small" />
                            </button>
                        </div>
                    </div>

                    <div className="category-badge">{category}</div>

                    <div className="task-details">
                        <div className="time-info">
                            <div className="estimated-time">
                                <span className="info-label">Est. Time</span>
                                <span className="info-value">
                                    {estimatedTime}
                                </span>
                            </div>

                            <div className="progress-info">
                                <span className="info-label">Progress</span>
                                <span className="info-value">
                                    {progress}% of estimated time
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="timer-container">
                    <div className="sessions-info">
                        <span className="sessions-count">
                            {sessions} sessions
                        </span>
                        <span className="total-time">{totalTime}</span>
                    </div>

                    <div className="timer-controls">
                        <div
                            className={`timer-display ${
                                timerRunning ? "active" : ""
                            }`}
                        >
                            {displayTime}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentTask;
