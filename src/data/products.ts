export interface ProductItem {
  id: number;
  name: string;
  category: number; // 1: Áo, 2: Quần & Váy, 3: Váy thiết kế, 4: Phụ kiện
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
  sizes: string[];
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
    name: "Áo thời trang",
    slug: "ao-thoi-trang",
    count: 6,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
    isVisible: true,
    isPinned: true,
    isArchived: false,
    description: "Bộ sưu tập áo thun, sơ mi, áo khoác hiện đại",
  },
  {
    id: 2,
    name: "Quần phong cách",
    slug: "quan-phong-cach",
    count: 4,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=80",
    isVisible: true,
    isPinned: true,
    isArchived: false,
    description: "Quần jean, quần tây âu, short năng động",
  },
  {
    id: 3,
    name: "Váy thiết kế",
    slug: "vay-thiet-ke",
    count: 4,
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=80",
    isVisible: true,
    isPinned: true,
    isArchived: false,
    description: "Váy hoa, váy công sở, đầm dạ tiệc thanh lịch",
  },
  {
    id: 4,
    name: "Phụ kiện cao cấp",
    slug: "phu-kien",
    count: 3,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    isVisible: true,
    isPinned: true,
    isArchived: false,
    description: "Túi xách da, thắt lưng, phụ kiện thời trang",
  },
];

