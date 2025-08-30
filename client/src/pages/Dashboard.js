import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, LogOut, User, Brain, Zap, Shield, Settings, Sparkles, Star, Rocket, Sun, Moon, Monitor } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [theme, setTheme] = useState('auto');
  const [language, setLanguage] = useState('en');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('user');
    
    if (!isLoggedIn || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    
    // Load saved preferences
    const savedTheme = localStorage.getItem('theme') || 'auto';
    const savedLanguage = localStorage.getItem('language') || 'en';
    setTheme(savedTheme);
    setLanguage(savedLanguage);
  }, [navigate]);

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        const root = document.documentElement;
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Apply language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // You can add i18n logic here for actual language switching
  }, [language]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleNewChat = () => {
    navigate('/chat');
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 particle-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 ai-neon-glow"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Brain, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'features', name: 'Features', icon: Zap, color: 'purple', gradient: 'from-purple-500 to-pink-500' },
    { id: 'security', name: 'Security', icon: Shield, color: 'green', gradient: 'from-green-500 to-emerald-500' },
    { id: 'settings', name: 'Settings', icon: Settings, color: 'gray', gradient: 'from-gray-500 to-slate-500' }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4 ai-neon-glow">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Conversations</span>
              </div>
              
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Welcome back, {user.username}! 👋
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                Ready to have an intelligent conversation? Start a new chat and experience AI-powered responses with our cutting-edge technology!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleNewChat}
                  className="modern-btn px-8 py-4 text-lg flex items-center space-x-3 ai-neon-glow"
                >
                  <Plus className="h-6 w-6" />
                  <span>Start New Chat</span>
                  <Rocket className="h-5 w-5" />
                </button>
                
                <button className="glass px-6 py-4 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105">
                  <Star className="h-5 w-5 inline mr-2" />
                  View Tutorial
                </button>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="modern-card rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 hover:ai-neon-glow">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 ai-neon-glow">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Conversations</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Live Now!</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Experience real-time conversations with our advanced AI assistant that understands context and provides intelligent responses.
                </p>
              </div>

              <div className="modern-card rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 hover:ai-neon-glow">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 ai-neon-glow">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Smart Responses</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Contextual</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Our AI maintains conversation context, remembers previous interactions, and provides relevant, helpful responses.
                </p>
              </div>

              <div className="modern-card rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 hover:ai-neon-glow">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 ai-neon-glow">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">User Experience</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Modern UI</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Enjoy a sleek, intuitive interface designed for seamless interaction and beautiful visual experiences.
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="modern-card rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Your AI Journey</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">AI Availability</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">∞</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Conversations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">100%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Privacy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">AI</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Powered</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">🚀 Advanced AI Features</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Discover the power of our cutting-edge AI technology</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="modern-card rounded-2xl p-8 hover:ai-neon-glow transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Real-time AI Chat</h3>
                </div>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Instant AI responses</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Context-aware conversations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Multi-language support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span>Voice input ready</span>
                  </li>
                </ul>
              </div>

              <div className="modern-card rounded-2xl p-8 hover:ai-neon-glow transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Smart Features</h3>
                </div>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Chat history management</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Export conversations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Custom AI personalities</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span>Advanced settings</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="animated-border">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Experience AI?</h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">Start your first conversation now and discover the future of communication!</p>
                <button
                  onClick={handleNewChat}
                  className="modern-btn px-8 py-3 text-lg ai-neon-glow"
                >
                  Start Chatting Now
                </button>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">🔒 Security & Privacy</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Your data security is our top priority</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="modern-card rounded-2xl p-8 hover:ai-neon-glow transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Data Protection</h3>
                </div>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>End-to-end encryption</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>GDPR compliant</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>No data sharing</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span>Secure authentication</span>
                  </li>
                </ul>
              </div>

              <div className="modern-card rounded-2xl p-8 hover:ai-neon-glow transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Privacy Controls</h3>
                </div>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Chat auto-deletion</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Anonymous mode</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Privacy settings</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span>Data export/delete</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="glass rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🔐 Trust & Transparency</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We believe in complete transparency about how we handle your data. 
                Your privacy is not just a feature—it's our foundation.
              </p>
              <div className="flex justify-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Secure</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">Zero</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Data Breaches</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">⚙️ User Settings</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Customize your AI experience</p>
            </div>
            
            <div className="modern-card rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={user.username}
                    readOnly
                    className="modern-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="modern-input w-full"
                  />
                </div>
              </div>
            </div>

            <div className="modern-card rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="theme-auto"
                        name="theme"
                        value="auto"
                        checked={theme === 'auto'}
                        onChange={(e) => handleThemeChange(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="theme-auto" className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                        <Monitor className="h-4 w-4" />
                        <span>Auto (System)</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="theme-light"
                        name="theme"
                        value="light"
                        checked={theme === 'light'}
                        onChange={(e) => handleThemeChange(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="theme-light" className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                        <Sun className="h-4 w-4 text-yellow-500" />
                        <span>Light Mode</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="theme-dark"
                        name="theme"
                        value="dark"
                        checked={theme === 'dark'}
                        onChange={(e) => handleThemeChange(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="theme-dark" className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                        <Moon className="h-4 w-4 text-blue-500" />
                        <span>Dark Mode</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                  <select 
                    value={language} 
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="modern-input w-full"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Selected: {languages.find(l => l.code === language)?.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🎨 Customization</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Personalize your AI chatbot experience with custom themes, 
                conversation styles, and interface preferences.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="modern-btn px-6 py-3">
                  Customize Interface
                </button>
                <button className="glass px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                  Reset Preferences
                </button>
              </div>
            </div>

            {/* Current Settings Display */}
            <div className="modern-card rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Current Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    {theme === 'auto' && <Monitor className="h-5 w-5 text-blue-500" />}
                    {theme === 'light' && <Sun className="h-5 w-5 text-yellow-500" />}
                    {theme === 'dark' && <Moon className="h-5 w-5 text-blue-500" />}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {theme === 'auto' ? 'Auto (System)' : theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{languages.find(l => l.code === language)?.flag}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Language</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {languages.find(l => l.code === language)?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 particle-bg">
      {/* Header */}
      <header className="glass border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4 ai-neon-glow">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                AI Chatbot
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Quick Theme Toggle */}
              <button
                onClick={() => {
                  const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light';
                  handleThemeChange(newTheme);
                }}
                className="glass p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 rounded-xl"
                title={`Current: ${theme === 'auto' ? 'Auto' : theme === 'light' ? 'Light' : 'Dark'}. Click to cycle.`}
              >
                {theme === 'auto' && <Monitor className="h-5 w-5" />}
                {theme === 'light' && <Sun className="h-5 w-5" />}
                {theme === 'dark' && <Moon className="h-5 w-5" />}
              </button>
              
              {/* Language Indicator */}
              <div className="glass px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300">
                <span className="text-lg mr-2">{languages.find(l => l.code === language)?.flag}</span>
                <span className="text-sm font-medium">{languages.find(l => l.code === language)?.code.toUpperCase()}</span>
              </div>
              
              <button
                onClick={handleNewChat}
                className="glass px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105"
              >
                <User className="h-5 w-5 inline mr-2" />
                <span>{user.username}</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="glass px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 hover:scale-105"
              >
                <LogOut className="h-5 w-5 inline mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="glass rounded-2xl p-2 mb-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg ai-neon-glow`
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="glass rounded-2xl border border-white/20 dark:border-gray-700/20 p-8">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
