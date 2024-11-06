import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    length: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  settings: {
    allowAnonymousQuestions: {
      type: Boolean,
      default: true
    },
    allowAnonymousPolls: {
      type: Boolean,
      default: true
    },
    requireModeration: {
      type: Boolean,
      default: false
    },
    participantLimit: {
      type: Number,
      default: 100
    }
  },
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  }
});

export default mongoose.model('Room', roomSchema); 