import React from "react";
import "./CTASection.css";

const CTASection: React.FC = () => {
    return (
        <section className="cta-section">
            <div className="cta-container">
                <div className="cta-content">
                    <h2 className="cta-title">Start Estimating Accurately Today</h2>
                    <p className="cta-subtitle">
                        Join hundreds of developers saving time and reducing stress
                        with AI-powered estimations.
                    </p>
                    <button className="cta-button">Get Started</button>
                </div>
            </div>
        </section>
    );
};

export default CTASection;