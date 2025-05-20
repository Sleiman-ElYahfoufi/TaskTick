import React from "react";
import { Line } from "react-chartjs-2";
import { ChartDataPoint } from "../../../services/adminService";

interface UserGrowthChartProps {
    userGrowthData: ChartDataPoint[];
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({
    userGrowthData,
}) => {
    const userData = {
        labels: userGrowthData.map((item) => item.label),
        datasets: [
            {
                label: "New Users",
                data: userGrowthData.map((item) => item.value),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "User Growth",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="chart-container">
            <Line data={userData} options={lineOptions} />
        </div>
    );
};

export default UserGrowthChart;
