import React, { useState, useEffect, useCallback, useMemo } from "react";
import { GridColDef } from "@mui/x-data-grid";
import {
    renderStatusCell,
    renderProjectCell,
} from "../../components/SharedComponents/TasksTable/TableCellRenderers";
import CurrentTask from "../../components/SharedComponents/CurrentTask/CurrentTask";
import TaskFilters from "../../components/TasksComponents/TaskFilters/TaskFilters";
import TaskStats from "../../components/TasksComponents/TaskStats/TaskStats";
import TasksTable from "../../components/SharedComponents/TasksTable/TasksTable";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
    fetchTasks,
    updateTaskCell,
    selectAllTasks,
    selectLoadingTaskIds,
    selectCurrentTask,
} from "../../store/slices/tasksSlice";
import {
    selectActiveSession,
    selectElapsedTime,
    fetchActiveSession,
} from "../../store/slices/timeTrackingsSlice";
import { ProjectTask } from "../../services/projectsService";
import "./Tasks.css";
import { useNavigate } from "react-router-dom";

const getTaskProject = (task: ProjectTask): string => {
    if (task.project_id) {
        const taskAny = task as any;
        if (taskAny.project_name && typeof taskAny.project_name === "string") {
            return taskAny.project_name;
        }

        return `Project ${task.project_id}`;
    }
    return "Unknown Project";
};

