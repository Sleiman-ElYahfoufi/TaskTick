import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import HeroSection from '../../components/HeroSection/HeroSection';
import './Landing.css';
import PowerfulFeatures from '../../components/PowerfulFeatures/PowerfulFeatures';
import HowItWorks from '../../components/HowItWorks/HowItWorks';

const Landing: React.FC = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <PowerfulFeatures />
      <HowItWorks />
    </div>
  );
};

export default Landing;