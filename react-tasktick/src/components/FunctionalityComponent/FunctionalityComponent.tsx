import React from "react";
import "./FunctionalityComponent.css";

interface FunctionalityComponentProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FunctionalityComponent: React.FC<FunctionalityComponentProps> = ({ 
    icon, 
    title, 
    description
}) => {
    return (
        <div className="functionality-component">
            <div className="step-icon-wrapper">
                <div className="step-icon">
                    {icon}
                </div>
            </div>
            <h3 className="step-title">{title}</h3>
            <p className="step-description">{description}</p>
        </div>
    );
};

export default FunctionalityComponent;