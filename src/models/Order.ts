import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  userId?: mongoose.Types.ObjectId;
  customerInfo: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    notes?: string;
  };
  items: Array<{
    productId: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }>;
  totalAmount: number;
  paymentMethod: 'cod' | 'card';
  status: 'Chờ xác nhận' | 'Đang giao' | 'Thành công' | 'Đã hủy';
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  customerInfo: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    notes: { type: String }
  },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    size: { type: String },
    color: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cod', 'card'], default: 'cod' },
  status: { type: String, enum: ['Chờ xác nhận', 'Đang giao', 'Thành công', 'Đã hủy'], default: 'Chờ xác nhận' }
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

