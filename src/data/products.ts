export interface ProductItem {
  id: number;
  name: string;
  category: number; // 1: Thiết bị nhà bếp, 2: Thiết bị vệ sinh & Làm sạch, 3: Thiết bị tiện ích & Đời sống, 4: Dụng cụ bàn ăn & Nhà bếp
  categoryName: string;
  price: number;
  originalPrice: number;
  stock: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  gallery: string[];
  description: string;
  colors: string[];
  sizes: string[]; // Phiên bản / Dung tích / Phân loại
  isFlashSale?: boolean;
  soldPercentage?: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  count: number;
  imageUrl: string;
  isVisible: boolean;
  isPinned: boolean;
  isArchived: boolean;
  description?: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 1,
    name: "Thiết bị nhà bếp",
    slug: "thiet-bi-nha-bep",
    count: 8,
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
    isVisible: true,
    isPinned: true,
    isArchived: false,
    description: "Nồi chiên không dầu, nồi cơm điện cao tần, bếp từ, máy xay sinh tố, ấm siêu tốc thông minh",
  },
  {
    id: 2,
    name: "Thiết bị vệ sinh & Làm sạch",
    slug: "thiet-bi-ve-sinh",
    count: 6,
    imageUrl: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&auto=format&fit=crop&q=80",
    isVisible: true,
    isPinned: true,
    isArchived: false,
    description: "Máy hút bụi không dây, robot lau nhà thông minh, máy lọc không khí, bàn là hơi nước",
  },
  {
    id: 3,
    name: "Thiết bị tiện ích & Đời sống",
    slug: "tien-ich-doi-song",
    count: 5,
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
    isVisible: true,
    isPinned: true,
    isArchived: false,
    description: "Quạt không cánh kháng khuẩn, máy tạo ẩm tinh dầu, đèn bàn bảo vệ thị lực, máy sưởi gốm",
  },
  {
    id: 4,
    name: "Dụng cụ bàn ăn & Nhà bếp",
    slug: "dung-cu-nha-bep",
    count: 5,
    imageUrl: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80",
    isVisible: true,
    isPinned: true,
    isArchived: false,
    description: "Bộ nồi chảo inox 304, chảo chống dính vân đá, bộ dao làm bếp kháng khuẩn, hộp thủy tinh chịu nhiệt",
  },
];

