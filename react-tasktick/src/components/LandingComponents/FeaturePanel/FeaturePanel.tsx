import React from "react";
import "./FeaturePanel.css";

interface FeaturePanelProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeaturePanel: React.FC<FeaturePanelProps> = ({ icon, title, description }) => {
    return (
        <div className="feature-panel">
            <div className="feature-icon">{icon}</div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-description">{description}</p>
        </div>
    );
};

export default FeaturePanel;