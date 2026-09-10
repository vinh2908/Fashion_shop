import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  createdAt: string;
  customerInfo: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    note?: string;
  };
  items: Array<{
    id: number;
    product: Record<string, unknown>;
    quantity: number;
    size: string;
    color: string;
  }>;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  isArchived: boolean;
}

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  createdAt: { type: String, required: true },
  customerInfo: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    address: { type: String, required: true },
    note: { type: String, default: '' },
  },
  items: { type: Array, default: [] },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Chờ xác nhận' },
  paymentMethod: { type: String, default: 'cod' },
  isArchived: { type: Boolean, default: false },
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
