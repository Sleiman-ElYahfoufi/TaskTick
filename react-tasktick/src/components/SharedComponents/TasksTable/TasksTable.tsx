import React, { useCallback, memo, useEffect, useMemo } from "react";
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridRowModel,
    useGridApiRef,
    GridCellEditStopReasons,
    GridCellEditStopParams,
    GridPreProcessEditCellProps,
    GridCellModesModel,
    GridCellParams,
    GridValidRowModel,
    MuiEvent,
    GridEventListener,
} from "@mui/x-data-grid";
import "./TasksTable.css";

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
    onCellValueChange,
    loadingTaskIds = [],
    hideFooter = false,
    className = "",
    editableFields = [],
}: TasksTableProps<T>) {
    const apiRef = useGridApiRef();
    const [cellModesModel, setCellModesModel] =
        React.useState<GridCellModesModel>({});

    const processCellUpdate = useCallback(
        (params: any) => {
            const { id, field, value } = params;
            console.debug(
                "[TasksTable] Process cell update:",
                id,
                "Field:",
                field,
                "Value:",
                value
            );

            if (onCellValueChange) {
                onCellValueChange(id, field, value);
            }
            return value;
        },
        [onCellValueChange]
    );

    useEffect(() => {
        console.debug(
            "[TasksTable] Rendering with tasks length:",
            tasks.length
        );
        return () => {
            console.debug("[TasksTable] Unmounting");
        };
    }, [tasks.length]);

    useEffect(() => {
        console.debug("[TasksTable] loadingTaskIds changed:", loadingTaskIds);
    }, [loadingTaskIds]);

    const handleCellEditStart = useCallback((params: GridCellParams) => {
        console.debug(
            "[TasksTable] Cell edit start:",
            params.id,
            "Field:",
            params.field
        );
    }, []);

    const handleCellEditStop: GridEventListener<"cellEditStop"> = useCallback(
        (params, event) => {
            console.debug(
                "[TasksTable] Cell edit stop:",
                params.id,
                "Field:",
                params.field,
                "Reason:",
                params.reason
            );

            if (
                params.reason === "enterKeyDown" ||
                params.reason === "tabKeyDown" ||
                params.reason === "cellFocusOut"
            ) {
                const id = params.id;
                const field = params.field;

                const originalValue = apiRef.current.getCellValue(id, field);
                console.debug(
                    `Original value for ${field}: "${originalValue}"`
                );

                if (field === "estimatedTime") {
                    const cellElement = document.querySelector(
                        `.MuiDataGrid-cell--editing input`
                    );

                    if (cellElement instanceof HTMLInputElement) {
                        const inputValue = cellElement.value;
                        console.debug(
                            `Input value for ${field}: "${inputValue}"`
                        );

                        if (
                            (inputValue === "" || inputValue === "0") &&
                            originalValue &&
                            originalValue !== "0" &&
                            originalValue !== 0
                        ) {
                            console.debug(
                                `Using original value: "${originalValue}"`
                            );
                            processCellUpdate({
                                id,
                                field,
                                value: originalValue,
                            });
                            return;
                        }

                        processCellUpdate({ id, field, value: inputValue });
                    } else {
                        processCellUpdate({ id, field, value: originalValue });
                    }
                } else {
                    const value = apiRef.current.getCellValue(id, field);
                    processCellUpdate({ id, field, value });
                }
            }
        },
        [apiRef, processCellUpdate]
    );

    const processRowUpdate = useCallback(
        (newRow: GridRowModel, oldRow: GridRowModel) => {
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

    const preProcessEditCellProps = useCallback(
        (params: GridPreProcessEditCellProps) => {
            const { props } = params;

            if (
                typeof props.value === "number" &&
                (props.value < 0 || props.value > 100)
            ) {
                return { ...props, error: "Progress must be between 0-100%" };
            }

            return props;
        },
        []
    );

    const makeColumnsEditable = useCallback(
        (cols: GridColDef[]) => {
            return cols.map((col) => {
                if (!editableFields.includes(col.field)) {
                    return col;
                }

                return {
                    ...col,
                    editable: true,
                    preProcessEditCellProps,
                };
            });
        },
        [editableFields, preProcessEditCellProps]
    );

    const enhancedColumns = useMemo(() => {
        return makeColumnsEditable(columns);
    }, [columns, makeColumnsEditable]);

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
                    cellModesModel={cellModesModel}
                    onCellModesModelChange={setCellModesModel}
                    onCellEditStart={handleCellEditStart}
                    onCellEditStop={handleCellEditStop}
                    autoHeight
                    getRowHeight={() => "auto"}
                    disableRowSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                    hideFooterPagination={hideFooter}
                    hideFooter={hideFooter || tasks.length <= 10}
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={handleProcessRowUpdateError}
                    isCellEditable={(params) =>
                        editableFields.includes(params.field)
                    }
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

export const renderPriorityCell = (params: GridRenderCellParams) => (
    <div className={`priority-badge ${params.value?.toString().toLowerCase()}`}>
        {params.value}
    </div>
);

export const renderProgressCell = (params: GridRenderCellParams) => (
    <div className="progress-bar-container">
        <div className="task-progress-bar-wrapper">
            <div
                className="task-progress-bar"
                style={{ width: `${params.value}%` }}
            ></div>
        </div>
        <div className="task-progress-text-container">
            <span className="task-progress-text">{params.value}%</span>
        </div>
    </div>
);

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
        const priorityOrder: { [key: string]: number } = {
            low: 1,
            medium: 2,
            high: 3,
        };

        const val1 = typeof v1 === "string" ? v1.toLowerCase() : "";
        const val2 = typeof v2 === "string" ? v2.toLowerCase() : "";

        const order1 = priorityOrder[val1] || 0;
        const order2 = priorityOrder[val2] || 0;

        return order1 - order2;
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
    preProcessEditCellProps: (params) => {
        const hasError = params.props.value < 0 || params.props.value > 100;
        return { ...params.props, error: hasError };
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
        const statusOrder: { [key: string]: number } = {
            "not started": 1,
            "in progress": 2,
            completed: 3,
        };

        const val1 = typeof v1 === "string" ? v1.toLowerCase() : "";
        const val2 = typeof v2 === "string" ? v2.toLowerCase() : "";

        const order1 = statusOrder[val1] || 0;
        const order2 = statusOrder[val2] || 0;

        return order1 - order2;
    },
});

export const renderTimerCell =
    (onStartTimer: (id: string | number) => void) =>
    (params: GridRenderCellParams) =>
        (
            <button
                className={`timer-button ${
                    params.row.status === "Completed" ? "completed" : ""
                }`}
                onClick={() =>
                    params.row.status !== "Completed" &&
                    onStartTimer(params.row.id)
                }
                disabled={params.row.status === "Completed"}
            >
                {params.row.status === "Completed" ? "Completed" : "Start"}
            </button>
        );

export const renderStatusCell = (params: GridRenderCellParams) => (
    <div
        className={`status-badge ${params.value
            ?.toString()
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
    >
        {params.value}
    </div>
);

export const renderProjectCell = (params: GridRenderCellParams) => (
    <div className="project-badge">{params.value}</div>
);

export const renderActionsCell =
    (
        onDelete?: (id: string | number) => void,
        onEdit?: (id: string | number) => void
    ) =>
    (params: GridRenderCellParams) =>
        (
            <div className="actions-cell">
                {onEdit && (
                    <button
                        className="edit-button"
                        onClick={() => onEdit(params.row.id)}
                        aria-label="Edit task"
                    >
                        <span>Edit</span>
                    </button>
                )}
                {onDelete && (
                    <button
                        className="delete-button"
                        onClick={() => onDelete(params.row.id)}
                        aria-label="Delete task"
                    >
                        <span>Delete</span>
                    </button>
                )}
            </div>
        );

export default TasksTable;
