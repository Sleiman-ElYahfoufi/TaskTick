import React, { useState } from "react";
import "./ProfileInputs.css";

interface ProfileInputsProps {
    username: string;
    setUsername: (username: string) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    role: string;
    setRole: (role: string) => void;
    experience: string;
    setExperience: (experience: string) => void;
}

interface ExperienceLevel {
    label: string;
    years: string;
}

const ProfileInputs: React.FC<ProfileInputsProps> = ({
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    experience,
    setExperience,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const experienceLevels: ExperienceLevel[] = [
        { label: "Beginner", years: "Less than 1 year of experience" },
        { label: "Intermediate", years: "1-3 years of experience" },
        { label: "Expert", years: "3+ years of experience" },
    ];

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="settings-form-row">
            <div className="settings-left-column">
                <div className="settings-form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="settings-form-input"
                    />
                </div>

                <div className="settings-form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="settings-form-input"
                    />
                </div>

                <div className="settings-form-group">
                    <label>Password (leave empty to keep current)</label>
                    <div className="settings-password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="settings-form-input"
                            placeholder="Enter new password"
                        />
                        <button
                            type="button"
                            className="settings-password-toggle"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className="settings-form-group">
                    <label>Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="settings-form-select"
                    >
                        <option value="Web Developer">Web Developer</option>
                        <option value="Mobile Developer">
                            Mobile Developer
                        </option>
                        <option value="Full Stack Developer">
                            Full Stack Developer
                        </option>
                        <option value="Frontend Developer">
                            Frontend Developer
                        </option>
                        <option value="Backend Developer">
                            Backend Developer
                        </option>
                    </select>
                </div>
            </div>

            <div className="settings-right-column">
                <div className="settings-form-group settings-experience-group">
                    <label>Experience level</label>
                    <div className="settings-experience-options">
                        {experienceLevels.map((level) => (
                            <label
                                key={level.label}
                                className="settings-experience-option"
                            >
                                <input
                                    type="radio"
                                    name="experience"
                                    value={level.label.toLowerCase()}
                                    checked={
                                        experience.toLowerCase() ===
                                        level.label.toLowerCase()
                                    }
                                    onChange={(e) =>
                                        setExperience(e.target.value)
                                    }
                                />
                                <div className="settings-experience-card">
                                    <div className="settings-radio-circle"></div>
                                    <div className="settings-experience-text">
                                        <span className="settings-experience-label">
                                            {level.label}
                                        </span>
                                        <span className="settings-experience-years">
                                            {level.years}
                                        </span>
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileInputs;
