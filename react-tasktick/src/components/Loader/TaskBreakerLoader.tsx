import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./TaskBreakerLoader.css";

interface TaskBreakerLoaderProps {
    isGenerating: boolean;
}



const TaskBreakerLoader: React.FC = () => {
    

    return (
        <AnimatePresence>
            
        </AnimatePresence>
    );
};

export default TaskBreakerLoader;
