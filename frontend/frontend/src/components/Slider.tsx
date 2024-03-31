import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

type ArrowProps = {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
};

const NextArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => {
    return (
      <IoIosArrowForward
        className={className}
        style={{ ...style, display: "block", color: "black", fontSize: '50px' }}
        onClick={onClick}
      />
    );
};

const PrevArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => {
    return (
      <IoIosArrowBack
        className={className}
        style={{ ...style, display: "block", color: "black" }}
        onClick={onClick}
      />
    );
};

type CustomSliderProps = {
    children: React.ReactNode;
};

export const CustomSlider: React.FC<CustomSliderProps> = ({ children }) => {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 0,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
    
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            }
        ]
    };

    return (
      <Slider {...settings} className="slider">{children}</Slider>
    );
};