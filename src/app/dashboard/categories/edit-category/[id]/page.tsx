"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // dùng next/navigation thay vì next/router
import Head from "next/head";
import { useParams } from "next/navigation";

const EditCategory = () => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await fetch(`/api/admin/categories/${id}`);
      const data = await res.json();

      if (data.success) {
        setName(data.data.name);
        setSlug(data.data.slug);
        setPreviewImage(data.data.image);
      } else {
        alert(data.message || "Failed to fetch category");
      }
    };
    fetchCategory();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !slug) {
      alert("Category name and slug are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        body: formData,
      });

      const responseData = await response.json();
      if (responseData.error) {
        alert(responseData.error);
        return;
      }

      if (responseData.success) {
        router.push("/dashboard/categories");
      }

    } catch (error) {
      console.error("Error updating category:", error);
      alert("Something went wrong while updating the category");
    }
  };

  return (
    <>
      <Head>
        <title>Edit Category</title>
      </Head>
      <div className="main-content-inner">
        <div className="main-content-wrap">
          <div className="flex items-center flex-wrap justify-between gap20 mb-27">
            <h3>Edit Category </h3>
            <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
              <li><a href="#"><div className="text-tiny">Dashboard</div></a></li>
              <li><i className="icon-chevron-right">▸</i></li>
              <li><a href="#"><div className="text-tiny">Categories</div></a></li>
              <li><i className="icon-chevron-right">▸</i></li>
              <li><div className="text-tiny">Edit Category</div></li>
            </ul>
          </div>

          <div className="wg-box">
            <form
              className="form-new-product form-style-1"
              method="POST"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
            >
              <fieldset className="name">
                <div className="body-title">
                  Category Name <span className="tf-color-1">*</span>
                </div>
                <input
                  className="flex-grow"
                  type="text"
                  placeholder="Category name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </fieldset>

              <fieldset className="name">
                <div className="body-title">
                  Category Slug <span className="tf-color-1">*</span>
                </div>
                <input
                  className="flex-grow"
                  type="text"
                  placeholder="Category Slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </fieldset>

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
                        style={{ maxWidth: "200px", borderRadius: "10px" }}
                      />
                    </div>
                  )}
                  <div id="upload-file" className="item up-load">
                    <label className="uploadfile" htmlFor="myFile">
                      <span className="icon"><i className="icon-upload-cloud"></i></span>
                      <span className="body-text">
                        Drop your images here or{" "}
                        <span className="tf-color">click to browse</span>
                      </span>
                      <input
                        type="file"
                        id="myFile"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
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

export default EditCategory;
