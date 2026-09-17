"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProductItem, CategoryItem } from "@/data/products";
import { useShop, OrderItem } from "@/context/ShopContext";
import ConfirmModal from "@/components/ConfirmModal";
import ImageUploader from "@/components/ImageUploader";
import {
  BiTachometer,
  BiShoppingBag,
  BiUser,
  BiMoney,
  BiLogOut,
  BiMenu,
  BiX,
  BiPlus,
  BiTrash,
  BiEdit,
  BiSearch,
  BiStore,
  BiHome,
  BiCategory,
  BiSolidBolt,
  BiArchive,
  BiUndo,
  BiPin,
  BiHide,
  BiChevronRight,
  BiPrinter,
  BiPhone,
  BiMapPin,
  BiCreditCard,
  BiBell,
  BiRefresh,
} from "react-icons/bi";

interface CustomerItem {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: "Customer" | "Admin";
  status: "Hoạt động" | "Bị khóa";
  createdAt: string;
}

export default function AdminDashboard() {
  const {
    activeCategories,
    archivedCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    togglePinCategory,
    archiveCategory,
    restoreCategory,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToHomeApplianceData,
    orders,
    activeOrders,
    archivedOrders,
    updateOrderStatus,
    archiveOrder,
    restoreOrder,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "categories" | "orders" | "customers">("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = "HomeLiving Admin - Quản Trị Hệ Thống";
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    }
  }, []);

  const [categorySubTab, setCategorySubTab] = useState<"active" | "archive">("active");
  const [orderSubTab, setOrderSubTab] = useState<"active" | "archive">("active");

  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState<number>(0);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: 1,
    price: 0,
    originalPrice: 0,
    stock: 20,
    imageUrl: "",
    gallery: [] as string[],
    description: "",
    isFlashSale: false,
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    imageUrl: "",
    description: "",
    isPinned: true,
  });

  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderItem | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    targetName?: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [customerList, setCustomerList] = useState<CustomerItem[]>([
    {
      id: 1,
      fullName: "Quản trị viên",
      email: "admin@homeliving.vn",
      phone: "0900000000",
      role: "Admin",
      status: "Hoạt động",
      createdAt: "01/01/2026",
    },
    {
      id: 2,
      fullName: "Nguyễn Minh Trang",
      email: "minhtrang@gmail.com",
      phone: "0912888999",
      role: "Customer",
      status: "Hoạt động",
      createdAt: "15/02/2026",
    },
    {
      id: 3,
      fullName: "Trần Hoàng Nam",
      email: "nam.tran@gmail.com",
      phone: "0987654321",
      role: "Customer",
      status: "Hoạt động",
      createdAt: "20/03/2026",
    },
    {
      id: 4,
      fullName: "Lê Thu Hà",
      email: "thuha.le@yahoo.com",
      phone: "0934123789",
      role: "Customer",
      status: "Bị khóa",
      createdAt: "10/05/2026",
    },
  ]);

  const openAddProductModal = () => {
    setEditingProduct(null);
    const defaultCat = activeCategories[0]?.id || 1;
    setProductForm({
      name: "",
      category: defaultCat,
      price: 250000,
      originalPrice: 350000,
      stock: 50,
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      gallery: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"],
      description: "Chất liệu cao cấp, thoáng mát và co giãn tốt, thiết kế hiện đại sang trọng.",
      isFlashSale: false,
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: ProductItem) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      imageUrl: product.imageUrl,
      gallery: product.gallery && product.gallery.length > 0 ? product.gallery : [product.imageUrl],
      description: product.description,
      isFlashSale: !!product.isFlashSale,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const catObj = activeCategories.find((c) => c.id === Number(productForm.category));
    const categoryName = catObj ? catObj.name : "Gia dụng";
    const safeImage = productForm.imageUrl || productForm.gallery[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80";
    const finalGallery = productForm.gallery && productForm.gallery.length > 0 ? productForm.gallery : [safeImage];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: productForm.name,
        category: Number(productForm.category),
        categoryName,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        stock: Number(productForm.stock),
        imageUrl: safeImage,
        gallery: finalGallery,
        description: productForm.description,
        isFlashSale: productForm.isFlashSale,
      });
    } else {
      addProduct({
        name: productForm.name,
        category: Number(productForm.category),
        categoryName,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        stock: Number(productForm.stock),
        rating: 5.0,
        reviewCount: 0,
        imageUrl: safeImage,
        gallery: finalGallery,
        description: productForm.description,
        colors: ["Trắng", "Đen"],
        sizes: ["Tiêu chuẩn", "Cao cấp"],
        isFlashSale: productForm.isFlashSale,
        soldPercentage: 0,
      });
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: number, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Xác Nhận Xóa Sản Phẩm",
      targetName: name,
      message: "Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống không? Dữ liệu sản phẩm sẽ bị xóa hoàn toàn.",
      confirmText: "Xóa sản phẩm",
      onConfirm: () => {
        deleteProduct(id);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=80",
      description: "",
      isPinned: true,
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      imageUrl: cat.imageUrl,
      description: cat.description || "",
      isPinned: cat.isPinned,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: categoryForm.name,
        imageUrl: categoryForm.imageUrl,
        description: categoryForm.description,
        isPinned: categoryForm.isPinned,
        isVisible: categoryForm.isPinned,
      });
    } else {
      addCategory({
        name: categoryForm.name,
        imageUrl: categoryForm.imageUrl,
        description: categoryForm.description,
        isPinned: categoryForm.isPinned,
      });
    }
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (id: number, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Xác Nhận Xóa Danh Mục Vĩnh Viễn",
      targetName: name,
      message: "Hành động này sẽ xóa hoàn toàn danh mục khỏi hệ sinh thái website. Bạn có chắc chắn muốn xóa không?",
      confirmText: "Xóa danh mục",
      onConfirm: () => {
        deleteCategory(id);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const toggleCustomerStatus = (id: number) => {
    setCustomerList((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "Hoạt động" ? "Bị khóa" : "Hoạt động" }
          : c
      )
    );
    showToast("Đã thay đổi trạng thái tài khoản khách hàng!", "info");
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = activeOrders.filter((o) => o.status === "Chờ xác nhận").length;
  const deliveringOrders = activeOrders.filter((o) => o.status === "Đang giao").length;

  const filteredProducts = products.filter((p) => {
    const matchCat = productCategoryFilter === 0 || p.category === productCategoryFilter;
    const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase().trim());
    return matchCat && matchSearch;
  });

  const currentOrdersList = orderSubTab === "active" ? activeOrders : archivedOrders;
  const filteredOrders = currentOrdersList.filter((o) => {
    const matchStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    const matchSearch =
      o.orderId.toLowerCase().includes(orderSearch.toLowerCase().trim()) ||
      o.customerInfo.fullName.toLowerCase().includes(orderSearch.toLowerCase().trim()) ||
      o.customerInfo.phone.includes(orderSearch.trim());
    return matchStatus && matchSearch;
  });

  return (
    <div className="relative flex h-screen overflow-hidden bg-slate-100 font-sans">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed z-40 flex h-full flex-col bg-slate-950 text-white shadow-2xl transition-all duration-300 md:relative ${
          isSidebarOpen ? "w-64" : "w-0 md:w-20 -translate-x-full md:translate-x-0 overflow-hidden"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <Link href="/" className="flex items-center gap-2.5 font-black text-lg text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-xl text-white shadow-lg shadow-rose-600/30">
              <BiHome />
            </div>
            {isSidebarOpen && (
              <span className="tracking-tight">
                Home<span className="text-rose-500">Living</span> Admin
              </span>
            )}
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white md:hidden">
            <BiX className="text-2xl" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-3 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition ${
              activeTab === "overview"
                ? "bg-rose-600 font-bold text-white shadow-lg shadow-rose-600/30"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <BiTachometer className="flex-shrink-0 text-xl" />
            {isSidebarOpen && <span>Tổng quan</span>}
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition ${
              activeTab === "products"
                ? "bg-rose-600 font-bold text-white shadow-lg shadow-rose-600/30"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <BiShoppingBag className="flex-shrink-0 text-xl" />
            {isSidebarOpen && (
              <span className="flex flex-1 items-center justify-between">
                <span>Quản lý sản phẩm</span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{products.length}</span>
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition ${
              activeTab === "categories"
                ? "bg-rose-600 font-bold text-white shadow-lg shadow-rose-600/30"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <BiCategory className="flex-shrink-0 text-xl" />
            {isSidebarOpen && (
              <span className="flex flex-1 items-center justify-between">
                <span>Quản lý danh mục</span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{activeCategories.length}</span>
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition ${
              activeTab === "orders"
                ? "bg-rose-600 font-bold text-white shadow-lg shadow-rose-600/30"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <BiMoney className="flex-shrink-0 text-xl" />
            {isSidebarOpen && (
              <span className="flex flex-1 items-center justify-between">
                <span>Đơn hàng</span>
                {pendingOrders > 0 && (
                  <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-black text-slate-950">{pendingOrders} mới</span>
                )}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition ${
              activeTab === "customers"
                ? "bg-rose-600 font-bold text-white shadow-lg shadow-rose-600/30"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <BiUser className="flex-shrink-0 text-xl" />
            {isSidebarOpen && <span>Khách hàng</span>}
          </button>
        </nav>

        <div className="border-t border-slate-800 p-4">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-white">
            <BiLogOut className="text-xl" />
            {isSidebarOpen && <span>Xem website bán hàng</span>}
          </Link>
        </div>
      </aside>

      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <header className="z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100">
              <BiMenu className="text-2xl" />
            </button>
            <h2 className="text-lg font-black text-slate-800">
              {activeTab === "overview" && "Tổng Quan Hoạt Động Cửa Hàng"}
              {activeTab === "products" && "Quản Lý Danh Sách Sản Phẩm"}
              {activeTab === "categories" && "Quản Lý Danh Mục Ngành Hàng"}
              {activeTab === "orders" && "Quản Lý & Xử Lý Đơn Đặt Hàng"}
              {activeTab === "customers" && "Quản Lý Thành Viên & Khách Hàng"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetToHomeApplianceData}
              className="hidden items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 sm:flex"
              title="Khôi phục 24 sản phẩm đồ gia dụng mặc định"
            >
              <BiRefresh className="text-base" /> Đặt lại dữ liệu Gia Dụng
            </button>

            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100"
                title="Thông báo đơn hàng"
              >
                <BiBell className="text-2xl" />
                {activeOrders.filter((o) => o.status === "Chờ xác nhận").length > 0 && (
                  <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[11px] font-black text-white shadow-md animate-pulse">
                    {activeOrders.filter((o) => o.status === "Chờ xác nhận").length}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-slate-200 bg-white py-3 text-slate-800 shadow-2xl sm:w-96">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 pb-2.5">
                    <span className="text-sm font-bold">🔔 Thông Báo Đơn Hàng</span>
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600">
                      {activeOrders.filter((o) => o.status === "Chờ xác nhận").length} mới
                    </span>
                  </div>
                  <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                    {orders.slice(0, 6).map((o) => (
                      <div
                        key={o.orderId}
                        onClick={() => {
                          setActiveTab("orders");
                          setIsNotificationOpen(false);
                        }}
                        className="flex cursor-pointer items-start gap-3 p-3 transition hover:bg-slate-50"
                      >
                        <div className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${o.status === "Chờ xác nhận" ? "animate-pulse bg-amber-500" : "bg-emerald-500"}`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-black text-slate-900">#{o.orderId}</span>
                            <span className="text-slate-400">{o.createdAt}</span>
                          </div>
                          <div className="truncate text-xs text-slate-600">{o.customerInfo.fullName} • {o.totalAmount.toLocaleString("vi-VN")}đ</div>
                          <div className="mt-0.5 text-[11px] font-semibold text-rose-600">{o.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 px-4 pt-2.5 text-center">
                    <button
                      onClick={() => {
                        setActiveTab("orders");
                        setIsNotificationOpen(false);
                      }}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Xem tất cả đơn hàng →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden text-right sm:block">
              <div className="text-xs font-bold text-slate-900">Quản Trị Viên (Admin)</div>
              <div className="text-[11px] text-slate-400">admin@homeliving.vn</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-sm font-black text-white shadow-md shadow-rose-600/30">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl text-blue-600">
                      <BiShoppingBag />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tổng Sản Phẩm</div>
                      <div className="mt-0.5 text-2xl font-black text-slate-900">{products.length}</div>
                      <div className="mt-1 text-[11px] font-semibold text-emerald-600">Đầy đủ mẫu mã</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl text-emerald-600">
                      <BiMoney />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tổng Doanh Thu</div>
                      <div className="mt-0.5 text-2xl font-black text-slate-900">{(totalRevenue || 12450000).toLocaleString("vi-VN")}đ</div>
                      <div className="mt-1 text-[11px] font-semibold text-emerald-600">+18.5% so với tháng trước</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-3xl text-amber-600">
                      <BiMoney />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Đơn Chờ Duyệt</div>
                      <div className="mt-0.5 text-2xl font-black text-amber-600">{pendingOrders}</div>
                      <div className="mt-1 text-[11px] font-semibold text-slate-400">{deliveringOrders} đơn đang giao</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-3xl text-purple-600">
                      <BiUser />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Khách Hàng</div>
                      <div className="mt-0.5 text-2xl font-black text-slate-900">{customerList.length}</div>
                      <div className="mt-1 text-[11px] font-semibold text-emerald-600">100% tài khoản thật</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-12">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Biểu Đồ Doanh Thu 6 Tháng Gần Nhất</h3>
                      <p className="text-xs text-slate-400">Doanh thu bán hàng từ hệ thống trực tuyến</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">Năm 2026</span>
                  </div>

                  <div className="flex h-52 items-end justify-between gap-3 border-b border-slate-100 px-4 pt-8">
                    {[
                      { month: "Tháng 4", val: 35, amount: "12M" },
                      { month: "Tháng 5", val: 55, amount: "18M" },
                      { month: "Tháng 6", val: 45, amount: "15M" },
                      { month: "Tháng 7", val: 75, amount: "26M" },
                      { month: "Tháng 8", val: 60, amount: "21M" },
                      { month: "Tháng 9", val: 90, amount: "32M" },
                    ].map((bar, i) => (
                      <div key={i} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                        <div className="text-[10px] font-bold text-slate-400 opacity-0 transition group-hover:opacity-100">{bar.amount}</div>
                        <div className="w-full max-w-[38px] rounded-xl bg-gradient-to-t from-rose-600 to-rose-400 transition-all duration-300 group-hover:brightness-110" style={{ height: `${bar.val}%` }} />
                        <div className="mt-2 text-[11px] font-semibold text-slate-500">{bar.month}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
                  <div>
                    <h3 className="mb-1 text-base font-black text-slate-900">Cảnh Báo Tồn Kho</h3>
                    <p className="mb-4 text-xs text-slate-400">Các sản phẩm cần nhập thêm hàng sớm</p>

                    <div className="space-y-3">
                      {products
                        .filter((p) => p.stock <= 25)
                        .slice(0, 3)
                        .map((p) => (
                          <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-2.5">
                            <img src={p.imageUrl} alt="" className="h-12 w-10 rounded-xl object-cover" />
                            <div className="min-w-0 flex-1">
                              <h4 className="truncate text-xs font-bold text-slate-900">{p.name}</h4>
                              <div className="text-[11px] font-semibold text-rose-600">Chỉ còn {p.stock} sản phẩm</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("products")}
                    className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
                  >
                    Xem tất cả sản phẩm <BiChevronRight className="text-base" />
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900">Đơn Hàng Mới Cần Xử Lý</h3>
                  <button onClick={() => setActiveTab("orders")} className="text-xs font-bold text-rose-600 hover:underline">Xem toàn bộ đơn hàng</button>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {activeOrders.slice(0, 4).map((order) => (
                    <div key={order.orderId} className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-900">#{order.orderId}</span>
                        <span className="font-semibold text-slate-600">{order.customerInfo.fullName}</span>
                        <span className="text-slate-400">({order.createdAt})</span>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="text-base font-extrabold text-rose-600">{order.totalAmount.toLocaleString("vi-VN")}đ</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          order.status === "Thành công"
                            ? "bg-emerald-50 text-emerald-700"
                            : order.status === "Đang giao"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full max-w-xs items-center gap-3">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Tìm theo tên sản phẩm..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-rose-500"
                    />
                    <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(Number(e.target.value))}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-rose-500"
                  >
                    <option value={0}>Tất cả danh mục ({products.length})</option>
                    {activeCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={openAddProductModal}
                    className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition hover:bg-rose-700"
                  >
                    <BiPlus className="text-lg" /> Thêm Sản Phẩm Mới
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 uppercase tracking-wider">
                      <th className="px-4 py-3.5">Ảnh</th>
                      <th className="px-4 py-3.5">Tên Sản Phẩm</th>
                      <th className="px-4 py-3.5">Danh Mục</th>
                      <th className="px-4 py-3.5">Giá Bán</th>
                      <th className="px-4 py-3.5">Kho</th>
                      <th className="px-4 py-3.5">Trạng Thái</th>
                      <th className="px-4 py-3.5 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="transition hover:bg-slate-50/80">
                        <td className="px-4 py-3">
                          <img src={p.imageUrl} alt={p.name} className="h-14 w-11 rounded-xl object-cover bg-slate-100 shadow-sm" />
                        </td>
                        <td className="max-w-xs px-4 py-3">
                          <div className="truncate text-sm font-bold text-slate-900">{p.name}</div>
                          <div className="line-clamp-1 text-[11px] text-slate-400">{p.description}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-bold text-slate-700">{p.categoryName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-extrabold text-rose-600">{p.price.toLocaleString("vi-VN")}đ</div>
                          {p.originalPrice > p.price && (
                            <div className="text-[11px] text-slate-400 line-through">{p.originalPrice.toLocaleString("vi-VN")}đ</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-bold ${p.stock <= 20 ? "text-rose-600" : "text-slate-800"}`}>{p.stock} cái</span>
                        </td>
                        <td className="px-4 py-3">
                          {p.isFlashSale ? (
                            <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700">
                              <BiSolidBolt /> FLASH SALE
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500">Thường</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => openEditProductModal(p)} className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600" title="Chỉnh sửa sản phẩm">
                              <BiEdit className="text-base" />
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id, p.name)} className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-rose-50 hover:text-rose-600" title="Xóa sản phẩm">
                              <BiTrash className="text-base" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Quản Lý Danh Mục Ngành Hàng</h3>
                  <p className="text-xs text-slate-400">Ghim lên web để hiển thị ở menu/trang chủ, hoặc hạ xuống/bỏ vào kho lưu trữ khi tạm ngừng</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl bg-slate-100 p-1 text-xs font-bold">
                    <button
                      onClick={() => setCategorySubTab("active")}
                      className={`rounded-lg px-3 py-1.5 transition ${categorySubTab === "active" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                    >
                      Đang Hoạt Động ({activeCategories.length})
                    </button>
                    <button
                      onClick={() => setCategorySubTab("archive")}
                      className={`rounded-lg px-3 py-1.5 transition ${categorySubTab === "archive" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                    >
                      Kho Lưu Trữ ({archivedCategories.length})
                    </button>
                  </div>

                  <button onClick={openAddCategoryModal} className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition hover:bg-rose-700">
                    <BiPlus className="text-lg" /> Thêm Danh Mục
                  </button>
                </div>
              </div>

              {categorySubTab === "active" && (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {activeCategories.map((cat) => {
                    const productCount = products.filter((p) => p.category === cat.id).length;
                    return (
                      <div key={cat.id} className={`flex flex-col justify-between rounded-2xl border p-4 transition ${cat.isPinned ? "border-slate-200 bg-white shadow-sm hover:shadow-md" : "border-dashed border-slate-300 bg-slate-50/80 opacity-80"}`}>
                        <div>
                          <div className="relative mb-3 aspect-video overflow-hidden rounded-xl bg-slate-100">
                            <img src={cat.imageUrl} alt={cat.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                            <span className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-black shadow ${cat.isPinned ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-200"}`}>
                              {cat.isPinned ? "📌 Đang ghim trên Web" : "⬇️ Đã hạ xuống (Ẩn)"}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900">{cat.name}</h4>
                          <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{cat.description || "Chưa có mô tả"}</p>
                          <div className="mt-1 text-xs font-semibold text-rose-600">{productCount} sản phẩm liên kết</div>
                        </div>

                        <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => togglePinCategory(cat.id)}
                              className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-bold ${cat.isPinned ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
                              title={cat.isPinned ? "Hạ xuống (ẩn khỏi web)" : "Ghim lên web"}
                            >
                              {cat.isPinned ? <><BiHide className="mr-1 inline text-base" /> Hạ xuống</> : <><BiPin className="mr-1 inline text-base" /> Ghim lên</>}
                            </button>

                            <button onClick={() => archiveCategory(cat.id)} className="rounded-lg bg-amber-50 p-1.5 text-amber-800 transition hover:bg-amber-100" title="Bỏ vào kho lưu trữ">
                              <BiArchive className="text-base" />
                            </button>
                            <button onClick={() => openEditCategoryModal(cat)} className="rounded-lg bg-blue-50 p-1.5 text-blue-700 transition hover:bg-blue-100" title="Chỉnh sửa">
                              <BiEdit className="text-base" />
                            </button>
                            <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="rounded-lg bg-rose-50 p-1.5 text-rose-700 transition hover:bg-rose-100" title="Xóa vĩnh viễn">
                              <BiTrash className="text-base" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {categorySubTab === "archive" && (
                <div>
                  {archivedCategories.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                      <BiArchive className="mx-auto mb-2 text-4xl text-slate-400" />
                      <h4 className="text-sm font-bold text-slate-700">Kho lưu trữ đang trống</h4>
                      <p className="text-xs text-slate-400">Chưa có danh mục nào được đưa vào kho lưu trữ.</p>
                    </div>
                  ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                      {archivedCategories.map((cat) => (
                        <div key={cat.id} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div>
                            <div className="relative mb-3 aspect-video overflow-hidden rounded-xl bg-slate-200 grayscale">
                              <img src={cat.imageUrl} alt={cat.name} className="h-full w-full object-cover" />
                              <span className="absolute left-2 top-2 rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-black text-white">📦 Đang trong kho lưu trữ</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-700">{cat.name}</h4>
                            <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{cat.description}</p>
                          </div>

                          <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-3">
                            <button onClick={() => restoreCategory(cat.id)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700 shadow">
                              <BiUndo className="text-base" /> Lấy ra lại (Khôi phục)
                            </button>
                            <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition hover:text-rose-600" title="Xóa vĩnh viễn">
                              <BiTrash className="text-base" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center rounded-xl bg-slate-100 p-1 text-xs font-bold">
                  <button onClick={() => setOrderSubTab("active")} className={`rounded-lg px-3 py-1.5 transition ${orderSubTab === "active" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>
                    Đơn Hiện Tại ({activeOrders.length})
                  </button>
                  <button onClick={() => setOrderSubTab("archive")} className={`rounded-lg px-3 py-1.5 transition ${orderSubTab === "archive" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>
                    Kho Lưu Trữ Đơn ({archivedOrders.length})
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative max-w-xs w-full">
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Tìm mã đơn, tên, sđt..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-rose-500"
                    />
                    <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-rose-500"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Thành công">Thành công</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 uppercase tracking-wider">
                      <th className="px-4 py-3.5">Mã Đơn</th>
                      <th className="px-4 py-3.5">Khách Hàng</th>
                      <th className="px-4 py-3.5">Điện Thoại</th>
                      <th className="px-4 py-3.5">Tổng Tiền</th>
                      <th className="px-4 py-3.5">Phương Thức</th>
                      <th className="px-4 py-3.5">Trạng Thái</th>
                      <th className="px-4 py-3.5 text-right">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">Không có đơn hàng nào phù hợp với bộ lọc hiện tại.</td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.orderId} className="transition hover:bg-slate-50/80">
                          <td className="px-4 py-3 font-mono text-sm font-bold text-slate-900">#{order.orderId}</td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">{order.customerInfo.fullName}</div>
                            <div className="max-w-xs truncate text-[11px] text-slate-400">{order.customerInfo.address}</div>
                          </td>
                          <td className="px-4 py-3">{order.customerInfo.phone}</td>
                          <td className="px-4 py-3 text-sm font-extrabold text-rose-600">{order.totalAmount.toLocaleString("vi-VN")}đ</td>
                          <td className="px-4 py-3"><span className="text-[11px] font-semibold text-slate-600">{order.paymentMethod === "cod" ? "Tiền mặt (COD)" : "Thẻ / QR"}</span></td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                              order.status === "Thành công"
                                ? "bg-emerald-50 text-emerald-700"
                                : order.status === "Đang giao"
                                ? "bg-blue-50 text-blue-700"
                                : order.status === "Đã hủy"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-amber-50 text-amber-700"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button onClick={() => setSelectedOrderDetails(order)} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-bold text-slate-800 transition hover:bg-slate-200" title="Xem hóa đơn">Chi tiết</button>

                              {orderSubTab === "active" ? (
                                <>
                                  {order.status === "Chờ xác nhận" && (
                                    <button onClick={() => updateOrderStatus(order.orderId, "Đang giao")} className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 transition hover:bg-blue-100">Giao hàng</button>
                                  )}
                                  {order.status === "Đang giao" && (
                                    <button onClick={() => updateOrderStatus(order.orderId, "Thành công")} className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-100">Hoàn tất</button>
                                  )}
                                  {order.status !== "Đã hủy" && order.status !== "Thành công" && (
                                    <button onClick={() => updateOrderStatus(order.orderId, "Đã hủy")} className="rounded-lg bg-rose-50 px-2 py-1.5 text-[11px] font-bold text-rose-700 transition hover:bg-rose-100">Hủy</button>
                                  )}
                                  <button onClick={() => archiveOrder(order.orderId)} className="rounded-lg bg-amber-50 px-2 py-1.5 text-[11px] font-bold text-amber-800 transition hover:bg-amber-100" title="Gỡ xuống & Bỏ vào kho lưu trữ">Lưu trữ</button>
                                </>
                              ) : (
                                <button onClick={() => restoreOrder(order.orderId)} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white shadow transition hover:bg-emerald-700">
                                  <BiUndo className="text-sm" /> Lấy ra lại
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "customers" && (
            <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Danh Sách Khách Hàng</h3>
                  <p className="text-xs text-slate-400">Quản lý tài khoản người dùng đăng ký trên hệ thống</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 uppercase tracking-wider">
                      <th className="px-4 py-3.5">Họ Tên</th>
                      <th className="px-4 py-3.5">Email</th>
                      <th className="px-4 py-3.5">Số Điện Thoại</th>
                      <th className="px-4 py-3.5">Vai Trò</th>
                      <th className="px-4 py-3.5">Ngày Tạo</th>
                      <th className="px-4 py-3.5">Trạng Thái</th>
                      <th className="px-4 py-3.5 text-right">Khóa / Mở</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {customerList.map((c) => (
                      <tr key={c.id} className="transition hover:bg-slate-50/80">
                        <td className="px-4 py-3 font-bold text-slate-900">{c.fullName}</td>
                        <td className="px-4 py-3">{c.email}</td>
                        <td className="px-4 py-3">{c.phone}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${c.role === "Admin" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"}`}>
                            {c.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">{c.createdAt}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${c.status === "Hoạt động" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {c.role !== "Admin" && (
                            <button
                              onClick={() => toggleCustomerStatus(c.id)}
                              className={`rounded-lg px-3 py-1 text-[11px] font-bold transition ${c.status === "Hoạt động" ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}
                            >
                              {c.status === "Hoạt động" ? "Khóa" : "Mở khóa"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="relative w-full max-w-xl rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl md:p-8"
            >
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-lg font-bold text-rose-600"><BiShoppingBag /></div>
                  <h3 className="text-lg font-black text-slate-900">{editingProduct ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}</h3>
                </div>
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200" title="Đóng">
                  <BiX className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="mb-1 block font-bold uppercase text-slate-700">Tên Sản Phẩm *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-bold uppercase text-slate-700">Danh Mục *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-rose-500 focus:bg-white"
                    >
                      {activeCategories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-bold uppercase text-slate-700">Số Lượng Kho *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-rose-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-bold uppercase text-slate-700">Giá Bán (VNĐ) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-rose-600 outline-none focus:border-rose-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-bold uppercase text-slate-700">Giá Gốc Chưa Giảm</label>
                    <input
                      type="number"
                      min={0}
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-rose-500 focus:bg-white"
                    />
                  </div>
                </div>

                <ImageUploader
                  label="Ảnh sản phẩm"
                  value={productForm.imageUrl}
                  onChange={(value) => setProductForm((prev) => ({ ...prev, imageUrl: value, gallery: prev.gallery.length > 0 ? prev.gallery : [value] }))}
                  onGalleryChange={(images) => setProductForm((prev) => ({ ...prev, gallery: images, imageUrl: prev.imageUrl || images[0] || "" }))}
                  gallery={productForm.gallery}
                  multiple
                  required
                />

                <div>
                  <label className="mb-1 block font-bold uppercase text-slate-700">Mô Tả Sản Phẩm</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="flashSaleCheck"
                    type="checkbox"
                    checked={productForm.isFlashSale}
                    onChange={(e) => setProductForm({ ...productForm, isFlashSale: e.target.checked })}
                    className="h-4 w-4 rounded text-rose-600"
                  />
                  <label htmlFor="flashSaleCheck" className="cursor-pointer text-xs font-semibold text-slate-700">
                    Đưa vào danh sách Flash Sale (Có đồng hồ đếm ngược trên trang chủ)
                  </label>
                </div>

                <div className="flex gap-3 border-t border-slate-100 pt-4">
                  <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-200">Hủy</button>
                  <button type="submit" className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition hover:bg-rose-700">{editingProduct ? "Lưu Thay Đổi" : "Tạo Sản Phẩm"}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="relative w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl md:p-8"
            >
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-lg font-bold text-rose-600"><BiCategory /></div>
                  <h3 className="text-lg font-black text-slate-900">{editingCategory ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}</h3>
                </div>
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200" title="Đóng">
                  <BiX className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                <div>
                  <label className="mb-1 block font-bold uppercase text-slate-700">Tên Danh Mục *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <ImageUploader
                  label="Ảnh bìa danh mục"
                  value={categoryForm.imageUrl}
                  onChange={(value) => setCategoryForm((prev) => ({ ...prev, imageUrl: value }))}
                  required
                />

                <div>
                  <label className="mb-1 block font-bold uppercase text-slate-700">Mô Tả Danh Mục</label>
                  <input
                    type="text"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Mô tả ngắn gọn về ngành hàng này"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="pinCategoryCheck"
                    type="checkbox"
                    checked={categoryForm.isPinned}
                    onChange={(e) => setCategoryForm({ ...categoryForm, isPinned: e.target.checked })}
                    className="h-4 w-4 rounded text-rose-600"
                  />
                  <label htmlFor="pinCategoryCheck" className="cursor-pointer text-xs font-semibold text-slate-700">
                    Ghim hiển thị trên giao diện web (Menu & Trang chủ)
                  </label>
                </div>

                <div className="flex gap-3 border-t border-slate-100 pt-4">
                  <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-200">Hủy</button>
                  <button type="submit" className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition hover:bg-rose-700">{editingCategory ? "Lưu Thay Đổi" : "Tạo Danh Mục"}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="relative w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl md:p-8"
            >
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">Đơn Hàng #{selectedOrderDetails.orderId}</h3>
                    <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">{selectedOrderDetails.status}</span>
                  </div>
                  <span className="text-xs text-slate-400">Ngày đặt: {selectedOrderDetails.createdAt}</span>
                </div>
                <button type="button" onClick={() => setSelectedOrderDetails(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200" title="Đóng">
                  <BiX className="text-xl" />
                </button>
              </div>

              <div className="mb-5 space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs">
                <div className="flex items-center gap-2 text-slate-700"><BiUser className="text-sm text-rose-500" /><span><strong>Người nhận:</strong> {selectedOrderDetails.customerInfo.fullName}</span></div>
                <div className="flex items-center gap-2 text-slate-700"><BiPhone className="text-sm text-rose-500" /><span><strong>Điện thoại:</strong> {selectedOrderDetails.customerInfo.phone}</span></div>
                <div className="flex items-center gap-2 text-slate-700"><BiMapPin className="text-sm text-rose-500" /><span><strong>Địa chỉ:</strong> {selectedOrderDetails.customerInfo.address}</span></div>
                <div className="flex items-center gap-2 text-slate-700"><BiCreditCard className="text-sm text-rose-500" /><span><strong>Hình thức:</strong> {selectedOrderDetails.paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản VNPay"}</span></div>
                {selectedOrderDetails.customerInfo.note && (
                  <div className="border-t border-slate-200/60 pt-1 text-slate-500"><strong>Ghi chú:</strong> {selectedOrderDetails.customerInfo.note}</div>
                )}
              </div>

              <h4 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">Danh sách sản phẩm ({selectedOrderDetails.items.length})</h4>
              <div className="mb-5 divide-y divide-slate-100">
                {selectedOrderDetails.items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-3">
                    <img src={it.product.imageUrl} alt="" className="h-14 w-12 rounded-xl border border-slate-100 bg-slate-100 object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold text-slate-900">{it.product.name}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">Phân loại: <span className="font-semibold text-slate-700">{it.color}</span>, Size <span className="font-semibold text-slate-700">{it.size}</span> x {it.quantity}</div>
                    </div>
                    <div className="shrink-0 text-xs font-bold text-rose-600">{(it.product.price * it.quantity).toLocaleString("vi-VN")}đ</div>
                  </div>
                ))}
              </div>

              <div className="mb-6 space-y-1.5 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600">
                <div className="flex items-center justify-between text-slate-900">
                  <span className="text-sm font-bold">Tổng thanh toán:</span>
                  <span className="text-xl font-black text-rose-600">{selectedOrderDetails.totalAmount.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => window.print()} className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-4 py-3 text-xs font-bold text-slate-800 transition hover:bg-slate-200">
                  <BiPrinter className="text-base" /> In hóa đơn
                </button>
                <button type="button" onClick={() => setSelectedOrderDetails(null)} className="rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white transition hover:bg-slate-800">Đóng</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        targetName={confirmModal.targetName}
        confirmText={confirmModal.confirmText}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
