import React from "react";

/**
 * Component that renders the Index Page Background with animated elements.
 */
const Index_BG = () => {
  /**
   * Array of objects containing information about the individual animated elements.
   * Each object contains the following properties:
   * - left: The left position of the element as a percentage.
   * - size: The size of the element in pixels.
   * - delay: The delay before the element starts animating in seconds.
   * - duration: The duration of the animation in seconds.
   *        If set to -1, the animated element will move up in a predefined speed.
   */
  const array = [
    { left: 25, size: 80, delay: 0, duration: -1 },
    { left: 10, size: 20, delay: 2, duration: 12 },
    { left: 70, size: 20, delay: 13, duration: -1 },
    { left: 40, size: 60, delay: 0, duration: 18 },
    { left: 65, size: 20, delay: 0, duration: -1 },
    { left: 75, size: 110, delay: 3, duration: -1 },
    { left: 35, size: 150, delay: 15, duration: -1 },
    { left: 50, size: 25, delay: 15, duration: 45 },
    { left: 20, size: 15, delay: 2, duration: 35 },
    { left: 85, size: 150, delay: 0, duration: 11 },
    { left: 30, size: 70, delay: 5, duration: 25 },
    { left: 45, size: 40, delay: 9, duration: 15 },
    { left: 90, size: 20, delay: 12, duration: 45 },
  ];

  return (
    <div className="h-full w-full">
      <ul className="index-bg absolute left-0 top-0 h-screen w-full overflow-hidden">
        {array.map((element, index) => (
          <li
            key={index}
            style={{
              left: `${element.left}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              animationDelay: `${element.delay}s`,
              animationDuration:
                element.duration !== -1 ? `${element.duration}s` : undefined,
            }}
          ></li>
        ))}
      </ul>
    </div>
  );
};

export default Index_BG;
