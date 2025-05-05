const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ChatbotConfig = require('../models/ChatbotConfig');

// Get current user's config
router.get('/config', protect, async (req, res) => {
  let config = await ChatbotConfig.findOne({ admin: req.user.userId });
  if (!config) {
    config = await ChatbotConfig.create({ admin: req.user.userId });
  }
  res.json(config);
});

// Update config
router.put('/config', protect, async (req, res) => {
  const { welcomeMessage, themeColor } = req.body;
  const config = await ChatbotConfig.findOneAndUpdate(
    { admin: req.user.userId },
    { welcomeMessage, themeColor },
    { new: true, upsert: true }
  );
  res.json(config);
});

// Public: Serve config by ID
router.get('/public/:adminId', async (req, res) => {
  const config = await ChatbotConfig.findOne({ admin: req.params.adminId });
  if (!config) return res.status(404).json({ error: 'Not found' });
  res.json(config);
});

module.exports = router;
