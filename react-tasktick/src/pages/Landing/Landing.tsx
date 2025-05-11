import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import HeroSection from '../../components/HeroSection/HeroSection';
import './Landing.css';
import PowerfulFeatures from '../../components/PowerfulFeatures/PowerfulFeatures';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import Testimonials from '../../components/Testimonials/Testimonials';
import CTASection from '../../components/CTASection/CTASection';

const Landing: React.FC = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <PowerfulFeatures />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </div>
  );
};

export default Landing;