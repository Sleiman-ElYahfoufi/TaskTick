import React, { useState, useEffect, useCallback, useMemo } from "react";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import {
    renderActionsCell,
    renderStatusCell,
    renderProjectCell,
} from "../../components/SharedComponents/TasksTable/TableCellRenderers";
import CurrentTask from "../../components/SharedComponents/CurrentTask/CurrentTask";
import TaskFilters from "../../components/TasksComponents/TaskFilters/TaskFilters";
import TaskStats from "../../components/TasksComponents/TaskStats/TaskStats";
import "./Tasks.css";

interface Task {
    id: string;
    name: string;
    project: string;
    estimatedTime: string;
    dueDate: string;
    priority: "High" | "Medium" | "Low";
    progress: number;
    status: "In Progress" | "Completed" | "Not Started";
}

const Tasks: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [projectFilter, setProjectFilter] = useState("All Projects");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [dueDateFilter, setDueDateFilter] = useState("Due Date");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

    const currentTask = {
        name: "Initial UI/UX Analysis",
        category: "E-commerce",
        estimatedTime: "3/4 hrs",
        progress: 65,
        elapsedTime: "00:47:23",
        sessions: 4,
        totalTime: "2h 15m total",
    };

    const stats = {
        activeTasks: 7,
        completedTasks: 28,
        dueToday: 2,
        completedThisMonth: "this month",
    };

    useEffect(() => {
        const mockTasks: Task[] = [
            {
                id: "1",
                name: "Initial UI/UX Analysis",
                project: "E-commerce Site",
                estimatedTime: "3/4 hrs",
                dueDate: "May 8th",
                priority: "High",
                progress: 50,
                status: "In Progress",
            },
            {
                id: "2",
                name: "Initial UI/UX Analysis",
                project: "E-commerce Site",
                estimatedTime: "3/4 hrs",
                dueDate: "May 8th",
                priority: "High",
                progress: 50,
                status: "In Progress",
            },
            {
                id: "3",
                name: "Initial UI/UX Analysis",
                project: "E-commerce Site",
                estimatedTime: "3/4 hrs",
                dueDate: "May 8th",
                priority: "High",
                progress: 50,
                status: "In Progress",
            },
            {
                id: "4",
                name: "Initial UI/UX Analysis",
                project: "E-commerce Site",
                estimatedTime: "3/4 hrs",
                dueDate: "May 8th",
                priority: "High",
                progress: 50,
                status: "In Progress",
            },
            {
                id: "5",
                name: "Initial UI/UX Analysis",
                project: "E-commerce Site",
                estimatedTime: "3/4 hrs",
                dueDate: "May 8th",
                priority: "High",
                progress: 50,
                status: "In Progress",
            },
            {
                id: "6",
                name: "Initial UI/UX Analysis",
                project: "E-commerce Site",
                estimatedTime: "3/4 hrs",
                dueDate: "May 8th",
                priority: "High",
                progress: 50,
                status: "In Progress",
            },
            {
                id: "7",
                name: "Initial UI/UX Analysis",
                project: "E-commerce Site",
                estimatedTime: "3/4 hrs",
                dueDate: "May 8th",
                priority: "High",
                progress: 50,
                status: "In Progress",
            },
            {
                id: "8",
                name: "Initial UI/UX Analysis",
                project: "E-commerce Site",
                estimatedTime: "3/4 hrs",
                dueDate: "May 8th",
                priority: "High",
                progress: 50,
                status: "In Progress",
            },
        ];

        setTasks(mockTasks);
        setFilteredTasks(mockTasks);
    }, []);

    useEffect(() => {
        let result = [...tasks];

        if (searchTerm) {
            result = result.filter(
                (task) =>
                    task.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    task.project
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (projectFilter !== "All Projects") {
            result = result.filter((task) => task.project === projectFilter);
        }

        if (statusFilter !== "All Statuses") {
            result = result.filter((task) => task.status === statusFilter);
        }

        if (dueDateFilter === "Due Today") {
            result = result.filter((task) => task.dueDate === "May 8th");
        }

        setFilteredTasks(result);
    }, [searchTerm, projectFilter, statusFilter, dueDateFilter, tasks]);

    const handleStartTimer = (taskId: string | number) => {
        console.log("Start timer for task:", taskId);
    };

    const handleDeleteTask = (taskId: string | number) => {
        setTasks(tasks.filter((task) => task.id !== String(taskId)));
    };

    const handleEditTask = (taskId: string | number) => {
        console.log("Edit task:", taskId);
    };

    const processRowUpdate = useCallback((newRow: any, oldRow: any) => {
        console.debug(
            "Process row update:",
            newRow.id,
            "Changes:",
            JSON.stringify(newRow)
        );
        return newRow;
    }, []);

    const columns: GridColDef[] = [
        {
            field: "name",
            headerName: "TASK NAME",
            flex: 2,
            minWidth: 180,
            editable: true,
        },
        {
            field: "project",
            headerName: "PROJECT",
            flex: 1.5,
            minWidth: 150,
            editable: true,
            renderCell: renderProjectCell,
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
        {
            field: "actions",
            headerName: "ACTIONS",
            flex: 1,
            minWidth: 100,
            renderCell: renderActionsCell(handleDeleteTask, handleEditTask),
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
                } else if (col.field === "actions") {
                    return { ...baseConfig, flex: 0.7, minWidth: 60 };
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
                } else if (col.field === "actions") {
                    return { ...baseConfig, flex: 0.8, minWidth: 80 };
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
            />

            <TaskStats
                activeTasks={stats.activeTasks}
                completedTasks={stats.completedTasks}
                dueToday={stats.dueToday}
                completedThisMonth={stats.completedThisMonth}
            />

            <div className="current-task-wrapper">
                <CurrentTask
                    taskName={currentTask.name}
                    category={currentTask.category}
                    estimatedTime={currentTask.estimatedTime}
                    progress={currentTask.progress}
                    elapsedTime={currentTask.elapsedTime}
                    sessions={currentTask.sessions}
                    totalTime={currentTask.totalTime}
                />
            </div>

            <div className="responsive-table-container">
                <div className="tasks-table-container">
                    <DataGrid
                        rows={filteredTasks}
                        columns={responsiveColumns}
                        editMode="cell"
                        processRowUpdate={processRowUpdate}
                        onProcessRowUpdateError={(error) =>
                            console.error(error)
                        }
                        autoHeight
                        getRowHeight={() => "auto"}
                        disableRowSelectionOnClick
                        disableColumnFilter
                        disableColumnMenu
                        hideFooter={filteredTasks.length <= 10}
                        getRowId={(row) => row.id}
                        loading={false}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: "id", sort: "desc" }],
                            },
                            columns: {
                                columnVisibilityModel: {
                                    dueDate: window.innerWidth > 576,
                                    estimatedTime: window.innerWidth > 576,
                                },
                            },
                        }}
                        sx={{
                            width: "100%",
                            "& .MuiDataGrid-cell--editing": {
                                backgroundColor: "rgba(0,0,0,0.04)",
                                padding: "16px",
                                boxShadow: "inset 0 0 0 2px #1976d2",
                                zIndex: 10,
                            },
                            "& .MuiDataGrid-cell:focus": {
                                outline: "none",
                            },
                            "& .MuiDataGrid-cell.MuiDataGrid-cell--editable:hover":
                                {
                                    backgroundColor: "rgba(0,0,0,0.04)",
                                },
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: "#f9fafb",
                            },
                            border: "none",
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#f9fafb",
                                borderBottom: "1px solid #e5e7eb",
                            },
                            "& .MuiDataGrid-columnHeader": {
                                padding: {
                                    xs: "4px",
                                    sm: "8px",
                                    md: "16px",
                                },
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                                fontWeight: "600",
                                color: "#6b7280",
                                fontSize: {
                                    xs: "0.65rem",
                                    sm: "0.7rem",
                                    md: "0.75rem",
                                },
                                textTransform: "uppercase",
                                whiteSpace: {
                                    xs: "normal",
                                    sm: "normal",
                                    md: "nowrap",
                                },
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            },
                            "& .MuiDataGrid-cell": {
                                padding: {
                                    xs: "6px 4px",
                                    sm: "8px 8px",
                                    md: "12px 16px",
                                },
                                borderBottom: "1px solid #e5e7eb",
                                whiteSpace: "normal",
                                lineHeight: "normal",
                                transition: "none",
                                fontSize: {
                                    xs: "0.75rem",
                                    sm: "0.8rem",
                                    md: "0.875rem",
                                },
                            },

                            "& .MuiDataGrid-main": {
                                overflow: "visible",
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                overflowX: "visible",
                            },
                            "& .MuiDataGrid-virtualScrollerContent": {
                                willChange: "transform",
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Tasks;
