"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, updateCartQuantity, handleRemoveItem, handleShippingChange, shippingMethod } = useCart();
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.salePrice * item.quantity,
    0
  );
  const shipping =
    shippingMethod === "free_shipping"
      ? 0
      : shippingMethod === "express_shipping"
      ? 9
      : 1;
  const total = subtotal + shipping;

  return (
    <div>
      <div className="mb-4 pb-4"></div>
      <section className="shop-checkout container">
        <h2 className="page-title">Cart</h2>
        <div className="checkout-steps">
          <Link href="/cart" className="checkout-steps__item active">
            <span className="checkout-steps__item-number">01</span>
            <span className="checkout-steps__item-title">
              <span>Shopping Bag</span>
              <em>Manage Your Items List</em>
            </span>
          </Link>
          <Link href="/cart/checkout" className="checkout-steps__item">
            <span className="checkout-steps__item-number">02</span>
            <span className="checkout-steps__item-title">
              <span>Shipping and Checkout</span>
              <em>Checkout Your Items List</em>
            </span>
          </Link>
          <Link href="/cart/confirm" className="checkout-steps__item">
            <span className="checkout-steps__item-number">03</span>
            <span className="checkout-steps__item-title">
              <span>Confirmation</span>
              <em>Review And Submit Your Order</em>
            </span>
          </Link>
        </div>
        <div className="shopping-cart">
          <div className="cart-table__wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th></th>
                  <th className="ps-2">Price</th>
                  <th className="ps-2">Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.product.id}>
                    <td>
                      <div className="shopping-cart__product-item">
                        <img
                          src={`/assets/app/images/products/${item.product.images[0]}`}
                          width="120"
                          height="120"
                          alt={item.product.name}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="shopping-cart__product-item__detail">
                        <h4>{item.product.name}</h4>
                        <ul className="shopping-cart__product-item__options">
                          <li>Color: Yellow</li>
                          <li>Size: L</li>
                        </ul>
                      </div>
                    </td>
                    <td>
                      <span className="shopping-cart__product-price text-red">
                        ${item.product.salePrice}
                      </span>
                      <del className="shopping-cart__product-price">
                        ${item.product.price}
                      </del>
                    </td>
                    <td>
                      <div className="qty-control position-relative">
                        <button
                          className="qty-control__reduce border-0 bg-transparent"
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateCartQuantity(item.product.id, item.quantity - 1);
                            }
                          }}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          className="qty-control__number text-center"
                          readOnly
                        />
                        <button
                          className="qty-control__increase border-0 bg-transparent"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className="shopping-cart__subtotal">
                        ${item.product.salePrice * item.quantity}
                      </span>
                    </td>
                    <td>
                    <button onClick={() => handleRemoveItem(item.product.id)} className="text-gray opacity-50">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="shopping-cart__totals-wrapper">
            <div className="sticky-content">
              <div className="shopping-cart__totals">
                <h3>Cart Totals</h3>
                <table className="cart-totals">
                  <tbody>
                    <tr>
                      <th>Subtotal</th>
                      <td>${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th>Shipping</th>
                      <td>
                        <div className="form-check">
                          <input
                            className="form-check-input form-check-input_fill"
                            type="radio"
                            name="shipping"
                            id="free_shipping"
                            checked={shippingMethod === "free_shipping"}
                            onChange={handleShippingChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="free_shipping"
                          >
                            Free shipping
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input form-check-input_fill"
                            type="radio"
                            name="shipping"
                            id="express_shipping"
                            checked={shippingMethod === "express_shipping"}
                            onChange={handleShippingChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="express_shipping"
                          >
                            Express shipping: $9
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input form-check-input_fill"
                            type="radio"
                            name="shipping"
                            id="local_pickup"
                            checked={shippingMethod === "local_pickup"}
                            onChange={handleShippingChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="local_pickup"
                          >
                            Local pickup: $1
                          </label>
                        </div>

                        <div>Shipping to AL.</div>
                        <div>
                          <a href="#" className="menu-link menu-link_us-s">
                            CHANGE ADDRESS
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                    <th className="fw-bold">TOTAL</th>
                      <td className="fw-bold">${total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mobile_fixed-btn_wrapper">
                <div className="button-wrapper container">
                  <Link
                    href="/cart/checkout"
                    className="btn btn-primary btn-checkout align-items-center pt-3"
                  >
                    PROCEED TO CHECKOUT
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
