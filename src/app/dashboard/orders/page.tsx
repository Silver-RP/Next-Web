"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Head from "@/components/Head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

interface ProductImages {
  url: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  salePrice: number;
  SKU: string;
  cateId: string;
  description: string;
  featured: boolean;
  hot: boolean;
  images: ProductImages[][];
  quantity: number;
  saledQuantity: number;
  shortDescription: string;
}

interface OrderItem {
  productId: Product;
  quantity: number;
}

interface ShippingInfo {
  name: string;
  phone: string;
  city: string;
  address: string;
  addressDetails: string;
}

interface Order {
  id: string;
  createdAt: string;
  totalAmount: number;
  totalOrderValue: number;
  paymentMethod: string;
  shippingFee: number | null;
  shippingMethod: string;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/place-order", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        if (!data?.orders) throw new Error("No orders found");
        setOrders(data.orders);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch order details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const subtotal = orders.reduce(
    (acc, order) => acc + (order.totalOrderValue || 0),
    0
  );

  if (isLoading) {
    return (
      <main className="pt-20 container">
        <h2 className="page-title">Loading Order Details...</h2>
      </main>
    );
  }

  if (error || !orders.length) {
    return (
      <main className="pt-20 container">
        <h2 className="page-title">Error</h2>
        <p className="text-red-500">{error || "No orders found"}</p>
        <Link href="/cart" className="text-blue-500 hover:underline">
          Return to Cart
        </Link>
      </main>
    );
  }

  return (
    <>
      <Head title="Orders" />
      <div className="main-content-inner">
        <div className="main-content-wrap">
          <div className="wg-box">
            <div className="main-content-inner">
              <div className="main-content-wrap">
                <div className="flex items-center flex-wrap justify-between gap20 mb-27">
                  <h3>Orders</h3>
                  <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
                    <li>
                      <Link href="/">
                        <div className="text-tiny">Dashboard</div>
                      </Link>
                    </li>
                    <li>
                      <i className="icon-chevron-right">▸</i>
                    </li>
                    <li>
                      <div className="text-tiny">Orders</div>
                    </li>
                  </ul>
                </div>

                <div className="wg-box">
                  <div className="wg-filter flex-grow">
                    <form className="form-search">
                      <fieldset className="name">
                        <input
                          type="text"
                          placeholder="Search here..."
                          name="name"
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
                  <div className="wg-table table-all-user">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th className="text-center fs-5">OrderNo</th>
                            <th className="text-center fs-5">Name</th>
                            <th className="text-center fs-5">Phone</th>
                            <th className="text-center fs-5">Subtotal</th>
                            <th className="text-center fs-5">Shipping</th>
                            <th className="text-center fs-5">Total</th>
                            <th className="text-center fs-5">Status</th>
                            <th className="text-center fs-5">Order Date</th>
                            <th className="text-center fs-5">Total Items</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.length > 0 ? (
                            orders.map((order, index) => (
                              <tr key={order.id}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">
                                  {typeof order.shippingInfo === "object" &&
                                  order.shippingInfo !== null
                                    ? (order.shippingInfo as { name?: string })
                                        .name || "N/A"
                                    : "N/A"}
                                </td>
                                <td className="text-center">
                                  {typeof order.shippingInfo === "object" &&
                                  order.shippingInfo !== null
                                    ? (order.shippingInfo as { phone?: string })
                                        .phone || "N/A"
                                    : "N/A"}
                                </td>
                                <td className="text-center">
                                  ${subtotal?.toFixed(2)}
                                </td>
                                <td className="text-center">
                                  ${order.shippingFee?.toFixed(2)}
                                </td>
                                <td className="text-center bg-yellow-500"
                                  
                                >
                                  ${order.totalOrderValue?.toFixed(2)}
                                </td>
                                <td>
                                  <span className={`text-white bg-yellow-500 px-2 py-1 rounded `} style={{
                                    backgroundColor:
                                      order.status === "pending"
                                        ? "#3b82f6" 
                                        : order.status === "shipping"
                                        ? "#fbbf24" 
                                        : order.status === "completed"
                                        ? "#22c55e" 
                                        : order.status === "cancelled"
                                        ? "#ef4444" 
                                        : "#6b7280", 
                                  }}>  {order.status}</span>
                                
                                </td>

                                <td className="text-center">
                                  {new Date(
                                    order.createdAt
                                  ).toLocaleDateString()}
                                </td>
                                <td className="text-center">
                                  {order.totalAmount}
                                </td>
                                <td className="text-center">
                                  <Link
                                    href={`/dashboard/orders/order-details/${order.id}`}
                                  >
                                    <div className="list-icon-function view-icon">
                                      <div className="item eye">
                                        <FontAwesomeIcon
                                          className="text-green"
                                          icon={faEye}
                                        />
                                      </div>
                                    </div>
                                  </Link>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={10} className="text-center">
                                No orders found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="divider"></div>
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="flex items-center justify-between flex-wrap gap10 wgp-pagination"></div>
          </div>
        </div>
      </div>
    </>
  );
}
