const Chat = require('../models/Chat');
const User = require('../models/User');
const openaiService = require('../services/openaiService');

// @desc    Send message to AI and get response
// @route   POST /api/chat/send
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { message, chatId, settings = {} } = req.body;
    const userId = req.user._id;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: 'Message content is required'
      });
    }

    let chat;
    
    // If chatId is provided, use existing chat, otherwise create new one
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId });
      if (!chat) {
        return res.status(404).json({
          error: 'Chat not found'
        });
      }
    } else {
      // Create new chat
      chat = new Chat({
        userId,
        settings: {
          temperature: settings.temperature || 0.7,
          maxTokens: settings.maxTokens || 1000,
          model: settings.model || 'gpt-3.5-turbo'
        }
      });
    }

    // Add user message to chat
    const userMessage = {
      content: message.trim(),
      role: 'user',
      timestamp: new Date(),
      tokens: openaiService.estimateTokens(message)
    };

    chat.messages.push(userMessage);

    // Prepare messages for AI (include system prompt if it's a new chat)
    const aiMessages = chat.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Generate AI response
    const aiResponse = await openaiService.generateChatCompletion(aiMessages, {
      model: chat.settings.model,
      temperature: chat.settings.temperature,
      max_tokens: chat.settings.maxTokens
    });

    // Add AI response to chat
    const assistantMessage = {
      content: aiResponse.content,
      role: 'assistant',
      timestamp: new Date(),
      tokens: aiResponse.usage?.completion_tokens || 0,
      metadata: {
        model: aiResponse.model,
        temperature: chat.settings.temperature,
        maxTokens: chat.settings.maxTokens
      }
    };

    chat.messages.push(assistantMessage);

    // Update chat title if it's a new chat
    if (chat.messages.length === 2) {
      await chat.updateTitle();
    }

    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: {
        'stats.totalMessages': 2,
        'stats.totalTokens': userMessage.tokens + assistantMessage.tokens
      },
      'stats.lastActive': new Date()
    });

    await chat.save();

    res.json({
      chat: chat,
      response: {
        content: aiResponse.content,
        usage: aiResponse.usage,
        model: aiResponse.model,
        responseTime: aiResponse.responseTime
      }
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      error: 'Failed to send message',
      details: error.message
    });
  }
};

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, search } = req.query;

    const skip = (page - 1) * limit;
    const options = { limit: parseInt(limit), skip, sort: { lastActivity: -1 } };

    let chats;
    if (search) {
      chats = await Chat.searchChats(userId, search);
    } else {
      chats = await Chat.findByUser(userId, options);
    }

    const total = await Chat.countDocuments({ userId, isActive: true });

    res.json({
      chats,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      error: 'Failed to fetch chat history'
    });
  }
};

// @desc    Get specific chat
// @route   GET /api/chat/:id
// @access  Private
const getChat = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({ _id: id, userId });

    if (!chat) {
      return res.status(404).json({
        error: 'Chat not found'
      });
    }

    res.json(chat);

  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({
      error: 'Failed to fetch chat'
    });
  }
};

// @desc    Update chat settings
// @route   PUT /api/chat/:id/settings
// @access  Private
const updateChatSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { settings } = req.body;

    const chat = await Chat.findOne({ _id: id, userId });

    if (!chat) {
      return res.status(404).json({
        error: 'Chat not found'
      });
    }

    // Update settings
    if (settings.temperature !== undefined) {
      chat.settings.temperature = Math.max(0, Math.min(2, settings.temperature));
    }
    if (settings.maxTokens !== undefined) {
      chat.settings.maxTokens = Math.max(1, Math.min(4000, settings.maxTokens));
    }
    if (settings.model) {
      chat.settings.model = settings.model;
    }

    await chat.save();

    res.json(chat);

  } catch (error) {
    console.error('Update chat settings error:', error);
    res.status(500).json({
      error: 'Failed to update chat settings'
    });
  }
};

// @desc    Clear chat messages
// @route   DELETE /api/chat/:id/messages
// @access  Private
const clearChatMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({ _id: id, userId });

    if (!chat) {
      return res.status(404).json({
        error: 'Chat not found'
      });
    }

    await chat.clearMessages();

    res.json({
      message: 'Chat messages cleared successfully',
      chat
    });

  } catch (error) {
    console.error('Clear chat messages error:', error);
    res.status(500).json({
      error: 'Failed to clear chat messages'
    });
  }
};

// @desc    Delete chat
// @route   DELETE /api/chat/:id
// @access  Private
const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({ _id: id, userId });

    if (!chat) {
      return res.status(404).json({
        error: 'Chat not found'
      });
    }

    // Soft delete by setting isActive to false
    chat.isActive = false;
    await chat.save();

    res.json({
      message: 'Chat deleted successfully'
    });

  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({
      error: 'Failed to delete chat'
    });
  }
};

// @desc    Get chat summary
// @route   GET /api/chat/:id/summary
// @access  Private
const getChatSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({ _id: id, userId });

    if (!chat) {
      return res.status(404).json({
        error: 'Chat not found'
      });
    }

    if (chat.messages.length === 0) {
      return res.json({
        summary: 'No messages to summarize'
      });
    }

    const summary = await openaiService.generateSummary(chat.messages);

    res.json({
      summary,
      messageCount: chat.messages.length,
      totalTokens: chat.stats.totalTokens
    });

  } catch (error) {
    console.error('Get chat summary error:', error);
    res.status(500).json({
      error: 'Failed to generate chat summary'
    });
  }
};

// @desc    Get available AI models
// @route   GET /api/chat/models
// @access  Private
const getAvailableModels = async (req, res) => {
  try {
    const models = await openaiService.getAvailableModels();
    res.json(models);
  } catch (error) {
    console.error('Get models error:', error);
    res.status(500).json({
      error: 'Failed to fetch available models'
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  getChat,
  updateChatSettings,
  clearChatMessages,
  deleteChat,
  getChatSummary,
  getAvailableModels
};
