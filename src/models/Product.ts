import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id: number;
  name: string;
  category: number;
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
  isFlashSale: boolean;
  soldPercentage: number;
  isArchived: boolean;
}

const ProductSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: Number, required: true },
  categoryName: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 5 },
  reviewCount: { type: Number, default: 0 },
  imageUrl: { type: String, required: true },
  gallery: { type: [String], default: [] },
  description: { type: String, default: '' },
  colors: { type: [String], default: [] },
  sizes: { type: [String], default: [] },
  isFlashSale: { type: Boolean, default: false },
  soldPercentage: { type: Number, default: 0 },
  isArchived: { type: Boolean, default: false },
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

