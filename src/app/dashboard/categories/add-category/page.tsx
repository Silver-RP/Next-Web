
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

const AddCategory = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const category = new FormData();
    category.append("name", formData.get("name") as string);
    category.append("slug", formData.get("slug") as string);

    if (!category.get("name") || !category.get("slug") || !imageFile) {
      alert("Category name, slug, and image are required");
      return;
    }

    category.append("image", imageFile);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        body: category,
        });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      if (responseData.error) {
        alert(responseData.error);
        return;
      }

      if(responseData.category) {
        router.push("/dashboard/categories");
      }

    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Add Category</title>
      </Head>
      <div className="main-content-inner">
        <div className="main-content-wrap">
          <div className="flex items-center flex-wrap justify-between gap20 mb-27">
            <h3>Add Category</h3>
            <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
              <li>
                <a href="#"><div className="text-tiny">Dashboard</div></a>
              </li>
              <li><i className="icon-chevron-right">▸</i></li>
              <li>
                <a href="#"><div className="text-tiny">Categories</div></a>
              </li>
              <li><i className="icon-chevron-right">▸</i></li>
              <li><div className="text-tiny">New Category</div></li>
            </ul>
          </div>
          <div className="wg-box">
            <form className="form-new-product form-style-1" method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
              <fieldset className="name">
                <div className="body-title">
                  Category Name <span className="tf-color-1">*</span>
                </div>
                <input className="flex-grow" type="text" placeholder="Category name" name="name" required />
              </fieldset>
              <fieldset className="name">
                <div className="body-title">
                  Category Slug <span className="tf-color-1">*</span>
                </div>
                <input className="flex-grow" type="text" placeholder="Category Slug" name="slug" required />
              </fieldset>
              <fieldset>
                <div className="body-title">
                  Upload images <span className="tf-color-1">*</span>
                </div>
                <div className="upload-image flex-grow">
                  {previewImage && (
                    <div className="item" id="imgpreview">
                      <img src={previewImage} className="effect8" alt="Preview" style={{ maxWidth: "200px", borderRadius: "10px" }} />
                    </div>
                  )}
                  <div id="upload-file" className="item up-load">
                    <label className="uploadfile" htmlFor="myFile">
                      <span className="icon"><i className="icon-upload-cloud"></i></span>
                      <span className="body-text">
                        Drop your images here or select{" "}
                        <span className="tf-color">click to browse</span>
                      </span>
                      <input type="file" id="myFile" name="image" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>
              </fieldset>
              <div className="bot">
                <div></div>
                <button className="tf-button w208" type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategory;
