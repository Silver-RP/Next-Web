import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CartButton from "../common/CartButton";

async function getFeaturedProducts() {
  return await prisma.product.findMany({
    where: { featured: true },
    take: 20,
    select: {
      id: true,
      name: true,
      price: true,
      salePrice: true,
      images: true,
    },
  });
}

const FeaturedProducts = async () => {
  const featuredProducts = await getFeaturedProducts();

  return (
    <section className="products-grid container">
      <h2 className="section-title text-center mb-3 pb-xl-3 mb-xl-4">
        Featured Products
      </h2>
      <div className="row">
        {featuredProducts.length > 0 ? (
          featuredProducts.map((product) => (
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
              <div className="product-card product-card_style3 mb-3 mb-md-4 mb-xxl-5">
                <div className="pc__img-wrapper">
                  <Link href={`/shop/${product.id}`}>
                    <Image
                      loading="lazy"
                      src={`/assets/app/images/products/${product.images[0]}`}
                      width={330}
                      height={400}
                      alt={product.name}
                      className="pc__img"
                    />
                  </Link>
                  <CartButton productId={product.id} style={{ left: "125px" }} />
                </div>

                <div className="pc__info position-relative">
                  <h6 className="pc__title">
                    <Link
                      href={`/shop/${product.id}`}
                      className="text-black"
                      style={{ textDecoration: "none" }}
                    >
                      {product.name}
                    </Link>
                  </h6>
                  <div className="product-card__price d-flex align-items-center">
                    <span className="money price text-red  fw-normal">
                      ${product.salePrice}
                    </span>
                    <del className="money price text-secondary ms-2">
                      ${product.price}
                    </del>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No featured products available.</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
