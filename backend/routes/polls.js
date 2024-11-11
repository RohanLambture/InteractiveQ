import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';
import Poll from '../models/Poll.js';
import Room from '../models/Room.js';

const router = express.Router();

// Get polls for a room
router.get('/room/:roomId', async (req, res) => {
  try {
    const polls = await Poll.find({ room: req.params.roomId })
      .sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a poll
router.post('/', auth, [
  body('question').trim().notEmpty().withMessage('Poll question is required'),
  body('options').isArray({ min: 2 }).withMessage('At least 2 options required'),
  body('roomId').notEmpty().withMessage('Room ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { question, options, roomId } = req.body;
    const room = await Room.findById(roomId);

    if (!room || room.status !== 'active') {
      return res.status(404).json({ message: 'Room not found or inactive' });
    }

    if (room.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only room owner can create polls' });
    }

    const poll = new Poll({
      room: roomId,
      question,
      options: options.map(opt => ({ text: opt, votes: 0 }))
    });

    await poll.save();
    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Vote on a poll
router.post('/:pollId/vote', auth, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Check if user has already voted
    const hasVoted = poll.voters.some(voter => 
      voter.user.toString() === req.userId
    );

    if (hasVoted) {
      return res.status(400).json({ message: 'Already voted in this poll' });
    }

    const { optionIndex, anonymous } = req.body;
    
    // Validate option index
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: 'Invalid option index' });
    }

    // Add vote
    poll.options[optionIndex].votes += 1;
    poll.voters.push({
      user: req.userId,
      anonymous
    });

    await poll.save();
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// End a poll
router.patch('/:pollId/end', auth, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const room = await Room.findById(poll.room);
    if (room.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    poll.status = 'ended';
    await poll.save();
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 