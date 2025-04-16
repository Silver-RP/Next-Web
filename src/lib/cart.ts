// export async function getCart() {
//     const token = localStorage.getItem("token"); 
//     if (!token) return { success: false, message: "Unauthorized" };
  
//     const res = await fetch("/api/cart", {
//       headers: { Authorization: `Bearer ${token}` },
//       cache: "no-cache",
//     });
//     return res.json();
//   }
  
//   export async function addToCart(productId: string, quantity: number) {
//     const token = localStorage.getItem("token"); 
//     if (!token) return { success: false, message: "Unauthorized" };
  
//     const res = await fetch("/api/cart", {
//       method: "POST",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ productId, quantity }),
//     });
//     return res.json();
//   }
  