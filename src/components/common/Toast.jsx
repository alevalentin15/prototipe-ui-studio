import React from 'react';
import { Icon } from './Icon.jsx';

export const Toast = ({ mensaje }) => {
  if (!mensaje) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-2xl text-xs font-semibold z-50 animate-bounce flex items-center gap-2">
      <Icon name="zap" className="w-4 h-4" />
      <span>{mensaje}</span>
    </div>
  );
};
