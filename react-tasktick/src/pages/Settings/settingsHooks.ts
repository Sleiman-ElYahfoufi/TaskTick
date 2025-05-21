import { useState, useEffect, useRef, useCallback } from "react";
import {
    TechStack,
    UserTechStackData,
    UserTechSelection,
    UserUpdateData,
    getTechNames,
    createTechSelections
} from "./settingsFunctions";
import {
    fetchUserData,
    fetchUserTechStacks,
    fetchTechStacks,
    saveUserSettings
} from "./settingsActions";

export const useUserProfile = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = localStorage.getItem("userData");
                if (userData) {
                    const user = JSON.parse(userData);
                    setUserId(user.id);

                    const fetchedUser = await fetchUserData(user.id);

                    setUsername(fetchedUser.username);
                    setEmail(fetchedUser.email);
                    setRole(fetchedUser.role);
                    setExperience(fetchedUser.experience_level);
                }
            } catch (error: any) {

                setMessage(error.message || "Failed to load user data");
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    const updateLocalStorage = (updatedData: any) => {
        const userData = localStorage.getItem("userData");
        if (userData) {
            const user = JSON.parse(userData);
            const newUserData = {
                ...user,
                username: updatedData.username,
                email: updatedData.email,
                role: updatedData.role,
                experience_level: updatedData.experience_level,
            };

            localStorage.setItem("userData", JSON.stringify(newUserData));
        }
    };

    return {
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
        userId,
        loading,
        message,
        setMessage,
        updateLocalStorage
    };
};

export const useTechStack = (userId?: number) => {
    const [technologies, setTechnologies] = useState<string[]>([]);
    const [techStacks, setTechStacks] = useState<TechStack[]>([]);
    const [selectedTechs, setSelectedTechs] = useState<UserTechSelection[]>([]);
    const [userTechStacks, setUserTechStacks] = useState<UserTechStackData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const initializedRef = useRef(false);
    const shouldUpdateParentRef = useRef(false);
    const userInteractionRef = useRef(false);


    useEffect(() => {
        const loadTechStacks = async () => {
            try {
                setIsLoading(true);
                const data = await fetchTechStacks();
                setTechStacks(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadTechStacks();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const loadUserTechStacks = async () => {
            try {
                const data = await fetchUserTechStacks(userId);
                setUserTechStacks(data);
            } catch (err: any) {

            }
        };

        loadUserTechStacks();
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

            const techNames = getTechNames(selections, techStacks);
            setTechnologies(techNames);
            initializedRef.current = true;
            return;
        }

        if (technologies.length > 0) {
            const techSelections = createTechSelections(technologies, techStacks);
            setSelectedTechs(techSelections);
            initializedRef.current = true;
        }
    }, [techStacks, technologies, userTechStacks, isLoading, setTechnologies]);


    useEffect(() => {
        if (!shouldUpdateParentRef.current || !userInteractionRef.current) {
            return;
        }

        if (techStacks.length > 0) {
            const techNames = getTechNames(selectedTechs, techStacks);
            setTechnologies(techNames);
            shouldUpdateParentRef.current = false;
        }
    }, [selectedTechs, techStacks, setTechnologies]);

    const handleTechnologyToggle = useCallback(
        (tech: TechStack) => {
            userInteractionRef.current = true;
            shouldUpdateParentRef.current = true;

            setSelectedTechs((prevSelected) => {
                if (prevSelected.some((item) => item.techId === tech.id)) {
                    return prevSelected.filter((item) => item.techId !== tech.id);
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

    return {
        technologies,
        setTechnologies,
        techStacks,
        selectedTechs,
        userTechStacks,
        isLoading,
        error,
        handleTechnologyToggle,
        handleProficiencyChange
    };
};

export const useSettingsForm = () => {
    const [isSaving, setIsSaving] = useState(false);
    const profileData = useUserProfile();
    const [techSelections, setTechSelections] = useState<UserTechSelection[]>([]);

    const handleTechSelectionsChange = useCallback((selections: UserTechSelection[]) => {
        setTechSelections(selections);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profileData.userId) {
            profileData.setMessage("User ID not found");
            return;
        }

        setIsSaving(true);

        try {

            const updateData: UserUpdateData = {
                username: profileData.username,
                email: profileData.email,
                role: profileData.role,
                experience_level: profileData.experience,
            };

            if (profileData.password) {
                updateData.password = profileData.password;
            }


            const existingTechStacks = await fetchUserTechStacks(profileData.userId);


            const updatedData = await saveUserSettings(
                profileData.userId,
                updateData,
                techSelections,
                existingTechStacks
            );


            profileData.updateLocalStorage(updatedData);

            profileData.setMessage("Profile and tech stacks updated successfully");
            profileData.setPassword("");
        } catch (error: any) {
            profileData.setMessage(error.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    return {
        ...profileData,
        techSelections,
        handleTechSelectionsChange,
        handleSubmit,
        isSaving
    };
}; 