const Tasks: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const tasks = useAppSelector(selectAllTasks);
    const loadingTaskIds = useAppSelector(selectLoadingTaskIds);
    const currentTaskData = useAppSelector(selectCurrentTask);
    const activeSession = useAppSelector(selectActiveSession);
    const elapsedTime = useAppSelector(selectElapsedTime);
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const [searchTerm, setSearchTerm] = useState("");
    const [projectFilter, setProjectFilter] = useState("All Projects");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [dueDateFilter, setDueDateFilter] = useState("Due Date");
    const [filteredTasks, setFilteredTasks] = useState<ProjectTask[]>(tasks);
    const [userProjects, setUserProjects] = useState<string[]>([]);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate("/auth");
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (tasks.length > 0) {
            const uniqueProjects = Array.from(
                new Set(tasks.map((task) => getTaskProject(task)))
            );
            setUserProjects(["All Projects", ...uniqueProjects]);
        }
    }, [tasks]);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchTasks("all" as any));
            dispatch(fetchActiveSession(Number(user.id)));
        }
    }, [dispatch, user]);

    useEffect(() => {
        let result = [...tasks];

        if (searchTerm) {
            result = result.filter(
                (task) =>
                    task.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    getTaskProject(task)
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (projectFilter !== "All Projects") {
            result = result.filter(
                (task) => getTaskProject(task) === projectFilter
            );
        }

        if (statusFilter !== "All Statuses") {
            result = result.filter((task) => task.status === statusFilter);
        }

        if (dueDateFilter === "Due Today") {
            const today = new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
            result = result.filter((task) => task.dueDate === today);
        }

        setFilteredTasks(result);
    }, [searchTerm, projectFilter, statusFilter, dueDateFilter, tasks]);

    const stats = useMemo(() => {
        const activeTasks = tasks.filter(
            (task) => task.status === "In Progress"
        ).length;

        const completedTasks = tasks.filter(
            (task) => task.status === "Completed"
        ).length;

        const today = new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });

        const dueToday = tasks.filter((task) => {
            if (!task.dueDate) return false;

            let taskDueDate: Date | null = null;

            if (typeof task.dueDate === "string") {
                const monthMatch = task.dueDate.match(
                    /^([A-Za-z]+)\s+(\d+)(?:st|nd|rd|th)?$/
                );
                if (monthMatch) {
                    const monthNames = [
                        "jan",
                        "feb",
                        "mar",
                        "apr",
                        "may",
                        "jun",
                        "jul",
                        "aug",
                        "sep",
                        "oct",
                        "nov",
                        "dec",
                    ];
                    const month = monthNames.findIndex(
                        (m) => m === monthMatch[1].toLowerCase().substring(0, 3)
                    );

                    if (month !== -1) {
                        const day = parseInt(monthMatch[2]);
                        const year = new Date().getFullYear();
                        taskDueDate = new Date(year, month, day);
                    }
                } else {
                    const date = new Date(task.dueDate);
                    if (!isNaN(date.getTime())) {
                        taskDueDate = date;
                    }
                }
            } else if (
                task.dueDate &&
                typeof task.dueDate === "object" &&
                "getTime" in task.dueDate
            ) {
                taskDueDate = task.dueDate as Date;
            }

            if (taskDueDate) {
                const formattedTaskDueDate = taskDueDate.toLocaleDateString(
                    "en-US",
                    {
                        month: "short",
                        day: "numeric",
                    }
                );
                return formattedTaskDueDate === today;
            }

            return false;
        }).length;

        return {
            activeTasks,
            completedTasks,
            dueToday,
            completedThisMonth: "this month",
        };
    }, [tasks]);

 
    const handleCellValueChange = (
        taskId: string | number,
        field: string,
        value: any
    ) => {
        const task = tasks.find((t) => t.id === taskId);
        if (task && task.project_id) {
            dispatch(
                updateTaskCell({
                    projectId: task.project_id,
                    taskId,
                    field,
                    value,
                })
            );
        }
    };

    const columns: GridColDef[] = [
        {
            field: "name",
            headerName: "TASK NAME",
            flex: 2.5,
            minWidth: 200,
            editable: true,
        },
        {
            field: "project",
            headerName: "PROJECT",
            flex: 1.5,
            minWidth: 150,
            editable: true,
            renderCell: (params) =>
                renderProjectCell({
                    ...params,
                    value: getTaskProject(params.row),
                }),
            valueGetter: (params) => getTaskProject(params.row),
        },
        {
            field: "estimatedTime",
            headerName: "ETC",
            flex: 1,
            minWidth: 100,
            editable: true,
        },
        {
            field: "dueDate",
            headerName: "DUE DATE",
            flex: 1,
            minWidth: 110,
            editable: true,
            type: "date",
            valueGetter: (params) => {
                if (!params.value) return null;

                try {
                    if (typeof params.value === "string") {
                        const date = new Date(params.value);
                        if (!isNaN(date.getTime())) {
                            return date;
                        }

                        const monthMatch = params.value.match(
                            /^([A-Za-z]+)\s+(\d+)(?:st|nd|rd|th)?$/
                        );
                        if (monthMatch) {
                            const monthNames = [
                                "jan",
                                "feb",
                                "mar",
                                "apr",
                                "may",
                                "jun",
                                "jul",
                                "aug",
                                "sep",
                                "oct",
                                "nov",
                                "dec",
                            ];
                            const month = monthNames.findIndex(
                                (m) =>
                                    m ===
                                    monthMatch[1].toLowerCase().substring(0, 3)
                            );

                            if (month !== -1) {
                                const day = parseInt(monthMatch[2]);
                                const year = new Date().getFullYear();
                                return new Date(year, month, day);
                            }
                        }
                    }

                    return null;
                } catch (e) {
                    console.error("Error parsing date:", e);
                    return null;
                }
            },
            valueFormatter: (params) => {
                if (!params.value) return "";

                try {
                    return params.value.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    });
                } catch (e) {
                    return String(params.value);
                }
            },
        },
        {
            field: "status",
            headerName: "STATUS",
            flex: 1,
            minWidth: 120,
            editable: true,
            type: "singleSelect",
            valueOptions: ["In Progress", "Completed", "Not Started"],
            renderCell: renderStatusCell,
        },
    ];

    const makeColumnsEditable = useCallback((cols: GridColDef[]) => {
        return cols.map((col) => {
            return {
                ...col,
                editable: [
                    "name",
                    "project",
                    "estimatedTime",
                    "dueDate",
                    "status",
                ].includes(col.field),
            };
        });
    }, []);

    const enhancedColumns = useMemo(
        () => makeColumnsEditable(columns),
        [columns, makeColumnsEditable]
    );

    const responsiveColumns = useMemo(() => {
        const width = window.innerWidth;

        return enhancedColumns.map((col) => {
            const baseConfig = {
                ...col,
                minWidth: col.minWidth,
                flex: col.flex,
            };

            if (width < 576) {
                if (col.field === "name") {
                    return { ...baseConfig, flex: 1.5, minWidth: 100 };
                } else if (col.field === "status") {
                    return { ...baseConfig, flex: 0.8, minWidth: 80 };
                } else if (col.field === "project") {
                    return { ...baseConfig, flex: 0.8, minWidth: 80 };
                } else if (col.field === "estimatedTime") {
                    return { ...baseConfig, flex: 0.6, minWidth: 60 };
                } else if (col.field === "dueDate") {
                    return { ...baseConfig, flex: 0.8, minWidth: 80 };
                }
            } else if (width < 768) {
                if (col.field === "name") {
                    return { ...baseConfig, flex: 1.5, minWidth: 120 };
                } else {
                    return { ...baseConfig, flex: 1, minWidth: 90 };
                }
            }

            return baseConfig;
        });
    }, [enhancedColumns]);

    useEffect(() => {
        const handleResize = () => {
            setFilteredTasks([...filteredTasks]);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [filteredTasks]);

    if (!isAuthenticated || !user) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="tasks-page">
            <h1 className="page-title">Tasks</h1>

            <TaskFilters
                searchTerm={searchTerm}
                projectFilter={projectFilter}
                statusFilter={statusFilter}
                dueDateFilter={dueDateFilter}
                onSearchChange={setSearchTerm}
                onProjectFilterChange={setProjectFilter}
                onStatusFilterChange={setStatusFilter}
                onDueDateFilterChange={setDueDateFilter}
                projectOptions={userProjects}
            />

            <TaskStats
                activeTasks={stats.activeTasks}
                completedTasks={stats.completedTasks}
                dueToday={stats.dueToday}
                completedThisMonth={stats.completedThisMonth}
            />

            <div className="current-task-wrapper">
                {currentTaskData && (
                    <CurrentTask
                        taskId={currentTaskData.id}
                        taskName={currentTaskData.name}
                        category={getTaskProject(currentTaskData)}
                        estimatedTime={currentTaskData.estimatedTime || "0 hrs"}
                        progress={currentTaskData.progress || 0}
                        elapsedTime={
                            elapsedTime
                                ? `${Math.floor(elapsedTime / 3600)
                                      .toString()
                                      .padStart(2, "0")}:${Math.floor(
                                      (elapsedTime % 3600) / 60
                                  )
                                      .toString()
                                      .padStart(2, "0")}:${(elapsedTime % 60)
                                      .toString()
                                      .padStart(2, "0")}`
                                : "00:00:00"
                        }
                        sessions={activeSession ? 1 : 0}
                        totalTime={
                            currentTaskData.hours_spent
                                ? `${currentTaskData.hours_spent}h total`
                                : "0h 0m total"
                        }
                        projectId={String(currentTaskData.project_id || "")}
                    />
                )}
            </div>

            <div className="responsive-table-container">
                <div className="tasks-table-container">
                    <TasksTable
                        tasks={filteredTasks}
                        columns={responsiveColumns}
                        onCellValueChange={handleCellValueChange}
                        loadingTaskIds={loadingTaskIds}
                        hideFooter={filteredTasks.length <= 10}
                        editableFields={[]}
                        disableEditing={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default Tasks;
