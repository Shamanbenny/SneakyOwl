// import Swiper JS
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation, Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import {
  FaGithub,
  FaGlobe,
  FaLinkedin,
  FaQuoteLeft,
  FaQuoteRight,
} from "react-icons/fa";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { Fragment, useRef } from "react";

const LandingTestimonials = () => {
  const numOfReviews = 4;
  const mySwiper = useRef<SwiperRef>(null);

  const handleReviewClick = (index: number) => {
    if (index >= 0 && index < numOfReviews) {
      mySwiper.current?.swiper.slideTo(index);
    }
  };

  const testimonialsData = [
    {
      profilePreview: "manuel_rigger.jpg",
      name: "Manuel Rigger",
      position: ["Assistant Professor for NUS SoC", "CS3213 Course Instructor"],
      date: "30-July-2026",
      preserveParagraphs: true,
      reviewContent: `It was great to have Benny as part of CS3213! Academically, he was one of the strongest students in the class, excelling in both the exams and the group project.

The group project aimed to support a citizen-science effort in collaboration with real stakeholders. Each student team met regularly with a tutor, so I did not interact closely with the individual teams during most of the semester. However, the tutor who worked with Benny described him as highly active and someone who naturally established himself as a leader. He led discussions, provided updates on the team’s progress, and coordinated the agendas for their meetings. At the same time, he remained very hands-on and made the most code contributions within his team.

It was thus not surprising that Benny’s team was one of the three teams we shortlisted out of eleven, as their solution closely matched the needs of our collaborating stakeholder. After the course and project formally ended, I could also see Benny’s competence and enthusiasm directly. He and a small group of other students voluntarily continued developing the project, with the aim of deploying it in practice.

During a meeting that I attended with the project members, I saw what the tutor had described. Benny led the discussion, made sure that everyone had an opportunity to contribute, and moved the conversation towards an actionable outcome. Importantly, he combines strong technical ability with distinct leadership and interpersonal skills.

Overall, I consider Benny an excellent software engineer. Based on what I observed, I expect that he will quickly take on significant technical and leadership responsibilities in any team he joins.`,
      link: [
        {
          type: "portfolio",
          url: "https://www.manuelrigger.at/",
          text: "manuelrigger.at",
        },
        {
          type: "redirect",
          url: "/blog/raffles-go/Testimonial%20Letter%20for%20Benny.pdf",
          text: "View Original PDF",
        },
      ],
    },
    {
      profilePreview: "gaanesh.jpg",
      name: "Gaanesh",
      position: ["NUS Information Security since 2023/24"],
      date: "3-June-2024",
      reviewContent: `I have had the pleasure of working with Benny since the start of our 
        undergraduate degree at NUS. His attention to detail and meticulousness surpasses 
        anyone else I've encountered in school. When Benny sets his mind on accomplishing 
        a task, he does it and he does it well. A naive solution isn't enough for him; he 
        aims to optimize everything. His passion for data structures and artificial intelligence 
        is evident in the projects he has completed. Moreover, Benny cares for the people around 
        him and aims to make them better. He is an excellent teacher who shares his passion for 
        the subject with his peers. During group projects, Benny takes charge and knows how to 
        delegate the workload to fit the strengths of his teammates. He has consistently 
        demonstrated his leadership skills throughout the time I've known him, and I can 
        wholeheartedly say he is one of the nicest people I've ever met!`,
      link: [
        {
          type: "linkedin",
          url: "https://www.linkedin.com/in/gaanesht/",
          text: "@gaanesht",
        },
      ],
    },
    {
      profilePreview: "guo_gangquan.jpg",
      name: "Guo GangQuan",
      position: ["NUS Information Security since 2023/24"],
      date: "1-Aug-2026",
      preserveParagraphs: true,
      reviewContent: `I met Benny during our time studying at NUS. The first thing I noticed about him is that he is a fast learner and an effective teacher. He has a strong ability to see things from another person’s perspective, understand the difficulties they are facing, and provide relevant and practical guidance. He demonstrated these qualities during the time we were studying together after class, where he was always willing to go the extra mile to make sure I truly grasp the concept.

Another quality in his exceptional attention to detail was observed in almost every group project we completed together, but it was especially evident in a mathematics module that we took. Benny noticed a small but important provision that many students might have overlooked: students were permitted to use self-programmed tools during the examination. Recognizing the opportunity, he developed a customized calculator program for the module that could efficiently solve many of the question types covered in the course. This demonstrated not only his attentiveness, but also his initiative, technical ability, and capacity to turn a subtle observation into a practical solution. The willingness of his to then share and open source his tools for future cohorts definitely speak of his character to give back to the community as well!

I also work with Benny on several course projects, where he was consistently punctual, well-prepared, and proactive in planning ahead of schedule. He was highly adaptable and responded calmly and efficiently to unexpected changes, such as unavailable team members, revised deadlines, or changes in project requirements. Working with Benny gave me a strong sense of confidence and reassurance because I knew he was someone the team could rely on, especially during challenging or uncertain situations. During group discussions, he actively sought everyone’s opinions and carefully considered their concerns when developing plans and making decisions.

I greatly value the experience of studying and working with him, and I am confident that he will continue to make a positive contribution wherever he goes.`,
      link: [
        {
          type: "linkedin",
          url: "https://www.linkedin.com/in/gangquan-guo-796911195/",
          text: "@gangquan-guo",
        },
      ],
    },
    {
      profilePreview: "anonymous.png",
      name: "Jason",
      position: [
        "CSIT Undergraduate Scholar",
        "NUS Information Security since 2023/24",
      ],
      date: "30-May-2024",
      reviewContent: `Benny is a standout individual with an insatiable hunger for knowledge and 
        an unwavering drive. In the year we've worked together, I've seen his proactive approach 
        to learning and dedication to mastering new skills. He enthusiastically tackles every 
        challenge, consistently putting forth his best effort and delivering exceptional results. 
        Benny's collaborative nature and positive attitude make him a pleasure to work with, 
        fostering a supportive and inclusive environment.`,
      link: [
        {
          type: "linkedin",
          url: "https://www.linkedin.com/in/jasonkkf/",
          text: "@jasonkkf",
        },
      ],
    },
  ];

  const handleLinkType = (type: string) => {
    switch (type) {
      case "linkedin":
        return <FaLinkedin className="my-auto mr-1 h-[18px] w-[18px]" />;
      case "github":
        return <FaGithub className="my-auto mr-1 h-[18px] w-[18px]" />;
      case "portfolio":
        return <FaGlobe className="my-auto mr-1 h-[18px] w-[18px]" />;
      case "redirect":
        return <FaArrowUpRightFromSquare className="my-auto mr-1 h-3.5 w-3.5" />;
      default:
        return <FaGlobe className="my-auto mr-1 h-[18px] w-[18px]" />;
    }
  };

  return (
    <>
      <Swiper
        ref={mySwiper}
        mousewheel={false}
        speed={500}
        initialSlide={0}
        centeredSlides={true}
        autoHeight={true}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          295: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          1024: {
            autoHeight: false,
            slidesPerView: 1.5,
            spaceBetween: 30,
          },
          1600: {
            autoHeight: false,
            slidesPerView: 1.5,
            spaceBetween: 30,
          },
        }}
        modules={[Navigation, Pagination, Mousewheel]}
        className="landing-testimonials-swiper w-full py-10"
      >
        {testimonialsData.map((data, index) => {
          return (
            <SwiperSlide
              key={index}
              className="pb-10"
              onClick={() => handleReviewClick(index)}
            >
              <div className="site-surface-card flex flex-col rounded-2xl p-8">
                <div className="flex">
                  <Image
                    src={`/reviewImages/${data.profilePreview}`}
                    width={512}
                    height={512}
                    alt="Profile Picture"
                    className="my-auto h-[48px] w-[48px] rounded-[50%]"
                  />
                  <div className="ml-3 w-full">
                    <div className="flex">
                      <h1 className="font-bold hover:text-[color:var(--site-accent-soft)]">
                        {data.name}
                      </h1>
                      <p className="ml-auto text-neutral-500">{data.date}</p>
                    </div>
                    {data.position.map((position, index) => {
                      return (
                        <p
                          key={index}
                          className="hover:text-[color:var(--site-accent-soft)]"
                        >
                          {position}
                        </p>
                      );
                    })}
                  </div>
                </div>
                <p className="mt-5">
                  <FaQuoteLeft className="inline-block h-[16px] w-[16px] pb-1 pr-1 text-[color:var(--site-text-muted)]" />
                  {data.preserveParagraphs
                    ? data.reviewContent.split("\n\n").map((paragraph, index) => (
                        <Fragment key={paragraph}>
                          {index > 0 && <><br /><br /></>}
                          {paragraph}
                        </Fragment>
                      ))
                    : data.reviewContent}
                  <FaQuoteRight className="inline-block h-[16px] w-[16px] pb-1 pl-1 text-[color:var(--site-text-muted)]" />
                </p>
                <div className="mt-auto flex flex-col items-start gap-2 pt-5">
                  {data.link.map((link, index) => {
                    return (
                      <a
                        key={index}
                        href={link.url}
                        className="site-link-accent w-full"
                      >
                        <div className="flex min-w-0 flex-wrap">
                          {handleLinkType(link.type)}
                          {link.text}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default LandingTestimonials;
