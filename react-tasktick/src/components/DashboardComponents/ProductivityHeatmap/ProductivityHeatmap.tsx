import React, { useState } from "react";
import "./ProductivityHeatmap.css";

interface ProductivityHeatmapProps {
    data?: any;
}

interface ProductivityBreakdown {
    date: string;
    hours: number;
    taskCount: number;
}

const ProductivityHeatmap: React.FC<ProductivityHeatmapProps> = ({ data }) => {
    // Debug: Log the data received
    console.log("ProductivityHeatmap received data:", data);

    const [tooltip, setTooltip] = useState<{
        show: boolean;
        content: string;
        x: number;
        y: number;
    }>({
        show: false,
        content: "",
        x: 0,
        y: 0,
    });

    const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

    const getGridData = () => {
        if (!data || !data.dailyBreakdown || data.dailyBreakdown.length === 0) {
            console.log("No data available, creating empty grid");
            return Array(7)
                .fill(0)
                .map(() =>
                    Array(7).fill({
                        date: "",
                        taskCount: 0,
                        hours: 0,
                    })
                );
        }

        const sortedData = [...data.dailyBreakdown].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const recentData = sortedData.slice(-49);
        console.log("Sorted and sliced data for grid:", recentData);

        const grid = [];
        let dataIndex = 0;

        for (let row = 0; row < 7; row++) {
            const rowData = [];
            for (let col = 0; col < 7; col++) {
                if (dataIndex < recentData.length) {
                    rowData.push(recentData[dataIndex]);
                    dataIndex++;
                } else {
                    rowData.push({ date: "", taskCount: 0, hours: 0 });
                }
            }
            grid.push(rowData);
        }

        return grid;
    };

    const getIntensity = (cell: ProductivityBreakdown): number => {
        // Debug: Log cell data and intensity
        const intensity =
            !cell || typeof cell.taskCount !== "number" || cell.taskCount <= 0
                ? 0
                : cell.taskCount === 1
                ? 1
                : cell.taskCount <= 3
                ? 2
                : cell.taskCount <= 5
                ? 3
                : 4;

        if (intensity > 0) {
            console.log(
                "Cell with non-zero intensity:",
                cell,
                "intensity:",
                intensity
            );
        }

        return intensity;
    };

    const handleMouseOver = (
        e: React.MouseEvent,
        cell: ProductivityBreakdown
    ) => {
        if (!cell || !cell.date) {
            setTooltip({ ...tooltip, show: false });
            return;
        }

        const date = new Date(cell.date);
        const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });

        setTooltip({
            show: true,
            content: `${formattedDate}: ${cell.taskCount} tasks${
                cell.hours > 0 ? ` (${cell.hours.toFixed(1)}h)` : ""
            }`,
            x: e.clientX,
            y: e.clientY - 40,
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ ...tooltip, show: false });
    };

    const gridData = getGridData();

    return (
        <div className="productivity-trends">
            <div className="section-header">
                <h2>Productivity Trends</h2>
                <span className="subtitle">Task Activity Heatmap</span>
            </div>

            <div className="heatmap-container">
                {/* Weekday labels */}
                <div className="weekday-labels">
                    {weekdays.map((day) => (
                        <div key={day} className="weekday-label">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="heatmap-grid-wrapper">
                    <div className="heatmap-grid">
                        {gridData.map((row, rowIndex) => (
                            <div
                                key={`row-${rowIndex}`}
                                className="heatmap-row"
                            >
                                {row.map((cell, cellIndex) => (
                                    <div
                                        key={`cell-${rowIndex}-${cellIndex}`}
                                        className={`heatmap-cell intensity-${getIntensity(
                                            cell
                                        )}`}
                                        onMouseMove={(e) =>
                                            handleMouseOver(e, cell)
                                        }
                                        onMouseLeave={handleMouseLeave}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {tooltip.show && (
                    <div
                        className="custom-tooltip"
                        style={{
                            left: `${tooltip.x}px`,
                            top: `${tooltip.y}px`,
                        }}
                    >
                        {tooltip.content}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductivityHeatmap;
