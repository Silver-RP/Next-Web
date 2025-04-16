"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "@/components/Head";

interface Category {
  id: string;
  name: string;
}

const AddProduct = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [cateId, setCateId] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [SKU, setSKU] = useState("");
  const [quantity, setQuantity] = useState("");
  const [featured, setFeatured] = useState("0");
  const [hot, setHot] = useState("0");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    } else {
      setPreviewImage(null);
    }
    setImages(files);
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Adding product...");

    if (
      !name ||
      !cateId ||
      !shortDescription ||
      !description ||
      !price ||
      !salePrice ||
      !SKU ||
      !quantity ||
      !images
    ) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("cateId", cateId);
    formData.append("shortDescription", shortDescription);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("salePrice", salePrice);
    formData.append("SKU", SKU);
    formData.append("quantity", quantity);
    formData.append("featured", featured);
    formData.append("hot", hot);


 for (let pair of formData.entries()) {
  console.log(pair[0]+ ': ' + pair[1]);
}



    Array.from(images).forEach((file) => formData.append("images", file));


    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to add product");
      }
      alert("Product added successfully");
      
      setName("");
      setCateId("");
      setShortDescription("");
      setDescription("");
      setImages(null);
      setPreviewImage(null);
      setPrice("");
      setSalePrice("");
      setSKU("");
      setQuantity("");
      setFeatured("0");
      setHot("0");

      router.push("/dashboard/products");
    } catch (error) {
      console.error("Error adding product:", error);
      alert((error as Error).message || "An error occurred while adding the product");
    }
  };

  return (
    <>
      <Head title="Add Product" />
      <div className="main-content-inner">
        <div className="main-content-wrap">
          <div className="flex items-center flex-wrap justify-between gap20 mb-27">
            <h3>Add Product</h3>
            <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
              <li>
                <a href="/dashboard">
                  <div className="text-tiny">Dashboard</div>
                </a>
              </li>
              <li>
                <i className="icon-chevron-right">▸</i>
              </li>
              <li>
                <a href="/dashboard/products">
                  <div className="text-tiny">Products</div>
                </a>
              </li>
              <li>
                <i className="icon-chevron-right">▸</i>
              </li>
              <li>
                <div className="text-tiny">Add product</div>
              </li>
            </ul>
          </div>
          <form
            className="tf-section-2 form-add-product"
            method="POST"
            encType="multipart/form-data"
            onSubmit={handleAddProduct}
          >
            <div className="wg-box">
              <fieldset className="name">
                <div className="body-title mb-10">
                  Product name <span className="tf-color-1">*</span>
                </div>
                <input
                  className="mb-10"
                  type="text"
                  placeholder="Enter product name"
                  name="name"
                  aria-required="true"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="text-tiny">
                  Do not exceed 100 characters when entering the product name.
                </div>
              </fieldset>

              <div className="gap22 cols">
                <fieldset className="category">
                  <div className="body-title mb-10">
                    Category <span className="tf-color-1">*</span>
                  </div>
                  <div className="select">
                    <select
                      className=""
                      name="cateId"
                      value={cateId}
                      required
                      onChange={(e) => setCateId(e.target.value)}
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </fieldset>
              </div>

              <fieldset className="shortdescription">
                <div className="body-title mb-10">
                  Short Description <span className="tf-color-1">*</span>
                </div>
                <textarea
                  className="mb-10 ht-150"
                  name="shortDescription"
                  placeholder="Short Description"
                  aria-required="true"
                  required
                  onChange={(e) => setShortDescription(e.target.value)}
                ></textarea>
                <div className="text-tiny">
                  Do not exceed 100 characters when entering the product name.
                </div>
              </fieldset>

              <fieldset className="description">
                <div className="body-title mb-10">
                  Description <span className="tf-color-1">*</span>
                </div>
                <textarea
                  className="mb-10"
                  name="description"
                  placeholder="Description"
                  aria-required="true"
                  required
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <div className="text-tiny">
                  Do not exceed 100 characters when entering the product name.
                </div>
              </fieldset>
            </div>
            <div className="wg-box">
              <fieldset>
                <div className="body-title">
                  Upload images <span className="tf-color-1">*</span>
                </div>
                <div className="upload-image flex-grow">
                  {previewImage && (
                    <div className="item" id="imgpreview">
                      <img
                        src={previewImage}
                        className="effect8"
                        alt="Preview"
                      />
                    </div>
                  )}

                  <div id="upload-file" className="item up-load">
                    <label className="uploadfile" htmlFor="myFile">
                      <span className="icon">
                        <i className="icon-upload-cloud"></i>
                      </span>
                      <span className="body-text">
                        Drop your images here or select{" "}
                        <span className="tf-color">click to browse</span>
                      </span>
                      <input
                        type="file"
                        id="myFile"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleImagePreview}
                      />
                    </label>
                  </div>
                </div>
              </fieldset>

              <div className="cols gap22">
                <fieldset className="name">
                  <div className="body-title mb-10">
                    Regular Price <span className="tf-color-1">*</span>
                  </div>
                  <input
                    className="mb-10"
                    type="text"
                    placeholder="Enter regular price"
                    name="price"
                    aria-required="true"
                    required
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </fieldset>
                <fieldset className="name">
                  <div className="body-title mb-10">
                    Sale Price <span className="tf-color-1">*</span>
                  </div>
                  <input
                    className="mb-10"
                    type="text"
                    placeholder="Enter sale price"
                    name="salePrice"
                    aria-required="true"
                    required
                    onChange={(e) => setSalePrice(e.target.value)}
                  />
                </fieldset>
              </div>

              <div className="cols gap22">
                <fieldset className="name">
                  <div className="body-title mb-10">
                    SKU <span className="tf-color-1">*</span>
                  </div>
                  <input
                    className="mb-10"
                    type="text"
                    placeholder="Enter SKU"
                    name="SKU"
                    aria-required="true"
                    required
                    onChange={(e) => setSKU(e.target.value)}
                  />
                </fieldset>
                <fieldset className="name">
                  <div className="body-title mb-10">
                    Quantity <span className="tf-color-1">*</span>
                  </div>
                  <input
                    className="mb-10"
                    type="text"
                    placeholder="Enter quantity"
                    name="quantity"
                    aria-required="true"
                    required
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </fieldset>
              </div>

              <div className="cols gap22">
                <fieldset className="name">
                  <div className="body-title mb-10">Featured</div>
                  <div className="select mb-10">
                    <select
                      className=""
                      name="featured"
                      onChange={(e) => setFeatured(e.target.value)}
                      value={featured}
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                </fieldset>

                <fieldset className="name">
                  <div className="body-title mb-10">Hot</div>
                  <div className="select mb-10">
                    <select
                      className=""
                      name="hot"
                      onChange={(e) => setHot(e.target.value)}
                      value={hot}
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                </fieldset>
              </div>
              <div className="cols gap10">
                <button className="tf-button w-full" type="submit">
                  Add product
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
