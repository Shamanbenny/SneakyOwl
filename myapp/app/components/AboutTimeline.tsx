import { useEffect, useRef, useState } from "react";
import { FaBriefcase, FaFlag, FaGraduationCap } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { time } from "console";
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

  const timelineWrapper = useRef<HTMLDivElement>(null);
  const timelineDiv = useRef<HTMLDivElement>(null);
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

      console.log("clientMediaWidth: ", clientMediaWidth);

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
        default:
          topOffset = 0;
          btmOffset = 0;
      }

      if (timelineDiv.current) {
        clientDivHeight = timelineDiv.current.clientHeight;
        clientDivTop = timelineDiv.current.offsetTop;
      }
      timelineLine.current?.style.setProperty(
        "height",
        `${clientDivHeight - topOffset - btmOffset}px`,
      );
      timelineLine.current?.style.setProperty(
        "top",
        `${clientDivTop + topOffset}px`,
      );
      timelineWrapper.current?.style.setProperty(
        "max-width",
        `${clientDivHeight}px`,
      );
    }
  };

  return (
    <div
      className="mx-auto mb-10 flex flex-col 
        transition-all duration-150 ease-linear max-sm:w-[400px] sm:w-[560px] md:w-[680px] 
        lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]"
      ref={timelineWrapper}
    >
      <h1
        className="mx-auto mb-3 w-[90%] border-b-2 border-neutral-900 pt-5 text-center text-[1.4rem] transition-all duration-150 ease-linear dark:border-neutral-300 
          max-lg:pt-3 lg:text-[1.8rem] xl:mb-5 xl:text-[2rem] xxl:text-[2.4rem]"
      >
        Timeline
      </h1>
      <div ref={timelineDiv}>
        {/* [START] Timeline Repeatable Components */}
        <div className="about-timeline-left about-timeline-div">
          <div
            className="timeline-content bg-emerald-500 dark:bg-emerald-600"
            data-aos="fade-right"
            data-aos-offset="200"
          >
            <h1>B.Comp in Information Security</h1>
            <h2>National University of Singapore (NUS)</h2>
            <hr
              className="rounded-full border border-neutral-900/40
              transition-all duration-150 ease-linear dark:border-neutral-300/60"
            />
            <p>
              Teaching Assistant for CS2040C Since AY2023/24 Semester 2<br />
              <br />
              Distinction in CS2107
            </p>
          </div>
          <div
            className="timeline-arrow"
            data-aos="fade-right"
            data-aos-delay="500"
            data-aos-duration="100"
          >
            <div className="bg-emerald-500 dark:bg-emerald-600"></div>
          </div>
          <div
            className="timeline-icon bg-emerald-500 dark:bg-emerald-600"
            data-aos="zoom-in"
          >
            <FaGraduationCap />
          </div>
          <h1 className="timeline-time" data-aos="fade-left">
            Ongoing (2023 - 2027)
          </h1>
        </div>

        <div className="about-timeline-right about-timeline-div">
          <h1 className="timeline-time" data-aos="fade-right">
            2021
          </h1>
          <div
            className="timeline-icon bg-teal-500 dark:bg-teal-600"
            data-aos="zoom-in"
          >
            <FaBriefcase />
          </div>
          <div
            className="timeline-arrow"
            data-aos="fade-left"
            data-aos-delay="500"
            data-aos-duration="100"
          >
            <div className="bg-teal-500 dark:bg-teal-600"></div>
          </div>
          <div
            className="timeline-content bg-teal-500 dark:bg-teal-600"
            data-aos="fade-left"
            data-aos-offset="200"
          >
            <h1>Part-time Software Engineer</h1>
            <h2>DSO National Laboratories</h2>
            <hr
              className="rounded-full border border-neutral-900/40
              transition-all duration-150 ease-linear dark:border-neutral-300/60"
            />
            <p>
              Developed Web App for use by DSO to maximize work flow efficiency.
              <br />
              <br />
              Skills involved: PhpMyAdmin, AMPPS, Flask
            </p>
          </div>
        </div>

        <div className="about-timeline-left about-timeline-div">
          <div
            className="timeline-content bg-teal-500 dark:bg-teal-600"
            data-aos="fade-right"
            data-aos-offset="200"
          >
            <h1>Singapore Polytechnic&#39;s Internship Program</h1>
            <h2>DSO National Laboratories</h2>
            <hr
              className="rounded-full border border-neutral-900/40
              transition-all duration-150 ease-linear dark:border-neutral-300/60"
            />
            <p>
              R&D of commonly used Key Derivation Functions (KDFs) on a Field
              Programmable Gate Array (FPGA) using VHDL
              <br />
              <br />
              Skills involved: Cryptography, VHDL, FPGA
            </p>
          </div>
          <div
            className="timeline-arrow"
            data-aos="fade-right"
            data-aos-delay="500"
            data-aos-duration="100"
          >
            <div className="bg-teal-500 dark:bg-teal-600"></div>
          </div>
          <div
            className="timeline-icon bg-teal-500 dark:bg-teal-600"
            data-aos="zoom-in"
          >
            <FaBriefcase />
          </div>
          <h1 className="timeline-time" data-aos="fade-left">
            2021
          </h1>
        </div>

        <div className="about-timeline-right about-timeline-div">
          <h1 className="timeline-time" data-aos="fade-right">
            2020
          </h1>
          <div
            className="timeline-icon bg-teal-500 dark:bg-teal-600"
            data-aos="zoom-in"
          >
            <FaBriefcase />
          </div>
          <div
            className="timeline-arrow"
            data-aos="fade-left"
            data-aos-delay="500"
            data-aos-duration="100"
          >
            <div className="bg-teal-500 dark:bg-teal-600"></div>
          </div>
          <div
            className="timeline-content bg-teal-500 dark:bg-teal-600"
            data-aos="fade-left"
            data-aos-offset="200"
          >
            <h1>Manager, Talent Development Team</h1>
            <h2>Cyber Youth Singapore (CYS)</h2>
            <hr
              className="rounded-full border border-neutral-900/40
              transition-all duration-150 ease-linear dark:border-neutral-300/60"
            />
            <p>
              Volunteering as part of the Talent Development Team for Cyber
              Youth Singapore, to help create and organize opportunity to allow
              youths a platform for them to learn more and develop their
              interest in the Cyber Security Sector.
            </p>
          </div>
        </div>

        <div className="about-timeline-left about-timeline-div">
          <div
            className="timeline-content bg-cyan-500 dark:bg-cyan-600"
            data-aos="fade-right"
            data-aos-offset="200"
          >
            <h1>CDDC 2020 CTF, 36th place</h1>
            <h2>Cyber Defenders Discovery Camp (CDDC)</h2>
            <hr
              className="rounded-full border border-neutral-900/40
              transition-all duration-150 ease-linear dark:border-neutral-300/60"
            />
            <p>
              For the CDDC 2020 CTF competition, a well-known event organized by
              DSTA, my team and I had placed 36th out of 237 teams that
              participated.
            </p>
          </div>
          <div
            className="timeline-arrow"
            data-aos="fade-right"
            data-aos-delay="500"
            data-aos-duration="100"
          >
            <div className="bg-cyan-500 dark:bg-cyan-600"></div>
          </div>
          <div
            className="timeline-icon bg-cyan-500 dark:bg-cyan-600"
            data-aos="zoom-in"
          >
            <FaFlag />
          </div>
          <h1 className="timeline-time" data-aos="fade-left">
            2020
          </h1>
        </div>

        <div className="about-timeline-right about-timeline-div">
          <h1 className="timeline-time" data-aos="fade-right">
            2020
          </h1>
          <div
            className="timeline-icon bg-cyan-500 dark:bg-cyan-600"
            data-aos="zoom-in"
          >
            <FaFlag />
          </div>
          <div
            className="timeline-arrow"
            data-aos="fade-left"
            data-aos-delay="500"
            data-aos-duration="100"
          >
            <div className="bg-cyan-500 dark:bg-cyan-600"></div>
          </div>
          <div
            className="timeline-content bg-cyan-500 dark:bg-cyan-600"
            data-aos="fade-left"
            data-aos-offset="200"
          >
            <h1>Gryphons CTF 2020, 2nd place</h1>
            <h2>Singapore Polytechnic Gryphons</h2>
            <hr
              className="rounded-full border border-neutral-900/40
              transition-all duration-150 ease-linear dark:border-neutral-300/60"
            />
            <p>
              For the Gryphon CTF 2020 event held by Singapore Polytechnic&#39;s
              Gryphons Club, my team and I had placed 2nd out of the 41 teams
              that participated in the competition.
            </p>
          </div>
        </div>

        <div className="about-timeline-left about-timeline-div">
          <div
            className="timeline-content bg-emerald-500 dark:bg-emerald-600"
            data-aos="fade-right"
            data-aos-offset="200"
          >
            <h1>Diploma in Infocomm Security Management</h1>
            <h2>Singapore Polytechnic</h2>
            <hr
              className="rounded-full border border-neutral-900/40
              transition-all duration-150 ease-linear dark:border-neutral-300/60"
            />
            <p>
              Club Activity: SP Photography and SP Inline Skating
              <br />
              <br />
              Distinction in Web Client Development, Programming in Python and
              C, Database Management Systems and Social Innovation Project
              <br />
              <br />
              Cumulative GPA: 3.696
            </p>
          </div>
          <div
            className="timeline-arrow"
            data-aos="fade-right"
            data-aos-delay="500"
            data-aos-duration="100"
          >
            <div className="bg-emerald-500 dark:bg-emerald-600"></div>
          </div>
          <div
            className="timeline-icon bg-emerald-500 dark:bg-emerald-600"
            data-aos="zoom-in"
          >
            <FaGraduationCap />
          </div>
          <h1 className="timeline-time" data-aos="fade-left">
            2018 - 2021
          </h1>
        </div>

        <div className="about-timeline-right about-timeline-div">
          <h1 className="timeline-time" data-aos="fade-right">
            2013 - 2016
          </h1>
          <div
            className="timeline-icon bg-emerald-500 dark:bg-emerald-600"
            data-aos="zoom-in"
          >
            <FaGraduationCap />
          </div>
          <div
            className="timeline-arrow"
            data-aos="fade-left"
            data-aos-delay="500"
            data-aos-duration="100"
          >
            <div className="bg-emerald-500 dark:bg-emerald-600"></div>
          </div>
          <div
            className="timeline-content bg-emerald-500 dark:bg-emerald-600"
            data-aos="fade-left"
            data-aos-offset="200"
          >
            <h1>Polytechnic Foundation Program (PFP)</h1>
            <h2>Singapore Polytechnic</h2>
            <hr
              className="rounded-full border border-neutral-900/40
              transition-all duration-150 ease-linear dark:border-neutral-300/60"
            />
            <p>
              Having scored well for his GCE &#34;N&#34;-Level Examination, I
              was given the opportunity to go through PFP in place of taking the
              GCE &#34;O&#34;-Level Examination.
            </p>
          </div>
        </div>

        <div className="about-timeline-left about-timeline-div">
          <div
            className="timeline-content bg-emerald-500 dark:bg-emerald-600"
            data-aos="fade-right"
            data-aos-offset="200"
          >
            <h1>GCE &#34;N&#34;-Level Examination</h1>
            <h2>Greenridge Secondary School</h2>
            <hr
              className="rounded-full border border-neutral-900/40
              transition-all duration-150 ease-linear dark:border-neutral-300/60"
            />
            <p>
              Club Activity: GSS Chinese Orchestra
              <br />
              <br />
              Results: EMB3 of 6
            </p>
          </div>
          <div
            className="timeline-arrow"
            data-aos="fade-right"
            data-aos-delay="500"
            data-aos-duration="100"
          >
            <div className="bg-emerald-500 dark:bg-emerald-600"></div>
          </div>
          <div
            className="timeline-icon bg-emerald-500 dark:bg-emerald-600"
            data-aos="zoom-in"
          >
            <FaGraduationCap />
          </div>
          <h1 className="timeline-time" data-aos="fade-left">
            2018 - 2021
          </h1>
        </div>
        {/* [END] Timeline Repeatable Components */}
      </div>
      <div
        className="absolute z-[1] h-screen border-r-4 border-neutral-900 dark:border-neutral-300 max-sm:w-[200px] 
        sm:w-[280px] md:w-[340px] lg:w-[455px] xl:w-[580px] xxl:w-[740px]"
        ref={timelineLine}
      ></div>
    </div>
  );
};

export default AboutTimeline;
