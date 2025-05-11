import React from "react";
import FeaturePanel from "../FeaturePanel/FeaturePanel";
import "./PowerfulFeatures.css";
import { Brain, Clock, Zap } from "lucide-react";



const PowerfulFeatures: React.FC = () => {
    const features = [
        {
            icon: <Brain />,
            title: "AI Project Decomposer",
            description:
                "Automatically breaks down large projects into granular tasks based on industry best practices and patterns from thousands of similar projects.",
        },
        {
            icon: <Clock />,
            title: "Developer Time Oracle",
            description:
                "Predicts realistic time estimates by analyzing historical data, complexity factors, and team velocity to eliminate guesswork from planning.",
        },
        {
            icon: <Zap />,
            title: "Adaptive Learning Engine",
            description:
                "Continuously improves estimation accuracy by learning from your team's actual development patterns, getting smarter with every project.",
        },
    ];

    return (
        <section className="powerful-features">
           
        </section>
    );
};

export default PowerfulFeatures;