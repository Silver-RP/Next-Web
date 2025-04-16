"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter, useParams } from "next/navigation";
import { useNotification } from "../../../../../context/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeLowVision } from "@fortawesome/free-solid-svg-icons";

const EditUser = () => {
  const router = useRouter();
  const { id } = useParams();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const res = await fetch(`/api/admin/users/${id}`);
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch user data");
            setFormData({ ...data.data, password: "", password_confirmation: "" });
        } catch (error: any) {
            showNotification(error.message, "error");
        }
    };

    if (id) fetchUser();
}, [id]);


  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async (e: any) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.role) {
      showNotification("All fields are required", "error");
      return;
    }
   
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotification(data.message || "Failed to update user.", "error");
        return;
      }
      showNotification("User updated successfully.", "success");
      router.push("/dashboard/users");
    } catch (error) {
      showNotification(error as string || "Failed to update user.", "error");
    }
  };

  return (
    <>
      <Head>
        <title>Edit User</title>
      </Head>

      <div className="main-content-inner">
        <div className="main-content-wrap">
          <h3>Edit User</h3>

          <div className="wg-box">
            <form className="form-new-product form-style-1" onSubmit={handleUpdateUser}>
              <InputField label="User Name" name="name" value={formData.name} onChange={handleChange} required />
              <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
              <InputField label="Email" name="email" type="text" value={formData.email} onChange={handleChange} required />
              <fieldset>
                <div className="body-title">Role <span className="text-danger">*</span></div>
                <select name="role" value={formData.role} onChange={handleChange} required style={{ width: "100%", border: "solid 1px #ccc", borderRadius: "10px" }}>
                  <option value="" disabled>Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </fieldset>
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

export default EditUser;

const InputField = ({ label, name, type = "text", value, onChange, required = false }: { label: string, name: string, type?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean }) => (
  <fieldset>
    <div className="body-title">{label} {required && <span className="text-danger">*</span>}</div>
    <input type={type} name={name} placeholder={`Enter ${label.toLowerCase()}`} value={value} onChange={onChange} required={required} style={{ width: "100%", border: "solid 1px #ccc", borderRadius: "10px" }} />
  </fieldset>
);

