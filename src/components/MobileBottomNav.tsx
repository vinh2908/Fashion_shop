"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import {
  BiHome,
  BiGrid,
  BiSolidShoppingBag,
  BiHeart,
  BiUser,
} from "react-icons/bi";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, wishlist, user } = useShop();

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) return null;

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    {
      label: "Trang chủ",
      href: "/",
      icon: BiHome,
      active: isActive("/"),
    },
    {
      label: "Sản phẩm",
      href: "/products",
      icon: BiGrid,
      active: pathname === "/products" || pathname.startsWith("/products?"),
    },
    {
      label: "Giỏ hàng",
      href: "/cart",
      icon: BiSolidShoppingBag,
      active: pathname === "/cart" || pathname === "/checkout",
      badge: cartCount > 0 ? (cartCount > 99 ? "99+" : cartCount) : null,
      badgeColor: "bg-rose-600 text-white",
    },
    {
      label: "Yêu thích",
      href: "/products",
      icon: BiHeart,
      active: false,
      badge: wishlist.length > 0 ? (wishlist.length > 99 ? "99+" : wishlist.length) : null,
      badgeColor: "bg-amber-500 text-white",
    },
    {
      label: user ? (user.role === "Admin" ? "Admin" : "Hồ sơ") : "Tài khoản",
      href: user ? "/order-history" : "/login",
      icon: BiUser,
      active: pathname === "/order-history" || pathname === "/login" || pathname === "/register",
    },
  ];

  return (
    <nav
      aria-label="Thanh điều hướng di động"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.3)] transition-transform duration-200"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isItemActive = item.active;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all ${
                isItemActive
                  ? "text-rose-500 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {/* Active Indicator bar */}
              {isItemActive && (
                <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
              )}

              <div className="relative">
                <Icon className={`text-2xl transition-transform ${isItemActive ? "scale-110" : ""}`} />

                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-md animate-pulse ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[60px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

