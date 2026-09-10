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

export interface ReviewItem {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: string;
  city?: string;
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
  updateProfile: (data: Partial<UserAccount>) => void;

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

  // Reviews
  reviews: ReviewItem[];
  addReview: (productId: number, rating: number, content: string, city?: string) => void;
  getProductReviews: (productId: number) => ReviewItem[];
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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 12) return parsed;
      }
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
          items: [{ id: 1, product: PRODUCTS[0], quantity: 2, size: "L", color: "Trắng" }],
          totalAmount: 398000,
          status: "Đang giao",
          paymentMethod: "cod",
          isArchived: false,
        },
        {
          orderId: "FS-95120",
          createdAt: "10/09/2026",
          customerInfo: {
            fullName: "Trịnh Thùy Linh",
            phone: "0918273645",
            email: "thuylinh.trinh@gmail.com",
            address: "15 Hùng Vương, Nha Trang, Khánh Hòa",
          },
          items: [
            { id: 13, product: PRODUCTS[12] || PRODUCTS[0], quantity: 1, size: "M", color: "Trắng" },
            { id: 24, product: PRODUCTS[23] || PRODUCTS[1], quantity: 1, size: "One Size", color: "Đen Nhám" },
          ],
          totalAmount: 588000,
          status: "Chờ xác nhận",
          paymentMethod: "card",
          isArchived: false,
        },
        {
          orderId: "FS-74521",
          createdAt: "09/09/2026",
          customerInfo: {
            fullName: "Trần Thị Mai",
            phone: "0987654321",
            email: "tranthimai@gmail.com",
            address: "45 Lê Lợi, TP. Hồ Chí Minh",
          },
          items: [
            { id: 5, product: PRODUCTS[4], quantity: 1, size: "M", color: "Hồng Pastel" },
            { id: 12, product: PRODUCTS[11], quantity: 1, size: "One Size", color: "Nâu Bò" },
          ],
          totalAmount: 988000,
          status: "Thành công",
          paymentMethod: "card",
          isArchived: false,
        },
        {
          orderId: "FS-83401",
          createdAt: "09/09/2026",
          customerInfo: {
            fullName: "Ngô Quang Hải",
            phone: "0981122334",
            email: "hai.ngoquang@gmail.com",
            address: "102 Trần Phú, TP. Vũng Tàu",
          },
          items: [
            { id: 22, product: PRODUCTS[21] || PRODUCTS[6], quantity: 1, size: "L", color: "Đen Than" },
            { id: 14, product: PRODUCTS[13] || PRODUCTS[3], quantity: 1, size: "L", color: "Đen" },
          ],
          totalAmount: 738000,
          status: "Đang giao",
          paymentMethod: "cod",
          isArchived: false,
        },
        {
          orderId: "FS-61830",
          createdAt: "08/09/2026",
          customerInfo: {
            fullName: "Lê Quang Huy",
            phone: "0901234567",
            email: "lequanghuy@gmail.com",
            address: "78 Nguyễn Trãi, Đà Nẵng",
          },
          items: [{ id: 3, product: PRODUCTS[2], quantity: 1, size: "30", color: "Xanh đậm" }],
          totalAmount: 599000,
          status: "Thành công",
          paymentMethod: "cod",
          isArchived: false,
        },
        {
          orderId: "FS-76295",
          createdAt: "08/09/2026",
          customerInfo: {
            fullName: "Bùi Thị Phương",
            phone: "0933887766",
            email: "phuongbui@gmail.com",
            address: "28 Phan Chu Trinh, Huế",
          },
          items: [
            { id: 21, product: PRODUCTS[20] || PRODUCTS[4], quantity: 1, size: "M", color: "Trắng Sữa" },
          ],
          totalAmount: 529000,
          status: "Thành công",
          paymentMethod: "card",
          isArchived: false,
        },
        {
          orderId: "FS-55290",
          createdAt: "07/09/2026",
          customerInfo: {
            fullName: "Phạm Thu Hương",
            phone: "0934567890",
            email: "phamthuhuong@gmail.com",
            address: "12 Hoàng Diệu, Huế",
          },
          items: [
            { id: 8, product: PRODUCTS[7], quantity: 2, size: "FreeSize (<65kg)", color: "Tím Pastel" },
          ],
          totalAmount: 898000,
          status: "Chờ xác nhận",
          paymentMethod: "card",
          isArchived: false,
        },
        {
          orderId: "FS-69014",
          createdAt: "07/09/2026",
          customerInfo: {
            fullName: "Dương Minh Tuấn",
            phone: "0944556677",
            email: "tuan.duong@gmail.com",
            address: "89 Lý Thường Kiệt, Hà Nội",
          },
          items: [
            { id: 23, product: PRODUCTS[22] || PRODUCTS[2], quantity: 1, size: "31", color: "Be Vàng" },
          ],
          totalAmount: 369000,
          status: "Chờ xác nhận",
          paymentMethod: "cod",
          isArchived: false,
        },
        {
          orderId: "FS-43187",
          createdAt: "06/09/2026",
          customerInfo: {
            fullName: "Hoàng Đức Minh",
            phone: "0967890123",
            email: "hoangducminh@gmail.com",
            address: "200 Bạch Đằng, Hải Phòng",
          },
          items: [
            { id: 7, product: PRODUCTS[6], quantity: 1, size: "L", color: "Xanh Nhạt Bụi" },
            { id: 4, product: PRODUCTS[3], quantity: 1, size: "L", color: "Đen" },
          ],
          totalAmount: 948000,
          status: "Đang giao",
          paymentMethod: "cod",
          isArchived: false,
        },
        {
          orderId: "FS-38640",
          createdAt: "05/09/2026",
          customerInfo: {
            fullName: "Vũ Thị Lan",
            phone: "0945678901",
            email: "vuthilan@gmail.com",
            address: "56 Đinh Tiên Hoàng, Hà Nội",
          },
          items: [{ id: 6, product: PRODUCTS[5], quantity: 1, size: "S", color: "Đỏ Đô" }],
          totalAmount: 549000,
          status: "Đã hủy",
          paymentMethod: "cod",
          isArchived: false,
        },
        {
          orderId: "FS-29751",
          createdAt: "04/09/2026",
          customerInfo: {
            fullName: "Đỗ Quốc Bảo",
            phone: "0978901234",
            email: "doquocbao@gmail.com",
            address: "33 Nguyễn Văn Cừ, Cần Thơ",
          },
          items: [
            { id: 2, product: PRODUCTS[1], quantity: 1, size: "XL", color: "Trắng" },
            { id: 10, product: PRODUCTS[9], quantity: 1, size: "M", color: "Đen" },
          ],
          totalAmount: 788000,
          status: "Thành công",
          paymentMethod: "card",
          isArchived: true,
        },
        {
          orderId: "FS-18426",
          createdAt: "03/09/2026",
          customerInfo: {
            fullName: "Nguyễn Thị Bích Ngọc",
            phone: "0956789012",
            email: "nguyenbichngoc@gmail.com",
            address: "88 Lê Duẩn, Đà Nẵng",
          },
          items: [
            { id: 9, product: PRODUCTS[8], quantity: 2, size: "S", color: "Trắng Sữa" },
          ],
          totalAmount: 698000,
          status: "Thành công",
          paymentMethod: "cod",
          isArchived: true,
        },
      ];
    } catch {
      return [];
    }
  });

  // Reviews State
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("fashion_reviews");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });



  // --- MONGODB CLOUD REALTIME SYNC ---
  const fetchCloudData = async () => {
    try {
      // 1. Đồng bộ Danh mục từ Cloud
      const catRes = await fetch("/api/categories");
      if (catRes.ok) {
        const catJson = await catRes.json();
        if (catJson.success && Array.isArray(catJson.data) && catJson.data.length > 0) {
          setCategories(catJson.data);
          try {
            localStorage.setItem("fashion_categories", JSON.stringify(catJson.data));
          } catch {}
        }
      }

      // 2. Đồng bộ Sản phẩm từ Cloud
      const prodRes = await fetch("/api/products");
      if (prodRes.ok) {
        const prodJson = await prodRes.json();
        if (prodJson.success && Array.isArray(prodJson.data) && prodJson.data.length > 0) {
          setProducts(prodJson.data);
          try {
            localStorage.setItem("fashion_products", JSON.stringify(prodJson.data));
          } catch {}
        }
      }

      // 3. Đồng bộ Đơn hàng từ Cloud
      const orderRes = await fetch("/api/orders");
      if (orderRes.ok) {
        const orderJson = await orderRes.json();
        if (orderJson.success && Array.isArray(orderJson.data)) {
          setOrders(orderJson.data);
          try {
            localStorage.setItem("fashion_orders", JSON.stringify(orderJson.data));
          } catch {}
        }
      }
    } catch {
      // Offline fallback
    }
  };

  useEffect(() => {
    // Tải dữ liệu đám mây không đồng bộ
    const timer = setTimeout(() => {
      fetchCloudData();
    }, 100);

    // Tự động kiểm tra và đồng bộ thời gian thực mỗi 4 giây
    const interval = setInterval(fetchCloudData, 4000);

    // Khi người dùng chuyển tab và quay lại web -> lập tức đồng bộ ngay
    const handleFocus = () => fetchCloudData();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Persist to LocalStorage cache
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fashion_reviews", JSON.stringify(reviews));
    }
  }, [reviews]);


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

  const updateProfile = (data: Partial<UserAccount>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    showToast("Đã cập nhật hồ sơ thành công!", "success");
  };

  // Reviews functions
  const addReview = (productId: number, rating: number, content: string, city?: string) => {
    if (!user) return;
    const newReview: ReviewItem = {
      id: `rev_${Date.now()}`,
      productId,
      userId: user.email,
      userName: user.fullName,
      rating,
      content,
      createdAt: new Date().toLocaleDateString("vi-VN"),
      city: city || "Khách Hàng",
    };
    setReviews((prev) => [newReview, ...prev]);
    showToast("Cảm ơn bạn đã gửi đánh giá!", "success");
  };

  const getProductReviews = (productId: number): ReviewItem[] => {
    return reviews.filter((r) => r.productId === productId);
  };


  const activeCategories = categories.filter((c) => !c.isArchived);
  const pinnedCategories = categories.filter((c) => !c.isArchived && c.isPinned);
  const archivedCategories = categories.filter((c) => c.isArchived);

  const addCategory = async (catData: { name: string; imageUrl: string; description?: string; isPinned?: boolean }) => {
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

    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      fetchCloudData();
    } catch {}
  };

  const updateCategory = async (id: number, catData: Partial<CategoryItem>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...catData } : c))
    );
    showToast("Đã cập nhật thông tin danh mục!", "success");

    try {
      await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...catData }),
      });
      fetchCloudData();
    } catch {}
  };

  const deleteCategory = async (id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast("Đã xóa vĩnh viễn danh mục!", "info");

    try {
      await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      fetchCloudData();
    } catch {}
  };

  const togglePinCategory = async (id: number) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    const newPinned = !cat.isPinned;
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned: newPinned, isVisible: newPinned } : c))
    );
    showToast(
      newPinned
        ? `Đã ghim danh mục "${cat.name}" lên giao diện web!`
        : `Đã hạ danh mục "${cat.name}" xuống (ẩn trên web)!`,
      newPinned ? "success" : "info"
    );

    try {
      await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPinned: newPinned, isVisible: newPinned }),
      });
      fetchCloudData();
    } catch {}
  };

  const archiveCategory = async (id: number) => {
    const cat = categories.find((c) => c.id === id);
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isArchived: true, isPinned: false, isVisible: false } : c))
    );
    showToast(`Đã chuyển danh mục "${cat?.name}" vào kho lưu trữ!`, "info");

    try {
      await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isArchived: true, isPinned: false, isVisible: false }),
      });
      fetchCloudData();
    } catch {}
  };

  const restoreCategory = async (id: number) => {
    const cat = categories.find((c) => c.id === id);
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isArchived: false, isPinned: true, isVisible: true } : c))
    );
    showToast(`Đã khôi phục danh mục "${cat?.name}" từ kho lưu trữ!`, "success");

    try {
      await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isArchived: false, isPinned: true, isVisible: true }),
      });
      fetchCloudData();
    } catch {}
  };

  // --- PRODUCTS MANAGEMENT ---
  const addProduct = async (prodData: Omit<ProductItem, "id">) => {
    const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
    const newProd: ProductItem = {
      ...prodData,
      id: newId,
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Đã thêm sản phẩm "${prodData.name}" vào kho!`, "success");

    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProd),
      });
      fetchCloudData();
    } catch {}
  };

  const updateProduct = async (id: number, prodData: Partial<ProductItem>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...prodData } : p))
    );
    showToast(`Đã cập nhật sản phẩm thành công!`, "success");

    try {
      await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...prodData }),
      });
      fetchCloudData();
    } catch {}
  };

  const deleteProduct = async (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast("Đã xóa sản phẩm khỏi kho!", "info");

    try {
      await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      fetchCloudData();
    } catch {}
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

    // Sync order to Cloud
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    }).catch(() => {});

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderItem["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
    );
    showToast(`Cập nhật đơn #${orderId} thành "${status}"!`, "success");

    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      fetchCloudData();
    } catch {}
  };

  const archiveOrder = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, isArchived: true } : o))
    );
    showToast(`Đã chuyển đơn hàng #${orderId} vào kho lưu trữ!`, "info");

    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, isArchived: true }),
      });
      fetchCloudData();
    } catch {}
  };

  const restoreOrder = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, isArchived: false } : o))
    );
    showToast(`Đã lấy đơn hàng #${orderId} ra khỏi kho lưu trữ!`, "success");

    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, isArchived: false }),
      });
      fetchCloudData();
    } catch {}
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
        updateProfile,

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

        // Reviews
        reviews,
        addReview,
        getProductReviews,
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

