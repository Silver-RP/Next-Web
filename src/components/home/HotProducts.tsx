import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HotDealsSwiper from "./HotDealsSwiper"; 
import Countdown from "./Countdown";

const HotDealsSection = async () => {
  const productsHot = await prisma.product.findMany({
    where: { hot: true },
    take: 8,
    select: {
      id: true,
      name: true,
      price: true,
      salePrice: true,
      images: true,
    },
  });

  return (
    <section className="hot-deals container">
      <h2 className="section-title text-center mb-3 pb-xl-3 mb-xl-4">Hot Deals</h2>
      <div className="row">
        <div className="col-md-6 col-lg-4 col-xl-3 d-flex flex-column align-items-center py-4">
          <h2>Summer Sale</h2>
          <h2 className="fw-bold">Up to 60% Off</h2>
          <Countdown targetDate="2025-12-31T23:59:59" />
          <Link href="#" className="btn-link default-underline text-uppercase fw-medium mt-3">
            View All
          </Link>
        </div>
        <div className="col-md-6 col-lg-8 col-xl-9 ps-5">
          <HotDealsSwiper products={productsHot} />
        </div>
      </div>
    </section>
  );
};

export default HotDealsSection;
