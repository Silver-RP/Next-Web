"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faLayerGroup,
  faShoppingCart,
  faFileCirclePlus,
  faUser,
  faGear,
  faBlog,
  faStore,
} from "@fortawesome/free-solid-svg-icons";



export default function Sidebar() {
  // State để quản lý mở/đóng menu
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const pathname = usePathname();

  // Toggle menu function
  const toggleMenu = (menuName: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  return (
    <div className="section-menu-left">
      <div className="box-logo">
        <Link href="/dashboard">
          <img
            id="logo_header"
            alt="Logo"
            src="/assets/app/images/logo-clothes.png"
            width={170}
            style={{ maxHeight: "60px", maxWidth: "180px" }}
          />
        </Link>
        <div className="button-show-hide">
        <FontAwesomeIcon icon={faChevronLeft} />

        </div>
      </div>

      <div className="center">
        <div className="center-item">
          <div className="center-heading">Main Home</div>
          <ul className="menu-list">
            <li className={`menu-item ${pathname === "/dashboard" ? "active" : ""}`}>
              <Link href="/dashboard">
                <div className="icon">
                <FontAwesomeIcon icon={faLayerGroup} />
                </div>
                <div className="text">Dashboard</div>
              </Link>
            </li>
          </ul>
        </div>

        <div className="center-item">
          <ul className="menu-list">
            {/* Products */}
            <li className={`menu-item has-children ${openMenus.products ? "active" : ""}`}>
              <a href="#" className="menu-item-button" onClick={() => toggleMenu("products")}>
                <div className="icon">
                <FontAwesomeIcon icon={faShoppingCart} />
                </div>
                <div className="text">Products</div>
              </a>
              <ul className="sub-menu" style={{ display: openMenus.products ? "block" : "none" }}>
                <li className="sub-menu-item">
                  <Link href="/dashboard/products/add-product">
                    <div className="text">Add Product</div>
                  </Link>
                </li>
                <li className="sub-menu-item">
                  <Link href="/dashboard/products">
                    <div className="text">Products</div>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Category */}
            <li className={`menu-item has-children ${openMenus.category ? "active" : ""}`}>
              <a href="#" className="menu-item-button" onClick={() => toggleMenu("category")}>
                <div className="icon">
                <FontAwesomeIcon icon={faStore} />
                </div>
                <div className="text">Category</div>
              </a>
              <ul className="sub-menu" style={{ display: openMenus.category ? "block" : "none" }}>
                <li className="sub-menu-item">
                  <Link href="/dashboard/categories/add-category">
                    <div className="text">New Category</div>
                  </Link>
                </li>
                <li className="sub-menu-item">
                  <Link href="/dashboard/categories">
                    <div className="text">Categories</div>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Order */}
            <li className={`menu-item has-children ${openMenus.order ? "active" : ""}`}>
              <a href="#" className="menu-item-button" onClick={() => toggleMenu("order")}>
                <div className="icon">
                <FontAwesomeIcon icon={faFileCirclePlus} />
                </div>
                <div className="text">Order</div>
              </a>
              <ul className="sub-menu" style={{ display: openMenus.order ? "block" : "none" }}>
                <li className="sub-menu-item">
                  <Link href="/dashboard/orders">
                    <div className="text">Orders</div>
                  </Link>
                </li>
                <li className="sub-menu-item">
                  <Link href="/dashboard/order-tracking">
                    <div className="text">Order tracking</div>
                  </Link>
                </li>
              </ul>
            </li>
            <li className={`menu-item has-children ${openMenus.post ? "active" : ""}`}>
              <a href="#" className="menu-item-button" onClick={() => toggleMenu("post")}>
                <div className="icon">
                <FontAwesomeIcon icon={faBlog} />
                </div>
                <div className="text">Posts</div>
              </a>
              <ul className="sub-menu" style={{ display: openMenus.post ? "block" : "none" }}>
                <li className="sub-menu-item">
                  <Link href="/dashboard/posts/add-post">
                    <div className="text">New Post</div>
                  </Link>
                </li>
                <li className="sub-menu-item">
                  <Link href="/dashboard/posts">
                    <div className="text">Posts</div>
                  </Link>
                </li>
              </ul>
            </li>
            <li className={`menu-item has-children ${openMenus.user ? "active" : ""}`}>
              <a href="#" className="menu-item-button" onClick={() => toggleMenu("user")}>
                <div className="icon">
                <FontAwesomeIcon icon={faUser} />
                </div>
                <div className="text">Users</div>
              </a>
              <ul className="sub-menu" style={{ display: openMenus.user ? "block" : "none" }}>
                <li className="sub-menu-item">
                  <Link href="/dashboard/users/add-user">
                    <div className="text">New User</div>
                  </Link>
                </li>
                <li className="sub-menu-item">
                  <Link href="/dashboard/users">
                    <div className="text">Users</div>
                  </Link>
                </li>
              </ul>
            </li>
            

            {/* <li className={`menu-item ${pathname === "/dashboard/users" ? "active" : ""}`}>
              <Link href="/dashboard/users">
                <div className="icon">
                <FontAwesomeIcon icon={faUser} />
                </div>
                <div className="text">User</div>
              </Link>
              <ul className="sub-menu" style={{ display: openMenus.category ? "block" : "none" }}>
                <li className="sub-menu-item">
                  <Link href="/dashboard/users/add-user">
                    <div className="text">New User</div>
                  </Link>
                </li>
                <li className="sub-menu-item">
                  <Link href="/dashboard/users">
                    <div className="text">Categories</div>
                  </Link>
                </li>
              </ul>
            </li> */}

            <li className={`menu-item ${pathname === "/dashboard/settings" ? "active" : ""}`}>
              <Link href="/dashboard/settings">
                <div className="icon">
                <FontAwesomeIcon icon={faGear} />
                </div>
                <div className="text">Settings</div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
