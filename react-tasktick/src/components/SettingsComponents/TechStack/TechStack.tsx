import React, { useState, useEffect, useRef, useCallback } from "react";
import "./TechStack.css";
import api from "../../../utils/api";

interface TechStackProps {
    technologies: string[];
    setTechnologies: React.Dispatch<React.SetStateAction<string[]>>;
    userId?: number;
    onTechSelectionsChange?: (selections: UserTechSelection[]) => void;
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

interface UserTechStackData {
    id?: number;
    user_id: number;
    tech_id: number;
    proficiency_level: number;
    techStack?: {
        id: number;
        name: string;
        category: string;
    };
}

const CATEGORIES = ["FRONTEND", "BACKEND", "DATABASE", "DEVOPS", "MOBILE"];

const TechStack: React.FC<TechStackProps> = ({
    technologies,
    setTechnologies,
    userId,
    onTechSelectionsChange,
}) => {
    const [techStacks, setTechStacks] = useState<TechStack[]>([]);
    const [selectedTechs, setSelectedTechs] = useState<UserTechSelection[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [_, setError] = useState("");
    const [userTechStacks, setUserTechStacks] = useState<UserTechStackData[]>(
        []
    );

    
    const initializedRef = useRef(false);
    const shouldUpdateParentRef = useRef(false);
    const userInteractionRef = useRef(false);

    
    useEffect(() => {
        const fetchTechStacks = async () => {
            try {
                setIsLoading(true);
                const response = await api.get<TechStack[]>("/tech-stacks");

                if (response.data && Array.isArray(response.data)) {
                    setTechStacks(response.data);
                } else {
                    setError("Invalid API response format");
                }
            } catch (err: any) {
                setError(
                    `Failed to load technologies: ${
                        err.message || "Unknown error"
                    }`
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchTechStacks();
    }, []);

    
    useEffect(() => {
        if (!userId) return;

        const fetchUserTechStacks = async () => {
            try {
                const response = await api.get<UserTechStackData[]>(
                    `/user-tech-stacks?userId=${userId}`
                );
                if (response.data && Array.isArray(response.data)) {
                    setUserTechStacks(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch user tech stacks:", err);
            }
        };

        fetchUserTechStacks();
    }, [userId]);

    
    useEffect(() => {
        
        if (initializedRef.current || !techStacks.length || isLoading) {
            return;
        }

        
        if (userTechStacks.length > 0) {
            const selections = userTechStacks.map((item) => ({
                techId: item.tech_id,
                proficiency: item.proficiency_level,
            }));

            setSelectedTechs(selections);

            
            const techNames = selections
                .map((selection) => {
                    const tech = techStacks.find(
                        (t) => t.id === selection.techId
                    );
                    return tech ? tech.name : "";
                })
                .filter((name) => name !== "");

            
            setTechnologies(techNames);
            initializedRef.current = true;
            return;
        }

        
        if (technologies.length > 0) {
            const techSelections: UserTechSelection[] = [];

            technologies.forEach((techName) => {
                const tech = techStacks.find((t) => t.name === techName);
                if (tech) {
                    techSelections.push({ techId: tech.id, proficiency: 3 });
                }
            });

            setSelectedTechs(techSelections);
            initializedRef.current = true;
        }
    }, [techStacks, technologies, userTechStacks, setTechnologies, isLoading]);

    
    useEffect(() => {
        if (!shouldUpdateParentRef.current || !userInteractionRef.current) {
            return;
        }

        if (techStacks.length > 0) {
            
            const techNames = selectedTechs
                .map((selection) => {
                    const tech = techStacks.find(
                        (t) => t.id === selection.techId
                    );
                    return tech ? tech.name : "";
                })
                .filter((name) => name !== "");

            setTechnologies(techNames);

            
            if (onTechSelectionsChange) {
                onTechSelectionsChange(selectedTechs);
            }

            
            shouldUpdateParentRef.current = false;
        }
    }, [selectedTechs, techStacks, setTechnologies, onTechSelectionsChange]);

    
    const handleTechnologyToggle = useCallback(
        (tech: TechStack) => {
            userInteractionRef.current = true;
            shouldUpdateParentRef.current = true;

            setSelectedTechs((prevSelected) => {
                if (prevSelected.some((item) => item.techId === tech.id)) {
                    return prevSelected.filter(
                        (item) => item.techId !== tech.id
                    );
                } else {
                    
                    const existingTech = userTechStacks.find(
                        (item) => item.tech_id === tech.id
                    );
                    const defaultProficiency = existingTech
                        ? existingTech.proficiency_level
                        : 3;

                    return [
                        ...prevSelected,
                        { techId: tech.id, proficiency: defaultProficiency },
                    ];
                }
            });
        },
        [userTechStacks]
    );

    const handleProficiencyChange = useCallback(
        (techId: number, proficiency: number) => {
            userInteractionRef.current = true;
            shouldUpdateParentRef.current = true;

            setSelectedTechs((prevSelected) =>
                prevSelected.map((item) =>
                    item.techId === techId ? { ...item, proficiency } : item
                )
            );
        },
        []
    );

    
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
        <div className="settings-tech-stack-group">
            <label>Tech Stack</label>
            <p className="settings-tech-stack-description">
                Select the technologies you work with most frequently
            </p>

            {isLoading ? (
                <div className="loading-indicator">Loading technologies...</div>
            ) : !hasTechStacks ? (
                <div className="tech-error">No technology stacks found.</div>
            ) : !hasTechStacksByCategory ? (
                <div className="tech-error">
                    No technologies found in any category.
                </div>
            ) : (
                <div className="tech-selection-container">
                    {Object.entries(techsByCategory).map(
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
                                                        item.techId === tech.id
                                                );
                                            const selectedTech =
                                                selectedTechs.find(
                                                    (item) =>
                                                        item.techId === tech.id
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
                                                                    1, 2, 3, 4,
                                                                    5,
                                                                ].map(
                                                                    (level) => (
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
                    )}
                </div>
            )}
        </div>
    );
};

export default TechStack;
