import React from "react";

const Index_BG = () => {
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
      <ul className="index-bg absolute left-0 top-0 h-full w-full overflow-hidden">
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
