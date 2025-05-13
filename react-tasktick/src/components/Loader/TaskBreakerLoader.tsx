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
            {isGenerating && (
                <motion.div
                    className="task-breaker-loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="loader-content">
                        <div className="robot-container">
                            <motion.div
                                className="robot"
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 3,
                                    ease: "easeInOut",
                                }}
                            >
                                <div className="robot-head">
                                    <div className="robot-eyes">
                                        <motion.div
                                            className="robot-eye"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 2,
                                                repeatType: "reverse",
                                            }}
                                        />
                                        <motion.div
                                            className="robot-eye"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 2,
                                                repeatType: "reverse",
                                            }}
                                        />
                                    </div>
                                    <div className="robot-antenna" />
                                </div>
                                <div className="robot-body">
                                    <motion.div
                                        className="robot-screen"
                                        animate={{
                                            backgroundColor: [
                                                "var(--primary)",
                                                "var(--ai-precision)",
                                                "var(--primary)",
                                            ],
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 3,
                                        }}
                                    >
                                        <motion.div
                                            className="robot-screen-line"
                                            animate={{
                                                width: [
                                                    "0%",
                                                    "80%",
                                                    "30%",
                                                    "100%",
                                                    "0%",
                                                ],
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 3,
                                            }}
                                        />
                                        <motion.div
                                            className="robot-screen-line"
                                            animate={{
                                                width: [
                                                    "0%",
                                                    "100%",
                                                    "50%",
                                                    "80%",
                                                    "0%",
                                                ],
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 3,
                                                delay: 0.3,
                                            }}
                                        />
                                        <motion.div
                                            className="robot-screen-line"
                                            animate={{
                                                width: [
                                                    "0%",
                                                    "40%",
                                                    "90%",
                                                    "20%",
                                                    "0%",
                                                ],
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 3,
                                                delay: 0.6,
                                            }}
                                        />
                                    </motion.div>
                                    <div className="robot-arms">
                                        <motion.div
                                            className="robot-arm left"
                                            animate={{
                                                rotate: [0, 15, 0, -15, 0],
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 5,
                                            }}
                                        />
                                        <motion.div
                                            className="robot-arm right"
                                            animate={{
                                                rotate: [0, -15, 0, 15, 0],
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 5,
                                                delay: 0.5,
                                            }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="message-container">
                            <motion.div
                                key={currentMessageIndex}
                                className="message"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                {messages[currentMessageIndex]}
                            </motion.div>
                        </div>

                        
                        <div className="loader-title">TaskBreaker AI</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TaskBreakerLoader;
