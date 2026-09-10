"use client";

import Link from "next/link";
import { useState } from "react";
import { useShop } from "@/context/ShopContext";
import {
  BiTrash,
  BiArrowBack,
  BiShoppingBag,
  BiCheck,
  BiCheckShield,
  BiRightArrowAlt
} from "react-icons/bi";
import { motion } from "framer-motion";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, showToast } = useShop();

  const [voucherCode, setVoucherCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState("");

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const code = voucherCode.trim().toUpperCase();
    if (code === "GIADUNG10" || code === "FASHION10" || code === "HOME10") {
      setDiscountPercent(10);
      setAppliedVoucher(code);
      showToast(`Áp dụng mã giảm giá ${code} thành công (-10%)!`, "success");
    } else {
      showToast("Mã giảm giá không hợp lệ hoặc đã hết hạn!", "error");
    }
  };

  const discountAmount = Math.round((cartTotal * discountPercent) / 100);
  const shippingFee = cartTotal >= 500000 || cartTotal === 0 ? 0 : 30000;
  const finalTotal = Math.max(0, cartTotal - discountAmount + shippingFee);

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-10 pb-36 md:pb-12 min-h-[75vh]">
      {/* Breadcrumb */}
      <nav className="text-xs md:text-sm text-slate-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-rose-600 transition">Trang chủ</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">Giỏ hàng ({cart.length} món)</span>
      </nav>

      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-rose-600/30">
          <BiShoppingBag />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Giỏ Hàng Của Bạn
        </h1>
      </div>

      {cart.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 sm:py-20 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-xl mx-auto p-6 sm:p-8"
        >
          <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-slate-100 flex items-center justify-center text-4xl sm:text-5xl text-slate-300 mx-auto mb-4">
            <BiShoppingBag />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">Giỏ hàng của bạn đang trống</h2>
          <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed">
            Bạn chưa chọn bất kỳ thiết bị nào. Hãy khám phá ngay các sản phẩm đồ gia dụng thông minh hot nhất hôm nay!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 sm:py-3.5 sm:px-8 rounded-xl transition shadow-lg shadow-rose-600/30 text-sm"
          >
            Khám phá sản phẩm ngay <BiRightArrowAlt className="text-xl" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100">
              <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-slate-100 text-xs uppercase font-bold text-slate-400">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Thành tiền</div>
              </div>

              <div className="divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}`}>
                    {/* Mobile Native Card Layout */}
                    <div className="sm:hidden py-4 flex gap-3">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="w-20 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative border border-slate-100"
                      >
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <Link
                              href={`/products/${item.product.id}`}
                              className="font-bold text-slate-900 text-xs hover:text-rose-600 transition line-clamp-2 leading-snug"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                              className="text-slate-400 hover:text-rose-600 p-1 -mr-1 transition"
                              title="Xóa"
                              aria-label="Xóa sản phẩm"
                            >
                              <BiTrash className="text-base" />
                            </button>
                          </div>

                          <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-1.5">
                            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                              {item.color}
                            </span>
                            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                              Size {item.size}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-50">
                          <div className="font-extrabold text-rose-600 text-sm">
                            {(item.product.price * item.quantity).toLocaleString("vi-VN")}đ
                          </div>

                          {/* Mobile Quantity Selector */}
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden h-7 bg-slate-50">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                              className="w-7 h-full text-slate-600 active:bg-slate-200 font-bold transition flex items-center justify-center text-sm"
                            >
                              -
                            </button>
                            <span className="w-7 text-center font-bold text-xs text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                              className="w-7 h-full text-slate-600 active:bg-slate-200 font-bold transition flex items-center justify-center text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Tabular Grid Layout */}
                    <div className="hidden sm:grid py-5 grid-cols-12 gap-4 items-center">
                      <div className="col-span-6 flex items-center gap-4">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="w-20 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative group"
                        >
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </Link>

                        <div>
                          <Link
                            href={`/products/${item.product.id}`}
                            className="font-bold text-slate-900 text-sm hover:text-rose-600 transition line-clamp-2 leading-snug"
                          >
                            {item.product.name}
                          </Link>
                          <div className="text-xs text-slate-500 mt-1">
                            Phân loại: <span className="font-semibold text-slate-700">{item.color}</span>, size <span className="font-semibold text-slate-700">{item.size}</span>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                            className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 mt-2 transition"
                          >
                            <BiTrash /> Xóa khỏi giỏ
                          </button>
                        </div>
                      </div>

                      <div className="col-span-2 text-center text-sm font-semibold text-slate-700">
                        {item.product.price.toLocaleString("vi-VN")}đ
                      </div>

                      <div className="col-span-2 flex items-center justify-center">
                        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden h-9 bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                            className="w-8 h-full text-slate-600 hover:bg-slate-200 font-bold transition flex items-center justify-center text-base"
                          >
                            -
                          </button>
                          <span className="w-9 text-center font-bold text-xs text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                            className="w-8 h-full text-slate-600 hover:bg-slate-200 font-bold transition flex items-center justify-center text-base"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="col-span-2 text-right font-black text-rose-600 text-base">
                        {(item.product.price * item.quantity).toLocaleString("vi-VN")}đ
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-rose-600 font-bold text-sm transition"
              >
                <BiArrowBack className="text-lg" /> Tiếp tục mua sắm
              </Link>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 pb-4 border-b border-slate-100 mb-5">
                Tóm Tắt Đơn Hàng
              </h3>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyVoucher} className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Mã Giảm Giá
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Nhập mã FASHION10"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
                  >
                    Áp dụng
                  </button>
                </div>
                {appliedVoucher && (
                  <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-2">
                    <BiCheck /> Đã áp dụng mã {appliedVoucher} (-10%)
                  </div>
                )}
              </form>

              {/* Pricing Breakdown */}
              <div className="space-y-3 text-sm pb-4 border-b border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính ({cart.length} món):</span>
                  <span className="font-bold text-slate-900">{cartTotal.toLocaleString("vi-VN")}đ</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Mã giảm giá ({discountPercent}%):</span>
                    <span>-{discountAmount.toLocaleString("vi-VN")}đ</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-bold text-slate-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600">Miễn phí</span>
                    ) : (
                      `${shippingFee.toLocaleString("vi-VN")}đ`
                    )}
                  </span>
                </div>

                {shippingFee > 0 && (
                  <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl">
                    Mua thêm {(500000 - cartTotal).toLocaleString("vi-VN")}đ để được <strong>miễn phí giao hàng</strong> toàn quốc!
                  </div>
                )}
              </div>

              {/* Total Amount */}
              <div className="py-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Tổng thanh toán:</span>
                  <span className="text-2xl font-black text-rose-600">
                    {finalTotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 text-right mt-0.5">(Đã bao gồm thuế VAT)</div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="block w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-center text-sm rounded-2xl transition shadow-xl shadow-rose-600/30 transform hover:-translate-y-0.5"
              >
                Tiến Hành Thanh Toán Ngay
              </Link>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-4">
                <BiCheckShield className="text-base text-emerald-500" />
                <span>Bảo mật thông tin thanh toán 100%</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Mobile Sticky Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3 px-4 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Tổng thanh toán:</div>
              <div className="text-lg font-black text-rose-600 leading-tight">
                {finalTotal.toLocaleString("vi-VN")}đ
              </div>
            </div>
            <Link
              href="/checkout"
              className="py-2.5 px-5 bg-gradient-to-r from-rose-600 to-pink-600 active:opacity-90 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-600/30 transition active:scale-95 whitespace-nowrap"
            >
              Thanh toán ({cart.length})
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}


