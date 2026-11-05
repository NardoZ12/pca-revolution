import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  hideTextOnMobile?: boolean;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true, 
  hideTextOnMobile = false,
  onClick 
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group shrink-0 ${className}`}
    >
      {/* Official circular logo asset uploaded by user */}
      <div className={`${iconSizes[size]} relative rounded-full overflow-hidden shrink-0 shadow-lg shadow-cyan-950/50 border border-cyan-400/40 group-hover:border-cyan-300 transition-colors`}>
        <img
          src="/assets/aistudio/logo_7f87d68b.png"
          alt="Punta Cana Academy Logo"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {showText && (
        <div className={`font-extrabold tracking-tight ${textSizes[size]} leading-none ${hideTextOnMobile ? 'hidden sm:flex' : 'flex'} items-center gap-1 sm:gap-1.5 whitespace-nowrap`}>
          <span className="text-white">Punta Cana</span>
          <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">Academy</span>
        </div>
      )}
    </div>
  );
};
