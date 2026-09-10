"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  BiPhoneCall
} from "react-icons/bi";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, wishlist, user, logout, pinnedCategories } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (pathname?.startsWith("/admin")) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
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
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-300 text-xs py-2 border-b border-white/10 tracking-wide">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <span>
            🎉 <strong className="text-white">Ưu đãi đặc biệt:</strong> Miễn phí vận chuyển toàn quốc cho đơn hàng từ <strong className="text-amber-400">500.000đ</strong> | Mã giảm: <strong className="text-rose-400">FASHION10</strong> (-10%)
          </span>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <BiPhoneCall className="text-rose-500 text-sm" /> Hotline: <strong className="text-white">1900 1234</strong>
            </span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">Đổi trả 30 ngày tận nơi</span>
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
                <BiSolidShoppingBag className="text-2xl text-white" />
              </div>
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Fashion<span className="text-rose-500 font-black">Store</span>
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
                placeholder="Tìm kiếm sản phẩm..."
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

            {/* Actions: Wishlist, Cart, User */}
            <div className="flex items-center gap-3">
              
              {/* Wishlist Button */}
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
                className="relative flex items-center gap-2 px-3 py-2 rounded-full bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/30 text-rose-400 hover:text-rose-300 transition"
                title="Xem giỏ hàng"
              >
                <div className="relative">
                  <BiSolidShoppingBag className="text-2xl text-rose-500" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-bold text-sm text-white">Giỏ hàng</span>
              </Link>

              {/* User Account / Dropdown */}
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
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full hover:bg-white/10 transition border border-white/10"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center font-bold text-white text-xs">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-sm text-white max-w-[100px] truncate hidden md:inline">
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
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
                aria-label="Mở menu"
              >
                {isMobileMenuOpen ? <BiX className="text-2xl" /> : <BiMenu className="text-2xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-slate-900 border-t border-slate-800 px-4 py-5 shadow-2xl animate-in slide-in-from-top duration-200">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center relative mb-4">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-4 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
              />
              <button type="submit" className="absolute right-3 text-slate-400 hover:text-white">
                <BiSearch className="text-xl" />
              </button>
            </form>

            <ul className="space-y-1 font-semibold text-sm text-slate-300">
              <li>
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-white/10 transition"
                >
                  <BiHome className="text-rose-500 text-lg" /> Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-white/10 transition"
                >
                  <BiGrid className="text-rose-500 text-lg" /> Tất cả sản phẩm
                </Link>
              </li>
              {pinnedCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?cat=${cat.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-white/10 transition"
                  >
                    <BiTag className="text-rose-400 text-lg" /> {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/order-history"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-white/10 transition"
                >
                  <BiHistory className="text-amber-400 text-lg" /> Tra cứu đơn hàng
                </Link>
              </li>
            </ul>

            {/* Mobile Auth Buttons */}
            {!user ? (
              <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-800">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-xl border border-slate-700 hover:bg-slate-800 text-white transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition shadow"
                >
                  Đăng ký
                </Link>
              </div>
            ) : (
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center font-bold text-white text-xs">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{user.fullName}</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-rose-400 hover:underline"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

