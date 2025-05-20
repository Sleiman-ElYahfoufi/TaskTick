import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import StatCards from "../../components/DashboardComponents/StatCards/StatCards";
import ActiveProjects from "../../components/DashboardComponents/ActiveProjects/ActiveProjects";
import ProductivityHeatmap from "../../components/DashboardComponents/ProductivityHeatmap/ProductivityHeatmap";
import AIInsights from "../../components/DashboardComponents/AIInsights/AIInsights";
import RecentActivity from "../../components/DashboardComponents/RecentActivity/RecentActivity";
import dashboardService from "../../services/dashboardService";
import "./Dashboard.css";

interface Project {
    id: string;
    name: string;
    hours: string;
    status: string;
    progress: number;
}

interface Insight {
    id: string;
    text: string;
}

interface ActivityItem {
    id: string;
    type: string;
    project?: string;
    description: string;
    timestamp: string;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    const userId = user?.id ? parseInt(user.id) : 1;

    const [stats, setStats] = useState({
        activeProjects: 0,
        tasksCompleted: 0,
        dueToday: 0,
    });

    const [projects, setProjects] = useState<Project[]>([]);
    const [insights, setInsights] = useState<Insight[]>([]);
    const [productivityData, setProductivityData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [activities] = useState<ActivityItem[]>([
        {
            id: "1",
            type: "task_added",
            project: "Database Migration",
            description: 'New task "Schema Validation" added',
            timestamp: "Today, 11:23 AM",
        },
        {
            id: "2",
            type: "task_added",
            project: "Database Migration",
            description: 'New task "Schema Validation" added',
            timestamp: "Today, 11:23 AM",
        },
        {
            id: "3",
            type: "task_added",
            project: "Database Migration",
            description: 'New task "Schema Validation" added',
            timestamp: "Today, 11:23 AM",
        },
    ]);

    useEffect(() => {
        let mounted = true;

        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                const [
                    statsData,
                    projectsData,
                    insightsData,
                    productivityData,
                ] = await Promise.all([
                    dashboardService.getStats(userId),
                    dashboardService.getActiveProjects(userId),
                    dashboardService.getAIInsights(userId),
                    dashboardService.getProductivityData(userId, 30),
                ]);

                if (mounted) {
                    setStats(statsData);

                    setProjects(projectsData as unknown as Project[]);
                    setInsights(insightsData);
                    setProductivityData(productivityData);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchDashboardData();

        return () => {
            mounted = false;
        };
    }, [userId]);

    const handleAddProject = () => {
        navigate("/dashboard/projects/new");
    };

    return (
        <div className="dashboard-page">
            <h1 className="page-title">Dashboard</h1>

            {loading ? (
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                </div>
            ) : (
                <>
                    <StatCards
                        activeProjects={stats.activeProjects}
                        tasksCompleted={stats.tasksCompleted}
                        dueToday={stats.dueToday}
                    />

                    <div className="dashboard-layout">
                        <div className="left-column">
                            <ActiveProjects
                                projects={projects}
                                onAddProject={handleAddProject}
                            />

                            <RecentActivity activities={activities} />
                        </div>

                        <div className="right-column">
                            <ProductivityHeatmap data={productivityData} />

                            <AIInsights insights={insights} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
