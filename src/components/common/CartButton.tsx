"use client";

import { useCart } from "@/context/CartContext";

interface CartButtonProps {
  productId: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function CartButton({ productId, className, style }: CartButtonProps) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(productId)}
      className={`add-to-cart-btn ${className}`}
      style={style}
    >
      Add to Cart
    </button>
  );
}
