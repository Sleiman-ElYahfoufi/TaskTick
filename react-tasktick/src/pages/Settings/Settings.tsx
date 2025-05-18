import React from "react";
import "./Settings.css";
import ProfileInputs from "../../components/SettingsComponents/ProfileInputs/ProfileInputs";
import TechStack from "../../components/SettingsComponents/TechStack/TechStack";
import { useSettingsForm, useTechStack } from "./settingsHooks";

const Settings: React.FC = () => {
    
    const {
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
        handleSubmit,
        isSaving,
        handleTechSelectionsChange,
    } = useSettingsForm();

    const { technologies, setTechnologies } = useTechStack(userId);

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
