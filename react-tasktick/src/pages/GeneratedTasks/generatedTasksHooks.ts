import { useState, useEffect } from "react";
import { GridRowId, GridRowModel } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { DecompositionResult } from "../../services/projectDecompositionService";
import {
    Task,
    createNewTask,
    updateTask,
    loadDecompositionResults,
    validateTasks
} from "./generatedTasksFunctions";
import { saveTasks } from "./generatedTasksActions";

export const useGeneratedTasks = () => {
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [decompositionResult, setDecompositionResult] = useState<DecompositionResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const { result, tasks: loadedTasks, projectName: name, projectDescription: description, error: loadError } = loadDecompositionResults();

        if (loadError) {
            setError(loadError);
            return;
        }

        setDecompositionResult(result);
        setProjectName(name);
        setProjectDescription(description);
        setTasks(loadedTasks);
    }, []);

    const handleDeleteTask = (id: GridRowId) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const handleAddTask = () => {
        const newTask = createNewTask();
        setTasks([newTask, ...tasks]);
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedTasks = updateTask(tasks, newRow);
        setTasks(updatedTasks);
        return newRow;
    };

    const handleSaveProject = async () => {
        if (!user?.id) {
            setError("User ID not found. Please log in again.");
            return;
        }

        const validation = validateTasks(tasks);
        if (!validation.valid) {
            setError(validation.errorMessage || "Invalid task data");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await saveTasks(
                tasks,
                decompositionResult?.projectDetails,
                Number(user.id)
            );

            setSuccessMessage("Project successfully created!");

            setTimeout(() => {
                navigate("/dashboard/projects");
            }, 2000);
        } catch (err: any) {
            console.error("Error saving project:", err);
            setError(err.message || "Failed to save project. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToDetails = () => {
        navigate("/dashboard/projects/new");
    };

    return {
        tasks,
        projectName,
        projectDescription,
        decompositionResult,
        isLoading,
        error,
        successMessage,
        handleDeleteTask,
        handleAddTask,
        processRowUpdate,
        handleSaveProject,
        handleBackToDetails
    };
}; 