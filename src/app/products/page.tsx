"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import {
  BiFilterAlt,
  BiGrid,
  BiListUl,
  BiSearch,
  BiStar,
  BiShoppingBag,
  BiHeart,
  BiSolidHeart,
  BiShow,
  BiX,
  BiRefresh,
  BiSlider,
  BiGift
} from "react-icons/bi";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart, openQuickView, isWishlisted, toggleWishlist, showToast, pinnedCategories, products } = useShop();

  // Read URL parameters
  const initialCategory = Number(searchParams.get("cat")) || 0;
  const initialSearch = searchParams.get("search") || searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState<number>(initialCategory);
  const [selectedPrice, setSelectedPrice] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("created_desc");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const allProducts = products && products.length > 0 ? products : PRODUCTS;
  const allCategories = pinnedCategories && pinnedCategories.length > 0 ? pinnedCategories : CATEGORIES;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Category filter
    if (selectedCategory > 0) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Price range filter
    if (selectedPrice === "under500") {
      result = result.filter((p) => p.price < 500000);
    } else if (selectedPrice === "500to1500") {
      result = result.filter((p) => p.price >= 500000 && p.price <= 1500000);
    } else if (selectedPrice === "above1500") {
      result = result.filter((p) => p.price > 1500000);
    }

    // Sorting
    if (selectedSort === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (selectedSort === "name_asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: newest / id desc
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [allProducts, selectedCategory, searchQuery, selectedPrice, selectedSort]);

  const handleCategorySelect = (catId: number) => {
    setSelectedCategory(catId);
    if (catId === 0) {
      router.push("/products");
    } else {
      router.push(`/products?cat=${catId}`);
    }
  };

  const resetFilters = () => {
    setSelectedCategory(0);
    setSelectedPrice("all");
    setSelectedSort("created_desc");
    setSearchQuery("");
    router.push("/products");
  };

  const copyVoucher = () => {
    navigator.clipboard.writeText("GIADUNG10");
    showToast("Đã sao chép mã voucher GIADUNG10!", "success");
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs md:text-sm text-slate-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-rose-600 transition">
          Trang chủ
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">Danh sách sản phẩm</span>
        {selectedCategory > 0 && (
          <>
            <span>/</span>
            <span className="text-rose-600 font-bold">
              {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
            </span>
          </>
        )}
      </nav>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block lg:w-1/4 space-y-6 flex-shrink-0">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <BiSlider className="text-rose-600 text-xl" /> Bộ lọc sản phẩm
              </h3>
              {(selectedCategory > 0 || selectedPrice !== "all" || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <BiRefresh /> Đặt lại
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                Danh Mục
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <button
                    onClick={() => handleCategorySelect(0)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition flex items-center justify-between ${
                      selectedCategory === 0
                        ? "bg-rose-50 text-rose-600 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>Tất cả danh mục</span>
                    <span className="text-xs text-slate-400">{allProducts.length}</span>
                  </button>
                </li>
                {allCategories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? "bg-rose-50 text-rose-600 font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-slate-400">
                        {allProducts.filter((p) => p.category === cat.id).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="mb-6 pt-5 border-t border-slate-100">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                Khoảng Giá
              </h4>
              <div className="space-y-2 text-sm text-slate-700">
                {[
                  { value: "all", label: "Tất cả mức giá" },
                  { value: "under500", label: "Dưới 500.000đ" },
                  { value: "500to1500", label: "500.000đ - 1.500.000đ" },
                  { value: "above1500", label: "Trên 1.500.000đ" },
                ].map((item) => (
                  <label key={item.value} className="flex items-center gap-2.5 cursor-pointer py-0.5">
                    <input
                      type="radio"
                      name="price"
                      value={item.value}
                      checked={selectedPrice === item.value}
                      onChange={() => setSelectedPrice(item.value)}
                      className="text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                    />
                    <span className={selectedPrice === item.value ? "font-bold text-rose-600" : ""}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Keyword Search */}
            <div className="pt-5 border-t border-slate-100">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                Tìm Theo Tên
              </h4>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nồi chiên, bếp từ, robot..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3 pr-8 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <BiX />
                  </button>
                ) : (
                  <BiSearch className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                )}
              </div>
            </div>
          </div>

          {/* Banner Promo in Sidebar */}
          <div className="rounded-3xl p-6 text-white text-center bg-gradient-to-br from-slate-900 to-rose-950 shadow-lg border border-slate-800">
            <BiGift className="text-3xl text-amber-400 mx-auto mb-2" />
            <h5 className="font-black text-sm mb-1">Mã Giảm Giá 10%</h5>
            <p className="text-xs text-slate-300 mb-3">
              Nhập <strong className="text-amber-300">GIADUNG10</strong> khi thanh toán để giảm ngay 10%!
            </p>
            <button
              onClick={copyVoucher}
              className="w-full py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition"
            >
              Sao Chép Mã
            </button>
          </div>
        </aside>

        {/* Products Display Area */}
        <div className="flex-1 min-w-0">
          
          {/* Top Control Bar */}
          <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                {selectedCategory > 0
                  ? CATEGORIES.find((c) => c.id === selectedCategory)?.name
                  : "Tất Cả Sản Phẩm"}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Hiển thị <strong className="text-slate-800">{filteredProducts.length}</strong> sản phẩm phù hợp
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              
              {/* Mobile Filter Drawer Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
              >
                <BiFilterAlt className="text-rose-600 text-base" /> Bộ lọc
                {(selectedCategory > 0 || selectedPrice !== "all" || searchQuery) && (
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                )}
              </button>

              {/* Sort Dropdown */}
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500 transition"
              >
                <option value="created_desc">Mới nhất</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
                <option value="name_asc">Tên: A - Z</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === "grid" ? "bg-white text-rose-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                  title="Dạng lưới"
                >
                  <BiGrid className="text-lg" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === "list" ? "bg-white text-rose-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                  title="Dạng danh sách"
                >
                  <BiListUl className="text-lg" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Tags */}
          {(selectedCategory > 0 || selectedPrice !== "all" || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
              <span className="text-slate-400 font-semibold">Đang lọc theo:</span>
              {selectedCategory > 0 && (
                <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 font-bold px-3 py-1 rounded-full border border-rose-200">
                  {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                  <button onClick={() => handleCategorySelect(0)}>
                    <BiX className="text-base" />
                  </button>
                </span>
              )}
              {selectedPrice !== "all" && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 font-bold px-3 py-1 rounded-full">
                  {selectedPrice === "under200"
                    ? "< 200.000đ"
                    : selectedPrice === "200to500"
                    ? "200.000đ - 500.000đ"
                    : "> 500.000đ"}
                  <button onClick={() => setSelectedPrice("all")}>
                    <BiX className="text-base" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 font-bold px-3 py-1 rounded-full">
                  Từ khóa: &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery("")}>
                    <BiX className="text-base" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-rose-600 font-bold hover:underline ml-2"
              >
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm my-4">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-3xl text-slate-400 mx-auto mb-4">
                <BiSearch />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Không tìm thấy sản phẩm nào!
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                Không có sản phẩm nào phù hợp với bộ lọc bạn đã chọn. Vui lòng thử tìm kiếm bằng từ khóa khác hoặc đặt lại bộ lọc.
              </p>
              <button
                onClick={resetFilters}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition shadow"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          ) : (
            /* Products Grid / List */
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
                  : "grid-cols-1 gap-4"
              }`}
            >
              {filteredProducts.map((product) => {
                const discountPercent = Math.round(
                  ((product.originalPrice - product.price) / product.originalPrice) * 100
                );

                if (viewMode === "list") {
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-5"
                    >
                      <Link
                        href={`/products/${product.id}`}
                        className="w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative group"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        {discountPercent > 0 && (
                          <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            -{discountPercent}%
                          </span>
                        )}
                      </Link>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-xs uppercase font-bold text-rose-600 mb-1">
                            {product.categoryName}
                          </div>
                          <h3 className="font-bold text-slate-900 text-base mb-2 hover:text-rose-600 transition">
                            <Link href={`/products/${product.id}`}>{product.name}</Link>
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-1 text-amber-400 text-xs">
                            <BiStar />
                            <span className="font-bold text-slate-700">{product.rating}</span>
                            <span className="text-slate-400">({product.reviewCount} đánh giá)</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-extrabold text-rose-600">
                              {product.price.toLocaleString("vi-VN")}đ
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              {product.originalPrice.toLocaleString("vi-VN")}đ
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleWishlist(product.id)}
                              className={`p-2.5 rounded-xl border transition ${
                                isWishlisted(product.id)
                                  ? "bg-rose-50 border-rose-200 text-rose-600"
                                  : "border-slate-200 text-slate-500 hover:text-rose-600"
                              }`}
                              title="Yêu thích"
                            >
                              {isWishlisted(product.id) ? <BiSolidHeart /> : <BiHeart />}
                            </button>
                            <button
                              onClick={() => openQuickView(product)}
                              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 transition"
                              title="Xem nhanh"
                            >
                              <BiShow className="text-lg" />
                            </button>
                            <button
                              onClick={() => addToCart(product, 1, product.sizes[0], product.colors[0])}
                              className="px-5 py-2.5 bg-slate-900 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow"
                            >
                              <BiShoppingBag className="text-base" /> Thêm vào giỏ
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Grid View
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                      <Link href={`/products/${product.id}`} className="block w-full h-full">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {discountPercent > 0 && (
                        <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                          -{discountPercent}%
                        </span>
                      )}

                      <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center shadow transition ${
                            isWishlisted(product.id)
                              ? "bg-rose-500 text-white"
                              : "bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600"
                          }`}
                          title="Yêu thích"
                        >
                          {isWishlisted(product.id) ? <BiSolidHeart /> : <BiHeart />}
                        </button>
                        <button
                          onClick={() => openQuickView(product)}
                          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 flex items-center justify-center shadow transition"
                          title="Xem nhanh"
                        >
                          <BiShow className="text-base" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase mb-1">
                        {product.categoryName}
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm mb-2 line-clamp-2 hover:text-rose-600 transition leading-snug">
                        <Link href={`/products/${product.id}`}>{product.name}</Link>
                      </h3>

                      <div className="flex items-center gap-1 text-amber-400 text-xs mb-3">
                        <BiStar />
                        <span className="font-bold text-slate-700">{product.rating}</span>
                        <span className="text-slate-400">({product.reviewCount})</span>
                      </div>

                      <div className="mt-auto pt-2 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-base font-extrabold text-rose-600">
                          {product.price.toLocaleString("vi-VN")}đ
                        </span>
                        <button
                          onClick={() => addToCart(product, 1, product.sizes[0], product.colors[0])}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 transition"
                          title="Thêm vào giỏ"
                        >
                          <BiShoppingBag className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-4/5 max-w-xs bg-white h-full z-10 p-6 flex flex-col overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <BiFilterAlt className="text-rose-600" /> Bộ lọc
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
                >
                  <BiX className="text-xl" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                  Danh Mục
                </h4>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => {
                        handleCategorySelect(0);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold ${
                        selectedCategory === 0 ? "bg-rose-50 text-rose-600 font-bold" : "text-slate-700"
                      }`}
                    >
                      Tất cả danh mục ({allProducts.length})
                    </button>
                  </li>
                  {allCategories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => {
                          handleCategorySelect(cat.id);
                          setIsMobileFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold ${
                          selectedCategory === cat.id ? "bg-rose-50 text-rose-600 font-bold" : "text-slate-700"
                        }`}
                      >
                        {cat.name} ({allProducts.filter((p) => p.category === cat.id).length})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price */}
              <div className="mb-6 pt-5 border-t border-slate-100">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                  Khoảng Giá
                </h4>
                <div className="space-y-2 text-sm text-slate-700">
                  {[
                    { value: "all", label: "Tất cả mức giá" },
                    { value: "under500", label: "Dưới 500.000đ" },
                    { value: "500to1500", label: "500.000đ - 1.500.000đ" },
                    { value: "above1500", label: "Trên 1.500.000đ" },
                  ].map((item) => (
                    <label key={item.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mobile-price"
                        value={item.value}
                        checked={selectedPrice === item.value}
                        onChange={() => {
                          setSelectedPrice(item.value);
                          setIsMobileFilterOpen(false);
                        }}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset button */}
              <div className="mt-auto pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    resetFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-sm"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductsPageWrapper() {
  const searchParams = useSearchParams();
  return <ProductsContent key={searchParams.toString()} />;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center text-slate-500 font-bold">Đang tải danh sách sản phẩm...</div>}>
      <ProductsPageWrapper />
    </Suspense>
  );
}


