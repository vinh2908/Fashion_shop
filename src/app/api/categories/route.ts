import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Category } from '@/models/Category';
import { CATEGORIES } from '@/data/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// GET: Lấy danh sách danh mục (Tự động khởi tạo dữ liệu mẫu nếu DB trống, hỗ trợ ?reset=true)
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const shouldReset = searchParams.get('reset') === 'true';

    let items = await Category.find({}).sort({ id: 1 }).lean();

    // Auto-seed hoặc reset sang danh mục gia dụng
    if (shouldReset || !items || items.length === 0) {
      if (shouldReset) {
        await Category.deleteMany({});
      }
      await Category.insertMany(
        CATEGORIES.map((c) => ({
          id: c.id,
          name: c.name,
          imageUrl: c.imageUrl,
          description: c.description || '',
          isPinned: c.isPinned ?? true,
          isVisible: c.isVisible ?? true,
          isArchived: c.isArchived ?? false,
        }))
      );
      items = await Category.find({}).sort({ id: 1 }).lean();
    }

    return NextResponse.json({ success: true, data: items }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    console.error('Error fetching categories from MongoDB:', msg);
    return NextResponse.json(
      { success: false, message: msg, data: CATEGORIES },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

// POST: Thêm danh mục mới hoặc reset
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (body.action === 'reset') {
      await Category.deleteMany({});
      const inserted = await Category.insertMany(
        CATEGORIES.map((c) => ({
          id: c.id,
          name: c.name,
          imageUrl: c.imageUrl,
          description: c.description || '',
          isPinned: c.isPinned ?? true,
          isVisible: c.isVisible ?? true,
          isArchived: c.isArchived ?? false,
        }))
      );
      return NextResponse.json({ success: true, data: inserted });
    }

    let nextId = body.id;
    if (!nextId) {
      const highest = await Category.findOne({}).sort({ id: -1 }).lean();
      nextId = (highest?.id || 0) + 1;
    }

    const newCategory = await Category.create({
      id: nextId,
      name: body.name,
      imageUrl: body.imageUrl,
      description: body.description || '',
      isPinned: body.isPinned !== false,
      isVisible: body.isVisible !== false,
      isArchived: false,
    });

    return NextResponse.json({ success: true, data: newCategory });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    console.error('Error adding category:', msg);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

// PUT: Cập nhật danh mục
export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, ...updates } = body;

    const updated = await Category.findOneAndUpdate({ id }, { $set: updates }, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    console.error('Error updating category:', msg);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

// DELETE: Xóa vĩnh viễn danh mục
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
    }

    await Category.deleteOne({ id });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    console.error('Error deleting category:', msg);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

