"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { BiTrash, BiError, BiX } from "react-icons/bi";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  targetName?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  targetName,
  confirmText = "Xác nhận xóa",
  cancelText = "Hủy bỏ",
  type = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isDanger = type === "danger";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99990] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: "spring", stiffness: 450, damping: 30 }}
          className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 sm:p-7 overflow-hidden z-10"
        >
          {/* Top subtle decorative color banner */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 ${
              isDanger
                ? "bg-gradient-to-r from-rose-500 to-red-600"
                : "bg-gradient-to-r from-amber-500 to-orange-600"
            }`}
          />

          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
            title="Đóng"
          >
            <BiX className="text-xl" />
          </button>

          <div className="flex flex-col items-center text-center pt-2">
            {/* Pulsing warning icon ring */}
            <div className="relative mb-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${
                  isDanger
                    ? "bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-600/20"
                    : "bg-amber-50 text-amber-600 border border-amber-200 shadow-amber-600/20"
                }`}
              >
                {isDanger ? <BiTrash /> : <BiError />}
              </div>
              <span
                className={`absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping opacity-75 ${
                  isDanger ? "bg-rose-400" : "bg-amber-400"
                }`}
              />
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2 tracking-tight">
              {title}
            </h3>

            {/* Target name highlighted badge */}
            {targetName && (
              <div className="mb-3 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 max-w-full truncate">
                &ldquo;{targetName}&rdquo;
              </div>
            )}

            {/* Description message */}
            <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
              {message}
            </p>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={onCancel}
                className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`py-3 px-4 rounded-xl text-white font-bold text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-1.5 ${
                  isDanger
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/30"
                    : "bg-amber-600 hover:bg-amber-700 shadow-amber-600/30"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

