const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.defaultModel = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    this.defaultSettings = {
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    };
  }

  // Generate chat completion
  async generateChatCompletion(messages, options = {}) {
    try {
      const startTime = Date.now();
      
      const settings = {
        ...this.defaultSettings,
        ...options,
        model: options.model || this.defaultModel
      };

      const completion = await this.openai.chat.completions.create({
        model: settings.model,
        messages: this.formatMessages(messages),
        temperature: settings.temperature,
        max_tokens: settings.max_tokens,
        top_p: settings.top_p,
        frequency_penalty: settings.frequency_penalty,
        presence_penalty: settings.presence_penalty,
        stream: false
      });

      const responseTime = Date.now() - startTime;
      
      return {
        content: completion.choices[0].message.content,
        usage: completion.usage,
        model: completion.model,
        responseTime,
        finishReason: completion.choices[0].finish_reason
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  // Stream chat completion (for real-time responses)
  async generateStreamChatCompletion(messages, options = {}) {
    try {
      const settings = {
        ...this.defaultSettings,
        ...options,
        model: options.model || this.defaultModel
      };

      const stream = await this.openai.chat.completions.create({
        model: settings.model,
        messages: this.formatMessages(messages),
        temperature: settings.temperature,
        max_tokens: settings.max_tokens,
        top_p: settings.top_p,
        frequency_penalty: settings.frequency_penalty,
        presence_penalty: settings.presence_penalty,
        stream: true
      });

      return stream;
    } catch (error) {
      console.error('OpenAI Stream Error:', error);
      throw new Error(`AI stream error: ${error.message}`);
    }
  }

  // Format messages for OpenAI API
  formatMessages(messages) {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  // Estimate token count (rough approximation)
  estimateTokens(text) {
    // Rough estimation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  // Validate API key
  async validateAPIKey() {
    try {
      await this.openai.models.list();
      return true;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }

  // Get available models
  async getAvailableModels() {
    try {
      const models = await this.openai.models.list();
      return models.data
        .filter(model => model.id.includes('gpt'))
        .map(model => ({
          id: model.id,
          name: model.id.replace('gpt-', 'GPT-').toUpperCase(),
          maxTokens: this.getModelMaxTokens(model.id)
        }));
    } catch (error) {
      console.error('Failed to fetch models:', error);
      return [];
    }
  }

  // Get max tokens for specific model
  getModelMaxTokens(modelId) {
    const modelLimits = {
      'gpt-4': 8192,
      'gpt-4-32k': 32768,
      'gpt-3.5-turbo': 4096,
      'gpt-3.5-turbo-16k': 16384
    };
    
    return modelLimits[modelId] || 4096;
  }

  // Generate system prompt based on context
  generateSystemPrompt(context = {}) {
    let prompt = "You are a helpful AI assistant. ";
    
    if (context.role) {
      prompt += `You are acting as: ${context.role}. `;
    }
    
    if (context.tone) {
      prompt += `Please respond in a ${context.tone} tone. `;
    }
    
    if (context.expertise) {
      prompt += `You have expertise in: ${context.expertise}. `;
    }
    
    prompt += "Provide accurate, helpful, and engaging responses.";
    
    return prompt;
  }

  // Analyze message sentiment (basic implementation)
  async analyzeSentiment(message) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Analyze the sentiment of the following message and respond with only one word: positive, negative, or neutral.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 10,
        temperature: 0
      });

      return completion.choices[0].message.content.toLowerCase().trim();
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      return 'neutral';
    }
  }

  // Generate conversation summary
  async generateSummary(messages, maxLength = 200) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Summarize the following conversation in ${maxLength} characters or less. Focus on the main topics and key points.`
          },
          {
            role: 'user',
            content: messages.map(m => `${m.role}: ${m.content}`).join('\n')
          }
        ],
        max_tokens: Math.ceil(maxLength / 4),
        temperature: 0.3
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Summary generation failed:', error);
      return 'Conversation summary unavailable';
    }
  }
}

module.exports = new OpenAIService();
