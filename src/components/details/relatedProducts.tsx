"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CartButton from "../common/CartButton";
// import { useCart } from "@/context/CartContext";
// import WishlistButton from "@/components/common/WishlistButton";

interface Product {
  id: string;
  name: string;
  images: string[];
  salePrice: number;
  price: number;
  productCate?: string;
}

export default function RelatedProducts({
  relatedProducts,
}: {
  relatedProducts: Product[];
}) {
  //   const { addToCart } = useCart();

  //   const handleAddToCart = async (productId: string, quantity: number) => {
  //     try {
  //       const response = await addToCart(productId, quantity);
  //       if (response?.success) {
  //         console.log("Product added to cart successfully");
  //       } else {
  //         alert("Failed to add product to cart. Please try again.");
  //       }
  //     } catch (error) {
  //       console.error("Error adding to cart:", error);
  //       alert("An error occurred while adding to cart");
  //     }
  //   };

  if (!relatedProducts.length) return <p>Loading related products...</p>;

  return (
    <section className="products-carousel container">
      <h2 className="h3 text-uppercase mb-4 pb-xl-2 mb-xl-4">
        Related <strong>Products</strong>
      </h2>

      <div id="related_products" className="position-relative">
        <Swiper
          modules={[Navigation, Pagination]}
          autoplay={false}
          slidesPerView={4}
          slidesPerGroup={4}
          loop={true}
          navigation={{
            nextEl: ".products-carousel__next",
            prevEl: ".products-carousel__prev",
          }}
          pagination={{ el: ".products-pagination", clickable: true }}
          breakpoints={{
            320: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 14 },
            768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24 },
            992: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 30 },
          }}
          className="js-swiper-slider"
        >
          {relatedProducts.map((product) => (
            <SwiperSlide key={product.id} className="product-card">
              <div className="pc__img-wrapper">
                <Link href={`/shop/${product.id}`}>
                  <Image
                    loading="lazy"
                    src={
                      product.images[0]?.[0]
                        ? `/assets/app/images/products/${product.images[0]}`
                        : "/default-image.jpg"
                    }
                    width={330}
                    height={400}
                    alt={product.name}
                    className="pc__img"
                  />
                  {product.images[1]?.[0] && (
                    <Image
                      loading="lazy"
                      src={`/assets/app/images/products/${product.images[1]}`}
                      width={330}
                      height={400}
                      alt={product.name}
                      className="pc__img pc__img-second"
                    />
                  )}
                </Link>
                <CartButton productId={product.id} style={{ left: "125px" }} />

              </div>
              <div className="pc__info position-relative">
                <p className="pc__category">{product.productCate}</p>
                <h6 className="pc__title text-dark">
                  <Link
                    href={`/details/${product.id}`}
                    className="pc__title text-dark"
                  >
                    {product.name}
                  </Link>
                </h6>
                <div className="product-card__price d-flex">
                  <span className="money price text-red">
                    ${product.salePrice}
                  </span>
                  {product.salePrice < product.price && (
                    <del className="ms-3">${product.price}</del>
                  )}
                  {/* <span className="ms-5"> <WishlistButton productId={product._id} /> </span> */}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="products-carousel__prev position-absolute top-50 d-flex align-items-center justify-content-center">
          <svg width="25" height="25" viewBox="0 0 25 25">
            <use href="#icon_prev_md" />
          </svg>
        </div>

        <div className="products-carousel__next position-absolute top-50 d-flex align-items-center justify-content-center">
          <svg width="25" height="25" viewBox="0 0 25 25">
            <use href="#icon_next_md" />
          </svg>
        </div>

        <div className="products-pagination mt-4 mb-5 d-flex align-items-center justify-content-center"></div>
      </div>
    </section>
  );
}
