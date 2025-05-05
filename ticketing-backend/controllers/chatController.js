const Message = require('./models/Message');

// Save user or support message
exports.postMessage = async (req, res) => {
  const { sessionId, sender, content } = req.body;

  try {
    const msg = await Message.create({ sessionId, sender, content });

    // If first user message, start missed chat timer
    if (sender === 'user') {
      const hasSupportReply = await Message.exists({ sessionId, sender: 'support' });
      if (!hasSupportReply) {
        setTimeout(async () => {
          const stillNoReply = !(await Message.exists({ sessionId, sender: 'support' }));
          if (stillNoReply) {
            await Message.updateMany({ sessionId }, { missed: true });
          }
        }, 5 * 60 * 1000); // 5 minutes
      }
    }

    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: 'Error saving message', error: err.message });
  }
};

// Get all messages for session
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ sessionId: req.params.sessionId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages', error: err.message });
  }
};
