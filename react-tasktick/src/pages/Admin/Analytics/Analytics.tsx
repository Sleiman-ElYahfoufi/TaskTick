import React, { useEffect, useState } from "react";
import "./Analytics.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import adminService, {
    AnalyticsOverview,
    ChartDataPoint,
} from "../../../services/adminService";
import {
    UserGrowthChart,
    TaskProgressChart,
    ProjectStatusChart,
    TimeTrackingChart,
    SummaryCards,
    DetailsGrid,
} from "../../../components/Admin/Charts";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Analytics: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
    const [userGrowthData, setUserGrowthData] = useState<ChartDataPoint[]>([]);
    const [projectStatusData, setProjectStatusData] = useState<
        ChartDataPoint[]
    >([]);
    const [tasksProgressData, setTasksProgressData] = useState<
        { month: string; completed: number; pending: number }[]
    >([]);
    const [timeTrackingData, setTimeTrackingData] = useState<ChartDataPoint[]>(
        []
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [
                    overviewData,
                    userGrowth,
                    projectStatus,
                    tasksProgress,
                    timeTracking,
                ] = await Promise.all([
                    adminService.getAnalyticsOverview(),
                    adminService.getUserGrowthData(),
                    adminService.getProjectStatusData(),
                    adminService.getTasksProgressData(),
                    adminService.getTimeTrackingData(),
                ]);

                setOverview(overviewData);
                setUserGrowthData(userGrowth);
                setProjectStatusData(projectStatus);
                setTasksProgressData(tasksProgress);
                setTimeTrackingData(timeTracking);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateChange = (
        currentValue: number,
        previousValue: number
    ): [number, boolean] => {
        if (previousValue === 0) return [0, true];
        const change = ((currentValue - previousValue) / previousValue) * 100;
        return [Math.round(change), change >= 0];
    };

    let userChange: [number, boolean] = [0, true];
    let taskChange: [number, boolean] = [0, true];

    if (userGrowthData.length >= 2) {
        const current = userGrowthData[userGrowthData.length - 1].value;
        const previous = userGrowthData[userGrowthData.length - 2].value;
        userChange = calculateChange(current, previous);
    }

    if (tasksProgressData.length >= 2) {
        const current =
            tasksProgressData[tasksProgressData.length - 1].completed;
        const previous =
            tasksProgressData[tasksProgressData.length - 2].completed;
        taskChange = calculateChange(current, previous);
    }

    return (
        <div className="analytics-container">
            <h1>Analytics Dashboard</h1>
            <p className="subtitle">Admin-only analytics and insights</p>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading analytics data...</p>
                </div>
            ) : (
                <>
                    <SummaryCards
                        overview={overview}
                        userChange={userChange}
                        taskChange={taskChange}
                        timeTrackingData={timeTrackingData}
                    />

                    <div className="analytics-charts">
                        <div className="analytics-card chart-card">
                            <UserGrowthChart userGrowthData={userGrowthData} />
                        </div>

                        <div className="analytics-card chart-card">
                            <TaskProgressChart
                                tasksProgressData={tasksProgressData}
                            />
                        </div>

                        <div className="analytics-card chart-card">
                            <ProjectStatusChart
                                projectStatusData={projectStatusData}
                            />
                        </div>

                        <div className="analytics-card chart-card">
                            <TimeTrackingChart
                                timeTrackingData={timeTrackingData}
                            />
                        </div>
                    </div>

                    <DetailsGrid overview={overview} />
                </>
            )}
        </div>
    );
};

export default Analytics;
