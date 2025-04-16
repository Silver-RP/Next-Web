"use client";

import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useNotification } from "../../../../context/NotificationContext";

const AddPost = () => {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    coverImage: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const token = localStorage.getItem("token");
  if (!token) {
    showNotification("User is not authenticated.", "error");
    return;
  }


  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();

    const { title, content, coverImage } = formData;
    if (!title || !content || !coverImage) {
      showNotification("All fields are required", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        showNotification(data.message || "Failed to add post.", "error");
        return;
      }

      showNotification("Post added successfully.", "success");
      router.push("/dashboard/posts");
    } catch (error: any) {
      showNotification(error.message || "Failed to add post.", "error");
    }
  };

  return (
    <>
      <Head>
        <title>Add Post</title>
      </Head>

      <div className="main-content-inner">
        <div className="main-content-wrap">
          <h3>Add Post</h3>

          <div className="wg-box">
            <form className="form-new-product form-style-1" onSubmit={handleAddPost}>
              <InputField label="Title" name="title" value={formData.title} onChange={handleChange} required />
              <InputField  type="textarea" label="Content" name="content" value={formData.content} onChange={handleChange} required />
              <InputField label="Cover Image" name="coverImage" value={formData.coverImage} onChange={handleChange} required />

              <div className="bot" style={{ marginLeft: "310px" }}>
                <button className="tf-button w208" type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPost;

const InputField = ({ label, name, type = "text", value, onChange, required = false }: any) => (
  <fieldset>
    <div className="body-title">
      {label} {required && <span className="text-danger">*</span>}
    </div>
    {type === "textarea" ? (
      <textarea
        name={name}
        placeholder={`Enter ${label.toLowerCase()}`}
        value={value}
        onChange={onChange}
        required={required}
        rows={6} 
        style={{
          width: "100%",
          border: "solid 1px #ccc",
          borderRadius: "10px",
          padding: "10px",
          resize: "vertical",
        }}
      />
    ) : (
      <input
        type={type}
        name={name}
        placeholder={`Enter ${label.toLowerCase()}`}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: "100%",
          border: "solid 1px #ccc",
          borderRadius: "10px",
          padding: "10px",
        }}
      />
    )}
  </fieldset>
);
