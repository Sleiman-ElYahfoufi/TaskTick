import { useMemo } from "react";
import {
    GridColDef,
    GridValueGetterParams,
    GridValueFormatterParams,
    GridRenderCellParams,
} from "@mui/x-data-grid";
import {
    renderActionsCell,
    renderTimerCell,
} from "../../../components/SharedComponents/TasksTable/TableCellRenderers";
import {
    editableProgressColumn,
    editablePriorityColumn,
    statusColumn,
} from "../../../components/SharedComponents/TasksTable/TableColumnDefinitions";
import { formatDateForDisplay } from "../../../utils/TaskFormattingUtils";

interface TaskColumnsProps {
    handleStartTimer: (taskId: string | number) => void;
    handleDeleteTask: (taskId: string | number) => void;
}

export const useTaskColumns = ({
    handleStartTimer,
    handleDeleteTask,
}: TaskColumnsProps) => {
    const columns: GridColDef[] = useMemo(
        () => [
            {
                field: "name",
                headerName: "TASK NAME",
                flex: 1,
                minWidth: 120,
                editable: true,
            },
            {
                field: "estimatedTime",
                headerName: "EST. TIME",
                flex: 0.7,
                minWidth: 70,
                align: "center",
                headerAlign: "center",
                editable: true,
                type: "number",
                valueGetter: (params: GridValueGetterParams) => {
                    if (typeof params.value === "string") {
                        const match = params.value.match(/^(\d+(?:\.\d+)?)/);
                        if (match && match[1]) {
                            return match[1];
                        }
                    }

                    if (typeof params.value === "number") {
                        return params.value;
                    }

                    if (params.row.estimated_time !== undefined) {
                        return params.row.estimated_time;
                    }

                    return params.value || "0";
                },
                renderCell: (params: GridRenderCellParams) => {
                    const value = params.value;
                    return <span>{value}</span>;
                },
            },
            {
                field: "dueDate",
                headerName: "DUE DATE",
                flex: 1,
                minWidth: 130,
                align: "center",
                headerAlign: "center",
                editable: true,
                type: "date",
                valueGetter: (params: GridValueGetterParams) => {
                    if (!params.value || params.value === "Not set")
                        return null;

                    try {
                        const date = new Date(params.value);

                        if (isNaN(date.getTime())) return null;

                        const currentYear = new Date().getFullYear();
                        if (date.getFullYear() < 2020) {
                            date.setFullYear(currentYear);
                        }

                        return new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate(),
                            12,
                            0,
                            0
                        );
                    } catch (error) {
                        console.error("Date parsing error:", error);
                        return null;
                    }
                },
                valueFormatter: (params: GridValueFormatterParams) => {
                    return formatDateForDisplay(params.value);
                },
                renderCell: (params: GridRenderCellParams) => {
                    return <span>{formatDateForDisplay(params.value)}</span>;
                },
            },
            {
                field: "description",
                headerName: "DESCRIPTION",
                flex: 1.5,
                minWidth: 150,
                editable: true,
                renderCell: (params: GridRenderCellParams) => (
                    <div className="description-cell">
                        {params.value || "No description"}
                    </div>
                ),
            },
            editablePriorityColumn(["High", "Medium", "Low"]),
            editableProgressColumn(),
            statusColumn(),
            {
                field: "timer",
                headerName: "TIMER",
                flex: 0.7,
                minWidth: 80,
                align: "center",
                headerAlign: "center",
                renderCell: renderTimerCell(handleStartTimer),
            },
            {
                field: "actions",
                headerName: "ACTIONS",
                flex: 0.7,
                minWidth: 90,
                align: "center",
                headerAlign: "center",
                sortable: false,
                filterable: false,
                renderCell: renderActionsCell(handleDeleteTask),
            },
        ],
        [handleStartTimer, handleDeleteTask]
    );

    return columns;
};

export default useTaskColumns;
