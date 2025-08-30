# AI Chatbot - MERN Stack

A full-stack AI chatbot application built with MongoDB, Express.js, React.js, and Node.js, featuring OpenAI integration and modern UI/UX.

## 🚀 Features

- **AI-Powered Conversations**: Integration with OpenAI GPT models
- **Real-time Chat**: Socket.io for instant messaging
- **User Authentication**: JWT-based secure authentication
- **Conversation History**: Persistent chat history in MongoDB
- **Modern UI/UX**: Responsive design with Tailwind CSS
- **File Uploads**: Support for image and document sharing
- **Rate Limiting**: API protection against abuse
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- Socket.io for real-time communication
- OpenAI API integration
- JWT authentication
- Rate limiting & security middleware

### Frontend
- React.js with hooks
- Tailwind CSS for styling
- Socket.io client
- Responsive design
- Modern UI components

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- OpenAI API key
- Git

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-chatbot-mern
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-chatbot
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_api_key
```

### OpenAI Setup

1. Get your API key from [OpenAI Platform](https://platform.openai.com/)
2. Add it to your `.env` file
3. Ensure you have sufficient credits

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev          # Runs both frontend and backend
npm run server       # Backend only
npm run client       # Frontend only
```

### Production Mode
```bash
npm run build        # Build frontend
npm start           # Start production server
```

## 🌐 Deployment

### Netlify Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `client/build`
   - Add environment variables in Netlify dashboard

### Environment Variables for Production

Set these in your Netlify dashboard:
- `MONGODB_URI_PROD`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `NODE_ENV=production`

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Chat
- `POST /api/chat/send` - Send message to AI
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/clear` - Clear chat history

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🔒 Security Features

- JWT authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- SQL injection protection

## 📁 Project Structure

```
ai-chatbot-mern/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── context/      # React context
│   │   ├── utils/        # Utility functions
│   │   └── styles/       # CSS styles
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── index.js          # Server entry point
├── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔮 Future Enhancements

- Voice chat integration
- Multi-language support
- Advanced AI models
- Group chat functionality
- File sharing improvements
- Analytics dashboard
# AI-Chatboat
