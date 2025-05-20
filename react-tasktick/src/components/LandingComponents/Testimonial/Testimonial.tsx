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
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`star ${i <= rating ? 'filled' : 'star'}`}>
                    <Star/>
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="testimonial-card">
            <div className="stars-container">{renderStars()}</div>
            <p className="testimonial-quote">"{quote}"</p>
            <div className="testimonial-author">
                <div className="author-avatar">
                    {avatar ? (
                        <img src={avatar} alt={author} />
                    ) : (
                        <div className="avatar-placeholder">
                            <CircleUser />
                        </div>
                    )}
                </div>
                <div className="author-info">
                    <h4 className="author-name">{author}</h4>
                    <p className="author-position">{position} at {company}</p>
                </div>
            </div>
        </div>
    );
};

export default Testimonial;