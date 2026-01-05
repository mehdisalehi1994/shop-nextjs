"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    items: [],
    discountPrice: 0,
    appliedDiscount: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItem, setUpdatingItem] = useState(null);

  // خواندن سبد از سرور
  useEffect(() => {
    async function fetchCart() {
      try {
        setError(null);
        const response = await fetch("/api/cart");
        if (!response.ok) {
          setError("لطفا وارد حساب کاربری خود شوید");
          setCart({ items: [], discountPrice: 0, appliedDiscount: null });
          return;
        }
        const data = await response.json();
        setCart(
          data && data.items
            ? data
            : { items: [], discountPrice: 0, appliedDiscount: null }
        );
      } catch (err) {
        setError("خطایی در بارگذاری سبد خرید رخ داد");
        setCart({ items: [], discountPrice: 0, appliedDiscount: null });
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  async function updateCart() {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
      }
    } catch (err) {
      setError("خطایی در به‌روزرسانی سبد خرید رخ داد");
    }
  }

  async function addToCart(productId, quantity = 1) {
    try {
      setUpdatingItem(productId);
      setError(null);
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || "خطایی در افزودن محصول به سبد خرید رخ داد");
        return;
      }
      await updateCart();
    } catch (err) {
      setError("خطایی در افزودن محصول به سبد خرید رخ داد");
    } finally {
      setUpdatingItem(null);
    }
  }

  async function decreaseQuantity(productId) {
    try {
      const item = cart.items.find((i) => i.product._id === productId);
      if (!item) {
        setError("محصول در سبد خرید یافت نشد");
        return;
      }
      setUpdatingItem(productId);
      if (item.quantity <= 1) {
        await removeFromCart(productId);
        return;
      }
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: -1 }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || "خطایی در کاهش تعداد محصول رخ داد");
        return;
      }
      await updateCart();
    } catch (err) {
      setError("خطایی در کاهش تعداد محصول رخ داد");
    } finally {
      setUpdatingItem(null);
    }
  }

  async function increaseQuantity(productId) {
    try {
      const item = cart.items.find((i) => i.product._id === productId);
      if (!item || item.quantity >= item.product.stock) {
        setError("محصول در سبد خرید یافت نشد یا موجودی کافی نیست");
        return;
      }
      setUpdatingItem(productId);
      await addToCart(productId, 1);
    } catch (err) {
      setError("خطایی در افزایش تعداد محصول رخ داد");
    } finally {
      setUpdatingItem(null);
    }
  }

  async function removeFromCart(productId) {
    try {
      setUpdatingItem(productId);
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || "خطایی در حذف محصول از سبد خرید رخ داد");
        return;
      }
      await updateCart();
    } catch (err) {
      setError("خطایی در حذف محصول از سبد خرید رخ داد");
    } finally {
      setUpdatingItem(null);
    }
  }

  async function clearCart() {
    try {
      await fetch("/api/cart/clear", { method: "POST" }); // نیاز به API جدید برای خالی کردن سبد
      setCart({ items: [], discountPrice: 0, appliedDiscount: null });
    } catch {
      setCart({ items: [], discountPrice: 0, appliedDiscount: null });
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        loading,
        error,
        updatingItem,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
