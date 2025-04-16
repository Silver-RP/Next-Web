"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { login } from "@/lib/redux/userSlice";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("userInfo", JSON.stringify(data.user)); 
    dispatch(login({ user: data.user, token: data.token }));
    window.dispatchEvent(new Event("storage"));

    router.push("/");
  };

  return (
    <div>
      <div className="mb-4 pb-4"></div>
      <section className="login-register container">
        <ul className="nav nav-tabs mb-5" id="login_register" role="tablist">
          <li className="nav-item" role="presentation">
            <a
              className="nav-link nav-link_underscore active"
              id="login-tab"
              data-bs-toggle="tab"
              href="#tab-item-login"
              role="tab"
              aria-controls="tab-item-login"
              aria-selected="true"
            >
              Login
            </a>
          </li>
        </ul>
        <div className="tab-content " id="login_register_tab_content">
          <div
            className="tab-pane fade show active"
            id="tab-item-login"
            role="tabpanel"
            aria-labelledby="login-tab"
          >
            <div className="login-form">
              <form
                method="POST"
                action="#"
                name="login-form"
                className="needs-validation"
                noValidate
                onSubmit={handleLogin}
              >
                {error && <p className="text-red mb-4">{error}</p>}
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="email">Email address *</label>
                </div>

                <div className="pb-3"></div>

                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} onClick={handleTogglePassword} className="password-toggle" 
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "black",
                  backgroundColor: "#fff",
                  padding: "2px",
                }}
              />
                  <label htmlFor="password">Password *</label>
                </div>

                <button
                  className="btn btn-primary w-100 text-uppercase"
                  type="submit"
                >
                  Log In
                </button>

                <div className="customer-option mt-4 text-center">
                  <span className="text-secondary">No account yet?</span>
                  <Link href="/register" className="btn-text">
                    Create Account
                  </Link>{" "}
                  |{" "}
                  <Link href="/forgot-password" className="btn-text">
                    Forgot Password
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
