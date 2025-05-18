
export interface UserTechStack {
    id: number;
    name: string;
}

export interface UserTechSelection {
    techId: number;
    proficiency: number;
}

export interface TechStack {
    id: number;
    name: string;
    category: string;
}

export interface UserTechStackData {
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

export interface UserProfileData {
    id: number;
    username: string;
    email: string;
    role: string;
    experience_level: string;
    userTechStacks?: UserTechStack[];
}

export interface UserUpdateData {
    username: string;
    email: string;
    role: string;
    experience_level: string;
    password?: string;
}


export const CATEGORIES = ["FRONTEND", "BACKEND", "DATABASE", "DEVOPS", "MOBILE"];


export const getTechsByCategory = (techStacks: TechStack[], categories: string[] = CATEGORIES) => {
    const techsByCategory = categories.reduce((acc, category) => {
        acc[category] = techStacks.filter(
            (tech) => tech.category.toUpperCase() === category.toUpperCase()
        );
        return acc;
    }, {} as Record<string, TechStack[]>);

    const uncategorizedTechs = techStacks.filter(
        (tech) =>
            !categories.some(
                (category) =>
                    category.toUpperCase() === tech.category.toUpperCase()
            )
    );

    if (uncategorizedTechs.length > 0) {
        techsByCategory["OTHER"] = uncategorizedTechs;
    }

    return techsByCategory;
};

export const getTechNames = (selectedTechs: UserTechSelection[], techStacks: TechStack[]): string[] => {
    return selectedTechs
        .map((selection) => {
            const tech = techStacks.find(
                (t) => t.id === selection.techId
            );
            return tech ? tech.name : "";
        })
        .filter((name) => name !== "");
};

export const createTechSelections = (technologies: string[], techStacks: TechStack[]): UserTechSelection[] => {
    const techSelections: UserTechSelection[] = [];

    technologies.forEach((techName) => {
        const tech = techStacks.find((t) => t.name === techName);
        if (tech) {
            techSelections.push({ techId: tech.id, proficiency: 3 });
        }
    });

    return techSelections;
};

export const experienceLevels = [
    { label: "Beginner", years: "Less than 1 year of experience" },
    { label: "Intermediate", years: "1-3 years of experience" },
    { label: "Expert", years: "3+ years of experience" },
]; 