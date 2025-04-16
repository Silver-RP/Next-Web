import { prisma } from "@/lib/prisma";
import Link from "next/link";
import "rc-slider/assets/index.css";
import ShopPriceFilter from "./shop-price-filter";

export default async function ShopSidebar() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
  });
  

  return (
    <div className="px-3 pe-2">
      <div className="pt-4 pt-lg-0"></div>

      <div className="accordion" id="categories-list">
        <div className="accordion-item mb-4 pb-3">
          <h5 className="accordion-header">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-1"
            >
              Product Categories
            </button>
          </h5>
          <div
            id="accordion-filter-1"
            
          >
            <div className="accordion-body px-0 pb-0 pt-3">
              <ul className="list list-inline mb-0 ms-2">
                {categories.length > 0 ? (
                  categories.map((cate) => (
                    <li key={cate.id} className="list-item">
                      <Link
                        href={`/category/${cate.slug}`}
                        className="menu-link py-1"
                      >
                        {cate.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-muted">No categories available</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="accordion" id="color-filters">
        <div className="accordion-item mb-4 pb-3">
          <h5 className="accordion-header" id="accordion-heading-1">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-2"
              aria-expanded="true"
              aria-controls="accordion-filter-2"
            >
              Color
              <svg
                className="accordion-button__icon type2"
                viewBox="0 0 10 6"
                xmlns="http://www.w3.org/2000/svg"
              ></svg>
            </button>
          </h5>
          <div
            id="accordion-filter-2"
            
            aria-labelledby="accordion-heading-1"
            data-bs-parent="#color-filters"
            style={{ display: "block" }}
          >
            <div className="accordion-body px-0 pb-0">
              <div className="d-flex flex-wrap">
                <a
                  href="#"
                  className="swatch-color js-filter"
                  style={{ color: "#0a2472" }}
                ></a>
                <a
                  href="#"
                  className="swatch-color js-filter"
                  style={{ color: "#d7bb4f" }}
                ></a>
                <a
                  href="#"
                  className="swatch-color js-filter"
                  style={{ color: "#282828" }}
                ></a>
                <a
                  href="#"
                  className="swatch-color js-filter"
                  style={{ color: "#b1d6e8" }}
                ></a>
                <a
                  href="#"
                  className="swatch-color js-filter"
                  style={{ color: "#9c7539" }}
                ></a>
                <a
                  href="#"
                  className="swatch-color js-filter"
                  style={{ color: "#d29b48" }}
                ></a>
                <a
                  href="#"
                  className="swatch-color js-filter"
                  style={{ color: "#e6ae95" }}
                ></a>
                <a
                  href="#"
                  className="swatch-color js-filter"
                  style={{ color: "#d76b67" }}
                ></a>
                <a
                  href="#"
                  className="swatch-color swatch_active js-filter"
                  style={{ color: "#bababa" }}
                ></a>
                <a
                  href="#"
                  className="swatch-color js-filter"
                  style={{ color: "#bfdcc4" }}
                ></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="accordion" id="size-filters">
        <div className="accordion-item mb-4 pb-3">
          <h5 className="accordion-header" id="accordion-heading-size">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-size"
              aria-expanded="true"
              aria-controls="accordion-filter-size"
            >
              Sizes
              <svg
                className="accordion-button__icon type2"
                viewBox="0 0 10 6"
                xmlns="http://www.w3.org/2000/svg"
              ></svg>
            </button>
          </h5>
          <div
            id="accordion-filter-size"
            
            aria-labelledby="accordion-heading-size"
            data-bs-parent="#size-filters"
          >
            <div className="accordion-body px-0 pb-0">
              <div className="d-flex flex-wrap">
                <a
                  href="#"
                  className="swatch-size btn btn-sm btn-outline-secondary text-black mb-3 me-3 js-filter"
                >
                  XS
                </a>
                <a
                  href="#"
                  className="swatch-size btn btn-sm  btn-outline-secondary text-black mb-3 me-3 js-filter"
                >
                  S
                </a>
                <a
                  href="#"
                  className="swatch-size btn btn-sm  btn-outline-secondary text-black mb-3 me-3 js-filter"
                >
                  M
                </a>
                <a
                  href="#"
                  className="swatch-size btn btn-sm  btn-outline-secondary text-black mb-3 me-3 js-filter"
                >
                  L
                </a>
                <a
                  href="#"
                  className="swatch-size btn btn-sm  btn-outline-secondary text-black mb-3 me-3 js-filter"
                >
                  XL
                </a>
                <a
                  href="#"
                  className="swatch-size btn btn-sm  btn-outline-secondary text-black mb-3 me-3 js-filter"
                >
                  XXL
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

          <div className="me-2 pe-3">
          <h5 className="text-lg font-semibold mb-2">Price</h5>
          <ShopPriceFilter min={10} max={1000} />
        </div>
    </div>
  );
}
