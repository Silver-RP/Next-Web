"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import CartButton from "../common/CartButton";

const HotDealsSwiper = ({ products }: { products: any[] }) => {
  return (
    <Swiper
      slidesPerView={4}
      spaceBetween={15}
      autoplay={{ delay: 5000 }}
      modules={[Autoplay]}
    >
      {products.map((product) => (
        <SwiperSlide
          key={product.id}
          className="product-card product-card_style3"
        >
          <div
            className="pc__img-wrapper-home rounded-3 position-relative"
            style={{
              paddingRight: "60px",
            }}
          >
            <Link href={`/shop/${product.id}`}>
              <Image
                loading="lazy"
                src={`/assets/app/images/products/${product.images[0]}`}
                width={285}
                height={313}
                alt={product.name}
                className="w-100 h-100"
                style={{
                  objectFit: "cover",
                  objectPosition: "center center",
                }}
              />
            </Link>

            {/* <button className="add-to-cart-btn-hotdeals">Add to Cart</button> */}
            {/* <button className="add-to-cart-btn" style={{ left: "92px" }}>Add to Cart</button>; */}
            <CartButton productId={product.id} style={{ left: "92px" }} />

          </div>

          <div className="pc__info position-relative">
            <h6 className="pc__title">
              <Link href={`/shop/${product.id}`} className="text-black">
                {product.name}
              </Link>
            </h6>
            <div className="product-card__price d-flex">
              <span className="money price text-red ms-2 fw-semibold">
                ${product.salePrice}
              </span>
              <del className="money price text-secondary ms-2">
                ${product.price}
              </del>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HotDealsSwiper;
