import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";
import TaskTickLogo from "../../assets/Sleiman_ElYahfoufi_TaskTick.png";
import OnboardingImage from "../../assets/OnboardingImage.png";
import api from "../../utils/api";
import { useAppSelector } from "../../store/hooks";

enum UserRole {
    WEB_DEVELOPER = "Web Developer",
    MOBILE_DEVELOPER = "Mobile Developer",
    BACKEND_DEVELOPER = "Backend Developer",
    FULLSTACK_DEVELOPER = "Fullstack Developer",
    SOFTWARE_ENGINEER = "Software Engineer",
}

enum ExperienceLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    EXPERT = "expert",
}

interface ExperienceLevelOption {
    label: string;
    value: ExperienceLevel;
    years: string;
}

interface TechStack {
    id: number;
    name: string;
    category: string;
}

interface UserTechSelection {
    techId: number;
    proficiency: number;
}

const CATEGORIES = ["FRONTEND", "BACKEND", "DATABASE", "DEVOPS", "MOBILE"];

const USER_STORAGE_KEY = "userData";

const Onboarding: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
    const [selectedExperience, setSelectedExperience] = useState<
        ExperienceLevel | ""
    >("");
    const [techStacks, setTechStacks] = useState<TechStack[]>([]);
    const [selectedTechs, setSelectedTechs] = useState<UserTechSelection[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [apiStatus, setApiStatus] = useState<string>("");

    const navigate = useNavigate();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const getEffectiveUser = () => {
        if (user?.id) return user;

        try {
            const storedData = localStorage.getItem(USER_STORAGE_KEY);
            return storedData ? JSON.parse(storedData) : null;
        } catch (e) {
            return null;
        }
    };

    const effectiveUser = getEffectiveUser();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/auth", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchTechStacks = async () => {
            try {
                setIsLoading(true);
                setApiStatus("Fetching tech stacks...");

                const response = await api.get<TechStack[]>("/tech-stacks");

                if (response.data && Array.isArray(response.data)) {
                    setTechStacks(response.data);
                    setApiStatus(`Loaded ${response.data.length} tech stacks`);
                } else {
                    setError("Invalid API response format");
                    setApiStatus("Error: Invalid API response format");
                }
            } catch (err: any) {
                setError(
                    `Failed to load technologies: ${
                        err.message || "Unknown error"
                    }`
                );
                setApiStatus(`API Error: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchTechStacks();
        }
    }, [isAuthenticated]);

    const experienceLevels: ExperienceLevelOption[] = [
        {
            label: "Beginner",
            value: ExperienceLevel.BEGINNER,
            years: "Less than 1 year of experience",
        },
        {
            label: "Intermediate",
            value: ExperienceLevel.INTERMEDIATE,
            years: "1-3 years of experience",
        },
        {
            label: "Expert",
            value: ExperienceLevel.EXPERT,
            years: "3+ years of experience",
        },
    ];

    const handleTechnologyToggle = (tech: TechStack) => {
        if (selectedTechs.some((item) => item.techId === tech.id)) {
            setSelectedTechs(
                selectedTechs.filter((item) => item.techId !== tech.id)
            );
        } else {
            setSelectedTechs([
                ...selectedTechs,
                { techId: tech.id, proficiency: 3 },
            ]);
        }
    };

    const handleProficiencyChange = (techId: number, proficiency: number) => {
        setSelectedTechs(
            selectedTechs.map((item) =>
                item.techId === techId ? { ...item, proficiency } : item
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !selectedRole ||
            !selectedExperience ||
            selectedTechs.length === 0
        ) {
            setError("Please complete all fields before continuing");
            return;
        }

        if (!effectiveUser?.id) {
            setError(
                "User information is missing. Please try logging in again."
            );
            return;
        }

        try {
            setIsLoading(true);
            setApiStatus("Saving your preferences...");

            await api.patch(`/users/${effectiveUser.id}`, {
                role: selectedRole,
                experience_level: selectedExperience,
            });

            setApiStatus("Profile updated, saving tech selections...");

            await Promise.all(
                selectedTechs.map((selection) =>
                    api.post("/user-tech-stacks", {
                        user_id: effectiveUser.id,
                        tech_id: selection.techId,
                        proficiency_level: selection.proficiency,
                    })
                )
            );

            setApiStatus("Onboarding complete! Redirecting to dashboard...");

            setTimeout(() => navigate("/dashboard"), 800);
        } catch (err: any) {
            if (err.response) {
                const { status, data } = err.response;

                if (status === 401) {
                    setError("Authentication error. Please log in again.");
                } else if (status === 400) {
                    const message = Array.isArray(data.message)
                        ? data.message.join(", ")
                        : data.message || JSON.stringify(data);
                    setError(`Invalid data: ${message}`);
                } else {
                    setError(
                        `Server error (${status}): ${
                            data.message || "Unknown error"
                        }`
                    );
                }
            } else if (err.request) {
                setError(
                    "No response from server. Please check your connection."
                );
            } else {
                setError(`Error: ${err.message || "Unknown error occurred"}`);
            }

            setApiStatus(`Failed: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const techsByCategory = CATEGORIES.reduce((acc, category) => {
        acc[category] = techStacks.filter(
            (tech) => tech.category.toUpperCase() === category.toUpperCase()
        );
        return acc;
    }, {} as Record<string, TechStack[]>);

    const uncategorizedTechs = techStacks.filter(
        (tech) =>
            !CATEGORIES.some(
                (category) =>
                    category.toUpperCase() === tech.category.toUpperCase()
            )
    );

    if (uncategorizedTechs.length > 0) {
        techsByCategory["OTHER"] = uncategorizedTechs;
    }

    const hasTechStacks = techStacks.length > 0;
    const hasTechStacksByCategory = Object.values(techsByCategory).some(
        (techs) => techs.length > 0
    );

    return (
        <div className="onboarding-container">
            <div className="onboarding-content">
                <div className="onboarding-left">
                    <div className="onboarding-header">
                        <img
                            src={TaskTickLogo}
                            alt="TaskTick"
                            className="logo"
                        />
                        <h2>Tell us about yourself</h2>
                        <p>Help us personalize your time estimates</p>
                    </div>

                    {error && <div className="onboarding-error">{error}</div>}
                    {apiStatus && <div className="api-status">{apiStatus}</div>}

                    <form onSubmit={handleSubmit} className="onboarding-form">
                        <div className="form-group">
                            <label>I am a...</label>
                            <select
                                value={selectedRole}
                                onChange={(e) =>
                                    setSelectedRole(e.target.value as UserRole)
                                }
                                className="form-select"
                                disabled={isLoading}
                            >
                                <option value="">Select your role</option>
                                <option value={UserRole.WEB_DEVELOPER}>
                                    Web Developer
                                </option>
                                <option value={UserRole.MOBILE_DEVELOPER}>
                                    Mobile Developer
                                </option>
                                <option value={UserRole.FULLSTACK_DEVELOPER}>
                                    Fullstack Developer
                                </option>
                                <option value={UserRole.BACKEND_DEVELOPER}>
                                    Backend Developer
                                </option>
                                <option value={UserRole.SOFTWARE_ENGINEER}>
                                    Software Engineer
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>My experience level is...</label>
                            <div className="experience-options">
                                {experienceLevels.map((level) => (
                                    <label
                                        key={level.value}
                                        className="experience-option"
                                    >
                                        <input
                                            type="radio"
                                            name="experience"
                                            value={level.value}
                                            checked={
                                                selectedExperience ===
                                                level.value
                                            }
                                            onChange={(e) =>
                                                setSelectedExperience(
                                                    e.target
                                                        .value as ExperienceLevel
                                                )
                                            }
                                            disabled={isLoading}
                                        />
                                        <div className="experience-card">
                                            <span className="experience-label">
                                                {level.label}
                                            </span>
                                            <span className="experience-years">
                                                {level.years}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group tech-selection-container">
                            <label>
                                Technologies I'm proficient in (select all that
                                apply)
                            </label>

                            {isLoading ? (
                                <div className="loading-indicator">
                                    Loading technologies...
                                </div>
                            ) : !hasTechStacks ? (
                                <div className="tech-error">
                                    No technology stacks found.
                                </div>
                            ) : !hasTechStacksByCategory ? (
                                <div className="tech-error">
                                    No technologies found in any category.
                                </div>
                            ) : (
                                Object.entries(techsByCategory).map(
                                    ([category, techs]) =>
                                        techs.length > 0 && (
                                            <div
                                                key={category}
                                                className="tech-category-section"
                                            >
                                                <h3 className="tech-category-heading">
                                                    {category}
                                                </h3>
                                                <div className="technology-grid">
                                                    {techs.map((tech) => {
                                                        const isSelected =
                                                            selectedTechs.some(
                                                                (item) =>
                                                                    item.techId ===
                                                                    tech.id
                                                            );
                                                        const selectedTech =
                                                            selectedTechs.find(
                                                                (item) =>
                                                                    item.techId ===
                                                                    tech.id
                                                            );

                                                        return (
                                                            <div
                                                                key={tech.id}
                                                                className="tech-selection-item"
                                                            >
                                                                <button
                                                                    type="button"
                                                                    className={`tech-option ${
                                                                        isSelected
                                                                            ? "selected"
                                                                            : ""
                                                                    }`}
                                                                    onClick={() =>
                                                                        handleTechnologyToggle(
                                                                            tech
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isLoading
                                                                    }
                                                                >
                                                                    {tech.name}
                                                                </button>

                                                                {isSelected && (
                                                                    <div className="proficiency-selector">
                                                                        <label className="proficiency-label">
                                                                            Proficiency:
                                                                        </label>
                                                                        <div className="proficiency-levels">
                                                                            {[
                                                                                1,
                                                                                2,
                                                                                3,
                                                                                4,
                                                                                5,
                                                                            ].map(
                                                                                (
                                                                                    level
                                                                                ) => (
                                                                                    <button
                                                                                        key={
                                                                                            level
                                                                                        }
                                                                                        type="button"
                                                                                        className={`proficiency-level ${
                                                                                            selectedTech?.proficiency ===
                                                                                            level
                                                                                                ? "active"
                                                                                                : ""
                                                                                        }`}
                                                                                        onClick={() =>
                                                                                            handleProficiencyChange(
                                                                                                tech.id,
                                                                                                level
                                                                                            )
                                                                                        }
                                                                                        disabled={
                                                                                            isLoading
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            level
                                                                                        }
                                                                                    </button>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )
                                )
                            )}
                        </div>

                        <button
                            type="submit"
                            className="continue-button"
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Continue to Dashboard"}
                        </button>
                    </form>
                </div>

                <div className="onboarding-right">
                    <img
                        src={OnboardingImage}
                        alt="Authentication illustration"
                        className="onboarding-image"
                    />
                    <div className="estimates-info">
                        <h3>Estimates that improve with your work</h3>
                        <p>
                            Our AI learns from your development patterns to
                            create increasingly accurate time estimates for your
                            projects.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
