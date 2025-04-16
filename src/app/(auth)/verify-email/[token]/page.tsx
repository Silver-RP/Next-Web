"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Head from "@/components/Head";

const VerifyEmail = () => {
  const router = useRouter();
  const pathname = usePathname(); 
  const token = pathname.split("/").pop(); 
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing token.");
      return;
    }

    const verifyUserEmail = async () => {
      try {
        console.log("Token: ", token);
        const res = await fetch(`/api/verify-email?token=${token}`);

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const response = await res.json();

        if (response.success) {
          setMessage("Email verified successfully! Redirecting...");
          setTimeout(() => router.push("/login"), 5000);
        } else {
          setMessage(response.message || "Invalid or expired token.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setMessage("An error occurred. Please try again.");
      }
    };

    verifyUserEmail();
  }, [token, router]);

  return (
    <>
      <Head title="Verify Email" />
      <main className="pt-60 pb-5">
        <div className="mb-4 pb-4"></div>
        <section className="login-register container" style={{ maxWidth: "500px" }}>
          <ul className="nav nav-tabs mb-5">
            <li>
              <h3>Verify Email</h3>
            </li>
          </ul>

          <div className="tab-content pt-2">
            <div className="tab-pane fade show active">
              <div>{message}</div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default VerifyEmail;
