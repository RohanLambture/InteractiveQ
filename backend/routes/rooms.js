import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth, roomOwner } from '../middleware/auth.js';
import Room from '../models/Room.js';
import { generateRoomCode } from '../utils/roomCode.js';
import Question from '../models/Question.js';
import Poll from '../models/Poll.js';

const router = express.Router();

// Get user's rooms (for dashboard)
router.get('/my-rooms', auth, async (req, res) => {
  try {
    const rooms = await Room.find({ owner: req.userId })
      .sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create room
router.post('/', auth, [
  body('name').trim().notEmpty().withMessage('Room name is required'),
  body('settings').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, settings, duration } = req.body;
    const code = await generateRoomCode();

    const room = new Room({
      code,
      name,
      owner: req.userId,
      settings: settings || {},
      expiresAt: duration ? new Date(Date.now() + duration * 60000) : null
    });

    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get room details with questions and polls
router.get('/:roomId', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Get associated questions and polls
    const questions = await Question.find({ room: room._id })
      .sort({ createdAt: -1 });
    const polls = await Poll.find({ room: room._id })
      .sort({ createdAt: -1 });

    res.json({
      room,
      questions,
      polls
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Join room (for participants)
router.post('/join', [
  body('code').trim().isLength({ min: 6, max: 6 }).withMessage('Invalid room code')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code } = req.body;
    const room = await Room.findOne({ 
      code,
      status: 'active',
      $or: [
        { expiresAt: { $gt: new Date() } },
        { expiresAt: null }
      ]
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found or inactive' });
    }

    res.json(room);
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update room settings
router.patch('/:roomId/settings', auth, roomOwner, async (req, res) => {
  try {
    const { settings } = req.body;
    req.room.settings = { ...req.room.settings, ...settings };
    await req.room.save();
    res.json(req.room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// End a room session
router.patch('/:roomId/end', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Verify that the user is the room owner
    if (room.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only room owner can end the session' });
    }

    room.status = 'ended';
    room.endedAt = new Date();
    await room.save();

    res.json({ message: 'Room session ended successfully', room });
  } catch (error) {
    console.error('Error ending room session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new route to get room updates
router.get('/:roomId/updates', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Get latest questions and polls
    const questions = await Question.find({ room: room._id })
      .sort({ createdAt: -1 })
      .populate('author', 'fullName');

    const polls = await Poll.find({ room: room._id })
      .sort({ createdAt: -1 });

    res.json({
      room,
      questions,
      polls,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 