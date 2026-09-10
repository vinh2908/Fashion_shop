"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProductItem, CategoryItem } from "@/data/products";
import { useShop, OrderItem } from "@/context/ShopContext";
import ConfirmModal from "@/components/ConfirmModal";
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
    // Categories
    activeCategories,
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
    updateOrderStatus,
    archiveOrder,
    restoreOrder,

    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "categories" | "orders" | "customers">("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Sub-tabs
  const [categorySubTab, setCategorySubTab] = useState<"active" | "archive">("active");
  const [orderSubTab, setOrderSubTab] = useState<"active" | "archive">("active");

  // --- STATE FOR PRODUCTS ---
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState<number>(0);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: 1,
    price: 0,
    originalPrice: 0,
    stock: 20,
    imageUrl: "",
    description: "",
    isFlashSale: false,
  });

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    imageUrl: "",
    description: "",
    isPinned: true,
  });

  // --- STATE FOR ORDERS ---
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderItem | null>(null);

  // Confirm Modal State
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

  // --- STATE FOR CUSTOMERS ---
  const [customerList, setCustomerList] = useState<CustomerItem[]>([
    {
      id: 1,
      fullName: "Quản trị viên",
      email: "admin@clothingshop.vn",
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

  // --- PRODUCT MODAL ACTIONS ---
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
      description: product.description,
      isFlashSale: !!product.isFlashSale,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const catObj = activeCategories.find((c) => c.id === Number(productForm.category));
    const categoryName = catObj ? catObj.name : "Thời trang";

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: productForm.name,
        category: Number(productForm.category),
        categoryName,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        stock: Number(productForm.stock),
        imageUrl: productForm.imageUrl,
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
        imageUrl: productForm.imageUrl,
        gallery: [productForm.imageUrl],
        description: productForm.description,
        colors: ["Trắng", "Đen"],
        sizes: ["S", "M", "L"],
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

  // --- CATEGORY MODAL ACTIONS ---
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
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

  // --- CUSTOMER ACTIONS ---
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

  // Computed Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = activeOrders.filter((o) => o.status === "Chờ xác nhận").length;
  const deliveringOrders = activeOrders.filter((o) => o.status === "Đang giao").length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchCat = productCategoryFilter === 0 || p.category === productCategoryFilter;
    const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase().trim());
    return matchCat && matchSearch;
  });

  // Filtered Orders
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
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside
        className={`bg-slate-950 text-white flex flex-col fixed md:relative h-full z-40 transition-all duration-300 shadow-2xl ${
          isSidebarOpen ? "w-64" : "w-0 md:w-20 -translate-x-full md:translate-x-0 overflow-hidden"
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2.5 font-black text-lg text-white">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white text-xl shadow-lg shadow-rose-600/30">
              <BiStore />
            </div>
            {isSidebarOpen && (
              <span className="tracking-tight">
                Fashion<span className="text-rose-500">Admin</span>
              </span>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <BiX className="text-2xl" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto text-sm font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition text-left ${
              activeTab === "overview"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-bold"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <BiTachometer className="text-xl flex-shrink-0" />
            {isSidebarOpen && <span>Tổng quan</span>}
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition text-left ${
              activeTab === "products"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-bold"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <BiShoppingBag className="text-xl flex-shrink-0" />
            {isSidebarOpen && (
              <span className="flex-1 flex justify-between items-center">
                <span>Quản lý sản phẩm</span>
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                  {products.length}
                </span>
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition text-left ${
              activeTab === "categories"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-bold"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <BiCategory className="text-xl flex-shrink-0" />
            {isSidebarOpen && (
              <span className="flex-1 flex justify-between items-center">
                <span>Quản lý danh mục</span>
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                  {activeCategories.length}
                </span>
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition text-left ${
              activeTab === "orders"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-bold"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <BiMoney className="text-xl flex-shrink-0" />
            {isSidebarOpen && (
              <span className="flex-1 flex justify-between items-center">
                <span>Đơn hàng</span>
                {pendingOrders > 0 && (
                  <span className="text-xs bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                    {pendingOrders} mới
                  </span>
                )}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition text-left ${
              activeTab === "customers"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-bold"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <BiUser className="text-xl flex-shrink-0" />
            {isSidebarOpen && <span>Khách hàng</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition text-sm font-semibold"
          >
            <BiLogOut className="text-xl" />
            {isSidebarOpen && <span>Xem website bán hàng</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 z-30 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            >
              <BiMenu className="text-2xl" />
            </button>
            <h2 className="font-black text-slate-800 text-lg">
              {activeTab === "overview" && "Tổng Quan Hoạt Động Cửa Hàng"}
              {activeTab === "products" && "Quản Lý Danh Sách Sản Phẩm"}
              {activeTab === "categories" && "Quản Lý Danh Mục Ngành Hàng"}
              {activeTab === "orders" && "Quản Lý & Xử Lý Đơn Đặt Hàng"}
              {activeTab === "customers" && "Quản Lý Thành Viên & Khách Hàng"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900">Quản Trị Viên (Admin)</div>
              <div className="text-[11px] text-slate-400">admin@clothingshop.vn</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-rose-600/30">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable Main Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          
          {/* ===================== TAB 1: OVERVIEW ===================== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl flex-shrink-0">
                    <BiShoppingBag />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Sản Phẩm</div>
                    <div className="text-2xl font-black text-slate-900 mt-0.5">{products.length}</div>
                    <div className="text-[11px] text-emerald-600 font-semibold mt-1">Đầy đủ mẫu mã</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl flex-shrink-0">
                    <BiMoney />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Doanh Thu</div>
                    <div className="text-2xl font-black text-slate-900 mt-0.5">
                      {(totalRevenue || 12450000).toLocaleString("vi-VN")}đ
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold mt-1">+18.5% so với tháng trước</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl flex-shrink-0">
                    <BiMoney />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đơn Chờ Duyệt</div>
                    <div className="text-2xl font-black text-amber-600 mt-0.5">{pendingOrders}</div>
                    <div className="text-[11px] text-slate-400 font-semibold mt-1">{deliveringOrders} đơn đang giao</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-3xl flex-shrink-0">
                    <BiUser />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Khách Hàng</div>
                    <div className="text-2xl font-black text-slate-900 mt-0.5">{customerList.length}</div>
                    <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% tài khoản thật</div>
                  </div>
                </div>
              </div>

              {/* Revenue Chart Visual & Top Items */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Revenue Bar Chart */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-black text-base text-slate-900">Biểu Đồ Doanh Thu 6 Tháng Gần Nhất</h3>
                      <p className="text-xs text-slate-400">Doanh thu bán hàng từ hệ thống trực tuyến</p>
                    </div>
                    <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">Năm 2026</span>
                  </div>

                  <div className="flex items-end justify-between gap-3 h-52 pt-8 px-4 border-b border-slate-100">
                    {[
                      { month: "Tháng 4", val: 35, amount: "12M" },
                      { month: "Tháng 5", val: 55, amount: "18M" },
                      { month: "Tháng 6", val: 45, amount: "15M" },
                      { month: "Tháng 7", val: 75, amount: "26M" },
                      { month: "Tháng 8", val: 60, amount: "21M" },
                      { month: "Tháng 9", val: 90, amount: "32M" },
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition">
                          {bar.amount}
                        </div>
                        <div
                          className="w-full max-w-[38px] bg-gradient-to-t from-rose-600 to-rose-400 rounded-xl group-hover:brightness-110 transition-all duration-300"
                          style={{ height: `${bar.val}%` }}
                        />
                        <div className="text-[11px] font-semibold text-slate-500 mt-2">{bar.month}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions & Low Stock */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-base text-slate-900 mb-1">Cảnh Báo Tồn Kho</h3>
                    <p className="text-xs text-slate-400 mb-4">Các sản phẩm cần nhập thêm hàng sớm</p>

                    <div className="space-y-3">
                      {products
                        .filter((p) => p.stock <= 25)
                        .slice(0, 3)
                        .map((p) => (
                          <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                            <img src={p.imageUrl} alt="" className="w-10 h-12 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-xs text-slate-900 truncate">{p.name}</h4>
                              <div className="text-[11px] text-rose-600 font-semibold">Chỉ còn {p.stock} sản phẩm</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("products")}
                    className="w-full mt-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    Xem tất cả sản phẩm <BiChevronRight className="text-base" />
                  </button>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-base text-slate-900">Đơn Hàng Mới Cần Xử Lý</h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Xem toàn bộ đơn hàng
                  </button>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {activeOrders.slice(0, 4).map((order) => (
                    <div key={order.orderId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-900">#{order.orderId}</span>
                        <span className="text-slate-600 font-semibold">{order.customerInfo.fullName}</span>
                        <span className="text-slate-400">({order.createdAt})</span>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="font-extrabold text-rose-600">{order.totalAmount.toLocaleString("vi-VN")}đ</span>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
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

          {/* ===================== TAB 2: PRODUCTS MANAGEMENT ===================== */}
          {activeTab === "products" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
              
              {/* Actions Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  {/* Search */}
                  <div className="relative max-w-xs w-full">
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Tìm theo tên sản phẩm..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                    />
                    <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-rose-500"
                  >
                    <option value={0}>Tất cả danh mục ({products.length})</option>
                    {activeCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add Product Button */}
                <button
                  onClick={openAddProductModal}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition transform hover:-translate-y-0.5"
                >
                  <BiPlus className="text-lg" /> Thêm Sản Phẩm Mới
                </button>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-black tracking-wider">
                      <th className="py-3.5 px-4">Ảnh</th>
                      <th className="py-3.5 px-4">Tên Sản Phẩm</th>
                      <th className="py-3.5 px-4">Danh Mục</th>
                      <th className="py-3.5 px-4">Giá Bán</th>
                      <th className="py-3.5 px-4">Kho</th>
                      <th className="py-3.5 px-4">Trạng Thái</th>
                      <th className="py-3.5 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <img src={p.imageUrl} alt="" className="w-11 h-14 rounded-xl object-cover bg-slate-100 shadow-sm" />
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-bold text-slate-900 text-sm truncate">{p.name}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{p.description}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg">
                            {p.categoryName}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-rose-600 text-sm">
                            {p.price.toLocaleString("vi-VN")}đ
                          </div>
                          {p.originalPrice > p.price && (
                            <div className="text-[11px] text-slate-400 line-through">
                              {p.originalPrice.toLocaleString("vi-VN")}đ
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-bold ${p.stock <= 20 ? "text-rose-600" : "text-slate-800"}`}>
                            {p.stock} cái
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {p.isFlashSale ? (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-black text-[10px] px-2 py-0.5 rounded-md border border-amber-200">
                              <BiSolidBolt /> FLASH SALE
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Thường</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          <button
                            onClick={() => openEditProductModal(p)}
                            className="p-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-slate-600 transition"
                            title="Chỉnh sửa sản phẩm"
                          >
                            <BiEdit className="text-base" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-slate-600 transition"
                            title="Xóa sản phẩm"
                          >
                            <BiTrash className="text-base" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== TAB 3: CATEGORIES MANAGEMENT (WITH PINNING & ARCHIVE) ===================== */}
          {activeTab === "categories" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
              
              {/* Header with Sub-tabs & Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-lg text-slate-900">Quản Lý Danh Mục Ngành Hàng</h3>
                  <p className="text-xs text-slate-400">
                    Ghim lên web để hiển thị ở menu/trang chủ, hoặc hạ xuống/bỏ vào kho lưu trữ khi tạm ngừng
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sub-tab Switcher */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setCategorySubTab("active")}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        categorySubTab === "active" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Đang Hoạt Động ({activeCategories.length})
                    </button>
                    <button
                      onClick={() => setCategorySubTab("archive")}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        categorySubTab === "archive" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Kho Lưu Trữ ({archivedCategories.length})
                    </button>
                  </div>

                  <button
                    onClick={openAddCategoryModal}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition"
                  >
                    <BiPlus className="text-lg" /> Thêm Danh Mục
                  </button>
                </div>
              </div>

              {/* ACTIVE CATEGORIES LIST */}
              {categorySubTab === "active" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {activeCategories.map((cat) => {
                    const productCount = products.filter((p) => p.category === cat.id).length;

                    return (
                      <div
                        key={cat.id}
                        className={`rounded-2xl p-4 border flex flex-col justify-between group transition ${
                          cat.isPinned
                            ? "bg-white border-slate-200 shadow-sm hover:shadow-md"
                            : "bg-slate-50/80 border-dashed border-slate-300 opacity-80"
                        }`}
                      >
                        <div>
                          {/* Image & Status Badge */}
                          <div className="aspect-video rounded-xl overflow-hidden mb-3 bg-slate-100 relative">
                            <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                            
                            {/* Pin / Hidden Badge */}
                            <span className={`absolute top-2 left-2 text-[10px] font-black px-2.5 py-1 rounded-full shadow ${
                              cat.isPinned
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-800 text-slate-200"
                            }`}>
                              {cat.isPinned ? "📌 Đang ghim trên Web" : "⬇️ Đã hạ xuống (Ẩn)"}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-slate-900">{cat.name}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{cat.description || "Chưa có mô tả"}</p>
                          <div className="text-xs text-rose-600 font-semibold mt-1">{productCount} sản phẩm liên kết</div>
                        </div>

                        {/* Actions Toolbar */}
                        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                          <div className="flex items-center gap-1.5">
                            {/* Toggle Pin / Unpin Button */}
                            <button
                              onClick={() => togglePinCategory(cat.id)}
                              className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition ${
                                cat.isPinned
                                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                              }`}
                              title={cat.isPinned ? "Hạ xuống (ẩn khỏi web)" : "Ghim lên web"}
                            >
                              {cat.isPinned ? (
                                <>
                                  <BiHide className="text-base" /> Hạ xuống
                                </>
                              ) : (
                                <>
                                  <BiPin className="text-base" /> Ghim lên
                                </>
                              )}
                            </button>

                            {/* Archive Button */}
                            <button
                              onClick={() => archiveCategory(cat.id)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition"
                              title="Bỏ vào kho lưu trữ"
                            >
                              <BiArchive className="text-base" />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => openEditCategoryModal(cat)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                              title="Chỉnh sửa"
                            >
                              <BiEdit className="text-base" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                              title="Xóa vĩnh viễn"
                            >
                              <BiTrash className="text-base" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ARCHIVED CATEGORIES LIST */}
              {categorySubTab === "archive" && (
                <div>
                  {archivedCategories.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
                      <BiArchive className="text-4xl text-slate-400 mx-auto mb-2" />
                      <h4 className="font-bold text-sm text-slate-700">Kho lưu trữ đang trống</h4>
                      <p className="text-xs text-slate-400">Chưa có danh mục nào được đưa vào kho lưu trữ.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {archivedCategories.map((cat) => (
                        <div
                          key={cat.id}
                          className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between"
                        >
                          <div>
                            <div className="aspect-video rounded-xl overflow-hidden mb-3 bg-slate-200 relative grayscale">
                              <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                              <span className="absolute top-2 left-2 bg-slate-800 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                                📦 Đang trong kho lưu trữ
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-700">{cat.name}</h4>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{cat.description}</p>
                          </div>

                          <div className="flex items-center gap-2 pt-3 border-t border-slate-200 mt-4">
                            <button
                              onClick={() => restoreCategory(cat.id)}
                              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 shadow"
                            >
                              <BiUndo className="text-base" /> Lấy ra lại (Khôi phục)
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-rose-600 transition"
                              title="Xóa vĩnh viễn"
                            >
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

          {/* ===================== TAB 4: ORDERS MANAGEMENT (WITH ARCHIVE) ===================== */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
              
              {/* Header with Sub-tabs, Search & Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Sub-tab: Active / Archived Orders */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setOrderSubTab("active")}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      orderSubTab === "active" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Đơn Hiện Tại ({activeOrders.length})
                  </button>
                  <button
                    onClick={() => setOrderSubTab("archive")}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      orderSubTab === "archive" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Kho Lưu Trữ Đơn ({archivedOrders.length})
                  </button>
                </div>

                {/* Search & Status Filter */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative max-w-xs w-full">
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Tìm mã đơn, tên, sđt..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                    />
                    <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-rose-500"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Thành công">Thành công</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-black tracking-wider">
                      <th className="py-3.5 px-4">Mã Đơn</th>
                      <th className="py-3.5 px-4">Khách Hàng</th>
                      <th className="py-3.5 px-4">Điện Thoại</th>
                      <th className="py-3.5 px-4">Tổng Tiền</th>
                      <th className="py-3.5 px-4">Phương Thức</th>
                      <th className="py-3.5 px-4">Trạng Thái</th>
                      <th className="py-3.5 px-4 text-right">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          Không có đơn hàng nào phù hợp với bộ lọc hiện tại.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.orderId} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                            #{order.orderId}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{order.customerInfo.fullName}</div>
                            <div className="text-[11px] text-slate-400 truncate max-w-xs">{order.customerInfo.address}</div>
                          </td>
                          <td className="py-3 px-4">{order.customerInfo.phone}</td>
                          <td className="py-3 px-4 font-extrabold text-rose-600 text-sm">
                            {order.totalAmount.toLocaleString("vi-VN")}đ
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-slate-600 text-[11px] font-semibold">
                              {order.paymentMethod === "cod" ? "Tiền mặt (COD)" : "Thẻ / QR"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
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
                          <td className="py-3 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => setSelectedOrderDetails(order)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] transition"
                              title="Xem hóa đơn"
                            >
                              Chi tiết
                            </button>

                            {orderSubTab === "active" ? (
                              <>
                                {order.status === "Chờ xác nhận" && (
                                  <button
                                    onClick={() => updateOrderStatus(order.orderId, "Đang giao")}
                                    className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-[11px] transition"
                                  >
                                    Giao hàng
                                  </button>
                                )}
                                {order.status === "Đang giao" && (
                                  <button
                                    onClick={() => updateOrderStatus(order.orderId, "Thành công")}
                                    className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-[11px] transition"
                                  >
                                    Hoàn tất
                                  </button>
                                )}
                                {order.status !== "Đã hủy" && order.status !== "Thành công" && (
                                  <button
                                    onClick={() => updateOrderStatus(order.orderId, "Đã hủy")}
                                    className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold text-[11px] transition"
                                  >
                                    Hủy
                                  </button>
                                )}

                                {/* Archive Button for Completed/Cancelled Orders */}
                                <button
                                  onClick={() => archiveOrder(order.orderId)}
                                  className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-bold text-[11px] transition"
                                  title="Gỡ xuống & Bỏ vào kho lưu trữ"
                                >
                                  Lưu trữ
                                </button>
                              </>
                            ) : (
                              /* Restore Button from Archive */
                              <button
                                onClick={() => restoreOrder(order.orderId)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition inline-flex items-center gap-1 shadow"
                              >
                                <BiUndo className="text-sm" /> Lấy ra lại
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== TAB 5: CUSTOMERS MANAGEMENT ===================== */}
          {activeTab === "customers" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-lg text-slate-900">Danh Sách Khách Hàng</h3>
                  <p className="text-xs text-slate-400">Quản lý tài khoản người dùng đăng ký trên hệ thống</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-black tracking-wider">
                      <th className="py-3.5 px-4">Họ Tên</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Số Điện Thoại</th>
                      <th className="py-3.5 px-4">Vai Trò</th>
                      <th className="py-3.5 px-4">Ngày Tạo</th>
                      <th className="py-3.5 px-4">Trạng Thái</th>
                      <th className="py-3.5 px-4 text-right">Khóa / Mở</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {customerList.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">{c.fullName}</td>
                        <td className="py-3 px-4">{c.email}</td>
                        <td className="py-3 px-4">{c.phone}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                            c.role === "Admin" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"
                          }`}>
                            {c.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{c.createdAt}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                            c.status === "Hoạt động" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {c.role !== "Admin" && (
                            <button
                              onClick={() => toggleCustomerStatus(c.id)}
                              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                                c.status === "Hoạt động"
                                  ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                              }`}
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

      {/* ===================== MODAL: PRODUCT FORM (ADD/EDIT) ===================== */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 md:p-8 max-h-[92vh] overflow-y-auto z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg font-bold">
                    <BiShoppingBag />
                  </div>
                  <h3 className="font-black text-lg text-slate-900">
                    {editingProduct ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
                  title="Đóng"
                >
                  <BiX className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tên Sản Phẩm *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Ví dụ: Áo Sơ Mi Nam Oxford"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500 focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Danh Mục *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500 font-semibold focus:bg-white transition"
                    >
                      {activeCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Số Lượng Kho *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Giá Bán (VNĐ) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500 font-bold text-rose-600 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Giá Gốc Chưa Giảm</label>
                    <input
                      type="number"
                      min={0}
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Link Ảnh Sản Phẩm (URL) *</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="url"
                      required
                      value={productForm.imageUrl}
                      onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500 focus:bg-white transition"
                    />
                    {productForm.imageUrl && (
                      <div className="w-11 h-11 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                          src={productForm.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Mô Tả Sản Phẩm</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500 focus:bg-white transition"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="flashSaleCheck"
                    type="checkbox"
                    checked={productForm.isFlashSale}
                    onChange={(e) => setProductForm({ ...productForm, isFlashSale: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded cursor-pointer"
                  />
                  <label htmlFor="flashSaleCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Đưa vào danh sách Flash Sale (Có đồng hồ đếm ngược trên trang chủ)
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 transition"
                  >
                    {editingProduct ? "Lưu Thay Đổi" : "Tạo Sản Phẩm"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================== MODAL: CATEGORY FORM (ADD/EDIT) ===================== */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 md:p-8 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg font-bold">
                    <BiCategory />
                  </div>
                  <h3 className="font-black text-lg text-slate-900">
                    {editingCategory ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
                  title="Đóng"
                >
                  <BiX className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tên Danh Mục *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="Ví dụ: Giày & Dép"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Link Ảnh Bìa (URL) *</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="url"
                      required
                      value={categoryForm.imageUrl}
                      onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500 focus:bg-white transition"
                    />
                    {categoryForm.imageUrl && (
                      <div className="w-11 h-11 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                          src={categoryForm.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Mô Tả Danh Mục</label>
                  <input
                    type="text"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Mô tả ngắn gọn về ngành hàng này"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500 focus:bg-white transition"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="pinCategoryCheck"
                    type="checkbox"
                    checked={categoryForm.isPinned}
                    onChange={(e) => setCategoryForm({ ...categoryForm, isPinned: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded cursor-pointer"
                  />
                  <label htmlFor="pinCategoryCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Ghim hiển thị trên giao diện web (Menu & Trang chủ)
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 transition"
                  >
                    {editingCategory ? "Lưu Thay Đổi" : "Tạo Danh Mục"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================== MODAL: ORDER DETAILS (INVOICE STYLE) ===================== */}
      <AnimatePresence>
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderDetails(null)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg text-slate-900">
                      Đơn Hàng #{selectedOrderDetails.orderId}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-rose-50 text-rose-700 border-rose-200">
                      {selectedOrderDetails.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Ngày đặt: {selectedOrderDetails.createdAt}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrderDetails(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
                  title="Đóng"
                >
                  <BiX className="text-xl" />
                </button>
              </div>

              {/* Recipient info */}
              <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2 mb-5 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700">
                  <BiUser className="text-rose-500 flex-shrink-0 text-sm" />
                  <span><strong>Người nhận:</strong> {selectedOrderDetails.customerInfo.fullName}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <BiPhone className="text-rose-500 flex-shrink-0 text-sm" />
                  <span><strong>Điện thoại:</strong> {selectedOrderDetails.customerInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <BiMapPin className="text-rose-500 flex-shrink-0 text-sm" />
                  <span><strong>Địa chỉ:</strong> {selectedOrderDetails.customerInfo.address}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <BiCreditCard className="text-rose-500 flex-shrink-0 text-sm" />
                  <span>
                    <strong>Hình thức:</strong>{" "}
                    {selectedOrderDetails.paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản VNPay"}
                  </span>
                </div>
                {selectedOrderDetails.customerInfo.note && (
                  <div className="text-slate-500 pt-1 border-t border-slate-200/60">
                    <strong>Ghi chú:</strong> {selectedOrderDetails.customerInfo.note}
                  </div>
                )}
              </div>

              {/* Items list */}
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2.5">
                Danh sách sản phẩm ({selectedOrderDetails.items.length})
              </h4>
              <div className="divide-y divide-slate-100 mb-5">
                {selectedOrderDetails.items.map((it, idx) => (
                  <div key={idx} className="py-3 flex items-center gap-3">
                    <img
                      src={it.product.imageUrl}
                      alt=""
                      className="w-12 h-14 rounded-xl object-cover bg-slate-100 border border-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate">{it.product.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Phân loại: <span className="text-slate-700 font-semibold">{it.color}</span>, Size <span className="text-slate-700 font-semibold">{it.size}</span> x {it.quantity}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-rose-600 flex-shrink-0">
                      {(it.product.price * it.quantity).toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5 text-xs text-slate-600 mb-6">
                <div className="flex justify-between items-center text-slate-900">
                  <span className="font-bold text-sm">Tổng thanh toán:</span>
                  <span className="text-xl font-black text-rose-600">
                    {selectedOrderDetails.totalAmount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  <BiPrinter className="text-base" /> In hóa đơn
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrderDetails(null)}
                  className="py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================== CONFIRM MODAL (REPLACES NATIVE CONFIRM) ===================== */}
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

