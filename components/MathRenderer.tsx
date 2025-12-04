import React from 'react';

interface MathRendererProps {
  text: string;
  className?: string;
}

// Renamed internally to TextRenderer logic but file kept as MathRenderer.tsx for compatibility
export const MathRenderer: React.FC<MathRendererProps> = ({ text, className = '' }) => {
  if (!text) return null;

  return (
    <span className={`whitespace-pre-wrap ${className}`}>
      {text}
    </span>
  );
};