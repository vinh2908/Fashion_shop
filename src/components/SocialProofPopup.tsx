"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiX, BiTimeFive, BiCheckShield } from "react-icons/bi";

const PURCHASES = [
  {
    name: "Nguyễn Minh Trang",
    city: "Hà Nội",
    item: "Nồi Chiên Không Dầu Smart Touch 6.5L",
    time: "2 phút trước",
    img: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=120&auto=format&fit=crop&q=80",
  },
  {
    name: "Trần Hoàng Nam",
    city: "TP. Hồ Chí Minh",
    item: "Robot Hút Bụi Lau Nhà Laser Lidar AI",
    time: "4 phút trước",
    img: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=120&auto=format&fit=crop&q=80",
  },
  {
    name: "Lê Thu Hà",
    city: "Đà Nẵng",
    item: "Máy Xay Sinh Tố & Nấu Sữa Hạt 1.75L",
    time: "1 phút trước",
    img: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=120&auto=format&fit=crop&q=80",
  },
  {
    name: "Phạm Hải Đăng",
    city: "Hải Phòng",
    item: "Bộ Nồi Chảo Inox 304 5 Đáy 5 Món",
    time: "6 phút trước",
    img: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=120&auto=format&fit=crop&q=80",
  },
];

export default function SocialProofPopup() {
  const [current, setCurrent] = useState<typeof PURCHASES[0] | null>(null);
  const [closedByUser, setClosedByUser] = useState(false);

  useEffect(() => {
    if (closedByUser) return;

    let index = 0;
    const showInterval = setInterval(() => {
      setCurrent(PURCHASES[index % PURCHASES.length]);
      index++;

      // Hide after 5 seconds
      const hideTimeout = setTimeout(() => {
        setCurrent(null);
      }, 5000);

      return () => clearTimeout(hideTimeout);
    }, 12000);

    // Initial show after 3.5 seconds
    const initialTimer = setTimeout(() => {
      setCurrent(PURCHASES[0]);
      setTimeout(() => setCurrent(null), 5000);
    }, 3500);

    return () => {
      clearInterval(showInterval);
      clearTimeout(initialTimer);
    };
  }, [closedByUser]);

  return (
    <div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40 pointer-events-none max-w-[320px] sm:max-w-sm">
      <AnimatePresence>
        {current && !closedByUser && (
          <motion.div
            initial={{ opacity: 0, x: -40, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="pointer-events-auto bg-slate-950/90 border border-slate-700/60 backdrop-blur-xl rounded-2xl p-3 sm:p-3.5 shadow-2xl flex items-center gap-3 relative text-white"
          >
            {/* Ambient subtle glow */}
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-rose-500/20 rounded-full blur-xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={() => setClosedByUser(true)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs shadow-md border border-slate-700 transition"
              title="Đóng thông báo"
              aria-label="Đóng thông báo"
            >
              <BiX />
            </button>

            {/* Thumbnail */}
            <div className="relative flex-shrink-0">
              <img
                src={current.img}
                alt={current.item}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-slate-700/80 shadow-inner"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-400 font-bold uppercase tracking-wider mb-0.5">
                <BiCheckShield className="text-xs text-emerald-400" />
                <span>Vừa chốt đơn</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 flex items-center gap-0.5 font-normal">
                  <BiTimeFive className="text-[10px]" /> {current.time}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-100 truncate">
                {current.name}{" "}
                <span className="text-slate-400 font-normal text-[11px]">
                  ({current.city})
                </span>
              </div>

              <div className="text-xs text-amber-300 font-semibold truncate mt-0.5">
                {current.item}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

