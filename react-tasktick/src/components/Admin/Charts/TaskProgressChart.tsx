import React from "react";
import { Bar } from "react-chartjs-2";

interface TaskProgressChartProps {
    tasksProgressData: { month: string; completed: number; pending: number }[];
}

const TaskProgressChart: React.FC<TaskProgressChartProps> = ({
    tasksProgressData,
}) => {
    const taskData = {
        labels: tasksProgressData.map((item) => item.month),
        datasets: [
            {
                label: "Completed Tasks",
                data: tasksProgressData.map((item) => item.completed),
                backgroundColor: "rgba(75, 192, 192, 0.7)",
            },
            {
                label: "Pending Tasks",
                data: tasksProgressData.map((item) => item.pending),
                backgroundColor: "rgba(255, 159, 64, 0.7)",
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Monthly Task Overview",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                stacked: false,
            },
            x: {
                stacked: false,
            },
        },
    };

    return (
        <div className="chart-container">
            <Bar data={taskData} options={barOptions} />
        </div>
    );
};

export default TaskProgressChart;
