// hot deals
<button className="add-to-cart-btn" style={{ left: "92px" }}>Add to Cart</button>;

// features
<button className="add-to-cart-btn"  style={{ left: "125px" }}>Add to Cart</button>;

// details
<button type="submit" className="btn btn-dark">Add to Cart</button>;

//related products
<button className="add-to-cart-btn">Add to Cart</button>;

// categories-pro
<button className="add-to-cart-btn">Add to Cart</button>;

// shop-list
<button className="add-to-cart-btn">Add to Cart</button>;

// search
<button className="add-to-cart-btn">Add to Cart</button>;



"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart } = useCart();
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const vat = subtotal * 0;
  const shipping = subtotal > 500 ? 0 : 49; // Free ship nếu >500$
  const total = subtotal + vat + shipping;

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
                  <th>Price</th>
                  <th>Quantity</th>
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
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          className="qty-control__number text-center"
                          readOnly
                        />
                      </div>
                    </td>
                    <td>
                      <span className="shopping-cart__subtotal">
                        ${item.product.price * item.quantity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-table-footer">
              <form action="#" className="position-relative bg-body">
                <input
                  className="form-control"
                  type="text"
                  name="coupon_code"
                  placeholder="Coupon Code"
                />
                <input
                  className="btn-link fw-medium position-absolute top-0 end-0 h-100 px-4"
                  type="submit"
                  value="APPLY COUPON"
                />
              </form>
              <button className="btn btn-light">UPDATE CART</button>
            </div>
          </div>
          <div className="shopping-cart__totals-wrapper">
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
                    <td>${shipping.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <th>VAT</th>
                    <td>${vat.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <th>Total</th>
                    <td>${total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <a href="/checkout" className="btn btn-primary btn-checkout">
              PROCEED TO CHECKOUT
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

