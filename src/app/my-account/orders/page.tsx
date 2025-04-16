"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "@/components/Head";
import MyAccountSidebar from "@/components/common/MyAccountSidebar";

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

const OrderHistoryPage = () => {
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
      <Head title="Order History" />
      <main className="pt-20 container">
        <section className="my-account">
          <h2 className="page-title">Orders</h2>
          <div className="flex gap-6">
            <MyAccountSidebar />
            <div className="flex-1 overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-teal-900 text-white">
                    <th className="p-2">OrderNo</th>
                    <th className="p-2">Recipient</th>
                    <th className="p-2 text-center">Phone</th>
                    <th className="p-2 text-center">Items</th>
                    <th className="p-2 text-center">Shipping</th>
                    <th className="p-2 text-center">Total</th>
                    <th className="p-2 text-center">Status</th>
                    <th className="p-2 text-center">Order Date</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t">
                      <td className="p-2 text-center">
                        {order.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="p-2">{order.shippingInfo.name}</td>
                      <td className="p-2 text-center">
                        {order.shippingInfo.phone}
                      </td>
                      <td className="p-2 text-center">{order.items.length}</td>
                      <td className="p-2 text-center">
                        {order.shippingFee
                          ? `$${order.shippingFee.toFixed(2)}`
                          : "Free"}
                      </td>
                      <td className="p-2 text-center">
                        ${order.totalOrderValue.toFixed(2)}
                      </td>
                      <td className="p-2 text-center">
                        <span
                          className={`px-2 py-1 ${
                            statusClasses[order.status] ||
                            "bg-gray-200 text-black"
                          }`}
                          style={{
                            borderRadius: "6px",
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2 text-center">
                        <Link href={`/my-account/orders/order-details/${order.id}`}>
                          <div className="bg-emerald-700 text-white px-3 py-1 rounded">
                            Show details
                          </div>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default OrderHistoryPage;
