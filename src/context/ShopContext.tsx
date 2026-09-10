"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProductItem, CategoryItem, PRODUCTS, CATEGORIES } from "@/data/products";

export interface CartItem {
  id: number;
  product: ProductItem;
  quantity: number;
  size: string;
  color: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export interface UserAccount {
  fullName: string;
  email: string;
  phone?: string;
  role: "Customer" | "Admin";
}

export interface OrderItem {
  orderId: string;
  createdAt: string;
  customerInfo: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    note?: string;
  };
  items: CartItem[];
  totalAmount: number;
  status: "Chờ xác nhận" | "Đang giao" | "Thành công" | "Đã hủy";
  paymentMethod: "cod" | "card";
  isArchived?: boolean;
}

interface ShopContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: ProductItem, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (id: number, size: string, color: string) => void;
  updateQuantity: (id: number, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Wishlist
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;

  // Toast
  toasts: ToastNotification[];
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;

  // Quick View
  quickViewProduct: ProductItem | null;
  openQuickView: (product: ProductItem) => void;
  closeQuickView: () => void;

  // Auth
  user: UserAccount | null;
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, phone: string, pass: string) => boolean;
  logout: () => void;

  // Categories Management (Realtime sync with Admin)
  categories: CategoryItem[];
  activeCategories: CategoryItem[];
  pinnedCategories: CategoryItem[];
  archivedCategories: CategoryItem[];
  addCategory: (cat: { name: string; imageUrl: string; description?: string; isPinned?: boolean }) => void;
  updateCategory: (id: number, cat: Partial<CategoryItem>) => void;
  deleteCategory: (id: number) => void;
  togglePinCategory: (id: number) => void;
  archiveCategory: (id: number) => void;
  restoreCategory: (id: number) => void;

  // Products Management (Realtime sync with Admin)
  products: ProductItem[];
  addProduct: (prod: Omit<ProductItem, "id">) => void;
  updateProduct: (id: number, prod: Partial<ProductItem>) => void;
  deleteProduct: (id: number) => void;

  // Orders & Archive
  orders: OrderItem[];
  activeOrders: OrderItem[];
  archivedOrders: OrderItem[];
  placeOrder: (customerInfo: OrderItem["customerInfo"], paymentMethod: "cod" | "card") => OrderItem;
  updateOrderStatus: (orderId: string, status: OrderItem["status"]) => void;
  archiveOrder: (orderId: string) => void;
  restoreOrder: (orderId: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

let toastIndex = 0;
function createToastId(): string {
  toastIndex += 1;
  return `t_${Date.now()}_${toastIndex}`;
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  // Categories State
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    if (typeof window === "undefined") return CATEGORIES;
    try {
      const saved = localStorage.getItem("fashion_categories");
      return saved ? JSON.parse(saved) : CATEGORIES;
    } catch {
      return CATEGORIES;
    }
  });

  // Products State
  const [products, setProducts] = useState<ProductItem[]>(() => {
    if (typeof window === "undefined") return PRODUCTS;
    try {
      const saved = localStorage.getItem("fashion_products");
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("fashion_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("fashion_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);

  // User State
  const [user, setUser] = useState<UserAccount | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem("fashion_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Orders State
  const [orders, setOrders] = useState<OrderItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("fashion_orders");
      if (saved) return JSON.parse(saved);
      return [
        {
          orderId: "FS-89234",
          createdAt: "10/09/2026",
          customerInfo: {
            fullName: "Nguyễn Văn An",
            phone: "0912345678",
            email: "nguyenvanan@gmail.com",
            address: "123 Cầu Giấy, Hà Nội",
          },
          items: [
            {
              id: 1,
              product: PRODUCTS[0],
              quantity: 2,
              size: "L",
              color: "Trắng",
            },
          ],
          totalAmount: 398000,
          status: "Đang giao",
          paymentMethod: "cod",
          isArchived: false,
        },
      ];
    } catch {
      return [];
    }
  });

  // Persist to LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fashion_categories", JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fashion_products", JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fashion_cart", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fashion_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("fashion_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("fashion_user");
      }
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fashion_orders", JSON.stringify(orders));
    }
  }, [orders]);

  // Toast Helpers
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = createToastId();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  // Cart Functions
  const addToCart = (product: ProductItem, quantity = 1, size = "M", color = "Trắng") => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size && item.color === color
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { id: product.id, product, quantity, size, color }];
      }
    });

    showToast(`Đã thêm "${product.name}" (${color}, size ${size}) vào giỏ hàng!`, "success");
  };

  const removeFromCart = (id: number, size: string, color: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === id && item.size === size && item.color === color)));
    showToast("Đã xóa sản phẩm khỏi giỏ hàng", "info");
  };

  const updateQuantity = (id: number, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === id && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const product = products.find((p) => p.id === productId) || PRODUCTS.find((p) => p.id === productId);
      if (exists) {
        showToast(`Đã bỏ yêu thích "${product?.name || 'Sản phẩm'}"`, "info");
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Đã thêm "${product?.name || 'Sản phẩm'}" vào danh sách yêu thích!`, "success");
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: number) => wishlist.includes(productId);

  // Quick View
  const openQuickView = (product: ProductItem) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  // Auth
  const login = (email: string, pass: string): boolean => {
    if ((email === "admin" || email === "admin@clothingshop.vn") && pass === "Admin@123") {
      const adminUser: UserAccount = {
        fullName: "Quản trị viên",
        email: "admin@clothingshop.vn",
        phone: "0900000000",
        role: "Admin",
      };
      setUser(adminUser);
      showToast("Đăng nhập Admin thành công!", "success");
      return true;
    }

    if (email && pass.length >= 6) {
      const customerUser: UserAccount = {
        fullName: email.split("@")[0] || "Khách Hàng",
        email: email,
        role: "Customer",
      };
      setUser(customerUser);
      showToast(`Chào mừng bạn trở lại, ${customerUser.fullName}!`, "success");
      return true;
    }

    showToast("Email hoặc mật khẩu không chính xác!", "error");
    return false;
  };

  const register = (fullName: string, email: string, phone: string, pass: string): boolean => {
    if (fullName && email && pass.length >= 6) {
      const newUser: UserAccount = {
        fullName,
        email,
        phone,
        role: "Customer",
      };
      setUser(newUser);
      showToast("Đăng ký tài khoản thành công!", "success");
      return true;
    }
    showToast("Vui lòng điền đầy đủ thông tin hợp lệ!", "error");
    return false;
  };

  const logout = () => {
    setUser(null);
    showToast("Đã đăng xuất tài khoản", "info");
  };

  // --- CATEGORIES MANAGEMENT ---
  const activeCategories = categories.filter((c) => !c.isArchived);
  const pinnedCategories = categories.filter((c) => !c.isArchived && c.isPinned);
  const archivedCategories = categories.filter((c) => c.isArchived);

  const addCategory = (catData: { name: string; imageUrl: string; description?: string; isPinned?: boolean }) => {
    const newId = Math.max(0, ...categories.map((c) => c.id)) + 1;
    const newCategory: CategoryItem = {
      id: newId,
      name: catData.name,
      slug: catData.name.toLowerCase().replace(/\s+/g, "-"),
      count: 0,
      imageUrl: catData.imageUrl,
      isVisible: catData.isPinned !== false,
      isPinned: catData.isPinned !== false,
      isArchived: false,
      description: catData.description || "",
    };

    setCategories((prev) => [...prev, newCategory]);
    showToast(`Đã thêm danh mục mới "${catData.name}"!`, "success");
  };

  const updateCategory = (id: number, catData: Partial<CategoryItem>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...catData } : c))
    );
    showToast("Đã cập nhật thông tin danh mục!", "success");
  };

  const deleteCategory = (id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast("Đã xóa vĩnh viễn danh mục!", "info");
  };

  const togglePinCategory = (id: number) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newPinned = !c.isPinned;
          showToast(
            newPinned
              ? `Đã ghim danh mục "${c.name}" lên giao diện web!`
              : `Đã hạ danh mục "${c.name}" xuống (ẩn trên web)!`,
            newPinned ? "success" : "info"
          );
          return { ...c, isPinned: newPinned, isVisible: newPinned };
        }
        return c;
      })
    );
  };

  const archiveCategory = (id: number) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          showToast(`Đã chuyển danh mục "${c.name}" vào kho lưu trữ!`, "info");
          return { ...c, isArchived: true, isPinned: false, isVisible: false };
        }
        return c;
      })
    );
  };

  const restoreCategory = (id: number) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          showToast(`Đã khôi phục danh mục "${c.name}" từ kho lưu trữ!`, "success");
          return { ...c, isArchived: false, isPinned: true, isVisible: true };
        }
        return c;
      })
    );
  };

  // --- PRODUCTS MANAGEMENT ---
  const addProduct = (prodData: Omit<ProductItem, "id">) => {
    const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
    const newProd: ProductItem = {
      ...prodData,
      id: newId,
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Đã thêm sản phẩm "${prodData.name}" vào kho!`, "success");
  };

  const updateProduct = (id: number, prodData: Partial<ProductItem>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...prodData } : p))
    );
    showToast(`Đã cập nhật sản phẩm thành công!`, "success");
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast("Đã xóa sản phẩm khỏi kho!", "info");
  };

  // --- ORDERS & ARCHIVE MANAGEMENT ---
  const activeOrders = orders.filter((o) => !o.isArchived);
  const archivedOrders = orders.filter((o) => o.isArchived);

  const placeOrder = (customerInfo: OrderItem["customerInfo"], paymentMethod: "cod" | "card"): OrderItem => {
    const newOrderId = "FS-" + Math.floor(10000 + Math.random() * 90000);
    const dateStr = new Date().toLocaleDateString("vi-VN");

    const newOrder: OrderItem = {
      orderId: newOrderId,
      createdAt: dateStr,
      customerInfo,
      items: [...cart],
      totalAmount: cartTotal,
      status: "Chờ xác nhận",
      paymentMethod,
      isArchived: false,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Đặt hàng thành công! Mã đơn hàng #${newOrderId}`, "success");
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderItem["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
    );
    showToast(`Cập nhật đơn #${orderId} thành "${status}"!`, "success");
  };

  const archiveOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, isArchived: true } : o))
    );
    showToast(`Đã chuyển đơn hàng #${orderId} vào kho lưu trữ!`, "info");
  };

  const restoreOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, isArchived: false } : o))
    );
    showToast(`Đã lấy đơn hàng #${orderId} ra khỏi kho lưu trữ!`, "success");
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,

        wishlist,
        toggleWishlist,
        isWishlisted,

        toasts,
        showToast,
        removeToast,

        quickViewProduct,
        openQuickView,
        closeQuickView,

        user,
        login,
        register,
        logout,

        // Categories
        categories,
        activeCategories,
        pinnedCategories,
        archivedCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        togglePinCategory,
        archiveCategory,
        restoreCategory,

        // Products
        products,
        addProduct,
        updateProduct,
        deleteProduct,

        // Orders
        orders,
        activeOrders,
        archivedOrders,
        placeOrder,
        updateOrderStatus,
        archiveOrder,
        restoreOrder,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}