export const PRODUCTS: ProductItem[] = [
  {
    id: 1,
    name: "Nồi Chiên Không Dầu Điện Tử Smart Touch 6.5L",
    category: 1,
    categoryName: "Thiết bị nhà bếp",
    price: 1390000,
    originalPrice: 1990000,
    stock: 45,
    rating: 4.9,
    reviewCount: 238,
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Công nghệ Rapid Air đối lưu 360 độ giảm đến 85% chất béo. Màn hình cảm ứng 8 chế độ nấu cài sẵn, lòng nồi phủ chống dính Ceramic siêu bền, dung tích 6.5L nướng vừa nguyên con gà.",
    colors: ["Đen Nhám", "Trắng Ngọc Trai", "Xanh Rêu Titan"],
    sizes: ["Dung tích 5.5L", "Dung tích 6.5L", "Bản Cao Cấp 8.0L"],
    isFlashSale: true,
    soldPercentage: 84,
    isBestSeller: true,
  },
  {
    id: 2,
    name: "Nồi Cơm Điện Cao Tần IH 1.8L Lòng Nồi Niêu Men Gốm",
    category: 1,
    categoryName: "Thiết bị nhà bếp",
    price: 1850000,
    originalPrice: 2600000,
    stock: 35,
    rating: 4.9,
    reviewCount: 164,
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Gia nhiệt từ trường cảm ứng điện từ IH đa chiều hạt cơm chín đều, dẻo ngọt từng hạt. Lòng nồi gang niêu dày 3mm phủ men gốm chống dính cao cấp chống trầy xước.",
    colors: ["Trắng Bạc", "Đen Kim Cương", "Nâu Cafe"],
    sizes: ["1.2L (2-4 người)", "1.8L (4-8 người)"],
    isFlashSale: true,
    soldPercentage: 78,
    isBestSeller: true,
  },
  {
    id: 3,
    name: "Máy Xay Sinh Tố & Nấu Sữa Hạt Đa Năng 1.75L",
    category: 1,
    categoryName: "Thiết bị nhà bếp",
    price: 1250000,
    originalPrice: 1790000,
    stock: 40,
    rating: 4.8,
    reviewCount: 192,
    imageUrl: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Động cơ đồng nguyên chất 1000W tốc độ 58.000 vòng/phút. Cối thủy tinh Borosilicate chịu sốc nhiệt 300°C, dao 8 cánh Inox 304 xay nhuyễn mịn không cần lọc bã.",
    colors: ["Xanh Mint", "Trắng Sữa", "Đen Carbon"],
    sizes: ["Bản Tiêu Chuẩn 1.5L", "Bản Pro Nấu Cháo 1.75L"],
    isBestSeller: true,
  },
  {
    id: 4,
    name: "Bếp Từ Đôi Cảm Ứng Inverter Tiết Kiệm Điện SmartPro",
    category: 1,
    categoryName: "Thiết bị nhà bếp",
    price: 4590000,
    originalPrice: 6500000,
    stock: 20,
    rating: 5.0,
    reviewCount: 96,
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Mặt kính pha lê Kanger chịu lực chịu sốc nhiệt 800°C. Công nghệ biến tần Inverter kép tiết kiệm 35% điện năng, công suất Booster 2400W nấu siêu tốc, tự ngắt an toàn chống tràn.",
    colors: ["Đen Pha Lê"],
    sizes: ["Bếp Đôi Lắp Âm / Dương"],
    isFlashSale: true,
    soldPercentage: 92,
  },
  {
    id: 5,
    name: "Lò Vi Sóng Điện Tử Có Nướng Đối Lưu 25L",
    category: 1,
    categoryName: "Thiết bị nhà bếp",
    price: 2190000,
    originalPrice: 2950000,
    stock: 28,
    rating: 4.8,
    reviewCount: 85,
    imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Tích hợp 2 trong 1 vi sóng rã đông nhanh và nướng giòn đối lưu. Khoang lò tráng men kháng khuẩn EasyClean, khóa an toàn trẻ em và 11 mức công suất linh hoạt.",
    colors: ["Bạc Inox", "Đen Gương"],
    sizes: ["Dung tích 23L", "Dung tích 25L Có Nướng"],
    isNewArrival: true,
  },
  {
    id: 6,
    name: "Máy Ép Chậm Trục Vít Ép Kiệt Bã 98% UltraJuice",
    category: 1,
    categoryName: "Thiết bị nhà bếp",
    price: 1450000,
    originalPrice: 2100000,
    stock: 32,
    rating: 4.9,
    reviewCount: 140,
    imageUrl: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Công nghệ ép chậm 43 vòng/phút giữ trọn 99% vitamin và enzyme tự nhiên. Ống nạp nguyên quả đường kính lớn 85mm không cần cắt nhỏ, trục ép xoắn ốc vật liệu Tritan an toàn cho sức khỏe.",
    colors: ["Đỏ Ruby", "Xám Titan", "Trắng Sữa"],
    sizes: ["Bản Gia Đình Miệng Rộng 85mm"],
    isBestSeller: true,
  },
  {
    id: 7,
    name: "Nồi Áp Suất Điện Đa Năng 6L Smart Cooker 12 Chế Độ",
    category: 1,
    categoryName: "Thiết bị nhà bếp",
    price: 1350000,
    originalPrice: 1890000,
    stock: 30,
    rating: 4.8,
    reviewCount: 112,
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Hầm xương, ninh súp, nấu cháo, làm bánh chỉ với 1 nút bấm. Van xả áp an toàn tự động, áp suất cao 70kPa giúp thức ăn nhừ mềm nhanh hơn 70% và tiết kiệm năng lượng.",
    colors: ["Đen Bạc Inox", "Đồng Ánh Kim"],
    sizes: ["Dung tích 5.0L", "Dung tích 6.0L"],
    isNewArrival: true,
  },
  {
    id: 8,
    name: "Ấm Siêu Tốc Thủy Tinh Giữ Nhiệt 1.8L Đèn LED Tự Ngắt",
    category: 1,
    categoryName: "Thiết bị nhà bếp",
    price: 349000,
    originalPrice: 499000,
    stock: 70,
    rating: 4.7,
    reviewCount: 285,
    imageUrl: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Thân ấm thủy tinh cao cấp trong suốt chịu sốc nhiệt, đèn LED xanh dương phát sáng khi đun. Mâm nhiệt Inox 304 không bám cặn, công suất 1800W sôi nhanh trong 4 phút.",
    colors: ["Thủy Tinh Trong Suốt", "Viền Đen", "Viền Bạc"],
    sizes: ["Dung tích 1.8L"],
    isFlashSale: true,
    soldPercentage: 89,
    isBestSeller: true,
  },
  {
    id: 9,
    name: "Máy Hút Bụi Cầm Tay Không Dây Lực Hút 25000Pa Cyclone",
    category: 2,
    categoryName: "Thiết bị vệ sinh & Làm sạch",
    price: 1990000,
    originalPrice: 2890000,
    stock: 35,
    rating: 4.9,
    reviewCount: 310,
    imageUrl: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Động cơ không chổi than 450W lực hút bão 25.000Pa hút sạch bụi mịn và lông thú cưng. Pin Lithium dung lượng cao hoạt động liên tục 50 phút, bộ 4 đầu hút đa năng kèm lọc HEPA 5 lớp.",
    colors: ["Trắng Tinh Tế", "Xám Không Gian", "Đỏ Năng Động"],
    sizes: ["Bản Tiêu Chuẩn 4 Đầu Hút", "Bản Pro Thêm Đầu Diệt Khuẩn UV"],
    isFlashSale: true,
    soldPercentage: 86,
    isBestSeller: true,
  },
  {
    id: 10,
    name: "Robot Hút Bụi Lau Nhà Tự Động Định Vị Laser Lidar AI",
    category: 2,
    categoryName: "Thiết bị vệ sinh & Làm sạch",
    price: 5490000,
    originalPrice: 7900000,
    stock: 18,
    rating: 5.0,
    reviewCount: 128,
    imageUrl: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Điều hướng cảm biến Laser LDS Lidar lập bản đồ 3D ngôi nhà trong 5 phút. Lực hút 4000Pa kết hợp lau rung sóng âm đánh bay vết bẩn khô, tự động quay về trạm sạc khi hết pin, kết nối app thông minh.",
    colors: ["Trắng Sứ", "Đen Bóng"],
    sizes: ["Bản Tiêu Chuẩn Dock Sạc", "Bản Tự Động Đổ Bụi 30 Ngày"],
    isBestSeller: true,
  },
  {
    id: 11,
    name: "Máy Lọc Không Khí Phòng 50m² Màng Lọc HEPA H13 Khử Khuẩn",
    category: 2,
    categoryName: "Thiết bị vệ sinh & Làm sạch",
    price: 2490000,
    originalPrice: 3500000,
    stock: 25,
    rating: 4.9,
    reviewCount: 175,
    imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Màng lọc True HEPA H13 loại bỏ 99.97% bụi mịn PM2.5, phấn hoa, mùi ẩm mốc và khí formaldehyde. Cảm biến bụi laser hiển thị chỉ số không khí theo thời gian thực trên màn hình LED.",
    colors: ["Trắng Hiện Đại"],
    sizes: ["Phòng 30-45m²", "Phòng 50-70m²"],
    isNewArrival: true,
    isBestSeller: true,
  },
  {
    id: 12,
    name: "Bàn Là Hơi Nước Cầm Tay Du Lịch Công Suất 1500W Siêu Nhanh",
    category: 2,
    categoryName: "Thiết bị vệ sinh & Làm sạch",
    price: 489000,
    originalPrice: 699000,
    stock: 65,
    rating: 4.8,
    reviewCount: 220,
    imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Khởi động tạo hơi nước thần tốc chỉ sau 20 giây. Mặt ủi phủ Ceramic trơn mượt không kén vải, thiết kế gấp gọn thông minh tiện lợi mang đi công tác hoặc du lịch.",
    colors: ["Hồng Pastel", "Xanh Mint", "Trắng Sữa"],
    sizes: ["Gấp Gọn Du Lịch (Bình 200ml)"],
    isFlashSale: true,
    soldPercentage: 75,
  },
  {
    id: 13,
    name: "Máy Sấy Khử Trùng Khăn & Quần Áo Tia UV Mini Di Động",
    category: 2,
    categoryName: "Thiết bị vệ sinh & Làm sạch",
    price: 890000,
    originalPrice: 1290000,
    stock: 30,
    rating: 4.8,
    reviewCount: 88,
    imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Sấy khô khí nóng nhiệt độ ổn định 65°C kết hợp đèn UV khử trùng 99.9% vi khuẩn, nấm mốc trên quần áo sơ sinh, đồ lót, khăn mặt trong mùa nồm ẩm.",
    colors: ["Xanh Nhạt", "Trắng Kem"],
    sizes: ["Dung tích 10L", "Dung tích 15L"],
    isNewArrival: true,
  },
  {
    id: 14,
    name: "Cây Lau Nhà Thông Minh Tự Vắt Khô Xoay 360 Độ Cao Cấp",
    category: 2,
    categoryName: "Thiết bị vệ sinh & Làm sạch",
    price: 279000,
    originalPrice: 399000,
    stock: 80,
    rating: 4.7,
    reviewCount: 340,
    imageUrl: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Bàn lau chữ nhật siêu rộng 42cm với sợi microfiber thấm hút cực mạnh. Hệ thống con lăn răng cưa tự cạo sạch tóc rác và vắt khô kiệt nước mà không cần chạm tay bẩn.",
    colors: ["Trắng Xám", "Xanh Rêu"],
    sizes: ["Bộ 2 Bông Lau", "Bộ 4 Bông Lau"],
    isBestSeller: true,
  },
  {
    id: 15,
    name: "Quạt Không Cánh Lọc Không Khí Kháng Khuẩn 2 Trong 1",
    category: 3,
    categoryName: "Thiết bị tiện ích & Đời sống",
    price: 2890000,
    originalPrice: 4100000,
    stock: 22,
    rating: 4.9,
    reviewCount: 95,
    imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Thiết kế không cánh tuyệt đối an toàn cho trẻ nhỏ và thú cưng. Luồng gió êm dịu góc quay 90 độ, màng lọc ion bạc kháng khuẩn thanh lọc không khí, kèm remote điều khiển từ xa.",
    colors: ["Bạc Titan", "Trắng Tinh Khiết"],
    sizes: ["Chiều cao 90cm", "Chiều cao 110cm"],
    isFlashSale: true,
    soldPercentage: 80,
    isBestSeller: true,
  },
  {
    id: 16,
    name: "Máy Tạo Ẩm Khuếch Tán Tinh Dầu Siêu Âm 4L Chống Khô Da",
    category: 3,
    categoryName: "Thiết bị tiện ích & Đời sống",
    price: 520000,
    originalPrice: 750000,
    stock: 55,
    rating: 4.8,
    reviewCount: 168,
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Công nghệ sóng siêu âm phân tách hạt sương kích thước nano bay bổng giữ ẩm cho da và đường hô hấp trong phòng điều hòa. Bình chứa 4L phun sương liên tục 24h, đèn ngủ 7 màu thư giãn.",
    colors: ["Trắng Tối Giản", "Hồng Nhạt"],
    sizes: ["Bình chứa 3.5L", "Bình chứa 4.5L"],
    isNewArrival: true,
  },
  {
    id: 17,
    name: "Máy Sưởi Gốm Ceramic Để Bàn Tiết Kiệm Điện SmartHeat",
    category: 3,
    categoryName: "Thiết bị tiện ích & Đời sống",
    price: 690000,
    originalPrice: 980000,
    stock: 35,
    rating: 4.8,
    reviewCount: 110,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Thanh nhiệt gốm PTC làm ấm ngay sau 3 giây, không đốt cháy oxy không gây khô da hay chói mắt. Tự động ngắt điện khi nghiêng đổ, vỏ nhựa chống cháy ABS cách nhiệt tối đa.",
    colors: ["Trắng Bắc Âu", "Xanh Rêu"],
    sizes: ["Công suất 1200W", "Công suất 2000W Có Xoay"],
    isNewArrival: true,
  },
  {
    id: 18,
    name: "Đèn Bàn LED Chống Cận Thị Cảm Ứng 5 Chế Độ Ánh Sáng",
    category: 3,
    categoryName: "Thiết bị tiện ích & Đời sống",
    price: 380000,
    originalPrice: 550000,
    stock: 60,
    rating: 4.9,
    reviewCount: 245,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Chỉ số hoàn màu CRI Ra > 95 tái tạo ánh sáng mặt trời tự nhiên không gây mỏi mắt. Cảm ứng trượt chỉnh 5 mức nhiệt độ màu và độ sáng, tích hợp cổng sạc USB cho điện thoại.",
    colors: ["Trắng Tinh Tế", "Đen Sang Trọng"],
    sizes: ["Cắm Điện Trực Tiếp", "Tích Điện Pin 2000mAh"],
    isBestSeller: true,
  },
  {
    id: 19,
    name: "Ổ Cắm Điện Thông Minh Kết Nối Wifi Đo Điện Năng Tiêu Thụ",
    category: 3,
    categoryName: "Thiết bị tiện ích & Đời sống",
    price: 239000,
    originalPrice: 340000,
    stock: 90,
    rating: 4.8,
    reviewCount: 182,
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Hẹn giờ bật tắt bình nóng lạnh, quạt điện, máy lọc nước từ xa qua điện thoại bằng giọng nói (Google Home / Alexa). Chịu tải cao 16A 3500W, có màn hình thống kê lượng điện dùng hàng tháng.",
    colors: ["Trắng Chuẩn Chân Cắm Tròn"],
    sizes: ["16A 3500W Chân Đa Năng"],
    isBestSeller: true,
  },
  {
    id: 20,
    name: "Bộ Nồi Chảo Inox 304 5 Đáy Liền Thân Cao Cấp 5 Món",
    category: 4,
    categoryName: "Dụng cụ bàn ăn & Nhà bếp",
    price: 2490000,
    originalPrice: 3500000,
    stock: 24,
    rating: 5.0,
    reviewCount: 156,
    imageUrl: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584990347449-399097e3f890?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Cấu tạo 5 lớp đúc liền thân truyền nhiệt cực nhanh và giữ nhiệt lâu. Chất liệu Inox 304 tiêu chuẩn y tế không giải phóng chất độc hại khi nấu nướng, nắp kính cường lực chịu va đập, dùng tốt trên mọi loại bếp từ.",
    colors: ["Bạc Inox Gương"],
    sizes: ["Bộ 3 Nồi + 1 Quánh + 1 Chảo", "Bộ 3 Nồi Cơ Bản"],
    isFlashSale: true,
    soldPercentage: 88,
    isBestSeller: true,
  },
  {
    id: 21,
    name: "Chảo Chống Dính Vân Đá Y Tế Đáy Từ Size 28cm Sâu Lòng",
    category: 4,
    categoryName: "Dụng cụ bàn ăn & Nhà bếp",
    price: 469000,
    originalPrice: 650000,
    stock: 45,
    rating: 4.9,
    reviewCount: 198,
    imageUrl: "https://images.unsplash.com/photo-1584990347449-399097e3f890?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584990347449-399097e3f890?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Phủ 6 lớp đá Maifan khoáng tự nhiên kháng khuẩn, chiên xào không cần dầu mỡ. Đáy từ đúc nguyên khối chống phồng đáy, tay cầm cán gỗ cách nhiệt sang trọng.",
    colors: ["Đá Đen Maifan", "Đá Trắng Ceramic"],
    sizes: ["Size 24cm Cạn Lòng", "Size 28cm Sâu Lòng"],
    isNewArrival: true,
    isBestSeller: true,
  },
  {
    id: 22,
    name: "Bộ Dao Làm Bếp Thép Không Gỉ Đức 6 Món Kèm Khối Gỗ Đựng",
    category: 4,
    categoryName: "Dụng cụ bàn ăn & Nhà bếp",
    price: 790000,
    originalPrice: 1150000,
    stock: 30,
    rating: 4.9,
    reviewCount: 115,
    imageUrl: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Thép tôi lạnh chống gỉ carbon cao giữ lưỡi sắc bén gấp 3 lần dao thông thường. Bộ gồm: dao chặt, dao thái thịt, dao gọt hoa quả, kéo cắt gà, cây mài dao và đế cắm gỗ tự nhiên.",
    colors: ["Thép Bạc Vân Damascus"],
    sizes: ["Bộ 6 Món Cao Cấp"],
    isFlashSale: true,
    soldPercentage: 72,
  },
  {
    id: 23,
    name: "Bộ 5 Hộp Thủy Tinh Chịu Nhiệt Nắp Khóa Chống Tràn LockBox",
    category: 4,
    categoryName: "Dụng cụ bàn ăn & Nhà bếp",
    price: 329000,
    originalPrice: 470000,
    stock: 50,
    rating: 4.8,
    reviewCount: 260,
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Thủy tinh Borosilicate chịu nhiệt đến 400°C an toàn tuyệt đối trong lò nướng, lò vi sóng, máy rửa bát. Nắp đậy có gioăng silicon kín khí 100% chống tràn canh thức ăn khi mang cơm đi làm.",
    colors: ["Nắp Trong Viền Xanh", "Nắp Trong Viền Trắng"],
    sizes: ["Set 5 Hộp (Từ 370ml Đến 1000ml)"],
    isBestSeller: true,
  },
  {
    id: 24,
    name: "Kệ Chén Bát Đa Năng Thông Minh Inox 304 Phủ Sơn Tĩnh Điện",
    category: 4,
    categoryName: "Dụng cụ bàn ăn & Nhà bếp",
    price: 680000,
    originalPrice: 950000,
    stock: 35,
    rating: 4.9,
    reviewCount: 145,
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Đặt gọn gàng trên bồn rửa chén bát, nước nhỏ trực tiếp xuống bồn không lo đọng bẩn mặt bếp. Chất liệu thép không gỉ dày chịu tải 60kg, kèm giá để dao thớt, ống cắm đũa thìa và khay để nước rửa chén.",
    colors: ["Đen Sơn Tĩnh Điện", "Trắng Tinh Tế"],
    sizes: ["Kích thước 65cm (Bồn Đơn)", "Kích thước 85cm (Bồn Đôi)"],
    isNewArrival: true,
    isBestSeller: true,
  },
];

