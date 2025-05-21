import { ProjectStatus } from "../../components/ProjectsComponents/ProjectCard/ProjectCard";

export interface ProjectData {
    id: number | string;
    name?: string;
    title?: string;
    description?: string;
    status: string;
    estimated_time?: number;
    estimatedHours?: string;
    created_at?: string;
    updated_at?: string;
    tasks?: any[];
    totalTasks?: number;
    completedTasks?: number;
    deadline?: string | null;
    priority?: string;
    detail_depth?: string;
}

export const mapStatusToUI = (status: string): ProjectStatus => {
    if (!status) return "planning";

    const normalized = status.toLowerCase();

    // Handle API status format
    if (normalized === "in_progress") {
        return "in-progress";
    }

    // Direct match for UI status format
    if (
        normalized === "in-progress" ||
        normalized === "planning" ||
        normalized === "delayed" ||
        normalized === "completed"
    ) {
        return normalized as ProjectStatus;
    }

    // Default fallback

    
return "planning";
};

export const mapStatusToAPI = (status: string): string => {
    // Normalize the input by removing special characters
    const normalized = status.toLowerCase();

    // Handle both formats - API format (underscore) already correct
    if (normalized === "in_progress") return "in_progress";

    // Map UI format (hyphen) to API format (underscore)
    const statusMap: { [key: string]: string } = {
        planning: "planning",
        "in-progress": "in_progress",
        delayed: "delayed",
        completed: "completed",
    };

    return statusMap[normalized] || "planning";
};

export const formatDateForDisplay = (dateString?: string): string => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
        return "Today";
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const formatTimeForDisplay = (dateString?: string): string => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

export const applyFilters = (
    search: string,
    filter: string,
    sort: string,
    projectsToFilter: ProjectData[]
): ProjectData[] => {
    let result = [...projectsToFilter];

    if (search) {
        result = result.filter((project) => {
            const title = project.title || project.name || "";
            const description = project.description || "";
            return (
                title.toLowerCase().includes(search.toLowerCase()) ||
                description.toLowerCase().includes(search.toLowerCase())
            );
        });
    }

    if (filter !== "All") {
        const statusMap: { [key: string]: string } = {
            Active: "in_progress",
            Completed: "completed",
            Planning: "planning",
            Delayed: "delayed",
        };

        if (statusMap[filter]) {
            result = result.filter(
                (project) => project.status === statusMap[filter]
            );
        }
    }

    switch (sort) {
        case "Name A-Z":
            result.sort((a, b) => {
                const titleA = a.title || a.name || "";
                const titleB = b.title || b.name || "";
                return titleA.localeCompare(titleB);
            });
            break;
        case "Name Z-A":
            result.sort((a, b) => {
                const titleA = a.title || a.name || "";
                const titleB = b.title || b.name || "";
                return titleB.localeCompare(titleA);
            });
            break;
        case "Oldest First":
            result.sort((a, b) => {
                const dateA = a.created_at
                    ? new Date(a.created_at).getTime()
                    : 0;
                const dateB = b.created_at
                    ? new Date(b.created_at).getTime()
                    : 0;
                return dateA - dateB;
            });
            break;
        case "Newest First":
            result.sort((a, b) => {
                const dateA = a.created_at
                    ? new Date(a.created_at).getTime()
                    : 0;
                const dateB = b.created_at
                    ? new Date(b.created_at).getTime()
                    : 0;
                return dateB - dateA;
            });
            break;
        case "Last Updated":
            result.sort((a, b) => {
                const dateA = a.updated_at
                    ? new Date(a.updated_at).getTime()
                    : 0;
                const dateB = b.updated_at
                    ? new Date(b.updated_at).getTime()
                    : 0;
                return dateB - dateA;
            });
            break;
        default:
            break;
    }

    return result;
};

export const getDisplayProject = (
    project: ProjectData,
    localProjectUpdates: Record<string, Partial<ProjectData>>
): ProjectData => {
    const localUpdate = localProjectUpdates[String(project.id)];
    if (localUpdate) {
        return { ...project, ...localUpdate };
    }
    return project;
}; 