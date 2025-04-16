"use client";

import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useNotification } from "../../../../context/NotificationContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeLowVision } from "@fortawesome/free-solid-svg-icons";

const AddUser = () => {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, phone, email, password, password_confirmation, role } = formData;

    if (!name || !phone || !email || !password || !role) {
      showNotification("All fields are required", "error");
      return;
    }

    if (password !== password_confirmation) {
      showNotification("Password and confirm password do not match", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        showNotification(data.message || "Failed to add user.", "error");
        return;
      }

      showNotification("User added successfully.", "success");
      router.push("/dashboard/users");

    } catch (error: any) {
      showNotification(error.message || "Failed to add user.", "error");
    }
  };

  return (
    <>
      <Head>
        <title>Add User</title>
      </Head>

      <div className="main-content-inner">
        <div className="main-content-wrap">
          <h3>Add User</h3>

          <div className="wg-box">
            <form className="form-new-product form-style-1" onSubmit={handleAddUser}>
              <InputField label="User Name" name="name" value={formData.name} onChange={handleChange} required />

              <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />

              <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />

              <PasswordField label="Password" name="password" value={formData.password} onChange={handleChange} showPassword={showPassword} togglePassword={() => setShowPassword(!showPassword)} required />

              <PasswordField label="Confirm Password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} showPassword={showConfirmPassword} togglePassword={() => setShowConfirmPassword(!showConfirmPassword)} required />

              <fieldset>
                <div className="body-title">Role <span className="text-danger">*</span></div>
                <select name="role" value={formData.role} onChange={handleChange} required
                style={{ width: "100%",   border: "solid 1px #ccc", borderRadius: "10px"  }}
                >
                  <option value="" disabled>Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </fieldset>

              {/** Submit Button */}
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

export default AddUser;

const InputField = ({ label, name, type = "text", value, onChange, required = false }: any) => (
  <fieldset>
    <div className="body-title">{label} {required && <span className="text-danger">*</span>}</div>
    <input type={type} name={name} placeholder={`Enter ${label.toLowerCase()}`} value={value} onChange={onChange} required={required} 
      style={{ width: "100%",   border: "solid 1px #ccc", borderRadius: "10px"  }}
    />
  </fieldset>
);

const PasswordField = ({ label, name, value, onChange, showPassword, togglePassword, required = false }: any) => (
  <fieldset>
    <div className="body-title">{label} {required && <span className="text-danger">*</span>}</div>
    <div className="position-relative"  style={{ width: "100%",   border: "solid 1px #ccc", borderRadius: "10px"  }}>
      <input type={showPassword ? "text" : "password"} name={name} className="form-control" value={value} onChange={onChange} required={required} />
      <FontAwesomeIcon icon={showPassword ? faEyeLowVision : faEye} onClick={togglePassword} className="password-toggle" style={{
        cursor: "pointer",
        position: "absolute",
        right: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "black",
        backgroundColor: "#fff",
        padding: "2px",
        width: "15px",
        height: "15px",
      
      }} />
    </div>
  </fieldset>
);
