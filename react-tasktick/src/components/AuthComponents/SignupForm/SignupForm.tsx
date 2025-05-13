import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../AuthForms.css";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { register, clearError } from "../../../store/slices/authSlice";

interface SignupFormProps {
    onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error, isAuthenticated } = useAppSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/onboarding", { replace: true });
        }

        return () => {
            dispatch(clearError());
        };
    }, [isAuthenticated, navigate, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (formErrors[name]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        const { username, email, password, confirmPassword, termsAccepted } =
            formData;

        if (!username || username.length < 3) {
            errors.username = "Username must be at least 3 characters";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.email = "Please enter a valid email address";
        }

        if (!password || password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        if (!confirmPassword || password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        if (!termsAccepted) {
            errors.termsAccepted = "You must accept the Terms & Conditions";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            const { username, email, password } = formData;
            dispatch(register({ username, email, password }));
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="signup-form">
            <h2>Join & Use the Best Growing Project Manager</h2>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="johndadev"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    {formErrors.username && (
                        <div className="field-error">{formErrors.username}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="johndoe@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    {formErrors.email && (
                        <div className="field-error">{formErrors.email}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
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
                    {formErrors.password && (
                        <div className="field-error">{formErrors.password}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                    {formErrors.confirmPassword && (
                        <div className="field-error">
                            {formErrors.confirmPassword}
                        </div>
                    )}
                </div>

                <div className="form-submit-row">
                    <label className="remember-me">
                        <input
                            type="checkbox"
                            name="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <span>I accept the Terms & Conditions</span>
                    </label>
                    {formErrors.termsAccepted && (
                        <div className="field-error terms-error">
                            {formErrors.termsAccepted}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="auth-button compact"
                        disabled={isLoading}
                    >
                        {isLoading ? "SIGNING UP..." : "SIGN UP"}
                    </button>
                </div>
            </form>

            <div className="auth-footer">
                <p className="auth-switch">
                    Own an Account?
                    <button
                        onClick={onSwitchToLogin}
                        className="switch-button"
                        disabled={isLoading}
                    >
                        JUMP RIGHT IN
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignupForm;
