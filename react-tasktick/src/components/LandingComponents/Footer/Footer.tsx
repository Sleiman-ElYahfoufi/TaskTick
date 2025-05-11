import React from "react";
import "./Footer.css";
import TaskTickLogo from "../../../assets/Sleiman_ElYahfoufi_TaskTick.png";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";



const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-logo">
                        <img 
                            src={TaskTickLogo} 
                            alt="TaskTick Logo" 
                            className="footer-logo-img"
                        />
                    </div>

                     </div>

               
            </div>
        </footer>
    );
};

export default Footer;