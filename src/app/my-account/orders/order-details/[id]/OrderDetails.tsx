"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MyAccountSidebar from "@/components/common/MyAccountSidebar";
import Link from "next/link";
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
  

type Props = {
  orderId: string;
};

const OrderDetails = ({ orderId }: Props) => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showNotification } = useNotification() as unknown as {
    showNotification: (message: string, type: string) => void;
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/place-order/${orderId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setOrderData(data.order);
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  const handleCancelOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm("Are you want to cancel this order?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/place-order/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      if (!data.success) {
        alert(data.message);
        return;
      }

      showNotification( "Order Cancellation Successful!", "success");

      setTimeout(() => {  
      window.location.reload();
      }, 1000); 

    } catch (error: any) {
      alert(error?.response?.data?.message || "Error canceling order");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!orderData) return <p>Order not found</p>;

  const {
    id,
    shippingInfo,
    status,
    shippingMethod,
    paymentMethod,
    items, 
    createdAt,
    cancelledAt,
    shippingFee,
    totalOrderValue,
  } = orderData;
  
  
  const subtotalOrder = items.reduce(
    (acc, item) => acc + (item.product.salePrice ?? item.product.price) * item.quantity,
    0
  );
  
  const statusClasses: Record<string, string> = {
    pending: "text-yellow-600 font-semibold",
    confirmed: "text-blue-600 font-semibold",
    delivering: "text-purple-600 font-semibold",
    delivered: "text-green-600 font-semibold",
    cancelled: "text-red-600 font-semibold",
  };

  return (
    <>
      <main className="pt-60" style={{ paddingTop: 0 }}>
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">Order's Details</h2>
          <div className="row">
            <MyAccountSidebar />

            <div className="col-lg-9">
              <div className="bg-white shadow-md rounded p-6">
                <div className="flex justify-between items-center mb-6">
                  <h5 className="text-lg font-semibold">Ordered Details</h5>
                  <Link
                    className="btn btn-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                    href="/my-account/orders"
                  >
                    Back
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border border-gray-300">
                    <tbody>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 bg-emerald-900 text-white">Order No</th>
                        <td className="px-4 py-2">{id.slice(-6).toUpperCase()}</td>
                        <th className="px-4 py-2 bg-emerald-900 text-white">Recipient Name</th>
                        <td className="px-4 py-2">{shippingInfo?.name || "N/A"}</td>
                        <th className="px-4 py-2 bg-emerald-900 text-white">Mobile</th>
                        <td className="px-4 py-2">{shippingInfo?.phone || "N/A"}</td>
                      </tr>
                      <tr>
                        <th className="px-4 py-2 bg-emerald-900 text-white">Order Date</th>
                        <td className="px-4 py-2">{createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}</td>
                        <th className="px-4 py-2 bg-emerald-900 text-white">Delivered Date</th>
                        <td className="px-4 py-2"></td>
                        <th className="px-4 py-2 bg-emerald-900 text-white">Canceled Date</th>
                        <td className="px-4 py-2">{cancelledAt ? new Date(cancelledAt).toLocaleDateString() : ""}</td>
                      </tr>
                      <tr>
                        <th className="px-4 py-2 bg-emerald-900 text-white">Order Status</th>
                        <td className="px-4 py-2 text-center" colSpan={5}>
                          <span className={`inline-block px-4 py-1 rounded ${statusClasses[status] || "text-black bg-gray-200"}`}>
                            {status || "Processing"}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="wg-box wg-table table-all-user mt-5">
                <div className="row">
                  <div className="col-6">
                    <h5>Ordered Items</h5>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th style={{ backgroundColor: "#064944" }}></th>
                        <th style={{ backgroundColor: "#064944" }}>Name</th>
                        <th style={{ backgroundColor: "#064944" }} className="text-center">Price</th>
                        <th style={{ backgroundColor: "#064944" }} className="text-center">Quantity</th>
                        <th style={{ backgroundColor: "#064944" }} className="text-center">Sub Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.product.id}>
                          <td className="pname">
                            <div className="image">
                              <img
                                src={`/assets/app/images/products/${item.product.images[0]}`}
                                alt={item.product.name}
                                width={80}
                                height={80}
                              />
                            </div>
                          </td>
                          <td className="pname">
                            <div className="name">
                              <Link
                                href={`/details/${item.product.id}`}
                                target="_blank"
                                className="body-title-2"
                              >
                                {item.product.name}
                              </Link>
                            </div>
                          </td>
                          <td className="text-center">${item.product.salePrice}</td>
                          <td className="text-center">{item.quantity}</td>
                        <td className="text-center">
                            ${item.quantity * (item.product.salePrice ?? 0)}
                        </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="wg-box mt-5">
                <h5>Shipping Address</h5>
                <div className="my-account__address-item col-md-6">
                  <div className="my-account__address-item__detail">
                    <p className="m-2 fs-6">{shippingInfo.name}</p>
                    <p className="m-2 fs-6">{shippingInfo.phone}</p>
                    <p className="m-2 fs-6">{shippingInfo.city}</p>
                    <p className="m-2 fs-6">{shippingInfo.addressDetails}</p>
                    <br />
                  </div>
                </div>
              </div>

              <div className="wg-box mt-5">
                <h5>Transactions</h5>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered table-transaction">
                    <tbody>
                      <tr>
                        <th style={{ backgroundColor: "#064944" }}>Subtotal</th>
                        <td>${subtotalOrder}</td>
                        <th style={{ backgroundColor: "#064944" }}>Shipping</th>
                        <td className=" fs-6">
                          {shippingFee
                            ? `${shippingMethod} ($${shippingFee})`
                            : "Free shipping"}
                        </td>
                        <th style={{ backgroundColor: "#064944" }}>Discount</th>
                        <td>$0.00</td>
                      </tr>
                      <tr>
                        <th style={{ backgroundColor: "#064944" }} >Total</th>
                        <td>${totalOrderValue}</td>
                        <th style={{ backgroundColor: "#064944" }}>Payment Method</th>
                        <td>{paymentMethod}</td>
                        <th style={{ backgroundColor: "#064944" }}>Status</th>
                        <td>
                          <span className={`text-center p-2 rounded ${statusClasses[status] || "text-black bg-light"}`}>
                            {status || "Processing"}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="wg-box mt-5 text-right">
                <span></span>
                  <input type="hidden" name="_method" value="PUT" />
                  {status === "pending" ? (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleCancelOrder}
                      disabled={isLoading}
                    >
                      {isLoading ? "Canceling..." : "Cancel Order"}
                    </button>
                  ) : status === "cancelled" ? (
                    <p className="text-danger mt-2">Your order has been cancelled.</p>
                  ) : (
                    <p className="text-danger mt-2">
                      ❌ You can only cancel an order when its status is pending.
                    </p>
                  )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default OrderDetails;
