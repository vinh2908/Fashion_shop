"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { BiEnvelope, BiLockAlt, BiLogInCircle, BiInfoCircle } from "react-icons/bi";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useShop();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(email, password);
    if (ok) {
      if (email.toLowerCase().includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  };

  const fillAdmin = () => {
    setEmail("admin@clothingshop.vn");
    setPassword("Admin@123");
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[75vh]">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 text-center mb-6">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
            <BiLogInCircle />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-1 tracking-tight">
            Đăng Nhập
          </h1>
          <p className="text-slate-500 text-xs">Vui lòng đăng nhập để trải nghiệm mua sắm tốt nhất</p>
        </div>

        {/* Quick Demo Hint */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 mb-6 text-xs text-slate-600 flex items-start gap-2.5">
          <BiInfoCircle className="text-rose-500 text-lg flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>Tài khoản Admin mẫu: </span>
            <button
              type="button"
              onClick={fillAdmin}
              className="text-rose-600 font-bold hover:underline"
            >
              Click để tự điền (Admin@123)
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="relative z-10 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email / Tên tài khoản
            </label>
            <div className="relative">
              <BiEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white text-sm transition outline-none"
                placeholder="admin@clothingshop.vn hoặc email của bạn"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Mật Khẩu
              </label>
              <a href="#" className="text-xs text-rose-600 hover:underline font-semibold">
                Quên mật khẩu?
              </a>
            </div>
            <div className="relative">
              <BiLockAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white text-sm transition outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center pt-1">
            <input
              id="remember-me"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-slate-300 rounded cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 cursor-pointer">
              Ghi nhớ đăng nhập trên thiết bị này
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3.5 px-4 rounded-xl shadow-lg shadow-rose-600/30 transition transform hover:-translate-y-0.5 text-sm mt-3"
          >
            Đăng Nhập
          </button>
        </form>

        <div className="relative z-10 mt-6 text-center text-xs text-slate-500">
          Chưa có tài khoản thành viên?{" "}
          <Link href="/register" className="font-bold text-rose-600 hover:underline">
            Đăng ký tài khoản ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

