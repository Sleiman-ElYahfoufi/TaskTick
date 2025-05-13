import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";


const ProtectedRoute: React.FC = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const location = useLocation();

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/auth" state={{ from: location }} replace />
    );
};

export default ProtectedRoute;
