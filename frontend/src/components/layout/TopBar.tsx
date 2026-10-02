import React, { useState, useEffect } from 'react';
import { Phone, Mail, Clock } from 'lucide-react';

const TopBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const isNight = () => {
    const hour = currentTime.getHours();
    return hour >= 19 || hour < 6;
  };

  return (
    <div className={`${isNight() ? 'bg-gray-900' : 'bg-gau-msa-primary'} text-white text-xs py-1.5 border-b border-gau-msa-secondary/30 transition-colors duration-500 fixed top-0 left-0 right-0 z-[100]`}>
      <div className="container-custom">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <div className="flex items-center space-x-4">
            <a 
              href="tel:+254700000000" 
              className="flex items-center space-x-1.5 hover:text-gau-msa-gold transition-colors"
            >
              <Phone className="h-3 w-3" />
              <span className="text-xs">+254 700 000 000</span>
            </a>
            <a 
              href="mailto:gaumsa@garissauniversity.ac.ke" 
              className="hidden sm:flex items-center space-x-1.5 hover:text-gau-msa-gold transition-colors"
            >
              <Mail className="h-3 w-3" />
              <span className="text-xs">Email</span>
            </a>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="h-3 w-3 text-gau-msa-gold" />
            <span className="text-xs font-mono font-semibold text-gau-msa-gold">
              {formattedTime}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-gau-msa-gold">
              {isNight() ? '🌙' : '☀️'}
            </span>
            <span className="hidden lg:inline text-gray-300">
              {isNight() ? 'Laylatun Sa\'eedah' : 'Sabahul Khair'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;