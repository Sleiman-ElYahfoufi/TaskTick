import React from "react";
import { Pie } from "react-chartjs-2";
import { ChartDataPoint } from "../../../services/adminService";

interface ProjectStatusChartProps {
    projectStatusData: ChartDataPoint[];
}

const ProjectStatusChart: React.FC<ProjectStatusChartProps> = ({ projectStatusData }) => {
    const projectData = {
        labels: projectStatusData.map((item) => item.label),
        datasets: [
            {
                label: "Projects by Status",
                data: projectStatusData.map((item) => item.value),
                backgroundColor: [
                    "rgba(54, 162, 235, 0.8)",
                    "rgba(75, 192, 192, 0.8)",
                    "rgba(255, 206, 86, 0.8)",
                    "rgba(153, 102, 255, 0.8)",
                ],
                borderColor: [
                    "rgba(54, 162, 235, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "right" as const,
            },
            title: {
                display: true,
                text: "Project Distribution",
            },
        },
    };

    return (
        <div className="chart-container">
            <Pie data={projectData} options={pieOptions} />
        </div>
    );
};

export default ProjectStatusChart; 