import React, { useEffect, useRef, useState } from "react";
import Slider from "./Slider";

export const Index: React.FC = () => {
  const [paddingTop, setPaddingTop] = useState("10%");
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (dividerRef.current) {
        let paddingOffset =
          (window.innerHeight - dividerRef.current.clientHeight) / 2;
        setPaddingTop(`${paddingOffset}px`);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call the function once to set the initial padding

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return (
    <>
      <div className="block" style={{ paddingTop: paddingTop }}>
        <div ref={dividerRef}>
          <Slider />
        </div>
      </div>
    </>
  );
};
