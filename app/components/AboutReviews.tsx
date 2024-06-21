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
import { useRef } from "react";

const AboutReviews = () => {
  const numOfReviews = 8;
  const mySwiper = useRef<SwiperRef>(null);

  const handleReviewClick = (index: number) => {
    if (index >= 0 && index < numOfReviews) {
      mySwiper.current?.swiper.slideTo(index);
    }
  };

  const reviewsData = [
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
        initialSlide={1}
        centeredSlides={true}
        autoHeight={false}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          295: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          1280: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1600: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        }}
        modules={[Navigation, Pagination, Mousewheel]}
        className="w-[90%] py-10"
      >
        {reviewsData.map((data, index) => {
          return (
            <SwiperSlide
              key={index}
              className="pb-10"
              onClick={() => handleReviewClick(index)}
            >
              <div className="rounded-2xl bg-[rgb(190,190,190)] p-8 dark:bg-neutral-800">
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
                      <h1 className="font-bold hover:text-emerald-600 dark:hover:text-emerald-500">
                        {data.name}
                      </h1>
                      <p className="ml-auto text-neutral-500">{data.date}</p>
                    </div>
                    {data.position.map((position, index) => {
                      return (
                        <p
                          key={index}
                          className="hover:text-emerald-700 dark:hover:text-emerald-500"
                        >
                          {position}
                        </p>
                      );
                    })}
                  </div>
                </div>
                <p className="mt-5">
                  <FaQuoteLeft className="inline-block h-[16px] w-[16px] pb-1 pr-1 text-neutral-600 dark:text-neutral-500" />
                  {data.reviewContent}
                  <FaQuoteRight className="inline-block h-[16px] w-[16px] pb-1 pl-1 text-neutral-600 dark:text-neutral-500" />
                </p>
                <div className="flex">
                  {data.link.map((link, index) => {
                    return (
                      <a
                        key={index}
                        href={link.url}
                        className="mr-4 mt-5 text-emerald-700 hover:text-emerald-600 dark:text-emerald-500 dark:hover:text-emerald-400"
                      >
                        <div className="flex">
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

export default AboutReviews;
