import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import TaskTickLogo from "../../../assets/just_logo.png";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logout } from "../../../store/slices/authSlice";

interface SidebarProps {
    isOpen: boolean;
    closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const isAdmin = user?.system_role === 'admin';

    const isActive = (path: string) => {
        return (
            location.pathname === path ||
            location.pathname.startsWith(`${path}/`)
        );
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/auth");
    };

    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-content">
                <div className="sidebar-close-mobile" onClick={closeSidebar}>
                    ×
                </div>
                <div className="sidebar-header">
                    <img src={TaskTickLogo} alt="TaskTick" className="logo" />
                    <h1>TaskTick</h1>
                </div>

                <nav className="sidebar-nav">
                    <Link
                        to="/dashboard"
                        className={`nav-item ${
                            isActive("/dashboard") &&
                            location.pathname === "/dashboard"
                                ? "active"
                                : ""
                        }`}
                        onClick={closeSidebar}
                    >
                        <span className="nav-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                        </span>
                        <span className="nav-text">Dashboard</span>
                    </Link>

                    <Link
                        to="/dashboard/projects"
                        className={`nav-item ${
                            isActive("/dashboard/projects") ? "active" : ""
                        }`}
                        onClick={closeSidebar}
                    >
                        <span className="nav-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </span>
                        <span className="nav-text">Projects</span>
                    </Link>

                    <Link
                        to="/dashboard/tasks"
                        className={`nav-item ${
                            isActive("/dashboard/tasks") ? "active" : ""
                        }`}
                        onClick={closeSidebar}
                    >
                        <span className="nav-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M9 11l3 3L22 4"></path>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                            </svg>
                        </span>
                        <span className="nav-text">Tasks</span>
                    </Link>

                    {/* Analytics link - only visible to admins */}
                    {isAdmin && (
                        <Link
                            to="/dashboard/analytics"
                            className={`nav-item ${
                                isActive("/dashboard/analytics") ? "active" : ""
                            }`}
                            onClick={closeSidebar}
                        >
                            <span className="nav-icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="20" x2="18" y2="10"></line>
                                    <line x1="12" y1="20" x2="12" y2="4"></line>
                                    <line x1="6" y1="20" x2="6" y2="14"></line>
                                </svg>
                            </span>
                            <span className="nav-text">Analytics</span>
                        </Link>
                    )}

                    <Link
                        to="/dashboard/settings"
                        className={`nav-item ${
                            isActive("/dashboard/settings") ? "active" : ""
                        }`}
                        onClick={closeSidebar}
                    >
                        <span className="nav-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                        </span>
                        <span className="nav-text">Settings</span>
                    </Link>
                </nav>
            </div>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="avatar">
                        <span>
                            {user?.username
                                ? user.username.charAt(0).toUpperCase()
                                : "U"}
                        </span>
                    </div>
                    <div className="user-info">
                        <h3>{user?.username || "User"}</h3>
                        <p>{user?.email || "user@example.com"}</p>
                        {isAdmin && <span className="admin-badge">Admin</span>}
                    </div>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                    <span className="logout-icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </span>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
