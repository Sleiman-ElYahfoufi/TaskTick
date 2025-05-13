import React from "react";
import "./HeroSection.css";
import HeroImage from "../../../assets/hero-illustration.png";
import TypewriterComponent from "typewriter-effect";
const HeroSection: React.FC = () => {
    return (
        <section className="hero">
            <div className="hero-container">
                <div className="content">
                    <div className="text-content">
                        <h1 className="title">
                            Estimate Development Projects with{" "}
                            <span className="highlight">
                                <TypewriterComponent
                                    options={{
                                        strings: ["AI Precision"],
                                        autoStart: true,
                                        loop: true,
                                    }}
                                />
                            </span>
                        </h1>
                        <p className="description">
                            Get eerily accurate time estimates based on
                            thousands of real projects
                        </p>
                        <button className="cta-button">Get Started</button>
                    </div>

                    <div className="illustration-wrapper">
                        <img
                            src={HeroImage}
                            alt="Developer working with data"
                            className="hero-image"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
export default HeroSection;
