import React from "react";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import TaskTickLogo from "../../../assets/Sleiman_ElYahfoufi_TaskTick.png";

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/auth");
    };

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
                            <Link
                                to="features"
                                smooth={true}
                                duration={500}
                                className="nav-link"
                            >
                                Features
                            </Link>
                            <Link
                                to="how-it-works"
                                smooth={true}
                                duration={500}
                                className="nav-link"
                            >
                                How It Works
                            </Link>
                            <Link
                                to="testimonials"
                                smooth={true}
                                duration={500}
                                className="nav-link"
                            >
                                Testimonials
                            </Link>
                        </div>

                        <div className="nav-actions">
                            <button
                                className="get-started-btn"
                                onClick={handleGetStarted}
                            >
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
