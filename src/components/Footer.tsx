"use client";

import Link from "next/link";
import { 
  BiEnvelope, 
  BiHome, 
  BiChevronRight,
  BiSolidMapPin,
  BiSolidPhone,
  BiSolidEnvelope,
  BiSolidTime,
} from "react-icons/bi";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

import { usePathname } from 'next/navigation';
import { useShop } from "@/context/ShopContext";

export default function Footer() {
  const pathname = usePathname();
  const { showToast } = useShop();

  if (pathname?.startsWith('/admin')) return null;

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    showToast("Đăng ký nhận tin thành công! Bạn nhận được mã voucher: GIADUNG10 (-10%)", "success");
    form.reset();
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-12">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Newsletter Box */}
        <div className="bg-gray-800 rounded-2xl p-6 md:p-8 mb-10 border border-gray-700 shadow-lg">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="lg:w-1/2">
              <h5 className="text-white font-bold text-xl mb-2 flex items-center">
                <BiEnvelope className="text-red-500 mr-2 text-2xl" />
                Đăng ký nhận ưu đãi gia dụng độc quyền
              </h5>
              <p className="text-gray-400 text-sm">Nhận ngay voucher giảm 10% cho đơn hàng đầu tiên và thông báo khuyến mãi thiết bị gia đình mới nhất.</p>
            </div>
            <div className="lg:w-1/2 w-full">
              <form onSubmit={handleSubscribe} className="flex w-full">
                <input 
                  type="email" 
                  required
                  placeholder="Nhập địa chỉ email của bạn..." 
                  className="bg-gray-900 border border-gray-600 text-white px-4 py-3 rounded-l-md focus:outline-none focus:border-red-500 flex-grow"
                />
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-r-md transition">
                  Đăng Ký
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
          
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
              <BiHome className="text-red-500" /> HomeLiving
            </div>
            <p className="text-gray-400 mb-6 pr-4">
              Hệ thống phân phối thiết bị gia dụng thông minh, đồ dùng nhà bếp và tiện ích gia đình cao cấp. Tiện nghi, bền bỉ và nâng tầm không gian sống cho mọi gia đình Việt.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-red-600 transition" title="Facebook">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-red-600 transition" title="Instagram">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-red-600 transition" title="TikTok">
                <FaTiktok className="text-xl" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-red-600 transition" title="YouTube">
                <FaYoutube className="text-xl" />
              </a>
            </div>
          </div>
          
          <div className="lg:col-span-3 col-span-1">
            <h6 className="text-white font-bold text-lg mb-4 uppercase">Danh mục gia dụng</h6>
            <ul className="space-y-3">
              <li><Link href="/products?cat=1" className="hover:text-red-400 transition flex items-center"><BiChevronRight className="mr-1 text-xs"/> Thiết bị nhà bếp</Link></li>
              <li><Link href="/products?cat=2" className="hover:text-red-400 transition flex items-center"><BiChevronRight className="mr-1 text-xs"/> Thiết bị vệ sinh & Làm sạch</Link></li>
              <li><Link href="/products?cat=3" className="hover:text-red-400 transition flex items-center"><BiChevronRight className="mr-1 text-xs"/> Thiết bị tiện ích & Đời sống</Link></li>
              <li><Link href="/products?cat=4" className="hover:text-red-400 transition flex items-center"><BiChevronRight className="mr-1 text-xs"/> Dụng cụ bàn ăn & Nhà bếp</Link></li>
              <li><Link href="/products" className="hover:text-red-400 transition flex items-center"><BiChevronRight className="mr-1 text-xs"/> Tất cả sản phẩm</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-2 col-span-1">
            <h6 className="text-white font-bold text-lg mb-4 uppercase">Hỗ trợ khách hàng</h6>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-red-400 transition flex items-center"><BiChevronRight className="mr-1 text-xs"/> Hướng dẫn mua hàng</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition flex items-center"><BiChevronRight className="mr-1 text-xs"/> Chính sách bảo hành 12-24 tháng</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition flex items-center"><BiChevronRight className="mr-1 text-xs"/> Chính sách đổi mới 30 ngày</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition flex items-center"><BiChevronRight className="mr-1 text-xs"/> Hướng dẫn lắp đặt & Sử dụng</Link></li>
              <li><Link href="/order-history" className="hover:text-red-400 transition flex items-center"><BiChevronRight className="mr-1 text-xs"/> Tra cứu đơn hàng</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-3 md:col-span-2">
            <h6 className="text-white font-bold text-lg mb-4 uppercase">Thông tin liên hệ</h6>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <BiSolidMapPin className="mt-1 text-red-500 text-lg flex-shrink-0" />
                <span>Showroom: 123 Đường Cầu Giấy, Quận Cầu Giấy, TP. Hà Nội</span>
              </div>
              <div className="flex items-start gap-3">
                <BiSolidPhone className="mt-1 text-red-500 text-lg flex-shrink-0" />
                <span>Hotline: <strong className="text-white">1900 1234</strong> (08:30 - 22:00)</span>
              </div>
              <div className="flex items-start gap-3">
                <BiSolidEnvelope className="mt-1 text-red-500 text-lg flex-shrink-0" />
                <span>Email: support@homeliving.vn</span>
              </div>
              <div className="flex items-start gap-3">
                <BiSolidTime className="mt-1 text-red-500 text-lg flex-shrink-0" />
                <span>Mở cửa: 08:30 - 22:00 tất cả các ngày</span>
              </div>
            </div>
          </div>
          
        </div>
        
        <hr className="border-gray-800 my-6" />
        
        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="text-center md:text-left text-gray-500">
            &copy; {new Date().getFullYear()} <strong className="text-gray-400">HomeLiving</strong>. Tất cả quyền được bảo lưu. Đã đăng ký với Bộ Công Thương.
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-2">
            <span className="mr-2 text-gray-500">Chấp nhận thanh toán:</span>
            <span className="bg-gray-800 text-gray-400 px-2 py-1 rounded text-xs font-semibold">COD</span>
            <span className="bg-gray-800 text-gray-400 px-2 py-1 rounded text-xs font-semibold">VNPay QR</span>
            <span className="bg-gray-800 text-gray-400 px-2 py-1 rounded text-xs font-semibold">MoMo</span>
            <span className="bg-gray-800 text-gray-400 px-2 py-1 rounded text-xs font-semibold">Visa/Master</span>
          </div>
        </div>
        
      </div>
    </footer>
  );
}

