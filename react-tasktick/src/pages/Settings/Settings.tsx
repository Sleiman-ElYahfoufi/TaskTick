import React, { useState, useEffect } from "react";
import "./Settings.css";
import api from "../../utils/api.ts";
import ProfileInputs from "../../components/SettingsComponents/ProfileInputs/ProfileInputs";
import TechStack from "../../components/SettingsComponents/TechStack/TechStack";

interface UserTechStack {
    id: number;
    name: string;
}

interface UserTechSelection {
    techId: number;
    proficiency: number;
}

const Settings: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [technologies, setTechnologies] = useState<string[]>([]);
    const [techSelections, setTechSelections] = useState<UserTechSelection[]>(
        []
    );
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = localStorage.getItem("userData");
                if (userData) {
                    const user = JSON.parse(userData);
                    setUserId(user.id);
                    const response = await api.get(`/users/${user.id}`);
                    const fetchedUser = response.data;

                    setUsername(fetchedUser.username);
                    setEmail(fetchedUser.email);
                    setRole(fetchedUser.role);
                    setExperience(fetchedUser.experience_level);

                    const techNames =
                        fetchedUser.userTechStacks?.map(
                            (tech: UserTechStack) => tech.name
                        ) || [];
                    setTechnologies(techNames);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setMessage("Failed to load user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleTechSelectionsChange = (selections: UserTechSelection[]) => {
        setTechSelections(selections);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const userData = localStorage.getItem("userData");
            if (!userData) {
                setMessage("User data not found. Please log in again.");
                setIsSaving(false);
                return;
            }

            const user = JSON.parse(userData);
            const updateData: any = {
                username,
                email,
                role,
                experience_level: experience,
            };

            if (password) {
                updateData.password = password;
            }

            const response = await api.patch(`/users/${user.id}`, updateData);

            const updatedUserData = {
                ...user,
                username: response.data.username,
                email: response.data.email,
                role: response.data.role,
                experience_level: response.data.experience_level,
            };

            localStorage.setItem("userData", JSON.stringify(updatedUserData));

            const existingTechStacksResponse = await api.get(
                `/user-tech-stacks?userId=${user.id}`
            );
            const existingTechStacks = existingTechStacksResponse.data || [];

            const techIdsToKeep = techSelections.map(
                (selection) => selection.techId
            );
            const techStacksToDelete = existingTechStacks.filter(
                (stack: any) => !techIdsToKeep.includes(stack.tech_id)
            );

            await Promise.all(
                techStacksToDelete.map((stack: any) =>
                    api.delete(`/user-tech-stacks/${user.id}/${stack.tech_id}`)
                )
            );

            await Promise.all(
                techSelections.map(async (selection) => {
                    const existingStack = existingTechStacks.find(
                        (stack: any) => stack.tech_id === selection.techId
                    );

                    if (existingStack) {
                        if (
                            existingStack.proficiency_level !==
                            selection.proficiency
                        ) {
                            await api.patch(
                                `/user-tech-stacks/${user.id}/${selection.techId}`,
                                {
                                    proficiency_level: selection.proficiency,
                                }
                            );
                        }
                    } else {
                        await api.post("/user-tech-stacks", {
                            user_id: user.id,
                            tech_id: selection.techId,
                            proficiency_level: selection.proficiency,
                        });
                    }
                })
            );

            setMessage("Profile and tech stacks updated successfully");

            setPassword("");
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="settings-container">Loading...</div>;
    }

    return (
        <div className="settings-container">
            <h1 className="settings-title">Settings</h1>

            <div className="settings-card">
                <div className="profile-settings-header">
                    <h2>Profile Settings</h2>
                    <p>Manage your account information and preferences</p>
                </div>

                {message && (
                    <div
                        className={`settings-message ${
                            message.includes("Failed") ? "error" : "success"
                        }`}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="settings-section">
                        <h3>Personal Information</h3>

                        <ProfileInputs
                            username={username}
                            setUsername={setUsername}
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            role={role}
                            setRole={setRole}
                            experience={experience}
                            setExperience={setExperience}
                        />

                        <TechStack
                            technologies={technologies}
                            setTechnologies={setTechnologies}
                            userId={userId}
                            onTechSelectionsChange={handleTechSelectionsChange}
                        />
                    </div>

                    <div className="settings-actions">
                        <button
                            type="submit"
                            className="settings-save-button"
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
