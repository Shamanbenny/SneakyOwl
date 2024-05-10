import { useEffect, useRef, useState } from "react";

const DsaSVG = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGRadialGradientElement>(null);
  const [mouseOnCard, setMouseOnCard] = useState(false);
  const [gradientCenter, setGradientCenter] = useState({ x: 50, y: 50 });

  useEffect(() => {
    svgRef.current?.setAttribute("cx", `${gradientCenter.x}%`);
    svgRef.current?.setAttribute("cy", `${gradientCenter.y}%`);
    //console.log("DsaSVG", mouseOnCard, gradientCenter);
  }, [gradientCenter]);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    let x = event.clientX;
    let y = event.clientY;
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const cxPercentage = ((x - rect.left) / rect.width) * 200 - 50;
      const cyPercentage = ((y - rect.top) / rect.height) * 200 - 50;
      setGradientCenter({ x: cxPercentage, y: cyPercentage });
    }
  };

  return (
    <div
      className="dsaSVGCard svgCards group"
      ref={cardRef}
      onMouseEnter={() => setMouseOnCard(true)}
      onMouseLeave={() => setMouseOnCard(false)}
      onMouseMove={(event) => handleMouseMove(event)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="h-full w-full transition-all duration-150 ease-linear hover:scale-[105%]"
      >
        {/* [IMPT Lesson] Need to use unique radialGradient ID per SVGs*/}
        {/* <!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com 
        License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --> */}
        <defs>
          <radialGradient
            ref={svgRef}
            id="emeraldGradient_Dsa"
            gradientUnits="userSpaceOnUse"
            r={"75%"}
          >
            {mouseOnCard && <stop stopColor="#10b981" />}
            <stop offset={1} stopColor="#404040" />
          </radialGradient>
        </defs>
        <path
          className="fill-neutral-700 transition-all duration-150 ease-linear group-hover:fill-emerald-900 
            dark:fill-neutral-900/90 group-hover:dark:fill-neutral-900"
          stroke="url(#emeraldGradient_Dsa)"
          d="M332.8 320h38.4c6.4 0 12.8-6.4 12.8-12.8V172.8c0-6.4-6.4-12.8-12.8-12.8h-38.4c-6.4 0-12.8 6.4-12.8 
            12.8v134.4c0 6.4 6.4 12.8 12.8 12.8zm96 0h38.4c6.4 0 12.8-6.4 12.8-12.8V76.8c0-6.4-6.4-12.8-12.8-12.8h-38.4c-6.4 0-12.8 
            6.4-12.8 12.8v230.4c0 6.4 6.4 12.8 12.8 12.8zm-288 0h38.4c6.4 0 12.8-6.4 12.8-12.8v-70.4c0-6.4-6.4-12.8-12.8-12.8h-38.4c-6.4 
            0-12.8 6.4-12.8 12.8v70.4c0 6.4 6.4 12.8 12.8 12.8zm96 0h38.4c6.4 0 12.8-6.4 12.8-12.8V108.8c0-6.4-6.4-12.8-12.8-12.8h-38.4c-6.4 
            0-12.8 6.4-12.8 12.8v198.4c0 6.4 6.4 12.8 12.8 12.8zM496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 
            32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z"
        />
      </svg>
    </div>
  );
};

export default DsaSVG;
