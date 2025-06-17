import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
    profileImage: {
    type: String,
    default: null // Store Cloudinary URL
  }


}, { timestamps: true });

export default mongoose.model('User', userSchema);
