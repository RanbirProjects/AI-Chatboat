const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getChatHistory,
  getChat,
  updateChatSettings,
  clearChatMessages,
  deleteChat,
  getChatSummary,
  getAvailableModels
} = require('../controllers/chatController');
const { protect, userRateLimit } = require('../middleware/auth');

// Apply rate limiting to all chat routes
router.use(userRateLimit(50, 15 * 60 * 1000)); // 50 requests per 15 minutes

// All chat routes require authentication
router.use(protect);

// Chat management
router.post('/send', sendMessage);
router.get('/history', getChatHistory);
router.get('/models', getAvailableModels);

// Specific chat operations
router.get('/:id', getChat);
router.put('/:id/settings', updateChatSettings);
router.delete('/:id/messages', clearChatMessages);
router.delete('/:id', deleteChat);
router.get('/:id/summary', getChatSummary);

module.exports = router;
