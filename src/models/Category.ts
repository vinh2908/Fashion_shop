import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  id: number;
  name: string;
  imageUrl: string;
  description?: string;
  isPinned: boolean;
  isVisible: boolean;
  isArchived: boolean;
}

const CategorySchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, default: '' },
  isPinned: { type: Boolean, default: true },
  isVisible: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
}, { timestamps: true });

export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

