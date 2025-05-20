import React from "react";
import { useNavigate } from "react-router-dom";
import "./CTASection.css";

const CTASection: React.FC = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/auth");
    };

    return (
        <section className="cta-section">
            <div className="cta-container">
                <div className="cta-content">
                    <h2 className="cta-title">
                        Start Estimating Accurately Today
                    </h2>
                    <p className="cta-subtitle">
                        Join hundreds of developers saving time and reducing
                        stress with AI-powered estimations.
                    </p>
                    <button className="cta-button" onClick={handleGetStarted}>
                        Get Started
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
