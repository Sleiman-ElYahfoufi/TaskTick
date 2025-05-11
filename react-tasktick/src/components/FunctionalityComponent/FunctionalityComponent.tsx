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
       <></>
    );
};

export default FunctionalityComponent;