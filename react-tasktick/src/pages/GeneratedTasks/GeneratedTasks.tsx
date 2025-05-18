import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import {
    DataGrid,
    GridColDef,
    GridRowId,
    GridActionsCellItem,
    GridRowModel,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";
import StepIndicator from "../../components/AddProjectComponents/StepIndicator/StepIndicator";
import {
    DecompositionResult,
    GeneratedTaskDto,
} from "../../services/projectDecompositionService";
import projectDecompositionService from "../../services/projectDecompositionService";
import "./GeneratedTasks.css";

interface Task extends GeneratedTaskDto {
    id: string;
}

const GeneratedTasks: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projectName, setProjectName] = useState("");
    const [_, setProjectDescription] = useState("");
    const [decompositionResult, setDecompositionResult] =
        useState<DecompositionResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const isValidDate = (date: any): boolean => {
        if (!date) return false;

        if (date instanceof Date) return !isNaN(date.getTime());

        if (typeof date === "string") {
            const parsed = new Date(date);
            return !isNaN(parsed.getTime());
        }

        return false;
    };

    useEffect(() => {
        const savedResult = sessionStorage.getItem("decompositionResult");

        if (!savedResult) {
            setError("No generated tasks found. Please generate tasks first.");
            return;
        }

        try {
            const result: DecompositionResult = JSON.parse(savedResult);
            setDecompositionResult(result);

            if (result.projectDetails) {
                setProjectName(result.projectDetails.name);
                setProjectDescription(result.projectDetails.description);
            }

            const tasksWithIds = result.tasks.map((task) => ({
                ...task,
                id: uuidv4(),

                estimated_time:
                    typeof task.estimated_time === "string"
                        ? parseFloat(task.estimated_time)
                        : Number(task.estimated_time),
            }));

            setTasks(tasksWithIds);
        } catch (err) {
            console.error("Error parsing saved tasks:", err);
            setError("Failed to load generated tasks. Please try again.");
        }
    }, []);

    const totalEstimatedTime = tasks.reduce((total, task) => {
        const timeValue =
            typeof task.estimated_time === "string"
                ? parseFloat(task.estimated_time)
                : Number(task.estimated_time);

        return total + (isNaN(timeValue) ? 0 : timeValue);
    }, 0);

    const handleDeleteTask = (id: GridRowId) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const handleAddTask = () => {
        const defaultDueDate = new Date();
        defaultDueDate.setDate(defaultDueDate.getDate() + 7);

        const newTask: Task = {
            id: uuidv4(),
            name: "",
            description: "",
            estimated_time: 2,
            priority: "medium",
            dueDate: defaultDueDate.toISOString().split("T")[0],
            progress: 0,
        };

        setTasks([newTask, ...tasks]);
    };

    const processRowUpdate = (newRow: GridRowModel, _: GridRowModel) => {
        const updatedRow = {
            ...newRow,
            estimated_time:
                typeof newRow.estimated_time === "string"
                    ? parseFloat(newRow.estimated_time)
                    : Number(newRow.estimated_time),
        };

        setTasks(
            tasks.map((task) =>
                task.id === newRow.id ? (updatedRow as Task) : task
            )
        );
        return updatedRow;
    };

    const handleSaveProject = async () => {
        if (!user?.id) {
            setError("User ID not found. Please log in again.");
            return;
        }

        if (tasks.length === 0) {
            setError("At least one task is required.");
            return;
        }

        if (!decompositionResult?.projectDetails) {
            setError("Project details not found.");
            return;
        }

        const emptyFieldTasks = tasks.filter(
            (task) =>
                !task.name ||
                !task.description ||
                task.estimated_time <= 0 ||
                !task.priority ||
                !task.dueDate
        );

        if (emptyFieldTasks.length > 0) {
            setError(
                `Please fill in all required fields for all tasks. ${emptyFieldTasks.length} task(s) have empty fields.`
            );
            return;
        }

        const invalidDateTasks = tasks.filter(
            (task) => task.dueDate && !isValidDate(task.dueDate)
        );

        if (invalidDateTasks.length > 0) {
            setError(
                `Please enter valid dates for all tasks. ${invalidDateTasks.length} task(s) have invalid dates.`
            );
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const formattedTasks = tasks.map(({ id, ...rest }) => ({
                ...rest,

                dueDate:
                    typeof rest.dueDate === "string"
                        ? new Date(rest.dueDate).toISOString()
                        : rest.dueDate
                        ? (rest.dueDate as Date).toISOString()
                        : undefined,
            }));

            const saveData: DecompositionResult = {
                projectDetails: decompositionResult.projectDetails,
                tasks: formattedTasks as GeneratedTaskDto[],
                saved: false,
                userId: Number(user.id),
            };

        await projectDecompositionService.saveTasks(
                saveData
            );

            setSuccessMessage("Project successfully created!");

            sessionStorage.removeItem("decompositionResult");

            setTimeout(() => {
                navigate("/dashboard/projects");
            }, 2000);
        } catch (err) {
            console.error("Error saving project:", err);
            setError("Failed to save project. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToDetails = () => {
        navigate("/dashboard/projects/new");
    };

    const columns: GridColDef[] = [
        {
            field: "name",
            headerName: "TASK NAME",
            flex: 2,
            editable: true,
        },
        {
            field: "description",
            headerName: "DESCRIPTION",
            flex: 3,
            editable: true,
        },
        {
            field: "estimated_time",
            headerName: "ESTIMATED TIME",
            flex: 1,
            editable: true,
            type: "number",
            valueParser: (value) => {
                const parsed = parseFloat(value);
                return isNaN(parsed) ? 0 : parsed;
            },
            renderCell: (params) => `${params.value} hrs`,
        },
        {
            field: "dueDate",
            headerName: "DUE DATE",
            flex: 1,
            editable: true,
            type: "date",
            valueFormatter: (params) => {
                if (!params.value) return "";

                try {
                    const date = new Date(params.value);
                    if (isNaN(date.getTime())) return "Invalid date";

                    return date.toLocaleDateString();
                } catch (e) {
                    return "Invalid date";
                }
            },
        },
        {
            field: "priority",
            headerName: "PRIORITY",
            flex: 1,
            editable: true,
            type: "singleSelect",
            valueOptions: ["high", "medium", "low"],
            renderCell: (params) => {
                const value =
                    params.value?.toString().toLowerCase() || "medium";
                const displayText =
                    value === "high"
                        ? "High"
                        : value === "medium"
                        ? "Medium"
                        : "Low";

                return (
                    <div className={`tasks-priority-badge ${value}`}>
                        {displayText}
                    </div>
                );
            },
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
                    onClick={() => handleDeleteTask(params.id)}
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
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10 },
                            },
                        }}
                        getRowClassName={(params) => {
                            const task = params.row as Task;
                            if (
                                !task.name ||
                                !task.description ||
                                task.estimated_time <= 0 ||
                                !task.priority ||
                                !task.dueDate
                            ) {
                                return "invalid-task-row";
                            }
                            if (task.dueDate && !isValidDate(task.dueDate)) {
                                return "invalid-date-row";
                            }
                            return "";
                        }}
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
        </div>
    );
};

export default GeneratedTasks;
