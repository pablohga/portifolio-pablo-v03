import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  image: String,
  emailVerified: Date,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  subscriptionTier: { type: String, enum: ['free', 'paid', 'premium'], default: 'free' },
  resetToken: String,
  resetTokenExpiry: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);