"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BiArchive,
  BiBell,
  BiCategory,
  BiChevronRight,
  BiEdit,
  BiHome,
  BiMenu,
  BiMoney,
  BiPin,
  BiPlus,
  BiRefresh,
  BiSearch,
  BiShoppingBag,
  BiSolidBolt,
  BiTachometer,
  BiTrash,
  BiUndo,
  BiUser,
  BiX,
} from "react-icons/bi";
import ImageUploader from "@/components/ImageUploader";
import { CategoryItem, ProductItem } from "@/data/products";
import { useShop } from "@/context/ShopContext";

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

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "categories" | "orders">("overview");
  const [categorySubTab, setCategorySubTab] = useState<"active" | "archive">("active");
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState<number>(0);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: 1,
    price: 250000,
    originalPrice: 350000,
    stock: 20,
    imageUrl: "",
    description: "",
    isFlashSale: false,
    gallery: [] as string[],
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    imageUrl: "",
    description: "",
    isPinned: true,
  });

  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + order.totalAmount, 0), [orders]);
  const pendingOrders = activeOrders.filter((order) => order.status === "Chờ xác nhận").length;
  const deliveringOrders = activeOrders.filter((order) => order.status === "Đang giao").length;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = productCategoryFilter === 0 || product.category === productCategoryFilter;
      const searchMatch = product.name.toLowerCase().includes(productSearch.trim().toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [products, productCategoryFilter, productSearch]);

  const openAddProductModal = () => {
    setEditingProduct(null);
    const defaultCat = activeCategories[0]?.id || 1;
    setProductForm({
      name: "",
      category: defaultCat,
      price: 250000,
      originalPrice: 350000,
      stock: 20,
      imageUrl: "",
      description: "",
      isFlashSale: false,
      gallery: [],
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
      gallery: product.gallery || [],
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (event: React.FormEvent) => {
    event.preventDefault();
    const categoryName = activeCategories.find((category) => category.id === Number(productForm.category))?.name || "Gia dụng";
    const safeImage = productForm.imageUrl || productForm.gallery[0] || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80";
    const payload = {
      name: productForm.name,
      category: Number(productForm.category),
      categoryName,
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice),
      stock: Number(productForm.stock),
      imageUrl: safeImage,
      gallery: productForm.gallery.length > 0 ? productForm.gallery : [safeImage],
      description: productForm.description,
      isFlashSale: productForm.isFlashSale,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct({
        ...payload,
        rating: 5,
        reviewCount: 0,
        colors: ["Trắng", "Đen"],
        sizes: ["Tiêu chuẩn"],
        soldPercentage: 0,
      });
    }

    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) {
      deleteProduct(id);
    }
  };

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      imageUrl: "",
      description: "",
      isPinned: true,
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category: CategoryItem) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      imageUrl: category.imageUrl,
      description: category.description || "",
      isPinned: category.isPinned,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      name: categoryForm.name,
      imageUrl: categoryForm.imageUrl,
      description: categoryForm.description,
      isPinned: categoryForm.isPinned,
      isVisible: categoryForm.isPinned,
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, payload);
    } else {
      addCategory(payload);
    }
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}" vĩnh viễn?`)) {
      deleteCategory(id);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-slate-950 text-white transition-all`}>
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-700">
              <BiHome className="text-lg" />
            </div>
            {isSidebarOpen && <div className="font-black">HomeLiving</div>}
          </div>
          <button onClick={() => setSidebarOpen((prev) => !prev)} className="rounded-lg p-2 hover:bg-slate-800">
            <BiMenu className="text-xl" />
          </button>
        </div>

        <nav className="space-y-2 p-3">
          {[
            { key: "overview", label: "Tổng quan", icon: BiTachometer },
            { key: "products", label: "Sản phẩm", icon: BiShoppingBag },
            { key: "categories", label: "Danh mục", icon: BiCategory },
            { key: "orders", label: "Đơn hàng", icon: BiMoney },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${
                activeTab === key ? "bg-rose-600 text-white" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon className="text-xl" />
              {isSidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="text-lg font-black text-slate-900">
            {activeTab === "overview" && "Tổng Quan Hoạt Động"}
            {activeTab === "products" && "Quản Lý Sản Phẩm"}
            {activeTab === "categories" && "Quản Lý Danh Mục"}
            {activeTab === "orders" && "Quản Lý Đơn Hàng"}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={resetToHomeApplianceData} className="hidden items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 sm:flex">
              <BiRefresh className="text-base" /> Đặt lại dữ liệu
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-sm font-black text-white">AD</div>
          </div>
        </header>

        <main className="h-[calc(100vh-64px)] overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {[{ label: "Tổng sản phẩm", value: products.length, tone: "blue" }, { label: "Doanh thu", value: `${totalRevenue.toLocaleString("vi-VN")}đ`, tone: "emerald" }, { label: "Đơn chờ duyệt", value: pendingOrders, tone: "amber" }, { label: "Đang giao", value: deliveringOrders, tone: "purple" }].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.label}</div>
                        <div className="mt-2 text-2xl font-black text-slate-900">{item.value}</div>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone === "blue" ? "bg-blue-50 text-blue-600" : item.tone === "emerald" ? "bg-emerald-50 text-emerald-600" : item.tone === "amber" ? "bg-amber-50 text-amber-600" : "bg-purple-50 text-purple-600"}`}>
                        <BiShoppingBag className="text-2xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Đơn hàng mới</h3>
                    <p className="text-xs text-slate-400">Theo dõi trạng thái xử lý đơn hàng</p>
                  </div>
                  <button onClick={() => setActiveTab("orders")} className="text-xs font-bold text-rose-600">Xem tất cả →</button>
                </div>
                <div className="space-y-3">
                  {activeOrders.slice(0, 5).map((order) => (
                    <div key={order.orderId} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                      <div>
                        <div className="font-black text-slate-900">#{order.orderId}</div>
                        <div className="text-xs text-slate-500">{order.customerInfo.fullName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-rose-600">{order.totalAmount.toLocaleString("vi-VN")}đ</div>
                        <div className="text-[11px] font-bold text-amber-600">{order.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-xs">
                  <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder="Tìm theo tên sản phẩm" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-rose-500" />
                </div>
                <div className="flex items-center gap-3">
                  <select value={productCategoryFilter} onChange={(event) => setProductCategoryFilter(Number(event.target.value))} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                    <option value={0}>Tất cả danh mục</option>
                    {activeCategories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  <button onClick={openAddProductModal} className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white">
                    <BiPlus className="text-base" /> Thêm sản phẩm
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Ảnh</th>
                      <th className="px-4 py-3">Tên sản phẩm</th>
                      <th className="px-4 py-3">Danh mục</th>
                      <th className="px-4 py-3">Giá</th>
                      <th className="px-4 py-3">Tồn kho</th>
                      <th className="px-4 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <img src={product.imageUrl} alt={product.name} className="h-12 w-12 rounded-xl object-cover" />
                        </td>
                        <td className="px-4 py-3"><div className="font-bold text-slate-900">{product.name}</div></td>
                        <td className="px-4 py-3"><span className="rounded-lg bg-slate-100 px-2 py-1 font-semibold">{product.categoryName}</span></td>
                        <td className="px-4 py-3 font-black text-rose-600">{product.price.toLocaleString("vi-VN")}đ</td>
                        <td className="px-4 py-3 font-bold text-slate-700">{product.stock}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openEditProductModal(product)} className="rounded-lg bg-blue-50 p-2 text-blue-600"><BiEdit /></button>
                            <button onClick={() => handleDeleteProduct(product.id, product.name)} className="rounded-lg bg-rose-50 p-2 text-rose-600"><BiTrash /></button>
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
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
                  <button onClick={() => setCategorySubTab("active")} className={`rounded-lg px-3 py-2 text-xs font-bold ${categorySubTab === "active" ? "bg-white text-slate-900" : "text-slate-500"}`}>Đang hoạt động</button>
                  <button onClick={() => setCategorySubTab("archive")} className={`rounded-lg px-3 py-2 text-xs font-bold ${categorySubTab === "archive" ? "bg-white text-slate-900" : "text-slate-500"}`}>Lưu trữ</button>
                </div>
                <button onClick={openAddCategoryModal} className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white">
                  <BiPlus className="text-base" /> Thêm danh mục
                </button>
              </div>

              {categorySubTab === "active" ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {activeCategories.map((category) => (
                    <div key={category.id} className="rounded-2xl border border-slate-200 p-3">
                      <img src={category.imageUrl} alt={category.name} className="h-28 w-full rounded-xl object-cover" />
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div>
                          <div className="font-black text-slate-900">{category.name}</div>
                          <div className="text-[11px] text-slate-500">{category.description || "Chưa có mô tả"}</div>
                        </div>
                        {category.isPinned && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">Ghim</span>}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => togglePinCategory(category.id)} className="flex-1 rounded-lg bg-slate-100 px-2 py-2 text-[10px] font-bold text-slate-700"><BiPin className="inline" /> {category.isPinned ? "Bỏ ghim" : "Ghim"}</button>
                        <button onClick={() => openEditCategoryModal(category)} className="rounded-lg bg-blue-50 px-2 py-2 text-blue-700"><BiEdit /></button>
                        <button onClick={() => archiveCategory(category.id)} className="rounded-lg bg-amber-50 px-2 py-2 text-amber-700"><BiArchive /></button>
                        <button onClick={() => handleDeleteCategory(category.id, category.name)} className="rounded-lg bg-rose-50 px-2 py-2 text-rose-700"><BiTrash /></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {archivedCategories.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">Chưa có danh mục nào trong kho lưu trữ.</div>
                  ) : (
                    archivedCategories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3">
                        <div className="flex items-center gap-3">
                          <img src={category.imageUrl} alt={category.name} className="h-12 w-12 rounded-xl object-cover" />
                          <div>
                            <div className="font-bold text-slate-900">{category.name}</div>
                            <div className="text-[11px] text-slate-500">Đã lưu trữ</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => restoreCategory(category.id)} className="rounded-lg bg-emerald-50 px-3 py-2 text-[10px] font-bold text-emerald-700"><BiUndo className="inline" /> Khôi phục</button>
                          <button onClick={() => handleDeleteCategory(category.id, category.name)} className="rounded-lg bg-rose-50 px-3 py-2 text-[10px] font-bold text-rose-700"><BiTrash className="inline" /> Xóa</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Đơn hàng</h3>
                <div className="flex gap-2 rounded-xl bg-slate-100 p-1 text-xs font-bold">
                  <button onClick={() => setActiveTab("orders")} className="rounded-lg bg-white px-3 py-2 text-slate-900">Hiện tại</button>
                </div>
              </div>
              <div className="space-y-3">
                {activeOrders.map((order) => (
                  <div key={order.orderId} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-black text-slate-900">#{order.orderId}</div>
                      <div className="text-xs text-slate-500">{order.customerInfo.fullName} • {order.customerInfo.phone}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-black text-rose-600">{order.totalAmount.toLocaleString("vi-VN")}đ</div>
                      <div className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">{order.status}</div>
                    </div>
                    <div className="flex gap-2">
                      {order.status === "Chờ xác nhận" && <button onClick={() => updateOrderStatus(order.orderId, "Đang giao")} className="rounded-lg bg-blue-50 px-3 py-2 text-[10px] font-bold text-blue-700">Giao hàng</button>}
                      {order.status === "Đang giao" && <button onClick={() => updateOrderStatus(order.orderId, "Thành công")} className="rounded-lg bg-emerald-50 px-3 py-2 text-[10px] font-bold text-emerald-700">Hoàn tất</button>}
                      <button onClick={() => archiveOrder(order.orderId)} className="rounded-lg bg-amber-50 px-3 py-2 text-[10px] font-bold text-amber-700">Lưu trữ</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {isProductModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
            <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }} className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">{editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
                <button onClick={() => setIsProductModalOpen(false)} className="rounded-full bg-slate-100 p-2 text-slate-600"><BiX /></button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">Tên sản phẩm *</label>
                  <input value={productForm.name} onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))} required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-rose-500" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-slate-700">Danh mục *</label>
                    <select value={productForm.category} onChange={(event) => setProductForm((prev) => ({ ...prev, category: Number(event.target.value) }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-rose-500">
                      {activeCategories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-slate-700">Số lượng kho *</label>
                    <input type="number" min={0} value={productForm.stock} onChange={(event) => setProductForm((prev) => ({ ...prev, stock: Number(event.target.value) }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-rose-500" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-slate-700">Giá bán *</label>
                    <input type="number" min={0} value={productForm.price} onChange={(event) => setProductForm((prev) => ({ ...prev, price: Number(event.target.value) }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-rose-500" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-slate-700">Giá gốc</label>
                    <input type="number" min={0} value={productForm.originalPrice} onChange={(event) => setProductForm((prev) => ({ ...prev, originalPrice: Number(event.target.value) }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-rose-500" />
                  </div>
                </div>

                <ImageUploader
                  label="Ảnh sản phẩm"
                  value={productForm.imageUrl}
                  onChange={(value) => setProductForm((prev) => ({ ...prev, imageUrl: value }))}
                  required
                />

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">Mô tả</label>
                  <textarea value={productForm.description} onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-rose-500" />
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input type="checkbox" checked={productForm.isFlashSale} onChange={(event) => setProductForm((prev) => ({ ...prev, isFlashSale: event.target.checked }))} />
                  Đưa vào Flash Sale
                </label>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-xs font-bold text-slate-700">Hủy</button>
                  <button type="submit" className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-xs font-bold text-white">{editingProduct ? "Lưu thay đổi" : "Tạo sản phẩm"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCategoryModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
            <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">{editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="rounded-full bg-slate-100 p-2 text-slate-600"><BiX /></button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">Tên danh mục *</label>
                  <input value={categoryForm.name} onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.target.value }))} required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-rose-500" />
                </div>

                <ImageUploader
                  label="Ảnh bìa danh mục"
                  value={categoryForm.imageUrl}
                  onChange={(value) => setCategoryForm((prev) => ({ ...prev, imageUrl: value }))}
                  required
                />

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">Mô tả</label>
                  <input value={categoryForm.description} onChange={(event) => setCategoryForm((prev) => ({ ...prev, description: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-rose-500" />
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input type="checkbox" checked={categoryForm.isPinned} onChange={(event) => setCategoryForm((prev) => ({ ...prev, isPinned: event.target.checked }))} />
                  Ghim danh mục lên trang chủ
                </label>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-xs font-bold text-slate-700">Hủy</button>
                  <button type="submit" className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-xs font-bold text-white">{editingCategory ? "Lưu thay đổi" : "Tạo danh mục"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
