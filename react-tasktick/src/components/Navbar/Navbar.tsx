import React from "react";
import "./styles.css";
import TaskTickLogo from "../../assets/Sleiman_ElYahfoufi_TaskTick.png";
const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="container">
                <div className="nav-content">
                    <div className="logo">
                        <img
                            src={TaskTickLogo}
                            alt="TaskTick Logo"
                            className="logo-img"
                        />
                    </div>
                    
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
