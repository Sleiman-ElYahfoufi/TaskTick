import React from "react";
import Slider from "react-slick";
import Testimonial from "../Testimonial/Testimonial";
import "./Testimonials.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface TestimonialData {
    rating: number;
    quote: string;
    author: string;
    position: string;
    company: string;
    avatar?: string;
}

const Testimonials: React.FC = () => {
    
    return (
        <section id="testimonials" className="testimonials">
           
        </section>
    );
};

export default Testimonials;