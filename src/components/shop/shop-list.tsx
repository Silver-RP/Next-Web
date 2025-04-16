"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Pagination from "./pagination";
import CartButton from "../common/CartButton";

interface Product {
  id: string;
  name: string;
  cateName: string;
  salePrice: number;
  price: number;
  images: string[];
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

interface ProductListProps {
  products: Product[];
  pagination: PaginationProps;
  sort: string;
}

export default function ProductList({
  products,
  pagination,
  sort,
}: ProductListProps) {
  const searchParams = useSearchParams(); 

  return (
    <div className="shop-list">
      <div className="d-flex justify-content-between mb-4 pb-md-2">
        <div className="breadcrumb mb-0 d-none d-md-block">
          <Link href="/" className="menu-link text-uppercase fw-semibold">
            Home
          </Link>
          <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
            /
          </span>
          <Link href="/shop" className="menu-link text-uppercase fw-semibold">
            The Shop
          </Link>
        </div>

        <div className="shop-acs d-flex align-items-center justify-content-between">
          <form method="GET" action="/shop">
            <select
              className="shop-acs__select form-select w-auto border-0 py-0"
              name="sort"
              defaultValue={sort}
              onChange={(e) => {
                const newSort = e.target.value;
                const currentPage = searchParams.get("page") || "1";
                window.location.href = `/shop?page=${currentPage}&sort=${newSort}`;
              }}
            >
              <option value="default">Default Sorting</option>
              <option value="featured">Featured</option>
              <option value="name_asc">Name: A-Z</option>
              <option value="name_desc">Name: Z-A</option>
              <option value="salePrice_asc">Price: Low to High</option>
              <option value="salePrice_desc">Price: High to Low</option>
            </select>
          </form>
        </div>
      </div>

      <div className="products-grid row row-cols-2 row-cols-md-3">
        {products.map((product) => (
          <div className="product-card-wrapper" key={product.id}>
            <div className="product-card mb-3">
              <div className="pc__img-wrapper">
                <Link href={`/shop/${product.id}`}>
                  <img
                    src={`/assets/app/images/products/${product.images[0]}`}
                    alt={product.name}
                    width={330}
                    height={400}
                    className="pc__img"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                      width: "100%",
                      height: "100%",
                      borderRadius: "10px",
                      paddingRight: "100px",
                    }}
                  />
                </Link>
                    <CartButton productId={product.id}/>

              </div>

              <div className="pc__info position-relative">
                <p className="pc__category">{product.cateName} </p>
                <h6 className="pc__title">
                  <Link href={`/shop/${product.id}`} className="text-black">
                    {product.name}
                  </Link>
                </h6>
                <div className="product-card__price d-flex">
                  <span className="money price text-red">
                    ${product.salePrice}
                  </span>
                  <del className="ms-3 text-secondary">${product.price}</del>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        sort={sort} 
      />
    </div>
  );
}
