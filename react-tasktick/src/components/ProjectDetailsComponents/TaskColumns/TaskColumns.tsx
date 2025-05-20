import { useMemo } from "react";
import {
    GridColDef,
    GridRenderCellParams,
    GridValueFormatterParams,
    GridValueGetterParams,
} from "@mui/x-data-grid";
import TimeSpentColumn from "./TimeSpentColumn";
import {

    renderActionsCell,
} from "../../../components/SharedComponents/TasksTable/TableCellRenderers";
import {
    editablePriorityColumn,
    editableProgressColumn,
    statusColumn,
} from "../../../components/SharedComponents/TasksTable/TableColumnDefinitions";

interface TaskColumnsProps {
    handleStartTimer: (taskId: string | number) => void;
    handleDeleteTask: (taskId: string | number) => void;
    onTimeClick: (taskId: string | number) => void;
}

const formatDateForDisplay = (date: string) => {
    if (!date) return "No due date";
    return new Date(date).toLocaleDateString();
};

export const useTaskColumns = ({
    handleStartTimer,
    handleDeleteTask,
    onTimeClick,
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
                headerName: "EST",
                flex: 0.4,
                minWidth: 60,
                editable: true,
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
                valueFormatter: (params: GridValueFormatterParams) => {
                    return params.value || "0";
                },
            },
            {
                field: "dueDate",
                headerName: "DUE DATE",
                flex: 0.7,
                minWidth: 110,
                editable: true,
                valueFormatter: (params: GridValueFormatterParams) => {
                    return formatDateForDisplay(params.value);
                },
            },
            {
                field: "description",
                headerName: "DESCRIPTION",
                flex: 1.5,
                minWidth: 200,
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
                field: "timeSpent",
                headerName: "TIME SPENT",
                flex: 0.7,
                minWidth: 120,
                align: "center",
                headerAlign: "center",
                editable: false,
                renderCell: (params: GridRenderCellParams) => (
                    <TimeSpentColumn
                        taskId={params.row.id}
                        onTimeClick={() => onTimeClick(params.row.id)}
                        onStartTrackingClick={() =>
                            handleStartTimer(params.row.id)
                        }
                    />
                ),
            },
            {
                field: "actions",
                headerName: "ACTIONS",
                flex: 0.7,
                minWidth: 100,
                align: "center",
                headerAlign: "center",
                editable: false,
                renderCell: renderActionsCell(handleDeleteTask),
            },
        ],
        [handleStartTimer, handleDeleteTask, onTimeClick]
    );

    return columns;
};

export default useTaskColumns;
