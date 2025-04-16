"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Head from "@/components/Head";

interface Category {
  id: string;
  name: string;
}

const EditProduct = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [cateId, setCateId] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [SKU, setSKU] = useState("");
  const [quantity, setQuantity] = useState("");
  const [featured, setFeatured] = useState("0");
  const [hot, setHot] = useState("0");
  const [productCate, setProductCate] = useState<any>(null);
  const [oldImages, setOldImages] = useState<string[]>([]);
  const [product, setProduct] = useState<any>(null);

  const { id } = useParams();

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      const formattedOldImages = product.images.flat();
      setOldImages(formattedOldImages);

      // Convert to URLs for preview
      setImageUrls(
        formattedOldImages.map(
          (img: any) =>
            `http://localhost:3000/app/assets/images/products/${img}`
        )
      );
    }
  }, [product]);

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

    const fetchProduct = async (id: string) => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        if (!data.success)
          throw new Error(data.message || "Failed to fetch product");
        setProductCate(data.data);
        setName(data.data.name);
        setCateId(data.data.category.id);
        setShortDescription(data.data.shortDescription);
        setDescription(data.data.description);
        setPrice(data.data.price);
        setSalePrice(data.data.salePrice);
        setSKU(data.data.SKU);
        setQuantity(data.data.quantity);
        setFeatured(data.data.featured ? "1" : "0");
        setHot(data.data.hot ? "1" : "0");
        setOldImages(data.data.images || []);
        setImageUrls(
        (data.data.images || []).map(
            (img: string) =>
            `http://localhost:3000/assets/app/images/products/${img}`
        )
        );
      } catch (error) {}
    };

    fetchCategories();
    fetchProduct(id as string);
  }, [id]);

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImages(files);
      const previewUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImageUrls(previewUrls);
      setPreviewImage(previewUrls[0]);
    } else {
      setImages(null);
      setImageUrls([]);
      setPreviewImage(null);
    }
  };

  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   
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
    if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      }

    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }


    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to add product");
      }
      alert("Product updated successfully");

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
      alert(
        (error as Error).message || "An error occurred while adding the product"
      );
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
            onSubmit={handleEditProduct}
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
                  value={name}
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
                  value={shortDescription}
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
                  value={description}
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
                  {imageUrls.length > 0 ? (
                    <div className="item">
                      <img
                        src={`${imageUrls[0]}`}
                        className="effect8"
                        alt="Preview"
                      />
                    </div>
                  ) : (
                    <p>No images available</p>
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
                    value={price}
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
                    value={salePrice}
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
                    value={SKU}
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
                    value={quantity}
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

export default EditProduct;
