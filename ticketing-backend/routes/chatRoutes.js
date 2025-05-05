const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const { protect } = require('../middleware/authMiddleware');

router.get('/:ticketId', protect, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ ticket: req.params.ticketId }).populate('sender', 'name email');
    res.json(messages);
  } catch {
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

module.exports = router;

