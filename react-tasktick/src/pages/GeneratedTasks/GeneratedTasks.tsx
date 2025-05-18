import React, { useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridActionsCellItem,

    useGridApiContext,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import StepIndicator from "../../components/AddProjectComponents/StepIndicator/StepIndicator";
import "./GeneratedTasks.css";
import {
    Task,
    parseEstimatedTime,
    formatDate,
    calculateTotalEstimatedTime,
    PRIORITY_OPTIONS,
    getRowClassName,
} from "./generatedTasksFunctions";
import { useGeneratedTasks } from "./generatedTasksHooks";
import DeleteModal from "../../components/SharedComponents/DeleteModal/DeleteModal";

const GeneratedTasks: React.FC = () => {
    const {
        tasks,
        projectName,
        isLoading,
        error,
        successMessage,
        handleDeleteTask,
        handleAddTask,
        processRowUpdate,
        handleSaveProject,
        handleBackToDetails,
    } = useGeneratedTasks();

    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const totalEstimatedTime = calculateTotalEstimatedTime(tasks);

    const confirmDeleteTask = (id: string) => {
        setTaskToDelete(id);
    };

    const handleConfirmDelete = () => {
        if (taskToDelete) {
            handleDeleteTask(taskToDelete);
            setTaskToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setTaskToDelete(null);
    };

    const EditableCell = (props: any) => {
        const { id, field, value } = props;
        const apiRef = useGridApiContext();

        const handleClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            apiRef.current.startCellEditMode({ id, field });
        };

        if (field === "actions") {
            return <div>{value}</div>;
        }

        let displayValue = value;

        if (field === "estimated_time") {
            displayValue = `${value} hrs`;
        } else if (field === "dueDate") {
            displayValue = formatDate(value);
        } else if (field === "priority") {
            const priorityValue = value?.toString().toLowerCase() || "medium";
            const displayText =
                priorityValue === "high"
                    ? "High"
                    : priorityValue === "medium"
                    ? "Medium"
                    : "Low";

            return (
                <div
                    onClick={handleClick}
                    className={`tasks-priority-badge ${priorityValue}`}
                >
                    {displayText}
                </div>
            );
        }

        return (
            <div
                onClick={handleClick}
                style={{ cursor: "pointer", width: "100%", height: "100%" }}
            >
                {displayValue}
            </div>
        );
    };

    const columns: GridColDef[] = [
        {
            field: "name",
            headerName: "TASK NAME",
            flex: 2,
            editable: true,
            renderCell: (params) => <EditableCell {...params} />,
        },
        {
            field: "description",
            headerName: "DESCRIPTION",
            flex: 3,
            editable: true,
            renderCell: (params) => <EditableCell {...params} />,
        },
        {
            field: "estimated_time",
            headerName: "ESTIMATED TIME",
            flex: 1,
            editable: true,
            type: "number",
            valueParser: parseEstimatedTime,
            renderCell: (params) => <EditableCell {...params} />,
        },
        {
            field: "dueDate",
            headerName: "DUE DATE",
            flex: 1,
            editable: true,
            type: "date",
            valueFormatter: (params) => formatDate(params.value),
            renderCell: (params) => <EditableCell {...params} />,
        },
        {
            field: "priority",
            headerName: "PRIORITY",
            flex: 1,
            editable: true,
            type: "singleSelect",
            valueOptions: PRIORITY_OPTIONS,
            renderCell: (params) => <EditableCell {...params} />,
        },
        {
            field: "actions",
            headerName: "ACTIONS",
            type: "actions",
            flex: 0.5,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => confirmDeleteTask(params.id as string)}
                />,
            ],
        },
    ];

    return (
        <div className="generated-tasks-container">
            <h1 className="page-title">Generated Tasks</h1>

            <div className="generated-tasks-content">
                <div className="top-controls">
                    <StepIndicator
                        steps={[
                            { number: 1, label: "Project Details" },
                            { number: 2, label: "Generated Tasks" },
                        ]}
                        currentStep={2}
                    />

                    <button className="add-task-btn" onClick={handleAddTask}>
                        Add Task
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}
                {successMessage && (
                    <div className="success-message">{successMessage}</div>
                )}

                <div className="generated-tasks-project-summary">
                    <div className="generated-tasks-project-info">
                        <h2 className="generated-tasks-project-name">
                            {projectName || "New Project"}
                        </h2>

                        <div className="generated-tasks-stats">
                            <div className="generated-tasks-stat">
                                <span className="generated-tasks-stat-label">
                                    Tasks Generated
                                </span>
                                <span className="generated-tasks-stat-value">
                                    {tasks.length} tasks
                                </span>
                            </div>

                            <div className="generated-tasks-stat">
                                <span className="generated-tasks-stat-label">
                                    Total Estimated Time
                                </span>
                                <span className="generated-tasks-stat-value">
                                    {totalEstimatedTime} hours
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="generated-tasks-accuracy-badge">
                        <span>AI Generated</span>
                    </div>
                </div>

                <div className="tasks-table">
                    <DataGrid
                        rows={tasks}
                        columns={columns}
                        autoHeight
                        disableRowSelectionOnClick
                        processRowUpdate={processRowUpdate}
                        pageSizeOptions={[10, 25, 50]}
                        editMode="cell"
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10 },
                            },
                        }}
                        getRowClassName={(params) =>
                            getRowClassName(params.row as Task)
                        }
                        sx={{
                            "& .MuiDataGrid-cell:focus": {
                                outline: "none",
                            },
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: "#f9fafb",
                            },
                            "& .invalid-task-row": {
                                backgroundColor: "#fee2e2",
                            },
                            "& .invalid-date-row": {
                                backgroundColor: "#fef3c7",
                            },
                            border: "none",
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#f9fafb",
                                borderBottom: "1px solid #e5e7eb",
                            },
                            "& .MuiDataGrid-columnHeader": {
                                padding: "16px",
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                                fontWeight: "600",
                                color: "#6b7280",
                                fontSize: "0.875rem",
                            },
                            "& .MuiDataGrid-cell": {
                                padding: "16px",
                                borderBottom: "1px solid #e5e7eb",
                            },
                        }}
                    />
                </div>

                <div className="actions-footer">
                    <button className="back-btn" onClick={handleBackToDetails}>
                        Back to Details
                    </button>
                    <button
                        className="create-project-btn"
                        onClick={handleSaveProject}
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating Project..." : "Create Project"}
                    </button>
                </div>
            </div>

            {taskToDelete && (
                <DeleteModal
                    isOpen={!!taskToDelete}
                    onClose={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                    itemName="this task"
                />
            )}
        </div>
    );
};

export default GeneratedTasks;
