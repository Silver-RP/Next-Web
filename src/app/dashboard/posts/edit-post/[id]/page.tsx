"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useNotification } from "../../../../../context/NotificationContext";

const EditPost = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    coverImage: "",
  });

  // Fetch the post data when the component mounts
  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("User is not authenticated.", "error");
        return;
      }

      try {
        const res = await fetch(`/api/admin/posts/${params.id}`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          showNotification(data.message || "Failed to fetch post.", "error");
          return;
        }

        setFormData({
          title: data.data.title,
          content: data.data.content,
          coverImage: data.data.coverImage || "",
        });
      } catch (error) {
        console.error(error);
        showNotification("Error fetching post.", "error");
      }
    };

    fetchPost();
  }, [params.id, showNotification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const token = localStorage.getItem("token");
  if (!token) {
    showNotification("User is not authenticated.", "error");
    return;
  }

  const handleEditPost = async (e: React.FormEvent) => {
    e.preventDefault();

    const { title, content, coverImage } = formData;
    if (!title || !content || !coverImage) {
      showNotification("All fields are required", "error");
      return;
    }

    try {
      const res = await fetch(`/api/admin/posts/${params.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        showNotification(data.message || "Failed to update post.", "error");
        return;
      }

      showNotification("Post updated successfully.", "success");
      router.push("/dashboard/posts");
    } catch (error) {
      showNotification(error as any || "Failed to update post.", "error");
    }
  };

  return (
    <>
      <Head>
        <title>Edit Post</title>
      </Head>

      <div className="main-content-inner">
        <div className="main-content-wrap">
          <h3>Edit Post</h3>

          <div className="wg-box">
            <form className="form-new-product form-style-1" onSubmit={handleEditPost}>
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

export default EditPost;

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

