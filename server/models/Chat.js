const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  tokens: {
    type: Number,
    default: 0
  },
  metadata: {
    model: String,
    temperature: Number,
    maxTokens: Number
  }
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'New Chat',
    trim: true,
    maxlength: [100, 'Chat title cannot exceed 100 characters']
  },
  messages: [messageSchema],
  model: {
    type: String,
    default: 'gpt-3.5-turbo'
  },
  settings: {
    temperature: {
      type: Number,
      default: 0.7,
      min: 0,
      max: 2
    },
    maxTokens: {
      type: Number,
      default: 1000,
      min: 1,
      max: 4000
    },
    topP: {
      type: Number,
      default: 1,
      min: 0,
      max: 1
    }
  },
  stats: {
    totalMessages: {
      type: Number,
      default: 0
    },
    totalTokens: {
      type: Number,
      default: 0
    },
    averageResponseTime: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ userId: 1, lastActivity: -1 });
chatSchema.index({ title: 'text' });

// Virtual for chat summary
chatSchema.virtual('summary').get(function() {
  if (this.messages.length === 0) return 'No messages yet';
  
  const firstMessage = this.messages[0];
  return firstMessage.content.length > 50 
    ? firstMessage.content.substring(0, 50) + '...'
    : firstMessage.content;
});

// Virtual for message count
chatSchema.virtual('messageCount').get(function() {
  return this.messages.length;
});

// Pre-save middleware to update stats
chatSchema.pre('save', function(next) {
  this.stats.totalMessages = this.messages.length;
  this.stats.totalTokens = this.messages.reduce((sum, msg) => sum + (msg.tokens || 0), 0);
  this.lastActivity = new Date();
  next();
});

// Method to add message
chatSchema.methods.addMessage = function(content, role, metadata = {}) {
  const message = {
    content,
    role,
    metadata,
    timestamp: new Date()
  };
  
  this.messages.push(message);
  return this.save();
};

// Method to get recent messages
chatSchema.methods.getRecentMessages = function(limit = 10) {
  return this.messages.slice(-limit);
};

// Method to clear messages
chatSchema.methods.clearMessages = function() {
  this.messages = [];
  this.stats.totalMessages = 0;
  this.stats.totalTokens = 0;
  return this.save();
};

// Method to update title based on first message
chatSchema.methods.updateTitle = function() {
  if (this.messages.length > 0) {
    const firstMessage = this.messages[0];
    this.title = firstMessage.content.length > 30 
      ? firstMessage.content.substring(0, 30) + '...'
      : firstMessage.content;
  }
  return this.save();
};

// Static method to find chats by user
chatSchema.statics.findByUser = function(userId, options = {}) {
  const { limit = 20, skip = 0, sort = { lastActivity: -1 } } = options;
  
  return this.find({ userId, isActive: true })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('userId', 'username avatar');
};

// Static method to search chats
chatSchema.statics.searchChats = function(userId, searchTerm) {
  return this.find({
    userId,
    isActive: true,
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { 'messages.content': { $regex: searchTerm, $options: 'i' } }
    ]
  }).sort({ lastActivity: -1 });
};

module.exports = mongoose.model('Chat', chatSchema);
