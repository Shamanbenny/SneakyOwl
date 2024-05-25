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
      profilePreview: "anonymous.png",
      name: "Ernest",
      position: "Software Engineer",
      date: "25-May-2024",
      reviewContent: `He is smart. He is smart. He is smart. He is smart. He is smart. He is smart. 
        He is smart. He is smart. He is smart. He is smart. He is smart. He is smart. He is smart. 
        He is smart. He is smart. He is smart.`,
      link: [
        {
          type: "linkedin",
          url: "https://www.linkedin.com/in/ernest",
          text: "@ernest",
        },
      ],
    },
    {
      profilePreview: "anonymous.png",
      name: "Gaanesh",
      position: "NUS Information Security since 2023/24",
      date: "25-May-2024",
      reviewContent: `Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop 
        Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop 
        Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop`,
      link: [
        {
          type: "linkedin",
          url: "https://www.linkedin.com/in/gaanesh",
          text: "@gaanesh",
        },
        {
          type: "github",
          url: "https://github.com/gaanesh",
          text: "@gaanesh",
        },
        {
          type: "portfolio",
          url: "https://gaanesh.com",
          text: "gaanesh.com",
        },
      ],
    },
    {
      profilePreview: "anonymous.png",
      name: "Kobin",
      position: "Cyber Security Analyst",
      date: "25-May-2024",
      reviewContent: `He is smart. He is smart. He is smart. He is smart. He is smart. He is smart. 
        He is smart. He is smart. He is smart. He is smart. He is smart. He is smart. He is smart. 
        He is smart. He is smart. He is smart.`,
      link: [
        {
          type: "github",
          url: "https://github.com/kobin",
          text: "@kobin",
        },
      ],
    },
    {
      profilePreview: "anonymous.png",
      name: "Hui Ting",
      position: "COO of Cyber Youth Singapore",
      date: "25-May-2024",
      reviewContent: `Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop 
        Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop 
        Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop Beep Boop`,
      link: [
        {
          type: "linkedin",
          url: "https://www.linkedin.com/in/HuiTing",
          text: "@huiting",
        },
      ],
    },
    {
      profilePreview: "anonymous.png",
      name: "Jason",
      position: "NUS Information Security since 2023/24",
      date: "25-May-2024",
      reviewContent: `He is smart. He is smart. He is smart. He is smart. He is smart. He is smart. 
        He is smart. He is smart. He is smart. He is smart. He is smart. He is smart. He is smart. 
        He is smart. He is smart. He is smart.`,
      link: [
        {
          type: "linkedin",
          url: "https://www.linkedin.com/in/jason",
          text: "@jason",
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
        mousewheel={true}
        speed={500}
        initialSlide={1}
        centeredSlides={true}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          295: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          1024: {
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
                      <h1 className="font-bold">{data.name}</h1>
                      <p className="ml-auto text-neutral-500">{data.date}</p>
                    </div>
                    <p>{data.position}</p>
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
