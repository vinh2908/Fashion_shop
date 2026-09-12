"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useShop } from "@/context/ShopContext";
import {
  BiSolidShoppingBag,
  BiHome,
  BiGrid,
  BiTag,
  BiSearch,
  BiLogIn,
  BiUserPlus,
  BiHistory,
  BiTachometer,
  BiLogOut,
  BiHeart,
  BiMenu,
  BiX,
  BiChevronDown,
  BiPhoneCall,
  BiEdit,
  BiUser,
} from "react-icons/bi";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, wishlist, user, logout, pinnedCategories, updateProfile } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: "", phone: "" });
  const [searchQuery, setSearchQuery] = useState("");

  if (pathname?.startsWith("/admin")) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-300 text-[11px] sm:text-xs py-1.5 sm:py-2 border-b border-white/10 tracking-wide">
        <div className="container mx-auto px-4 flex items-center justify-between gap-2">
          <div className="truncate flex-1 text-center sm:text-left">
            🎉 <strong className="text-white">Ưu đãi:</strong> Freeship từ <strong className="text-amber-400">500.000đ</strong> | Mã: <strong className="text-rose-400">GIADUNG10</strong> (-10%)
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400 flex-shrink-0">
            <a href="tel:19001234" className="flex items-center gap-1 hover:text-white transition">
              <BiPhoneCall className="text-rose-500 text-sm" /> Hotline: <strong className="text-white">1900 1234</strong>
            </a>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">Bảo hành chính hãng 12 - 24 tháng</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-slate-950/95 backdrop-blur-md text-white sticky top-0 z-50 border-b border-white/10 shadow-lg">
        <div className="container mx-auto px-4 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-white hover:text-rose-400 transition flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-lg shadow-rose-600/40">
                <BiHome className="text-2xl text-white" />
              </div>
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Home<span className="text-rose-500 font-black">Living</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden xl:flex items-center gap-1 font-semibold text-sm text-slate-300">
              <li>
                <Link
                  href="/"
                  className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition ${
                    isActive("/") ? "text-white bg-white/10" : "hover:text-white hover:bg-white/5"
                  }`}
                >
                  <BiHome className="text-lg text-rose-500" /> Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition ${
                    pathname === "/products" ? "text-white bg-white/10" : "hover:text-white hover:bg-white/5"
                  }`}
                >
                  <BiGrid className="text-lg text-rose-500" /> Tất cả sản phẩm
                </Link>
              </li>
              {pinnedCategories.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?cat=${cat.id}`}
                    className="px-3.5 py-2 rounded-lg flex items-center gap-1.5 hover:text-white hover:bg-white/5 transition"
                  >
                    <BiTag className="text-lg text-rose-400" /> {cat.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center relative flex-1 max-w-xs mx-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nồi chiên, robot, bếp từ, thiết bị gia dụng..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-full py-2 pl-4 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
              />
              <button
                type="submit"
                className="absolute right-3 text-slate-400 hover:text-rose-400 transition"
                title="Tìm kiếm"
              >
                <BiSearch className="text-lg" />
              </button>
            </form>

            {/* Actions: Search icon, Wishlist, Cart, User, Hamburger */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              
              {/* Mobile Quick Search Button */}
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="lg:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
                title="Tìm kiếm"
                aria-label="Mở tìm kiếm"
              >
                <BiSearch className="text-xl" />
              </button>

              {/* Wishlist Button (Desktop & Tablet) */}
              <Link
                href="/products"
                className="relative p-2.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-rose-400 transition hidden sm:flex items-center justify-center"
                title="Yêu thích"
              >
                <BiHeart className="text-2xl" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Shopping Cart */}
              <Link
                href="/cart"
                className="relative flex items-center gap-1.5 sm:gap-2 p-2 sm:px-3 sm:py-2 rounded-full bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/30 text-rose-400 hover:text-rose-300 transition"
                title="Xem giỏ hàng"
              >
                <div className="relative">
                  <BiSolidShoppingBag className="text-xl sm:text-2xl text-rose-500" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] sm:text-[11px] font-black min-w-[18px] sm:w-5 h-[18px] sm:h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-bold text-sm text-white">Giỏ hàng</span>
              </Link>

              {/* User Account / Dropdown (Desktop) */}
              {!user ? (
                <div className="hidden md:flex items-center gap-2 pl-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-1 text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition"
                  >
                    <BiLogIn className="text-lg" /> Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1 text-sm font-bold bg-white text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-full shadow transition"
                  >
                    <BiUserPlus className="text-lg" /> Đăng ký
                  </Link>
                </div>
              ) : (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full hover:bg-white/10 transition border border-white/10"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center font-bold text-white text-xs">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-sm text-white max-w-[100px] truncate">
                      {user.fullName}
                    </span>
                    <BiChevronDown className="text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div
                      onMouseLeave={() => setIsUserDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-50 text-sm overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50">
                        <div className="font-bold text-white truncate">{user.fullName}</div>
                        <div className="text-xs text-slate-400 truncate">{user.email}</div>
                        {user.role === "Admin" && (
                          <span className="inline-block mt-1 bg-rose-500/20 text-rose-400 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                            Quản trị viên
                          </span>
                        )}
                      </div>

                      <Link
                        href="/order-history"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition"
                      >
                        <BiHistory className="text-lg text-sky-400" /> Đơn hàng của tôi
                      </Link>

                      <button
                        onClick={() => {
                          setProfileForm({ fullName: user.fullName, phone: user.phone || "" });
                          setIsUserDropdownOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition text-left"
                      >
                        <BiUser className="text-lg text-emerald-400" /> Chỉnh sửa hồ sơ
                      </button>

                      {user.role === "Admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-slate-800 font-semibold transition"
                        >
                          <BiTachometer className="text-lg text-rose-500" /> Quản trị Admin
                        </Link>
                      )}

                      <hr className="border-slate-800 my-1" />

                      <button
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition text-left"
                      >
                        <BiLogOut className="text-lg" /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
                aria-label="Mở menu"
              >
                {isMobileMenuOpen ? <BiX className="text-2xl" /> : <BiMenu className="text-2xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Quick Dropdown Search Input */}
        {isMobileSearchOpen && (
          <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 shadow-xl animate-in slide-in-from-top duration-150">
            <form onSubmit={handleSearch} className="flex items-center relative">
              <input
                type="search"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nồi chiên, robot, bếp từ, máy lọc..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2.5 pl-4 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
              />
              <button type="submit" className="absolute right-3 text-slate-400 hover:text-white" title="Tìm kiếm">
                <BiSearch className="text-xl" />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Slide-Over Drawer with Backdrop Overlay (Moved outside nav for proper viewport fixed positioning) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[9999] xl:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-[340px] bg-slate-900 border-l border-slate-800 p-5 flex flex-col justify-between overflow-y-auto shadow-2xl z-10"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 font-black text-lg text-white"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white text-lg shadow-md shadow-rose-600/40">
                      <BiHome />
                    </div>
                    <span>Home<span className="text-rose-500">Living</span></span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
                    aria-label="Đóng menu"
                  >
                    <BiX className="text-xl" />
                  </button>
                </div>

                {/* Mobile Search inside Drawer */}
                <form onSubmit={handleSearch} className="flex items-center relative mb-5">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm thiết bị gia dụng..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-3.5 pr-9 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                  />
                  <button type="submit" className="absolute right-3 text-slate-400 hover:text-white">
                    <BiSearch className="text-lg" />
                  </button>
                </form>

                {/* Navigation links */}
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">
                  Danh Mục Khám Phá
                </div>
                <ul className="space-y-1 font-semibold text-sm text-slate-300">
                  <li>
                    <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl transition ${
                        isActive("/") ? "bg-white/10 text-white font-bold" : "hover:bg-white/5"
                      }`}
                    >
                      <BiHome className="text-rose-500 text-lg flex-shrink-0" /> Trang chủ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl transition ${
                        pathname === "/products" ? "bg-white/10 text-white font-bold" : "hover:bg-white/5"
                      }`}
                    >
                      <BiGrid className="text-rose-500 text-lg flex-shrink-0" /> Tất cả sản phẩm
                    </Link>
                  </li>
                  {pinnedCategories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/products?cat=${cat.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition text-slate-300"
                      >
                        <span className="flex items-center gap-2.5">
                          <BiTag className="text-rose-400 text-lg flex-shrink-0" /> {cat.name}
                        </span>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-md text-slate-400">
                          {cat.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/order-history"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/5 transition text-amber-300"
                    >
                      <BiHistory className="text-amber-400 text-lg flex-shrink-0" /> Tra cứu đơn hàng
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Bottom Drawer Actions: User / Auth */}
              <div className="pt-4 mt-6 border-t border-slate-800 space-y-3">
                {!user ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2.5 text-center text-xs font-bold rounded-xl border border-slate-700 hover:bg-slate-800 text-white transition flex items-center justify-center gap-1.5"
                    >
                      <BiLogIn className="text-base" /> Đăng nhập
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2.5 text-center text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition shadow flex items-center justify-center gap-1.5"
                    >
                      <BiUserPlus className="text-base" /> Đăng ký
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">{user.fullName}</div>
                          <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-slate-400 hover:text-rose-400 p-1 transition"
                        title="Đăng xuất"
                      >
                        <BiLogOut className="text-lg" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileForm({ fullName: user.fullName, phone: user.phone || "" });
                          setIsMobileMenuOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="py-2 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <BiEdit className="text-rose-400 text-sm" /> Sửa hồ sơ
                      </button>
                      {user.role === "Admin" ? (
                        <Link
                          href="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="py-2 px-2 bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition"
                        >
                          <BiTachometer className="text-sm" /> Admin
                        </Link>
                      ) : (
                        <Link
                          href="/order-history"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="py-2 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
                        >
                          <BiHistory className="text-sky-400 text-sm" /> Đơn hàng
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Hotline Quick Call */}
                <a
                  href="tel:19001234"
                  className="w-full py-2 px-3 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <BiPhoneCall className="text-base" /> Hotline hỗ trợ: 1900 1234
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Edit Modal */}
      {isProfileModalOpen && user && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsProfileModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-5 sm:p-8 border border-slate-100 max-h-[90vh] overflow-y-auto">
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
    </>
  );
}

