import { useEffect, useRef } from "react";

const About_BG = () => {
  const bgBlobRef = useRef<HTMLDivElement>(null);
  const bgBlobBlur = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.addEventListener("pointerleave", leaveBG);
    document.body.onpointermove = (event) => {
      const { clientX, clientY } = event;
      if (bgBlobRef.current) {
        const offsetLeft = bgBlobRef.current!.clientWidth / 2;
        const offsetTop = bgBlobRef.current!.clientHeight / 2;
        if (bgBlobRef.current!.dataset.active === "false") {
          bgBlobRef.current!.dataset.active = "true";
          bgBlobRef.current!.animate(
            {
              left: `${clientX - offsetLeft}px`,
              top: `${clientY - offsetTop}px`,
              scale: 0,
            },
            { duration: 0, fill: "forwards" },
          );
          bgBlobRef.current!.animate(
            {
              scale: 1,
            },
            { duration: 350, fill: "forwards" },
          );
        } else {
          bgBlobRef.current!.animate(
            {
              left: `${clientX - offsetLeft}px`,
              top: `${clientY - offsetTop}px`,
            },
            { duration: 350, fill: "forwards" },
          );
        }
      }
    };

    return () => {
      document.body.removeEventListener("pointerleave", leaveBG);
      document.body.onpointermove = null;
    };
  });

  const leaveBG = () => {
    if (!bgBlobRef.current) return;
    bgBlobRef.current!.dataset.active = "false";
    bgBlobRef.current!.animate(
      {
        scale: 0,
      },
      { duration: 350, fill: "forwards" },
    );
  };

  return (
    <>
      <div id="bg-blob" data-active="false" ref={bgBlobRef}></div>
      <div
        className="fixed left-0 top-0 z-[1] h-screen w-full backdrop-blur-[100px]"
        ref={bgBlobBlur}
      ></div>
    </>
  );
};

export default About_BG;
