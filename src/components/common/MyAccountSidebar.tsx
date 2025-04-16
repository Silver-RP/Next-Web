"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const MyAccountSidebar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include", 
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("wishlist");

      window.dispatchEvent(new Event("storage"));

      router.push("/login");

    } catch (error) {
      console.error("Unexpected error during logout:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="col-lg-3">
      <ul className="account-nav">
        <li>
          <Link href="/my-account" className="menu-link menu-link_us-s">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/my-account/orders" className="menu-link menu-link_us-s">
            Orders
          </Link>
        </li>
        <li>
          <Link href="#" className="menu-link menu-link_us-s">
            Addresses
          </Link>
        </li>
        <li>
          <Link href="/my-account/account-details" className="menu-link menu-link_us-s">
            Account Details
          </Link>
        </li>
        <li>
          <Link href="/wishlist" className="menu-link menu-link_us-s">
            Wishlist
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="btn btn-logout mt-5 bg-black text-white"
           
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default MyAccountSidebar;
