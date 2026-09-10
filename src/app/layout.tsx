import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import { ShopProvider } from "@/context/ShopContext";
import ToastContainer from "@/components/ToastContainer";
import QuickViewModal from "@/components/QuickViewModal";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta"
});

export const metadata: Metadata = {
  title: "HomeLiving - Siêu Thị Đồ Gia Dụng & Thiết Bị Thông Minh",
  description: "Hệ thống phân phối thiết bị nhà bếp, đồ gia dụng thông minh và tiện ích gia đình cao cấp chính hãng, bảo hành 12 - 24 tháng.",
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
        </ShopProvider>
      </body>
    </html>
  );
}

