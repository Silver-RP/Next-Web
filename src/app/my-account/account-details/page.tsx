"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Head from "next/head";
import MyAccountSidebar from "../../../components/common/MyAccountSidebar";
import { useNotification } from "../../../context/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const MyAccountDetails = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { showNotification } = useNotification() as unknown as {
    showNotification: (message: string, type: string) => void;
  };
  const [showPassword, setShowPassword] = useState<{
    password: boolean;
    new_password: boolean;
    new_password_confirmation: boolean;
  }>({
    password: false,
    new_password: false,
    new_password_confirmation: false,
  });
  
  const handleTogglePassword = (field: keyof typeof showPassword) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field], 
    }));
  };
  

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not logged in.");
      return;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const userInfo = localStorage.getItem("userInfo");
      const userData = userInfo ? JSON.parse(userInfo) : null;
      if(userData){
        setUser(userData);
      }else{
        setUser(decodedToken);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
     
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || "",
        phone: user?.phone || "",
        password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not logged in.");
      return;
    }

    try {
      const response = await fetch("/api/user-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }).then((res) => res.json());

      if (response?.success) {
        showNotification(response?.message || "User information updated successfully!", "success");
        localStorage.setItem("userInfo", JSON.stringify({ ...user, ...formData }));

        setTimeout(() => {
          window.location.reload();
        }, 1500); 
      } else {
        showNotification(response?.message || "Failed to update user info.", "error");
      }
    } catch (error) {
      showNotification("An unexpected error occurred!", "warning");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>My Account Details</title>
      </Head>
      <main>
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">My Account</h2>
          <div className="row">
            <MyAccountSidebar />
            <div className="col-lg-9">
              <div className="page-content my-account__edit">
                <div className="my-account__edit-form">
                  <form onSubmit={handleSubmit} className="needs-validation">
                    <div className="row">
                      <div className="col-md-8">
                        <div className="my-3">
                          <label htmlFor="name">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-8">
                        <div className="my-3">
                          <label htmlFor="phone">Mobile Number</label>
                          <input
                            type="text"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-8">
                        <div className="my-3">
                          <label htmlFor="email">Email Address</label>
                          <input
                            type="email"
                            className="form-control"
                            value={user?.email || ""}
                            readOnly
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-8">
                        <div className="my-3">
                          <h5 className="text-uppercase mb-0">
                            Password Change
                          </h5>
                        </div>
                      </div>

                      <div className="col-md-8">
                        <div className="my-3"
                            style={{
                                position: "relative",
                            }}
                        >
                          <label htmlFor="password">Old Password</label>
                          <input
                            type={showPassword.password ? "text" : "password"}
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <FontAwesomeIcon
                            icon={showPassword.password ? faEyeSlash : faEye}
                            onClick={() => handleTogglePassword("password")}
                            className="password-toggle"
                            style={{
                              cursor: "pointer",
                              position: "absolute",
                              right: "20px",
                              top: "65%",
                              transform: "translateY(-50%)",
                              color: "black",
                              backgroundColor: "#fff",
                              padding: "2px",
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-md-8">
                        <div className="my-3"
                            style={{
                                position: "relative",
                            }}
                        >
                          <label htmlFor="new_password">New Password</label>
                          <input
                           type={showPassword.new_password ? "text" : "password"}
                            className="form-control"
                            name="new_password"
                            value={formData.new_password}
                            onChange={handleChange}
                          />
                          <FontAwesomeIcon
                            icon={showPassword.new_password ? faEyeSlash : faEye}
                            onClick={() => handleTogglePassword("new_password")}
                            className="password-toggle"
                            style={{
                              cursor: "pointer",
                              position: "absolute",
                              right: "20px",
                              top: "65%",
                              transform: "translateY(-50%)",
                              color: "black",
                              backgroundColor: "#fff",
                              padding: "2px",
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-md-8">
                        <div className="my-3"
                            style={{
                                position: "relative",
                            }}
                        >
                          <label htmlFor="new_password_confirmation">
                            Confirm New Password
                          </label>
                          <input
                            type={showPassword.new_password_confirmation ? "text" : "password"}
                            className="form-control"
                            name="new_password_confirmation"
                            value={formData.new_password_confirmation}
                            onChange={handleChange}
                          />
                          <FontAwesomeIcon
                            icon={showPassword.new_password_confirmation ? faEyeSlash : faEye}
                            onClick={() => handleTogglePassword("new_password_confirmation")}
                            className="password-toggle"
                            style={{
                              cursor: "pointer",
                              position: "absolute",
                              right: "20px",
                              top: "65%",
                              transform: "translateY(-50%)",
                              color: "black",
                              backgroundColor: "#fff",
                              padding: "2px",
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-md-8">
                        <div className="my-3">
                          <button
                            type="submit"
                            className="btn btn-primary bg-black"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default MyAccountDetails;
