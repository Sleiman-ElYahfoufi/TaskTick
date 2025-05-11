import React from "react";
import Navbar from "../../components/LandingComponents/Navbar/Navbar";
import HeroSection from "../../components/LandingComponents/HeroSection/HeroSection";
import "./Landing.css";
import PowerfulFeatures from "../../components/LandingComponents/PowerfulFeatures/PowerfulFeatures";
import HowItWorks from "../../components/LandingComponents/HowItWorks/HowItWorks";
import Testimonials from "../../components/LandingComponents/Testimonials/Testimonials";
import CTASection from "../../components/LandingComponents/CTASection/CTASection";
import Footer from "../../components/LandingComponents/Footer/Footer";

const Landing: React.FC = () => {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <PowerfulFeatures />
            <HowItWorks />
            <Testimonials />
            <CTASection />
            <Footer />
        </div>
    );
};

export default Landing;
