import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import HeroSection from '../../components/HeroSection/HeroSection';
import './styles.css';

const LandingPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
    </div>
  );
};

export default LandingPage;