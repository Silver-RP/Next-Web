"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useNotification } from "../../../context/NotificationContext";

export default function CheckoutPage() {
  const { cart, shippingMethod, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.salePrice * item.quantity,
    0
  );
  const total =
    subtotal +
    (shippingMethod === "free_shipping"
      ? 0
      : shippingMethod === "flat_rate"
      ? 9
      : 1);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const { showNotification } = useNotification() as unknown as {
    showNotification: (message: string, type: string) => void;
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getShippingLabel = (method: string) => {
    switch (method) {
      case "free_shipping":
        return "Free shipping";
      case "flat_rate":
        return "Flat rate: $9";
      case "local_pickup":
        return "Local pickup: $1";
      default:
        return "Unknown shipping method";
    }
  };

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.id);
  };

  const handlePlaceOrder = async () => {
    const form = document.forms.namedItem(
      "checkout-form"
    ) as HTMLFormElement | null;
    if (!form) {
      console.error("Checkout form not found!");
      return;
    }

    const cartData = cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.salePrice,
      name: item.product.name, 
    }));

    const totalOrder = total ?? 0;
    const shippingMethodLabel = getShippingLabel(shippingMethod);
    const shippingFee =
      shippingMethod === "free_shipping"
        ? 0
        : shippingMethod === "flat_rate"
        ? 9
        : 1;

    const name = (
      form.elements.namedItem("name") as HTMLInputElement
    )?.value.trim();
    const phone = (
      form.elements.namedItem("phone") as HTMLInputElement
    )?.value.trim();
    const city = (
      form.elements.namedItem("city") as HTMLInputElement
    )?.value.trim();
    const addressDetails = (
      form.elements.namedItem("landmark") as HTMLInputElement
    )?.value.trim();
    const selectedPaymentMethod = (
      document.querySelector(
        'input[name="checkout_payment_method"]:checked'
      ) as HTMLInputElement
    )?.id;

    if (!name || !phone || !city || !addressDetails || !selectedPaymentMethod) {
      showNotification(
        "Please fill in all required fields of shipping details.",
        "error"
      );
      return;
    }

    const mapShippingMethodLabelToEnum = (
      label: string
    ): "free_shipping" | "flat_rate" | "local_pickup" => {
      if (label.toLowerCase().includes("free")) return "free_shipping";
      if (label.toLowerCase().includes("flat")) return "flat_rate";
      if (label.toLowerCase().includes("pickup")) return "local_pickup";
      throw new Error("Invalid shipping method");
    };

    const normalizedShippingMethod =
      mapShippingMethodLabelToEnum(shippingMethod);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          cartItems: cartData,
          name,
          phone,
          city,
          addressDetails,
          paymentMethod: selectedPaymentMethod,
          shippingFee,
          shippingMethod: normalizedShippingMethod,
          totalAmount,
          totalOrderValue: totalOrder,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        saveOrderToLocalStorage(data.order, cartData);
        showNotification("Order placed successfully!", "success");

        await clearCart();

        setTimeout(() => {
          window.location.href = "/cart/confirm";
        }, 2000);
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("An error occurred while placing your order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveOrderToLocalStorage = (
    order: {
      createdAt: any;
      id: string;
      totalOrderValue: number;
      paymentMethod: string;
    },
    cartItems: { productId: string; quantity: number; price: number; name: string }[]
  ) => {
    const orderNumber = order.id.slice(-6);

    const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const getReadablePaymentMethod = (method: string) => {
      switch (method) {
        case "cash_on_delivery":
          return "Cash on Delivery";
        case "credit_card":
          return "Credit Card";
        case "paypal":
          return "PayPal";
        default:
          return "Unknown";
      }
    };
  
  
    localStorage.setItem("order-confirm", JSON.stringify({
      orderNumber,
      date: formattedDate,
      total: order.totalOrderValue,
      paymentMethod: getReadablePaymentMethod(order.paymentMethod),
      products: cartItems, 
      subtotal: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      shippingMethod: getShippingLabel(shippingMethod),
    }));
  };
  

  return (
    <div>
      <div className="mb-4 pb-4"></div>
      <section className="shop-checkout container">
        <h2 className="page-title">Shipping and Checkout</h2>
        <div className="checkout-steps">
          <Link href="/cart" className="checkout-steps__item active">
            <span className="checkout-steps__item-number">01</span>
            <span className="checkout-steps__item-title">
              <span>Shopping Bag</span>
              <em>Manage Your Items List</em>
            </span>
          </Link>
          <Link href="/cart/checkout" className="checkout-steps__item active">
            <span className="checkout-steps__item-number">02</span>
            <span className="checkout-steps__item-title">
              <span>Shipping and Checkout</span>
              <em>Checkout Your Items List</em>
            </span>
          </Link>
          <Link href="/cart/confirm" className="checkout-steps__item ">
            <span className="checkout-steps__item-number">03</span>
            <span className="checkout-steps__item-title">
              <span>Confirmation</span>
              <em>Review And Submit Your Order</em>
            </span>
          </Link>
        </div>
        <form
          name="checkout-form"
          action="https://uomo-html.flexkitux.com/Demo3/shop_order_complete.html"
        >
          <div className="checkout-form">
            <div className="billing-info__wrapper">
              <div className="row">
                <div className="col-6">
                  <h4>SHIPPING DETAILS</h4>
                </div>
                <div className="col-6"></div>
              </div>

              <div className="row mt-5">
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      required
                    />
                    <label htmlFor="name">
                      Full Name <span className="text-red">*</span>
                    </label>
                    <span className="text-danger"></span>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      required
                    />
                    <label htmlFor="phone">
                      Phone Number <span className="text-red">*</span>
                    </label>
                    <span className="text-danger"></span>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      required
                    />
                    <label htmlFor="city">
                      Town / City <span className="text-red">*</span>
                    </label>
                    <span className="text-danger"></span>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      name="landmark"
                      required
                    />
                    <label htmlFor="landmark">
                      Detailed Address <span className="text-red">*</span>
                    </label>
                    <span className="text-danger"></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="checkout__totals-wrapper">
              <div className="sticky-content">
                <div className="checkout__totals">
                  <h3>Your Order</h3>
                  <table className="checkout-cart-items">
                    <thead>
                      <tr>
                        <th>PRODUCT</th>
                        <th align="right">SUBTOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.product.id}>
                          <td>
                            {item.product.name} x {item.quantity}
                          </td>
                          <td align="right">
                            ${item.product.salePrice * item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <table className="checkout-totals">
                    <tbody>
                      <tr>
                        <th>SUBTOTAL: {totalAmount}</th>
                        <td align="right">${subtotal}</td>
                      </tr>
                      <tr>
                        <th>SHIPPING</th>
                        <td align="right">
                          {getShippingLabel(shippingMethod)}
                        </td>
                      </tr>
                      <tr>
                        <th className="fw-bold">TOTAL</th>
                        <td align="right" className="fw-bold">
                          ${total}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="checkout__payment-methods">
                  <div className="form-check">
                    <input
                      className="form-check-input form-check-input_fill"
                      type="radio"
                      name="checkout_payment_method"
                      id="cash_on_delivery"
                      checked={paymentMethod === "cash_on_delivery"}
                      onChange={handlePaymentChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="cash_on_delivery"
                    >
                      Cash on delivery
                      <p className="option-detail">
                        Please prepare the correct amount upon delivery.
                      </p>
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input form-check-input_fill"
                      type="radio"
                      name="checkout_payment_method"
                      id="credit_card"
                      checked={paymentMethod === "credit_card"}
                      onChange={handlePaymentChange}
                    />
                    <label className="form-check-label" htmlFor="credit_card">
                      Credit Card
                      <p className="option-detail">
                        Make your payment directly into our bank account...
                      </p>
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input form-check-input_fill"
                      type="radio"
                      name="checkout_payment_method"
                      id="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={handlePaymentChange}
                    />
                    <label className="form-check-label" htmlFor="paypal">
                      Paypal
                      <p className="option-detail">
                        Secure payment via PayPal account. Supports Visa,
                        MasterCard.
                      </p>
                    </label>
                  </div>

                  <div className="policy-text">
                    Your personal data will be used to process your order,
                    support your experience...
                    <a href="terms.html" target="_blank">
                      privacy policy
                    </a>
                    .
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-checkout"
                  disabled={isSubmitting}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePlaceOrder();
                  }}
                >
                  {isSubmitting ? "Processing..." : "PLACE ORDER"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
