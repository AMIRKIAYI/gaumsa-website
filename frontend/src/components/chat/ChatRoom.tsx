import React, { useState, useEffect, useRef } from 'react';
import { Send, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../ui/PageHeader';

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers] = useState(12);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        userId: '2',
        userName: 'Fatima Ahmed',
        content: 'Assalamu alaikum everyone! How is everyone doing?',
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: '2',
        userId: '3',
        userName: 'Omar Ali',
        content:
          'Wa alaikum assalam! Alhamdulillah, doing well. Any updates on the Quran study circle?',
        timestamp: new Date(Date.now() - 1800000),
      },
      {
        id: '3',
        userId: '1',
        userName: 'Ahmed Hassan',
        content:
          "Salaam! Yes, we'll have it tomorrow at 4 PM in the Islamic center.",
        timestamp: new Date(Date.now() - 900000),
      },
    ];
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.full_name,
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Community Chat"
        subtitle="Connect with fellow Muslim students"
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-280px)] md:h-[600px] flex flex-col">
        {/* Chat Header */}
        <div className="bg-gau-msa-primary text-white p-3 md:p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5" />
            <span className="font-semibold text-sm md:text-base">
              Community Chat
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs md:text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{onlineUsers} online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 md:space-x-3 ${
                message.userId === user?.id
                  ? 'flex-row-reverse space-x-reverse'
                  : ''
              }`}
            >
              <div className="flex-shrink-0">
                {message.userId === user?.id ? (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gau-msa-primary text-white flex items-center justify-center text-xs md:text-sm font-semibold">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs md:text-sm font-semibold">
                    {message.userName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div
                className={`flex flex-col ${
                  message.userId === user?.id ? 'items-end' : 'items-start'
                } max-w-[75%]`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] md:text-xs font-semibold text-gray-700">
                    {message.userName}
                  </span>
                  <span className="text-[9px] md:text-[10px] text-gray-400">
                    {message.timestamp
                      ? new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </span>
                </div>
                <div
                  className={`px-3 md:px-4 py-2 rounded-2xl text-sm ${
                    message.userId === user?.id
                      ? 'bg-gau-msa-primary text-white rounded-tr-sm'
                      : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 md:p-4 border-t border-gray-100"
        >
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 md:px-4 py-2.5 md:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm"
            />
            <button
              type="submit"
              className="bg-gau-msa-primary text-white px-3 md:px-6 py-2.5 md:py-2 rounded-lg hover:bg-gau-msa-secondary active:scale-95 transition-all flex items-center space-x-1.5"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;