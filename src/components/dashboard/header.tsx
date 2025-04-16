"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Reference cho dropdown menu
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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

      window.location.href = "/login";

    } catch (error) {
      console.error("Unexpected error during logout:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="header-dashboard">
      <div className="wrap">
        <div className="header-left">
          <Link href="/dashboard">
            <Image
              id="logo_header_mobile"
              alt="Silver Shop Logo"
              src="/assets/app/images/logo-clothes.png"
              width={120}
              height={40}
              priority
            />
          </Link>
          <div className="button-show-hide">
            <i className="icon-menu-left"></i>
          </div>

          {/* Form search */}
          <form className="form-search flex-grow">
            <fieldset className="name">
              <input
                type="text"
                placeholder="Search here..."
                className="show-search"
                name="name"
                aria-required="true"
                required
              />
            </fieldset>
            <div className="button-submit">
              <button type="submit">
                <i className="icon-search"></i>
              </button>
            </div>
          </form>
        </div>

        <div className="header-grid">
          <div className="popup-wrap message type-header">
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle">
                <span className="header-item">
                  <span className="text-tiny">1</span>
                  <i className="icon-bell"></i>
                </span>
              </button>
            </div>
          </div>

          {/* User Dropdown */}
          <div className="popup-wrap user type-header">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                ref={buttonRef}
                onClick={toggleDropdown}
              >
                <span className="header-user wg-user">
                  <span className="image">
                    <Image
                      src="/assets/app/images/na8.jpeg"
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </span>
                  <span className="flex flex-column">
                    <span className="body-title mb-2">Ken Silver</span>
                    <span className="text-tiny">Admin</span>
                  </span>
                </span>
              </button>

              {/* Dropdown menu */}
              {isOpen && (
                <ul
                className="dropdown-menu dropdown-menu-end has-content mt-4"
                ref={dropdownRef}
                style={{ display: "block" }}
              >
                <li className="mt-3">
                  <Link href="/account" className="dropdown-item">
                    <div className="d-flex align-items-center">
                      <i className="icon-user me-2"></i>
                      <span className="fs-4">Account</span> 
                    </div>
                  </Link>
                </li>
                <li className="mt-3">
                  <Link href="/inbox" className="dropdown-item">
                    <div className="d-flex align-items-center mt-3">
                      <i className="icon-mail me-2"></i>
                      <span className="fs-4">Inbox</span> 
                      <span className="badge bg-primary ms-2">27</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item text-danger"
                  >
                    <div className="d-flex align-items-center mt-3">
                      <i className="icon-log-out me-2"></i>
                      <span className="fs-4">Log out</span> 
                    </div>
                  </button>
                </li>
              </ul>
              
              
              
              
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
