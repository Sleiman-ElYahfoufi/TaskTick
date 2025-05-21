import api from "../../utils/api.ts";
import {
    UserProfileData,
    UserUpdateData,
    UserTechSelection,
    UserTechStackData
} from "./settingsFunctions";

export const fetchUserData = async (userId: string): Promise<UserProfileData> => {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    } catch (error) {

        throw new Error("Failed to load user data");
    }
};

export const fetchUserTechStacks = async (userId: number): Promise<UserTechStackData[]> => {
    try {
        const response = await api.get<UserTechStackData[]>(`/user-tech-stacks?userId=${userId}`);
        if (response.data && Array.isArray(response.data)) {
            return response.data;
        }
        return [];
    } catch (error) {

        return [];
    }
};

export const fetchTechStacks = async () => {
    try {
        const response = await api.get("/tech-stacks");
        if (response.data && Array.isArray(response.data)) {
            return response.data;
        }
        throw new Error("Invalid API response format");
    } catch (error: any) {
        throw new Error(`Failed to load technologies: ${error.message || "Unknown error"}`);
    }
};

export const updateUserProfile = async (
    userId: number,
    updateData: UserUpdateData
): Promise<any> => {
    try {
        const response = await api.patch(`/users/${userId}`, updateData);
        return response.data;
    } catch (error) {

        throw new Error("Failed to update profile");
    }
};

export const updateUserTechStacks = async (
    userId: number,
    techSelections: UserTechSelection[],
    existingTechStacks: UserTechStackData[]
): Promise<void> => {
    try {
        const techIdsToKeep = techSelections.map(selection => selection.techId);


        const techStacksToDelete = existingTechStacks.filter(
            stack => !techIdsToKeep.includes(stack.tech_id)
        );

        await Promise.all(
            techStacksToDelete.map(stack =>
                api.delete(`/user-tech-stacks/${userId}/${stack.tech_id}`)
            )
        );


        await Promise.all(
            techSelections.map(async selection => {
                const existingStack = existingTechStacks.find(
                    stack => stack.tech_id === selection.techId
                );

                if (existingStack) {
                    if (existingStack.proficiency_level !== selection.proficiency) {
                        await api.patch(`/user-tech-stacks/${userId}/${selection.techId}`, {
                            proficiency_level: selection.proficiency,
                        });
                    }
                } else {
                    await api.post("/user-tech-stacks", {
                        user_id: userId,
                        tech_id: selection.techId,
                        proficiency_level: selection.proficiency,
                    });
                }
            })
        );
    } catch (error) {

        throw new Error("Failed to update tech stacks");
    }
};

export const saveUserSettings = async (
    userId: number,
    profileData: UserUpdateData,
    techSelections: UserTechSelection[],
    existingTechStacks: UserTechStackData[]
): Promise<any> => {
    try {

        const updatedUserData = await updateUserProfile(userId, profileData);


        await updateUserTechStacks(userId, techSelections, existingTechStacks);

        return updatedUserData;
    } catch (error) {

        throw new Error("Failed to save settings");
    }
}; 