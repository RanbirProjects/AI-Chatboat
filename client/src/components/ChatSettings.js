import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ChatSettings = ({ chat, onClose }) => {
  const [settings, setSettings] = useState({
    temperature: chat.settings.temperature,
    maxTokens: chat.settings.maxTokens,
    model: chat.settings.model,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await api.put(`/api/chat/${chat._id}/settings`, { settings });
      toast.success('Settings updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
          Chat Settings
        </h3>
        <button
          onClick={onClose}
          className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            AI Model
          </label>
          <select
            value={settings.model}
            onChange={(e) => setSettings({ ...settings, model: e.target.value })}
            className="input-field"
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Temperature: {settings.temperature}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
            className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-secondary-500 mt-1">
            <span>Focused</span>
            <span>Creative</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Max Tokens: {settings.maxTokens}
          </label>
          <input
            type="range"
            min="100"
            max="4000"
            step="100"
            value={settings.maxTokens}
            onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
            className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-secondary-500 mt-1">
            <span>Short</span>
            <span>Long</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default ChatSettings;
