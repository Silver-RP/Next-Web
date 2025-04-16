"use client";

import { useState } from "react";
import Link from "next/link";
import Head from "next/head";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState(""); 

  const handleForgotPassword = async (e: any) => {
    e.preventDefault();
    setMessage("Please wait...");

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        setMessage("A reset password link has been sent to your email.");
        setMessageClass("text-green");
      } else {
        setMessage(data.message || "Failed to send email.");
        setMessageClass("text-red");
      }
    } catch (error) {
      console.error("Error sending forgot password email:", error);
      setMessage("An error occurred. Please try again.");
      setMessageClass("text-red");
    }
  };


  return (
    <>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <main className=" pb-5">
        <div className="mb-4 pb-4"></div>
        <section className="login-register container" style={{ maxWidth: "500px" }}>
          <ul className="nav nav-tabs mb-5" id="login_register" role="tablist">
            <li className="nav-item" role="presentation">
              <a
                className="nav-link nav-link_underscore active"
                id="forgot-tab"
                data-bs-toggle="tab"
                href="#tab-item-forgot"
                role="tab"
                aria-controls="tab-item-forgot"
                aria-selected="true"
              >
                Forgot Password
              </a>
            </li>
          </ul>
          <div className="tab-content pt-2" id="login_register_tab_content">
            <div
              className="tab-pane fade show active"
              id="tab-item-forgot"
              role="tabpanel"
              aria-labelledby="forgot-tab"
            >
              <div className="login-form">
                {message && <p className={messageClass}>{message}</p>}

                <form onSubmit={handleForgotPassword} className="needs-validation">
                  <label htmlFor="email">Email address *</label>
                  <div className="mb-3">
                    <input
                      className="form-control form-control_gray"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button className="btn text-white bg-black w-100 text-uppercase" type="submit">
                    Confirm
                  </button>
                  <div className="customer-option mt-4 text-center">
                    <span className="text-secondary">No account yet?</span>
                    <Link href="/register" className="btn-text js-show-register ms-2 text-black">
                      Create Account
                    </Link>{" "}
                    |{" "}
                    <Link href="/login" className="btn-text js-show-register text-black">
                      Login
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
