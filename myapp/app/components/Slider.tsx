import React, { useState } from "react";
import OwlSVG from "./svgComponents/OwlSVG";
import Link from "next/link";
import { togglePageChange } from "./NavBar";
import { FaLinkedin, FaInstagram, FaGithub, FaLink } from "react-icons/fa";
import {
  CarouselProvider,
  Slider as CarouselSlider,
  Slide,
  ButtonBack,
  ButtonNext,
  Dot,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

/**
 * Slider component [CSS className used]:
 * .slider .slide .slideContent .svgCard .owlCard
 */

const Slider: React.FC = () => {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [mouseOnCard, setMouseOnCard] = useState(-1);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    setCursor({
      x: event.clientX,
      y: event.clientY,
    });
  };

  return (
    <>
      <CarouselProvider
        naturalSlideWidth={16}
        naturalSlideHeight={8}
        totalSlides={2}
        touchEnabled={false}
        dragEnabled={false}
        isPlaying={true}
        interval={10000}
      >
        <CarouselSlider>
          <Slide index={0}>
            <div className="slide">
              <div className="slideContent">
                <h1>Welcome to Benny's personal website</h1>
                <h1 className="emerald-highlight text-emerald-700 dark:text-emerald-500">
                  Fueled by Coffee, Powered by Code
                </h1>
                <div className="flex w-full">
                  <a
                    href="https://www.linkedin.com/in/shamanbenny/"
                    className="group ml-auto md:mr-3 lg:mr-5"
                  >
                    <FaLinkedin className="socialIcons" />
                    <span className="socialSpans">LinkedIn</span>
                  </a>
                  <a
                    href="https://www.instagram.com/shamanbenny/"
                    className="group md:mr-3 lg:mr-5"
                  >
                    <FaInstagram className="socialIcons" />
                    <span className="socialSpans">Instagram</span>
                  </a>
                  <a
                    href="https://github.com/Shamanbenny"
                    className="group md:mr-3 lg:mr-5"
                  >
                    <FaGithub className="socialIcons" />
                    <span className="socialSpans">GitHub</span>
                  </a>
                  <Link
                    href="/about"
                    className="themeButton"
                    onClick={(e) => togglePageChange("/about")}
                  >
                    About Me
                  </Link>
                </div>
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
          </Slide>
          <Slide index={1}>
            <div className="slide-reverse">
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
              <div className="slideContent">
                <h1>LeetCode Solution Showcase</h1>
                <h1 className="emerald-highlight text-emerald-700 dark:text-emerald-500">
                  Work in Progress...
                </h1>
              </div>
            </div>
          </Slide>
        </CarouselSlider>
        <ButtonBack>Back</ButtonBack>
        <ButtonNext>Next</ButtonNext>
      </CarouselProvider>
    </>
  );
};

export default Slider;
