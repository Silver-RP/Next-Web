"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";


export default function ProductList({
  initialProducts,
  totalPages,
}: {
  initialProducts: any[];
  totalPages: number;
}) {
  const [products, setProducts] = useState(initialProducts);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      const params = new URLSearchParams(searchParams.toString());
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products);
    }
    fetchProducts();
  }, [searchParams]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("sort", e.target.value);
    router.push(`/dashboard/products?${newParams.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", newPage.toString());
    router.push(`/dashboard/products?${newParams.toString()}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts(products.filter((product) => product.id !== id));
      } else {
        alert("Failed to delete the product.");
      }
    }
  };

  return (
    <div className="main-content-inner">
      <div className="main-content-wrap">
        <div className="flex items-center flex-wrap justify-between gap20 mb-27">
          <h3>All Products</h3>
          <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
            <li>
              <a href="/dashboard">
                <div className="text-tiny">Dashboard</div>
              </a>
            </li>
            <li>
              <i className="icon-chevron-right"> ▸</i>
            </li>
            <li>
              <div className="text-tiny">All Products</div>
            </li>
          </ul>
        </div>

        <div className="wg-box">
          <div className="flex items-center justify-between gap10 flex-wrap">
            <div className="wg-filter flex-grow">
              <form className="form-search">
                <fieldset className="name">
                  <input
                    type="text"
                    placeholder="Search here..."
                    name="name"
                    required
                  />
                </fieldset>
                <div className="button-submit">
                  <button type="submit">
                    <i className="icon-search"></i>
                  </button>
                </div>
              </form>
            </div>
            <Link
              className="tf-button style-1 w208"
              href="/dashboard/products/add-product"
            >
              <i className="icon-plus"></i> Add new
            </Link>
          </div>

          <div>
            <form id="sort-form">
              <select
                className="fs-5 form-select w-auto border-0 py-0"
                name="sort"
                onChange={handleSortChange}
                defaultValue={searchParams.get("sort") || "default"}
              >
                <option value="default">Default Sorting</option>
                <option value="name_asc">Name: A-Z</option>
                <option value="name_desc">Name: Z-A</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </form>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th className="fs-4">#</th>
                  <th className="fs-5">Name</th>
                  <th className="fs-5">Price</th>
                  <th className="fs-5">Sale Price</th>
                  <th className="fs-5">Category</th>
                  <th className="fs-5">Featured</th>
                  <th className="fs-5">Quantity</th>
                  <th className="fs-5">Sold</th>
                  <th className="fs-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="pname">
                          <div className="image">
                            <img
                              src={`/assets/app/images/products/${product.images[0]}`}
                              alt={product.name}
                            />
                          </div>
                          <div className="name">
                            <a href="#" className="body-title-2">
                              {product.name}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td>${product.price}</td>
                      <td>${product.salePrice}</td>
                      <td>{product.category?.name}</td>
                      <td>{product.featured ? "Yes" : "No"}</td>
                      <td>{product.quantity}</td>
                      <td>{product.saledQuantity}</td>
                      <td>
                        <div className="list-icon-function">
                          <a href="#" target="_blank">
                            <div className="item eye">
                            <FontAwesomeIcon icon={faEye} />
                            </div>
                          </a>
                          <Link href={`/dashboard/products/edit-product/${product.id}`}>
                            <div className="item edit">
                            <FontAwesomeIcon icon={faPen} />
                            </div>
                          </Link>
                          <div
                            className="item text-danger delete"
                            onClick={() =>handleDelete(product.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="divider"></div>
          <div className="pagination">
            <button
              onClick={() =>
                handlePageChange(Number(searchParams.get("page") || 1) - 1)
              }
              disabled={Number(searchParams.get("page") || 1) === 1}
              className="btn text-white bg-black"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={Number(searchParams.get("page")) === page}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                handlePageChange(Number(searchParams.get("page") || 1) + 1)
              }
              disabled={Number(searchParams.get("page") || 1) === totalPages}
              className="btn text-white bg-black"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
