import { GridColDef } from "@mui/x-data-grid";
import {
    renderPriorityCell,
    renderProgressCell,
    renderStatusCell,
} from "./TableCellRenderers";

export const editablePriorityColumn = (
    options: string[] = ["Low", "Medium", "High", "Critical"]
): GridColDef => ({
    field: "priority",
    headerName: "PRIORITY",
    width: 100,
    minWidth: 70,
    flex: 0.8,
    editable: true,
    renderCell: renderPriorityCell,
    type: "singleSelect",
    valueOptions: options,
    sortComparator: (v1, v2) => {
        const priorityOrder: Record<string, number> = {
            low: 1,
            medium: 2,
            high: 3,
        };
        const val1 = typeof v1 === "string" ? v1.toLowerCase() : "";
        const val2 = typeof v2 === "string" ? v2.toLowerCase() : "";
        return (priorityOrder[val1] || 0) - (priorityOrder[val2] || 0);
    },
});

export const editableProgressColumn = (): GridColDef => ({
    field: "progress",
    headerName: "PROGRESS",
    width: 130,
    minWidth: 90,
    flex: 1,
    editable: true,
    type: "number",
    renderCell: renderProgressCell,
    sortComparator: (v1, v2) => {
        const num1 = typeof v1 === "number" ? v1 : 0;
        const num2 = typeof v2 === "number" ? v2 : 0;
        return num1 - num2;
    },
});

export const editableStatusColumn = (
    options: string[] = ["Not Started", "In Progress", "Completed"]
): GridColDef => ({
    field: "status",
    headerName: "STATUS",
    width: 150,
    minWidth: 80,
    editable: true,
    renderCell: renderStatusCell,
    type: "singleSelect",
    valueOptions: options,
    sortComparator: (v1, v2) => {
        const statusOrder: Record<string, number> = {
            "not started": 1,
            "in progress": 2,
            completed: 3,
        };
        const val1 = typeof v1 === "string" ? v1.toLowerCase() : "";
        const val2 = typeof v2 === "string" ? v2.toLowerCase() : "";
        return (statusOrder[val1] || 0) - (statusOrder[val2] || 0);
    },
});
