"use client";

import { useShop } from "@/context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import { BiCheckCircle, BiErrorCircle, BiInfoCircle, BiX } from "react-icons/bi";

export default function ToastContainer() {
  const { toasts, removeToast } = useShop();

  return (
    <div className="fixed top-20 right-4 sm:top-24 sm:right-6 z-[99999] flex flex-col gap-3 max-w-[340px] sm:max-w-sm w-full pointer-events-none px-1 sm:px-0">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";

          const title = isSuccess
            ? "Thành công"
            : isError
            ? "Thông báo lỗi"
            : "Thông tin";

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className={`pointer-events-auto relative overflow-hidden rounded-2xl p-4 backdrop-blur-xl border shadow-2xl transition-all ${
                isSuccess
                  ? "bg-slate-950/90 border-emerald-500/30 text-white shadow-emerald-950/30"
                  : isError
                  ? "bg-slate-950/90 border-rose-500/30 text-white shadow-rose-950/30"
                  : "bg-slate-950/90 border-blue-500/30 text-white shadow-blue-950/30"
              }`}
            >
              {/* Subtle top ambient glow */}
              <div
                className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-40 ${
                  isSuccess ? "bg-emerald-500" : isError ? "bg-rose-500" : "bg-blue-500"
                }`}
              />

              <div className="flex items-start gap-3 relative z-10">
                {/* Icon badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-inner ${
                    isSuccess
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : isError
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }`}
                >
                  {isSuccess ? (
                    <BiCheckCircle />
                  ) : isError ? (
                    <BiErrorCircle />
                  ) : (
                    <BiInfoCircle />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-[11px] font-black uppercase tracking-wider ${
                        isSuccess
                          ? "text-emerald-400"
                          : isError
                          ? "text-rose-400"
                          : "text-blue-400"
                      }`}
                    >
                      {title}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    <span className="text-[10px] text-slate-400 font-medium">Vừa xong</span>
                  </div>
                  <p className="text-xs sm:text-[13px] font-medium leading-relaxed text-slate-200">
                    {toast.message}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-white hover:bg-white/10 transition p-1 rounded-lg flex-shrink-0"
                  title="Đóng thông báo"
                  aria-label="Đóng thông báo"
                >
                  <BiX className="text-lg" />
                </button>
              </div>

              {/* Progress bar timer (4 seconds) */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 4, ease: "linear" }}
                  className={`h-full ${
                    isSuccess
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                      : isError
                      ? "bg-gradient-to-r from-rose-500 to-red-400"
                      : "bg-gradient-to-r from-blue-500 to-indigo-400"
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

