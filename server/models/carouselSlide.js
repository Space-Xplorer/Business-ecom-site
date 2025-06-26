import mongoose from 'mongoose';

const carouselSlideSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  link: { type: String, required: true },
  altText: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('CarouselSlide', carouselSlideSchema);
