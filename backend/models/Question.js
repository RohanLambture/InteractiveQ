import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  votes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'answered'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  answers: [{
    text: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    }
  }]
});

export default mongoose.model('Question', questionSchema); 