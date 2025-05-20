import { Routes, Route } from "react-router-dom";
import Landing from "../../pages/Landing/Landing";
import Auth from "../../pages/Auth/Auth";
import Onboarding from "../../pages/Onboarding/Onboarding";
import Tasks from "../../pages/Tasks/Tasks";
import Settings from "../../pages/Settings/Settings";
import ProjectDetails from "../../pages/ProjectDetails/ProjectDetails";
import GeneratedTasks from "../../pages/GeneratedTasks/GeneratedTasks";
import AddProject from "../../pages/AddProject/AddProject";
import Projects from "../../pages/Projects/Projects";
import Dashboard from "../../pages/Dashboard/Dashboard";
import Analytics from "../../pages/Analytics/Analytics";
import DashboardLayout from "../../pages/DashboardLayout/DashboardLayout";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import AdminRoute from "../AdminRoute/AdminRoute";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="projects" element={<Projects />} />
                    <Route
                        path="projects/:projectId"
                        element={<ProjectDetails />}
                    />
                    <Route path="projects/new" element={<AddProject />} />
                    <Route
                        path="generated-tasks"
                        element={<GeneratedTasks />}
                    />
                    <Route path="tasks" element={<Tasks />} />
                    <Route path="settings" element={<Settings />} />
                    <Route element={<AdminRoute />}>
                        <Route path="analytics" element={<Analytics />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
