import { use, useEffect, useRef, useState } from "react";
import { FaBriefcase, FaFlag, FaGraduationCap } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
/**
 * AboutTimeline.tsx
 * Relies heavily on two alternating CSS classes to style the timeline.
 * .about-timeline-left and .about-timeline-right
 */
const AboutTimeline = () => {
  const [mediaWidth, setMediaWidth] = useState<string>("");

  useEffect(() => {
    // Animation on Scroll (AOS) Initialization
    AOS.init({ duration: 500, easing: "ease-in-out-quart", once: true });

    // Handle Resize for Timeline Line Height
    handleResize();
    window.addEventListener("resize", handleResize);
  });

  const timelineDiv = useRef<HTMLDivElement>(null);
  const timelineDivSmall = useRef<HTMLDivElement>(null);
  const timelineLineFix = useRef<HTMLDivElement>(null);
  const timelineLine = useRef<HTMLDivElement>(null);
  const handleResize = () => {
    const clientWidth = window.innerWidth;
    let clientMediaWidth;
    if (clientWidth < 640) clientMediaWidth = "max-sm";
    else if (clientWidth < 768) clientMediaWidth = "sm";
    else if (clientWidth < 1024) clientMediaWidth = "md";
    else if (clientWidth < 1280) clientMediaWidth = "lg";
    else if (clientWidth < 1600) clientMediaWidth = "xl";
    else clientMediaWidth = "xxl";

    if (mediaWidth !== clientMediaWidth) {
      let topOffset: number;
      let btmOffset: number;
      let clientDivHeight = 0;
      let clientDivTop = 0;

      //console.log("clientMediaWidth: ", clientMediaWidth);

      switch (clientMediaWidth) {
        case "xxl":
          topOffset = 115;
          btmOffset = 115;
          break;
        case "xl":
          topOffset = 115;
          btmOffset = 115;
          break;
        case "lg":
          topOffset = 110;
          btmOffset = 100;
          break;
        case "md":
          topOffset = 130;
          btmOffset = 100;
          break;
        case "sm":
          topOffset = 105;
          btmOffset = 90;
          break;
        case "max-sm":
          topOffset = 140;
          btmOffset = 130;
          break;
        default:
          topOffset = 0;
          btmOffset = 0;
      }
      if (clientMediaWidth === "max-sm" || clientMediaWidth === "sm") {
        if (timelineDivSmall.current) {
          clientDivHeight = timelineDivSmall.current.clientHeight;
          clientDivTop = timelineDivSmall.current.offsetTop;
        }
      } else {
        if (timelineDiv.current) {
          clientDivHeight = timelineDiv.current.clientHeight;
          clientDivTop = timelineDiv.current.offsetTop;
        }
      }
    }
  };

  const timelineData = [
    {
      title: "B.Comp in Information Security",
      subtitle: "National University of Singapore (NUS)",
      content: `Teaching Assistant for CS2040C Since AY2023/24 Semester 2.\n\nDistinction in CS2107`,
      year: "Ongoing (2023 - 2027)",
      icon: <FaGraduationCap />,
      color: "bg-emerald-500 dark:bg-emerald-600",
      position: "left",
    },
    {
      title: "Part-time Software Engineer",
      subtitle: "DSO National Laboratories",
      content:
        "Developed Web App for use by DSO to maximize work flow efficiency.\n\nSkills involved: PhpMyAdmin, AMPPS, Flask",
      year: "2021",
      icon: <FaBriefcase />,
      color: "bg-teal-500 dark:bg-teal-600",
      position: "right",
    },
    {
      title: `Singapore Polytechnic's Internship Program`,
      subtitle: "DSO National Laboratories",
      content:
        "R&D of commonly used Key Derivation Functions (KDFs) on a Field Programmable Gate Array (FPGA) using VHDL.\n\nSkills involved: Cryptography, VHDL, FPGA",
      year: "2021",
      icon: <FaBriefcase />,
      color: "bg-teal-500 dark:bg-teal-600",
      position: "left",
    },
    {
      title: "Manager, Talent Development Team",
      subtitle: "Cyber Youth Singapore (CYS)",
      content:
        "Volunteering as part of the Talent Development Team for Cyber Youth Singapore, to help create and organize opportunity to allow youths a platform for them to learn more and develop their interest in the Cyber Security Sector.",
      year: "2020",
      icon: <FaBriefcase />,
      color: "bg-teal-500 dark:bg-teal-600",
      position: "right",
    },
    {
      title: "CDDC 2020 CTF, 36th place",
      subtitle: "Cyber Defenders Discovery Camp (CDDC)",
      content:
        "For the CDDC 2020 CTF competition, a well-known event organized by DSTA, my team and I had placed 36th out of 237 teams that participated.",
      year: "2020",
      icon: <FaFlag />,
      color: "bg-cyan-500 dark:bg-cyan-600",
      position: "left",
    },
    {
      title: "Gryphons CTF 2020, 2nd place",
      subtitle: "Singapore Polytechnic Gryphons",
      content: `For the Gryphon CTF 2020 event held by Singapore Polytechnic's Gryphons Club, my team and I had placed 2nd out of the 41 teams that participated in the competition.`,
      year: "2020",
      icon: <FaFlag />,
      color: "bg-cyan-500 dark:bg-cyan-600",
      position: "right",
    },
    {
      title: "Diploma in Infocomm Security Management",
      subtitle: "Singapore Polytechnic",
      content:
        "Club Activity: SP Photography and SP Inline Skating.\n\nDistinction in Web Client Development, Programming in Python and C, Database Management Systems and Social Innovation Project.\n\nCumulative GPA: 3.696",
      year: "2018 - 2021",
      icon: <FaGraduationCap />,
      color: "bg-emerald-500 dark:bg-emerald-600",
      position: "left",
    },
    {
      title: "Polytechnic Foundation Program (PFP)",
      subtitle: "Singapore Polytechnic",
      content:
        "Having scored well for his GCE &#34;N&#34;-Level Examination, I was given the opportunity to go through PFP in place of taking the GCE &#34;O&#34;-Level Examination.",
      year: "2017",
      icon: <FaGraduationCap />,
      color: "bg-emerald-500 dark:bg-emerald-600",
      position: "right",
    },
    {
      title: `GCE "N"-Level Examination`,
      subtitle: "Greenridge Secondary School",
      content: "Club Activity: GSS Chinese Orchestra.\n\nResults: EMB3 of 6",
      year: "2013 - 2016",
      icon: <FaGraduationCap />,
      color: "bg-emerald-500 dark:bg-emerald-600",
      position: "left",
    },
  ];

  return (
    <div
      className="max-xs:w-[230px] mx-auto flex flex-col 
        pb-10 max-sm:w-[300px] sm:w-[560px] md:w-[680px] 
        lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]"
    >
      <h1
        className="z-[6] mx-auto mb-3 w-[90%] border-b-2 border-neutral-900 pt-5 text-center text-[1.4rem]  dark:border-neutral-300 
          max-lg:pt-3 lg:text-[1.8rem] xl:mb-5 xl:text-[2rem] xxl:text-[2.4rem]"
      >
        Timeline
      </h1>
      <div
        ref={timelineDiv}
        className="z-[5] bg-gradient-to-r from-transparent from-[49.8%] via-neutral-900 via-[50%] to-transparent to-[50.2%] dark:via-neutral-300 max-md:hidden md:block"
      >
        {/* [START] Timeline Repeatable Components for "md+" view */}
        {timelineData.map((data, index) =>
          data.position === "left" ? (
            <div
              key={index}
              className={
                "about-timeline-left about-timeline-div about-timeline-idx-" +
                index
              }
            >
              <div
                className={"timeline-content " + data.color}
                data-aos="fade-right"
                data-aos-offset="200"
              >
                <h1>{data.title}</h1>
                <h2>{data.subtitle}</h2>
                <hr
                  className="rounded-full border border-neutral-900/40
                   dark:border-neutral-300/60"
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: data.content.split("\n").join("<br />"),
                  }}
                ></p>
              </div>
              <div
                className="timeline-arrow"
                data-aos="fade-right"
                data-aos-delay="500"
                data-aos-duration="100"
              >
                <div className={data.color}></div>
              </div>
              <div className={"timeline-icon " + data.color} data-aos="zoom-in">
                {data.icon}
              </div>
              <h1 className="timeline-time" data-aos="fade-left">
                {data.year}
              </h1>
            </div>
          ) : (
            <div
              key={index}
              className={
                "about-timeline-right about-timeline-div about-timeline-idx-" +
                index
              }
            >
              <h1 className="timeline-time" data-aos="fade-right">
                {data.year}
              </h1>
              <div className={"timeline-icon " + data.color} data-aos="zoom-in">
                {data.icon}
              </div>
              <div
                className="timeline-arrow"
                data-aos="fade-left"
                data-aos-delay="500"
                data-aos-duration="100"
              >
                <div className={data.color}></div>
              </div>
              <div
                className={"timeline-content " + data.color}
                data-aos="fade-left"
                data-aos-offset="200"
              >
                <h1>{data.title}</h1>
                <h2>{data.subtitle}</h2>
                <hr
                  className="rounded-full border border-neutral-900/40
               dark:border-neutral-300/60"
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: data.content.split("\n").join("<br />"),
                  }}
                ></p>
              </div>
            </div>
          ),
        )}
        {/* [END] Timeline Repeatable Components */}
      </div>

      <div
        ref={timelineDivSmall}
        className="max-xs:from-[71.4%] max-xs:via-[72%] max-xs:to-[72.6%] z-[7] bg-gradient-to-r from-transparent via-neutral-900 to-transparent 
          dark:via-neutral-300 max-md:block max-sm:from-[69.6%] max-sm:via-[70%] max-sm:to-[70.4%] sm:from-[70.3%] sm:via-[70.6%] sm:to-[70.9%] md:hidden"
      >
        {/* [START] Timeline Repeatable Components for "max-md" view {Will not provide AnimateOnScroll effects} */}
        {timelineData.map((data, index) => (
          <div
            key={index}
            className={
              "about-timeline-small about-timeline-idx-" +
              index +
              " mx-auto my-3 flex w-full flex-row"
            }
          >
            <div
              className={
                data.color +
                " max-xs:min-w-[140px] max-xs:max-w-[140px] z-[7] rounded-md p-2 max-sm:min-w-[180px] max-sm:max-w-[180px] sm:min-w-[350px] sm:max-w-[350px]"
              }
            >
              <h1 className="max-xs:text-[0.9rem] mb-1 font-bold dark:drop-shadow-[0_0_2px] max-sm:text-[1rem]  sm:text-[1.2rem]">
                {data.title}
              </h1>
              <h2 className="max-xs:text-[0.75rem] mb-1 max-sm:text-[0.9rem]">
                {data.subtitle}
              </h2>
              <hr
                className="rounded-full border border-neutral-900/40
                   dark:border-neutral-300/60"
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: data.content.split("\n").join("<br />"),
                }}
                className="max-xs:text-[0.75rem] mt-1 max-sm:text-[0.9rem]"
              ></p>
            </div>
            <div className="my-auto">
              <div
                className={
                  data.color +
                  " max-xs:left-[-5px] max-xs:h-[10px] max-xs:w-[10px] relative z-[6] rotate-45 max-sm:left-[-7px] max-sm:h-[12px] max-sm:w-[12px] sm:left-[-12px] sm:h-[20px] sm:w-[20px]"
                }
              ></div>
            </div>
            <div
              className={
                data.color +
                " timeline-icon max-xs:p-[4px] z-[8] my-auto h-fit rounded-[50%] border-neutral-900 dark:border-neutral-300 max-sm:border-[2px] max-sm:p-[6px] sm:border-4 sm:p-2"
              }
            >
              {data.icon}
            </div>
            <h1 className="max-xs:text-[10px] max-xs:ml-[6px] my-auto text-left max-sm:ml-[8px] max-sm:text-[13px] sm:ml-[10px] sm:text-[1rem]">
              {data.year}
            </h1>
          </div>
        ))}
        {/* [END] Timeline Repeatable Components */}
      </div>
    </div>
  );
};

export default AboutTimeline;
