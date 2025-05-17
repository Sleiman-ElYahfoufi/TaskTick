import { GridRenderCellParams } from "@mui/x-data-grid";
import { EditableCell } from "./EditableCell";
import { useAppSelector } from "../../../store/hooks";
import { selectActiveSession } from "../../../store/slices/timeTrackingsSlice";

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
    (params: GridRenderCellParams) => {
        const activeSession = useAppSelector(selectActiveSession);

        const isDisabled = !!activeSession || params.row.status === "Completed";

        const buttonClass = `timer-button ${
            params.row.status === "Completed" ? "completed" : ""
        } ${
            activeSession && params.row.status !== "Completed"
                ? "session-active"
                : ""
        }`;

        return (
            <button
                className={buttonClass}
                onClick={() => !isDisabled && onStartTimer(params.row.id)}
                disabled={isDisabled}
                title={
                    activeSession && params.row.status !== "Completed"
                        ? "Cannot start a new timer while another session is active"
                        : params.row.status === "Completed"
                        ? "Task is completed"
                        : "Start timer for this task"
                }
            >
                {params.row.status === "Completed" ? "Completed" : "Start"}
            </button>
        );
    };

export const renderActionsCell =
    (
        onDelete?: (id: string | number) => void,
        onEdit?: (id: string | number) => void
    ) =>
    (params: GridRenderCellParams) => {
        const activeSession = useAppSelector(selectActiveSession);
        const editingDisabled = !!activeSession;

        return (
            <div className="actions-cell">
                {onEdit && (
                    <button
                        className={`edit-button ${
                            editingDisabled ? "disabled" : ""
                        }`}
                        onClick={() =>
                            !editingDisabled && onEdit(params.row.id)
                        }
                        aria-label="Edit task"
                        disabled={editingDisabled}
                        title={
                            editingDisabled
                                ? "Editing disabled during active session"
                                : "Edit task"
                        }
                    >
                        <span>Edit</span>
                    </button>
                )}
                {onDelete && (
                    <button
                        className={`delete-button ${
                            editingDisabled ? "disabled" : ""
                        }`}
                        onClick={() =>
                            !editingDisabled && onDelete(params.row.id)
                        }
                        aria-label="Delete task"
                        disabled={editingDisabled}
                        title={
                            editingDisabled
                                ? "Deletion disabled during active session"
                                : "Delete task"
                        }
                    >
                        <span>Delete</span>
                    </button>
                )}
            </div>
        );
    };

export const renderEditableCell =
    (
        onCellValueChange: (
            id: string | number,
            field: string,
            value: any
        ) => void,
        parentEditingDisabled?: boolean
    ) =>
    (params: GridRenderCellParams) => {
        const { field } = params;

        const activeSession = useAppSelector(selectActiveSession);
        const editingDisabled =
            parentEditingDisabled !== undefined
                ? parentEditingDisabled
                : !!activeSession;

        const safeValue =
            params.value instanceof Date
                ? params.value.toLocaleDateString()
                : params.value;

        if (field === "priority") {
            return (
                <div
                    className={`custom-editable-cell ${
                        editingDisabled ? "disabled" : ""
                    }`}
                >
                    {renderPriorityCell(params)}
                    {!editingDisabled && (
                        <div
                            className="overlay-edit-trigger"
                            onClick={() => {
                                if (editingDisabled) return;
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
                    )}
                </div>
            );
        }

        if (field === "progress") {
            return (
                <div
                    className={`custom-editable-cell ${
                        editingDisabled ? "disabled" : ""
                    }`}
                >
                    {renderProgressCell(params)}
                    {!editingDisabled && (
                        <div
                            className="overlay-edit-trigger"
                            onClick={() => {
                                if (editingDisabled) return;
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
                    )}
                </div>
            );
        }

        if (field === "status") {
            return (
                <div
                    className={`custom-editable-cell ${
                        editingDisabled ? "disabled" : ""
                    }`}
                >
                    {renderStatusCell(params)}
                    {!editingDisabled && (
                        <div
                            className="overlay-edit-trigger"
                            onClick={() => {
                                if (editingDisabled) return;
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
                    )}
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
                    editingDisabled={editingDisabled}
                />
            );
        }

        return (
            <EditableCell
                value={params.value}
                row={params.row}
                field={params.field}
                onValueChange={onCellValueChange}
                editingDisabled={editingDisabled}
            />
        );
    };
