import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';

const ChatSidebar = () => {
  const { user } = useAuth();
  const { chatHistory, fetchChatHistory, deleteChat } = useChat();
  const navigate = useNavigate();
  const { chatId } = useParams();

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  const handleNewChat = () => {
    navigate('/chat');
  };

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      await deleteChat(chatId);
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
        <button
          onClick={handleNewChat}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        {chatHistory.length === 0 ? (
          <div className="p-4 text-center text-secondary-500 dark:text-secondary-400">
            <MessageSquare className="h-8 w-8 mx-auto mb-2" />
            <p>No conversations yet</p>
          </div>
        ) : (
          <div className="p-2">
            {chatHistory.map((chat) => (
              <div
                key={chat._id}
                onClick={() => handleChatClick(chat._id)}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  chatId === chat._id
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'hover:bg-secondary-100 dark:hover:bg-secondary-700'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">
                    {chat.title}
                  </h4>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 truncate">
                    {chat.messages.length} messages
                  </p>
                </div>
                
                <button
                  onClick={(e) => handleDeleteChat(e, chat._id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-secondary-400 hover:text-red-500 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-secondary-900 dark:text-white truncate">
              {user?.username}
            </p>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              {user?.stats?.totalMessages || 0} messages
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
