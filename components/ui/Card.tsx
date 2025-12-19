import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 md:p-8 relative overflow-hidden group ${className}`}>
      {/* Glow Effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-lime-400/5 rounded-full blur-3xl group-hover:bg-lime-400/10 transition-all duration-700"></div>
      
      {title && (
        <h3 className="font-display text-xl font-bold text-white mb-6 uppercase tracking-wide border-l-4 border-lime-400 pl-4">
          {title}
        </h3>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};