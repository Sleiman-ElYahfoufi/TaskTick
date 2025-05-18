import { ProjectTask } from "../../services/projectsService";
import { GridColDef } from "@mui/x-data-grid";


export interface TaskStats {
    activeTasks: number;
    completedTasks: number;
    dueToday: number;
    completedThisMonth: string;
}


export const getTaskProject = (task: ProjectTask): string => {
    if (task.project_id) {
        const taskAny = task as any;
        if (taskAny.project_name && typeof taskAny.project_name === "string") {
            return taskAny.project_name;
        }

        return `Project ${task.project_id}`;
    }
    return "Unknown Project";
};

export const formatElapsedTime = (elapsedTime: number): string => {
    return elapsedTime
        ? `${Math.floor(elapsedTime / 3600)
            .toString()
            .padStart(2, "0")}:${Math.floor(
                (elapsedTime % 3600) / 60
            )
                .toString()
                .padStart(2, "0")}:${(elapsedTime % 60)
                    .toString()
                    .padStart(2, "0")}`
        : "00:00:00";
};

export const calculateTaskStats = (tasks: ProjectTask[]): TaskStats => {
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
                    "jan", "feb", "mar", "apr", "may", "jun",
                    "jul", "aug", "sep", "oct", "nov", "dec"
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
                "en-US", { month: "short", day: "numeric" }
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
};

export const makeColumnsEditable = (cols: GridColDef[]): GridColDef[] => {
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
};

export const makeResponsiveColumns = (columns: GridColDef[], windowWidth: number): GridColDef[] => {
    return columns.map((col) => {
        const baseConfig = {
            ...col,
            minWidth: col.minWidth,
            flex: col.flex,
        };

        if (windowWidth < 576) {
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
        } else if (windowWidth < 768) {
            if (col.field === "name") {
                return { ...baseConfig, flex: 1.5, minWidth: 120 };
            } else {
                return { ...baseConfig, flex: 1, minWidth: 90 };
            }
        }

        return baseConfig;
    });
};

export const filterTasks = (
    tasks: ProjectTask[],
    searchTerm: string,
    projectFilter: string,
    statusFilter: string,
    dueDateFilter: string
): ProjectTask[] => {
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

    return result;
};

export const parseDate = (value: any): Date | null => {
    if (!value) return null;

    try {
        if (typeof value === "string") {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                return date;
            }

            const monthMatch = value.match(
                /^([A-Za-z]+)\s+(\d+)(?:st|nd|rd|th)?$/
            );
            if (monthMatch) {
                const monthNames = [
                    "jan", "feb", "mar", "apr", "may", "jun",
                    "jul", "aug", "sep", "oct", "nov", "dec"
                ];
                const month = monthNames.findIndex(
                    (m) => m === monthMatch[1].toLowerCase().substring(0, 3)
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
};

export const formatDate = (value: any): string => {
    if (!value) return "";

    try {
        return value.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    } catch (e) {
        return String(value);
    }
};

export const extractUniqueProjects = (tasks: ProjectTask[]): string[] => {
    if (tasks.length > 0) {
        const uniqueProjects = Array.from(
            new Set(tasks.map((task) => getTaskProject(task)))
        );
        return ["All Projects", ...uniqueProjects];
    }
    return ["All Projects"];
}; 