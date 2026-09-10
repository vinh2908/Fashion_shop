"use client";

import { useShop } from "@/context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BiX, BiShoppingBag, BiHeart, BiSolidHeart, BiShow, BiCheckShield, BiStar } from "react-icons/bi";
import Link from "next/link";

export default function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart, isWishlisted, toggleWishlist } = useShop();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const activeSize = selectedSize || quickViewProduct.sizes[0] || "M";
  const activeColor = selectedColor || quickViewProduct.colors[0] || "Trắng";

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, activeSize, activeColor);
    closeQuickView();
  };

  const discountPercent = quickViewProduct.originalPrice
    ? Math.round(((quickViewProduct.originalPrice - quickViewProduct.price) / quickViewProduct.originalPrice) * 100)
    : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99990] flex items-center justify-center p-3 sm:p-5">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 450, damping: 30 }}
          className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-w-3xl w-full z-10 max-h-[92vh] flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={closeQuickView}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 flex items-center justify-center shadow-md transition transform hover:rotate-90"
            title="Đóng cửa sổ xem nhanh"
            aria-label="Đóng"
          >
            <BiX className="text-2xl" />
          </button>

          {/* Product Image preview */}
          <div className="md:w-1/2 relative bg-slate-100 h-56 sm:h-72 md:h-auto flex-shrink-0 overflow-hidden group">
            <img
              src={quickViewProduct.imageUrl}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-rose-600 to-red-600 text-white font-black text-xs px-3 py-1.5 rounded-full shadow-lg shadow-rose-600/30">
                SALE -{discountPercent}%
              </span>
            )}
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
              <BiCheckShield className="text-emerald-400 text-sm" /> Chính hãng 100%
            </div>
          </div>

          {/* Product Info Column */}
          <div className="md:w-1/2 p-5 sm:p-7 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] uppercase font-bold text-rose-600 tracking-wider">
                {quickViewProduct.categoryName}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                <BiStar className="text-sm fill-amber-500" />
                <span>{quickViewProduct.rating || "4.9"}</span>
                <span className="text-slate-400 font-normal">({quickViewProduct.reviewCount || 48})</span>
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2 leading-snug">
              {quickViewProduct.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-2xl font-black text-rose-600 tracking-tight">
                {quickViewProduct.price.toLocaleString("vi-VN")}đ
              </span>
              {quickViewProduct.originalPrice > quickViewProduct.price && (
                <span className="text-xs sm:text-sm text-slate-400 line-through">
                  {quickViewProduct.originalPrice.toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Còn hàng trong kho - Sẵn sàng giao ngay</span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-2">
              {quickViewProduct.description}
            </p>

            {/* Colors */}
            <div className="mb-3.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Màu sắc: <span className="text-rose-600 font-bold">{activeColor}</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickViewProduct.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition ${
                      activeColor === color
                        ? "border-rose-600 bg-rose-50 text-rose-700 font-bold ring-2 ring-rose-600/30 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kích thước: <span className="text-rose-600 font-bold">{activeSize}</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickViewProduct.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 text-xs font-bold rounded-xl border transition flex items-center justify-center ${
                      activeSize === size
                        ? "border-rose-600 bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-600/30"
                        : "border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="mt-auto space-y-3">
              <div className="flex items-center gap-2.5">
                {/* Stepper */}
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden h-11 bg-slate-50 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-full text-slate-600 hover:bg-slate-200 font-bold transition flex items-center justify-center text-base"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-full text-slate-600 hover:bg-slate-200 font-bold transition flex items-center justify-center text-base"
                  >
                    +
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition transform hover:-translate-y-0.5"
                >
                  <BiShoppingBag className="text-lg" /> Thêm vào giỏ
                </button>

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center transition flex-shrink-0 ${
                    isWishlisted(quickViewProduct.id)
                      ? "border-rose-200 bg-rose-50 text-rose-600 shadow-sm"
                      : "border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 bg-slate-50"
                  }`}
                  title="Yêu thích"
                  aria-label="Yêu thích"
                >
                  {isWishlisted(quickViewProduct.id) ? (
                    <BiSolidHeart className="text-xl text-rose-600" />
                  ) : (
                    <BiHeart className="text-xl" />
                  )}
                </button>
              </div>

              {/* View full details */}
              <Link
                href={`/products/${quickViewProduct.id}`}
                onClick={closeQuickView}
                className="w-full py-2 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center justify-center gap-1.5"
              >
                <BiShow className="text-base text-rose-600" /> Xem trang chi tiết sản phẩm đầy đủ
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

