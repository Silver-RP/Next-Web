"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";

interface Category {
  id: string;
  slug: string;
  name: string;
  image: string;
}

const CategorySwiper = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="position-relative">
      <Swiper
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 5000 }}
        loop={true}
        navigation={{
          nextEl: ".products-carousel__next-1",
          prevEl: ".products-carousel__prev-1",
        }}
        breakpoints={{
          320: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 15 },
          768: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 30 },
          992: { slidesPerView: 6, slidesPerGroup: 1, spaceBetween: 45 },
          1200: { slidesPerView: 8, slidesPerGroup: 1, spaceBetween: 60 },
        }}
        className="swiper-container"
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id} className="swiper-slide">
            <Link
              href={`/category/${category.slug}`}
              className="menu-link fw-medium"
              style={{ textDecoration: "none" }}
            >
              <Image
                loading="lazy"
                className="w-100 h-auto mb-3"
                src={`/assets/app/images/home/demo3/${category.image}`}
                width={124}
                height={124}
                alt={category.name}
              />
              <div className="text-center">{category.name}</div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation buttons */}
      <div className="products-carousel__prev products-carousel__prev-1 position-absolute top-50 d-flex align-items-center justify-content-center">
        <svg width="25" height="25" viewBox="0 0 25 25">
          <use href="#icon_prev_md" />
        </svg>
      </div>
      <div className="products-carousel__next products-carousel__next-1 position-absolute top-50 d-flex align-items-center justify-content-center">
        <svg width="25" height="25" viewBox="0 0 25 25">
          <use href="#icon_next_md" />
        </svg>
      </div>
    </div>
  );
};

export default CategorySwiper;
