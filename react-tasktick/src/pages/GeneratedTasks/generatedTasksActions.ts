import { DecompositionResult, GeneratedTaskDto } from "../../services/projectDecompositionService";
import projectDecompositionService from "../../services/projectDecompositionService";
import { Task, formatTasksForSaving } from "./generatedTasksFunctions";

export const saveTasks = async (
    tasks: Task[],
    projectDetails: DecompositionResult["projectDetails"],
    userId: number
): Promise<void> => {
    if (!userId) {
        throw new Error("User ID not found. Please log in again.");
    }

    if (tasks.length === 0) {
        throw new Error("At least one task is required.");
    }

    if (!projectDetails) {
        throw new Error("Project details not found.");
    }

    const formattedTasks = formatTasksForSaving(tasks);

    const saveData: DecompositionResult = {
        projectDetails,
        tasks: formattedTasks as GeneratedTaskDto[],
        saved: false,
        userId: userId,
    };

    await projectDecompositionService.saveTasks(saveData);
    sessionStorage.removeItem("decompositionResult");
}; 