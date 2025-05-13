import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "../AuthForms.css";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { login, clearError } from "../../../store/slices/authSlice";

interface LoginFormProps {
    onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading, error, isAuthenticated } = useAppSelector(
        (state) => state.auth
    );

    // Redirect if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from =
                (location.state as any)?.from?.pathname || "/dashboard";
            navigate(from, { replace: true });
        }

        // Clear errors on unmount
        return () => {
            dispatch(clearError());
        };
    }, [isAuthenticated, navigate, location, dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            return;
        }

        try {
            await dispatch(login({ username, password })).unwrap();
            // Redirect handled by useEffect
        } catch (err) {
            // Error already handled by Redux
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="login-form">
            <h2>Join & Use the Best Growing Project Manager</h2>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="johndadev"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                </div>

                <div className="form-submit-row">
                    <label className="remember-me">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            disabled={isLoading}
                        />
                        <span>Remember Me</span>
                    </label>
                    <button
                        type="submit"
                        className="auth-button compact"
                        disabled={isLoading}
                    >
                        {isLoading ? "SIGNING IN..." : "SIGN IN"}
                    </button>
                </div>
            </form>

            <div className="auth-footer">
                <p className="auth-switch">
                    Don't have an account?
                    <button
                        onClick={onSwitchToSignup}
                        className="switch-button"
                        disabled={isLoading}
                    >
                        SIGN UP
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
