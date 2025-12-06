'use client';

import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Circuit board background pattern */}
      <circle cx="60" cy="60" r="58" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="2"/>
      
      {/* Tech grid lines (subtle) */}
      <line x1="30" y1="30" x2="40" y2="30" stroke="#93C5FD" strokeWidth="1" opacity="0.3"/>
      <line x1="80" y1="35" x2="90" y2="35" stroke="#93C5FD" strokeWidth="1" opacity="0.3"/>
      <line x1="25" y1="85" x2="35" y2="85" stroke="#93C5FD" strokeWidth="1" opacity="0.3"/>
      <circle cx="32" cy="32" r="2" fill="#93C5FD" opacity="0.4"/>
      <circle cx="88" cy="38" r="2" fill="#93C5FD" opacity="0.4"/>
      
      {/* Main bunny head */}
      <ellipse cx="60" cy="65" rx="22" ry="25" fill="#2563EB"/>
      
      {/* Left ear */}
      <ellipse cx="50" cy="35" rx="8" ry="22" fill="#2563EB" transform="rotate(-15 50 35)"/>
      <ellipse cx="50" cy="38" rx="4" ry="16" fill="#3B82F6" transform="rotate(-15 50 38)"/>
      
      {/* Right ear */}
      <ellipse cx="70" cy="35" rx="8" ry="22" fill="#2563EB" transform="rotate(15 70 35)"/>
      <ellipse cx="70" cy="38" rx="4" ry="16" fill="#3B82F6" transform="rotate(15 70 38)"/>
      
      {/* Eyes (tech vibes - like screens/monitors) */}
      <rect x="51" y="60" width="6" height="8" rx="1" fill="#60A5FA" opacity="0.9"/>
      <rect x="63" y="60" width="6" height="8" rx="1" fill="#60A5FA" opacity="0.9"/>
      
      {/* Eye shine (screen reflection) */}
      <rect x="52" y="61" width="2" height="3" rx="0.5" fill="#DBEAFE"/>
      <rect x="64" y="61" width="2" height="3" rx="0.5" fill="#DBEAFE"/>
      
      {/* Nose (like a power button) */}
      <circle cx="60" cy="72" r="3" fill="#1E40AF"/>
      <circle cx="60" cy="72" r="1.5" fill="#60A5FA"/>
      
      {/* Cloud elements (infrastructure theme) */}
      <g opacity="0.6">
        {/* Small cloud top-left */}
        <ellipse cx="20" cy="25" rx="8" ry="5" fill="#93C5FD"/>
        <ellipse cx="16" cy="25" rx="5" ry="4" fill="#93C5FD"/>
        <ellipse cx="24" cy="25" rx="5" ry="4" fill="#93C5FD"/>
        
        {/* Small cloud top-right */}
        <ellipse cx="100" cy="30" rx="7" ry="4" fill="#93C5FD"/>
        <ellipse cx="96" cy="30" rx="4" ry="3" fill="#93C5FD"/>
        <ellipse cx="104" cy="30" rx="4" ry="3" fill="#93C5FD"/>
      </g>
      
      {/* Connection nodes (infrastructure network) */}
      <circle cx="45" cy="90" r="3" fill="#3B82F6" opacity="0.5"/>
      <circle cx="75" cy="90" r="3" fill="#3B82F6" opacity="0.5"/>
      <line x1="45" y1="90" x2="60" y2="88" stroke="#3B82F6" strokeWidth="1.5" opacity="0.3"/>
      <line x1="75" y1="90" x2="60" y2="88" stroke="#3B82F6" strokeWidth="1.5" opacity="0.3"/>
    </svg>
  );
}

