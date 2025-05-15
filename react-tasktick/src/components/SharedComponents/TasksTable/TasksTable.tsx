import { useCallback, memo, useMemo, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowModel,
    useGridApiRef,
    GridPreProcessEditCellProps,
    GridCellModesModel,
    GridCellParams,
} from "@mui/x-data-grid";
import "./TasksTable.css";
import {
    renderPriorityCell,
    renderProgressCell,
    renderStatusCell,
    renderTimerCell,
    renderProjectCell,
    renderActionsCell,
} from "./TableCellRenderers";
import {
    editablePriorityColumn,
    editableProgressColumn,
} from "./TableColumnDefinitions";

export interface BaseTask {
    id: string | number;
    [key: string]: any;
}

interface TasksTableProps<T extends BaseTask> {
    tasks: T[];
    columns: GridColDef[];
    onStartTimer?: (taskId: string | number) => void;
    onDeleteTask?: (taskId: string | number) => void;
    onTaskUpdate?: (updatedTask: T) => void;
    onCellValueChange?: (
        id: string | number,
        field: string,
        value: any
    ) => void;
    loadingTaskIds?: (string | number)[];
    hideFooter?: boolean;
    className?: string;
    editableFields?: string[];
}

const TasksTable = memo(function TasksTable<T extends BaseTask>({
    tasks,
    columns,
    onStartTimer,
    onDeleteTask,
    onTaskUpdate,
    loadingTaskIds = [],
    hideFooter = false,
    className = "",
    editableFields = [],
}: TasksTableProps<T>) {
    const apiRef = useGridApiRef();
    const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>(
        {}
    );
    const [editingId, _] = useState<string | null>(null);

    

    const handleCellClick = useCallback(
        (params: GridCellParams) => {
            if (
                editableFields.includes(params.field) &&
                editingId !== String(params.id)
            ) {
                apiRef.current.startCellEditMode({
                    id: params.id,
                    field: params.field,
                });
            }
        },
        [apiRef, editableFields, editingId]
    );

    const processRowUpdate = useCallback(
        (newRow: GridRowModel, _: GridRowModel) => {
            console.debug(
                "[TasksTable] Process row update:",
                newRow.id,
                "Changes:",
                JSON.stringify(newRow)
            );
            if (onTaskUpdate) {
                onTaskUpdate(newRow as T);
            }
            return newRow;
        },
        [onTaskUpdate]
    );

    const handleProcessRowUpdateError = useCallback((error: Error) => {
        console.error("[TasksTable] Error updating task:", error);
    }, []);

    const makeColumnsEditable = useCallback(
        (cols: GridColDef[]) => {
            return cols.map((col) => {
                if (!editableFields.includes(col.field)) {
                    return col;
                }

                if (col.field === "progress") {
                    return {
                        ...col,
                        editable: true,
                        type: "number",
                        preProcessEditCellProps: (
                            params: GridPreProcessEditCellProps
                        ) => {
                            const { props } = params;
                            if (typeof props.value === "string") {
                                const numValue = Number(props.value);
                                if (!isNaN(numValue)) {
                                    return { ...props, value: numValue };
                                }
                            }
                            const hasError =
                                typeof props.value === "number" &&
                                (props.value < 0 || props.value > 100);
                            return { ...props, error: hasError };
                        },
                    };
                }

                if (col.field === "priority") {
                    return {
                        ...col,
                        editable: true,
                        type: "singleSelect",
                        valueOptions: ["Low", "Medium", "High"],
                    };
                }

                if (col.field === "status") {
                    return {
                        ...col,
                        editable: true,
                        type: "singleSelect",
                        valueOptions: [
                            "Not Started",
                            "In Progress",
                            "Completed",
                        ],
                    };
                }

                if (col.field === "dueDate") {
                    return {
                        ...col,
                        editable: true,
                        type: "date",
                    };
                }

                return {
                    ...col,
                    editable: true,
                };
            });
        },
        [editableFields]
    );

    const enhancedColumns = useMemo(
        () => makeColumnsEditable(columns),
        [columns, makeColumnsEditable]
    );

    const responsiveColumns = useMemo(() => {
        const isMobile = window.innerWidth < 768;

        return enhancedColumns.map((col) => ({
            ...col,
            minWidth: isMobile
                ? Math.min(col.minWidth ?? 80, 80)
                : col.minWidth,
            flex: isMobile ? (col.field === "name" ? 1.5 : 1) : col.flex,
        }));
    }, [enhancedColumns]);

    return (
        <div className="responsive-table-container">
            <div className={`tasks-table-container ${className}`}>
                <DataGrid
                    apiRef={apiRef}
                    rows={tasks}
                    columns={responsiveColumns}
                    editMode="cell"
                    onCellClick={handleCellClick}
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={handleProcessRowUpdateError}
                    cellModesModel={cellModesModel}
                    onCellModesModelChange={setCellModesModel}
                    autoHeight
                    getRowHeight={() => "auto"}
                    disableRowSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                    hideFooterPagination={hideFooter}
                    hideFooter={hideFooter || tasks.length <= 10}
                    getRowId={(row) => row.id}
                    loading={false}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: "id", sort: "desc" }],
                        },
                    }}
                    getRowClassName={(params) =>
                        loadingTaskIds.includes(params.id) ? "loading-row" : ""
                    }
                    sx={{
                        "& .MuiDataGrid-cell--editing": {
                            backgroundColor: "rgba(0,0,0,0.04)",
                            padding: "16px",
                            boxShadow: "inset 0 0 0 2px #1976d2",
                            zIndex: 10,
                        },
                        "& .MuiDataGrid-cell:focus": {
                            outline: "none",
                        },
                        "& .MuiDataGrid-cell.MuiDataGrid-cell--editable:hover":
                            {
                                backgroundColor: "rgba(0,0,0,0.04)",
                            },
                        "& .MuiDataGrid-row:hover": {
                            backgroundColor: "#f9fafb",
                        },
                        "& .MuiDataGrid-row.loading-row": {
                            opacity: 0.7,
                            backgroundColor: "#f0f7ff",
                        },
                        border: "none",
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f9fafb",
                            borderBottom: "1px solid #e5e7eb",
                        },
                        "& .MuiDataGrid-columnHeader": {
                            padding: {
                                xs: "8px",
                                sm: "16px",
                            },
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                            fontWeight: "600",
                            color: "#6b7280",
                            fontSize: {
                                xs: "0.7rem",
                                sm: "0.75rem",
                            },
                            textTransform: "uppercase",
                            whiteSpace: {
                                xs: "normal",
                                sm: "nowrap",
                            },
                        },
                        "& .MuiDataGrid-cell": {
                            padding: {
                                xs: "8px",
                                sm: "12px 16px",
                            },
                            borderBottom: "1px solid #e5e7eb",
                            whiteSpace: "normal",
                            lineHeight: "normal",
                            transition: "none",
                        },
                        "& .MuiDataGrid-cell.MuiDataGrid-cell--editable.error":
                            {
                                backgroundColor: "rgba(255, 0, 0, 0.1)",
                            },
                    }}
                />
            </div>
        </div>
    );
});

export {
    renderPriorityCell,
    renderProgressCell,
    renderStatusCell,
    renderTimerCell,
    renderProjectCell,
    renderActionsCell,
    editablePriorityColumn,
    editableProgressColumn,
};

export default TasksTable;
