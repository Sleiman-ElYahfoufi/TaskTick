import React from "react";
import "./Navbar.css";
import TaskTickLogo from "../../assets/Sleiman_ElYahfoufi_TaskTick.png";
const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="nav-content">
                    <div className="logo">
                        <img
                            src={TaskTickLogo}
                            alt="TaskTick Logo"
                            className="logo-img"
                        />
                    </div>
                    <div className="nav-right">
                        <div className="nav-links">
                            <a href="#features" className="nav-link">
                                Features
                            </a>
                            <a href="#how-it-works" className="nav-link">
                                How It Works
                            </a>
                            <a href="#testimonials" className="nav-link">
                                Testimonials
                            </a>
                        </div>

                        <div className="nav-actions">
                            <button className="get-started-btn">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;