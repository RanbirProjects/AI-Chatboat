import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Plus, ArrowLeft, Bot, User, Brain, Sparkles, Zap, Shield, LogIn } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    username: 'Guest User',
    email: 'guest@example.com'
  });
  const [isGuest, setIsGuest] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('user');
    
    if (isLoggedIn && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsGuest(false);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Keep default guest user
      }
    } else {
      // Keep default guest user
      setUser({
        username: 'Guest User',
        email: 'guest@example.com'
      });
      setIsGuest(true);
    }
    
    setIsLoadingUser(false);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current && !isLoadingUser) {
      inputRef.current.focus();
    }
  }, [isLoadingUser]);

  // Simulate AI response
  const generateAIResponse = async (userMessage) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate contextual AI responses
    const responses = [
      "That's a fascinating question! Let me provide you with some insights. Based on what you've asked, I can see several interesting angles to explore. Here's what I think might be most relevant to your situation...",
      "I understand what you're looking for! This is a complex topic that deserves careful consideration. Let me break it down into key points: 1) First aspect - this involves understanding the fundamental principles, 2) Second aspect - here we need to consider practical applications, 3) Third aspect - this connects to broader implications. Would you like me to elaborate on any of these areas?",
      "Excellent question! I'd be happy to dive deeper into this topic. What I find particularly interesting is how this connects to current trends and future possibilities. There are several angles we could explore together. What specific aspect interests you most?",
      "Thanks for sharing that with me! I can see several fascinating connections here. This is the kind of question that opens up new ways of thinking. Let me provide you with a comprehensive overview that might spark some interesting ideas...",
      "I appreciate your curiosity about this topic! It's a complex subject that touches on many important areas. Let me give you a thoughtful analysis that considers multiple perspectives and potential implications..."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const aiMessage = {
      id: Date.now() + 1,
      content: randomResponse,
      role: 'assistant',
      timestamp: new Date(),
      isAI: true
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date(),
      isAI: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Generate AI response
    await generateAIResponse(inputMessage);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputMessage('');
  };

  const handleBackToDashboard = () => {
    if (isGuest) {
      navigate('/login');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Show loading state while user data is being determined
  if (isLoadingUser) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 particle-bg items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 ai-neon-glow">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading AI Chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 particle-bg">
      {/* Sidebar */}
      <div className="w-80 glass border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={handleNewChat}
            className="w-full modern-btn flex items-center justify-center space-x-3 ai-neon-glow"
          >
            <Plus className="h-5 w-5" />
            <span>New Chat</span>
            <Sparkles className="h-4 w-4" />
          </button>
          
          {/* Guest Login Prompt */}
          {isGuest && (
            <button
              onClick={handleLogin}
              className="w-full mt-3 glass border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Login to Save Chats</span>
            </button>
          )}
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 ai-neon-glow">
                <Bot className="h-10 w-10 text-white" />
              </div>
              <p className="font-medium text-lg mb-2">No messages yet</p>
              <p className="text-sm opacity-75">Start a conversation!</p>
              <div className="mt-4 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.slice(0, 8).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:ai-neon-glow ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-800 dark:text-blue-200'
                      : 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 text-purple-800 dark:text-purple-200'
                  }`}
                >
                  <p className="text-sm truncate font-medium">
                    {msg.content.substring(0, 40)}...
                  </p>
                  <p className="text-xs opacity-75 mt-2">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium ai-neon-glow">
                {user?.username?.charAt(0)?.toUpperCase() || 'G'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {user?.username || 'Guest User'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isGuest ? 'Guest Mode' : `${messages.length} messages`}
                </p>
                {isGuest && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Chats won't be saved
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="glass border-b border-gray-200/50 dark:border-gray-700/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="glass p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center ai-neon-glow">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  AI Chat
                </h1>
                {messages.length > 0 && (
                  <span className="glass px-3 py-1 rounded-full text-sm text-gray-600 dark:text-gray-400">
                    {messages.length} messages
                  </span>
                )}
                {isGuest && (
                  <span className="glass px-3 py-1 rounded-full text-sm text-blue-600 dark:text-blue-400 border border-blue-500">
                    Guest Mode
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleNewChat}
                className="glass p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:scale-105 transition-all duration-300"
              >
                <Plus className="h-5 w-5" />
              </button>
              
              {isGuest && (
                <button
                  onClick={handleLogin}
                  className="modern-btn px-4 py-2 text-sm ai-neon-glow"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 ai-neon-glow shadow-2xl">
                <Bot className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                Start a conversation
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-xl mb-8 max-w-md mx-auto leading-relaxed">
                Ask me anything! I'm here to help with your questions, provide insights, and engage in meaningful conversations.
              </p>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
                <div className="glass rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Instant Responses</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Smart AI</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Secure</p>
                </div>
              </div>
              
              {/* Guest Mode Info */}
              {isGuest && (
                <div className="glass rounded-xl p-6 max-w-md mx-auto mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🎯 Try Before You Sign Up!</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    You're currently in guest mode. Start chatting immediately to experience our AI chatbot!
                  </p>
                  <button
                    onClick={handleLogin}
                    className="modern-btn w-full py-3 ai-neon-glow"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login to Save Chats
                  </button>
                </div>
              )}
              
              <div className="flex justify-center space-x-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-4 max-w-4xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ai-neon-glow ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
                      : 'bg-gradient-to-r from-purple-600 to-purple-700'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-6 w-6 text-white" />
                    ) : (
                      <Bot className="h-6 w-6 text-white" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block px-6 py-4 rounded-2xl shadow-lg max-w-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                        : 'glass text-gray-900 dark:text-white'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                    
                    {/* Timestamp */}
                    <div className={`text-sm text-gray-500 mt-3 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 glass rounded-xl px-6 py-4 max-w-md mx-auto">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
              <div className="flex space-x-1">
                <span className="text-lg">AI is thinking</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="glass border-t border-gray-200/50 dark:border-gray-700/50 px-8 py-6">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 modern-input text-lg"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="modern-btn px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed ai-neon-glow"
            >
              <Send className="h-6 w-6" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
