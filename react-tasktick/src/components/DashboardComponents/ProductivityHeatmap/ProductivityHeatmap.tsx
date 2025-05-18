import React from "react";
import "./ProductivityHeatmap.css";
import { ResponsiveHeatMap } from "@nivo/heatmap";

interface ProductivityHeatmapProps {
    data?: any[];
}

const ProductivityHeatmap: React.FC<ProductivityHeatmapProps> = ({ data }) => {
    const defaultData = [
        {
            id: "9am",
            data: [
                { x: "Mon", y: 7 },
                { x: "Tue", y: 5 },
                { x: "Wed", y: 6 },
                { x: "Thu", y: 7 },
                { x: "Fri", y: 5 },
                { x: "Sat", y: 2 },
                { x: "Sun", y: 1 },
            ],
        },
        {
            id: "10am",
            data: [
                { x: "Mon", y: 9 },
                { x: "Tue", y: 8 },
                { x: "Wed", y: 9 },
                { x: "Thu", y: 8 },
                { x: "Fri", y: 7 },
                { x: "Sat", y: 3 },
                { x: "Sun", y: 2 },
            ],
        },
        {
            id: "11am",
            data: [
                { x: "Mon", y: 10 },
                { x: "Tue", y: 10 },
                { x: "Wed", y: 9 },
                { x: "Thu", y: 9 },
                { x: "Fri", y: 8 },
                { x: "Sat", y: 4 },
                { x: "Sun", y: 3 },
            ],
        },
        {
            id: "12pm",
            data: [
                { x: "Mon", y: 8 },
                { x: "Tue", y: 9 },
                { x: "Wed", y: 8 },
                { x: "Thu", y: 8 },
                { x: "Fri", y: 7 },
                { x: "Sat", y: 3 },
                { x: "Sun", y: 2 },
            ],
        },
        {
            id: "1pm",
            data: [
                { x: "Mon", y: 6 },
                { x: "Tue", y: 7 },
                { x: "Wed", y: 7 },
                { x: "Thu", y: 6 },
                { x: "Fri", y: 5 },
                { x: "Sat", y: 2 },
                { x: "Sun", y: 1 },
            ],
        },
        {
            id: "2pm",
            data: [
                { x: "Mon", y: 8 },
                { x: "Tue", y: 9 },
                { x: "Wed", y: 8 },
                { x: "Thu", y: 7 },
                { x: "Fri", y: 6 },
                { x: "Sat", y: 3 },
                { x: "Sun", y: 2 },
            ],
        },
        {
            id: "3pm",
            data: [
                { x: "Mon", y: 9 },
                { x: "Tue", y: 8 },
                { x: "Wed", y: 7 },
                { x: "Thu", y: 8 },
                { x: "Fri", y: 7 },
                { x: "Sat", y: 4 },
                { x: "Sun", y: 3 },
            ],
        },
        {
            id: "4pm",
            data: [
                { x: "Mon", y: 7 },
                { x: "Tue", y: 6 },
                { x: "Wed", y: 5 },
                { x: "Thu", y: 6 },
                { x: "Fri", y: 4 },
                { x: "Sat", y: 2 },
                { x: "Sun", y: 1 },
            ],
        },
        {
            id: "5pm",
            data: [
                { x: "Mon", y: 5 },
                { x: "Tue", y: 4 },
                { x: "Wed", y: 3 },
                { x: "Thu", y: 4 },
                { x: "Fri", y: 3 },
                { x: "Sat", y: 1 },
                { x: "Sun", y: 0 },
            ],
        },
    ];

    const isDataValid = data && Array.isArray(data) && data.length > 0;
    const heatmapData = isDataValid ? data : defaultData;

    return (
        <div className="productivity-trends">
            <div className="section-header">
                <h2>Productivity Trends</h2>
                <span className="subtitle">Peak Time vs Item</span>
            </div>

            <div className="heatmap-container">
                <ResponsiveHeatMap
                    data={heatmapData}
                    margin={{ top: 20, right: 10, bottom: 20, left: 40 }}
                    valueFormat=">-.2s"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 0,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "",
                        legendPosition: "middle",
                        legendOffset: 36,
                    }}
                    axisLeft={{
                        tickSize: 0,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "",
                        legendPosition: "middle",
                        legendOffset: -40,
                    }}
                    colors={{
                        type: "sequential",
                        scheme: "blues",
                        minValue: 0,
                        maxValue: 10,
                    }}
                    emptyColor="#f5f7fa"
                    borderRadius={2}
                    borderWidth={0}
                    borderColor={{
                        from: "color",
                        modifiers: [["darker", 0.1]],
                    }}
                    enableLabels={false}
                    legends={[]}
                    hoverTarget="cell"
                    animate={false}
                />
            </div>
        </div>
    );
};

export default ProductivityHeatmap;
