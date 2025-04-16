"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "@/styles/app/css/slideshow.css"; 

const slides = [
  {
    id: 1,
    imgSrc: "/assets/app/images/home/demo3/slideshow-character1.png",
    title: "Night Spring",
    subtitle: "Dresses",
    label: "Dresses",
  },
  {
    id: 2,
    imgSrc: "/assets/app/images/slideshow-character1.png",
    title: "Night Spring",
    subtitle: "Dresses",
    label: "Summer",
  },
  {
    id: 3,
    imgSrc: "/assets/app/images/slideshow-character2.png",
    title: "Night Spring",
    subtitle: "Dresses",
    label: "",
  },
];

const Slideshow = () => {
  return (
    <section className="slideshow">
      <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        slidesPerView={1}
        effect="fade"
        loop={true}
        fadeEffect={{ crossFade: true }} 
        className="swiper-wrapper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="swiper-slide">
            <div className="slide-content d-flex flex-row-reverse align-items-center justify-content-between">
              <div className="slideshow-image-container">
                <Image
                  src={slide.imgSrc}
                  alt={slide.subtitle}
                  className="slideshow-image img-fluid"
                  width={500}
                  height={500}
                  priority // ✅ Tải ảnh đầu tiên nhanh hơn
                />
              </div>
              <div className="slideshow-text-container">
                {slide.label && (
                  <div className="label">
                    <p className="text-uppercase font-sofia">{slide.label}</p>
                  </div>
                )}
                <h6 className="text-uppercase fs-base">New Arrivals</h6>
                <h2 className="fw-normal slide-title">{slide.title}</h2>
                <h3 className="fw-bold slide-title">{slide.subtitle}</h3>
                <a href="#" className="btn btn-light">Shop Now</a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Slideshow;
