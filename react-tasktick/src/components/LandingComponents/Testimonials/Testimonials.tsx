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
    const testimonials: TestimonialData[] = [
        {
            rating: 4,
            quote: "TaskTick transformed our development process. Before, our estimates were off by 40-60%. Now we're consistently within 10% of actual time spent. The AI breakdown of tasks caught edge cases we would have missed until midway through development.",
            author: "Sarah Glenn",
            position: "Engineering Lead",
            company: "CodeSphere",
        },
        {
            rating: 5,
            quote: "As a startup, accurate project estimation is crucial for our survival. TaskTick helped us deliver projects on time and build trust with our clients. The adaptive learning feature gets better with each project we complete.",
            author: "Michael Chen",
            position: "CTO",
            company: "TechStartup Inc",
        },
        {
            rating: 5,
            quote: "I was skeptical about AI-powered estimation tools, but TaskTick proved me wrong. It understands technical complexity better than any tool I've used. My sprint planning sessions are now 3x faster.",
            author: "Emma Rodriguez",
            position: "Senior Product Manager",
            company: "DevOps Solutions",
        },
        {
            rating: 4,
            quote: "The breakdown feature is incredible. It catches dependencies and edge cases that even experienced developers miss. This has significantly reduced our project overruns and improved client satisfaction.",
            author: "David Kim",
            position: "Technical Director",
            company: "Innovation Labs",
        },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    return (
        <section id="testimonials" className="testimonials">
            <div className="testimonials-container">
                <div className="testimonials-header">
                    <h2 className="testimonials-title">Trusted By Tech Devs</h2>
                    <p className="testimonials-subtitle">
                        See what development engineers are saying about TaskTick
                    </p>
                </div>
                <div className="testimonials-slider">
                    <Slider {...settings}>
                        {testimonials.map((testimonial, index) => (
                            <Testimonial
                                key={index}
                                rating={testimonial.rating}
                                quote={testimonial.quote}
                                author={testimonial.author}
                                position={testimonial.position}
                                company={testimonial.company}
                                avatar={testimonial.avatar}
                            />
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;