import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader2, Sparkles } from 'lucide-react';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const AIChatBot: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Assalamu alaikum! I\'m your Islamic AI assistant. I can help you with Quranic questions, Islamic knowledge, prayer times, and more. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const responses = [
        'Masha\'Allah! That\'s a beautiful question. Let me share some insights...',
        'Alhamdulillah! Based on Islamic teachings, here\'s what we know...',
        'SubhanAllah! That\'s a profound topic. Let me reflect on it...',
        'The Prophet Muhammad (peace be upon him) said about this...',
        'In the Quran, Allah mentions this in Surah...',
        'Ibn Kathir explains this in his tafsir as...'
      ];
      
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)]
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[600px] flex flex-col">
      <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary text-white p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold flex items-center">
              Islamic AI Assistant
              <Sparkles className="h-4 w-4 ml-2 text-gau-msa-gold" />
            </h3>
            <p className="text-xs opacity-90">Powered by advanced Islamic knowledge</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`flex-shrink-0 ${
              message.role === 'assistant' 
                ? 'w-10 h-10 rounded-full bg-gau-msa-primary text-white flex items-center justify-center'
                : 'w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center'
            }`}>
              {message.role === 'assistant' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
            </div>
            <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="text-xs text-gray-500 mb-1">
                {message.role === 'assistant' ? 'AI Assistant' : 'You'}
              </div>
              <div
                className={`px-4 py-2 rounded-lg max-w-md ${
                  message.role === 'user'
                    ? 'bg-gau-msa-primary text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="animate-spin h-5 w-5" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Quran, Hadith, Islamic teachings..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gau-msa-primary"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gau-msa-primary text-white px-6 py-2 rounded-lg hover:bg-gau-msa-secondary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Ask</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChatBot;