import React from "react";
import "./Testimonial.css";
import { CircleUser, Star } from "lucide-react";

interface TestimonialProps {
    rating: number;
    quote: string;
    author: string;
    position: string;
    company: string;
    avatar?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({
    rating,
    quote,
    author,
    position,
    company,
    avatar,
}) => {
   

    return (
        <div className="testimonial-card">
           
        </div>
    );
};

export default Testimonial;