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

  // Reset data to Household defaults
  resetToHomeApplianceData: () => Promise<void>;

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

const REALTIME_CHANNEL = "homeliving_realtime_sync";

function postRealtimeMessage(message: { type: string; payload?: unknown }) {
  if (typeof window === "undefined") return;
  try {
    if ("BroadcastChannel" in window) {
      const bc = new BroadcastChannel(REALTIME_CHANNEL);
      bc.postMessage(message);
      bc.close();
    }
  } catch {}
}

// Kiểm tra xem dữ liệu có phải là dữ liệu thời trang quần áo cũ không
function isOldClothingList(items: unknown[]): boolean {
  if (!Array.isArray(items) || items.length === 0) return false;
  return items.some((item) => {
    if (!item || typeof item !== "object") return false;
    const name = (item as { name?: string }).name || "";
    const catName = (item as { categoryName?: string }).categoryName || "";
    return (
      name.startsWith("Áo Thun") ||
      name.startsWith("Áo Polo") ||
      name.startsWith("Áo Sơ Mi") ||
      name.startsWith("Quần Jean") ||
      name.startsWith("Quần Kaki") ||
      name.startsWith("Váy Hoa") ||
      name.startsWith("Đầm ") ||
      catName === "Thời trang nam" ||
      catName === "Thời trang nữ" ||
      catName === "Áo Nam" ||
      catName === "Quần Nam" ||
      catName === "Váy & Đầm"
    );
  });
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  // Categories State
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    if (typeof window === "undefined") return CATEGORIES;
    try {
      const saved = localStorage.getItem("fashion_categories");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && !isOldClothingList(parsed)) return parsed;
      }
      return CATEGORIES;
    } catch {
      return CATEGORIES;
    }
  });

  // Products State
  const [products, setProducts] = useState<ProductItem[]>(() => {
    if (typeof window === "undefined") return PRODUCTS;
    try {
      const saved = localStorage.getItem("fashion_products");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && !isOldClothingList(parsed)) return parsed;
      }
      return PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("fashion_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && !isOldClothingList(parsed.map((c) => c.product))) return parsed;
      }
      return [];
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

  // Orders State (Đơn hàng đồ gia dụng thực tế)
  const [orders, setOrders] = useState<OrderItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("fashion_orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 12 && !isOldClothingList(parsed.flatMap((o) => o.items?.map((i: CartItem) => i.product)))) {
          return parsed;
        }
      }
      return [
        {
          orderId: "HL-89234",
          createdAt: "10/09/2026",
          customerInfo: {
            fullName: "Nguyễn Văn An",
            phone: "0912345678",
            email: "nguyenvanan@gmail.com",
            address: "123 Cầu Giấy, Hà Nội",
          },
          items: [{ id: 1, product: PRODUCTS[0], quantity: 1, size: "Dung tích 6.5L", color: "Đen Nhám" }],
          totalAmount: 1390000,
          status: "Đang giao",
          paymentMethod: "cod",
          isArchived: false,
        },
        {
          orderId: "HL-95120",
          createdAt: "10/09/2026",
          customerInfo: {
            fullName: "Trịnh Thùy Linh",
            phone: "0918273645",
            email: "thuylinh.trinh@gmail.com",
            address: "15 Hùng Vương, Nha Trang, Khánh Hòa",
          },
          items: [
            { id: 9, product: PRODUCTS[8], quantity: 1, size: "Bản Tiêu Chuẩn 4 Đầu Hút", color: "Trắng Tinh Tế" },
            { id: 8, product: PRODUCTS[7], quantity: 1, size: "Dung tích 1.8L", color: "Thủy Tinh Trong Suốt" },
          ],
          totalAmount: 2339000,
          status: "Chờ xác nhận",
          paymentMethod: "card",
          isArchived: false,
        },
        {
          orderId: "HL-74521",
          createdAt: "09/09/2026",
          customerInfo: {
            fullName: "Trần Thị Mai",
            phone: "0987654321",
            email: "tranthimai@gmail.com",
            address: "45 Lê Lợi, TP. Hồ Chí Minh",
          },
          items: [
            { id: 10, product: PRODUCTS[9], quantity: 1, size: "Bản Tự Động Đổ Bụi 30 Ngày", color: "Trắng Sứ" },
          ],
          totalAmount: 5490000,
          status: "Thành công",
          paymentMethod: "card",
          isArchived: false,
        },
        {
          orderId: "HL-83401",
          createdAt: "09/09/2026",
          customerInfo: {
            fullName: "Ngô Quang Hải",
            phone: "0981122334",
            email: "hai.ngoquang@gmail.com",
            address: "102 Trần Phú, TP. Vũng Tàu",
          },
          items: [
            { id: 2, product: PRODUCTS[1], quantity: 1, size: "1.8L (4-8 người)", color: "Trắng Bạc" },
            { id: 3, product: PRODUCTS[2], quantity: 1, size: "Bản Pro Nấu Cháo 1.75L", color: "Xanh Mint" },
          ],
          totalAmount: 3100000,
          status: "Đang giao",
          paymentMethod: "cod",
          isArchived: false,
        },
        {
          orderId: "HL-61830",
          createdAt: "08/09/2026",
          customerInfo: {
            fullName: "Lê Quang Huy",
            phone: "0901234567",
            email: "lequanghuy@gmail.com",
            address: "78 Nguyễn Trãi, Đà Nẵng",
          },
          items: [{ id: 4, product: PRODUCTS[3], quantity: 1, size: "Bếp Đôi Lắp Âm / Dương", color: "Đen Pha Lê" }],
          totalAmount: 4590000,
          status: "Thành công",
          paymentMethod: "cod",
          isArchived: false,
        },
        {
          orderId: "HL-76295",
          createdAt: "08/09/2026",
          customerInfo: {
            fullName: "Bùi Thị Phương",
            phone: "0933887766",
            email: "phuongbui@gmail.com",
            address: "28 Phan Chu Trinh, Huế",
          },
          items: [
            { id: 20, product: PRODUCTS[19], quantity: 1, size: "Bộ 3 Nồi + 1 Quánh + 1 Chảo", color: "Bạc Inox Gương" },
          ],
          totalAmount: 2490000,
          status: "Thành công",
          paymentMethod: "card",
          isArchived: false,
        },
        {
          orderId: "HL-55290",
          createdAt: "07/09/2026",
          customerInfo: {
            fullName: "Phạm Thu Hương",
            phone: "0934567890",
            email: "phamthuhuong@gmail.com",
            address: "12 Hoàng Diệu, Huế",
          },
          items: [
            { id: 15, product: PRODUCTS[14], quantity: 1, size: "Chiều cao 110cm", color: "Bạc Titan" },
          ],
          totalAmount: 2890000,
          status: "Chờ xác nhận",
          paymentMethod: "card",
          isArchived: false,
        },
        {
          orderId: "HL-69014",
          createdAt: "07/09/2026",
          customerInfo: {
            fullName: "Dương Minh Tuấn",
            phone: "0944556677",
            email: "tuan.duong@gmail.com",
            address: "89 Lý Thường Kiệt, Hà Nội",
          },
          items: [
            { id: 11, product: PRODUCTS[10], quantity: 1, size: "Phòng 50-70m²", color: "Trắng Hiện Đại" },
          ],
          totalAmount: 2490000,
          status: "Chờ xác nhận",
          paymentMethod: "cod",
          isArchived: false,
        },
        {
          orderId: "HL-43187",
          createdAt: "06/09/2026",
          customerInfo: {
            fullName: "Hoàng Đức Minh",
            phone: "0967890123",
            email: "hoangducminh@gmail.com",
            address: "200 Bạch Đằng, Hải Phòng",
          },
          items: [
            { id: 6, product: PRODUCTS[5], quantity: 1, size: "Bản Gia Đình Miệng Rộng 85mm", color: "Xám Titan" },
            { id: 22, product: PRODUCTS[21], quantity: 1, size: "Bộ 6 Món Cao Cấp", color: "Thép Bạc Vân Damascus" },
          ],
          totalAmount: 2240000,
          status: "Đang giao",
          paymentMethod: "cod",
          isArchived: false,
        },
        {
          orderId: "HL-38640",
          createdAt: "05/09/2026",
          customerInfo: {
            fullName: "Vũ Thị Lan",
            phone: "0945678901",
            email: "vuthilan@gmail.com",
            address: "56 Đinh Tiên Hoàng, Hà Nội",
          },
          items: [{ id: 12, product: PRODUCTS[11], quantity: 1, size: "Gấp Gọn Du Lịch (Bình 200ml)", color: "Hồng Pastel" }],
          totalAmount: 489000,
          status: "Đã hủy",
          paymentMethod: "cod",
          isArchived: false,
        },
        {
          orderId: "HL-29751",
          createdAt: "04/09/2026",
          customerInfo: {
            fullName: "Đỗ Quốc Bảo",
            phone: "0978901234",
            email: "doquocbao@gmail.com",
            address: "33 Nguyễn Văn Cừ, Cần Thơ",
          },
          items: [
            { id: 21, product: PRODUCTS[20], quantity: 1, size: "Size 28cm Sâu Lòng", color: "Đá Đen Maifan" },
            { id: 23, product: PRODUCTS[22], quantity: 1, size: "Set 5 Hộp (Từ 370ml Đến 1000ml)", color: "Nắp Trong Viền Xanh" },
          ],
          totalAmount: 798000,
          status: "Thành công",
          paymentMethod: "card",
          isArchived: true,
        },
        {
          orderId: "HL-18426",
          createdAt: "03/09/2026",
          customerInfo: {
            fullName: "Nguyễn Thị Bích Ngọc",
            phone: "0956789012",
            email: "nguyenbichngoc@gmail.com",
            address: "88 Lê Duẩn, Đà Nẵng",
          },
          items: [
            { id: 24, product: PRODUCTS[23], quantity: 1, size: "Kích thước 85cm (Bồn Đôi)", color: "Đen Sơn Tĩnh Điện" },
          ],
          totalAmount: 680000,
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

  // --- MONGODB CLOUD REALTIME SYNC & AUTO-MIGRATION ---
  const fetchCloudData = async () => {
    try {
      const timestamp = Date.now();
      const fetchOpts: RequestInit = {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      };

      // 1. Đồng bộ Danh mục từ Cloud
      const catRes = await fetch(`/api/categories?t=${timestamp}`, fetchOpts);
      if (catRes.ok) {
        const catJson = await catRes.json();
        if (catJson.success && Array.isArray(catJson.data) && catJson.data.length > 0) {
          if (isOldClothingList(catJson.data)) {
            // Tự động kích hoạt reset sang đồ gia dụng trên cloud
            await fetch("/api/categories?reset=true", fetchOpts);
            setCategories(CATEGORIES);
          } else {
            setCategories(catJson.data);
            try {
              localStorage.setItem("fashion_categories", JSON.stringify(catJson.data));
            } catch {}
          }
        }
      }

      // 2. Đồng bộ Sản phẩm từ Cloud
      const prodRes = await fetch(`/api/products?t=${timestamp}`, fetchOpts);
      if (prodRes.ok) {
        const prodJson = await prodRes.json();
        if (prodJson.success && Array.isArray(prodJson.data) && prodJson.data.length > 0) {
          if (isOldClothingList(prodJson.data)) {
            // Tự động kích hoạt reset sang đồ gia dụng trên cloud
            await fetch("/api/products?reset=true", fetchOpts);
            setProducts(PRODUCTS);
          } else {
            setProducts(prodJson.data);
            try {
              localStorage.setItem("fashion_products", JSON.stringify(prodJson.data));
            } catch {}
          }
        }
      }

      // 3. Đồng bộ Đơn hàng từ Cloud
      const orderRes = await fetch(`/api/orders?t=${timestamp}`, fetchOpts);
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
    // 1. Tải dữ liệu đám mây lần đầu
    const timer = setTimeout(() => {
      fetchCloudData();
    }, 50);

    // 2. Tự động kiểm tra và đồng bộ thời gian thực từ Cloud mỗi 3 giây
    const interval = setInterval(fetchCloudData, 3000);

    // 3. Đồng bộ tức thì khi tab nhận focus hoặc hiển thị trở lại
    const handleFocus = () => fetchCloudData();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchCloudData();
      }
    };
    const handleOnline = () => fetchCloudData();

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);

    // 4. Lắng nghe BroadcastChannel để đồng bộ tức thì (0ms) giữa các tab cùng trình duyệt
    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        bc = new BroadcastChannel(REALTIME_CHANNEL);
        bc.onmessage = (event) => {
          const { type, payload } = event.data || {};
          if (type === "SYNC_PRODUCTS" && Array.isArray(payload)) {
            setProducts(payload as ProductItem[]);
          } else if (type === "SYNC_CATEGORIES" && Array.isArray(payload)) {
            setCategories(payload as CategoryItem[]);
          } else if (type === "SYNC_ORDERS" && Array.isArray(payload)) {
            setOrders(payload as OrderItem[]);
          } else if (type === "FULL_RESET" && payload) {
            const p = payload as { categories?: CategoryItem[]; products?: ProductItem[] };
            if (p.categories) setCategories(p.categories);
            if (p.products) setProducts(p.products);
          } else if (type === "REFRESH_ALL") {
            fetchCloudData();
          }
        };
      } catch {}
    }

    // 5. Lắng nghe storage event từ các tab khác
    const handleStorage = (e: StorageEvent) => {
      if (!e.key || !e.newValue) return;
      try {
        if (e.key === "fashion_products") {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setProducts(parsed);
        } else if (e.key === "fashion_categories") {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setCategories(parsed);
        } else if (e.key === "fashion_orders") {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setOrders(parsed);
        }
      } catch {}
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("storage", handleStorage);
      if (bc) {
        try {
          bc.close();
        } catch {}
      }
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

  // Reset to Home Appliance Data
  const resetToHomeApplianceData = async () => {
    try {
      await fetch("/api/categories?reset=true", { cache: "no-store" });
      await fetch("/api/products?reset=true", { cache: "no-store" });
    } catch (err) {
      console.error("Cloud reset failed:", err);
    }
    setCategories(CATEGORIES);
    setProducts(PRODUCTS);
    postRealtimeMessage({ type: "FULL_RESET", payload: { categories: CATEGORIES, products: PRODUCTS } });
    try {
      localStorage.setItem("fashion_categories", JSON.stringify(CATEGORIES));
      localStorage.setItem("fashion_products", JSON.stringify(PRODUCTS));
    } catch {}
    showToast("Đã thiết lập lại dữ liệu mẫu Đồ Gia Dụng thành công!", "success");
  };

  // Cart Functions
  const addToCart = (product: ProductItem, quantity = 1, size = "Tiêu chuẩn", color = "Trắng") => {
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

    showToast(`Đã thêm "${product.name}" (${color} - ${size}) vào giỏ hàng!`, "success");
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
      prev.map((item) => {
        if (item.product.id === id && item.size === size && item.color === color) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  // Wishlist Functions
  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Đã xóa khỏi danh sách yêu thích", "info");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Đã thêm vào danh sách yêu thích", "success");
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: number) => wishlist.includes(productId);

  // Quick View Functions
  const openQuickView = (product: ProductItem) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  // Auth Functions
  const login = (email: string) => {
    const role: "Customer" | "Admin" = email.includes("admin") ? "Admin" : "Customer";
    const loggedUser: UserAccount = {
      fullName: email.split("@")[0].toUpperCase(),
      email: email,
      phone: "0987654321",
      role,
    };
    setUser(loggedUser);
    showToast(`Chào mừng ${loggedUser.fullName} đã đăng nhập!`, "success");
    return true;
  };

  const register = (name: string, email: string, phone: string) => {
    const newUser: UserAccount = {
      fullName: name,
      email: email,
      phone: phone,
      role: "Customer",
    };
    setUser(newUser);
    showToast("Đăng ký tài khoản thành công!", "success");
    return true;
  };

  const logout = () => {
    setUser(null);
    showToast("Đã đăng xuất tài khoản", "info");
  };

  const updateProfile = (data: Partial<UserAccount>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    showToast("Cập nhật thông tin tài khoản thành công!", "success");
  };

  // Categories CRUD
  const activeCategories = categories.filter((c) => !c.isArchived && c.isVisible !== false);
  const pinnedCategories = activeCategories.filter((c) => c.isPinned);
  const archivedCategories = categories.filter((c) => c.isArchived);

  const addCategory = async (cat: { name: string; imageUrl: string; description?: string; isPinned?: boolean }) => {
    const highestId = categories.reduce((max, c) => Math.max(max, c.id), 0);
    const newCat: CategoryItem = {
      id: highestId + 1,
      name: cat.name,
      slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
      count: 0,
      imageUrl: cat.imageUrl || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
      isVisible: true,
      isPinned: cat.isPinned ?? true,
      isArchived: false,
      description: cat.description || "",
    };

    const nextCategories = [...categories, newCat];
    setCategories(nextCategories);
    postRealtimeMessage({ type: "SYNC_CATEGORIES", payload: nextCategories });
    showToast(`Đã thêm danh mục "${cat.name}" thành công!`, "success");

    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCat),
      });
    } catch {}
  };

  const updateCategory = async (id: number, cat: Partial<CategoryItem>) => {
    const nextCategories = categories.map((c) => (c.id === id ? { ...c, ...cat } : c));
    setCategories(nextCategories);
    postRealtimeMessage({ type: "SYNC_CATEGORIES", payload: nextCategories });
    showToast("Đã cập nhật danh mục!", "success");

    try {
      await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...cat }),
      });
    } catch {}
  };

  const deleteCategory = async (id: number) => {
    const nextCategories = categories.filter((c) => c.id !== id);
    setCategories(nextCategories);
    postRealtimeMessage({ type: "SYNC_CATEGORIES", payload: nextCategories });
    showToast("Đã xóa vĩnh viễn danh mục!", "info");

    try {
      await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    } catch {}
  };

  const togglePinCategory = async (id: number) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;
    const newPinned = !target.isPinned;
    const nextCategories = categories.map((c) => (c.id === id ? { ...c, isPinned: newPinned } : c));
    setCategories(nextCategories);
    postRealtimeMessage({ type: "SYNC_CATEGORIES", payload: nextCategories });
    showToast(newPinned ? "Đã ghim danh mục lên thanh điều hướng" : "Đã bỏ ghim danh mục", "info");

    try {
      await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPinned: newPinned }),
      });
    } catch {}
  };

  const archiveCategory = async (id: number) => {
    const nextCategories = categories.map((c) => (c.id === id ? { ...c, isArchived: true } : c));
    setCategories(nextCategories);
    postRealtimeMessage({ type: "SYNC_CATEGORIES", payload: nextCategories });
    showToast("Đã chuyển danh mục vào lưu trữ", "info");

    try {
      await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isArchived: true }),
      });
    } catch {}
  };

  const restoreCategory = async (id: number) => {
    const nextCategories = categories.map((c) => (c.id === id ? { ...c, isArchived: false } : c));
    setCategories(nextCategories);
    postRealtimeMessage({ type: "SYNC_CATEGORIES", payload: nextCategories });
    showToast("Đã khôi phục danh mục hoạt động", "success");

    try {
      await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isArchived: false }),
      });
    } catch {}
  };

  // Products CRUD
  const addProduct = async (prod: Omit<ProductItem, "id">) => {
    const highestId = products.reduce((max, p) => Math.max(max, p.id), 0);
    const newProduct: ProductItem = {
      ...prod,
      id: highestId + 1,
      rating: 5.0,
      reviewCount: 0,
      gallery: prod.gallery && prod.gallery.length > 0 ? prod.gallery : [prod.imageUrl],
      colors: prod.colors && prod.colors.length > 0 ? prod.colors : ["Trắng", "Đen"],
      sizes: prod.sizes && prod.sizes.length > 0 ? prod.sizes : ["Tiêu chuẩn"],
    };

    const nextProducts = [newProduct, ...products];
    setProducts(nextProducts);
    postRealtimeMessage({ type: "SYNC_PRODUCTS", payload: nextProducts });
    showToast(`Đã thêm sản phẩm "${prod.name}" thành công!`, "success");

    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
    } catch {}
  };

  const updateProduct = async (id: number, prod: Partial<ProductItem>) => {
    const nextProducts = products.map((p) => (p.id === id ? { ...p, ...prod } : p));
    setProducts(nextProducts);
    postRealtimeMessage({ type: "SYNC_PRODUCTS", payload: nextProducts });
    showToast("Đã cập nhật thông tin sản phẩm!", "success");

    try {
      await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...prod }),
      });
    } catch {}
  };

  const deleteProduct = async (id: number) => {
    const nextProducts = products.filter((p) => p.id !== id);
    setProducts(nextProducts);
    postRealtimeMessage({ type: "SYNC_PRODUCTS", payload: nextProducts });
    showToast("Đã xóa sản phẩm khỏi hệ thống!", "info");

    try {
      await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    } catch {}
  };

  // Orders Management
  const activeOrders = orders.filter((o) => !o.isArchived);
  const archivedOrders = orders.filter((o) => o.isArchived);

  const placeOrder = (customerInfo: OrderItem["customerInfo"], paymentMethod: "cod" | "card"): OrderItem => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const orderId = `HL-${randomCode}`;

    const newOrder: OrderItem = {
      orderId,
      createdAt: formattedDate,
      customerInfo,
      items: [...cart],
      totalAmount: cartTotal >= 500000 || cartTotal === 0 ? cartTotal : cartTotal + 30000,
      status: "Chờ xác nhận",
      paymentMethod,
      isArchived: false,
    };

    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    postRealtimeMessage({ type: "SYNC_ORDERS", payload: nextOrders });
    clearCart();
    showToast(`Đặt hàng thành công! Mã đơn hàng: #${orderId}`, "success");

    // Sync cloud
    try {
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });
    } catch {}

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderItem["status"]) => {
    const nextOrders = orders.map((o) => (o.orderId === orderId ? { ...o, status } : o));
    setOrders(nextOrders);
    postRealtimeMessage({ type: "SYNC_ORDERS", payload: nextOrders });
    showToast(`Đã cập nhật trạng thái đơn hàng #${orderId} thành: ${status}`, "info");

    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
    } catch {}
  };

  const archiveOrder = async (orderId: string) => {
    const nextOrders = orders.map((o) => (o.orderId === orderId ? { ...o, isArchived: true } : o));
    setOrders(nextOrders);
    postRealtimeMessage({ type: "SYNC_ORDERS", payload: nextOrders });
    showToast(`Đã chuyển đơn hàng #${orderId} vào lưu trữ`, "info");

    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, isArchived: true }),
      });
    } catch {}
  };

  const restoreOrder = async (orderId: string) => {
    const nextOrders = orders.map((o) => (o.orderId === orderId ? { ...o, isArchived: false } : o));
    setOrders(nextOrders);
    postRealtimeMessage({ type: "SYNC_ORDERS", payload: nextOrders });
    showToast(`Đã khôi phục đơn hàng #${orderId}`, "success");

    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, isArchived: false }),
      });
    } catch {}
  };

  // Reviews Management
  const addReview = (productId: number, rating: number, content: string, city = "Toàn quốc") => {
    const newRev: ReviewItem = {
      id: `rev_${Date.now()}`,
      productId,
      userId: user?.email || "anonymous",
      userName: user?.fullName || "Khách hàng",
      rating,
      content,
      createdAt: "Vừa xong",
      city,
    };

    setReviews((prev) => [newRev, ...prev]);
    showToast("Cảm ơn bạn đã gửi đánh giá!", "success");
  };

  const getProductReviews = (productId: number) => {
    return reviews.filter((r) => r.productId === productId);
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
        resetToHomeApplianceData,

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

