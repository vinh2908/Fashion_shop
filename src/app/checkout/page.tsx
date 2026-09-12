"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useShop, OrderItem } from "@/context/ShopContext";
import {
  BiCreditCard,
  BiMoney,
  BiLockAlt,
  BiCheckCircle,
  BiCheckShield,
  BiPrinter,
  BiCopy,
  BiPackage,
  BiMapPin,
  BiPhone,
  BiUser,
  BiSolidCheckCircle,
  BiShoppingBag,
} from "react-icons/bi";
import { FaTruck } from "react-icons/fa";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, placeOrder, user, showToast } = useShop();

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [createdOrder, setCreatedOrder] = useState<OrderItem | null>(null);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
    note: "",
  });

  const shippingFee = cartTotal >= 500000 || cartTotal === 0 ? 0 : 30000;
  const finalTotal = cartTotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast("Giỏ hàng của bạn đang trống!", "error");
      router.push("/products");
      return;
    }

    const nameToUse = formData.fullName || user?.fullName || "";
    const phoneToUse = formData.phone || user?.phone || "";
    const emailToUse = formData.email || user?.email || "";

    if (!nameToUse || !phoneToUse || !formData.address) {
      showToast("Vui lòng điền đầy đủ thông tin giao hàng!", "error");
      return;
    }

    const order = placeOrder(
      {
        fullName: nameToUse,
        phone: phoneToUse,
        email: emailToUse,
        address: formData.address,
        note: formData.note,
      },
      paymentMethod
    );

    setCreatedOrder(order);
  };

  // Order Placed Success Screen
  if (createdOrder) {
    const handleCopyOrderId = () => {
      navigator.clipboard.writeText(createdOrder.orderId);
      showToast(`Đã sao chép mã đơn hàng #${createdOrder.orderId}`, "success");
    };

    return (
      <div className="container mx-auto px-4 py-12 min-h-[75vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-10 max-w-xl w-full text-center relative overflow-hidden"
        >
          {/* Top ambient glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Success Checkmark with Pulsing Ring */}
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/30">
              <BiSolidCheckCircle />
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full animate-ping opacity-75" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
            Đặt Hàng Thành Công!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-5">
            Cảm ơn bạn đã tin chọn mua sắm. Đơn hàng đang được bộ phận kho xử lý.
          </p>

          {/* Order ID Pill with Copy button */}
          <div className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 px-4 py-2 rounded-2xl mb-6 transition border border-slate-200">
            <span className="text-xs font-semibold text-slate-600">Mã đơn hàng:</span>
            <span className="font-mono text-sm font-black text-rose-600">#{createdOrder.orderId}</span>
            <button
              type="button"
              onClick={handleCopyOrderId}
              className="text-slate-400 hover:text-slate-900 transition p-1"
              title="Sao chép mã đơn hàng"
            >
              <BiCopy className="text-base" />
            </button>
          </div>

          {/* Order Delivery Step Progress */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 mb-6 border border-slate-100 text-left">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Tiến trình đơn hàng
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] sm:text-xs font-bold">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm shadow-md mb-1.5">
                  <BiCheckCircle />
                </div>
                <span className="text-emerald-700 font-black">Đã xác nhận</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm mb-1.5">
                  <BiPackage />
                </div>
                <span className="text-slate-600">Đóng gói</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm mb-1.5">
                  <FaTruck />
                </div>
                <span className="text-slate-400">Giao hàng</span>
              </div>
            </div>
          </div>

          {/* Order Summary Details */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 text-left text-xs text-slate-600 space-y-2.5 mb-6 border border-slate-100">
            <div className="flex items-center gap-2">
              <BiUser className="text-rose-500 text-sm flex-shrink-0" />
              <span>
                <strong>Người nhận:</strong> {createdOrder.customerInfo.fullName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BiPhone className="text-rose-500 text-sm flex-shrink-0" />
              <span>
                <strong>Điện thoại:</strong> {createdOrder.customerInfo.phone}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BiMapPin className="text-rose-500 text-sm flex-shrink-0" />
              <span className="truncate">
                <strong>Địa chỉ:</strong> {createdOrder.customerInfo.address}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BiCreditCard className="text-rose-500 text-sm flex-shrink-0" />
              <span>
                <strong>Hình thức:</strong>{" "}
                {createdOrder.paymentMethod === "cod"
                  ? "Thanh toán khi nhận hàng (COD)"
                  : "Chuyển khoản VNPay"}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200/70 flex justify-between items-center text-slate-900">
              <span className="font-bold text-xs sm:text-sm">Tổng thanh toán:</span>
              <span className="font-black text-rose-600 text-base sm:text-lg">
                {createdOrder.totalAmount.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => window.print()}
              className="py-3 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <BiPrinter className="text-base" /> In đơn hàng
            </button>
            <Link
              href="/order-history"
              className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
            >
              <BiPackage className="text-base" /> Xem đơn hàng
            </Link>
            <Link
              href="/products"
              className="py-3 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5"
            >
              <BiShoppingBag className="text-base" /> Mua tiếp
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-10 pb-28 md:pb-12 min-h-[75vh]">
      {/* Breadcrumb */}
      <nav className="text-xs md:text-sm text-slate-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-rose-600 transition">Trang chủ</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-rose-600 transition">Giỏ hàng</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">Thanh toán</span>
      </nav>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mb-6 sm:mb-8 tracking-tight">
        Thanh Toán Đơn Hàng
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl p-8 border border-slate-100 max-w-md mx-auto">
          <p className="text-slate-600 mb-4 font-semibold">Giỏ hàng của bạn đang trống.</p>
          <Link href="/products" className="bg-rose-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs">
            Quay lại mua sắm
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Form Fields */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Customer Info */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center font-black">
                  1
                </span>
                Thông Tin Giao Hàng
              </h2>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Họ và Tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500 focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Số Điện Thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Địa chỉ Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Địa Chỉ Chi Tiết (Nhận hàng) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Ghi Chú Cho Shipper (Tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Giao vào giờ hành chính, gọi trước khi giao..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-rose-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center font-black">
                  2
                </span>
                Phương Thức Thanh Toán
              </h2>

              <div className="space-y-3">
                <label
                  className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-rose-600 bg-rose-50/50 text-rose-900"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                  />
                  <div className="ml-3.5 flex items-center gap-3">
                    <BiMoney className="text-3xl text-emerald-600" />
                    <div>
                      <div className="font-bold text-sm text-slate-900">
                        Thanh toán khi nhận hàng (COD)
                      </div>
                      <div className="text-xs text-slate-500">
                        Kiểm tra hàng trước khi thanh toán tiền mặt cho nhân viên giao hàng
                      </div>
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === "card"
                      ? "border-rose-600 bg-rose-50/50 text-rose-900"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                  />
                  <div className="ml-3.5 flex items-center gap-3">
                    <BiCreditCard className="text-3xl text-blue-600" />
                    <div>
                      <div className="font-bold text-sm text-slate-900">
                        Thanh toán qua thẻ ATM / VNPay QR
                      </div>
                      <div className="text-xs text-slate-500">
                        Quét mã QR hoặc qua cổng thanh toán bảo mật nội địa & quốc tế
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="font-bold text-lg text-slate-900 pb-3 border-b border-slate-100 mb-4 flex items-center justify-between">
                <span>Đơn Hàng ({cart.length} món)</span>
                <Link href="/cart" className="text-xs text-rose-600 hover:underline font-semibold">
                  Sửa giỏ hàng
                </Link>
              </h3>

              {/* Items List */}
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-2 space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex items-center gap-3 pt-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-14 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-[11px] text-slate-400">
                        {item.color} / Size {item.size} x {item.quantity}
                      </div>
                      <div className="text-xs font-bold text-rose-600 mt-0.5">
                        {(item.product.price * item.quantity).toLocaleString("vi-VN")}đ
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="space-y-2.5 text-xs text-slate-600 pb-4 border-b border-slate-100">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span className="font-bold text-slate-900">{cartTotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí giao hàng:</span>
                  <span className="font-bold text-slate-900">
                    {shippingFee === 0 ? <span className="text-emerald-600">Miễn phí</span> : `${shippingFee.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
              </div>

              <div className="py-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">Tổng cộng:</span>
                  <span className="text-2xl font-black text-rose-600">
                    {finalTotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-rose-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <BiLockAlt className="text-xl" /> Xác Nhận Đặt Hàng
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-4 text-center">
                <BiCheckShield className="text-base text-emerald-500 flex-shrink-0" />
                <span>Cam kết bảo mật thông tin khách hàng</span>
              </div>
            </div>
          </div>

        </form>
      )}
    </div>
  );
}


