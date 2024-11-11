import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';
import Question from '../models/Question.js';
import Room from '../models/Room.js';

const router = express.Router();

// Get questions for a room
router.get('/room/:roomId', async (req, res) => {
  try {
    const questions = await Question.find({ room: req.params.roomId })
      .populate('author', 'fullName')
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a question
router.post('/', auth, [
  body('content').trim().notEmpty().withMessage('Question content is required'),
  body('roomId').notEmpty().withMessage('Room ID is required'),
  body('isAnonymous').isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, roomId, isAnonymous } = req.body;
    const room = await Room.findById(roomId);

    if (!room || room.status !== 'active') {
      return res.status(404).json({ message: 'Room not found or inactive' });
    }

    const question = new Question({
      room: roomId,
      content,
      author: isAnonymous ? null : req.userId,
      isAnonymous,
      status: room.settings.requireModeration ? 'pending' : 'approved'
    });

    await question.save();
    await question.populate('author', 'fullName');
    
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Vote for a question
router.post('/:questionId/vote', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const hasVoted = question.votes.includes(req.userId);
    if (hasVoted) {
      question.votes = question.votes.filter(id => id.toString() !== req.userId);
    } else {
      question.votes.push(req.userId);
    }

    await question.save();
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update question status (for moderators/room owners)
router.patch('/:questionId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const question = await Question.findById(req.params.questionId);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const room = await Room.findById(question.room);
    if (room.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    question.status = status;
    await question.save();
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete question
router.delete('/:questionId', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is room owner
    const room = await Room.findById(question.room);
    if (room.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Question.findByIdAndDelete(req.params.questionId);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add answer to a question
router.post('/:questionId/answers', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const { text, author } = req.body;
    
    question.answers.push({
      text,
      author,
      createdAt: new Date()
    });

    await question.save();
    res.json(question);
  } catch (error) {
    console.error('Error adding answer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 