import mongoose from 'mongoose';
import { log } from './vite';

const MONGODB_URI = 'mongodb+srv://bastoffcial:aI4fEcricKXwBZ4f@speedo.swuhr8z.mongodb.net/farmer_corner';

// Connect to MongoDB
export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    log('MongoDB connected successfully', 'mongodb');
    return true;
  } catch (error) {
    log(`MongoDB connection error: ${error}`, 'mongodb');
    console.error("MongoDB connection error:", error);
    return false;
  }
}

// User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Motor activity schema
const motorActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Phase detection schema
const phaseDetectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  activePhase: {
    type: Number,
    enum: [1, 2, 3],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create models
export const User = mongoose.model('User', userSchema);
export const MotorActivity = mongoose.model('MotorActivity', motorActivitySchema);
export const PhaseDetection = mongoose.model('PhaseDetection', phaseDetectionSchema);