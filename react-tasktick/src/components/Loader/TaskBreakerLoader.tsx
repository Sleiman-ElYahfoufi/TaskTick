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

const TaskBreakerLoader: React.FC<TaskBreakerLoaderProps> = ({
    isGenerating,
}) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isGenerating) return;

        const messageInterval = setInterval(() => {
            setCurrentMessageIndex(
                (prevIndex) => (prevIndex + 1) % messages.length
            );
        }, 2500);

        return () => clearInterval(messageInterval);
    }, [isGenerating]);

    useEffect(() => {
        if (!isGenerating) {
            setProgress(0);
            return;
        }

        const progressInterval = setInterval(() => {
            setProgress((prevProgress) => {
                const increment = Math.max(0.5, (100 - prevProgress) / 20);
                const newProgress = prevProgress + increment;
                return newProgress > 99 ? 99 : newProgress;
            });
        }, 300);

        return () => clearInterval(progressInterval);
    }, [isGenerating]);

    return (
        <AnimatePresence>
            
        </AnimatePresence>
    );
};

export default TaskBreakerLoader;
