import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./TaskBreakerLoader.css";

interface TaskBreakerLoaderProps {
    isGenerating: boolean;
}

const messages = [
    "Analyzing project scope...",
    "Decomposing tasks...",
    "Estimating time requirements...",
    "Prioritizing workload...",
    "Generating task dependencies...",
    "Optimizing task sequence...",
    "Calculating resource allocation...",
    "Finalizing task breakdown...",
];

const TaskBreakerLoader: React.FC = () => {
    

    return (
        <AnimatePresence>
            
        </AnimatePresence>
    );
};

export default TaskBreakerLoader;
