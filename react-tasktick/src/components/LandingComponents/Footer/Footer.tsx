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

                    <div className="footer-section">
                        <h4 className="footer-title">Learn More</h4>
                        <ul className="footer-links">
                            <li><a href="#about">About TaskTick</a></li>
                            <li><a href="#press">Press Releases</a></li>
                            <li><a href="#environment">Environment</a></li>
                            <li><a href="#jobs">Jobs</a></li>
                            <li><a href="#privacy">Privacy Policy</a></li>
                            <li><a href="#contact">Contact Us</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">Contact Us</h4>
                        <ul className="footer-links">
                            <li>
                                <span className="contact-label">Hotel Reservation</span>
                                <span className="contact-number">123-456-7890</span>
                            </li>
                            <li>
                                <span className="contact-label">Ticket Office</span>
                                <span className="contact-number">123-456-7890</span>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">Social</h4>
                        <div className="social-links">
                            <a href="#facebook" className="social-link" aria-label="Facebook">
                                <Facebook />
                            </a>
                            <a href="#instagram" className="social-link" aria-label="Instagram">
                                <Instagram />
                            </a>
                            <a href="#twitter" className="social-link" aria-label="Twitter">
                                <Twitter />
                            </a>
                            <a href="#youtube" className="social-link" aria-label="YouTube">
                                <Youtube />
                            </a>
                           
                        </div>
                    </div>
                </div>

               
            </div>
        </footer>
    );
};

export default Footer;