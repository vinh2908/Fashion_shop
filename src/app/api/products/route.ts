import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { PRODUCTS } from '@/data/products';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// GET: Lấy danh sách sản phẩm (Tự động khởi tạo dữ liệu mẫu nếu DB trống)
export async function GET() {
  try {
    await connectToDatabase();

    let items = await Product.find({}).sort({ id: 1 }).lean();

    if (!items || items.length === 0) {
      await Product.insertMany(
        PRODUCTS.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          categoryName: p.categoryName,
          price: p.price,
          originalPrice: p.originalPrice || 0,
          stock: p.stock ?? 20,
          rating: p.rating ?? 5.0,
          reviewCount: p.reviewCount ?? 0,
          imageUrl: p.imageUrl,
          gallery: p.gallery || [p.imageUrl],
          description: p.description || '',
          colors: p.colors || ['Trắng', 'Đen'],
          sizes: p.sizes || ['S', 'M', 'L'],
          isFlashSale: p.isFlashSale ?? false,
          soldPercentage: p.soldPercentage ?? 0,
          isArchived: false,
        }))
      );
      items = await Product.find({}).sort({ id: 1 }).lean();
    }

    return NextResponse.json({ success: true, data: items });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    console.error('Error fetching products from MongoDB:', msg);
    return NextResponse.json(
      { success: false, message: msg, data: PRODUCTS },
      { status: 500 }
    );
  }
}

// POST: Thêm sản phẩm mới
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let nextId = body.id;
    if (!nextId) {
      const highest = await Product.findOne({}).sort({ id: -1 }).lean();
      nextId = (highest?.id || 0) + 1;
    }

    const newProduct = await Product.create({
      ...body,
      id: nextId,
      rating: body.rating ?? 5.0,
      reviewCount: body.reviewCount ?? 0,
      gallery: body.gallery || [body.imageUrl],
      colors: body.colors || ['Trắng', 'Đen'],
      sizes: body.sizes || ['S', 'M', 'L'],
      isArchived: false,
    });

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    console.error('Error adding product:', msg);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

// PUT: Cập nhật sản phẩm
export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, ...updates } = body;

    const updated = await Product.findOneAndUpdate({ id }, { $set: updates }, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    console.error('Error updating product:', msg);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

// DELETE: Xóa sản phẩm
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
    }

    await Product.deleteOne({ id });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    console.error('Error deleting product:', msg);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

