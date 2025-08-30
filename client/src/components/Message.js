import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { format } from 'date-fns';
import { User, Bot } from 'lucide-react';

const Message = ({ message, user }) => {
  const isUser = message.role === 'user';
  const timestamp = format(new Date(message.timestamp), 'HH:mm');

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-3 max-w-3xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}>
          {isUser ? (
            <User className="h-5 w-5" />
          ) : (
            <Bot className="h-5 w-5" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
          }`}>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-sm">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400">
                      {children}
                    </blockquote>
                  ),
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-bold mb-2">{children}</h3>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs text-gray-500 mt-2 ${isUser ? 'text-right' : 'text-left'}`}>
            {timestamp}
            {message.tokens > 0 && (
              <span className="ml-2">• {message.tokens} tokens</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
