import { GridRenderCellParams } from "@mui/x-data-grid";
import { EditableCell } from "./EditableCell";

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

export const renderEditableCell =
    (
        onCellValueChange: (
            id: string | number,
            field: string,
            value: any
        ) => void
    ) =>
    (params: GridRenderCellParams) => {
        const { field } = params;

        const safeValue =
            params.value instanceof Date
                ? params.value.toLocaleDateString()
                : params.value;

        if (field === "priority") {
            return (
                <div className="custom-editable-cell">
                    {renderPriorityCell(params)}
                    <div
                        className="overlay-edit-trigger"
                        onClick={() => {
                            const options = ["Low", "Medium", "High"];
                            const newValue = window.prompt(
                                "Select priority:",
                                String(safeValue)
                            );
                            if (newValue && options.includes(newValue)) {
                                onCellValueChange(
                                    params.row.id,
                                    field,
                                    newValue
                                );
                            }
                        }}
                    ></div>
                </div>
            );
        }

        if (field === "progress") {
            return (
                <div className="custom-editable-cell">
                    {renderProgressCell(params)}
                    <div
                        className="overlay-edit-trigger"
                        onClick={() => {
                            const newValue = window.prompt(
                                "Enter progress (0-100):",
                                String(safeValue)
                            );
                            if (newValue !== null) {
                                const numValue = parseInt(newValue);
                                if (
                                    !isNaN(numValue) &&
                                    numValue >= 0 &&
                                    numValue <= 100
                                ) {
                                    onCellValueChange(
                                        params.row.id,
                                        field,
                                        numValue
                                    );
                                }
                            }
                        }}
                    ></div>
                </div>
            );
        }

        if (field === "status") {
            return (
                <div className="custom-editable-cell">
                    {renderStatusCell(params)}
                    <div
                        className="overlay-edit-trigger"
                        onClick={() => {
                            const options = [
                                "Not Started",
                                "In Progress",
                                "Completed",
                            ];
                            const newValue = window.prompt(
                                "Select status:",
                                String(safeValue)
                            );
                            if (newValue && options.includes(newValue)) {
                                onCellValueChange(
                                    params.row.id,
                                    field,
                                    newValue
                                );
                            }
                        }}
                    ></div>
                </div>
            );
        }

        if (field === "dueDate") {
            return (
                <EditableCell
                    value={params.value}
                    row={params.row}
                    field={params.field}
                    onValueChange={onCellValueChange}
                />
            );
        }

        return (
            <EditableCell
                value={params.value}
                row={params.row}
                field={params.field}
                onValueChange={onCellValueChange}
            />
        );
    };
