import React, { useState, useEffect, useRef } from 'react';
import { Send, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Message } from '../../types';

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(12);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        userId: '2',
        userName: 'Fatima Ahmed',
        content: 'Assalamu alaikum everyone! How is everyone doing?',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        userId: '3',
        userName: 'Omar Ali',
        content: 'Wa alaikum assalam! Alhamdulillah, doing well. Any updates on the Quran study circle?',
        timestamp: new Date(Date.now() - 1800000)
      },
      {
        id: '3',
        userId: '1',
        userName: 'Ahmed Hassan',
        content: 'Salaam! Yes, we\'ll have it tomorrow at 4 PM in the Islamic center.',
        timestamp: new Date(Date.now() - 900000)
      }
    ];
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      content: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[600px] flex flex-col">
      <div className="bg-gau-msa-primary text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-5 w-5" />
          <span className="font-semibold">Community Chat</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>{onlineUsers} online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.userId === user?.id ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className="flex-shrink-0">
              {message.userId === user?.id ? (
                <div className="w-10 h-10 rounded-full bg-gau-msa-primary text-white flex items-center justify-center">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center">
                  {message.userName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className={`flex flex-col ${message.userId === user?.id ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-700">
                  {message.userName}
                </span>
                <span className="text-xs text-gray-500">
                  {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}
                </span>
              </div>
              <div
                className={`mt-1 px-4 py-2 rounded-lg max-w-md ${
                  message.userId === user?.id
                    ? 'bg-gau-msa-primary text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gau-msa-primary"
          />
          <button
            type="submit"
            className="bg-gau-msa-primary text-white px-6 py-2 rounded-lg hover:bg-gau-msa-secondary transition-colors duration-300 flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Send</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;