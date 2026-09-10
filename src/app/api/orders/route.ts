import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Order } from '@/models/Order';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// GET: Lấy danh sách đơn hàng
export async function GET() {
  try {
    await connectToDatabase();
    const items = await Order.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: items });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    console.error('Error fetching orders from MongoDB:', msg);
    return NextResponse.json({ success: false, message: msg, data: [] }, { status: 500 });
  }
}

// POST: Tạo đơn hàng mới
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const newOrder = await Order.create({
      orderId: body.orderId,
      createdAt: body.createdAt,
      customerInfo: body.customerInfo,
      items: body.items,
      totalAmount: body.totalAmount,
      status: body.status || 'Chờ xác nhận',
      paymentMethod: body.paymentMethod || 'cod',
      isArchived: false,
    });

    return NextResponse.json({ success: true, data: newOrder });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    console.error('Error placing order to MongoDB:', msg);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

// PUT: Cập nhật trạng thái hoặc lưu trữ đơn hàng
export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { orderId, ...updates } = body;

    const updated = await Order.findOneAndUpdate(
      { orderId },
      { $set: updates },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    console.error('Error updating order:', msg);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

