"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useNotification } from "./NotificationContext";

interface CartItem {
  product: {
    id: string;
    name: string;
    salePrice: number;
    price: number;
    images: string[];
    color: string;
    size: string;
  };
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  totalCartQuantity: number;
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, newQuantity: number) => void;
  handleRemoveItem: (productId: string) => void;
  handleShippingChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  shippingMethod: string;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalCartQuantity, setTotalCartQuantity] = useState(0);
  const { showNotification } = useNotification();
  const [shippingMethod, setShippingMethod] = useState("free_shipping");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCart(token);
    }
  }, []);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalCartQuantity(total);
  }, [cart]);

  async function fetchCart(token: string) {
    try {
      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart.products); 
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }

  async function addToCart(productId: string, quantity: number = 1) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in to add items to the cart!");
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();
      if (data.success) {
        // Cập nhật giỏ hàng ngay sau khi thêm thành công
        fetchCart(token);
        showNotification(
          data.message || "Added to cart successfully!",
          "success"
        );
      } else {
        showNotification(
          data.message || "Failed to add item to cart!",
          "error"
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showNotification("Something went wrong!", "error");
    }
  }

  const updateCartQuantity = async (productId: string, newQuantity: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );

      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error("Failed to update cart on server");
        await fetchCart(token);
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      if (data.success) {
        setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
      } else {
        console.error("Failed to remove item from cart.");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleShippingChange = (event: any) => {
    setShippingMethod(event.target.id);
  }

  const clearCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("/api/cart/clear", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setCart([]);
        // showNotification("Cart cleared successfully!", "success");
      } else {
        console.error("Failed to clear cart.");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  }


  return (
    <CartContext.Provider value={{ 
      cart, 
      totalCartQuantity, 
      addToCart,
      updateCartQuantity, 
      handleRemoveItem,
      handleShippingChange,
      shippingMethod,
      clearCart
      }}>


      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
