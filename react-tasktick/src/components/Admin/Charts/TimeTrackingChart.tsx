import React from "react";
import { Doughnut } from "react-chartjs-2";
import { ChartDataPoint } from "../../../services/adminService";

interface TimeTrackingChartProps {
    timeTrackingData: ChartDataPoint[];
}

const TimeTrackingChart: React.FC<TimeTrackingChartProps> = ({ timeTrackingData }) => {
    const timeTrackingChartData = {
        labels: timeTrackingData.map((item) => item.label),
        datasets: [
            {
                label: "Hours Tracked",
                data: timeTrackingData.map((item) => item.value),
                backgroundColor: [
                    "rgba(255, 99, 132, 0.8)",
                    "rgba(54, 162, 235, 0.8)",
                    "rgba(255, 206, 86, 0.8)",
                    "rgba(75, 192, 192, 0.8)",
                    "rgba(153, 102, 255, 0.8)",
                    "rgba(255, 159, 64, 0.8)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
            },
            title: {
                display: true,
                text: "Time Tracking Distribution",
            },
        },
        cutout: "70%",
    };

    return (
        <div className="chart-container">
            <Doughnut data={timeTrackingChartData} options={doughnutOptions} />
        </div>
    );
};

export default TimeTrackingChart; 