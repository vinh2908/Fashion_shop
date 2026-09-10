import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import { ShopProvider } from "@/context/ShopContext";
import ToastContainer from "@/components/ToastContainer";
import QuickViewModal from "@/components/QuickViewModal";
import SocialProofPopup from "@/components/SocialProofPopup";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta"
});

export const metadata: Metadata = {
  title: "FashionStore - Cửa Hàng Thời Trang Cao Cấp",
  description: "Thương hiệu thời trang cao cấp mang phong cách hiện đại, thanh lịch và dẫn đầu xu hướng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${plusJakartaSans.variable} font-sans antialiased bg-slate-50 text-slate-900 flex flex-col min-h-screen selection:bg-rose-500 selection:text-white`}>
        <ShopProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <FloatingWidgets />
          <ToastContainer />
          <QuickViewModal />
          <SocialProofPopup />
        </ShopProvider>
      </body>
    </html>
  );
}

