import {
    DecompositionResult,
    GeneratedTaskDto,
} from "../../services/projectDecompositionService";
import { v4 as uuidv4 } from "uuid";
import { GridRowModel } from "@mui/x-data-grid";


export interface Task extends GeneratedTaskDto {
    id: string;
}

export interface ProjectStats {
    totalTasks: number;
    totalEstimatedTime: number;
}


export const PRIORITY_OPTIONS = ["high", "medium", "low"];


export const isValidDate = (date: any): boolean => {
    if (!date) return false;

    if (date instanceof Date) return !isNaN(date.getTime());

    if (typeof date === "string") {
        const parsed = new Date(date);
        return !isNaN(parsed.getTime());
    }

    return false;
};

export const parseEstimatedTime = (value: any): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
};

export const formatDate = (date: any): string => {
    if (!date) return "";

    try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return "Invalid date";

        return dateObj.toLocaleDateString();
    } catch (e) {
        return "Invalid date";
    }
};

export const calculateTotalEstimatedTime = (tasks: Task[]): number => {
    return tasks.reduce((total, task) => {
        const timeValue =
            typeof task.estimated_time === "string"
                ? parseFloat(task.estimated_time)
                : Number(task.estimated_time);

        return total + (isNaN(timeValue) ? 0 : timeValue);
    }, 0);
};

export const validateTasks = (tasks: Task[]): { valid: boolean; errorMessage?: string } => {
    if (tasks.length === 0) {
        return {
            valid: false,
            errorMessage: "At least one task is required."
        };
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
        return {
            valid: false,
            errorMessage: `Please fill in all required fields for all tasks. ${emptyFieldTasks.length} task(s) have empty fields.`
        };
    }

    const invalidDateTasks = tasks.filter(
        (task) => task.dueDate && !isValidDate(task.dueDate)
    );

    if (invalidDateTasks.length > 0) {
        return {
            valid: false,
            errorMessage: `Please enter valid dates for all tasks. ${invalidDateTasks.length} task(s) have invalid dates.`
        };
    }

    return { valid: true };
};

export const createNewTask = (): Task => {
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 7);

    return {
        id: uuidv4(),
        name: "",
        description: "",
        estimated_time: 2,
        priority: "medium",
        dueDate: defaultDueDate.toISOString().split("T")[0],
        progress: 0,
    };
};

export const updateTask = (tasks: Task[], updatedTask: GridRowModel): Task[] => {
    const updatedRow = {
        ...updatedTask,
        estimated_time: parseEstimatedTime(updatedTask.estimated_time),
    };

    return tasks.map((task) =>
        task.id === updatedTask.id ? (updatedRow as Task) : task
    );
};

export const formatTasksForSaving = (tasks: Task[]): GeneratedTaskDto[] => {
    return tasks.map(({ id, ...rest }) => ({
        ...rest,
        dueDate:
            typeof rest.dueDate === "string"
                ? new Date(rest.dueDate).toISOString()
                : rest.dueDate
                    ? (rest.dueDate as Date).toISOString()
                    : undefined,
    })) as GeneratedTaskDto[];
};

export const getRowClassName = (task: Task): string => {
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
};

export const loadDecompositionResults = (): {
    result: DecompositionResult | null,
    tasks: Task[],
    projectName: string,
    projectDescription: string,
    error: string | null
} => {
    const savedResult = sessionStorage.getItem("decompositionResult");

    if (!savedResult) {
        return {
            result: null,
            tasks: [],
            projectName: "",
            projectDescription: "",
            error: "No generated tasks found. Please generate tasks first."
        };
    }

    try {
        const result: DecompositionResult = JSON.parse(savedResult);

        const projectName = result.projectDetails?.name || "";
        const projectDescription = result.projectDetails?.description || "";

        const tasksWithIds = result.tasks.map((task) => ({
            ...task,
            id: uuidv4(),
            estimated_time: parseEstimatedTime(task.estimated_time),
        }));

        return {
            result,
            tasks: tasksWithIds,
            projectName,
            projectDescription,
            error: null
        };
    } catch (err) {

        return {
            result: null,
            tasks: [],
            projectName: "",
            projectDescription: "",
            error: "Failed to load generated tasks. Please try again."
        };
    }
}; 