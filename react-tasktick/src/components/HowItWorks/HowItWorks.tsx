import React from "react";
import FunctionalityComponent from "../FunctionalityComponent/FunctionalityComponent";
import "./HowItWorks.css";
import { Crosshair, FileChartLine, FileText } from "lucide-react";



const HowItWorks: React.FC = () => {
    const steps = [
        {
            icon: <FileText />,
            title: "Upload Your Project Specs",
            description:
                "Simply describe your project or upload your requirements, user stories, or issue tickets. TaskTick analyzes and understands the scope.",
        },
        {
            icon: <FileChartLine />,
            title: "Receive Detailed Breakdown",
            description:
                "Our AI decomposes your project into detailed tasks, subtasks, and dependencies with time estimates for each component.",
        },
        {
            icon: <Crosshair />,
            title: "Track & Optimize",
            description:
                "Start working on your tasks immediately within TaskTick, tracking progress and receiving personalized insights as you complete work.",
        },
    ];

    return (
        <section id="how-it-works" className="how-it-works">
            <div className="how-it-works-container">
                <div className="how-it-works-header">
                    <h2 className="how-it-works-title">How It Works</h2>
                    <p className="how-it-works-subtitle">
                        Get accurate estimates in three simple steps
                    </p>
                </div>
            
            </div>
        </section>
    );
};

export default HowItWorks;