import React from 'react';
import { useNavigate } from 'react-router-dom';
import gaumsaLogo from '../../assets/images/gaumsa-logo.png'; // Adjust path as needed

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  showText = true, 
  size = 'md',
  variant = 'full'
}) => {
  const navigate = useNavigate();

  const sizes = {
    sm: { 
      image: 'h-8 w-auto', 
      text: 'text-lg', 
      subtext: 'text-xs' 
    },
    md: { 
      image: 'h-15 w-auto', 
      text: 'text-xl', 
      subtext: 'text-xs' 
      
    },
    lg: { 
      image: 'h-22 w-auto', 
      text: 'text-3xl', 
      subtext: 'text-sm' 
    },
  };

  const sizeClasses = sizes[size];

  return (
    <div 
      className={`flex items-center space-x-3 cursor-pointer ${className}`}
      onClick={() => navigate('/')}
    >
      {/* Logo Image */}
      <div className="flex-shrink-0">
        <img 
          src={gaumsaLogo} 
          alt="GAUMSA Logo" 
          className={`${sizeClasses.image} object-contain`}
        />
      </div>

      {showText && variant === 'full' && (
        <div className="hidden sm:block">
          <div className={`${sizeClasses.text} font-bold text-gau-msa-primary leading-tight`}>
            GAUMSA
          </div>
          <div className={`${sizeClasses.subtext} text-gray-500 leading-tight`}>
            Garissa University Muslim Student Association
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;