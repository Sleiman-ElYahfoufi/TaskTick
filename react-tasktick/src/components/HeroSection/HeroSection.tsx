import React from "react";
import "./HeroSection.css";
import HeroImage from "../../assets/hero-illustration.png";
const HeroSection: React.FC = () => {
    return (
        <section className="hero">
            <div className="hero-container">
                <div className="content">
                    <div className="text-content">
                        <h1 className="title">
                            Estimate Development Projects with{" "}
                            <span className="highlight">AI Precision</span>
                        </h1>
                        <p className="description">
                            Get eerily accurate time estimates based on
                            thousands of real projects
                        </p>
                        <button className="cta-button">Get Started</button>
                    </div>

                  
                </div>
            </div>
        </section>
    );
};
export default HeroSection;