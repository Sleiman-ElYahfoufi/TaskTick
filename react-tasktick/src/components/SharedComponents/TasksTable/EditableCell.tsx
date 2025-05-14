import React, { useCallback, memo, useEffect, useState, useRef } from "react";

export interface EditableCellProps {
    value: any;
    row: any;
    field: string;
    onValueChange: (id: string | number, field: string, value: any) => void;
}

export const EditableCell = memo(
    ({ value, row, field, onValueChange }: EditableCellProps) => {
        const [isEditing, setIsEditing] = useState(false);
        const [editValue, setEditValue] = useState(value);
        const inputRef = useRef<HTMLInputElement>(null);

        const formatForDisplay = (val: any): string => {
            if (val === null || val === undefined) return "";
            return val instanceof Date ? val.toLocaleDateString() : String(val);
        };

        const processValue = useCallback(
            (rawValue: any, forEditing = false) => {
                if (rawValue instanceof Date) {
                    return forEditing
                        ? rawValue.toISOString().split("T")[0]
                        : rawValue.toLocaleDateString();
                }

                if (
                    field === "estimatedTime" &&
                    typeof rawValue === "string" &&
                    forEditing
                ) {
                    return rawValue.replace(/\s*hrs\s*$/i, "").trim();
                }

                return rawValue;
            },
            [field]
        );

        useEffect(() => {
            if (isEditing && inputRef.current) {
                inputRef.current.focus();
                inputRef.current.select();
            }
        }, [isEditing]);

        useEffect(() => {
            if (!isEditing) {
                setEditValue(processValue(value, true));
            }
        }, [value, isEditing, processValue]);

        const handleClick = () => {
            setIsEditing(true);
            setEditValue(processValue(value, true));
        };

        const finishEditing = () => {
            setIsEditing(false);

            const processedCurrent = processValue(editValue, true);
            const processedOriginal = processValue(value, true);

            if (processedCurrent === processedOriginal) {
                return;
            }

            if (field === "estimatedTime") {
                const numStr = String(editValue).replace(/[^\d.]/g, "");
                const numValue = parseFloat(numStr);

                if (!isNaN(numValue)) {
                    onValueChange(row.id, field, numValue);
                }
                return;
            }

            onValueChange(row.id, field, editValue);
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                finishEditing();
            } else if (e.key === "Escape") {
                setIsEditing(false);
                setEditValue(processValue(value, true));
            }
        };

        return (
            <div
                className="editable-cell-container"
                onClick={!isEditing ? handleClick : undefined}
            >
                {isEditing ? (
                    <input
                        ref={inputRef}
                        className="editable-cell-input"
                        value={
                            editValue !== null && editValue !== undefined
                                ? String(editValue)
                                : ""
                        }
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={finishEditing}
                        onKeyDown={handleKeyDown}
                    />
                ) : (
                    <div className="editable-cell-display">
                        {formatForDisplay(value)}
                    </div>
                )}
            </div>
        );
    }
);
