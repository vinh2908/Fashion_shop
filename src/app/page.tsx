"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import {
  BiSolidBolt,
  BiStar,
  BiShoppingBag,
  BiHeart,
  BiSolidHeart,
  BiShow,
  BiRightArrowAlt,
  BiCheckShield,
  BiCheckCircle,
  BiHeadphone,
  BiRefresh,
  BiGift,
  BiCheck,
  BiEdit,
  BiX,
  BiGrid,
} from "react-icons/bi";
import { FaTruck } from "react-icons/fa";

export default function Home() {
  const { addToCart, openQuickView, isWishlisted, toggleWishlist, showToast, pinnedCategories, products, user, reviews, addReview } = useShop();

  // Flash Sale Countdown
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 15 });
  const [activeTab, setActiveTab] = useState<"bestseller" | "new">("bestseller");
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  // Store Review / Testimonial State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewCity, setReviewCity] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleStoreReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("Vui lòng đăng nhập để gửi đánh giá!", "error");
      return;
    }
    if (!reviewContent.trim()) {
      showToast("Vui lòng nhập nội dung đánh giá!", "error");
      return;
    }
    addReview(0, reviewRating, reviewContent.trim(), reviewCity.trim() || "Toàn quốc");
    setIsReviewModalOpen(false);
    setReviewContent("");
    setReviewCity("");
    setReviewRating(5);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const copyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(true);
    showToast(`Đã sao chép mã ưu đãi "${code}" vào bộ nhớ tạm!`, "success");
    setTimeout(() => setCopiedVoucher(false), 3000);
  };

  const allProducts = products && products.length > 0 ? products : PRODUCTS;
  const flashSaleProducts = allProducts.filter((p) => p.isFlashSale);
  const bestSellers = allProducts.filter((p) => p.isBestSeller);
  const newArrivals = allProducts.filter((p) => p.isNewArrival);

  const displayTabProducts = activeTab === "bestseller" ? bestSellers : newArrivals;

  return (
    <div className="space-y-10 sm:space-y-16 pb-16 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-10 md:py-24">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Hero Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs sm:text-sm font-bold">
                <BiStar className="text-yellow-400" />
                <span>BỘ SƯU TẬP GIA DỤNG CAO CẤP 2026</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.2]">
                Không Gian Sống & <br />
                <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                  Tiện Nghi Hiện Đại
                </span> <br />
                Cho Mọi Gia Đình
              </h1>

              <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Khám phá hệ sinh thái thiết bị nhà bếp và đồ gia dụng thông minh đỉnh cao. Tối ưu thời gian nội trợ, nâng tầm chất lượng cuộc sống cho tổ ấm của bạn.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  href="/products"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 sm:py-3.5 px-6 sm:px-8 rounded-xl shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  <BiShoppingBag className="text-xl" /> Mua sắm ngay
                </Link>
                <a
                  href="#flashSaleSection"
                  className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold py-3 sm:py-3.5 px-6 sm:px-7 rounded-xl flex items-center justify-center gap-2 transition backdrop-blur-sm text-sm sm:text-base"
                >
                  <BiSolidBolt className="text-yellow-400 text-xl" /> Săn Flash Sale
                </a>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-5 sm:pt-6 border-t border-white/10 max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="text-xl sm:text-3xl font-black text-white">50K+</div>
                  <div className="text-[11px] sm:text-xs text-slate-400">Gia đình tin dùng</div>
                </div>
                <div>
                  <div className="text-xl sm:text-3xl font-black text-white">100+</div>
                  <div className="text-[11px] sm:text-xs text-slate-400">Thiết bị thông minh</div>
                </div>
                <div>
                  <div className="text-xl sm:text-3xl font-black text-amber-400 flex items-center justify-center lg:justify-start gap-1">
                    4.9 <BiStar className="text-amber-400" />
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-400">Đánh giá 5 sao</div>
                </div>
              </div>
            </motion.div>

            {/* Hero Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative mt-4 lg:mt-0"
            >
              <div className="relative mx-auto max-w-md">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80"
                    alt="Home Appliances Collection"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Authentic Badge (responsive bounds to avoid horizontal overflow) */}
                <div className="absolute -bottom-3 left-2 sm:-bottom-6 sm:-left-6 bg-slate-900/95 border border-slate-700/80 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-2.5 sm:gap-3 text-white max-w-[220px] sm:max-w-none">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                    <BiCheckShield />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm">100% Chính Hãng</div>
                    <div className="text-[10px] sm:text-xs text-slate-400">Bảo hành 12 - 24 tháng</div>
                  </div>
                </div>

                {/* Floating Discount Tag */}
                <div className="absolute top-2 right-2 sm:-top-4 sm:-right-4 bg-rose-600 text-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-xl font-black text-center rotate-6">
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider">GIẢM ĐẾN</div>
                  <div className="text-lg sm:text-2xl">50%</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Mobile Quick Category Scroller */}
      <section className="container mx-auto px-4 lg:px-8 md:hidden">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-sm text-slate-900">Danh mục nổi bật</h3>
          <Link href="/products" className="text-xs text-rose-600 font-bold flex items-center gap-0.5">
            Tất cả <BiRightArrowAlt className="text-base" />
          </Link>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          <Link
            href="/products"
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex-shrink-0 min-w-[76px] active:scale-95 transition"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center text-2xl shadow-md shadow-rose-600/30">
              <BiGrid />
            </div>
            <span className="text-[11px] font-bold text-slate-800 text-center truncate max-w-[70px]">Tất cả</span>
          </Link>
          {(pinnedCategories.length > 0 ? pinnedCategories : CATEGORIES).map((cat) => (
            <Link
              key={cat.id}
              href={`/products?cat=${cat.id}`}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex-shrink-0 min-w-[76px] active:scale-95 transition"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative border border-slate-100 shadow-sm">
                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 text-center truncate max-w-[70px]">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust & Service Strip */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                <FaTruck />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">Giao hàng siêu tốc</h4>
                <p className="text-[11px] sm:text-xs text-slate-500">Toàn quốc 1 - 2 ngày</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
                <BiRefresh />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">Đổi trả 30 ngày</h4>
                <p className="text-[11px] sm:text-xs text-slate-500">Miễn phí tận nơi</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
                <BiCheckCircle />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">100% Chính hãng</h4>
                <p className="text-[11px] sm:text-xs text-slate-500">Bảo hành 12 - 24T</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
                <BiHeadphone />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">Hỗ trợ tận tâm</h4>
                <p className="text-[11px] sm:text-xs text-slate-500">Hotline 1900 1234</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Section with Countdown Timer */}
      <section id="flashSaleSection" className="container mx-auto px-4 lg:px-8">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
          
          {/* Header & Countdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-600 flex items-center justify-center text-white text-2xl sm:text-3xl shadow-lg shadow-rose-600/40 flex-shrink-0">
                <BiSolidBolt />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white">FLASH SALE GIỜ VÀNG</h2>
                <p className="text-[11px] sm:text-xs md:text-sm text-slate-400">Số lượng có hạn trong hôm nay, đừng bỏ lỡ!</p>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center justify-between sm:justify-end gap-2.5">
              <span className="text-[11px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider">
                KẾT THÚC TRONG:
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2 font-mono">
                <div className="bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-2 text-center min-w-[40px] sm:min-w-[50px]">
                  <div className="text-lg sm:text-2xl font-black text-rose-500">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase">Giờ</div>
                </div>
                <span className="text-lg sm:text-xl font-bold text-slate-500">:</span>
                <div className="bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-2 text-center min-w-[40px] sm:min-w-[50px]">
                  <div className="text-lg sm:text-2xl font-black text-rose-500">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase">Phút</div>
                </div>
                <span className="text-lg sm:text-xl font-bold text-slate-500">:</span>
                <div className="bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-2 text-center min-w-[40px] sm:min-w-[50px]">
                  <div className="text-lg sm:text-2xl font-black text-rose-500">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase">Giây</div>
                </div>
              </div>
            </div>
          </div>

          {/* Flash Sale Product Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-5 sm:mt-8">
            {flashSaleProducts.map((product) => {
              const discountPercent = Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
              );

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col group transition-all duration-300 hover:shadow-2xl text-slate-900"
                >
                  {/* Card Image Area */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                    <Link href={`/products/${product.id}`} className="block w-full h-full">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Badge */}
                    <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-rose-600 text-white text-[10px] sm:text-[11px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow">
                      -{discountPercent}%
                    </span>

                    {/* Overlay Action Buttons */}
                    <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex flex-col gap-1.5 sm:gap-2">
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md transition ${
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
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 flex items-center justify-center shadow-md transition"
                        title="Xem nhanh"
                      >
                        <BiShow className="text-base sm:text-lg" />
                      </button>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <div className="text-[10px] sm:text-[11px] uppercase font-bold text-rose-600 mb-1 truncate">
                      {product.categoryName}
                    </div>

                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-1.5 line-clamp-2 leading-snug hover:text-rose-600 transition min-h-[32px] sm:min-h-[36px]">
                      <Link href={`/products/${product.id}`}>{product.name}</Link>
                    </h3>

                    <div className="mt-auto pt-1 sm:pt-2">
                      <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 flex-wrap">
                        <span className="text-sm sm:text-base md:text-lg font-extrabold text-rose-600">
                          {product.price.toLocaleString("vi-VN")}đ
                        </span>
                        <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                          {product.originalPrice.toLocaleString("vi-VN")}đ
                        </span>
                      </div>

                      {/* Stock Progress Bar */}
                      <div className="space-y-1 mb-2.5 sm:mb-3">
                        <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold text-slate-500">
                          <span>Đã bán {product.soldPercentage || 75}%</span>
                          <span className="text-rose-600 font-bold">Còn {product.stock}</span>
                        </div>
                        <div className="w-full h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                            style={{ width: `${product.soldPercentage || 75}%` }}
                          />
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => addToCart(product, 1, product.sizes[0], product.colors[0])}
                        className="w-full py-2 px-2 bg-slate-900 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow min-h-[38px] active:scale-95"
                      >
                        <BiShoppingBag className="text-base flex-shrink-0" />
                        <span className="truncate">Thêm vào giỏ</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lookbook / Trending Collections */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Danh Mục Gia Dụng Thịnh Hành 2026
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
            Tuyển chọn từ các dòng thiết bị và đồ dùng gia đình thông minh bán chạy nhất
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {(pinnedCategories.length > 0 ? pinnedCategories : CATEGORIES).map((category) => (
            <Link
              key={category.id}
              href={`/products?cat=${category.id}`}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[3/4] shadow-md border border-slate-100"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-3.5 sm:p-6 text-white">
                <span className="bg-rose-600 text-white text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-md self-start mb-1.5 sm:mb-2">
                  {category.count} Sản phẩm
                </span>
                <h3 className="text-sm sm:text-xl font-bold mb-0.5 line-clamp-1">{category.name}</h3>
                <span className="text-[11px] sm:text-xs font-semibold text-rose-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Khám phá <BiRightArrowAlt className="text-sm sm:text-base" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products with Tabs (Bestseller & New Arrivals) */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Sản Phẩm Nổi Bật
            </h2>
            <p className="text-slate-500 text-sm mt-1">Đầy đủ mẫu mã cập nhật liên tục hàng tuần</p>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-slate-200/70 p-1 rounded-xl self-start">
            <button
              onClick={() => setActiveTab("bestseller")}
              className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition ${
                activeTab === "bestseller"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🔥 Bán Chạy Nhất
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition ${
                activeTab === "new"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ✨ Hàng Mới Về
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {displayTabProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-50">
                <Link href={`/products/${product.id}`} className="block w-full h-full">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex flex-col gap-1.5 sm:gap-2">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow transition ${
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
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 flex items-center justify-center shadow transition"
                    title="Xem nhanh"
                  >
                    <BiShow className="text-base sm:text-lg" />
                  </button>
                </div>
              </div>

              <div className="p-3 sm:p-4 flex flex-col flex-1">
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase mb-1 truncate">
                  {product.categoryName}
                </div>

                <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-1.5 line-clamp-2 hover:text-rose-600 transition leading-snug min-h-[32px] sm:min-h-[36px]">
                  <Link href={`/products/${product.id}`}>{product.name}</Link>
                </h3>

                <div className="flex items-center gap-1 text-amber-400 text-xs mb-2.5">
                  <BiStar />
                  <span className="font-bold text-slate-700">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewCount})</span>
                </div>

                <div className="mt-auto pt-2 border-t border-slate-50 flex items-center justify-between gap-1.5">
                  <span className="text-xs sm:text-sm font-extrabold text-rose-600 truncate">
                    {product.price.toLocaleString("vi-VN")}đ
                  </span>
                  <button
                    onClick={() => addToCart(product, 1, product.sizes[0], product.colors[0])}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 transition flex-shrink-0 active:scale-95"
                    title="Thêm vào giỏ"
                  >
                    <BiShoppingBag className="text-base sm:text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition text-xs sm:text-sm"
          >
            Xem toàn bộ {allProducts.length} sản phẩm <BiRightArrowAlt className="text-xl" />
          </Link>
        </div>
      </section>

      {/* Coupon Voucher Promotion Banner */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 text-white relative overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border border-slate-800 shadow-2xl">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-3">
              <BiGift className="text-base" /> VOUCHER ĐỘC QUYỀN
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3">
              Giảm Ngay 10% Cho Đơn Hàng Đầu Tiên
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mb-5 sm:mb-6 leading-relaxed">
              Áp dụng cho mọi thiết bị nhà bếp, đồ gia dụng thông minh và tiện ích gia đình khi thanh toán. Không giới hạn giá trị đơn hàng!
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <div className="bg-slate-900 border-2 border-dashed border-amber-400/60 rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 font-mono font-bold text-amber-300 text-base sm:text-lg tracking-wider text-center">
                GIADUNG10
              </div>
              <button
                onClick={() => copyVoucher("GIADUNG10")}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold px-6 py-2.5 sm:py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-1.5 text-xs sm:text-sm active:scale-95"
              >
                {copiedVoucher ? <BiCheck className="text-xl" /> : null}
                {copiedVoucher ? "Đã chép mã" : "Sao chép mã"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto mb-10">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Khách Hàng Nói Gì Về Chúng Tôi?
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Hơn 10,000+ khách hàng trên cả nước đã trải nghiệm và đánh giá chất lượng sản phẩm
            </p>
          </div>

          {user ? (
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/30 flex items-center gap-2 transition flex-shrink-0"
            >
              <BiEdit className="text-lg" /> Viết đánh giá của bạn
            </button>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold text-sm shadow transition flex items-center gap-2 flex-shrink-0"
            >
              <BiEdit className="text-lg" /> Đăng nhập để đánh giá
            </Link>
          )}
        </div>

        {(() => {
          const storeReviews = reviews.filter((r) => r.productId === 0);
          const defaultTestimonials = [
            {
              id: "t1",
              userName: "Nguyễn Thu Trang",
              city: "Hà Nội",
              rating: 5,
              content: "Nồi chiên không dầu dùng cực kỳ ưng ý, nướng gà nguyên con chín vàng đều giòn rụm mà không bị khô. Lòng nồi chống dính tháo rời rửa rất nhanh, giao hàng chỉ trong 1 ngày!",
              initials: "NT",
              color: "bg-rose-100 text-rose-600",
            },
            {
              id: "t2",
              userName: "Hoàng Văn Vũ",
              city: "TP. Hồ Chí Minh",
              rating: 5,
              content: "Robot hút bụi Lidar quét bản đồ nhà rất chuẩn xác, hút sạch tóc và bụi mịn góc chân tường. Kết nối app điều khiển mượt mà, bảo hành chính hãng rất an tâm.",
              initials: "HV",
              color: "bg-blue-100 text-blue-600",
            },
            {
              id: "t3",
              userName: "Lê Lan Anh",
              city: "Đà Nẵng",
              rating: 5,
              content: "Bộ nồi chảo inox 304 bắt từ cực nhanh, thân đúc dày dặn cầm đầm tay sang trọng. Nắp kính cường lực nhìn đồ ăn đang sôi rất thích mắt, chuẩn điểm 10 chất lượng!",
              initials: "LA",
              color: "bg-emerald-100 text-emerald-600",
            },
          ];

          const allDisplayTestimonials = [
            ...storeReviews.map((r) => ({
              id: r.id,
              userName: r.userName,
              city: r.city || "Việt Nam",
              rating: r.rating,
              content: r.content,
              initials: r.userName.split(" ").map((w) => w[0]).join("").slice(-2).toUpperCase() || "KH",
              color: "bg-purple-100 text-purple-600",
            })),
            ...defaultTestimonials,
          ];

          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allDisplayTestimonials.slice(0, 6).map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex text-amber-400 mb-3">
                      {[...Array(item.rating)].map((_, i) => (
                        <BiStar key={i} />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm italic mb-4 leading-relaxed">
                      “{item.content}”
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm ${item.color}`}>
                      {item.initials}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{item.userName}</div>
                      <div className="text-xs text-slate-400">{item.city}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </section>

      {/* Review Modal on Home Page */}
      {isReviewModalOpen && user && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsReviewModalOpen(false)} />
          <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md p-5 sm:p-8 border border-slate-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
            >
              <BiX className="text-xl" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl">
                <BiEdit />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Đánh Giá Cửa Hàng</h2>
                <p className="text-xs text-slate-500">Chia sẻ trải nghiệm mua sắm của bạn</p>
              </div>
            </div>

            <form onSubmit={handleStoreReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">
                  Mức độ hài lòng
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-2xl transition-transform hover:scale-110"
                    >
                      <BiStar
                        className={`${
                          star <= (hoverRating || reviewRating)
                            ? "text-amber-400"
                            : "text-slate-300"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs text-slate-500 font-semibold">
                    {["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Tuyệt vời"][hoverRating || reviewRating]}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tỉnh / Thành phố
                </label>
                <input
                  type="text"
                  value={reviewCity}
                  onChange={(e) => setReviewCity(e.target.value)}
                  placeholder="Hà Nội, TP. Hồ Chí Minh..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nội dung đánh giá
                </label>
                <textarea
                  required
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Chất lượng sản phẩm, dịch vụ chăm sóc, thời gian giao hàng..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition shadow-lg shadow-rose-600/20"
                >
                  Gửi đánh giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

