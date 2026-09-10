"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import {
  BiShoppingBag,
  BiHeart,
  BiSolidHeart,
  BiShareAlt,
  BiCheckShield,
  BiCheckCircle,
  BiRefresh,
  BiStar,
  BiRightArrowAlt,
  BiArrowBack
} from "react-icons/bi";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params?.id);
  const { addToCart, isWishlisted, toggleWishlist, showToast, products, user, addReview, getProductReviews } = useShop();
  const product = (products && products.length > 0 ? products : PRODUCTS).find((p) => p.id === productId) || PRODUCTS.find((p) => p.id === productId);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "Trắng");
  const [selectedImage, setSelectedImage] = useState(product?.imageUrl || "");
  const [activeTab, setActiveTab] = useState<"desc" | "reviews" | "shipping">("desc");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [hoverRating, setHoverRating] = useState(0);


  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Không tìm thấy sản phẩm!</h2>
        <p className="text-slate-500 mb-6">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã ngừng kinh doanh.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-rose-600 text-white font-bold px-6 py-3 rounded-xl shadow hover:bg-rose-700 transition"
        >
          <BiArrowBack /> Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Đã sao chép liên kết sản phẩm!", "success");
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="text-xs md:text-sm text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-rose-600 transition">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-rose-600 transition">Sản phẩm</Link>
        <span>/</span>
        <Link href={`/products?cat=${product.category}`} className="hover:text-rose-600 transition">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Box */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Gallery Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 relative shadow-inner">
              <img
                src={selectedImage || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white font-black text-xs px-3 py-1.5 rounded-full shadow-lg">
                  SALE -{discountPercent}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[product.imageUrl, ...product.gallery].map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${
                      (selectedImage || product.imageUrl) === img
                        ? "border-rose-600 shadow-md ring-2 ring-rose-600/30"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-black uppercase text-rose-600 tracking-wider mb-2">
                {product.categoryName}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 leading-snug">
                {product.name}
              </h1>

              {/* Rating & Stock Info */}
              <div className="flex items-center gap-4 text-xs mb-5 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-1 text-amber-400">
                  <BiStar />
                  <span className="font-bold text-slate-800 text-sm">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewCount} đánh giá)</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <BiCheckCircle /> Còn hàng ({product.stock} sản phẩm)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl sm:text-4xl font-black text-rose-600">
                  {product.price.toLocaleString("vi-VN")}đ
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base sm:text-lg text-slate-400 line-through">
                    {product.originalPrice.toLocaleString("vi-VN")}đ
                  </span>
                )}
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  Tiết kiệm {(product.originalPrice - product.price).toLocaleString("vi-VN")}đ
                </span>
              </div>

              {/* Short Description */}
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Color Selector */}
              <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Màu sắc: <span className="text-rose-600 font-semibold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl border transition ${
                        selectedColor === color
                          ? "border-rose-600 bg-rose-50 text-rose-700 font-bold ring-2 ring-rose-600/20"
                          : "border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Phiên bản / Dung tích: <span className="text-rose-600 font-semibold">{selectedSize}</span>
                  </label>
                  <button
                    onClick={() => showToast("Sản phẩm bảo hành chính hãng 12-24 tháng. Đổi mới 30 ngày nếu phát sinh lỗi kỹ thuật!", "info")}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Chính sách bảo hành
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 h-11 text-xs font-bold rounded-xl border transition flex items-center justify-center ${
                        selectedSize === size
                          ? "border-rose-600 bg-rose-600 text-white shadow-md shadow-rose-600/30"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 bg-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center gap-2.5">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden h-12 bg-slate-50 flex-1 sm:flex-initial">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 sm:w-11 h-full text-slate-600 hover:bg-slate-200 font-bold transition flex items-center justify-center text-lg"
                      >
                        -
                      </button>
                      <span className="w-10 sm:w-12 text-center font-bold text-sm text-slate-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 sm:w-11 h-full text-slate-600 hover:bg-slate-200 font-bold transition flex items-center justify-center text-lg"
                      >
                        +
                      </button>
                    </div>

                    {/* Wishlist button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center transition flex-shrink-0 ${
                        isWishlisted(product.id)
                          ? "border-rose-200 bg-rose-50 text-rose-600"
                          : "border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200"
                      }`}
                      title="Yêu thích"
                    >
                      {isWishlisted(product.id) ? (
                        <BiSolidHeart className="text-2xl text-rose-600" />
                      ) : (
                        <BiHeart className="text-2xl" />
                      )}
                    </button>

                    {/* Share button */}
                    <button
                      onClick={handleShare}
                      className="w-12 h-12 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 flex items-center justify-center transition flex-shrink-0"
                      title="Chia sẻ"
                    >
                      <BiShareAlt className="text-xl" />
                    </button>
                  </div>

                  {/* Add to cart main button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 h-12 px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 transition transform hover:-translate-y-0.5 whitespace-nowrap text-sm sm:text-base"
                  >
                    <BiShoppingBag className="text-xl sm:text-2xl flex-shrink-0" />
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                </div>

                <Link
                  href="/cart"
                  onClick={handleAddToCart}
                  className="block w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-center rounded-xl transition shadow"
                >
                  Mua ngay với giá {(product.price * quantity).toLocaleString("vi-VN")}đ
                </Link>
              </div>
            </div>

            {/* Commitments & Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <BiCheckShield className="text-emerald-500 text-xl flex-shrink-0" />
                <span>100% Chính Hãng</span>
              </div>
              <div className="flex items-center gap-2">
                <BiRefresh className="text-blue-500 text-xl flex-shrink-0" />
                <span>Đổi trả 30 ngày tận nhà</span>
              </div>
              <div className="flex items-center gap-2">
                <BiCheckCircle className="text-rose-500 text-xl flex-shrink-0" />
                <span>Kiểm hàng trước nhận</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Reviews, Shipping Policy */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
        <div className="flex border-b border-slate-200 gap-6 mb-6">
          <button
            onClick={() => setActiveTab("desc")}
            className={`pb-3 text-sm font-bold transition border-b-2 ${
              activeTab === "desc"
                ? "border-rose-600 text-rose-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Mô Tả Sản Phẩm
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 text-sm font-bold transition border-b-2 ${
              activeTab === "reviews"
                ? "border-rose-600 text-rose-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Đánh Giá Khách Hàng ({product.reviewCount})
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`pb-3 text-sm font-bold transition border-b-2 ${
              activeTab === "shipping"
                ? "border-rose-600 text-rose-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Chính Sách Giao Hàng & Đổi Trả
          </button>
        </div>

        {activeTab === "desc" && (
          <div className="prose max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
            <p>
              {product.name} là dòng thiết bị gia dụng cao cấp phân phối chính hãng bởi HomeLiving, tích hợp công nghệ hiện đại mang đến trải nghiệm sống tiện nghi, an toàn và tiết kiệm điện năng.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Chất liệu & Cấu tạo:</strong> Thép không gỉ Inox 304, nhựa nguyên sinh ABS/PP chịu nhiệt và kính cường lực cao cấp đạt tiêu chuẩn an toàn sức khỏe.</li>
              <li><strong>Động cơ & Tiết kiệm điện:</strong> Vận hành êm ái, công nghệ biến tần Inverter tiết kiệm năng lượng tối ưu.</li>
              <li><strong>Tính năng an toàn:</strong> Cảm biến tự động ngắt khi quá nhiệt, quá tải điện hoặc khi bị nghiêng đổ.</li>
              <li><strong>Bảo hành & Hậu mãi:</strong> Bảo hành chính hãng 12 - 24 tháng, hỗ trợ 1 đổi 1 tận nơi trong 30 ngày nếu có lỗi từ nhà sản xuất.</li>
            </ul>
          </div>
        )}

        {activeTab === "reviews" && (() => {
          const productReviews = getProductReviews(productId);
          const allReviews = [
            ...productReviews,
            {
              id: "static-1",
              userName: "Hoàng Mai Linh",
              rating: 5,
              content: "Sản phẩm hoàn thiện rất tỉ mỉ, cầm đầm tay chắc chắn. Dùng thử thấy máy hoạt động êm, tiết kiệm điện và làm sạch/nấu nướng cực kỳ nhanh gọn. Shop đóng gói nhiều lớp mút xốp cẩn thận!",
              createdAt: "2 ngày trước",
            },
            {
              id: "static-2",
              userName: "Trần Quốc Bảo",
              rating: 5,
              content: "Đã mua món thứ 2 ở HomeLiving, lần nào cũng ưng ý. Hàng chính hãng có tem bảo hành đầy đủ, nhân viên tư vấn nhiệt tình. Sẽ giới thiệu cho bạn bè và người thân!",
              createdAt: "1 tuần trước",
            },
          ];

          const handleSubmitReview = (e: React.FormEvent) => {
            e.preventDefault();
            if (!reviewContent.trim()) {
              showToast("Vui lòng nhập nội dung đánh giá!", "error");
              return;
            }
            addReview(productId, reviewRating, reviewContent.trim());
            setReviewContent("");
            setReviewRating(5);
          };

          return (
            <div className="space-y-6">
              {/* Rating Summary */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                <div className="text-3xl font-black text-slate-900">{product.rating}</div>
                <div>
                  <div className="flex text-amber-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <BiStar key={i} />
                    ))}
                  </div>
                  <div className="text-xs text-slate-500">Dựa trên {product.reviewCount + productReviews.length} đánh giá từ người mua thực tế</div>
                </div>
              </div>

              {/* Review Form */}
              {user ? (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-4">✍️ Viết đánh giá của bạn</h4>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* Star Rating */}
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Chất lượng sản phẩm</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="text-2xl transition-transform hover:scale-110"
                          >
                            <BiStar
                              className={`${
                                star <= (hoverRating || reviewRating)
                                  ? "text-amber-400"
                                  : "text-slate-300"
                              } transition-colors`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-xs text-slate-500 self-center">
                          {["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Xuất sắc"][hoverRating || reviewRating]}
                        </span>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Nội dung đánh giá</label>
                      <textarea
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm thực tế của bạn về sản phẩm (chất liệu, size, màu sắc, giao hàng...)..."
                        rows={4}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-rose-600/20"
                    >
                      Gửi đánh giá
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center">
                  <p className="text-slate-500 text-sm mb-3">
                    Bạn cần đăng nhập để có thể đánh giá sản phẩm
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition"
                  >
                    Đăng nhập để đánh giá
                  </Link>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {allReviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900">{review.userName}</span>
                      <span className="text-xs text-slate-400">{review.createdAt}</span>
                    </div>
                    <div className="flex text-amber-400 text-xs mb-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <BiStar key={i} />
                      ))}
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {activeTab === "shipping" && (
          <div className="text-slate-600 text-sm space-y-3 leading-relaxed">
            <p>
              🚚 <strong>Miễn phí vận chuyển</strong> toàn quốc cho đơn hàng có giá trị từ 500.000đ trở lên.
            </p>
            <p>
              ⚡ <strong>Thời gian giao hàng:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Nội thành Hà Nội & TP.HCM: Nhận hàng trong vòng 24 giờ.</li>
              <li>Các tỉnh thành khác: 2 - 3 ngày làm việc.</li>
            </ul>
            <p>
              🔄 <strong>Chính sách đổi trả:</strong> Đổi trả miễn phí trong vòng 30 ngày nếu sản phẩm có lỗi từ nhà sản xuất hoặc không vừa size. Nhân viên bưu điện sẽ đến tận nhà thu hồi và đổi sản phẩm mới cho quý khách.
            </p>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Sản Phẩm Cùng Danh Mục
            </h2>
            <Link
              href={`/products?cat=${product.category}`}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
            >
              Xem tất cả <BiRightArrowAlt />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group"
              >
                <Link href={`/products/${rel.id}`} className="aspect-[3/4] overflow-hidden bg-slate-100 relative">
                  <img
                    src={rel.imageUrl}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2 hover:text-rose-600 transition">
                    <Link href={`/products/${rel.id}`}>{rel.name}</Link>
                  </h3>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-rose-600 font-extrabold text-sm">
                      {rel.price.toLocaleString("vi-VN")}đ
                    </span>
                    <button
                      onClick={() => addToCart(rel, 1, rel.sizes[0], rel.colors[0])}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 transition"
                      title="Thêm vào giỏ"
                    >
                      <BiShoppingBag className="text-base" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


