import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import StepIndicator from "../../components/AddProjectComponents/StepIndicator/StepIndicator";
import projectDecompositionService, {
    ProjectDetailsDto,
} from "../../services/projectDecompositionService";
import { PriorityLevel, DetailDepth } from "../../types/priority";
import TaskBreakerLoader from "../../components/Loader/TaskBreakerLoader";
import "./AddProject.css";

const AddProject: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [priority, setPriority] = useState<PriorityLevel>(PriorityLevel.HIGH);
    const [detailDepth, setDetailDepth] = useState<DetailDepth>(
        DetailDepth.NORMAL
    );
    const [deadline, setDeadline] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateTasks = async () => {
        if (!projectName.trim()) {
            setError("Please enter a project name");
            return;
        }

        if (!projectDescription.trim()) {
            setError("Please enter a project description");
            return;
        }

        const userId = user?.id ? parseInt(user.id) : 0;

        if (userId === 0) {
            setError("Invalid user ID. Please log in again.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const projectDetails: ProjectDetailsDto = {
                name: projectName,
                description: projectDescription,
                priority: priority.toLowerCase(),
                detail_depth: detailDepth.toLowerCase(),
            };

            if (deadline) {
                projectDetails.deadline = deadline;
            }

            const result = await projectDecompositionService.generateTasks({
                projectDetails,
                userId,
            });

            sessionStorage.setItem(
                "decompositionResult",
                JSON.stringify(result)
            );

            setTimeout(() => {
                navigate("/dashboard/generated-tasks");
                setIsLoading(false);
            }, 3000);
        } catch (err: any) {
            let errorMessage = "Failed to generate tasks. Please try again.";

            if (err.response && err.response.data) {
                if (typeof err.response.data === "string") {
                    errorMessage = err.response.data;
                } else if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                }

                // For content policy violations, provide a more helpful message
                if (errorMessage.includes("cannot be processed")) {
                    errorMessage =
                        "Your project description contains content that cannot be processed. Please revise it and avoid using sensitive or inappropriate language.";
                }
            }

            setError(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <div className="add-project-container">
            <TaskBreakerLoader isGenerating={isLoading} />
            <h1 className="add-project-title">Add New Project</h1>

            <div className="add-project-content">
                <StepIndicator
                    steps={[
                        { number: 1, label: "Project Details" },
                        { number: 2, label: "Generated Tasks" },
                    ]}
                    currentStep={1}
                />

                <div className="project-details-form">
                    <h2 className="form-section-title">Project Details</h2>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="projectName">Project Name</label>
                        <input
                            type="text"
                            id="projectName"
                            className="form-control"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="Enter project name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="projectDescription">
                            Project Description
                        </label>
                        <textarea
                            id="projectDescription"
                            className="form-control"
                            rows={5}
                            value={projectDescription}
                            onChange={(e) =>
                                setProjectDescription(e.target.value)
                            }
                            placeholder="Describe your project..."
                        />
                    </div>

                    <div className="form-options">
                        <div className="form-option">
                            <label>Priority</label>
                            <select
                                className="form-control select-input"
                                value={priority}
                                onChange={(e) =>
                                    setPriority(e.target.value as PriorityLevel)
                                }
                            >
                                <option value={PriorityLevel.HIGH}>High</option>
                                <option value={PriorityLevel.MEDIUM}>
                                    Medium
                                </option>
                                <option value={PriorityLevel.LOW}>Low</option>
                            </select>
                        </div>

                        <div className="form-option">
                            <label>Detail Level</label>
                            <select
                                className="form-control select-input"
                                value={detailDepth}
                                onChange={(e) =>
                                    setDetailDepth(
                                        e.target.value as DetailDepth
                                    )
                                }
                            >
                                <option value={DetailDepth.MINIMAL}>
                                    Minimal
                                </option>
                                <option value={DetailDepth.NORMAL}>
                                    Normal
                                </option>
                                <option value={DetailDepth.DETAILED}>
                                    Detailed
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="deadline">
                            Project Deadline (Optional)
                        </label>
                        <input
                            type="date"
                            id="deadline"
                            className="form-control"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            className="generate-tasks-btn"
                            onClick={handleGenerateTasks}
                            disabled={isLoading}
                        >
                            {isLoading ? "Generating..." : "Generate Tasks"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProject;
