import React, { useRef, useState } from "react";
import OwlSVG from "./svgComponents/OwlSVG";

const Slider: React.FC = () => {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [mouseOnCard, setMouseOnCard] = useState(-1);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setCursor({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const [slideCountdown, setSlideCountdown] = useState(5);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      id: 1,
      image: "path/to/image1.jpg",
      caption: "Slide 1",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === slides.length - 1 ? 0 : prevSlide + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
  };

  return (
    <div className="slider">
      <div className="slide">
        <div className="slideContent">
          <h1>Welcome to Benny's personal website</h1>
          <h1 className="text-emerald-700 dark:text-emerald-500">
            Fueled by Coffee, Powered by Code
          </h1>
          <p>
            Studying for my Degree in Information Security within National
            University of Singapore (NUS), I was fortunate enough to have met a
            wonderful Teaching Assistant who'd pique my interest in learning
            more about the world of practical problem solving and optimization.
            Therefore, I hope to do the same for others by providing resources
            necessary to help facilitate the learning of applicable real-world
            solutions!
          </p>
        </div>
        <div
          className="svgCard owlCard"
          onMouseEnter={() => setMouseOnCard(0)}
          onMouseLeave={() => setMouseOnCard(-1)}
          onMouseMove={(event) => handleMouseMove(event)}
        >
          <OwlSVG
            id={0}
            cursor={cursor}
            cardClass="owlCard"
            mouseOnCard={mouseOnCard}
          />
        </div>
      </div>
    </div>
  );
};

export default Slider;
