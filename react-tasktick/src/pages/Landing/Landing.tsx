import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import HeroSection from '../../components/HeroSection/HeroSection';
import './Landing.css';
import PowerfulFeatures from '../../components/PowerfulFeatures/PowerfulFeatures';

const Landing: React.FC = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <PowerfulFeatures />
    </div>
  );
};

export default Landing;