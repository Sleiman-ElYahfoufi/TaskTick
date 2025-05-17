import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import "./App.css";
import Auth from "./pages/Auth/Auth";
import Onboarding from "./pages/Onboarding/Onboarding";
import Tasks from "./pages/Tasks/Tasks";
import Settings from "./pages/Settings/Settings";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import GeneratedTasks from "./pages/GeneratedTasks/GeneratedTasks";
import AddProject from "./pages/AddProject/AddProject";
import Projects from "./pages/Projects/Projects";
import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardLayout from "./pages/DashboardLayout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <Router>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
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
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
