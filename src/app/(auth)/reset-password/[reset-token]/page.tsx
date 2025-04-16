"use client";

import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { usePathname } from "next/navigation"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeLowVision } from "@fortawesome/free-solid-svg-icons";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("text-red");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const pathname = usePathname();
  const token = pathname.split("/").pop();

  console.log("token", token);  


  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

   
    if (!token) {
      setMessage("Invalid or expired reset link.");
      return;
    }

    if (password !== passwordConfirmation) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Password reset successfully. Please login.");
        setMessageClass("text-green");
      } else {
        const data = await response.json();
        setMessage(data.message || "Failed to reset password.");
        setMessageClass("text-red");
      }
    } catch (error) {
      console.error("Failed to reset password", error);
      setMessage("An error occurred. Please try again.");
      setMessageClass("text-red");
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>

      <main className="pb-5">
        <div className="mb-4 pb-4"></div>
        <section className="login-register container" style={{ maxWidth: "500px" }}>
          <ul className="nav nav-tabs mb-5" id="login_register" role="tablist">
            <li className="nav-item" role="presentation">
              <span className="nav-link nav-link_underscore active">
                Reset Password
              </span>
            </li>
          </ul>
          <div className="tab-content pt-2" id="login_register_tab_content">
            <div className="tab-pane fade show active">
              <div className="login-form">
                {message && <p className={messageClass}>{message}</p>}

                <form onSubmit={handleResetPassword} className="needs-validation">
                  <div className="mb-3 position-relative">
                    <label htmlFor="password">New Password *</label>
                    <input
                      className="form-control form-control_gray"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeLowVision : faEye}
                      onClick={handleTogglePassword}
                      className="password-toggle-icon"
                      style={{ 
                        position: "absolute",
                        top: "60%",
                        right: "15px",
                      }}
                    />
                  </div>

                  <div className="mb-3 position-relative">
                    <label htmlFor="password_confirmation">Confirm New Password *</label>
                    <input
                      className="form-control form-control_gray"
                      type={showConfirmPassword ? "text" : "password"}
                      name="password_confirmation"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      required
                    />
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeLowVision : faEye}
                      onClick={handleToggleConfirmPassword}
                      className="password-toggle-icon"
                      style={{
                        position: "absolute",
                        top: "60%",
                        right: "15px",
                      }}
                    />
                  </div>

                  <button className="btn text-white bg-black w-100 text-uppercase" type="submit">
                    Confirm
                  </button>
                  <div className="customer-option mt-4 text-center">
                    <span className="text-secondary">No account yet?</span>
                    <Link href="/register" className="btn-text ms-2 text-black">
                      Create Account
                    </Link>{" "}
                    |{" "}
                    <Link href="/login" className="btn-text text-black">
                      Login
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .password-toggle-icon {
          cursor: pointer;
          width: 20px;
          height: 20px;
          color: black;
          position: absolute;
          right: 15px;
          top: 72%;
          transform: translateY(-50%);
          background-color: #fff;
          padding: 2px;
        }
      `}</style>
    </>
  );
}
