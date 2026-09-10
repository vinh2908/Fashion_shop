"use client";

import { useEffect, useState } from "react";
import { BiChat, BiSolidPhone, BiUpArrowAlt } from "react-icons/bi";
import { usePathname } from 'next/navigation';

export default function FloatingWidgets() {
  const pathname = usePathname();
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="fixed bottom-20 right-3.5 sm:bottom-6 sm:right-6 z-40 flex flex-col gap-2">
      {/* Zalo Button */}
      <a 
        href="https://zalo.me" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition transform hover:scale-105"
        title="Chat qua Zalo"
      >
        <BiChat className="text-xl sm:text-2xl" />
      </a>
      
      {/* Hotline Button */}
      <a 
        href="tel:19001234" 
        className="w-10 h-10 sm:w-11 sm:h-11 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition transform hover:scale-105"
        title="Gọi Hotline 1900 1234"
      >
        <BiSolidPhone className="text-xl sm:text-2xl" />
      </a>
      
      {/* Back to Top Button */}
      <button 
        onClick={scrollToTop}
        className={`w-10 h-10 sm:w-11 sm:h-11 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-800 transition transform hover:scale-105 ${
          showTopBtn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
        }`}
        title="Cuộn lên đầu trang"
      >
        <BiUpArrowAlt className="text-xl sm:text-2xl" />
      </button>
    </div>
  );
}

