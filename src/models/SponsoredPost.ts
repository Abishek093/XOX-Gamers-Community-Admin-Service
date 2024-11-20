import mongoose, { Document, Schema } from 'mongoose';

export interface ISponsoredPost extends Document {
  title: string;
  imageUrl: string;
  link: string;  // New field
  createdAt: Date;
  updatedAt: Date;
}

const SponsoredPostSchema: Schema = new Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  link: { type: String, required: true },  // New field
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

SponsoredPostSchema.pre<ISponsoredPost>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ISponsoredPost>('SponsoredPost', SponsoredPostSchema);