const mongoose = require('mongoose');

const chatbotConfigSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  welcomeMessage: { type: String, default: 'Hi! How can I help you?' },
  themeColor: { type: String, default: '#007bff' }
});

module.exports = mongoose.model('ChatbotConfig', chatbotConfigSchema);
