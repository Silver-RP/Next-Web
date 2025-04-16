
import Slideshow from "@/components/home/Slideshow";
import Categories from "@/components/home/CategoryCarousel";
import HotProducts from "@/components/home/HotProducts";
import Banner from "@/components/home/Banner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Head from "next/head";

export default function Home() {

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      
      <Slideshow />
      
      <div className="container mw-1620 bg-white border-radius-10">
        <div className="mb-3 mb-xl-5 pt-1 pb-4"></div>
        <Categories />
        <div className="mb-3 mb-xl-5 pt-1 pb-4"></div>
        <HotProducts />
        <div className="mb-3 mb-xl-5 pt-1 pb-4"></div>
        <Banner />
        <div className="mb-3 mb-xl-5 pt-1 pb-4"></div>
        <FeaturedProducts />
      </div>
    </>
  );
}
