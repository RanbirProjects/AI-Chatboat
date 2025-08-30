# AI Chatbot - MERN Stack

A full-stack AI chatbot application built with MongoDB, Express.js, React.js, and Node.js, featuring OpenAI integration and modern UI/UX.
Login page
![2CCACC61-A3EF-4EE9-BB64-D69D691B4002](https://github.com/user-attachments/assets/79aadad6-099d-440f-b1c4-71611904079b)
Overview
![4B233324-5527-4F60-A069-8E651EA72F53](https://github.com/user-attachments/assets/99538c54-0441-46f1-94ba-7bb1e57bd0a5)
Features
![582B5951-FEE7-456D-A28B-D7EDB8E549B3](https://github.com/user-attachments/assets/6bf8a931-1e0e-41e3-a85e-8fe9d35e89b9)
Security
![CAFBABE7-278C-4CCF-99FF-D31A93CA3753](https://github.com/user-attachments/assets/368bc355-2d17-45d7-89ba-64052844ed58)
Settings
![0C91CB52-D3E6-430C-91D3-3D31C6FBCA5C](https://github.com/user-attachments/assets/7d1b3687-ca14-4618-a72f-b28cb4d28654)
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
