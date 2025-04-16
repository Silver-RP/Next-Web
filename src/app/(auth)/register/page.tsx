"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeLowVision } from "@fortawesome/free-solid-svg-icons";
import Head from "@/components/Head";

const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const router = useRouter();

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmitRegister = async (e: any) => {
    e.preventDefault();
    setAlertMessage("Please wait...");

    if (password !== confirmPassword) {
      setAlertMessage("Passwords do not match!");
      setMessageClass("text-red");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, password, password_confirmation: confirmPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setAlertMessage("Registration successful! Redirecting...");
        setMessageClass("text-green-800");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setAlertMessage(data.message || "Registration failed");
        setMessageClass("text-red");
      }
    } catch (error) {
      setAlertMessage("Something went wrong!");
      setMessageClass("text-red");
    }
  };

  return (
    <>
      <Head title="Register" />
      <main className=" pb-5">
        <section className="container" style={{ maxWidth: "500px" }}>
          <h3>Register</h3>
          {alertMessage && <p className={messageClass}>{alertMessage}</p>}
          <form onSubmit={handleSubmitRegister}>
            <label>Name <span className="text-red">*</span></label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />

            <label className="mt-3">Email <span className="text-red">*</span></label>
            <input className="form-control" type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label className="mt-3">Phone <span className="text-red">*</span></label>
            <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />

            <label className="mt-3">Password <span className="text-red">*</span></label>
            <div className="position-relative">
              <input type={showPassword ? "text" : "password"} className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <FontAwesomeIcon icon={showPassword ? faEyeLowVision : faEye} onClick={handleTogglePassword} className="password-toggle" 
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
            </div>

            <label className="mt-3">Confirm Password <span className="text-red">*</span></label>
            <div className="position-relative">
              <input type={showConfirmPassword ? "text" : "password"} className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeLowVision : faEye} onClick={handleToggleConfirmPassword} className="password-toggle" 
                style={{
                  cursor: "pointer",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "black",
                  backgroundColor: "#fff",
                  padding: "2px",
                  position: "absolute",
                }}
              />
            </div>

            <button className="btn btn-primary w-100 mt-4" type="submit">Register</button>
            <div className="text-center mt-4">
              <span>Have an account?</span>
              <Link href="/login" className="ms-2 text-black">Login</Link>
            </div>
          </form>
        </section>
      </main>
    </>
  );
};

export default Register;