export const PRODUCTS: ProductItem[] = [
  {
    id: 1,
    name: "Áo Thun Nam Cotton 100% Premium",
    category: 1,
    categoryName: "Áo thời trang",
    price: 199000,
    originalPrice: 285000,
    stock: 50,
    rating: 4.9,
    reviewCount: 124,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Áo thun nam chất liệu 100% cotton dệt kim compact siêu mềm mịn, thấm hút mồ hôi tối ưu, không xù lông và giữ form cực tốt.",
    colors: ["Trắng", "Đen", "Xám"],
    sizes: ["S", "M", "L", "XL"],
    isFlashSale: true,
    soldPercentage: 82,
    isBestSeller: true,
  },
  {
    id: 2,
    name: "Áo Sơ Mi Nam Linen Thanh Lịch",
    category: 1,
    categoryName: "Áo thời trang",
    price: 399000,
    originalPrice: 570000,
    stock: 30,
    rating: 4.8,
    reviewCount: 95,
    imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Áo sơ mi nam chất vải Linen tơ tằm thoáng nhẹ, tông màu trang nhã, hoàn hảo cho phong cách công sở và dạo phố cuối tuần.",
    colors: ["Trắng", "Xanh nhạt", "Be"],
    sizes: ["M", "L", "XL", "XXL"],
    isFlashSale: true,
    soldPercentage: 74,
    isBestSeller: true,
  },
  {
    id: 3,
    name: "Quần Jean Nam Slim Fit Hàn Quốc",
    category: 2,
    categoryName: "Quần phong cách",
    price: 599000,
    originalPrice: 855000,
    stock: 40,
    rating: 4.9,
    reviewCount: 210,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Quần jean nam dáng Slim Fit ôm vừa tôn dáng, chất denim co giãn 4 chiều vận động linh hoạt, xử lý wash màu hiện đại.",
    colors: ["Xanh đậm", "Xanh nhạt", "Đen"],
    sizes: ["29", "30", "31", "32"],
    isBestSeller: true,
  },
  {
    id: 4,
    name: "Quần Short Nam Vải Dù Thể Thao",
    category: 2,
    categoryName: "Quần phong cách",
    price: 249000,
    originalPrice: 350000,
    stock: 60,
    rating: 4.7,
    reviewCount: 68,
    imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Quần short nam chất liệu vải dù gió kháng nước nhẹ, khô siêu nhanh, túi khoá kéo tiện lợi cho tập gym và chạy bộ.",
    colors: ["Đen", "Xám than", "Xanh rêu"],
    sizes: ["M", "L", "XL"],
    isFlashSale: true,
    soldPercentage: 90,
  },
  {
    id: 5,
    name: "Váy Hoa Nhí Dáng Dài Vintage Nữ",
    category: 3,
    categoryName: "Váy thiết kế",
    price: 489000,
    originalPrice: 699000,
    stock: 25,
    rating: 5.0,
    reviewCount: 142,
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Váy maxi voan hoa nhí thiết kế chiết eo tôn dáng tiểu thư dịu dàng, lớp lót lụa mềm mại chống dính, tay bồng thanh thoát.",
    colors: ["Hồng Pastel", "Xanh Ngọc", "Vàng Kem"],
    sizes: ["S", "M", "L"],
    isNewArrival: true,
    isBestSeller: true,
  },
  {
    id: 6,
    name: "Váy Công Sở Nữ Dáng Bút Chì Cao Cấp",
    category: 3,
    categoryName: "Váy thiết kế",
    price: 549000,
    originalPrice: 785000,
    stock: 20,
    rating: 4.9,
    reviewCount: 88,
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Váy bút chì công sở phối cúc ngọc trai sang trọng, chất vải thun tuyết mưa dày dặn không nhăn nhàu, tôn trọn đường cong.",
    colors: ["Đen Huyền Bí", "Đỏ Đô", "Trắng Kem"],
    sizes: ["S", "M", "L"],
    isFlashSale: true,
    soldPercentage: 65,
  },
  {
    id: 7,
    name: "Áo Khoác Denim Unisex Oversize",
    category: 1,
    categoryName: "Áo thời trang",
    price: 699000,
    originalPrice: 990000,
    stock: 35,
    rating: 4.8,
    reviewCount: 175,
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Áo khoác bò denim dày dặn phong cách streetwear bụi bặm, cúc kim loại chống gỉ, form rộng cực chất cho cả nam và nữ.",
    colors: ["Xanh Nhạt Bụi", "Xanh Cổ Điển"],
    sizes: ["M", "L", "XL"],
    isNewArrival: true,
  },
  {
    id: 8,
    name: "Áo Hoodie Nữ Form Rộng Pastel",
    category: 1,
    categoryName: "Áo thời trang",
    price: 449000,
    originalPrice: 620000,
    stock: 45,
    rating: 4.9,
    reviewCount: 230,
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Áo nỉ có mũ chui đầu lót bông tuyết giữ ấm tuyệt đối, túi kangaroo tiện lợi, màu sắc trẻ trung ngọt ngào.",
    colors: ["Tím Pastel", "Hồng Baby", "Xanh Bơ"],
    sizes: ["FreeSize (<65kg)"],
    isNewArrival: true,
  },
  {
    id: 9,
    name: "Áo Sơ Mi Nữ Lụa Satin Hàn Quốc",
    category: 1,
    categoryName: "Áo thời trang",
    price: 349000,
    originalPrice: 499000,
    stock: 38,
    rating: 4.9,
    reviewCount: 112,
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Áo sơ mi lụa satin ngọc trai mềm mại, thoáng mát, tạo vẻ đẹp quý phái và nữ tính nơi công sở.",
    colors: ["Trắng Sữa", "Champagne", "Đen"],
    sizes: ["S", "M", "L"],
    isBestSeller: true,
  },
  {
    id: 10,
    name: "Quần Tây Nữ Cạp Cao Ống Rộng",
    category: 2,
    categoryName: "Quần phong cách",
    price: 389000,
    originalPrice: 550000,
    stock: 44,
    rating: 4.8,
    reviewCount: 93,
    imageUrl: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Quần âu nữ dáng suông cạp cao hack chân dài miên man, chất vải trượt hàn quốc rủ suông tôn dáng đứng form.",
    colors: ["Đen", "Nâu Tây", "Trắng Kem"],
    sizes: ["S", "M", "L", "XL"],
    isNewArrival: true,
  },
  {
    id: 11,
    name: "Váy Dự Tiệc Lệch Vai Quyến Rũ",
    category: 3,
    categoryName: "Váy thiết kế",
    price: 689000,
    originalPrice: 980000,
    stock: 15,
    rating: 5.0,
    reviewCount: 45,
    imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Váy thiết kế lệch vai cao cấp đính sequin nhẹ nhàng, xẻ tà tinh tế giúp quý cô tỏa sáng trong mọi dạ tiệc.",
    colors: ["Đỏ Rượu", "Đen Sang Trọng"],
    sizes: ["S", "M"],
    isNewArrival: true,
  },
  {
    id: 12,
    name: "Túi Xách Da Nữ Đeo Chéo Mini",
    category: 4,
    categoryName: "Phụ kiện cao cấp",
    price: 499000,
    originalPrice: 720000,
    stock: 28,
    rating: 4.9,
    reviewCount: 82,
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Túi xách da PU cao cấp khóa xoay mạ vàng chống trầy, quai xích kim loại chắc chắn phối kèm dây da êm ái.",
    colors: ["Nâu Bò", "Đen", "Trắng Be"],
    sizes: ["One Size"],
    isBestSeller: true,
  }
];

