"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Head from "@/components/Head";
import { useParams } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import router from "next/router";
import { useNotification } from "../../../../../context/NotificationContext";

type OrderItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    images: string[];
  };
};

type OrderData = {
  id: string;
  createdAt?: string;
  cancelledAt?: string;
  name: string;
  phone: string;
  address: string;
  status: string;
  shippingFee?: number;
  shippingMethod: string;
  paymentMethod: string;
  isPaid: boolean;
  totalOrderValue: number;
  items: OrderItem[];
  shippingInfo: {
    name: string;
    phone: string;
    city?: string;
    addressDetails?: string;
  };
};

const statusClasses: Record<string, string> = {
  pending: "text-white bg-blue-500",
  shipping: "text-white bg-yellow-500",
  completed: "text-white bg-green-600",
  cancelled: "text-white bg-red-500",
  returned: "text-white bg-gray-500",
};

const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  pending: ["cancelled", "shipping"],
  shipping: ["completed", "returned"],
  completed: [],
  cancelled: [],
  returned: [],
};

export default function OrdersPage() {
  const { id } = useParams() as { id: string };
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification() as unknown as {
    showNotification: (message: string, type: string) => void;
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/place-order/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch order");
        const data = await response.json();
        if (!data?.order) throw new Error("No order found");
        setOrder(data.order);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch order details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    const currentStatus = order.status;

    if (!STATUS_FLOW[currentStatus as OrderStatus]?.includes(newStatus)) {
      alert("Cannot change to this status");
      return;
    }

    try {
      const res = await fetch(`/api/place-order/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification("Status updated!", "success");
        setTimeout(() => {
        window.location.reload();
        }, 1000);
      } else {
        throw new Error(data.message || "Failed to update");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating status");
    }
  };

  const statusClasses: Record<string, string> = {
    pending: "text-white bg-blue-500",
    shipping: "text-white bg-yellow-500",
    completed: "text-white bg-green-500",
    cancelled: "text-white bg-red-500",
    refunded: "text-white bg-gray-500",
  };

  if (isLoading) {
    return (
      <main className="pt-20 container">
        <h2 className="page-title">Loading Order Details...</h2>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="pt-20 container">
        <h2 className="page-title">Error</h2>
        <p className="text-red-500">{error || "No order found"}</p>
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
                  <div className="flex items-center justify-between gap10 flex-wrap">
                    <div className="wg-filter flex-grow">
                      <h5>Ordered Items</h5>
                    </div>
                    <Link
                      className="tf-button style-1 w208"
                      href="/dashboard/orders"
                    >
                      Back
                    </Link>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th className="text-center fs-5">Price</th>
                          <th className="text-center fs-5">Sale Price</th>
                          <th className="text-center fs-5">Quantity</th>
                          <th className="text-center fs-5">Subtotal</th>
                          <th className="text-center fs-5">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td className="pname">
                              <div className="image">
                                <img
                                  src={`/assets/app/images/products/${item.product.images[0]}`}
                                  alt={item.product.name}
                                  className="image"
                                />
                              </div>
                              <div className="name">
                                <a
                                  href="#"
                                  target="_blank"
                                  className="body-title-2"
                                >
                                  {item.product.name}
                                </a>
                              </div>
                            </td>
                            <td className="text-center">
                              ${item.product.price}
                            </td>
                            <td className="text-center">
                              ${item.product.salePrice}
                            </td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-center">
                              ${item.quantity * (item.product.salePrice ?? 0)}
                            </td>
                            <td className="text-center">
                              <div className="list-icon-function view-icon">
                                <div className="item eye">
                                  <i className="icon-eye"></i>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="divider"></div>
                  <div className="flex items-center justify-between flex-wrap gap10 wgp-pagination"></div>
                </div>
                <div className="wg-box mt-5">
                  <h5>Shipping Address</h5>
                  <div className="my-account__address-item__detail">
                    <p>{order.shippingInfo.name}</p>
                    <p>{order.shippingInfo.addressDetails}</p>
                    <p>{order.shippingInfo.city}</p>
                    <p>{order.address}</p>
                    <br />
                    <p>Mobile : {order.shippingInfo.phone}</p>
                  </div>
                </div>

                <div className="wg-box mt-5">
                  <h5>Transactions</h5>
                  <table className="table table-striped table-bordered">
                    <tbody>
                      <tr>
                        <th className="fs-5">Subtotal</th>
                        <td>{order.totalOrderValue}</td>
                        <th className="fs-5">Shipping Fee</th>
                        <td>{order.shippingFee ?? 0}</td>
                        <th className="fs-5">Discount</th>
                        <td>0.00</td>
                      </tr>
                      <tr>
                        <th className="fs-5">Total</th>
                        <td>
                          {order.totalOrderValue + (order.shippingFee ?? 0)}
                        </td>
                        <th className="fs-5">Payment Mode</th>
                        <td>{order.paymentMethod}</td>
                        <th className="fs-5">Status</th>
                        <td>
                          <span
                            className={`ms-1 px-2 py-1 rounded ${
                              statusClasses[order.status.toLowerCase()] ||
                              "bg-secondary"
                            }`}
                          >
                            {order.status}
                          </span>
                          <br />
                          Can change to:
                          <span>
                            <select
                              className="form-select fs-5"
                              defaultValue=""
                              onChange={(e) =>
                                handleStatusChange(
                                  e.target.value as OrderStatus
                                )
                              }
                            >
                              <option value="" disabled>
                                -- Select Status --
                              </option>
                              {STATUS_FLOW[
                                order?.status as keyof typeof STATUS_FLOW
                              ]?.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th className="fs-5">Order Date</th>
                        <td>{order.createdAt?.slice(0, 10)}</td>
                        <th className="fs-5">Delivered Date</th>
                        <td>{order.status === "completed" ? "N/A" : ""}</td>
                        <th className="fs-5">Canceled Date</th>
                        <td>{order.cancelledAt ?? ""}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="divider"></div>
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
