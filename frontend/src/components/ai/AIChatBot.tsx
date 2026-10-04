import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader2, Sparkles } from 'lucide-react';
import PageHeader from '../ui/PageHeader';

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
      content:
        "Assalamu alaikum! I'm your Islamic AI assistant. I can help you with Quranic questions, Islamic knowledge, prayer times, and more. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const responses = [
        "Masha'Allah! That's a beautiful question. Let me share some insights...",
        "Alhamdulillah! Based on Islamic teachings, here's what we know...",
        "SubhanAllah! That's a profound topic. Let me reflect on it...",
        'The Prophet Muhammad (peace be upon him) said about this...',
        'In the Quran, Allah mentions this in Surah...',
        'Ibn Kathir explains this in his tafsir as...',
      ];

      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="AI Assistant"
        subtitle="Ask Islamic questions and get instant answers"
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-280px)] md:h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary text-white p-3 md:p-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-sm md:text-base flex items-center">
                Islamic AI Assistant
                <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 ml-2 text-gau-msa-gold" />
              </h3>
              <p className="text-[10px] md:text-xs opacity-90">
                Powered by advanced Islamic knowledge
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 md:space-x-3 ${
                message.role === 'user'
                  ? 'flex-row-reverse space-x-reverse'
                  : ''
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                  message.role === 'assistant'
                    ? 'bg-gau-msa-primary text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {message.role === 'assistant' ? (
                  <Bot className="h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <User className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </div>
              <div
                className={`flex flex-col max-w-[80%] ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="text-[10px] md:text-xs text-gray-500 mb-1">
                  {message.role === 'assistant' ? 'AI Assistant' : 'You'}
                </div>
                <div
                  className={`px-3 md:px-4 py-2 rounded-2xl text-sm ${
                    message.role === 'user'
                      ? 'bg-gau-msa-primary text-white rounded-tr-sm'
                      : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <Loader2 className="animate-spin h-4 w-4 md:h-5 md:w-5" />
              <span>Thinking...</span>
            </div>
          )}
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Quran, Hadith, Islamic teachings..."
              className="flex-1 px-3 md:px-4 py-2.5 md:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gau-msa-primary text-white px-3 md:px-6 py-2.5 md:py-2 rounded-lg hover:bg-gau-msa-secondary active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Ask</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIChatBot;