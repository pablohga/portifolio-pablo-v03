import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
