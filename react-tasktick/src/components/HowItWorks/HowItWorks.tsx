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
        <></>
    );
};

export default HowItWorks;