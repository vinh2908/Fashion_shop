"use client";

import Link from "next/link";
import { useState } from "react";
import { useShop, OrderItem } from "@/context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  BiHistory,
  BiSearch,
  BiPackage,
  BiPrinter,
  BiX,
  BiUser,
  BiPhone,
  BiMapPin,
  BiCreditCard,
  BiEdit,
} from "react-icons/bi";

export default function OrderHistoryPage() {
  const { orders, user, updateProfile } = useShop();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: "", phone: "" });

  const filteredOrders = orders.filter((o) =>
    o.orderId.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    o.customerInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const getStatusBadge = (status: OrderItem["status"]) => {
    switch (status) {
      case "Thành công":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Đang giao":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Đã hủy":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 min-h-[75vh]">
      {/* Breadcrumb */}
      <nav className="text-xs md:text-sm text-slate-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-rose-600 transition">Trang chủ</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">Lịch sử đơn hàng</span>
      </nav>

      {/* User Profile Card */}
      {user ? (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-white font-black text-xl flex items-center justify-center shadow-md shadow-rose-600/30 flex-shrink-0">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">{user.fullName}</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                  {user.role === "Admin" ? "Quản trị viên" : "Thành viên"}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-3">
                <span>📧 {user.email}</span>
                {user.phone && <span>📞 {user.phone}</span>}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setProfileForm({ fullName: user.fullName, phone: user.phone || "" });
              setIsProfileModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-300 font-bold text-xs flex items-center gap-2 transition bg-slate-50 hover:bg-white"
          >
            <BiEdit className="text-base text-rose-500" /> Chỉnh sửa hồ sơ
          </button>
        </div>
      ) : (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 mb-8 flex items-center justify-between gap-4">
          <div className="text-xs text-amber-800">
            💡 Bạn đang xem đơn hàng với tư cách khách vãng lai. Hãy <Link href="/login" className="font-bold underline text-rose-600">Đăng nhập</Link> để quản lý hồ sơ và cập nhật thông tin cá nhân.
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BiHistory className="text-rose-600" /> Lịch Sử Đơn Hàng Của Bạn
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Theo dõi trạng thái giao hàng và chi tiết các đơn đã đặt
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã đơn (FS-...)..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-rose-500 transition shadow-sm"
          />
          <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
        </div>
      </div>

      {/* Orders Table or Empty */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-4xl text-slate-300 mx-auto mb-4">
            <BiPackage />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Chưa có đơn hàng nào</h3>
          <p className="text-slate-500 text-xs mb-6">
            Bạn chưa thực hiện đơn đặt hàng nào hoặc không tìm thấy mã đơn tương ứng.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-rose-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow hover:bg-rose-700 transition"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-black tracking-wider">
                  <th className="py-4 px-6">Mã Đơn</th>
                  <th className="py-4 px-6">Ngày Đặt</th>
                  <th className="py-4 px-6">Sản Phẩm</th>
                  <th className="py-4 px-6">Tổng Tiền</th>
                  <th className="py-4 px-6">Trạng Thái</th>
                  <th className="py-4 px-6 text-right">Chi Tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-mono font-black text-slate-900 text-sm">
                      #{order.orderId}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {order.createdAt}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {order.items.slice(0, 2).map((it, i) => (
                          <img
                            key={i}
                            src={it.product.imageUrl}
                            alt=""
                            className="w-9 h-11 rounded-lg object-cover bg-slate-100"
                          />
                        ))}
                        <span className="text-slate-500">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} món
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-rose-600 text-sm">
                      {order.totalAmount.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white transition font-bold text-xs"
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal (Receipt Invoice Style) */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-7 max-h-[92vh] overflow-y-auto z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg text-slate-900">
                      Đơn Hàng #{selectedOrder.orderId}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Ngày đặt hàng: {selectedOrder.createdAt}</span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
                  title="Đóng"
                >
                  <BiX className="text-xl" />
                </button>
              </div>

              {/* Customer and Delivery Info */}
              <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2 mb-5 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700">
                  <BiUser className="text-rose-500 flex-shrink-0 text-sm" />
                  <span><strong>Người nhận:</strong> {selectedOrder.customerInfo.fullName}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <BiPhone className="text-rose-500 flex-shrink-0 text-sm" />
                  <span><strong>Điện thoại:</strong> {selectedOrder.customerInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <BiMapPin className="text-rose-500 flex-shrink-0 text-sm" />
                  <span><strong>Địa chỉ:</strong> {selectedOrder.customerInfo.address}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <BiCreditCard className="text-rose-500 flex-shrink-0 text-sm" />
                  <span>
                    <strong>Hình thức:</strong>{" "}
                    {selectedOrder.paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản VNPay"}
                  </span>
                </div>
                {selectedOrder.customerInfo.note && (
                  <div className="text-slate-500 pt-1 border-t border-slate-200/60">
                    <strong>Ghi chú:</strong> {selectedOrder.customerInfo.note}
                  </div>
                )}
              </div>

              {/* Items List */}
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2.5">
                Danh sách sản phẩm ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-slate-100 mb-5">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="py-3 flex items-center gap-3">
                    <img
                      src={it.product.imageUrl}
                      alt={it.product.name}
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

              {/* Total Summary */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5 text-xs text-slate-600 mb-6">
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span className="font-bold text-emerald-600">Miễn phí</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-slate-900">
                  <span className="font-bold text-sm">Tổng thanh toán:</span>
                  <span className="text-lg font-black text-rose-600">
                    {selectedOrder.totalAmount.toLocaleString("vi-VN")}đ
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
                  onClick={() => setSelectedOrder(null)}
                  className="py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Profile Edit Modal */}
      {isProfileModalOpen && user && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsProfileModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
            >
              <BiX className="text-xl" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl">
                <BiEdit />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Chỉnh sửa hồ sơ</h2>
                <p className="text-xs text-slate-500">Cập nhật thông tin cá nhân của bạn</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProfile({ fullName: profileForm.fullName, phone: profileForm.phone });
                setIsProfileModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Họ và tên
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-400 cursor-not-allowed"
                />
                <p className="text-xs text-slate-400 mt-1">Email không thể thay đổi</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                  placeholder="0912 345 678"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition shadow-lg shadow-rose-600/20"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

