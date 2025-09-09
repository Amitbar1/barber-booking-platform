import React from 'react';

interface ScissorsIconProps {
  className?: string;
  size?: number;
}

const ScissorsIcon: React.FC<ScissorsIconProps> = ({ 
  className = "w-5 h-5", 
  size = 20 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="scissorsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Left blade */}
      <path
        d="M6 6L12 12L6 18"
        stroke="url(#scissorsGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#glow)"
      />
      
      {/* Right blade */}
      <path
        d="M18 6L12 12L18 18"
        stroke="url(#scissorsGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#glow)"
      />
      
      {/* Center circle */}
      <circle
        cx="12"
        cy="12"
        r="2"
        fill="url(#scissorsGradient)"
        filter="url(#glow)"
      />
      
      {/* Decorative dots */}
      <circle
        cx="8"
        cy="8"
        r="1"
        fill="url(#scissorsGradient)"
        opacity="0.6"
      />
      <circle
        cx="16"
        cy="16"
        r="1"
        fill="url(#scissorsGradient)"
        opacity="0.6"
      />
    </svg>
  );
};

export default ScissorsIcon;
